// The intro stage: a sticky area at full window size on which mountain, mark, organ, flood,
// flat and the end scene run one after another.
//
// stage.ts reads the scroll distance s each frame, turns it into the progress P (timeline.ts), sets the
// CSS variables and data-phase on #final and calls the sub-renderers. The variables are set EVERY
// frame, even when nothing is drawn, so nothing is left stale after jumps.

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

/** Phase of the stage (data-phase on #final): intro, end layer or scrolled past. */
type Phase = 'intro' | 'ende' | 'nach';

/** State of the stage (for the QA hook and the landing page). */
export interface StageState {
	/** Smoothed progress. */
	sp: number;
	init: boolean;
	/** Start of the mark build-up. */
	a0: number | null;
	/** Smoothed pointer (-1..1). */
	sm: [number, number];
	/** Adaptive resolution of the scene buffer. */
	ad: number;
	/** Last 15 frame durations. */
	rb: number[];
	ready: boolean;
	endOn: boolean;
	handsLoaded: boolean;
	/** Time-smoothed opacity of the room cards. */
	kv: number[];
	P: number;
	s: number;
	phase: Phase;
	/** Time since which the stage has been fully out of view (null: visible). */
	goneSince: number | null;
	/** Layer buffer memory released. */
	released: boolean;
}

/** The running stage. */
export interface Stage {
	state: StageState;
	/** y position in the document for progress P (QA). */
	yForP: (P: number) => number;
	destroy: () => void;
}

/** The running stage (for the QA hook and the landing page). */
export const live: { stage: Stage | null } = { stage: null };

/** The click from the app in the phone (Phone.tsx) carries direct = true. */
type StagePointerEvent = PointerEvent & { direct?: boolean };

function required<T>(el: T | null, name: string): T {
	if (!el) throw new Error(`stage: ${name} missing`);
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
	/** Mono labels of the rooms in the floor plan, in the order of flat.ts. */
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
	const heroCta = stageEl.querySelector<HTMLElement>('[data-held-cta]');
	const introOnly = [...root.querySelectorAll<HTMLElement>('[data-nur-intro]')];
	const hints = root.querySelector<HTMLElement>('[data-hinweise]');
	const endEl = stageEl.querySelector<HTMLElement>('[data-ende]');
	const roomsEl = stageEl.querySelector<HTMLElement>('[data-loch="text"]');
	const hero = createHero(cvHero);

	let W = stageEl.clientWidth;
	let H = stageEl.clientHeight;
	// Scroll distance of the stage: section height minus stage (shorter with reduced motion, landing.css)
	const travel = () => Math.max(1, sec.offsetHeight - H);
	let safeH = safe.clientHeight;
	let dpr = dprFor(2, 1.5, W, H);
	let fit: Fit = fitBox(W, safeH);
	let cam: Fit = camera(W, H, safeH, loop.mode);
	let holes: Hole[] = [];

	// State of the stage
	const st: StageState = {
		sp: 0, // smoothed progress
		init: false,
		a0: null, // start of the mark build-up
		sm: [0.3, 0.1], // smoothed pointer (-1..1)
		ad: 1, // adaptive resolution of the scene buffer
		rb: [], // last 15 frame durations
		ready: false,
		endOn: false,
		handsLoaded: false,
		kv: [0, 0, 0, 0], // time-smoothed opacity of the room cards
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

	// Variables only on the elements that read them, not on #final or the whole stage: a new value makes the
	// styles of all descendants of the carrier recompute, in the intro every frame.
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
		fit = fitBox(W, safeH);
		cam = camera(W, H, safeH, loop.mode);
		sizeBacking(cvFlat, W, H, dpr);
		measureHoles();
	};
	const stops = [observe(stageEl, resize), observe(safe, resize)];

	// Pointer: listener on the whole page, coordinates in stage CSS pixels
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
		// direct: the click came from the app in the phone (Phone.tsx) and has already arrived there, the hand only presses along
		m.direct = !!e.direct;
		const tt = performance.now() / 1000;
		// Mouse and pen: the click counts immediately. Touch: only on release and only without a swipe (see onUp).
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

	/** Smooths the progress. Takes the value immediately on the first frame and while the stage is not visible. */
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
	 * Fully out of view for 2 s: release the buffer memory of the layers (5K area: 59 MB per canvas), measure
	 * again on re-entry. The layers adjust their size themselves when drawing.
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

	/** CSS variables, phase and operability, every frame. Returns the phase. */
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
		// Title and hint need --p only up to 0.09 (after that they are gone entirely). Above that, every new value
		// in the intro would recompute the styles of all descendants of #final (about 1.5 ms per frame).
		setVar('--p', Math.min(P, 0.1).toFixed(4), [stageEl, hints]);
		// Phone.tsx loads still image and app from here on, well before the end layer (building the app page takes 20 to 60 ms):
		// preferably in the first scroll pause from P 0.2 (building while scrolling stutters), at the latest at P 0.55
		if (root.dataset.nah !== '1' && (P > 0.55 || (P > 0.2 && loop.now - loop.act > 0.5)))
			root.dataset.nah = '1';
		setVar('--g', (1 - fpA).toFixed(3), [cvHero]);
		// The flat is gone at endA 0.5, the end layer only begins at 0.35: hardly any overlap, no grey veil
		setVar('--f', (Math.max(fpA, cl(portal * 8)) * (1 - cl(endA * 2))).toFixed(3), [cvFlat]);
		// Portal: the flat opens as a circle in the hole of the organ, no black frame between dive and flat
		setVar('--por', portal.toFixed(3), [cvFlat]);
		setVar('--e', endA.toFixed(3), [endEl, hints]);
		// Room cards driven by scroll as in the design (curve and overlap freedom: cardOpacity in flat.ts)
		for (const [j, k] of cards.entries()) {
			st.kv[j] = k;
			setVar(`--c${j}`, k.toFixed(3), [roomsEl]);
		}
		// Portrait: the header stays visible (the title sits below it), otherwise the button would be left alone after fading out
		const headerOff = loop.mode === 'hoch' ? 0 : endA * (rb.bottom > headerBottom ? 1 : 0);
		setVar('--header-off', headerOff.toFixed(3), [header]);
		// Portrait: title and button of the end layer fade out as soon as they reach the header band
		// while scrolling out (no text over the logo); to the same degree the header button returns
		let titleOff = 0;
		if (loop.mode === 'hoch' && endTitle && endA > 0) {
			titleOff = 1 - cl((titleTop - headerBottom) / 16);
		}
		setVar('--end-title-out', titleOff.toFixed(3), [endTitle]);
		// Portrait: the header stays but its button goes while the button of the end layer is in view (no duplicate)
		const headerCtaOff =
			loop.mode === 'hoch' ? endA * (rb.bottom > headerBottom ? 1 : 0) * (1 - titleOff) : 0;
		setVar('--header-cta-out', headerCtaOff.toFixed(3), [header]);
		if (headerCta && headerCta.inert !== headerCtaOff >= 0.6) headerCta.inert = headerCtaOff >= 0.6;
		if (header && header.inert !== headerOff >= 0.6) header.inert = headerOff >= 0.6;
		const phase: Phase = rb.bottom <= 0 ? 'nach' : P >= 0.9 ? 'ende' : 'intro';
		if (st.phase !== phase || root.dataset.phase !== phase) {
			st.phase = phase;
			root.dataset.phase = phase;
		}

		// Controls of the end layer are operable only when visible
		const ctaOn = endA > 0.6 && visible;
		for (const el of ctas) {
			const v = ctaOn ? 'auto' : 'none';
			if (el.style.pointerEvents !== v) el.style.pointerEvents = v;
			if (el.inert === ctaOn) el.inert = !ctaOn;
		}
		// Hero button: only while the title is visible (it fades out until P 0.086, HeroTitle.tsx)
		const heroOff = P >= 0.07;
		if (heroCta && heroCta.inert !== heroOff) {
			heroCta.inert = heroOff;
			heroCta.style.pointerEvents = heroOff ? 'none' : '';
		}
		const hintOff = endA >= 0.72 || phase === 'nach';
		for (const el of introOnly) if (el.inert !== hintOff) el.inert = hintOff;
		return phase;
	};

	/**
	 * Resolution of the scene buffer: outliers above 0.25 s (tab switch, pause) do not count.
	 * It is lowered only when the moving average over 15 frames exceeds 0.05 s, and recovers when running calmly.
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
		const t = loop.reduced ? 0 : t0; // reduce: hero time and autopilot stand still
		if (dprFor(2, 1.5, W, H) !== dpr) resize(); // resolution level (loop.ts) has changed
		const rb = stageEl.getBoundingClientRect();
		const rs = sec.getBoundingClientRect();
		const visible = rb.bottom > 0 && rb.top < loop.vh;
		// read all layouts before setStyle writes (otherwise every read forces a style recalculation mid-frame)
		const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
		const titleTop = endTitle ? endTitle.getBoundingClientRect().top : 0;
		const s = cl(-rs.top / travel());
		const Pz = warp(s);
		const P = smooth(Pz, dt, visible);
		manageMemory(visible, now);
		// Scroll speed (px/s), smoothed: phone and hands lag behind the scroll (hand/index.ts)
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
		if (P > 0.3) preloadFlat(); // load render and shader long before the flat appears at P 0.54
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
			// Decay of the hands: begins as soon as the stage is pushed up (rb.top < 0), running backwards reassembles them
			c.decay = loop.reduced ? 0 : ss(cl(-rb.top / (0.6 * H)));
			c.endOn = st.endOn;
			c.stageTop = rb.top;
			c.visible = true;
			c.holes = holes;
			if (loop.n % 30 === 1) measureHoles();

			// Pointer (-1..1) for mountain and organ, without a pointer an autopilot runs
			const tm: [number, number] = m.in
				? [(m.x - W / 2) / (W / 2), (H / 2 - m.y) / (H / 2)]
				: [0.5 * Math.cos(t * 0.12), 0.4 * Math.sin(t * 0.16)];
			// Design constant 0.06 per frame at 120 Hz, converted to dt
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
