// Körper (Stub aus A0): "Wirf sie. Sie finden zurück." Verlet-Physik mit festem Schritt 1/120 s, Halbton-Kugeln.
// Runde 1/8/9: fester Schritt, Federn mit Versatz, Touch (horizontal werfen, vertikal scrollen), Übergabe an die Tiefe.
// ctx.handoff: { bodies, S (Körper-Skala), fall (0..1: Körper fallen aus dem Bild) } -> depth.js
import { AB, cl } from '../lib.js';

const STEP = 1 / 120, R60 = STEP / (1 / 60);  // Konstanten der Vorlage gelten pro 1/60 s und werden umgerechnet
const HOMEAT = 3.5, STAGGER = 0.05, KS = 170, DS = 14;  // Heimkehr nach 3,5 s Ruhe, 0,05 s Versatz je Körper, Feder k/d aus dem Plan
let el, cv, c, B = null, acc = 0, idle = 0, grab = -1, pend = null, S = 1.15, vw = 0, vh = 0, top = 0, m = { x: 0, y: 0, in: false, down: false };

const place = () => { const hx = vw / 2 - 208 * S, hy = vh / 2 - 173 * S + 20; B = AB.map((b) => ({ x: hx + b[0] * S, y: hy + b[1] * S, px: hx + b[0] * S, py: hy + b[1] * S, r: b[2] * S * 0.98, hx: hx + b[0] * S, hy: hy + b[1] * S })); };
const pick = (x, y) => { let best = -1, bd = 1e9; B.forEach((b, i) => { const d = Math.hypot(b.x - x, b.y - y) - b.r; if (d < 10 && d < bd) { bd = d; best = i; } }); return best; };

export default {
  init(root, ctx) {
    el = root; cv = el.querySelector('canvas'); c = cv.getContext('2d');
    const loc = (e) => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    cv.addEventListener('pointermove', (e) => { loc(e); m.in = true; });
    cv.addEventListener('pointerleave', () => { m.in = false; });
    const kick = (x, y) => B.forEach((b) => { const dx = b.x - x, dy = b.y - y, d = Math.hypot(dx, dy) + 1; b.px -= (dx / d) * 18 * R60; b.py -= (dy / d) * 18 * R60; });
    cv.addEventListener('pointerdown', (e) => { loc(e); m.in = true; m.down = true; idle = 0; const hit = pick(m.x, m.y);
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') { grab = hit; if (hit < 0) kick(m.x, m.y); }
      else pend = { x: m.x, y: m.y, hit }; });   // Touch: erst nach 8 px Weg entscheiden, ob geworfen (waagerecht) oder gescrollt (senkrecht) wird
    cv.addEventListener('pointermove', () => { if (!pend) return; const dx = m.x - pend.x, dy = m.y - pend.y;
      if (Math.hypot(dx, dy) < 8) return; if (pend.hit >= 0 && Math.atan2(Math.abs(dy), Math.abs(dx)) < Math.PI / 6) grab = pend.hit; pend = null; });
    const up = () => { if (pend && pend.hit < 0 && B) kick(pend.x, pend.y); pend = null; m.down = false; grab = -1; idle = 0; }; addEventListener('pointerup', up);
    addEventListener('pointercancel', () => { pend = null; m.down = false; grab = -1; });
    // touch-action:pan-y (CSS) lässt senkrechte Wische an den Browser; waagerechte kommen als Pointer-Events an. Kein preventDefault nötig.
  },
  resize(ctx) {
    vw = ctx.vw; vh = ctx.vh; const w = Math.round(vw * ctx.dpr), h = Math.round(vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    S = Math.min(1.15, (vw - 32) / 420); top = cv.getBoundingClientRect().top + scrollY; place();
  },
  frame(t, dt, ctx) {
    if (!B) return;
    if (!ctx.reduced) for (acc += dt; acc >= STEP; acc -= STEP) {
      idle += STEP; const loose = idle < HOMEAT, damp = Math.pow(0.985, R60), gr = 1 - Math.pow(0.5, R60), G = 0.45 * R60 * R60;
      B.forEach((b, i) => { const vx = (b.x - b.px) * damp, vy = (b.y - b.py) * damp, away = idle < HOMEAT + i * STAGGER; b.px = b.x; b.py = b.y; b.x += vx; b.y += vy + (away ? G : 0);
        if (!away) { b.x += KS * (b.hx - b.x) * STEP * STEP - DS * vx * STEP; b.y += KS * (b.hy - b.y) * STEP * STEP - DS * vy * STEP; } });  // Feder, unterdämpft: federt leicht über
      if (grab >= 0 && m.in) { const b = B[grab]; b.x += (m.x - b.x) * gr; b.y += (m.y - b.y) * gr; }
      for (let it = 0; it < 4; it++) {
        for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const a = B[i], q = B[j], dx = q.x - a.x, dy = q.y - a.y, d = Math.hypot(dx, dy) || 1, mm = a.r + q.r; if (d < mm) { const o = ((mm - d) / 2) * (loose ? 1 : 0.3), ox = (dx / d) * o, oy = (dy / d) * o; a.x -= ox; a.y -= oy; q.x += ox; q.y += oy; } }
        for (const b of B) { if (b.x < b.r) b.x = b.r; if (b.x > vw - b.r) b.x = vw - b.r; if (b.y < b.r) b.y = b.r; if (b.y > vh - b.r) { b.y = vh - b.r; b.py = b.y + (b.y - b.py) * 0.4; } }
      }
    }
    const ho = ctx.handoff, u = cl((ctx.prog - 0.58) / 0.4); ho.bodies = B; ho.S = S; ho.fall = u;
    const K = ctx.dpr; c.setTransform(K, 0, 0, K, 0, 0); c.fillStyle = '#0A0A0A'; c.fillRect(0, 0, vw, vh); c.fillStyle = '#FAFAFA';
    const L = ctx.light, lx = L.on ? L.x : vw * 0.3, ly = L.on ? L.y - (top - ctx.scrollY) : vh * 0.2, st = 6;
    B.forEach((b0, i) => { const f = cl(u * 1.25 - i * 0.05), b = { x: b0.x, y: b0.y + f * f * vh * 1.3, r: b0.r }; if (b.y - b.r > vh) return;
      const x0 = Math.floor((b.x - b.r) / st) * st, y0 = Math.floor((b.y - b.r) / st) * st;
      for (let y = y0; y < b.y + b.r; y += st) for (let x = x0; x < b.x + b.r; x += st) { const nx = (x - b.x) / b.r, ny = (y - b.y) / b.r, q = nx * nx + ny * ny; if (q > 1) continue; const nz = Math.sqrt(1 - q), Lx = lx - b.x, Ly = ly - b.y, LL = Math.hypot(Lx, Ly, 200), lam = Math.max(0, (nx * Lx + ny * Ly + nz * 200) / LL), v = 0.08 + 0.92 * lam * lam, r = st * 0.5 * Math.sqrt(v); c.fillRect(x - r, y - r, r * 2, r * 2); } });
    cv.style.cursor = grab >= 0 ? 'grabbing' : 'grab';
  },
  destroy() {},
};
