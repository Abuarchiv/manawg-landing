// SH-9: reduzierte Bewegung. Keine Übergangsanimation außer Deckkraft (alle Elemente), Aktiv ohne Skalierung,
// FAQ ohne Höhenanimation, Lader sofort weg.
//   node tools/qa/shell/reduce.mjs --url http://localhost:3115/
import { args, launch, open, report, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const browser = await launch();
const h = await open(browser, { vp: vpOf('1440x900@1'), url: a.url, reducedMotion: 'reduce' });
const { page } = h;
let bad = 0;
const check = (ok, text) => {
	console.log(`${ok ? 'OK  ' : 'FAIL'} ${text}`);
	if (!ok) bad++;
};
const SCAN = () => {
	const out = new Set();
	for (const el of document.querySelectorAll('*')) {
		const cs = getComputedStyle(el);
		const dur = cs.transitionDuration.split(',').map((x) => Number.parseFloat(x));
		const prop = cs.transitionProperty.split(',').map((x) => x.trim());
		prop.forEach((p, i) => {
			const d = dur[i % dur.length];
			if (d > 0 && p !== 'opacity') out.add(`${el.className || el.tagName}:${p}`);
		});
	}
	return [...out];
};
let alle = [];
for (const m of [
	'intro:0',
	'intro:1',
	'so-gehts:0.55',
	'installieren:0',
	'fragen:0',
	'ende-der-seite',
]) {
	await toMark(h, m);
	await sleep(150);
	alle = alle.concat(await page.evaluate(SCAN));
}
check(
	alle.length === 0,
	`keine Übergänge außer Deckkraft (${[...new Set(alle)].slice(0, 6).join(' | ') || '-'})`,
);
await toMark(h, 'fragen:0');
await page.evaluate(() => document.querySelector('#fragen').scrollIntoView({ block: 'start' }));
await sleep(300);
const btn = page.locator('.faq-frage').nth(1);
await btn.click();
await sleep(60);
const hh = await page.evaluate(() =>
	Math.round(document.getElementById('faq-antwort-1').getBoundingClientRect().height),
);
check(hh > 40, `FAQ springt ohne Höhenanimation (Antwort 60 ms nach Klick ${hh}px)`);
const lop = await page.evaluate(
	() => getComputedStyle(document.querySelector('[data-loader]')).opacity,
);
check(lop === '0', `Lader weg (${lop})`);
bad += report(h.log);
await browser.close();
process.exit(bad ? 1 : 0);
