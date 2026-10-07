// Canvas an seine CSS-Box koppeln und der Szenenraum (PLAN-V2 2.3).
//
// Jeder Canvas folgt per ResizeObserver seiner CSS-Box. Das Backing ist CSS x min(DPR, Deckel).
// Komponierte Objekte liegen in einer Bezugsbox (Standard 1280 x 800), die per "contain" in die
// Fläche eingepasst wird. Hintergründe und Raster füllen immer die ganze Fläche.

export const FIT_MAX = 1.25;

/** Einpassung der Box bw x bh in die Fläche W x H (contain, höchstens FIT_MAX, zentriert). */
export function fitBox(W, H, bw = 1280, bh = 800, max = FIT_MAX) {
	const f = Math.min(W / bw, H / bh, max);
	return { f, ox: (W - bw * f) / 2, oy: (H - bh * f) / 2 };
}

/** Sichtbare Fläche im Szenenraum: von (x0, y0) bis (x1, y1). Füllt die ganze Canvas-Fläche. */
export function area(W, H, fit) {
	return {
		x0: -fit.ox / fit.f,
		y0: -fit.oy / fit.f,
		x1: (W - fit.ox) / fit.f,
		y1: (H - fit.oy) / fit.f,
	};
}

const mq = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : null;

/** Grobe Zeigergeräte (Touch): dort gelten niedrigere Deckel für große Flächen. */
export function isTouch() {
	return !!mq && mq.matches;
}

/** Auflösungsstufe aus der Bildzeit (loop.js senkt sie bei dauerhaft langsamen Bildern, 1 = voll). */
export const qual = { f: 1 };

/** Pixelfaktor eines Canvas: min(DPR, Deckel) mal Auflösungsstufe, nie unter 1. */
export function dprFor(cap = 2, touchCap = cap) {
	return Math.max(1, Math.min(window.devicePixelRatio || 1, isTouch() ? touchCap : cap) * qual.f);
}

/**
 * Prüft, ob ein WebGL-Canvas Bildpunkte bis in ein 2D-Canvas bringt (Treiber mit kaputter Ausgabe, z. B. Emulator,
 * liefern leere Flächen): rot löschen, in 1 x 1 Pixel kopieren, Deckkraft lesen.
 */
export function glSichtbar(gl, cv) {
	try {
		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		const t = document.createElement('canvas');
		t.width = t.height = 1;
		const g = t.getContext('2d', { willReadFrequently: true });
		if (!g) return true;
		g.drawImage(cv, 0, 0, 1, 1);
		return g.getImageData(0, 0, 1, 1).data[3] > 0;
	} catch {
		return true;
	}
}

/** Backing auf CSS-Größe x dpr setzen. Gibt true zurück, wenn sich die Größe geändert hat. */
export function sizeBacking(cv, W, H, dpr) {
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	if (cv.width === w && cv.height === h) return false;
	cv.width = w;
	cv.height = h;
	return true;
}

/** Transform für vollflächige Hintergründe (CSS-Pixel). */
export function full(ctx, dpr) {
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/** Transform für die Komposition im Szenenraum. */
export function scene(ctx, dpr, fit) {
	ctx.setTransform(dpr * fit.f, 0, 0, dpr * fit.f, dpr * fit.ox, dpr * fit.oy);
}

/** Zeigerposition eines Ereignisses in Szenenkoordinaten (und CSS-Pixeln der Canvas-Fläche). */
export function pointerIn(e, rect, fit) {
	const px = e.clientX - rect.left;
	const py = e.clientY - rect.top;
	return { px, py, x: (px - fit.ox) / fit.f, y: (py - fit.oy) / fit.f };
}

/**
 * ResizeObserver für ein Element. Ruft fn(W, H) sofort und bei jeder Größenänderung auf.
 * W und H sind die CSS-Maße (Layout, ohne Transform).
 */
export function observe(el, fn) {
	fn(el.clientWidth, el.clientHeight);
	if (typeof ResizeObserver === 'undefined') return () => {};
	const ro = new ResizeObserver(() => fn(el.clientWidth, el.clientHeight));
	ro.observe(el);
	return () => ro.disconnect();
}
