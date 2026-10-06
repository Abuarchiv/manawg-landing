// Installieren (Stub aus A0): Handy-Anleitung als Schleife (iPhone/Android/Rechner) und Ziffern aus Zeichen (ptext) als Schrittnummern.
// B5: Dither-Rahmen wie die Hand, Icon-Ankunft aus der Tiefe (ctx.handoff.bodies), Ziffern ab Eintritt, Fragen mit grid-template-rows.
import { cl, eo, ease, lerp, backOut, hsh, BAYER } from '../lib.js';

const IS = [['iPhone', ['Teilen antippen.', '„Zum Home-Bildschirm“ wählen.', '„Hinzufügen“ antippen. Fertig.']], ['Android', ['Menü ⋮ antippen.', '„App installieren“ wählen.', '„Installieren“ antippen. Fertig.']], ['Rechner', ['Installieren-Symbol in der Adressleiste klicken.', '„Installieren“ bestätigen.', 'ManaWG startet als eigenes Fenster.']]];
const SR = [[['Kopieren', '⌘C'], ['Zur Leseliste hinzufügen', ''], ['Zum Home-Bildschirm', '+'], ['Lesezeichen hinzufügen', '']], [['Neuer Tab', ''], ['Lesezeichen', '☆'], ['App installieren', '+'], ['Teilen', '']], [['', ''], ['', ''], ['', ''], ['', '']]];
const DLG = [['Zum Home-Bildschirm', 'Hinzufügen'], ['App installieren', 'Installieren'], ['App installieren?', 'Installieren']];
const GR = '@%#*+=-:', CS = 5;
const INK = '#0A0A0A', DIM = '#525252', M = 4;  // M: Rand für die Tasten
const ARR = { fly: 1.2, pop: 0.5, hold: 0.9, fade: 0.4 };
let el, fr, q = {}, st = { inst: 0 }, clock = 0, lastStp = -1, tg = null, nums = [], acc = 0, rd = false, prevTe = 1e9, aT = -1, arrC = null, geo = null, bgc = null;

const rel = (e, root) => { let x = 0, y = 0; const w = e.offsetWidth, h = e.offsetHeight; while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x + w / 2 - 17, y + h / 2 - 17]; };
const render = (s) => {
  st = s; const P = s.inst, dk = P === 2; clock = rd ? 6 : 0; tg = null; lastStp = -1;
  el.querySelectorAll('[data-inst]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.inst === P)));
  el.querySelectorAll('[data-step]').forEach((n, i) => (n.textContent = IS[P][1][i]));
  fr.toggleAttribute('data-dk', dk); q.status.style.display = dk ? 'none' : ''; q.ibar.style.display = P === 0 ? 'flex' : 'none'; q.amenu.hidden = P !== 1; q.dicon.hidden = !dk;
  q.sheetBox.innerHTML = SR[P].map((r, i) => `<div${i === 2 ? ' data-tgt="2"' : ''}><span>${r[0]}</span><span class="mono">${r[1]}</span></div>`).join('');
  el.querySelectorAll('[data-bind="dlgTitle"]').forEach((n) => (n.textContent = DLG[P][0])); q.dbtn.textContent = DLG[P][1];
};
// Rahmen im selben Dither wie die Hand: Bayer-Punkte im Ring, Licht von oben links, Tasten als Zellen im Rand
const rr = (x, y, hw, hh, r) => { const qx = Math.abs(x) - (hw - r), qy = Math.abs(y) - (hh - r); return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
const drawFrame = () => {
  const w = fr.offsetWidth, h = fr.offsetHeight, K = Math.min(devicePixelRatio || 1, 2), cs = getComputedStyle(fr), r = parseFloat(cs.borderTopLeftRadius) || 0, pad = parseFloat(cs.paddingLeft) || 10, dk = fr.hasAttribute('data-dk');
  const cv = q.bg, W = w + 2 * M, H = h + 2 * M; cv.width = Math.round(W * K); cv.height = Math.round(H * K);
  const c = bgc || (bgc = cv.getContext('2d')); c.setTransform(K, 0, 0, K, 0, 0); c.clearRect(0, 0, W, H); c.fillStyle = INK; c.strokeStyle = INK; c.lineWidth = 1.5;
  const st4 = 4, hw = w / 2, hh = h / 2;
  for (let j = 0; j * st4 < H; j++) for (let i = 0; i * st4 < W; i++) {
    const x = i * st4 + st4 / 2 - M, y = j * st4 + st4 / 2 - M, o = rr(x - hw, y - hh, hw, hh, r), n = rr(x - hw, y - hh, hw - pad, hh - pad, Math.max(0, r - pad));
    let v = -1;
    if (o < 0 && n > 0) v = 0.12 + 0.72 * (1 - (x / w + y / h) / 2) * (0.55 + 0.45 * Math.min(1, -o / pad));
    else if (!dk && o >= 0 && o < M && ((y > h * 0.14 && y < h * 0.22 && x < hw) || (y > h * 0.26 && y < h * 0.34 && x < hw) || (y > h * 0.2 && y < h * 0.34 && x > hw))) v = 0.9;
    if (v > BAYER[(j & 3) * 4 + (i & 3)] / 16 + 0.035) { const z = 0.9 + 1.5 * Math.min(1, v); c.fillRect(x + M - z / 2, y + M - z / 2, z, z); }
  }
  c.beginPath(); c.roundRect(M, M, w, h, r); c.stroke();
  c.beginPath(); c.roundRect(M + pad, M + pad, w - 2 * pad, h - 2 * pad, Math.max(0, r - pad)); c.stroke();
};
// Ankunft: Insel aus der Tiefe fällt ins Handy und wird zum Icon (mix-blend difference: dunkel auf Papier, hell auf dem Home-Bildschirm)
const drawArrive = (x, y, r, K, vw, vh) => {
  const c = arrC || (arrC = q.arrive.getContext('2d')); c.setTransform(K, 0, 0, K, 0, 0); c.clearRect(0, 0, vw, vh); c.fillStyle = '#fff';
  const stp = Math.max(3, Math.round(r / 11)), lx = x - r * 2.2, ly = y - r * 2.4;
  for (let yy = Math.floor((y - r) / stp) * stp; yy < y + r; yy += stp) for (let xx = Math.floor((x - r) / stp) * stp; xx < x + r; xx += stp) {
    const nx = (xx - x) / r, ny = (yy - y) / r, q2 = nx * nx + ny * ny; if (q2 > 1) continue; const nz = Math.sqrt(1 - q2), Lx = lx - x, Ly = ly - y, LL = Math.hypot(Lx, Ly, r * 2), lam = Math.max(0, (nx * Lx + ny * Ly + nz * r * 2) / LL), v = 0.1 + 0.9 * lam * lam, d = stp * Math.sqrt(v); c.fillRect(xx - d / 2, yy - d / 2, d, d); }
};
// Fragen: grid-template-rows 0fr -> 1fr (CSS), JS hält details für den Schließweg 420 ms offen
const faq = () => {
  const root = document.getElementById('fragen'); if (!root) return; const ds = [...root.querySelectorAll('details')]; document.documentElement.classList.add('faq-js'); ds.forEach((d) => (d.dataset.s = d.open ? '1' : '0'));
  const shut = (d) => { d.dataset.s = '0'; clearTimeout(d._t); d._t = setTimeout(() => (d.open = false), rd ? 0 : 420); };
  const show = (d) => { clearTimeout(d._t); d.open = true; requestAnimationFrame(() => requestAnimationFrame(() => (d.dataset.s = '1'))); };
  root.addEventListener('click', (e) => { const s = e.target.closest('summary'); if (!s) return; e.preventDefault(); const d = s.parentElement; if (d.dataset.s === '1') shut(d); else { ds.forEach((o) => o !== d && o.dataset.s === '1' && shut(o)); show(d); } });
};
// ptext: Ziffern als Zeichen-Raster, streuen beim Eintritt (0,12 s Versatz je Ziffer) und finden zurück
const buildNums = (ctx) => {
  nums = [...el.querySelectorAll('canvas[data-text]')].map((cv, idx) => {
    const W = 110, H = 64, d = ctx.dpr, cols = Math.ceil(W / CS), rows = Math.ceil(H / CS); cv.width = W * d; cv.height = H * d;
    const oc = document.createElement('canvas'); oc.width = cols; oc.height = rows; const o = oc.getContext('2d'); o.fillStyle = '#000'; o.font = `500 ${64 / CS}px "JetBrains Mono", monospace`; o.textBaseline = 'alphabetic'; o.fillText(cv.dataset.text, 0, (64 * 0.8) / CS);
    const dta = o.getImageData(0, 0, cols, rows).data, cells = []; for (let k = 0; k < cols * rows; k++) if (dta[k * 4 + 3] > 110) cells.push({ x: (k % cols) * CS, y: Math.floor(k / cols) * CS, ox: (hsh(k, 1) - 0.5) * 300, oy: (hsh(k, 2) - 0.5) * 300, vx: 0, vy: 0 });
    const r = cv.getBoundingClientRect(); return { cv, c: cv.getContext('2d'), cells, delay: idx * 0.12, top: r.top + scrollY, left: r.left + scrollX, seen: null, idx };
  });
};
const scatter = () => { for (const n of nums) { n.seen = null; for (const k of n.cells) { k.ox = (hsh(k.x, 1) - 0.5) * 300; k.oy = (hsh(k.y, 2) - 0.5) * 300; k.vx = k.vy = 0; } } };
const measure = (ctx) => { const r = fr.getBoundingClientRect(), m = q.micon.getBoundingClientRect(); geo = { top: r.top + ctx.scrollY, h: r.height, mx: m.left + m.width / 2 + scrollX, my: m.top + m.height / 2 + ctx.scrollY }; };
const drawNums = (t, ctx, step) => {
  const K = ctx.dpr, L = ctx.light, tq = Math.floor(t * 11), R = 110;
  for (const n of nums) { const c = n.c; c.setTransform(K, 0, 0, K, 0, 0); c.clearRect(0, 0, 110, 64); c.fillStyle = n.idx === lastStp ? INK : DIM; c.font = `500 ${Math.round(CS * 1.25)}px "JetBrains Mono", monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
    const mx = L.x - (n.left - scrollX), my = L.y - (n.top - ctx.scrollY), y0 = n.top - ctx.scrollY; if (n.seen === null && y0 < ctx.vh * 0.92 && y0 > -80) n.seen = ctx.te; const go = n.seen !== null && ctx.te >= n.seen + n.delay || ctx.reduced;
    for (const k of n.cells) {
      if (ctx.reduced) { k.ox = k.oy = 0; }
      else for (let s = 0; s < step; s++) { if (L.on) { const dx = k.x + k.ox - mx, dy = k.y + k.oy - my, d2 = dx * dx + dy * dy; if (d2 < R * R) { const d = Math.sqrt(d2) + 0.1, g = (1 - d / R) * 3.2; k.vx += (dx / d) * g; k.vy += (dy / d) * g; } }
        if (go) { k.vx += -k.ox * 0.07; k.vy += -k.oy * 0.07; k.vx *= 0.8; k.vy *= 0.8; k.ox += k.vx; k.oy += k.vy; } }
      const sp = Math.hypot(k.vx, k.vy), off = Math.hypot(k.ox, k.oy), gi = off > 3 || sp > 0.5 ? Math.floor(hsh(k.x + tq, k.y) * 8) : Math.floor(hsh(k.x, k.y) * 3);
      c.fillText(GR[gi], k.x + k.ox + CS / 2, k.y + k.oy + CS / 2); } }
};

export default {
  init(root, ctx) {
    el = root; fr = el.querySelector('[data-ins="frame"]'); for (const k of ['screen', 'status', 'ibar', 'amenu', 'dicon', 'share', 'sheet', 'dlg', 'dbtn', 'home', 'tap']) q[k] = fr.querySelector(`[data-ins="${k}"]`);
    q.sheetBox = q.sheet.querySelector('[data-sheet]');
    q.home.innerHTML = Array.from({ length: 16 }, (_, i) => (i === 1 ? '<div class="ph" data-micon><img src="img/icon-512.png" alt=""><span>ManaWG</span></div>' : '<div class="ph"><i></i><i style="width:30px;height:5px;border-radius:3px"></i></div>')).join('');
    q.micon = q.home.querySelector('[data-micon]');
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-inst]'); if (b) ctx.set({ inst: +b.dataset.inst }); });
    q.bg = fr.querySelector('[data-ins="bg"]'); q.arrive = el.querySelector('[data-ins="arrive"]'); rd = ctx.reduced; new ResizeObserver(drawFrame).observe(fr); faq();
    ctx.on(render); document.fonts.ready.then(() => { buildNums(ctx); drawFrame(); });
  },
  resize(ctx) { tg = null; geo = null; if (nums.length) buildNums(ctx); },
  frame(t, dt, ctx) {
    if (ctx.te < prevTe) { aT = rd ? 99 : -1; scatter(); } prevTe = ctx.te;
    if (!geo) measure(ctx);
    if (aT < 0 && geo.top - ctx.scrollY < ctx.vh * 0.8) aT = 0;
    const arriving = aT >= 0 && aT < ARR.fly + ARR.pop + ARR.hold; if (aT >= 0) aT += dt;
    if (aT < 0 || arriving) {
      // Wartezustand: Home-Bildschirm, Icon kommt aus der Tiefe
      const f = aT < 0 ? 0 : cl(aT / ARR.fly), pp = aT < 0 ? 0 : Math.max(0, backOut((aT - ARR.fly) / ARR.pop, 1.7));
      q.home.style.opacity = '1'; q.micon.style.transform = `scale(${pp.toFixed(3)})`; q.sheet.style.transform = 'translateY(105%)'; q.dlg.style.opacity = '0'; q.tap.style.opacity = '0';
      if (aT >= 0 && aT < ARR.fly) { const b = ctx.handoff.bodies && ctx.handoff.bodies[0], r0 = b ? Math.min(b.r, ctx.vh * 0.2) : 90, x0 = b ? cl(b.x, r0, ctx.vw - r0) : ctx.vw / 2, ex = geo.mx - scrollX, ey = geo.my - ctx.scrollY, u = ease(f), r = lerp(r0, 26, f * f * (3 - 2 * f));
        q.arrive.hidden = false; const K = Math.min(ctx.dpr, 2); if (q.arrive.width !== Math.round(ctx.vw * K)) { q.arrive.width = Math.round(ctx.vw * K); q.arrive.height = Math.round(ctx.vh * K); }
        drawArrive(lerp(x0, ex, u), lerp(-r0, ey, f * f), r, K, ctx.vw, ctx.vh); } else q.arrive.hidden = true;
      clock = 0; lastStp = -1;
      acc += dt; let n = 0; while (acc >= 1 / 60) { acc -= 1 / 60; n++; } drawNums(t, ctx, n); return;
    }
    q.arrive.hidden = true;
    const ft = aT - (ARR.fly + ARR.pop + ARR.hold), fo = cl(1 - ft / ARR.fade);
    if (!rd) clock += dt; const P = st.inst, dk = P === 2, ct = clock % (dk ? 6.5 : 8);
    // Zielpunkte erst messen, wenn der Rahmen ausgefahren ist (0,7 s nach dem Wechsel), nie pro Frame
    if (!tg && clock > 0.7) { const tg1 = P === 0 ? q.share : P === 1 ? q.amenu : q.dicon, tg2 = dk ? q.dbtn : q.sheet.querySelector('[data-tgt="2"]'); tg = [rel(tg1, q.screen), rel(tg2, q.screen), rel(q.dbtn, q.screen)]; }
    const T1 = 1.6, T2 = 3.0, T3 = dk ? 99 : 4.2, shIn = dk ? 0 : eo((ct - 1.8) / 0.4) * (1 - eo((ct - 3.2) / 0.3)), dlIn = dk ? eo((ct - 1.8) / 0.3) * (1 - eo((ct - 3.3) / 0.3)) : eo((ct - 3.2) / 0.3) * (1 - eo((ct - 4.5) / 0.3)), hmIn = eo((ct - (dk ? 3.3 : 4.5)) / 0.5), pop = backOut((ct - (dk ? 3.9 : 5.1)) / 0.5, 1.7);
    q.sheet.style.transform = `translateY(${((1 - shIn) * 105).toFixed(1)}%)`; q.dlg.style.opacity = dlIn.toFixed(3); q.dlg.style.transform = `scale(${(0.92 + 0.08 * dlIn).toFixed(3)})`;
    q.home.style.opacity = Math.max(hmIn, fo).toFixed(3); q.micon.style.transform = `scale(${(fo > 0 ? 1 : Math.max(0, pop)).toFixed(3)})`;
    const A = [150, dk ? 200 : 560], p1 = tg ? tg[0] : A, p2 = tg ? tg[1] : A, p3 = tg ? tg[2] : A; let p; const last = dk ? T2 : T3;
    if (ct < T1) { const k = eo((ct - 0.8) / 0.7); p = [A[0] + (p1[0] - A[0]) * k, A[1] + (p1[1] - A[1]) * k]; }
    else if (ct < T2) { const k = eo((ct - (T2 - 0.8)) / 0.7); p = [p1[0] + (p2[0] - p1[0]) * k, p1[1] + (p2[1] - p1[1]) * k]; }
    else if (!dk && ct < T3) { const k = eo((ct - (T3 - 0.8)) / 0.7); p = [p2[0] + (p3[0] - p2[0]) * k, p2[1] + (p3[1] - p2[1]) * k]; } else p = dk ? p2 : p3;
    const near = Math.min(Math.abs(ct - T1), Math.abs(ct - T2), Math.abs(ct - T3)), press = near < 0.15 ? 0.7 : 1;
    q.tap.style.opacity = (cl((ct - 0.6) / 0.3) * (1 - cl((ct - last - 0.2) / 0.3)) * 0.85).toFixed(3); q.tap.style.transform = `translate(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px) scale(${press})`;
    const stp = ct < 1.8 ? 0 : ct < (dk ? 3.3 : 3.2) ? 1 : 2; if (stp !== lastStp) { lastStp = stp; el.querySelectorAll('[data-istep]').forEach((n) => (+n.dataset.istep === stp ? n.setAttribute('data-active', '') : n.removeAttribute('data-active'))); }
    // feste Schrittweite 1/60 s für die Zeichen-Ziffern
    acc += dt; let n = 0; while (acc >= 1 / 60) { acc -= 1 / 60; n++; } drawNums(t, ctx, n);
  },
  destroy() {},
};
