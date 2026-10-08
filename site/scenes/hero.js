// Hero: Montage-Auftakt, Berg, Sonne = Zeichen, Match-Cut auf das Organ, Wischfront, Zerfall, Tauchgang.
// Schreibt ctx.stage (Lochkreis im Bildschirmraum) fuer die Wohnung. Alle Zeiten dt-basiert.
import { cl, ss, lerp, damp, backOut, spring, HOME, HOME3, MARK_K, SUN_S, ORG_S } from '../lib.js';
import { VS, sceneSrc, POST } from './hero.glsl.js';

const TEX = 1280;
const CUT = 0.24;                 // Match-Cut Berg -> Organ (Sonne hat Organ-Groesse erreicht)
const WIPE = [0.14, 0.26];        // Wischfront Berg-Ton -> Halbton
const ZOOM = [0.26, 0.42];        // Zoom erst nach dem Schnitt
const ORG_SC = (SUN_S / ORG_S) * 1.6 / 17;   // Sonnenmasstab, bei dem sie dem Organ bei cz=17 entspricht
const HOLE_R = 23 / ORG_S;
const MONT = { dur: 1.8, step: 0.09, breath: 0.5, wipe: [1.3, 2.2] };
const MONT_BODY = MONT.dur - 7 * MONT.step;
const FRONT = (w) => lerp(-0.08, 1.3, w);
const B = new Float32Array(32), O = new Float32Array(32);
const FORCE_HALF = new URLSearchParams(location.search).has('half');   // Halbton ueberall (fuer das Fallback-Bild)
let el, cv, stageEl, gl, S, Pp, tx, fb, tier = '', ad = 1, lastT = 0, sm = [0.3, 0.1], dead = false, ext = null, seenClick = -9, inDone = false, cur = '';
const ks = HOME.map(() => ({ x: 0, v: 0 })), kickAt = HOME.map(() => 1e9);

const mk = (vs, src, names, k) => {
  const fs = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fs, src); gl.compileShader(fs);
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.bindAttribLocation(pr, 0, 'a'); gl.linkProgram(pr);
  return { pr, fs, names, k, U: null };
};
// Status erst lesen, wenn der Treiber fertig ist (sonst blockiert er die Kompilierung)
const fin = (p) => {
  if (!gl.getShaderParameter(p.fs, gl.COMPILE_STATUS)) console.error('shader ' + p.k, gl.getShaderInfoLog(p.fs));
  if (!gl.getProgramParameter(p.pr, gl.LINK_STATUS)) console.error('link ' + p.k, gl.getProgramInfoLog(p.pr));
  p.U = {}; p.names.forEach((n) => (p.U[n] = gl.getUniformLocation(p.pr, n)));
};
const done = (p) => !ext || gl.getProgramParameter(p.pr, ext.COMPLETION_STATUS_KHR);

const build = (ctx) => {
  tier = ctx.tier; const vs = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vs, VS); gl.compileShader(vs);
  S = mk(vs, sceneSrc(tier === 'mobile'), ['uR', 'T', 'uM', 'uB', 'uMix', 'uLook', 'uK', 'uO', 'uC', 'uH', 'uSP', 'uFlat'], 'scene');
  Pp = mk(vs, POST, ['uT', 'uR', 'uS', 'uC', 'uRd'], 'post');
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TEX, TEX, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
const sync = (ctx) => { build(ctx); fin(S); fin(Pp); };

export default {
  async init(root, ctx) {
    el = root; cv = el.querySelector('canvas'); stageEl = el.parentElement;
    gl = cv.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) { dead = true; el.classList.add('nogl'); el.classList.add('in'); return; }
    ext = gl.getExtension('KHR_parallel_shader_compile');
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); dead = true; });
    cv.addEventListener('webglcontextrestored', () => { sync(ctx); dead = false; });
    if (!ctx.reduced) el.classList.add('arm');   // Zeilen-Masken erst scharf, wenn JS laeuft
    build(ctx);
    // Auftakt wartet auf die Shader-Kompilierung (hoechstens 800 ms), blockiert aber den Hauptthread nicht
    for (let i = 0; i < 50 && !(done(S) && done(Pp)); i++) await new Promise((r) => setTimeout(r, 16));
    fin(S); fin(Pp);
  },
  resize(ctx) {
    if (!cv) return; const w = Math.round(ctx.vw * ctx.dpr), h = Math.round(ctx.vh * ctx.dpr);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    if (gl && tier !== ctx.tier && !dead) sync(ctx);
  },
  frame(t, dt, ctx) {
    if (dead || !gl || gl.isContextLost() || !S.U) return;
    const tl = ctx.tl, { look, split, dive } = tl, P = ctx.P, mobile = ctx.tier === 'mobile', w = cv.width, hh = cv.height;
    const cut = P >= CUT, zoom = ss((P - ZOOM[0]) / (ZOOM[1] - ZOOM[0])), wipe = ss((P - WIPE[0]) / (WIPE[1] - WIPE[0]));
    // adaptiver Szenenpuffer (Regler ad), gemessen an der echten Frame-Zeit dieser Szene
    const now = performance.now() / 1000, raw = now - lastT; lastT = now;
    if (raw < 0.5) { if (raw > 0.05) ad = Math.max(0.25, ad * 0.9); else if (raw < 0.022) ad = Math.min(1, ad * 1.02); }
    // Licht: Zeiger/Halten oder Autopilot
    const L = ctx.light, tm = L.on ? [(L.x / ctx.vw) * 2 - 1, 1 - (L.y / ctx.vh) * 2] : [0.5 * Math.cos(t * 0.12), 0.4 * Math.sin(t * 0.16)];
    const k = damp(4, dt); sm[0] += (tm[0] - sm[0]) * k; sm[1] += (tm[1] - sm[1]) * k;

    // Montage: Zeit ab "ready", die acht Koerper fliegen radial herein und wachsen mit backOut
    const te = ctx.reduced ? 99 : ctx.ready ? t - ctx.readyT : -1;
    const mbr = te < MONT.dur ? 1 : te < MONT.dur + MONT.breath ? 1 + 0.06 * Math.sin((Math.PI * (te - MONT.dur)) / MONT.breath) : 1 + 0.015 * Math.sin((2 * Math.PI * (te - MONT.dur - MONT.breath)) / 6);
    const br = ctx.reduced ? 1 : mbr;
    if (ctx.clickT !== seenClick) { seenClick = ctx.clickT; if (te > MONT.dur && P < CUT) for (let i = 0; i < 8; i++) kickAt[i] = ctx.clickT + i * 0.05; }
    for (let i = 0; i < 8; i++) {
      const h = HOME[i], e = te >= 99 ? 1 : backOut((te - i * MONT.step) / MONT_BODY, 1.2), dx = h[0] - HOME[0][0], dy = h[1] - HOME[0][1], Ln = Math.hypot(dx, dy) || 1;
      if (t >= kickAt[i]) { kickAt[i] = 1e9; ks[i].x = 0.9; ks[i].v = 0; }
      const far = 0.9 * (1 - e) + spring(ks[i], 0, dt);
      B[i * 4] = h[0] + (dx / Ln) * far; B[i * 4 + 1] = h[1] + (dy / Ln) * far; B[i * 4 + 2] = 0; B[i * 4 + 3] = h[2] * br * Math.max(e, 0);
      // Zerfall: Querformat breitet sich seitlich aus, Hochformat gestaffelt nach oben und unten
      const g = HOME3[i], fx = 1 + (mobile ? 0.55 : 1.4) * split, fy = 1 + (mobile ? 2.4 : 1.4) * split, wob = (mobile ? 0.12 : 0.25) * split;
      O[i * 4] = g[0] * fx + Math.sin(t * 0.3 + i * 1.7) * wob; O[i * 4 + 1] = g[1] * fy + Math.cos(t * 0.27 + i * 2.3) * wob * (mobile ? 2 : 1); O[i * 4 + 2] = ((i % 3) - 1) * 1.5 * split; O[i * 4 + 3] = g[2] * br;
    }
    // Sonne: oberes Drittel, waechst bis zur Organ-Groesse und endet in der Bildmitte
    const asp = ctx.vw / ctx.vh, sx = lerp(sm[0] * (mobile ? 0.4 : 0.7), 0, look) * Math.min(1, asp), sy = lerp(mobile ? 0.3 + sm[1] * 0.06 : 0.3 + sm[1] * 0.1, 0, look), sc = lerp(mobile ? 0.2 : 0.15, ORG_SC, look * look);
    const hx = O[0] + 7 / ORG_S, hy = O[1] + 23 / ORG_S, hr = HOLE_R * (1 + dive * 2.2);
    const cz = lerp(lerp(17, mobile ? 10.5 : 6, zoom), -2.5, Math.pow(dive, 1.6)), cu = ss(dive * 1.6), cx0 = lerp(0, hx, cu), cy0 = lerp(0, hy, cu);
    // Lochkreis im Bildschirmraum fuer die Wohnung (B2 liest ctx.stage)
    const st = ctx.stage; if (cz > 0.05 && cut) { const q = 1.6 / cz; st.holeX = ctx.vw / 2 + (hx - cx0) * q * ctx.vh; st.holeY = ctx.vh / 2 - (hy - cy0) * q * ctx.vh; st.holeR = hr * q * ctx.vh; } else { st.holeX = ctx.vw / 2; st.holeY = ctx.vh / 2; st.holeR = cut ? 1e4 : 0; }
    // Wischfront: Montage zieht sich auf die Sonne zurueck, spaeter waechst sie als Berg -> Halbton
    const mfront = te < 0 ? 1 : 1 - ss((te - MONT.wipe[0]) / (MONT.wipe[1] - MONT.wipe[0])), rd = FORCE_HALF ? 1.3 : FRONT(Math.max(wipe, mfront));
    // Cursor "+" ueber der Sonne (nur Maus, solange die Sonne sichtbar ist)
    const want = L.on && ctx.tier === 'desktop' && P < CUT && Math.hypot(L.x - (ctx.vw / 2 + sx * ctx.vh), L.y - (ctx.vh / 2 - sy * ctx.vh)) < sc * 0.3 * ctx.vh * 1.4 ? 'plus' : '';
    if (want !== cur) { cur = want; stageEl.style.cursor = want ? 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27%3E%3Cpath d=%27M12 3v18M3 12h18%27 stroke=%27%23FAFAFA%27 stroke-width=%271.5%27/%3E%3C/svg%3E") 12 12, crosshair' : ''; }
    // Headline-Zeilen kommen nach der Montage
    if (!inDone && te > MONT.dur + MONT.breath - 0.1) { inDone = true; el.classList.add('in'); }

    // Szenen-Pass klein, Post-Pass in voller Aufloesung
    const allDots = P >= CUT - 0.03 || FORCE_HALF, cs = (6 * hh) / 800;
    const fw = allDots ? Math.ceil(w / cs) : Math.max(mobile ? 120 : 160, Math.round(Math.min(TEX, ctx.vw * (mobile ? 0.9 : 0.42)) * ad)), fh = Math.min(TEX, allDots ? Math.ceil(hh / cs) : Math.round((fw * hh) / w));
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.viewport(0, 0, fw, fh); gl.useProgram(S.pr); const U = S.U;
    gl.uniform2f(U.uR, fw, fh); gl.uniform1f(U.T, t); gl.uniform2f(U.uM, sm[0], sm[1]); gl.uniform4fv(U.uB, B); gl.uniform4fv(U.uO, O);
    gl.uniform1f(U.uMix, cut ? 1 : 0); gl.uniform1f(U.uLook, look); gl.uniform1f(U.uK, lerp(MARK_K / ORG_S, 0.12, split)); gl.uniform3f(U.uC, cx0, cy0, cz); gl.uniform3f(U.uH, hx, hy, hr); gl.uniform3f(U.uSP, sx, sy, sc); gl.uniform1f(U.uFlat, 1 - ss((P - CUT) / 0.07));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, w, hh); gl.useProgram(Pp.pr); const Q = Pp.U;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tx); gl.uniform1i(Q.uT, 0);
    gl.uniform2f(Q.uR, w, hh); gl.uniform2f(Q.uS, fw / TEX, fh / TEX); gl.uniform2f(Q.uC, sx, sy); gl.uniform1f(Q.uRd, rd);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  },
  destroy() { if (gl) { const x = gl.getExtension('WEBGL_lose_context'); x && x.loseContext(); } gl = null; },
};
