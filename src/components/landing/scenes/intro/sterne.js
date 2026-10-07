// Hintergrundpunkte des Hero-Titels: 220 Sterne in der oberen Hälfte, flackern leise.
// Das Feld füllt die ganze Fläche (nicht nur 1280 x 800), bei 1280 x 800 liegen die Punkte wie im Entwurf.

import { hsh } from '../../core/math';

export const STERNE_ANZAHL = 220;

/** Zeichnet die Sterne. canvas: sichtbares 2D-Canvas, c: Kontext der Bühne (W, H, dpr, t). */
export function zeichneSterne(cv, W, H, dpr, t) {
	let ctx = cv.__ctx;
	if (!ctx) {
		ctx = cv.getContext('2d');
		cv.__ctx = ctx;
	}
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	if (cv.width !== w || cv.height !== h) {
		cv.width = w;
		cv.height = h;
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, W, H);
	ctx.fillStyle = '#FAFAFA';
	for (let q = 0; q < STERNE_ANZAHL; q++) {
		const x = hsh(q, 21) * W;
		const y = hsh(q, 22) * H * 0.45;
		const a = hsh(q, 23);
		ctx.globalAlpha = 0.2 + 0.4 * a * (0.6 + 0.4 * Math.sin(t * 1.7 + x));
		ctx.fillRect(x, y, 1.2, 1.2);
	}
	ctx.globalAlpha = 1;
}
