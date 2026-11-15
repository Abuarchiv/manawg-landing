// Timeline of the intro stage.
//
// The stage sticks to the window over INTRO_SCREENS screen heights. The scroll distance s (0..1)
// maps to the choreography progress P: P = warp(s). All scene marks (look, mx, split,
// zoom, dive, fpA, card curve) stay defined in P. The stage ends on the overview of the flat at P 0.9.

export const INTRO_SCREENS = 6.5;

// Piecewise linear mapping s -> P, knots (s, P), placed in screens: the title holds for 0.8 screens
// (fades out by P 0.086), mark, organ and dive (P 0.1–0.62, no text) take 2.2, the flat with its four
// rooms keeps 3.5.
const KNOTS = [
	[0, 0],
	[0.8 / INTRO_SCREENS, 0.1],
	[3 / INTRO_SCREENS, 0.62],
	[1, 0.9],
] as const satisfies readonly (readonly [s: number, P: number])[];

/** Knot column: 0 = scroll distance s, 1 = progress P. */
type Column = 0 | 1;

// Stacked layout (title above, demo phone below; portrait and narrow windows): the hero holds for 1.3 screens,
// because the phone first rises out of the mountain and then stands large; mark, organ and dive take 1.7.
const KNOTS_STACKED = [
	[0, 0],
	[1.3 / INTRO_SCREENS, 0.1],
	[3 / INTRO_SCREENS, 0.62],
	[1, 0.9],
] as const satisfies readonly (readonly [s: number, P: number])[];

/** Stacked layout of the hero, the same condition as the portrait query in HeroTitle and HeroDemo. */
export const isStacked = (W: number, H: number): boolean => W <= H || (W < 700 && H >= 500);

function map(x: number, from: Column, to: Column, stacked: boolean): number {
	const knots = stacked ? KNOTS_STACKED : KNOTS;
	const a: number[] = knots.map((k) => k[from]);
	const b: number[] = knots.map((k) => k[to]);
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
export const warp = (s: number, stacked = false): number => map(s, 0, 1, stacked);

/** Progress P -> scroll distance s, inverse of warp. */
export const unwarp = (P: number, stacked = false): number => map(P, 1, 0, stacked);
