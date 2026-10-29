// Reads the WebGL renderer name off the main thread (see glSoftware in src/components/landing/core/canvas.ts).
let r = '';
try {
	const g = new OffscreenCanvas(1, 1).getContext('webgl2');
	const e = g?.getExtension('WEBGL_debug_renderer_info');
	if (g) r = String(g.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : g.RENDERER));
} catch {
	// no WebGL2 here: report an empty name
}
postMessage(r);
