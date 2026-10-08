// Messkette Text, Teil 3: Flut über 200 Zeitphasen und Plateau der Raumkarten (Abnahme X-1).
//
// Die Flut wird mit dem echten Code gerechnet (qa.flutGitter aus flut.js), nicht nachgebaut. Die
// Glyphenpixel der Karten stammen aus den C-Bildern von capture.mjs (Marken intro:0.676 ... 0.844).
//   node tools/qa/text/capture.mjs --vp 1440x900@2 --marks intro:0.676,intro:0.732,intro:0.788,intro:0.844 --out <cap>
//   node tools/qa/text/phasen.mjs --vp 1440x900@2 --cap <cap> --out <dir>
// Ausgabe: je Karte der verdeckte Glyphenanteil (Mittel, Maximum, Anteil der Läufe über 5 %), dazu aus
// qa.karten die Plateaus (Karten >= 0,98 und >= 0,5 in Bildschirmhöhen) und die Schritte mit zwei Karten > 0,05.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { args, launch, open, sharp, vpList } from '../lib.mjs';

const a = args();
const PHASEN = Number(a.phasen ?? 200);
const KARTEN_MARKEN = ['intro:0.676', 'intro:0.732', 'intro:0.788', 'intro:0.844'];

const out = { vp: [] };
const browser = await launch();
for (const vp of vpList(a.vp ?? '1440x900@2')) {
	const dir = join(a.cap, vp.name);
	const jsons = readdirSync(dir).filter((f) => /^\d\d-.*\.json$/.test(f));
	const metaOf = (mark) => {
		const f = jsons.find((j) => JSON.parse(readFileSync(join(dir, j))).mark === mark);
		return f ? { f, meta: JSON.parse(readFileSync(join(dir, f))) } : null;
	};
	const h = await open(browser, { vp, url: a.url });
	const res = { vp: vp.name, karten: [], plateau: null };
	for (let j = 0; j < 4; j++) {
		const hit = metaOf(KARTEN_MARKEN[j]);
		if (!hit) continue;
		const { f, meta } = hit;
		const spalte = meta.loecher.find((l) => l.art === 'text').r;
		const img = sharp(join(dir, f.replace('.json', '_C.png'))).greyscale();
		const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
		const S = info.width / meta.vw;
		const zellen = new Map();
		let n = 0;
		for (let y = Math.floor(spalte[1] * S); y < Math.ceil(spalte[3] * S); y++)
			for (let x = Math.floor(spalte[0] * S); x < Math.ceil(spalte[2] * S); x++) {
				if (data[y * info.width + x] < 90) continue;
				const q = `${Math.floor(x / S / 16)},${Math.floor(y / S / 16)}`;
				zellen.set(q, (zellen.get(q) ?? 0) + 1);
				n++;
			}
		const cells = [...zellen.entries()].map(([k, w]) => [...k.split(',').map(Number), w]);
		const r = await h.page.evaluate(
			({ cells, j, n, W, H, lo, PHASEN }) => {
				const dbg = window.__landing.dbg;
				const lov = lo.map((l) => ({
					x: l.r[0],
					y: l.r[1],
					w: l.r[2] - l.r[0],
					h: l.r[3] - l.r[1],
					art: l.art,
				}));
				let sum = 0;
				let max = 0;
				let over = 0;
				let cnt = 0;
				for (const d of [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]) {
					const P = 0.62 + (0.28 * (j + 1 + d)) / 5;
					const cover = dbg.deckung(P);
					for (let k = 0; k < PHASEN; k++) {
						const t = 0.37 + k * 1.913;
						const g = dbg.flutGitter(W, H, t, cover, P, lov);
						let hid = 0;
						for (const [cx, cy, w] of cells) if (g.on[cy * g.cols + cx]) hid += w;
						const fr = hid / n;
						sum += fr;
						max = Math.max(max, fr);
						if (fr > 0.05) over++;
						cnt++;
					}
				}
				return { mittel: sum / cnt, max, ueber5: over / cnt, proben: cnt };
			},
			{ cells, j, n, W: meta.vw, H: meta.vh, lo: meta.loecher, PHASEN },
		);
		res.karten.push({ karte: j, glyphenpixel: n, ...r });
	}
	// Plateau der Karten aus den echten Kurven
	res.plateau = await h.page.evaluate(() => {
		const L = window.__landing;
		const dbg = L.dbg;
		const H = innerHeight;
		const rows = [];
		for (let P = 0.6; P <= 0.92; P += 0.0004) rows.push([L.yForP(P) / H, dbg.karten(P)]);
		const proj = { zwei: 0, voll: [0, 0, 0, 0], halb: [0, 0, 0, 0], sichtbar: [0, 0, 0, 0] };
		for (let i = 1; i < rows.length; i++) {
			const dy = rows[i][0] - rows[i - 1][0];
			const c = rows[i][1];
			if (c.filter((v) => v > 0.05).length > 1) proj.zwei++;
			c.forEach((v, j) => {
				if (v >= 0.98) proj.voll[j] += dy;
				if (v >= 0.5) proj.halb[j] += dy;
				if (v > 0.05) proj.sichtbar[j] += dy;
			});
		}
		proj.voll = proj.voll.map((v) => +v.toFixed(3));
		proj.halb = proj.halb.map((v) => +v.toFixed(3));
		proj.sichtbar = proj.sichtbar.map((v) => +v.toFixed(3));
		return proj;
	});
	out.vp.push(res);
	console.log(JSON.stringify(res));
	await h.ctx.close();
}
await browser.close();
writeFileSync(join(a.out, 'phasen.json'), JSON.stringify(out, null, 1));
