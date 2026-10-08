// A-4: Daten im Demo. Mit einer Uhr an einem anderen Tag (Mo, 15.02.2027 11:07) darf kein festes Datum der Aufnahme
// (Okt, 2026, 06.10.) mehr auftauchen, und es kommen nur Mika, Lina, Jona (Du) und Lea vor.
// Aufruf: node tools/qa/app/daten.mjs [--base http://127.0.0.1:4261/app-demo/index.html]
import { args, launch } from '../lib.mjs';

const o = args();
const base = o.base || 'http://127.0.0.1:4261/app-demo/index.html';
const b = await launch();
const ctx = await b.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true,
	locale: 'de-DE',
	timezoneId: 'Europe/Berlin',
});
await ctx.clock.install({ time: new Date('2027-02-15T10:07:00Z') });
const pg = await ctx.newPage();
const errs = [];
pg.on(
	'console',
	(m) => ['error', 'warning'].includes(m.type()) && errs.push(m.text().slice(0, 140)),
);
pg.on('pageerror', (e) => errs.push(e.message));
await pg.goto(base);
await pg.waitForSelector('html[data-bereit]');
const all = await pg.evaluate(() => {
	const m = window.__demo.model;
	const out = [];
	for (const [w, ns] of Object.entries(m.nodes)) {
		for (const id of Object.keys(ns)) {
			window.__demo.enter(w, id, { instant: true, force: true });
			out.push({
				w,
				id,
				t: `${document.getElementById('app').textContent} ${document.getElementById('layer').textContent}`.replace(
					/\s+/g,
					' ',
				),
				a: [
					...document.querySelectorAll(
						'#app [aria-label],#app [title],#layer [aria-label],#layer [title]',
					),
				]
					.map((e) => `${e.getAttribute('aria-label') ?? ''} ${e.getAttribute('title') ?? ''}`)
					.join(' | '),
			});
		}
	}
	return out;
});
const bad = [];
const rxDatum =
	/Okt\b|Oktober|2026|06\.10\.|13\.10\.|\b0[1-9]\.1[012]\.|03\.11|03\.12|03\.01|\b17:\d\d|\b16:\d\d/;
for (const n of all) {
	for (const s of [n.t, n.a]) {
		const m = rxDatum.exec(s);
		if (m)
			bad.push(
				`${n.w} ${n.id.slice(0, 70)}: „${s.slice(Math.max(0, m.index - 30), m.index + 30)}“`,
			);
	}
}
const NAMEN =
	/\b(Anna|Max|Tom|Sarah|Jan|Lena|Paul|Sophie|Felix|Laura|Lukas|Julia|Marie|Ben|Leon|Nico)\b/;
const fremd = all.filter((n) => NAMEN.test(n.t)).map((n) => `${n.w} ${n.id.slice(0, 60)}`);
const personen = new Set();
for (const n of all)
	for (const m of n.t.matchAll(/\b(Mika|Lina|Jona|Lea|Du)\b/g)) personen.add(m[1]);
console.log(`Zustände geprüft: ${all.length}`);
console.log(`feste Datums-/Zeitreste: ${bad.length}`);
for (const x of bad.slice(0, 25)) console.log('  ', x);
console.log(`fremde Namen: ${fremd.length}`, fremd.slice(0, 5));
console.log('Personen im DOM:', [...personen].join(', '));
console.log('Konsole:', errs.slice(0, 5));
await b.close();
process.exit(bad.length || fremd.length || errs.length ? 1 : 0);
