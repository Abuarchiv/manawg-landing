// Flut: Raster-Übergang Wohnung -> Hand, nur einmal (ctx.tl.flut). Halbton-Zellen (Quadrate, Größe = Wert, Bayer-Schwelle),
// keine Ziffern, keine Allokation pro Frame. Das Licht radiert Zellen weg und gibt sie langsam zurück.
import { vnz, BAYER } from '../lib.js';

// Konstanten je Tier: Zellgröße, Header-Aussparung (Höhe, links, rechts in px)
const CFG = { mobile: { cs: 13, top: 66, left: 150, right: 170 }, desktop: { cs: 16, top: 96, left: 290, right: 230 } };
let cv, c, tr = null, cols = 0, rows = 0, cleared = false, cf = CFG.desktop, fine = false;

export default {
  init(el) { cv = el.querySelector('canvas'); c = cv.getContext('2d'); fine = matchMedia('(pointer:fine)').matches; },
  resize(ctx) {
    const w = Math.round(ctx.vw * ctx.dpr), h = Math.round(ctx.vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    cf = CFG[ctx.tier]; cols = Math.ceil(ctx.vw / cf.cs); rows = Math.ceil(ctx.vh / cf.cs); tr = new Float32Array(cols * rows);
  },
  frame(t, dt, ctx) {
    const cover = ctx.tl.flut; if (!tr) return;
    if (cover < 0.001) { if (!cleared) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); cleared = true; tr.fill(0); } return; }
    cleared = false; c.setTransform(ctx.dpr, 0, 0, ctx.dpr, 0, 0); c.clearRect(0, 0, ctx.vw, ctx.vh);
    const CS = cf.cs, f = Math.exp(-0.9 * dt); for (let q = 0; q < tr.length; q++) tr[q] *= f;
    const L = ctx.light;
    const R = Math.round(56 / CS);
    if (L.on) { const mi = Math.floor(L.x / CS), mj = Math.floor(L.y / CS); for (let dj = -R; dj <= R; dj++) for (let di = -R; di <= R; di++) { const a = mi + di, b = mj + dj; if (a >= 0 && b >= 0 && a < cols && b < rows) { const g = Math.max(0, 1 - Math.hypot(di, dj) / (R + 0.6)); tr[b * cols + a] = Math.max(tr[b * cols + a], g); } } }
    c.fillStyle = '#FAFAFA';
    const hx0 = cf.left / CS, hx1 = (ctx.vw - cf.right) / CS, hy = cf.top / CS;
    for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) {
      const k = b * cols + a, n = vnz(a * 0.13 * CS / 32 + t * 0.03, b * 0.13 * CS / 32 - t * 0.02), hole = b < hy && (a < hx0 || a > hx1) ? 0.5 : 0;
      // Wert 0..1: wächst mit dem Bedeckungsgrad; über 1 füllt das Quadrat die Zelle, daneben bleiben Bayer-Lücken
      const raw = (n + cover * 0.9 - 0.62 + (b / rows) * 0.2 - hole) * 2.2, v = Math.min(1.15, raw) * (1 - Math.min(1, tr[k] * 1.4));
      if (v <= BAYER[(b & 3) * 4 + (a & 3)] / 16 * 0.35) continue;
      const z = Math.min(CS, CS * (0.12 + 1.15 * v)); c.fillRect(a * CS + (CS - z) / 2, b * CS + (CS - z) / 2, z, z);
    }
    if (L.on && ctx.reduced === false && fine) { c.strokeStyle = '#FAFAFA'; c.strokeRect(Math.floor(L.x / CS) * CS + 0.5, Math.floor(L.y / CS) * CS + 0.5, CS - 1, CS - 1); }
  },
  destroy() {},
};
