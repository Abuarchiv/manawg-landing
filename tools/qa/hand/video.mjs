// H-8: Video der Ende-Szene (5 s Zeigerbewegung über Handy, Titel, leere Fläche und Knopf) und Einzelbilder.
//   node tools/qa/hand/video.mjs --url http://localhost:3123/ --vp 1440x900@1 --out <dir>
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { GPU_ARGS, args, chromium, sleep, toMark, vpOf } from '../lib.mjs';

const o = args();
const vp = vpOf(o.vp ?? '1440x900@1');
mkdirSync(o.out, { recursive: true });
const browser = await chromium.launch({ headless: true, args: GPU_ARGS });
const ctx = await browser.newContext({
	viewport: { width: vp.w, height: vp.h },
	deviceScaleFactor: vp.dpr,
	recordVideo: { dir: `${o.out}/rec`, size: { width: vp.w, height: vp.h } },
});
const page = await ctx.newPage();
await page.goto(`${o.url}?qa=1`, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__landing?.bereit, null, { timeout: 15000 });
await sleep(1500);
const h = { page, vp, cdp: null };
await toMark(h, 'intro:1');
await sleep(800);
const pos = await page.evaluate(() => {
	const r = (el) => el.getBoundingClientRect();
	const sp = r(document.querySelector('[data-ende-space]'));
	const sc = sp.width / 1280;
	const t = r(document.querySelector('[data-ende] h2'));
	const c = r(document.querySelector('[data-ende] a[data-quiet]'));
	return {
		phone: [sp.left + 800 * sc, sp.top + 330 * sc],
		phone2: [sp.left + 790 * sc, sp.top + 560 * sc],
		title: [t.left + t.width / 2, t.top + t.height / 2],
		leer: [innerWidth * 0.3, innerHeight * 0.2],
		cta: [c.left + c.width / 2, c.top + c.height / 2],
	};
});
const path = ['phone', 'phone2', 'title', 'leer', 'cta', 'phone'];
for (const k of path) {
	await page.mouse.move(pos[k][0], pos[k][1], { steps: 28 });
	await sleep(250);
	if (k === 'phone2') {
		await page.mouse.down();
		await sleep(60);
		await page.mouse.up();
	}
}
await sleep(500);
await ctx.close();
await browser.close();
const f = readdirSync(`${o.out}/rec`).find((x) => x.endsWith('.webm'));
renameSync(`${o.out}/rec/${f}`, `${o.out}/ende-${vp.name}.webm`);
execFileSync('ffmpeg', [
	'-y',
	'-loglevel',
	'error',
	'-i',
	`${o.out}/ende-${vp.name}.webm`,
	'-vf',
	'fps=2,scale=720:-1',
	`${o.out}/fr-%02d.png`,
]);
console.log(`${o.out}/ende-${vp.name}.webm`);
