// Die Intro-Bühne: eine Sticky-Fläche in voller Fenstergröße, auf der Berg, Zeichen, Organ, Flut,
// Wohnung und die Ende-Szene nacheinander laufen (PLAN-V2 2.4 und 4.1).
//
// stage.ts liest je Bild die Scroll-Strecke s, macht daraus den Fortschritt P (zeitachse.ts), setzt die
// CSS-Variablen und data-phase an #final und ruft die Teilrenderer auf. Die Variablen werden JEDES
// Bild gesetzt, auch wenn nichts gezeichnet wird, damit nach Sprüngen nichts stehen bleibt.

import { type Fit, dprFor, fitBox, isTouch, observe, sizeBacking } from '../../core/canvas';
import { loop, onFrame } from '../../core/loop';
import { cl, ss } from '../../core/math';
import { camera } from '../end/camera';
import * as hand from '../end/hand';
import * as flat from './flat';
import { preloadFlat } from './flat-gl';
import { createHero } from './hero';
import { drawStars } from './stars';
import { unwarp, warp } from './timeline';
import type { HeroMarks, Hole, StageContext, StagePointer } from './types';

/** Phase der Bühne (data-phase an #final): Intro, Ende-Ebene oder vorbeigescrollt. */
type Phase = 'intro' | 'ende' | 'nach';

/** Zustand der Bühne (für QA-Haken und Landing). */
export interface StageState {
	/** Geglätteter Fortschritt. */
	sp: number;
	init: boolean;
	/** Beginn des Aufbaus des Zeichens. */
	a0: number | null;
	/** Geglätteter Zeiger (-1..1). */
	sm: [number, number];
	/** Adaptive Auflösung des Szenenpuffers. */
	ad: number;
	/** Letzte 15 Bilddauern. */
	rb: number[];
	ready: boolean;
	endOn: boolean;
	handsLoaded: boolean;
	/** Zeitgeglättete Deckkraft der Raumkarten. */
	kv: number[];
	P: number;
	s: number;
	phase: Phase;
	/** Zeitpunkt, seit dem die Bühne ganz aus dem Bild ist (null: sichtbar). */
	goneSince: number | null;
	/** Pufferspeicher der Ebenen freigegeben. */
	released: boolean;
}

/** Die laufende Bühne. */
export interface Stage {
	state: StageState;
	/** y-Position im Dokument für den Fortschritt P (QA). */
	yForP: (P: number) => number;
	destroy: () => void;
}

/** Die laufende Bühne (für QA-Haken und Landing). */
export const live: { stage: Stage | null } = { stage: null };

/** Der Klick aus der App im Handy (Phone.tsx) trägt direkt = true. */
type StagePointerEvent = PointerEvent & { direct?: boolean };

function required<T>(el: T | null, name: string): T {
	if (!el) throw new Error(`stage: ${name} fehlt`);
	return el;
}

export function createStage({
	sec,
	stageEl,
	rooms,
	people,
}: {
	sec: HTMLElement;
	stageEl: HTMLElement;
	/** Mono labels of the rooms in the floor plan, in the order of wohnung.ts. */
	rooms: readonly string[];
	/** Names of the flatmates walking through the plan. */
	people: readonly string[];
}): Stage {
	const root = required(stageEl.closest<HTMLElement>('#final'), '#final');
	const q = (k: string) => stageEl.querySelector<HTMLCanvasElement>(`[data-intro="${k}"]`);
	const cvHero = required(q('hero'), 'hero');
	const cvFlat = required(q('wohnung'), 'wohnung');
	const safe = required(stageEl.querySelector<HTMLElement>('[data-safe]'), '[data-safe]');
	const cvStars = stageEl.querySelector<HTMLCanvasElement>('canvas[data-sterne]');
	const hb = stageEl.querySelector<HTMLCanvasElement>('[data-hand="back"]');
	const hf = stageEl.querySelector<HTMLCanvasElement>('[data-hand="front"]');
	const ctas = [...stageEl.querySelectorAll<HTMLElement>('[data-cta]')];
	const header = root.querySelector<HTMLElement>('[data-kopf]');
	const headerCta = header?.querySelector<HTMLElement>('[data-loch="cta"]');
	const endTitle = stageEl.querySelector<HTMLElement>('[data-ende-titel]');
	const introOnly = [...root.querySelectorAll<HTMLElement>('[data-nur-intro]')];
	const hints = root.querySelector<HTMLElement>('[data-hinweise]');
	const endEl = stageEl.querySelector<HTMLElement>('[data-ende]');
	const roomsEl = stageEl.querySelector<HTMLElement>('[data-loch="text"]');
	const hero = createHero(cvHero);

	let W = stageEl.clientWidth;
	let H = stageEl.clientHeight;
	// Scroll-Strecke der Bühne: Abschnittshöhe minus Bühne (bei reduzierter Bewegung kürzer, landing.css)
	const travel = () => Math.max(1, sec.offsetHeight - H);
	let safeH = safe.clientHeight;
	let dpr = dprFor(2, 1.5, W, H);
	let fit: Fit = fitBox(W, safeH, 1280, 800, 1.25);
	let cam: Fit = camera(W, H, safeH, loop.mode);
	let holes: Hole[] = [];

	// Zustand der Bühne
	const st: StageState = {
		sp: 0, // geglätteter Fortschritt
		init: false,
		a0: null, // Beginn des Aufbaus des Zeichens
		sm: [0.3, 0.1], // geglätteter Zeiger (-1..1)
		ad: 1, // adaptive Auflösung des Szenenpuffers
		rb: [], // letzte 15 Bilddauern
		ready: false,
		endOn: false,
		handsLoaded: false,
		kv: [0, 0, 0, 0], // zeitgeglättete Deckkraft der Raumkarten
		P: 0,
		s: 0,
		phase: 'intro',
		goneSince: null,
		released: false,
	};
	const m: StagePointer = {
		x: W / 2,
		y: H / 2,
		in: false,
		down: false,
		type: 'mouse',
		clickT: -9,
		moveT: -9,
		x0: 0,
		y0: 0,
		sy0: 0,
		direct: false,
	};
	const hm: HeroMarks = { look: 0, mx: 0, split: 0, zoom: 0, dive: 0, sm: st.sm, a0: 0, ad: 1 };
	const c: StageContext = {
		P: 0,
		s: 0,
		t: 0,
		dt: 0.016,
		now: 0,
		W,
		H,
		safeH,
		dpr,
		mode: loop.mode,
		reduced: false,
		fit,
		m,
		fpA: 0,
		endA: 0,
		decay: 0,
		endOn: false,
		stageTop: 0,
		visible: false,
		sv: 0,
	};
	let syPrev = window.scrollY;

	// Variablen nur an die Elemente, die sie lesen, nicht an #final oder die ganze Bühne: ein neuer Wert lässt die
	// Stile aller Nachfahren des Trägers neu berechnen, im Intro jedes Bild.
	const cache: Record<string, string> = {};
	const setVar = (k: string, v: string, targets: (HTMLElement | null)[] = [stageEl]) => {
		if (cache[k] === v) return;
		cache[k] = v;
		for (const el of targets) el?.style.setProperty(k, v);
	};

	const measureHoles = () => {
		const r0 = stageEl.getBoundingClientRect();
		holes = [...root.querySelectorAll<HTMLElement>('[data-loch]')].map((el) => {
			const r = el.getBoundingClientRect();
			return {
				x: r.left - r0.left,
				y: r.top - r0.top,
				w: r.width,
				h: r.height,
				kind: el.dataset.loch ?? '',
			};
		});
	};

	const resize = () => {
		W = stageEl.clientWidth;
		H = stageEl.clientHeight;
		safeH = safe.clientHeight;
		dpr = dprFor(2, 1.5, W, H);
		fit = fitBox(W, safeH, 1280, 800, 1.25);
		cam = camera(W, H, safeH, loop.mode);
		sizeBacking(cvFlat, W, H, dpr);
		measureHoles();
	};
	const stops = [observe(stageEl, resize), observe(safe, resize)];

	// Zeiger: Listener an der ganzen Seite, Koordinaten in Bühnen-CSS-Pixeln
	const place = (e: PointerEvent) => {
		const r = stageEl.getBoundingClientRect();
		m.x = e.clientX - r.left;
		m.y = e.clientY - r.top;
		m.in = true;
		m.type = e.pointerType || 'mouse';
		m.moveT = performance.now() / 1000;
	};
	const onLeave = () => {
		m.in = false;
	};
	const onDown = (e: StagePointerEvent) => {
		place(e);
		m.down = true;
		// direkt: der Klick kam aus der App im Handy (Phone.tsx) und ist dort schon angekommen, die Hand drückt nur mit
		m.direct = !!e.direct;
		const tt = performance.now() / 1000;
		// Maus und Stift: der Klick gilt sofort. Touch: erst beim Loslassen und nur ohne Wisch (siehe onUp).
		if (m.type !== 'touch') m.clickT = tt;
		m.x0 = m.x;
		m.y0 = m.y;
		m.sy0 = window.scrollY;
		if (!st.endOn) st.a0 = tt;
	};
	const onUp = (e: PointerEvent) => {
		if (m.down && m.type === 'touch' && e.type === 'pointerup') {
			const moved =
				Math.hypot(m.x - m.x0, m.y - m.y0) >= 8 || Math.abs(window.scrollY - m.sy0) >= 8;
			if (!moved) m.clickT = performance.now() / 1000;
		}
		m.down = false;
	};
	root.addEventListener('pointermove', place);
	root.addEventListener('pointerleave', onLeave);
	root.addEventListener('pointerdown', onDown);
	window.addEventListener('pointerup', onUp);
	window.addEventListener('pointercancel', onUp);

	const fireReady = () => {
		st.ready = true;
		document.dispatchEvent(new CustomEvent('landing:bereit'));
	};

	/** Fortschritt glätten. Sofort übernehmen beim ersten Bild und solange die Bühne nicht zu sehen ist. */
	const smooth = (Pz: number, dt: number, visible: boolean): number => {
		if (!st.init || !visible) {
			st.sp = Pz;
			st.init = true;
		} else {
			st.sp += (Pz - st.sp) * (1 - Math.exp(-Math.min(dt, 0.5) * 10));
			if (Math.abs(Pz - st.sp) < 1e-4) st.sp = Pz;
		}
		return st.sp;
	};

	/**
	 * Seit 2 s ganz aus dem Bild: Pufferspeicher der Ebenen freigeben (5K-Fläche: 59 MB je Canvas), beim
	 * Wiedereintritt neu messen. Die Ebenen passen ihre Größe beim Zeichnen selbst an.
	 */
	const manageMemory = (visible: boolean, now: number) => {
		if (!visible) {
			st.goneSince ??= now;
			if (!st.released && now - st.goneSince > 2) {
				st.released = true;
				for (const cv of stageEl.querySelectorAll('canvas')) cv.width = cv.height = 1;
				hero.release();
			}
		} else {
			st.goneSince = null;
			if (st.released) {
				st.released = false;
				resize();
			}
		}
	};

	/** CSS-Variablen, Phase und Bedienbarkeit, jedes Bild. Gibt die Phase zurück. */
	const setStyle = (
		P: number,
		fpA: number,
		portal: number,
		endA: number,
		cards: number[],
		rb: DOMRect,
		visible: boolean,
		headerBottom: number,
		titleTop: number,
	): Phase => {
		// Titel und Hinweis brauchen --p nur bis 0,09 (danach sind sie ganz weg). Weiter oben würde jeder neue Wert
		// im Intro die Stile aller Nachfahren von #final neu berechnen (ca. 1,5 ms je Bild).
		setVar('--p', Math.min(P, 0.1).toFixed(4), [stageEl, hints]);
		// Phone.tsx lädt Standbild und App ab hier, weit vor der Ende-Ebene (der Aufbau der App-Seite dauert 20 bis 60 ms):
		// am liebsten in der ersten Scroll-Pause ab P 0,2 (der Aufbau im Scrollen ruckelt), spätestens bei P 0,55
		if (root.dataset.nah !== '1' && (P > 0.55 || (P > 0.2 && loop.now - loop.act > 0.5)))
			root.dataset.nah = '1';
		setVar('--g', (1 - fpA).toFixed(3), [cvHero]);
		// Wohnung ist bei endA 0,5 weg, die Ende-Ebene beginnt erst bei 0,35: kaum Überlapp, kein grauer Schleier
		setVar('--f', (Math.max(fpA, cl(portal * 8)) * (1 - cl(endA * 2))).toFixed(3), [cvFlat]);
		// Portal: die Wohnung öffnet sich als Kreis im Loch des Organs, kein schwarzes Bild zwischen Tauchgang und Wohnung
		setVar('--por', portal.toFixed(3), [cvFlat]);
		setVar('--e', endA.toFixed(3), [endEl, hints]);
		// Raumkarten am Scroll geführt wie im Entwurf (Kurve und Überlappfreiheit: wohnung.karten)
		for (const [j, k] of cards.entries()) {
			st.kv[j] = k;
			setVar(`--c${j}`, k.toFixed(3), [roomsEl]);
		}
		// Hochformat: der Kopf bleibt sichtbar (Titel steht darunter), sonst bliebe nach dem Ausblenden der Knopf allein
		const headerOff = loop.mode === 'hoch' ? 0 : endA * (rb.bottom > headerBottom ? 1 : 0);
		setVar('--kopf-aus', headerOff.toFixed(3), [header]);
		// Hochformat: Titel und Knopf der Ende-Ebene blenden aus, sobald sie beim Hinausscrollen das Kopfband
		// erreichen (kein Text über dem Logo); in demselben Maß kommt der Kopf-Knopf zurück
		let titleOff = 0;
		if (loop.mode === 'hoch' && endTitle && endA > 0) {
			titleOff = 1 - cl((titleTop - headerBottom) / 16);
		}
		setVar('--ende-titel-aus', titleOff.toFixed(3), [endTitle]);
		// Hochformat: der Kopf bleibt, aber sein Knopf geht, solange der Knopf der Ende-Ebene im Bild steht (kein Doppel)
		const headerCtaOff =
			loop.mode === 'hoch' ? endA * (rb.bottom > headerBottom ? 1 : 0) * (1 - titleOff) : 0;
		setVar('--kopf-cta-aus', headerCtaOff.toFixed(3), [header]);
		if (headerCta && headerCta.inert !== headerCtaOff >= 0.6) headerCta.inert = headerCtaOff >= 0.6;
		if (header && header.inert !== headerOff >= 0.6) header.inert = headerOff >= 0.6;
		const phase: Phase = rb.bottom <= 0 ? 'nach' : P >= 0.9 ? 'ende' : 'intro';
		if (st.phase !== phase || root.dataset.phase !== phase) {
			st.phase = phase;
			root.dataset.phase = phase;
		}

		// Bedienelemente der Ende-Ebene nur bedienbar, wenn sie zu sehen sind
		const ctaOn = endA > 0.6 && visible;
		for (const el of ctas) {
			const v = ctaOn ? 'auto' : 'none';
			if (el.style.pointerEvents !== v) el.style.pointerEvents = v;
			if (el.inert === ctaOn) el.inert = !ctaOn;
		}
		const hintOff = endA >= 0.72 || phase === 'nach';
		for (const el of introOnly) if (el.inert !== hintOff) el.inert = hintOff;
		return phase;
	};

	/**
	 * Auflösung des Szenenpuffers (F-07): Ausreißer über 0,25 s (Tab-Wechsel, Pause) zählen nicht.
	 * Abgesenkt wird nur, wenn das gleitende Mittel über 15 Bilder über 0,05 s liegt, erholt bei ruhigem Lauf.
	 */
	const adaptResolution = (raw: number) => {
		if (raw <= 0.25) {
			st.rb.push(raw);
			if (st.rb.length > 15) st.rb.shift();
			const mean = st.rb.reduce((a, b) => a + b, 0) / st.rb.length;
			if (st.rb.length >= 15 && mean > 0.03) st.ad = Math.max(0.25, st.ad * 0.94);
			else if (raw < 0.022) st.ad = Math.min(1, st.ad * 1.06);
		}
	};

	const frame = (t0: number, dt: number, now: number, raw: number) => {
		const t = loop.reduced ? 0 : t0; // reduce: Hero-Zeit und Autopilot stehen still
		if (dprFor(2, 1.5, W, H) !== dpr) resize(); // Auflösungsstufe (loop.ts) hat sich geändert
		const rb = stageEl.getBoundingClientRect();
		const rs = sec.getBoundingClientRect();
		const visible = rb.bottom > 0 && rb.top < loop.vh;
		// alle Lagen lesen, bevor setzeStil schreibt (sonst erzwingt jedes Lesen eine Stilberechnung mitten im Bild)
		const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
		const titleTop = endTitle ? endTitle.getBoundingClientRect().top : 0;
		const s = cl(-rs.top / travel());
		const Pz = warp(s);
		const P = smooth(Pz, dt, visible);
		manageMemory(visible, now);
		// Scrollgeschwindigkeit (px/s), geglättet: Handy und Hände hängen dem Scroll nach (hand/index.ts)
		const sy = window.scrollY;
		const svRaw = dt > 0 ? cl((sy - syPrev) / Math.max(dt, 0.004), -4000, 4000) : 0;
		syPrev = sy;
		c.sv += (svRaw - c.sv) * (1 - Math.exp(-8 * Math.min(dt, 0.1)));
		const look = ss((P - 0.06) / 0.14);
		const mx = ss((P - 0.18) / 0.06);
		const split = ss((P - 0.24) / 0.1) * (1 - ss((P - 0.36) / 0.1));
		const zoom = ss((P - 0.22) / 0.2);
		const dive = ss((P - 0.48) / 0.12);
		const fpA = ss((P - 0.58) / 0.05);
		const portal = loop.reduced ? 1 : ss((P - 0.54) / 0.06);
		if (P > 0.3) preloadFlat(); // Render und Shader laden, lange bevor die Wohnung ab P 0,54 erscheint
		const endA = ss((P - 0.9) / 0.05);
		const cards = flat.cardOpacity(P);
		st.P = P;
		st.s = s;

		setStyle(P, fpA, portal, endA, cards, rb, visible, headerBottom, titleTop);
		st.endOn = endA > 0.6 && rb.bottom > 0.625 * H;
		adaptResolution(raw);

		if (st.a0 === null) st.a0 = now;
		let heroDrawn = false;
		if (visible) {
			Object.assign(c, {
				P,
				s,
				t,
				dt,
				now,
				W,
				H,
				safeH,
				dpr,
				mode: loop.mode,
				reduced: loop.reduced,
				fit,
			});
			c.fpA = fpA;
			c.endA = endA;
			// Zerfall der Hände: beginnt, sobald die Bühne nach oben weggeschoben wird (rb.top < 0), Rückwärts setzt zusammen
			c.decay = loop.reduced ? 0 : ss(cl(-rb.top / (0.6 * H)));
			c.endOn = st.endOn;
			c.stageTop = rb.top;
			c.visible = true;
			c.holes = holes;
			if (loop.n % 30 === 1) measureHoles();

			// Zeiger (-1..1) für Berg und Organ, ohne Zeiger läuft ein Autopilot
			const tm: [number, number] = m.in
				? [(m.x - W / 2) / (W / 2), (H / 2 - m.y) / (H / 2)]
				: [0.5 * Math.cos(t * 0.12), 0.4 * Math.sin(t * 0.16)];
			// Konstante des Entwurfs 0,06 je Bild bei 120 Hz, auf dt umgerechnet
			const ks = 1 - Math.exp(-7.43 * dt);
			st.sm[0] += (tm[0] - st.sm[0]) * ks;
			st.sm[1] += (tm[1] - st.sm[1]) * ks;

			if (fpA < 0.999) {
				hm.look = look;
				hm.mx = mx;
				hm.split = split;
				hm.zoom = zoom;
				hm.dive = dive;
				hm.a0 = st.a0;
				hm.ad = st.ad;
				c.dprHero = isTouch() ? Math.min(dpr, 1.25) : dpr;
				heroDrawn = hero.frame(c, hm);
			}
			if (cvStars && P < 0.075) drawStars(cvStars, W, safeH, dpr, t);
			if ((fpA > 0.001 || portal > 0.001) && endA < 0.999) flat.draw(cvFlat, c, rooms, people);
			if (P > 0.3 && !st.handsLoaded) {
				st.handsLoaded = true;
				hand.load();
			}
			if (hb && hf) hand.draw(hb, hf, c, cam);
		} else {
			c.visible = false;
		}
		if (!st.ready && (heroDrawn || fpA >= 0.999 || !visible)) fireReady();
	};

	const off = onFrame(frame);

	const api: Stage = {
		state: st,
		yForP(P) {
			const r = sec.getBoundingClientRect();
			return r.top + window.scrollY + unwarp(P) * travel();
		},
		destroy() {
			off();
			for (const f of stops) f();
			root.removeEventListener('pointermove', place);
			root.removeEventListener('pointerleave', onLeave);
			root.removeEventListener('pointerdown', onDown);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onUp);
			hero.destroy();
			if (live.stage === api) live.stage = null;
		},
	};
	live.stage = api;
	return api;
}
