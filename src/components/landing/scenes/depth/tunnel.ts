// The depth: a drive through a point cloud in which the three words from the dictionary (tunnelWords) lie as islands.
// The camera hangs on the scroll progress of the section.
// Scene space: landscape reference box 1280 x 800, portrait its own box 640 units wide (the words sit at
// depth 9 at 40 to 50 % of the width and so fit every format). Drawing happens in CSS px.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { cl, cs, hsh, lag, lerp, sn, ss } from '../../core/math';

const MONO = '"JetBrains Mono", monospace';
const TT = '"Inter Tight", sans-serif';
const F = 720; // focal length in scene units
const SPACING = 0.065; // point spacing of the words in world units (portrait only)
const SP = 26; // spacing of the word islands in depth
const ISLAND_X = [-4.5, 4.5, -4.5] as const;
const ISLAND_Y = [0.8, -0.8, 0.8] as const;

/** Sampled word mask: alpha channel d (w x h), center (cx, cy) and width of the occupied area. */
interface Mask {
	d: Uint8ClampedArray;
	w: number;
	h: number;
	cx: number;
	cy: number;
	width: number;
}

type Pt = [x: number, y: number];

/** Word island: depth z, center (x, y), scale sc, points measured from the center, half word width hw. */
interface Island {
	z: number;
	x: number;
	y: number;
	sc: number;
	pts: Pt[];
	hw: number;
}

/** Point of the cloud: x, y, z, character, island (-1 = dust). */
// scatterX/scatterY/scatterZ: start offset in the tunnel from which the point streams into the word shape (computed once at build);
// ph: breathing phase, h: staggering (who arrives earlier and leaves earlier)
type Point = [
	x: number,
	y: number,
	z: number,
	char: string,
	island: number,
	nr: number,
	scatterX: number,
	scatterY: number,
	scatterZ: number,
	ph: number,
	h: number,
];

/** The cloud column-wise (one number array per field): the point loop reads about twice as fast as from tuples. */
interface Cloud {
	n: number;
	x: Float64Array;
	y: Float64Array;
	z: Float64Array;
	ch: string[];
	ins: Int32Array;
	nr: Int32Array;
	sx: Float64Array;
	sy: Float64Array;
	sz: Float64Array;
	ph: Float64Array;
	h: Float64Array;
}
const pack = (P: Point[]): Cloud => {
	const n = P.length;
	const f = () => new Float64Array(n);
	const w: Cloud = {
		n,
		x: f(),
		y: f(),
		z: f(),
		ch: P.map((q) => q[3]),
		ins: new Int32Array(n),
		nr: new Int32Array(n),
		sx: f(),
		sy: f(),
		sz: f(),
		ph: f(),
		h: f(),
	};
	P.forEach((q, i) => {
		w.x[i] = q[0];
		w.y[i] = q[1];
		w.z[i] = q[2];
		w.ins[i] = q[4];
		w.nr[i] = q[5];
		w.sx[i] = q[6];
		w.sy[i] = q[7];
		w.sz[i] = q[8];
		w.ph[i] = q[9];
		w.h[i] = q[10];
	});
	return w;
};

/** Exclusion zone around a subline (DOM rectangle) with opacity w. */
interface Zone {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	w: number;
}

/** Clamping of a word at the screen edge: shift dx (scene units), squeeze k. */
interface Clamp {
	dx: number;
	k: number;
}

/** Characters of a font size step: positions and opacity (x, y, a per character) separate from the characters. */
interface Bucket {
	xya: number[];
	ch: string[];
}

/** State of the last drawn frame (the frame stays as is when idle). */
interface LastDraw {
	p: number;
	smx: number;
	smy: number;
	headerY: number;
	mx: number;
	my: number;
	mIn: boolean;
	time: number;
}

interface DepthState extends SceneState {
	// resize already runs at registration, before init: resize sets cx, cy itself
	cx: number;
	cy: number;
	sm: { x: number; y: number };
	built: number;
	dp: number;
	caps: HTMLElement[];
	dep: HTMLElement | null;
	hint: HTMLElement | null;
	header: HTMLElement | null;
	raw: Mask[];
	isl: Island[];
	P: Cloud;
	k: number;
	fl: number;
	dX: number;
	dY: number;
	/** Key of the build (mode and area), null = sample again. */
	bm: string | null;
	kk: LastDraw;
	nb: Bucket[];
	/** Pointer velocity for the repulsion (a = strength). */
	pv?: { x: number; y: number; a: number };
	zones: Zone[];
	/** Clamping per island, build creates it. */
	clamps: Clamp[];
	/** DOM positions written by read() (viewport pixels): header bottom edge, canvas top, section top and height, labels top. */
	layout: { header: number; el: number; sec: number; secH: number; caps: number[] };
}

// Sample a word from the font (font 200 px on 1600 x 270, baseline 0.82). The mask
// is kept so each format can be sampled with a different grid.
const sampleT = (word: string, px: number): Mask => {
	const w = 1600;
	const h = Math.ceil(px * 1.35);
	const oc = document.createElement('canvas');
	oc.width = w;
	oc.height = h;
	// willReadFrequently: mask in main memory, getImageData without reading back from the GPU (otherwise about 30 ms per word)
	const o = oc.getContext('2d', { willReadFrequently: true });
	if (!o) throw new Error('No 2D context for the word mask');
	o.font = `600 ${px}px ${TT}`;
	o.textAlign = 'center';
	o.fillStyle = '#000';
	o.fillText(word, w / 2, px * 0.82);
	const d = o.getImageData(0, 0, w, h).data;
	let x0 = 1e9;
	let x1 = -1e9;
	let y0 = 1e9;
	let y1 = -1e9;
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++)
			if ((d[(y * w + x) * 4 + 3] ?? 0) > 128) {
				if (x < x0) x0 = x;
				if (x > x1) x1 = x;
				if (y < y0) y0 = y;
				if (y > y1) y1 = y;
			}
	return { d, w, h, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, width: x1 - x0 };
};
// Points of the mask on grid step, measured from (ox, oy)
const gridPoints = (r: Mask, step: number, ox: number, oy: number): Pt[] => {
	const pts: Pt[] = [];
	for (let y = 0; y < r.h; y += step)
		for (let x = 0; x < r.w; x += step)
			if ((r.d[(y * r.w + x) * 4 + 3] ?? 0) > 128) pts.push([x - ox, y - oy]);
	return pts;
};

// Write inline style only when the value changes (every write invalidates the element style)
const lastStyle = new WeakMap<HTMLElement, Record<string, string>>();
function setStyle(el: HTMLElement, k: string, v: string) {
	let alt = lastStyle.get(el);
	if (!alt) {
		alt = {};
		lastStyle.set(el, alt);
	}
	if (alt[k] === v) return;
	alt[k] = v;
	el.style.setProperty(k, v);
}

// Opacity of the subtitle from the depth dz of its island. A triangle around dz 9 (width 5 to
// both sides) with a plateau (full for |dz - 9| <= 3.5) so the sentence reads steadily.
const plateauOf = (dz: number): number => cl((5 - Math.abs(dz - 9)) / 1.5);
// Density of the word from its depth: present from dz 34, full from dz 22, after the fly-through (dz < 1) the departure fades out
const wordDensity = (dz: number): number => cl((34 - dz) / 12) * (1 - ss((1 - dz) / 12));

// Portrait: dust amount and point size scale with the screen area (reference 1440 x 900), quantized so not
// every resize rebuilds. Landscape: fixed amount (the stage scales as a whole).
const area = (s: DepthState): number =>
	s.mode === 'portrait' ? Math.round(cl((s.W * s.H) / 1296000, 0.6, 2) * 4) / 4 : 1;
const buildKey = (s: DepthState): string => `${s.mode}${area(s)}`;

function build(s: DepthState) {
	const portrait = s.mode === 'portrait';
	const k = portrait ? 0.5 : 1; // adapt the scatter of the islands and of the pointer offset to the box width
	const target = ((portrait ? 0.82 : 0.5) * s.bw * 9) / F; // word width in world units at depth 9 (portrait: 82 % of the width)
	s.isl = s.raw.map((r, i): Island => {
		// Landscape: scale 1, grid 5 px, center of the sampling area. Portrait: word fitted to the width.
		const sc = portrait ? cl(target / (r.width / 85), 0.25, 1.5) : 1;
		const raw = portrait
			? gridPoints(r, 2 * Math.max(1, Math.round((SPACING * 85) / (sc * 2))), r.cx, r.cy)
			: gridPoints(r, 5, r.w / 2, r.h / 2);
		const pts = raw.map((p): Pt => [(p[0] / 85) * sc, (p[1] / 85) * sc]);
		// hw: half word width in world units (for clamping at the screen edge)
		return {
			z: SP * i,
			x: (ISLAND_X[i] ?? 0) * k,
			y: ISLAND_Y[i] ?? 0,
			sc,
			pts,
			hw: (r.width / 85) * sc * 0.5,
		};
	});
	s.k = k;
	s.clamps = s.isl.map((): Clamp => ({ dx: 0, k: 1 }));
	const RAMP = '@#%@#%*';
	const P: Point[] = [];
	s.isl.forEach((I, kk) => {
		I.pts.forEach((p, q) => {
			const w = hsh(q, kk + 17) * Math.PI * 2;
			const r = 2.5 + hsh(q, kk + 29) * 8; // start in the tunnel, spread widely around the axis
			P.push([
				I.x + p[0],
				I.y + p[1],
				I.z + (hsh(q, kk) - 0.5) * 0.6,
				RAMP.charAt(Math.floor(hsh(q, kk + 9) * 6)),
				kk,
				q,
				Math.cos(w) * r * (portrait ? 0.6 : 1),
				Math.sin(w) * r * 0.7,
				5 + hsh(q, kk + 37) * 14,
				hsh(q, kk + 53),
				hsh(q, kk + 41),
			]);
		});
	});
	// Dust: landscape 1600 points in 60 x 36 units; portrait narrower, taller and denser,
	// the edges of the dust box fade out softly there (see frame)
	const fl = area(s);
	s.fl = Math.sqrt(fl);
	const nd = portrait ? Math.round(7000 * fl) : 1000;
	s.dX = portrait ? 24 : 30;
	s.dY = portrait ? 40 : 18;
	for (let q = 0; q < nd; q++)
		P.push([
			(hsh(q, 1) - 0.5) * 2 * s.dX,
			(hsh(q, 2) - 0.5) * 2 * s.dY,
			hsh(q, 3) * 90 - 14,
			'..:'.charAt(Math.floor(hsh(q, 4) * 3)),
			-1,
			q,
			0,
			0,
			0,
			0,
			0,
		]);
	s.P = pack(P);
	s.bm = buildKey(s);
}

// Clamping per word: the camera drifts sideways to the next word while the current one is still large. The
// word box always stays within viewport minus 16 px margin (shift in scene units) and is
// scaled to at most 92 % of the width instead of being cut off (dz < 5: fly-through, the edge fades out there).
// Portrait only: in landscape the words fly freely through the image.
function applyClamps(s: DepthState, clamps: Clamp[], camZ: number, camX: number) {
	const { f, ox, cx } = s;
	const portrait = s.mode === 'portrait';
	s.isl.forEach((I, i) => {
		const z = clamps[i];
		if (!z) return;
		const dz = I.z - camZ;
		z.dx = 0;
		z.k = 1;
		if (!portrait || dz < 0.25 || dz > 60) return;
		const fz = F / dz;
		let hw = I.hw * fz * f;
		if (2 * hw > 0.92 * s.W) {
			z.k = (0.92 * s.W) / (2 * hw);
			hw *= z.k;
		}
		const X = ox + (cx + (I.x - camX) * fz) * f;
		const d =
			2 * hw > s.W - 32
				? s.W / 2 - X
				: X - hw < 16
					? 16 - (X - hw)
					: X + hw > s.W - 16
						? s.W - 16 - (X + hw)
						: 0;
		z.dx = d / f;
	});
}

/** Everything the point loop needs per frame from the camera and the pointer. */
interface View {
	camX: number;
	camY: number;
	camZ: number;
	headerY: number;
	mx: number;
	my: number;
	/** Strength of the pointer repulsion (0 = none) and radius for dust. */
	rep: number;
	rad: number;
	zones: Zone[];
	clamps: Clamp[];
	/** Phase of the flow field (follows the scroll) and breathing time in seconds (stepped, 0 = still). */
	phase: number;
	time: number;
}

// Flow field of the swarm: divergence-free field from two octaves of a stream function (cheap pseudo-curl,
// every point only knows its rest position). Result in cvx, cvy; the phase runs with the scroll, scrolling
// backwards turns the flow back.
let cvx = 0;
let cvy = 0;
function curl(x: number, y: number, phase: number) {
	const a = 0.7 * x + 1.3 * phase;
	const b = 0.77 * y - phase;
	const c = 1.7 * x - 0.9 * phase + 2;
	const d = 1.9 * y + 1.1 * phase;
	cvx = 0.77 * sn(a) * cs(b) + 0.76 * sn(c) * cs(d);
	cvy = -0.7 * cs(a) * sn(b) - 0.68 * cs(c) * sn(d);
}

// Position of a word point in the flow: u = arrival (0 in the tunnel, 1 in the word shape), o = departure (0 in the word, 1 far ahead
// toward the next word). In between the flow field bends the path; in the word the point breathes finely.
let ox = 0;
let oy = 0;
let oz = 0;
function flow(
	w: Cloud,
	i: number,
	I: Island,
	N: Island,
	u: number,
	o: number,
	phase: number,
	time: number,
) {
	let x = w.x[i] as number;
	let y = w.y[i] as number;
	let z = w.z[i] as number;
	const e = 1 - u;
	if (e > 0.001) {
		const e2 = e * e;
		x += (w.sx[i] as number) * e2;
		y += (w.sy[i] as number) * e2;
		z += (w.sz[i] as number) * e2;
		curl(x, y, phase);
		const b = 12 * u * e;
		x += cvx * b;
		y += cvy * b;
	} else if (o > 0.001) {
		const o2 = o * o;
		curl(x + 9, y, phase);
		const b = 12 * o * (1 - o);
		x += cvx * b + (N.x - I.x) * 0.9 * o2 + (w.sx[i] as number) * 0.5 * o2;
		y += cvy * b + (N.y - I.y) * 0.9 * o2 + (w.sy[i] as number) * 0.5 * o2;
		z += o2 * (8 + 10 * (w.h[i] as number)); // pulls ahead into the depth instead of flying past the camera
	} else if (time > 0) {
		// Breathing: small wave across the word, slightly offset per point
		const wl = time * 1.5 + x * 1.7 + y * 1.1 + (w.ph[i] as number) * 2.5;
		x += 0.028 * sn(wl);
		y += 0.028 * cs(wl * 1.3);
	}
	ox = x;
	oy = y;
	oz = z;
}

// Project all points: points as squares, near characters in buckets per font size step (8, 11, 16, 23, 32, 45 px
// ), then draw the buckets.
function drawPoints(s: DepthState, nb: Bucket[], a: View) {
	const ctx = s.ctx;
	if (!ctx) return;
	const { f, ox: bx, oy: by, cx, cy } = s;
	const { camX, camY, camZ, headerY, mx, my, rep, rad, zones, clamps, phase, time } = a;
	const portrait = s.mode === 'portrait';
	const tq = Math.round(time * 14);
	const W = s.P;
	for (let i = 0; i < W.n; i++) {
		const qx = W.x[i] as number;
		const qy = W.y[i] as number;
		const qz = W.z[i] as number;
		const qi = W.ins[i] as number;
		const qn = W.nr[i] as number;
		const qh = W.h[i] as number;
		let x = qx;
		let y = qy;
		let dz = qz - camZ;
		const word = qi >= 0;
		let kx = 1;
		let ddx = 0;
		let u = 1;
		let o = 0;
		let I: Island | undefined;
		if (word) {
			// Word visible from dz 34 to far behind the camera (departure pulls ahead)
			if (dz > 34 || dz < -14) continue;
			I = s.isl[qi];
			const kl = clamps[qi];
			if (!I || !kl) continue;
			kx = kl.k;
			ddx = kl.dx;
			// Arrival between dz 38 and 14 (staggered per point), departure from dz 7.5 (likewise), before the characters get too large
			u = ss((38 - dz - 8 * qh) / 16);
			o = ss((7.5 + 1.5 * qh - dz) / 6);
			flow(W, i, I, s.isl[qi + 1] ?? I, u, o, phase, time);
			x = ox;
			y = oy;
			dz = oz - camZ;
			x = I.x + (x - I.x) * kx;
		}
		if (dz < 0.25 || dz > 110) continue;
		const fz = F / dz;
		const sx = cx + (x - camX) * fz + ddx;
		const sy = cy + (y - camY) * fz;
		let X = bx + sx * f;
		let Y = by + sy * f;
		if (X < -40 || Y < -40 || X > s.W + 40 || Y > s.H + 40) continue;
		if (rep) {
			const dx = sx - mx;
			const dy = sy - my;
			const d = Math.hypot(dx, dy);
			const R = word ? 54 : rad;
			if (d < R) {
				// Dust is pushed away, the swarm rather swirled (tangent)
				const g = (1 - d / R) * 46 * f * rep * (word ? 0.4 : 1);
				const nx = dx / (d + 0.1);
				const ny = dy / (d + 0.1);
				X += nx * g * (word ? 0.4 : 1) - (word ? ny * g * 0.9 : 0);
				Y += ny * g * (word ? 0.4 : 1) + (word ? nx * g * 0.9 : 0);
			}
		}
		if (qa.onlyWord != null && qi !== qa.onlyWord) continue; // Measurement hook: draw only one word
		// Words and dust: word present from dz 34 and full from 22, dust fades out in the distance
		let al: number;
		if (word) {
			const d0 = qz - camZ;
			// Depth: far points darker, near brighter; muted in the flow, full in the word shape; sharp flicker
			// with few points per step
			al =
				wordDensity(d0) *
				cl((dz - 1.2) / 2.8) *
				(0.5 + 0.5 * u * (1 - o)) *
				(1 - 0.55 * o) *
				(0.78 + 0.22 * cl((50 - dz) / 30));
			if (tq && (Math.imul(qn + 1, 2654435761) + Math.imul(tq, 40503)) >>> 29 === 0) al *= 0.6;
		} else
			al =
				cl(dz / 1.2) *
				(portrait
					? cl((110 - dz) / 30) *
						cl((s.dX - Math.abs(qx)) / 7) *
						cl((s.dY - Math.abs(qy)) / 7) *
						0.6
					: cl((110 - dz) / 50) * 0.55);
		al *= cl((Y - headerY) / 28);
		// Portrait: near words (dz < 5) fade out softly at the image edge instead of looking cut off hard.
		// Landscape: characters fly out of the image unchanged.
		if (portrait && word && dz < 5)
			al *= cl(Math.min(X, s.W - X) / 48) * cl(Math.min(Y, s.H - Y) / 48);
		if (al <= 0.01) continue;
		// Exclusion zone around the subline (DOM rectangle plus 28 px): particles and characters fade out there
		for (const z of zones) {
			if (z.w < 0.02) continue;
			const zx = Math.max(z.x0 - X, X - z.x1, 0);
			const zy = Math.max(z.y0 - Y, Y - z.y1, 0);
			al *= 1 - z.w * (1 - cl(Math.hypot(zx, zy) / 28));
		}
		if (al <= 0.01) continue;
		const sz = cl(0.07 * fz, 0.8, 64); // character size in scene units
		// Dust never becomes a large symbol: it fades out from about 6 units
		if (!word) al *= cl((9 - sz) / 3);
		if (al <= 0.01) continue;
		if (sz < 6) {
			// Point: square with edge length 0.55 x sz; in portrait with a minimum size
			const side = portrait ? Math.max(word ? 1 : 1.5 * s.fl, sz * 0.8 * f) : sz * 0.55 * f;
			ctx.globalAlpha = al;
			ctx.fillRect(X, Y, side, side);
			// Trail: in the flow, faint repeats of the point on its path (every fourth point)
			if (I && (qn & 3) === 0 && ((u > 0.03 && u < 0.97) || (o > 0.03 && o < 0.97))) {
				const N = s.isl[qi + 1] ?? I;
				for (let k = 1; k <= 2; k++) {
					flow(W, i, I, N, Math.max(0, u - 0.09 * k), Math.max(0, o - 0.09 * k), phase, time);
					const d2 = oz - camZ;
					if (d2 < 0.25) break;
					const g2 = F / d2;
					ctx.globalAlpha = al * (k === 1 ? 0.5 : 0.25);
					ctx.fillRect(
						bx + (cx + (I.x + (ox - I.x) * kx - camX) * g2 + ddx) * f + (X - (bx + sx * f)),
						by + (cy + (oy - camY) * g2) * f + (Y - (by + sy * f)),
						side * 0.8,
						side * 0.8,
					);
				}
			}
		} else {
			const e = nb[Math.min(5, Math.floor(Math.log2(sz / 6) * 2))];
			if (e) {
				e.xya.push(X, Y, al);
				e.ch.push(W.ch[i] ?? '');
			}
		}
	}
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	for (let tr = 0; tr < 6; tr++) {
		const e = nb[tr];
		if (!e || !e.ch.length) continue;
		ctx.font = `500 ${(Math.round(8 * 2 ** (tr / 2)) * f).toFixed(2)}px ${MONO}`;
		for (let i = 0; i < e.ch.length; i++) {
			ctx.globalAlpha = e.xya[3 * i + 2] ?? 0;
			ctx.fillText(e.ch[i] ?? '', e.xya[3 * i] ?? 0, e.xya[3 * i + 1] ?? 0);
		}
	}
	ctx.globalAlpha = 1;
}

/**
 * Sample word masks and build the cloud, one step per call (one word or the build), true when everything is up to date.
 * The warm-up (warm) calls this once per frame, frame catches up on anything missing in one go (new font or format).
 */
function prepare(s: DepthState, words: readonly string[]): boolean {
	if (s.built !== loop.fv) {
		s.built = loop.fv;
		s.raw = [];
		s.bm = null;
	}
	const nextWord = words[s.raw.length];
	if (nextWord) {
		s.raw.push(sampleT(nextWord, 200));
		return false;
	}
	if (s.bm !== buildKey(s)) {
		build(s);
		s.stale = true;
		return false;
	}
	return true;
}

/** Registers the depth scene. sec: section with sticky stage. Returns the unregister function. */
export function registerDepth(cv: HTMLCanvasElement, sec: HTMLElement, words: readonly string[]) {
	const root = cv.parentElement ?? cv;
	return register<DepthState>({
		name: 'depth',
		el: cv,
		host: root,
		box: (_W, _H, _safeH, mode) =>
			mode === 'portrait' ? { bw: 640, bh: 1, align: 'top' } : { bw: 1280, bh: 800 },
		dprCap: 2,
		touchCap: 1.5,
		minVisible: 0.1,
		resize(s) {
			s.cx = s.bw / 2;
			s.cy = s.mode === 'portrait' ? (0.44 * s.H) / s.f : s.bh / 2;
		},
		init(s) {
			s.sm = { x: s.cx * 1.2, y: s.cy * 0.8 };
			s.built = -1;
			s.dp = 0;
			s.raw = [];
			s.isl = [];
			s.P = pack([]);
			s.bm = null;
			s.clamps = [];
			s.kk = {
				p: Number.NaN,
				smx: Number.NaN,
				smy: Number.NaN,
				headerY: Number.NaN,
				mx: Number.NaN,
				my: Number.NaN,
				mIn: false,
				time: 0,
			};
			s.nb = [0, 1, 2, 3, 4, 5].map((): Bucket => ({ xya: [], ch: [] }));
			s.caps = [...root.querySelectorAll<HTMLElement>('[data-dcap]')];
			s.zones = s.caps.map((): Zone => ({ x0: 0, y0: 0, x1: 0, y1: 0, w: 0 }));
			s.dep = root.querySelector<HTMLElement>('[data-depth]');
			s.hint = root.querySelector<HTMLElement>('[data-hint]');
			s.header = document.querySelector<HTMLElement>('[data-header]');
			s.layout = { header: 0, el: 0, sec: 0, secH: 1, caps: s.caps.map(() => 0) };
		},
		warm: (s) => prepare(s, words),
		read(s) {
			const L = s.layout;
			// The QA hook can call read() before init has run.
			if (!L) return;
			L.header = s.header ? s.header.getBoundingClientRect().bottom : 0;
			L.el = s.el.getBoundingClientRect().top;
			const r = sec.getBoundingClientRect();
			L.sec = r.top;
			L.secH = r.height;
			// Labels: position and exclusion zone (DOM rectangle plus 28 px)
			s.caps.forEach((el, i) => {
				L.caps[i] = el.getBoundingClientRect().top;
				const z = s.zones[i];
				if (!z) return;
				const b = el.offsetParent;
				z.x0 = el.offsetLeft - 28;
				z.x1 = el.offsetLeft + el.offsetWidth + 28;
				z.y0 = el.offsetTop - 28;
				z.y1 = (b ? b.clientHeight : s.H) + 28;
			});
		},
		frame(s, t, dt) {
			const ctx = s.ctx;
			if (!ctx) return;
			while (!prepare(s, words));
			const { f, cx, cy } = s;
			// When scrolling out, the scene runs under the fixed header: word image and line fade out over the topmost
			// 28 px below the header band (header bottom edge in canvas coordinates)
			const L = s.layout;
			const headerY = L.header - L.el;
			const sp = cl(-L.sec / Math.max(1, L.secH - s.H));
			// With reduced motion the camera follows the scroll without lag
			if (s.reduced) s.dp = sp;
			else s.dp = Math.abs(sp - s.dp) < 1e-5 ? sp : s.dp + (sp - s.dp) * lag(0.1, dt);
			const p = s.dp;
			const camZ = -14 + p * (2 * SP + 5);
			const seg = cl((camZ + 14) / SP, 0, 1.999);
			const si = Math.floor(seg);
			const sf = ss(seg - si);
			if (s.m.in) {
				const k = s.reduced ? 1 : lag(0.06, dt);
				s.sm.x += (s.m.x - s.sm.x) * k;
				s.sm.y += (s.m.y - s.sm.y) * k;
				if (Math.hypot(s.m.x - s.sm.x, s.m.y - s.sm.y) < 0.01) {
					s.sm.x = s.m.x;
					s.sm.y = s.m.y;
				}
			}
			// Breathing/flicker: only while a word stands still, in 14 steps per second (saves frames);
			// with reduced motion there is none
			const idle = !s.reduced && s.isl.some((I) => plateauOf(I.z - camZ) > 0.02);
			const time = idle ? Math.floor(t * 14) / 14 : 0;
			// When idle (same scroll, resting pointer, same size and font) the last frame stays
			const kk = s.kk;
			const same =
				!s.stale &&
				!(s.pv && s.pv.a > 0.01) &&
				kk.p === p &&
				kk.smx === s.sm.x &&
				kk.smy === s.sm.y &&
				kk.headerY === headerY &&
				kk.mx === s.m.x &&
				kk.my === s.m.y &&
				kk.mIn === s.m.in &&
				kk.time === time;
			kk.p = p;
			kk.smx = s.sm.x;
			kk.smy = s.sm.y;
			kk.headerY = headerY;
			kk.mx = s.m.x;
			kk.my = s.m.y;
			kk.mIn = s.m.in;
			kk.time = time;
			if (same) return;
			s.stale = false;
			const I0 = s.isl[si];
			const I1 = s.isl[si + 1];
			if (!I0 || !I1) return;
			const camX = lerp(I0.x, I1.x, sf) * 0.85 + ((s.sm.x - cx) / cx) * 1.2 * s.k;
			const camY = lerp(I0.y, I1.y, sf) * 0.85 + ((s.sm.y - cy) / cy) * 0.8 * s.k;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			ctx.fillStyle = '#FAFAFA';
			// Near characters per font size step in reused buckets
			const nb = s.nb;
			for (const e of nb) {
				e.xya.length = 0;
				e.ch.length = 0;
			}
			const m = s.m;
			const mx = m.in ? m.x : 0;
			const my = m.in ? m.y : 0;
			// Pointer repulsion only while moving: strength from the speed, gone within about 300 ms at rest.
			// While a sentence stands, half the radius; words at full size (dz < 34) stay untouched.
			const pv = s.pv ?? { x: m.x, y: m.y, a: 0 };
			s.pv = pv;
			if (m.in) {
				const v = (Math.hypot(m.x - pv.x, m.y - pv.y) * f) / Math.max(dt, 0.001);
				pv.a = Math.max(pv.a * Math.exp(-dt * 10), cl(v / 600));
			} else pv.a = 0;
			pv.x = m.x;
			pv.y = m.y;
			const rep = pv.a > 0.01 ? pv.a : 0;
			const plat = Math.max(...s.isl.map((I) => plateauOf(I.z - camZ)));
			const rad = 120 * (1 - 0.5 * plat);
			// Sublines: opacity (read() measures the rectangle of the exclusion zone)
			const zones = s.zones;
			zones.forEach((z, i) => {
				const I = s.isl[i];
				z.w = I ? plateauOf(I.z - camZ) : 0;
			});
			const clamps = s.clamps;
			applyClamps(s, clamps, camZ, camX);
			drawPoints(s, nb, {
				camX,
				camY,
				camZ,
				headerY,
				mx,
				my,
				rep,
				rad,
				zones,
				clamps,
				phase: camZ * 0.22,
				time,
			});
			// At the end of the drive the stage scrolls away upward: word line and depth counter fade out, otherwise
			// the last sentence drives over the title of the next scene
			// Positions come from read(), write only changed values here
			const top = -L.el;
			const fade = 1 - cl(top / (0.12 * s.H));
			// whole label "TIEFE 000", not just the number
			if (s.dep?.parentElement) setStyle(s.dep.parentElement, 'opacity', fade.toFixed(3));
			// Word image slower: otherwise the last word stands over "Installieren" when scrolling back
			setStyle(ctx.canvas, 'opacity', (1 - cl(top / (0.4 * s.H))).toFixed(3));
			s.caps.forEach((el, i) => {
				const op = ((zones[i]?.w ?? 0) * cl(((L.caps[i] ?? 0) - L.header) / 28) * fade).toFixed(3);
				setStyle(el, 'opacity', op);
				setStyle(el, '--k', op); // guide line draws with the opacity (landing.css .leit)
			});
			// "keep scrolling" hint only at the start of the drive, then gone completely
			if (s.hint) setStyle(s.hint, 'opacity', (1 - ss(p / 0.06)).toFixed(3));
			if (s.dep) {
				const depth = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0');
				// change only the characters of the existing text node: textContent attaches a new node every frame
				const tk = s.dep.firstChild;
				if (tk instanceof Text) {
					if (tk.data !== depth) tk.data = depth;
				} else s.dep.textContent = depth;
			}
		},
	});
}
