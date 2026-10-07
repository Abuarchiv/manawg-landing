// S-3 Planet (PLAN-V2, Paket SZENEN, F-05): Klick/Tipp auf Marker und Beschriftung, Ortsliste per Tastatur,
// senkrechter Wisch scrollt, waagerechtes Ziehen dreht, Labels lesbar, Trägheit gedeckelt.
//   node tools/qa/szenen/planet.mjs --url http://localhost:3125/ --vp 1440x900@1 --out <dir>   (Maus)
//   node tools/qa/szenen/planet.mjs --vp 390x844@3t --out <dir>                                (Touch)
import { args, launch, open, report, sharp, shot, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const vp = vpOf(a.vp ?? '1440x900@1');
const browser = await launch();
let bad = 0;
const ok = (c, msg) => {
	if (!c) bad++;
	console.log(`${c ? 'OK  ' : 'FAIL'} ${msg}`);
};
const h = await open(browser, { vp, url: a.url });
const { page } = h;
await toMark(h, 'bereiche:0.02', { mx: vp.w - 3, my: vp.h - 3 });
await sleep(500);
const hits = () => page.evaluate(() => window.__landing.dbg.planetHits());
const yaw = () => page.evaluate(() => window.__landing.dbg.planet());
const selIdx = async () => {
	const t = await page.locator('[data-karte] .label').first().textContent();
	return Number(t.slice(0, 2)) - 1;
};
const visible = (r) => r.mx > 2 && r.mx < vp.w - 2 && r.my > 70 && r.my < vp.h - 2;
const tap = async (x, y) => {
	if (vp.touch) await page.touchscreen.tap(x, y);
	else await page.mouse.click(x, y);
	await sleep(250);
};
// Marker: mehrere Orte nacheinander. Beschriftung: am äußeren Ende der Platte.
let nM = 0;
let nL = 0;
let tM = 0;
let tL = 0;
for (let round = 0; round < 6; round++) {
	const cur = await selIdx();
	const hs = (await hits()).filter((r) => r.front && r.i !== cur && visible(r));
	if (!hs.length) {
		await sleep(2500);
		continue;
	}
	const r = hs[round % hs.length];
	// Marker
	tM++;
	await tap(r.mx, r.my);
	if ((await selIdx()) === r.i) nM++;
	else console.log(`     Marker ${r.i + 1}: nicht gewählt (Karte ${(await selIdx()) + 1})`);
	// Beschriftung eines anderen Orts (aktuelle Treffer)
	const cur2 = await selIdx();
	const h2 = (await hits()).filter((q) => q.front && q.i !== cur2 && q.plate && visible(q));
	if (!h2.length) continue;
	const q = h2[round % h2.length];
	const pl = q.plate;
	const lx = q.mx < pl.x + pl.w / 2 ? pl.x + pl.w - 5 : pl.x + 5; // Ende der Platte, weg vom Marker
	tL++;
	await tap(lx, pl.y + pl.h / 2);
	if ((await selIdx()) === q.i) nL++;
	else
		console.log(
			`     Beschriftung ${q.i + 1}: nicht gewählt (Karte ${(await selIdx()) + 1}) bei ${lx.toFixed(0)},${(pl.y + pl.h / 2).toFixed(0)}`,
		);
}
ok(tM > 0 && nM === tM, `${vp.touch ? 'Tipp' : 'Klick'} auf Marker wählt den Ort: ${nM} von ${tM}`);
ok(
	tL > 0 && nL === tL,
	`${vp.touch ? 'Tipp' : 'Klick'} auf Beschriftung wählt den Ort: ${nL} von ${tL}`,
);
// Trefferflächen >= 44 x 44
const hs = await hits();
const klein = hs.filter((r) => r.w < 43.5 || r.h < 43.5);
ok(
	klein.length === 0,
	`Trefferflächen alle >= 44 x 44 CSS-px (${hs.length} Orte, kleinste ${Math.min(...hs.map((r) => Math.min(r.w, r.h))).toFixed(1)})`,
);
// Labels vorderer Orte: Kontrast Text gegen Hintergrund (95. gegen 50. Perzentil der Helligkeit in der Platte)
await sleep(300);
const buf = await page.screenshot();
const lin = (v) => {
	const c = v / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const dpr = vp.dpr;
let minRatio = 99;
let nLab = 0;
for (const r of hs.filter((q) => q.front && q.plate && visible(q))) {
	const p = r.plate;
	const x = Math.max(0, Math.round(p.x * dpr));
	const y = Math.max(0, Math.round(p.y * dpr));
	const w = Math.min(Math.round(p.w * dpr), vp.w * dpr - x);
	const hh = Math.min(Math.round(p.h * dpr), vp.h * dpr - y);
	if (w < 4 || hh < 4) continue;
	const { data } = await sharp(buf)
		.extract({ left: x, top: y, width: w, height: hh })
		.greyscale()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const v = [...data].sort((m, n) => m - n);
	const lt = lin(v[Math.floor(v.length * 0.97)]);
	const lb = lin(v[Math.floor(v.length * 0.5)]);
	minRatio = Math.min(minRatio, (lt + 0.05) / (lb + 0.05));
	nLab++;
}
ok(
	nLab > 0 && minRatio >= 4.5,
	`Labels der vorderen Orte: kleinster Kontrast ${minRatio.toFixed(1)}:1 über ${nLab} Labels (Grenze 4,5:1)`,
);
await shot(h, `planet-${vp.name}`, { out: a.out });
// Wisch und Ziehen
const c = await page.evaluate(() => {
	const r = document.getElementById('bereiche').querySelector('canvas').getBoundingClientRect();
	return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
if (vp.touch) {
	const sy0 = await page.evaluate(() => scrollY);
	await h.cdp.send('Input.synthesizeScrollGesture', {
		x: c.x,
		y: c.y + 100,
		yDistance: -200,
		speed: 900,
		gestureSourceType: 'touch',
		preventFling: true,
	});
	await sleep(500);
	const sy1 = await page.evaluate(() => scrollY);
	ok(
		sy1 - sy0 > 100,
		`Senkrechter Wisch über dem Planeten scrollt die Seite um ${(sy1 - sy0).toFixed(0)} px`,
	);
	await toMark(h, 'bereiche:0.02', { mx: vp.w - 3, my: vp.h - 3 });
	await sleep(500);
	const c2 = await page.evaluate(() => {
		const r = document.getElementById('bereiche').querySelector('canvas').getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.top + r.height * 0.45 };
	});
	const y0 = await yaw();
	const sx0 = await page.evaluate(() => scrollY);
	await h.cdp.send('Input.synthesizeScrollGesture', {
		x: c2.x + 60,
		y: c2.y,
		xDistance: -140,
		speed: 500,
		gestureSourceType: 'touch',
		preventFling: true,
	});
	await sleep(300);
	const y1 = await yaw();
	const sx1 = await page.evaluate(() => scrollY);
	ok(
		Math.abs(y1 - y0) > 0.3 && Math.abs(sx1 - sx0) < 3,
		`Waagerechtes Ziehen dreht den Planeten (${(y1 - y0).toFixed(2)} rad), scrollY unverändert (${sx1 - sx0})`,
	);
} else {
	const sy0 = await page.evaluate(() => scrollY);
	await page.mouse.move(c.x, c.y);
	await page.mouse.wheel(0, 200);
	await sleep(500);
	const sy1 = await page.evaluate(() => scrollY);
	ok(sy1 - sy0 > 100, `Rad über dem Planeten scrollt die Seite um ${(sy1 - sy0).toFixed(0)} px`);
	await toMark(h, 'bereiche:0.02', { mx: vp.w - 3, my: vp.h - 3 });
	await sleep(500);
	const y0 = await yaw();
	await page.mouse.move(c.x - 80, c.y + 40);
	await page.mouse.down();
	for (let i = 1; i <= 10; i++) {
		await page.mouse.move(c.x - 80 + i * 16, c.y + 40);
		await sleep(16);
	}
	await page.mouse.up();
	const y1 = await yaw();
	ok(
		Math.abs(y1 - y0) > 0.4,
		`Waagerechtes Ziehen dreht den Planeten (${(y1 - y0).toFixed(2)} rad)`,
	);
	// Trägheit: schneller Schlenker, danach höchstens 0,03 rad je 60-Hz-Schritt (1,8 rad/s) plus Eigendrehung
	await page.mouse.move(c.x - 150, c.y + 40);
	await page.mouse.down();
	await page.mouse.move(c.x + 250, c.y + 40, { steps: 2 });
	await page.mouse.up();
	await sleep(80);
	const v = await page.evaluate(
		() =>
			new Promise((res) => {
				const d = [];
				let last = window.__landing.dbg.planet();
				let t0 = performance.now();
				const f = () => {
					// Rate über 100-ms-Fenster (bei 120 Hz zeichnet nur jedes zweite Bild einen Schritt)
					const n = performance.now();
					if (n - t0 >= 100) {
						const y = window.__landing.dbg.planet();
						d.push(Math.abs(y - last) / ((n - t0) / 1000));
						last = y;
						t0 = n;
					}
					if (d.length < 6) requestAnimationFrame(f);
					else res(Math.max(...d));
				};
				requestAnimationFrame(f);
			}),
	);
	ok(
		v <= 0.03 * 60 + 0.15 + 0.15,
		`Trägheit nach schnellem Schlenker höchstens ${v.toFixed(2)} rad/s (Deckel 0,03 je Schritt = 1,8 rad/s)`,
	);
}
// Ortsliste per Tastatur
const list = page.locator('nav[aria-label="Orte der WG"]');
const start = await selIdx();
await list.locator('button[aria-pressed="true"]').focus();
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
const nach = await selIdx();
ok(
	nach === (start + 3) % 8,
	`Ortsliste: Pfeil rechts x3 wählt Ort ${((start + 3) % 8) + 1} (Karte ${nach + 1})`,
);
await page.keyboard.press('ArrowLeft');
await page.keyboard.press('Enter');
ok(
	(await selIdx()) === (start + 2) % 8,
	`Ortsliste: Pfeil links und Enter wählt Ort ${((start + 2) % 8) + 1} (Karte ${(await selIdx()) + 1})`,
);
const sicht = await list.evaluate((e) => ({
	w: e.getBoundingClientRect().width,
	h: e.getBoundingClientRect().height,
}));
ok(
	sicht.w > 100,
	`Ortsliste ist bei Fokus sichtbar (${sicht.w.toFixed(0)} x ${sicht.h.toFixed(0)})`,
);
await shot(h, `planet-liste-${vp.name}`, { out: a.out });
bad += report(h.log, `Planet ${vp.name}`);
await h.ctx.close();
await browser.close();
console.log(bad ? `GESAMT: ${bad} Verstöße` : 'GESAMT: alles grün');
process.exit(bad ? 1 : 0);
