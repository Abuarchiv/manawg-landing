// Ende-Szene fotografieren (Paket HAND): je Viewport zur Marke scrollen, Zeiger an Stellen setzen, Bild ablegen.
//
//   node tools/qa/hand/shoot.mjs --url http://localhost:3123/ --vp 1440x900@2,390x844@3t --mark intro:0.97 \
//        --at rest,phone,title --out <dir>
//
// --at: Liste aus rest (Zeiger aus), phone (Handymitte), cta, title, leer (leere Fläche links oben) oder
// feste Brüche "0.3/0.6" (x/y in Fenstergröße). Touch-Viewports tippen statt zu bewegen.
import { args, launch, open, renderer, shot, sleep, toMark, vpList } from '../lib.mjs';

const o = args();
const vps = vpList(o.vp ?? '1440x900@2');
const mark = o.mark ?? 'intro:0.97';
const ats = String(o.at ?? 'rest').split(',');
const browser = await launch({ gl: o.nogl ? false : undefined });
for (const vp of vps) {
	const h = await open(browser, { vp, url: o.url, reducedMotion: o.reduce ? 'reduce' : undefined });
	if (!h.vp.touch) await h.page.mouse.move(2, 2);
	console.log(vp.name, await renderer(h.page));
	await toMark(h, mark);
	await sleep(900);
	for (const at of ats) {
		if (at === 'rest') {
			if (!vp.touch) await h.page.mouse.move(-5, -5).catch(() => {});
			await h.page.evaluate(() => document.dispatchEvent(new MouseEvent('mouseleave')));
		} else {
			const pos = await h.page.evaluate((at) => {
				const r = (el) => el.getBoundingClientRect();
				const sp = document.querySelector('[data-ende-space]');
				const sc = r(sp).width / 1280;
				const ox = r(sp).left;
				const oy = r(sp).top;
				if (at === 'phone') return [ox + 800 * sc, oy + 400 * sc];
				if (at === 'finger') return [ox + 820 * sc, oy + 330 * sc];
				if (at === 'cta') {
					const b = r(document.querySelector('a[data-cta]'));
					return [b.left + b.width / 2, b.top + b.height / 2];
				}
				if (at === 'title') {
					const b = r(document.querySelector('[data-ende] h2'));
					return [b.left + b.width / 2, b.top + b.height / 2];
				}
				if (at === 'leer') return [innerWidth * 0.12, innerHeight * 0.12];
				const [a, b] = at.split('/').map(Number);
				return [innerWidth * a, innerHeight * b];
			}, at);
			if (vp.touch) {
				await h.page.touchscreen.tap(pos[0], pos[1]);
			} else {
				await h.page.mouse.move(pos[0] - 30, pos[1] - 30);
				await h.page.mouse.move(pos[0], pos[1], { steps: 6 });
			}
		}
		await sleep(1100);
		console.log(
			`  ${vp.name}-${at}`,
			await shot(h, `${vp.name}-${at}`.replace(/[:/]/g, '_'), { out: o.out }),
		);
	}
	console.log(
		'  err',
		h.log.err.length,
		'warn',
		h.log.warn.length,
		'fail',
		h.log.fail.length,
		h.log.err.slice(0, 3),
	);
	await h.ctx.close();
}
await browser.close();
