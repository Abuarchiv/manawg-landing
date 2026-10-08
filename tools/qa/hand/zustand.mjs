// Zustand der Hand an einer Marke ausgeben (Zeiger, Ziel, Spitze).
//   node tools/qa/hand/zustand.mjs --url http://localhost:3123/ --vp 844x390@3t [--mark intro:1]
import { args, launch, open, sleep, toMark, vpOf } from '../lib.mjs';

const o = args();
const browser = await launch();
const h = await open(browser, { vp: vpOf(o.vp ?? '1440x900@1'), url: o.url });
await toMark(h, o.mark ?? 'intro:1');
for (let i = 0; i < 3; i++) {
	await sleep(700);
	console.log(JSON.stringify(await h.page.evaluate(() => window.__landing.dbg.hand().dbg)));
}
await browser.close();
