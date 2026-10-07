// Eine einzige requestAnimationFrame-Schleife für die ganze Seite (PLAN-V2 2.5, 4.3).
//
// - dt = min(0,05 s, Abstand zum letzten Bild), Pause bei document.hidden.
// - Szenen registrieren sich im useEffect ihrer Komponente (register) und melden sich beim Abbau ab.
// - Die Intro-Bühne hängt sich als Bild-Abonnent ein (onFrame), sie hat mehrere Ebenen.
// - Jede sichtbare Szene bekommt jedes Bild (frame). Simulationen laufen über s.step mit festem Schritt.
// - Zeiger kommen in Szenenkoordinaten an. Die Listener hängen an der ganzen Szenenfläche.

import { dprFor, fitBox, full, observe, pointerIn, scene, sizeBacking } from './canvas';

export const loop = {
	n: 0, // Bildzähler seit dem Start, beginnt bei 1
	fv: 0, // Schrift-Version, zählt hoch, wenn Schriften fertig geladen sind (Text-Raster neu aufbauen)
	t: 0, // Sekunden seit dem Start
	dt: 0.016, // auf 0,05 s begrenzter Abstand
	raw: 0.016, // ungekürzter Abstand (Ruckler erkennen)
	now: 0, // performance.now() in Sekunden
	reduced: false,
	mode: 'quer', // 'hoch' | 'quer'
	flach: false, // Handy quer
	art: false, // Entwurfstakt der Art-Szenen (Schritt 1 bis 3, entfällt mit F-06): jedes zweite 16-ms-Bild
	allow: new Set(), // Szenen-Plätze, die in diesem Takt zeichnen dürfen (Budget 4, rotierender Start)
};

/** Darf die Szene mit diesem Platz (0..7) in diesem Takt zeichnen? Nachbildung des Entwurfstakts für das Regressions-Gate. */
export function takt(slot) {
	return loop.art && loop.allow.has(slot);
}

const scenes = new Set();
const subs = new Set();
let raf = 0;
let last = 0;
let t0 = 0;
let started = false;
let hooked = false;
let lastDpr = 1;

/** Modus aus der Fenstergröße (gleiche Regel wie die Medienabfragen in landing.css). */
export function modeOf(W, H) {
	const hoch = W / H <= 1 || W < 700;
	return { mode: hoch ? 'hoch' : 'quer', flach: !hoch && H < 500 };
}

function report(where, err) {
	if (report[where]) return;
	report[where] = 1;
	console.error(where, err);
}

function measure(r, W, H) {
	const { s, def } = r;
	s.W = W;
	s.H = H;
	s.safeH = H;
	s.mode = loop.mode;
	s.dpr = dprFor(def.dprCap ?? 2, def.touchCap ?? def.dprCap ?? 2);
	const b = def.box ? def.box(W, H, s.safeH, s.mode) : { bw: 1280, bh: 800 };
	const fit = fitBox(W, s.safeH, b.bw, b.bh, b.max);
	s.bw = b.bw;
	s.bh = b.bh;
	s.f = fit.f;
	s.ox = fit.ox;
	s.oy = b.align === 'top' ? 0 : b.align === 'bottom' ? s.safeH - b.bh * fit.f : fit.oy;
	if (s.cv) sizeBacking(s.cv, W, H, s.dpr);
	def.resize?.(s);
}

function seen(r) {
	const rc = r.s.el.getBoundingClientRect();
	return !(
		rc.bottom < 0 ||
		rc.top > innerHeight ||
		rc.right < 0 ||
		rc.left > innerWidth ||
		rc.width < 2
	);
}

function frameScene(r, t, dt) {
	const { s, def } = r;
	if (s.cv && s.dpr !== dprFor(def.dprCap ?? 2, def.touchCap ?? def.dprCap ?? 2))
		measure(r, s.el.clientWidth, s.el.clientHeight);
	s.visible = seen(r);
	if (!s.visible) return;
	s.reduced = loop.reduced;
	if (!r.inited) {
		r.inited = true;
		def.init?.(s);
	}
	def.frame?.(s, t, dt);
}

function tick() {
	raf = requestAnimationFrame(tick);
	if (document.hidden) {
		last = 0;
		return;
	}
	const now = performance.now() / 1000;
	const raw = last ? now - last : 0.016;
	last = now;
	loop.n++;
	loop.raw = raw;
	loop.dt = Math.min(0.05, raw);
	loop.now = now;
	// Entwurfstakt: gerade Bildnummer (gezählt in 16-ms-Schritten ab dem ersten Bild des Entwurfs), höchstens
	// vier sichtbare Szenen je Takt, der Start im Platz-Ring rotiert. Platz 7 ist das Sternenfeld der Intro.
	const fa = Math.round((now * 1000) / 16) - 63;
	loop.art = fa > 0 && fa % 2 === 0;
	loop.allow.clear();
	if (loop.art) {
		const vis = new Array(8).fill(false);
		vis[7] = true;
		for (const r of scenes) if (r.def.slot !== undefined) vis[r.def.slot] = seen(r);
		let bud = 4;
		const st0 = (fa * 3) % 8;
		for (let k = 0; k < 8 && bud > 0; k++) {
			const j = (st0 + k) % 8;
			if (vis[j]) {
				loop.allow.add(j);
				bud--;
			}
		}
	}
	loop.t = now - t0;
	if (window.devicePixelRatio !== lastDpr) {
		lastDpr = window.devicePixelRatio;
		refresh();
	}
	for (const fn of subs) {
		try {
			fn(loop.t, loop.dt, now, raw);
		} catch (e) {
			report('bühne', e);
		}
	}
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
function onTouchStart(e) {
	for (const r of scenes) {
		if (r.def.ownsTouch && r.host.contains(e.target) && r.def.ownsTouch(r.s, e)) {
			e.preventDefault();
			return;
		}
	}
}

function onUp() {
	for (const r of scenes) {
		const { s, def } = r;
		if (s.m.down) {
			s.m.down = false;
			def.onUp?.(s);
		}
	}
}

function hook() {
	if (hooked) return;
	hooked = true;
	window.addEventListener('pointerup', onUp);
	window.addEventListener('pointercancel', onUp);
	document.addEventListener('touchstart', onTouchStart, { passive: false, capture: true });
}

/** Alle Szenen neu messen (Modus- oder Pixelfaktor-Wechsel). */
export function refresh() {
	for (const r of scenes) measure(r, r.s.el.clientWidth, r.s.el.clientHeight);
}

/** Modus setzen und Szenen darüber informieren. */
export function setMode(mode, flach) {
	if (loop.mode === mode && loop.flach === flach) return;
	loop.mode = mode;
	loop.flach = flach;
	refresh();
}

/** Bild-Abonnent (Intro-Bühne). fn(t, dt, now, raw). Gibt die Abmeldung zurück. */
export function onFrame(fn) {
	subs.add(fn);
	return () => subs.delete(fn);
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
export function register(def) {
	hook();
	const el = def.el;
	const host = def.host ?? el.parentElement ?? el;
	const isCanvas = typeof HTMLCanvasElement !== 'undefined' && el instanceof HTMLCanvasElement;
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
		m: { x: -999, y: -999, px: -999, py: -999, in: false, down: false, type: 'mouse' },
		full() {
			full(this.ctx, this.dpr);
		},
		scene() {
			scene(this.ctx, this.dpr, this);
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
	};
	const r = { s, def, host, inited: false };
	const stopObserve = observe(el, (W, H) => measure(r, W, H));
	const setM = (e) => {
		const p = pointerIn(e, el.getBoundingClientRect(), s);
		s.m.x = p.x;
		s.m.y = p.y;
		s.m.px = p.px;
		s.m.py = p.py;
		s.m.type = e.pointerType || 'mouse';
	};
	const mv = (e) => {
		setM(e);
		s.m.in = true;
		def.onMove?.(s);
	};
	const lv = () => {
		s.m.in = false;
		s.m.down = false;
	};
	const dn = (e) => {
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
export function start() {
	if (started) return stop;
	started = true;
	const mqR = matchMedia('(prefers-reduced-motion: reduce)');
	loop.reduced = mqR.matches;
	const onReduced = (e) => {
		loop.reduced = e.matches;
	};
	mqR.addEventListener('change', onReduced);
	lastDpr = window.devicePixelRatio;
	const onFonts = () => {
		loop.fv++;
	};
	document.fonts?.ready.then(onFonts);
	document.fonts?.addEventListener?.('loadingdone', onFonts);
	stop.fonts = () => document.fonts?.removeEventListener?.('loadingdone', onFonts);
	t0 = performance.now() / 1000;
	last = 0;
	loop.n = 0;
	raf = requestAnimationFrame(tick);
	stop.mq = () => mqR.removeEventListener('change', onReduced);
	return stop;
}

export function stop() {
	cancelAnimationFrame(raf);
	started = false;
	stop.mq?.();
	stop.fonts?.();
}
