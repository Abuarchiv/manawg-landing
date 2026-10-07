// H-4: Leistung der Ende-Szene. fps (rAF-Abstände), Hauptthread je Bild (Performance.TaskDuration),
// hand.draw (JS) und GPU-Zeit je Ebene (EXT_disjoint_timer_query_webgl2, falls verfügbar).
//
//   node tools/qa/hand/perf.mjs --url http://localhost:3123/ --vp 1920x1080@2 [--throttle 4] [--secs 6] [--move 1]
import { args, launch, open, renderer, sleep, toMark, vpOf } from '../lib.mjs';

const o = args();
const vp = vpOf(o.vp ?? '1920x1080@2');
const secs = +(o.secs ?? 6);
const browser = await launch();
const h = await open(browser, {
	vp,
	url: o.url,
	init: () => {
		window.__qaGpu = true;
	},
});
const { page, cdp } = h;
console.log(vp.name, await renderer(page), 'Last', o.throttle ?? 1, 'x');
await toMark(h, o.mark ?? 'intro:1');
await sleep(800);
await page.evaluate(() => {
	window.__landing.dbg.gpuT = true;
});
if (o.throttle && +o.throttle > 1)
	await cdp.send('Emulation.setCPUThrottlingRate', { rate: +o.throttle });
await cdp.send('Performance.enable');
await page.evaluate((secs) => {
	window.__ft = [];
	let last = performance.now();
	const t0 = last;
	const f = (n) => {
		window.__ft.push(n - last);
		last = n;
		if (n - t0 < secs * 1000) requestAnimationFrame(f);
	};
	requestAnimationFrame(f);
}, secs);
const m0 = await cdp.send('Performance.getMetrics');
const task = (m) => m.metrics.find((x) => x.name === 'TaskDuration').value;
const t0 = task(m0);
if (o.move && !vp.touch) {
	// Zeiger kreist über die Fläche, damit jedes Bild neu gezeichnet wird
	const end = Date.now() + secs * 1000;
	let a = 0;
	while (Date.now() < end) {
		a += 0.08;
		await page.mouse.move(
			vp.w * (0.7 + 0.15 * Math.cos(a)),
			vp.h * (0.5 + 0.2 * Math.sin(a * 1.3)),
		);
		await sleep(16);
	}
} else await sleep(secs * 1000 + 200);
const m1 = await cdp.send('Performance.getMetrics');
const ft = await page.evaluate(() => window.__ft.slice(2));
const info = await page.evaluate(() => {
	const d = window.__landing.dbg.hand();
	const gpu = (d.gpu ?? []).map((a) => {
		const s = [...a].sort((x, y) => x - y);
		return s.length
			? { n: s.length, med: s[s.length >> 1], p95: s[Math.floor(s.length * 0.95)] }
			: null;
	});
	return { mode: d.mode, ms: d.ms, gpu };
});
const sorted = [...ft].sort((a, b) => a - b);
const mean = ft.reduce((a, b) => a + b, 0) / ft.length;
const frames = ft.length;
const mainMs = ((task(m1) - t0) * 1000) / frames;
console.log(
	`Bilder ${frames}, ${(1000 / mean).toFixed(1)} fps (Median ${(1000 / sorted[sorted.length >> 1]).toFixed(1)}), p95-Bilddauer ${sorted[Math.floor(sorted.length * 0.95)].toFixed(1)} ms, längstes ${sorted.at(-1).toFixed(1)} ms`,
);
console.log(
	`Hauptthread je Bild ${mainMs.toFixed(2)} ms (alle Aufgaben), hand.draw ${info.ms?.toFixed(2)} ms, Modus ${info.mode}`,
);
console.log('GPU je Ebene', JSON.stringify(info.gpu));
console.log('err', h.log.err.length, 'warn', h.log.warn.length, 'fail', h.log.fail.length);
await browser.close();
