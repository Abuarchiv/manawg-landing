// Renderer-Name abseits des Hauptthreads (siehe glSoftware in src/components/landing/core/canvas.ts).
let r = '';
try {
	const g = new OffscreenCanvas(1, 1).getContext('webgl2');
	const e = g?.getExtension('WEBGL_debug_renderer_info');
	if (g) r = String(g.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : g.RENDERER));
} catch {}
postMessage(r);
