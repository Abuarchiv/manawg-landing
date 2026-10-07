// Messkette Text, Teil 4: Größen (X-3), Überlappung Wohnungslabels und Kartentext (X-4),
// reduzierte Bewegung (X-7) und Finale-fps (X-6).
//   node tools/qa/text/pruefen.mjs --teil groessen,overlap,reduce,fps --vp 1440x900@2,390x844@3t --out <dir>
// Ohne --teil laufen alle Teile. Ausgabe als Zeilen "OK|FAIL <Prüfung> <Wert>".
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { args, launch, open, sharp, sleep, toMark, vpList } from '../lib.mjs';

const a = args();
const teile = String(a.teil ?? 'groessen,overlap,reduce,fps').split(',');
const lines = [];
const say = (ok, name, val) => {
	const l = `${ok ? 'OK  ' : 'FAIL'} ${name} ${val}`;
	lines.push(l);
	console.log(l);
};

const browser = await launch();
for (const vp of vpList(a.vp ?? '1440x900@2')) {
	// ---- X-3 Größen ----
	if (teile.includes('groessen')) {
		const h = await open(browser, { vp, url: a.url });
		const m = await h.page.evaluate(() => window.__landing.dbg.masse);
		// Flut: Läufe weißer Zellen im Pixelfeld des Flut-Canvas (alle Zeilen, drei Marken)
		let maxErr = 0;
		let laeufe = 0;
		for (const mk of ['intro:0.56', 'intro:0.6', 'intro:0.88']) {
			await toMark(h, mk);
			const r = await h.page.evaluate(() => {
				const cv = document.querySelector('[data-intro="flut"]');
				const S = cv.width / cv.clientWidth;
				const { data, width, height } = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height);
				const res = [];
				for (let y = Math.round(8 * S); y < height; y += Math.round(16 * S)) {
					let run = 0;
					for (let x = 0; x <= width; x++) {
						const hell =
							x < width && data[(y * width + x) * 4 + 3] > 200 && data[(y * width + x) * 4] > 235;
						if (hell) run++;
						else if (run) {
							if (x - run > 2 && x < width - 2) res.push(run / S);
							run = 0;
						}
					}
				}
				return res;
			});
			for (const cs of r) {
				maxErr = Math.max(maxErr, Math.abs(cs / 16 - Math.round(cs / 16)) * 16);
				laeufe++;
			}
		}
		say(
			m.flutZelle === 16 && maxErr <= 0.5 && laeufe > 3,
			`X-3 Flut-Zelle ${vp.name}`,
			`Konstante ${m.flutZelle} px, Läufe ${laeufe}, Raster-Abweichung max ${maxErr.toFixed(2)} px, Ziffer ${m.flutZiffer} px`,
		);
		say(
			m.zifferZelle === 6 && m.zifferGlyph === 8,
			`X-3 So-geht's-Ziffern ${vp.name}`,
			`Zelle ${m.zifferZelle}, Glyph ${m.zifferGlyph}`,
		);
		// Finale: Periode der Zeichen aus dem Pixelfeld des ASCII-Canvas
		await toMark(h, 'finale:0.3');
		await sleep(600);
		const [pw, ph] = await h.page.evaluate(() => {
			const cv = document.querySelector('#finale canvas');
			const S = cv.width / cv.clientWidth;
			const { data, width, height } = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height);
			const col = new Float64Array(width);
			const row = new Float64Array(height);
			for (let y = 0; y < height; y++)
				for (let x = 0; x < width; x++) {
					const v = data[(y * width + x) * 4];
					col[x] += v;
					row[y] += v;
				}
			const per = (sum, lo, hi) => {
				const n = sum.length;
				let mean = 0;
				for (const v of sum) mean += v;
				mean /= n;
				let best = [0, -1e18];
				for (let p = Math.round(lo * S); p <= Math.round(hi * S); p++) {
					let c = 0;
					for (let i = 0; i + p < n; i++) c += (sum[i] - mean) * (sum[i + p] - mean);
					c /= n - p;
					if (c > best[1] * 1.0001) best = [p / S, c];
				}
				return best[0];
			};
			return [per(col, 6, 12), per(row, 10, 18)];
		});
		say(
			m.finaleZelle?.[0] === 9 &&
				m.finaleZelle?.[1] === 14 &&
				Math.abs(pw - 9) < 0.5 &&
				Math.abs(ph - 14) < 0.6,
			`X-3 Finale-Zelle ${vp.name}`,
			`Konstante ${m.finaleZelle}, gemessene Periode ${pw.toFixed(2)} x ${ph.toFixed(2)} px`,
		);
		await h.ctx.close();
	}

	// ---- X-4 Überlappung ----
	if (teile.includes('overlap')) {
		const h = await open(browser, { vp, url: a.url });
		let bad = 0;
		let abgeschnitten = 0;
		let labelsGesamt = 0;
		const marks = [];
		for (let p = 0.64; p <= 0.88; p += 0.0125) marks.push(`intro:${p.toFixed(4)}`);
		for (const mk of marks) {
			await toMark(h, mk);
			const r = await h.page.evaluate(() => {
				const q = window.__landing.dbg.wohnungLabels?.();
				if (!q) return null;
				const root = document.querySelector('#final');
				const cv = document.querySelector('[data-intro="wohnung"]').getBoundingClientRect();
				// sichtbare Textknoten der Karten (Deckkraft über 0,05), relativ zum Canvas
				const texte = [];
				const tw = document.createTreeWalker(
					document.querySelector('[data-loch="text"]'),
					NodeFilter.SHOW_TEXT,
				);
				for (let n = tw.nextNode(); n; n = tw.nextNode()) {
					if (!n.nodeValue.trim()) continue;
					let op = 1;
					for (let e = n.parentElement; e && e !== root; e = e.parentElement)
						op *= Number.parseFloat(getComputedStyle(e).opacity);
					if (op < 0.05) continue;
					const rg = document.createRange();
					rg.selectNodeContents(n);
					for (const r of rg.getClientRects())
						texte.push({
							x0: r.left - cv.left,
							y0: r.top - cv.top,
							x1: r.right - cv.left,
							y1: r.bottom - cv.top,
						});
				}
				return { labels: q.labels, texte, W: q.W, H: q.H };
			});
			if (!r) continue;
			for (const l of r.labels) {
				labelsGesamt++;
				if (l.x0 < -0.5 || l.x1 > r.W + 0.5 || l.y0 < -0.5 || l.y1 > r.H + 0.5) abgeschnitten++;
				for (const t of r.texte) {
					if (l.x0 < t.x1 && l.x1 > t.x0 && l.y0 < t.y1 && l.y1 > t.y0) bad++;
				}
			}
		}
		say(
			bad === 0,
			`X-4 Label gegen Kartentext ${vp.name}`,
			`${bad} Überlappungen bei ${labelsGesamt} Labels in ${marks.length} Marken`,
		);
		say(
			abgeschnitten === 0,
			`X-4 Labels nie abgeschnitten ${vp.name}`,
			`${abgeschnitten} von ${labelsGesamt}`,
		);
		await h.ctx.close();
	}

	// ---- X-7 reduce ----
	if (teile.includes('reduce')) {
		const h = await open(browser, { vp, url: a.url, reducedMotion: 'reduce' });
		for (const mk of ['intro:0.56', 'so-gehts:0.5', 'finale:0.3']) {
			await toMark(h, mk, { settle: 900 });
			const f = [];
			for (let k = 0; k < 3; k++) {
				const p = join(a.out, `reduce-${vp.name}-${mk.replace(/[:.]/g, '_')}-${k}.png`);
				await h.page.screenshot({ path: p });
				f.push(p);
				await sleep(500);
			}
			let max = 0;
			for (let k = 1; k < 3; k++) {
				const A = await sharp(f[k - 1])
					.raw()
					.toBuffer({ resolveWithObject: true });
				const B = await sharp(f[k]).raw().toBuffer();
				const ch = A.info.channels;
				let diff = 0;
				for (let i = 0; i < A.data.length; i += ch)
					if (
						Math.abs(A.data[i] - B[i]) > 8 ||
						Math.abs(A.data[i + 1] - B[i + 1]) > 8 ||
						Math.abs(A.data[i + 2] - B[i + 2]) > 8
					)
						diff++;
				max = Math.max(max, (100 * diff) / (A.data.length / ch));
			}
			say(max < 0.3, `X-7 reduce ${mk} ${vp.name}`, `${max.toFixed(3)} % je 500 ms`);
		}
		await h.ctx.close();
	}

	// ---- X-6 Finale fps ----
	if (teile.includes('fps')) {
		const h = await open(browser, { vp, url: a.url });
		const rate = vp.touch ? 4 : 1;
		if (rate > 1) await h.cdp.send('Emulation.setCPUThrottlingRate', { rate });
		await toMark(h, 'finale:0.3');
		await sleep(500);
		const r = await h.page.evaluate(
			() =>
				new Promise((res) => {
					const t = [];
					let last = performance.now();
					const end = last + 4000;
					const f = (n) => {
						t.push(n - last);
						last = n;
						if (n < end) requestAnimationFrame(f);
						else {
							const s = [...t].sort((x, y) => x - y);
							res({
								fps: (1000 * t.length) / t.reduce((x, y) => x + y, 0),
								p95: s[Math.floor(s.length * 0.95)],
								lang: t.filter((x) => x > 50).length,
							});
						}
					};
					requestAnimationFrame(f);
				}),
		);
		const soll = vp.touch ? 30 : 55;
		say(
			r.fps >= soll,
			`X-6 Finale fps ${vp.name}${rate > 1 ? ' 4x CPU' : ''}`,
			`${r.fps.toFixed(1)} fps (Soll ${soll}), p95 ${r.p95.toFixed(1)} ms, Bilder > 50 ms: ${r.lang}`,
		);
		await h.ctx.close();
	}
}
await browser.close();
writeFileSync(join(a.out, 'pruefen.txt'), lines.join('\n'));
