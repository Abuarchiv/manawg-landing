// Zeitachse der Intro-Bühne (PLAN-V2 2.4).
//
// Die Bühne klebt über INTRO_SCREENS Bildschirmhöhen am Fenster. Aus der Scroll-Strecke s (0..1)
// wird der Fortschritt P der Choreografie: P = warp(s). Alle Marken der Szenen (look, mx, split,
// zoom, dive, fpA, endA, Flut-Deckung, Kartenkurve) bleiben in P definiert.

export const INTRO_SCREENS = 10;

// Stückweise lineare Abbildung s -> P, Knoten (s, P).
export const KNOTS = [
	[0, 0],
	[0.496, 0.62],
	[0.856, 0.9],
	[0.896, 0.95],
	[1, 1],
] as const satisfies readonly (readonly [s: number, P: number])[];

/** Spalte der Knoten: 0 = Scroll-Strecke s, 1 = Fortschritt P. */
type Spalte = 0 | 1;

function map(x: number, from: Spalte, to: Spalte): number {
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

/** Scroll-Strecke s (0..1) -> Fortschritt P (0..1). */
export const warp = (s: number): number => map(s, 0, 1);

/** Fortschritt P -> Scroll-Strecke s, Umkehrung von warp. */
export const unwarp = (P: number): number => map(P, 1, 0);
