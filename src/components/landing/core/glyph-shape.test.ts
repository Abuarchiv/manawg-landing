// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SHAPE_GLYPHS, shapeGlyphs } from './glyph-shape.ts';

// One cell of 30 x 50 px in a 90 x 150 mask (the cell sits in the middle, its neighbours stay empty)
const W = 90;
const H = 150;
const grid = { x0: 30, y0: 50, cw: 30, ch: 50, cols: 1, rows: 1 };

/** Alpha-only mask (stride 1) with the rectangle x0..x1, y0..y1 (in cell units of the middle cell) filled. */
function mask(x0: number, y0: number, x1: number, y1: number): Uint8Array {
	const m = new Uint8Array(W * H);
	for (let y = Math.round(50 + y0 * 50); y < Math.round(50 + y1 * 50); y++)
		for (let x = Math.round(30 + x0 * 30); x < Math.round(30 + x1 * 30); x++) m[y * W + x] = 255;
	return m;
}
const glyphOf = (m: Uint8Array): string => {
	const i = shapeGlyphs(m, W, H, grid, 1, 0)[0] ?? -1;
	return i < 0 ? '' : (SHAPE_GLYPHS[i] ?? '');
};

test('an empty cell gets no glyph', () => {
	assert.equal(glyphOf(new Uint8Array(W * H)), '');
});

test('a fully covered cell inside a larger shape is filled', () => {
	assert.equal(glyphOf(mask(-1, -1, 2, 2)), '#');
});

test('a vertical stroke through the middle reads as a bar', () => {
	assert.equal(glyphOf(mask(0.38, -1, 0.62, 2)), '|');
});

test('a horizontal stroke along the bottom reads as an underscore', () => {
	assert.equal(glyphOf(mask(-1, 0.78, 2, 0.98)), '_');
});
