// Fehlersuche: Touch-Wisch am Körper-Abschnitt (768x1024@2t) ohne Wirkung?
import { args, launch, open, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const b = await launch();
const vp = vpOf(a.vp ?? '768x1024@2t');
const h = await open(b, { vp, url: a.url });
await toMark(h, 'so-gehts:0.5');
for (let i = 0; i < 12; i++) {
	const sy = await h.page.evaluate(() => scrollY);
	const k = await h.page.evaluate(() => window.__landing.dbg.koerper?.());
	await h.cdp.send('Input.synthesizeScrollGesture', {
		x: 10,
		y: vp.h * 0.7,
		yDistance: -200,
		speed: 900,
		gestureSourceType: 'touch',
		preventFling: true,
	});
	await sleep(400);
	const sy2 = await h.page.evaluate(() => scrollY);
	console.log(
		i,
		sy,
		'->',
		sy2,
		k ? `ring ${k.ring} idle ${k.idle.toFixed(1)} grab ${k.grab}` : '-',
	);
}
await b.close();
