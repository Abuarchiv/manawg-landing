// Zeitfunktionen der Installationsabläufe: Federn, Kurven, Tipp-Weg. Alles reine Funktionen der Zeit t (Sekunden),
// damit ein Sprung auf einen Schritt jederzeit denselben Zustand ergibt wie der durchlaufene Ablauf.

import type { Tap } from './types';

export const cl = (x: number, a = 0, b = 1): number => (x < a ? a : x > b ? b : x);
export const mix = (a: number, b: number, p: number): number => a + (b - a) * p;

/** Kurve x(0..1) -> y. */
type Curve = (x: number) => number;

/** CSS-cubic-bezier als Funktion x(0..1) -> y. Newton mit Rückfall auf Bisektion. */
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

/** Auslauf wie bei iOS-Blättern (schnell, langer Schwanz), ohne Überschwinger. */
export const easeOut = bez(0.22, 1, 0.36, 1);
/** Weiches Ein- und Ausgleiten (Tipp-Wege, Systemübergänge). */
export const io = bez(0.42, 0, 0.2, 1);
/** Material „emphasized decelerate“. */
export const mat = bez(0.05, 0.7, 0.1, 1);

/**
 * Gedämpfte Feder aus der Ruhe auf 1: ζ Dämpfungsgrad, wn Eigenfrequenz in rad/s, tau Sekunden seit Beginn.
 * ζ 0,59 und ωn 16,6 ergeben 10 % Überschwinger nach 235 ms (gemessenes iOS-Seitenmenü, INSTALL-FLOWS 2.6).
 */
export function spring(tau: number, z = 0.59, wn = 16.6): number {
	if (tau <= 0) return 0;
	const wd = wn * Math.sqrt(1 - z * z);
	return 1 - Math.exp(-z * wn * tau) * (Math.cos(wd * tau) + ((z * wn) / wd) * Math.sin(wd * tau));
}

/** Fortschritt 0..1 eines Abschnitts [t0, t0 + d]. */
export const seg = (t: number, t0: number, d: number): number => cl((t - t0) / d);

/** Zustand der Tipp-Anzeige: Deckkraft, Lage, Druck-Skalierung. */
export interface TapState {
	o: number;
	x: number;
	y: number;
	s: number;
}

/**
 * Tipp-Anzeige. taps: [{ t, x, y, g }] in Zeitfolge, g = Gruppe (gleicher Schritt, der Finger wandert von Ziel zu Ziel).
 * Ergebnis { o, x, y, s } zur Zeit t. Ankunft 150 ms vor dem Tipp, Druck 1 -> 0,85 -> 1 in 160 ms,
 * Wege als gebogene Kurve mit ease-in-out, zwischen den Gruppen ausgeblendet.
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
		// Bereich dieses Tipps: von der Anreise bis zum nächsten Tipp oder zum Ausblenden
		const start = prev && !first ? prev.t + 0.2 : c.t - 0.62;
		const stop = next && !last ? next.t - 0.62 : c.t + 0.55;
		if (t < start || t > stop) continue;
		if (prev && !first) {
			// Weg vom vorigen Ziel, mit Wartezeit am Anfang, falls der Abstand der Tipps groß ist
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
