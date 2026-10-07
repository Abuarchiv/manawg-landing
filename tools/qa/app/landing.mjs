// A-5: das Handy in der Landing (Statusleiste, Schärfe, Hand folgt, Klick, Rad und Wisch, Fokus, Netz).
// Aufruf: node tools/qa/app/landing.mjs --url http://localhost:3121/ --out <dir> [--vp 1920x1080@1,1440x900@2,2560x1440@1,390x844@3t]
import { args, launch, open, report, shot, sleep, toMark, vpList } from '../lib.mjs';

const o = args();
const b = await launch();
let bad = 0;
const vps = o.vp ? vpList(o.vp) : vpList('1920x1080@1,1440x900@2,2560x1440@1,390x844@3t');
for (const vp of vps) {
	const reqs = [];
	const h = await open(b, { vp, url: o.url, settle: 500 });
	h.page.on('request', (r) => reqs.push(r.url()));
	h.page.context().on('request', (r) => reqs.push(r.url()));
	console.log(`\n== ${vp.name}`);
	// Netz: vor P 0,75 keine Anfrage an /app-demo/
	const reqs0 = [];
	h.page.on(
		'request',
		(r) => r.url().includes('/app-demo/') && reqs0.push(r.url().replace(/^.*\/app-demo/, '')),
	);
	await toMark(h, 'intro:0.7');
	console.log('Anfragen an /app-demo vor P 0,75:', reqs0.length);
	if (reqs0.length) bad++;
	await toMark(h, 'intro:0.97');
	await sleep(1500);
	console.log('Anfragen danach:', reqs0.join(' '));
	await shot(h, `${vp.name}-097`, o);
	await toMark(h, 'intro:1');
	await sleep(800);
	await shot(h, `${vp.name}-1`, o);
	// Bildschirm vermessen
	const box = await h.page.evaluate(() => {
		const f = document.querySelector('iframe[title="ManaWG-App"]');
		if (!f) return null;
		const r = f.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height };
	});
	console.log('iframe', box && JSON.stringify(box));
	if (box) {
		const cl = {
			x: Math.max(0, box.x - 20),
			y: Math.max(0, box.y - 20),
			width: Math.min(vp.w - box.x + 20, box.w + 40),
			height: Math.min(vp.h - box.y + 20, box.h + 40),
		};
		await shot(h, `${vp.name}-handy`, { out: o.out, clip: cl });
	}
	bad += report(h.log, vp.name);
	await h.ctx.close();
}
await b.close();
process.exit(bad ? 1 : 0);
