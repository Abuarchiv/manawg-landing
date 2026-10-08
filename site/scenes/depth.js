// Tiefe: Kamerafahrt durch drei Wörter aus Halbton-Punkten, Fortschritt = Sticky-Fortschritt der Sektion (ctx.prog).
// Runde 6: Punktgröße = Bayer-Schwelle gegen Tiefe, Staub 200 und nur bei Scrollbewegung sichtbar.
// Runde 8: Die acht Körper aus ctx.handoff tauchen am Anfang als Kerne auf; am Ende steht das Zeichen als Insel (ctx.handoff.icon -> install.js).
// Runde 9: Verdrängung am Zeiger als Feder auf die Stärke, kein Sprung beim Ein-/Austritt.
import { cl, lerp, ss, hsh, spring, AB, BAYER } from '../lib.js';

const ZTT = '"Inter Tight", sans-serif';
const TIER = { desktop: { px: 200, step: 5, x: 4.5, words: [['GELD'], ['HAUSHALT'], ['ABSPRACHEN']], mark: 1 }, mobile: { px: 72, step: 3, x: 2, words: [['GELD'], ['HAUS', 'HALT'], ['ABSPRA', 'CHEN']], mark: 0.62 } };
const ZE = 48, UNIT = 110;  // Zeichen-Insel am Ende bei z=48, UNIT = Körper-Einheit wie HOME3 (Zeichen-Koordinaten / 110)
let el, cv, c, vw = 0, vh = 0, tier = 'desktop', dp = 0, sm = { x: 0, y: 0 }, isl = [], P = [], D = [], depEl, lastDep = '', sv = 0, push = { x: 0, v: 0 };
const bk = [[], [], [], []];

const sampleT = (lines, px, step) => { const lh = px * 0.95, w = Math.ceil(px * 7), h = Math.ceil(lines.length * lh + px * 0.4), oc = document.createElement('canvas'); oc.width = w; oc.height = h; const o = oc.getContext('2d'); o.font = '600 ' + px + 'px ' + ZTT; o.textAlign = 'center'; o.fillStyle = '#000';
  lines.forEach((l, i) => o.fillText(l, w / 2, px * 0.82 + i * lh)); const d = o.getImageData(0, 0, w, h).data, pts = [];
  for (let y = 0, j = 0; y < h; y += step, j++) for (let x = 0, i = 0; x < w; x += step, i++) if (d[(y * w + x) * 4 + 3] > 128) pts.push([x - w / 2, y - h / 2, BAYER[(j & 3) * 4 + (i & 3)] / 16]); return pts; };
const build = () => {
  const T = TIER[tier]; isl = T.words.map((w, i) => ({ z: 26 * i, x: [-T.x, T.x, -T.x][i], y: [0.8, -0.8, 0.8][i], pts: sampleT(w, T.px, T.step).map((p) => [p[0] / 85, p[1] / 85, p[2]]) }));
  P = []; isl.forEach((I, k) => I.pts.forEach((p, q) => P.push([I.x + p[0], I.y + p[1], I.z + (hsh(q, k) - 0.5) * 0.6, p[2], k])));
  D = []; for (let q = 0; q < 200; q++) D.push([(hsh(q, 1) - 0.5) * 60, (hsh(q, 2) - 0.5) * 36, hsh(q, 3) * 90 - 14]);
};

// Halbton-Kugel wie in physics.js: Raster, Punktgröße nach Lambert
const core = (x, y, r, a, lx, ly) => { if (a <= 0.01 || r < 1) return; const st = Math.max(3, r / 9); c.globalAlpha = a; const x0 = Math.floor((x - r) / st) * st, y0 = Math.floor((y - r) / st) * st;
  for (let yy = y0; yy < y + r; yy += st) for (let xx = x0; xx < x + r; xx += st) { const nx = (xx - x) / r, ny = (yy - y) / r, q = nx * nx + ny * ny; if (q > 1) continue; const nz = Math.sqrt(1 - q), Lx = lx - x, Ly = ly - y, LL = Math.hypot(Lx, Ly, 200), lam = Math.max(0, (nx * Lx + ny * Ly + nz * 200) / LL), v = 0.08 + 0.92 * lam * lam, d = st * Math.sqrt(v); c.fillRect(xx - d / 2, yy - d / 2, d, d); } };

export default {
  init(root, ctx) { el = root; cv = el.querySelector('canvas'); c = cv.getContext('2d'); depEl = el.querySelector('[data-depth]'); tier = ctx.tier; build(); document.fonts.ready.then(build); sm.x = ctx.vw * 0.6; sm.y = ctx.vh * 0.4; },
  resize(ctx) { vw = ctx.vw; vh = ctx.vh; const w = Math.round(vw * ctx.dpr), h = Math.round(vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } if (tier !== ctx.tier) { tier = ctx.tier; build(); } },
  frame(t, dt, ctx) {
    dp += (ctx.prog - dp) * ctx.d(7, dt); const p = dp, camZ = -14 + p * 57, seg = cl((camZ + 14) / 26, 0, 1.999), si = Math.floor(seg), sf = ss(seg - si);
    const L = ctx.light; if (L.on) { const k = ctx.d(4, dt); sm.x += (L.x - sm.x) * k; sm.y += (L.y - sm.y) * k; }
    spring(push, L.on ? 1 : 0, Math.min(dt, 1 / 30)); if (push.x < 0) { push.x = 0; push.v = 0; }
    sv += (Math.abs(ctx.vel) - sv) * ctx.d(6, dt);
    const camX = lerp(isl[si].x, isl[si + 1].x, sf) * 0.85 + ((sm.x - vw / 2) / (vw / 2)) * 1.2, camY = lerp(isl[si].y, isl[si + 1].y, sf) * 0.85 + ((sm.y - vh / 2) / (vh / 2)) * 0.8, F = (720 * vh) / 800;
    const K = ctx.dpr; c.setTransform(K, 0, 0, K, 0, 0); c.globalAlpha = 1; c.fillStyle = '#0A0A0A'; c.fillRect(0, 0, vw, vh); c.fillStyle = '#FAFAFA';
    const lx = L.on ? L.x : vw * 0.3, ly = L.on ? L.y : vh * 0.2, pr = push.x * 46, cx = vw / 2, cy = vh / 2, T = TIER[tier];
    // Wörter: Punkte nach Alpha in vier Stufen, Größe = Bayer-Schwelle gegen Tiefe
    for (const b of bk) b.length = 0; const word2 = 1 - ss((p - 0.78) / 0.14);
    for (const q of P) { const dz = q[2] - camZ; if (dz < 0.25 || dz > 110) continue; if (q[4] === 2 && word2 <= 0) continue;
      const fz = F / dz; let sx = cx + (q[0] - camX) * fz, sy = cy + (q[1] - camY) * fz; if (sx < -40 || sy < -40 || sx > vw + 40 || sy > vh + 40) continue;
      if (dz < 5) { const I = isl[q[4]], k = (5 - dz) * 0.35; sx += (q[0] - I.x) * k * fz; sy += (q[1] - I.y) * k * fz; }
      if (pr > 0.5) { const dx = sx - L.x, dy = sy - L.y, d = Math.hypot(dx, dy); if (d < 120) { const g = (1 - d / 120) * pr; sx += (dx / (d + 0.1)) * g; sy += (dy / (d + 0.1)) * g; } }
      const a = cl(dz / 1.2) * cl((34 - dz) / 12) * (q[4] === 2 ? word2 : q[4] === 0 ? ss((p - 0.05) / 0.1) : 1), sz = cl(0.07 * fz, 0.8, 64); if (a <= 0.01) continue;
      const tone = cl(1.1 - dz / 26), d = sz * (0.3 + 0.7 * cl((tone - q[3]) * 4 + 0.5)); bk[Math.min(3, Math.floor(a * 4))].push(sx, sy, d); }
    bk.forEach((b, i) => { if (!b.length) return; c.globalAlpha = (i + 1) / 4; c.beginPath(); for (let j = 0; j < b.length; j += 3) { const d = b[j + 2]; if (d < 2.2) c.rect(b[j] - d / 2, b[j + 1] - d / 2, d, d); else { c.moveTo(b[j] + d / 2, b[j + 1]); c.arc(b[j], b[j + 1], d / 2, 0, 6.2832); } } c.fill(); });
    // Körper aus „Wirf sie“: Kerne stehen bei p=0 in Größe und Lage wie in physics.js und fliegen dann an der Kamera vorbei
    const ho = ctx.handoff, S = ho.S || 1.15, dz0 = F / (0.98 * S * UNIT);
    if (p < 0.2) { const dzc = dz0 - 14 - camZ; // Abstand der Kerne zur Kamera: dz0 bei p=0
      if (dzc > 0.3) { const fz = F / dzc, ox = isl[0].x * 0.85, oy = isl[0].y * 0.85 + 20 / (0.98 * S * UNIT), a = cl(dzc / 1.5) * (1 - ss((p - 0.07) / 0.07));
        AB.forEach((b) => core(cx + (ox + (b[0] - 208) / UNIT - camX) * fz, cy + (oy + (b[1] - 173) / UNIT - camY) * fz, (b[2] / UNIT) * fz, a, lx, ly)); } }
    // Zeichen-Insel am Ende: wird zum App-Icon (install.js liest ctx.handoff.icon: Mitte x/y, Breite w, Sichtbarkeit a)
    const ia = ss((p - 0.8) / 0.15), ic = ho.icon || (ho.icon = { x: 0, y: 0, w: 0, a: 0 }), dze = ZE - camZ;
    { const fz = F / dze, m = T.mark; ic.x = cx; ic.y = cy;  // Mitte ohne Parallaxe: das Zeichen wird zum App-Icon
      ic.w = 3 * m * fz; ic.a = ia;
      if (ia > 0.01 && dze > 0.3) AB.forEach((b) => core(ic.x + ((b[0] - 208) / UNIT) * m * fz, ic.y + ((b[1] - 173) / UNIT) * m * fz, (b[2] / UNIT) * m * fz, ia, lx, ly)); }
    // Staub: nur bei Scrollbewegung sichtbar, als Striche zur Bildmitte hin gestreckt
    const da = 0.55 * cl(sv / 20);
    if (da > 0.01) { c.globalAlpha = da; c.strokeStyle = '#FAFAFA'; c.lineWidth = 1; c.beginPath(); const len = Math.min(48, (2 + sv * 0.45) * (1 + sv * 0.004));
      for (const q of D) { const dz = q[2] - camZ; if (dz < 0.6 || dz > 110) continue; const fz = F / dz, sx = cx + (q[0] - camX) * fz, sy = cy + (q[1] - camY) * fz; if (sx < 0 || sy < 0 || sx > vw || sy > vh) continue;
        const dx = sx - cx, dy = sy - cy, n = Math.hypot(dx, dy) + 1, l = Math.min(len, n * 0.5); c.moveTo(sx, sy); c.lineTo(sx - (dx / n) * l, sy - (dy / n) * l); }
      c.stroke(); }
    c.globalAlpha = 1;
    if (depEl) { const s = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0'); if (s !== lastDep) { lastDep = s; depEl.textContent = s; } }
  },
  destroy() {},
};
