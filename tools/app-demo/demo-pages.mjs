// Stufe 3 der Aufnahme: jede Route in jeder Welt (Kombination der Abläufe E,A,P,C,B,V), nur über die echte App.
// Je Route zählen nur die Flags, die sie verändern (REL, belegt durch tools/qa/app/relevance.mjs); die Welten-Schlüssel
// im Modell enthalten nur diese Flags. Ergebnis: OUT/pages.json { "<route>|<flags>": { page, over, items, ... } }
// Aufruf: OUT=<dir> node tools/app-demo/demo-pages.mjs   (vorhandene pages.json wird ergänzt)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { FLAGS, REL, ROUTES, applyFlags, combos } from './demo-flags.mjs';
import { fresh, launch, open, readStable } from './demo-lib.mjs';

const OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const file = `${OUT}/pages.json`;
const pages = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
const keyOf = (set) => set.join('+') || '-';
// benötigte (Route, Welt)-Paare, gruppiert nach den Flags, die dafür gesetzt werden müssen
const need = new Map();
for (const r of ROUTES) {
	const rel = (REL[r] || '').split('').filter(Boolean);
	for (const set of combos(rel)) {
		const k = `${r}|${keyOf(FLAGS.filter((f) => set.includes(f)))}`;
		if (pages[k]) continue;
		const ws = keyOf(FLAGS.filter((f) => set.includes(f)));
		if (!need.has(ws)) need.set(ws, new Set());
		need.get(ws).add(r);
	}
}
console.log('Welten', need.size, [...need.entries()].map(([w, rs]) => `${w}:${rs.size}`).join(' '));
const b = await launch();
for (const [ws, routes] of need) {
	const set = ws === '-' ? [] : ws.split('+');
	const c = await fresh(b, null);
	try {
		await applyFlags(c.pg, set);
		for (const r of routes) {
			await open(c.pg, r);
			const s = await readStable(c.pg);
			pages[`${r}|${ws}`] = { page: s.snap.page, over: s.snap.over, bodyStyle: s.snap.bodyStyle, htmlStyle: s.snap.htmlStyle, path: s.snap.path, items: s.items, hash: s.pageId };
		}
		console.log('ok', ws, [...routes].join(' '), c.errors.length ? c.errors.slice(0, 2) : '');
	} catch (e) {
		console.log('FEHLER', ws, e.message.split('\n')[0]);
	}
	await c.ctx.close();
	writeFileSync(file, JSON.stringify(pages));
}
console.log('Seiten', Object.keys(pages).length);
await b.close();
