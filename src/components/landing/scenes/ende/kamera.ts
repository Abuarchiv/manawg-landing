// Kamera der Ende-Szene (PLAN-V2 4.1 und 4.4, HAND.md Abschnitt 7).
//
// Der Ende-Raum ist 1280 x 800 groß (Handy 650/90/300/620, die Pässe der Hände liegen in diesem Raum).
// kamera() sagt, wie er in die Bühne passt: { f, ox, oy } mit Bühnen-CSS-px = Ende-Raum * f + (ox, oy).
// Ende.tsx setzt daraus --ende-x/-y/-f, hand.draw nutzt dieselbe Funktion (ein Vertrag).

import { type Fit, fitBox } from '../../core/canvas';
import type { Mode } from '../../core/loop';

/** Hochformat, wie in core/loop.ts modeOf: Breite/Höhe <= 1 oder Breite < 700. */
export const istHoch = (W: number, H: number): boolean => W / H <= 1 || W < 700;

// Hochformat: Ausschnitt im Ende-Raum (Daumen links bei x ~585). Das Handy füllt etwa 78 % der Breite, die
// Finger rechts laufen aus dem Bild (natürlicher Anschnitt), der Unterarm wird unten angeschnitten.
const PHONE_X = 650;
const PHONE_W = 300;
const SPAN0 = 584; // linke Kante des Daumens im Ende-Raum
const SPAN1 = 998; // rechte Kante der Fingerkuppen
const PHONE_TOP = 90;
const PHONE_H = 620;

let safeTopPx = -1;
/** safe-area-inset-top in CSS-px (einmal gemessen). */
function safeTop(): number {
	if (safeTopPx >= 0) return safeTopPx;
	if (typeof document === 'undefined') return 0;
	const p = document.createElement('div');
	p.style.cssText = 'position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top,0px)';
	document.body.appendChild(p);
	safeTopPx = Number.parseFloat(getComputedStyle(p).paddingTop) || 0;
	p.remove();
	return safeTopPx;
}

/**
 * Platz oben im Hochformat für Titel und Knopf (CSS-px). Muss zu Ende.module.css passen:
 * Abstand oben max(72, safe-top + 56), Titel (Schrift 40 bis 60, eine Zeile), Abstand 16, Knopf 40,
 * Abstand zum Handy 20.
 */
export function titelPlatz(W: number, _safeH: number): number {
	const oben = Math.max(72, 56 + safeTop());
	const fs = Math.max(40, Math.min(0.08 * W, 60));
	return oben + fs + 16 + 40 + 20;
}

export function kamera(W: number, H: number, safeH: number, _mode: Mode): Fit {
	if (!istHoch(W, H)) return fitBox(W, safeH, 1280, 800, 1.25);
	const top = titelPlatz(W, safeH);
	// Daumen links (x 584) und Fingerkuppen rechts (x 998) bleiben mit mindestens 8 px Rand im Bild
	const f = Math.max(
		0.2,
		Math.min((0.78 * W) / PHONE_W, (H - top - 12) / PHONE_H, 1.25, (W - 16) / (SPAN1 - SPAN0)),
	);
	const links = Math.max(8, (W - (SPAN1 - SPAN0) * f) / 2) + (PHONE_X - SPAN0) * f;
	return {
		f,
		ox: links - PHONE_X * f,
		oy: top - PHONE_TOP * f,
	};
}
