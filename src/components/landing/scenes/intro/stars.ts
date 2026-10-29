// Background dots of the hero title: 220 stars in the upper half, flickering softly.
// The field fills the whole area (not just 1280 x 800); at 1280 x 800 the dots sit as in the design.

import { hsh } from '../../core/math';

export const STAR_COUNT = 220;
// The design density (220 dots on 1280 x 360 px) stays the same on every area.
const DENSITY = STAR_COUNT / (1280 * 360);

const contexts = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();

/** Draws the stars. cv: visible 2D canvas, W and H in CSS pixels, dpr pixel ratio, t seconds. */
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
