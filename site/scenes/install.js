// Installieren (Stub aus A0): Handy-Anleitung als Schleife (iPhone/Android/Rechner) und Ziffern aus Zeichen (ptext) als Schrittnummern.
// B5 ersetzt: gleicher Handy-Rahmen wie die Hand, Icon-Ankunft aus der Tiefe, Fragen-Animation, Kontrast.
import { cl, eo, backOut, hsh } from '../lib.js';

const IS = [['iPhone', ['Teilen antippen.', '„Zum Home-Bildschirm“ wählen.', '„Hinzufügen“ antippen. Fertig.']], ['Android', ['Menü ⋮ antippen.', '„App installieren“ wählen.', '„Installieren“ antippen. Fertig.']], ['Rechner', ['Installieren-Symbol in der Adressleiste klicken.', '„Installieren“ bestätigen.', 'ManaWG startet als eigenes Fenster.']]];
const SR = [[['Kopieren', '⌘C'], ['Zur Leseliste hinzufügen', ''], ['Zum Home-Bildschirm', '+'], ['Lesezeichen hinzufügen', '']], [['Neuer Tab', ''], ['Lesezeichen', '☆'], ['App installieren', '+'], ['Teilen', '']], [['', ''], ['', ''], ['', ''], ['', '']]];
const DLG = [['Zum Home-Bildschirm', 'Hinzufügen'], ['App installieren', 'Installieren'], ['App installieren?', 'Installieren']];
const GR = '@%#*+=-:', CS = 5;
let el, fr, q = {}, st = { inst: 0 }, clock = 0, lastStp = -1, tg = null, nums = [], acc = 0;

const rel = (e, root) => { let x = 0, y = 0; const w = e.offsetWidth, h = e.offsetHeight; while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x + w / 2 - 17, y + h / 2 - 17]; };
const render = (s) => {
  st = s; const P = s.inst, dk = P === 2; clock = 0; tg = null;
  el.querySelectorAll('[data-inst]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.inst === P)));
  el.querySelectorAll('[data-step]').forEach((n, i) => (n.textContent = IS[P][1][i]));
  fr.toggleAttribute('data-dk', dk); q.status.style.display = dk ? 'none' : ''; q.ibar.style.display = P === 0 ? 'flex' : 'none'; q.amenu.hidden = P !== 1; q.dicon.hidden = !dk;
  q.sheetBox.innerHTML = SR[P].map((r, i) => `<div${i === 2 ? ' data-tgt="2"' : ''}><span>${r[0]}</span><span class="mono">${r[1]}</span></div>`).join('');
  el.querySelectorAll('[data-bind="dlgTitle"]').forEach((n) => (n.textContent = DLG[P][0])); q.dbtn.textContent = DLG[P][1];
};
// ptext: Ziffern als Zeichen-Raster, streuen beim Eintritt (0,12 s Versatz je Ziffer) und finden zurück
const buildNums = (ctx) => {
  nums = [...el.querySelectorAll('canvas[data-text]')].map((cv, idx) => {
    const W = 110, H = 64, d = ctx.dpr, cols = Math.ceil(W / CS), rows = Math.ceil(H / CS); cv.width = W * d; cv.height = H * d;
    const oc = document.createElement('canvas'); oc.width = cols; oc.height = rows; const o = oc.getContext('2d'); o.fillStyle = '#000'; o.font = `500 ${64 / CS}px "JetBrains Mono", monospace`; o.textBaseline = 'alphabetic'; o.fillText(cv.dataset.text, 0, (64 * 0.8) / CS);
    const dta = o.getImageData(0, 0, cols, rows).data, cells = []; for (let k = 0; k < cols * rows; k++) if (dta[k * 4 + 3] > 110) cells.push({ x: (k % cols) * CS, y: Math.floor(k / cols) * CS, ox: (hsh(k, 1) - 0.5) * 300, oy: (hsh(k, 2) - 0.5) * 300, vx: 0, vy: 0 });
    const r = cv.getBoundingClientRect(); return { cv, c: cv.getContext('2d'), cells, delay: idx * 0.12, top: r.top + scrollY, left: r.left + scrollX };
  });
};
const drawNums = (t, ctx, step) => {
  const K = ctx.dpr, L = ctx.light, tq = Math.floor(t * 11), R = 110;
  for (const n of nums) { const c = n.c; c.setTransform(K, 0, 0, K, 0, 0); c.clearRect(0, 0, 110, 64); c.fillStyle = '#0A0A0A'; c.font = `500 ${Math.round(CS * 1.25)}px "JetBrains Mono", monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
    const mx = L.x - (n.left - scrollX), my = L.y - (n.top - ctx.scrollY), go = ctx.te >= n.delay || ctx.reduced;
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
    ctx.on(render); document.fonts.ready.then(() => buildNums(ctx));
  },
  resize(ctx) { tg = null; if (nums.length) buildNums(ctx); },
  frame(t, dt, ctx) {
    clock += dt; const P = st.inst, dk = P === 2, ct = clock % (dk ? 6.5 : 8);
    // Zielpunkte erst messen, wenn der Rahmen ausgefahren ist (0,7 s nach dem Wechsel), nie pro Frame
    if (!tg && clock > 0.7) { const tg1 = P === 0 ? q.share : P === 1 ? q.amenu : q.dicon, tg2 = dk ? q.dbtn : q.sheet.querySelector('[data-tgt="2"]'); tg = [rel(tg1, q.screen), rel(tg2, q.screen), rel(q.dbtn, q.screen)]; }
    const T1 = 1.6, T2 = 3.0, T3 = dk ? 99 : 4.2, shIn = dk ? 0 : eo((ct - 1.8) / 0.4) * (1 - eo((ct - 3.2) / 0.3)), dlIn = dk ? eo((ct - 1.8) / 0.3) * (1 - eo((ct - 3.3) / 0.3)) : eo((ct - 3.2) / 0.3) * (1 - eo((ct - 4.5) / 0.3)), hmIn = eo((ct - (dk ? 3.3 : 4.5)) / 0.5), pop = backOut((ct - (dk ? 3.9 : 5.1)) / 0.5, 1.7);
    q.sheet.style.transform = `translateY(${((1 - shIn) * 105).toFixed(1)}%)`; q.dlg.style.opacity = dlIn.toFixed(3); q.dlg.style.transform = `scale(${(0.92 + 0.08 * dlIn).toFixed(3)})`;
    q.home.style.opacity = hmIn.toFixed(3); q.micon.style.transform = `scale(${Math.max(0, pop).toFixed(3)})`;
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
