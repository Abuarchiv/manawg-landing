// A-5: das Handy in der Landing (Statusleiste, Schärfe, Hand folgt, Klick, Rad und Wisch, Fokus, Netz).
// Aufruf: node tools/qa/app/landing.mjs --url http://localhost:3121/ --out <dir> [--vp 1920x1080@1,1440x900@2,2560x1440@1,390x844@3t]
import { args, launch, open, report, shot, sleep, toMark, vpList } from '../lib.mjs';

const o = args();
const b = await launch();
let bad = 0;
const vps = o.vp ? vpList(o.vp) : vpList('1920x1080@1,1440x900@2,2560x1440@1,390x844@3t');
const ok = (c, t) => {
	console.log(`${c ? 'ok  ' : 'FAIL'} ${t}`);
	if (!c) bad++;
};
const box = (h) =>
	h.page.evaluate(() => {
		const f = document.querySelector('iframe[title="ManaWG-App"]');
		if (!f) return null;
		const r = f.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height };
	});
const demo = (h) =>
	h.page
		.frames()
		.find((f) => f.url().includes('/app-demo/'))
		?.evaluate(() => JSON.stringify(window.__demo?.state?.()));

for (const vp of vps) {
	const h = await open(b, { vp, url: o.url, settle: 500 });
	console.log(`\n== ${vp.name}`);
	const reqs = [];
	h.page.on(
		'request',
		(r) => r.url().includes('/app-demo/') && reqs.push(r.url().replace(/^.*\/app-demo/, '')),
	);
	// Netz: vor P 0,75 keine Anfrage an /app-demo/
	await toMark(h, 'intro:0.7');
	ok(reqs.length === 0, `keine Anfrage an /app-demo vor P 0,75 (${reqs.length})`);
	// Fokus: vor intro:0.93 ist im Handy nichts fokussierbar
	const inertVor = await h.page.evaluate(
		() => document.querySelector('[data-cta][role=group]')?.inert,
	);
	ok(inertVor === true, `Handy vor intro:0.93 inert (${inertVor})`);
	await toMark(h, 'intro:0.97');
	await sleep(1800);
	ok(reqs.length > 0, `Anfragen nach P 0,75: ${reqs.join(' ')}`);
	const inertNach = await h.page.evaluate(
		() => document.querySelector('[data-cta][role=group]')?.inert,
	);
	ok(inertNach === false, `Handy bei intro:0.97 bedienbar (inert ${inertNach})`);
	await shot(h, `${vp.name}-097`, o);
	await toMark(h, 'intro:1');
	await sleep(900);
	await shot(h, `${vp.name}-1`, o);
	const bx = await box(h);
	console.log('iframe', JSON.stringify(bx));
	if (bx) {
		const cl = {
			x: Math.max(0, bx.x - 20),
			y: Math.max(0, bx.y - 20),
			width: Math.min(vp.w - Math.max(0, bx.x - 20), bx.w + 40),
			height: Math.min(vp.h - Math.max(0, bx.y - 20), bx.h + 40),
		};
		await shot(h, `${vp.name}-handy`, { out: o.out, clip: cl });
		ok((await demo(h)) === '{"w":"-","id":"/|"}', `Bildschirm zeigt Zustand 01: ${await demo(h)}`);

		// Zeiger über dem Bildschirm: die Hand folgt (5 Punkte, Bild je Punkt)
		const pts = [
			[0.2, 0.25],
			[0.8, 0.25],
			[0.5, 0.5],
			[0.2, 0.75],
			[0.8, 0.8],
		];
		if (!vp.touch) {
			let i = 0;
			for (const [fx, fy] of pts) {
				await h.page.mouse.move(bx.x + bx.w * fx, bx.y + bx.h * fy, { steps: 8 });
				await sleep(450);
				await shot(h, `${vp.name}-zeiger${i++}`, o);
			}
			// Rad über dem Handy scrollt die Seite
			const y0 = await h.page.evaluate(() => scrollY);
			await h.page.mouse.move(bx.x + bx.w / 2, bx.y + bx.h / 2);
			for (let k = 0; k < 4; k++) {
				await h.page.mouse.wheel(0, 90);
				await sleep(40);
			}
			await sleep(400);
			const y1 = await h.page.evaluate(() => scrollY);
			ok(y1 > y0 + 100, `Rad über dem Handy scrollt (${y0} -> ${y1})`);
			await toMark(h, 'intro:1');
			await sleep(600);
			// Klick auf „Haushalt“ in der Tabbar: löst die App-Aktion aus, der Klick-Ring erscheint
			const fr = h.page.frames().find((f) => f.url().includes('/app-demo/'));
			const tb = await fr
				.locator('nav a', { hasText: /^Haushalt$/ })
				.last()
				.boundingBox();
			await h.page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 6 });
			await h.page.mouse.down();
			await sleep(120);
			await shot(h, `${vp.name}-klick`, o);
			await h.page.mouse.up();
			await sleep(700);
			const st = await demo(h);
			ok(st === '{"w":"-","id":"/putzen|"}', `Klick auf Haushalt: ${st}`);
			await shot(h, `${vp.name}-nach-klick`, o);
			// Tastatur: Tab landet im Handy
			await h.page.keyboard.press('Tab');
			const inFrame = await h.page.evaluate(() => document.activeElement?.tagName);
			console.log('nach Tab im Dokument aktiv:', inFrame);
		} else {
			const y0 = await h.page.evaluate(() => scrollY);
			const sc = bx.w / 390;
			const cx = bx.x + bx.w / 2;
			const cy = bx.y + bx.h * 0.45;
			void sc;
			for (let k = 0; k < 3; k++) {
				await h.cdp.send('Input.synthesizeScrollGesture', {
					x: cx,
					y: cy,
					yDistance: -200,
					speed: 900,
					gestureSourceType: 'touch',
					preventFling: true,
				});
				await sleep(150);
			}
			await sleep(500);
			const y1 = await h.page.evaluate(() => scrollY);
			ok(y1 > y0 + 50, `Wisch über dem Handy scrollt (${y0} -> ${y1})`);
		}
	}
	bad += report(h.log, vp.name);
	await h.ctx.close();
}
await b.close();
process.exit(bad ? 1 : 0);
