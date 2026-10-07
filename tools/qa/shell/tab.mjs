// SH-5: Tab-Reihenfolge, unsichtbare Bedienelemente, Geisterklick.
//   node tools/qa/shell/tab.mjs --url http://localhost:3115/ [--vp 1440x900@1]
import { args, launch, open, report, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const browser = await launch();
const vp = vpOf(a.vp ?? '1440x900@1');
const h = await open(browser, { vp, url: a.url });
const { page } = h;
let bad = 0;
const check = (ok, text) => {
	console.log(`${ok ? 'OK  ' : 'FAIL'} ${text}`);
	if (!ok) bad++;
};

// 1) Tab-Reihenfolge ab Seitenanfang
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(300);
const folge = [];
for (let i = 0; i < 9; i++) {
	await page.keyboard.press('Tab');
	await sleep(120);
	folge.push(
		await page.evaluate(() => {
			const e = document.activeElement;
			const r = e.getBoundingClientRect();
			return {
				name: e.dataset?.loch ?? e.className ?? e.tagName,
				text: (e.textContent ?? '').trim().slice(0, 22),
				docY: Math.round(r.top + scrollY),
				imBild: r.bottom > 0 && r.top < innerHeight,
			};
		}),
	);
}
console.log(folge.map((f, i) => `${i + 1}. ${f.name} "${f.text}" y=${f.docY}`).join('\n'));
check(folge[0].name === 'cta', 'Tab 1 = Kopf-CTA');
check(String(folge[1].name).includes('hinweis'), 'Tab 2 = Skip-Link');
const ys = folge.slice(2).map((f) => f.docY);
check(
	ys.every((y, i) => i === 0 || y >= ys[i - 1] - 2),
	`Tab 3.. in visueller Reihenfolge (y ${ys.join(', ')})`,
);
check(
	folge.slice(0, 3).every((f) => f.imBild),
	'die ersten Tab-Ziele liegen im Bild (kein Sprung über 16 000 px)',
);
await page.evaluate(() => document.activeElement?.blur());

// 2) unsichtbar und bedienbar?
const SCAN = () => {
	const out = [];
	const sel =
		'a[href], button, [tabindex]:not([tabindex="-1"]), [role="button"], [role="tab"], input, select';
	for (const el of document.querySelectorAll(sel)) {
		let o = 1;
		let pe = null;
		let vis = true;
		let inert = false;
		for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
			const cs = getComputedStyle(e);
			o *= Number(cs.opacity);
			if (pe === null && cs.pointerEvents !== 'auto') pe = cs.pointerEvents;
			if (cs.visibility === 'hidden') vis = false;
			if (e.inert) inert = true;
		}
		const peAuto = pe === null || pe === 'auto';
		if (o < 0.02 && peAuto && vis && !inert) {
			out.push(
				`${el.className || el.tagName} "${(el.textContent ?? '').trim().slice(0, 20)}" opacity ${o.toFixed(3)}`,
			);
		}
	}
	return out;
};
const marks = [
	'intro:0',
	'intro:0.5',
	'intro:0.9',
	'intro:1',
	'intro-aus:0.625',
	'so-gehts:0.55',
	'funktionen:0.5',
	'bereiche:0',
	'installieren:0',
	'fragen:0',
	'ende-der-seite',
];
let geister = 0;
for (const m of marks) {
	await toMark(h, m);
	await sleep(150);
	const g = await page.evaluate(SCAN);
	if (g.length) {
		geister += g.length;
		console.log(`  ${m}: ${g.join(' | ')}`);
	}
}
check(
	geister === 0,
	`kein Element mit Deckkraft 0 und pointer-events auto (${geister} Funde über ${marks.length} Marken)`,
);

// 3) Klick unten links bei funktionen:0.5 springt nicht
await toMark(h, 'funktionen:0.5');
const y0 = await page.evaluate(() => scrollY);
await page.mouse.click(200, vp.h - 24);
await sleep(1500);
const y1 = await page.evaluate(() => scrollY);
check(Math.abs(y1 - y0) < 2, `Klick unten links bei funktionen:0.5: scrollY ${y0} -> ${y1}`);
bad += report(h.log);
await browser.close();
process.exit(bad ? 1 : 0);
