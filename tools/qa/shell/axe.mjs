// SH-2: axe-core an mehreren Marken und auf den Nebenseiten. serious und critical müssen 0 sein.
// axe-core liegt nicht im Projekt (keine neue Abhängigkeit), Pfad per --axe, Standard: Scratchpad der Prüfläufe.
//   node tools/qa/shell/axe.mjs --url http://localhost:3115/ [--axe <pfad/axe.min.js>]
import { readFileSync } from 'node:fs';
import { args, launch, open, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const src = readFileSync(
	a.axe ??
		'/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/axe/node_modules/axe-core/axe.min.js',
	'utf8',
);
const base = a.url.replace(/\/$/, '');
const browser = await launch();
let bad = 0;
const lauf = async (page, label) => {
	await page.evaluate((s) => {
		if (!window.axe) {
			const el = document.createElement('script');
			el.textContent = s;
			document.head.appendChild(el);
		}
	}, src);
	const r = await page.evaluate(() => axe.run(document, { resultTypes: ['violations'] }));
	// Knoten der Install-Schritte gehören dem Paket INSTALL, sie zählen hier nicht (werden getrennt gemeldet)
	const fremd = (n) =>
		n.target.join(' ').includes('data-istep') || n.target.join(' ').includes('Installieren_');
	const mine = r.violations
		.map((v) => ({ ...v, nodes: v.nodes.filter((n) => !fremd(n)) }))
		.filter((v) => v.nodes.length);
	const fremdN = r.violations.reduce((k, v) => k + v.nodes.filter(fremd).length, 0);
	const hart = mine.filter((v) => ['serious', 'critical'].includes(v.impact));
	const weich = mine.filter((v) => !['serious', 'critical'].includes(v.impact));
	console.log(
		`${hart.length ? 'FAIL' : 'OK  '} axe ${label}: serious/critical ${hart.length}${hart.map((v) => ` ${v.id}x${v.nodes.length}`).join('')} | übrige ${weich.map((v) => `${v.id}[${v.impact}]x${v.nodes.length}`).join(' ') || '-'} | fremd(Install) ${fremdN}`,
	);
	for (const v of hart)
		for (const n of v.nodes.slice(0, 3))
			console.log(`     ${n.target.join(' ')} :: ${n.html.slice(0, 100)}`);
	bad += hart.length;
};
for (const vps of ['1440x900@1', '390x844@3t']) {
	const vp = vpOf(vps);
	const h = await open(browser, { vp, url: a.url });
	for (const m of [
		'intro:0',
		'intro:1',
		'so-gehts:0.55',
		'funktionen:0.5',
		'installieren:0',
		'fragen:0',
		'ende-der-seite',
	]) {
		await toMark(h, m);
		await sleep(200);
		await lauf(h.page, `${vps} ${m}`);
	}
	await h.ctx.close();
}
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();
for (const p of ['impressum', 'datenschutz', 'agb', 'gibtsnicht']) {
	await page.goto(`${base}/${p}`, { waitUntil: 'load' });
	await lauf(page, `/${p}`);
}
await browser.close();
process.exit(bad ? 1 : 0);
