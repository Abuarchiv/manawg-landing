// The hands of the end scene: one hand holds the phone, the other waits below the screen outside it and
// moves over the target only to tap. Both come from rendered data passes (public/hand/):
// luminance, alpha, normal and depth. They are drawn as a fine halftone (cell grid 1.25 stage px,
// Bayer 4 x 4) with the silhouette smoothed by pixel alpha, in the WebGL2 fragment shader. Without WebGL2 the halftone
// is precomputed in 2D once per resize (without pointer light, the pointing hand as a sprite).
//
// back sits under the phone, front above it (normal blend, dark dots over the glass). Front versus back
// follows from the depth z and the phone silhouette: in front are the thumb and fingertips that extend over the edge
// onto the screen, as well as the pointing hand.
//
// Structure: atlas.ts (load passes), shader.ts (GLSL), gl.ts (WebGL2 path), cpu.ts (2D fallback), pointing.ts
// (pointing-hand control, demo, contact), types.ts, constants.ts. Here: the public interface.

import { type Fit, dprFor, sizeBacking } from '../../../core/canvas';
import { qa } from '../../../core/loop';
import { atlases, isReady } from './atlas';
import { cpuClear, cpuFrame } from './cpu';
import { glFrame, glProbeEnd, glProbeStart, glUsable, makeLayer, readyStep } from './gl';
import { breath, newState, pointStep, states } from './pointing';
import type { HandContext, HandState } from './types';

export { load } from './atlas';

/**
 * Choose the draw mode once (WebGL2 with both layers or 2D fallback). With step at most one expensive
 * part per call (suitability check, first layer, second layer) so that warming up does not blow a frame.
 */
function chooseMode(
	st: HandState,
	back: HTMLCanvasElement,
	front: HTMLCanvasElement,
	step = false,
): void {
	if (st.mode) return;
	const { hold, point } = atlases();
	if (st.usable === undefined) {
		if (!step) {
			st.usable = st.probe
				? (glProbeEnd(st.probe, true) ?? false)
				: glUsable(hold.meta, point.meta);
		} else if (!st.probe) {
			// Part 1 in this frame, part 2 in a later one (the driver compiles in between)
			const p = glProbeStart(hold.meta, point.meta);
			if (p) st.probe = p;
			else st.usable = false;
			return;
		} else {
			const ok = glProbeEnd(st.probe);
			if (ok !== undefined) st.usable = ok;
			return;
		}
	}
	if (step && st.usable && !st.pendingLayers) {
		st.pendingLayers = [makeLayer(back, false)];
		return;
	}
	if (st.usable && st.pendingLayers && st.pendingLayers.length === 1 && step) {
		st.pendingLayers.push(makeLayer(front, true));
		return;
	}
	const l0 = st.usable ? (st.pendingLayers?.[0] ?? makeLayer(back, false)) : null;
	const l1 = st.usable ? (st.pendingLayers?.[1] ?? makeLayer(front, true)) : null;
	if (l0 && l1) {
		st.layers = [l0, l1];
		st.mode = 'gl';
	} else {
		st.mode = 'cpu';
		st.layers = null;
	}
}

function clearAll(st: HandState): void {
	if (st.layers) {
		for (const L of st.layers) {
			if (L.gl && !L.gl.isContextLost() && L.ready) {
				L.gl.clearColor(0, 0, 0, 0);
				L.gl.clear(L.gl.COLOR_BUFFER_BIT);
				L.last = null;
			}
		}
	} else if (st.mode === 'cpu') cpuClear(st);
	st.cpu.key = null;
}

/**
 * Draws both hands. back sits under the phone, front above it.
 * c: stage context, cam: { f, ox, oy } from camera().
 */
export function draw(
	back: HTMLCanvasElement,
	front: HTMLCanvasElement,
	c: HandContext,
	cam: Fit,
): void {
	const t0 = performance.now();
	drawIn(back, front, c, cam);
	const st0 = states.get(back);
	if (st0) st0.ms = (st0.ms ?? 0) * 0.95 + (performance.now() - t0) * 0.05;
}

function drawIn(back: HTMLCanvasElement, front: HTMLCanvasElement, c: HandContext, cam: Fit): void {
	let st = states.get(back);
	if (!st) {
		const next = newState(back, front);
		st = next;
		states.set(back, next);
		qa.hand = () => ({
			mode: next.mode,
			tip: { ...(next.ht ?? {}) },
			quiet: next.quiet.slice(),
			rects: next.rects,
			ms: next.ms,
			dbg: next.dbg,
			gpu: next.layers?.map((L) => L.gpuMs),
		});
	}
	const host = st.host;
	// Warm-up: link shaders and upload textures before entering (one step per frame) so the
	// first visible frame of the hand does not cause a stutter
	if (isReady() && !(c.endA > 0.01) && c.P > 0.5 && !st.warm) {
		chooseMode(st, back, front, true);
		// One step per frame and only until the layers are ready
		if (st.layers)
			st.warm = st.layers.map(readyStep).every(Boolean) || st.layers.some((L) => L.dead);
	}
	if (!(c.endA > 0.01) || !isReady()) {
		if (!st.clean && isReady() && st.mode) {
			clearAll(st);
			st.clean = true;
		}
		if (host?.style.cursor) host.style.cursor = '';
		return;
	}
	st.clean = false;
	const { W, H, t } = c;
	const dpr = dprFor(2);

	chooseMode(st, back, front);
	for (const cv of [back, front]) sizeBacking(cv, W, H, dpr);

	// Breathing: phone and hands move together by ±1.5 px and ±0.4° (period 4 to 6 s), transform only
	const br = c.reduced || st.mode !== 'gl' ? { x: 0, y: 0, r: 0 } : breath(t);
	// Lag: while scrolling, phone and hands trail up to 6 px behind the page (weight in the hand)
	if (!c.reduced) br.y += Math.max(-6, Math.min(6, c.sv * 0.005));
	if (!st.space)
		st.space = back.parentElement?.querySelector<HTMLElement>('[data-ende-space]') ?? null;
	if (st.space) {
		st.space.style.setProperty('--ax', `${br.x.toFixed(3)}px`);
		st.space.style.setProperty('--ay', `${br.y.toFixed(3)}px`);
		st.space.style.setProperty('--ar', `${((br.r * 180) / Math.PI).toFixed(4)}deg`);
	}
	const S = pointStep(st, c, cam, br);
	if (host?.style.cursor) host.style.cursor = '';

	if (st.mode === 'gl' && st.layers) {
		for (const L of st.layers) glFrame(L, S, cam, W, H);
	} else {
		cpuFrame(st, S, cam, W, H, dpr);
		// 2D fallback: no dust, the hands only fade out when scrolling away
		const o = String(1 - c.decay);
		back.style.opacity = o;
		front.style.opacity = o;
	}
}
