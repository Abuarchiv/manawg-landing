// Hand + Handy (Stub aus A0): Hand-SDF noch auf der CPU wie in der Vorlage, Handy-UI als echtes DOM.
// B3 ersetzt: Hand im Fragment-Shader, Dither-Rahmen, Finger von unten (Hochformat).
import { cl, BAYER, hsh, cap, smn, uc, space } from '../lib.js';

const PCX = 800, PCY = 400, W = 1280, H = 800, LX = -0.5, LY = -0.62, LZ = 0.6, FR = [[232, 1.0], [318, 1.05], [402, 0.98], [482, 0.84]], CG = 12;
const holdBack = (x, y) => { let d = (Math.hypot((x - 790) / 178, (y - 748) / 96) - 1) * 96;
  d = smn(d, uc(x, y, 770, 800, 690, 1160, 122, 142), 60); d = smn(d, (Math.hypot((x - 905) / 66, (y - 690) / 92) - 1) * 66, 34); d = smn(d, (Math.hypot((x - 640) / 74, (y - 705) / 96) - 1) * 74, 40);
  for (const g of FR) { const s = g[1], y0 = g[0]; let e = uc(x, y, 900, y0 + 30, 980, y0 + 6, 25 * s, 23 * s); e = smn(e, Math.hypot(x - 986, y - y0 - 2) - 24 * s, 6); e = smn(e, uc(x, y, 986, y0 - 1, 972, y0 - 8, 22 * s, 20 * s), 5); d = smn(d, e, 3); }
  return d; };
const holdFront = (x, y) => { let d = uc(x, y, 612, 692, 600, 560, 40, 32); d = smn(d, uc(x, y, 600, 560, 616, 466, 31, 27), 5); d = smn(d, uc(x, y, 616, 466, 652, 412, 26, 21), 5);
  for (const g of FR) { const s = g[1], y0 = g[0]; let e = uc(x, y, 986, y0 - 1, 972, y0 - 8, 22 * s, 20 * s); e = smn(e, uc(x, y, 968, y0 - 8, 938, y0 - 12, 19 * s, 15.5 * s), 4); d = Math.min(d, e); }
  return d; };
const nail = (x, y, ax, ay, bx, by, t0, L, w) => { const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, px = x - ax, py = y - ay, al = px * ux + py * uy, pe = -px * uy + py * ux, c = t0 * l; return ((al - c) / L) ** 2 + (pe / w) ** 2; };
const phoneBox = (x, y) => { const qx = Math.abs(x - PCX) - 104, qy = Math.abs(y - PCY) - 264; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - 46; };
const shN = (fn, x, y, d, R) => { const gx = fn(x + 1.5, y) - d, gy = fn(x, y + 1.5) - d, h = Math.sqrt(cl(-d / R)), sl = (1 - h) * 2.2; const nx = (gx / 1.5) * sl, ny = (gy / 1.5) * sl, l = Math.hypot(nx, ny, 1);
  const lam = Math.max(0, (nx * LX + ny * LY + LZ) / l), sp = Math.pow(lam, 12) * 0.35; return Math.pow(h, 0.3) * (0.1 + 0.85 * lam) + sp; };
const lightF = (x, y) => 0.45 + 0.55 * cl(1 - ((x - 450) + (y - 120)) / 1100);

let el, hb, hf, cb, cf, phone, ht = { x: 860, y: 430 }, cm = null, S = null;
const NAMES = ['WG Lindenstraße', 'Haushalt', 'Finanzen', 'Austausch'], ITEMS = ['Hafermilch', 'Bananen', 'Spülmittel', 'Toilettenpapier'];
const fm = (v) => v.toFixed(2).replace('.', ',') + ' €';

const render = (st) => {
  const $ = (q) => el.querySelectorAll(q), bind = (k, v) => $(`[data-bind="${k}"]`).forEach((n) => (n.textContent = v));
  $('[data-pane]').forEach((p) => (p.hidden = +p.dataset.pane !== st.tab)); $('[data-tab]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.tab === st.tab)));
  $('[data-item]').forEach((b) => b.setAttribute('aria-pressed', String(!!st.done[b.dataset.item])));
  const open = ITEMS.filter((n) => !st.done[n]).length;
  bind('title', NAMES[st.tab]); bind('openCount', open); bind('openText', open ? open + ' Dinge stehen auf der Liste.' : 'Die Liste ist leer.');
  bind('saldo', st.added ? '12,00 €' : '0,00 €'); bind('saldoText', st.added ? 'Lea gibt Jona 12,00 €.' : 'Diesen Monat ist alles ausgeglichen.'); bind('lastAct', st.added ? 'Jona hat 24,00 € ausgelegt.' : 'Lina hat 18,90 € ausgelegt.');
  $('[data-add]').forEach((b) => { b.textContent = st.added ? 'Kinoabend entfernen' : 'Ausgabe erfassen'; b.setAttribute('aria-pressed', String(st.added)); }); $('[data-added]').forEach((n) => (n.hidden = !st.added));
  $('[data-reply]').forEach((b) => { b.textContent = st.replied ? 'Passt, ich bin auch da.' : 'Antworten …'; b.setAttribute('aria-pressed', String(st.replied)); });
};

export default {
  init(root, ctx) {
    el = root; hb = el.querySelector('.hb'); hf = el.querySelector('.hf'); cb = hb.getContext('2d'); cf = hf.getContext('2d'); phone = el.querySelector('[data-phone]');
    el.addEventListener('click', (e) => { const t = e.target.closest('[data-tab],[data-item],[data-add],[data-reply]'); if (!t) return;
      if (t.dataset.tab !== undefined) ctx.set({ tab: +t.dataset.tab }); else if (t.dataset.item) ctx.set((s) => ({ done: { ...s.done, [t.dataset.item]: !s.done[t.dataset.item] } })); else if (t.hasAttribute('data-add')) ctx.set((s) => ({ added: !s.added })); else ctx.set((s) => ({ replied: !s.replied })); });
    ctx.on(render);
  },
  resize(ctx) {
    for (const c of [hb, hf]) { const w = Math.round(ctx.vw * ctx.dpr), h = Math.round(ctx.vh * ctx.dpr); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } }
    S = space(ctx.vw, ctx.vh, ctx.tier, PCX, PCY); phone.style.transform = `translate(${S.ox + 650 * S.k}px,${S.oy + 90 * S.k}px) scale(${S.k})`;
  },
  frame(t, dt, ctx) {
    if (ctx.tl.e < 0.01 || !S) return;
    const { k, ox, oy } = S, L = ctx.light, on = ctx.tl.e > 0.6 && L.on;
    const tg = on ? [(L.x - ox) / k, (L.y - oy) / k] : [840 + Math.sin(t * 0.7) * 50, 380 + Math.cos(t * 0.5) * 80], kd = ctx.d(18, dt); ht.x += (tg[0] - ht.x) * kd; ht.y += (tg[1] - ht.y) * kd;
    const pr = ctx.reduced ? 9 : t - ctx.clickT, push = pr < 0.4 ? Math.sin((pr / 0.4) * Math.PI) : 0;
    const ax = 1460 - ht.x, ay = 1020 - ht.y, AL = Math.hypot(ax, ay) || 1, ux = ax / AL, uy = ay / AL, nx = -uy, ny = ux;
    const sc = 1 - push * 0.06, tx = ht.x + ux * (6 + push * 4), ty = ht.y + uy * (6 + push * 4);
    const P = (a, b) => [tx + (ux * a + nx * b) * sc, ty + (uy * a + ny * b) * sc];
    const Sg = [[P(0, 0), P(34, 0), 15, 16.5], [P(34, 0), P(74, 0), 16.5, 17.5], [P(74, 0), P(132, 2), 17.5, 19.5], [P(140, 8), P(250, 26), 46, 58], [P(150, 38), P(118, 46), 20, 19], [P(118, 46), P(112, 64), 19, 17],
      [P(160, 66), P(130, 74), 19, 18], [P(130, 74), P(126, 90), 18, 16], [P(172, 92), P(146, 100), 16, 15], [P(146, 100), P(142, 114), 15, 13],
      [P(250, -40), P(190, -40), 30, 26], [P(190, -40), P(140, -28), 26, 21], [P(140, -28), P(104, -16), 21, 18], [P(260, 30), P(820, 40), 72, 92]];
    const KS = [0, 4, 4, 16, 8, 4, 8, 4, 8, 4, 14, 5, 4, 34];
    const point = (x, y) => { let d = 1e9; for (let q = 0; q < Sg.length; q++) { const g = Sg[q]; const e = uc(x, y, g[0][0], g[0][1], g[1][0], g[1][1], g[2] * sc, g[3] * sc); d = q ? smn(d, e, KS[q]) : e; } return d; };
    const K = k * ctx.dpr; for (const c of [cb, cf]) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, c.canvas.width, c.canvas.height); c.setTransform(K, 0, 0, K, ox * ctx.dpr, oy * ctx.dpr); c.fillStyle = '#FAFAFA'; }
    const step = 2.5, cw = Math.ceil(W / CG), chh = Math.ceil(H / CG); if (!cm || cm.length !== cw * chh) cm = new Uint8Array(cw * chh);
    // nur das sichtbare Fenster des virtuellen Raums rechnen
    const x0 = Math.max(0, Math.floor(-ox / k)), x1 = Math.min(W, Math.ceil((ctx.vw - ox) / k)), y0 = Math.max(0, Math.floor(-oy / k)), y1 = Math.min(H, Math.ceil((ctx.vh - oy) / k));
    const dot = (c, x, y, v, i, j) => { v *= 0.78 + 0.4 * hsh(i, j); if (v > BAYER[(j & 3) * 4 + (i & 3)] / 16 + 0.035) { const z = 0.9 + 1.5 * Math.min(1, v); c.fillRect(x - z / 2, y - z / 2, z, z); } };
    const tipFar = P(800, 10); cm.fill(0);
    for (let cj = Math.floor(y0 / CG); cj < Math.min(chh, Math.ceil(y1 / CG)); cj++) for (let ci = Math.floor(x0 / CG); ci < Math.min(cw, Math.ceil(x1 / CG)); ci++) { const x = ci * CG + 6, y = cj * CG + 6; let m = 0;
      if (holdBack(x, y) < 40 || phoneBox(x, y) < 60) m |= 1; if (holdFront(x, y) < 26) m |= 2; if (cap(x, y, tx, ty, tipFar[0], tipFar[1], 160) < 0 && point(x, y) < 36) m |= 4; cm[cj * cw + ci] = m; }
    for (let j = Math.floor((y0 - 1.5) / step), y = 1.5 + j * step; y < y1; y += step, j++) for (let i = Math.floor((x0 - 1.5) / step), x = 1.5 + i * step; x < x1; x += step, i++) {
      if (y < 0 || x < 0) continue; const m = cm[Math.floor(y / CG) * cw + Math.floor(x / CG)]; if (!m) continue; const lf = lightF(x, y);
      if (m & 1) { const pb = phoneBox(x, y); if (pb > 0) { let v = 0; const d = holdBack(x, y);
        if (d < 0) { v = shN(holdBack, x, y, d, 70) * (0.45 + 0.6 * lf) * cl(1 - (y - 760) / 320); if (d > -2.6 && x < 880) v = Math.max(v, 0.95 * lf); v *= 0.35 + 0.65 * cl(pb / 26); } else if (d < 18) v = 0.18 * Math.exp(-d / 5) * lf * (hsh(j, i) < 0.4 ? 1 : 0);
        if (pb < 3) v = Math.max(v, 0.85);
        if (v > 0.02) dot(cb, x, y, v, i, j); } }
      let v2 = 0;
      if (m & 2) { const d = holdFront(x, y); if (d < 0) { v2 = shN(holdFront, x, y, d, 30) * (0.55 + 0.55 * lf); if (d > -2.2) v2 = Math.max(v2, 0.9 * lf + 0.1); const nq = nail(x, y, 616, 466, 652, 412, 0.72, 14, 11); if (nq < 1) v2 = nq > 0.72 ? v2 * 0.45 : Math.min(1, v2 * 0.6 + 0.4); } else if (d < 8) v2 = 0.16 * Math.exp(-d / 3); }
      if (m & 4) { const d = point(x, y); const fade = cl(1 - (Math.hypot(x - tx, y - ty) - 300) / 420); let v = 0;
        if (d < 0) { v = shN(point, x, y, d, 44) * (0.6 + 0.45 * lf + push * 0.25) * fade; if (d > -2.4) v = Math.max(v, 0.92 * fade); const n0 = P(4, 0), n1 = P(30, 0), nq = nail(x, y, n0[0], n0[1], n1[0], n1[1], 0.5, 12, 10); if (nq < 1) v = nq > 0.7 ? v * 0.45 : Math.min(1, v * 0.6 + 0.38); } else if (d < 14) v = 0.16 * Math.exp(-d / 4) * fade * (hsh(i, j + 3) < 0.45 ? 1 : 0); v2 = Math.max(v2, v); }
      if (v2 > 0.02) dot(cf, x, y, v2, i, j);
    }
    if (pr < 0.8) { const rr = 10 + pr * 150, a = 1 - pr / 0.8; cf.globalAlpha = a; for (let q = 0; q < 72; q++) { const an = (q / 72) * 6.2832; cf.fillRect(ht.x + Math.cos(an) * rr - 1, ht.y + Math.sin(an) * rr - 1, 2, 2); } cf.globalAlpha = 1; }
  },
  destroy() {},
};
