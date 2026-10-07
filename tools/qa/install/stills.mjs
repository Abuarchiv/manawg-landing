import { mkdirSync } from 'node:fs';
// Standbilder der Installationsabläufe: Uhr anhalten, Zeit setzen, Gerät fotografieren, Kontaktbogen je Tab.
// node tools/qa/install/stills.mjs --url http://localhost:3122/ --out <dir> [--vp 1440x900@2] [--tab 0,1,2] [--n 24]
import { join } from 'node:path';
import { args, launch, open, renderer, report, sheet, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const out = a.out;
mkdirSync(out, { recursive: true });
const vp = vpOf(a.vp ?? '1440x900@2');
const tabs = String(a.tab ?? '0,1,2')
	.split(',')
	.map(Number);
const names = ['iphone', 'android', 'rechner'];
const browser = await launch();
const h = await open(browser, { vp, url: a.url ?? 'http://localhost:3122/' });
console.log(await renderer(h.page));
await toMark(h, 'installieren:0.05');
await sleep(800);
const frame = h.page.locator('[data-ins="frame"]');
for (const tab of tabs) {
	await h.page.getByRole('tab').nth(tab).click();
	await sleep(900);
	const pl = await h.page.evaluate((i) => window.__landing.dbg.install.plan(i), tab);
	await h.page.evaluate(() => window.__landing.dbg.install.halte(true));
	const n = Number(a.n ?? 24);
	const files = [];
	const labels = [];
	for (let i = 0; i < n; i++) {
		const t = a.von !== undefined ? Number(a.von) + i * Number(a.dt ?? 0.2) : (pl.loop * i) / n;
		await h.page.evaluate((t) => window.__landing.dbg.install.setze(t), t);
		await sleep(120);
		const f = join(out, `${names[tab]}-${String(i).padStart(2, '0')}.png`);
		await frame.screenshot({ path: f });
		files.push(f);
		labels.push(`${names[tab]} t=${t.toFixed(2)}`);
	}
	await sheet(
		files,
		labels,
		join(out, `sheet-${names[tab]}.jpg`),
		a.cols ? Number(a.cols) : 6,
		300,
	);
	await h.page.evaluate(() => window.__landing.dbg.install.halte(false));
}
report(h.log);
await browser.close();
