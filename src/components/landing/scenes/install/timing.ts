// Timing functions of the install flows: springs, curves, tap path. All pure functions of time t (seconds),
// so jumping to a step always yields the same state as the played-through flow.

import type { Tap } from './types';

export const cl = (x: number, a = 0, b = 1): number => (x < a ? a : x > b ? b : x);
export const mix = (a: number, b: number, p: number): number => a + (b - a) * p;

/** Curve x(0..1) -> y. */
type Curve = (x: number) => number;

/** CSS cubic-bezier as a function x(0..1) -> y. Newton with bisection fallback. */
export function bez(x1: number, y1: number, x2: number, y2: number): Curve {
	const cx = 3 * x1;
	const bx = 3 * (x2 - x1) - cx;
	const ax = 1 - cx - bx;
	const cy = 3 * y1;
	const by = 3 * (y2 - y1) - cy;
	const ay = 1 - cy - by;
	const X = (s: number) => ((ax * s + bx) * s + cx) * s;
	const Y = (s: number) => ((ay * s + by) * s + cy) * s;
	const dX = (s: number) => (3 * ax * s + 2 * bx) * s + cx;
	return (x) => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;
		let s = x;
		for (let i = 0; i < 6; i++) {
			const e = X(s) - x;
			if (Math.abs(e) < 1e-5) return Y(s);
			const d = dX(s);
			if (Math.abs(d) < 1e-6) break;
			s -= e / d;
		}
		let lo = 0;
		let hi = 1;
		s = x;
		for (let i = 0; i < 24; i++) {
			const e = X(s) - x;
			if (Math.abs(e) < 1e-5) break;
			if (e > 0) hi = s;
			else lo = s;
			s = (lo + hi) / 2;
		}
		return Y(s);
	};
}

/** Ease-out like iOS sheets (fast, long tail), without overshoot. */
export const easeOut = bez(0.22, 1, 0.36, 1);
/** Soft easing in and out (tap paths, system transitions). */
export const io = bez(0.42, 0, 0.2, 1);
/** Material "emphasized decelerate". */
export const mat = bez(0.05, 0.7, 0.1, 1);

/**
 * Damped spring from rest to 1: ζ damping ratio, wn natural frequency in rad/s, tau seconds since start.
 * ζ 0.59 and ωn 16.6 give 10 % overshoot after 235 ms (measured iOS side menu, INSTALL-FLOWS 2.6).
 */
export function spring(tau: number, z = 0.59, wn = 16.6): number {
	if (tau <= 0) return 0;
	const wd = wn * Math.sqrt(1 - z * z);
	return 1 - Math.exp(-z * wn * tau) * (Math.cos(wd * tau) + ((z * wn) / wd) * Math.sin(wd * tau));
}

/** Progress 0..1 of a segment [t0, t0 + d]. */
export const seg = (t: number, t0: number, d: number): number => cl((t - t0) / d);

/** State of the tap indicator: opacity, position, press scale. */
export interface TapState {
	o: number;
	x: number;
	y: number;
	s: number;
}

/**
 * Tap indicator. taps: [{ t, x, y, g }] in time order, g = group (same step, the finger moves from target to target).
 * Result { o, x, y, s } at time t. Arrival 150 ms before the tap, press 1 -> 0.85 -> 1 in 160 ms,
 * paths as a curved line with ease-in-out, faded out between groups.
 */
export function tapAt(taps: readonly Tap[], t: number): TapState {
	let o = 0;
	let x = 0;
	let y = 0;
	let s = 1;
	for (let i = 0; i < taps.length; i++) {
		const c = taps[i];
		if (!c) break;
		const prev = taps[i - 1];
		const next = taps[i + 1];
		const first = !prev || prev.g !== c.g;
		const last = !next || next.g !== c.g;
		const t1 = c.t - 0.15;
		// Range of this tap: from the approach until the next tap or the fade-out
		const start = prev && !first ? prev.t + 0.2 : c.t - 0.62;
		const stop = next && !last ? next.t - 0.62 : c.t + 0.55;
		if (t < start || t > stop) continue;
		if (prev && !first) {
			// Path from the previous target, with a wait at the start if the taps are far apart in time
			const dur = Math.min(0.75, Math.max(0.25, c.t - prev.t - 0.4));
			const p = io(seg(t, t1 - dur, dur));
			const dx = c.x - prev.x;
			const dy = c.y - prev.y;
			const k = (i % 2 ? 1 : -1) * 0.16;
			const mx = (prev.x + c.x) / 2 - dy * k;
			const my = (prev.y + c.y) / 2 + dx * k;
			const u = 1 - p;
			x = u * u * prev.x + 2 * u * p * mx + p * p * c.x;
			y = u * u * prev.y + 2 * u * p * my + p * p * c.y;
			o = 1;
		} else {
			const p = io(seg(t, c.t - 0.62, 0.47));
			x = mix(c.x + 26, c.x, p);
			y = mix(c.y + 48, c.y, p);
			o = cl((t - (c.t - 0.62)) / 0.25);
		}
		if (last && t > c.t + 0.2) o = Math.min(o, 1 - cl((t - (c.t + 0.2)) / 0.35));
		const d = t - c.t;
		if (d > -0.04 && d < 0.12)
			s = d < 0.04 ? mix(1, 0.85, (d + 0.04) / 0.08) : mix(0.85, 1, (d - 0.04) / 0.08);
		return { o, x, y, s };
	}
	return { o: 0, x, y, s };
}
