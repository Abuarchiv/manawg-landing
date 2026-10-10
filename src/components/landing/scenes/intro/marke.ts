// Die Marke als Signatur-Objekt: dieselben acht Kugeln mit Loch wie das Organ des Heros (core/math HOME3),
// als Raymarch mit Halbton-Punkten in einem eigenen, durchsichtigen WebGL2-Canvas. Die Bühne (stage.ts) führt
// Ort, Größe, Drehung und Deckkraft am Scroll: nach dem Tauchgang des Heros taucht die Marke über der Wohnung
// auf, dreht sich mit jedem Scrollschritt, schwebt über der Flut und fällt am Ende als App-Icon ins Handy.
//
// Das Canvas ist nur so groß wie die Marke (Kante = 2,6 x Radius), gesetzt über left/top/width/height; der
// Halbton rastert in derselben Zellgröße wie der Hero (6 Entwurfs-px, mit der Bühnenhöhe skaliert).

import { HOME3 } from '../../core/math';

const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

const FS = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 uR;      // Canvas in Gerätepixeln
uniform float uCs;    // Halbtonzelle in Gerätepixeln
uniform float uRad;   // Radius der Marke in Gerätepixeln (Objektraum-Einheit 1 = uRad / 1.35)
uniform mat3 uRot;    // Drehung der Marke
uniform vec3 uL;      // Lichtrichtung (Objektraum des Betrachters)
uniform float uA;     // Deckkraft
uniform float uT;
uniform vec4 uO[8];   // Kugeln (xyz, r)
uniform vec3 uH;      // Loch (xy, r)
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float smin(float a, float b, float k){ float h = clamp(.5 + .5 * (b - a) / k, 0., 1.); return mix(b, a, h) - k * h * (1. - h); }
float omap(vec3 p){ float d = 1e5; for(int i = 0; i < 8; i++) d = smin(d, length(p - uO[i].xyz) - uO[i].w, .5); return max(d, -(length(p.xy - uH.xy) - uH.z)); }
vec3 onrm(vec3 p){ const vec2 e = vec2(.003, -.003); return normalize(e.xyy * omap(p + e.xyy) + e.yyx * omap(p + e.yyx) + e.yxy * omap(p + e.yxy) + e.xxx * omap(p + e.xxx)); }
// Ton der Marke an der Stelle fc (Gerätepixel): 0 = kein Treffer (Alpha), sonst Helligkeit 0..1 und Treffer 1
vec2 organ(vec2 fc){
  vec2 uv = (fc - .5 * uR) / (uRad / 1.35);
  vec3 ro = uRot * vec3(uv, 6.), rd = uRot * vec3(0., 0., -1.);
  float t = 0.;
  for(int i = 0; i < 64; i++){ vec3 p = ro + rd * t; float d = omap(p);
    if(d < .002){ vec3 n = onrm(p); vec3 l = normalize(uRot * uL); float df = max(dot(n, l), 0.);
      float ao = clamp(omap(p + n * .25) / .25, 0., 1.); float rim = pow(1. - max(dot(n, -rd), 0.), 3.);
      return vec2(clamp(df * .9 * (.45 + .55 * ao) + .06 + rim * .2, 0., 1.), 1.); }
    t += d * .9; if(t > 14.) break; }
  return vec2(0.);
}
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 c = (floor(fc / uCs) + .5) * uCs;
  vec2 s = organ(c);
  if(s.y < .5){ o = vec4(0.); return; }
  float L = s.x + (hash(c) - .5) * .04;
  float r = uCs * .5 * sqrt(clamp(L, 0., 1.)) * 1.15;
  float vd = smoothstep(r + .7, r - .7, length(fc - c));
  float a = vd * uA;
  o = vec4(vec3(.98) * a, a);
}`;

/** Lage der Marke in Bühnen-CSS-px. */
export interface MarkeLage {
	x: number;
	y: number;
	/** Radius in CSS-px. */
	r: number;
	/** Drehung um die Hochachse und Neigung (rad). */
	yaw: number;
	pitch: number;
	alpha: number;
}

export interface Marke {
	/** Zeichnet ein Bild. Gibt das belegte Rechteck zurück (für die Flut-Lücke) oder null, wenn unsichtbar. */
	frame: (
		lage: MarkeLage,
		H: number,
		dpr: number,
		t: number,
		licht: [number, number],
	) => { x: number; y: number; w: number; h: number } | null;
	destroy: () => void;
}

const O = new Float32Array(32);
for (let i = 0; i < 8; i++) {
	const g = HOME3[i];
	if (!g) continue;
	O[i * 4] = g[0];
	O[i * 4 + 1] = g[1];
	// leichte Tiefe je Kugel, damit die Marke beim Drehen Körper zeigt (wie das Organ mit split)
	O[i * 4 + 2] = ((i % 3) - 1) * 0.1;
	O[i * 4 + 3] = g[2];
}
const HX = (O[0] ?? 0) + 7 / 110;
const HY = (O[1] ?? 0) + 23 / 110;
const HR = 0.2;

function rot(yaw: number, pitch: number): Float32Array {
	const cy = Math.cos(yaw);
	const sy = Math.sin(yaw);
	const cp = Math.cos(pitch);
	const sp = Math.sin(pitch);
	// Ry(yaw) * Rx(pitch), spaltenweise für uniformMatrix3fv
	return new Float32Array([cy, 0, -sy, sy * sp, cp, cy * sp, sy * cp, -sp, cy * cp]);
}

export function createMarke(cv: HTMLCanvasElement): Marke | null {
	const gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
	if (!gl) return null;
	const sh = (type: number, src: string) => {
		const s = gl.createShader(type);
		if (!s) return null;
		gl.shaderSource(s, src);
		gl.compileShader(s);
		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
			console.error('marke:', gl.getShaderInfoLog(s));
			return null;
		}
		return s;
	};
	const vs = sh(gl.VERTEX_SHADER, VS);
	const fs = sh(gl.FRAGMENT_SHADER, FS);
	const pr = gl.createProgram();
	if (!vs || !fs || !pr) return null;
	gl.attachShader(pr, vs);
	gl.attachShader(pr, fs);
	gl.linkProgram(pr);
	if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
	const buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const loc = gl.getAttribLocation(pr, 'a');
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
	const U = (n: string) => gl.getUniformLocation(pr, n);
	const u = {
		uR: U('uR'),
		uCs: U('uCs'),
		uRad: U('uRad'),
		uRot: U('uRot'),
		uL: U('uL'),
		uA: U('uA'),
		uT: U('uT'),
		uO: U('uO'),
		uH: U('uH'),
	};
	gl.useProgram(pr);
	gl.uniform4fv(u.uO, O);
	gl.uniform3f(u.uH, HX, HY, HR);
	let w = 0;
	let h = 0;
	let sichtbar = false;

	return {
		frame(lage, H, dpr, t, licht) {
			if (lage.alpha <= 0.002 || lage.r < 2) {
				if (sichtbar) {
					cv.style.display = 'none';
					sichtbar = false;
				}
				return null;
			}
			const kante = Math.ceil(lage.r * 2.6);
			const x0 = Math.round(lage.x - kante / 2);
			const y0 = Math.round(lage.y - kante / 2);
			const bw = Math.max(1, Math.round(kante * dpr));
			if (bw !== w) {
				w = h = bw;
				cv.width = w;
				cv.height = h;
				cv.style.width = `${kante}px`;
				cv.style.height = `${kante}px`;
			}
			cv.style.transform = `translate(${x0}px, ${y0}px)`;
			if (!sichtbar) {
				cv.style.display = 'block';
				sichtbar = true;
			}
			gl.viewport(0, 0, w, h);
			gl.useProgram(pr);
			gl.uniform2f(u.uR, w, h);
			gl.uniform1f(u.uCs, (6 * H * dpr) / 800);
			gl.uniform1f(u.uRad, lage.r * dpr);
			gl.uniformMatrix3fv(u.uRot, false, rot(lage.yaw, lage.pitch));
			gl.uniform3f(u.uL, licht[0] * 2.4, licht[1] * 2.4 + 0.5, 1.3);
			gl.uniform1f(u.uA, lage.alpha);
			gl.uniform1f(u.uT, t);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			return { x: x0, y: y0, w: kante, h: kante };
		},
		destroy() {
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		},
	};
}
