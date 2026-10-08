// Prüfungen für Vollbild und Lesbarkeit (PLAN-V2 Abnahme Fundament 3, 4, 5, 8).
//   node tools/qa/check.mjs --url http://localhost:3120/ --vp all --marks all --out <dir>
//   node tools/qa/check.mjs --vp 390x844@3t,1920x1080@1 --marks intro:0,intro:0.56
// Prüft je Viewport an den Marken aus PLAN-V2 §11:
//   - scrollWidth == clientWidth (kein Überlauf nach rechts)
//   - Szenenflächen: Sticky-Bühnen = Viewport (±1 px), Canvas = Elternbox, Eltern = Breite
//   - Randstreifen-Pixelprüfung bei intro:0 und intro:0.56 (kein einfarbiger #0A0A0A-Streifen >= 4 px)
//   - kein Textknoten und kein Bedienelement teilweise außerhalb [0, Breite]
//   - DOM-Schrift: Labels >= 12 px, Fließtext (> 40 Zeichen) >= 15 px
//   - Backing jedes Canvas = CSS x Pixelfaktor (<= min(DPR, 2))
//   - Intro = (1 + INTRO) Bildschirmhöhen, Tiefe-Fahrt 3,5 Bildschirmhöhen
// Exit-Code 1 bei Verstößen. --intro N setzt die erwartete Intro-Strecke (Standard 10).
import { join } from 'node:path';
import {
	args,
	launch,
	marksOf,
	open,
	renderer,
	report,
	sharp,
	shot,
	toMark,
	vpList,
} from './lib.mjs';

const a = args();
const INTRO = Number(a.intro ?? 10);
const bad = [];
const fail = (vp, m, msg) => bad.push(`${vp.name} ${m}: ${msg}`);

/** Läuft im Browser: sammelt alle Maße der aktuellen Marke. */
function messen({ fontMin }) {
	const W = document.documentElement.clientWidth;
	const H = innerHeight;
	const out = { W, H, sw: document.documentElement.scrollWidth, probs: [], fonts: [], canv: [] };
	const eff = (el) => {
		let o = 1;
		for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
			const cs = getComputedStyle(e);
			if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
			o *= Number(cs.opacity);
			if (e.inert) return 0;
		}
		return o;
	};
	const clip = (el, r) => {
		let x0 = r.left;
		let x1 = r.right;
		for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
			const cs = getComputedStyle(e);
			if (cs.overflowX !== 'visible' || cs.overflow !== 'visible') {
				const b = e.getBoundingClientRect();
				x0 = Math.max(x0, b.left);
				x1 = Math.min(x1, b.right);
			}
		}
		return [x0, x1];
	};
	const geraet = (el) => el.closest('[data-ende-space],[data-geraet],[data-ins-device]');
	// Textknoten
	const w = document.createTreeWalker(document.getElementById('final'), NodeFilter.SHOW_TEXT);
	const rg = document.createRange();
	while (w.nextNode()) {
		const n = w.currentNode;
		const t = n.nodeValue.replace(/\s+/g, ' ').trim();
		const el = n.parentElement;
		if (!t || !el || el.closest('canvas,style,script,noscript,[data-loader]')) continue;
		rg.selectNodeContents(n);
		const b = rg.getBoundingClientRect();
		if (b.width < 1 || b.height < 1 || b.bottom <= 0 || b.top >= H) continue;
		if (eff(el) < 0.05) continue;
		const [x0, x1] = clip(el, b);
		if (x1 - x0 < b.width - 1) continue; // von einem Elternteil abgeschnitten (gewollt, z. B. Gerät)
		if ((x0 < -1 && x1 > 1) || (x1 > W + 1 && x0 < W - 1))
			out.probs.push(`Text "${t.slice(0, 30)}" ${Math.round(x0)}..${Math.round(x1)} von ${W}`);
		if (!geraet(el) && !el.closest('[aria-hidden="true"]')) {
			const fs = Number.parseFloat(getComputedStyle(el).fontSize);
			const lang = t.length > 40;
			if (fs < fontMin.label - 0.01 || (lang && fs < fontMin.body - 0.01))
				out.fonts.push(`${fs.toFixed(1)}px "${t.slice(0, 28)}"`);
		}
	}
	// Bedienelemente
	for (const el of document.querySelectorAll('a[href],button,[role=button],[tabindex="0"]')) {
		const b = el.getBoundingClientRect();
		if (b.width < 1 || b.bottom <= 0 || b.top >= H) continue;
		if (eff(el) < 0.05) continue;
		if (geraet(el)) continue;
		const [x0, x1] = clip(el, b);
		if (x1 - x0 < b.width - 1) continue;
		if ((x0 < -1 && x1 > 1) || (x1 > W + 1 && x0 < W - 1))
			out.probs.push(
				`Bedienelement "${(el.textContent || el.tagName).trim().slice(0, 24)}" ${Math.round(x0)}..${Math.round(x1)} von ${W}`,
			);
	}
	// Szenenflächen
	for (const el of document.querySelectorAll('[data-sec]')) {
		const b = el.getBoundingClientRect();
		if (Math.abs(b.left) > 1 || Math.abs(b.width - W) > 1)
			out.probs.push(
				`Abschnitt ${el.id} nicht vollbreit: ${Math.round(b.left)}+${Math.round(b.width)} von ${W}`,
			);
	}
	for (const el of document.querySelectorAll('[data-buehne]')) {
		const b = el.getBoundingClientRect();
		const sec = el.closest('[data-sec]').getBoundingClientRect();
		const stuck = sec.top <= 0 && sec.bottom >= H;
		if (stuck && (Math.abs(b.top) > 1 || Math.abs(b.height - H) > 1 || Math.abs(b.width - W) > 1))
			out.probs.push(
				`Bühne ${el.dataset.buehne} klebt nicht vollflächig: ${Math.round(b.left)},${Math.round(b.top)} ${Math.round(b.width)}x${Math.round(b.height)} gegen ${W}x${H}`,
			);
	}
	for (const cv of document.querySelectorAll('canvas')) {
		const b = cv.getBoundingClientRect();
		if (b.width < 2 || b.bottom <= 0 || b.top >= H) continue;
		if (cv.closest('[data-ende-space],[data-geraet],[data-ins-device]')) continue;
		const p = cv.parentElement.getBoundingClientRect();
		const cs = getComputedStyle(cv);
		const flaeche =
			cs.position === 'absolute' && /(^| )0px/.test(cs.left) && Math.abs(b.width - p.width) < 1.5;
		if (flaeche && (Math.abs(b.width - p.width) > 1 || Math.abs(b.height - p.height) > 1))
			out.probs.push(
				`Canvas ${cv.dataset.intro ?? cv.dataset.art ?? cv.dataset.hand ?? cv.dataset.sterne ?? '?'} deckt Eltern nicht: ${Math.round(b.width)}x${Math.round(b.height)} gegen ${Math.round(p.width)}x${Math.round(p.height)}`,
			);
		out.canv.push({
			id:
				cv.dataset.intro ??
				cv.dataset.art ??
				cv.dataset.hand ??
				(cv.dataset.sterne ? 'sterne' : (cv.parentElement.dataset?.ins ?? '?')),
			cw: b.width,
			ch: b.height,
			bw: cv.width,
			bh: cv.height,
			d: cv.width / Math.max(1, cv.clientWidth),
		});
	}
	return out;
}

async function randStreifen(path) {
	const { data, info } = await sharp(path)
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const { width: w, height: h, channels: c } = info;
	const luma = (x, y) => {
		const i = (y * w + x) * c;
		return (data[i] + data[i + 1] + data[i + 2]) / 3;
	};
	const strip = (xs, ys) => {
		let n = 0;
		let s = 0;
		let s2 = 0;
		let dev = 0;
		for (const y of ys)
			for (const x of xs) {
				const l = luma(x, y);
				n++;
				s += l;
				s2 += l * l;
				dev = Math.max(dev, Math.abs(l - 10));
			}
		const m = s / n;
		return { m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)), dev };
	};
	const rng = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);
	const k = 4 * Math.max(1, Math.round(w / 1000));
	// Streifen, der exakt #0A0A0A ist, obwohl das Bild daneben nicht einfarbig ist.
	const res = [];
	const t = (name, xs, ys, xin, yin) => {
		const s = strip(xs, ys);
		const inn = strip(xin, yin);
		// einfarbig dunkler Streifen neben deutlich hellerem Bild (Balken), nicht bloß dunkles Bildmaterial
		if (s.dev <= 3 && s.sd < 1 && inn.sd > 6 && inn.m > 40) res.push(name);
	};
	t('links', rng(0, k), rng(0, h), rng(k, 3 * k), rng(0, h));
	t('rechts', rng(w - k, w), rng(0, h), rng(w - 3 * k, w - k), rng(0, h));
	t('oben', rng(0, w), rng(0, k), rng(0, w), rng(k, 3 * k));
	t('unten', rng(0, w), rng(h - k, h), rng(0, w), rng(h - 3 * k, h - k));
	return res;
}

const vps = vpList(a.vp);
const marks = marksOf(a.marks);
const browser = await launch();
for (const vp of vps) {
	const h = await open(browser, { vp, url: a.url });
	if (vp === vps[0]) console.log('Renderer:', await renderer(h.page));
	const fontMin = { label: 12, body: 15 };
	let nProb = 0;
	// Höhenmaße
	const maße = await h.page.evaluate(() => {
		const H = innerHeight;
		const intro = document.getElementById('intro').getBoundingClientRect().height;
		const tiefe = document.getElementById('funktionen').getBoundingClientRect().height;
		return {
			H,
			intro: intro / H,
			tiefe: tiefe / H,
			sw: document.documentElement.scrollWidth,
			cw: document.documentElement.clientWidth,
		};
	});
	if (Math.abs(maße.intro - (1 + INTRO)) > (1 + INTRO) * 0.01)
		fail(vp, 'Intro', `${maße.intro.toFixed(3)} Bildschirmhöhen statt ${1 + INTRO}`);
	if (Math.abs(maße.tiefe - 1 - 3.5) > 3.5 * 0.01)
		fail(vp, 'Tiefe', `Fahrt ${(maße.tiefe - 1).toFixed(3)} statt 3,5 Bildschirmhöhen`);
	for (const m of marks) {
		const y = await toMark(h, m);
		if (a.v) console.log(`  ${vp.name} ${m} -> ${y}`);
		const r = await h.page.evaluate(messen, { fontMin });
		const tag = `${m}@${y}`;
		if (r.sw !== r.W) fail(vp, tag, `scrollWidth ${r.sw} != clientWidth ${r.W}`);
		for (const p of r.probs) fail(vp, tag, p);
		for (const f of r.fonts) fail(vp, tag, `Schrift zu klein ${f}`);
		for (const c of r.canv) {
			const cap = 2;
			if (c.d > Math.min(vp.dpr, cap) + 0.02)
				fail(
					vp,
					tag,
					`Canvas ${c.id} Backing ${c.d.toFixed(2)} über Deckel ${Math.min(vp.dpr, cap)}`,
				);
			const min = Math.min(vp.dpr, vp.touch ? 1.5 : cap) - 0.02;
			if (c.d < min && c.id !== 'hero' && c.id !== 'back' && c.id !== 'front')
				fail(vp, tag, `Canvas ${c.id} Backing ${c.d.toFixed(2)} unter ${min.toFixed(2)}`);
		}
		nProb += r.probs.length + r.fonts.length;
		if (m === 'intro:0' || m === 'intro:0.516' || m === 'intro:0.56' || a.shots) {
			const path = await shot(h, `rand-${vp.name}-${m.replace(':', '_')}`, { out: a.out });
			if (m === 'intro:0' || m === 'intro:0.516' || m === 'intro:0.56')
				for (const s of await randStreifen(path))
					fail(vp, tag, `einfarbiger #0A0A0A-Streifen am Rand ${s}`);
		}
	}
	if (report(h.log, vp.name)) bad.push(`${vp.name}: Konsole/Netz`);
	console.log(
		`${vp.name}: Intro ${maße.intro.toFixed(2)} Hö., Tiefe-Fahrt ${(maße.tiefe - 1).toFixed(2)} Hö., ${marks.length} Marken, ${nProb} Funde in Text/Rand`,
	);
	await h.ctx.close();
}
await browser.close();
const f = join(a.out, 'check.txt');
(await import('node:fs')).writeFileSync(f, bad.join('\n'));
for (const b of bad.slice(0, 80)) console.log('FAIL', b);
console.log(bad.length ? `GESAMT: ${bad.length} Verstöße (Liste: ${f})` : 'GESAMT: alles grün');
process.exit(bad.length ? 1 : 0);
