// SH-1: Kopf. Je Marke und Viewport: Text unter Logo oder Knopf (DOM-Schnitt, mit und ohne Schleier)
// und Kontrast des Kopfs gegen den echten Hintergrund (Kopf-Inhalt ausgeblendet, Schleier bleibt).
//   node tools/qa/shell/kopf.mjs --url http://localhost:3115/ --vp 1440x900@1 --marks all --out <dir>
// Schreibt <out>/<vp>/NN-<marke>.png (oberer Streifen, mit Kopf) und <out>/kopf-<vp>.json.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { args, launch, marksOf, open, report, sharp, sleep, toMark, vpList } from '../lib.mjs';

const a = args();
const browser = await launch();
let bad = 0;
const lum = (r, g, b) => {
	const f = (v) => {
		const c = v / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
for (const vp of vpList(a.vp ?? '1440x900@1')) {
	const dir = join(a.out, vp.name);
	mkdirSync(dir, { recursive: true });
	const h = await open(browser, { vp, url: a.url });
	const res = [];
	let n = 0;
	for (const mark of marksOf(a.marks)) {
		await toMark(h, mark);
		await sleep(250);
		const info = await h.page.evaluate(() => {
			const k = document.querySelector('[data-kopf]');
			const cs = getComputedStyle(k);
			const vis = cs.visibility !== 'hidden';
			const op = Number(cs.opacity);
			const rects = [...k.querySelectorAll('[data-loch="logo"], [data-loch="cta"]')].map((e) => {
				const r = e.getBoundingClientRect();
				return { art: e.dataset.loch, x: r.left, y: r.top, w: r.width, h: r.height };
			});
			// sichtbarer Text unter dem Kopf (DOM), ohne den Kopf selbst
			const unter = [];
			const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
			for (let t = w.nextNode(); t; t = w.nextNode()) {
				const el = t.parentElement;
				if (!el || k.contains(el) || !t.textContent.trim()) continue;
				let o = 1;
				let ok = true;
				for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
					const c = getComputedStyle(e);
					if (c.visibility === 'hidden' || c.display === 'none') ok = false;
					o *= Number(c.opacity);
				}
				if (!ok || o < 0.05) continue;
				const rg = document.createRange();
				rg.selectNodeContents(t);
				for (const q of rg.getClientRects()) {
					for (const r of rects) {
						if (q.right > r.x && q.left < r.x + r.w && q.bottom > r.y && q.top < r.y + r.h)
							unter.push(`${r.art}:${t.textContent.trim().slice(0, 28)}`);
					}
				}
			}
			const root = document.getElementById('final');
			return {
				phase: root.dataset.phase,
				kopfAus: Number(getComputedStyle(root).getPropertyValue('--kopf-aus')),
				vis,
				op,
				inert: k.inert,
				rects,
				unter: [...new Set(unter)],
			};
		});
		// Hintergrund hinter dem Kopf messen: Logo und Knopf unsichtbar, Schleier bleibt
		await h.page
			.addStyleTag({ content: '[data-kopf] > *{visibility:hidden!important}' })
			.then(async (st) => {
				const buf = await h.page.screenshot({ clip: { x: 0, y: 0, width: vp.w, height: 160 } });
				await st.evaluate((e) => e.remove());
				const img = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
				const { data, info: im } = img;
				const sc = im.width / vp.w;
				info.kontrast = {};
				for (const r of info.rects) {
					const L = [];
					for (
						let y = Math.max(0, Math.floor(r.y * sc));
						y < Math.min(im.height, Math.ceil((r.y + r.h) * sc));
						y++
					)
						for (
							let x = Math.max(0, Math.floor(r.x * sc));
							x < Math.min(im.width, Math.ceil((r.x + r.w) * sc));
							x++
						) {
							const i = (y * im.width + x) * im.channels;
							L.push(lum(data[i], data[i + 1], data[i + 2]));
						}
					L.sort((p, q) => p - q);
					const p90 = L[Math.floor(L.length * 0.9)] ?? 0;
					// weißer Text (#fafafa, L 0,955) mit Kopf-Deckkraft über dem Hintergrund gemischt
					const text = 0.955 * info.op + p90 * (1 - info.op);
					info.kontrast[r.art] = +((text + 0.05) / (p90 + 0.05)).toFixed(2);
				}
			});
		const file = join(dir, `${String(++n).padStart(2, '0')}-${mark.replace(/[:.]/g, '_')}.png`);
		await h.page.screenshot({
			path: file,
			clip: { x: 0, y: 0, width: vp.w, height: Math.min(160, vp.h) },
		});
		res.push({ mark, ...info });
		const min = Math.min(...Object.values(info.kontrast));
		const zu = !info.vis || info.op < 0.05;
		console.log(
			`${vp.name} ${mark.padEnd(20)} ${info.phase.padEnd(5)} aus=${info.kopfAus.toFixed(2)} ${zu ? 'verdeckt' : `kontrast ${min}`} unter=${info.unter.length ? info.unter.join(' | ') : '-'}`,
		);
	}
	writeFileSync(join(a.out, `kopf-${vp.name}.json`), JSON.stringify(res, null, 1));
	bad += report(h.log, vp.name);
	await h.ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
