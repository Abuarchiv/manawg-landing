// WebGL2 path of the hands: suitability check, layers (programs, textures) and the two passes per frame.

import { glVisible } from '../../../core/canvas';
import type { Fit } from '../../../core/canvas';
import { qa } from '../../../core/loop';
import { atlases, divArray, tileArray } from './atlas';
import { STEP } from './constants';
import { VS, fsSrc } from './shader';
import type { AtlasMeta, CellGrid, DrawValues, HoldMeta, Layer, Uniforms } from './types';

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
	const s = gl.createShader(type);
	if (!s) throw new Error('hand: shader not created');
	gl.shaderSource(s, src);
	gl.compileShader(s);
	return s;
}

/** Program for one pass (vertex shader plus fragment shader); linking continues to be polled asynchronously. */
function linkProgram(
	gl: WebGL2RenderingContext,
	pass1: boolean,
): { pr: WebGLProgram; fs: WebGLShader } {
	const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc(pass1));
	const vs = compile(gl, gl.VERTEX_SHADER, VS);
	const pr = gl.createProgram();
	if (!pr) throw new Error('hand: program not created');
	gl.attachShader(pr, vs);
	gl.attachShader(pr, fs);
	gl.linkProgram(pr);
	return { pr, fs };
}

/** Running suitability check: throwaway context with the programs it has kicked off (see glProbeStart). */
export interface Probe {
	cv: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	progs: { pr: WebGLProgram; fs: WebGLShader }[];
}

/** Part 1 of the suitability check: create the context, check the texture size, kick off both programs. false = unsuitable. */
export function glProbeStart(metaH: HoldMeta, metaP: AtlasMeta): Probe | false {
	const cv = document.createElement('canvas');
	const gl = cv.getContext('webgl2');
	if (!gl) return false;
	const need = Math.max(...metaH.atlas, ...metaP.atlas);
	if (gl.getParameter(gl.MAX_TEXTURE_SIZE) < need) return false;
	return { cv, gl, progs: [true, false].map((p1) => linkProgram(gl, p1)) };
}

/**
 * Part 2: check the result of the programs and of the output. undefined while the driver is still compiling
 * (KHR_parallel_shader_compile), then call again in a later frame.
 */
export function glProbeEnd({ cv, gl, progs }: Probe, immediate = false): boolean | undefined {
	const ext = gl.getExtension('KHR_parallel_shader_compile');
	if (
		!immediate &&
		ext &&
		progs.some(({ pr }) => !gl.getProgramParameter(pr, ext.COMPLETION_STATUS_KHR))
	)
		return undefined;
	let ok = true;
	for (const { pr, fs } of progs) {
		if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
			ok = false;
			console.warn('hand: shader not usable', gl.getShaderInfoLog(fs));
		}
	}
	if (ok && !glVisible(gl, cv)) {
		ok = false;
		// biome-ignore lint/suspicious/noConsole: diagnostics for devices with empty WebGL output
		console.debug('hand: WebGL output stays empty, 2D hand');
	}
	gl.getExtension('WEBGL_lose_context')?.loseContext();
	return ok;
}

/** Checks once whether WebGL2 works with the shader and the texture sizes (in a single step). */
export function glUsable(metaH: HoldMeta, metaP: AtlasMeta): boolean {
	const p = glProbeStart(metaH, metaP);
	return p ? (glProbeEnd(p, true) ?? false) : false;
}

const uniformTable = (f: (name: string) => WebGLUniformLocation | null): Uniforms => {
	return {
		uTH: f('uTH'),
		uTP: f('uTP'),
		uHT: f('uHT'),
		uPT: f('uPT'),
		uDiv: f('uDiv'),
		uHO: f('uHO'),
		uPO: f('uPO'),
		uPhone: f('uPhone'),
		uScreen: f('uScreen'),
		uPR: f('uPR'),
		uLight: f('uLight'),
		uTipU: f('uTipU'),
		uPS: f('uPS'),
		uRing: f('uRing'),
		uBr: f('uBr'),
		uQ: f('uQ'),
		uCam: f('uCam'),
		uBack: f('uBack'),
		uFront: f('uFront'),
		uTone: f('uTone'),
		uCell0: f('uCell0'),
		uCellN: f('uCellN'),
		uZer: f('uZer'),
	};
};

const uniformLocations = (gl: WebGL2RenderingContext, pr: WebGLProgram): Uniforms =>
	uniformTable((n) => gl.getUniformLocation(pr, n));

/** Placeholders until initProgram fetches the locations after linking. */
const noLocations = (): Uniforms => uniformTable(() => null);

/** Programs, cell buffer and state of a layer (on creation and after a restored context). */
function freshLayer(
	gl: WebGL2RenderingContext,
): Pick<
	Layer,
	'dead' | 'ready' | 'stage' | 'row' | 'last' | 'prs' | 'cells' | 'ext' | 'u' | 'vao'
> {
	const vao = gl.createVertexArray();
	if (!vao) throw new Error('hand: vertex array not created');
	return {
		dead: false,
		ready: false,
		stage: 0,
		row: 0,
		last: null,
		prs: [linkProgram(gl, true).pr, linkProgram(gl, false).pr],
		cells: { w: 0, h: 0, tex: null, fbo: null },
		ext: gl.getExtension('KHR_parallel_shader_compile'),
		u: [noLocations(), noLocations()],
		vao,
	};
}

export function makeLayer(cv: HTMLCanvasElement, front: boolean): Layer | null {
	const gl = cv.getContext('webgl2', {
		alpha: true,
		premultipliedAlpha: true,
		antialias: false,
		depth: false,
		stencil: false,
		powerPreference: 'high-performance',
	});
	if (!gl) return null;
	const L: Layer = {
		cv,
		gl,
		front,
		...freshLayer(gl),
		lastB: null,
		th: null,
		tp: null,
		tq: null,
		pend: [],
		gpuMs: [],
	};
	cv.addEventListener('webglcontextlost', (e) => {
		e.preventDefault();
		L.dead = true;
	});
	cv.addEventListener('webglcontextrestored', () => Object.assign(L, freshLayer(gl)));
	return L;
}

/** Create a texture for an atlas (empty, size of the image) and bind it. */
function createTexture(
	gl: WebGL2RenderingContext,
	unit: number,
	bmp: ImageBitmap,
): WebGLTexture | null {
	const tx = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + unit);
	gl.bindTexture(gl.TEXTURE_2D, tx);
	gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, bmp.width, bmp.height, 0, gl.RED, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return tx;
}

const STRIP_ROWS = 160; // rows per call: a whole atlas (8 MP) at once costs 20 to 30 ms, 330 rows still 4 to 5 ms per frame

/** Copy the next strip of the atlas into the bound texture (UNPACK_SKIP_ROWS). true when the atlas is complete. */
function uploadStrip(
	gl: WebGL2RenderingContext,
	unit: number,
	tx: WebGLTexture | null,
	bmp: ImageBitmap,
	L: Layer,
): boolean {
	const n = Math.min(STRIP_ROWS, bmp.height - L.row);
	gl.activeTexture(gl.TEXTURE0 + unit);
	gl.bindTexture(gl.TEXTURE_2D, tx);
	gl.pixelStorei(gl.UNPACK_SKIP_ROWS, L.row);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, L.row, bmp.width, n, gl.RED, gl.UNSIGNED_BYTE, bmp);
	gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
	L.row += n;
	return L.row >= bmp.height;
}

function setUniforms(
	L: Layer,
	u: Uniforms,
	S: DrawValues,
	cam: Fit,
	W: number,
	w: number,
	h: number,
	cells: CellGrid,
): void {
	const { gl } = L;
	const mh = atlases().hold.meta;
	gl.uniform4f(u.uPR, mh.phone.r, mh.screen.r, S.bottomY, S.lightPow);
	gl.uniform4f(u.uLight, S.light.x, S.light.y, S.ringAt.x, S.ringAt.y);
	gl.uniform4f(u.uTipU, S.tip.x, S.tip.y, S.u.x, S.u.y);
	gl.uniform4f(u.uPS, S.sc, S.pa, 0, 0);
	gl.uniform4f(u.uRing, S.ring > 0 ? S.ringR : 0, S.ring, S.ring > 0 ? 1 : 0, S.push);
	gl.uniform4f(u.uBr, S.br.x, S.br.y, S.br.r, 0);
	gl.uniform4fv(u.uQ, S.q);
	gl.uniform3f(u.uCam, cam.f, cam.ox, cam.oy);
	gl.uniform3f(u.uBack, w / W, h / cells.H, h);
	gl.uniform2i(u.uCell0, cells.i0, cells.j0);
	gl.uniform2i(u.uCellN, cells.cw, cells.ch);
	gl.uniform1f(u.uZer, S.decay);
}

function initProgram(L: Layer, k: 0 | 1): void {
	const { gl } = L;
	const pr = L.prs[k];
	const u = uniformLocations(gl, pr);
	L.u[k] = u;
	gl.useProgram(pr);
	const { hold, point } = atlases();
	const mh = hold.meta;
	const mp = point.meta;
	gl.uniform1i(u.uTH, 0);
	gl.uniform1i(u.uTP, 1);
	gl.uniform1i(u.uTone, 2);
	gl.uniform4fv(u.uHT, tileArray(mh));
	gl.uniform4fv(u.uPT, tileArray(mp));
	gl.uniform1fv(u.uDiv, divArray(mh));
	gl.uniform3f(u.uHO, mh.origin[0], mh.origin[1], mh.scale);
	gl.uniform3f(u.uPO, mp.origin[0], mp.origin[1], mp.scale);
	gl.uniform4f(u.uPhone, mh.phone.x, mh.phone.y, mh.phone.w, mh.phone.h);
	gl.uniform4f(u.uScreen, mh.screen.x, mh.screen.y, mh.screen.w, mh.screen.h);
	gl.uniform1i(u.uFront, L.front ? 1 : 0);
}

/** Bounding rectangle of both hands in the end space: [x0, y0, x1, y1]. */
function handBox(S: DrawValues): [number, number, number, number] {
	const { hold, point } = atlases();
	const mh = hold.meta;
	const mp = point.meta;
	const hb = [
		mh.origin[0],
		mh.origin[1],
		mh.origin[0] + mh.tile[0] / mh.scale,
		mh.origin[1] + mh.tile[1] / mh.scale,
	] as const;
	const a0 = mp.origin[0];
	const b0 = mp.origin[1];
	const a1 = a0 + mp.tile[0] / mp.scale;
	const b1 = b0 + mp.tile[1] / mp.scale;
	let bx0 = 1e9;
	let by0 = 1e9;
	let bx1 = -1e9;
	let by1 = -1e9;
	const corners: [number, number][] = [
		[a0, b0],
		[a1, b0],
		[a0, b1],
		[a1, b1],
	];
	for (const [a, b] of corners) {
		const x = S.tip.x + (S.u.x * a - S.u.y * b) * S.sc;
		const y = S.tip.y + (S.u.y * a + S.u.x * b) * S.sc;
		bx0 = Math.min(bx0, x);
		by0 = Math.min(by0, y);
		bx1 = Math.max(bx1, x);
		by1 = Math.max(by1, y);
	}
	return [Math.min(hb[0], bx0), Math.min(hb[1], by0), Math.max(hb[2], bx1), Math.max(hb[3], by1)];
}

/** One step per frame until the layer is ready (shader linked, textures uploaded). true when ready. */
export function readyStep(L: Layer): boolean {
	const { gl } = L;
	if (L.dead || gl.isContextLost()) return false;
	if (!L.ready) {
		const ext = L.ext;
		if (ext && L.prs.some((p) => !gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR)))
			return false;
		if (L.stage === 0) {
			if (L.prs.some((p) => !gl.getProgramParameter(p, gl.LINK_STATUS))) {
				L.dead = true;
				return false;
			}
			L.stage = 1;
			L.row = 0;
			L.th = createTexture(gl, 0, atlases().hold.bmp);
			return false;
		}
		// Upload atlases in strips: one strip per frame (hand, then pointing hand)
		if (L.stage === 1) {
			if (uploadStrip(gl, 0, L.th, atlases().hold.bmp, L)) {
				L.stage = 2;
				L.row = 0;
				L.tp = createTexture(gl, 1, atlases().point.bmp);
			}
			return false;
		}
		if (L.stage === 2) {
			if (uploadStrip(gl, 1, L.tp, atlases().point.bmp, L)) L.stage = 3;
			return false;
		}
		initProgram(L, 0);
		initProgram(L, 1);
		L.cells.tex = gl.createTexture();
		L.cells.fbo = gl.createFramebuffer();
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, L.cells.tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindVertexArray(L.vao);
		gl.disable(gl.BLEND);
		L.ready = true;
	}
	return true;
}

/** Draws a layer in two passes (tone per cell, then dots). false while it is not ready. */
export function glFrame(L: Layer, S: DrawValues, cam: Fit, W: number, H: number): boolean {
	const { gl, cv } = L;
	if (!readyStep(L)) return false;
	const w = cv.width;
	const h = cv.height;
	const key = [
		w,
		h,
		cam.f,
		cam.ox,
		cam.oy,
		S.light.x,
		S.light.y,
		S.ringAt.x,
		S.ringAt.y,
		S.lightPow,
		S.bottomY,
		S.tip.x,
		S.tip.y,
		S.u.x,
		S.u.y,
		S.sc,
		S.ring,
		...S.q,
		S.pa,
		S.push,
		S.decay,
	];
	const bkey = [S.br.x, S.br.y, S.br.r];
	const same =
		L.last !== null && L.last.length === key.length && L.last.every((v, i) => v === key[i]);
	// Breathing changes only pass 2 (dots), the tone per cell stays
	const nur2 = same && L.lastB !== null && !L.lastB.every((v, i) => v === bkey[i]);
	if (same && L.lastB !== null && !nur2) return true;
	L.last = key;
	L.lastB = bkey;

	// visible grid in the end space
	const i0 = Math.floor(-cam.ox / cam.f / STEP);
	const j0 = Math.floor(-cam.oy / cam.f / STEP);
	const cw = Math.floor((W - cam.ox) / cam.f / STEP) - i0 + 1;
	const ch = Math.floor((H - cam.oy) / cam.f / STEP) - j0 + 1;
	const cells: CellGrid = { i0, j0, cw, ch, H };
	const C = L.cells;
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, C.tex);
	if (C.w !== cw || C.h !== ch) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cw, ch, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, C.fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, C.tex, 0);
		C.w = cw;
		C.h = ch;
	}

	// Measurement hook (QA only): GPU time per layer via EXT_disjoint_timer_query_webgl2
	if (qa.gpuT && !L.tq) L.tq = gl.getExtension('EXT_disjoint_timer_query_webgl2');
	const T = qa.gpuT ? L.tq : null;
	let q: WebGLQuery | null = null;
	if (T) {
		let p0 = L.pend[0];
		while (p0 && gl.getQueryParameter(p0, gl.QUERY_RESULT_AVAILABLE)) {
			L.pend.shift();
			if (!gl.getParameter(T.GPU_DISJOINT_EXT))
				L.gpuMs.push(gl.getQueryParameter(p0, gl.QUERY_RESULT) / 1e6);
			p0 = L.pend[0];
		}
		q = gl.createQuery();
		if (q) gl.beginQuery(T.TIME_ELAPSED_EXT, q);
	}
	// Pass 1: tone per cell into the texture
	if (!nur2) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, C.fbo);
		gl.viewport(0, 0, cw, ch);
		gl.useProgram(L.prs[0]);
		setUniforms(L, L.u[0], S, cam, W, w, h, cells);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
	// Pass 2: dots onto the canvas
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, w, h);
	gl.useProgram(L.prs[1]);
	setUniforms(L, L.u[1], S, cam, W, w, h, cells);
	// rasterize only where a hand can be (holding-hand tile and pointing-hand sprite), the rest stays empty
	const bb = handBox(S);
	// Dust drifts to the top right beyond the tile
	if (S.decay > 0) {
		bb[2] += 260;
		bb[1] -= 260;
	}
	const k = w / W;
	const x0 = Math.max(0, Math.floor((bb[0] * cam.f + cam.ox) * k));
	const x1 = Math.min(w, Math.ceil((bb[2] * cam.f + cam.ox) * k));
	const y0 = Math.max(0, Math.floor(h - (bb[3] * cam.f + cam.oy) * k));
	const y1 = Math.min(h, Math.ceil(h - (bb[1] * cam.f + cam.oy) * k));
	gl.disable(gl.SCISSOR_TEST);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	if (x1 > x0 && y1 > y0) {
		gl.enable(gl.SCISSOR_TEST);
		gl.scissor(x0, y0, x1 - x0, y1 - y0);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.disable(gl.SCISSOR_TEST);
	}
	if (q && T) {
		gl.endQuery(T.TIME_ELAPSED_EXT);
		L.pend.push(q);
	}
	return true;
}
