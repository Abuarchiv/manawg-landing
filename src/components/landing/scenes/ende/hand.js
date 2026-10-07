// Die Hände der Ende-Szene: eine Hand hält das Handy, die andere wartet unten außerhalb des Bildschirms und
// fährt nur zum Tippen über das Ziel. Beide kommen aus gerenderten Daten-Pässen (public/hand/, design/HAND.md):
// Leuchtdichte, Alpha, Normale und Tiefe. Gezeichnet wird als feiner Halbton (Zellraster 1,25 Bühnen-px,
// Bayer 4 x 4), die Silhouette per Pixel-Alpha geglättet, im WebGL2-Fragment-Shader. Ohne WebGL2 wird der Halbton einmal je Größenänderung auf 2D vorberechnet
// (ohne Zeigerlicht, die Zeigehand als Sprite).
//
// back liegt unter dem Handy, front darüber (normaler Blend, über dem Glas dunkle Punkte). Vorn und hinten
// folgt aus der Tiefe z und der Handy-Silhouette: vorne sind Daumen und Fingerkuppen, die über den Rand
// auf den Bildschirm ragen, sowie die Zeigehand.

import { BAYER as HB, cl, hsh, ss } from '../../core/math';
import { dprFor, glSichtbar, isTouch } from '../../core/canvas';
import { qa } from '../../core/loop';
import { istHoch } from './kamera';

// Bei jedem neuen Render erhöhen: json und webp gehören zusammen und werden gemeinsam gecacht.
const HAND_V = 3;
const STEP = 1.25; // Zellgröße in Bühnen-px (fein: Halbton liest als Haut, nicht als Raster)
const GAM = 0.85;
const CON = 1.05;
const RIM = 0.14;
const EDW = 2.0;
const EDV = 0.9;
const JIT = 0.08;
const RAND_IN = 7; // Haltehand: höchstens so viele px ragen über den Bildschirmrand (Tab-Leiste bleibt frei)
const PS = 0.54; // Maßstab der Zeigehand (Finger ~ 41 Bühnen-px, Haltefinger ~ 55)
const ARM = [1460, 1020]; // Ziel des Zeigearms im Ende-Raum (quer)
const INK = 0.98; // #FAFAFA
const INK_DARK = 0.04; // über dem weißen Bildschirm: dunkle Punkte
const TILES = ['lum', 'a', 'nx', 'ny', 'z'];
const RING_T = 0.8;
const RING_N = 72;

// ----------------------------------------------------------------------------------------------------
// Pässe laden
// ----------------------------------------------------------------------------------------------------

const A = { ready: false, hold: null, point: null, p: null, err: false };

async function ladeAtlas(name) {
	const [meta, blob] = await Promise.all([
		fetch(`/hand/${name}.json?v=${HAND_V}`).then((r) => r.json()),
		fetch(`/hand/${name}.webp?v=${HAND_V}`).then((r) => r.blob()),
	]);
	const bmp = await createImageBitmap(blob, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
	return { meta, bmp };
}

/** Lädt die Pässe der Hände (einmal). stage.js ruft das ab P > 0,75 auf. */
export function laden() {
	if (!A.p)
		A.p = Promise.all([ladeAtlas('hold'), ladeAtlas('point')])
			.then(([h, p]) => {
				A.hold = h;
				A.point = p;
				A.ready = true;
			})
			.catch((e) => {
				A.err = true;
				console.error('hand: Pässe nicht geladen', e);
			});
	return A.p;
}

// ----------------------------------------------------------------------------------------------------
// WebGL2
// ----------------------------------------------------------------------------------------------------

const FS = `#version 300 es
#pragma DEFS
precision highp float;
precision highp int;
uniform sampler2D uTH;
uniform sampler2D uTP;
uniform vec4 uHT[5];
uniform vec4 uPT[5];
uniform float uDiv[5];
uniform vec3 uHO;
uniform vec3 uPO;
uniform vec4 uPhone;
uniform vec4 uScreen;
uniform vec4 uPR;      // Radius Handy, Radius Bildschirm, bottomY, Zeigerlicht 0..1
uniform vec4 uLight;   // Zeigerlicht (Ende-Raum) x, y
uniform vec4 uTipU;    // Spitze x, y, Armrichtung x, y
uniform vec4 uPS;      // Maßstab der Zeigehand, Deckkraft, 0, 0
uniform vec4 uRing;    // Radius, Deckkraft, aktiv, Druck der Zeigehand 0..1
uniform vec4 uBr;      // Atmen: x, y (Bühnen-px), Winkel (rad), 0
uniform vec4 uQ[2];    // ruhige Rechtecke (Titel, Knopf) im Ende-Raum
uniform vec3 uCam;     // f, ox, oy
uniform vec3 uBack;    // Backing je CSS-px x, y, Backing-Höhe
uniform int uFront;
uniform sampler2D uTone;
uniform ivec2 uCell0;
uniform ivec2 uCellN;
out vec4 o;

float cl(float x){ return clamp(x, 0., 1.); }
float ss(float x){ x = cl(x); return x * x * (3. - 2. * x); }
float hsh(ivec2 c){
  uint h = uint(c.x) * 374761393u + uint(c.y) * 668265263u;
  h = (h ^ (h >> 13)) * 1274126177u;
  return float(h ^ (h >> 16)) / 4294967295.0;
}
float sdfRR(vec2 p, vec4 R, float r){
  vec2 q = abs(p - (R.xy + R.zw * .5)) - (R.zw * .5 - r);
  return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
}
float samp(sampler2D tx, vec4 T, float dv, vec3 O, vec2 X){
  vec2 t = (X - O.xy) * (O.z / dv);
  if (t.x < 0. || t.y < 0. || t.x > T.z || t.y > T.w) return 0.;
  t = clamp(t, vec2(.5), T.zw - .5);
  return textureLod(tx, (T.xy + t) / vec2(textureSize(tx, 0)), 0.).r;
}
float lightF(vec2 p){ return .45 + .55 * cl(1. - ((p.x - 450.) + (p.y - 120.)) / 1100.); }
#define SH(i, X) samp(uTH, uHT[i], uDiv[i], uHO, X)
#define SP(i, X) samp(uTP, uPT[i], uDiv[i], uPO, X)

// Haltehand: x = Ton, y = Ebene (0 keine, 1 hinten, 2 vorn)
float dil(sampler2D tx, vec4 T, float dv, vec3 O, vec2 C, float e){
  return max(max(samp(tx, T, dv, O, C), samp(tx, T, dv, O, C + vec2(e, 0.))), max(max(samp(tx, T, dv, O, C - vec2(e, 0.)), samp(tx, T, dv, O, C + vec2(0., e))), samp(tx, T, dv, O, C - vec2(0., e))));
}
vec2 holdTone(vec2 C){
  // Alpha leicht gedehnt: die Zelle liefert Ton bis über die Kante, die exakte Silhouette schneidet Pass 2 je Pixel
  float al = dil(uTH, uHT[1], uDiv[1], uHO, C, 1.5);
  if (al < .04) return vec2(0.);
  float zmm = SH(4, C) * 200. - 100.;
  float sdf = sdfRR(C, uPhone, uPR.x);
  // Finger rechts legen sich 4 bis 8 px über die Gehäusekante: vorn, mit weichem Kontaktschatten am Gehäuse
  bool fing = C.x > 800. && sdf < 4.;
  bool front = (sdf < 4. && zmm < 1.5) || fing;
  float L = SH(0, C);
  L = cl(.5 + (pow(L, ${GAM.toFixed(2)}) - .5) * ${CON.toFixed(2)});
  float nx = SH(2, C) * 2. - 1.;
  float ny = SH(3, C) * 2. - 1.;
  float nz = sqrt(max(0., 1. - nx * nx - ny * ny));
  float lf = lightF(C);
  float v = L * (.62 + .5 * lf);
  if (fing) v *= .5 + .5 * ss((sdf + 9.) / 11.);
  v += ${RIM.toFixed(2)} * max(0., nx * .85 + ny * .05 + nz * .15) * (.5 + .5 * L);
  if (uPR.w > 0.) {
    vec3 l = vec3(uLight.x - C.x, -(uLight.y - C.y), 170. + zmm * (300. / 71.6));
    float d = length(l);
    float dn = max(0., (nx * l.x + ny * l.y + nz * l.z) / d);
    float fo = 1. / (1. + pow(d / 300., 2.));
    float lt = (.85 * dn * fo + pow(dn, 18.) * fo * .9) * (.35 + .65 * L) * 1.15;
    v = mix(v, v * .78 + lt, uPR.w);
  }
  float e = ${EDW.toFixed(1)};
  float eA = min(min(SH(1, C - vec2(e, 0.)), SH(1, C + vec2(e, 0.))), min(SH(1, C - vec2(0., e)), SH(1, C + vec2(0., e))));
  bool edge = eA < .5 && abs(sdf) >= 7. && !fing;
  float cov = ss((al - .02) / .25) * ss((uPR.z - C.y) / 140.);
  float sdS = sdfRR(C, uScreen, uPR.y);
  // Finger bleiben auf Gehäuse und Rand, nie auf dem Glas
  if (fing && sdS < -1.) return vec2(0.);
  // weicher Übergang statt harter Kante am Glasrand: Ton und Tinte gehen über 18 px ineinander über
  float gk = front ? ss(-sdS / 10.) : 0.;
  float vo = v;
  if (edge) vo = max(vo, ${EDV.toFixed(1)} * lf * al);
  float tone = vo * cov;
  if (gk > 0.) {
    float tn = .04 + .86 * pow(cl(v), 1.35);
    float vd = pow(1. - tn, .45);
    if (edge) vd = max(vd, .95);
    // auf dem Glas nur ein schmaler Streifen am Rand: Tab-Leiste und Inhalt bleiben frei
    float ti = vd * cov * (1. - ss((-sdS - ${(RAND_IN - 4).toFixed(1)}) / 7.));
    tone = mix(tone, ti, gk);
  }
  return vec2(tone, front ? 2. : 1.);
}

// Zeigehand (Sprite), immer vorn
vec2 pointTone(vec2 C, bool full){
  if (uPS.y <= 0.) return vec2(0.);
  vec2 d = C - uTipU.xy;
  float dist = length(d);
  float gk = ss(-sdfRR(C, uScreen, uPR.y) / 24.);
  // auf dem Glas bleibt die Hand bis zum Handgelenk deckend, der Arm läuft danach schneller aus
  float fade = mix(cl(1. - (dist - 300.) / 420.), cl(1. - (dist - 300.) / 140.), gk);
  if (fade <= 0.) return vec2(0.);
  vec2 u = uTipU.zw;
  vec2 ab = vec2(dot(d, u), -d.x * u.y + d.y * u.x) / uPS.x;
  float al = dil(uTP, uPT[1], uDiv[1], uPO, ab, 1.5 / uPS.x);
  if (al < .04) return vec2(0.);
  float cov = ss((al - .02) / .25) * fade * uPS.y;
  if (!full) return vec2(0., cov);
  float L = SP(0, ab);
  L = cl(.5 + (pow(L, ${GAM.toFixed(2)}) - .5) * ${CON.toFixed(2)});
  float lf = lightF(C);
  float v = L * (.62 + .5 * lf);
  float e = ${EDW.toFixed(1)} / uPS.x;
  float eA = min(min(SP(1, ab - vec2(e, 0.)), SP(1, ab + vec2(e, 0.))), min(SP(1, ab - vec2(0., e)), SP(1, ab + vec2(0., e))));
  // keine Kontur: die Hand ist reine Fläche aus Ton, am Rand nur die weiche Silhouette
  float vo = v;
  float tn = .04 + .86 * pow(cl(v), 1.35);
  float vd = pow(1. - tn, .7);
  return vec2(mix(vo, vd, gk) * cov, cov);
}

float quiet(vec2 C){
  float q = 1.;
  for (int k = 0; k < 2; k++) {
    vec4 R = uQ[k];
    if (R.z > 0.) {
      vec2 d = abs(C - (R.xy + R.zw * .5)) - R.zw * .5;
      float sd = length(max(d, 0.)) + min(max(d.x, d.y), 0.);
      q = min(q, ss(sd / 56.));
    }
  }
  return q;
}

#ifdef PASS1
// Pass 1: ein Texel je Zelle des Rasters (Ton nach Zeigerlicht, Verdeckung und Ruhe)
void main(){
  ivec2 cell = uCell0 + ivec2(gl_FragCoord.xy);
  vec2 C = (vec2(cell) + .5) * ${STEP.toFixed(2)};
  float tone = 0.;
  vec2 h = holdTone(C);
  vec2 pt = pointTone(C, uFront == 1);
  float own = 1. - ss((pt.y - .2) / .5);
  if (uFront == 0) { if (h.y == 1.) tone = h.x * own; }
  else { if (h.y == 2.) tone = h.x * own; tone = max(tone, pt.x); }
  o = vec4(clamp(tone * quiet(C), 0., 1.), 0., 0., 1.);
}
#else
// Zeigehand: weich geglättete Silhouette (5 Abtastungen), mit Ausblenden zum Arm hin und Deckkraft
vec2 pSprite(vec2 S){
  vec2 d = S - uTipU.xy;
  vec2 u = uTipU.zw;
  return vec2(dot(d, u), -d.x * u.y + d.y * u.x) / uPS.x;
}
float pointSil(vec2 S){
  if (uPS.y <= 0.) return 0.;
  float dist = length(S - uTipU.xy);
  float gk = ss(-sdfRR(S, uScreen, uPR.y) / 24.);
  float fade = mix(cl(1. - (dist - 300.) / 420.), cl(1. - (dist - 300.) / 140.), gk);
  if (fade <= 0.) return 0.;
  vec2 ab = pSprite(S);
  float r = 1.1 / uPS.x;
  float a = (2. * SP(1, ab) + SP(1, ab + vec2(r, 0.)) + SP(1, ab - vec2(r, 0.)) + SP(1, ab + vec2(0., r)) + SP(1, ab - vec2(0., r))) / 6.;
  return clamp((a - .5) / .18 + .5, 0., 1.) * fade * uPS.y;
}
// Pixel-Alpha der Hände (Haltehand und, vorn, Zeigehand) für die weiche Silhouette
float pixA(vec2 S){
  float a = SH(1, S);
  if (uFront == 1 && uPS.y > 0.) a = max(a, SP(1, pSprite(S)));
  return a;
}
// Pass 2: Punkte je Zelle (Bayer, Hash-Zufall), scharf auf Gerätepixel, Silhouette per Pixel-Alpha geglättet.
// Vorn (Zeigehand) zusätzlich: deckende Grundfläche in der Silhouette und ein weicher Schatten aufs Glas.
void main(){
  vec2 css = vec2(gl_FragCoord.x / uBack.x, (uBack.z - gl_FragCoord.y) / uBack.y);
  vec2 S = (css - uCam.yz) / uCam.x;
  // Atmen: Handy und Hände bewegen sich gemeinsam, hier die Umkehrung in den Objektraum
  {
    vec2 pv = vec2(800., 400.);
    vec2 q = S - uBr.xy - pv;
    float cs = cos(uBr.z);
    float sn = sin(uBr.z);
    S = pv + vec2(cs * q.x + sn * q.y, -sn * q.x + cs * q.y);
  }
  ivec2 cell = ivec2(floor(S / ${STEP.toFixed(2)}));
  vec2 C = (vec2(cell) + .5) * ${STEP.toFixed(2)};
  float px = 1. / (uCam.x * uBack.x);
  ivec2 tc = cell - uCell0;
  float tone = 0.;
  if (tc.x >= 0 && tc.y >= 0 && tc.x < uCellN.x && tc.y < uCellN.y) tone = texelFetch(uTone, tc, 0).r;
  float gk = uFront == 1 ? ss(-sdfRR(S, uScreen, uPR.y) / 24.) : 0.;
  float ink = mix(${INK}, ${INK_DARK}, gk);
  bool pt = uFront == 1 && uPS.y > 0.;
  if (tone <= 0. && uRing.z <= 0. && !pt) { o = vec4(0.); return; }
  tone *= (1. - ${(JIT / 2).toFixed(3)}) + ${JIT.toFixed(2)} * hsh(cell);
  int bx = cell.x & 3;
  int by = cell.y & 3;
  float thr = float((by & 1) * 12 + (by >> 1) * 3 + (1 - 2 * (by & 1)) * 8 * (bx & 1) + (1 - 2 * (by >> 1)) * 2 * (bx >> 1)) / 16. + .035;
  float c = 0.;
  if (tone > thr || tone > .8) {
    // Punkte berühren sich nie (Kante höchstens 0,92 Zellen); im Glanzlicht (ab .8) kippt das Raster zu dunklen Löchern in heller Fläche
    float z = min(${STEP.toFixed(2)} * (.5 + .5 * min(1., tone)), ${STEP.toFixed(2)} * .92);
    vec2 dd = abs(S - C);
    c = clamp((z * .5 - max(dd.x, dd.y)) / px + .5, 0., 1.);
    if (tone > .8) {
      float hh = ${STEP.toFixed(2)} * .436 * (1. - clamp((tone - .8) / .2, 0., 1.));
      c = 1. - clamp((hh - max(dd.x, dd.y)) / px + .5, 0., 1.) * step(.001, hh);
    }
    float a = pixA(S);
    float w = max(fwidth(a), .02);
    c *= clamp((a - .5) / w + .5, 0., 1.);
  }
  if (uFront == 1 && uRing.z > 0.) {
    vec2 dr = S - uLight.zw;
    float step_ = 6.2831853 / ${RING_N}.;
    float a2 = floor(atan(dr.y, dr.x) / step_ + .5) * step_;
    vec2 pp = uLight.zw + uRing.x * vec2(cos(a2), sin(a2));
    vec2 d2 = abs(S - pp);
    c = max(c, clamp((.7 - max(d2.x, d2.y)) / px + .5, 0., 1.) * uRing.y * quiet(S));
  }
  float base = 0.;
  float sh = 0.;
  if (pt && gk > 0.) {
    base = pointSil(S) * gk;
    // weicher Schatten der Zeigehand aufs Glas: je näher der Finger (Druck), desto enger und dunkler
    vec2 off = vec2(7., 11.) * (1. - .55 * uRing.w);
    float s0 = pointSil(S - off) + pointSil(S - off + vec2(7., 0.)) + pointSil(S - off - vec2(7., 0.)) + pointSil(S - off + vec2(0., 7.)) + pointSil(S - off - vec2(0., 7.));
    sh = s0 / 5. * gk * (.15 + .1 * uRing.w);
  }
  float aOut = c + base * (1. - c);
  vec3 col = vec3(ink * c + .76 * base * (1. - c));
  float sa = sh * (1. - aOut);
  o = vec4(col, aOut + sa);
}
#endif
`;

const fsSrc = (pass1) => FS.replace('#pragma DEFS', pass1 ? '#define PASS1' : '');

const VS = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2. - 1., 0., 1.);
}`;

function compile(gl, type, src) {
	const s = gl.createShader(type);
	gl.shaderSource(s, src);
	gl.compileShader(s);
	return s;
}

/** Prüft einmalig, ob WebGL2 mit dem Shader und den Texturgrößen taugt. */
function glTaugt(metaH, metaP) {
	const cv = document.createElement('canvas');
	const gl = cv.getContext('webgl2');
	if (!gl) return false;
	let ok = true;
	const need = Math.max(...metaH.atlas, ...metaP.atlas);
	if (gl.getParameter(gl.MAX_TEXTURE_SIZE) < need) ok = false;
	if (ok) {
		for (const p1 of [true, false]) {
			const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc(p1));
			const vs = compile(gl, gl.VERTEX_SHADER, VS);
			const p = gl.createProgram();
			gl.attachShader(p, vs);
			gl.attachShader(p, fs);
			gl.linkProgram(p);
			if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
				ok = false;
				console.warn('hand: Shader nicht verwendbar', gl.getShaderInfoLog(fs));
			}
		}
	}
	if (ok && !glSichtbar(gl, cv)) {
		ok = false;
		console.warn('hand: WebGL-Ausgabe bleibt leer, 2D-Hand');
	}
	gl.getExtension('WEBGL_lose_context')?.loseContext();
	return ok;
}

const tileArray = (meta) => {
	const a = new Float32Array(20);
	TILES.forEach((n, i) => {
		const t = meta.tiles[n];
		a.set([t.x, t.y, t.w, t.h], i * 4);
	});
	return a;
};
const divArray = (meta) => new Float32Array(TILES.map((n) => meta.tiles[n].div));

function makeLayer(cv, front) {
	const gl = cv.getContext('webgl2', {
		alpha: true,
		premultipliedAlpha: true,
		antialias: false,
		depth: false,
		stencil: false,
		powerPreference: 'high-performance',
	});
	if (!gl) return null;
	const L = { cv, gl, front, ready: false, dead: false, stage: 0, last: null };
	const build = () => {
		L.dead = false;
		L.ready = false;
		L.stage = 0;
		L.last = null;
		L.prs = [true, false].map((p1) => {
			const pr = gl.createProgram();
			gl.attachShader(pr, compile(gl, gl.VERTEX_SHADER, VS));
			gl.attachShader(pr, compile(gl, gl.FRAGMENT_SHADER, fsSrc(p1)));
			gl.linkProgram(pr);
			return pr;
		});
		L.cells = { w: 0, h: 0, tex: null, fbo: null };
		L.ext = gl.getExtension('KHR_parallel_shader_compile');
		L.u = [{}, {}];
		L.vao = gl.createVertexArray();
	};
	build();
	cv.addEventListener('webglcontextlost', (e) => {
		e.preventDefault();
		L.dead = true;
	});
	cv.addEventListener('webglcontextrestored', build);
	return L;
}

function uploadTex(gl, unit, bmp) {
	const tx = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + unit);
	gl.bindTexture(gl.TEXTURE_2D, tx);
	gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, bmp.width, bmp.height, 0, gl.RED, gl.UNSIGNED_BYTE, bmp);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return tx;
}

const UNIFORMS = [
	'uTH', 'uTP', 'uHT', 'uPT', 'uDiv', 'uHO', 'uPO', 'uPhone', 'uScreen', 'uPR', 'uLight', 'uTipU', 'uPS', 'uRing', 'uBr',
	'uQ', 'uCam', 'uBack', 'uFront', 'uTone', 'uCell0', 'uCellN',
];

/** Gemeinsame Uniforms eines Programms setzen (Programm muss aktiv sein). */
function setUniforms(L, u, S, cam, W, w, h, cells) {
	const { gl } = L;
	const mh = A.hold.meta;
	gl.uniform4f(u.uPR, mh.phone.r, mh.screen.r, S.bottomY, S.lightPow);
	gl.uniform4f(u.uLight, S.light.x, S.light.y, S.ringAt.x, S.ringAt.y);
	gl.uniform4f(u.uTipU, S.tip.x, S.tip.y, S.u.x, S.u.y);
	gl.uniform4f(u.uPS, S.sc, S.pa, 0, 0);
	gl.uniform4f(u.uRing, S.ring > 0 ? S.ringR : 0, S.ring, S.ring > 0 ? 1 : 0, S.push);
	gl.uniform4f(u.uBr, S.br.x, S.br.y, S.br.r, 0);
	gl.uniform4fv(u.uQ, S.q);
	gl.uniform3f(u.uCam, cam.f, cam.ox, cam.oy);
	gl.uniform3f(u.uBack, w / W, h / (cells.H ?? 1), h);
	gl.uniform2i(u.uCell0, cells.i0, cells.j0);
	gl.uniform2i(u.uCellN, cells.cw, cells.ch);
}

function initProgram(L, k) {
	const { gl } = L;
	const pr = L.prs[k];
	const u = L.u[k];
	gl.useProgram(pr);
	for (const n of UNIFORMS) u[n] = gl.getUniformLocation(pr, n);
	const mh = A.hold.meta;
	const mp = A.point.meta;
	gl.uniform1i(u.uTH, 0);
	gl.uniform1i(u.uTP, 1);
	gl.uniform1i(u.uTone, 2);
	gl.uniform4fv(u.uHT, tileArray(mh));
	gl.uniform4fv(u.uPT, tileArray(mp));
	gl.uniform1fv(u.uDiv, divArray(mh));
	gl.uniform3f(u.uHO, mh.origin[0], mh.origin[1], mh.scale);
	gl.uniform3f(u.uPO, mp.origin[0], mp.origin[1], mp.scale);
	gl.uniform4f(u.uPhone, mh.phone.x, mh.phone.y, mh.phone.w, mh.phone.h);
	gl.uniform4f(u.uScreen, mh.screen.x, mh.screen.y, mh.screen.w, mh.screen.h);
	gl.uniform1i(u.uFront, L.front ? 1 : 0);
}

/** Umschließendes Rechteck beider Hände im Ende-Raum: [x0, y0, x1, y1]. */
function handBox(S) {
	const mh = A.hold.meta;
	const mp = A.point.meta;
	const hb = [mh.origin[0], mh.origin[1], mh.origin[0] + mh.tile[0] / mh.scale, mh.origin[1] + mh.tile[1] / mh.scale];
	const a0 = mp.origin[0];
	const b0 = mp.origin[1];
	const a1 = a0 + mp.tile[0] / mp.scale;
	const b1 = b0 + mp.tile[1] / mp.scale;
	let bx0 = 1e9;
	let by0 = 1e9;
	let bx1 = -1e9;
	let by1 = -1e9;
	for (const [a, b] of [[a0, b0], [a1, b0], [a0, b1], [a1, b1]]) {
		const x = S.tip.x + (S.u.x * a - S.u.y * b) * S.sc;
		const y = S.tip.y + (S.u.y * a + S.u.x * b) * S.sc;
		bx0 = Math.min(bx0, x);
		by0 = Math.min(by0, y);
		bx1 = Math.max(bx1, x);
		by1 = Math.max(by1, y);
	}
	return [Math.min(hb[0], bx0), Math.min(hb[1], by0), Math.max(hb[2], bx1), Math.max(hb[3], by1)];
}

/** Ein Schritt je Bild bis die Ebene bereit ist (Shader gelinkt, Texturen hochgeladen). true, wenn bereit. */
function readyStep(L) {
	const { gl } = L;
	if (L.dead || gl.isContextLost()) return false;
	if (!L.ready) {
		if (L.ext && L.prs.some((p) => !gl.getProgramParameter(p, L.ext.COMPLETION_STATUS_KHR))) return false;
		if (L.stage === 0) {
			if (L.prs.some((p) => !gl.getProgramParameter(p, gl.LINK_STATUS))) {
				L.dead = true;
				return false;
			}
			L.stage = 1;
			L.th = uploadTex(gl, 0, A.hold.bmp);
			return false;
		}
		if (L.stage === 1) {
			L.tp = uploadTex(gl, 1, A.point.bmp);
			L.stage = 2;
			return false;
		}
		initProgram(L, 0);
		initProgram(L, 1);
		L.cells.tex = gl.createTexture();
		L.cells.fbo = gl.createFramebuffer();
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, L.cells.tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindVertexArray(L.vao);
		gl.disable(gl.BLEND);
		L.ready = true;
	}
	return true;
}

/** Zeichnet eine Ebene in zwei Durchgängen (Ton je Zelle, dann Punkte). false, solange sie nicht bereit ist. */
function glFrame(L, S, cam, W, H) {
	const { gl, cv } = L;
	if (!readyStep(L)) return false;
	const w = cv.width;
	const h = cv.height;
	const key = [
		w, h, cam.f, cam.ox, cam.oy, S.light.x, S.light.y, S.ringAt.x, S.ringAt.y, S.lightPow, S.bottomY, S.tip.x, S.tip.y, S.u.x, S.u.y, S.sc, S.ring,
		S.q[0], S.q[1], S.q[2], S.q[3], S.q[4], S.q[5], S.q[6], S.q[7], S.pa, S.push,
	];
	const bkey = [S.br.x, S.br.y, S.br.r];
	const same = L.last && L.last.length === key.length && L.last.every((v, i) => v === key[i]);
	// Atmen ändert nur Durchgang 2 (Punkte), der Ton je Zelle bleibt
	const nur2 = same && L.lastB && !L.lastB.every((v, i) => v === bkey[i]);
	if (same && L.lastB && !nur2) return true;
	L.last = key;
	L.lastB = bkey;

	// sichtbares Raster im Ende-Raum
	const i0 = Math.floor(-cam.ox / cam.f / STEP);
	const j0 = Math.floor(-cam.oy / cam.f / STEP);
	const cw = Math.floor((W - cam.ox) / cam.f / STEP) - i0 + 1;
	const ch = Math.floor((H - cam.oy) / cam.f / STEP) - j0 + 1;
	const cells = { i0, j0, cw, ch, H };
	const C = L.cells;
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, C.tex);
	if (C.w !== cw || C.h !== ch) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cw, ch, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, C.fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, C.tex, 0);
		C.w = cw;
		C.h = ch;
	}

	// Messhaken (nur QA): GPU-Zeit je Ebene über EXT_disjoint_timer_query_webgl2
	const T = qa.gpuT && (L.tq ||= gl.getExtension('EXT_disjoint_timer_query_webgl2'));
	let q = null;
	if (T) {
		L.pend ||= [];
		L.gpuMs ||= [];
		while (L.pend.length && gl.getQueryParameter(L.pend[0], gl.QUERY_RESULT_AVAILABLE)) {
			const p = L.pend.shift();
			if (!gl.getParameter(T.GPU_DISJOINT_EXT)) L.gpuMs.push(gl.getQueryParameter(p, gl.QUERY_RESULT) / 1e6);
		}
		q = gl.createQuery();
		gl.beginQuery(T.TIME_ELAPSED_EXT, q);
	}
	// Durchgang 1: Ton je Zelle in die Textur
	if (!nur2) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, C.fbo);
		gl.viewport(0, 0, cw, ch);
		gl.useProgram(L.prs[0]);
		setUniforms(L, L.u[0], S, cam, W, w, h, cells);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
	// Durchgang 2: Punkte auf die Leinwand
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, w, h);
	gl.useProgram(L.prs[1]);
	setUniforms(L, L.u[1], S, cam, W, w, h, cells);
	// nur dort rastern, wo eine Hand liegen kann (Haltehand-Kachel und Sprite der Zeigehand), Rest bleibt leer
	const bb = handBox(S);
	const k = w / W;
	const x0 = Math.max(0, Math.floor((bb[0] * cam.f + cam.ox) * k));
	const x1 = Math.min(w, Math.ceil((bb[2] * cam.f + cam.ox) * k));
	const y0 = Math.max(0, Math.floor(h - (bb[3] * cam.f + cam.oy) * k));
	const y1 = Math.min(h, Math.ceil(h - (bb[1] * cam.f + cam.oy) * k));
	gl.disable(gl.SCISSOR_TEST);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	if (x1 > x0 && y1 > y0) {
		gl.enable(gl.SCISSOR_TEST);
		gl.scissor(x0, y0, x1 - x0, y1 - y0);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.disable(gl.SCISSOR_TEST);
	}
	if (q && T) {
		gl.endQuery(T.TIME_ELAPSED_EXT);
		L.pend.push(q);
	}
	return true;
}

// ----------------------------------------------------------------------------------------------------
// Fallback ohne WebGL2: Halbton einmal vorberechnen (2D)
// ----------------------------------------------------------------------------------------------------

const lightF = (x, y) => 0.45 + 0.55 * cl(1 - (x - 450 + (y - 120)) / 1100);
const sdfRR = (x, y, R, r) => {
	const qx = Math.abs(x - (R.x + R.w / 2)) - (R.w / 2 - r);
	const qy = Math.abs(y - (R.y + R.h / 2)) - (R.h / 2 - r);
	return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};

function cpuAtlas(at) {
	if (at.cpu) return at.cpu;
	const { bmp, meta } = at;
	const cv = document.createElement('canvas');
	cv.width = bmp.width;
	cv.height = bmp.height;
	const g = cv.getContext('2d', { willReadFrequently: true });
	g.drawImage(bmp, 0, 0);
	const D = g.getImageData(0, 0, cv.width, cv.height).data;
	const T = {};
	for (const n of TILES) {
		const t = meta.tiles[n];
		const a = new Uint8Array(t.w * t.h);
		for (let j = 0; j < t.h; j++)
			for (let i = 0; i < t.w; i++) a[j * t.w + i] = D[((t.y + j) * cv.width + t.x + i) * 4];
		T[n] = { a, w: t.w, h: t.h, div: t.div };
	}
	const [X0, Y0] = meta.origin;
	const S = meta.scale;
	const samp = (t, X, Y) => {
		const u = ((X - X0) * S) / t.div - 0.5;
		const v = ((Y - Y0) * S) / t.div - 0.5;
		const i = Math.floor(u);
		const j = Math.floor(v);
		const fu = u - i;
		const fv = v - j;
		const q = (ii, jj) => (ii < 0 || jj < 0 || ii >= t.w || jj >= t.h ? 0 : t.a[jj * t.w + ii]);
		return (
			((q(i, j) * (1 - fu) + q(i + 1, j) * fu) * (1 - fv) + (q(i, j + 1) * (1 - fu) + q(i + 1, j + 1) * fu) * fv) / 255
		);
	};
	at.cpu = { T, samp };
	return at.cpu;
}

const gradeL = (L) => cl(0.5 + (L ** GAM - 0.5) * CON);

/** Haltehand an der Stelle (x, y) ohne Zeigerlicht: [Ton, Ebene] (Ebene 1 hinten, 2 vorn) oder null. */
let cpuBottom = 1400;
function holdCpu(x, y) {
	const { T, samp } = cpuAtlas(A.hold);
	const m = A.hold.meta;
	const al = samp(T.a, x, y);
	if (al < 0.5) return null;
	const zmm = samp(T.z, x, y) * 200 - 100;
	const sdf = sdfRR(x, y, m.phone, m.phone.r);
	const front = sdf < 4 && zmm < 1.5;
	const L = gradeL(samp(T.lum, x, y));
	const nx = samp(T.nx, x, y) * 2 - 1;
	const ny = samp(T.ny, x, y) * 2 - 1;
	const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
	const lf = lightF(x, y);
	let v = L * (0.62 + 0.5 * lf);
	v += RIM * Math.max(0, nx * 0.85 + ny * 0.05 + nz * 0.15) * (0.5 + 0.5 * L);
	const eA = Math.min(samp(T.a, x - EDW, y), samp(T.a, x + EDW, y), samp(T.a, x, y - EDW), samp(T.a, x, y + EDW));
	const edge = eA < 0.5 && Math.abs(sdf) >= 7;
	const cov = ss((al - 0.02) / 0.25) * ss((cpuBottom - y) / 90);
	const sdS = sdfRR(x, y, m.screen, m.screen.r);
	if (front && sdS < -1) {
		const tn = 0.04 + 0.86 * cl(v) ** 1.35;
		let vd = (1 - tn) ** 0.45;
		if (edge) vd = Math.max(vd, 0.95);
		return [vd * cov * (1 - ss((-sdS - (RAND_IN - 4)) / 7)), 2];
	}
	if (edge) v = Math.max(v, EDV * lf * al);
	return [v * cov, front ? 2 : 1];
}

/** Zeigehand im Sprite-Raum: [Ton normal, Ton als Tinte über dem Bildschirm] */
function pointCpu(a, b, ps, lf) {
	const { T, samp } = cpuAtlas(A.point);
	const al = samp(T.a, a, b);
	if (al < 0.5) return null;
	const dist = Math.hypot(a, b) * ps;
	const fade = cl(1 - (dist - 300) / 420);
	const fadeIn = cl(1 - (dist - 150) / 230);
	if (fade <= 0) return null;
	const L = gradeL(samp(T.lum, a, b));
	const v = L * (0.62 + 0.5 * lf);
	const e = EDW / ps;
	const edge = Math.min(samp(T.a, a - e, b), samp(T.a, a + e, b), samp(T.a, a, b - e), samp(T.a, a, b + e)) < 0.5;
	const cov = ss((al - 0.02) / 0.25);
	const tn = 0.04 + 0.86 * cl(v) ** 1.35;
	let vd = (1 - tn) ** 0.45;
	if (edge) vd = Math.max(vd, 0.95);
	return [Math.max(v, edge ? EDV * lf * al : 0) * cov * fade, vd * cov * fadeIn];
}

function dotRect(cx, x, y, v, i, j, k = 1) {
	v *= 1 - JIT / 2 + JIT * hsh(i, j);
	if (v > HB[(j & 3) * 4 + (i & 3)] / 16 + 0.035) {
		const z = (STEP * (0.5 + 0.5 * Math.min(1, v))) * k;
		cx.fillRect(x - z / 2, y - z / 2, z, z);
	}
}

const mkCanvas = (w, h) => {
	const cv = document.createElement('canvas');
	cv.width = w;
	cv.height = h;
	return cv;
};

function rrPath(g, R, r) {
	g.moveTo(R.x + r, R.y);
	g.arcTo(R.x + R.w, R.y, R.x + R.w, R.y + R.h, r);
	g.arcTo(R.x + R.w, R.y + R.h, R.x, R.y + R.h, r);
	g.arcTo(R.x, R.y + R.h, R.x, R.y, r);
	g.arcTo(R.x, R.y, R.x + R.w, R.y, r);
	g.closePath();
}

/** Fallback: Haltehand und Zeige-Sprite für diese Größe vorrechnen. */
function bakeCpu(st, W, H, dpr, cam) {
	cpuBottom = Math.min(A.hold.meta.bottomY, (H - cam.oy) / cam.f + 10);
	const m = cam.f * dpr;
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	const f = st.cpu;
	f.key = [w, h, cam.f, cam.ox, cam.oy].join();
	f.held = mkCanvas(w, h);
	const cb = st.back.getContext('2d');
	const cf = f.held.getContext('2d');
	for (const cx of [cb, cf]) {
		cx.setTransform(1, 0, 0, 1, 0, 0);
		cx.clearRect(0, 0, w, h);
		cx.setTransform(dpr * cam.f, 0, 0, dpr * cam.f, dpr * cam.ox, dpr * cam.oy);
		cx.fillStyle = '#FAFAFA';
	}
	const mh = A.hold.meta;
	const x1 = (W - cam.ox) / cam.f;
	const y1 = (H - cam.oy) / cam.f;
	const xa = mh.origin[0];
	const xb = mh.origin[0] + mh.tile[0] / mh.scale;
	const ya = mh.origin[1];
	const yb = Math.min(y1, mh.origin[1] + mh.tile[1] / mh.scale);
	const i0 = Math.max(Math.floor(xa / STEP), Math.floor(-cam.ox / cam.f / STEP));
	const j0 = Math.max(Math.floor(ya / STEP), Math.floor(-cam.oy / cam.f / STEP));
	for (let j = j0; (j + 0.5) * STEP < yb; j++)
		for (let i = i0; (i + 0.5) * STEP < Math.min(xb, x1); i++) {
			const x = (i + 0.5) * STEP;
			const y = (j + 0.5) * STEP;
			const r = holdCpu(x, y);
			if (r && r[0] > 0.02) {
				const vorn = r[1] === 2;
				if (vorn) cf.fillStyle = sdfRR(x, y, mh.screen, mh.screen.r) < -1 ? '#0A0A0A' : '#FAFAFA';
				dotRect(vorn ? cf : cb, x, y, r[0], i, j);
			}
		}
	// Zeige-Sprite (Maßstab PS, Licht an einer festen Stelle)
	const mp = A.point.meta;
	const sw = Math.ceil((mp.tile[0] / mp.scale) * PS * m);
	const sh = Math.ceil((mp.tile[1] / mp.scale) * PS * m);
	f.sp = [mkCanvas(sw, sh), mkCanvas(sw, sh)];
	const lf = lightF(840, 420);
	const cs = f.sp.map((cv, k) => {
		const g = cv.getContext('2d');
		g.fillStyle = k ? '#0A0A0A' : '#FAFAFA';
		return g;
	});
	const st2 = STEP / PS;
	for (let j = 0; j * st2 < mp.tile[1] / mp.scale; j++)
		for (let i = 0; i * st2 < mp.tile[0] / mp.scale; i++) {
			const a = mp.origin[0] + (i + 0.5) * st2;
			const b = mp.origin[1] + (j + 0.5) * st2;
			const r = pointCpu(a, b, PS, lf);
			if (!r) continue;
			for (let k = 0; k < 2; k++)
				if (r[k] > 0.02) {
					const g = cs[k];
					const v = r[k] * (1 - JIT / 2 + JIT * hsh(i, j));
					if (v > HB[(j & 3) * 4 + (i & 3)] / 16 + 0.035) {
						const z = STEP * (0.5 + 0.5 * Math.min(1, v)) * m;
						g.fillRect((i + 0.5) * st2 * PS * m - z / 2, (j + 0.5) * st2 * PS * m - z / 2, z, z);
					}
				}
		}
}

function cpuFrame(st, S, cam, W, H, dpr) {
	const f = st.cpu;
	const key = [Math.max(1, Math.round(W * dpr)), Math.max(1, Math.round(H * dpr)), cam.f, cam.ox, cam.oy].join();
	if (f.key !== key) bakeCpu(st, W, H, dpr, cam);
	const mh = A.hold.meta;
	const mp = A.point.meta;
	const cf = st.front.getContext('2d');
	const w = st.front.width;
	const h = st.front.height;
	cf.setTransform(1, 0, 0, 1, 0, 0);
	cf.clearRect(0, 0, w, h);
	cf.drawImage(f.held, 0, 0);
	const base = [dpr * cam.f, 0, 0, dpr * cam.f, dpr * cam.ox, dpr * cam.oy];
	if (S.pa > 0) {
		const m = cam.f * dpr;
		const th = Math.atan2(S.u.y, S.u.x);
		for (let k = 0; k < 2; k++) {
			cf.save();
			cf.setTransform(...base);
			cf.beginPath();
			if (k === 0) cf.rect(-4000, -4000, 9000, 9000);
			rrPath(cf, mh.screen, mh.screen.r);
			cf.clip(k === 0 ? 'evenodd' : 'nonzero');
			cf.translate(S.tip.x, S.tip.y);
			cf.rotate(th);
			cf.scale(S.sc / PS, S.sc / PS);
			cf.drawImage(f.sp[k], mp.origin[0] * PS, mp.origin[1] * PS, f.sp[k].width / m, f.sp[k].height / m);
			cf.restore();
		}
	}
	if (S.ring > 0) {
		cf.setTransform(...base);
		cf.fillStyle = '#FAFAFA';
		cf.globalAlpha = S.ring;
		const rr = S.ringR;
		for (let k = 0; k < RING_N; k++) {
			const an = (k / RING_N) * 6.2832;
			cf.fillRect(S.ringAt.x + Math.cos(an) * rr - 1, S.ringAt.y + Math.sin(an) * rr - 1, 2, 2);
		}
		cf.globalAlpha = 1;
	}
}

// ----------------------------------------------------------------------------------------------------
// Zustand: Zeiger, Autopilot, Touch
// ----------------------------------------------------------------------------------------------------

const states = new WeakMap();

/** Leises Atmen (Sinus plus langsames Rauschen): x, y in Bühnen-px, r in rad. Perioden 4 bis 6 s. */
function atem(t) {
	const w = 1.2; // 5,2 s
	const x = 0.65 * Math.sin(t * w) + 0.35 * Math.sin(t * 1.55 + 1.3);
	const y = 0.65 * Math.sin(t * 1.05 + 2) + 0.35 * Math.sin(t * 1.4 + 0.4);
	const r = 0.65 * Math.sin(t * 1.15 + 0.5) + 0.35 * Math.sin(t * 1.5 + 2.2);
	return { x: 1.5 * x, y: 1.5 * y, r: ((0.4 * Math.PI) / 180) * r };
}

/** Autopilot im Fenster x 780-860, y 330-470: Dreieckswelle senkrecht, nie lange über derselben Textzeile. */
function autopilot(t) {
	const p = (t / 8) % 1;
	const tri = p < 0.5 ? -1 + 4 * p : 3 - 4 * p;
	return [820 + 40 * Math.sin(t * 0.45), 400 + 70 * tri];
}

function newState(back, front) {
	return {
		back,
		front,
		host: back.closest('[data-buehne]'),
		ht: null,
		lt: { x: 820, y: 400 },
		park: [940, 1000],
		lastClick: -9,
		tap: null,
		contactT: -9,
		pending: null,
		space: null,
		clean: false,
		mode: null, // 'gl' | 'cpu'
		layers: null,
		cpu: {},
		quiet: [0, 0, 0, 0, 0, 0, 0, 0],
		rects: [],
		qn: 0,
		frames: 0,
	};
}

function measure(st, cam) {
	const cr = st.back.getBoundingClientRect();
	const root = st.back.parentElement;
	const q = [0, 0, 0, 0, 0, 0, 0, 0];
	let k = 0;
	for (const el of root.querySelectorAll('[data-quiet]')) {
		if (k > 1) break;
		const r = el.getBoundingClientRect();
		q[k * 4] = (r.left - cr.left - cam.ox) / cam.f;
		q[k * 4 + 1] = (r.top - cr.top - cam.oy) / cam.f;
		q[k * 4 + 2] = r.width / cam.f;
		q[k * 4 + 3] = r.height / cam.f;
		k++;
	}
	st.quiet = q;
	st.rects = [...root.querySelectorAll('[data-cta]')].map((el) => {
		const r = el.getBoundingClientRect();
		return [r.left - cr.left, r.top - cr.top, r.right - cr.left, r.bottom - cr.top];
	});
}

const clearAll = (st) => {
	if (st.layers)
		for (const L of st.layers) {
			if (L.gl && !L.gl.isContextLost() && L.ready) {
				L.gl.clearColor(0, 0, 0, 0);
				L.gl.clear(L.gl.COLOR_BUFFER_BIT);
				L.last = null;
			}
		}
	else if (st.mode === 'cpu')
		for (const cv of [st.back, st.front]) {
			const g = cv.getContext('2d');
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.clearRect(0, 0, cv.width, cv.height);
		}
	if (st.cpu) st.cpu.key = null;
};

/**
 * Zeichnet beide Hände. back liegt unter dem Handy, front darüber.
 * c: Kontext der Bühne, cam: { f, ox, oy } aus kamera().
 */
export function draw(back, front, c, cam) {
	const t0 = performance.now();
	drawIn(back, front, c, cam);
	const st0 = states.get(back);
	if (st0) st0.ms = (st0.ms ?? 0) * 0.95 + (performance.now() - t0) * 0.05;
}

/** Zeichenart einmal festlegen (WebGL2 mit beiden Ebenen oder 2D-Fallback). */
function chooseMode(st, back, front) {
	if (st.mode) return;
	if (glTaugt(A.hold.meta, A.point.meta)) {
		st.layers = [makeLayer(back, false), makeLayer(front, true)];
		st.mode = st.layers[0] && st.layers[1] ? 'gl' : 'cpu';
	} else st.mode = 'cpu';
	if (st.mode === 'cpu') st.layers = null;
}

/** Vorführung schon gesehen (einmal je Sitzung)? Mit setzen = merken. */
function demoGetan(setzen) {
	try {
		if (setzen) sessionStorage.setItem('mwg-demo', '1');
		return sessionStorage.getItem('mwg-demo') === '1';
	} catch {
		return false;
	}
}

/** Mitte der Tab-Taste (Name) in der App-Vorschau als Ziel der Zeigehand: Objektraum plus Fensterkoordinaten. */
function demoZiel(st, name, obj) {
	const fr = st.back.parentElement?.querySelector('iframe');
	const doc = fr?.contentDocument;
	if (!fr || !doc?.body) return null;
	const r = fr.getBoundingClientRect();
	const k = r.width / fr.clientWidth;
	const el = [...doc.querySelectorAll(`a[data-k^="a|${name}"]`)].find(
		(e) => e.getBoundingClientRect().top > fr.clientHeight * 0.7,
	);
	if (!el || !k) return null;
	const q = el.getBoundingClientRect();
	const cx = r.left + (q.left + q.width / 2) * k;
	const cy = r.top + (q.top + q.height / 2) * k;
	const r0 = st.back.getBoundingClientRect();
	const [x, y] = obj(cx - r0.left, cy - r0.top);
	return { x, y, cx, cy };
}

function drawIn(back, front, c, cam) {
	let st = states.get(back);
	if (!st) {
		st = newState(back, front);
		states.set(back, st);
		qa.hand = () => ({
			mode: st.mode,
			tip: { ...(st.ht ?? {}) },
			quiet: st.quiet.slice(),
			rects: st.rects,
			ms: st.ms,
			dbg: st.dbg,
			gpu: st.layers?.map((L) => L.gpuMs ?? []),
		});
	}
	const host = st.host;
	// Vorwärmen: schon vor dem Eintritt Shader linken und Texturen hochladen (ein Schritt je Bild), damit der
	// erste sichtbare Frame der Hand keinen Ruckler auslöst
	if (A.ready && !(c.endA > 0.01) && c.P > 0.5) {
		chooseMode(st, back, front);
		if (st.layers) for (const L of st.layers) readyStep(L);
	}
	if (!(c.endA > 0.01) || !A.ready) {
		if (!st.clean && A.ready && st.mode) {
			clearAll(st);
			st.clean = true;
		}
		if (host && host.style.cursor) host.style.cursor = '';
		return;
	}
	st.clean = false;
	const { W, H, t, now, dt } = c;
	const dpr = dprFor(2);

	chooseMode(st, back, front);
	for (const cv of [back, front]) sizeBackingOf(cv, W, H, dpr);

	// Atmen: Handy und Hände bewegen sich gemeinsam um ±1,5 px und ±0,4° (Periode 4 bis 6 s), nur Transform
	const br = c.reduced || st.mode !== 'gl' ? { x: 0, y: 0, r: 0 } : atem(t);
	if (!st.space) st.space = st.back.parentElement.querySelector('[data-ende-space]');
	if (st.space) {
		st.space.style.setProperty('--ax', `${br.x.toFixed(3)}px`);
		st.space.style.setProperty('--ay', `${br.y.toFixed(3)}px`);
		st.space.style.setProperty('--ar', `${((br.r * 180) / Math.PI).toFixed(4)}deg`);
	}
	// Zeiger im Ende-Raum (Objektraum der Hände, ohne das Atmen)
	const obj = (x, y) => {
		const qx = (x - cam.ox) / cam.f - br.x - 800;
		const qy = (y - cam.oy) / cam.f - br.y - 400;
		const cs = Math.cos(br.r);
		const sn = Math.sin(br.r);
		return [800 + cs * qx + sn * qy, 400 - sn * qx + cs * qy];
	};
	const [mx, my] = obj(c.m.x, c.m.y);
	const sc = A.hold.meta.screen;
	const aufGlas = (x, y) => x > sc.x - 4 && x < sc.x + sc.w + 4 && y > sc.y - 4 && y < sc.y + sc.h + 4;
	const touch = c.m.type === 'touch';
	const dm = (st.demo ||= { n: 0, seit: null, next: 0, off: demoGetan() });
	// Ein Tipp auf den Bildschirm. Maus und Stift: die Zeigehand steht schon am Zeiger (oder fährt hin), erst bei
	// Berührung läuft der Druck, der Ring und der Klick in die App. Touch: es tippt der echte Finger, nur der Ring
	// markiert die Kontaktstelle (die App reagiert sofort, nichts wird verzögert).
	if (c.m.clickT !== st.lastClick) {
		st.lastClick = c.m.clickT;
		if (c.endOn && aufGlas(mx, my)) {
			dm.off = true; // eigener Tipp: die Vorführung ist überflüssig
			// Touch: es tippt der echte Finger. direkt: der Klick ist schon in der App angekommen (Phone.tsx), die
			// Zeigehand drückt nur noch mit und der Ring markiert die Stelle.
			if (touch || c.m.direkt) {
				st.tap = [mx, my];
				st.contactT = now;
			} else {
				const r0 = st.back.getBoundingClientRect();
				// Läuft noch ein Tipp, geht er sofort in die App: Tipps werden nie verworfen
				if (st.pending && !st.pending.demo) {
				const q = st.pending;
					st.tap = [q.x, q.y];
					st.contactT = now;
					st.host?.dispatchEvent(new CustomEvent('hand:kontakt', { detail: { x: q.cx, y: q.cy } }));
				}
				st.pending = { x: mx, y: my, t0: now, cx: r0.left + c.m.x, cy: r0.top + c.m.y };
			}
		}
	}
	// Vorführung: bleibt der Besucher nach dem Eintritt 2,5 s untätig, tippt die Zeigehand einmal pro Sitzung auf „Haushalt“
	// und drei Sekunden später auf „Start“ (über denselben Kontakt-Pfad wie ein echter Tipp). Hover über dem Glas, ein Tipp
	// oder Touch beenden sie. Bei reduzierter Bewegung läuft sie nicht (nur der Hinweis unter dem Handy).
	if (c.endOn && !touch && c.m.in && aufGlas(mx, my) && now - (c.m.moveT ?? -9) < 1.4) dm.off = true;
	if (dm.off || c.reduced || touch || isTouch() || !c.endOn || dm.n >= 2) {
		if (!c.endOn) dm.seit = null;
		if (dm.off && st.pending?.demo) st.pending = null;
	} else {
		dm.seit ??= now;
		if (!st.pending && now - dm.seit > 2.5 && now >= dm.next) {
			const z = demoZiel(st, dm.n ? 'Start' : 'Haushalt', obj);
			if (z) st.pending = { ...z, t0: now, demo: true, slow: true };
			else dm.next = now + 0.8;
		}
	}
	const pend = st.pending;
	// Nach dem Kontakt zieht sich die Hand nach 0,35 s zurück, damit das Ergebnis des Tipps zu sehen ist
	const zurueck = !pend && st.contactT > 0 && now - st.contactT > 0.35 && now - st.contactT < 1.6;
	const folgt = !zurueck && c.endOn && !touch && c.m.in && aufGlas(mx, my) && now - (c.m.moveT ?? -9) < 1.4;
	let tg = st.park;
	let k = 7;
	if (pend) {
		tg = [pend.x, pend.y];
		k = pend.slow ? 4 : 16;
	} else if (folgt) {
		tg = [mx, my];
		k = 16;
	}
	// Zeigerlicht: folgt der Maus, sonst ein ruhiger Autopilot
	const lg = c.endOn && c.m.in && !touch ? [mx, my] : c.reduced ? [820, 400] : autopilot(t);
	const parkY = Math.max(1000, (H - cam.oy) / cam.f + 340);
	st.park = [940, parkY];
	if (!st.ht) st.ht = { x: st.park[0], y: st.park[1] };
	const ht = st.ht;
	const kk = 1 - Math.exp(-k * Math.min(dt, 0.05));
	ht.x += (tg[0] - ht.x) * kk;
	ht.y += (tg[1] - ht.y) * kk;
	// Berührung: die Spitze ist angekommen (oder 0,3 s sind um), jetzt Druck, Ring und Klick
	if (pend && (Math.hypot(ht.x - pend.x, ht.y - pend.y) < 8 || now - pend.t0 > (pend.slow ? 2.2 : 0.3))) {
	st.pending = null;
	if (pend.demo) {
		dm.n++;
		dm.next = now + 3;
		if (dm.n >= 2) demoGetan(true);
	}
		st.tap = [pend.x, pend.y];
		st.contactT = now;
		st.host?.dispatchEvent(		new CustomEvent('hand:kontakt', { detail: { x: pend.cx, y: pend.cy, demo: !!pend.demo } }));
	}
	const lt = st.lt;
	const kl = 1 - Math.exp(-10 * Math.min(dt, 0.05));
	lt.x += (lg[0] - lt.x) * kl;
	lt.y += (lg[1] - lt.y) * kl;
	// Cursor: über dem Glas ersetzt die Fingerspitze den Zeiger (auch im Dokument der App, Phone.tsx)
	const folgen = !!(folgt || pend);
	if (st.host) st.host.toggleAttribute('data-hand-folgt', folgen);
	if (!st.appDoc?.isConnected) st.appDoc = st.space?.querySelector('iframe')?.contentDocument?.documentElement ?? null;
	if (st.appDoc && st.appDoc.hasAttribute('data-hand') !== folgen) st.appDoc.toggleAttribute('data-hand', folgen);
	st.dbg = { m: { x: c.m.x, y: c.m.y, in: c.m.in, down: c.m.down, type: c.m.type }, tg, endOn: c.endOn, tap: st.tap };

	const pr = now - (st.contactT ?? -9);
	const push = st.tap && pr >= 0 && pr < 0.4 && !touch ? Math.sin((pr / 0.4) * Math.PI) : 0;
	const hoch = istHoch(W, H);
	const ax = (hoch ? (W - cam.ox) / cam.f : ARM[0]) - ht.x;
	const ay = (hoch ? (H - cam.oy) / cam.f : ARM[1]) - ht.y;
	const AL = Math.hypot(ax, ay) || 1;
	const ux = ax / AL;
	const uy = ay / AL;
	if (st.frames++ % 15 === 0) measure(st, cam);
	// Das Licht wird gerastert (4 px), damit ruhiges Licht keinen neuen Durchgang auslöst
	const S = {
		light: { x: Math.round(lt.x / 4) * 4, y: Math.round(lt.y / 4) * 4 },
		ringAt: { x: st.tap ? st.tap[0] : 0, y: st.tap ? st.tap[1] : 0 },
		lightPow: st.mode === 'gl' ? 1 : 0,
		// Unterarm löst sich am unteren Bildrand auf (Verlauf statt harter Kante)
		bottomY: Math.min(A.hold.meta.bottomY, (H - cam.oy) / cam.f + 10),
		// Die Spitze steht exakt am Ziel, beim Druck geht sie leicht in Armrichtung
		tip: { x: Math.round((ht.x + ux * push * 4) * 2) / 2, y: Math.round((ht.y + uy * push * 4) * 2) / 2 },
		u: { x: ux, y: uy },
		sc: PS * (W <= 768 ? 0.75 : 1) * (1 - push * 0.06),
		// Touch: keine gezeichnete Zeigehand, dort tippt der echte Finger
		pa: qa.noPoint || touch ? 0 : 1,
		push: Math.round(push * 20) / 20,
		br,
		ring: st.tap && pr >= 0 && pr < RING_T ? 1 - pr / RING_T : 0,
		ringR: 10 + Math.max(0, pr) * 150,
		q: st.quiet,
	};
	if (host && host.style.cursor) host.style.cursor = '';

	if (st.mode === 'gl') {
		for (const L of st.layers) glFrame(L, S, cam, W, H);
	} else cpuFrame(st, S, cam, W, H, dpr);
}

function sizeBackingOf(cv, W, H, dpr) {
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	if (cv.width !== w || cv.height !== h) {
		cv.width = w;
		cv.height = h;
	}
}
