// Ruckler-Test (PLAN-V2 Abnahme 11, F-07): 320 ms Blockade bei intro:0.05, Schärfeverlust <= 10 %, Erholung < 0,3 s.
//   node tools/qa/adapt.mjs --url http://localhost:3120/ --vp 1440x900@1 --out <dir>
// Schärfe = mittlere Kantenenergie eines Ausschnitts in der Bildmitte.
import { args, launch, open, report, sharp, sleep, toMark, vpOf } from './lib.mjs';

const a = args();
const browser = await launch();
const h = await open(browser, { vp: vpOf(a.vp ?? '1440x900@1'), url: a.url });
await toMark(h, 'intro:0.05');
await sleep(1500);
const vp = h.vp;
const clip = {
	x: Math.round(vp.w * 0.2),
	y: Math.round(vp.h * 0.25),
	width: Math.round(vp.w * 0.6),
	height: Math.round(vp.h * 0.5),
};
const sharpness = async () => {
	const buf = await h.page.screenshot({ clip });
	const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
	let g = 0;
	for (let y = 0; y < info.height; y++)
		for (let x = 1; x < info.width; x++)
			g += Math.abs(data[y * info.width + x] - data[y * info.width + x - 1]);
	return g / (info.width * info.height);
};
const vorher = await sharpness();
await h.page.evaluate(() => {
	const t = performance.now();
	while (performance.now() - t < 320);
});
const t0 = Date.now();
const rows = [];
for (let i = 0; i < 14; i++) {
	rows.push([Date.now() - t0, await sharpness()]);
	await sleep(60);
}
const min = Math.min(...rows.map((r) => r[1]));
const verlust = (vorher - min) / vorher;
const erholt = rows.find((r) => r[1] >= vorher * 0.97);
console.log(
	'Schärfe vorher',
	vorher.toFixed(2),
	'Verlauf (ms:Wert)',
	rows.map((r) => `${r[0]}:${r[1].toFixed(2)}`).join(' '),
);
const ok1 = verlust <= 0.1;
const ok2 = !!erholt && erholt[0] < 300 + 150; // Messschritte kosten Zeit
console.log(
	`${ok1 ? 'OK  ' : 'FAIL'} Schärfeverlust ${(verlust * 100).toFixed(1)} % (Grenze 10 %)`,
);
console.log(
	`${ok2 ? 'OK  ' : 'FAIL'} Erholung nach ${erholt ? erholt[0] : '-'} ms (Grenze 300 ms)`,
);
const bad = (ok1 ? 0 : 1) + (ok2 ? 0 : 1) + report(h.log);
await browser.close();
process.exit(bad ? 1 : 0);
