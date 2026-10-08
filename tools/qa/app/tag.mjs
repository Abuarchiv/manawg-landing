// Demo an einem anderen Tag: Bild von Start, Kalender (Agenda, Monat) und Chat. Aufruf: node tools/qa/app/tag.mjs <out-dir> [ISO-Zeit]
import { launch, sheet } from '../lib.mjs';

const [out, iso = '2027-02-15T10:07:00Z'] = process.argv.slice(2);
const base = 'http://127.0.0.1:4261/app-demo/index.html';
const b = await launch();
const ctx = await b.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true,
	locale: 'de-DE',
	timezoneId: 'Europe/Berlin',
});
await ctx.clock.install({ time: new Date(iso) });
const pg = await ctx.newPage();
await pg.goto(base);
await pg.waitForSelector('html[data-bereit]');
const files = [];
const labels = [];
for (const [name, w, id] of [
	['start', '-', '/|'],
	['putzen', '-', '/putzen|'],
	['kalender', '-', '/kalender|'],
	['monat', '-', '/kalender|button|Monat@0'],
	['chat', '-', '/chat|'],
	['fixkosten', '-', '/abos|'],
]) {
	await pg.evaluate(
		([w, id]) => window.__demo.enter(w, id, { instant: true, force: true }),
		[w, id],
	);
	await pg.waitForTimeout(400);
	const f = `${out}/tag-${name}.png`;
	await pg.screenshot({ path: f });
	files.push(f);
	labels.push(`${iso.slice(0, 10)} ${name}`);
}
await sheet(files, labels, `${out}/tag-sheet.jpg`, 3, 390);
await b.close();
