// The sky behind the finale: an engraved-style cloudscape in gray tones with the brand as a cloud. Sky, cloud and
// masks are the layers of the cloud loader (landing-konzept/wolke). No curtain and no scroll opening; the clouds billow slowly, the pointer is wind.

import { isLight } from '@/lib/theme';
import { buildProgram, dprFor, sizeBacking } from '../../core/canvas';
import { loop, register, type SceneState } from '../../core/loop';
import { cl } from '../../core/math';

const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uSkyQ, uSkyH, uFine, uCoarse;
uniform float uPortrait, uDprH;
uniform vec2 uRes, uCC;
uniform float uT, uOpen, uCS, uInk;
uniform vec3 uPointer; // pointer in uv and strength: wind that parts the clouds
uniform vec4 uTxt; // text box in uv (x0, y0, x1, y1), the sky stays calm and darker there
out vec4 o;
// Light mode tone: paper at the page tone (.04 inverts to #f5f5f5), faint haze cut away, strokes crisp and dark
const float INK_LO = .1, INK_TOP = .34;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for(int i = 0; i < 5; i++){ s += a*noise(p); p *= 2.03; a *= .5; } return s; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  // Sky: engraved cloudscape (Codex, technique like the reference "engraved clouds"), scaled to cover and anchored at
  // the bottom so the cloud banks sit at the lower edge. When opening, the strokes appear by brightness:
  // first the brightest lines, then the fine ones, as if the engraving were being drawn right now.
  float texA = uPortrait > .5 ? .5625 : 1.7778;
  vec2 sc = vec2(min(asp / texA, 1.), min(texA / asp, 1.));
  vec2 suv = vec2((uv.x - .5) * sc.x + .5, uv.y * sc.y);
  // Clouds billow: two-stage distorted field, faster at the top than in the banks below. The pointer is wind: it pushes
  // the strokes apart around itself, like a hole pressed into the cloud cover.
  vec2 q = vec2(fbm(suv * 2.2 + vec2(uT * .035, 0.)), fbm(suv * 2.2 + vec2(5.2, -uT * .03)));
  vec2 qw = vec2(fbm(suv * 4. + q * 1.7 + uT * .05), fbm(suv * 4. + q * 1.7 + 3.3 - uT * .04)) - .5;
  suv += qw * (.009 + .012 * uv.y);
  vec2 zd = (uv - uPointer.xy) * vec2(asp, 1.); float zr = dot(zd, zd);
  vec2 wind = zd / (sqrt(zr) + .02) * exp(-zr * 14.) * .032 * uPointer.z;
  suv -= wind * vec2(sc.x / asp, sc.y);
  float L = uPortrait > .5 ? texture(uSkyH, suv).r : texture(uSkyQ, suv).r;
  float progress = smoothstep(.05, .85, uOpen);
  float th = 1.05 - progress * 1.1;
  float sky = L * smoothstep(th, th + .18, L + hash(floor(gl_FragCoord.xy / 2.)) * .05);
  // Brand: exact silhouette from the masks of the loader, filled with the densest part of the engraved cloudscape
  float c = smoothstep(.35, .95, uOpen);
  vec2 cuv = (uv - uCC) * vec2(asp, 1.) / uCS + .5;
  float rot = sin(uT * .35) * .02;
  cuv = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * (cuv - .5) * (1. + .015 * sin(uT * .7)) + .5;
  float inside = step(0., cuv.x) * step(cuv.x, 1.) * step(0., cuv.y) * step(cuv.y, 1.);
  vec2 w = vec2(fbm(cuv * 3. + uT * .22), fbm(cuv * 3. + 7.3 - uT * .2)) - .5;
  vec2 duv = cuv + w * (.07 * (1. - c) + .02) - wind * .7 / uCS;
  float sil = mix(texture(uCoarse, duv).r, texture(uFine, duv).r, c);
  float n = fbm(duv * 7. + vec2(uT * .25, -uT * .16));
  float thm = mix(.95, .3, c);
  float m = smoothstep(thm - .08, thm + .08, sil + (n - .5) * .45 * (1. - .6 * c));
  float fill = texture(uSkyQ, vec2(.03, .03) + duv * vec2(.34, .42)).r;
  float thf = 1.05 - c * 1.1;
  fill *= smoothstep(thf, thf + .18, fill + hash(floor(gl_FragCoord.xy / 2.) + 7.) * .05);
  float a = m * inside;
  // Light from above: the brand is brighter at the top, denser at the bottom like a cloud mass
  float hell = .7 + .45 * clamp(cuv.y, 0., 1.);
  vec3 col = vec3(mix(.035 + sky * .95, .03 + min(fill * 1.35 * hell, 1.), a));
  // Under the text: strokes muted so white stays readable
  vec2 tb = smoothstep(vec2(-.15), vec2(.02), min(uv - uTxt.xy, uTxt.zw - uv));
  float tm = tb.x * tb.y;
  col = mix(col, vec3(.035), tm * .7);
  // Bottom edge: clouds fade into the footer background (no edge at the seam)
  col *= mix(.0, 1., smoothstep(0., 110. / uRes.y * uDprH, uv.y));
  col += (hash(gl_FragCoord.xy + fract(uT) * 91.) - .5) * .03;
  // Light mode (canvas CSS-inverted, col becomes ink): the strokes as strong as on black
  col = mix(col, vec3(.04 + .86 * smoothstep(INK_LO, INK_TOP, col.r)), uInk);
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
	/** smoothed pointer in uv and strength */
	pointer: [number, number, number];
}

/** Load an image, flip it and decode it off the main thread: the texture upload then only copies. */
async function loadImage(src: string): Promise<ImageBitmap> {
	const blob = await (await fetch(src)).blob();
	return createImageBitmap(blob, { imageOrientation: 'flipY', premultiplyAlpha: 'none' });
}

/** Wait for the next task: shader, textures and context end up in different frames, not in one. */
const pause = () => new Promise<void>((ok) => setTimeout(ok, 0));

async function load(s: SkyState): Promise<void> {
	const names = ['uSkyQ', 'uSkyH', 'uFine', 'uCoarse'];
	// Decoding runs in parallel and without the main thread while context and shader are created
	const images = Promise.all(
		['engraving-landscape', 'engraving-portrait', 'mask-fine', 'mask-coarse'].map((n) =>
			loadImage(`/sky/${n}.webp`),
		),
	);
	const gl = s.cv2.getContext('webgl2', {
		premultipliedAlpha: true,
		alpha: true,
		antialias: false,
	});
	if (!gl) return;
	await pause();
	const p = buildProgram(gl, VS, FS, 'sky');
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
	// A draw call in 1 x 1 pixel forces the driver to finish compiling the program now
	await pause();
	gl.viewport(0, 0, 1, 1);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	s.g = { gl, u };
	s.ready = true;
}

/** Tight rectangle around title and buttons (CSS px measured from the area). */
function textBox(sec: HTMLElement, r0: DOMRect): [number, number, number, number] | null {
	const h = sec.querySelector('h2');
	const k = sec.querySelector('[data-buttons]');
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

/** Registers the sky. layer: element above the ASCII sun, containing the WebGL canvas. */
export function registerSky(
	layer: HTMLElement,
	cv: HTMLCanvasElement,
	sec: HTMLElement,
): () => void {
	return register<SkyState>({
		name: 'sky',
		el: layer,
		host: sec,
		box: (W, H) => ({ bw: W, bh: H }),
		init(s) {
			s.cv2 = cv;
			s.g = null;
			s.ready = false;
			s.open = 0;
			s.pointer = [0.5, 0.5, 0];
			load(s).catch(() => {});
		},
		frame(s) {
			const g = s.g;
			if (!s.ready || !g) return;
			const { gl, u } = g;
			const dpr = dprFor(1.5, 1, s.W, s.H);
			if (sizeBacking(cv, s.W, s.H, dpr)) gl.viewport(0, 0, cv.width, cv.height);
			const { width: w, height: h } = cv;
			// No curtain anymore: the sky stands open from the start
			const r0 = s.el.getBoundingClientRect();
			s.open = 1;
			const portrait = s.mode === 'portrait';
			gl.uniform1f(u('uPortrait'), portrait ? 1 : 0);
			gl.uniform1f(u('uDprH'), dpr);
			gl.uniform2f(u('uRes'), w, h);
			gl.uniform1f(u('uT'), s.reduced ? 4 : loop.t);
			gl.uniform1f(u('uOpen'), s.open);
			gl.uniform1f(u('uInk'), isLight() ? 1 : 0);
			const bottom = cl((r0.bottom - loop.vh) / s.H, 0, 1); // part of the area below the window edge
			if (portrait) {
				// Portrait: fixed in the section above the title, scrolls away with the text (no room at the top in the final view)
				gl.uniform2f(u('uCC'), 0.5, 0.74);
				gl.uniform1f(u('uCS'), Math.min(0.42, 0.62 * (s.W / s.H)));
			} else {
				gl.uniform2f(u('uCC'), 0.72, bottom + (1 - bottom) * 0.55);
				gl.uniform1f(u('uCS'), 0.62);
			}
			// Pointer as wind; without pointer (phone) a slow gust drifts across the sky
			const t = loop.t;
			const da = s.m.in && !s.reduced;
			const zx = da ? s.m.px / s.W : 0.5 + 0.38 * Math.sin(t * 0.13);
			const zy = da ? 1 - s.m.py / s.H : 0.32 + 0.14 * Math.sin(t * 0.21 + 1.3);
			const k = 1 - Math.exp(-loop.dt * 4);
			s.pointer[0] += (zx - s.pointer[0]) * k;
			s.pointer[1] += (zy - s.pointer[1]) * k;
			s.pointer[2] += ((s.reduced ? 0 : da ? 1 : 0.55) - s.pointer[2]) * k;
			gl.uniform3f(u('uPointer'), s.pointer[0], s.pointer[1], s.pointer[2]);
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
