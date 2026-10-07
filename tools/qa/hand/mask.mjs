// H-3: Verdeckung der rechten App-Spalte (Bühnen-x >= 880) in Ruhe, Maskenmessung.
// Bild mit und ohne Hand-Canvases, im Bildschirmrechteck x 880..939, y 101..699 des Ende-Raums.
// Ein Block von 6 x 6 Bühnen-px zählt als verdeckt, wenn ein Pixel darin abweicht.
// Außerdem Überstand der Kuppen über den Rand (x 950): kleinste x-Lage je Fingerband der Haltehand.
//
//   node tools/qa/hand/mask.mjs --url http://localhost:3123/ --vp 1440x900@2 --out <dir>
import { args, launch, open, sharp, sleep, toMark, vpOf } from '../lib.mjs';

const o = args();
const vp = vpOf(o.vp ?? '1440x900@2');
const browser = await launch();
const h = await open(browser, { vp, url: o.url });
const { page } = h;
await page.mouse.move(2, 2);
await toMark(h, 'intro:1');
await page.evaluate(() => {
	window.__landing.dbg.noPoint = true;
});
await sleep(1200);
const sp = await page.evaluate(() => {
	const r = document.querySelector('[data-ende-space]').getBoundingClientRect();
	return { x: r.left, y: r.top, f: r.width / 1280 };
});
const grab = async (hide) => {
	await page.addStyleTag({
		content: `[data-hand]{visibility:${hide ? 'hidden' : 'visible'}!important}`,
	});
	await sleep(300);
	const { data, info } = await sharp(await page.screenshot())
		.raw()
		.toBuffer({ resolveWithObject: true });
	return { data, w: info.width, h: info.height, ch: info.channels };
};
const A = await grab(false);
const B = await grab(true);
const k = vp.dpr;
const S = (sx, sy) => [Math.round((sp.x + sx * sp.f) * k), Math.round((sp.y + sy * sp.f) * k)];
const diff = (x, y) => {
	const i = (y * A.w + x) * A.ch;
	return (
		Math.abs(A.data[i] - B.data[i]) +
			Math.abs(A.data[i + 1] - B.data[i + 1]) +
			Math.abs(A.data[i + 2] - B.data[i + 2]) >
		30
	);
};
let blocks = 0;
let cov = 0;
for (let by = 101; by < 699; by += 6)
	for (let bx = 880; bx < 939; bx += 6) {
		blocks++;
		const [x0, y0] = S(bx, by);
		const [x1, y1] = S(Math.min(bx + 6, 939), Math.min(by + 6, 699));
		let hit = false;
		for (let y = y0; y < y1 && !hit; y++) for (let x = x0; x < x1 && !hit; x++) hit = diff(x, y);
		if (hit) cov++;
	}
console.log(
	`Spalte x 880..939 (nur Haltehand): ${cov} von ${blocks} Blöcken verdeckt = ${((cov / blocks) * 100).toFixed(1)} %`,
);

// Überstand: Fingerbänder y 190-275, 275-350, 350-430, 430-520 (Bühne), kleinste x-Lage mit Handpixel rechts der Handy-Mitte
const bands = [
	[190, 275],
	[275, 350],
	[350, 430],
	[430, 520],
];
const res = [];
for (const [ya, yb] of bands) {
	let minx = 1e9;
	const [, y0] = S(0, ya);
	const [, y1] = S(0, yb);
	const [xa] = S(800, 0);
	const [xb] = S(1100, 0);
	for (let y = y0; y < y1; y++)
		for (let x = xa; x < xb; x++) if (diff(x, y)) minx = Math.min(minx, x);
	res.push(minx > 1e8 ? null : Math.round(950 - (minx / k - sp.x) / sp.f));
}
console.log('Überstand über x 950 je Band (i, m, r, k):', res.join(', '), 'Bühnen-px');
if (o.out) await page.screenshot({ path: `${o.out}/mask-${vp.name}.png` });
await browser.close();
