// Rendert die Standalone-HTML aus <OUT>/screens neu (390 × 844, DPR 3) und legt sie nach <SCR>/shots/verify für den Pixelvergleich ab.
// Dunkel-Gegenprobe: dieselbe Datei mit class="dark" am <html> gegen die Dunkel-Aufnahmen 65–72.
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync } from 'node:fs';
const require = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json');
const { chromium } = require('@playwright/test');
const SCR = process.env.SCR || (process.env.SCR || './out');
const OUT = process.env.OUT || '/Users/abu/Company/manawg-landing/design/app-ref';
const PORT = process.env.STATIC_PORT || 4245;
const DIR = `${SCR}/shots/verify`;
mkdirSync(DIR, { recursive: true });
const b = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'de-DE', serviceWorkers: 'block' });
const pg = await ctx.newPage();
const failed = [];
pg.on('requestfailed', (r) => failed.push(r.url()));
pg.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
const names = readdirSync(`${OUT}/screens`).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
const DARK = { '04-haushalt-einkaeufe': '65-haushalt-einkaeufe-dunkel', '03-haushalt-putzplan': '66-haushalt-putzplan-dunkel', '09-austausch-chat': '67-austausch-chat-dunkel', '08-austausch-pinnwand': '68-austausch-pinnwand-dunkel', '16-ausgabe-hinzufuegen-kinoabend': '69-ausgabe-hinzufuegen-kinoabend-dunkel', '11-putzplan-erledigen-dialog': '70-putzplan-erledigen-dialog-dunkel', '10-austausch-kalender': '71-austausch-kalender-dunkel', '05-haushalt-vorraete': '72-haushalt-vorraete-dunkel', '01-start': '40-start-dunkel' };
const shot = async (n, out, dark) => {
	await pg.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
	await pg.goto(`http://127.0.0.1:${PORT}/screens/${n}.html`, { waitUntil: 'networkidle' });
	if (dark) await pg.evaluate(() => document.documentElement.classList.add('dark'));
	await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
	await pg.screenshot({ path: `${DIR}/${out}.png`, animations: 'disabled' });
};
for (const n of names) await shot(n, n, false);
for (const [n, dk] of Object.entries(DARK)) if (names.includes(n)) await shot(n, dk, true);
console.log('gerendert:', names.length, '+', Object.keys(DARK).filter((n) => names.includes(n)).length, 'dunkel | fehlgeschlagene Requests:', [...new Set(failed)].slice(0, 5));
await b.close();
