// Finale (Stub aus A0): das Zeichen als Sonne in ASCII-Glyphen, steigt mit dem Scroll-Fortschritt der Sektion und sinkt beim Zurückscrollen.
// B6 ersetzt: Glyphen-Atlas + drawImage statt fillText, Feinschliff Aufgang und S1-Satz.
import { cl, ss, hsh, markD, damp } from '../lib.js';

const RAMP = ' .:-=+*#%@';
let cv, c, vw = 0, vh = 0, top = 0, sm = { x: 0, y: 0 };

export default {
  init(el) { cv = el.querySelector('canvas'); c = cv.getContext('2d'); },
  resize(ctx) { vw = cv.clientWidth; vh = cv.clientHeight; const w = Math.round(vw * ctx.dpr), h = Math.round(vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } top = cv.getBoundingClientRect().top + scrollY; sm.x = vw / 2; sm.y = vh * 0.3; },
  frame(t, dt, ctx) {
    const mobile = ctx.tier === 'mobile', cw = mobile ? 12 : 9, chh = mobile ? 18 : 14, K = ctx.dpr, L = ctx.light, ly0 = L.y - (top - ctx.scrollY);
    const tg = L.on ? [L.x, ly0] : [vw / 2 + Math.cos(t * 0.3) * vw * 0.2, vh * 0.3 + Math.sin(t * 0.4) * 90], kk = ctx.d(5, dt); sm.x += (tg[0] - sm.x) * kk; sm.y += (tg[1] - sm.y) * kk;
    c.setTransform(K, 0, 0, K, 0, 0); c.fillStyle = '#0A0A0A'; c.fillRect(0, 0, vw, vh); c.fillStyle = '#FAFAFA'; c.font = `500 ${mobile ? 16 : 12}px "JetBrains Mono", monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
    const rise = ss((ctx.prog - 0.1) / 0.6), sc = mobile ? (vw * 0.9) / 418 : (1.25 * vh) / 760, cx = vw / 2, cy = vh * 0.5 + (1 - rise) * (vh * 0.5 + 190 * sc);
    for (let y = chh / 2, j = 0; y < vh; y += chh, j++) for (let x = cw / 2, i = 0; x < vw; x += cw, i++) {
      const mx = (x - cx) / sc + 208, my = (y - cy) / sc + 173; if (my < -140 || my > 330 || mx < -140 || mx > 560) continue; const d = markD(mx, my); let v = 0;
      if (d < 0) { const gx = markD(mx + 1, my) - d, gy = markD(mx, my + 1) - d, h = Math.sqrt(cl(-d / 46)), sl = (1 - h) * 2, nx = gx * sl, ny = gy * sl, nl = Math.hypot(nx, ny, 1), lx = sm.x - x, ly = sm.y - y, ll = Math.hypot(lx, ly, 240), lam = Math.max(0, (nx * lx + ny * ly + 240) / (nl * ll)); v = Math.pow(h, 0.3) * (0.1 + 0.9 * lam * lam); }
      else if (d < 90 && hsh(i + Math.floor(t * 3) * 13, j) < 0.06 * (1 - d / 90)) v = 0.15;
      if (v > 0.06) { let ci = Math.min(9, 1 + Math.floor(cl(v) * 8.99)); if (L.on) { const md = Math.hypot(x - L.x, y - ly0); if (md < 70 && hsh(i + Math.floor(t * 12), j) < 0.6 * (1 - md / 70)) ci = 1 + Math.floor(hsh(i, j + Math.floor(t * 12)) * 9); } c.fillText(RAMP[ci], x, y); }
    }
  },
  destroy() {},
};
