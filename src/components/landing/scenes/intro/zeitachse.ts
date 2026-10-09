// Zeitachse der Intro-Bühne (PLAN-V2 2.4).
//
// Die Bühne klebt über INTRO_SCREENS Bildschirmhöhen am Fenster. Aus der Scroll-Strecke s (0..1)
// wird der Fortschritt P der Choreografie: P = warp(s). Alle Marken der Szenen (look, mx, split,
// zoom, dive, fpA, endA, Flut-Deckung, Kartenkurve) bleiben in P definiert.
//
// Strecke in Bildschirmen (12 gesamt): Berg und Zeichen 4 · Tauchgang und Flut 1,6 · Wohnung 3 ·
// Ankunft der Ende-Ebene 1 · Alltag teilen 0,9 · Kamerafahrt ins Handy 1 (P bleibt 1, zoomVon steigt) ·
// die App allein im Fenster 0,5 (bedienbar, nichts bewegt sich).

import { ss } from '../../core/math';

export const INTRO_SCREENS = 12;

// Stückweise lineare Abbildung s -> P, Knoten (s, P). Der letzte Abschnitt ist flach (P = 1): dort läuft
// die Kamerafahrt (zoomVon), die Choreografie steht.
export const KNOTS = [
	[0, 0],
	[0.3333, 0.5],
	[0.4667, 0.62],
	[0.7167, 0.9],
	[0.8, 0.95],
	[0.875, 1],
	[1, 1],
] as const satisfies readonly (readonly [s: number, P: number])[];

/** Kamerafahrt ins Handy: Beginn und Ende (Scroll-Strecke s), danach steht die App bis zum Ende der Bühne. */
export const ZOOM_AB = 0.875;
export const ZOOM_BIS = 0.9583;

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
			const t = a1 === a0 ? 1 : (x - a0) / (a1 - a0);
			return b0 + ((b[i] ?? 0) - b0) * t;
		}
	}
	return b[b.length - 1] ?? 0;
}

/** Scroll-Strecke s (0..1) -> Fortschritt P (0..1). */
export const warp = (s: number): number => map(s, 0, 1);

/** Fortschritt P -> Scroll-Strecke s, Umkehrung von warp (P 1 ergibt den Beginn der Kamerafahrt). */
export const unwarp = (P: number): number => map(P, 1, 0);

/** Kamerafahrt ins Handy (0..1) aus der Scroll-Strecke s: läuft im flachen Schlussabschnitt. */
export const zoomVon = (s: number): number => ss((s - ZOOM_AB) / (ZOOM_BIS - ZOOM_AB));
