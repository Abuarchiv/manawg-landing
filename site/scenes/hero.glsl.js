// Shader-Strings fuer den Hero. Stufen per #define (DESKTOP/MOBILE). Zeichen-Geometrie kommt aus lib.js.
import { MARK_GLSL } from '../lib.js';

export const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

const HEAD = (mobile) => `#version 300 es
precision highp float;
${mobile ? '#define MOBILE' : '#define DESKTOP'}
#ifdef MOBILE
#define MARCH_N 80
#define NRM_OC 6
#define SHA_N 12
#else
#define MARCH_N 140
#define NRM_OC 10
#define SHA_N 22
#endif
out vec4 o;
uniform vec2 uR; uniform float T; uniform vec2 uM; uniform vec4 uB[8];
${MARK_GLSL}
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float nz(vec2 x){ vec2 p = floor(x), f = fract(x); vec2 u = f * f * (3. - 2. * f);
  float a = hash(p), b = hash(p + vec2(1., 0.)), c = hash(p + vec2(0., 1.)), d = hash(p + 1.); return mix(mix(a, b, u.x), mix(c, d, u.x), u.y); }
float fbm(vec2 p){ float s = 0., a = .5; for(int i = 0; i < 5; i++){ s += a * nz(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; } return s; }
const mat2 M2 = mat2(.8, -.6, .6, .8);
float terr(vec2 p, int oc){ vec2 q = p * .15; q += (vec2(nz(q * .7), nz(q * .7 + 5.3)) - .5) * .6; float a = 0., b = .56, w = 1.;
  for(int i = 0; i < 11; i++){ if(i >= oc) break; float n = 1. - abs(nz(q) * 2. - 1.); n = n * n; a += n * b * w; w = clamp(n * 2., 0., 1.); b *= .46; q = M2 * q * 2.05 + vec2(3.1, 1.7); }
  return a * 3.7 - 1.35; }
float smin(float a, float b, float k){ float h = clamp(.5 + .5 * (b - a) / k, 0., 1.); return mix(b, a, h) - k * h * (1. - h); }
float org(vec2 p){ float d = 1e5; for(int i = 0; i < 8; i++) d = smin(d, length(p - uB[i].xy) - uB[i].w, SMK); return max(d, -(length(p - uB[0].xy - HOLE_OFF) - HOLE_R)); }
vec2 UV(){ return (gl_FragCoord.xy - .5 * uR) / uR.y; }
vec3 RT, UP, FW;
vec3 cam(float sp, float pitch, float alt, float x0){ vec3 ro = vec3(x0 + uM.x * .1, 0., 3. - T * sp); ro.y = max(alt, terr(ro.xz, 3) + .7);
  float yaw = uM.x * .06; FW = normalize(vec3(sin(yaw), pitch + uM.y * .025, -cos(yaw))); RT = normalize(cross(FW, vec3(0., 1., 0.))); UP = cross(RT, FW); return ro; }
vec3 ray(vec2 uv){ return normalize(uv.x * RT + uv.y * UP + 1.8 * FW); }
float march(vec3 ro, vec3 rd){ float t = .1; for(int i = 0; i < MARCH_N; i++){ vec3 p = ro + rd * t; float h = p.y - terr(p.xz, 6); if(abs(h) < .0015 * t || t > 45.) break; t += .34 * h; } return t; }
vec3 tn(vec2 p, float t){ float e = .0018 * t + .0015; return normalize(vec3(terr(p - vec2(e, 0.), NRM_OC) - terr(p + vec2(e, 0.), NRM_OC), 2. * e, terr(p - vec2(0., e), NRM_OC) - terr(p + vec2(0., e), NRM_OC))); }
float sha(vec3 p, vec3 l){ float r = 1., t = .03; for(int i = 0; i < SHA_N; i++){ vec3 q = p + l * t; float h = q.y - terr(q.xz, 5); r = min(r, 9. * h / t); t += clamp(h, .05, .45); if(r < .005 || t > 12.) break; } return clamp(r, 0., 1.); }
float snowM(vec3 p, vec3 n, float bias){ float s = nz(p.xz * 13.) * .55 + nz(p.xz * 47.) * .3 + nz(p.xz * 140.) * .15; float hn = clamp((p.y + .3) / 2.2, 0., 1.); return smoothstep(.5, .72, n.y + (s - .5) * .55 + hn * .3 + bias); }
float rockA(vec3 p){ float st = .5 + .5 * sin(p.y * 70. + nz(p.xz * 5.) * 7.); return .06 + .05 * st + .05 * nz(p.xz * 33.); }
float sunD(vec2 uv, vec2 sp, float s){ return org((uv - sp) / s) * s; }
`;

export const sceneSrc = (mobile) => HEAD(mobile) + `
uniform float uMix, uLook, uK; uniform vec4 uO[8]; uniform vec3 uC; uniform vec3 uH;
float mountain(vec2 uv){
  float pitch = mix(-.06, .55, uLook); vec3 ro = cam(.045, pitch, 1.85, 2.4), rd = ray(uv);
  vec2 sp = mix(vec2(uM.x * .7, .3 + uM.y * .1), vec2(uM.x * .04, uM.y * .03), uLook); sp.x *= min(1., uR.x / uR.y); float sc = mix(.15, .52, uLook * uLook);
  vec3 L = normalize(RT * (sp.x * 1.5 + .9) + UP * .42 - FW * .2);
  float e = rd.y + .06; float sky = mix(.36, .2, clamp(e * 2.2 + .05, 0., 1.)); float st = fbm(vec2(rd.x * 1.2 + T * .008, e * 15.)); sky += (st - .5) * .18 * smoothstep(-.05, .35, e);
  float v = sky; float t = 45.; if(uLook < .97) t = march(ro, rd); vec3 p = ro + rd * t;
  if(t < 45.){ vec3 n = tn(p.xz, t); float dif = max(dot(n, L), 0.) * sha(p + n * .01, L); float sn = snowM(p, n, .1);
    float alb = mix(rockA(p) * .5, .95, sn); float amb = .5 + .5 * n.y; v = alb * (dif * 1.25 + amb * .07); v = v / (v + .55) * 1.5; v = mix(v, .34, 1. - exp(-t * .035)); }
  else { float d = sunD(uv, sp, sc); v = mix(v, .88, smoothstep(.002, -.002, d)); v += exp(-max(d, 0.) * 16. / (1. + uLook * 2.)) * .08 * (1. + uLook * 3.); }
  return v; }
float omap(vec3 p){ float d = 1e5; for(int i = 0; i < 8; i++) d = smin(d, length(p - uO[i].xyz) - uO[i].w, uK); return max(d, -(length(p.xy - uH.xy) - uH.z)); }
vec3 onrm(vec3 p){ const vec2 e = vec2(.002, -.002); return normalize(e.xyy * omap(p + e.xyy) + e.yyx * omap(p + e.yyx) + e.yxy * omap(p + e.yxy) + e.xxx * omap(p + e.xxx)); }
float organ(vec2 uv){ vec3 ro = uC, rd = normalize(vec3(uv, -1.6)); float t = 0., md = 1e5;
  for(int i = 0; i < 90; i++){ vec3 p = ro + rd * t; float d = omap(p); md = min(md, d);
    if(d < .0015){ vec3 n = onrm(p); vec3 l = normalize(vec3(uM.x * 2.4, uM.y * 2.4 + .5, 1.3)); float df = max(dot(n, l), 0.), ao = clamp(omap(p + n * .2) / .2, 0., 1.), rim = pow(1. - max(dot(n, -rd), 0.), 3.);
      return clamp(df * .9 * (.45 + .55 * ao) + .05 + rim * .22, 0., 1.); }
    t += d * .9; if(t > 40.) break; }
  return exp(-md * 7.) * .45 * step(.88, hash(floor(gl_FragCoord.xy) + 3.1)); }
void main(){ vec2 uv = UV(); float v = 0.; if(uMix < .999) v = mountain(uv); if(uMix > .001) v = mix(v, organ(uv), uMix); o = vec4(v, v, v, 1.); }`;

// Post: Halbton-Punkte (Zellen 6 px bei 800 px Hoehe) mit weichem Uebergang aus dem Berg-Ton, direkt in den sichtbaren Canvas.
export const POST = `#version 300 es
precision highp float; out vec4 o; uniform sampler2D uT; uniform vec2 uR, uS; uniform float uD;
void main(){ vec2 fc = gl_FragCoord.xy; float vr = texture(uT, fc / uR * uS).r;
  float cs = 6. * uR.y / 800.; vec2 c = (floor(fc / cs) + .5) * cs; float L = texture(uT, c / uR * uS).r;
  float r = cs * .5 * sqrt(clamp(L, 0., 1.)) * 1.15; float vd = smoothstep(r + .7, r - .7, length(fc - c));
  float v = mix(vr, vd, uD); v = .04 + v * .94; o = vec4(v, v, v, 1.); }`;
