// Binding a canvas to its CSS box, and the scene space.
//
// Every canvas follows its CSS box via ResizeObserver. The backing store is CSS x min(DPR, cap).
// Composed objects live in a reference box (default 1280 x 800) that is fitted into the area
// with "contain". Backgrounds and grids always fill the whole area.

const FIT_MAX = 1.25;

/** Fit of a reference box into the area: scale f and offset (ox, oy) in CSS pixels. */
export interface Fit {
	f: number;
	ox: number;
	oy: number;
}

/** Pointer position in CSS pixels of the canvas area (px, py) and in scene coordinates (x, y). */
interface Pointer {
	px: number;
	py: number;
	x: number;
	y: number;
}

/** Fit of the box bw x bh into the area W x H (contain, at most FIT_MAX, centred). */
export function fitBox(W: number, H: number, bw = 1280, bh = 800, max = FIT_MAX): Fit {
	const f = Math.min(W / bw, H / bh, max);
	return { f, ox: (W - bw * f) / 2, oy: (H - bh * f) / 2 };
}

const mq = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : null;

/** Coarse pointer devices (touch): lower caps apply there for large areas. */
export function isTouch(): boolean {
	return !!mq && mq.matches;
}

/** Hook of the loop: called on every size change (wakes idle scenes). */
export const wakeHook: { fn: () => void } = { fn() {} };

/** Resolution step derived from the frame time (loop.ts lowers it when frames stay slow, 1 = full). */
export const quality = { f: 1 };

/** Maximum area of a backing store in pixels (8 MP = 32 MB): large full-bleed areas on 4K/5K get a smaller factor. */
const MAX_PX = 8e6;

/** Pixel factor of a canvas: min(DPR, cap) times resolution step, never below 1. With W, H it is also limited to MAX_PX. */
export function dprFor(cap = 2, touchCap = cap, W = 0, H = 0): number {
	let d = Math.min(window.devicePixelRatio || 1, isTouch() ? touchCap : cap);
	if (W * H > 0) d = Math.min(d, Math.sqrt(MAX_PX / (W * H)));
	return Math.max(1, d * quality.f);
}

/**
 * Checks whether a WebGL canvas delivers pixels all the way into a 2D canvas (drivers with broken output, e.g. an
 * emulator, return empty areas): clear to red, copy into 1 x 1 pixel, read the alpha.
 */
export function glVisible(
	gl: WebGLRenderingContext | WebGL2RenderingContext,
	cv: HTMLCanvasElement,
): boolean {
	try {
		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		const t = document.createElement('canvas');
		t.width = t.height = 1;
		const g = t.getContext('2d', { willReadFrequently: true });
		if (!g) return true;
		g.drawImage(cv, 0, 0, 1, 1);
		return (g.getImageData(0, 0, 1, 1).data[3] ?? 0) > 0;
	} catch {
		return true;
	}
}

let soft: Promise<boolean> | null = null;

/**
 * Does WebGL2 run in software only (SwiftShader, llvmpipe)? Then shaders run on the main processor and block the page.
 * Checked in a worker: the first context sets up the GPU channel (seconds without a graphics chip), which does not stall the main thread there.
 */
export function glSoftware(): Promise<boolean> {
	soft ??= new Promise((res) => {
		if (typeof Worker !== 'function' || typeof OffscreenCanvas !== 'function') return res(false);
		const w = new Worker('/gl-probe.js');
		const done = (r: unknown) => {
			res(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(String(r)));
			w.terminate();
		};
		w.onmessage = (e) => done(e.data);
		w.onerror = () => done('');
	});
	return soft;
}

/** Sets the backing store to CSS size x dpr. Returns true when the size changed. */
export function sizeBacking(cv: HTMLCanvasElement, W: number, H: number, dpr: number): boolean {
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	if (cv.width === w && cv.height === h) return false;
	cv.width = w;
	cv.height = h;
	return true;
}

/** Transform for full-bleed backgrounds (CSS pixels). */
export function full(ctx: CanvasRenderingContext2D, dpr: number): void {
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/** Transform for the composition in scene space. */
export function scene(ctx: CanvasRenderingContext2D, dpr: number, fit: Fit): void {
	ctx.setTransform(dpr * fit.f, 0, 0, dpr * fit.f, dpr * fit.ox, dpr * fit.oy);
}

/** Pointer position of an event in scene coordinates (and CSS pixels of the canvas area). */
export function pointerIn(
	e: Pick<PointerEvent, 'clientX' | 'clientY'>,
	rect: Pick<DOMRect, 'left' | 'top'>,
	fit: Fit,
): Pointer {
	const px = e.clientX - rect.left;
	const py = e.clientY - rect.top;
	return { px, py, x: (px - fit.ox) / fit.f, y: (py - fit.oy) / fit.f };
}

/**
 * ResizeObserver for an element. Calls fn(W, H) immediately and on every size change.
 * W and H are the CSS dimensions (layout, without transform).
 */
export function observe(el: Element, fn: (W: number, H: number) => void): () => void {
	fn(el.clientWidth, el.clientHeight);
	if (typeof ResizeObserver === 'undefined') return () => {};
	const ro = new ResizeObserver(() => {
		wakeHook.fn();
		fn(el.clientWidth, el.clientHeight);
	});
	ro.observe(el);
	return () => ro.disconnect();
}

/**
 * Compile and link a program from vertex and fragment source. Returns null if a step fails and
 * logs the driver's message under `label`; the scenes then fall back to their 2D drawing.
 * `attrib` binds that vertex attribute to location 0 before linking.
 */
export function buildProgram(
	gl: WebGL2RenderingContext,
	vs: string,
	fs: string,
	label: string,
	attrib?: string,
): WebGLProgram | null {
	const p = gl.createProgram();
	if (!p) return null;
	for (const [kind, src] of [
		[gl.VERTEX_SHADER, vs],
		[gl.FRAGMENT_SHADER, fs],
	] as const) {
		const sh = gl.createShader(kind);
		if (!sh) return null;
		gl.shaderSource(sh, src);
		gl.compileShader(sh);
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			console.error(`${label}: shader`, gl.getShaderInfoLog(sh));
			return null;
		}
		gl.attachShader(p, sh);
	}
	if (attrib) gl.bindAttribLocation(p, 0, attrib);
	gl.linkProgram(p);
	if (gl.getProgramParameter(p, gl.LINK_STATUS)) return p;
	console.error(`${label}: link`, gl.getProgramInfoLog(p));
	return null;
}
