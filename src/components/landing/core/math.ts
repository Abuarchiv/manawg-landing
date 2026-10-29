// Shared math of all scenes: clamping, easing, a table-based sine, hash noise and the distance field of the mark.

export const cl = (x: number, a = 0, b = 1): number => Math.min(b, Math.max(a, x));
export const ss = (x: number): number => {
	const c = cl(x);
	return c * c * (3 - 2 * c);
};
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
/** Smoothing factor k per 60 Hz step converted to the frame duration dt: same pace at any frame rate. */
export const lag = (k: number, dt: number): number => 1 - (1 - k) ** (dt * 60);
export const ease = (x: number): number => 1 - (1 - cl(x)) ** 4;

// Sine and cosine from a table (4096 sample points, linear, error below 1e-6), more than twice as fast as
// Math.sin in loops over thousands of points per frame (flow field of the depth scene).
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

// 4x4 Bayer matrix for dithering the halftone areas.
export const BAYER: readonly number[] = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// Integer hash (stable, without Math.random).
export const hsh = (i: number, j: number): number => {
	let h = (i * 374761393 + j * 668265263) | 0;
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
// Smooth minimum (distance fields).
const smoothMin = (a: number, b: number, k: number): number => {
	const h = Math.max(k - Math.abs(a - b), 0) / k;
	return Math.min(a, b) - h * h * k * 0.25;
};

// One circle of the mark as (x, y, r).
type Circle = readonly [x: number, y: number, r: number];

// The ManaWG mark: eight circles (x, y, r) on a 416 x 346 grid, centre (208, 173).
const MARK_CIRCLES = [
	[200, 198, 80],
	[77, 105, 52],
	[142, 302, 33],
	[274, 297, 44],
	[194, 32, 29],
	[288, 70, 42],
	[360, 177, 56],
	[42, 239, 44],
] as const satisfies readonly Circle[];

// Distance field of the mark, negative inside.
export const aMark = (x: number, y: number): number => {
	let d = 1e9;
	for (const c of MARK_CIRCLES) d = smoothMin(d, Math.hypot(x - c[0], y - c[1]) - c[2], 38);
	return Math.max(d, 23 - Math.hypot(x - 207, y - 175));
};

// Rest positions of the eight circles: two-dimensional (mountain, sun) and three-dimensional (organ).
export const HOME: readonly Circle[] = MARK_CIRCLES.map(
	(b): Circle => [(b[0] - 208) / 600, -(b[1] - 173) / 600, b[2] / 600],
);
export const HOME3: readonly Circle[] = MARK_CIRCLES.map(
	(b): Circle => [(b[0] - 208) / 110, -(b[1] - 173) / 110, b[2] / 110],
);
