// Das Gebirge der Fußzeile: derselbe Berg wie im Hero, als Kupferstich in der Technik des Finale-Himmels (Codex,
// Referenz NORD). Es liegt am unteren Rand, Spalten und Links stehen darüber. Beim Hereinscrollen zeichnet sich
// der Stich nach Helligkeit (erst die hellen Striche, dann die feinen), Ansatz und Schwelle wie in finale/himmel.ts.
// Naht zum Finale: die Wolken am unteren Rand des Himmels laufen oben in der Fußzeile gespiegelt weiter und dunkeln
// binnen weniger Zeilen ab, mit derselben Abbildung (Textur, Maßstab, Strichstärke) wie der Himmel.

import { dprFor } from '../../core/canvas';
import { type SceneState, register } from '../../core/loop';
import { cl, lag, ss } from '../../core/math';

const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uBerg, uSkyQ, uSkyH;
uniform vec2 uRes;      // Backing-px
uniform float uDpr, uOpen, uHoch;
uniform vec3 uImg;      // Oberkante des Bergbilds (CSS-px ab Oberkante der Fußzeile), Breite, Höhe
uniform vec2 uFin;      // Höhe des Finales (CSS-px), Unterkante der Textspalten (CSS-px)
out vec4 o;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 px = gl_FragCoord.xy / uDpr;
  float yo = uRes.y / uDpr - px.y; // Abstand von der Oberkante der Fußzeile
  float rnd = hash(floor(gl_FragCoord.xy / (2. * uDpr / 1.5)));
  float zug = smoothstep(.05, .85, uOpen);
  float th = 1.05 - zug * 1.1;
  // Berg: Stich nach Helligkeit gezogen, unter den Textspalten gedämpft
  float mv = (yo - uImg.x) / uImg.z;
  float L = 0.;
  if (mv >= 0. && mv <= 1.) L = texture(uBerg, vec2(px.x / uImg.y, 1. - mv)).r;
  L = max(L - .045, 0.) / .955;
  float berg = L * smoothstep(th, th + .18, L + rnd * .05);
  berg *= 1. - .9 * (1. - smoothstep(-6., 84., yo - uFin.y));
  // Naht: Wolken des Finales gespiegelt, gleiche Abbildung wie finale/himmel.ts (Maße der Finale-Fläche)
  float asp = uRes.x / uDpr / uFin.x;
  float texA = uHoch > .5 ? .5625 : 1.7778;
  vec2 sc = vec2(min(asp / texA, 1.), min(texA / asp, 1.));
  vec2 suv = vec2((px.x / (uRes.x / uDpr) - .5) * sc.x + .5, yo / uFin.x * sc.y);
  float C = uHoch > .5 ? texture(uSkyH, suv).r : texture(uSkyQ, suv).r;
  float fade = 1. - smoothstep(0., uHoch > .5 ? 56. : 80., yo);
  C = max(C - .045, 0.) / .955 * fade * fade * (1. - .85 * smoothstep(8., 40., yo));
  float s = max(berg, C);
  // Grund: am Rand zum Finale wie dort (.07), nach unten auf #0A0A0A
  float grund = mix(.072, .039, smoothstep(0., 90., yo));
  o = vec4(vec3(grund + s * .94) + (hash(gl_FragCoord.xy) - .5) * .012, 1.);
}
`;

interface BergState extends SceneState {
	cv2: HTMLCanvasElement;
	gl: WebGL2RenderingContext | null;
	u: ((n: string) => WebGLUniformLocation | null) | null;
	geladen: Set<string>;
	bereit: Set<string>;
	offen: number;
	texte: HTMLElement[];
	raster: HTMLElement | null;
	finale: HTMLElement | null;
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
			console.error('berg', gl.getShaderInfoLog(sh));
			return null;
		}
		gl.attachShader(p, sh);
	}
	gl.linkProgram(p);
	return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

function bild(src: string): Promise<HTMLImageElement> {
	return new Promise((ok, fehler) => {
		const i = new Image();
		i.onload = () =>
			i.decode().then(
				() => ok(i),
				() => ok(i),
			);
		i.onerror = fehler;
		i.src = src;
	});
}

/** Seitenverhältnis (Höhe / Breite) der beiden Bergbilder, Hochformat ist auf 1011 x 960 beschnitten. */
const BILD_QUER = 700 / 2400;
const BILD_HOCH = 960 / 1011;

/** Textur aus einem Bild auf eine Einheit legen. */
function textur(gl: WebGL2RenderingContext, einheit: number, img: HTMLImageElement): void {
	gl.activeTexture(gl.TEXTURE0 + einheit);
	gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

/** Programm einmal anlegen und die Bilder des gerade nötigen Formats nachladen (das andere erst bei Bedarf). */
async function laden(s: BergState, hoch: boolean): Promise<void> {
	const art = hoch ? 'hoch' : 'quer';
	if (s.geladen.has(art)) return;
	s.geladen.add(art);
	if (!s.gl) {
		const gl = s.cv2.getContext('webgl2', { alpha: false, antialias: false });
		const p = gl ? programm(gl) : null;
		if (!gl || !p) return;
		gl.useProgram(p);
		s.gl = gl;
		s.u = (n: string) => gl.getUniformLocation(p, n);
		gl.uniform1i(s.u('uSkyQ'), 2);
		gl.uniform1i(s.u('uSkyH'), 3);
	}
	const { gl, u } = s;
	if (!u) return;
	const [berg, himmel] = await Promise.all([
		bild(`/fuss/berg-${art}.webp`),
		bild(`/himmel/stich-${art}.webp`),
	]);
	textur(gl, hoch ? 1 : 0, berg);
	textur(gl, hoch ? 3 : 2, himmel);
	// Vorwärmen: der Treiber übersetzt den Shader erst beim ersten Zeichnen, sonst ruckelt das erste sichtbare Bild
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	s.bereit.add(art);
}

/** Meldet das Gebirge an. flaeche: Element über der ganzen Fußzeile, darin das WebGL-Canvas. */
export function registerBerg(
	flaeche: HTMLElement,
	cv: HTMLCanvasElement,
	fuss: HTMLElement,
): () => void {
	return register<BergState>({
		name: 'berg',
		el: flaeche,
		host: fuss,
		box: (W, H) => ({ bw: W, bh: H }),
		init(s) {
			s.cv2 = cv;
			s.gl = null;
			s.u = null;
			s.geladen = new Set();
			s.bereit = new Set();
			s.offen = 0;
			s.texte = [...fuss.querySelectorAll<HTMLElement>('[data-fuss-text]')];
			s.raster = fuss.querySelector<HTMLElement>('[data-fuss-raster]');
			s.finale = document.getElementById('finale');
		},
		frame(s, _t, dt) {
			const hoch = s.mode === 'hoch';
			// Bilder erst laden, wenn die Fußzeile nahe genug ist (frame läuft nur dafür)
			laden(s, hoch).catch(() => {});
			const { gl, u } = s;
			if (!s.bereit.has(hoch ? 'hoch' : 'quer') || !gl || !u) return;
			const dpr = dprFor(1.5, 1, s.W, s.H);
			const w = Math.max(1, Math.round(s.W * dpr));
			const h = Math.max(1, Math.round(s.H * dpr));
			if (cv.width !== w || cv.height !== h) {
				cv.width = w;
				cv.height = h;
				gl.viewport(0, 0, w, h);
			}
			// Zeichnen beim Hereinscrollen: zu, solange die Fußzeile nicht im Bild ist, fertig bei 85 % Sichtbarkeit
			const r0 = s.el.getBoundingClientRect();
			const sicht = cl((innerHeight - r0.top) / (s.H * 0.85), 0, 1);
			const ziel = s.reduced ? 1 : ss(sicht);
			s.offen = s.reduced ? ziel : s.offen + (ziel - s.offen) * lag(0.12, dt);
			// Textunterkante (größte Unterkante der Link-Spalten) relativ zur Fußzeile
			let textUnten = 0;
			for (const t of s.texte)
				textUnten = Math.max(textUnten, t.getBoundingClientRect().bottom - r0.top);
			// Lage des Bildes: quer unten verankert, hoch mit den Gipfeln knapp unter dem Raster
			const bw = s.W;
			const bh = bw * (hoch ? BILD_HOCH : BILD_QUER);
			const rasterUnten = s.raster ? s.raster.getBoundingClientRect().bottom - r0.top : s.H;
			const oben = hoch ? Math.min(rasterUnten, textUnten) - 24 : s.H - bh;
			gl.uniform2f(u('uRes'), w, h);
			gl.uniform1f(u('uDpr'), dpr);
			gl.uniform1f(u('uOpen'), s.offen);
			gl.uniform1f(u('uHoch'), hoch ? 1 : 0);
			gl.uniform1i(u('uBerg'), hoch ? 1 : 0);
			gl.uniform3f(u('uImg'), oben, bw, bh);
			gl.uniform2f(u('uFin'), s.finale?.offsetHeight ?? s.H, textUnten);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
		destroy(s) {
			s.gl?.getExtension('WEBGL_lose_context')?.loseContext();
		},
	});
}
