// Konsolenmeldungen der Ende-Szene ausgeben (Shader-Fehler, Warnungen).
//   node tools/qa/hand/log.mjs --url http://localhost:3123/ [--vp 1440x900@1]
import { args, launch, open, toMark, vpOf } from '../lib.mjs';

const o = args();
const browser = await launch();
const h = await open(browser, { vp: vpOf(o.vp ?? '1440x900@1'), url: o.url });
await toMark(h, 'intro:1');
console.log(
	h.log.all
		.filter((l) => !l.startsWith('log'))
		.join('\n')
		.slice(0, 4000),
);
await browser.close();
