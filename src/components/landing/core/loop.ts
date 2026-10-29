// A single requestAnimationFrame loop for the whole page.
//
// - dt = min(0.05 s, gap to the last frame), paused while document.hidden.
// - Scenes register in the useEffect of their component (register) and unregister on teardown.
// - The intro stage hooks in as a frame subscriber (onFrame); it has several layers.
// - Every visible scene gets every frame (frame). Simulations run through s.step with a fixed step.
// - Pointers arrive in scene coordinates. The listeners attach to the whole scene area.
//
// A scene with its own fields on the state `s` extends SceneState and passes the interface to register:
//
//   interface DepthState extends SceneState {
//   	dp: number; // own fields: set them in init(s), not in the literal passed to register
//   	pv?: { a: number }; // fields that resize reads (it already runs on registration, before init) stay optional
//   }
//   register<DepthState>({ el, init(s) { s.dp = 0; }, frame(s, t, dt) { s.dp += dt; } });
//
// register creates s with the fields of SceneState only. Own fields exist once init sets them
// (init runs before the first frame, resize before that).

import {
	dprFor,
	type Fit,
	fitBox,
	full,
	observe,
	pointerIn,
	quality,
	scene,
	sizeBacking,
	wakeHook,
} from './canvas';

/** Page mode: portrait or landscape. */
export type Mode = 'portrait' | 'landscape';

/** Frame subscriber of the loop: (t, dt, now, raw). */
type FrameFn = (t: number, dt: number, now: number, raw: number) => void;

interface Loop {
	n: number;
	fv: number;
	t: number;
	dt: number;
	raw: number;
	now: number;
	reduced: boolean;
	mode: Mode;
	short: boolean;
	act: number;
	vw: number;
	vh: number;
}

export const loop: Loop = {
	n: 0, // frame counter since the start, begins at 1
	fv: 0, // font version, counts up when fonts finish loading (rebuild the text raster)
	t: 0, // seconds since the start
	dt: 0.016, // gap limited to 0.05 s
	raw: 0.016, // unclamped gap (detects stutters)
	now: 0, // performance.now() in seconds
	reduced: false,
	mode: 'landscape', // 'portrait' | 'landscape'
	short: false, // phone in landscape
	act: 0, // last input or movement (seconds, performance.now()): scroll, pointer, key, resize
	// Window size, read once at the start of every frame. Use it in frame callbacks instead of innerWidth/innerHeight:
	// those force a new layout calculation after every style write of another scene.
	vw: 0,
	vh: 0,
};

/** Measurement hook of the scenes for landing-konzept/werkzeuge/qa (read-only), attached to window.__landing.dbg. */
export const qa: Record<string, unknown> = {};

/** Pointer state of a scene (scene coordinates x, y; CSS pixels px, py). */
interface ScenePointer {
	x: number;
	y: number;
	px: number;
	py: number;
	in: boolean;
	down: boolean;
	type: string;
}

/** State `s` that register creates for every scene and passes to all callbacks. */
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
	mode: Mode;
	reduced: boolean;
	visible: boolean;
	/** Backing store was reset: scenes that do not draw while idle must redraw once. */
	stale: boolean;
	/** Buffer memory released (far out of view). */
	released: boolean;
	/** Accumulator of step. */
	acc: number;
	m: ScenePointer;
	/** Transform for full-bleed backgrounds (CSS pixels). */
	full(): void;
	/** Transform for the composition in scene space. */
	scene(): void;
	/** Fixed step h with an accumulator, at most 4 steps per frame. Returns the number of steps. */
	step(dt: number, h: number, fn: () => void): number;
}

/** Reference box of the composition. */
interface Box {
	bw: number;
	bh: number;
	align?: 'top' | 'bottom' | undefined;
	max?: number | undefined;
}

/** Registration of a scene (see register). The callbacks are methods so that SceneDef<S> also counts as SceneDef<SceneState>. */
interface SceneDef<S extends SceneState = SceneState> {
	name?: string | undefined;
	el: HTMLElement;
	host?: HTMLElement | undefined;
	box?(W: number, H: number, safeH: number, mode: Mode): Box;
	dprCap?: number | undefined;
	touchCap?: number | undefined;
	minVisible?: number | undefined;
	init?(s: S): void;
	frame?(s: S, t: number, dt: number): void;
	/**
	 * Warm-up in steps: called once per frame shortly before entry (at most one scene per frame)
	 * until it returns true. Without warm the scene instead draws once invisibly (frame).
	 */
	warm?(s: S): boolean;
	/**
	 * Read further DOM positions (visible scenes, in the shared read phase before all frame calls): read one by one
	 * in frame, every read after the preceding style writers forces a layout calculation of its own.
	 */
	read?(s: S): void;
	resize?(s: S): void;
	onDown?(s: S): void;
	onMove?(s: S): void;
	onUp?(s: S, e: PointerEvent): void;
	destroy?(s: S): void;
}

interface Registration<S extends SceneState = SceneState> {
	s: S;
	def: SceneDef<S>;
	host: HTMLElement;
	inited: boolean;
	farSince: number;
	/** Drawn once invisibly before entry (building buffers, rasters, shaders) until the next measurement. */
	warm: boolean;
}

const scenes = new Set<Registration>();
const subs = new Set<FrameFn>();
const readers = new Set<() => void>(); // see onRead
const firstSubs = new Set<FrameFn>(); // before the other subscribers and the scenes (Lenis sets the scroll position here)
let raf = 0;
let last = 0;
let t0 = 0;
let started = false;
let hooked = false;
let lastDpr = 1;
let lastSy = 0;
let visHook: (() => void) | null = null;
let offMq: (() => void) | null = null;
let offFonts: (() => void) | null = null;

// Idle phases (scenes without input and without scrolling): frame rate capped at 60 Hz, with reduced
// motion fully still after one second until something happens again.
const IDLE_AFTER = 0.3;
const IDLE_AFTER_REDUCED = 1;
const MIN_FRAME_GAP = 0.0105; // below 10.5 ms (displays above 95 Hz) every second frame is skipped while idle
const RELEASE_AFTER = 2; // seconds out of view until the buffer memory of a scene is released
const WARM_DISTANCE = 2.2; // window heights before entry from which a scene is warmed up once invisibly
let warmSlotFree = true; // at most one scene warms up per frame (building a scene can cost 20 to 40 ms)
const wake = () => {
	loop.act = performance.now() / 1000;
};
wakeHook.fn = wake;

/** Mode from the window size (same rule as the media queries in landing.css). */
export function modeOf(W: number, H: number): { mode: Mode; short: boolean } {
	const portrait = W / H <= 1 || W < 700;
	return { mode: portrait ? 'portrait' : 'landscape', short: !portrait && H < 500 };
}

const reported = new Set<string>();
function report(where: string, err: unknown) {
	if (reported.has(where)) return;
	reported.add(where);
	console.error(where, err);
}

function measure(r: Registration, W: number, H: number) {
	const { s, def } = r;
	s.W = W;
	s.H = H;
	s.safeH = H;
	s.mode = loop.mode;
	s.dpr = dprFor(def.dprCap ?? 2, def.touchCap ?? def.dprCap ?? 2, W, H);
	wake();
	s.stale = true; // backing store was reset: scenes that do not draw while idle must redraw once
	s.released = false;
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

function frameScene(r: Registration, t: number, dt: number, rc: DOMRect) {
	const { s, def } = r;
	if (
		s.cv &&
		!s.released &&
		s.dpr !== dprFor(def.dprCap ?? 2, def.touchCap ?? def.dprCap ?? 2, s.W, s.H)
	)
		measure(r, s.el.clientWidth, s.el.clientHeight);
	// Far away (more than one window height): release the buffer memory after RELEASE_AFTER seconds, measure again on approach
	if (s.cv) {
		const far = rc.bottom < -loop.vh || rc.top > 2 * loop.vh;
		if (!far) {
			r.farSince = 0;
			if (s.released) measure(r, s.el.clientWidth, s.el.clientHeight);
		} else if (!s.released) {
			if (!r.farSince) r.farSince = loop.now;
			if (r.farSince && loop.now - r.farSince > RELEASE_AFTER) {
				s.released = true;
				sizeBacking(s.cv, 1, 1, 1);
			}
		}
	}
	// minVisible: fraction of the window height from which a large area is drawn at all (a 50 px strip
	// of a 4 MP area otherwise costs the whole frame)
	const visiblePx = Math.min(rc.bottom, loop.vh) - Math.max(rc.top, 0);
	s.visible =
		!(rc.bottom < 0 || rc.top > loop.vh || rc.right < 0 || rc.left > loop.vw || rc.width < 2) &&
		visiblePx >= (def.minVisible ?? 0) * loop.vh;
	// Warm-up: build invisibly shortly before entry so that the first visible frame does not carry the whole build
	// (word image of the depth scene, drawing sheet and raster of the sun). Not in the first seconds.
	if (
		!s.visible &&
		!r.warm &&
		warmSlotFree &&
		loop.n > 120 &&
		rc.top < WARM_DISTANCE * loop.vh &&
		rc.bottom > 0
	) {
		warmSlotFree = false;
		s.reduced = loop.reduced;
		initOnce(r);
		if (def.warm) r.warm = def.warm(s);
		else {
			r.warm = true;
			def.frame?.(s, t, dt);
		}
		return;
	}
	if (!s.visible) return;
	s.reduced = loop.reduced;
	initOnce(r);
	def.frame?.(s, t, dt);
}

function initOnce(r: Registration) {
	if (r.inited) return;
	r.inited = true;
	r.def.init?.(r.s);
}

// Resolution step by frame time: if the median of two windows of 45 frames each is above 22 ms (below 45 frames/s),
// the pixel factor of all canvases drops by one step (dprFor). It does not recover, otherwise the sharpness would oscillate.
const QUALITY_STEPS = [1, 0.8, 0.65, 0.5];
const qb: number[] = [];
let qi = 0;
let qBad = 0;
function adaptQuality(raw: number) {
	if (raw > 0.25 || loop.n < 90) return;
	qb.push(raw);
	if (qb.length < 45) return;
	qb.sort((a, b) => a - b);
	qBad = (qb[22] ?? 0) > 0.022 ? qBad + 1 : 0;
	qb.length = 0;
	if (qBad >= 2 && qi < QUALITY_STEPS.length - 1) {
		quality.f = QUALITY_STEPS[++qi] ?? quality.f;
		qBad = 0;
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
	loop.vw = window.innerWidth;
	loop.vh = window.innerHeight;
	const sy = window.scrollY;
	if (sy !== lastSy) {
		lastSy = sy;
		loop.act = now;
	}
	const idle = now - loop.act;
	// Reduced motion: do not draw while idle (the first 2 s after the start always run)
	if (loop.reduced && idle > IDLE_AFTER_REDUCED && loop.n > 120) {
		last = 0;
		return;
	}
	const raw = last ? now - last : 0.016;
	if (idle > IDLE_AFTER && raw < MIN_FRAME_GAP) return;
	last = now;
	loop.n++;
	loop.raw = raw;
	loop.dt = Math.min(0.05, raw);
	loop.now = now;
	loop.t = now - t0;
	if (!loop.reduced) adaptQuality(raw);
	if (window.devicePixelRatio !== lastDpr) {
		lastDpr = window.devicePixelRatio;
		refresh();
	}
	const spikes = qa.spikes as Spike[] | undefined;
	let m0 = spikes ? performance.now() : 0;
	const parts: [string, number][] = [];
	const mark = (n: string) => {
		if (!spikes) return;
		const m1 = performance.now();
		if (m1 - m0 > 0.5) parts.push([n, Math.round((m1 - m0) * 10) / 10]);
		m0 = m1;
	};
	for (const fn of firstSubs) {
		try {
			fn(loop.t, loop.dt, now, raw);
		} catch (e) {
			report('first', e);
		}
		mark(`first:${fn.name || '?'}`);
	}
	for (const fn of subs) {
		try {
			fn(loop.t, loop.dt, now, raw);
		} catch (e) {
			report('stage', e);
		}
		mark(`sub:${fn.name || '?'}`);
	}
	warmSlotFree = true;
	// Read the positions of all scenes together before any scene writes styles: read one by one in between, every
	// read forced a style calculation of its own for the page
	const rects = new Map<Registration, DOMRect>();
	for (const r of scenes) {
		const rc = r.s.el.getBoundingClientRect();
		rects.set(r, rc);
		if (r.def.read && rc.bottom > 0 && rc.top < loop.vh) r.def.read(r.s);
	}
	for (const fn of readers) fn();
	for (const r of scenes) {
		const rc = rects.get(r) ?? r.s.el.getBoundingClientRect();
		try {
			frameScene(r, loop.t, loop.dt, rc);
		} catch (e) {
			report(`scene ${r.def.name ?? ''}`, e);
		}
		mark(r.def.name ?? '?');
	}
	if (spikes) {
		const sum = parts.reduce((t, x) => t + x[1], 0);
		if (sum > 6) spikes.push({ y: Math.round(sy), ms: Math.round(sum), parts });
	}
}
/** Measurement hook: frames with more than 6 ms of compute time, split by scene (qa.spikes = [] arms it). */
interface Spike {
	y: number;
	ms: number;
	parts: [string, number][];
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
	for (const ev of [
		'pointermove',
		'pointerdown',
		'pointerup',
		'keydown',
		'wheel',
		'resize',
		'touchmove',
	])
		window.addEventListener(ev, wake, { passive: true });
}

/** Measure all scenes again (mode or pixel factor change). */
function refresh() {
	for (const r of scenes) measure(r, r.s.el.clientWidth, r.s.el.clientHeight);
}

/** Set the mode and inform the scenes. */
export function setMode(mode: Mode, short: boolean) {
	if (loop.mode === mode && loop.short === short) return;
	loop.mode = mode;
	loop.short = short;
	refresh();
}

/**
 * Frame subscriber (intro stage). fn(t, dt, now, raw). Returns the unsubscribe function.
 * first: runs before all other subscribers and scenes in the same frame.
 */
export function onFrame(fn: FrameFn, first = false): () => void {
	const set = first ? firstSubs : subs;
	set.add(fn);
	return () => set.delete(fn);
}

/**
 * Reader: runs every frame in the shared read phase (after the scene positions, before their frame calls). For
 * DOM reads outside the scenes, which would otherwise force a layout of their own after the style writers.
 */
export function onRead(fn: () => void): () => void {
	readers.add(fn);
	return () => readers.delete(fn);
}

/**
 * Register a scene.
 *   el      element of the scene (usually a canvas), its CSS box is the scene area
 *   host    element for the pointer listeners (default: parent element)
 *   box     (W, H, safeH, mode) -> { bw, bh, align?, max? }, reference box of the composition
 *   dprCap  cap of the pixel factor (default 2), touchCap: cap on touch devices
 *   init, frame, resize, onDown, onMove, onUp
 * Returns the unregister function.
 */
export function register<S extends SceneState>(def: SceneDef<S>): () => void {
	hook();
	const el = def.el;
	const host = def.host ?? el.parentElement ?? el;
	const isCanvas = typeof HTMLCanvasElement !== 'undefined' && el instanceof HTMLCanvasElement;
	// The state starts with the fields of SceneState only; the scene sets its own fields of S in init.
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
		released: false,
		acc: 0,
		m: { x: -999, y: -999, px: -999, py: -999, in: false, down: false, type: 'mouse' },
		full() {
			if (this.ctx) full(this.ctx, this.dpr);
		},
		scene() {
			if (this.ctx) scene(this.ctx, this.dpr, this);
		},
		// Fixed step h with an accumulator, at most 4 steps per frame.
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
	const r: Registration<S> = { s, def, host, inited: false, farSince: 0, warm: false };
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

/** Start the loop. Returns the stop function. */
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
		wake();
	};
	document.fonts?.ready.then(onFonts);
	document.fonts?.addEventListener?.('loadingdone', onFonts);
	offFonts = () => document.fonts?.removeEventListener?.('loadingdone', onFonts);
	t0 = performance.now() / 1000;
	loop.act = t0 + 2.5; // the first seconds (building the mark) run at full frame rate
	last = 0;
	loop.n = 0;
	raf = requestAnimationFrame(tick);
	// Stop completely in the background (no wake-up per frame), restart on return
	visHook = () => {
		cancelAnimationFrame(raf);
		if (!document.hidden && started) {
			last = 0;
			wake();
			raf = requestAnimationFrame(tick);
		}
	};
	document.addEventListener('visibilitychange', visHook);
	offMq = () => mqR.removeEventListener('change', onReduced);
	return stop;
}

function stop(): void {
	cancelAnimationFrame(raf);
	if (visHook) document.removeEventListener('visibilitychange', visHook);
	started = false;
	offMq?.();
	offFonts?.();
}
