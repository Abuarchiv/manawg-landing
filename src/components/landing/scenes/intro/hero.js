// Hero der Intro-Bühne: Berg, Zeichen, Organ und Tauchgang als WebGL2-Shader mit Halbton-Ausgabe.
// Ohne WebGL2 zeichnet der Halbton-Fallback (tone) das Zeichen im 2D-Canvas.
//
// Aufbau wie im Entwurf: Szenen-Pass in kleiner Auflösung in eine Textur, danach der Halbton-Pass
// in voller Backing-Auflösung. Neu gegenüber der Portierung: Texturgröße und Szenenpuffer folgen
// der CSS-Größe des Canvas (nicht mehr fest 1280 x 800), im Hochformat wird der Bildausschnitt
// gerahmt (uZ), die Ausgabe läuft über einen Offscreen-Canvas in das sichtbare 2D-Canvas.

import { HOME, HOME3, aMark, cl, ease, hsh, lerp, ss } from '../../core/math';

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
const SCENE = HEAD + `
uniform float uMix, uLook, uK, uSt; uniform vec4 uO[8]; uniform vec3 uC; uniform vec3 uH;
float mountain(vec2 uv){
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
float omap(vec3 p){ float d = 1e5; for(int i = 0; i < 8; i++) d = smin(d, length(p - uO[i].xyz) - uO[i].w, uK); return max(d, -(length(p.xy - uH.xy) - uH.z)); }
vec3 onrm(vec3 p){ const vec2 e = vec2(.002, -.002); return normalize(e.xyy * omap(p + e.xyy) + e.yyx * omap(p + e.yyx) + e.yxy * omap(p + e.yxy) + e.xxx * omap(p + e.xxx)); }
float organ(vec2 uv){ vec3 ro = uC, rd = normalize(vec3(uv, -1.6)); float t = 0., md = 1e5;
  for(int i = 0; i < 90; i++){ vec3 p = ro + rd * t; float d = omap(p); md = min(md, d);
if(d < .0015){ vec3 n = onrm(p); vec3 l = normalize(vec3(uM.x * 2.4, uM.y * 2.4 + .5, 1.3)); float df = max(dot(n, l), 0.), ao = clamp(omap(p + n * .2) / .2, 0., 1.), rim = pow(1. - max(dot(n, -rd), 0.), 3.);
  return clamp(df * .9 * (.45 + .55 * ao) + .05 + rim * .22, 0., 1.); }
t += d * .9; if(t > 40.) break; }
  return exp(-md * 7.) * .45 * step(.88, hash(floor(gl_FragCoord.xy) + 3.1)); }
void main(){ vec2 uv = UV(); float v = 0.; if(uMix < .999) v = mountain(uv); if(uMix > .001) v = mix(v, organ(uv), uMix); o = vec4(v, v, v, 1.); }`;
const POST = `#version 300 es
precision highp float; out vec4 o; uniform sampler2D uT; uniform vec2 uR, uS; uniform float uD, uL, uMx, uSt;
void main(){ vec2 fc = gl_FragCoord.xy; float vr = texture(uT, fc / uR * uS).r;
  float cs = 6. * uR.y / 800.; vec2 c = (floor(fc / cs) + .5) * cs; float L = texture(uT, c / uR * uS).r; if(uL > .5) L = mix(clamp((L - .36) / .64, 0., 1.), L, uMx);
  float r = cs * .5 * sqrt(clamp(L, 0., 1.)) * 1.15; float vd = smoothstep(r + .7, r - .7, length(fc - c));
  float v = mix(vr, vd, uD); if(uSt < .5){ float tone = vr; float k8 = uR.y / 800.; float sl = (fc.y + fc.x * .22) / (3.2 * k8); float w = fwidth(sl); float th = clamp((.88 - tone) * 1.2, 0., 1.); float ln = 1. - smoothstep(th - w, th + w, abs(fract(sl) - .5) * 2.); float sd = 1. - tone; if(sd > .6){ float s2 = (fc.y - fc.x * .5) / (3. * k8); ln = max(ln, 1. - smoothstep(0., fwidth(s2) * 2., abs(fract(s2) - .5) * 2. - (1. - (sd - .6) * 2.))); } v = mix(ln, vd, uD); } if(uL > .5) v = 1. - v * .96; else v = .04 + v * .94; o = vec4(v, v, v, 1.); }`;

const B = new Float32Array(32);
const O = new Float32Array(32);

/**
 * Hero an ein sichtbares 2D-Canvas hängen.
 * frame(c, h) zeichnet ein Bild. c ist der Kontext der Bühne (W, H, dpr, t, now, P, m, ...),
 * h trägt die abgeleiteten Marken { look, mx, split, zoom, dive, sm, a0, ad }.
 */
export function createHero(cv) {
	const ctx = cv.getContext('2d');
	const G = { cv: null, gl: null, lostAt: 0, noGL: false, fails: 0, tx: null, fb: null, tw: 0, th: 0 };
	const fb = { x: 0, y: 0, ok: false }; // Fallback: nachlaufendes Licht

	const initGL = () => {
		const gl = G.cv.getContext('webgl2', { antialias: false, preserveDrawingBuffer: false });
		if (!gl) return false;
		G.gl = gl;
		const sh = (t, src, k) => {
			const s = gl.createShader(t);
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
				console.error(`shader ${k}`, gl.getShaderInfoLog(s));
			return s;
		};
		const vs = sh(gl.VERTEX_SHADER, VS, 'vs');
		const prog = (src, names, k) => {
			const pr = gl.createProgram();
			gl.attachShader(pr, vs);
			gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, src, k));
			gl.bindAttribLocation(pr, 0, 'a');
			gl.linkProgram(pr);
			if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
				console.error(`link ${k}`, gl.getProgramInfoLog(pr));
			const U = {};
			for (const n of names) U[n] = gl.getUniformLocation(pr, n);
			return { pr, U };
		};
		G.S = prog(
			SCENE,
			['uR', 'T', 'uM', 'uB', 'uMix', 'uLook', 'uK', 'uO', 'uC', 'uH', 'uSt', 'uZ'],
			'scene',
		);
		G.Pp = prog(POST, ['uT', 'uR', 'uS', 'uD', 'uL', 'uMx', 'uSt'], 'post');
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		G.tx = null;
		G.fb = null;
		G.tw = 0;
		G.th = 0;
		return true;
	};

	// Textur und Framebuffer des Szenenpuffers, bei Größenwechsel neu anlegen.
	const ensureTex = (gl, tw, th) => {
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
		G.cv = document.createElement('canvas');
		G.gl = null;
		G.cv.addEventListener('webglcontextlost', (e) => {
			e.preventDefault();
			G.gl = null;
			G.lostAt = performance.now();
		});
		if (initGL()) {
			everOk = true;
			G.fails = 0;
		} else {
			G.fails++;
			if (!everOk || G.fails >= 3) G.noGL = true;
		}
	};
	fresh();

	// Halbton-Fallback ohne WebGL2: das Zeichen als Punktraster mit nachlaufendem Licht.
	const tone = (c) => {
		const { W, H, t, dpr } = c;
		const step = 6;
		const f0 = Math.min(1.25, Math.min(W, H) / 800);
		const sc = 1.3 * f0 * (1 + 0.025 * Math.sin((t * Math.PI) / 3));
		const cx = W / 2;
		const cy = H / 2;
		const tg = c.m.in ? [c.m.x, c.m.y] : [cx + Math.cos(t * 0.3) * 220 * f0, cy - 160 * f0 + Math.sin(t * 0.4) * 80 * f0];
		if (!fb.ok) {
			fb.x = tg[0];
			fb.y = tg[1];
			fb.ok = true;
		}
		fb.x += (tg[0] - fb.x) * 0.08;
		fb.y += (tg[1] - fb.y) * 0.08;
		sizeTo(c.W, c.H, dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = '#0A0A0A';
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = '#FAFAFA';
		for (let y = step / 2, j = 0; y < H; y += step, j++)
			for (let x = step / 2, i = 0; x < W; x += step, i++) {
				const mx = (x - cx) / sc + 208;
				const my = (y - cy) / sc + 173;
				if (mx < -60 || mx > 480 || my < -60 || my > 400) continue;
				const d = aMark(mx, my);
				let v = 0;
				if (d < 0) {
					const gx = aMark(mx + 1, my) - d;
					const gy = aMark(mx, my + 1) - d;
					const h = Math.sqrt(cl(-d / 46));
					const sl = (1 - h) * 2;
					const nx = gx * sl;
					const ny = gy * sl;
					const nl = Math.hypot(nx, ny, 1);
					const lx = fb.x - x;
					const ly = fb.y - y;
					const ll = Math.hypot(lx, ly, 220 * f0);
					const lam = Math.max(0, (nx * lx + ny * ly + 220 * f0) / (nl * ll));
					v = Math.pow(h, 0.3) * (0.08 + 0.92 * lam * lam);
				} else if (d < 70) {
					if (hsh(i * 7 + Math.floor(t * 2), j) < 0.18 * (1 - d / 70)) v = 0.25;
				}
				if (v > 0.03) {
					const r = step * 0.5 * Math.sqrt(cl(v));
					ctx.fillRect(x - r, y - r, r * 2, r * 2);
				}
			}
	};

	const sizeTo = (W, H, dpr) => {
		const w = Math.max(1, Math.round(W * dpr));
		const h = Math.max(1, Math.round(H * dpr));
		if (cv.width !== w || cv.height !== h) {
			cv.width = w;
			cv.height = h;
		}
	};

	// Ein Bild. Gibt true zurück, wenn gezeichnet wurde.
	const frame = (c, h) => {
		if (G.noGL) {
			tone(c);
			return true;
		}
		if (!G.gl || G.gl.isContextLost()) {
			if (!G.lostAt) G.lostAt = performance.now();
			if (performance.now() - G.lostAt > 800) {
				G.lostAt = 0;
				fresh();
			}
			return false;
		}
		G.lostAt = 0;
		const gl = G.gl;
		const { t, now, W, H, dpr } = c;
		const { split, dive, zoom, look, mx } = h;
		const br = 1 + 0.03 * Math.sin((t * Math.PI) / 3);
		for (let i = 0; i < 8; i++) {
			const hm = HOME[i];
			const e = i ? ease((now - h.a0 - i * 0.07) / 1.4) : 1;
			const dx = hm[0] - HOME[0][0];
			const dy = hm[1] - HOME[0][1];
			const L = Math.hypot(dx, dy) || 1;
			const far = 0.9 * (1 - e);
			B[i * 4] = hm[0] + (dx / L) * far;
			B[i * 4 + 1] = hm[1] + (dy / L) * far;
			B[i * 4 + 2] = 0;
			B[i * 4 + 3] = hm[2] * br;
			const g = HOME3[i];
			const f = 1 + 1.4 * split;
			O[i * 4] = g[0] * f + Math.sin(t * 0.3 + i * 1.7) * 0.25 * split;
			O[i * 4 + 1] = g[1] * f + Math.cos(t * 0.27 + i * 2.3) * 0.25 * split;
			O[i * 4 + 2] = ((i % 3) - 1) * 1.5 * split;
			O[i * 4 + 3] = g[2] * br;
		}
		const hx = O[0] + 7 / 110;
		const hy = O[1] + 23 / 110;
		const hr = 0.2 * (1 + dive * 2.2);
		const cz = lerp(lerp(17, 6, zoom), -2.5, Math.pow(dive, 1.6));
		const allDots = mx >= 0.999;
		// Ausgabe in voller Backing-Auflösung, Szenenpuffer klein und adaptiv
		const w = Math.max(1, Math.round(W * dpr));
		const hh = Math.max(1, Math.round(H * dpr));
		sizeTo(W, H, dpr);
		const cs = (6 * hh) / 800;
		const fw = allDots ? Math.ceil(w / cs) : Math.round(cl(0.42 * W * h.ad, 160, 900));
		const fh = allDots ? Math.ceil(hh / cs) : Math.round((fw * H) / W);
		const tw = Math.min(1920, Math.max(960, w));
		const th = Math.max(fh, Math.round((tw * hh) / w));
		ensureTex(gl, tw, th);
		// Hochformat: waagerechte Bewegung dämpfen und den Ausschnitt weiter fassen
		const ax = Math.min(1, W / H / 1.6);
		const uz = Math.min(1, W / H / 0.9);
		gl.bindFramebuffer(gl.FRAMEBUFFER, G.fb);
		gl.viewport(0, 0, fw, fh);
		gl.useProgram(G.S.pr);
		const U = G.S.U;
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
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		if (G.cv.width < w) G.cv.width = w;
		if (G.cv.height < hh) G.cv.height = hh;
		gl.viewport(0, 0, w, hh);
		gl.useProgram(G.Pp.pr);
		const Q = G.Pp.U;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, G.tx);
		gl.uniform1i(Q.uT, 0);
		gl.uniform2f(Q.uR, w, hh);
		gl.uniform2f(Q.uS, fw / tw, fh / th);
		gl.uniform1f(Q.uD, mx);
		gl.uniform1f(Q.uL, 0);
		gl.uniform1f(Q.uMx, mx);
		gl.uniform1f(Q.uSt, 1);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(G.cv, 0, G.cv.height - hh, w, hh, 0, 0, w, hh);
		return true;
	};

	return {
		frame,
		get noGL() {
			return G.noGL;
		},
		destroy() {
			G.gl?.getExtension('WEBGL_lose_context')?.loseContext();
		},
	};
}

