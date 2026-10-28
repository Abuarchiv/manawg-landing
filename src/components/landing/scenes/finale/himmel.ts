// Der Himmel hinter dem Finale: ein Kupferstich-Wolkenhimmel in Graustufen mit der Marke als Wolke. Himmel, Wolke und
// Masken sind die Ebenen des Wolken-Loaders (landing-konzept/wolke). Ohne Vorhang und ohne Scroll-Öffnung, er steht still.

import { dprFor } from '../../core/canvas';
import { type SceneState, loop, register } from '../../core/loop';
import { cl } from '../../core/math';

const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uSkyQ, uSkyH, uFein, uGrob, uGly;
uniform vec2 uVar; // Variante B: 1 = Zeichen, Zellbreite in Gerätepixeln
uniform float uHoch, uDprH;
uniform vec2 uRes, uCC;
uniform float uT, uOpen, uCS;
uniform vec4 uTxt; // Textfeld in uv (x0, y0, x1, y1), dort bleibt der Himmel ruhig und dunkler
out vec4 o;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for(int i = 0; i < 5; i++){ s += a*noise(p); p *= 2.03; a *= .5; } return s; }
// Stich (Himmel und Marke) an einem Gerätepixel fc
float stich(vec2 fc){
  vec2 uv = fc / uRes;
  float asp = uRes.x / uRes.y;
  // Himmel: gestochener Wolkenhimmel (Codex, Technik wie Referenz „gestochene Wolken“), deckend skaliert und unten
  // verankert, damit die Wolkenbänke am unteren Rand stehen. Die Striche erscheinen beim Öffnen nach Helligkeit:
  // erst die hellsten Linien, dann die feinen, als würde der Stich gerade gezogen.
  float texA = uHoch > .5 ? .5625 : 1.7778;
  vec2 sc = vec2(min(asp / texA, 1.), min(texA / asp, 1.));
  vec2 suv = vec2((uv.x - .5) * sc.x + .5, uv.y * sc.y);
  suv += (vec2(fbm(suv * 3. + uT * .03), fbm(suv * 3. + 4.1 - uT * .03)) - .5) * .006;
  float L = uHoch > .5 ? texture(uSkyH, suv).r : texture(uSkyQ, suv).r;
  float zug = smoothstep(.05, .85, uOpen);
  float th = 1.05 - zug * 1.1;
  float sky = L * smoothstep(th, th + .18, L + hash(floor(fc / 2.)) * .05);
  // Marke: exakte Silhouette aus den Masken des Loaders, gefüllt mit dem dichtesten Teil des gestochenen Wolkenhimmels
  float c = smoothstep(.35, .95, uOpen);
  vec2 cuv = (uv - uCC) * vec2(asp, 1.) / uCS + .5;
  float rot = sin(uT * .35) * .02;
  cuv = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * (cuv - .5) * (1. + .015 * sin(uT * .7)) + .5;
  float inside = step(0., cuv.x) * step(cuv.x, 1.) * step(0., cuv.y) * step(cuv.y, 1.);
  vec2 w = vec2(fbm(cuv * 3. + uT * .22), fbm(cuv * 3. + 7.3 - uT * .2)) - .5;
  vec2 duv = cuv + w * (.07 * (1. - c) + .02);
  float sil = mix(texture(uGrob, duv).r, texture(uFein, duv).r, c);
  float n = fbm(duv * 7. + vec2(uT * .25, -uT * .16));
  float thm = mix(.95, .3, c);
  float m = smoothstep(thm - .08, thm + .08, sil + (n - .5) * .45 * (1. - .6 * c));
  float fill = texture(uSkyQ, vec2(.03, .03) + duv * vec2(.34, .42)).r;
  float thf = 1.05 - c * 1.1;
  fill *= smoothstep(thf, thf + .18, fill + hash(floor(fc / 2.) + 7.) * .05);
  float a = m * inside;
  // Licht von oben: die Marke ist oben heller, unten dichter wie ein Wolkenballen
  float hell = .7 + .45 * clamp(cuv.y, 0., 1.);
  return mix(.035 + sky * .95, .03 + min(fill * 1.35 * hell, 1.), a);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 col = vec3(stich(gl_FragCoord.xy));
  if (uVar.x > .5) {
    // B: der Stich als Zeichen. Zellmittel aus vier Proben, die Rampe ' .:-=+*#%@' wählt die Glyphe.
    vec2 gz = vec2(uVar.y, uVar.y * 1.45);
    vec2 c0 = (floor(gl_FragCoord.xy / gz) + .5) * gz;
    float Lc = (stich(c0 + gz * vec2(-.25, -.25)) + stich(c0 + gz * vec2(.25, -.25)) + stich(c0 + gz * vec2(-.25, .25)) + stich(c0 + gz * vec2(.25, .25))) * .25;
    float id = min(floor(smoothstep(.05, 1.05, Lc) * 10.5), 9.);
    vec2 lu = fract(gl_FragCoord.xy / gz);
    float gv = id < .5 ? 0. : smoothstep(.15, .55, texture(uGly, vec2((id + lu.x) / 10., lu.y)).r);
    col = vec3(.035 + gv * .92);
  }
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

interface HimmelState extends SceneState {
	cv2: HTMLCanvasElement;
	g: Gl | null;
	bereit: boolean;
	offen: number;
}

function programm(gl: WebGL2RenderingContext): WebGLProgram | null {
	const p = gl.createProgram();
	for (const [typ, src] of [
		[gl.VERTEX_SHADER, VS],
		[gl.FRAGMENT_SHADER, FS],
	] as const) {
		const sh = gl.createShader(typ);
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
async function bild(src: string): Promise<ImageBitmap> {
	const blob = await (await fetch(src)).blob();
	return createImageBitmap(blob, { imageOrientation: 'flipY', premultiplyAlpha: 'none' });
}

/** Nächste Aufgabe abwarten: Shader, Texturen und Kontext landen in verschiedenen Bildern, nicht in einem. */
const pause = () => new Promise<void>((ok) => setTimeout(ok, 0));

async function laden(s: HimmelState): Promise<void> {
	const namen = ['uSkyQ', 'uSkyH', 'uFein', 'uGrob'];
	// Dekodieren läuft parallel und ohne den Hauptthread, während Kontext und Shader entstehen
	const bilder = Promise.all(
		['stich-quer', 'stich-hoch', 'maske-fein', 'maske-grob'].map((n) => bild(`/himmel/${n}.webp`)),
	);
	const gl = s.cv2.getContext('webgl2', {
		premultipliedAlpha: true,
		alpha: true,
		antialias: false,
	});
	if (!gl) return;
	await pause();
	const p = programm(gl);
	if (!p) return;
	gl.useProgram(p);
	const u = (n: string) => gl.getUniformLocation(p, n);
	const fertig = await bilder;
	for (const [i, img] of fertig.entries()) {
		await pause();
		gl.activeTexture(gl.TEXTURE0 + i);
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.uniform1i(u(namen[i] ?? ''), i);
		img.close();
	}
	if (loop.v === 'b') {
		// Variante B: Zeichenblatt der Rampe auf Einheit 4 (Canvas unten nach oben, passend zu gl_FragCoord)
		const cvz = document.createElement('canvas');
		cvz.width = 480;
		cvz.height = 70;
		const z = cvz.getContext('2d');
		if (z) {
			z.font = '500 60px "JetBrains Mono", monospace';
			z.textAlign = 'center';
			z.textBaseline = 'middle';
			z.fillStyle = '#fff';
			for (let i = 0; i < 10; i++) z.fillText(' .:-=+*#%@'[i] ?? '', 48 * i + 24, 37);
		}
		gl.activeTexture(gl.TEXTURE4);
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvz);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.uniform1i(u('uGly'), 4);
	}
	// Ein Zeichenaufruf in 1 x 1 Pixel zwingt den Treiber, das Programm schon jetzt fertig zu übersetzen
	await pause();
	gl.viewport(0, 0, 1, 1);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	s.g = { gl, u };
	s.bereit = true;
}

/** Enges Rechteck um Titel und Knöpfe (CSS-px relativ zur Fläche). */
function textFeld(sec: HTMLElement, r0: DOMRect): [number, number, number, number] | null {
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
export function registerHimmel(
	ebene: HTMLElement,
	cv: HTMLCanvasElement,
	sec: HTMLElement,
): () => void {
	return register<HimmelState>({
		name: 'himmel',
		el: ebene,
		host: sec,
		box: (W, H) => ({ bw: W, bh: H }),
		init(s) {
			s.cv2 = cv;
			s.g = null;
			s.bereit = false;
			s.offen = 0;
			laden(s).catch(() => {});
		},
		frame(s) {
			const g = s.g;
			if (!s.bereit || !g) return;
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
			s.offen = 1;
			const hoch = s.mode === 'hoch';
			gl.uniform1f(u('uHoch'), hoch ? 1 : 0);
			gl.uniform1f(u('uDprH'), dpr);
			gl.uniform2f(u('uRes'), w, h);
			gl.uniform1f(u('uT'), s.reduced ? 4 : loop.t);
			gl.uniform1f(u('uOpen'), s.offen);
			gl.uniform2f(u('uVar'), loop.v === 'b' ? 1 : 0, 7 * dpr);
			const unten = cl((r0.bottom - loop.vh) / s.H, 0, 1); // Teil der Fläche unter dem Fensterrand
			if (hoch) {
				// Hoch: fest im Abschnitt über dem Titel, scrollt mit dem Text weg (im Endbild ist oben kein Platz)
				gl.uniform2f(u('uCC'), 0.5, 0.74);
				gl.uniform1f(u('uCS'), Math.min(0.42, 0.62 * (s.W / s.H)));
			} else {
				gl.uniform2f(u('uCC'), 0.72, unten + (1 - unten) * 0.55);
				gl.uniform1f(u('uCS'), 0.62);
			}
			const tf = textFeld(sec, r0);
			if (tf) gl.uniform4f(u('uTxt'), tf[0] / s.W, 1 - tf[3] / s.H, tf[2] / s.W, 1 - tf[1] / s.H);
			else gl.uniform4f(u('uTxt'), 0, 0, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
		destroy(s) {
			s.g?.gl.getExtension('WEBGL_lose_context')?.loseContext();
		},
	});
}
