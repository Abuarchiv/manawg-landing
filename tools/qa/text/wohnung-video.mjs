// Video der Wohnungsstrecke (intro:0.60 bis intro:0.90) mit Rad in kleinen Schritten, danach Bilder
// im Abstand von 0,5 s als Kontaktbogen (ffmpeg nötig). Zum Prüfen auf Geisterbilder der Raumkarten.
//   node tools/qa/text/wohnung-video.mjs --url http://localhost:3124/ --vp 1440x900@1 --out <dir>
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { GPU_ARGS, args, chromium, sheet, sleep, vpOf, yOf } from '../lib.mjs';

const a = args();
const vp = vpOf(a.vp ?? '1440x900@1');
const browser = await chromium.launch({ headless: true, args: GPU_ARGS });
const ctx = await browser.newContext({
	viewport: { width: vp.w, height: vp.h },
	deviceScaleFactor: 1,
	recordVideo: { dir: a.out, size: { width: vp.w, height: vp.h } },
});
const page = await ctx.newPage();
await page.goto(`${a.url}${a.url.includes('?') ? '&' : '?'}qa=1`, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__landing?.bereit, null, { timeout: 15000 });
await sleep(1500);
await page.mouse.move(vp.w / 2, vp.h / 2);
const y0 = await yOf(page, 'intro:0.6');
const y1 = await yOf(page, 'intro:0.9');
// grob hin, dann langsam
await page.evaluate((y) => window.scrollTo(0, y), y0 - 400);
await sleep(1200);
for (let y = y0 - 400; y < y0; y += 100) {
	await page.mouse.wheel(0, 100);
	await sleep(40);
}
const dauer = Number(a.sekunden ?? 14);
const n = Math.ceil((y1 - y0) / 60);
for (let i = 0; i < n; i++) {
	await page.mouse.wheel(0, 60);
	await sleep((dauer * 1000) / n);
}
await sleep(1000);
await page.close();
await ctx.close();
await browser.close();
const webm = readdirSync(a.out).find((f) => f.endsWith('.webm'));
renameSync(join(a.out, webm), join(a.out, 'wohnung.webm'));
const fr = join(a.out, 'frames');
mkdirSync(fr, { recursive: true });
execFileSync('ffmpeg', [
	'-y',
	'-loglevel',
	'error',
	'-i',
	join(a.out, 'wohnung.webm'),
	'-vf',
	'fps=2',
	join(fr, '%03d.png'),
]);
const files = readdirSync(fr)
	.filter((f) => f.endsWith('.png'))
	.sort()
	.map((f) => join(fr, f));
const labels = files.map((_, i) => `${(i * 0.5).toFixed(1)} s`);
for (let k = 0; k < files.length; k += 12)
	await sheet(
		files.slice(k, k + 12),
		labels.slice(k, k + 12),
		join(a.out, `video-sheet-${k / 12}.jpg`),
		4,
		480,
	);
console.log(`Video: ${join(a.out, 'wohnung.webm')}, ${files.length} Bilder`);
