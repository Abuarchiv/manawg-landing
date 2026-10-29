// Canvas an seine CSS-Box koppeln und der Szenenraum (PLAN-V2 2.3).
//
// Jeder Canvas folgt per ResizeObserver seiner CSS-Box. Das Backing ist CSS x min(DPR, Deckel).
// Komponierte Objekte liegen in einer Bezugsbox (Standard 1280 x 800), die per "contain" in die
// Fläche eingepasst wird. Hintergründe und Raster füllen immer die ganze Fläche.

export const FIT_MAX = 1.25;

/** Einpassung einer Bezugsbox in die Fläche: Maßstab f und Versatz (ox, oy) in CSS-Pixeln. */
export interface Fit {
	f: number;
	ox: number;
	oy: number;
}

/** Sichtbare Fläche im Szenenraum. */
export interface Area {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/** Zeigerposition in CSS-Pixeln der Canvas-Fläche (px, py) und in Szenenkoordinaten (x, y). */
export interface Pointer {
	px: number;
	py: number;
	x: number;
	y: number;
}

/** Einpassung der Box bw x bh in die Fläche W x H (contain, höchstens FIT_MAX, zentriert). */
export function fitBox(W: number, H: number, bw = 1280, bh = 800, max = FIT_MAX): Fit {
	const f = Math.min(W / bw, H / bh, max);
	return { f, ox: (W - bw * f) / 2, oy: (H - bh * f) / 2 };
}

/** Sichtbare Fläche im Szenenraum: von (x0, y0) bis (x1, y1). Füllt die ganze Canvas-Fläche. */
export function area(W: number, H: number, fit: Fit): Area {
	return {
		x0: -fit.ox / fit.f,
		y0: -fit.oy / fit.f,
		x1: (W - fit.ox) / fit.f,
		y1: (H - fit.oy) / fit.f,
	};
}

const mq = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : null;

/** Grobe Zeigergeräte (Touch): dort gelten niedrigere Deckel für große Flächen. */
export function isTouch(): boolean {
	return !!mq && mq.matches;
}

/** Haken der Schleife: wird bei jeder Größenänderung gerufen (weckt ruhende Szenen). */
export const wakeHook: { fn: () => void } = { fn() {} };

/** Auflösungsstufe aus der Bildzeit (loop.js senkt sie bei dauerhaft langsamen Bildern, 1 = voll). */
export const quality = { f: 1 };

/** Höchstfläche eines Backings in Pixeln (8 MP = 32 MB): große Vollflächen auf 4K/5K bekommen einen kleineren Faktor. */
const MAX_PX = 8e6;

/** Pixelfaktor eines Canvas: min(DPR, Deckel) mal Auflösungsstufe, nie unter 1. Mit W, H zusätzlich auf MAX_PX begrenzt. */
export function dprFor(cap = 2, touchCap = cap, W = 0, H = 0): number {
	let d = Math.min(window.devicePixelRatio || 1, isTouch() ? touchCap : cap);
	if (W * H > 0) d = Math.min(d, Math.sqrt(MAX_PX / (W * H)));
	return Math.max(1, d * quality.f);
}

/**
 * Prüft, ob ein WebGL-Canvas Bildpunkte bis in ein 2D-Canvas bringt (Treiber mit kaputter Ausgabe, z. B. Emulator,
 * liefern leere Flächen): rot löschen, in 1 x 1 Pixel kopieren, Deckkraft lesen.
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
 * Läuft WebGL2 nur per Software (SwiftShader, llvmpipe)? Dann rechnen Shader auf dem Hauptprozessor und blockieren die Seite.
 * Geprüft in einem Worker: der erste Kontext baut den GPU-Kanal auf (ohne Grafikchip Sekunden), das hält dort nicht den Hauptthread an.
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

/** Backing auf CSS-Größe x dpr setzen. Gibt true zurück, wenn sich die Größe geändert hat. */
export function sizeBacking(cv: HTMLCanvasElement, W: number, H: number, dpr: number): boolean {
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	if (cv.width === w && cv.height === h) return false;
	cv.width = w;
	cv.height = h;
	return true;
}

/** Transform für vollflächige Hintergründe (CSS-Pixel). */
export function full(ctx: CanvasRenderingContext2D, dpr: number): void {
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/** Transform für die Komposition im Szenenraum. */
export function scene(ctx: CanvasRenderingContext2D, dpr: number, fit: Fit): void {
	ctx.setTransform(dpr * fit.f, 0, 0, dpr * fit.f, dpr * fit.ox, dpr * fit.oy);
}

/** Zeigerposition eines Ereignisses in Szenenkoordinaten (und CSS-Pixeln der Canvas-Fläche). */
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
 * ResizeObserver für ein Element. Ruft fn(W, H) sofort und bei jeder Größenänderung auf.
 * W und H sind die CSS-Maße (Layout, ohne Transform).
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
