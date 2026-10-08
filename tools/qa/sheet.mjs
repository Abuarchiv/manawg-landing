// Kontaktbögen der Marken aus PLAN-V2 §11 (echtes Scrollen, echte GPU).
//   node tools/qa/sheet.mjs --url http://localhost:3120/ --vp 1440x900@2 --marks all --out <dir>
//   node tools/qa/sheet.mjs --vp 390x844@3t,768x1024@2t --marks intro:0,intro:0.56,funktionen:0.5 --out <dir>
// Schreibt <out>/<vp>/NN-<marke>.png und <out>/sheet-<vp>-N.jpg (9 Bilder je Bogen).
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
	args,
	launch,
	marksOf,
	open,
	renderer,
	report,
	sheet,
	shot,
	state,
	toMark,
	vpList,
} from './lib.mjs';

const a = args();
const cols = Number(a.cols ?? 3);
const je = Number(a.je ?? 9);
const browser = await launch();
let bad = 0;
for (const vp of vpList(a.vp ?? '1440x900@1')) {
	const dir = join(a.out, vp.name);
	mkdirSync(dir, { recursive: true });
	const h = await open(browser, { vp, url: a.url });
	console.log(vp.name, await renderer(h.page));
	const files = [];
	const labels = [];
	let i = 0;
	for (const m of marksOf(a.marks)) {
		await toMark(h, m);
		const st = await state(h.page);
		const name = `${String(i++).padStart(2, '0')}-${m.replace(/[:.]/g, '_')}`;
		files.push(await shot(h, join(vp.name, name), { out: a.out }));
		labels.push(`${m}  y ${st.y}  P ${st.P}  ${st.phase}  e ${st.e}`);
	}
	for (let k = 0; k < files.length; k += je)
		await sheet(
			files.slice(k, k + je),
			labels.slice(k, k + je),
			join(a.out, `sheet-${vp.name}-${k / je}.jpg`),
			cols,
			Number(a.w ?? 560),
		);
	bad += report(h.log, vp.name);
	await h.ctx.close();
}
await browser.close();
console.log(`Ausgabe: ${a.out}`);
process.exit(bad ? 1 : 0);
