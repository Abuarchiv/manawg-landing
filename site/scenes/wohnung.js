// Wohnung (Stub aus A0): isometrische Wohnung, Raum-Fokus nach Fortschritt ctx.tl.wp. Final-Logik 1:1, dt-basiert.
// B2 ersetzt: Clip in den Lochkreis (ctx.stage), Zeilen-Masken, Bewohner-Wippen, STOPS_P feinschleifen.
import { cl, ss, lerp, BAYER, mono, space } from '../lib.js';

const ROOMS = [['KÜCHE', 0, 0, 8, 6], ['BAD', 8, 0, 5, 6], ['ZIMMER · JONA', 13, 0, 7, 6], ['FLUR', 0, 6, 20, 3], ['WOHNZIMMER', 0, 9, 9, 7], ['ZIMMER · LEA', 9, 9, 5, 7], ['ZIMMER · LINA', 14, 9, 6, 7]];
// STOPS je Stufe. Desktop in virtuellen 1280x800 Einheiten, mobil als Anteile von Breite/Höhe (ox, oy) und u relativ zu 390 px Breite.
const STOPS = {
  desktop: [{ cx: 10, cy: 8, u: 26, ox: 780, oy: 470, room: -1 }, { cx: 4, cy: 3, u: 62, ox: 840, oy: 420, room: 0 }, { cx: 4.5, cy: 12.5, u: 52, ox: 840, oy: 420, room: 4 },
    { cx: 10.5, cy: 3, u: 80, ox: 840, oy: 420, room: 1 }, { cx: 10, cy: 7.5, u: 48, ox: 840, oy: 420, room: 3 }, { cx: 10, cy: 8, u: 24, ox: 640, oy: 300, room: -1 }],
  mobile: [{ cx: 10, cy: 8, u: 10, ox: 0.5, oy: 0.3, room: -1 }, { cx: 4, cy: 3, u: 25, ox: 0.5, oy: 0.28, room: 0 }, { cx: 4.5, cy: 12.5, u: 21, ox: 0.5, oy: 0.28, room: 4 },
    { cx: 10.5, cy: 3, u: 32, ox: 0.5, oy: 0.28, room: 1 }, { cx: 10, cy: 7.5, u: 19, ox: 0.5, oy: 0.28, room: 3 }, { cx: 10, cy: 8, u: 9.5, ox: 0.5, oy: 0.3, room: -1 }],
};
const WALLS = []; ROOMS.forEach((r) => { const [, x, y, w, h] = r; WALLS.push([x, y, x + w, y], [x + w, y, x + w, y + h], [x, y + h, x + w, y + h], [x, y, x, y + h]); });
WALLS.sort((a, b) => (a[0] + a[1] + a[2] + a[3]) - (b[0] + b[1] + b[2] + b[3]));
const PEOC = [['LINA', 0.62], ['MIKA', 0.5], ['JONA', 0.42], ['LEA', 0.34]];
const fine = matchMedia('(pointer:fine)').matches;
let cv, c, sp = 0, sm = { x: 0, y: 0 }, pp = null;

export default {
  init(el) { cv = el.querySelector('canvas'); c = cv.getContext('2d'); },
  resize(ctx) { const w = Math.round(ctx.vw * ctx.dpr), h = Math.round(ctx.vh * ctx.dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } },
  frame(t, dt, ctx) {
    const tl = ctx.tl; if (tl.fp < 0.001) return;
    const mobile = ctx.tier === 'mobile', S = mobile ? { W: ctx.vw, H: ctx.vh, k: 1, ox: 0, oy: 0 } : space(ctx.vw, ctx.vh, 'desktop'), { W, H, k } = S, ST = STOPS[ctx.tier];
    sp += (tl.wp - sp) * ctx.d(10, dt); if (Math.abs(tl.wp - sp) < 1e-4) sp = tl.wp;
    const q = sp * 5, i = Math.min(4, Math.floor(q)), e = ss((q - i - 0.2) / 0.6), A = ST[i], Bs = ST[i + 1], uk = mobile ? ctx.vw / 390 : 1;
    const ox = lerp(A.ox, Bs.ox, e) * (mobile ? W : 1), oy = lerp(A.oy, Bs.oy, e) * (mobile ? H : 1), cx = lerp(A.cx, Bs.cx, e), cy = lerp(A.cy, Bs.cy, e), u = Math.exp(lerp(Math.log(A.u), Math.log(Bs.u), e)) * uk;
    const P = (x, y, zz) => [ox + ((x - cx) - (y - cy)) * 0.866 * u, oy + ((x - cx) + (y - cy)) * 0.5 * u - zz * u];
    const lit = ROOMS.map((r, ri) => { let v = 0; ST.forEach((s, j) => { if (s.room === ri) v = Math.max(v, 1 - Math.abs(q - j) * 1.4); }); return cl(v); });
    const focus = lit.indexOf(Math.max(...lit));
    // Licht in virtuelle Koordinaten
    const L = ctx.light; if (L.on) { const lx = (L.x - S.ox) / k, ly = (L.y - S.oy) / k, kk = ctx.d(14, dt); sm.x += (lx - sm.x) * kk; sm.y += (ly - sm.y) * kk; } else { sm.x = (ctx.vw / 2 - S.ox) / k; sm.y = (ctx.vh / 2 - S.oy) / k; }
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#0A0A0A'; c.fillRect(0, 0, cv.width, cv.height);
    const K = k * ctx.dpr; c.setTransform(K, 0, 0, K, S.ox * ctx.dpr, S.oy * ctx.dpr);
    const FL = 210, stp = Math.max(0.12, 5.5 / u); c.fillStyle = '#FAFAFA';
    ROOMS.forEach((r, ri) => {
      const [, x, y, w, hh] = r, base = 0.06 + 0.8 * lit[ri];
      for (let gy = 0, yy = y + stp / 2; yy < y + hh; yy += stp, gy++) for (let gx = 0, xx = x + stp / 2; xx < x + w; xx += stp, gx++) {
        const pt = P(xx, yy, 0); if (pt[0] < -4 || pt[1] < -4 || pt[0] > W || pt[1] > H) continue;
        let I = base; if (L.on) { const dm = Math.hypot(pt[0] - sm.x, pt[1] - sm.y); if (dm < FL) I += 0.8 * (1 - dm / FL) ** 2; }
        if (I > BAYER[(gy & 3) * 4 + (gx & 3)] / 16 + 0.02) c.fillRect(pt[0], pt[1], 1.6, 1.6);
      }
    });
    if (!pp) pp = PEOC.map((_, n) => ({ x: 2 + n * 4, y: 7.5, tx: 2 + n * 4, ty: 7.5, nt: 0 }));
    const kp = ctx.d(1.5, dt);
    pp.forEach((p, n) => {
      if (lit[focus] > 0.5) { const r = ROOMS[focus]; p.tx = r[1] + r[3] * (0.3 + 0.4 * (n % 2)); p.ty = r[2] + r[4] * (0.3 + 0.4 * (n > 1 ? 1 : 0)); }
      else if (t > p.nt) { const r = ROOMS[Math.floor(Math.random() * ROOMS.length)]; p.tx = r[1] + r[3] * (0.25 + Math.random() * 0.5); p.ty = r[2] + r[4] * (0.25 + Math.random() * 0.5); p.nt = t + 2.5 + Math.random() * 3; }
      p.x += (p.tx - p.x) * kp; p.y += (p.ty - p.y) * kp;
    });
    const HW = 1.1;
    WALLS.forEach((wl) => {
      const a = P(wl[0], wl[1], 0), b = P(wl[2], wl[3], 0), a2 = P(wl[0], wl[1], HW), b2 = P(wl[2], wl[3], HW);
      c.globalAlpha = 0.92; c.fillStyle = '#0A0A0A'; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b2[0], b2[1]); c.lineTo(a2[0], a2[1]); c.closePath(); c.fill();
      c.globalAlpha = 0.3; c.strokeStyle = '#FAFAFA'; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.moveTo(a[0], a[1]); c.lineTo(a2[0], a2[1]); c.moveTo(b[0], b[1]); c.lineTo(b2[0], b2[1]); c.stroke();
      c.globalAlpha = 0.9; c.beginPath(); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); c.stroke();
    });
    c.globalAlpha = 1;
    pp.forEach((p, n) => {
      const pt = P(p.x, p.y, 0.45), r = PEOC[n][1] * u * 0.5;
      c.fillStyle = '#FAFAFA'; c.beginPath(); c.arc(pt[0], pt[1], r, 0, 6.2832); c.fill();
      c.fillStyle = '#0A0A0A'; c.beginPath(); c.arc(pt[0] + r * 0.12, pt[1] - r * 0.28, r * 0.22, 0, 6.2832); c.fill();
      c.font = mono(11); c.fillStyle = 'rgba(250,250,250,0.72)'; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillText(PEOC[n][0], pt[0], pt[1] - r - 8);
    });
    ROOMS.forEach((r, ri) => {
      const pt = P(r[1] + r[3] / 2, r[2] + r[4] / 2, 0); c.textAlign = 'center';
      c.globalAlpha = 0.6 + 0.4 * lit[ri]; c.font = mono(11); c.fillStyle = '#FAFAFA'; c.fillText(r[0], pt[0], pt[1]);
    });
    c.globalAlpha = 1;
    if (L.on && fine) { c.strokeStyle = 'rgba(250,250,250,0.6)'; c.beginPath(); c.arc(sm.x, sm.y, 18, 0, 6.2832); c.stroke(); c.fillStyle = '#FAFAFA'; c.fillRect(sm.x - 1.5, sm.y - 1.5, 3, 3); }
  },
  destroy() {},
};
