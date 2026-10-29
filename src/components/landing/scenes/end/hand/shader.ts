// GLSL sources of the hands (fragment shader with two passes, vertex shader for the full-screen triangle).
// The constants come from constants.ts and are inserted when the source is assembled.

import {
	CON,
	EDGE_IN,
	EDGE_THUMB,
	EDV,
	EDW,
	GAM,
	INK,
	INK_DARK,
	JIT,
	RIM,
	RING_N,
	STEP,
} from './constants';

export const FS = `#version 300 es
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
uniform vec4 uPR;      // phone radius, screen radius, bottomY, pointer light 0..1
uniform vec4 uLight;   // pointer light (end space) x, y
uniform vec4 uTipU;    // tip x, y, arm direction x, y
uniform vec4 uPS;      // scale of the pointing hand, opacity, 0, 0
uniform vec4 uRing;    // radius, opacity, active, press of the pointing hand 0..1
uniform vec4 uBr;      // breathing: x, y (stage px), angle (rad), 0
uniform vec4 uQ[2];    // quiet rectangles (title, button) in the end space
uniform vec3 uCam;     // f, ox, oy
uniform vec3 uBack;    // backing store per CSS px x, y, backing height
uniform int uFront;
uniform sampler2D uTone;
uniform ivec2 uCell0;
uniform ivec2 uCellN;
uniform float uDecay;    // decay 0..1: the hands dissolve into dust from the edge inward
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

// Holding hand: x = tone, y = layer (0 none, 1 back, 2 front)
float dil(sampler2D tx, vec4 T, float dv, vec3 O, vec2 C, float e){
  return max(max(samp(tx, T, dv, O, C), samp(tx, T, dv, O, C + vec2(e, 0.))), max(max(samp(tx, T, dv, O, C - vec2(e, 0.)), samp(tx, T, dv, O, C + vec2(0., e))), samp(tx, T, dv, O, C - vec2(0., e))));
}
vec2 holdTone(vec2 C){
  // Alpha dilated slightly: the cell yields tone beyond the edge, pass 2 cuts the exact silhouette per pixel
  float al = dil(uTH, uHT[1], uDiv[1], uHO, C, 1.5);
  if (al < .04) return vec2(0.);
  float zmm = SH(4, C) * 200. - 100.;
  float sdf = sdfRR(C, uPhone, uPR.x);
  // Fingers on the right rest 4 to 8 px over the case edge: in front, with a soft contact shading on the case
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
  // Fingers stay on the case and rim, never on the glass
  if (fing && sdS < -1.) return vec2(0.);
  // soft transition instead of a hard edge at the glass rim: tone and ink blend into each other over 18 px
  float gk = front ? ss(-sdS / 10.) : 0.;
  float vo = v;
  if (edge) vo = max(vo, ${EDV.toFixed(1)} * lf * al);
  float tone = vo * cov;
  if (gk > 0.) {
    float tn = .04 + .86 * pow(cl(v), 1.35);
    float vd = pow(1. - tn, .45);
    if (edge) vd = max(vd, .95);
    // on the glass only a narrow strip at the edge: tab bar and content stay clear
    float ri = C.x < 800. ? ${(EDGE_THUMB - 4).toFixed(1)} : ${(EDGE_IN - 4).toFixed(1)};
    float ti = vd * cov * (1. - ss((-sdS - ri) / 7.));
    tone = mix(tone, ti, gk);
  }
  // Case rim (between glass and outer edge): do not blow out the thumb pad as a white area
  if (front && sdf < 0. && sdS > 0.) tone = min(tone, .5);
  return vec2(tone, front ? 2. : 1.);
}

// Pointing hand (sprite), always in front
vec2 pointTone(vec2 C, bool full){
  if (uPS.y <= 0.) return vec2(0.);
  vec2 d = C - uTipU.xy;
  float dist = length(d);
  float gk = ss(-sdfRR(C, uScreen, uPR.y) / 24.);
  // on the glass the hand stays opaque up to the wrist, the arm fades out faster after that
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
  // no contour: the hand is a pure area of tone, only the soft silhouette at the edge
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

vec2 pSprite(vec2 S){
  vec2 d = S - uTipU.xy;
  vec2 u = uTipU.zw;
  return vec2(dot(d, u), -d.x * u.y + d.y * u.x) / uPS.x;
}
// Pixel alpha of the hands (holding hand and, in front, pointing hand) for the soft silhouette
float pixA(vec2 S){
  float a = SH(1, S);
  if (uFront == 1 && uPS.y > 0.) a = max(a, SP(1, pSprite(S)));
  return a;
}

// Decay: edge proximity 0..1 from the silhouette (1 at the edge, 0 from about 30 px depth)
float edgeProximity(vec2 C){
  float em = 0.;
  for (int i = 0; i < 8; i++) {
    float an = float(i) * .785398;
    vec2 dv = vec2(cos(an), sin(an));
    em += 2. - pixA(C + dv * 12.) - pixA(C + dv * 30.);
  }
  return clamp(em / 8., 0., 1.);
}
float vn(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3. - 2. * f);
  ivec2 c = ivec2(i);
  return mix(mix(hsh(c), hsh(c + ivec2(1, 0)), f.x), mix(hsh(c + ivec2(0, 1)), hsh(c + ivec2(1, 1)), f.x), f.y);
}
// Release degree 0..1 of a cell: edges first, plus noise so the front frays
float dissolve(vec2 C, ivec2 cell){
  float thr = (1. - edgeProximity(C)) * .5 + (vn(C / 36.) * .55 + hsh(cell) * .45) * .4;
  return clamp((uDecay * 1.3 - thr) / .4, 0., 1.);
}

#ifdef PASS1
// Pass 1: one texel per grid cell (tone after pointer light, occlusion and quiet zones)
void main(){
  ivec2 cell = uCell0 + ivec2(gl_FragCoord.xy);
  vec2 C = (vec2(cell) + .5) * ${STEP.toFixed(2)};
  float tone = 0.;
  vec2 h = holdTone(C);
  vec2 pt = pointTone(C, uFront == 1);
  float own = 1. - ss((pt.y - .2) / .5);
  if (uFront == 0) { if (h.y == 1.) tone = h.x * own; }
  else { if (h.y == 2.) tone = h.x * own; tone = max(tone, pt.x); }
  tone = clamp(tone * quiet(C), 0., 1.);
  float lg = 0.;
  if (uDecay > 0. && tone > 0.) lg = dissolve(C, cell);
  o = vec4(tone, lg, 0., 1.);
}
#else
// Pointing hand: softly smoothed silhouette (5 samples), with fade toward the arm and opacity
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
// Pass 2: dots per cell (Bayer, hash randomness), sharp on device pixels, silhouette smoothed by pixel alpha.
// In front (pointing hand) additionally: opaque base area within the silhouette and a soft shading on the glass.
void main(){
  vec2 css = vec2(gl_FragCoord.x / uBack.x, (uBack.z - gl_FragCoord.y) / uBack.y);
  vec2 S = (css - uCam.yz) / uCam.x;
  // Breathing: phone and hands move together, here the inverse into object space
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
  if (tc.x >= 0 && tc.y >= 0 && tc.x < uCellN.x && tc.y < uCellN.y) {
    vec2 tz = texelFetch(uTone, tc, 0).rg;
    tone = tz.x * (1. - ss(tz.y / .2));
  }
  float gk = uFront == 1 ? ss(-sdfRR(S, uScreen, uPR.y) / 24.) : 0.;
  // Dust: released cells fly diagonally to the top right (source searched per target cell along three wind directions)
  float dust = 0.;
  if (uDecay > 0.) {
    for (int k = 1; k <= 13; k++) {
      float d = .4 * pow(1.62, float(k));
      for (int a = 0; a < 3; a++) {
        float ang = -.6 + (float(a) - 1.) * .32;
        ivec2 sc = cell - ivec2(round(vec2(cos(ang), sin(ang)) * d));
        ivec2 sq = sc - uCell0;
        if (sq.x < 0 || sq.y < 0 || sq.x >= uCellN.x || sq.y >= uCellN.y) continue;
        vec2 tz = texelFetch(uTone, sq, 0).rg;
        if (tz.y <= .004 || tz.x <= 0.) continue;
        if (min(int(hsh(sc + ivec2(5, 3)) * 3.), 2) != a) continue;
        float ts = 200. * pow(tz.y, 1.4) * (.4 + .6 * hsh(sc + ivec2(91, 17)));
        if (abs(ts - d) < .45 * d + .6) dust = max(dust, tz.x * pow(1. - tz.y, 1.1));
      }
    }
    dust *= 1. - gk; // the app stays clear over the glass
  }
  bool isDust = dust > tone;
  tone = max(tone, dust);
  float ink = mix(${INK}, ${INK_DARK}, gk);
  bool pt = uFront == 1 && uPS.y > 0.;
  if (tone <= 0. && uRing.z <= 0. && !pt) { o = vec4(0.); return; }
  tone *= (1. - ${(JIT / 2).toFixed(3)}) + ${JIT.toFixed(2)} * hsh(cell);
  int bx = cell.x & 3;
  int by = cell.y & 3;
  float thr = float((by & 1) * 12 + (by >> 1) * 3 + (1 - 2 * (by & 1)) * 8 * (bx & 1) + (1 - 2 * (by >> 1)) * 2 * (bx >> 1)) / 16. + .035;
  float c = 0.;
  if (tone > thr || tone > .8) {
    // Dots never touch (edge at most 0.92 cells); in the highlight (from .8) the grid flips to dark holes in a light area
    float z = min(${STEP.toFixed(2)} * (.5 + .5 * min(1., tone)), ${STEP.toFixed(2)} * .92);
    vec2 dd = abs(S - C);
    c = clamp((z * .5 - max(dd.x, dd.y)) / px + .5, 0., 1.);
    if (tone > .8 && !isDust) {
      float hh = ${STEP.toFixed(2)} * .436 * (1. - clamp((tone - .8) / .2, 0., 1.));
      c = 1. - clamp((hh - max(dd.x, dd.y)) / px + .5, 0., 1.) * step(.001, hh);
    }
    if (!isDust) {
      float a = pixA(S);
      float w = max(fwidth(a), .02);
      c *= clamp((a - .5) / w + .5, 0., 1.);
    }
  }
  if (uFront == 1 && uRing.z > 0.) {
    vec2 dr = S - uLight.zw;
    float step_ = 6.2831853 / ${RING_N}.;
    float a2 = floor(atan(dr.y, dr.x) / step_ + .5) * step_;
    vec2 pp = uLight.zw + uRing.x * vec2(cos(a2), sin(a2));
    vec2 d2 = abs(S - pp);
    c = max(c, clamp((.7 - max(d2.x, d2.y)) / px + .5, 0., 1.) * uRing.y * quiet(S) * (1. - ss(uDecay * 5.)));
  }
  float base = 0.;
  float sh = 0.;
  if (pt && gk > 0.) {
    float zf = 1. - ss(uDecay * 6.); // base area and shading of the pointing hand dissolve first, the dots remain
    base = pointSil(S) * gk * zf;
    // soft shading of the pointing hand on the glass: the closer the finger (press), the tighter and darker
    vec2 off = vec2(7., 11.) * (1. - .55 * uRing.w);
    float s0 = pointSil(S - off) + pointSil(S - off + vec2(7., 0.)) + pointSil(S - off - vec2(7., 0.)) + pointSil(S - off + vec2(0., 7.)) + pointSil(S - off - vec2(0., 7.));
    sh = s0 / 5. * gk * (.15 + .1 * uRing.w) * zf;
  }
  float aOut = c + base * (1. - c);
  vec3 col = vec3(ink * c + .76 * base * (1. - c));
  float sa = sh * (1. - aOut);
  o = vec4(col, aOut + sa);
}
#endif
`;

export const VS = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2. - 1., 0., 1.);
}`;

/** Fragment shader of one pass: pass1 = tone per cell, otherwise dots onto the canvas. */
export const fsSrc = (pass1: boolean): string =>
	FS.replace('#pragma DEFS', pass1 ? '#define PASS1' : '');
