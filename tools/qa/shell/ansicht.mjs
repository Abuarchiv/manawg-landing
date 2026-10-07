// Ansichten für die Sichtprüfung: Viewport-Bilder an Marken, plus Lader nach 400 ms.
//   node tools/qa/shell/ansicht.mjs --url http://localhost:3115/ --vp 390x844@3t --marks ende-der-seite,fragen:0 --out <dir> [--lader]
import { join } from 'node:path';
import { args, launch, open, shot, sleep, toMark, vpList } from '../lib.mjs';

const a = args();
const browser = await launch();
for (const vp of vpList(a.vp ?? '1440x900@1')) {
	if (a.lader) {
		const ctx = await browser.newContext({
			viewport: { width: vp.w, height: vp.h },
			deviceScaleFactor: vp.dpr,
		});
		const page = await ctx.newPage();
		await page.goto(`${a.url}?qa=1`, { waitUntil: 'commit' });
		await sleep(450);
		await page.screenshot({ path: join(a.out, `lader-${vp.name}.png`) });
		await ctx.close();
	}
	if (a.marks) {
		const h = await open(browser, { vp, url: a.url });
		for (const m of String(a.marks).split(',')) {
			await toMark(h, m);
			await shot(h, `${vp.name}-${m.replace(/[:.]/g, '_')}`, { out: a.out });
		}
		await h.ctx.close();
	}
}
await browser.close();
