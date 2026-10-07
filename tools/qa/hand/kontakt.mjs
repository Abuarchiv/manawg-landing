// H-6: Kontaktbögen der Ende-Szene. Je Viewport die Marken intro:0.93, 0.97, 1 und intro-aus:0.3,
// dazu intro:1 mit Zeiger über dem Handy (Maus) bzw. Tipp (Touch). Prüft nebenbei, dass Titel und Knopf
// ganz im Bild liegen und das Handy ganz sichtbar ist.
//
//   node tools/qa/hand/kontakt.mjs --url http://localhost:3123/ --out <dir> [--vp a,b]
import { args, launch, open, sheet, shot, sleep, toMark, vpList } from '../lib.mjs';

const o = args();
const vps = vpList(
	o.vp ?? '390x844@3t,360x740@3t,768x1024@2t,844x390@3t,1920x1080@1,1440x900@2,2560x1440@1',
);
const browser = await launch();
for (const vp of vps) {
	const h = await open(browser, { vp, url: o.url });
	if (!vp.touch) await h.page.mouse.move(2, 2);
	const files = [];
	const labels = [];
	const marks = ['intro:0.93', 'intro:0.97', 'intro:1', 'intro-aus:0.3'];
	for (const m of marks) {
		await toMark(h, m);
		await sleep(700);
		files.push(await shot(h, `${vp.name}-${m.replace(':', '_')}`, { out: o.out }));
		labels.push(m);
		if (m === 'intro:1') {
			const geo = await h.page.evaluate(() => {
				const r = (el) => el.getBoundingClientRect();
				const t = r(document.querySelector('[data-ende] h2'));
				const c = r(document.querySelector('[data-ende] a[data-quiet]'));
				const p = r(document.querySelector('[data-ende-space] [data-cta]'));
				const W = innerWidth;
				const H = innerHeight;
				const inV = (b) =>
					b.left >= -0.5 && b.top >= -0.5 && b.right <= W + 0.5 && b.bottom <= H + 0.5;
				const hit = (a, b) =>
					a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
				return {
					titel: inV(t),
					cta: inV(c),
					handy: inV(p),
					titelHandy: hit(t, p),
					ctaHandy: hit(c, p),
					scroll: document.documentElement.scrollWidth === document.documentElement.clientWidth,
				};
			});
			console.log(vp.name, JSON.stringify(geo));
			if (vp.touch) await h.page.touchscreen.tap(vp.w * 0.5, vp.h * 0.6);
			else await h.page.mouse.move(vp.w * 0.6, vp.h * 0.5, { steps: 5 });
			await sleep(900);
			files.push(await shot(h, `${vp.name}-zeiger`, { out: o.out }));
			labels.push('Zeiger/Tipp');
		}
	}
	await sheet(
		files,
		labels,
		`${o.out}/sheet-${vp.name}.jpg`,
		vp.w > vp.h ? 2 : 5,
		vp.w > vp.h ? 760 : 360,
	);
	console.log(
		`  ${o.out}/sheet-${vp.name}.jpg`,
		'err',
		h.log.err.length,
		'warn',
		h.log.warn.length,
		'fail',
		h.log.fail.length,
	);
	await h.ctx.close();
}
await browser.close();
