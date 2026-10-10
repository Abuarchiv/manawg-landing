// A-3: Bewegung im Demo gegen REF §7 (transitionrun/animationstart, wie tools/app-demo/motion.mjs).
// Erwartung: Dialog 200/220 ms ease, Sheet 300 ms auf und 400 ms zu mit (.22,1,.36,1), Vollbild 220 ms, Knopf 80 ms,
// Tabbar 120 ms, SubNav 150 ms, Hinweis 4 s, Abhaken ohne Animation.
// Aufruf: node tools/qa/app/motion.mjs [--base http://127.0.0.1:4261/app-demo/index.html]
import { args, launch } from '../lib.mjs';

const o = args();
const base = o.base || 'http://127.0.0.1:4261/app-demo/index.html';
const b = await launch();
const ctx = await b.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true,
	locale: 'de-DE',
	timezoneId: 'Europe/Berlin',
});
await ctx.addInitScript(() => {
	window.__m = [];
	const desc = (t) => {
		const a = (n) => t.getAttribute?.(n);
		return `${t.tagName.toLowerCase()}${a('data-slot') ? `[${a('data-slot')}]` : ''}`;
	};
	const rec = (e) => {
		const t = e.target;
		if (!t?.tagName) return;
		const cs = getComputedStyle(t);
		const tr = e.type === 'transitionrun';
		window.__m.push({
			ev: e.type,
			t: Math.round(performance.now()),
			target: desc(t),
			prop: e.propertyName || e.animationName,
			dur: tr ? cs.transitionDuration : cs.animationDuration,
			ease: tr ? cs.transitionTimingFunction : cs.animationTimingFunction,
		});
	};
	document.addEventListener('transitionrun', rec, true);
	document.addEventListener('animationstart', rec, true);
});
const pg = await ctx.newPage();
await pg.goto(`${base}?ref=1`);
await pg.waitForSelector('html[data-bereit]');
await pg.waitForTimeout(600);
const rows = [];
const run = async (name, act, wait = 800) => {
	await pg.evaluate(() => {
		window.__m.length = 0;
	});
	await act();
	await pg.waitForTimeout(wait);
	const raw = await pg.evaluate(() => window.__m.slice());
	const seen = new Map();
	for (const r of raw)
		if (!/^(svg|path|circle|line)/.test(r.target)) seen.set(`${r.ev}|${r.target}|${r.prop}`, r);
	console.log(`\n## ${name}`);
	for (const r of seen.values())
		console.log(
			`   ${r.ev.padEnd(15)} ${r.target.padEnd(34)} ${String(r.prop).padEnd(18)} ${r.dur.padEnd(10)} ${r.ease}`,
		);
	rows.push([name, [...seen.values()]]);
};
const tab = (n) =>
	pg
		.locator('nav a', { hasText: new RegExp(`^${n}$`) })
		.last()
		.click();
await tab('Haushalt');
await pg.waitForTimeout(500);
await run('Dialog öffnen', () =>
	pg
		.getByRole('button', { name: /Bad putzen/ })
		.first()
		.click(),
);
await run('Dialog schließen', () => pg.getByRole('button', { name: 'Abbrechen' }).click());
await run(
	'Knopf gedrückt (Maus unten)',
	async () => {
		const bb = await pg
			.getByRole('button', { name: /Bad putzen/ })
			.first()
			.boundingBox();
		await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
		await pg.mouse.down();
	},
	300,
);
await pg.mouse.up();
await pg.waitForTimeout(900);
await pg.keyboard.press('Escape');
await pg.waitForTimeout(500);
await run(
	'SubNav (Putzplan → Einkäufe)',
	() =>
		pg
			.locator('main nav a', { hasText: /^Einkäufe/ })
			.first()
			.click(),
	700,
);
await run('Abhaken', () => pg.getByRole('checkbox', { name: 'Hafermilch erledigen' }).click(), 700);
await run(
	'Sheet öffnen',
	() =>
		pg
			.getByRole('button', { name: /Artikelaktionen/ })
			.first()
			.click(),
	900,
);
await run('Sheet schließen', () => pg.getByRole('button', { name: 'Schließen' }).click(), 900);
await run('Tabbar (Finanzen)', () => tab('Finanzen'), 700);
await run(
	'Vollbild-Formular öffnen',
	() => pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click(),
	900,
);
await pg.goto(`${base}?ref=1&state=03`);
await pg.waitForSelector('html[data-bereit]');
await pg.waitForTimeout(500);
const t0 = Date.now();
await pg
	.getByRole('button', { name: /Bad putzen/ })
	.first()
	.click();
await pg.waitForTimeout(500);
await pg.getByRole('button', { name: 'Erledigt bestätigen' }).click();
let seen = false;
let gone = null;
while (Date.now() - t0 < 9000) {
	const n = await pg.getByText('Nächster Termin').count();
	if (n && !seen) seen = Date.now();
	if (seen && !n) {
		gone = Date.now() - seen;
		break;
	}
	await pg.waitForTimeout(50);
}
console.log('\n## Hinweis (Toast) Lebensdauer ms:', gone);
await b.close();
