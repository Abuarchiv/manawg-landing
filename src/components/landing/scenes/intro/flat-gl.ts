// Die Wohnung als Zeichen: ein isometrischer Blender-Schnitt (landing-konzept/wohnung-iso) liegt als Helligkeit
// (lum.webp), Klasse, Höhe und Deckung (meta.png) und Maße (wohnung.json) vor. Je Zeichenzelle (6 x 10 CSS-px)
// wählt die Klasse die Zeichenreihe (Dielen . : -, Perser bis @, Pflanzen ; * &), die Helligkeit das Zeichen.
// Gezeichnet wird in ein eigenes WebGL-Canvas, das wohnung.ts als Untergrund übernimmt.

import { loop } from '../../core/loop';

/** Maße des Renders: S Bildpixel je Rastereinheit, Ursprung (OX, OY), Größe, Höhe der Höhenkodierung. */
interface FlatMetrics {
	S: number;
	OX: number;
	OY: number;
	w: number;
	h: number;
	hMax: number;
}

/** Eingaben je Bild: Abbildung Bildpixel -> CSS-px (k, bx, by), Aufbau, Räume mit Licht, Zeiger. */
export interface GlyphInput {
	W: number;
	H: number;
	dpr: number;
	/** CSS-px je Rastereinheit (f * u) und CSS-Lage des Rasterursprungs (0, 0, 0). */
	ku: number;
	x0: number;
	y0: number;
	build: number;
	/** Räume im Raster (x, y, w, d) und ihr Licht 0..1, höchstens acht. */
	rooms: readonly (readonly [number, number, number, number])[];
	light: readonly number[];
	/** Zeiger in CSS-px und Radius des Lichtkegels (0 = aus). */
	pointer: readonly [number, number, number];
}

// Zelle in CSS-px: quer 6 x 10, Handy feiner (4,5 x 7,5), sonst wird die Übersicht zu grob
const cellSize = (W: number): [number, number] => (W < 700 ? [4.5, 7.5] : [6, 10]);
const ATLAS = " .:-=+*#%@~oO0|&;,/'";
// Zeichenreihen je Klasse (Code aus meta.png) von leer nach voll, dazu die Helligkeit: Böden und Wände treten
// zurück (Punktraster wie bisher), Möbel, Perser und Pflanzen tragen das Bild. 14 = Mauerkrone (Schnittkante).
const RAMPS: readonly (readonly [string, number])[] = [
	['', 0],
	['  ..:', 0.5], // Dielen
	[' ..:+', 0.55], // Fliesen
	[' ..:', 0.32], // Wände
	[' .:-=+*#%@', 1], // Perser
	[' .:oO0@', 1], // Polster, Leder
	[' .~-=', 0.95], // Bettwäsche, Stoff
	[' .:=#%', 0.9], // Holzmöbel
	[' .-=|#', 0.9], // Metall
	[' .oO0', 1], // Keramik
	[' .,;*&', 1], // Pflanzen
	[' .:|#', 0.9], // Bücher, Deko
	[" .'/", 0.8], // Glas
	['*@', 1], // Lampen
	['==#', 0.95], // Mauerkrone
];

const VS = `#version 300 es
void main(){ vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); gl_Position = vec4(p * 2. - 1., 0., 1.); }`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uLum, uMeta, uGly, uRamp;
uniform vec2 uRes;
uniform float uDpr, uS, uHmax, uBau, uLod, uN;
uniform vec3 uMap;   // CSS-px je Bildpixel, Bild-Ursprung in CSS-px
uniform vec4 uImg;   // Breite, Höhe, OX, OY (Bildpixel)
uniform vec4 uRm[8];
uniform float uLt[8];
uniform vec3 uZg;
out vec4 o;
uniform vec2 Z;      // Zelle in CSS-px
const float BY[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
float bayer(vec2 c){
  ivec2 b = ivec2(mod(c, 4.));
  return BY[b.y * 4 + b.x] / 16.;
}
void main(){
  float bg = .039;
  o = vec4(vec3(bg), 1.);
  vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 ci = floor(css / Z);
  vec2 I = ((ci + .5) * Z - uMap.yz) / uMap.x;
  vec2 uv = I / uImg.xy;
  if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) return;
  vec4 mt = texture(uMeta, uv);
  if (mt.a < .5) return;
  int cls = int(mt.r * 255. / 16. + .5);
  float gz = mt.g * uHmax;
  if (cls == 3 && gz > 2.05) cls = 14;
  // Aufbau: Böden zuerst, Hohes zuletzt, im Bayer-Raster
  if (bayer(ci) >= uBau * 1.6 - gz / uHmax * .6) return;
  // Rasterlage der Fläche (über die Höhe zurückgerechnet) -> Raum und sein Licht
  float d = (I.x - uImg.z) / (.8660254 * uS);
  float s = (I.y - uImg.w) / (.5 * uS) + 2. * gz;
  vec2 g = vec2(s + d, s - d) * .5;
  float lit = 0.;
  for (int i = 0; i < 8; i++) {
    vec4 r = uRm[i];
    if (g.x >= r.x && g.y >= r.y && g.x < r.x + r.z && g.y < r.y + r.w) lit = uLt[i];
  }
  float li = uZg.z > 0. ? pow(max(0., 1. - length((ci + .5) * Z - uZg.xy) / uZg.z), 2.) : 0.;
  float L = textureLod(uLum, uv, uLod).r;
  float n = texelFetch(uRamp, ivec2(0, cls), 0).r * 255.;
  if (n < .5) return;
  // Umriss: Möbelzellen, deren Nachbar deutlich tiefer liegt, werden dicht und hell (Figur vor Grund)
  float kante = 0.;
  if (cls > 3 && cls < 14) {
    vec2 dz = Z / uMap.x / uImg.xy;
    float lo = min(min(texture(uMeta, uv + vec2(dz.x, 0.)).g, texture(uMeta, uv - vec2(dz.x, 0.)).g),
      min(texture(uMeta, uv + vec2(0., dz.y)).g, texture(uMeta, uv - vec2(0., dz.y)).g)) * uHmax;
    kante = step(.3, gz - lo);
  }
  float t = clamp(max(L * 1.1 + li * .35, kante * .8), 0., .999);
  float id = texelFetch(uRamp, ivec2(1 + int(t * n), cls), 0).r * 255.;
  vec2 lu = fract(css / Z);
  vec2 au = vec2((id + lu.x) / uN, lu.y);
  float a = smoothstep(.1, .55, textureGrad(uGly, au, vec2(1. / (Z.x * uDpr * uN), 0.), vec2(0., 1. / (Z.y * uDpr))).r);
  float br = texelFetch(uRamp, ivec2(15, cls), 0).r * clamp(.58 + .42 * lit + .6 * li + .25 * kante, 0., 1.);
  o = vec4(vec3(bg + a * (.98 - bg) * br), 1.);
}`;

interface Gl {
	cv: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	u: (n: string) => WebGLUniformLocation | null;
	m: FlatMetrics;
	glyphs: WebGLTexture | null;
	fv: number;
}

let glState: Gl | null = null;
let started = false;

async function loadImage(src: string): Promise<ImageBitmap> {
	const blob = await (await fetch(src)).blob();
	return createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
}

function tex(
	gl: WebGL2RenderingContext,
	unit: number,
	src: TexImageSource,
	mip: boolean,
): WebGLTexture | null {
	const t = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + unit);
	gl.bindTexture(gl.TEXTURE_2D, t);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
	if (mip) gl.generateMipmap(gl.TEXTURE_2D);
	const f = mip ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST;
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mip ? gl.LINEAR : gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return t;
}

/** Zeichenblatt: alle Glyphen des Atlas nebeneinander (48 x 80 px je Zeichen), neu bei geladener Schrift. */
function buildSheet(g: Gl): void {
	const cv = document.createElement('canvas');
	cv.width = 48 * ATLAS.length;
	cv.height = 80;
	const x = cv.getContext('2d');
	if (!x) return;
	x.font = '500 76px "JetBrains Mono", monospace';
	x.textAlign = 'center';
	x.textBaseline = 'middle';
	x.fillStyle = '#fff';
	for (let i = 0; i < ATLAS.length; i++) x.fillText(ATLAS[i] ?? '', 48 * i + 24, 42);
	if (g.glyphs) g.gl.deleteTexture(g.glyphs);
	g.glyphs = tex(g.gl, 2, cv, true);
	g.fv = loop.fv;
}

async function load(): Promise<void> {
	const [m, lum, meta] = await Promise.all([
		fetch('/wohnung/wohnung.json').then((r) => r.json() as Promise<FlatMetrics>),
		loadImage('/wohnung/lum.webp'),
		loadImage('/wohnung/meta.png'),
	]);
	const cv = document.createElement('canvas');
	const gl = cv.getContext('webgl2', { antialias: false, depth: false, alpha: false });
	if (!gl) return;
	const p = gl.createProgram();
	for (const [kind, src] of [
		[gl.VERTEX_SHADER, VS],
		[gl.FRAGMENT_SHADER, FS],
	] as const) {
		const sh = gl.createShader(kind);
		if (!sh) return;
		gl.shaderSource(sh, src);
		gl.compileShader(sh);
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			console.error('wohnung', gl.getShaderInfoLog(sh));
			return;
		}
		gl.attachShader(p, sh);
	}
	gl.linkProgram(p);
	if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
	gl.useProgram(p);
	const u = (n: string) => gl.getUniformLocation(p, n);
	tex(gl, 0, lum, true);
	tex(gl, 1, meta, false);
	lum.close();
	meta.close();
	// Rampen als Tabelle: Zeile = Klasse, Spalte 0 = Länge, danach die Atlas-Stellen
	const R = new Uint8Array(16 * RAMPS.length * 4);
	RAMPS.forEach(([r, brightness], k) => {
		R[k * 64] = r.length;
		R[k * 64 + 60] = Math.round(brightness * 255);
		for (let i = 0; i < r.length; i++)
			R[k * 64 + (i + 1) * 4] = Math.max(0, ATLAS.indexOf(r[i] ?? ' '));
	});
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, RAMPS.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, R);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.uniform1i(u('uLum'), 0);
	gl.uniform1i(u('uMeta'), 1);
	gl.uniform1i(u('uGly'), 2);
	gl.uniform1i(u('uRamp'), 3);
	gl.uniform1f(u('uN'), ATLAS.length);
	gl.uniform1f(u('uS'), m.S);
	gl.uniform1f(u('uHmax'), m.hMax);
	gl.uniform4f(u('uImg'), m.w, m.h, m.OX, m.OY);
	const g: Gl = { cv, gl, u, m, glyphs: null, fv: -1 };
	// Zeichenblatt und erster Zeichenaufruf (dabei übersetzt der Treiber den Shader) in einer Leerlaufpause statt im
	// ersten sichtbaren Bild: dort kostete das beim Scrollen einen Ruckler
	const warm = () => {
		buildSheet(g);
		// in Fenstergröße: so liegt auch der Puffer schon an
		cv.width = Math.round(loop.vw * Math.min(2, devicePixelRatio || 1)) || 1;
		cv.height = Math.round(loop.vh * Math.min(2, devicePixelRatio || 1)) || 1;
		gl.viewport(0, 0, cv.width, cv.height);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		glState = g;
	};
	if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 1000 });
	else setTimeout(warm, 0);
}

/** Render und Shader im Hintergrund laden, bevor die Wohnung zu sehen ist (stage.ts ruft das vorab). */
export function preloadFlat(): void {
	if (started) return;
	started = true;
	load().catch(() => {});
}

/** Zeichnet die Wohnung als Zeichen und gibt das Canvas zurück, solange Render und Shader noch laden null. */
export function drawFlatGlyphs(e: GlyphInput): HTMLCanvasElement | null {
	preloadFlat();
	const g = glState;
	if (!g) return null;
	const { gl, u, m } = g;
	if (g.fv !== loop.fv) buildSheet(g);
	const w = Math.max(1, Math.round(e.W * e.dpr));
	const h = Math.max(1, Math.round(e.H * e.dpr));
	if (g.cv.width !== w || g.cv.height !== h) {
		g.cv.width = w;
		g.cv.height = h;
	}
	gl.viewport(0, 0, w, h);
	const k = e.ku / m.S;
	gl.uniform2f(u('uRes'), w, h);
	gl.uniform1f(u('uDpr'), e.dpr);
	gl.uniform3f(u('uMap'), k, e.x0 - m.OX * k, e.y0 - m.OY * k);
	const [zw, zh] = cellSize(e.W);
	gl.uniform2f(u('Z'), zw, zh);
	gl.uniform1f(u('uLod'), Math.max(0, Math.log2(zw / k)));
	gl.uniform1f(u('uBau'), e.build);
	const rm = new Float32Array(32);
	const lt = new Float32Array(8);
	e.rooms.slice(0, 8).forEach((r, i) => {
		rm.set(r, i * 4);
		lt[i] = e.light[i] ?? 0;
	});
	gl.uniform4fv(u('uRm'), rm);
	gl.uniform1fv(u('uLt'), lt);
	gl.uniform3f(u('uZg'), ...e.pointer);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	return g.cv;
}
