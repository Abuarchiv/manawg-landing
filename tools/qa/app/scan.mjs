// Sucht in den Aufnahmen alle Texte und Attribute mit Datum, Uhrzeit oder Relativzeit (Kandidaten für Laufzeit-Tokens).
// Aufruf: node tools/qa/app/scan.mjs <dir mit crawl-*.json, typing.json, pages.json>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const dir = process.argv[2];
const files = readdirSync(dir).filter((f) => /^(crawl-.*|typing|pages)\.json$/.test(f));
const seen = new Map();
const add = (k, w) => {
	if (!seen.has(k)) seen.set(k, new Set());
	seen.get(k).add(w);
};
const re =
	/(\bMo\b|\bDi\b|\bMi\b|\bDo\b|\bFr\b|\bSa\b|\bSo\b|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez|Heute|Morgen|gestern|vor \d|\d{1,2}:\d\d|\d{1,2}\.\d{1,2}\.|\d{4})/;
for (const f of files) {
	const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
	const nodes = j.nodes || j;
	for (const [id, n] of Object.entries(nodes)) {
		for (const part of [n.page, n.over || '']) {
			const s = part.replace(/<svg.*?<\/svg>/gs, '').replace(/<!--.*?-->/g, '');
			const where = f.slice(0, 5) + (n.route || id.split('|')[0]);
			for (const m of s.matchAll(/>([^<>]+)</g)) {
				const t = m[1].trim();
				if (t && re.test(t)) add(`T:${t}`, where);
			}
			for (const m of s.matchAll(/(aria-label|title|datetime)="([^"]*)"/g)) {
				if (re.test(m[2]) && !/^(Zum|Chat|Konto)/.test(m[2]))
					add(`A:${m[1]}=${m[2].slice(0, 100)}`, where);
			}
		}
	}
}
const out = [...seen.entries()]
	.sort((a, b) => (a[0] < b[0] ? -1 : 1))
	.map(([k, v]) => `${k}   <= ${[...v].slice(0, 3).join(',')}`);
writeFileSync(`${dir}/scan.txt`, out.join('\n'));
console.log(out.length);
