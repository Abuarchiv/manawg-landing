// Glyph choice by shape instead of brightness (after Alex Harri, "ASCII characters are not pixels", 2026): every
// cell is sampled in six staggered circles (two columns of three), the ten circles just outside the cell sharpen the
// edge, and the glyph whose own coverage of the six circles lies nearest wins. Diagonals come out as / and \,
// stems as |, rounds as ( ), the inside of a shape as #. Pure function: no DOM, runs once per build, not per frame.

import { cl } from './math.ts';

/** Glyph set: edges and the fill. Index 0 (space) is never returned. */
export const SHAPE_GLYPHS = " .,'`-_/\\|()#";

// Coverage of each glyph in the six inner circles (JetBrains Mono 500 in a 0.6 x 1 cell, centred like canvas
// textAlign center / textBaseline middle), normalised per circle over the set. Measured offline from the font file.
const V: readonly (readonly number[])[] = [
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0.416, 0.48],
	[0, 0, 0, 0, 0.837, 0.309],
	[0.399, 0.227, 0.019, 0.084, 0, 0],
	[0.308, 0.298, 0, 0, 0, 0],
	[0, 0, 0.485, 0.415, 0, 0],
	[0, 0, 0, 0, 0.678, 0.219],
	[0, 1, 0.485, 0.527, 1, 0],
	[1, 0, 0.384, 0.317, 0, 1],
	[0.389, 0.488, 0.347, 0.39, 0.406, 0.452],
	[0.514, 0.829, 0.801, 0.012, 0.395, 0.671],
	[0.76, 0.303, 0.017, 0.765, 0.841, 0.584],
	[0.624, 0.472, 1, 1, 0.473, 0.691],
];
// Inner circles (x, y in cells): left column lower, right column higher
const INNER = [0.28, 0.2, 0.72, 0.14, 0.28, 0.52, 0.72, 0.46, 0.28, 0.84, 0.72, 0.78];
// Outer circles (x, y, inner circle they sharpen): above, left, right and below the cell
const OUTER = [
	0.28, -0.14, 0, 0.72, -0.2, 1, -0.22, 0.2, 0, -0.22, 0.52, 2, -0.22, 0.84, 4, 1.22, 0.14, 1, 1.22,
	0.46, 3, 1.22, 0.78, 5, 0.28, 1.18, 4, 0.72, 1.12, 5,
];
const RADIUS = 0.25; // circle radius in cell widths
const EDGE = 3; // exponent of the directional contrast (outer circles)
const GLOBAL = 2.2; // exponent of the contrast inside the cell

/** Cell grid on the mask: origin, cell size in mask pixels, number of columns and rows. */
export interface CellGrid {
	x0: number;
	y0: number;
	cw: number;
	ch: number;
	cols: number;
	rows: number;
}

/**
 * Glyph per cell (index into SHAPE_GLYPHS, -1 = empty) for a coverage mask of w x h pixels. The value of pixel i is
 * data[i * stride + offset] (0..255), so canvas RGBA data (stride 4, offset 3) works without copying.
 */
export function shapeGlyphs(
	data: ArrayLike<number>,
	w: number,
	h: number,
	g: CellGrid,
	stride = 4,
	offset = 3,
): Int16Array {
	// Summed-area table of the coverage: every circle mean costs four reads
	const W1 = w + 1;
	const sat = new Float64Array(W1 * (h + 1));
	for (let y = 0; y < h; y++) {
		let row = 0;
		for (let x = 0; x < w; x++) {
			row += (data[(y * w + x) * stride + offset] ?? 0) / 255;
			sat[(y + 1) * W1 + x + 1] = (sat[y * W1 + x + 1] ?? 0) + row;
		}
	}
	// Circle mean approximated by the square of equal area
	const r = Math.max(0.5, RADIUS * g.cw * 0.886);
	const mean = (px: number, py: number): number => {
		const xa = cl(Math.round(px - r), 0, w);
		const xb = cl(Math.round(px + r), 0, w);
		const ya = cl(Math.round(py - r), 0, h);
		const yb = cl(Math.round(py + r), 0, h);
		const n = (xb - xa) * (yb - ya);
		if (n <= 0) return 0;
		const s =
			(sat[yb * W1 + xb] ?? 0) -
			(sat[ya * W1 + xb] ?? 0) -
			(sat[yb * W1 + xa] ?? 0) +
			(sat[ya * W1 + xa] ?? 0);
		return s / n;
	};
	const out = new Int16Array(g.cols * g.rows).fill(-1);
	const v = new Float64Array(6);
	for (let row = 0; row < g.rows; row++)
		for (let col = 0; col < g.cols; col++) {
			const cx = g.x0 + col * g.cw;
			const cy = g.y0 + row * g.ch;
			let any = 0;
			for (let i = 0; i < 6; i++) {
				v[i] = mean(cx + (INNER[2 * i] ?? 0) * g.cw, cy + (INNER[2 * i + 1] ?? 0) * g.ch);
				any = Math.max(any, v[i] ?? 0);
			}
			if (any < 0.02) continue;
			// Directional contrast: a dark neighbour outside pushes the circle next to it down (edge stays an edge)
			for (let k = 0; k < 10; k++) {
				const e = mean(cx + (OUTER[3 * k] ?? 0) * g.cw, cy + (OUTER[3 * k + 1] ?? 0) * g.ch);
				const i = OUTER[3 * k + 2] ?? 0;
				const vi = v[i] ?? 0;
				const m = Math.max(vi, e);
				if (m > 1e-4) v[i] = m * (vi / m) ** EDGE;
			}
			// Contrast inside the cell: the brightest circle stays, the others are pushed down
			let mx = 0;
			for (let i = 0; i < 6; i++) mx = Math.max(mx, v[i] ?? 0);
			if (mx > 1e-4) for (let i = 0; i < 6; i++) v[i] = mx * ((v[i] ?? 0) / mx) ** GLOBAL;
			let best = 0;
			let bd = Number.POSITIVE_INFINITY;
			for (let k = 0; k < V.length; k++) {
				const q = V[k] ?? [];
				let d = 0;
				for (let i = 0; i < 6; i++) d += ((q[i] ?? 0) - (v[i] ?? 0)) ** 2;
				if (d < bd) {
					bd = d;
					best = k;
				}
			}
			if (best > 0) out[row * g.cols + col] = best;
		}
	return out;
}
