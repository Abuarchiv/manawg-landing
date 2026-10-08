// H-5: Zeiger-Sweep über ein Raster 20 x 12. An jedem Punkt Kontrast von Titel und Knopf (A/B/C-Messung
// wie text.md Abschnitt 2): C = Glyphkerne (Hand aus, einmal), B = Bild mit transparentem Text, Kontrast =
// weiße Schrift (#FAFAFA) über dem B-Hintergrund an den Glyphkernen.
//
//   node tools/qa/hand/sweep.mjs --url http://localhost:3123/ --vp 1440x900@1 --out <dir> [--nx 20 --ny 12]
import { args, launch, open, sharp, sleep, toMark, vpOf } from '../lib.mjs';

const o = args();
const vp = vpOf(o.vp ?? '1440x900@1');
const NX = +(o.nx ?? 20);
const NY = +(o.ny ?? 12);
const browser = await launch();
const h = await open(browser, { vp, url: o.url });
const { page } = h;
await page.mouse.move(2, 2);
await toMark(h, 'intro:1');
await sleep(800);

const box = await page.evaluate(() => {
	const t = document.querySelector('[data-ende] h2[data-quiet]');
	const c = document.querySelector('[data-ende] a[data-quiet]');
	const rt = t.getBoundingClientRect();
	const rc = c.getBoundingClientRect();
	const x = Math.floor(Math.min(rt.left, rc.left)) - 4;
	const y = Math.floor(Math.min(rt.top, rc.top)) - 4;
	const x2 = Math.ceil(Math.max(rt.right, rc.right)) + 4;
	const y2 = Math.ceil(Math.max(rt.bottom, rc.bottom)) + 4;
	return {
		x,
		y,
		width: x2 - x,
		height: y2 - y,
		t: [rt.left, rt.top, rt.right, rt.bottom],
		c: [rc.left, rc.top, rc.right, rc.bottom],
	};
});
const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
const raw = async (buf) => {
	const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
	return { data, w: info.width, h: info.height, ch: info.channels };
};
const lumOf = (d, i) => {
	const f = (v8) => {
		const v = v8 / 255;
		return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]);
};

// C: Hand aus, Glyphkerne
await page.addStyleTag({ content: '[data-hand]{visibility:hidden!important}' });
await sleep(300);
const C = await raw(await page.screenshot({ clip }));
await page.addStyleTag({ content: '[data-hand]{visibility:visible!important}' });
const core = [];
for (let i = 0; i < C.w * C.h; i++) if (C.data[i * C.ch] > 200) core.push(i);
console.log(`Glyphkerne ${core.length} px, Fenster ${clip.width}x${clip.height}`);

// B: Text transparent
await page.addStyleTag({
	content: '[data-ende] h2[data-quiet],[data-ende] a[data-quiet]{color:transparent!important}',
});
const res = [];
let worst = null;
for (let j = 0; j < NY; j++)
	for (let i = 0; i < NX; i++) {
		const px = Math.round(((i + 0.5) / NX) * vp.w);
		const py = Math.round(((j + 0.5) / NY) * vp.h);
		await page.mouse.move(px, py, { steps: 2 });
		await sleep(420);
		const B = await raw(await page.screenshot({ clip }));
		let ok = 0;
		let min = 99;
		for (const k of core) {
			const L = lumOf(B.data, k * B.ch);
			const cr = (0.955 + 0.05) / (L + 0.05);
			if (cr >= 4.5) ok++;
			min = Math.min(min, cr);
		}
		const frac = ok / core.length;
		res.push({ px, py, frac, min });
		if (!worst || frac < worst.frac) worst = { px, py, frac, min };
	}
const fr = res.map((r) => r.frac);
console.log(
	`Punkte ${res.length}, kleinster Anteil Glyphpixel >= 4,5:1: ${(Math.min(...fr) * 100).toFixed(2)} % bei ${worst.px},${worst.py}; Mittel ${((fr.reduce((a, b) => a + b, 0) / fr.length) * 100).toFixed(2)} %; kleinster Kontrast ${Math.min(...res.map((r) => r.min)).toFixed(2)}:1`,
);
console.log('Punkte unter 100 %:', res.filter((r) => r.frac < 1).length);
if (o.out) {
	const { writeFileSync } = await import('node:fs');
	writeFileSync(`${o.out}/sweep-${vp.name}.json`, JSON.stringify({ clip, worst, res }));
}
console.log('err', h.log.err.length, 'warn', h.log.warn.length, 'fail', h.log.fail.length);
await browser.close();
