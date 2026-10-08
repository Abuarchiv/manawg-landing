// Zeitmessung der Installationsabläufe (Abnahme I-3): Uhr anhalten, im 30-fps-Raster setzen, Geometrie und Stile lesen.
// node tools/qa/install/messen.mjs --url http://localhost:3122/ --out <dir>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { args, launch, open, report, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
mkdirSync(a.out, { recursive: true });
const browser = await launch();
const h = await open(browser, { vp: vpOf('1440x900@2'), url: a.url ?? 'http://localhost:3122/' });
await toMark(h, 'installieren:0.05');
await sleep(600);

/** Werte im 30-fps-Raster lesen. fn läuft im Seitenkontext, gibt ein Objekt je Zeit zurück. */
async function reihe(tab, t0, t1, fn, fps = 30) {
	await h.page.getByRole('tab').nth(tab).click();
	await sleep(900);
	await h.page.evaluate(() => window.__landing.dbg.install.halte(true));
	const r = await h.page.evaluate(
		async ({ t0, t1, fps, src }) => {
			const f = new Function(`return ${src}`)();
			const out = [];
			const frames = () =>
				new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			for (let i = 0; t0 + i / fps <= t1; i++) {
				const t = t0 + i / fps;
				window.__landing.dbg.install.setze(t);
				await frames();
				out.push({ t, ...f(t) });
			}
			return out;
		},
		{ t0, t1, fps, src: fn.toString() },
	);
	await h.page.evaluate(() => window.__landing.dbg.install.halte(false));
	return r;
}

const ergebnis = {};

// ---- iOS Seitenmenü: obere Kante gegen Feder ----
const ios = await reihe(
	0,
	1.2,
	2.3,
	() => {
		const sc = document.querySelector('[data-ins="screen"]').getBoundingClientRect();
		const m = document.querySelector('[data-k="ios-menu"]');
		const r = m.getBoundingClientRect();
		const z = sc.width / 278; // Rahmenskalierung (Seite)
		return {
			vis: getComputedStyle(m).display !== 'none',
			edge: (r.top - sc.top) / z / (278 / 390) + 2.53,
		};
	},
	60,
);
{
	// Anpassung: edge(t) = 786 - 496 * x(t - t0), x = Feder(ζ, ωn)
	const pts = ios.filter((p) => p.vis && p.t < 2.0);
	const X = (tau, z, wn) => {
		if (tau <= 0) return 0;
		const wd = wn * Math.sqrt(1 - z * z);
		return (
			1 - Math.exp(-z * wn * tau) * (Math.cos(wd * tau) + ((z * wn) / wd) * Math.sin(wd * tau))
		);
	};
	let best = { e: 1e18 };
	for (let z = 0.4; z <= 0.85; z += 0.01)
		for (let wn = 10; wn <= 24; wn += 0.1)
			for (let t0 = 1.2; t0 <= 1.5; t0 += 0.005) {
				let e = 0;
				for (const p of pts) e += (p.edge - (786 - 496 * X(p.t - t0, z, wn))) ** 2;
				if (e < best.e) best = { e, z, wn, t0 };
			}
	const min = Math.min(...pts.map((p) => p.edge));
	const rest = pts[pts.length - 1].edge;
	const erste = pts[0];
	ergebnis.ios_menue = {
		zeta: +best.z.toFixed(3),
		wn: +best.wn.toFixed(2),
		t0: +best.t0.toFixed(3),
		rms_pt: +Math.sqrt(best.e / pts.length).toFixed(2),
		ueberschwinger_pct: +(((rest - min) / (786 - rest)) * 100).toFixed(1),
		peak_edge: +min.toFixed(1),
		ruhe_edge: +rest.toFixed(1),
		erste_sichtbare_zeit: +erste.t.toFixed(3),
	};
}

// ---- iOS „Mehr anzeigen“: Kante 438 -> 48 ----
const mehr = await reihe(
	0,
	4.3,
	5.4,
	() => {
		const sc = document.querySelector('[data-ins="screen"]').getBoundingClientRect();
		const m = document.querySelector('[data-k="ios-share"]').getBoundingClientRect();
		return { top: (m.top - sc.top) / (sc.width / 278) / (278 / 390) + 2.53 };
	},
	60,
);
{
	const top0 = mehr[0].top;
	const start = mehr.find((p) => p.top < top0 - 1)?.t;
	const ende = mehr.find((p) => p.top < 49)?.t;
	ergebnis.ios_mehr_anzeigen = {
		start: +start.toFixed(3),
		ende: +ende.toFixed(3),
		dauer_ms: Math.round((ende - start) * 1000),
		minimum_pt: +Math.min(...mehr.map((p) => p.top)).toFixed(2),
	};
}

// ---- iOS Home-Dialog: Zeit bis zur Ruhe ----
const dlg = await reihe(
	0,
	6.0,
	7.2,
	() => {
		const sc = document.querySelector('[data-ins="screen"]').getBoundingClientRect();
		const m = document.querySelector('[data-k="ios-dlg"]');
		const k = document.querySelector('[data-k="ios-kbd"]');
		const c = document.querySelector('[data-k="ios-dlg-in"]');
		const z = sc.width / 278 / (278 / 390);
		return {
			top: (m.getBoundingClientRect().top - sc.top) / z + 2.53,
			kbd:
				getComputedStyle(k).display === 'none'
					? 999
					: (k.getBoundingClientRect().top - sc.top) / z + 2.53,
			inn: +getComputedStyle(c).opacity,
		};
	},
	60,
);
{
	const t0 = 6.1;
	const ruheDlg = dlg.find((p) => p.t >= t0 && p.top > 1 && p.top <= 47.5)?.t;
	const ruheKbd = dlg.find((p) => p.kbd <= 515.5)?.t;
	const ruheInn = dlg.find((p) => p.inn >= 0.99)?.t;
	ergebnis.ios_dialog = {
		sheet_ruhe_ms: Math.round((ruheDlg - t0) * 1000),
		tastatur_ruhe_ms: Math.round((ruheKbd - t0) * 1000),
		inhalt_ruhe_ms: Math.round((ruheInn - t0) * 1000),
		gesamt_ms: Math.round((Math.max(ruheDlg, ruheKbd, ruheInn) - t0) * 1000),
	};
}

// ---- iOS Hinzufügen -> scharfer Home-Bildschirm, kein Pop ----
const hz = await reihe(
	0,
	8.0,
	8.9,
	() => {
		const hm = document.querySelector('[data-k="ios-home"]');
		const ic = document.querySelector('[data-k="ios-icon"]');
		const st = document.querySelector('[data-k="ios-stack"]');
		const cs = getComputedStyle(hm);
		const blur = /blur\(([\d.]+)px/.exec(cs.filter)?.[1];
		return {
			blur: blur ? +blur : 0,
			stack: getComputedStyle(st).display === 'none' ? 0 : +getComputedStyle(st).opacity,
			icon: getComputedStyle(ic).transform,
			iconO: +getComputedStyle(ic).opacity,
			kbd: getComputedStyle(document.querySelector('[data-k="ios-kbd"]')).display,
		};
	},
	60,
);
{
	const t0 = 8.1;
	const scharf = hz.find((p) => p.t > t0 && p.blur < 0.5 && p.stack === 0)?.t;
	ergebnis.ios_hinzufuegen = {
		bis_scharf_ms: Math.round((scharf - t0) * 1000),
		icon_transform_immer_none: hz.every((p) => p.icon === 'none'),
		icon_immer_sichtbar: hz.filter((p) => p.t >= t0).every((p) => p.iconO === 1),
	};
}

// ---- Android Menü (gestaffelt) und Dialog ----
const am = await reihe(
	1,
	1.2,
	2.1,
	() => {
		const rows = [...document.querySelectorAll('[data-k^="and-r"]')];
		const menu = document.querySelector('[data-k="and-menu"]');
		return {
			sicht: getComputedStyle(menu).display !== 'none',
			menuO: +getComputedStyle(menu).opacity,
			min: Math.min(...rows.map((r) => +getComputedStyle(r).opacity)),
		};
	},
	60,
);
{
	const t0 = 1.2;
	const start = am.find((p) => p.sicht)?.t;
	const ende = am.find((p) => p.min >= 0.99 && p.menuO >= 0.99)?.t;
	ergebnis.android_menue = {
		sichtbar_ab_ms: Math.round((start - t0) * 1000),
		alle_zeilen_ms: Math.round((ende - t0) * 1000),
	};
}
const ad = await reihe(
	1,
	4.6,
	5.1,
	() => {
		const d = document.querySelector('[data-k="and-dlg"]');
		return { sicht: getComputedStyle(d).display !== 'none', o: +getComputedStyle(d).opacity };
	},
	120,
);
{
	const s0 = ad.find((p) => p.sicht && p.o > 0)?.t;
	const s1 = ad.find((p) => p.o >= 0.99)?.t;
	ergebnis.android_dialog = { ms: Math.round((s1 - s0) * 1000) + 8 };
}

console.log(JSON.stringify(ergebnis, null, 2));
writeFileSync(
	join(a.out, 'messen.json'),
	JSON.stringify({ ergebnis, ios, mehr, dlg, hz }, null, 1),
);
report(h.log);
await browser.close();
