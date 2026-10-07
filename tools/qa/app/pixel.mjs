// A-1: jeder angebotene Zustand im Ref-Modus (390x844, DPR 3, feste Uhr) gegen das Original.
// Aufruf: node tools/qa/app/pixel.mjs [--base http://127.0.0.1:4261/app-demo/index.html] [--out <dir>] [--only 01,02]
import { readdirSync } from 'node:fs';
import { args, launch, sharp } from '../lib.mjs';

const o = args();
const base = o.base || 'http://127.0.0.1:4261/app-demo/index.html';
const SHOTS =
	'/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/app/shots/final';
const files = readdirSync(SHOTS).filter(
	(f) => /^\d\d-.*\.png$/.test(f) && !f.endsWith('-full.png'),
);
const orig = Object.fromEntries(files.map((f) => [f.slice(0, 2), f]));
const only = o.only ? String(o.only).split(',') : null;

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
	(m) => ['error', 'warning'].includes(m.type()) && errs.push(m.text().slice(0, 160)),
);
pg.on('pageerror', (e) => errs.push(e.message));
await pg.goto(`${base}?ref=1`);
await pg.waitForSelector('html[data-bereit]');
const refs = Object.keys(await pg.evaluate(() => window.__demo.ref)).sort();
let worst = 0;
const rows = [];
for (const nn of refs) {
	if (only && !only.includes(nn)) continue;
	if (!orig[nn]) {
		rows.push([nn, 'kein Original']);
		continue;
	}
	await pg.goto(`${base}?ref=1&state=${nn}`);
	await pg.waitForSelector('html[data-bereit]');
	await pg.waitForTimeout(900);
	const mine = await pg.screenshot({ animations: 'disabled' });
	const a = await sharp(mine).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const bb = await sharp(`${SHOTS}/${orig[nn]}`)
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	if (a.info.width !== bb.info.width || a.info.height !== bb.info.height) {
		rows.push([nn, `Größe ${a.info.width}x${a.info.height} vs ${bb.info.width}x${bb.info.height}`]);
		continue;
	}
	let n = 0;
	for (let i = 0; i < a.data.length; i += 3) {
		if (
			Math.max(
				Math.abs(a.data[i] - bb.data[i]),
				Math.abs(a.data[i + 1] - bb.data[i + 1]),
				Math.abs(a.data[i + 2] - bb.data[i + 2]),
			) > 24
		)
			n++;
	}
	const pct = (100 * n) / (a.data.length / 3);
	worst = Math.max(worst, pct);
	rows.push([nn, `${pct.toFixed(3)} %`, pct <= 0.5 ? 'ok' : 'ZU GROSS', orig[nn]]);
	if (pct > 0.5) await sharp(mine).toFile(`${o.out}/${nn}-mine.png`);
}
for (const r of rows) console.log(r.join('  '));
console.log('schlechtester Wert', worst.toFixed(3), '% | Konsole:', errs.slice(0, 5));
await b.close();
