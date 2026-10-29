// Hintergrundpunkte des Hero-Titels: 220 Sterne in der oberen Hälfte, flackern leise.
// Das Feld füllt die ganze Fläche (nicht nur 1280 x 800), bei 1280 x 800 liegen die Punkte wie im Entwurf.

import { hsh } from '../../core/math';

export const STAR_COUNT = 220;
// Dichte des Entwurfs (220 Punkte auf 1280 x 360 px) bleibt auf jeder Fläche gleich.
const DENSITY = STAR_COUNT / (1280 * 360);

const contexts = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();

/** Zeichnet die Sterne. cv: sichtbares 2D-Canvas, W und H in CSS-Pixeln, dpr Pixelfaktor, t Sekunden. */
export function drawStars(
	cv: HTMLCanvasElement,
	W: number,
	H: number,
	dpr: number,
	t: number,
): void {
	let ctx = contexts.get(cv);
	if (!ctx) {
		const next = cv.getContext('2d');
		if (!next) return;
		ctx = next;
		contexts.set(cv, ctx);
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
	const n = Math.max(90, Math.round(DENSITY * W * H * 0.45));
	for (let q = 0; q < n; q++) {
		const x = hsh(q, 21) * W;
		const y = hsh(q, 22) * H * 0.45;
		const a = hsh(q, 23);
		ctx.globalAlpha = 0.2 + 0.4 * a * (0.6 + 0.4 * Math.sin(t * 1.7 + x));
		ctx.fillRect(x, y, 1.2, 1.2);
	}
	ctx.globalAlpha = 1;
}
