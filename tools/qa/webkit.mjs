// WebKit-Smoke (PLAN-V2 8.2): Seite über einen Proxy ohne CSP (upgrade-insecure-requests bricht lokales http),
// Hero, Wohnung, Ende und Fuß ansehen, Konsole und Netz prüfen.
//   node tools/qa/webkit.mjs --url http://localhost:3120/ --out <dir>
import { join } from 'node:path';
import { args, launchWebkit, open, report, shot, startCspProxy, toMark, vpOf } from './lib.mjs';

const a = args();
const port = 3199;
const proxy = await startCspProxy(a.url, port);
const browser = await launchWebkit();
let bad = 0;
for (const v of ['1440x900@2', '390x844@3']) {
	const vp = vpOf(v);
	const h = await open(browser, { vp, url: `http://127.0.0.1:${port}/`, settle: 1500 });
	const gl = await h.page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'));
	console.log(v, 'webgl2:', gl);
	for (const m of [
		'intro:0',
		'intro:0.55',
		'intro:0.75',
		'intro:1',
		'funktionen:0.5',
		'bereiche:0.3',
		'ende-der-seite',
	]) {
		await toMark(h, m);
		await shot(h, join(`webkit-${vp.name}-${m.replace(/[:.]/g, '_')}`), { out: a.out });
	}
	bad += report(h.log, `WebKit ${v}`);
	await h.ctx.close();
}
await browser.close();
proxy.close();
process.exit(bad ? 1 : 0);
