// SH-4 und SH-9: Lader. Zeiten (ab Navigationsbeginn, ms): Start (erste Sichtung), Schriften, Bereitschaft,
// Ende (Deckkraft 0). Dazu Zurück, Neuladen, erneuter Besuch, ohne WebGL und reduzierte Bewegung.
//   node tools/qa/shell/lader.mjs --url http://localhost:3115/
import { args, launch, sleep, wheelTo, yOf } from '../lib.mjs';

const a = args();
const base = a.url.replace(/\/$/, '');
const INIT = () => {
	const T = { start: null, fonts: null, bereit: null, aus: null, ziffer: null, max: 0 };
	window.__lt = T;
	document.fonts.ready.then(() => {
		T.fonts = performance.now();
	});
	document.addEventListener('landing:bereit', () => {
		T.bereit = performance.now();
	});
	const poll = () => {
		const l = document.querySelector('[data-loader]');
		if (l) {
			const o = Number(getComputedStyle(l).opacity);
			if (T.start === null && o > 0) T.start = performance.now();
			if (T.start !== null && T.aus === null && o === 0) T.aus = performance.now();
			const c = l.querySelector('[data-count]');
			if (c) T.max = Math.max(T.max, Number.parseFloat(getComputedStyle(c).fontSize));
			T.ziffer = c?.textContent;
		}
		if (T.aus === null) setTimeout(poll, 4);
	};
	document.addEventListener('DOMContentLoaded', poll);
	poll();
};
const fmt = (n) => (n == null ? '-' : Math.round(n));
let bad = 0;
const check = (ok, text) => {
	console.log(`${ok ? 'OK  ' : 'FAIL'} ${text}`);
	if (!ok) bad++;
};
async function lauf(browser, o, label) {
	const ctx = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		reducedMotion: o.reduce ? 'reduce' : undefined,
	});
	await ctx.addInitScript(INIT);
	const page = await ctx.newPage();
	const log = [];
	page.on('pageerror', (e) => log.push(e.message));
	page.on('console', (m) => ['error', 'warning'].includes(m.type()) && log.push(m.text()));
	await page.goto(`${base}/?qa=1`, { waitUntil: 'load' });
	await page
		.waitForFunction(() => window.__lt?.aus !== null, null, { timeout: 12000 })
		.catch(() => {});
	await sleep(300);
	const T = await page.evaluate(() => window.__lt);
	return { ctx, page, T, log, label };
}

// 1) normal
let b = await launch();
const n = await lauf(b, {}, 'normal');
// frühestes Ende = max(Bereitschaft, Start + 0,8 s): die Mindestdauer geht vor, wenn die Bereitschaft früher kommt
const bereitReal = Math.max(n.T.bereit ?? 0, n.T.fonts ?? 0, n.T.start + 800);
console.log(
	`normal: start ${fmt(n.T.start)} fonts ${fmt(n.T.fonts)} bereit ${fmt(n.T.bereit)} aus ${fmt(n.T.aus)} Ziffer max ${n.T.max}px`,
);
check(
	n.T.aus - n.T.start >= 800 - 20,
	`normal: Ende ${fmt(n.T.aus - n.T.start)} ms nach Start (>= 800)`,
);
check(
	n.T.aus - bereitReal <= 300,
	`normal: Ende ${fmt(n.T.aus - bereitReal)} ms nach max(Bereitschaft ${fmt(Math.max(n.T.bereit, n.T.fonts))}, Start+800) (<= 300)`,
);
check(n.T.max <= 140, `Ziffer ${n.T.max}px (<= 140)`);

// 2) Zurück von /impressum an derselben Stelle, kein Lader; Neuladen ebenso
{
	const page = n.page;
	await page.waitForFunction(() => window.__landing?.bereit, null, { timeout: 8000 });
	const ziel = await yOf(page, 'intro:0.5');
	await wheelTo(page, ziel);
	const y0 = await page.evaluate(() => scrollY);
	const H0 = await page.evaluate(() => document.documentElement.scrollHeight);
	await page.goto(`${base}/impressum`, { waitUntil: 'load' });
	await page.goBack({ waitUntil: 'load' });
	const probe = await page.evaluate(() => {
		const l = document.querySelector('[data-loader]');
		return {
			op: l ? getComputedStyle(l).opacity : 'weg',
			vis: l ? getComputedStyle(l).visibility : '-',
		};
	});
	await sleep(1200);
	const y1 = await page.evaluate(() => scrollY);
	check(probe.op === '0', `Zurück: Lader sofort weg (Deckkraft ${probe.op})`);
	check(
		Math.abs(y1 - y0) / H0 <= 0.01,
		`Zurück: Stelle ${y0} -> ${y1} (${((Math.abs(y1 - y0) / H0) * 100).toFixed(2)} % der Seite)`,
	);
	await page.reload({ waitUntil: 'load' });
	const probe2 = await page.evaluate(
		() => getComputedStyle(document.querySelector('[data-loader]')).opacity,
	);
	await sleep(1200);
	const y2 = await page.evaluate(() => scrollY);
	check(probe2 === '0', `Neuladen: Lader sofort weg (Deckkraft ${probe2})`);
	check(Math.abs(y2 - y0) / H0 <= 0.01, `Neuladen: Stelle ${y0} -> ${y2}`);
	// erneuter Besuch in derselben Sitzung (neuer Navigationseintrag)
	await page.goto(`${base}/?qa=1`, { waitUntil: 'load' });
	const probe3 = await page.evaluate(
		() => getComputedStyle(document.querySelector('[data-loader]')).opacity,
	);
	check(probe3 === '0', `Erneuter Besuch (Sitzung): Lader sofort weg (Deckkraft ${probe3})`);
	check(n.log.length === 0, `Konsole normal: ${n.log.length} Meldungen ${n.log.slice(0, 2)}`);
}
await n.ctx.close();
await b.close();

// 3) ohne WebGL
b = await launch({ gl: false });
const g = await lauf(b, {}, 'nogl');
console.log(`ohne WebGL: start ${fmt(g.T.start)} bereit ${fmt(g.T.bereit)} aus ${fmt(g.T.aus)}`);
check(
	g.T.aus !== null && g.T.aus <= 4300,
	`ohne WebGL: Lader nach ${fmt(g.T.aus)} ms weg (<= 4000 + Ausblendung)`,
);
check(g.log.length === 0, `Konsole ohne WebGL: ${g.log.length} Meldungen ${g.log.slice(0, 2)}`);
await g.ctx.close();
await b.close();

// 4) reduzierte Bewegung
b = await launch();
const r = await lauf(b, { reduce: true }, 'reduce');
const rop = await r.page.evaluate(
	() => getComputedStyle(document.querySelector('[data-loader]')).opacity,
);
check(
	rop === '0' && (r.T.start === null || r.T.aus - r.T.start < 100),
	`reduce: Lader sofort weg (Deckkraft ${rop}, sichtbar ${fmt(r.T.aus - r.T.start)} ms)`,
);
await r.ctx.close();
await b.close();
process.exit(bad ? 1 : 0);
