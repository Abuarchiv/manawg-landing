// Hilfswerkzeug: CSS-Variablen der Bühne an Marken ausgeben (--p, --g, --f, --e, --kopf-aus).
//   node tools/qa/shell/vars.mjs --url http://localhost:3115/ --marks intro:0.5,intro:0.594
import { args, launch, marksOf, open, state, toMark } from '../lib.mjs';

const a = args();
const browser = await launch();
const h = await open(browser, { url: a.url });
for (const m of marksOf(a.marks)) {
	await toMark(h, m);
	const s = await state(h.page);
	console.log(
		m.padEnd(18),
		JSON.stringify({ P: s.P, g: s.g, f: s.f, e: s.e, kopfAus: s.kopfAus, phase: s.phase }),
	);
}
await browser.close();
