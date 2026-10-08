// Größenwechsel und Drehen: Abschnitt und Fortschritt bleiben (±1 %), PLAN-V2 Abnahme 7.
//   node tools/qa/resize.mjs --url http://localhost:3120/ --out <dir>
// Fälle: 1440x900 -> 1024x768 -> 1920x1080, 390x844 <-> 844x390, 844x390 -> 844x340. Marken je Fall wählbar (--marks).
import { args, launch, open, report, sleep, toMark, vpOf } from './lib.mjs';

const a = args();
const FAELLE = [
	[
		'1440x900@1',
		['1024x768', '1920x1080'],
		['intro:0.3', 'so-gehts:0.5', 'funktionen:0.5', 'bereiche:0.3', 'fragen:0.3'],
	],
	[
		'390x844@3t',
		['844x390', '390x844'],
		['intro:0.3', 'so-gehts:0.5', 'funktionen:0.5', 'bereiche:0.3'],
	],
	['844x390@3t', ['844x340'], ['intro:0.3', 'so-gehts:0.5', 'funktionen:0.5', 'bereiche:0.3']],
];
const probe = (page) =>
	page.evaluate(() => {
		const y = scrollY;
		const secs = [...document.querySelectorAll('[data-sec]')].map((e) => {
			const r = e.getBoundingClientRect();
			return { id: e.id, top: r.top + y, h: r.height };
		});
		const s = secs.find((s) => y < s.top + s.h) ?? secs[secs.length - 1];
		return {
			y: Math.round(y),
			id: s.id,
			p: (y - s.top) / s.h,
			H: document.documentElement.scrollHeight,
		};
	});
const browser = await launch();
let bad = 0;
for (const [start, seq, marks] of FAELLE) {
	const vp0 = vpOf(start);
	for (const mark of a.marks ? String(a.marks).split(',') : marks) {
		const h = await open(browser, { vp: vp0, url: a.url });
		await toMark(h, mark);
		let ref = await probe(h.page);
		console.log(`${start} ${mark}: ${ref.id} p ${ref.p.toFixed(3)} y ${ref.y}`);
		for (const s of seq) {
			const [w, hh] = s.split('x').map(Number);
			await h.page.setViewportSize({ width: w, height: hh });
			await sleep(900);
			const now = await probe(h.page);
			// Fortschritt je Abschnitt; im Sticky-Abschnitt zählt der Anteil an der Gesamthöhe des Abschnitts
			const ok = now.id === ref.id && Math.abs(now.p - ref.p) <= 0.01;
			if (!ok) bad++;
			console.log(`  -> ${s}: ${now.id} p ${now.p.toFixed(3)} y ${now.y} ${ok ? 'OK' : 'FAIL'}`);
			ref = now;
		}
		bad += report(h.log, `${start} ${mark}`);
		await h.ctx.close();
	}
}
await browser.close();
console.log(bad ? `GESAMT: ${bad} Verstöße` : 'GESAMT: alles grün');
process.exit(bad ? 1 : 0);
