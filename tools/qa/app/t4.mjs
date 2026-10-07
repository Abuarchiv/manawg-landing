// Schnelltest des Demo-Dokuments: lädt ?ref=1&state=NN oder die Live-Ansicht und macht ein Bild.
// Aufruf: node tools/qa/app/t4.mjs <out.png> [query] [base]
import { launch } from '../../qa/lib.mjs';
const [out, query = '?ref=1', base = 'http://127.0.0.1:4261/app-demo/index.html'] =
	process.argv.slice(2);
const b = await launch();
const ctx = await b.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 3,
	isMobile: true,
	hasTouch: true,
	locale: 'de-DE',
	timezoneId: 'Europe/Berlin',
});
const pg = await ctx.newPage();
const errs = [];
pg.on(
	'console',
	(m) =>
		['error', 'warning'].includes(m.type()) && errs.push(`${m.type()} ${m.text().slice(0, 200)}`),
);
pg.on('pageerror', (e) => errs.push(`PAGEERROR ${e.message}`));
await pg.goto(base + query);
await pg
	.waitForSelector('html[data-bereit]', { timeout: 15000 })
	.catch(() => errs.push('nicht bereit'));
await pg.waitForTimeout(600);
await pg.screenshot({ path: out });
console.log(await pg.evaluate(() => JSON.stringify(window.__demo?.state?.())), errs);
await b.close();
