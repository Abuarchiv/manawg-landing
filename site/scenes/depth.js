// Tiefe (Stub aus A0): Kamerafahrt durch drei Wörter aus Zeichen, Fortschritt = Sticky-Fortschritt der Sektion (ctx.prog).
// B4 ersetzt: Halbton-Punkte (Bayer-Größe nach Tiefe), Staub an Scroll-Geschwindigkeit koppeln, Übergabe der Körper, Federn.
import { cl, lerp, ss, hsh, damp } from '../lib.js';

const ZMONO = '"JetBrains Mono", monospace', ZTT = '"Inter Tight", sans-serif', RAMP = '@#%*+=';
const TIER = { desktop: { px: 200, step: 5, x: 4.5 }, mobile: { px: 72, step: 3, x: 2 } };
let el, cv, c, vw = 0, vh = 0, tier = 'desktop', dp = 0, sm = { x: 0, y: 0 }, isl = [], P = [], depEl, lastDep = '';

const sampleT = (lines, px, step) => { const lh = px * 0.95, w = Math.ceil(px * 7), h = Math.ceil(lines.length * lh + px * 0.4), oc = document.createElement('canvas'); oc.width = w; oc.height = h; const o = oc.getContext('2d'); o.font = '600 ' + px + 'px ' + ZTT; o.textAlign = 'center'; o.fillStyle = '#000';
  lines.forEach((l, i) => o.fillText(l, w / 2, px * 0.82 + i * lh)); const d = o.getImageData(0, 0, w, h).data, pts = []; for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (d[(y * w + x) * 4 + 3] > 128) pts.push([x - w / 2, y - h / 2]); return pts; };
const build = () => {
  const T = TIER[tier]; isl = [['GELD'], ['HAUSHALT'], ['ABSPRACHEN']].map((w, i) => ({ z: 26 * i, x: [-T.x, T.x, -T.x][i], y: [0.8, -0.8, 0.8][i], pts: sampleT(w, T.px, T.step).map((p) => [p[0] / 85, p[1] / 85]) }));
  P = []; isl.forEach((I, k) => I.pts.forEach((p, q) => P.push([I.x + p[0], I.y + p[1], I.z + (hsh(q, k) - 0.5) * 0.6, RAMP[Math.floor(hsh(q, k + 9) * 6)], k])));
  for (let q = 0; q < 200; q++) P.push([(hsh(q, 1) - 0.5) * 60, (hsh(q, 2) - 0.5) * 36, hsh(q, 3) * 90 - 14, '.:+'[Math.floor(hsh(q, 4) * 3)], -1]);
};

export default {
  init(root, ctx) { el = root; cv = el.querySelector('canvas'); c = cv.getContext('2d'); depEl = el.querySelector('[data-depth]'); tier = ctx.tier; build(); document.fonts.ready.then(build); sm.x = ctx.vw * 0.6; sm.y = ctx.vh * 0.4; },
  resize(ctx) { vw = ctx.vw; vh = ctx.vh; const w = Math.round(vw * ctx.dpr), h = Math.round(vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } if (tier !== ctx.tier) { tier = ctx.tier; build(); } },
  frame(t, dt, ctx) {
    dp += (ctx.prog - dp) * ctx.d(7, dt); const p = dp, camZ = -14 + p * 57, seg = cl((camZ + 14) / 26, 0, 1.999), si = Math.floor(seg), sf = ss(seg - si);
    const L = ctx.light; if (L.on) { const k = ctx.d(4, dt); sm.x += (L.x - sm.x) * k; sm.y += (L.y - sm.y) * k; }
    const camX = lerp(isl[si].x, isl[si + 1].x, sf) * 0.85 + ((sm.x - vw / 2) / (vw / 2)) * 1.2, camY = lerp(isl[si].y, isl[si + 1].y, sf) * 0.85 + ((sm.y - vh / 2) / (vh / 2)) * 0.8, F = (720 * vh) / 800;
    const K = ctx.dpr; c.setTransform(K, 0, 0, K, 0, 0); c.fillStyle = '#0A0A0A'; c.fillRect(0, 0, vw, vh); const near = [];
    for (const q of P) { let x = q[0], y = q[1]; const dz = q[2] - camZ; if (dz < 0.25 || dz > 110) continue;
      if (q[4] >= 0 && dz < 5) { const I = isl[q[4]], k = (5 - dz) * 0.35; x += (x - I.x) * k; y += (y - I.y) * k; }
      const fz = F / dz; let sx = vw / 2 + (x - camX) * fz, sy = vh / 2 + (y - camY) * fz; if (sx < -40 || sy < -40 || sx > vw + 40 || sy > vh + 40) continue;
      if (L.on) { const dx = sx - L.x, dy = sy - L.y, d = Math.hypot(dx, dy); if (d < 120) { const g = (1 - d / 120) * 46; sx += (dx / (d + 0.1)) * g; sy += (dy / (d + 0.1)) * g; } }
      const a = cl(dz / 1.2) * (q[4] < 0 ? cl((110 - dz) / 50) * 0.55 : cl((34 - dz) / 12)), sz = cl(0.07 * fz, 0.8, 64); if (a <= 0.01) continue;
      if (sz < 6) { c.globalAlpha = a; c.fillStyle = '#FAFAFA'; c.fillRect(sx, sy, sz * 0.55, sz * 0.55); } else near.push([Math.min(5, Math.floor(Math.log2(sz / 6) * 2)), sx, sy, q[3], a]); }
    near.sort((a, b) => a[0] - b[0]); let fb = -1; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#FAFAFA';
    for (const n of near) { if (n[0] !== fb) { fb = n[0]; c.font = '500 ' + Math.round(8 * Math.pow(2, fb / 2)) + 'px ' + ZMONO; } c.globalAlpha = n[4]; c.fillText(n[3], n[1], n[2]); }
    c.globalAlpha = 1;
    if (depEl) { const s = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0'); if (s !== lastDep) { lastDep = s; depEl.textContent = s; } }
  },
  destroy() {},
};
