// Zeitachse der Intro-Bühne (PLAN-V2 2.4).
//
// Die Bühne klebt über INTRO_SCREENS Bildschirmhöhen am Fenster. Aus der Scroll-Strecke s (0..1)
// wird der Fortschritt P der Choreografie: P = warp(s). Alle Marken der Szenen (look, mx, split,
// zoom, dive, fpA, endA, Flut-Deckung, Kartenkurve) bleiben in P definiert.

export const INTRO_SCREENS = 8;

// Stückweise lineare Abbildung s -> P, Knoten (s, P).
export const KNOTS = [
	[0, 0],
	[1, 1],
];

function map(x, from, to) {
	const a = KNOTS.map((k) => k[from]);
	const b = KNOTS.map((k) => k[to]);
	if (x <= a[0]) return b[0];
	for (let i = 1; i < a.length; i++) {
		if (x <= a[i]) {
			const t = (x - a[i - 1]) / (a[i] - a[i - 1]);
			return b[i - 1] + (b[i] - b[i - 1]) * t;
		}
	}
	return b[b.length - 1];
}

/** Scroll-Strecke s (0..1) -> Fortschritt P (0..1). */
export const warp = (s) => map(s, 0, 1);

/** Fortschritt P -> Scroll-Strecke s, Umkehrung von warp. */
export const unwarp = (P) => map(P, 1, 0);
