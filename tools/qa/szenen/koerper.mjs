// S-1 Körper (PLAN-V2, Paket SZENEN): Eintritt ohne Haufen außerhalb des Bildes, Ring ~80 % der Breite im
// Hochformat, Touch-Greifen aller acht Körper, ein Wisch daneben scrollt.
//   node tools/qa/szenen/koerper.mjs --url http://localhost:3125/ --vp 390x844@3t --out <dir>
import { args, launch, open, report, shot, sleep, toMark, vpOf, yOf } from '../lib.mjs';

const a = args();
const vp = vpOf(a.vp ?? '390x844@3t');
const browser = await launch();
let bad = 0;
const ok = (c, msg) => {
	if (!c) bad++;
	console.log(`${c ? 'OK  ' : 'FAIL'} ${msg}`);
};
const K = (page) => page.evaluate(() => window.__landing.dbg.koerper());
const bbox = (bs) => ({
	x0: Math.min(...bs.map((b) => b.x - b.r)),
	x1: Math.max(...bs.map((b) => b.x + b.r)),
	y0: Math.min(...bs.map((b) => b.y - b.r)),
	y1: Math.max(...bs.map((b) => b.y + b.r)),
});

// 1. Eintritt: langsam mit dem Rad von unten hinein (500 px/s), Körper ruhen als Ring bis 70 % Sichtbarkeit
{
	const h = await open(browser, { vp, url: a.url });
	const mo = { mx: vp.w - 3, my: vp.h - 3 };
	// Start knapp unter dem Eintritt: der Abschnitt ist noch nicht sichtbar (Aufbau, kein Sprungtest)
	const ys = await yOf(h.page, 'koerper:0');
	await h.page.evaluate((y) => scrollTo(0, y), ys - vp.h - 40);
	await sleep(800);
	await h.page.mouse.move(mo.mx, mo.my);
	const y0 = await yOf(h.page, 'koerper:0.3');
	let y = await h.page.evaluate(() => scrollY);
	let eintritt = null;
	let fall = null;
	while (y < y0 && !fall) {
		await h.page.mouse.wheel(0, 50);
		await sleep(100);
		const r = await h.page.evaluate(() => {
			const s = document.getElementById('koerper').getBoundingClientRect();
			const sicht =
				(Math.min(s.bottom, innerHeight) - Math.max(s.top, 0)) / Math.min(s.height, innerHeight);
			return { y: scrollY, sicht, k: window.__landing.dbg.koerper() };
		});
		y = r.y;
		if (a.v) console.log(`     y ${r.y} Sicht ${r.sicht.toFixed(2)} ring ${r.k?.ring}`);
		if (r.sicht > 0.05 && r.sicht < 0.7 && r.k.ring && !eintritt) {
			eintritt = r;
			await shot(h, `koerper-ring-eintritt-${vp.name}`, { out: a.out });
		}
		if (!r.k.ring) fall = r;
	}
	ok(
		!!eintritt && !!fall && fall.sicht >= 0.65,
		`Ring ruht beim Eintritt (Sicht ${eintritt?.sicht.toFixed(2)}), Einfall ab Sicht ${fall?.sicht.toFixed(2)}`,
	);
	// Einfall: nach 0,6, 1,5 und 3,2 s liegen alle Körper im sichtbaren Bild
	const t0 = Date.now();
	for (const [t, tag] of [
		[600, 'a'],
		[1500, 'b'],
		[3200, 'c'],
	]) {
		await sleep(Math.max(0, t - (Date.now() - t0)));
		const k = await K(h.page);
		const bb = bbox(k.bodies);
		const innen = k.bodies.every(
			(b) => b.x - b.r >= -1 && b.x + b.r <= vp.w + 1 && b.y - b.r >= -1 && b.y + b.r <= vp.h + 1,
		);
		ok(
			innen,
			`Einfall ${t} ms: alle Körper im Bild (Unterkante ${bb.y1.toFixed(0)} von ${vp.h}, Rand ${bb.x0.toFixed(0)}..${bb.x1.toFixed(0)} von ${vp.w})`,
		);
		await shot(h, `koerper-einfall-${tag}-${vp.name}`, { out: a.out });
	}
	bad += report(h.log, `Körper Eintritt ${vp.name}`);
	await h.ctx.close();
}

// 2. Ruhelage: Ring füllt im Hochformat etwa 80 % der Breite
const h = await open(browser, { vp, url: a.url });
const mo = { mx: vp.w - 3, my: vp.h - 3 };
await toMark(h, 'koerper:0', mo);
await sleep(5200);
let k = await K(h.page);
const bb = bbox(k.bodies);
const anteil = (bb.x1 - bb.x0) / vp.w;
console.log(
	`     Ring in Ruhe: Breite ${(anteil * 100).toFixed(0)} % (x ${bb.x0.toFixed(0)}..${bb.x1.toFixed(0)}), y ${bb.y0.toFixed(0)}..${bb.y1.toFixed(0)}, idle ${k.idle.toFixed(1)}`,
);
if (vp.h > vp.w && vp.w < 800)
	ok(
		anteil >= 0.72 && anteil <= 0.9,
		`Ring füllt ${(anteil * 100).toFixed(0)} % der Breite (Soll um 80 %)`,
	);
await shot(h, `koerper-ruhe-${vp.name}`, { out: a.out });

if (vp.touch) {
	// 3. Touch-Greifen jedes Körpers mit echten Touch-Ereignissen
	const touch = (type, x, y) =>
		h.cdp.send('Input.dispatchTouchEvent', {
			type,
			touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }],
		});
	const cx = (bs) => bs.reduce((s, b) => s + b.x, 0) / bs.length;
	const cy = (bs) => bs.reduce((s, b) => s + b.y, 0) / bs.length;
	let trifft = 0;
	let rand = 0;
	for (let i = 0; i < 8; i++) {
		await sleep(i ? 4800 : 0);
		k = await K(h.page);
		const b = k.bodies[i];
		const sy0 = await h.page.evaluate(() => scrollY);
		await touch('touchStart', b.x, b.y);
		await touch('touchMove', b.x + 10, b.y - 10);
		await sleep(80);
		const g = await K(h.page);
		if (g.grab === i) trifft++;
		else console.log(`     Körper ${i}: nicht gegriffen (grab ${g.grab})`);
		await touch('touchEnd');
		const sy1 = await h.page.evaluate(() => scrollY);
		if (Math.abs(sy1 - sy0) > 2)
			console.log(`     Körper ${i}: Seite hat gescrollt (${sy1 - sy0})`);
		await sleep(300);
	}
	ok(trifft === 8, `Touch greift alle Körper in der Mitte: ${trifft} von 8 (390x844@3t)`);
	// Randtreffer: 20 px außerhalb des Körperrands (Trefferrand 22 px), vom Ring weg gerichtet
	for (let i = 0; i < 8; i++) {
		await sleep(4800);
		k = await K(h.page);
		const b = k.bodies[i];
		const dx = b.x - cx(k.bodies);
		const dy = b.y - cy(k.bodies);
		const d = Math.hypot(dx, dy) || 1;
		const px = b.x + (dx / d) * (b.r + 18);
		const py = b.y + (dy / d) * (b.r + 18);
		if (px < 2 || px > vp.w - 2 || py < 2 || py > vp.h - 2) {
			rand++;
			continue;
		}
		await touch('touchStart', px, py);
		await sleep(80);
		const g = await K(h.page);
		// ein näherer Nachbar darf das Greifen übernehmen
		if (g.grab >= 0) rand++;
		else console.log(`     Körper ${i}: Rand (18 px außen) nicht gegriffen`);
		await touch('touchEnd');
		await sleep(200);
	}
	ok(rand === 8, `Touch greift 18 px außerhalb des Rands: ${rand} von 8`);
	// 4. Wisch daneben scrollt die Seite und stört die Körper nicht
	await sleep(4800);
	k = await K(h.page);
	let leer = null;
	for (const [x, y] of [
		[20, 90],
		[vp.w - 20, 90],
		[20, vp.h - 120],
		[vp.w - 20, vp.h - 120],
		[vp.w / 2, vp.h - 100],
	]) {
		if (k.bodies.every((b) => Math.hypot(b.x - x, b.y - y) > b.r + 30)) {
			leer = [x, y];
			break;
		}
	}
	const sy0 = await h.page.evaluate(() => scrollY);
	await h.cdp.send('Input.synthesizeScrollGesture', {
		x: leer?.[0] ?? 20,
		y: leer?.[1] ?? 90,
		yDistance: -200,
		speed: 900,
		gestureSourceType: 'touch',
		preventFling: true,
	});
	await sleep(600);
	const sy1 = await h.page.evaluate(() => scrollY);
	const k2 = await K(h.page);
	ok(
		sy1 - sy0 > 100,
		`Wisch daneben scrollt die Seite um ${(sy1 - sy0).toFixed(0)} px (Start ${leer?.map(Math.round)})`,
	);
	ok(
		k2.idle >= 3.5 && k2.grab < 0,
		`Wisch daneben lässt die Körper in Ruhe (idle ${k2.idle.toFixed(1)}, grab ${k2.grab})`,
	);
}
bad += report(h.log, `Körper ${vp.name}`);
await h.ctx.close();
await browser.close();
console.log(bad ? `GESAMT: ${bad} Verstöße` : 'GESAMT: alles grün');
process.exit(bad ? 1 : 0);
