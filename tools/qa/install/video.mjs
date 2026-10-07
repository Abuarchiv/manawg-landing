// Video der ganzen Schleife je Tab (Abnahme I-10), danach Bilder zum Ansehen.
// node tools/qa/install/video.mjs --url http://localhost:3122/ --out <dir> [--tab 0,1,2] [--step 0.5]
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { GPU_ARGS, args, chromium, report, sheet, sleep } from '../lib.mjs';

const a = args();
mkdirSync(a.out, { recursive: true });
const names = ['iphone', 'android', 'rechner'];
const tabs = String(a.tab ?? '0,1,2')
	.split(',')
	.map(Number);
const step = Number(a.step ?? 0.5);
const browser = await chromium.launch({ headless: true, args: GPU_ARGS });
for (const tab of tabs) {
	const dir = join(a.out, `rec-${names[tab]}`);
	mkdirSync(dir, { recursive: true });
	const W = tab === 2 ? 700 : 520;
	const ctx = await browser.newContext({
		viewport: { width: W, height: 900 },
		deviceScaleFactor: 1,
		recordVideo: { dir, size: { width: W, height: 900 } },
	});
	const page = await ctx.newPage();
	const log = { err: [], warn: [], fail: [], all: [] };
	page.on('pageerror', (e) => log.err.push(e.message));
	page.on(
		'console',
		(m) => (m.type() === 'error' || m.type() === 'warning') && log.err.push(m.text()),
	);
	await page.goto(`${a.url ?? 'http://localhost:3122/'}?qa=1`);
	await page
		.waitForFunction(() => window.__landing?.bereit, null, { timeout: 15000 })
		.catch(() => {});
	await sleep(2500);
	const y = await page.evaluate(() => window.__landing.section('installieren').top);
	await page.evaluate((y) => scrollTo(0, y), y);
	await sleep(500);
	await page.getByRole('tab').nth(tab).click();
	// Gerät mittig in das Bild
	const r = await page.evaluate(() => {
		const f = document.querySelector('[data-ins="frame"]').getBoundingClientRect();
		return { x: f.left, y: f.top, w: f.width, h: f.height };
	});
	await page.evaluate((r) => scrollBy(0, r.y + r.h / 2 - innerHeight / 2), r);
	await sleep(700);
	const box = await page.evaluate(() => {
		const f = document.querySelector('[data-ins="frame"]').getBoundingClientRect();
		return {
			x: Math.round(f.left),
			y: Math.round(f.top),
			w: Math.round(f.width),
			h: Math.round(f.height),
		};
	});
	const loop = await page.evaluate((i) => window.__landing.dbg.install.plan(i).loop, tab);
	await page.evaluate(() => window.__landing.dbg.install.setze(0));
	await sleep((loop + 0.8) * 1000);
	await ctx.close();
	const file = readdirSync(dir).find((f) => f.endsWith('.webm'));
	const video = join(a.out, `${names[tab]}.webm`);
	renameSync(join(dir, file), video);
	const frames = join(a.out, `frames-${names[tab]}`);
	mkdirSync(frames, { recursive: true });
	// Bilder alle step Sekunden, auf das Gerät zugeschnitten und 2x vergrößert
	execFileSync('ffmpeg', [
		'-y',
		'-loglevel',
		'error',
		'-i',
		video,
		'-vf',
		`fps=1/${step},crop=${box.w + 20}:${box.h + 20}:${Math.max(0, box.x - 10)}:${Math.max(0, box.y - 10)},scale=iw*1.4:ih*1.4:flags=lanczos`,
		join(frames, '%03d.png'),
	]);
	const fs = readdirSync(frames)
		.filter((f) => f.endsWith('.png'))
		.sort()
		.map((f) => join(frames, f));
	await sheet(
		fs,
		fs.map((_, i) => `${names[tab]} ${(i * step).toFixed(1)} s`),
		join(a.out, `video-${names[tab]}.jpg`),
		tab === 2 ? 4 : 8,
		tab === 2 ? 440 : 230,
	);
	console.log(`${names[tab]}: ${fs.length} Bilder, ${video}`);
	report(log, names[tab]);
}
await browser.close();
