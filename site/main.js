// Boot: Lenis, eine rAF-Schleife, Sichtbarkeit, Resize/DPR, Licht, ?fps. Nach A0 eingefroren.
import Lenis from './vendor/lenis.mjs';
import { cl, damp, tlAt, TL } from './lib.js';
import { ui } from './ui.js';

const SCENES = [['hero', './scenes/hero.js'], ['wohnung', './scenes/wohnung.js'], ['flut', './scenes/flut.js'], ['hand', './scenes/hand.js'],
  ['physics', './scenes/physics.js'], ['depth', './scenes/depth.js'], ['install', './scenes/install.js'], ['sun', './scenes/sun.js']];
const q = new URLSearchParams(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bogen = document.getElementById('bogen'), stageEl = bogen.querySelector('.stage');
const headEl = document.querySelector('.top');
const g = ui({ tab: 0, done: { Spülmittel: true }, added: false, replied: false, inst: 0 });

// ctx: wird von allen Szenen gelesen. Szenen tauschen nur hierüber Daten aus.
const ctx = {
  papers: [], P: 0, Praw: 0, tl: tlAt(0), scrollY: 0, vel: 0, prog: 0, te: 0, t: 0,
  light: { x: 0, y: 0, on: false, pulse: 0 }, clickT: -9, click: { x: 0, y: 0 },
  reduced, tier: 'desktop', vw: innerWidth, vh: innerHeight, dpr: 1, ready: false, readyT: 0,
  stage: { holeX: 0, holeY: 0, holeR: 0 },   // hero -> wohnung
  handoff: { bodies: null },                  // physics -> install
  state: g.state, set: g.set, on: g.on,
  d: (rate, dt) => (reduced ? 1 : damp(rate, dt)),   // Glättung, im reduzierten Modus sofort am Ziel
};
window.__ctx = ctx;

const scenes = [];
let lenis = null;
if (!reduced) { lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true }); window.__lenis = lenis; }

// ---- Messen (nur bei Resize, nie pro Frame) ----
const measure = () => {
  ctx.vw = innerWidth; ctx.vh = innerHeight; ctx.dpr = Math.min(devicePixelRatio || 1, 2); ctx.tier = ctx.vw < 900 ? 'mobile' : 'desktop';
  const y = scrollY, top = (el) => el.getBoundingClientRect().top + y;
  ctx.bogen = { top: top(bogen), span: Math.max(1, bogen.offsetHeight - stageEl.offsetHeight) };
  ctx.papers = [...document.querySelectorAll('.paper')].map((e) => [top(e), top(e) + e.offsetHeight]);
  for (const s of scenes) { const tr = s.track; s.top = top(tr); s.h = tr.offsetHeight; s.sticky = !!tr.querySelector(':scope > .stage'); }
};
const resizeAll = () => { measure(); for (const s of scenes) if (s.ok) try { s.mod.resize(ctx); } catch (e) { console.error('resize ' + s.name, e); } };
let rq = 0; const onResize = () => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; resizeAll(); }); };
addEventListener('resize', onResize); new ResizeObserver(onResize).observe(document.documentElement);

// ---- Licht: Maus auf Desktop, auf Touch Halten, 0,6 s Nachglühen ----
const L = ctx.light; let held = false, mouseOn = false, relT = -9;
const BLOCK = 'a,button,summary,nav,header,[data-noblast]';
addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') mouseOn = true; if (e.pointerType === 'mouse' || held) { L.x = e.clientX; L.y = e.clientY; } });
addEventListener('pointerdown', (e) => { L.x = e.clientX; L.y = e.clientY; if (e.pointerType !== 'mouse') held = true; else mouseOn = true;
  if (!(e.target.closest && e.target.closest(BLOCK))) { ctx.clickT = performance.now() / 1000 - T0; ctx.click.x = e.clientX; ctx.click.y = e.clientY; } });
const rel = (e) => { if (held) { held = false; relT = performance.now() / 1000; } };
addEventListener('pointerup', rel); addEventListener('pointercancel', rel);
document.documentElement.addEventListener('mouseleave', () => { mouseOn = false; relT = performance.now() / 1000 - 0.6; });
document.documentElement.addEventListener('mouseenter', () => { mouseOn = true; });

// ---- Fps-Overlay ----
const fps = { n: 0, ms: [], per: {}, reset() { this.ms.length = 0; this.per = {}; this.n = 0; } };
const stat = () => { const a = fps.ms.slice().sort((x, y) => x - y); const avgMs = a.reduce((s, v) => s + v, 0) / (a.length || 1);
  const per = {}; for (const k in fps.per) per[k] = +(fps.per[k][0] / Math.max(1, fps.per[k][1])).toFixed(2);
  return { avg: +(1000 / (avgMs || 1)).toFixed(1), p95: +(a[Math.floor(a.length * 0.95)] || 0).toFixed(1), frames: a.length, perScene: per }; };
let fpsEl = null;
if (q.has('fps')) { fpsEl = document.createElement('pre'); fpsEl.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99;margin:0;padding:6px 8px;background:#0A0A0A;color:#FAFAFA;border:1px solid #FAFAFA;font:12px/1.4 "JetBrains Mono",monospace;pointer-events:none'; document.body.append(fpsEl);
  Object.defineProperty(window, '__fps', { get: () => ({ ...stat(), reset: () => fps.reset() }) });
  setInterval(() => { const s = stat(); fpsEl.textContent = `${s.avg} fps · p95 ${s.p95} ms\n` + Object.entries(s.perScene).map(([k, v]) => `${k} ${v} ms`).join('\n'); }, 500); }

// ---- Schleife ----
const T0 = performance.now() / 1000; let last = 0, prevY = scrollY;
const gate = (s) => { const r = TL.gate[s.name]; return !r || (ctx.P >= r[0] && ctx.P <= r[1]); };
const progOf = (s) => (s.sticky ? cl((ctx.scrollY - s.top) / Math.max(1, s.h - ctx.vh)) : cl((ctx.scrollY + ctx.vh - s.top) / (s.h + ctx.vh)));
const loop = (ts) => {
  requestAnimationFrame(loop);
  if (document.hidden) { last = 0; return; }
  const now = ts / 1000, dt = last ? Math.min(0.05, now - last) : 1 / 60; if (last) { fps.ms.push((now - last) * 1000); if (fps.ms.length > 600) fps.ms.shift(); } last = now;
  if (lenis) lenis.raf(ts);
  ctx.scrollY = lenis ? lenis.scroll : scrollY; ctx.vel = lenis ? lenis.velocity : (scrollY - prevY) / Math.max(dt, 1e-3); prevY = scrollY;
  ctx.Praw = cl((ctx.scrollY - ctx.bogen.top) / ctx.bogen.span); ctx.P += (ctx.Praw - ctx.P) * ctx.d(10, dt); if (Math.abs(ctx.Praw - ctx.P) < 1e-4) ctx.P = ctx.Praw;
  const tl = ctx.tl = tlAt(ctx.P), st = stageEl.style; st.setProperty('--p', ctx.P.toFixed(4)); st.setProperty('--g', tl.g.toFixed(3)); st.setProperty('--f', tl.f.toFixed(3)); st.setProperty('--e', tl.e.toFixed(3));
  st.setProperty('--fl', tl.flut.toFixed(3)); stageEl.classList.toggle('end-on', tl.e > 0.6); tl.c.forEach((v, j) => st.setProperty('--c' + j, v.toFixed(3)));
  const nowS = performance.now() / 1000; L.pulse = held || mouseOn ? 1 : Math.max(0, 1 - (nowS - relT) / 0.6); L.on = L.pulse > 0.001 && !reduced;
  { const y = ctx.scrollY + 30; headEl.classList.toggle('ink', ctx.papers.some(([a, b]) => y >= a && y < b)); }
  const t = reduced ? 0 : now - T0; ctx.t = t;
  for (const s of scenes) {
    if (!s.ok || !s.vis || !gate(s)) { s.entered = false; continue; }
    if (!s.entered) { s.entered = true; s.enter = now; }
    ctx.te = now - s.enter; ctx.prog = progOf(s);
    const c0 = performance.now(); try { s.mod.frame(t, dt, ctx); } catch (e) { console.error('scene ' + s.name, e); s.ok = false; }
    const a = fps.per[s.name] || (fps.per[s.name] = [0, 0]); a[0] += performance.now() - c0; a[1]++;
  }
};

// ---- Szenen laden ----
const load = async ([name, path]) => {
  const el = document.querySelector(`[data-scene="${name}"]`); if (!el) return;
  const s = { name, el, vis: false, ok: false, entered: false, enter: 0, track: el.closest('[data-track]') || el };
  try { s.mod = (await import(path)).default; scenes.push(s); } catch (e) { console.error('load ' + name, e); return; }
  new IntersectionObserver((en) => { s.vis = en[en.length - 1].isIntersecting; }, { rootMargin: '120px' }).observe(el);
};
(async () => {
  await Promise.all(SCENES.map(load)); measure();
  for (const s of scenes) try { await s.mod.init(s.el, ctx); s.ok = true; s.mod.resize(ctx); } catch (e) { console.error('init ' + s.name, e); }
  requestAnimationFrame(loop);
  // Loader: kein Zähler, wartet nur auf Schrift und erste Frames (höchstens 800 ms)
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))]);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  ctx.readyT = performance.now() / 1000 - T0; ctx.ready = true; document.documentElement.classList.add('ready'); resizeAll();
})();
