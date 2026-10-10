// Eine einzige requestAnimationFrame-Schleife für die ganze Seite (PLAN-V2 2.5, 4.3).
//
// - dt = min(0,05 s, Abstand zum letzten Bild), Pause bei document.hidden.
// - Szenen registrieren sich im useEffect ihrer Komponente (register) und melden sich beim Abbau ab.
// - Die Intro-Bühne hängt sich als Bild-Abonnent ein (onFrame), sie hat mehrere Ebenen.
// - Jede sichtbare Szene bekommt jedes Bild (frame). Simulationen laufen über s.step mit festem Schritt.
// - Zeiger kommen in Szenenkoordinaten an. Die Listener hängen an der ganzen Szenenfläche.
//
// Eine Szene mit eigenen Feldern am Zustand `s` erweitert SceneState und gibt das Interface an register:
//
//   interface TiefeState extends SceneState {
//   	dp: number; // eigene Felder: in init(s) setzen, nicht im Literal von register
//   	pv?: { a: number }; // Felder, die resize (läuft schon beim Anmelden, vor init) liest, optional halten
//   }
//   register<TiefeState>({ el, init(s) { s.dp = 0; }, frame(s, t, dt) { s.dp += dt; } });
//
// register legt s nur mit den Feldern von SceneState an. Eigene Felder existieren erst, wenn init sie setzt
// (init läuft vor dem ersten frame, resize davor).

import {
	type Fit,
	dprFor,
	fitBox,
	full,
	observe,
	pointerIn,
	qual,
	regung,
	scene,
	sizeBacking,
} from './canvas';

/** Seitenmodus: Hochformat oder Querformat. */
export type Modus = 'hoch' | 'quer';

/** Bild-Abonnent der Schleife: (t, dt, now, raw). */
export type BildFn = (t: number, dt: number, now: number, raw: number) => void;

interface Loop {
	n: number;
	fv: number;
	t: number;
	dt: number;
	raw: number;
	now: number;
	reduced: boolean;
	mode: Modus;
	flach: boolean;
	act: number;
}

export const loop: Loop = {
	n: 0, // Bildzähler seit dem Start, beginnt bei 1
	fv: 0, // Schrift-Version, zählt hoch, wenn Schriften fertig geladen sind (Text-Raster neu aufbauen)
	t: 0, // Sekunden seit dem Start
	dt: 0.016, // auf 0,05 s begrenzter Abstand
	raw: 0.016, // ungekürzter Abstand (Ruckler erkennen)
	now: 0, // performance.now() in Sekunden
	reduced: false,
	mode: 'quer', // 'hoch' | 'quer'
	flach: false, // Handy quer
	act: 0, // letzte Eingabe oder Bewegung (Sekunden, performance.now()): Scroll, Zeiger, Taste, Größenänderung
};

/** Messhaken der Szenen für landing-konzept/werkzeuge/qa (nur lesend), hängt an window.__landing.dbg. */
export const qa: Record<string, unknown> = {};

/** Zeigerzustand einer Szene (Szenenkoordinaten x, y; CSS-Pixel px, py). */
export interface SceneZeiger {
	x: number;
	y: number;
	px: number;
	py: number;
	in: boolean;
	down: boolean;
	type: string;
}

/** Zustand `s`, den register für jede Szene anlegt und allen Rückrufen übergibt. */
export interface SceneState extends Fit {
	el: HTMLElement;
	host: HTMLElement;
	cv: HTMLCanvasElement | null;
	ctx: CanvasRenderingContext2D | null;
	W: number;
	H: number;
	safeH: number;
	dpr: number;
	bw: number;
	bh: number;
	mode: Modus;
	reduced: boolean;
	visible: boolean;
	/** Backing neu gesetzt: Szenen, die im Stand nicht zeichnen, müssen einmal neu zeichnen. */
	stale: boolean;
	/** Pufferspeicher freigegeben (weit außer Sicht). */
	frei: boolean;
	/** Akkumulator von step. */
	acc: number;
	m: SceneZeiger;
	/** Transform für vollflächige Hintergründe (CSS-Pixel). */
	full(): void;
	/** Transform für die Komposition im Szenenraum. */
	scene(): void;
	/** Fester Schritt h mit Akkumulator, höchstens 4 Schritte je Bild. Gibt die Zahl der Schritte zurück. */
	step(dt: number, h: number, fn: () => void): number;
}

/** Bezugsbox der Komposition. */
export interface Box {
	bw: number;
	bh: number;
	align?: 'top' | 'bottom' | undefined;
	max?: number | undefined;
}

/** Anmeldung einer Szene (siehe register). Die Rückrufe sind Methoden, damit SceneDef<S> auch als SceneDef<SceneState> gilt. */
export interface SceneDef<S extends SceneState = SceneState> {
	name?: string | undefined;
	el: HTMLElement;
	host?: HTMLElement | undefined;
	box?(W: number, H: number, safeH: number, mode: Modus): Box;
	dprCap?: number | undefined;
	touchCap?: number | undefined;
	minSicht?: number | undefined;
	init?(s: S): void;
	frame?(s: S, t: number, dt: number): void;
	/**
	 * Vorwärmen in Schritten: wird kurz vor dem Eintritt je Bild einmal gerufen (höchstens eine Szene je Bild),
	 * bis es true meldet. Ohne warm zeichnet die Szene stattdessen einmal unsichtbar (frame).
	 */
	warm?(s: S): boolean;
	resize?(s: S): void;
	ownsTouch?(s: S, e: TouchEvent): boolean;
	onDown?(s: S): void;
	onMove?(s: S): void;
	onUp?(s: S, e: PointerEvent): void;
	destroy?(s: S): void;
}

interface Anmeldung<S extends SceneState = SceneState> {
	s: S;
	def: SceneDef<S>;
	host: HTMLElement;
	inited: boolean;
	fern: number;
	/** Einmal vor dem Eintritt unsichtbar gezeichnet (Aufbau der Puffer, Raster, Shader), bis die nächste Messung kommt. */
	warm: boolean;
}

const scenes = new Set<Anmeldung>();
const subs = new Set<BildFn>();
const vorn = new Set<BildFn>(); // vor den anderen Abonnenten und den Szenen (Lenis setzt hier die Scrollposition)
let raf = 0;
let last = 0;
let t0 = 0;
let started = false;
let hooked = false;
let lastDpr = 1;
let lastSy = 0;
let visHook: (() => void) | null = null;
let abmeldeMq: (() => void) | null = null;
let abmeldeFonts: (() => void) | null = null;

// Ruhephasen (Szenen ohne Eingabe und ohne Scrollbewegung): Bildrate auf 60 Hz begrenzt, bei reduzierter
// Bewegung nach einer Sekunde ganz still, bis wieder etwas passiert.
const RUHE = 0.3;
const RUHE_REDUZIERT = 1;
const MIN_ABSTAND = 0.0105; // unter 10,5 ms (Anzeigen über 95 Hz) wird im Stand jedes zweite Bild ausgelassen
const FREI_NACH = 2; // Sekunden außer Sicht, bis der Pufferspeicher einer Szene freigegeben wird
const WARM_ABSTAND = 2.2; // Fensterhöhen vor dem Eintritt, ab denen eine Szene einmal unsichtbar vorgewärmt wird
let warmFrei = true; // höchstens eine Szene je Bild wärmt vor (der Aufbau einer Szene kann 20 bis 40 ms kosten)
const wach = () => {
	loop.act = performance.now() / 1000;
};
regung.fn = wach;

/** Modus aus der Fenstergröße (gleiche Regel wie die Medienabfragen in landing.css). */
export function modeOf(W: number, H: number): { mode: Modus; flach: boolean } {
	const hoch = W / H <= 1 || W < 700;
	return { mode: hoch ? 'hoch' : 'quer', flach: !hoch && H < 500 };
}

const gemeldet = new Set<string>();
function report(where: string, err: unknown) {
	if (gemeldet.has(where)) return;
	gemeldet.add(where);
	console.error(where, err);
}

function measure(r: Anmeldung, W: number, H: number) {
	const { s, def } = r;
	s.W = W;
	s.H = H;
	s.safeH = H;
	s.mode = loop.mode;
	s.dpr = dprFor(def.dprCap ?? 2, def.touchCap ?? def.dprCap ?? 2, W, H);
	wach();
	s.stale = true; // Backing neu gesetzt: Szenen, die im Stand nicht zeichnen, müssen einmal neu zeichnen
	s.frei = false;
	r.warm = false;
	const b: Box = def.box ? def.box(W, H, s.safeH, s.mode) : { bw: 1280, bh: 800 };
	const fit = fitBox(W, s.safeH, b.bw, b.bh, b.max);
	s.bw = b.bw;
	s.bh = b.bh;
	s.f = fit.f;
	s.ox = fit.ox;
	s.oy = b.align === 'top' ? 0 : b.align === 'bottom' ? s.safeH - b.bh * fit.f : fit.oy;
	if (s.cv) sizeBacking(s.cv, W, H, s.dpr);
	def.resize?.(s);
}

function frameScene(r: Anmeldung, t: number, dt: number) {
	const { s, def } = r;
	if (
		s.cv &&
		!s.frei &&
		s.dpr !== dprFor(def.dprCap ?? 2, def.touchCap ?? def.dprCap ?? 2, s.W, s.H)
	)
		measure(r, s.el.clientWidth, s.el.clientHeight);
	const rc = s.el.getBoundingClientRect();
	// Weit weg (mehr als eine Fensterhöhe): nach FREI_NACH Sekunden Pufferspeicher freigeben, bei Annäherung neu messen
	if (s.cv) {
		const fern = rc.bottom < -innerHeight || rc.top > 2 * innerHeight;
		if (!fern) {
			r.fern = 0;
			if (s.frei) measure(r, s.el.clientWidth, s.el.clientHeight);
		} else if (!s.frei) {
			if (!r.fern) r.fern = loop.now;
			if (r.fern && loop.now - r.fern > FREI_NACH) {
				s.frei = true;
				sizeBacking(s.cv, 1, 1, 1);
			}
		}
	}
	// minSicht: Anteil der Fensterhöhe, ab dem eine große Fläche überhaupt gezeichnet wird (ein 50-px-Streifen
	// einer 4-MP-Fläche kostet sonst das ganze Bild)
	const sicht = Math.min(rc.bottom, innerHeight) - Math.max(rc.top, 0);
	s.visible =
		!(
			rc.bottom < 0 ||
			rc.top > innerHeight ||
			rc.right < 0 ||
			rc.left > innerWidth ||
			rc.width < 2
		) && sicht >= (def.minSicht ?? 0) * innerHeight;
	// Vorwärmen: kurz vor dem Eintritt unsichtbar aufbauen, damit der erste sichtbare Frame nicht den ganzen Aufbau
	// trägt (Wortbild der Tiefe, Zeichenblatt und Raster der Sonne). Nicht in den ersten Sekunden.
	if (
		!s.visible &&
		!r.warm &&
		warmFrei &&
		loop.n > 120 &&
		rc.top < WARM_ABSTAND * innerHeight &&
		rc.bottom > 0
	) {
		warmFrei = false;
		s.reduced = loop.reduced;
		starte(r);
		if (def.warm) r.warm = def.warm(s);
		else {
			r.warm = true;
			def.frame?.(s, t, dt);
		}
		return;
	}
	if (!s.visible) return;
	s.reduced = loop.reduced;
	starte(r);
	def.frame?.(s, t, dt);
}

function starte(r: Anmeldung) {
	if (r.inited) return;
	r.inited = true;
	r.def.init?.(r.s);
}

// Auflösungsstufe nach Bildzeit: Liegt der Median zweier Fenster zu je 45 Bildern über 22 ms (unter 45 Bilder/s),
// sinkt der Pixelfaktor aller Canvas um eine Stufe (dprFor). Erholt wird nicht, sonst pendelte die Schärfe.
const STUFEN = [1, 0.8, 0.65, 0.5];
const qb: number[] = [];
let qi = 0;
let qSchlecht = 0;
function qualitaet(raw: number) {
	if (raw > 0.25 || loop.n < 90) return;
	qb.push(raw);
	if (qb.length < 45) return;
	qb.sort((a, b) => a - b);
	qSchlecht = (qb[22] ?? 0) > 0.022 ? qSchlecht + 1 : 0;
	qb.length = 0;
	if (qSchlecht >= 2 && qi < STUFEN.length - 1) {
		qual.f = STUFEN[++qi] ?? qual.f;
		qSchlecht = 0;
		refresh();
	}
}

function tick() {
	raf = requestAnimationFrame(tick);
	if (document.hidden) {
		last = 0;
		return;
	}
	const now = performance.now() / 1000;
	const sy = window.scrollY;
	if (sy !== lastSy) {
		lastSy = sy;
		loop.act = now;
	}
	const ruhe = now - loop.act;
	// Reduzierte Bewegung: im Stand nicht zeichnen (die ersten 2 s nach dem Start laufen immer)
	if (loop.reduced && ruhe > RUHE_REDUZIERT && loop.n > 120) {
		last = 0;
		return;
	}
	const raw = last ? now - last : 0.016;
	if (ruhe > RUHE && raw < MIN_ABSTAND) return;
	last = now;
	loop.n++;
	loop.raw = raw;
	loop.dt = Math.min(0.05, raw);
	loop.now = now;
	loop.t = now - t0;
	if (!loop.reduced) qualitaet(raw);
	if (window.devicePixelRatio !== lastDpr) {
		lastDpr = window.devicePixelRatio;
		refresh();
	}
	for (const fn of vorn) {
		try {
			fn(loop.t, loop.dt, now, raw);
		} catch (e) {
			report('vorn', e);
		}
	}
	for (const fn of subs) {
		try {
			fn(loop.t, loop.dt, now, raw);
		} catch (e) {
			report('bühne', e);
		}
	}
	warmFrei = true;
	for (const r of scenes) {
		try {
			frameScene(r, loop.t, loop.dt);
		} catch (e) {
			report(`szene ${r.def.name ?? ''}`, e);
		}
	}
}

// Greift ein Zeigerereignis ab, dessen Geste einer Szene gehört (Körper greifen, Planet ziehen).
// Die Szene entscheidet bei pointerdown, das kommt vor touchstart.
function onTouchStart(e: TouchEvent) {
	for (const r of scenes) {
		if (r.def.ownsTouch && r.host.contains(e.target as Node | null) && r.def.ownsTouch(r.s, e)) {
			e.preventDefault();
			return;
		}
	}
}

function onUp(e: PointerEvent) {
	for (const r of scenes) {
		const { s, def } = r;
		if (s.m.down) {
			s.m.down = false;
			def.onUp?.(s, e);
		}
	}
}

function hook() {
	if (hooked) return;
	hooked = true;
	window.addEventListener('pointerup', onUp);
	window.addEventListener('pointercancel', onUp);
	document.addEventListener('touchstart', onTouchStart, { passive: false, capture: true });
	for (const ev of [
		'pointermove',
		'pointerdown',
		'pointerup',
		'keydown',
		'wheel',
		'resize',
		'touchmove',
	])
		window.addEventListener(ev, wach, { passive: true });
}

/** Alle Szenen neu messen (Modus- oder Pixelfaktor-Wechsel). */
export function refresh() {
	for (const r of scenes) measure(r, r.s.el.clientWidth, r.s.el.clientHeight);
}

/** Modus setzen und Szenen darüber informieren. */
export function setMode(mode: Modus, flach: boolean) {
	if (loop.mode === mode && loop.flach === flach) return;
	loop.mode = mode;
	loop.flach = flach;
	refresh();
}

/**
 * Bild-Abonnent (Intro-Bühne). fn(t, dt, now, raw). Gibt die Abmeldung zurück.
 * zuerst: läuft vor allen anderen Abonnenten und Szenen im selben Bild.
 */
export function onFrame(fn: BildFn, zuerst = false): () => void {
	const set = zuerst ? vorn : subs;
	set.add(fn);
	return () => set.delete(fn);
}

/**
 * Szene anmelden (PLAN-V2 4.3).
 *   el      Element der Szene (meist ein Canvas), seine CSS-Box ist die Szenenfläche
 *   host    Element für die Zeiger-Listener (Standard: Elternelement)
 *   box     (W, H, safeH, mode) -> { bw, bh, align?, max? }, Bezugsbox der Komposition
 *   dprCap  Deckel des Pixelfaktors (Standard 2), touchCap: Deckel auf Touch-Geräten
 *   init, frame, resize, ownsTouch, onDown, onMove, onUp
 * Gibt die Abmeldung zurück.
 */
export function register<S extends SceneState>(def: SceneDef<S>): () => void {
	hook();
	const el = def.el;
	const host = def.host ?? el.parentElement ?? el;
	const isCanvas = typeof HTMLCanvasElement !== 'undefined' && el instanceof HTMLCanvasElement;
	// Der Zustand startet nur mit den Feldern von SceneState, eigene Felder von S setzt die Szene in init.
	const s = {
		el,
		host,
		cv: isCanvas ? el : null,
		ctx: isCanvas ? el.getContext('2d') : null,
		W: 0,
		H: 0,
		safeH: 0,
		dpr: 1,
		f: 1,
		ox: 0,
		oy: 0,
		bw: 1280,
		bh: 800,
		mode: loop.mode,
		reduced: loop.reduced,
		visible: false,
		stale: false,
		frei: false,
		acc: 0,
		m: { x: -999, y: -999, px: -999, py: -999, in: false, down: false, type: 'mouse' },
		full() {
			if (this.ctx) full(this.ctx, this.dpr);
		},
		scene() {
			if (this.ctx) scene(this.ctx, this.dpr, this);
		},
		// Fester Schritt h mit Akkumulator, höchstens 4 Schritte je Bild.
		step(dt, h, fn) {
			this.acc = (this.acc || 0) + dt;
			let n = 0;
			while (this.acc >= h - 1e-9 && n < 4) {
				fn();
				this.acc -= h;
				n++;
			}
			if (n === 4) this.acc = 0;
			return n;
		},
	} as S;
	const r: Anmeldung<S> = { s, def, host, inited: false, fern: 0, warm: false };
	const stopObserve = observe(el, (W, H) => measure(r, W, H));
	const setM = (e: PointerEvent) => {
		const p = pointerIn(e, el.getBoundingClientRect(), s);
		s.m.x = p.x;
		s.m.y = p.y;
		s.m.px = p.px;
		s.m.py = p.py;
		s.m.type = e.pointerType || 'mouse';
	};
	const mv = (e: PointerEvent) => {
		setM(e);
		s.m.in = true;
		def.onMove?.(s);
	};
	const lv = () => {
		s.m.in = false;
		s.m.down = false;
	};
	const dn = (e: PointerEvent) => {
		setM(e);
		s.m.in = true;
		s.m.down = true;
		def.onDown?.(s);
	};
	host.addEventListener('pointermove', mv);
	host.addEventListener('pointerleave', lv);
	host.addEventListener('pointerdown', dn);
	scenes.add(r);
	return () => {
		scenes.delete(r);
		stopObserve();
		host.removeEventListener('pointermove', mv);
		host.removeEventListener('pointerleave', lv);
		host.removeEventListener('pointerdown', dn);
		def.destroy?.(s);
	};
}

/** Schleife starten. Gibt die Abmeldung zurück. */
export function start(): () => void {
	if (started) return stop;
	started = true;
	const mqR = matchMedia('(prefers-reduced-motion: reduce)');
	loop.reduced = mqR.matches;
	const onReduced = (e: MediaQueryListEvent) => {
		loop.reduced = e.matches;
	};
	mqR.addEventListener('change', onReduced);
	lastDpr = window.devicePixelRatio;
	const onFonts = () => {
		loop.fv++;
		wach();
	};
	document.fonts?.ready.then(onFonts);
	document.fonts?.addEventListener?.('loadingdone', onFonts);
	abmeldeFonts = () => document.fonts?.removeEventListener?.('loadingdone', onFonts);
	t0 = performance.now() / 1000;
	loop.act = t0 + 2.5; // die ersten Sekunden (Aufbau des Zeichens) laufen mit voller Bildrate
	last = 0;
	loop.n = 0;
	raf = requestAnimationFrame(tick);
	// Im Hintergrund ganz anhalten (kein Wecken je Bild), beim Zurückkehren neu starten
	visHook = () => {
		cancelAnimationFrame(raf);
		if (!document.hidden && started) {
			last = 0;
			wach();
			raf = requestAnimationFrame(tick);
		}
	};
	document.addEventListener('visibilitychange', visHook);
	abmeldeMq = () => mqR.removeEventListener('change', onReduced);
	return stop;
}

export function stop(): void {
	cancelAnimationFrame(raf);
	if (visHook) document.removeEventListener('visibilitychange', visHook);
	started = false;
	abmeldeMq?.();
	abmeldeFonts?.();
}
