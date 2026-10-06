/**
 * Choreografie der acht Körper. Reine Mathematik ohne DOM, damit sie testbar bleibt.
 *
 * Die acht Körper sind die Bildmarke (brand-mark.json der App): acht Kreise auf einem
 * 416 × 346 Canvas. Eine Markeinheit ist hier 0,01 Welteinheit, die Marke ist also
 * gut 4 Einheiten breit und um den Ursprung zentriert.
 */

export type Ball = [x: number, y: number, z: number, r: number];

const MARK = [
	[200, 198, 80],
	[77, 105, 52],
	[142, 302, 33],
	[274, 297, 44],
	[194, 32, 29],
	[288, 70, 42],
	[360, 177, 56],
	[42, 239, 44],
] as const;

/** Aussparung der Marke (207, 175, r 22) in Weltkoordinaten. */
export const APERTURE = { x: (207 - 208) / 100, y: -(175 - 173) / 100, r: 0.22 };

export const CAMERA_Z = 7;
export const FOV_Y = (40 * Math.PI) / 180;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
	const t = clamp01((v - a) / (b - a));
	return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixBall = (a: Ball, b: Ball, t: number): Ball => [
	mix(a[0], b[0], t),
	mix(a[1], b[1], t),
	mix(a[2], b[2], t),
	mix(a[3], b[3], t),
];

/** Sichtbare halbe Breite/Höhe der Ebene z = 0. */
export function viewHalf(aspect: number) {
	const hh = CAMERA_Z * Math.tan(FOV_Y / 2);
	return { hw: hh * aspect, hh };
}

/** Maßstab, mit dem die gut 4 Einheiten breite Marke sicher ins Bild passt. */
export function markScale(aspect: number, share = 0.78) {
	const { hw, hh } = viewHalf(aspect);
	return Math.min((hw * 2 * share) / 4.3, (hh * 2 * share) / 3.6, 1.15);
}

export function markBalls(s: number, dx = 0, dy = 0): Ball[] {
	return MARK.map(([cx, cy, r]) => [((cx - 208) / 100) * s + dx, (-(cy - 173) / 100) * s + dy, 0, (r / 100) * s]);
}

// Verstreut, als Bruchteil der halben Sichtbreite/-höhe. Bewusst asymmetrisch.
const SCATTER = [
	[-0.62, 0.42, -0.6],
	[0.74, 0.58, 0.4],
	[-0.3, -0.62, 0.9],
	[0.5, -0.44, -1.2],
	[-0.92, -0.2, 0.3],
	[0.9, -0.02, -0.4],
	[0.16, 0.8, -1.6],
	[0.02, -0.92, 0.2],
] as const;

export function scatterBalls(aspect: number, time: number): Ball[] {
	const { hw, hh } = viewHalf(aspect);
	const s = Math.max(markScale(aspect, 0.9), 0.55) * 1.35;
	return MARK.map(([, , r], i) => {
		const [fx, fy, z] = SCATTER[i];
		const w = time * (0.25 + i * 0.03);
		return [fx * hw + Math.sin(w + i) * 0.12, fy * hh + Math.cos(w * 1.3 + i * 2) * 0.1, z, (r / 100) * s];
	});
}

/** Geld: ein Körper trägt alles (48 €), dann teilt er sich in vier gleiche Teile. */
export function moneyBalls(t: number, aspect: number): Ball[] {
	const s = markScale(aspect);
	const { hw } = viewHalf(aspect);
	const start = markBalls(s);
	const gather = smooth(0, 0.35, t);
	const split = smooth(0.5, 0.85, t);
	const big = 1.05 * Math.min(1, hw / 1.6);
	const spread = Math.min(1.35, hw * 0.42);
	return start.map((b, i) => {
		const heavy: Ball = i === 0 ? [0, 0, 0, big] : [0, 0, 0, 0];
		const shared: Ball = i < 4 ? [(i - 1.5) * spread, 0, 0, big * 0.48] : [0, 0, 0, 0];
		return mixBall(mixBall(b, heavy, gather), shared, split);
	});
}

export const TASKS = ['Bad', 'Küche', 'Müll', 'Flur'] as const;
export const NAMES = ['Lea', 'Max', 'Jonas', 'Hannah'] as const;

/** Putzplan: vier Körper auf einem Ring, der sich in drei Schritten weiterdreht. */
export function choresBalls(t: number, aspect: number): { balls: Ball[]; turn: number } {
	const { hw, hh } = viewHalf(aspect);
	const ring = Math.min(1.5, hw * 0.55, hh * 0.5);
	const r = ring * 0.34;
	// Drei Übergaben, jede mit eigener Ease und Haltephase.
	const steps = clamp01(t) * 3;
	const whole = Math.floor(Math.min(steps, 2.999));
	const turn = whole + smooth(0.25, 0.85, steps - whole);
	const balls: Ball[] = [];
	for (let i = 0; i < 8; i++) {
		if (i < 4) {
			const a = Math.PI / 2 - (i + turn) * (Math.PI / 2);
			balls.push([Math.cos(a) * ring, Math.sin(a) * ring, 0, r]);
		} else {
			balls.push([0, 0, -0.5, 0]);
		}
	}
	return { balls, turn };
}

/** Projektion eines Weltpunkts auf Bildschirmanteile 0..1 (y nach unten). */
export function project(x: number, y: number, z: number, aspect: number) {
	const f = 1 / Math.tan(FOV_Y / 2);
	const depth = CAMERA_Z - z;
	return { x: 0.5 + ((x * f) / depth / aspect) * 0.5, y: 0.5 - ((y * f) / depth) * 0.5, scale: f / depth };
}

export const euro = (v: number) =>
	new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v);
