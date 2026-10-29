// Der Himmel hinter dem Finale: ein Kupferstich-Wolkenhimmel in Graustufen mit der Marke als Wolke. Himmel, Wolke und
// Masken sind die Ebenen des Wolken-Loaders (landing-konzept/wolke). Ohne Vorhang und ohne Scroll-Öffnung; die Wolken quellen langsam, der Zeiger ist Wind.

import { dprFor } from '../../core/canvas';
import { type SceneState, loop, register } from '../../core/loop';
import { cl } from '../../core/math';

const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uSkyQ, uSkyH, uFein, uGrob;
uniform float uHoch, uDprH;
uniform vec2 uRes, uCC;
uniform float uT, uOpen, uCS;
uniform vec3 uZg; // Zeiger in uv und Stärke: Wind, der die Wolken teilt
uniform vec4 uTxt; // Textfeld in uv (x0, y0, x1, y1), dort bleibt der Himmel ruhig und dunkler
out vec4 o;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for(int i = 0; i < 5; i++){ s += a*noise(p); p *= 2.03; a *= .5; } return s; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  // Himmel: gestochener Wolkenhimmel (Codex, Technik wie Referenz „gestochene Wolken“), deckend skaliert und unten
  // verankert, damit die Wolkenbänke am unteren Rand stehen. Die Striche erscheinen beim Öffnen nach Helligkeit:
  // erst die hellsten Linien, dann die feinen, als würde der Stich gerade gezogen.
  float texA = uHoch > .5 ? .5625 : 1.7778;
  vec2 sc = vec2(min(asp / texA, 1.), min(texA / asp, 1.));
  vec2 suv = vec2((uv.x - .5) * sc.x + .5, uv.y * sc.y);
  // Wolken quellen: zweistufig verzerrtes Feld, oben schneller als in den Bänken unten. Der Zeiger ist Wind: er schiebt
  // die Striche um sich herum auseinander, wie ein Loch, das in die Wolkendecke gedrückt wird.
  vec2 q = vec2(fbm(suv * 2.2 + vec2(uT * .035, 0.)), fbm(suv * 2.2 + vec2(5.2, -uT * .03)));
  vec2 qw = vec2(fbm(suv * 4. + q * 1.7 + uT * .05), fbm(suv * 4. + q * 1.7 + 3.3 - uT * .04)) - .5;
  suv += qw * (.009 + .012 * uv.y);
  vec2 zd = (uv - uZg.xy) * vec2(asp, 1.); float zr = dot(zd, zd);
  vec2 wind = zd / (sqrt(zr) + .02) * exp(-zr * 14.) * .032 * uZg.z;
  suv -= wind * vec2(sc.x / asp, sc.y);
  float L = uHoch > .5 ? texture(uSkyH, suv).r : texture(uSkyQ, suv).r;
  float zug = smoothstep(.05, .85, uOpen);
  float th = 1.05 - zug * 1.1;
  float sky = L * smoothstep(th, th + .18, L + hash(floor(gl_FragCoord.xy / 2.)) * .05);
  // Marke: exakte Silhouette aus den Masken des Loaders, gefüllt mit dem dichtesten Teil des gestochenen Wolkenhimmels
  float c = smoothstep(.35, .95, uOpen);
  vec2 cuv = (uv - uCC) * vec2(asp, 1.) / uCS + .5;
  float rot = sin(uT * .35) * .02;
  cuv = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * (cuv - .5) * (1. + .015 * sin(uT * .7)) + .5;
  float inside = step(0., cuv.x) * step(cuv.x, 1.) * step(0., cuv.y) * step(cuv.y, 1.);
  vec2 w = vec2(fbm(cuv * 3. + uT * .22), fbm(cuv * 3. + 7.3 - uT * .2)) - .5;
  vec2 duv = cuv + w * (.07 * (1. - c) + .02) - wind * .7 / uCS;
  float sil = mix(texture(uGrob, duv).r, texture(uFein, duv).r, c);
  float n = fbm(duv * 7. + vec2(uT * .25, -uT * .16));
  float thm = mix(.95, .3, c);
  float m = smoothstep(thm - .08, thm + .08, sil + (n - .5) * .45 * (1. - .6 * c));
  float fill = texture(uSkyQ, vec2(.03, .03) + duv * vec2(.34, .42)).r;
  float thf = 1.05 - c * 1.1;
  fill *= smoothstep(thf, thf + .18, fill + hash(floor(gl_FragCoord.xy / 2.) + 7.) * .05);
  float a = m * inside;
  // Licht von oben: die Marke ist oben heller, unten dichter wie ein Wolkenballen
  float hell = .7 + .45 * clamp(cuv.y, 0., 1.);
  vec3 col = vec3(mix(.035 + sky * .95, .03 + min(fill * 1.35 * hell, 1.), a));
  // Unter dem Text: Striche gedämpft, damit Weiß lesbar bleibt
  vec2 tb = smoothstep(vec2(-.15), vec2(.02), min(uv - uTxt.xy, uTxt.zw - uv));
  float tm = tb.x * tb.y;
  col = mix(col, vec3(.035), tm * .7);
  // Unterkante: Wolken laufen in den Grund der Fußzeile aus (keine Kante an der Naht)
  col *= mix(.0, 1., smoothstep(0., 110. / uRes.y * uDprH, uv.y));
  col += (hash(gl_FragCoord.xy + fract(uT) * 91.) - .5) * .03;
  o = vec4(col, 1.);
}
`;

interface Gl {
	gl: WebGL2RenderingContext;
	u: (n: string) => WebGLUniformLocation | null;
}

interface SkyState extends SceneState {
	cv2: HTMLCanvasElement;
	g: Gl | null;
	ready: boolean;
	open: number;
	/** geglätteter Zeiger in uv und Stärke */
	zg: [number, number, number];
}

function program(gl: WebGL2RenderingContext): WebGLProgram | null {
	const p = gl.createProgram();
	for (const [kind, src] of [
		[gl.VERTEX_SHADER, VS],
		[gl.FRAGMENT_SHADER, FS],
	] as const) {
		const sh = gl.createShader(kind);
		if (!sh || !p) return null;
		gl.shaderSource(sh, src);
		gl.compileShader(sh);
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			console.error('himmel', gl.getShaderInfoLog(sh));
			return null;
		}
		gl.attachShader(p, sh);
	}
	gl.linkProgram(p);
	return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

/** Bild laden, kippen und abseits des Hauptthreads dekodieren: der Texturupload kopiert danach nur noch. */
async function loadImage(src: string): Promise<ImageBitmap> {
	const blob = await (await fetch(src)).blob();
	return createImageBitmap(blob, { imageOrientation: 'flipY', premultiplyAlpha: 'none' });
}

/** Nächste Aufgabe abwarten: Shader, Texturen und Kontext landen in verschiedenen Bildern, nicht in einem. */
const pause = () => new Promise<void>((ok) => setTimeout(ok, 0));

async function load(s: SkyState): Promise<void> {
	const names = ['uSkyQ', 'uSkyH', 'uFein', 'uGrob'];
	// Dekodieren läuft parallel und ohne den Hauptthread, während Kontext und Shader entstehen
	const images = Promise.all(
		['stich-quer', 'stich-hoch', 'maske-fein', 'maske-grob'].map((n) =>
			loadImage(`/himmel/${n}.webp`),
		),
	);
	const gl = s.cv2.getContext('webgl2', {
		premultipliedAlpha: true,
		alpha: true,
		antialias: false,
	});
	if (!gl) return;
	await pause();
	const p = program(gl);
	if (!p) return;
	gl.useProgram(p);
	const u = (n: string) => gl.getUniformLocation(p, n);
	const done = await images;
	for (const [i, img] of done.entries()) {
		await pause();
		gl.activeTexture(gl.TEXTURE0 + i);
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.uniform1i(u(names[i] ?? ''), i);
		img.close();
	}
	// Ein Zeichenaufruf in 1 x 1 Pixel zwingt den Treiber, das Programm schon jetzt fertig zu übersetzen
	await pause();
	gl.viewport(0, 0, 1, 1);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	s.g = { gl, u };
	s.ready = true;
}

/** Enges Rechteck um Titel und Knöpfe (CSS-px relativ zur Fläche). */
function textBox(sec: HTMLElement, r0: DOMRect): [number, number, number, number] | null {
	const h = sec.querySelector('h2');
	const k = sec.querySelector('[data-knoepfe]');
	if (!h) return null;
	const rg = document.createRange();
	rg.selectNodeContents(h);
	const a = rg.getBoundingClientRect();
	const b = k?.getBoundingClientRect() ?? a;
	return [
		Math.min(a.left, b.left) - r0.left - 24,
		Math.min(a.top, b.top) - r0.top - 16,
		Math.max(a.right, b.right) - r0.left + 24,
		Math.max(a.bottom, b.bottom) - r0.top + 16,
	];
}

/** Meldet den Himmel an. ebene: Element über der ASCII-Sonne, darin das WebGL-Canvas. */
export function registerSky(
	layer: HTMLElement,
	cv: HTMLCanvasElement,
	sec: HTMLElement,
): () => void {
	return register<SkyState>({
		name: 'himmel',
		el: layer,
		host: sec,
		box: (W, H) => ({ bw: W, bh: H }),
		init(s) {
			s.cv2 = cv;
			s.g = null;
			s.ready = false;
			s.open = 0;
			s.zg = [0.5, 0.5, 0];
			load(s).catch(() => {});
		},
		frame(s) {
			const g = s.g;
			if (!s.ready || !g) return;
			const { gl, u } = g;
			const dpr = dprFor(1.5, 1, s.W, s.H);
			const w = Math.max(1, Math.round(s.W * dpr));
			const h = Math.max(1, Math.round(s.H * dpr));
			if (cv.width !== w || cv.height !== h) {
				cv.width = w;
				cv.height = h;
				gl.viewport(0, 0, w, h);
			}
			// Kein Vorhang mehr: der Himmel steht von Anfang an offen
			const r0 = s.el.getBoundingClientRect();
			s.open = 1;
			const portrait = s.mode === 'hoch';
			gl.uniform1f(u('uHoch'), portrait ? 1 : 0);
			gl.uniform1f(u('uDprH'), dpr);
			gl.uniform2f(u('uRes'), w, h);
			gl.uniform1f(u('uT'), s.reduced ? 4 : loop.t);
			gl.uniform1f(u('uOpen'), s.open);
			const bottom = cl((r0.bottom - loop.vh) / s.H, 0, 1); // Teil der Fläche unter dem Fensterrand
			if (portrait) {
				// Hoch: fest im Abschnitt über dem Titel, scrollt mit dem Text weg (im Endbild ist oben kein Platz)
				gl.uniform2f(u('uCC'), 0.5, 0.74);
				gl.uniform1f(u('uCS'), Math.min(0.42, 0.62 * (s.W / s.H)));
			} else {
				gl.uniform2f(u('uCC'), 0.72, bottom + (1 - bottom) * 0.55);
				gl.uniform1f(u('uCS'), 0.62);
			}
			// Zeiger als Wind; ohne Zeiger (Handy) zieht eine langsame Böe über den Himmel
			const t = loop.t;
			const da = s.m.in && !s.reduced;
			const zx = da ? s.m.px / s.W : 0.5 + 0.38 * Math.sin(t * 0.13);
			const zy = da ? 1 - s.m.py / s.H : 0.32 + 0.14 * Math.sin(t * 0.21 + 1.3);
			const k = 1 - Math.exp(-loop.dt * 4);
			s.zg[0] += (zx - s.zg[0]) * k;
			s.zg[1] += (zy - s.zg[1]) * k;
			s.zg[2] += ((s.reduced ? 0 : da ? 1 : 0.55) - s.zg[2]) * k;
			gl.uniform3f(u('uZg'), s.zg[0], s.zg[1], s.zg[2]);
			const tf = textBox(sec, r0);
			if (tf) gl.uniform4f(u('uTxt'), tf[0] / s.W, 1 - tf[3] / s.H, tf[2] / s.W, 1 - tf[1] / s.H);
			else gl.uniform4f(u('uTxt'), 0, 0, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
		destroy(s) {
			s.g?.gl.getExtension('WEBGL_lose_context')?.loseContext();
		},
	});
}
