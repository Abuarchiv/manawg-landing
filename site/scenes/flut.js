// Flut (Stub aus A0): Raster-Übergang Wohnung -> Hand, nur einmal (ctx.tl.flut). Ohne Ziffern, Arrays werden wiederverwendet.
// B3 ersetzt: Halbton-Zellen statt voller Quadrate.
import { vnz } from '../lib.js';

const CS = 32;
let cv, c, tr = null, on = null, cols = 0, rows = 0, cleared = false;

export default {
  init(el) { cv = el.querySelector('canvas'); c = cv.getContext('2d'); },
  resize(ctx) {
    const w = Math.round(ctx.vw * ctx.dpr), h = Math.round(ctx.vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    cols = Math.ceil(ctx.vw / CS); rows = Math.ceil(ctx.vh / CS); tr = new Float32Array(cols * rows); on = new Uint8Array(cols * rows);
  },
  frame(t, dt, ctx) {
    const cover = ctx.tl.flut; if (!tr) return;
    if (cover < 0.001) { if (!cleared) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); cleared = true; } return; }
    cleared = false; c.setTransform(ctx.dpr, 0, 0, ctx.dpr, 0, 0); c.clearRect(0, 0, ctx.vw, ctx.vh);
    const f = Math.exp(-0.9 * dt); for (let q = 0; q < tr.length; q++) tr[q] *= f;
    const L = ctx.light;
    if (L.on) { const mi = Math.floor(L.x / CS), mj = Math.floor(L.y / CS); for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const a = mi + di, b = mj + dj; if (a >= 0 && b >= 0 && a < cols && b < rows) { const g = Math.max(0, 1 - Math.hypot(di, dj) / 2.6); tr[b * cols + a] = Math.max(tr[b * cols + a], g); } } }
    c.fillStyle = '#FAFAFA';
    for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) {
      const n = vnz(a * 0.13 + t * 0.03, b * 0.13 - t * 0.02), pk = b < 3 && (a < 9 || a > cols - 7) ? 0.5 : 0, k = b * cols + a;
      on[k] = n + cover * 0.55 - 0.45 + (b / rows) * 0.2 - pk > 0.5 && tr[k] < 0.3 ? 1 : 0;
      if (on[k]) c.fillRect(a * CS, b * CS, CS, CS);
    }
    if (L.on && ctx.reduced === false && matchMedia('(pointer:fine)').matches) { c.strokeStyle = '#FAFAFA'; c.strokeRect(Math.floor(L.x / CS) * CS + 0.5, Math.floor(L.y / CS) * CS + 0.5, CS - 1, CS - 1); }
  },
  destroy() {},
};
