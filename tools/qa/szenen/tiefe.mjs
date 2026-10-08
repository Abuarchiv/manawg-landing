// S-2 Tiefe (PLAN-V2, Paket SZENEN): Dichte, Nahzeichen, Untertitel, Wortkontrast beim ersten Erscheinen.
//   node tools/qa/szenen/tiefe.mjs --url http://localhost:3125/ --vp 1440x900@1 --out <dir> [--n 72]
// Misst an n+1 Marken funktionen:0..1 (echtes Scrollen, Zeiger in der Ecke):
//  - helle Pixel: Anteil > 90 (a) im 160x90-Verkleinern des Audits (dense.mjs), (b) in Bildschirmauflösung
//  - größte Schrift der Nahzeichen (fillText im Tiefe-Canvas) <= 32 px
//  - Untertitel 01-03: Bildschirmhöhen mit Deckkraft >= 0,9 (>= 0,35)
//  - Median der Wortpixel bei der ersten Sichtbarkeit (nur Wörter, ohne DOM-Text) >= 4,5:1
import { args, launch, open, report, sharp, shot, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const N = Number(a.n ?? 72);
const vp = vpOf(a.vp ?? '1440x900@1');
const INIT = () => {
	window.__ft = { max: 0, n: 0 };
	const ft = CanvasRenderingContext2D.prototype.fillText;
	CanvasRenderingContext2D.prototype.fillText = function (...r) {
		if (this.canvas.closest?.('#funktionen')) {
			const m = /(\d+(?:\.\d+)?)px/.exec(this.font);
			if (m) {
				window.__ft.max = Math.max(window.__ft.max, +m[1]);
				window.__ft.n++;
			}
		}
		return ft.apply(this, r);
	};
};
const browser = await launch();
let bad = 0;
const ok = (c, msg) => {
	if (!c) bad++;
	console.log(`${c ? 'OK  ' : 'FAIL'} ${msg}`);
};
const h = await open(browser, { vp, url: a.url, init: `(${INIT})()` });
const mo = { mx: vp.w - 3, my: vp.h - 3 };
const rows = [];
const op = [[], [], []];
for (let i = 0; i <= N; i++) {
	const p = i / N;
	await toMark(h, `funktionen:${p.toFixed(4)}`, mo);
	const buf = await h.page.screenshot();
	const g90 = await sharp(buf).resize(160, 90, { fit: 'fill' }).greyscale().raw().toBuffer();
	const full = await sharp(buf).resize(vp.w, vp.h, { fit: 'fill' }).greyscale().raw().toBuffer();
	const frac = (d) => d.reduce((s, v) => s + (v > 90 ? 1 : 0), 0) / d.length;
	const o = await h.page.evaluate(() =>
		[...document.querySelectorAll('[data-dcap]')].map((e) => +getComputedStyle(e).opacity),
	);
	o.forEach((v, k) => op[k].push(v));
	rows.push({ p, a: frac(g90) * 100, b: frac(full) * 100 });
	if (a.v)
		console.log(
			p.toFixed(3),
			rows[i].a.toFixed(2),
			rows[i].b.toFixed(2),
			o.map((v) => v.toFixed(2)).join(' '),
		);
	if (i % 12 === 0) await shot(h, `tiefe-${vp.name}-${String(i).padStart(2, '0')}`, { out: a.out });
}
const minA = rows.reduce((m, r) => (r.a < m.a ? r : m));
const minB = rows.reduce((m, r) => (r.b < m.b ? r : m));
const lowA = rows.filter((r) => r.a < 2).length;
ok(
	lowA === 0,
	`Dichte (160x90, >90): Minimum ${minA.a.toFixed(2)} % bei p ${minA.p.toFixed(3)}, ${lowA} von ${rows.length} Marken unter 2 %`,
);
ok(
	minB.b >= 2,
	`Dichte (Bildschirmauflösung, >90): Minimum ${minB.b.toFixed(2)} % bei p ${minB.p.toFixed(3)}`,
);
const med = [...rows.map((r) => r.a)].sort((x, y) => x - y)[Math.floor(rows.length / 2)];
console.log(
	`     Dichte (160x90) Median ${med.toFixed(2)} %, Maximum ${Math.max(...rows.map((r) => r.a)).toFixed(2)} %`,
);
const sec = await h.page.evaluate(() => window.__landing.section('funktionen'));
const fahrt = sec.height - vp.h;
for (let k = 0; k < 3; k++) {
	const n = op[k].filter((v) => v >= 0.9).length;
	const hoehe = (n / (N + 1)) * (fahrt / vp.h);
	ok(
		hoehe >= 0.35,
		`Untertitel 0${k + 1}: ${hoehe.toFixed(2)} Bildschirmhöhen mit Deckkraft >= 0,9 (Grenze 0,35)`,
	);
}
const gaps = rows.filter((_, i) => op.every((c) => c[i] < 0.45)).length;
console.log(`     Marken ohne lesbaren Untertitel (alle < 0,45): ${gaps} von ${rows.length}`);
const ft = await h.page.evaluate(() => window.__ft);
ok(
	ft.n > 0 && ft.max <= 32,
	`Nahzeichen: größte Schrift ${ft.max} px bei ${ft.n} Zeichen (Grenze 32 px)`,
);
// Wortkontrast beim ersten Erscheinen: je ein Wort allein (HAUSHALT bei dz 40, ABSPRACHEN bei dz 66),
// DOM-Text und Kopf ausgeblendet
await toMark(h, 'funktionen:0', mo);
await h.page.addStyleTag({
	content:
		'#funktionen [data-dcap],#funktionen .label{visibility:hidden}#final>header,#final header{visibility:hidden}',
});
const lin = (v) => {
	const c = v / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lbg = lin(10);
for (const k of [1, 2]) {
	await h.page.evaluate((k) => {
		window.__landing.dbg.nurWort = k;
	}, k);
	await sleep(600);
	const buf = await h.page.screenshot();
	const { data } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
	const rat = [];
	for (const v of data) if (v > 25) rat.push((lin(v) + 0.05) / (lbg + 0.05));
	rat.sort((x, y) => x - y);
	const m = rat[Math.floor(rat.length / 2)] ?? 0;
	ok(
		rat.length > 20 && m >= 4.5,
		`Wort ${k === 1 ? 'HAUSHALT' : 'ABSPRACHEN'} beim ersten Erscheinen: Median ${m.toFixed(1)}:1 über ${rat.length} Wortpixel (Grenze 4,5:1)`,
	);
	await shot(h, `tiefe-wort${k}-${vp.name}`, { out: a.out });
}
bad += report(h.log, `Tiefe ${vp.name}`);
await h.ctx.close();
await browser.close();
console.log(bad ? `GESAMT: ${bad} Verstöße` : 'GESAMT: alles grün');
process.exit(bad ? 1 : 0);
