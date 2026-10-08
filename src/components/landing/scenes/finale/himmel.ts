// Der Himmel hinter dem Finale: Beim Hereinscrollen reißt das Schwarz (die ASCII-Sonne darunter) von oben nach unten
// auf wie Stoff, dahinter liegt ein Himmel als Kupferstich in Graustufen, und die Marke verdichtet sich aus Dunst zur Wolke. Himmel, Wolke und
// Masken sind die Ebenen des Wolken-Loaders (landing-konzept/wolke), der Shader ist dessen Fassung, auf Scroll statt
// Zeit umgestellt. Der Zeiger zupft am Stoff: unter ihm öffnet sich schon vorher ein kleiner Riss.
// Die Fläche ist durchsichtig, wo der Stoff noch zu ist; so bleibt die ASCII-Sonne darunter sichtbar.

import { dprFor } from '../../core/canvas';
import { type SceneState, loop, register } from '../../core/loop';
import { cl, lag, ss } from '../../core/math';

const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uSkyQ, uSkyH, uFein, uGrob;
uniform float uHoch;
uniform vec2 uRes, uCC, uRiss; // uRiss: Ober- und Unterkante des Fensters in uv
uniform float uT, uOpen, uCS;
uniform vec3 uM;   // Zeiger in uv (y nach oben), z = Stärke
uniform vec4 uTxt; // Textfeld in uv (x0, y0, x1, y1), dort bleibt der Himmel ruhig und dunkler
out vec4 o;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for(int i = 0; i < 5; i++){ s += a*noise(p); p *= 2.03; a *= .5; } return s; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  // Riss von oben nach unten: oben im Fenster reißt der Stoff zuerst, die Kante läuft zackig (grob + fein), die beiden
  // Hälften weichen auseinander, bis der Himmel das ganze Feld füllt. Maße in Höhen-Einheiten (x mal Seitenverhältnis).
  float fy = clamp((uRiss.x - uv.y) / max(uRiss.x - uRiss.y, .01), 0., 1.);
  float auf = clamp(uOpen * 1.9 - fy * .9, 0., 1.);
  float x0 = .5 + (fbm(vec2(uv.y * 2.6, 1.7)) - .5) * .16 + (noise(vec2(uv.y * 38., 4.)) - .5) * .012;
  float dx = (uv.x - x0) * asp;
  float seite = dx < 0. ? 0. : 1.;
  float hw = (.5 * asp + .25) * pow(auf, 1.6);
  float rag = (fbm(vec2(uv.y * 9., seite * 5.)) - .5) * .07 * min(1., auf * 4.) + (noise(vec2(uv.y * 140., seite * 9.)) - .5) * .01;
  float d = hw - abs(dx) + rag;
  // Fasern: einzelne Fäden ragen vom Saum in den Spalt
  float zeile = floor(gl_FragCoord.y / 2.);
  float lt = step(.965, hash(vec2(zeile, seite + 3.))) * hash(vec2(zeile, seite + 8.)) * .07 * min(1., auf * 3.);
  if (lt > 0. && abs(dx) > hw + rag - lt && d > 0.) d = -.004;
  // Zupfen: der Zeiger reißt einen kleinen Riss, der mit dem Stoff mitwächst
  vec2 mq = (uv - uM.xy) * vec2(asp, 1.);
  float mr = length(mq);
  float mang = atan(mq.y, mq.x);
  d = max(d, uM.z * (.05 + (fbm(vec2(mang * 3., uT * .2)) - .5) * .04) - mr + (fbm(vec2(mang * 30., mr * 9.)) - .5) * .012);
  vec2 q = vec2(dx, 0.);
  if (d < -.03) { o = vec4(0.); return; }
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
  float sky = L * smoothstep(th, th + .18, L + hash(floor(gl_FragCoord.xy / 2.)) * .05);
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
  fill *= smoothstep(thf, thf + .18, fill + hash(floor(gl_FragCoord.xy / 2.) + 7.) * .05);
  float a = m * inside;
  // Licht von oben: die Marke ist oben heller, unten dichter wie ein Wolkenballen
  float hell = .7 + .45 * clamp(cuv.y, 0., 1.);
  vec3 col = vec3(mix(.035 + sky * .95, .03 + min(fill * 1.35 * hell, 1.), a));
  // Unter dem Text: Striche gedämpft, damit Weiß lesbar bleibt
  vec2 tb = smoothstep(vec2(-.15), vec2(.02), min(uv - uTxt.xy, uTxt.zw - uv));
  float tm = tb.x * tb.y;
  col = mix(col, vec3(.035), tm * .7);
  // Schatten des Stoffs auf dem Himmel, dann der Umschlag: schmales Band, Rückseite des Stoffs, Licht von oben links
  col *= 1. - .55 * exp(-max(d, 0.) * 55.);
  float band = 1. - smoothstep(.0, .012, d);
  float licht = seite < .5 ? .9 : .35;
  vec3 saum = vec3(.05) + vec3(.2) * licht * (.7 + .6 * noise(vec2(uv.y * 300., seite)));
  col = mix(col, saum, band);
  float alpha = smoothstep(-.03, -.018, d);
  col += (hash(gl_FragCoord.xy + fract(uT) * 91.) - .5) * .03;
  o = vec4(col * alpha, alpha);
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
	zupf: number;
	mx: number;
	my: number;
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
			s.zupf = 0;
			s.mx = 0.5;
			s.my = 0.5;
			laden(s).catch(() => {});
		},
		frame(s, _t, dt) {
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
			// Öffnen am Scroll: zu, solange die Oberkante unter 85 % der Fensterhöhe liegt, ganz offen, wenn sie oben ankommt
			const r0 = s.el.getBoundingClientRect();
			const ziel = s.reduced ? 1 : ss((0.9 - r0.top / innerHeight) / 0.9);
			s.offen = s.reduced ? ziel : s.offen + (ziel - s.offen) * lag(0.12, dt);
			if (s.m.in && s.m.type === 'mouse') {
				s.mx = s.m.px / s.W;
				s.my = 1 - s.m.py / s.H;
			}
			const zupfZiel = s.m.in && s.m.type === 'mouse' && !s.reduced ? 1 : 0;
			s.zupf += (zupfZiel - s.zupf) * lag(0.08, dt);
			const hoch = s.mode === 'hoch';
			gl.uniform1f(u('uHoch'), hoch ? 1 : 0);
			// Riss-Mitte auf Höhe des Fensters, Wolke im freien Feld neben (quer) bzw. über (hoch) dem Titel
			const sichtOben = cl(1 + r0.top / s.H, 0, 1);
			const sichtUnten = cl(1 - (innerHeight - r0.top) / s.H, 0, 1);
			gl.uniform2f(u('uRes'), w, h);
			gl.uniform2f(u('uRiss'), sichtOben, sichtUnten);
			gl.uniform1f(u('uT'), s.reduced ? 4 : loop.t);
			gl.uniform1f(u('uOpen'), s.offen);
			const unten = cl((r0.bottom - innerHeight) / s.H, 0, 1); // Teil der Fläche unter dem Fensterrand
			if (hoch) {
				// Hoch: fest im Abschnitt über dem Titel, scrollt mit dem Text weg (im Endbild ist oben kein Platz)
				gl.uniform2f(u('uCC'), 0.5, 0.74);
				gl.uniform1f(u('uCS'), Math.min(0.42, 0.62 * (s.W / s.H)));
			} else {
				gl.uniform2f(u('uCC'), 0.72, unten + (1 - unten) * 0.55);
				gl.uniform1f(u('uCS'), 0.62);
			}
			gl.uniform3f(u('uM'), s.mx, s.my, s.zupf);
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
