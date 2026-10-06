// Körper (Stub aus A0): "Wirf sie. Sie finden zurück." Verlet-Physik mit festem Schritt 1/120 s, Halbton-Kugeln.
// B4 ersetzt: Übergabe an die Tiefe (ctx.handoff.bodies), Federn mit Versatz, Feinschliff Touch.
import { AB } from '../lib.js';

const STEP = 1 / 120, R60 = STEP / (1 / 60);  // Konstanten der Vorlage gelten pro 1/60 s und werden umgerechnet
let el, cv, c, B = null, acc = 0, idle = 0, grab = -1, S = 1.15, vw = 0, vh = 0, top = 0, m = { x: 0, y: 0, in: false, down: false };

const place = () => { const hx = vw / 2 - 208 * S, hy = vh / 2 - 173 * S + 20; B = AB.map((b) => ({ x: hx + b[0] * S, y: hy + b[1] * S, px: hx + b[0] * S, py: hy + b[1] * S, r: b[2] * S * 0.98, hx: hx + b[0] * S, hy: hy + b[1] * S })); };
const pick = (x, y) => { let best = -1, bd = 1e9; B.forEach((b, i) => { const d = Math.hypot(b.x - x, b.y - y) - b.r; if (d < 10 && d < bd) { bd = d; best = i; } }); return best; };

export default {
  init(root, ctx) {
    el = root; cv = el.querySelector('canvas'); c = cv.getContext('2d');
    const loc = (e) => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    cv.addEventListener('pointermove', (e) => { loc(e); m.in = true; });
    cv.addEventListener('pointerleave', () => { m.in = false; });
    cv.addEventListener('pointerdown', (e) => { loc(e); m.in = true; m.down = true; grab = pick(m.x, m.y); idle = 0;
      if (grab < 0) B.forEach((b) => { const dx = b.x - m.x, dy = b.y - m.y, d = Math.hypot(dx, dy) + 1; b.px -= (dx / d) * 18 * R60; b.py -= (dy / d) * 18 * R60; }); });
    const up = () => { m.down = false; grab = -1; idle = 0; }; addEventListener('pointerup', up); addEventListener('pointercancel', up);
    // Touch: nur wenn ein Körper getroffen wird, bleibt die Seite stehen, sonst scrollt ein vertikaler Wisch normal
    cv.addEventListener('touchstart', (e) => { const r = cv.getBoundingClientRect(), t = e.touches[0]; if (B && pick(t.clientX - r.left, t.clientY - r.top) >= 0) e.preventDefault(); }, { passive: false });
  },
  resize(ctx) {
    vw = ctx.vw; vh = ctx.vh; const w = Math.round(vw * ctx.dpr), h = Math.round(vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    S = Math.min(1.15, (vw - 32) / 420); top = cv.getBoundingClientRect().top + scrollY; place();
  },
  frame(t, dt, ctx) {
    if (!B) return;
    if (!ctx.reduced) for (acc += dt; acc >= STEP; acc -= STEP) {
      idle += STEP; const loose = idle < 3.5, G = loose ? 0.45 * R60 * R60 : 0, damp = Math.pow(0.985, R60), home = 1 - Math.pow(0.94, R60), gr = 1 - Math.pow(0.5, R60);
      for (const b of B) { const vx = (b.x - b.px) * damp, vy = (b.y - b.py) * damp; b.px = b.x; b.py = b.y; b.x += vx; b.y += vy + G; if (!loose) { b.x += (b.hx - b.x) * home; b.y += (b.hy - b.y) * home; } }
      if (grab >= 0 && m.in) { const b = B[grab]; b.x += (m.x - b.x) * gr; b.y += (m.y - b.y) * gr; }
      for (let it = 0; it < 4; it++) {
        for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const a = B[i], q = B[j], dx = q.x - a.x, dy = q.y - a.y, d = Math.hypot(dx, dy) || 1, mm = a.r + q.r; if (d < mm) { const o = ((mm - d) / 2) * (loose ? 1 : 0.3), ox = (dx / d) * o, oy = (dy / d) * o; a.x -= ox; a.y -= oy; q.x += ox; q.y += oy; } }
        for (const b of B) { if (b.x < b.r) b.x = b.r; if (b.x > vw - b.r) b.x = vw - b.r; if (b.y < b.r) b.y = b.r; if (b.y > vh - b.r) { b.y = vh - b.r; b.py = b.y + (b.y - b.py) * 0.4; } }
      }
    }
    ctx.handoff.bodies = B;
    const K = ctx.dpr; c.setTransform(K, 0, 0, K, 0, 0); c.fillStyle = '#0A0A0A'; c.fillRect(0, 0, vw, vh); c.fillStyle = '#FAFAFA';
    const L = ctx.light, lx = L.on ? L.x : vw * 0.3, ly = L.on ? L.y - (top - ctx.scrollY) : vh * 0.2, st = 6;
    for (const b of B) { const x0 = Math.floor((b.x - b.r) / st) * st, y0 = Math.floor((b.y - b.r) / st) * st;
      for (let y = y0; y < b.y + b.r; y += st) for (let x = x0; x < b.x + b.r; x += st) { const nx = (x - b.x) / b.r, ny = (y - b.y) / b.r, q = nx * nx + ny * ny; if (q > 1) continue; const nz = Math.sqrt(1 - q), Lx = lx - b.x, Ly = ly - b.y, LL = Math.hypot(Lx, Ly, 200), lam = Math.max(0, (nx * Lx + ny * Ly + nz * 200) / LL), v = 0.08 + 0.92 * lam * lam, r = st * 0.5 * Math.sqrt(v); c.fillRect(x - r, y - r, r * 2, r * 2); } }
    cv.style.cursor = grab >= 0 ? 'grabbing' : 'grab';
  },
  destroy() {},
};
