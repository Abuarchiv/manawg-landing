// Gemeinsame Mathematik aller Szenen. Werte und Formeln 1:1 aus dem Entwurf (final.dc.html),
// die zwei Fassungen aus hero.js und art.js sind zusammengeführt.

export const cl = (x: number, a = 0, b = 1): number => Math.min(b, Math.max(a, x));
export const ss = (x: number): number => {
	const c = cl(x);
	return c * c * (3 - 2 * c);
};
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
/** Glättungsfaktor k je 60-Hz-Schritt auf die Bilddauer dt umgerechnet: gleiches Tempo bei jeder Bildrate. */
export const lag = (k: number, dt: number): number => 1 - (1 - k) ** (dt * 60);
export const ease = (x: number): number => 1 - (1 - cl(x)) ** 4;

// Sinus und Kosinus aus einer Tabelle (4096 Stützstellen, linear, Fehler unter 1e-6), gut doppelt so schnell wie
// Math.sin in Schleifen über tausende Punkte je Bild (Strömungsfeld der Tiefe).
const SN = 4096;
const SK = SN / (2 * Math.PI);
const STAB = new Float64Array(SN + 1).map((_, i) => Math.sin(i / SK));
export const sn = (v: number): number => {
	let t = v * SK;
	t -= Math.floor(t / SN) * SN;
	const i = t | 0;
	const a = STAB[i] as number;
	return a + ((STAB[i + 1] as number) - a) * (t - i);
};
export const cs = (v: number): number => sn(v + Math.PI / 2);

// 4x4-Bayer-Matrix für das Dithering der Halbton-Flächen.
export const BAYER: readonly number[] = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// Ganzzahl-Hash und Value-Noise (stabil, ohne Math.random).
export const hsh = (i: number, j: number): number => {
	let h = (i * 374761393 + j * 668265263) | 0;
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
export const vnz = (x: number, y: number): number => {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const xf = x - xi;
	const yf = y - yi;
	const u = xf * xf * (3 - 2 * xf);
	const v = yf * yf * (3 - 2 * yf);
	const a = hsh(xi, yi);
	const b = hsh(xi + 1, yi);
	const c = hsh(xi, yi + 1);
	const d = hsh(xi + 1, yi + 1);
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

// Weiches Minimum (Abstandsfelder).
export const smn = (a: number, b: number, k: number): number => {
	const h = Math.max(k - Math.abs(a - b), 0) / k;
	return Math.min(a, b) - h * h * k * 0.25;
};

// Abstand zur Kapsel (px, py) -> (ax, ay)-(bx, by) mit Radius r.
export const cap = (
	px: number,
	py: number,
	ax: number,
	ay: number,
	bx: number,
	by: number,
	r: number,
): number => {
	const pax = px - ax;
	const pay = py - ay;
	const bax = bx - ax;
	const bay = by - ay;
	const h = cl((pax * bax + pay * bay) / (bax * bax + bay * bay));
	return Math.hypot(pax - bax * h, pay - bay * h) - r;
};

// Abstand zur ungleichen Kapsel (Radius ra bei a, rb bei b).
export const uc = (
	px: number,
	py: number,
	ax: number,
	ay: number,
	bx: number,
	by: number,
	ra: number,
	rb: number,
): number => {
	const x = px - ax;
	const y = py - ay;
	const ex = bx - ax;
	const ey = by - ay;
	const h = ex * ex + ey * ey;
	const qx = Math.abs((x * ey - y * ex) / h);
	const qy = (x * ex + y * ey) / h;
	const bb = ra - rb;
	const cx = Math.sqrt(Math.max(h - bb * bb, 1e-6));
	const cy = bb;
	const k = cx * qy - cy * qx;
	const m = cx * qx + cy * qy;
	const n = qx * qx + qy * qy;
	if (k < 0) return Math.sqrt(h * n) - ra;
	if (k > cx) return Math.sqrt(h * (n + 1 - 2 * qy)) - rb;
	return m - ra;
};

// Ein Kreis des Zeichens als (x, y, r).
export type Circle = readonly [x: number, y: number, r: number];

// Das ManaWG-Zeichen: acht Kreise (x, y, r) im Raster 416 x 346, Mittelpunkt (208, 173).
export const AB = [
	[200, 198, 80],
	[77, 105, 52],
	[142, 302, 33],
	[274, 297, 44],
	[194, 32, 29],
	[288, 70, 42],
	[360, 177, 56],
	[42, 239, 44],
] as const satisfies readonly Circle[];

// Abstandsfeld des Zeichens, negativ innen.
export const aMark = (x: number, y: number): number => {
	let d = 1e9;
	for (const c of AB) d = smn(d, Math.hypot(x - c[0], y - c[1]) - c[2], 38);
	return Math.max(d, 23 - Math.hypot(x - 207, y - 175));
};

// Ruhelagen der acht Kreise: zweidimensional (Berg, Sonne) und dreidimensional (Organ).
export const HOME: readonly Circle[] = AB.map(
	(b): Circle => [(b[0] - 208) / 600, -(b[1] - 173) / 600, b[2] / 600],
);
export const HOME3: readonly Circle[] = AB.map(
	(b): Circle => [(b[0] - 208) / 110, -(b[1] - 173) / 110, b[2] / 110],
);
