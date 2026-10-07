// F-18.3: Cursor der Ende-Szene. pointer über Handy und Knopf, sonst none, solange die Hand den Zeiger ersetzt;
// nach dem Verlassen der Szene wieder normal. Dazu reduce: keine Eigenbewegung.
//   node tools/qa/hand/cursor.mjs --url http://localhost:3123/
import { args, launch, open, sleep, toMark, vpOf } from '../lib.mjs';

const o = args();
const browser = await launch();
const h = await open(browser, { vp: vpOf('1440x900@1'), url: o.url });
const { page } = h;
await toMark(h, 'intro:1');
await sleep(600);
const cur = () => page.evaluate(() => document.querySelector('[data-buehne]').style.cursor);
const pos = await page.evaluate(() => {
	const r = (el) => el.getBoundingClientRect();
	const sp = r(document.querySelector('[data-ende-space]'));
	const c = r(document.querySelector('[data-ende] a[data-quiet]'));
	return {
		phone: [sp.left + 800 * (sp.width / 1280), sp.top + 400 * (sp.width / 1280)],
		cta: [c.left + c.width / 2, c.top + c.height / 2],
		leer: [200, 200],
	};
});
let bad = 0;
for (const [k, want] of [
	['phone', 'pointer'],
	['leer', 'none'],
	['cta', 'pointer'],
]) {
	await page.mouse.move(pos[k][0], pos[k][1], { steps: 4 });
	await sleep(700);
	const got = await cur();
	if (got !== want) bad++;
	console.log(got === want ? 'OK  ' : 'FAIL', k, got);
}
await toMark(h, 'so-gehts:0.2');
await sleep(500);
const after = await cur();
console.log(after === '' ? 'OK  ' : 'FAIL', 'nach der Szene', JSON.stringify(after));
if (after !== '') bad++;
console.log(bad ? `${bad} Fehlschläge` : 'GESAMT: grün');
await browser.close();

// reduce: ohne Zeiger bewegt sich die Spitze nicht
const b2 = await launch();
const r = await open(b2, { vp: vpOf('1440x900@1'), url: o.url, reducedMotion: 'reduce' });
await toMark(r, 'intro:1');
await sleep(600);
const t0 = await r.page.evaluate(() => window.__landing.dbg.hand().tip);
await sleep(2500);
const t1 = await r.page.evaluate(() => window.__landing.dbg.hand().tip);
const d = Math.hypot(t1.x - t0.x, t1.y - t0.y);
console.log(
	d < 0.5 ? 'OK  ' : 'FAIL',
	`reduce: Spitze bewegt sich um ${d.toFixed(2)} px (Ziel 820/400, Ist ${t1.x.toFixed(0)}/${t1.y.toFixed(0)})`,
);
await b2.close();
