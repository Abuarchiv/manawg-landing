// Ohne WebGL2: Lader <= 4 s weg, Fallback sichtbar, Wohnung, Flut, Texte und Bedienung laufen (PLAN-V2 Abnahme 9).
//   node tools/qa/nogl.mjs --url http://localhost:3120/ --vp 1440x900@1 --out <dir>
import { join } from 'node:path';
import { args, launch, open, report, shot, sleep, state, toMark, vpOf } from './lib.mjs';

const a = args();
const browser = await launch({ gl: false });
let bad = 0;
const t0 = Date.now();
const h = await open(browser, {
	vp: vpOf(a.vp ?? '1440x900@1'),
	url: a.url,
	noWait: true,
	settle: 0,
});
const gl = await h.page.evaluate(() => {
	try {
		return !!document.createElement('canvas').getContext('webgl2');
	} catch {
		return false;
	}
});
console.log('webgl2:', gl);
let weg = null;
for (let i = 0; i < 100; i++) {
	const o = await h.page.evaluate(
		() => getComputedStyle(document.querySelector('[data-loader]')).opacity,
	);
	if (o === '0') {
		weg = Date.now() - t0;
		break;
	}
	await sleep(100);
}
const ok = weg !== null && weg <= 4800;
if (!ok) bad++;
console.log(`${ok ? 'OK  ' : 'FAIL'} Lader weg nach ${weg} ms (Grenze 4000 ms plus Überblendung)`);
await sleep(800);
await shot(h, 'nogl-intro0', { out: a.out });
for (const m of [
	'intro:0.3',
	'intro:0.55',
	'intro:0.7',
	'intro:1',
	'koerper:0.3',
	'funktionen:0.5',
	'bereiche:0.3',
]) {
	await toMark(h, m);
	const st = await state(h.page);
	await shot(h, `nogl-${m.replace(/[:.]/g, '_')}`, { out: a.out });
	console.log(m, JSON.stringify(st));
}
// Bedienung: erster Tab, FAQ
await h.page.keyboard.press('Tab');
const fokus = await h.page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 30));
console.log('erster Tab:', fokus);
bad += report(h.log, 'nogl');
await h.ctx.close();
await browser.close();
console.log(`Bilder: ${join(a.out)}`);
process.exit(bad ? 1 : 0);
