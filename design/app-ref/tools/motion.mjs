// Misst die echte Bewegung der App: welche Übergänge/Animationen bei welcher Interaktion laufen (Dauer, Kurve, Eigenschaft).
// Quelle: transitionrun/animationstart-Ereignisse im Browser + berechnete Stile. Ausgabe: data/motion.json
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json');
const { chromium } = require('@playwright/test');
const SCR = process.env.SCR || (process.env.SCR || './out');
const BASE = process.env.BASE || 'http://127.0.0.1:4241', WG = `${BASE}/wg/MTE8PZAT`;

const b = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE', timezoneId: 'Europe/Berlin', serviceWorkers: 'block' });
await ctx.addInitScript(() => {
	try { localStorage.setItem('manawg_identity:989ac820-58b7-431f-9c65-28721264f333', JSON.stringify({ memberId: '7d898f9e-5ad7-4f5d-abed-8c3e99a76973', name: 'Jona', memberToken: 'fixture-member-token' })); } catch {}
	window.__motion = [];
	const desc = (t) => { if (!t || !t.tagName) return '?'; const a = (n) => t.getAttribute && t.getAttribute(n); return `${t.tagName.toLowerCase()}${a('data-slot') ? `[${a('data-slot')}]` : ''}${a('role') ? `[role=${a('role')}]` : ''}${a('aria-label') ? `[${a('aria-label').slice(0, 28)}]` : ''}${a('data-state') ? `[state=${a('data-state')}]` : ''}`; };
	const rec = (e) => {
		const t = e.target; if (!t || !t.tagName) return; const cs = getComputedStyle(t);
		const o = { ev: e.type, t: Math.round(performance.now()), target: desc(t), prop: e.propertyName || e.animationName };
		if (e.type === 'transitionrun') { o.duration = cs.transitionDuration; o.easing = cs.transitionTimingFunction; o.delay = cs.transitionDelay; }
		else { o.duration = cs.animationDuration; o.easing = cs.animationTimingFunction; o.delay = cs.animationDelay; o.fill = cs.animationFillMode; o.iter = cs.animationIterationCount;
			for (const v of ['--tw-enter-opacity', '--tw-enter-scale', '--tw-enter-translate-x', '--tw-enter-translate-y', '--tw-exit-opacity', '--tw-exit-scale', '--tw-exit-translate-x', '--tw-exit-translate-y', '--tw-duration', '--tw-ease']) { const x = cs.getPropertyValue(v).trim(); if (x) o[v.slice(2)] = x; } }
		window.__motion.push(o);
	};
	document.addEventListener('transitionrun', rec, true); document.addEventListener('animationstart', rec, true);
});
const pg = await ctx.newPage();
await pg.goto(`${BASE}/demo-reset`);
const out = {};
const open = async (p = '', wait = 1300) => { await pg.goto(`${WG}${p}`, { waitUntil: 'networkidle', timeout: 120000 }); await pg.waitForTimeout(wait); };
const run = async (name, act, wait = 700) => {
	await pg.evaluate(() => { window.__motion.length = 0; });
	await act(); await pg.waitForTimeout(wait);
	const raw = await pg.evaluate(() => window.__motion.slice());
	const seen = new Map(); for (const r of raw) { const k = `${r.ev}|${r.target}|${r.prop}`; if (!seen.has(k)) seen.set(k, r); }
	const rows = [...seen.values()].filter((r) => !/^(svg|path|circle|line)\b/.test(r.target)).sort((a, c) => a.t - c.t);
	const t0 = rows[0]?.t ?? 0; out[name] = rows.map((r) => ({ ...r, t: r.t - t0 })).slice(0, 40);
	console.log(name, rows.length);
};

await open('/putzen');
await run('dialog-offnen (Bad putzen erledigen)', () => pg.getByRole('button', { name: /Bad putzen/ }).first().click());
await run('dialog-schliessen (Abbrechen)', () => pg.getByRole('button', { name: 'Abbrechen' }).click());
await run('pressed-button (Maus unten auf Haken)', async () => { const bt = pg.getByRole('button', { name: /Bad putzen/ }).first(); const bb = await bt.boundingBox(); await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await pg.mouse.down(); }, 300);
await pg.mouse.up(); await pg.waitForTimeout(500);
await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
await run('disclosure (So wird verteilt)', () => pg.getByText('So wird verteilt').first().click());
await run('subnav-wechsel (Putzplan → Einkäufe)', () => pg.getByRole('link', { name: /^Einkäufe/ }).click(), 1500);
await run('checkbox (Hafermilch abhaken)', () => pg.getByRole('checkbox', { name: 'Hafermilch erledigen' }).click(), 1500);
await run('sheet-offnen (Artikelaktionen)', () => pg.getByRole('button', { name: /Artikelaktionen/ }).first().click(), 900);
await run('sheet-schliessen (Schließen)', () => pg.getByRole('button', { name: 'Schließen' }).click(), 900);
await run('bottom-nav (Finanzen)', () => pg.getByRole('link', { name: 'Finanzen' }).click(), 1600);
await run('formular-offnen (Ausgabe hinzufügen)', () => pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click(), 1000);
await run('formular-speichern (Toast)', async () => { await pg.getByLabel('Beschreibung').fill('Kino'); await pg.getByLabel('Betrag').fill('10,00'); await pg.getByRole('button', { name: 'Ausgabe speichern' }).click(); }, 1500);
await open('/putzen');
await run('toast-putzen (Erledigt bestätigen)', async () => { await pg.getByRole('button', { name: /Bad putzen/ }).first().click(); await pg.getByRole('button', { name: 'Erledigt bestätigen' }).click(); }, 5500);
// Lebensdauer des Hinweises messen
await open('/putzen');
await pg.getByRole('button', { name: /Bad putzen/ }).first().click(); await pg.getByRole('button', { name: 'Erledigt bestätigen' }).click();
{ const t0 = Date.now(); let seen = false, gone = null; while (Date.now() - t0 < 9000) { const n = await pg.getByText('Bad putzen erledigt').count(); if (n) seen = true; if (seen && !n) { gone = Date.now() - t0; break; } await pg.waitForTimeout(100); } out['toast-lebensdauer-ms'] = [{ ev: 'messung', t: 0, target: 'Hinweis „Bad putzen erledigt …“ verschwindet nach (ms ab Klick)', prop: String(gone) }]; console.log('Hinweis weg nach ms', gone); }
await open('/chat', 9000);
await run('chat-senden', async () => { await pg.getByPlaceholder('Nachricht schreiben').fill('Hallo'); await pg.getByRole('button', { name: 'Nachricht senden' }).click(); }, 1200);
// Skeleton: Dashboard verzögern
await pg.route('**/api/wg/MTE8PZAT/dashboard', async (r) => { await new Promise((res) => setTimeout(res, 3500)); await r.continue(); });
await run('skeleton-laden (Start)', () => pg.goto(WG, { waitUntil: 'domcontentloaded' }), 1500);
await b.close();
writeFileSync(`${SCR}/data/motion.json`, JSON.stringify(out, null, 1));
console.log('geschrieben:', Object.keys(out).length, 'Szenarien');
