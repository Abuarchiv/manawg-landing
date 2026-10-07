// Stufe 1 der Aufnahme: welche Flags verändern welche Route? Ergebnis: OUT/singles.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { fresh, launch, open, readStable } from './demo-lib.mjs';
import { FLAGS, ROUTES, applyFlags } from './demo-flags.mjs';

const OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const b = await launch();
const res = {};
for (const set of [[], ['E'], ['A'], ['A', 'P'], ['C'], ['B'], ['V'], ['A', 'B'], ['B', 'A']]) {
	const key = set.join('+') || '-';
	const c = await fresh(b, null);
	const ids = {};
	await applyFlags(c.pg, key === 'B+A' ? [] : set);
	if (key === 'B+A') {
		await (await import('./demo-flags.mjs')).STEPS.B(c.pg);
		await (await import('./demo-flags.mjs')).STEPS.A(c.pg);
	}
	for (const r of ROUTES) {
		await open(c.pg, r);
		const s = await readStable(c.pg);
		ids[r] = s.pageId;
	}
	res[key] = ids;
	console.log(key, JSON.stringify(ids));
	await c.ctx.close();
}
writeFileSync(`${OUT}/singles.json`, JSON.stringify(res, null, 1));
await b.close();
