// Hero (Stub aus A0): Berg, Sonne = Zeichen, Organ, Zerfall, Tauchgang. Final-Logik 1:1, dt-basiert.
// B1 ersetzt: Montage-Auftakt, Match-Cut Berg -> Organ, Wischfront, Hochformat. Schreibt ctx.stage.
import { cl, ss, lerp, ease, damp, HOME, HOME3 } from '../lib.js';
import { VS, sceneSrc, POST } from './hero.glsl.js';

const TEX = 1280;
const B = new Float32Array(32), O = new Float32Array(32);
let el, cv, gl, S, Pp, tx, fb, tier = '', ad = 1, lastT = 0, sm = [0.3, 0.1], dead = false;

const compile = (type, src, k) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('shader ' + k, gl.getShaderInfoLog(s)); return s; };
const prog = (vs, src, names, k) => { const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, src, k)); gl.bindAttribLocation(pr, 0, 'a'); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) console.error('link ' + k, gl.getProgramInfoLog(pr)); const U = {}; names.forEach((n) => (U[n] = gl.getUniformLocation(pr, n))); return { pr, U }; };

const build = (ctx) => {
  tier = ctx.tier; const vs = compile(gl.VERTEX_SHADER, VS, 'vs');
  S = prog(vs, sceneSrc(tier === 'mobile'), ['uR', 'T', 'uM', 'uB', 'uMix', 'uLook', 'uK', 'uO', 'uC', 'uH'], 'scene');
  Pp = prog(vs, POST, ['uT', 'uR', 'uS', 'uD'], 'post');
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TEX, TEX, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

export default {
  init(root, ctx) {
    el = root; cv = el.querySelector('canvas');
    gl = cv.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) { dead = true; el.classList.add('nogl'); return; }
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); dead = true; });
    cv.addEventListener('webglcontextrestored', () => { build(ctx); dead = false; });
    build(ctx);
  },
  resize(ctx) {
    if (!cv) return; const w = Math.round(ctx.vw * ctx.dpr), h = Math.round(ctx.vh * ctx.dpr);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    if (gl && tier !== ctx.tier && !dead) build(ctx);
  },
  frame(t, dt, ctx) {
    if (dead || !gl || gl.isContextLost()) return;
    const tl = ctx.tl, { look, mx, split, zoom, dive } = tl, mobile = ctx.tier === 'mobile', w = cv.width, hh = cv.height;
    // adaptiver Szenenpuffer (Regler ad), gemessen an der echten Frame-Zeit dieser Szene
    const now = performance.now() / 1000, raw = now - lastT; lastT = now;
    if (raw < 0.5) { if (raw > 0.05) ad = Math.max(0.25, ad * 0.9); else if (raw < 0.022) ad = Math.min(1, ad * 1.02); }
    // Licht: Zeiger/Halten oder Autopilot
    const L = ctx.light, tm = L.on ? [(L.x / ctx.vw) * 2 - 1, 1 - (L.y / ctx.vh) * 2] : [0.5 * Math.cos(t * 0.12), 0.4 * Math.sin(t * 0.16)];
    const k = damp(4, dt); sm[0] += (tm[0] - sm[0]) * k; sm[1] += (tm[1] - sm[1]) * k;
    // Körper: Auftakt aus der Ferne zusammenfügen, ein Klick wirft sie auseinander und sie kehren zurück
    const a0 = Math.max(ctx.ready ? ctx.readyT : 1e9, ctx.clickT), br = 1 + 0.03 * Math.sin((t * Math.PI) / 3);
    for (let i = 0; i < 8; i++) {
      const h = HOME[i], e = ctx.reduced || !i ? 1 : ease((t - a0 - i * 0.07) / 1.4), dx = h[0] - HOME[0][0], dy = h[1] - HOME[0][1], Ln = Math.hypot(dx, dy) || 1, far = 0.9 * (1 - e);
      B[i * 4] = h[0] + (dx / Ln) * far; B[i * 4 + 1] = h[1] + (dy / Ln) * far; B[i * 4 + 2] = 0; B[i * 4 + 3] = h[2] * br;
      const g = HOME3[i], f = 1 + 1.4 * split;
      O[i * 4] = g[0] * f + Math.sin(t * 0.3 + i * 1.7) * 0.25 * split; O[i * 4 + 1] = g[1] * f + Math.cos(t * 0.27 + i * 2.3) * 0.25 * split; O[i * 4 + 2] = ((i % 3) - 1) * 1.5 * split; O[i * 4 + 3] = g[2] * br;
    }
    const hx = O[0] + 7 / 110, hy = O[1] + 23 / 110, hr = 0.2 * (1 + dive * 2.2), cz = lerp(lerp(17, 6, zoom), -2.5, Math.pow(dive, 1.6)), cu = ss(dive * 1.6), cx0 = lerp(0, hx, cu), cy0 = lerp(0, hy, cu);
    // Lochkreis im Bildschirmraum für die Wohnung (B2 liest ctx.stage)
    const st = ctx.stage; if (cz > 0.05 && mx > 0.5) { const q = 1.6 / cz; st.holeX = ctx.vw / 2 + (hx - cx0) * q * ctx.vh; st.holeY = ctx.vh / 2 - (hy - cy0) * q * ctx.vh; st.holeR = hr * q * ctx.vh; } else { st.holeX = ctx.vw / 2; st.holeY = ctx.vh / 2; st.holeR = mx > 0.5 ? 1e4 : 0; }
    // Szenen-Pass klein, Post-Pass in voller Auflösung
    const allDots = mx >= 0.999, cs = (6 * hh) / 800;
    const fw = allDots ? Math.ceil(w / cs) : Math.max(mobile ? 120 : 160, Math.round(Math.min(TEX, ctx.vw * (mobile ? 0.9 : 0.42)) * ad)), fh = Math.min(TEX, allDots ? Math.ceil(hh / cs) : Math.round((fw * hh) / w));
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.viewport(0, 0, fw, fh); gl.useProgram(S.pr); const U = S.U;
    gl.uniform2f(U.uR, fw, fh); gl.uniform1f(U.T, t); gl.uniform2f(U.uM, sm[0], sm[1]); gl.uniform4fv(U.uB, B); gl.uniform4fv(U.uO, O);
    gl.uniform1f(U.uMix, mx); gl.uniform1f(U.uLook, look); gl.uniform1f(U.uK, lerp(0.5, 0.12, split)); gl.uniform3f(U.uC, cx0, cy0, cz); gl.uniform3f(U.uH, hx, hy, hr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, w, hh); gl.useProgram(Pp.pr); const Q = Pp.U;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tx); gl.uniform1i(Q.uT, 0);
    gl.uniform2f(Q.uR, w, hh); gl.uniform2f(Q.uS, fw / TEX, fh / TEX); gl.uniform1f(Q.uD, mx);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  },
  destroy() { if (gl) { const x = gl.getExtension('WEBGL_lose_context'); x && x.loseContext(); } gl = null; },
};
