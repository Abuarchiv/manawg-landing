// Timeline of the intro stage.
//
// The stage sticks to the window over INTRO_SCREENS screen heights. The scroll distance s (0..1)
// maps to the choreography progress P: P = warp(s). All scene marks (look, mx, split,
// zoom, dive, fpA, endA, flood coverage, card curve) stay defined in P.

export const INTRO_SCREENS = 10;

// Piecewise linear mapping s -> P, knots (s, P).
const KNOTS = [
	[0, 0],
	[0.496, 0.62],
	[0.856, 0.9],
	[0.896, 0.95],
	[1, 1],
] as const satisfies readonly (readonly [s: number, P: number])[];

/** Knot column: 0 = scroll distance s, 1 = progress P. */
type Column = 0 | 1;

function map(x: number, from: Column, to: Column): number {
	const a: number[] = KNOTS.map((k) => k[from]);
	const b: number[] = KNOTS.map((k) => k[to]);
	if (x <= (a[0] ?? 0)) return b[0] ?? 0;
	for (let i = 1; i < a.length; i++) {
		const a1 = a[i] ?? 0;
		if (x <= a1) {
			const a0 = a[i - 1] ?? 0;
			const b0 = b[i - 1] ?? 0;
			const t = (x - a0) / (a1 - a0);
			return b0 + ((b[i] ?? 0) - b0) * t;
		}
	}
	return b[b.length - 1] ?? 0;
}

/** Scroll distance s (0..1) -> progress P (0..1). */
export const warp = (s: number): number => map(s, 0, 1);

/** Progress P -> scroll distance s, inverse of warp. */
export const unwarp = (P: number): number => map(P, 1, 0);
