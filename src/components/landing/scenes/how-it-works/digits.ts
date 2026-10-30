// The digits 01 to 03 of "How it works": large type as a grid of mono characters (cell 7 px, glyph 8 px).
// The cells sit in fixed CSS pixels. The pointer pushes the
// cells away, springs pull them back. While in motion (intro, pointer) the characters of a cell cycle through the ramp every
// 90 ms; at rest the digit stays still: bright edge of @, body of muted #.

import { loop, qa, register, type SceneState } from '../../core/loop';
import { hsh } from '../../core/math';

const RAMP = '@%#*+=-:';
qa.metrics = {
	...(qa.metrics as Record<string, unknown> | undefined),
	digitCell: 7,
	digitGlyph: 8,
};

/** One grid cell of the digit: rest position (x, y), tone in the ramp, displacement (ox, oy) and velocity (vx, vy). */
interface Cell {
	x: number;
	y: number;
	/** Character at rest: 0 on the edge (@, bright), 2 inside (#, muted). */
	tone: 0 | 2;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
}

/** Pre-rendered glyph sheet: a strip with the glyphs of the ramp, z = edge length of one glyph in device pixels. */
interface Sheet {
	cv: HTMLCanvasElement;
	z: number;
}

interface DigitState extends SceneState {
	cells: Cell[];
	/** Key of the last grid build (text, font state, size, pixel ratio, cell). */
	key: string;
	dirty: boolean;
	/** The last drawn frame had cells in motion. */
	moving: boolean;
	sheetKey: string;
	sheet: Sheet | null;
}

interface DigitOptions {
	text: string;
	/** Cell in CSS pixels. */
	cs?: number;
	/** Glyph in CSS pixels. */
	gl?: number;
}

/** One grid cell of the digit at rest: position in CSS px and tone (0 edge, 2 inside). */
interface GridCell {
	x: number;
	y: number;
	tone: 0 | 2;
}

/** Cells of one digit on the area W x H (CSS px) with cell size cs. */
export function buildGrid(txt: string, W0: number, H0: number, cs: number): GridCell[] {
	const W = Math.max(1, Math.round(W0));
	const H = Math.max(1, Math.round(H0));
	const fs = H * 1.28; // digit height (0.73 em) fills about 94 % of the area
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	const oc = document.createElement('canvas');
	oc.width = cols;
	oc.height = rows;
	const o = oc.getContext('2d', { willReadFrequently: true }); // getImageData without reading back from the GPU
	if (!o) return [];
	o.fillStyle = '#000';
	// The shape comes from Inter Tight (without the dot in the zero of the mono font), filled with mono characters
	o.font = `600 ${fs / cs}px "Inter Tight", sans-serif`;
	o.textBaseline = 'alphabetic';
	txt.split('|').forEach((ln, i) => {
		o.fillText(ln, 0, (H * 0.97 + i * fs * 0.9) / cs);
	});
	const d = o.getImageData(0, 0, cols, rows).data;
	const on = new Uint8Array(cols * rows);
	for (let q = 0; q < on.length; q++) on[q] = (d[q * 4 + 3] ?? 0) > 110 ? 1 : 0;
	const out: GridCell[] = [];
	for (let q = 0; q < on.length; q++)
		if (on[q]) {
			const a = q % cols;
			const b = Math.floor(q / cols);
			let n = 0;
			for (let dj = -1; dj <= 1; dj++)
				for (let di = -1; di <= 1; di++) {
					const x = a + di;
					const y = b + dj;
					if ((di || dj) && x >= 0 && y >= 0 && x < cols && y < rows && on[y * cols + x]) n++;
				}
			out.push({ x: a * cs, y: b * cs, tone: n >= 8 ? 2 : 0 });
		}
	return out;
}

/** Cell size and glyph per mode (portrait slightly finer). */
export const digitMetrics = (portrait: boolean): { cs: number; gl: number } =>
	portrait ? { cs: 6, gl: 7 } : { cs: 7, gl: 8 };

function build(s: DigitState, txt: string, cs: number) {
	const old = s.cells;
	s.cells = buildGrid(txt, s.W, s.H, cs).map((z, k) => {
		const p = old[k];
		return {
			...z,
			ox: s.reduced ? 0 : p ? p.x + p.ox - z.x : (hsh(k, 1) - 0.5) * 160,
			oy: s.reduced ? 0 : p ? p.y + p.oy - z.y : (hsh(k, 2) - 0.5) * 160,
			vx: 0,
			vy: 0,
		};
	});
}

// Glyph sheet: the eight glyphs pre-rendered once per pixel ratio and font state
function buildSheet(s: DigitState, gl: number): Sheet {
	const key = `${s.dpr}|${loop.fv}|${gl}`;
	if (s.sheet && s.sheetKey === key) return s.sheet;
	const z = Math.ceil((gl + 4) * s.dpr);
	const cv = document.createElement('canvas');
	cv.width = z * RAMP.length;
	cv.height = z;
	const g = cv.getContext('2d');
	if (!g) return { cv, z };
	g.font = `500 ${gl * s.dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#FAFAFA';
	for (let i = 0; i < RAMP.length; i++)
		g.fillText(RAMP[i] ?? '', z * i + z / 2, z / 2 + 0.5 * s.dpr);
	s.sheetKey = key;
	s.sheet = { cv, z };
	return s.sheet;
}

/** Registers a digit. Returns the unregister function. */
export function registerDigit(
	cv: HTMLCanvasElement,
	{ text, cs: cs0 = 7, gl: gl0 = 8 }: DigitOptions,
): () => void {
	return register<DigitState>({
		name: `digit ${text}`,
		el: cv,
		host: cv.parentElement ?? undefined,
		box: (W, H) => ({ bw: Math.max(1, W), bh: Math.max(1, H), max: 1 }),
		dprCap: 2,
		init(s) {
			s.cells = [];
			s.key = '';
			s.dirty = false;
			s.moving = false;
			s.sheetKey = '';
			s.sheet = null;
		},
		frame(s, _t, dt) {
			// Portrait: slightly finer grid (cell 6, glyph 7), the digit stays one shape
			const cs = s.mode === 'portrait' ? digitMetrics(true).cs : cs0;
			const gl = s.mode === 'portrait' ? digitMetrics(true).gl : gl0;
			const key = `${text}|${loop.fv}|${s.W}x${s.H}|${s.dpr}|${cs}`;
			if (s.key !== key) {
				s.key = key;
				build(s, text, cs);
				s.dirty = true;
			}
			const R = 110;
			let moving = false;
			// Springs in a fixed 60 Hz step
			s.step(dt, 1 / 60, () => {
				for (const c of s.cells) {
					if (s.m.in) {
						const dx = c.x + c.ox - s.m.x;
						const dy = c.y + c.oy - s.m.y;
						const d2 = dx * dx + dy * dy;
						if (d2 < R * R) {
							const d = Math.sqrt(d2) + 0.1;
							const g = (1 - d / R) * 3.2;
							c.vx += (dx / d) * g;
							c.vy += (dy / d) * g;
						}
					}
					c.vx += -c.ox * 0.07;
					c.vy += -c.oy * 0.07;
					c.vx *= 0.8;
					c.vy *= 0.8;
					c.ox += c.vx;
					c.oy += c.vy;
					if (Math.abs(c.vx) + Math.abs(c.vy) + Math.abs(c.ox) + Math.abs(c.oy) > 0.02)
						moving = true;
				}
			});
			// Backing store was reset (buffer released after absence, resize): redraw
			if (s.stale) {
				s.stale = false;
				s.dirty = true;
			}
			// Resting digit without pointer: nothing to redraw
			if (!(s.dirty || moving || s.m.in || s.moving)) return;
			s.moving = moving;
			s.dirty = false;
			const { ctx, cv: area } = s;
			if (!ctx || !area) return;
			const { cv: sheet, z } = buildSheet(s, gl);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, area.width, area.height);
			const dpr = s.dpr;
			ctx.globalAlpha = 1;
			const tq = Math.floor(loop.now / 0.09);
			for (const c of s.cells) {
				const dx = Math.round((c.x + c.ox + cs / 2) * dpr - z / 2);
				const dy = Math.round((c.y + c.oy + cs / 2) * dpr - z / 2);
				// In motion (draft: distance over 3 px or speed over 0.5): character changes every 90 ms, otherwise fixed
				const inMotion = Math.abs(c.ox) + Math.abs(c.oy) > 3 || Math.hypot(c.vx, c.vy) > 0.5;
				const tone = inMotion ? Math.floor(hsh(c.x + tq, c.y) * RAMP.length) % RAMP.length : c.tone;
				// Body of the digit muted, edge bright: the shape reads at once
				ctx.globalAlpha = inMotion || c.tone === 0 ? 1 : 0.42;
				ctx.drawImage(sheet, z * tone, 0, z, z, dx, dy, z, z);
			}
			ctx.globalAlpha = 1;
		},
	});
}
