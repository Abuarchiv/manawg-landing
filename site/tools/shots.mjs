// Screenshots je P-Marke und Viewport, optional fps-Messung (5 s je Szene).
//   node site/tools/shots.mjs [--vp=390x844,1440x900] [--only=hero,tiefe] [--fps] [--url=http://localhost:4190]
// Spielt einen eigenen Server auf :4190, falls keiner laeuft. Ausgabe: site/tools/out/<viewport>/<name>.png
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json');
const { chromium } = require('@playwright/test');
const here = path.dirname(fileURLToPath(import.meta.url)), site = path.resolve(here, '..'), out = path.join(here, 'out');
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d;
const VPS = arg('vp', '390x844,1440x900').split(',').map((s) => s.split('x').map(Number));
const ONLY = arg('only', '') ? arg('only').split(',') : null, FPS = process.argv.includes('--fps'), BASE = arg('url', 'http://localhost:4190');
const { TL } = await import(path.join(site, 'lib.js'));

const up = async () => { try { return (await fetch(BASE + '/index.html')).ok; } catch { return false; } };
let srv = null; if (!(await up())) { srv = spawn('python3', ['-m', 'http.server', '4190', '-d', site], { stdio: 'ignore' }); for (let i = 0; i < 30 && !(await up()); i++) await new Promise((r) => setTimeout(r, 200)); }
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
const log = [];
for (const [w, h] of VPS) {
  const dir = path.join(out, `${w}x${h}`); mkdirSync(dir, { recursive: true });
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 900 })).newPage();
  const errs = []; page.on('console', (m) => m.type() === 'error' && errs.push(m.text())); page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`${BASE}/index.html${FPS ? '?fps=1' : ''}`); await page.waitForFunction(() => document.documentElement.classList.contains('ready'), null, { timeout: 15000 }); await page.waitForTimeout(2200);
  // Offsets der Sektionen in Seitenkoordinaten
  const geo = await page.evaluate(() => { const g = {}; for (const id of ['bogen', 'koerper', 'tiefe', 'installieren', 'fragen', 'finale', 'footer']) { const e = document.getElementById(id), r = e.getBoundingClientRect(); g[id] = { top: r.top + scrollY, h: e.offsetHeight }; } g.max = document.documentElement.scrollHeight - innerHeight; return g; });
  const goto = async (y, wait = 900) => { await page.evaluate((v) => scrollTo(0, v), Math.max(0, Math.min(geo.max, y))); await page.waitForTimeout(wait); };
  const jobs = [];
  for (const p of TL.marks) jobs.push([`bogen-p${String(Math.round(p * 100)).padStart(3, '0')}`, geo.bogen.top + p * (geo.bogen.h - h), 'bogen']);
  for (const [id, ps] of Object.entries(TL.sections)) for (const p of ps) { const g = geo[id], sticky = id === 'tiefe'; jobs.push([`${id}-${Math.round(p * 100)}`, sticky ? g.top + p * (g.h - h) : g.top - h + p * (g.h + h), id]); }
  for (const [name, y, grp] of jobs) { if (ONLY && !ONLY.includes(grp) && !ONLY.includes(name)) continue; await goto(y); await page.screenshot({ path: path.join(dir, name + '.png') }); }
  if (FPS) {
    const scenes = { hero: ['bogen', 0.0], berg: ['bogen', 0.3], wohnung: ['bogen', 0.72], hand: ['bogen', 0.97], koerper: ['koerper', 0.5], depth: ['tiefe', 0.5], install: ['installieren', 0.5], sun: ['finale', 0.5] };
    for (const [n, [id, p]] of Object.entries(scenes)) { if (ONLY && !ONLY.includes(n)) continue; const g = geo[id]; await goto(id === 'bogen' || id === 'tiefe' ? g.top + p * (g.h - h) : g.top - h + p * (g.h + h), 700);
      await page.evaluate(() => window.__fps.reset()); await page.waitForTimeout(5000); const f = await page.evaluate(() => { const { reset, ...r } = window.__fps; return r; }); log.push({ vp: `${w}x${h}`, scene: n, ...f }); }
  }
  log.push({ vp: `${w}x${h}`, consoleErrors: errs }); await page.context().close();
}
await browser.close(); if (srv) srv.kill();
console.log(JSON.stringify(log, null, 1));
