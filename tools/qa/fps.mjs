// fps je Marke, echte GPU (PLAN-V2 Abnahme 13). Optional 4x CPU-Drosselung und Long Frames.
//   node tools/qa/fps.mjs --url http://localhost:3120/ --vp 1920x1080@2 --marks intro:0,intro:0.55,koerper:0.5 --out <dir>
//   node tools/qa/fps.mjs --vp 390x844@3t --throttle 4
import { args, launch, marksOf, open, renderer, report, toMark, vpOf } from './lib.mjs';

const a = args();
const marks = a.marks
	? marksOf(a.marks)
	: [
			'intro:0',
			'intro:0.3',
			'intro:0.55',
			'intro:0.75',
			'intro:1',
			'koerper:0.5',
			'funktionen:0.5',
			'bereiche:0.3',
			'installieren:0.3',
			'finale:0.5',
		];
const meter = (page, ms) =>
	page.evaluate(
		(ms) =>
			new Promise((res) => {
				const d = [];
				let last = performance.now();
				const t0 = last;
				const f = () => {
					const n = performance.now();
					d.push(n - last);
					last = n;
					if (n - t0 < ms) requestAnimationFrame(f);
					else {
						d.shift();
						d.sort((x, y) => x - y);
						const sum = d.reduce((x, y) => x + y, 0);
						res({
							fps: +((d.length / sum) * 1000).toFixed(1),
							med: +d[d.length >> 1].toFixed(1),
							p95: +d[Math.floor(d.length * 0.95)].toFixed(1),
							max: +d[d.length - 1].toFixed(1),
							over33: d.filter((x) => x > 33).length,
							over50: d.filter((x) => x > 50).length,
						});
					}
				};
				requestAnimationFrame(f);
			}),
		ms,
	);
const browser = await launch();
const h = await open(browser, { vp: vpOf(a.vp ?? '1920x1080@2'), url: a.url });
console.log('Renderer', await renderer(h.page));
if (a.throttle) await h.cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(a.throttle) });
let bad = 0;
for (const m of marks) {
	await toMark(h, m, { settle: 900 });
	const f = await meter(h.page, 2000);
	console.log(
		`${m.padEnd(18)} fps ${String(f.fps).padStart(5)} med ${f.med} p95 ${f.p95} max ${f.max} >33ms:${f.over33} >50ms:${f.over50}`,
	);
}
bad += report(h.log);
await h.ctx.close();
await browser.close();
process.exit(bad ? 1 : 0);
