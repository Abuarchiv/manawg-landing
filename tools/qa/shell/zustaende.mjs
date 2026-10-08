// SH-2: Zustände. Hover (Stiländerung je Element und Kindern), Aktiv, :focus-visible, ::selection,
// Scrollleiste, Übergangsdauer 120 bis 160 ms.
//   node tools/qa/shell/zustaende.mjs --url http://localhost:3115/ [--vp 1440x900@1]
import { args, launch, open, report, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const browser = await launch();
const vp = vpOf(a.vp ?? '1440x900@1');
const h = await open(browser, { vp, url: a.url });
const { page } = h;
const PROPS = [
	'color',
	'backgroundColor',
	'borderTopColor',
	'opacity',
	'textDecorationLine',
	'transform',
	'outlineStyle',
	'outlineColor',
	'outlineWidth',
];
const snap = (sel, idx) =>
	page.evaluate(
		([sel, idx, PROPS]) => {
			const el = document.querySelectorAll(sel)[idx];
			if (!el) return null;
			const o = {};
			const walk = [el, ...el.querySelectorAll('*')].slice(0, 6);
			walk.forEach((e, i) => {
				const cs = getComputedStyle(e);
				for (const p of PROPS) o[`${i}.${p}`] = cs[p];
			});
			const cs = getComputedStyle(el);
			o.dauer = cs.transitionDuration;
			o.prop = cs.transitionProperty;
			const r = el.getBoundingClientRect();
			o.rect = [r.left + r.width / 2, r.top + r.height / 2];
			return o;
		},
		[sel, idx, PROPS],
	);
const diff = (x, y) => Object.keys(x).filter((k) => k !== 'rect' && x[k] !== y[k]);
const FAELLE = [
	['Kopf-CTA', 'intro:0', '[data-loch="cta"]', 0],
	['Skip-Link', 'intro:0', '.hinweis', 0],
	['Ende-CTA', 'intro:1', '.cta--gross.cta--rand', 0],
	['Install-Tab', 'installieren:0', '.tab', 1],
	['Install-CTA', 'installieren:0', '.cta', 0],
	['FAQ-Zeile', 'fragen:0', '.faq-frage', 1],
	['Finale-CTA 1', 'finale:0.3', '.cta--voll', 1],
	['Finale-CTA 2', 'finale:0.3', '.cta--dunkel', 0],
	['Fuß-Link', 'ende-der-seite', '.fuss-link', 0],
];
let bad = 0;
for (const [name, mark, sel, idx] of FAELLE) {
	await toMark(h, mark);
	await page.mouse.move(2, 2);
	await sleep(350);
	const vor = await snap(sel, idx);
	if (!vor) {
		console.log(`FAIL ${name}: Element ${sel} nicht gefunden`);
		bad++;
		continue;
	}
	await page.mouse.move(vor.rect[0], vor.rect[1]);
	await sleep(450);
	const nach = await snap(sel, idx);
	const d = diff(vor, nach);
	const ok = d.length > 0;
	let aktiv = '';
	if (name.includes('CTA')) {
		await page.mouse.down();
		await sleep(250);
		const dn = await snap(sel, idx);
		aktiv =
			dn['0.transform'] !== nach['0.transform']
				? ` aktiv:${dn['0.transform']}`
				: ' aktiv:keine Änderung';
		await page.mouse.move(2, 2); // weg vom Knopf, dann loslassen: kein Klick, keine Navigation
		await page.mouse.up();
	}
	if (!ok) bad++;
	console.log(
		`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(13)} Änderung: ${d.slice(0, 5).join(', ') || '-'} | Übergang ${vor.dauer} ${vor.prop.slice(0, 40)}${aktiv}`,
	);
	await page.mouse.move(2, 2);
}
// Fokus
await toMark(h, 'intro:0');
await page.keyboard.press('Tab');
const fok = await page.evaluate(() => {
	const e = document.activeElement;
	const cs = getComputedStyle(e);
	return {
		el: e.className || e.tagName,
		w: cs.outlineWidth,
		st: cs.outlineStyle,
		c: cs.outlineColor,
		off: cs.outlineOffset,
	};
});
console.log(
	`${fok.st === 'solid' && fok.w === '2px' ? 'OK  ' : 'FAIL'} Fokus (Tab) ${JSON.stringify(fok)}`,
);
const sel = await page.evaluate(() => {
	const cs = getComputedStyle(document.documentElement, '::selection');
	return {
		bg: cs.backgroundColor,
		color: cs.color,
		scrollbar: getComputedStyle(document.documentElement).scrollbarColor,
		breite: getComputedStyle(document.documentElement).scrollbarWidth,
	};
});
console.log(
	`${sel.bg === 'rgb(250, 250, 250)' ? 'OK  ' : 'FAIL'} ::selection ${JSON.stringify(sel)}`,
);
if (fok.st !== 'solid' || sel.bg !== 'rgb(250, 250, 250)') bad++;
bad += report(h.log);
await browser.close();
process.exit(bad ? 1 : 0);
