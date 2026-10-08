import { createHash } from 'node:crypto';
// Welche Flags verändern welche Route? (aus pages.json, Vergleich der normalisierten Seite)
import { readFileSync } from 'node:fs';
import { norm } from '../../../design/app-ref/tools/demo-lib.mjs';
const p = JSON.parse(readFileSync(`${process.argv[2]}/pages.json`, 'utf8'));
const h = (s) =>
	createHash('sha1')
		.update(norm(s).replace(/<!--[\s\S]*?-->/g, ''))
		.digest('hex')
		.slice(0, 8);
const routes = [...new Set(Object.keys(p).map((k) => k.split('|')[0]))];
const combos = [...new Set(Object.keys(p).map((k) => k.split('|')[1]))];
for (const r of routes) {
	const by = {};
	for (const c of combos) {
		if (!p[`${r}|${c}`]) continue;
		const k = h(p[`${r}|${c}`].page);
		by[k] ??= [];
		by[k].push(c);
	}
	console.log(
		r.padEnd(14),
		Object.keys(by).length,
		'Varianten:',
		Object.values(by)
			.map((v) => v.join(' '))
			.join('  |  '),
	);
}
