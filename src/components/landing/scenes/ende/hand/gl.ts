// WebGL2-Weg der Hände: Eignungsprüfung, Ebenen (Programme, Texturen) und die zwei Durchgänge je Bild.

import { glSichtbar } from '../../../core/canvas';
import type { Fit } from '../../../core/canvas';
import { loop, qa } from '../../../core/loop';
import { atlanten, divArray, tileArray } from './atlas';
import { STEP } from './konstanten';
import { VS, fsSrc } from './shader';
import type { AtlasMeta, Ebene, HaltMeta, Raster, Uniforms, Zeichenwerte } from './typen';

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
	const s = gl.createShader(type);
	if (!s) throw new Error('hand: Shader nicht erzeugt');
	gl.shaderSource(s, src);
	gl.compileShader(s);
	return s;
}

/** Programm für einen Durchgang (Vertex-Shader plus Fragment-Shader), gelinkt wird asynchron weitergeprüft. */
function linkProgram(
	gl: WebGL2RenderingContext,
	pass1: boolean,
): { pr: WebGLProgram; fs: WebGLShader } {
	const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc(pass1));
	const vs = compile(gl, gl.VERTEX_SHADER, VS);
	const pr = gl.createProgram();
	if (!pr) throw new Error('hand: Programm nicht erzeugt');
	gl.attachShader(pr, vs);
	gl.attachShader(pr, fs);
	gl.linkProgram(pr);
	return { pr, fs };
}

/** Laufende Eignungsprüfung: Wegwerf-Kontext mit den angestoßenen Programmen (siehe glTaugtStart). */
export interface Probe {
	cv: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	progs: { pr: WebGLProgram; fs: WebGLShader }[];
}

/** Teil 1 der Eignungsprüfung: Kontext anlegen, Texturgröße prüfen, beide Programme anstoßen. false = untauglich. */
export function glTaugtStart(metaH: HaltMeta, metaP: AtlasMeta): Probe | false {
	const cv = document.createElement('canvas');
	const gl = cv.getContext('webgl2');
	if (!gl) return false;
	const need = Math.max(...metaH.atlas, ...metaP.atlas);
	if (gl.getParameter(gl.MAX_TEXTURE_SIZE) < need) return false;
	return { cv, gl, progs: [true, false].map((p1) => linkProgram(gl, p1)) };
}

/**
 * Teil 2: Ergebnis der Programme und der Ausgabe prüfen. undefined, solange der Treiber noch übersetzt
 * (KHR_parallel_shader_compile), dann in einem späteren Bild erneut rufen.
 */
export function glTaugtEnde({ cv, gl, progs }: Probe, sofort = false): boolean | undefined {
	const ext = gl.getExtension('KHR_parallel_shader_compile');
	if (
		!sofort &&
		ext &&
		progs.some(({ pr }) => !gl.getProgramParameter(pr, ext.COMPLETION_STATUS_KHR))
	)
		return undefined;
	let ok = true;
	for (const { pr, fs } of progs) {
		if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
			ok = false;
			console.warn('hand: Shader nicht verwendbar', gl.getShaderInfoLog(fs));
		}
	}
	if (ok && !glSichtbar(gl, cv)) {
		ok = false;
		// biome-ignore lint/suspicious/noConsole: Diagnose für Geräte mit leerer WebGL-Ausgabe
		console.debug('hand: WebGL-Ausgabe bleibt leer, 2D-Hand');
	}
	gl.getExtension('WEBGL_lose_context')?.loseContext();
	return ok;
}

/** Prüft einmalig, ob WebGL2 mit dem Shader und den Texturgrößen taugt (in einem Zug). */
export function glTaugt(metaH: HaltMeta, metaP: AtlasMeta): boolean {
	const p = glTaugtStart(metaH, metaP);
	return p ? (glTaugtEnde(p, true) ?? false) : false;
}

const uniformTabelle = (f: (name: string) => WebGLUniformLocation | null): Uniforms => {
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
		uVar: f('uVar'),
		uGly: f('uGly'),
	};
};

const uniformOrte = (gl: WebGL2RenderingContext, pr: WebGLProgram): Uniforms =>
	uniformTabelle((n) => gl.getUniformLocation(pr, n));

/** Platzhalter, bis initProgram die Orte nach dem Linken holt. */
const leereOrte = (): Uniforms => uniformTabelle(() => null);

/** Programme, Zellpuffer und Zustand einer Ebene (beim Anlegen und nach wiederhergestelltem Kontext). */
function frisch(
	gl: WebGL2RenderingContext,
): Pick<
	Ebene,
	| 'dead'
	| 'ready'
	| 'stage'
	| 'zeile'
	| 'last'
	| 'prs'
	| 'cells'
	| 'ext'
	| 'u'
	| 'vao'
	| 'gly'
	| 'glyFv'
> {
	const vao = gl.createVertexArray();
	if (!vao) throw new Error('hand: Vertex-Array nicht erzeugt');
	return {
		dead: false,
		ready: false,
		stage: 0,
		zeile: 0,
		last: null,
		prs: [linkProgram(gl, true).pr, linkProgram(gl, false).pr],
		cells: { w: 0, h: 0, tex: null, fbo: null },
		ext: gl.getExtension('KHR_parallel_shader_compile'),
		u: [leereOrte(), leereOrte()],
		vao,
		gly: null,
		glyFv: -1,
	};
}

export function makeLayer(cv: HTMLCanvasElement, front: boolean): Ebene | null {
	const gl = cv.getContext('webgl2', {
		alpha: true,
		premultipliedAlpha: true,
		antialias: false,
		depth: false,
		stencil: false,
		powerPreference: 'high-performance',
	});
	if (!gl) return null;
	const L: Ebene = {
		cv,
		gl,
		front,
		...frisch(gl),
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
	cv.addEventListener('webglcontextrestored', () => Object.assign(L, frisch(gl)));
	return L;
}

/** Textur für einen Atlas anlegen (leer, Größe des Bildes) und binden. */
function legeTexAn(
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

const STREIFEN_ZEILEN = 330; // Zeilen je Aufruf: ein ganzer Atlas (8 MP) auf einmal kostet 20 bis 30 ms

/** Nächsten Streifen des Atlas in die gebundene Textur kopieren (UNPACK_SKIP_ROWS). true, wenn der Atlas komplett ist. */
function ladeStreifen(
	gl: WebGL2RenderingContext,
	unit: number,
	tx: WebGLTexture | null,
	bmp: ImageBitmap,
	L: Ebene,
): boolean {
	const n = Math.min(STREIFEN_ZEILEN, bmp.height - L.zeile);
	gl.activeTexture(gl.TEXTURE0 + unit);
	gl.bindTexture(gl.TEXTURE_2D, tx);
	gl.pixelStorei(gl.UNPACK_SKIP_ROWS, L.zeile);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, L.zeile, bmp.width, n, gl.RED, gl.UNSIGNED_BYTE, bmp);
	gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
	L.zeile += n;
	return L.zeile >= bmp.height;
}

function setUniforms(
	L: Ebene,
	u: Uniforms,
	S: Zeichenwerte,
	cam: Fit,
	W: number,
	w: number,
	h: number,
	cells: Raster,
): void {
	const { gl } = L;
	const mh = atlanten().hold.meta;
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
	gl.uniform1f(u.uZer, S.zer);
	// Varianten: A/C Stichlinien im Abstand von 3,4 CSS-px, B Zeichenzellen 7 CSS-px breit (beides in Bühnen-px)
	const v = loop.v === 'b' ? 2 : loop.v ? 1 : 0;
	gl.uniform2f(u.uVar, v, (v === 2 ? 7 : 3.4) / cam.f);
}

function initProgram(L: Ebene, k: 0 | 1): void {
	const { gl } = L;
	const pr = L.prs[k];
	const u = uniformOrte(gl, pr);
	L.u[k] = u;
	gl.useProgram(pr);
	const { hold, point } = atlanten();
	const mh = hold.meta;
	const mp = point.meta;
	gl.uniform1i(u.uTH, 0);
	gl.uniform1i(u.uTP, 1);
	gl.uniform1i(u.uTone, 2);
	gl.uniform1i(u.uGly, 3);
	gl.uniform4fv(u.uHT, tileArray(mh));
	gl.uniform4fv(u.uPT, tileArray(mp));
	gl.uniform1fv(u.uDiv, divArray(mh));
	gl.uniform3f(u.uHO, mh.origin[0], mh.origin[1], mh.scale);
	gl.uniform3f(u.uPO, mp.origin[0], mp.origin[1], mp.scale);
	gl.uniform4f(u.uPhone, mh.phone.x, mh.phone.y, mh.phone.w, mh.phone.h);
	gl.uniform4f(u.uScreen, mh.screen.x, mh.screen.y, mh.screen.w, mh.screen.h);
	gl.uniform1i(u.uFront, L.front ? 1 : 0);
}

/** Umschließendes Rechteck beider Hände im Ende-Raum: [x0, y0, x1, y1]. */
function handBox(S: Zeichenwerte): [number, number, number, number] {
	const { hold, point } = atlanten();
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
	const ecken: [number, number][] = [
		[a0, b0],
		[a1, b0],
		[a0, b1],
		[a1, b1],
	];
	for (const [a, b] of ecken) {
		const x = S.tip.x + (S.u.x * a - S.u.y * b) * S.sc;
		const y = S.tip.y + (S.u.y * a + S.u.x * b) * S.sc;
		bx0 = Math.min(bx0, x);
		by0 = Math.min(by0, y);
		bx1 = Math.max(bx1, x);
		by1 = Math.max(by1, y);
	}
	return [Math.min(hb[0], bx0), Math.min(hb[1], by0), Math.max(hb[2], bx1), Math.max(hb[3], by1)];
}

/** Ein Schritt je Bild bis die Ebene bereit ist (Shader gelinkt, Texturen hochgeladen). true, wenn bereit. */
export function readyStep(L: Ebene): boolean {
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
			L.zeile = 0;
			L.th = legeTexAn(gl, 0, atlanten().hold.bmp);
			return false;
		}
		// Atlanten streifenweise hochladen: ein Streifen je Bild (Hand, dann Zeigehand)
		if (L.stage === 1) {
			if (ladeStreifen(gl, 0, L.th, atlanten().hold.bmp, L)) {
				L.stage = 2;
				L.zeile = 0;
				L.tp = legeTexAn(gl, 1, atlanten().point.bmp);
			}
			return false;
		}
		if (L.stage === 2) {
			if (ladeStreifen(gl, 1, L.tp, atlanten().point.bmp, L)) L.stage = 3;
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
	if (loop.v === 'b' && L.glyFv !== loop.fv) zeichenBlatt(L);
	return true;
}

// Variante B: Rampe als Zeichenblatt (zehn Glyphen à 48 x 70 px) auf Einheit 3
const RAMPE = ' .:-=+*#%@';
function zeichenBlatt(L: Ebene): void {
	const { gl } = L;
	const cv = document.createElement('canvas');
	cv.width = 48 * RAMPE.length;
	cv.height = 70;
	const g = cv.getContext('2d');
	if (!g) return;
	g.font = '500 60px "JetBrains Mono", monospace';
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#fff';
	for (let i = 0; i < RAMPE.length; i++) g.fillText(RAMPE[i] ?? '', 48 * i + 24, 37);
	L.gly ??= gl.createTexture();
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, L.gly);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, cv);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.activeTexture(gl.TEXTURE2);
	L.glyFv = loop.fv;
}

/** Zeichnet eine Ebene in zwei Durchgängen (Ton je Zelle, dann Punkte). false, solange sie nicht bereit ist. */
export function glFrame(L: Ebene, S: Zeichenwerte, cam: Fit, W: number, H: number): boolean {
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
		S.zer,
	];
	const bkey = [S.br.x, S.br.y, S.br.r];
	const same =
		L.last !== null && L.last.length === key.length && L.last.every((v, i) => v === key[i]);
	// Atmen ändert nur Durchgang 2 (Punkte), der Ton je Zelle bleibt
	const nur2 = same && L.lastB !== null && !L.lastB.every((v, i) => v === bkey[i]);
	if (same && L.lastB !== null && !nur2) return true;
	L.last = key;
	L.lastB = bkey;

	// sichtbares Raster im Ende-Raum
	const i0 = Math.floor(-cam.ox / cam.f / STEP);
	const j0 = Math.floor(-cam.oy / cam.f / STEP);
	const cw = Math.floor((W - cam.ox) / cam.f / STEP) - i0 + 1;
	const ch = Math.floor((H - cam.oy) / cam.f / STEP) - j0 + 1;
	const cells: Raster = { i0, j0, cw, ch, H };
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

	// Messhaken (nur QA): GPU-Zeit je Ebene über EXT_disjoint_timer_query_webgl2
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
	// Durchgang 1: Ton je Zelle in die Textur
	if (!nur2) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, C.fbo);
		gl.viewport(0, 0, cw, ch);
		gl.useProgram(L.prs[0]);
		setUniforms(L, L.u[0], S, cam, W, w, h, cells);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
	// Durchgang 2: Punkte auf die Leinwand
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, w, h);
	gl.useProgram(L.prs[1]);
	setUniforms(L, L.u[1], S, cam, W, w, h, cells);
	// nur dort rastern, wo eine Hand liegen kann (Haltehand-Kachel und Sprite der Zeigehand), Rest bleibt leer
	const bb = handBox(S);
	// Staub weht nach oben rechts über die Kachel hinaus
	if (S.zer > 0) {
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
