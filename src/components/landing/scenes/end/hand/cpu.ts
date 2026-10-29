// Fallback without WebGL2: the halftone is precomputed in 2D once per resize (without pointer light,
// the pointing hand as a sprite).

import type { Fit } from '../../../core/canvas';
import { BAYER as HB, cl, hsh, ss } from '../../../core/math';
import { atlases } from './atlas';
import { CON, EDGE_IN, EDGE_THUMB, EDV, EDW, GAM, JIT, PS, RIM, RING_N, STEP } from './constants';
import type {
	Atlas,
	AtlasMeta,
	CpuAtlas,
	CpuBaked,
	CpuTile,
	DrawValues,
	HandState,
	Rect,
	TileName,
} from './types';

function ctx2d(
	cv: HTMLCanvasElement,
	opt?: CanvasRenderingContext2DSettings,
): CanvasRenderingContext2D {
	const g = cv.getContext('2d', opt);
	if (!g) throw new Error('hand: 2D context not available');
	return g;
}

const lightF = (x: number, y: number): number => 0.45 + 0.55 * cl(1 - (x - 450 + (y - 120)) / 1100);
const sdfRR = (x: number, y: number, R: Rect, r: number): number => {
	const qx = Math.abs(x - (R.x + R.w / 2)) - (R.w / 2 - r);
	const qy = Math.abs(y - (R.y + R.h / 2)) - (R.h / 2 - r);
	return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};

/** Tiles of an atlas as byte arrays plus bilinear access (once per atlas). */
function cpuAtlas<M extends AtlasMeta>(at: Atlas<M>): CpuAtlas {
	if (at.cpu) return at.cpu;
	const { bmp, meta } = at;
	const cv = document.createElement('canvas');
	cv.width = bmp.width;
	cv.height = bmp.height;
	const g = ctx2d(cv, { willReadFrequently: true });
	g.drawImage(bmp, 0, 0);
	const D = g.getImageData(0, 0, cv.width, cv.height).data;
	const tile = (n: TileName): CpuTile => {
		const t = meta.tiles[n];
		const a = new Uint8Array(t.w * t.h);
		for (let j = 0; j < t.h; j++)
			for (let i = 0; i < t.w; i++) a[j * t.w + i] = D[((t.y + j) * cv.width + t.x + i) * 4] ?? 0;
		return { a, w: t.w, h: t.h, div: t.div };
	};
	const T = {
		lum: tile('lum'),
		a: tile('a'),
		nx: tile('nx'),
		ny: tile('ny'),
		z: tile('z'),
	};
	const [X0, Y0] = meta.origin;
	const S = meta.scale;
	const samp = (t: CpuTile, X: number, Y: number): number => {
		const u = ((X - X0) * S) / t.div - 0.5;
		const v = ((Y - Y0) * S) / t.div - 0.5;
		const i = Math.floor(u);
		const j = Math.floor(v);
		const fu = u - i;
		const fv = v - j;
		const q = (ii: number, jj: number): number =>
			ii < 0 || jj < 0 || ii >= t.w || jj >= t.h ? 0 : (t.a[jj * t.w + ii] ?? 0);
		return (
			((q(i, j) * (1 - fu) + q(i + 1, j) * fu) * (1 - fv) +
				(q(i, j + 1) * (1 - fu) + q(i + 1, j + 1) * fu) * fv) /
			255
		);
	};
	at.cpu = { T, samp };
	return at.cpu;
}

const gradeL = (L: number): number => cl(0.5 + (L ** GAM - 0.5) * CON);

/** Holding hand at (x, y) without pointer light: [tone, layer] (layer 1 back, 2 front) or null. */
let cpuBottom = 1400;
function holdCpu(x: number, y: number): [number, number] | null {
	const { T, samp } = cpuAtlas(atlases().hold);
	const m = atlases().hold.meta;
	const al = samp(T.a, x, y);
	if (al < 0.5) return null;
	const zmm = samp(T.z, x, y) * 200 - 100;
	const sdf = sdfRR(x, y, m.phone, m.phone.r);
	const front = sdf < 4 && zmm < 1.5;
	const L = gradeL(samp(T.lum, x, y));
	const nx = samp(T.nx, x, y) * 2 - 1;
	const ny = samp(T.ny, x, y) * 2 - 1;
	const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
	const lf = lightF(x, y);
	let v = L * (0.62 + 0.5 * lf);
	v += RIM * Math.max(0, nx * 0.85 + ny * 0.05 + nz * 0.15) * (0.5 + 0.5 * L);
	const eA = Math.min(
		samp(T.a, x - EDW, y),
		samp(T.a, x + EDW, y),
		samp(T.a, x, y - EDW),
		samp(T.a, x, y + EDW),
	);
	const edge = eA < 0.5 && Math.abs(sdf) >= 7;
	const cov = ss((al - 0.02) / 0.25) * ss((cpuBottom - y) / 90);
	const sdS = sdfRR(x, y, m.screen, m.screen.r);
	if (front && sdS < -1) {
		const tn = 0.04 + 0.86 * cl(v) ** 1.35;
		let vd = (1 - tn) ** 0.45;
		if (edge) vd = Math.max(vd, 0.95);
		return [vd * cov * (1 - ss((-sdS - ((x < 800 ? EDGE_THUMB : EDGE_IN) - 4)) / 7)), 2];
	}
	if (edge) v = Math.max(v, EDV * lf * al);
	return [v * cov, front ? 2 : 1];
}

/** Pointing hand in sprite space: [normal tone, tone as ink over the screen] */
function pointCpu(a: number, b: number, ps: number, lf: number): [number, number] | null {
	const { T, samp } = cpuAtlas(atlases().point);
	const al = samp(T.a, a, b);
	if (al < 0.5) return null;
	const dist = Math.hypot(a, b) * ps;
	const fade = cl(1 - (dist - 300) / 420);
	const fadeIn = cl(1 - (dist - 150) / 230);
	if (fade <= 0) return null;
	const L = gradeL(samp(T.lum, a, b));
	const v = L * (0.62 + 0.5 * lf);
	const e = EDW / ps;
	const edge =
		Math.min(samp(T.a, a - e, b), samp(T.a, a + e, b), samp(T.a, a, b - e), samp(T.a, a, b + e)) <
		0.5;
	const cov = ss((al - 0.02) / 0.25);
	const tn = 0.04 + 0.86 * cl(v) ** 1.35;
	let vd = (1 - tn) ** 0.45;
	if (edge) vd = Math.max(vd, 0.95);
	return [Math.max(v, edge ? EDV * lf * al : 0) * cov * fade, vd * cov * fadeIn];
}

/** Bayer threshold of cell (i, j). */
const threshold = (i: number, j: number): number => (HB[(j & 3) * 4 + (i & 3)] ?? 0) / 16 + 0.035;

function dotRect(
	cx: CanvasRenderingContext2D,
	x: number,
	y: number,
	v: number,
	i: number,
	j: number,
	k = 1,
): void {
	const tone = v * (1 - JIT / 2 + JIT * hsh(i, j));
	if (tone > threshold(i, j)) {
		const z = STEP * (0.5 + 0.5 * Math.min(1, tone)) * k;
		cx.fillRect(x - z / 2, y - z / 2, z, z);
	}
}

const mkCanvas = (w: number, h: number): HTMLCanvasElement => {
	const cv = document.createElement('canvas');
	cv.width = w;
	cv.height = h;
	return cv;
};

function rrPath(g: CanvasRenderingContext2D, R: Rect, r: number): void {
	g.moveTo(R.x + r, R.y);
	g.arcTo(R.x + R.w, R.y, R.x + R.w, R.y + R.h, r);
	g.arcTo(R.x + R.w, R.y + R.h, R.x, R.y + R.h, r);
	g.arcTo(R.x, R.y + R.h, R.x, R.y, r);
	g.arcTo(R.x, R.y, R.x + R.w, R.y, r);
	g.closePath();
}

/** Holding hand: dots from behind (cb, directly on back) and from the front (cf, into a separate image). */
function bakeHoldHand(
	st: HandState,
	W: number,
	H: number,
	dpr: number,
	cam: Fit,
): HTMLCanvasElement {
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	const held = mkCanvas(w, h);
	const cb = ctx2d(st.back);
	const cf = ctx2d(held);
	for (const cx of [cb, cf]) {
		cx.setTransform(1, 0, 0, 1, 0, 0);
		cx.clearRect(0, 0, w, h);
		cx.setTransform(dpr * cam.f, 0, 0, dpr * cam.f, dpr * cam.ox, dpr * cam.oy);
		cx.fillStyle = '#FAFAFA';
	}
	const mh = atlases().hold.meta;
	const x1 = (W - cam.ox) / cam.f;
	const y1 = (H - cam.oy) / cam.f;
	const xa = mh.origin[0];
	const xb = mh.origin[0] + mh.tile[0] / mh.scale;
	const ya = mh.origin[1];
	const yb = Math.min(y1, mh.origin[1] + mh.tile[1] / mh.scale);
	const i0 = Math.max(Math.floor(xa / STEP), Math.floor(-cam.ox / cam.f / STEP));
	const j0 = Math.max(Math.floor(ya / STEP), Math.floor(-cam.oy / cam.f / STEP));
	for (let j = j0; (j + 0.5) * STEP < yb; j++)
		for (let i = i0; (i + 0.5) * STEP < Math.min(xb, x1); i++) {
			const x = (i + 0.5) * STEP;
			const y = (j + 0.5) * STEP;
			const r = holdCpu(x, y);
			if (r && r[0] > 0.02) {
				const front = r[1] === 2;
				if (front) cf.fillStyle = sdfRR(x, y, mh.screen, mh.screen.r) < -1 ? '#0A0A0A' : '#FAFAFA';
				dotRect(front ? cf : cb, x, y, r[0], i, j);
			}
		}
	return held;
}

/** Pointing sprite (scale PS, light at a fixed spot): [normal, ink over the screen]. */
function bakeSprites(m: number): [HTMLCanvasElement, HTMLCanvasElement] {
	const mp = atlases().point.meta;
	const sw = Math.ceil((mp.tile[0] / mp.scale) * PS * m);
	const sh = Math.ceil((mp.tile[1] / mp.scale) * PS * m);
	const sp: [HTMLCanvasElement, HTMLCanvasElement] = [mkCanvas(sw, sh), mkCanvas(sw, sh)];
	const lf = lightF(840, 420);
	const cs = sp.map((cv, k) => {
		const g = ctx2d(cv);
		g.fillStyle = k ? '#0A0A0A' : '#FAFAFA';
		return g;
	});
	const st2 = STEP / PS;
	for (let j = 0; j * st2 < mp.tile[1] / mp.scale; j++)
		for (let i = 0; i * st2 < mp.tile[0] / mp.scale; i++) {
			const a = mp.origin[0] + (i + 0.5) * st2;
			const b = mp.origin[1] + (j + 0.5) * st2;
			const r = pointCpu(a, b, PS, lf);
			if (!r) continue;
			for (let k = 0; k < 2; k++) {
				const g = cs[k];
				const tone = r[k];
				if (g && tone !== undefined && tone > 0.02) {
					const v = tone * (1 - JIT / 2 + JIT * hsh(i, j));
					if (v > threshold(i, j)) {
						const z = STEP * (0.5 + 0.5 * Math.min(1, v)) * m;
						g.fillRect((i + 0.5) * st2 * PS * m - z / 2, (j + 0.5) * st2 * PS * m - z / 2, z, z);
					}
				}
			}
		}
	return sp;
}

/** Fallback: precompute the holding hand and pointing sprite for this size. */
function bakeCpu(st: HandState, W: number, H: number, dpr: number, cam: Fit): CpuBaked {
	cpuBottom = Math.min(atlases().hold.meta.bottomY, (H - cam.oy) / cam.f + 10);
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	st.cpu.key = [w, h, cam.f, cam.ox, cam.oy].join();
	const held = bakeHoldHand(st, W, H, dpr, cam);
	const sp = bakeSprites(cam.f * dpr);
	st.cpu.baked = { held, sp };
	return st.cpu.baked;
}

export function cpuFrame(
	st: HandState,
	S: DrawValues,
	cam: Fit,
	W: number,
	H: number,
	dpr: number,
): void {
	const key = [
		Math.max(1, Math.round(W * dpr)),
		Math.max(1, Math.round(H * dpr)),
		cam.f,
		cam.ox,
		cam.oy,
	].join();
	const f = st.cpu.baked && st.cpu.key === key ? st.cpu.baked : bakeCpu(st, W, H, dpr, cam);
	const { hold, point } = atlases();
	const mh = hold.meta;
	const mp = point.meta;
	const cf = ctx2d(st.front);
	const w = st.front.width;
	const h = st.front.height;
	cf.setTransform(1, 0, 0, 1, 0, 0);
	cf.clearRect(0, 0, w, h);
	cf.drawImage(f.held, 0, 0);
	const base: [number, number, number, number, number, number] = [
		dpr * cam.f,
		0,
		0,
		dpr * cam.f,
		dpr * cam.ox,
		dpr * cam.oy,
	];
	if (S.pa > 0) {
		const m = cam.f * dpr;
		const th = Math.atan2(S.u.y, S.u.x);
		f.sp.forEach((sprite, k) => {
			cf.save();
			cf.setTransform(...base);
			cf.beginPath();
			if (k === 0) cf.rect(-4000, -4000, 9000, 9000);
			rrPath(cf, mh.screen, mh.screen.r);
			cf.clip(k === 0 ? 'evenodd' : 'nonzero');
			cf.translate(S.tip.x, S.tip.y);
			cf.rotate(th);
			cf.scale(S.sc / PS, S.sc / PS);
			cf.drawImage(
				sprite,
				mp.origin[0] * PS,
				mp.origin[1] * PS,
				sprite.width / m,
				sprite.height / m,
			);
			cf.restore();
		});
	}
	if (S.ring > 0) {
		cf.setTransform(...base);
		cf.fillStyle = '#FAFAFA';
		cf.globalAlpha = S.ring;
		const rr = S.ringR;
		for (let k = 0; k < RING_N; k++) {
			const an = (k / RING_N) * 6.2832;
			cf.fillRect(S.ringAt.x + Math.cos(an) * rr - 1, S.ringAt.y + Math.sin(an) * rr - 1, 2, 2);
		}
		cf.globalAlpha = 1;
	}
}

/** Clears both layers in the 2D fallback. */
export function cpuClear(st: HandState): void {
	for (const cv of [st.back, st.front]) {
		const g = ctx2d(cv);
		g.setTransform(1, 0, 0, 1, 0, 0);
		g.clearRect(0, 0, cv.width, cv.height);
	}
}
