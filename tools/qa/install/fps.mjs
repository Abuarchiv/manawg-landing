// Leistung der Szene (Abnahme I-9): Bildrate und Rechenzeit je Bild, je Tab, optional mit CPU-Drosselung.
// node tools/qa/install/fps.mjs --url http://localhost:3122/ --vp 1920x1080@2 [--throttle 4] [--sek 12]
import { args, launch, open, report, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const vp = vpOf(a.vp ?? '1920x1080@2');
const browser = await launch();
const h = await open(browser, { vp, url: a.url ?? 'http://localhost:3122/' });
await toMark(h, 'installieren:0.05');
await sleep(800);
if (a.throttle) await h.cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(a.throttle) });
const sek = Number(a.sek ?? 12);
let fehler = 0;
for (const tab of [0, 1, 2]) {
	await h.page.getByRole('tab').nth(tab).click({ force: true });
	await sleep(1200);
	await h.page.evaluate(() => window.__landing.dbg.install.zeitNull());
	const r = await h.page.evaluate(async (sek) => {
		const d = [];
		let last = performance.now();
		const end = last + sek * 1000;
		await new Promise((res) => {
			const f = (now) => {
				d.push(now - last);
				last = now;
				if (now < end) requestAnimationFrame(f);
				else res();
			};
			requestAnimationFrame(f);
		});
		d.shift();
		d.sort((x, y) => x - y);
		const sum = d.reduce((s, v) => s + v, 0);
		return {
			fps: (d.length / sum) * 1000,
			p95: d[Math.floor(d.length * 0.95)],
			max: d[d.length - 1],
			lang: d.filter((v) => v > 50).length,
			zeit: window.__landing.dbg.install.zeit(),
		};
	}, sek);
	const min = vp.touch ? 30 : 55;
	const ok = r.fps >= min && r.zeit.mittel <= 2;
	if (!ok) fehler++;
	console.log(
		`${ok ? 'OK  ' : 'FAIL'} ${vp.name}${a.throttle ? ` ${a.throttle}x CPU` : ''} tab ${tab}: ${r.fps.toFixed(1)} fps, p95 ${r.p95.toFixed(1)} ms, max ${r.max.toFixed(1)} ms, Bilder > 50 ms: ${r.lang}, JS je Bild Ø ${r.zeit.mittel.toFixed(3)} ms (max ${r.zeit.max.toFixed(2)} ms)`,
	);
}
report(h.log);
await browser.close();
process.exit(fehler ? 1 : 0);
