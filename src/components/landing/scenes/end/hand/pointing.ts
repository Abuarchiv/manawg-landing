// Pointing-hand control: state, pointer in the end space, taps (mouse, touch), demo, contact and the
// frame values that result from them for both draw paths.

import type { Fit } from '../../../core/canvas';
import { isTouch } from '../../../core/canvas';
import { qa } from '../../../core/loop';
import { isPortrait } from '../camera';
import { atlases } from './atlas';
import { ARM, PS, RING_T } from './constants';
import type { Breath, DemoRun, DrawValues, HandContext, HandState, Point, Tap } from './types';

/** Pointer position in the end space (object space of the hands, without breathing) from stage CSS px. */
type ObjFn = (x: number, y: number) => [number, number];

/** Pointer and input type of a frame, in the end space. */
interface Input {
	obj: ObjFn;
	mx: number;
	my: number;
	touch: boolean;
}

/** Target of the pointing hand in this frame and how strongly it is drawn there. */
interface Target {
	tg: readonly [number, number];
	k: number;
	follows: boolean;
	pend: Tap | null;
}

// ----------------------------------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------------------------------

export const states = new WeakMap<HTMLCanvasElement, HandState>();

/** Quiet breathing (sine plus slow noise): x, y in stage px, r in rad. Periods 4 to 6 s. */
export function breath(t: number): Breath {
	const w = 1.2; // 5,2 s
	const x = 0.65 * Math.sin(t * w) + 0.35 * Math.sin(t * 1.55 + 1.3);
	const y = 0.65 * Math.sin(t * 1.05 + 2) + 0.35 * Math.sin(t * 1.4 + 0.4);
	const r = 0.65 * Math.sin(t * 1.15 + 0.5) + 0.35 * Math.sin(t * 1.5 + 2.2);
	return { x: 1.5 * x, y: 1.5 * y, r: ((0.4 * Math.PI) / 180) * r };
}

/** Autopilot in the window x 780-860, y 330-470: vertical triangle wave, never lingering over the same text line. */
function autopilot(t: number): [number, number] {
	const p = (t / 8) % 1;
	const tri = p < 0.5 ? -1 + 4 * p : 3 - 4 * p;
	return [820 + 40 * Math.sin(t * 0.45), 400 + 70 * tri];
}

export function newState(back: HTMLCanvasElement, front: HTMLCanvasElement): HandState {
	return {
		back,
		front,
		host: back.closest<HTMLElement>('[data-stage]'),
		ht: null,
		lt: { x: 820, y: 400 },
		park: [940, 1000],
		lastClick: -9,
		tap: null,
		contactT: -9,
		pending: null,
		space: null,
		appDoc: null,
		clean: false,
		mode: null, // 'gl' | 'cpu'
		layers: null,
		cpu: { key: null, baked: null },
		quiet: [0, 0, 0, 0, 0, 0, 0, 0],
		rects: [],
		frames: 0,
		demo: null,
	};
}

/** Re-measure the quiet rectangles (title, button) in the end space and the button rectangles in stage px. */
function measure(st: HandState, cam: Fit): void {
	const root = st.back.parentElement;
	if (!root) return;
	const cr = st.back.getBoundingClientRect();
	const q = [0, 0, 0, 0, 0, 0, 0, 0];
	let k = 0;
	for (const el of root.querySelectorAll('[data-quiet]')) {
		if (k > 1) break;
		const r = el.getBoundingClientRect();
		q[k * 4] = (r.left - cr.left - cam.ox) / cam.f;
		q[k * 4 + 1] = (r.top - cr.top - cam.oy) / cam.f;
		q[k * 4 + 2] = r.width / cam.f;
		q[k * 4 + 3] = r.height / cam.f;
		k++;
	}
	st.quiet = q;
	st.rects = [...root.querySelectorAll('[data-cta]')].map(
		(el): [number, number, number, number] => {
			const r = el.getBoundingClientRect();
			return [r.left - cr.left, r.top - cr.top, r.right - cr.left, r.bottom - cr.top];
		},
	);
}

/** Demo already seen (once per session)? With set = remember. */
function demoDone(set?: boolean): boolean {
	try {
		if (set) sessionStorage.setItem('mwg-demo', '1');
		return sessionStorage.getItem('mwg-demo') === '1';
	} catch {
		return false;
	}
}

/** Center of the tab button (name) in the app preview as the target of the pointing hand: object space plus window coordinates. */
function demoTarget(
	st: HandState,
	name: string,
	obj: ObjFn,
): { x: number; y: number; cx: number; cy: number } | null {
	const fr = st.back.parentElement?.querySelector('iframe');
	const doc = fr?.contentDocument;
	if (!fr || !doc?.body) return null;
	const r = fr.getBoundingClientRect();
	const k = r.width / fr.clientWidth;
	const el = [...doc.querySelectorAll(`a[data-k^="a|${name}"]`)].find(
		(e) => e.getBoundingClientRect().top > fr.clientHeight * 0.7,
	);
	if (!el || !k) return null;
	const q = el.getBoundingClientRect();
	const cx = r.left + (q.left + q.width / 2) * k;
	const cy = r.top + (q.top + q.height / 2) * k;
	const r0 = st.back.getBoundingClientRect();
	const [x, y] = obj(cx - r0.left, cy - r0.top);
	return { x, y, cx, cy };
}

// ----------------------------------------------------------------------------------------------------
// One frame of the control
// ----------------------------------------------------------------------------------------------------

const onGlass = (x: number, y: number): boolean => {
	const sc = atlases().hold.meta.screen;
	return x > sc.x - 4 && x < sc.x + sc.w + 4 && y > sc.y - 4 && y < sc.y + sc.h + 4;
};

/** Pointer in the end space (object space of the hands, without breathing). */
function objectSpace(cam: Fit, br: Breath): ObjFn {
	return (x, y) => {
		const qx = (x - cam.ox) / cam.f - br.x - 800;
		const qy = (y - cam.oy) / cam.f - br.y - 400;
		const cs = Math.cos(br.r);
		const sn = Math.sin(br.r);
		return [800 + cs * qx + sn * qy, 400 - sn * qx + cs * qy];
	};
}

/**
 * A tap on the screen. Mouse and pen: the pointing hand is already at the pointer (or moving there), only on
 * contact do the press, the ring and the click into the app run. Touch: the real finger taps, only the ring
 * marks the contact point (the app reacts immediately, nothing is delayed).
 */
function tap(st: HandState, c: HandContext, e: Input, dm: DemoRun): void {
	const { now } = c;
	if (c.m.clickT === st.lastClick) return;
	st.lastClick = c.m.clickT;
	if (c.endOn && onGlass(e.mx, e.my)) {
		dm.off = true; // the visitor's own tap: the demo is superfluous
		// Touch: the real finger taps. direct: the click has already reached the app (Phone.tsx), the
		// pointing hand only presses along and the ring marks the spot.
		if (e.touch || c.m.direct) {
			st.tap = [e.mx, e.my];
			st.contactT = now;
		} else {
			const r0 = st.back.getBoundingClientRect();
			// If a tap is still running it goes into the app immediately: taps are never discarded
			if (st.pending && !st.pending.demo) {
				const q = st.pending;
				st.tap = [q.x, q.y];
				st.contactT = now;
				st.host?.dispatchEvent(new CustomEvent('hand:contact', { detail: { x: q.cx, y: q.cy } }));
			}
			// The tip is already at the pointer: the click goes into the app immediately, the hand only presses along
			st.tap = [e.mx, e.my];
			st.contactT = now;
			st.host?.dispatchEvent(
				new CustomEvent('hand:contact', { detail: { x: r0.left + c.m.x, y: r0.top + c.m.y } }),
			);
		}
	}
}

/**
 * Demo: if the visitor stays idle for 2.5 s after entering, the pointing hand taps "Haushalt" once per session
 * and three seconds later "Start" (via the same contact path as a real tap). Hovering over the glass, a tap
 * or touch ends it. It does not run with reduced motion (only the hint under the phone).
 */
function runDemo(st: HandState, c: HandContext, e: Input, dm: DemoRun): void {
	const { now } = c;
	if (c.endOn && !e.touch && c.m.in && onGlass(e.mx, e.my) && now - (c.m.moveT ?? -9) < 1.4)
		dm.off = true;
	// Focus in the app iframe (keyboard, screen reader): the visitor operates the app, the demo stays off
	if (document.activeElement?.tagName === 'IFRAME') dm.off = true;
	if (dm.off || c.reduced || e.touch || isTouch() || !c.endOn || dm.n >= 2) {
		if (!c.endOn) dm.idleSince = null;
		if (dm.off && st.pending?.demo) st.pending = null;
	} else {
		dm.idleSince ??= now;
		if (!st.pending && now - dm.idleSince > 2.5 && now >= dm.next) {
			const z = demoTarget(st, dm.n ? 'Start' : 'Haushalt', e.obj);
			if (z) st.pending = { ...z, t0: now, demo: true, slow: true };
			else dm.next = now + 0.8;
		}
	}
}

/** Where the pointing hand moves: pending tap, pointer over the glass or parking spot. */
function chooseTarget(st: HandState, c: HandContext, e: Input): Target {
	const pend = st.pending;
	// After contact the hand withdraws after 0.35 s so that the result of the tap is visible
	// Over the glass the fingertip sticks to the pointer as long as it is there (no withdrawal, no time limit)
	const follows = c.endOn && !e.touch && c.m.in && onGlass(e.mx, e.my);
	let tg: readonly [number, number] = st.park;
	let k = 7;
	if (follows) {
		tg = [e.mx, e.my];
		k = Number.POSITIVE_INFINITY;
	} else if (pend) {
		tg = [pend.x, pend.y];
		k = pend.slow ? 9 : 40;
	}
	return { tg, k, follows, pend };
}

/** Move the fingertip and the pointer light to the target; trigger contact when the tap arrives. */
function move(st: HandState, c: HandContext, cam: Fit, e: Input, z: Target, dm: DemoRun): Point {
	const { H, t, now, dt } = c;
	// Pointer light: follows the mouse, otherwise a calm autopilot
	const lg: [number, number] =
		c.endOn && c.m.in && !e.touch ? [e.mx, e.my] : c.reduced ? [820, 400] : autopilot(t);
	const parkY = Math.max(1000, (H - cam.oy) / cam.f + 340);
	st.park = [940, parkY];
	if (!st.ht) st.ht = { x: st.park[0], y: st.park[1] };
	const ht = st.ht;
	// k = infinity: exactly at the pointer without easing (the tip replaces the mouse cursor)
	const kk = Number.isFinite(z.k) ? 1 - Math.exp(-z.k * Math.min(dt, 0.05)) : 1;
	ht.x += (z.tg[0] - ht.x) * kk;
	ht.y += (z.tg[1] - ht.y) * kk;
	const pend = z.pend;
	// Contact: the tip has arrived (or 0.3 s are up), now press, ring and click
	if (
		pend &&
		(Math.hypot(ht.x - pend.x, ht.y - pend.y) < 8 || now - pend.t0 > (pend.slow ? 0.9 : 0.12))
	) {
		st.pending = null;
		if (pend.demo) {
			dm.n++;
			dm.next = now + 3;
			if (dm.n >= 2) demoDone(true);
		}
		st.tap = [pend.x, pend.y];
		st.contactT = now;
		st.host?.dispatchEvent(
			new CustomEvent('hand:contact', { detail: { x: pend.cx, y: pend.cy, demo: !!pend.demo } }),
		);
	}
	const lt = st.lt;
	const kl = 1 - Math.exp(-24 * Math.min(dt, 0.05));
	lt.x += (lg[0] - lt.x) * kl;
	lt.y += (lg[1] - lt.y) * kl;
	return ht;
}

/** Cursor: over the glass the fingertip replaces the pointer (also in the document of the app, Phone.tsx). */
function setCursor(st: HandState, follow: boolean): void {
	if (st.host) st.host.toggleAttribute('data-hand-follows', follow);
	if (!st.appDoc?.isConnected)
		st.appDoc = st.space?.querySelector('iframe')?.contentDocument?.documentElement ?? null;
	if (st.appDoc && st.appDoc.hasAttribute('data-hand') !== follow)
		st.appDoc.toggleAttribute('data-hand', follow);
}

/** Frame values from the state: tip, arm direction, press, ring, light (snapped to 4 px). */
function buildValues(
	st: HandState,
	c: HandContext,
	cam: Fit,
	br: Breath,
	ht: Point,
	touch: boolean,
): DrawValues {
	const { W, H, now } = c;
	const pr = now - st.contactT;
	const push = st.tap && pr >= 0 && pr < 0.4 && !touch ? Math.sin((pr / 0.4) * Math.PI) : 0;
	const portrait = isPortrait(W, H);
	const ax = (portrait ? (W - cam.ox) / cam.f : ARM[0]) - ht.x;
	const ay = (portrait ? (H - cam.oy) / cam.f : ARM[1]) - ht.y;
	const AL = Math.hypot(ax, ay) || 1;
	const ux = ax / AL;
	const uy = ay / AL;
	if (st.frames++ % 15 === 0) measure(st, cam);
	const lt = st.lt;
	// The light is snapped (4 px) so that calm light does not trigger a new pass
	return {
		light: { x: Math.round(lt.x / 4) * 4, y: Math.round(lt.y / 4) * 4 },
		ringAt: { x: st.tap ? st.tap[0] : 0, y: st.tap ? st.tap[1] : 0 },
		lightPow: st.mode === 'gl' ? 1 : 0,
		// The forearm fades out at the bottom edge of the frame (gradient instead of a hard edge)
		bottomY: Math.min(atlases().hold.meta.bottomY, (H - cam.oy) / cam.f + 10),
		// The tip sits exactly at the target, on press it moves slightly along the arm direction
		tip: {
			x: Math.round((ht.x + ux * push * 4) * 2) / 2,
			y: Math.round((ht.y + uy * push * 4) * 2) / 2,
		},
		u: { x: ux, y: uy },
		sc: PS * (W <= 768 ? 0.75 : 1) * (1 - push * 0.06),
		// Touch: no drawn pointing hand, the real finger taps there
		pa: qa.noPoint || touch ? 0 : 1,
		push: Math.round(push * 20) / 20,
		decay: Math.round(c.decay * 200) / 200,
		br,
		ring: st.tap && pr >= 0 && pr < RING_T ? 1 - pr / RING_T : 0,
		ringR: 10 + Math.max(0, pr) * 150,
		q: st.quiet,
	};
}

/**
 * One frame of the pointing-hand control (in execution order): tap, demo, target, movement, cursor, values.
 * br: breathing of this frame.
 */
export function pointStep(st: HandState, c: HandContext, cam: Fit, br: Breath): DrawValues {
	const obj = objectSpace(cam, br);
	const [mx, my] = obj(c.m.x, c.m.y);
	const touch = c.m.type === 'touch';
	const e: Input = { obj, mx, my, touch };
	if (!st.demo) st.demo = { n: 0, idleSince: null, next: 0, off: demoDone() };
	const dm = st.demo;
	tap(st, c, e, dm);
	runDemo(st, c, e, dm);
	const z = chooseTarget(st, c, e);
	const ht = move(st, c, cam, e, z, dm);
	setCursor(st, !!(z.follows || z.pend));
	st.dbg = {
		m: { x: c.m.x, y: c.m.y, in: c.m.in, down: c.m.down, type: c.m.type },
		tg: z.tg,
		endOn: c.endOn,
		tap: st.tap,
	};
	return buildValues(st, c, cam, br, ht, touch);
}
