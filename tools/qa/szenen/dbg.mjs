// Marken anfahren und Zustand ausgeben (Fehlersuche).
//   node tools/qa/szenen/dbg.mjs --vp 768x1024@2t --marks koerper:0,bereiche:0.02
import { args, launch, open, state, toMark, vpOf, yOf } from '../lib.mjs';

const a = args();
const b = await launch();
const h = await open(b, { vp: vpOf(a.vp), url: a.url });
for (const m of String(a.marks).split(',')) {
	const y = await yOf(h.page, m);
	const t0 = Date.now();
	await toMark(h, m);
	console.log(m, 'Ziel', y, 'Ist', JSON.stringify(await state(h.page)), `${Date.now() - t0} ms`);
}
await b.close();
