// Kamera der Ende-Szene (PLAN-V2 4.1 und 4.4, HAND.md Abschnitt 7).
//
// Der Ende-Raum ist 1280 x 800 groß (Handy 650/90/300/620, die Pässe der Hände liegen in diesem Raum).
// kamera() sagt, wie er in die Bühne passt: { f, ox, oy } mit Bühnen-CSS-px = Ende-Raum * f + (ox, oy).
// Ende.tsx setzt daraus --ende-x/-y/-f, hand.draw nutzt dieselbe Funktion (ein Vertrag).

import { fitBox } from '../../core/canvas';

/** Hochformat, wie in core/loop.js modeOf: Breite/Höhe <= 1 oder Breite < 700. */
export const istHoch = (W, H) => W / H <= 1 || W < 700;

// Hochformat: Ausschnitt im Ende-Raum (Daumen links bei x ~585, Fingerkuppen rechts bis x ~1105)
const HX = 562;
const HW = 566;
const PHONE_TOP = 90;
const PHONE_H = 620;

/**
 * Platz oben im Hochformat für Titel und Knopf (CSS-px). Muss zu Ende.module.css passen:
 * Rand oben, Titel (--t-96, zwei Zeilen à 0,9), Abstand 24, Knopf 48, Abstand zum Handy 24.
 */
export function titelPlatz(W, safeH) {
	const rand = Math.max(20, Math.min(0.03125 * W, 0.05 * safeH));
	const fs = Math.max(54, Math.min(0.075 * W, 0.12 * safeH, 104));
	const gap = Math.max(12, Math.min(0.01875 * W, 0.03 * safeH, 26.4));
	return rand + 1.8 * fs + gap + 48 + 24;
}

/**
 * Einpassung des Ende-Raums in die Bühne.
 * quer: contain-fit von 1280 x 800 (f <= 1,25), zentriert im sicheren Kasten.
 * hoch: Handy mittig unter Titel und Knopf, Daumen und Finger im Bild, der Unterarm läuft unten aus der
 * Bühne (die Pässe tragen den Arm bis y 1400).
 */
export function kamera(W, H, safeH, _mode) {
	if (!istHoch(W, H)) return fitBox(W, safeH, 1280, 800, 1.25);
	const top = titelPlatz(W, safeH);
	const f = Math.max(0.2, Math.min(W / HW, (H - top - 100) / PHONE_H, 1.25));
	return {
		f,
		ox: W / 2 - (HX + HW / 2) * f,
		oy: top - PHONE_TOP * f,
	};
}
