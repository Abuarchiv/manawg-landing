// A-2: Abläufe A-D, Tabbar, SubNav, Kopf-Icons, Start-Zeilen und Ausgleichen per echten Mausklicks im Demo (Ref-Modus).
// Jeder Schritt endet im Zielzustand: Pixel gegen das Original (<= 0,5 %) und Text gegen die Aufnahme (data/final/NN.json).
// Aufruf: node tools/qa/app/flows.mjs [--base http://127.0.0.1:4261/app-demo/index.html] [--out <dir>] [--video]
import { readFileSync, readdirSync } from 'node:fs';
import { args, launch, sharp } from '../lib.mjs';

const o = args();
const base = o.base || 'http://127.0.0.1:4261/app-demo/index.html';
const SC =
	'/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/app';
const SHOTS = `${SC}/shots/final`;
const DATA = `${SC}/data/final`;
const orig = Object.fromEntries(
	readdirSync(SHOTS)
		.filter((f) => /^\d\d-.*\.png$/.test(f) && !f.endsWith('-full.png'))
		.map((f) => [f.slice(0, 2), f]),
);

const b = await launch();
const rows = [];
let fails = 0;
const errs = [];

async function pct(buf, nn) {
	const a = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const c = await sharp(`${SHOTS}/${orig[nn]}`)
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	if (a.info.width !== c.info.width || a.info.height !== c.info.height) return 100;
	let n = 0;
	for (let i = 0; i < a.data.length; i += 3)
		if (
			Math.max(
				Math.abs(a.data[i] - c.data[i]),
				Math.abs(a.data[i + 1] - c.data[i + 1]),
				Math.abs(a.data[i + 2] - c.data[i + 2]),
			) > 24
		)
			n++;
	return (100 * n) / (a.data.length / 3);
}
const strip = (t) =>
	t
		.replace(/\d{2}:\d{2}/g, 'HH:MM')
		.replace(/\s+/g, ' ')
		.trim();
async function textCheck(pg, nn) {
	const f = readdirSync(DATA).find(
		(x) => x.startsWith(`${nn}-`) && x.endsWith('.json') && !x.endsWith('.doc.json'),
	);
	const j = JSON.parse(readFileSync(`${DATA}/${f}`, 'utf8'));
	const have = strip(await pg.evaluate(() => document.body.textContent));
	const missing = j.texts
		.filter((t) => !t.sr)
		.map((t) => strip(t.t))
		.filter((t) => t && !have.includes(t));
	return missing;
}

async function run(name, fn) {
	if (o.only && !new RegExp(String(o.only)).test(name)) return;
	const ctx = await b.newContext({
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 3,
		isMobile: true,
		hasTouch: true,
		locale: 'de-DE',
		timezoneId: 'Europe/Berlin',
		recordVideo: o.video ? { dir: o.out, size: { width: 390, height: 844 } } : undefined,
	});
	const pg = await ctx.newPage();
	pg.on(
		'console',
		(m) =>
			['error', 'warning'].includes(m.type()) && errs.push(`${name}: ${m.text().slice(0, 140)}`),
	);
	pg.on('pageerror', (e) => errs.push(`${name}: ${e.message}`));
	await pg.goto(`${base}?ref=1`);
	await pg.waitForSelector('html[data-bereit]');
	await pg.waitForTimeout(500);
	const check = async (label, nn, wait = 800) => {
		await pg.waitForTimeout(wait);
		await pg.mouse.move(5, 5);
		await pg.waitForTimeout(150);
		const buf = await pg.screenshot({ animations: 'disabled' });
		const p = await pct(buf, nn);
		const miss = await textCheck(pg, nn);
		const ok = p <= 0.5 && miss.length === 0;
		if (!ok) {
			fails++;
			if (o.out) await sharp(buf).toFile(`${o.out}/${name}-${nn}.png`);
		}
		rows.push(
			`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(14)} ${label.padEnd(34)} -> ${nn}  ${p.toFixed(3)} %${miss.length ? `  Text fehlt: ${miss.slice(0, 4).join(' | ')}` : ''}`,
		);
	};
	const tap = (loc) => loc.click({ timeout: 8000 });
	const tab = (n) => tap(pg.locator('nav a', { hasText: new RegExp(`^${n}$`) }).last());
	const sub = (n) => tap(pg.locator('main nav a', { hasText: new RegExp(`^${n}`) }).first());
	try {
		await fn({ pg, check, tap, tab, sub });
	} catch (e) {
		fails++;
		rows.push(`FAIL ${name.padEnd(14)} ${e.message.split('\n')[0].slice(0, 160)}`);
		if (o.out) await pg.screenshot({ path: `${o.out}/${name}-fehler.png` });
		rows.push(`     Zustand: ${await pg.evaluate(() => JSON.stringify(window.__demo?.state?.()))}`);
	}
	await ctx.close();
}

await run('Tabbar', async ({ check, tab }) => {
	await check('Start', '01', 100);
	await tab('Haushalt');
	await check('Tab Haushalt', '03');
	await tab('Finanzen');
	await check('Tab Finanzen', '06');
	await tab('Austausch');
	await check('Tab Austausch', '08');
	await tab('Start');
	await check('Tab Start', '01');
});
await run('SubNav', async ({ check, tab, sub }) => {
	await tab('Haushalt');
	await sub('Einkäufe');
	await check('Einkäufe', '04');
	await sub('Vorräte');
	await check('Vorräte', '05');
	await sub('Putzplan');
	await check('Putzplan', '03');
	await tab('Finanzen');
	await sub('Fixkosten');
	await check('Fixkosten', '07');
	await sub('Ausgaben');
	await check('Ausgaben', '06');
	await tab('Austausch');
	await sub('Chat');
	await check('Chat', '09');
	await sub('Kalender');
	await check('Kalender', '10');
	await sub('Pinnwand');
	await check('Pinnwand', '08');
});
await run('Kopf+Start', async ({ pg, check, tap }) => {
	await tap(pg.locator('header a[aria-label^="Chat"]'));
	await check('Kopf Chat', '09');
	await tap(pg.locator('header a[aria-label^="Konto"]'));
	await check('Kopf Konto', '59');
	await pg.goto(`${base}?ref=1`);
	await pg.waitForSelector('html[data-bereit]');
	await tap(pg.getByRole('button', { name: /Neu in deiner WG/ }));
	await check('Neu in deiner WG', '02');
	await pg.goto(`${base}?ref=1`);
	await pg.waitForSelector('html[data-bereit]');
	await tap(pg.locator('main a', { hasText: 'Hafermilch fehlt noch' }));
	await check('Zeile Hafermilch', '04');
	await pg.goto(`${base}?ref=1`);
	await pg.waitForSelector('html[data-bereit]');
	await tap(pg.locator('main a', { hasText: 'Bad putzen' }));
	await check('Zeile Bad putzen', '03');
	await pg.goto(`${base}?ref=1`);
	await pg.waitForSelector('html[data-bereit]');
	await tap(pg.locator('main a', { hasText: 'Übergabe am Freitag' }));
	await check('Zeile Pinnwand', '08');
	await pg.goto(`${base}?ref=1`);
	await pg.waitForSelector('html[data-bereit]');
	await tap(pg.locator('main a', { hasText: 'Kalender' }).first());
	await check('Kalender ›', '10');
});
await run('A Einkauf', async ({ pg, check, tab, sub, tap }) => {
	await tab('Haushalt');
	await sub('Einkäufe');
	await check('Einkäufe', '04');
	await tap(pg.getByRole('checkbox', { name: 'Hafermilch erledigen' }));
	await check('Hafermilch abhaken', '21', 1200);
	await tap(pg.locator('summary', { hasText: /Erledigt/ }));
	await check('Erledigt (2)', '22');
	await tab('Start');
	await check('Start', '23');
});
await run('B Ausgabe', async ({ pg, check, tab, tap }) => {
	await tab('Finanzen');
	await check('Finanzen', '06');
	await tap(pg.getByRole('button', { name: 'Ausgabe hinzufügen' }));
	await check('FAB', '15', 1000);
	await tap(pg.getByLabel('Beschreibung'));
	await pg.waitForTimeout(900);
	await tap(pg.getByLabel('Betrag'));
	await pg.waitForTimeout(800);
	await tap(pg.getByRole('button', { name: 'Aufteilung: Manuell' }));
	await pg.waitForTimeout(500);
	await tap(pg.getByLabel('Anteil Jona in Euro'));
	await pg.waitForTimeout(700);
	await tap(pg.getByLabel('Anteil Lea in Euro'));
	await check('Felder getippt', '16', 1000);
	await tap(pg.getByRole('button', { name: 'Ausgabe speichern' }));
	await check('Speichern', '24', 1000);
	await tap(pg.getByRole('button', { name: 'Ausgleichen' }).first());
	await check('Ausgleichen (mit Meldung)', '55', 900);
	await tap(pg.getByRole('button', { name: 'Abbrechen' }));
	await check('Abbrechen', '24', 900);
	await tab('Start');
	await check('Start', '27');
	await tab('Finanzen');
	await check('Finanzen neu geladen', '26');
	await tap(pg.getByRole('button', { name: 'Ausgleichen' }).first());
	await pg.waitForTimeout(900);
	await tap(pg.getByRole('button', { name: /als bezahlt eintragen/ }).first());
	await check('bezahlt eintragen', '64', 1000);
});
await run('C Chat', async ({ pg, check, tab, sub, tap }) => {
	await tab('Austausch');
	await check('Pinnwand', '08');
	await sub('Chat');
	await check('Chat', '09', 1200);
	await tap(pg.getByText('Bin um acht wieder da.'));
	await check('Bubble Lea', '18', 700);
	await tap(pg.getByRole('menuitem', { name: 'Antworten' }));
	await check('Antworten', '28', 900);
	await tap(pg.getByPlaceholder('Nachricht schreiben'));
	await check('getippt', '29', 1700);
	await tap(pg.getByRole('button', { name: 'Nachricht senden' }));
	await check('Senden', '30', 900);
});
await run('D Putzplan', async ({ pg, check, tab, tap }) => {
	await tab('Haushalt');
	await check('Haushalt', '03');
	await tap(pg.getByRole('button', { name: /Bad putzen/ }).first());
	await check('Haken Bad putzen', '11', 800);
	await tap(pg.getByRole('button', { name: 'Abbrechen' }));
	await check('Abbrechen', '03', 700);
	await tap(pg.getByRole('button', { name: /Bad putzen/ }).first());
	await pg.waitForTimeout(600);
	await tap(pg.getByRole('button', { name: 'Erledigt bestätigen' }));
	await check('Erledigt bestätigen', '31', 1000);
	await pg.waitForTimeout(4300);
	const toast = await pg.getByText('Nächster Termin').count();
	rows.push(
		`${toast === 0 ? 'ok  ' : 'FAIL'} D Putzplan      Hinweis nach 4 s weg (Treffer ${toast})`,
	);
	if (toast) fails++;
	await tab('Start');
	await check('Start', '32');
});
await run('Overlays', async ({ pg, check, tab, sub, tap }) => {
	await tab('Haushalt');
	await tap(pg.getByRole('button', { name: 'Aufgabenaktionen: Bad putzen' }));
	await check('Aufgabenaktionen', '61', 900);
	await tap(pg.getByRole('button', { name: 'Schließen' }));
	await pg.waitForTimeout(600);
	await tap(pg.getByText('So wird verteilt').first());
	await check('So wird verteilt', '56');
	await sub('Einkäufe');
	await tap(pg.getByRole('button', { name: 'Artikelaktionen: Hafermilch' }));
	await check('Artikelaktionen', '13', 900);
	await tap(pg.getByRole('button', { name: 'Schließen' }));
	await pg.waitForTimeout(600);
	await sub('Vorräte');
	await tap(pg.getByRole('button', { name: 'Schnell nachfüllen' }));
	await check('Schnell nachfüllen', '14', 900);
	await tap(pg.getByRole('button', { name: 'Schließen' }));
	await pg.waitForTimeout(600);
	await tap(pg.locator('button[aria-label$="verringern"]').first());
	await check('Toilettenpapier -1', '57', 1200);
	await tab('Austausch');
	await tap(pg.locator('button:has(svg.lucide-plus)').last());
	await check('Neuer Beitrag', '17', 900);
	await tap(pg.getByRole('button', { name: 'Abbrechen' }));
	await pg.waitForTimeout(600);
	await tap(pg.locator('button:has(svg.lucide-message-circle)').last());
	await check('Kommentar', '33');
	await sub('Kalender');
	await tap(pg.getByText('Monat', { exact: true }).first());
	await check('Monat', '19');
	await tab('Finanzen');
	await tap(pg.locator('button[aria-label^="Aktionen für"]').first());
	await check('Ausgaben-Menü', '58', 700);
});
console.log(rows.join('\n'));
console.log(`\n${fails ? 'FAIL' : 'OK'}: ${fails} Fehlschläge, Konsole: ${errs.length}`);
for (const e of errs.slice(0, 8)) console.log('  ', e);
await b.close();
process.exit(fails ? 1 : 0);
