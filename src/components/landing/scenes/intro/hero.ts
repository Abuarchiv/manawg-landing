// Hero der Intro-Bühne: Berg, Zeichen, Organ und Tauchgang als WebGL2-Shader mit Halbton-Ausgabe.
// Ohne WebGL2 zeichnet der Halbton-Fallback (tone) das Zeichen im 2D-Canvas.
//
// Aufbau wie im Entwurf: Szenen-Pass in kleiner Auflösung in eine Textur, danach der Halbton-Pass
// in voller Backing-Auflösung. Neu gegenüber der Portierung: Texturgröße und Szenenpuffer folgen
// der CSS-Größe des Canvas (nicht mehr fest 1280 x 800), im Hochformat wird der Bildausschnitt
// gerahmt (uZ), die Ausgabe läuft über einen Offscreen-Canvas in das sichtbare 2D-Canvas.

import { glSichtbar, glSoftware } from '../../core/canvas';
import { HOME, HOME3, aMark, cl, ease, hsh, lerp, ss } from '../../core/math';
import type { BuehnenKontext, HeroMarken } from './types';

const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;
const HEAD = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 uR; uniform float T; uniform vec2 uM; uniform vec4 uB[8]; uniform float uZ;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float nz(vec2 x){ vec2 p = floor(x), f = fract(x); vec2 u = f * f * (3. - 2. * f);
  float a = hash(p), b = hash(p + vec2(1., 0.)), c = hash(p + vec2(0., 1.)), d = hash(p + 1.); return mix(mix(a, b, u.x), mix(c, d, u.x), u.y); }
float fbm(vec2 p){ float s = 0., a = .5; for(int i = 0; i < 5; i++){ s += a * nz(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; } return s; }
const mat2 M2 = mat2(.8, -.6, .6, .8);
float terr(vec2 p, int oc){ vec2 q = p * .15; q += (vec2(nz(q * .7), nz(q * .7 + 5.3)) - .5) * .6; float a = 0., b = .56, w = 1.;
  for(int i = 0; i < 11; i++){ if(i >= oc) break; float n = 1. - abs(nz(q) * 2. - 1.); n = n * n; a += n * b * w; w = clamp(n * 2., 0., 1.); b *= .46; q = M2 * q * 2.05 + vec2(3.1, 1.7); }
  return a * 3.7 - 1.35; }
float smin(float a, float b, float k){ float h = clamp(.5 + .5 * (b - a) / k, 0., 1.); return mix(b, a, h) - k * h * (1. - h); }
float org(vec2 p){ float d = 1e5; for(int i = 0; i < 8; i++) d = smin(d, length(p - uB[i].xy) - uB[i].w, .063); return max(d, -(length(p - uB[0].xy - vec2(.0117, .0383)) - .037)); }
vec2 UV(){ return (gl_FragCoord.xy - .5 * uR) / (uR.y * uZ); }
vec3 RT, UP, FW;
vec3 cam(float sp, float pitch, float alt, float x0){ vec3 ro = vec3(x0 + uM.x * .1, 0., 3. - T * sp); ro.y = max(alt, terr(ro.xz, 3) + .7);
  float yaw = uM.x * .06; FW = normalize(vec3(sin(yaw), pitch + uM.y * .025, -cos(yaw))); RT = normalize(cross(FW, vec3(0., 1., 0.))); UP = cross(RT, FW); return ro; }
vec3 ray(vec2 uv){ return normalize(uv.x * RT + uv.y * UP + 1.8 * FW); }
float march(vec3 ro, vec3 rd){ float t = .1; for(int i = 0; i < 140; i++){ vec3 p = ro + rd * t; float h = p.y - terr(p.xz, 6); if(abs(h) < .0015 * t || t > 45.) break; t += .34 * h; } return t; }
vec3 tn(vec2 p, float t){ float e = .0018 * t + .0015; return normalize(vec3(terr(p - vec2(e, 0.), 10) - terr(p + vec2(e, 0.), 10), 2. * e, terr(p - vec2(0., e), 10) - terr(p + vec2(0., e), 10))); }
float sha(vec3 p, vec3 l){ float r = 1., t = .03; for(int i = 0; i < 22; i++){ vec3 q = p + l * t; float h = q.y - terr(q.xz, 5); r = min(r, 9. * h / t); t += clamp(h, .05, .45); if(r < .005 || t > 12.) break; } return clamp(r, 0., 1.); }
float snowM(vec3 p, vec3 n, float bias){ float s = nz(p.xz * 13.) * .55 + nz(p.xz * 47.) * .3 + nz(p.xz * 140.) * .15; float hn = clamp((p.y + .3) / 2.2, 0., 1.); return smoothstep(.5, .72, n.y + (s - .5) * .55 + hn * .3 + bias); }
float rockA(vec3 p){ float st = .5 + .5 * sin(p.y * 70. + nz(p.xz * 5.) * 7.); return .06 + .05 * st + .05 * nz(p.xz * 33.); }
float sunD(vec2 uv, vec2 sp, float s){ return org((uv - sp) / s) * s; }
vec3 outc(float v){ v += (hash(gl_FragCoord.xy) - .5) * .02; return vec3(clamp(v, 0., 1.)); }
`;
const SCENE = `${HEAD}
uniform float uMix, uLook, uK, uSt; uniform vec4 uO[8]; uniform vec3 uC; uniform vec3 uH;
uniform sampler2D uImg, uMsk; uniform float uFoto, uAb;
// Berg: Kupferstich (Codex, Technik wie der Himmel des Finales) als Kamerafahrt. Bildausschnitt deckend, im Hochformat enger um den
// Gipfel; der Blick nach oben (uLook) schiebt den Ausschnitt bis in den dunklen Himmel. Wolken ziehen leicht, der
// Zeiger ist Licht auf dem Schnee, die Marke steht als Sonne im Himmel.
const float IMGA = 2560. / 3200.;
vec2 fotoUV(vec2 fc){ vec2 s = fc / uR; float A = uR.x / uR.y; float hN = min(IMGA / A, .5); float wN = hN * A / IMGA;
  float cx = clamp(.4, wN * .5, 1. - wN * .5); float lk = uLook * uLook * (3. - 2. * uLook); float top = mix(.98 - hN, 0., lk);
  float z = 1. + .03 * (1. - lk) * (1. - exp(-T * .08)); vec2 c = vec2(cx, top + hN * .5) + vec2(uM.x * .006, uM.y * .004) * (1. - lk);
  return c + vec2((s.x - .5) * wN, (.5 - s.y) * hN) / z; }
float fotoBerg(vec2 uv){
  vec2 iu = fotoUV(gl_FragCoord.xy); iu.y = 1. - iu.y; float msk = texture(uMsk, iu).r; float himmel = 1. - texture(uMsk, iu, 2.5).r; // Bild gekippt hochgeladen
  vec2 wv = (vec2(nz(iu * vec2(6., 14.) + vec2(T * .05, 0.)), nz(iu * vec2(6., 14.) + vec2(3.7, T * .03))) - .5) * .006 * himmel;
  float v = texture(uImg, iu + wv).r;
  // Tonkurve wie Schwarzweiß-Abzug: tiefes Schwarz im Fels, Schnee bleibt hell; unten dunkler Grund für die Schrift
  v = smoothstep(.04, .97, pow(v, 1.18)); vec2 sv = gl_FragCoord.xy / uR;
  // Beim Öffnen zeichnet sich der Stich nach Helligkeit: erst die hellen Striche, dann die feinen
  // Rückzug (uAb): die Schwelle läuft zurück, erst gehen die dunklen, zuletzt die hellen Striche
  float th = 1.05 - uFoto * 1.1 + uAb * 1.15; v *= smoothstep(th, th + .18, v + hash(floor(gl_FragCoord.xy / 2.)) * .05);
  v *= mix(1., .5, smoothstep(.42, 0., sv.y) * (1. - smoothstep(.0, .25, uLook)));
  // Zeiger als Licht: der Schnee unter ihm hellt weich auf, Fels bleibt dunkel
  vec2 sp = mix(vec2(uM.x * .7, .3 + uM.y * .1), vec2(uM.x * .04, uM.y * .03), uLook); float sc = mix(.15, .52, uLook * uLook);
  float lm = exp(-length(uv - uM * vec2(.9, .5)) * 3.2); v += smoothstep(.45, .85, v) * msk * lm * .12;
  float d = sunD(uv, sp, sc); float sun = (1. - msk) * smoothstep(.002, -.002, d); v = mix(v, .9, sun);
  v += (1. - msk) * exp(-max(d, 0.) * 16. / (1. + uLook * 2.)) * .07 * (1. + uLook * 3.);
  return clamp(v + (hash(gl_FragCoord.xy + fract(T) * 61.) - .5) * .025 * (1. - smoothstep(0., .12, uLook)), 0., 1.); } // ohne Körnung, sobald Linien den Ton tragen: sie würden flimmern
float mountain(vec2 uv){
  if(uFoto > .001) return fotoBerg(uv);
  float pitch = mix(-.06, .55, uLook); vec3 ro = cam(.045, pitch, 1.85, 2.4), rd = ray(uv);
  vec2 sp = mix(vec2(uM.x * .7, .3 + uM.y * .1), vec2(uM.x * .04, uM.y * .03), uLook); float sc = mix(.15, .52, uLook * uLook);
  vec3 L = normalize(RT * (sp.x * 1.5 + .9) + UP * .42 - FW * .2);
  float e = rd.y + .06; float sky = mix(.36, .2, clamp(e * 2.2 + .05, 0., 1.)); float st = fbm(vec2(rd.x * 1.2 + T * .008, e * 15.)); sky += (st - .5) * .18 * smoothstep(-.05, .35, e); if(uSt < .5) sky = .93 - .08 * clamp(e * 2., 0., 1.); if(abs(uSt - 2.) < .5) sky *= .3;
  float v = sky; float t = 45.; if(uLook < .97) t = march(ro, rd); vec3 p = ro + rd * t;
  if(t < 45.){ vec3 n = tn(p.xz, t); float dif = max(dot(n, L), 0.) * sha(p + n * .01, L); float sn = snowM(p, n, .1);
float alb = mix(rockA(p) * .5, .95, sn); float amb = .5 + .5 * n.y; v = alb * (dif * 1.25 + amb * .07); v = v / (v + .55) * 1.5; v = mix(v, uSt < .5 ? .9 : .34, 1. - exp(-t * .035)); if(abs(uSt - 2.) < .5){ float cc = p.y * 15.; float ww = max(fwidth(cc), .04); float ln = 1. - smoothstep(ww * .6, ww * 1.8, abs(fract(cc) - .5)); v = ln * (.3 + .9 * v) + v * .06; } }
  else { float d = sunD(uv, sp, sc); v = mix(v, uSt < .5 ? .4 : .88, smoothstep(.002, -.002, d)); v += exp(-max(d, 0.) * 16. / (1. + uLook * 2.)) * .08 * (1. + uLook * 3.); }
  if(uSt < .5 && uLook < .7){ float ff = 1. - uLook / .7; for(int L2 = 0; L2 < 2; L2++){ float fl = float(L2); float sx = uv.x * (10. + fl * 6.) + T * (.05 + fl * .08) + fl * 3.7; float id = floor(sx); float fx = fract(sx) - .5; float hgt = (.1 + .12 * hash(vec2(id, fl))) * (1. + fl * .5); float base = -.36 - fl * .08; float tri = base + hgt - abs(fx) * hgt * 2.6; if(uv.y < tri){ float br = step(.5, fract((uv.y - base) * 60. + abs(fx) * 8.)); v = mix(v, .1 + .22 * br, ff); } } }
  if(abs(uSt - 4.) < .5){ for(int L3 = 0; L3 < 2; L3++){ float fl = float(L3); vec2 q = uv * vec2(1.6, 2.6) + vec2(T * (.02 + fl * .02) + fl * 4., fl * .7); float c = fbm(q) + fbm(q * 2.3) * .35; float band = smoothstep(.16, .02, abs(uv.y - (-.02 - fl * .2))); float m = smoothstep(.6, .68, c * band + .1); float fp = sin(fbm(q * 5. + c * 2.) * 90.); float tone = .82 * (.55 + .45 * step(0., fp)) * (.6 + .4 * smoothstep(.6, .9, c)); v = mix(v, tone, m * (1. - uLook)); } }
  return v; }
// Organ: weiches Gewebe statt glatter Kugeln. Feine Falten wandern über die Haut (drei Sinus-Felder), der Zeiger
// drückt eine Delle; Licht mit Durchschimmern (wrap), Glanzpunkt, Höhlen-Schatten und Poren, die der Halbton als
// wechselnde Punktgrößen zeigt.
float falte(vec3 p){ return sin(p.x * 9. + T * .7 + sin(p.y * 5. - T * .4) * 1.6) * sin(p.y * 8. - T * .5 + sin(p.z * 6.) * 1.4) * sin(p.z * 7. + p.x * 3. + T * .3); }
float omap(vec3 p){ float d = 1e5; for(int i = 0; i < 8; i++) d = smin(d, length(p - uO[i].xyz) - uO[i].w, uK);
  d += falte(p * 2.6) * .016 + exp(-dot(p.xy - uM * 1.6, p.xy - uM * 1.6) * 6.) * .03; return max(d, -(length(p.xy - uH.xy) - uH.z)); }
vec3 onrm(vec3 p){ const vec2 e = vec2(.002, -.002); return normalize(e.xyy * omap(p + e.xyy) + e.yyx * omap(p + e.yyx) + e.yxy * omap(p + e.yxy) + e.xxx * omap(p + e.xxx)); }
float organ(vec2 uv){ vec3 ro = uC, rd = normalize(vec3(uv, -1.6)); float t = 0., md = 1e5;
  for(int i = 0; i < 96; i++){ vec3 p = ro + rd * t; float d = omap(p); md = min(md, d);
if(d < .0015){ vec3 n = onrm(p); vec3 l = normalize(vec3(uM.x * 2.4 - .6, uM.y * 2.4 + .9, 1.3));
  float wr = max((dot(n, l) + .45) / 1.45, 0.); float df = wr * wr;
  float ao = clamp(omap(p + n * .06) / .06, 0., 1.) * .5 + clamp(omap(p + n * .22) / .22, 0., 1.) * .5;
  float rim = pow(1. - max(dot(n, -rd), 0.), 3.); float sp = pow(max(dot(reflect(-l, n), -rd), 0.), 36.);
  float por = .78 + .22 * nz(p.xy * 26. + p.z * 9.);
  float hinten = pow(max(dot(n, normalize(vec3(-l.x, -l.y, -.4))), 0.), 2.) * .25; // Gegenlicht am Rand
  return clamp(df * .85 * por * (.3 + .7 * ao) + .04 + rim * .2 + hinten + sp * .9, 0., 1.); }
t += d * .82; if(t > 40.) break; }
  return exp(-md * 7.) * .45 * step(.88, hash(floor(gl_FragCoord.xy) + 3.1)); }
void main(){ vec2 uv = UV(); float v = 0.; if(uMix < .999) v = mountain(uv); if(uMix > .001) v = mix(v, organ(uv), uMix); o = vec4(v, v, v, 1.); }`;
// Halbton-Zelle: im Hochformat feiner (nach der Breite), sonst trägt das Organ am Handy nur zehn Punkte.
const POST = `#version 300 es
precision highp float; out vec4 o; uniform sampler2D uT; uniform vec2 uR, uS; uniform float uD, uL, uMx, uSt; uniform vec4 uHo[4]; uniform float uPad;
void main(){ vec2 fc = gl_FragCoord.xy; float vr = texture(uT, fc / uR * uS).r;
  float cs = 6. * min(uR.y, uR.x * 1.6) / 800.; vec2 c = (floor(fc / cs) + .5) * cs; float L = texture(uT, c / uR * uS).r; if(uL > .5) L = mix(clamp((L - .36) / .64, 0., 1.), L, uMx);
  float r = cs * .5 * sqrt(clamp(L, 0., 1.)) * 1.15; float vd = smoothstep(r + .7, r - .7, length(fc - c));
  float v = mix(vr, vd, uD); if(uSt < .5){ float tone = vr; float k8 = uR.y / 800.; float sl = (fc.y + fc.x * .22) / (3.2 * k8); float w = fwidth(sl); float th = clamp((.88 - tone) * 1.2, 0., 1.); float ln = 1. - smoothstep(th - w, th + w, abs(fract(sl) - .5) * 2.); float sd = 1. - tone; if(sd > .6){ float s2 = (fc.y - fc.x * .5) / (3. * k8); ln = max(ln, 1. - smoothstep(0., fwidth(s2) * 2., abs(fract(s2) - .5) * 2. - (1. - (sd - .6) * 2.))); } v = mix(ln, vd, uD); } float ho = 0.; for(int i = 0; i < 4; i++){ vec4 r = uHo[i]; if(r.z > r.x){ vec2 dd = max(max(r.xy - fc, fc - r.zw), 0.); ho = max(ho, 1. - smoothstep(uPad, uPad * 2., length(dd))); } } v *= 1. - ho * uMx;
  if(uL > .5) v = 1. - v * .96; else v = .04 + v * .94; o = vec4(v, v, v, 1.); }`;

const B = new Float32Array(32);
const O = new Float32Array(32);
const HO = new Float32Array(16);

/** Gelinktes Shader-Programm mit den Orten seiner Uniforms. */
interface Programm<K extends string> {
	pr: WebGLProgram;
	U: Record<K, WebGLUniformLocation | null>;
}

type SzeneU =
	| 'uR'
	| 'T'
	| 'uM'
	| 'uB'
	| 'uMix'
	| 'uLook'
	| 'uK'
	| 'uO'
	| 'uC'
	| 'uH'
	| 'uSt'
	| 'uZ'
	| 'uImg'
	| 'uMsk'
	| 'uFoto'
	| 'uAb';
type PostU = 'uT' | 'uR' | 'uS' | 'uD' | 'uL' | 'uMx' | 'uSt' | 'uHo' | 'uPad';

/** WebGL-Zustand des Heros: Offscreen-Canvas, Kontext, Programme, Szenentextur samt Framebuffer. */
interface HeroGL {
	cv: HTMLCanvasElement | null;
	gl: WebGL2RenderingContext | null;
	lostAt: number;
	noGL: boolean;
	fails: number;
	chk: number;
	leer: number;
	tx: WebGLTexture | null;
	fb: WebGLFramebuffer | null;
	tw: number;
	th: number;
	S: Programm<SzeneU> | null;
	Pp: Programm<PostU> | null;
	/** Hilfs-Canvas zum Lesen eines Pixels (willReadFrequently). */
	pr: CanvasRenderingContext2D | null;
	/** Foto-Berg: Bild und Maske, sobald geladen und dekodiert. */
	foto: { img: ImageBitmap; msk: ImageBitmap } | null;
	fotoTx: [WebGLTexture, WebGLTexture] | null;
	/** Einblendung des Fotos 0..1 (über den Rechen-Berg, falls das Bild spät kommt). */
	fotoA: number;
}

/**
 * Hero an ein sichtbares 2D-Canvas hängen.
 * frame(c, h) zeichnet ein Bild. c ist der Kontext der Bühne (W, H, dpr, t, now, P, m, ...),
 * h trägt die abgeleiteten Marken { look, mx, split, zoom, dive, sm, a0, ad }.
 */
export function createHero(cv: HTMLCanvasElement) {
	const ctx = cv.getContext('2d');
	if (!ctx) throw new Error('hero: kein 2D-Kontext');
	const G: HeroGL = {
		cv: null,
		gl: null,
		lostAt: 0,
		noGL: false,
		fails: 0,
		chk: 0,
		leer: 0,
		tx: null,
		fb: null,
		tw: 0,
		th: 0,
		S: null,
		Pp: null,
		pr: null,
		foto: null,
		fotoTx: null,
		fotoA: 0,
	};
	// Foto-Berg laden (Dekodieren abseits des Hauptthreads). Höchstens 2,5 s hält der Hero das erste Bild zurück,
	// damit der Lader direkt auf das Foto öffnet; kommt es später, blendet es über den Rechen-Berg ein.
	const t0 = performance.now();
	const bitmap = (src: string) =>
		fetch(src)
			.then((r) => r.blob())
			.then((b) => createImageBitmap(b, { imageOrientation: 'flipY' }));
	Promise.all([bitmap('/hero/berg.webp'), bitmap('/hero/berg-maske.webp')])
		.then(([img, msk]) => {
			G.foto = { img, msk };
		})
		.catch(() => {});
	const fb = { x: 0, y: 0, ok: false }; // Fallback: nachlaufendes Licht

	const initGL = (gcv: HTMLCanvasElement): boolean => {
		const gl = gcv.getContext('webgl2', { antialias: false, preserveDrawingBuffer: false });
		if (!gl) return false;
		// Treiber, deren Ausgabe leer bleibt, gelten wie fehlendes WebGL2 (Halbton-Fallback)
		if (!glSichtbar(gl, gcv)) {
			// biome-ignore lint/suspicious/noConsole: Diagnose auf Debug-Stufe
			console.debug('hero: WebGL-Ausgabe bleibt leer, 2D-Fallback');
			G.gl = null;
			return false;
		}
		G.gl = gl;
		const sh = (t: number, src: string, k: string): WebGLShader => {
			const s = gl.createShader(t);
			if (!s) throw new Error(`shader ${k}: nicht angelegt`);
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
				console.error(`shader ${k}`, gl.getShaderInfoLog(s));
			return s;
		};
		const vs = sh(gl.VERTEX_SHADER, VS, 'vs');
		const prog = <K extends string>(src: string, names: readonly K[], k: string): Programm<K> => {
			const pr = gl.createProgram();
			if (!pr) throw new Error(`programm ${k}: nicht angelegt`);
			gl.attachShader(pr, vs);
			gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, src, k));
			gl.bindAttribLocation(pr, 0, 'a');
			gl.linkProgram(pr);
			if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
				console.error(`link ${k}`, gl.getProgramInfoLog(pr));
			const U = {} as Record<K, WebGLUniformLocation | null>;
			for (const n of names) U[n] = gl.getUniformLocation(pr, n);
			return { pr, U };
		};
		G.S = prog(
			SCENE,
			[
				'uR',
				'T',
				'uM',
				'uB',
				'uMix',
				'uLook',
				'uK',
				'uO',
				'uC',
				'uH',
				'uSt',
				'uZ',
				'uImg',
				'uMsk',
				'uFoto',
				'uAb',
			],
			'scene',
		);
		G.Pp = prog(POST, ['uT', 'uR', 'uS', 'uD', 'uL', 'uMx', 'uSt', 'uHo', 'uPad'], 'post');
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		G.tx = null;
		G.fb = null;
		G.tw = 0;
		G.th = 0;
		G.fotoTx = null;
		return true;
	};

	// Foto und Maske als Texturen (Maske mit Mipmaps: weiche Himmelsgewichtung über die Bias-Stufe).
	const fotoTex = (gl: WebGL2RenderingContext) => {
		if (G.fotoTx || !G.foto) return;
		const mk = (b: ImageBitmap, mip: boolean): WebGLTexture => {
			const t = gl.createTexture();
			if (!t) throw new Error('hero: Textur nicht angelegt');
			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gl.RED, gl.UNSIGNED_BYTE, b);
			gl.texParameteri(
				gl.TEXTURE_2D,
				gl.TEXTURE_MIN_FILTER,
				mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR,
			);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			if (mip) gl.generateMipmap(gl.TEXTURE_2D);
			return t;
		};
		G.fotoTx = [mk(G.foto.img, false), mk(G.foto.msk, true)];
	};

	// Textur und Framebuffer des Szenenpuffers, bei Größenwechsel neu anlegen.
	const ensureTex = (gl: WebGL2RenderingContext, tw: number, th: number) => {
		if (G.tx && G.tw === tw && G.th === th) return;
		if (G.tx) gl.deleteTexture(G.tx);
		if (G.fb) gl.deleteFramebuffer(G.fb);
		G.tx = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, G.tx);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		G.fb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, G.fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, G.tx, 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		G.tw = tw;
		G.th = th;
	};

	// Frischer Offscreen-Canvas (auch nach verlorenem Kontext). Ohne WebGL2 gilt dauerhaft der Fallback.
	let everOk = false;
	const fresh = () => {
		const gcv = document.createElement('canvas');
		G.cv = gcv;
		G.gl = null;
		gcv.addEventListener('webglcontextlost', (e) => {
			e.preventDefault();
			G.gl = null;
			G.lostAt = performance.now();
		});
		if (initGL(gcv)) {
			everOk = true;
			G.fails = 0;
		} else {
			G.fails++;
			if (!everOk || G.fails >= 3) G.noGL = true;
		}
	};
	// Ohne Grafikchip rechnet der Berg-Shader auf dem Hauptprozessor (Sekunden je Bild): dann gleich der Halbton-Fallback
	let geprueft = false;
	let weg = false;
	glSoftware().then((sw) => {
		geprueft = true;
		if (weg) return;
		if (sw) G.noGL = true;
		else fresh();
	});

	// Halbton-Fallback ohne WebGL2: das Zeichen als Punktraster mit nachlaufendem Licht.
	// Abstand und Normale je Zelle hängen nur an der Größe: einmal rechnen, je Bild nur noch das Licht.
	// Je Zelle 8 Werte: x, y, i, j, Abstand, Normale x/y samt Länge, Höhe^0,3.
	const feld = { W: 0, H: 0, n: 0, z: new Float32Array(0) };
	const baueFeld = (W: number, H: number, sc: number) => {
		const step = 6;
		const cx = W / 2;
		const cy = H / 2;
		const z: number[] = [];
		for (let y = step / 2, j = 0; y < H; y += step, j++)
			for (let x = step / 2, i = 0; x < W; x += step, i++) {
				const mx = (x - cx) / sc + 208;
				const my = (y - cy) / sc + 173;
				if (mx < -60 || mx > 480 || my < -60 || my > 400) continue;
				const d = aMark(mx, my);
				if (d >= 70) continue;
				let nx = 0;
				let ny = 0;
				let hp = 0;
				if (d < 0) {
					const h = Math.sqrt(cl(-d / 46));
					const sl = (1 - h) * 2;
					nx = (aMark(mx + 1, my) - d) * sl;
					ny = (aMark(mx, my + 1) - d) * sl;
					hp = h ** 0.3;
				}
				z.push(x, y, i, j, d, nx, ny, hp);
			}
		feld.W = W;
		feld.H = H;
		feld.n = z.length / 8;
		feld.z = Float32Array.from(z);
	};
	const tone = (c: BuehnenKontext) => {
		const { W, H, t, dpr } = c;
		const step = 6;
		const f0 = Math.min(1.25, Math.min(W, H) / 800);
		const cx = W / 2;
		const cy = H / 2;
		const tg: [number, number] = c.m.in
			? [c.m.x, c.m.y]
			: [cx + Math.cos(t * 0.3) * 220 * f0, cy - 160 * f0 + Math.sin(t * 0.4) * 80 * f0];
		if (!fb.ok) {
			fb.x = tg[0];
			fb.y = tg[1];
			fb.ok = true;
		}
		const kf = 1 - Math.exp(-10 * c.dt); // 0,08 je Bild bei 120 Hz
		fb.x += (tg[0] - fb.x) * kf;
		fb.y += (tg[1] - fb.y) * kf;
		sizeTo(c.W, c.H, dpr);
		if (feld.W !== W || feld.H !== H) baueFeld(W, H, 1.3 * f0);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = '#0A0A0A';
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = '#FAFAFA';
		// Atmen als Skalierung um die Mitte, das Licht in Feld-Koordinaten
		const br = 1 + 0.025 * Math.sin((t * Math.PI) / 3);
		ctx.setTransform(dpr * br, 0, 0, dpr * br, dpr * cx * (1 - br), dpr * cy * (1 - br));
		const lx0 = (fb.x - cx) / br + cx;
		const ly0 = (fb.y - cy) / br + cy;
		const L = 220 * f0;
		const blink = Math.floor(t * 2);
		const z = feld.z;
		for (let k = 0; k < feld.n * 8; k += 8) {
			const x = z[k] ?? 0;
			const y = z[k + 1] ?? 0;
			const d = z[k + 4] ?? 0;
			let v = 0;
			if (d < 0) {
				const nx = z[k + 5] ?? 0;
				const ny = z[k + 6] ?? 0;
				const lx = lx0 - x;
				const ly = ly0 - y;
				const lam = Math.max(
					0,
					(nx * lx + ny * ly + L) / (Math.hypot(nx, ny, 1) * Math.hypot(lx, ly, L)),
				);
				v = (z[k + 7] ?? 0) * (0.08 + 0.92 * lam * lam);
			} else if (hsh((z[k + 2] ?? 0) * 7 + blink, z[k + 3] ?? 0) < 0.18 * (1 - d / 70)) v = 0.25;
			if (v > 0.03) {
				const r = step * 0.5 * Math.sqrt(cl(v));
				ctx.fillRect(x - r, y - r, r * 2, r * 2);
			}
		}
	};

	const sizeTo = (W: number, H: number, dpr: number) => {
		const w = Math.max(1, Math.round(W * dpr));
		const h = Math.max(1, Math.round(H * dpr));
		if (cv.width !== w || cv.height !== h) {
			cv.width = w;
			cv.height = h;
		}
	};

	// Ein Bild. Gibt true zurück, wenn gezeichnet wurde.
	const frame = (c: BuehnenKontext, h: HeroMarken): boolean => {
		if (!geprueft) return false;
		if (G.noGL) {
			tone(c);
			return true;
		}
		const gl = G.gl;
		const gcv = G.cv;
		const S = G.S;
		const Pp = G.Pp;
		if (!gl || !gcv || !S || !Pp || gl.isContextLost()) {
			if (!G.lostAt) G.lostAt = performance.now();
			if (performance.now() - G.lostAt > 800) {
				G.lostAt = 0;
				fresh();
			}
			return false;
		}
		G.lostAt = 0;
		if (!G.foto && performance.now() - t0 < 2500) return false;
		const { t, now, W, H } = c;
		const dpr = c.dprHero ?? c.dpr;
		const { split, dive, zoom, look, mx } = h;
		const br = 1 + 0.03 * Math.sin((t * Math.PI) / 3);
		const home0 = HOME[0];
		if (!home0) return false;
		for (let i = 0; i < 8; i++) {
			const hm = HOME[i];
			const g = HOME3[i];
			if (!hm || !g) continue;
			const e = i ? ease((now - h.a0 - i * 0.07) / 1.4) : 1;
			const dx = hm[0] - home0[0];
			const dy = hm[1] - home0[1];
			const L = Math.hypot(dx, dy) || 1;
			const far = 0.9 * (1 - e);
			B[i * 4] = hm[0] + (dx / L) * far;
			B[i * 4 + 1] = hm[1] + (dy / L) * far;
			B[i * 4 + 2] = 0;
			B[i * 4 + 3] = hm[2] * br;
			const f = 1 + 1.4 * split;
			O[i * 4] = g[0] * f + Math.sin(t * 0.3 + i * 1.7) * 0.25 * split;
			O[i * 4 + 1] = g[1] * f + Math.cos(t * 0.27 + i * 2.3) * 0.25 * split;
			O[i * 4 + 2] = ((i % 3) - 1) * 1.5 * split;
			O[i * 4 + 3] = g[2] * br;
		}
		const hx = (O[0] ?? 0) + 7 / 110;
		const hy = (O[1] ?? 0) + 23 / 110;
		const hr = 0.2 * (1 + dive * 2.2);
		const cz = lerp(lerp(17, 6, zoom), -2.5, dive ** 1.6);
		const allDots = mx >= 0.999;
		// Ausgabe in voller Backing-Auflösung, Szenenpuffer klein und adaptiv
		const w = Math.max(1, Math.round(W * dpr));
		const hh = Math.max(1, Math.round(H * dpr));
		sizeTo(W, H, dpr);
		const cs = (6 * hh) / 800;
		// Berg-Phase (ruhiges Bild): feinerer Szenenpuffer, die Grate zeigen sonst Treppenstufen; die adaptive Stufe (ad) fängt Last ab
		const fk = mx < 0.05 ? 0.78 : 0.42;
		// Foto-Berg: nur Texturzugriffe, deshalb in voller Backing-Auflösung (scharfes Gestein und Schnee)
		const foto = G.fotoA > 0.001 && mx < 0.05;
		const fw = allDots
			? Math.ceil(w / cs)
			: foto
				? w
				: Math.round(cl(fk * W * h.ad, 160, mx < 0.05 ? 1200 : 900));
		const fh = allDots ? Math.ceil(hh / cs) : Math.round((fw * H) / W);
		const tw = Math.min(4096, Math.max(960, w));
		const th = Math.max(fh, Math.round((tw * hh) / w));
		ensureTex(gl, tw, th);
		// Hochformat: waagerechte Bewegung dämpfen und den Ausschnitt weiter fassen
		const ax = Math.min(1, W / H / 1.6);
		const uz = Math.min(1, W / H / 0.9);
		gl.bindFramebuffer(gl.FRAMEBUFFER, G.fb);
		gl.viewport(0, 0, fw, fh);
		gl.useProgram(S.pr);
		const U = S.U;
		gl.uniform2f(U.uR, fw, fh);
		gl.uniform1f(U.T, t);
		gl.uniform2f(U.uM, h.sm[0] * ax, h.sm[1]);
		gl.uniform4fv(U.uB, B);
		gl.uniform4fv(U.uO, O);
		gl.uniform1f(U.uMix, mx);
		gl.uniform1f(U.uSt, 1);
		gl.uniform1f(U.uLook, look);
		gl.uniform1f(U.uK, lerp(0.5, 0.12, split));
		gl.uniform1f(U.uZ, uz);
		gl.uniform3f(U.uC, lerp(0, hx, ss(dive * 1.6)), lerp(0, hy, ss(dive * 1.6)), cz);
		gl.uniform3f(U.uH, hx, hy, hr);
		fotoTex(gl);
		if (G.fotoTx) {
			G.fotoA = c.reduced ? 1 : Math.min(1, G.fotoA + c.dt / 1.8);
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, G.fotoTx[0]);
			gl.uniform1i(U.uImg, 1);
			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, G.fotoTx[1]);
			gl.uniform1i(U.uMsk, 2);
			gl.activeTexture(gl.TEXTURE0);
		}
		gl.uniform1f(U.uFoto, G.fotoTx ? G.fotoA : 0);
		gl.uniform1f(U.uAb, ss((look - 0.02) / 0.6));
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		if (gcv.width < w) gcv.width = w;
		if (gcv.height < hh) gcv.height = hh;
		gl.viewport(0, 0, w, hh);
		gl.useProgram(Pp.pr);
		const Q = Pp.U;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, G.tx);
		gl.uniform1i(Q.uT, 0);
		gl.uniform2f(Q.uR, w, hh);
		gl.uniform2f(Q.uS, fw / tw, fh / th);
		gl.uniform1f(Q.uD, mx);
		gl.uniform1f(Q.uL, 0);
		gl.uniform1f(Q.uMx, mx);
		gl.uniform1f(Q.uSt, 1);
		// Löcher: Logo, Knopf und Hinweis bleiben im Halbton dunkel (Zellen im Rechteck plus 8 px), damit ihre Schrift lesbar ist
		HO.fill(0);
		let ho = 0;
		for (const l of c.loecher ?? []) {
			if (ho >= 4 || !(l.art === 'logo' || l.art === 'cta' || l.art === 'hinweis')) continue;
			HO[ho * 4] = (l.x - 8) * dpr;
			HO[ho * 4 + 1] = hh - (l.y + l.h + 8) * dpr;
			HO[ho * 4 + 2] = (l.x + l.w + 8) * dpr;
			HO[ho * 4 + 3] = hh - (l.y - 8) * dpr;
			ho++;
		}
		gl.uniform4fv(Q.uHo, HO);
		gl.uniform1f(Q.uPad, 8 * dpr);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(gcv, 0, gcv.height - hh, w, hh, 0, 0, w, hh);
		// Die ersten Bilder prüfen: bleibt ein Streifen der Fläche leer (Deckkraft 0), zeichnet der Fallback.
		// Gelesen wird aus einem kleinen Hilfs-Canvas, damit das sichtbare nicht auf Software-Zeichnen kippt.
		if (G.chk < 4 && ++G.chk > 1) {
			G.pr ||= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
			if (G.pr) {
				G.pr.drawImage(cv, 0, Math.floor(hh / 2), w, 2, 0, 0, 1, 1);
				if (G.pr.getImageData(0, 0, 1, 1).data[3] === 0 && ++G.leer >= 2) G.noGL = true;
			}
		}
		return true;
	};

	return {
		frame,
		/** GL-Puffer freigeben (wächst beim nächsten Bild wieder auf die nötige Größe). */
		frei() {
			if (G.cv && !G.noGL) G.cv.width = G.cv.height = 1;
		},
		get noGL() {
			return G.noGL;
		},
		destroy() {
			weg = true;
			G.gl?.getExtension('WEBGL_lose_context')?.loseContext();
		},
	};
}
