// S-6 reduce: ohne Zeiger an koerper:0.3, funktionen:0.5, bereiche:0.3 weniger als 0,3 % Pixeländerung je 500 ms,
// Körper ohne Einfall (Ring), Planet ohne Eigendrehung.
//   node tools/qa/szenen/reduce.mjs --url http://localhost:3125/ --vp 1440x900@1 --out <dir>
import { args, launch, open, report, sharp, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const vp = vpOf(a.vp ?? '1440x900@1');
const browser = await launch();
let bad = 0;
const ok = (c, msg) => {
	if (!c) bad++;
	console.log(`${c ? 'OK  ' : 'FAIL'} ${msg}`);
};
const h = await open(browser, { vp, url: a.url, reducedMotion: 'reduce' });
const mo = { mx: vp.w - 3, my: vp.h - 3 };
// Nur die Fläche der Szene (ohne Kopf und fremde Abschnitte darunter) vergleichen
let sel = '#koerper';
const grey = async () => {
	const r = await h.page.evaluate((sel) => {
		const b = document.querySelector(sel).getBoundingClientRect();
		const y0 = Math.max(80, b.top);
		const y1 = Math.min(innerHeight, b.bottom);
		return { x: 0, y: y0, width: innerWidth, height: Math.max(8, y1 - y0) };
	}, sel);
	return sharp(await h.page.screenshot({ clip: r }))
		.greyscale()
		.raw()
		.toBuffer();
};
for (const [m, s] of [
	['koerper:0.3', '#koerper'],
	['funktionen:0.5', '#funktionen'],
	['bereiche:0.1', '#bereiche'],
]) {
	sel = s;
	await toMark(h, m, mo);
	await h.page.mouse.move(vp.w - 2, vp.h - 2);
	await sleep(1500);
	let prev = await grey();
	let max = 0;
	for (let i = 0; i < 4; i++) {
		await sleep(500);
		const cur = await grey();
		let n = 0;
		for (let k = 0; k < cur.length; k++) if (Math.abs(cur[k] - prev[k]) > 24) n++;
		max = Math.max(max, (n / cur.length) * 100);
		prev = cur;
	}
	ok(max < 0.3, `reduce ${m}: größte Pixeländerung ${max.toFixed(3)} % je 500 ms (Grenze 0,3 %)`);
}
await toMark(h, 'koerper:0.3', mo);
await sleep(1500);
const k = await h.page.evaluate(() => window.__landing.dbg.koerper());
ok(
	k.ring && k.idle > 50,
	`reduce Körper: kein Einfall, Ring in Ruhe (ring ${k.ring}, idle ${k.idle.toFixed(0)})`,
);
await toMark(h, 'bereiche:0.3', mo);
const y0 = await h.page.evaluate(() => window.__landing.dbg.planet());
await sleep(2000);
const y1 = await h.page.evaluate(() => window.__landing.dbg.planet());
ok(
	Math.abs(y1 - y0) < 0.001,
	`reduce Planet: keine Eigendrehung (${(y1 - y0).toFixed(4)} rad in 2 s)`,
);
bad += report(h.log, `reduce ${vp.name}`);
await h.ctx.close();
await browser.close();
console.log(bad ? `GESAMT: ${bad} Verstöße` : 'GESAMT: alles grün');
process.exit(bad ? 1 : 0);
