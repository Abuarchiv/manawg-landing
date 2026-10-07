// A-4 (Teil): in den Vorlagen darf kein festes Datum und keine feste Uhrzeit stehen (alles läuft über Tokens).
// Aufruf: node tools/qa/app/literals.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const f = join(
	dirname(fileURLToPath(import.meta.url)),
	'..',
	'..',
	'..',
	'public/app-demo/index.html',
);
const html = readFileSync(f, 'utf8');
const rx =
	/(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Januar|Februar|März|April|Mai\b|Juni|Juli|August|September|Oktober|November|Dezember|\bOkt\b|\bNov\b|2026|\b\d{1,2}\.\d{1,2}\.(?!\d)|\b\d{2}:\d{2}\b|vor \d+ (Min|Std)|gerade eben|gestern)/g;
const seen = new Map();
for (const m of html.matchAll(/<template id="(t-[^"]+)">([\s\S]*?)<\/template>/g)) {
	const text = m[2].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/ class="[^"]*"/g, '');
	for (const x of text.matchAll(rx)) {
		const ctx = text
			.slice(Math.max(0, x.index - 40), x.index + x[0].length + 30)
			.replace(/\s+/g, ' ');
		const k = `${x[0]} | ${ctx}`;
		if (!seen.has(k)) seen.set(k, new Set());
		seen.get(k).add(m[1]);
	}
}
let n = 0;
for (const [k, v] of seen) {
	// Erlaubt: Uhrzeiten der Termine (18:00–19:00) und Wochentag-Wörter ohne Datum
	console.log(`${v.size}x ${k}`);
	n++;
}
console.log(`\n${n} verschiedene Fundstellen`);
