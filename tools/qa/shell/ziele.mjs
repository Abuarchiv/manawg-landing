// SH-3 und SH-8: Trefferflächen (>= 44 px Höhe) und Größen der Bedienelemente.
// Trefferhöhe = zusammenhängende Strecke senkrecht durch die Mitte, auf der elementFromPoint das Element trifft.
//   node tools/qa/shell/ziele.mjs --url http://localhost:3115/ --vp 1440x900@1,390x844@3t
import { args, launch, open, report, sleep, toMark, vpList } from '../lib.mjs';

const a = args();
const browser = await launch();
let bad = 0;
const PROBE = () => {
	const sels = {
		'Kopf-CTA': '[data-loch="cta"]',
		'Skip-Link': '.hinweis',
		'Fuß-Link': '.fuss-link',
		'FAQ-Zeile': '.faq-frage',
		CTA: '.cta:not([data-loch="cta"])',
		Tab: '.tab',
	};
	const out = [];
	for (const [name, sel] of Object.entries(sels)) {
		for (const el of document.querySelectorAll(sel)) {
			if (el.closest('[inert]')) continue;
			const cs = getComputedStyle(el);
			const r = el.getBoundingClientRect();
			if (cs.visibility === 'hidden' || r.width < 4 || r.bottom < 0 || r.top > innerHeight)
				continue;
			const cx = Math.round(r.left + Math.min(r.width / 2, 40));
			const cy = Math.round(r.top + r.height / 2);
			const hit = (y) => {
				if (y < 0 || y >= innerHeight) return false;
				const t = document.elementFromPoint(cx, y);
				return !!t && (t === el || el.contains(t));
			};
			if (!hit(cy)) continue;
			let up = 0;
			while (hit(cy - up - 1) && up < 60) up++;
			let down = 0;
			while (hit(cy + down + 1) && down < 60) down++;
			out.push({
				name,
				cls: el.className,
				text: (el.textContent ?? '').trim().slice(0, 24),
				h: Math.round(r.height * 10) / 10,
				treffer: up + down + 1,
				fs: Number.parseFloat(cs.fontSize),
			});
		}
	}
	return out;
};
const marks = ['intro:0', 'intro:1', 'installieren:0', 'fragen:0', 'finale:0.3', 'ende-der-seite'];
for (const vp of vpList(a.vp ?? '1440x900@1,390x844@3t')) {
	const h = await open(browser, { vp, url: a.url });
	const seen = new Map();
	for (const m of marks) {
		await toMark(h, m);
		await sleep(200);
		for (const e of await h.page.evaluate(PROBE)) seen.set(`${e.name}|${e.text}`, e);
	}
	// CTAs am Viewport-Rand: einzeln in die Mitte holen, damit der Rand des Fensters die Messung nicht kappt
	for (const sec of ['#installieren', '#finale']) {
		await h.page.evaluate((q) => {
			const el = document.querySelector(`${q} .cta`);
			if (el) el.scrollIntoView({ block: 'center' });
		}, sec);
		await sleep(250);
		for (const e of await h.page.evaluate(PROBE))
			if (e.name === 'CTA') seen.set(`${e.name}|${e.text}`, e);
	}
	const marke = await h.page.evaluate(() => {
		const m = document.querySelector('.faq-marke');
		return m ? Number.parseFloat(getComputedStyle(m).fontSize) : null;
	});
	let ok = true;
	for (const e of seen.values()) {
		const gut = e.treffer >= 43.5;
		ok &&= gut;
		console.log(
			`${gut ? 'OK  ' : 'FAIL'} ${vp.name} ${e.name.padEnd(9)} "${e.text}" Höhe ${e.h} Treffer ${e.treffer} Schrift ${e.fs} [${String(e.cls).slice(0, 40)}]`,
		);
	}
	const mOk = marke >= 20 && marke <= 22;
	console.log(`${mOk ? 'OK  ' : 'FAIL'} ${vp.name} FAQ-Marke ${marke} px`);
	if (!ok || !mOk) bad++;
	bad += report(h.log, vp.name);
	await h.ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
