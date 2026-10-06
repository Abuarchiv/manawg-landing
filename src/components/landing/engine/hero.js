export function hero() { // PORT
    const W = 1280, H = 800, dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const ss = x => { x = cl(x); return x * x * (3 - 2 * x); };
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = x => 1 - Math.pow(1 - cl(x), 4);
    const mono = px => `500 ${px}px "JetBrains Mono", monospace`;
    const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
    const fine = () => true;
    const ROOMS = [['KÜCHE',0,0,8,6,'Einkäufe · Vorräte'],['BAD',8,0,5,6,'Putzplan'],['ZIMMER · JONA',13,0,7,6,''],['FLUR',0,6,20,3,'Pinnwand · Chat'],['WOHNZIMMER',0,9,9,7,'Ausgaben · Fixkosten'],['ZIMMER · LEA',9,9,5,7,''],['ZIMMER · LINA',14,9,6,7,'']];
    const STOPS = [{cx:10,cy:8,u:26,ox:780,oy:470,room:-1},{cx:4,cy:3,u:62,ox:840,oy:420,room:0},{cx:4.5,cy:12.5,u:52,ox:840,oy:420,room:4},{cx:10.5,cy:3,u:80,ox:840,oy:420,room:1},{cx:10,cy:7.5,u:48,ox:840,oy:420,room:3},{cx:10,cy:8,u:24,ox:640,oy:300,room:-1}];
    const WALLS = []; ROOMS.forEach(r => { const x = r[1], y = r[2], w = r[3], hh = r[4]; WALLS.push([x, y, x + w, y], [x + w, y, x + w, y + hh], [x, y + hh, x + w, y + hh], [x, y, x, y + hh]); });
    WALLS.sort((a, b) => (a[0] + a[1] + a[2] + a[3]) - (b[0] + b[1] + b[2] + b[3]));
    const PEOC = [['LINA', 0.62], ['MIKA', 0.5], ['JONA', 0.42], ['LEA', 0.34]];
    const drawC = (s, t, now) => {
      const c = s.ctx, q = s.sp * 5, i = Math.min(4, Math.floor(q)), e = ss((q - i - 0.2) / 0.6), A = STOPS[i], B = STOPS[i + 1];
      const cx = lerp(A.cx, B.cx, e), cy = lerp(A.cy, B.cy, e), u = Math.exp(lerp(Math.log(A.u), Math.log(B.u), e)), ox = lerp(A.ox, B.ox, e), oy = lerp(A.oy, B.oy, e);
      const P = (x, y, zz) => [ox + ((x - cx) - (y - cy)) * 0.866 * u, oy + ((x - cx) + (y - cy)) * 0.5 * u - zz * u];
      const lit = ROOMS.map((r, ri) => { let v = 0; STOPS.forEach((S, j) => { if (S.room === ri) v = Math.max(v, 1 - Math.abs(q - j) * 1.4); }); return cl(v); });
      const focus = lit.indexOf(Math.max(...lit));
      c.fillStyle = '#0A0A0A'; c.fillRect(0, 0, W, H);
      const mx = s.sm.x, my = s.sm.y, FL = 210, stp = Math.max(0.12, (fine() ? 5.5 : 8) / u);
      c.fillStyle = '#FAFAFA';
      ROOMS.forEach((r, ri) => {
        const x = r[1], y = r[2], w = r[3], hh = r[4], base = 0.06 + 0.8 * lit[ri];
        for (let gy = 0, yy = y + stp / 2; yy < y + hh; yy += stp, gy++) for (let gx = 0, xx = x + stp / 2; xx < x + w; xx += stp, gx++) {
          const pt = P(xx, yy, 0); if (pt[0] < -4 || pt[1] < -4 || pt[0] > W || pt[1] > H) continue;
          let I = base; if (s.m.in) { const dm = Math.hypot(pt[0] - mx, pt[1] - my); if (dm < FL) I += 0.8 * (1 - dm / FL) ** 2; }
          if (I > BAYER[(gy & 3) * 4 + (gx & 3)] / 16 + 0.02) c.fillRect(pt[0], pt[1], 1.6, 1.6);
        }
      });
      if (!s.pp) s.pp = PEOC.map((_, k) => ({ x: 2 + k * 4, y: 7.5, tx: 2 + k * 4, ty: 7.5, nt: 0 }));
      s.pp.forEach((pp, k) => {
        if (lit[focus] > 0.5) { const r = ROOMS[focus]; pp.tx = r[1] + r[3] * (0.3 + 0.4 * (k % 2)); pp.ty = r[2] + r[4] * (0.3 + 0.4 * (k > 1 ? 1 : 0)); }
        else if (now > pp.nt) { const r = ROOMS[Math.floor(Math.random() * ROOMS.length)]; pp.tx = r[1] + r[3] * (0.25 + Math.random() * 0.5); pp.ty = r[2] + r[4] * (0.25 + Math.random() * 0.5); pp.nt = now + 2.5 + Math.random() * 3; }
        pp.x += (pp.tx - pp.x) * 0.02; pp.y += (pp.ty - pp.y) * 0.02;
      });
      const HW = 1.1;
      WALLS.forEach(wl => {
        const a = P(wl[0], wl[1], 0), b = P(wl[2], wl[3], 0), a2 = P(wl[0], wl[1], HW), b2 = P(wl[2], wl[3], HW);
        c.globalAlpha = 0.92; c.fillStyle = '#0A0A0A'; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b2[0], b2[1]); c.lineTo(a2[0], a2[1]); c.closePath(); c.fill();
        c.globalAlpha = 0.3; c.strokeStyle = '#FAFAFA'; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.moveTo(a[0], a[1]); c.lineTo(a2[0], a2[1]); c.moveTo(b[0], b[1]); c.lineTo(b2[0], b2[1]); c.stroke();
        c.globalAlpha = 0.9; c.beginPath(); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); c.stroke();
      });
      c.globalAlpha = 1;
      s.pp.forEach((pp, k) => {
        const pt = P(pp.x, pp.y, 0.45), r = PEOC[k][1] * u * 0.5;
        c.fillStyle = '#FAFAFA'; c.beginPath(); c.arc(pt[0], pt[1], r, 0, 6.2832); c.fill();
        c.fillStyle = '#0A0A0A'; c.beginPath(); c.arc(pt[0] + r * 0.12, pt[1] - r * 0.28, r * 0.22, 0, 6.2832); c.fill();
        c.font = mono(11); c.fillStyle = 'rgba(250,250,250,0.72)'; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillText(PEOC[k][0], pt[0], pt[1] - r - 8);
      });
      ROOMS.forEach((r, ri) => {
        const pt = P(r[1] + r[3] / 2, r[2] + r[4] / 2, 0); c.textAlign = 'center';
        c.globalAlpha = 0.6 + 0.4 * lit[ri]; c.font = mono(11); c.fillStyle = '#FAFAFA'; c.fillText(r[0], pt[0], pt[1]);
        if (false && lit[ri] > 0.05 && r[5]) { c.globalAlpha = lit[ri]; c.font = '600 15px "Inter Tight", sans-serif'; c.fillText(r[5], pt[0], pt[1] + 20); }
      });
      c.globalAlpha = 1;
      if (s.m.in) { c.strokeStyle = 'rgba(250,250,250,0.6)'; c.beginPath(); c.arc(mx, my, 18, 0, 6.2832); c.stroke(); c.fillStyle = '#FAFAFA'; c.fillRect(mx - 1.5, my - 1.5, 3, 3); }
    };


    const BASE = [[200,198,80],[77,105,52],[142,302,33],[274,297,44],[194,32,29],[288,70,42],[360,177,56],[42,239,44]];
    const HOME = BASE.map(b => [(b[0] - 208) / 600, -(b[1] - 173) / 600, b[2] / 600]);
    const HOME3 = BASE.map(b => [(b[0] - 208) / 110, -(b[1] - 173) / 110, b[2] / 110]);
    const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;
    const HEAD = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 uR; uniform float T; uniform vec2 uM; uniform vec4 uB[8];
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
vec2 UV(){ return (gl_FragCoord.xy - .5 * uR) / uR.y; }
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
    const G = { cv: null, gl: null, lostAt: 0 };
    const initGL = () => {
      const gl = G.cv.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true }); if (!gl) return false; G.gl = gl;
      const sh = (t, src, k) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('shader ' + k, gl.getShaderInfoLog(s)); return s; };
      const vs = sh(gl.VERTEX_SHADER, VS, 'vs');
      const prog = (src, names, k) => { const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, src, k)); gl.bindAttribLocation(pr, 0, 'a'); gl.linkProgram(pr);
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) console.error('link ' + k, gl.getProgramInfoLog(pr)); const U = {}; names.forEach(n => U[n] = gl.getUniformLocation(pr, n)); return { pr, U }; };
      G.S = prog(SCENE, ['uR', 'T', 'uM', 'uB', 'uMix', 'uLook', 'uK', 'uO', 'uC', 'uH', 'uSt'], 'scene');
      G.Pp = prog(POST, ['uT', 'uR', 'uS', 'uD', 'uL', 'uMx', 'uSt'], 'post');
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      G.tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, G.tx); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      G.fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, G.fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, G.tx, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return true;
    };
    const fresh = () => { G.cv = document.createElement('canvas'); G.gl = null; G.cv.addEventListener('webglcontextlost', e => { e.preventDefault(); G.gl = null; G.lostAt = performance.now(); }); initGL(); };
    fresh();
    const mk = k => {
      const V = this.V[k], wrap = document.getElementById(V.id), root = wrap && wrap.children[1]; if (!root) return null;
      const sc = root.firstElementChild, stage = sc && sc.firstElementChild && sc.firstElementChild.firstElementChild; if (!stage) return null;
      const cv = stage.children[0], fcv = stage.children[1]; const ctx = cv.getContext('2d'), fctx = fcv.getContext('2d'); if (!ctx || !fctx) return null;
      const s = { V, root, sc, cv, fcv, ctx, k, q: 0, fq: 0, m: { x: 640, y: 400, in: false }, sm: [0.3, 0.1], a0: null, sp: 0,
        chs: [...root.querySelectorAll('[data-ch]')], ctas: [...root.querySelectorAll('[data-cta]')], hb: root.querySelector('[data-hand="back"]'), hf: root.querySelector('[data-hand="front"]'), clickT: -9, ht: { x: 860, y: 430 } };
      [s.hb, s.hf].forEach(c => { if (c) { c.width = W; c.height = H; } }); s.endov = root.querySelector('[data-endov]'); s.fl = stage.querySelector('[data-flood]'); if (s.fl) { s.fl.width = W; s.fl.height = H; }
      s.fp = { ctx: fctx, sp: 0, m: s.m, sm: { x: 640, y: 400 } };
      const mv = e => { const r = root.getBoundingClientRect(); s.m.x = (e.clientX - r.left) * W / r.width; s.m.y = (e.clientY - r.top) * H / r.height; s.m.in = true; };
      const lv = () => { s.m.in = false; };
      const dn = e => { mv(e); s.clickT = performance.now() / 1000; if (!s.endOn) s.a0 = s.clickT; };
      root.addEventListener('pointermove', mv); root.addEventListener('pointerleave', lv); root.addEventListener('pointerdown', dn);
      s.off = () => { root.removeEventListener('pointermove', mv); root.removeEventListener('pointerleave', lv); root.removeEventListener('pointerdown', dn); };
      const go = e => { const el = e.target.closest && e.target.closest('[data-go]'); if (!el) return; const tg = sc.querySelector('[data-sec="' + el.getAttribute('data-go') + '"]'); if (!tg) return; sc.scrollTo({ top: tg.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 110, behavior: 'smooth' }); };
      const scr = e => { const el = e.target.closest && e.target.closest('[data-scr]'); if (!el || el.__busy) return; const orig = el.textContent, CH = '@%#*+=-:'; el.__busy = 1; let fr = 0; const run = () => { fr++; el.textContent = orig.split('').map((c, i) => c === ' ' || i < fr / 2 ? c : CH[Math.floor(Math.random() * CH.length)]).join(''); if (fr / 2 < orig.length) requestAnimationFrame(run); else { el.textContent = orig; el.__busy = 0; } }; run(); };
      root.addEventListener('click', go); root.addEventListener('pointerover', scr);
      const off0 = s.off; s.off = () => { off0(); root.removeEventListener('click', go); root.removeEventListener('pointerover', scr); };
      const ldr = root.querySelector('[data-loader]'); if (ldr && ldr.style.opacity !== '0') { ldr.__done = 1; const cnt = ldr.querySelector('[data-count]'), bar = ldr.querySelector('[data-bar]'), l0 = performance.now(), dur = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1700;
        const tick = () => { const k = Math.min(1, (performance.now() - l0) / dur), e = 1 - Math.pow(1 - k, 3); if (cnt) cnt.textContent = String(Math.round(e * 100)).padStart(3, '0'); if (bar) bar.textContent = '#'.repeat(Math.round(e * 40)).padEnd(40, '.'); if (k >= 1) { clearInterval(iv); ldr.style.opacity = '0'; ldr.style.pointerEvents = 'none'; } }; const iv = setInterval(tick, 30); tick(); }
      return s;
    };

    const HB = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
    const hsh = (i, j) => { let h = (i * 374761393 + j * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
    const cap = (px, py, ax, ay, bx, by, r) => { const pax = px - ax, pay = py - ay, bax = bx - ax, bay = by - ay; const h = cl((pax * bax + pay * bay) / (bax * bax + bay * bay)); return Math.hypot(pax - bax * h, pay - bay * h) - r; };
    const smn = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
    const PCX = 800, PCY = 400;
    const uc = (px, py, ax, ay, bx, by, ra, rb) => { const x = px - ax, y = py - ay, ex = bx - ax, ey = by - ay, h = ex * ex + ey * ey; let qx = Math.abs((x * ey - y * ex) / h); const qy = (x * ex + y * ey) / h;
      const bb = ra - rb, cx = Math.sqrt(Math.max(h - bb * bb, 1e-6)), cy = bb, k = cx * qy - cy * qx, m = cx * qx + cy * qy, n = qx * qx + qy * qy;
      if (k < 0) return Math.sqrt(h * n) - ra; if (k > cx) return Math.sqrt(h * (n + 1 - 2 * qy)) - rb; return m - ra; };
    const FR = [[232, 1.0], [318, 1.05], [402, 0.98], [482, 0.84]];
    const holdBack = (x, y) => { let d = (Math.hypot((x - 790) / 178, (y - 748) / 96) - 1) * 96;
      d = smn(d, uc(x, y, 770, 800, 690, 1160, 122, 142), 60);
      d = smn(d, (Math.hypot((x - 905) / 66, (y - 690) / 92) - 1) * 66, 34);
      d = smn(d, (Math.hypot((x - 640) / 74, (y - 705) / 96) - 1) * 74, 40);
      for (const g of FR) { const s = g[1], y0 = g[0]; let e = uc(x, y, 900, y0 + 30, 980, y0 + 6, 25 * s, 23 * s); e = smn(e, Math.hypot(x - 986, y - y0 - 2) - 24 * s, 6); e = smn(e, uc(x, y, 986, y0 - 1, 972, y0 - 8, 22 * s, 20 * s), 5); d = smn(d, e, 3); }
      return d; };
    const holdFront = (x, y) => { let d = uc(x, y, 612, 692, 600, 560, 40, 32); d = smn(d, uc(x, y, 600, 560, 616, 466, 31, 27), 5); d = smn(d, uc(x, y, 616, 466, 652, 412, 26, 21), 5);
      for (const g of FR) { const s = g[1], y0 = g[0]; let e = uc(x, y, 986, y0 - 1, 972, y0 - 8, 22 * s, 20 * s); e = smn(e, uc(x, y, 968, y0 - 8, 938, y0 - 12, 19 * s, 15.5 * s), 4); d = Math.min(d, e); }
      return d; };
    const nail = (x, y, ax, ay, bx, by, t0, L, w) => { const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, px = x - ax, py = y - ay, al = px * ux + py * uy, pe = -px * uy + py * ux, c = t0 * l; const q = ((al - c) / L) ** 2 + (pe / w) ** 2; return q; };
    const phoneBox = (x, y) => { const qx = Math.abs(x - PCX) - 104, qy = Math.abs(y - PCY) - 264; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - 46; };
    const LX = -0.5, LY = -0.62, LZ = 0.6;
    const shN = (fn, x, y, d, R) => { const gx = fn(x + 1.5, y) - d, gy = fn(x, y + 1.5) - d, h = Math.sqrt(cl(-d / R)), sl = (1 - h) * 2.2; const nx = gx / 1.5 * sl, ny = gy / 1.5 * sl, l = Math.hypot(nx, ny, 1);
      const lam = Math.max(0, (nx * LX + ny * LY + LZ) / l), sp = Math.pow(lam, 12) * 0.35; return Math.pow(h, 0.3) * (0.1 + 0.85 * lam) + sp; };
    const lightF = (x, y) => 0.45 + 0.55 * cl(1 - ((x - 450) + (y - 120)) / 1100);
    const drawHands = (s, t, now) => {
      const ink = s.V.light ? '#0A0A0A' : '#FAFAFA', step = s.V.st === 3 ? 7 : 2.5, asc = s.V.st === 3;
      const tg = s.m.in && s.endOn ? [s.m.x, s.m.y] : [840 + Math.sin(t * 0.7) * 50, 380 + Math.cos(t * 0.5) * 80];
      s.ht.x += (tg[0] - s.ht.x) * 0.3; s.ht.y += (tg[1] - s.ht.y) * 0.3;
      const pr = now - s.clickT, push = pr < 0.4 ? Math.sin(pr / 0.4 * Math.PI) : 0;
      const ax = 1460 - s.ht.x, ay = 1020 - s.ht.y, AL = Math.hypot(ax, ay) || 1, ux = ax / AL, uy = ay / AL, nx = -uy, ny = ux;
      const sc = 1 - push * 0.06, tx = s.ht.x + ux * (6 + push * 4), ty = s.ht.y + uy * (6 + push * 4);
      const P = (a, b) => [tx + (ux * a + nx * b) * sc, ty + (uy * a + ny * b) * sc];
      const S = [[P(0, 0), P(34, 0), 15, 16.5], [P(34, 0), P(74, 0), 16.5, 17.5], [P(74, 0), P(132, 2), 17.5, 19.5],
        [P(140, 8), P(250, 26), 46, 58],
        [P(150, 38), P(118, 46), 20, 19], [P(118, 46), P(112, 64), 19, 17],
        [P(160, 66), P(130, 74), 19, 18], [P(130, 74), P(126, 90), 18, 16],
        [P(172, 92), P(146, 100), 16, 15], [P(146, 100), P(142, 114), 15, 13],
        [P(250, -40), P(190, -40), 30, 26], [P(190, -40), P(140, -28), 26, 21], [P(140, -28), P(104, -16), 21, 18],
        [P(260, 30), P(820, 40), 72, 92]];
      const KS = [0, 4, 4, 16, 8, 4, 8, 4, 8, 4, 14, 5, 4, 34];
      const point = (x, y) => { let d = 1e9; for (let q = 0; q < S.length; q++) { const g = S[q]; const e = uc(x, y, g[0][0], g[0][1], g[1][0], g[1][1], g[2] * sc, g[3] * sc); d = q ? smn(d, e, KS[q]) : e; } return d; };
      const cb = s.hb.getContext('2d'), cf = s.hf.getContext('2d'); cb.clearRect(0, 0, W, H); cf.clearRect(0, 0, W, H); cb.fillStyle = ink; cf.fillStyle = ink;
      const RAMPH = ' .:-=+*#%@'; if (asc) { [cb, cf].forEach(c => { c.font = '500 9px "JetBrains Mono", monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; }); }
      const dot = (c, x, y, v, i, j) => { if (asc) { if (v > 0.06) c.fillText(RAMPH[Math.min(9, 1 + Math.floor(v * 8.5))], x, y); return; } v *= 0.78 + 0.4 * hsh(i, j); if (v > HB[(j & 3) * 4 + (i & 3)] / 16 + 0.035) { const z = 0.9 + 1.5 * Math.min(1, v); c.fillRect(x - z / 2, y - z / 2, z, z); } };
      const CG = 12, cw = Math.ceil(W / CG), chh = Math.ceil(H / CG); if (!s.cm || s.cm.length !== cw * chh) s.cm = new Uint8Array(cw * chh);
      const tipFar = P(800, 10);
      for (let cj = 0; cj < chh; cj++) for (let ci = 0; ci < cw; ci++) { const x = ci * CG + 6, y = cj * CG + 6; let m = 0;
        if (holdBack(x, y) < 40 || phoneBox(x, y) < 60) m |= 1; if (holdFront(x, y) < 26) m |= 2;
        if (cap(x, y, tx, ty, tipFar[0], tipFar[1], 160) < 0 && point(x, y) < 36) m |= 4; s.cm[cj * cw + ci] = m; }
      for (let y = 1.5, j = 0; y < H; y += step, j++) for (let x = 1.5, i = 0; x < W; x += step, i++) {
        const m = s.cm[Math.floor(y / CG) * cw + Math.floor(x / CG)]; if (!m) continue; const lf = lightF(x, y);
        if (m & 1) { const pb = phoneBox(x, y); if (pb > 0) { let v = 0; const d = holdBack(x, y);
          if (d < 0) { v = shN(holdBack, x, y, d, 70) * (0.45 + 0.6 * lf) * cl(1 - (y - 760) / 320); if (d > -2.6 && x < 880) v = Math.max(v, 0.95 * lf); v *= 0.35 + 0.65 * cl(pb / 26); } else if (d < 18) v = 0.18 * Math.exp(-d / 5) * lf * (hsh(j, i) < 0.4 ? 1 : 0);
          if (pb < 3) v = Math.max(v, 0.85);
          if (v > 0.02) dot(cb, x, y, v, i, j); } }
        let v2 = 0;
        if (m & 2) { const d = holdFront(x, y); if (d < 0) { v2 = shN(holdFront, x, y, d, 30) * (0.55 + 0.55 * lf); if (d > -2.2) v2 = Math.max(v2, 0.9 * lf + 0.1); const nq = nail(x, y, 616, 466, 652, 412, 0.72, 14, 11); if (nq < 1) v2 = nq > 0.72 ? v2 * 0.45 : Math.min(1, v2 * 0.6 + 0.4); } else if (d < 8) v2 = 0.16 * Math.exp(-d / 3); }
        if (m & 4) { const d = point(x, y); const fade = cl(1 - (Math.hypot(x - tx, y - ty) - 300) / 420); let v = 0;
          if (d < 0) { v = shN(point, x, y, d, 44) * (0.6 + 0.45 * lf + push * 0.25) * fade; if (d > -2.4) v = Math.max(v, 0.92 * fade); const n0 = P(4, 0), n1 = P(30, 0), nq = nail(x, y, n0[0], n0[1], n1[0], n1[1], 0.5, 12, 10); if (nq < 1) v = nq > 0.7 ? v * 0.45 : Math.min(1, v * 0.6 + 0.38); } else if (d < 14) v = 0.16 * Math.exp(-d / 4) * fade * (hsh(i, j + 3) < 0.45 ? 1 : 0); v2 = Math.max(v2, v); }
        if (v2 > 0.02) dot(cf, x, y, v2, i, j);
      }
      if (pr < 0.8) { const rr = 10 + pr * 150, a = 1 - pr / 0.8; cf.globalAlpha = a; for (let k = 0; k < 72; k++) { const an = k / 72 * 6.2832; cf.fillRect(s.ht.x + Math.cos(an) * rr - 1, s.ht.y + Math.sin(an) * rr - 1, 2, 2); } cf.globalAlpha = 1; }
    };
    const vnz = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hsh(xi, yi), b = hsh(xi + 1, yi), c = hsh(xi, yi + 1), d = hsh(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
    this.sc = [];
    const t0 = performance.now() / 1000, B = new Float32Array(32), O = new Float32Array(32);
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      if (!G.gl || G.gl.isContextLost()) { if (!G.lostAt) G.lostAt = performance.now(); if (performance.now() - G.lostAt > 800) { G.lostAt = 0; fresh(); } return; }
      G.lostAt = 0;
      const gl = G.gl, now = performance.now() / 1000, t = now - t0;
      const dt = this.last ? now - this.last : 0.016; this.last = now; this.ad = this.ad ?? 1;
      if (dt > 0.2) this.ad = 0.25; else if (dt > 0.05) this.ad = Math.max(0.25, this.ad * 0.9); else if (dt < 0.022) this.ad = Math.min(1, this.ad * 1.02);
      this.fr = (this.fr || 0) + 1; let drawn = 0;
      for (let kk = 0; kk < 1; kk++) try {
        const k = (kk + this.fr) % 1; if (drawn >= 1) break;
        let s = this.sc[k]; const cur = document.getElementById(this.V[k].id)?.querySelector('canvas');
        if (!s || !s.cv.isConnected || s.cv !== cur) { if (s) s.off(); s = this.sc[k] = mk(k); if (!s) continue; }
        const r = s.root.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth || r.width < 2) continue;
        if (s.a0 === null) s.a0 = now; if (s.sc.scrollTop > 7300 && !this.props.tour) continue;
        if (this.props.tour && !s.m.in) { s.sc.scrollTop += 3; if (s.sc.scrollTop >= s.sc.scrollHeight - s.sc.clientHeight - 1) s.sc.scrollTop = 0; }
        const P0 = Math.min(1, s.sc.scrollTop / 6400); s.sp += (P0 - s.sp) * (1 - Math.exp(-Math.min(dt, 0.5) * 10)); if (Math.abs(P0 - s.sp) < 1e-4) s.sp = P0; const P = s.sp;
        const look = ss((P - 0.06) / 0.14), mx = ss((P - 0.18) / 0.06), split = ss((P - 0.24) / 0.1) * (1 - ss((P - 0.36) / 0.1)), zoom = ss((P - 0.22) / 0.2), dive = ss((P - 0.48) / 0.12);
        const fpA = ss((P - 0.58) / 0.05), endA = ss((P - 0.9) / 0.05);
        s.root.style.setProperty('--p', P.toFixed(4)); s.root.style.setProperty('--g', (1 - fpA).toFixed(3)); s.root.style.setProperty('--f', (fpA * (1 - endA)).toFixed(3)); s.root.style.setProperty('--e', endA.toFixed(3)); { const fs = cl((P - 0.62) / 0.28) * 5; for (let j = 0; j < 4; j++) s.root.style.setProperty('--c' + j, (fpA * (1 - endA) * ss(1.7 - Math.abs(fs - (j + 1)) * 2.4)).toFixed(3)); }
        const ch = P < 0.2 ? 0 : P < 0.58 ? 1 : P < 0.9 ? 2 : 3; 
        s.ctas.forEach(el => { el.style.pointerEvents = endA > 0.6 ? 'auto' : 'none'; }); s.endOn = endA > 0.6 && s.sc.scrollTop < 6700; if (s.endov) s.endov.style.transform = 'translateY(' + (-Math.max(0, s.sc.scrollTop - 6400)) + 'px)'; s.root.style.cursor = s.endOn ? 'none' : ''; if (endA > 0.01 && s.hb && s.hf) drawHands(s, t, now);
        s.ctas.forEach(el => { const off = !(endA > 0.6); if (el.inert !== off) el.inert = off; }); // PORT: unsichtbare CTAs nicht fokussierbar
        const tm = s.m.in ? [(s.m.x - 640) / 640, (400 - s.m.y) / 400] : [0.5 * Math.cos(t * 0.12 + k * 2), 0.4 * Math.sin(t * 0.16 + k)];
        s.sm[0] += (tm[0] - s.sm[0]) * 0.06; s.sm[1] += (tm[1] - s.sm[1]) * 0.06;
        if (fpA < 0.999) {
          const br = 1 + 0.03 * Math.sin(t * Math.PI / 3);
          for (let i = 0; i < 8; i++) {
            const h = HOME[i], e = i ? ease((now - s.a0 - i * 0.07) / 1.4) : 1, dx = h[0] - HOME[0][0], dy = h[1] - HOME[0][1], L = Math.hypot(dx, dy) || 1, far = 0.9 * (1 - e);
            B[i * 4] = h[0] + dx / L * far; B[i * 4 + 1] = h[1] + dy / L * far; B[i * 4 + 2] = 0; B[i * 4 + 3] = h[2] * br;
            const g = HOME3[i], f = 1 + 1.4 * split;
            O[i * 4] = g[0] * f + Math.sin(t * 0.3 + i * 1.7) * 0.25 * split; O[i * 4 + 1] = g[1] * f + Math.cos(t * 0.27 + i * 2.3) * 0.25 * split; O[i * 4 + 2] = ((i % 3) - 1) * 1.5 * split; O[i * 4 + 3] = g[2] * br;
          }
          const hx = O[0] + 7 / 110, hy = O[1] + 23 / 110, hr = 0.2 * (1 + dive * 2.2), cz = lerp(lerp(17, 6, zoom), -2.5, Math.pow(dive, 1.6));
          const allDots = s.V.dots || mx >= 0.999;
          const qo = Math.round(Math.min(1, Math.max(0.3, r.width / W * dpr)) * 20) / 20;
          if (qo !== s.q) { s.q = qo; s.cv.width = Math.round(W * qo); s.cv.height = Math.round(H * qo); }
          const w = s.cv.width, hh = s.cv.height;
          const fw = allDots ? Math.ceil(W / 6) : Math.max(160, Math.round(W * 0.42 * this.ad * qo)), fh = allDots ? Math.ceil(H / 6) : Math.round(fw * H / W);
          gl.bindFramebuffer(gl.FRAMEBUFFER, G.fb); gl.viewport(0, 0, fw, fh); gl.useProgram(G.S.pr); const U = G.S.U;
          gl.uniform2f(U.uR, fw, fh); gl.uniform1f(U.T, t); gl.uniform2f(U.uM, s.sm[0], s.sm[1]); gl.uniform4fv(U.uB, B); gl.uniform4fv(U.uO, O);
          gl.uniform1f(U.uMix, mx); gl.uniform1f(U.uSt, s.V.st); gl.uniform1f(U.uLook, look); gl.uniform1f(U.uK, lerp(0.5, 0.12, split));
          gl.uniform3f(U.uC, lerp(0, hx, ss(dive * 1.6)), lerp(0, hy, ss(dive * 1.6)), cz); gl.uniform3f(U.uH, hx, hy, hr);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          if (G.cv.width < w) G.cv.width = w; if (G.cv.height < hh) G.cv.height = hh;
          gl.viewport(0, 0, w, hh); gl.useProgram(G.Pp.pr); const Q = G.Pp.U;
          gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, G.tx); gl.uniform1i(Q.uT, 0);
          gl.uniform2f(Q.uR, w, hh); gl.uniform2f(Q.uS, fw / W, fh / H); gl.uniform1f(Q.uD, s.V.dots ? 1 : mx); gl.uniform1f(Q.uL, s.V.light); gl.uniform1f(Q.uMx, mx); gl.uniform1f(Q.uSt, s.V.st);
          gl.drawArrays(gl.TRIANGLES, 0, 3); drawn++;
          s.ctx.drawImage(G.cv, 0, G.cv.height - hh, w, hh, 0, 0, w, hh);
        }
        if (fpA > 0.001 && endA < 0.999) {
          const fq = Math.round(Math.min(1.25, Math.max(0.3, r.width / W * dpr)) * 20) / 20;
          if (fq !== s.fq) { s.fq = fq; s.fcv.width = Math.round(W * fq); s.fcv.height = Math.round(H * fq); }
          s.fp.ctx.setTransform(s.fcv.width / W, 0, 0, s.fcv.width / W, 0, 0);
          s.fp.sp = cl((P - 0.62) / 0.28); if (s.m.in) { s.fp.sm.x += (s.m.x - s.fp.sm.x) * 0.25; s.fp.sm.y += (s.m.y - s.fp.sm.y) * 0.25; }
          drawC(s.fp, t, now);
        }
        if (s.fl) { const cover = Math.max(ss((P - 0.5) / 0.07) * (1 - ss((P - 0.66) / 0.12)), ss((P - 0.84) / 0.05) * (1 - ss((P - 0.94) / 0.05))), fx = s.fl.getContext('2d'); fx.clearRect(0, 0, W, H);
          if (cover > 0.001) { const cs = 32, cols = 40, rows = 25; if (!s.tr) s.tr = new Float32Array(cols * rows); const tr = s.tr; for (let q = 0; q < tr.length; q++) tr[q] *= 0.985;
            if (s.m.in) { const mi = Math.floor(s.m.x / cs), mj = Math.floor(s.m.y / cs); for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const a = mi + di, b = mj + dj; if (a >= 0 && b >= 0 && a < cols && b < rows) { const g = Math.max(0, 1 - Math.hypot(di, dj) / 2.6); tr[b * cols + a] = Math.max(tr[b * cols + a], g); } } }
            const on = new Uint8Array(cols * rows);
            for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) { const n = vnz(a * 0.13 + t * 0.03, b * 0.13 - t * 0.02); const pk = (b < 3 && a < 9) || (b < 3 && a > 33) ? 0.5 : 0; on[b * cols + a] = (n + cover * 0.55 - 0.45 + (b / rows) * 0.2 - pk > 0.5 && tr[b * cols + a] < 0.3) ? 1 : 0; }
            fx.fillStyle = '#FAFAFA'; for (let q = 0; q < on.length; q++) if (on[q]) fx.fillRect((q % cols) * cs, Math.floor(q / cols) * cs, cs, cs);
            fx.font = '500 10px "JetBrains Mono", monospace'; fx.textAlign = 'center'; fx.textBaseline = 'middle'; fx.fillStyle = 'rgba(250,250,250,0.6)';
            for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) { if (on[b * cols + a]) continue; let c = 0; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const x = a + di, y = b + dj; if ((di || dj) && x >= 0 && y >= 0 && x < cols && y < rows && on[y * cols + x]) c++; } if (c) fx.fillText(String(c), a * cs + cs / 2, b * cs + cs / 2); }
            if (s.m.in) { fx.strokeStyle = '#FAFAFA'; fx.strokeRect(Math.floor(s.m.x / cs) * cs + 0.5, Math.floor(s.m.y / cs) * cs + 0.5, cs - 1, cs - 1); } } }
      } catch (err) { if (!this['e' + kk]) { this['e' + kk] = 1; console.error('scene ' + kk, err); } }
    };
return loop; // PORT
} // PORT
