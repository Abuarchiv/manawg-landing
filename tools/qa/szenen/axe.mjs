// S-7 axe für Körper, Tiefe und Planet (inkl. Ortsliste im Fokus). axe-core wird per --axe <pfad/axe.min.js> geladen
// (keine neue Abhängigkeit im Repo).
//   node tools/qa/szenen/axe.mjs --axe <axe.min.js> --url http://localhost:3125/ --vp 1440x900@1
import { readFileSync } from 'node:fs';
import { args, launch, open, report, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const src = readFileSync(
	a.axe ??
		'/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/axe/node_modules/axe-core/axe.min.js',
	'utf8',
);
const vp = vpOf(a.vp ?? '1440x900@1');
const browser = await launch();
const h = await open(browser, { vp, url: a.url });
let bad = 0;
for (const [m, sel] of [
	['koerper:0.3', '#koerper'],
	['funktionen:0.5', '#funktionen'],
	['bereiche:0.1', '#bereiche'],
]) {
	await toMark(h, m, { mx: vp.w - 3, my: vp.h - 3 });
	if (sel === '#bereiche')
		await h.page.locator('nav[aria-label="Orte der WG"] button').first().focus();
	await sleep(400);
	await h.page.evaluate((s) => {
		if (!window.axe) {
			const el = document.createElement('script');
			el.textContent = s;
			document.head.appendChild(el);
		}
	}, src);
	const r = await h.page.evaluate((sel) => window.axe.run(document.querySelector(sel)), sel);
	const hart = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
	if (hart.length) bad++;
	console.log(
		`${hart.length ? 'FAIL' : 'OK  '} axe ${sel}: serious/critical ${hart.length}, übrige ${r.violations.length - hart.length}`,
		r.violations.map((v) => `${v.id}[${v.impact}] x${v.nodes.length}`).join(' | '),
	);
}
bad += report(h.log, `axe ${vp.name}`);
await h.ctx.close();
await browser.close();
process.exit(bad ? 1 : 0);
