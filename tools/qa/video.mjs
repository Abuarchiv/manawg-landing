// Video des ganzen Durchlaufs (Rad, 1440x900), danach alle 2 s ein Bild zum Ansehen.
//   node tools/qa/video.mjs --url http://localhost:3120/ --out <dir> [--vp 1440x900@1] [--speed 1100]
// Schreibt <out>/lauf.webm und <out>/frames/NNN.png (Bild alle 2 s), Kontaktbogen <out>/video-sheet-N.jpg (ffmpeg nötig).
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { GPU_ARGS, args, chromium, sheet, sleep, vpOf } from './lib.mjs';

const a = args();
const vp = vpOf(a.vp ?? '1440x900@1');
const browser = await chromium.launch({ headless: true, args: GPU_ARGS });
const ctx = await browser.newContext({
	viewport: { width: vp.w, height: vp.h },
	deviceScaleFactor: 1,
	recordVideo: { dir: a.out, size: { width: vp.w, height: vp.h } },
});
const page = await ctx.newPage();
const err = [];
page.on('pageerror', (e) => err.push(e.message));
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && err.push(m.text()));
await page.goto(`${a.url}${a.url.includes('?') ? '&' : '?'}qa=1`);
await page
	.waitForFunction(() => window.__landing?.bereit, null, { timeout: 15000 })
	.catch(() => {});
await sleep(2500);
await page.mouse.move(vp.w / 2, vp.h / 2);
const speed = Number(a.speed ?? 1100); // px/s
const step = 55;
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
let y = 0;
while (y < max - 2) {
	await page.mouse.wheel(0, step);
	await sleep((step / speed) * 1000);
	y = await page.evaluate(() => scrollY);
}
await sleep(1500);
const vid = page.video();
await ctx.close();
const path = await vid.path();
await browser.close();
console.log('Video', path, 'Konsole:', JSON.stringify(err.slice(0, 5)));
const dir = join(a.out, 'frames');
mkdirSync(dir, { recursive: true });
execFileSync('ffmpeg', [
	'-y',
	'-loglevel',
	'error',
	'-i',
	path,
	'-vf',
	'fps=0.5',
	join(dir, '%03d.png'),
]);
const files = readdirSync(dir)
	.filter((f) => f.endsWith('.png'))
	.sort();
console.log(files.length, 'Bilder');
for (let i = 0; i < files.length; i += 12)
	await sheet(
		files.slice(i, i + 12).map((f) => join(dir, f)),
		files.slice(i, i + 12).map((f) => `${(Number.parseInt(f, 10) - 1) * 2} s`),
		join(a.out, `video-sheet-${i / 12}.jpg`),
		4,
		480,
	);
