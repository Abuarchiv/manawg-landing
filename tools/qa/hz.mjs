// Tempo an der Bildrate (PLAN-V2 Abnahme 10, F-06): 120 Hz (Ist) und emulierte 60 Hz (jedes zweite rAF).
//   node tools/qa/hz.mjs --url http://localhost:3120/ --out <dir>
// Misst: Planet-Eigendrehung (soll 0,150 +- 0,01 rad/s), Körper-Rückkehr (3,5 +- 0,3 s), Zeichenrate der Art-Szenen.
// Liest dafür window.__landing.dbg (nur mit ?qa=1): planet() -> yaw, koerper() -> idle.
import { HZ60, args, launch, open, report, sleep, toMark, vpOf, wheelTo, yOf } from './lib.mjs';

const a = args();
const COUNT = () => {
	window.__n = {};
	const f = CanvasRenderingContext2D.prototype.clearRect;
	const g = CanvasRenderingContext2D.prototype.fillRect;
	const note = (cv) => {
		const k = cv.dataset.art || cv.dataset.intro || cv.dataset.hand || cv.parentElement?.id || '?';
		window.__n[k] = (window.__n[k] || 0) + 1;
	};
	CanvasRenderingContext2D.prototype.clearRect = function (x, y, w, ...rest) {
		if (x === 0 && y === 0 && w >= this.canvas.width - 1) note(this.canvas);
		return f.call(this, x, y, w, ...rest);
	};
	CanvasRenderingContext2D.prototype.fillRect = function (x, y, w, h) {
		if (x <= 0 && y <= 0 && w >= this.canvas.width / 2 && h >= this.canvas.height / 2)
			note(this.canvas);
		return g.call(this, x, y, w, h);
	};
};
const browser = await launch();
let bad = 0;
const ok = (c, msg) => {
	if (!c) bad++;
	console.log(`${c ? 'OK  ' : 'FAIL'} ${msg}`);
};
for (const [label, init] of [
	['120 Hz', `(${COUNT})();`],
	['60 Hz', `(${HZ60})();(${COUNT})();`],
]) {
	const h = await open(browser, { vp: vpOf(a.vp ?? '1440x900@1'), url: a.url, init });
	// Planet
	await toMark(h, 'bereiche:0.3');
	await sleep(600);
	const y0 = await h.page.evaluate(() => window.__landing.dbg?.planet?.());
	await sleep(3000);
	const y1 = await h.page.evaluate(() => window.__landing.dbg?.planet?.());
	const rate = (y1 - y0) / 3;
	ok(
		Math.abs(rate - 0.15) <= 0.01,
		`${label}: Planet-Eigendrehung ${rate.toFixed(3)} rad/s (soll 0,150 +- 0,01)`,
	);
	// Zeichenrate
	for (const m of ['koerper:0.5', 'funktionen:0.5', 'bereiche:0.3', 'finale:0.5']) {
		await toMark(h, m);
		await h.page.evaluate(() => {
			window.__n = {};
		});
		await sleep(2000);
		const n = await h.page.evaluate(() => ({ ...window.__n }));
		console.log(
			`     ${label} ${m}: Zeichnungen/s`,
			JSON.stringify(
				Object.fromEntries(Object.entries(n).map(([k, v]) => [k, +(v / 2).toFixed(1)])),
			),
		);
	}
	// Körper-Rückkehr: Zeit vom Einfall (Abschnitt zu 70 % im Bild) bis die Körper zurückziehen (idle >= 3,5)
	await toMark(h, 'so-gehts:0.5');
	await sleep(500);
	const yk = await yOf(h.page, 'koerper:0.1');
	await h.page.evaluate(() => {
		window.__rk = new Promise((res) => {
			let t0 = null;
			let i0 = 0;
			const f = () => {
				const k = window.__landing.dbg.koerper?.();
				if (k) {
					if (t0 === null && !k.ring) {
						t0 = performance.now();
						i0 = k.idle;
					}
					if (t0 !== null && k.idle >= 3.5) return res((performance.now() - t0) / 1000 + i0);
				}
				setTimeout(f, 20);
			};
			f();
		});
	});
	await wheelTo(h.page, yk, { settle: 100 });
	const t = await Promise.race([h.page.evaluate(() => window.__rk), sleep(9000).then(() => null)]);
	ok(
		t != null && Math.abs(t - 3.5) <= 0.3,
		`${label}: Körper-Rückkehr ${t?.toFixed?.(2)} s (soll 3,5 +- 0,3)`,
	);
	bad += report(h.log, label);
	await h.ctx.close();
}
await browser.close();
console.log(bad ? `GESAMT: ${bad} Verstöße` : 'GESAMT: alles grün');
process.exit(bad ? 1 : 0);
