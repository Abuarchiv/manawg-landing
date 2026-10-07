// Sichtbarkeit der Szenen (PLAN-V2 Abnahme 12): Körper als Ring beim Eintritt, Einfall erst ab 70 % Sichtbarkeit;
// Tiefe-Untertitel 01-03 je >= 0,35 Bildschirmhöhen mit Deckkraft >= 0,9; Planet sichtbar.
//   node tools/qa/szenen.mjs --url http://localhost:3120/ --vp 1440x900@1 --out <dir>
import { args, launch, open, report, shot, sleep, toMark, vpOf, yOf } from './lib.mjs';

const a = args();
const browser = await launch();
let bad = 0;
const ok = (c, msg) => {
	if (!c) bad++;
	console.log(`${c ? 'OK  ' : 'FAIL'} ${msg}`);
};
{
	const h = await open(browser, { vp: vpOf(a.vp ?? '1440x900@1'), url: a.url });
	// Start knapp vor dem Eintritt des Abschnitts, dann mit 500 px/s hinein
	const yStart = await h.page.evaluate(() =>
		Math.round(
			document.getElementById('koerper').getBoundingClientRect().top + scrollY - innerHeight - 100,
		),
	);
	await h.page.evaluate((y) => scrollTo(0, y), yStart);
	await sleep(600);
	const y0 = await yOf(h.page, 'koerper:0.6');
	// Rad mit 500 px/s: 50 px alle 100 ms, dabei Sichtbarkeit und Ring lesen
	const rows = [];
	let y = await h.page.evaluate(() => scrollY);
	while (y < y0) {
		await h.page.mouse.wheel(0, 50);
		await sleep(100);
		const r = await h.page.evaluate(() => {
			const sec = document.getElementById('koerper').getBoundingClientRect();
			const sicht =
				(Math.min(sec.bottom, innerHeight) - Math.max(sec.top, 0)) /
				Math.min(sec.height, innerHeight);
			const k = window.__landing.dbg.koerper?.();
			return { y: scrollY, sicht, ring: k?.ring, idle: k?.idle };
		});
		rows.push(r);
		y = r.y;
	}
	if (a.v) console.log(rows.map((r) => `${r.y}:${r.sicht.toFixed(2)}:${r.ring}`).join(' '));
	const first = rows.findIndex((r) => r.ring === false);
	const eintritt = rows.find((r) => r.sicht > 0.05 && r.sicht < 0.7 && r.ring === true);
	ok(
		!!eintritt && first > 0 && rows[first].sicht >= 0.65,
		`Körper ruhen als Ring beim Eintritt (Sicht ${eintritt?.sicht.toFixed(2)}), Einfall erst ab ${rows[first]?.sicht.toFixed(2)} Sichtbarkeit (Grenze 0,70, Abtastung 50 px)`,
	);
	if (eintritt) {
		await h.page.evaluate((y) => scrollTo(0, y), eintritt.y);
		await sleep(300);
		await shot(h, 'koerper-eintritt', { out: a.out });
	}
	bad += report(h.log, 'Körper');
	await h.ctx.close();
}
{
	const h = await open(browser, { vp: vpOf(a.vp ?? '1440x900@1'), url: a.url });
	const H = h.vp.h;
	const sec = await h.page.evaluate(() => {
		const r = document.getElementById('funktionen').getBoundingClientRect();
		return { top: r.top + scrollY, h: r.height };
	});
	const fahrt = sec.h - H;
	const N = 70;
	const op = [[], [], []];
	await toMark(h, 'bereiche:0');
	await h.page.evaluate((y) => scrollTo(0, y), Math.round(sec.top));
	await sleep(500);
	for (let i = 0; i <= N; i++) {
		await h.page.evaluate((y) => scrollTo(0, y), Math.round(sec.top + (i / N) * fahrt));
		await sleep(280);
		const o = await h.page.evaluate(() =>
			[...document.querySelectorAll('[data-dcap]')].map((e) => +getComputedStyle(e).opacity),
		);
		o.forEach((v, k) => op[k].push(v));
	}
	for (let k = 0; k < 3; k++) {
		const n = op[k].filter((v) => v >= 0.9).length;
		const hoehe = ((n / N) * fahrt) / H;
		ok(
			hoehe >= 0.35,
			`Tiefe-Untertitel 0${k + 1}: ${hoehe.toFixed(2)} Bildschirmhöhen mit Deckkraft >= 0,9 (Grenze 0,35)`,
		);
	}
	// helle Pixel in jedem Messpunkt (>= 2 %)
	bad += report(h.log, 'Tiefe');
	await h.ctx.close();
}
await browser.close();
console.log(bad ? `GESAMT: ${bad} Verstöße` : 'GESAMT: alles grün');
process.exit(bad ? 1 : 0);
