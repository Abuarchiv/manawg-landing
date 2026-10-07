// Abnahme der Installations-Szene: Texte (I-2), Icon (I-4), leere und halb überblendete Bilder (I-5), Bedienung (I-6),
// Lesbarkeit (I-7). node tools/qa/install/abnahme.mjs --url http://localhost:3122/ --out <dir>
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { args, launch, open, report, sharp, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const url = a.url ?? 'http://localhost:3122/';
mkdirSync(a.out, { recursive: true });
const repo = resolve(import.meta.dirname, '../../..');
const res = {};
let fehler = 0;
const pruef = (name, ok, info = '') => {
	console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${info}`);
	if (!ok) fehler++;
};

const browser = await launch();
const h = await open(browser, { vp: vpOf('1440x900@2'), url });
await toMark(h, 'installieren:0.05');
await sleep(600);
const page = h.page;

// ---------- I-2: Beschriftungen wörtlich ----------
const ERWARTET = {
	0: [
		'app.manawg.com',
		'Teilen',
		'Zu Lesezeichen hinzufügen',
		'Lesezeichen hinzufügen zu …',
		'Auf der Seite suchen',
		'Seitenzoom',
		'Deine WG-App',
		'Optionen',
		'News',
		'Erinnerungen',
		'Safari',
		'Mehr',
		'Kopieren',
		'Zur Leseliste hinzufügen',
		'Mehr anzeigen',
		'Weniger anzeigen',
		'Als Favoriten sichern',
		'Zum Home-Bildschirm',
		'Zum Home-Bildsc…',
		'Hinzufügen',
		'ManaWG',
		'https://app.manawg.com/',
		'Als Web-App öffnen',
		'Für schnellen Zugriff auf diese Website wird auf deinem Home-Bildschirm ein Symbol hinzugefügt.',
	],
	1: [
		'app.manawg.com',
		'Neuer Tab',
		'Neuer Inkognitotab',
		'Tab zu neuer Gruppe hinzufügen',
		'Verlauf',
		'Browserdaten löschen',
		'Website-Einstellungen',
		'Downloads',
		'Lesezeichen',
		'Zuletzt geöffnete Tabs',
		'Teilen…',
		'Auf Seite suchen',
		'Lesemodus anzeigen',
		'Installieren und Verknüpfung erstellen',
		'Installieren',
		'Verknüpfung erstellen',
		'Verknüpfungen werden in Chrome geöffnet',
		'App installieren',
		'ManaWG',
		'Abbrechen',
		'„ManaWG“ wird installiert…',
		'App wurde installiert',
	],
	2: [
		'ManaWG',
		'app.manawg.com',
		'Installieren',
		'ManaWG installieren',
		'App installieren',
		'Abbrechen',
	],
};
const ALT = ['Kopieren ⌘C', 'App installieren?', 'Neuer Tab ', '100 %'];
const SCHRITTE = {
	0: [
		'≡ antippen, dann „Teilen“',
		'„Mehr anzeigen“, dann „Zum Home-Bildschirm“',
		'„Hinzufügen“ antippen. Fertig.',
	],
	1: [
		'Menü ⋮ antippen.',
		'„Installieren und Verknüpfung erstellen“, dann „Installieren“',
		'Im Dialog „Installieren“ bestätigen. Fertig.',
	],
	2: [
		'Symbol „Installieren“ rechts in der Adressleiste klicken.',
		'Im Dialog „App installieren“ auf „Installieren“ klicken.',
		'ManaWG öffnet als eigenes Fenster.',
	],
};
const WURZEL = ['ios', 'and', 'dk'];
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const texte = {};
for (const tab of [0, 1, 2]) {
	await page.getByRole('tab').nth(tab).click();
	await sleep(500);
	const txt = norm(
		await page.evaluate((k) => document.querySelector(`[data-k="${k}"]`).textContent, WURZEL[tab]),
	);
	const fehlt = ERWARTET[tab].filter((e) => !txt.includes(norm(e)));
	pruef(
		`I-2 Gerät ${tab}: ${ERWARTET[tab].length} Beschriftungen wörtlich`,
		fehlt.length === 0,
		fehlt.join(' | '),
	);
	const alt = ALT.filter((e) => txt.includes(e));
	pruef(`I-2 Gerät ${tab}: keine alten erfundenen Texte`, alt.length === 0, alt.join(' | '));
	const steps = await page.evaluate(() =>
		[...document.querySelectorAll('[data-istep] > span:last-child')].map((e) => e.textContent),
	);
	pruef(
		`I-2 Schritte Tab ${tab} wörtlich`,
		JSON.stringify(steps) === JSON.stringify(SCHRITTE[tab]),
		JSON.stringify(steps),
	);
	texte[tab] = txt;
}
await page.getByRole('tab').nth(2).click();
const edge = await page.evaluate(() => document.querySelector('#ins-panel p')?.textContent);
pruef(
	'I-2 Label-Zeile Rechner',
	edge ===
		'Edge: „App verfügbar“ → „Installieren“ · Safari (Mac): Ablage → „Zum Dock hinzufügen …“ → „Hinzufügen“',
	edge,
);
res.texte = texte;

// ---------- I-4: Icon md5, Name, Adresse ----------
const md5 = (b) => createHash('md5').update(b).digest('hex');
const ref = {
	'/apple-touch-icon.png': md5(
		readFileSync(join(repo, 'design/app-ref/brand/apple-touch-icon.png')),
	),
	'/icon-512.png': md5(readFileSync(join(repo, 'design/app-ref/brand/icon-512.png'))),
};
const srcs = await page.evaluate(() =>
	[...document.querySelectorAll('[data-ins="screen"] img')]
		.map((i) => new URL(i.src).pathname)
		.filter((p) => /icon/.test(p)),
);
const einzig = [...new Set(srcs)];
for (const p of einzig) {
	const b = Buffer.from(await (await fetch(new URL(p, url))).arrayBuffer());
	pruef(
		`I-4 ${p} md5-gleich mit App-Icon`,
		md5(b) === ref[p],
		`${md5(b)} (${srcs.filter((s) => s === p).length} Stellen)`,
	);
}
pruef(
	'I-4 nur App-Icons im Gerät',
	einzig.every((p) => ref[p]),
	einzig.join(','),
);

// ---------- I-5: leere und halb überblendete Bilder alle 100 ms ----------
const SYSTEM = {
	// echte Systemübergänge (Fenster oder Karten, die über oder in andere Ebenen gleiten), Zeitfenster in s
	0: [
		[8.1, 8.6, 'Hinzufügen: Seite zieht ins Dock, Home entblurrt'],
		[10.35, 11.5, 'App-Start: Karte wächst, schwarzes Startbild, Überblendung'],
	],
	1: [
		[9.1, 9.7, 'Chrome schrumpft ins Home'],
		[11.0, 12.3, 'App-Start: Karte wächst, Splash, Überblendung'],
	],
	2: [[4.1, 4.6, 'Tab wandert in das App-Fenster']],
};
const LAYER = [
	['ios-stack', 'ios-home', 'ios-launch', 'ios-app'],
	['and-stack', 'and-home', 'and-launch', 'and-app'],
	['dk-fenster', 'dk-app'],
];
const screen = page.locator('[data-ins="screen"]');
const i5 = {};
for (const tab of [0, 1, 2]) {
	await page.getByRole('tab').nth(tab).click();
	await sleep(900);
	const pl = await page.evaluate((i) => window.__landing.dbg.install.plan(i), tab);
	await page.evaluate(() => window.__landing.dbg.install.halte(true));
	const zeilen = [];
	let maxLeer = 0;
	let leerBilder = 0;
	let halb = 0;
	let halbAusserhalb = 0;
	for (let t = 0; t < pl.loop; t += 0.1) {
		await page.evaluate((t) => window.__landing.dbg.install.setze(t), t);
		await sleep(130);
		const buf = await screen.screenshot({ scale: 'css' });
		const { data, info } = await sharp(buf).resize(160).raw().toBuffer({ resolveWithObject: true });
		// „leer“: Anteil der Pixel in der häufigsten Farbe (quantisiert)
		const cnt = new Map();
		for (let i = 0; i < data.length; i += info.channels) {
			const k = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
			cnt.set(k, (cnt.get(k) ?? 0) + 1);
		}
		const n = info.width * info.height;
		let top = 0;
		let topK = 0;
		for (const [k, v] of cnt) if (v > top) [top, topK] = [v, k];
		// „leer“ = fast die ganze Fläche in einem dunklen Ton (Rahmenfarbe, Platzhalter). Eine helle Seite mit
		// Weißraum ist definierter Inhalt und zählt nicht.
		const dunkel = topK >> 8 < 4 && ((topK >> 4) & 15) < 4 && (topK & 15) < 4;
		const leer = dunkel ? top / n : 0;
		maxLeer = Math.max(maxLeer, leer);
		const sicht = await page.evaluate((ids) => {
			return ids
				.map((k) => {
					const el = document.querySelector(`[data-k="${k}"]`);
					const cs = getComputedStyle(el);
					return { k, o: cs.display === 'none' ? 0 : +cs.opacity };
				})
				.filter((x) => x.o > 0.02);
		}, LAYER[tab]);
		const gemischt = sicht.length >= 2 && sicht.some((x) => x.o < 0.97);
		const system = SYSTEM[tab].find(([a, b]) => t >= a - 0.001 && t <= b);
		if (leer > 0.85) {
			leerBilder++;
			zeilen.push(
				`t=${t.toFixed(1)} leer ${(leer * 100).toFixed(0)} %${system ? ` (${system[2]})` : ''}`,
			);
		}
		if (gemischt) {
			halb++;
			if (!system) halbAusserhalb++;
			zeilen.push(
				`t=${t.toFixed(1)} Ebenen ${sicht.map((x) => `${x.k}:${x.o.toFixed(2)}`).join(' ')}${system ? ` (${system[2]})` : ' AUSSERHALB'}`,
			);
		}
	}
	await page.evaluate(() => window.__landing.dbg.install.halte(false));
	i5[tab] = {
		maxLeerAnteilPct: +(maxLeer * 100).toFixed(0),
		leerBilder,
		halbBilder: halb,
		halbAusserhalbSystemuebergang: halbAusserhalb,
		zeilen,
	};
	console.log(
		`I-5 Tab ${tab}: größter Flächenanteil einer Farbe ${(maxLeer * 100).toFixed(0)} %, Bilder > 85 % einfarbig ${leerBilder}, halb überblendet ${halb} (davon außerhalb von Systemübergängen ${halbAusserhalb})`,
	);
	for (const z of zeilen) console.log(`     ${z}`);
	pruef(
		`I-5 Tab ${tab} keine Halbüberblendung außerhalb von Systemübergängen`,
		halbAusserhalb === 0,
	);
}
res.i5 = i5;

// ---------- I-6: Bedienung ----------
await page.getByRole('tab').nth(0).click();
await sleep(300);
await page.getByRole('tab').nth(0).focus();
await page.keyboard.press('ArrowRight');
await sleep(150);
let sel = await page.evaluate(() =>
	[...document.querySelectorAll('[role=tab]')].map((e) => e.getAttribute('aria-selected')),
);
pruef('I-6 Pfeil rechts wählt Android', sel.join() === 'false,true,false', sel.join());
await page.keyboard.press('End');
sel = await page.evaluate(() =>
	[...document.querySelectorAll('[role=tab]')].map((e) => e.getAttribute('aria-selected')),
);
pruef('I-6 Ende wählt Rechner', sel.join() === 'false,false,true', sel.join());
await page.keyboard.press('ArrowRight');
sel = await page.evaluate(() =>
	[...document.querySelectorAll('[role=tab]')].map((e) => e.getAttribute('aria-selected')),
);
pruef('I-6 Pfeil rechts am Ende umlaufend', sel.join() === 'true,false,false', sel.join());
await page.keyboard.press('Tab');
const fokus = await page.evaluate(() => document.activeElement?.getAttribute('data-istep'));
pruef('I-6 Tab springt aus der Tablist in die Schrittliste', fokus === '0', String(fokus));
await page.keyboard.press('Enter');
const stufe = await page.evaluate(() => ({
	uhr: window.__landing.dbg.install.uhr(),
	aktiv: document.querySelector('[data-aktiv]')?.getAttribute('data-istep'),
}));
pruef(
	'I-6 Enter auf Schritt 1 springt an dessen Anfang',
	stufe.aktiv === '0' && stufe.uhr < 0.3,
	JSON.stringify(stufe),
);
await page.locator('[data-istep="2"]').click();
await sleep(200);
const s2 = await page.evaluate(() => ({
	uhr: window.__landing.dbg.install.uhr(),
	aktiv: document.querySelector('[data-aktiv]')?.getAttribute('data-istep'),
	cur: document.querySelector('[aria-current=step]')?.getAttribute('data-istep'),
}));
const sp = await page.evaluate(() => window.__landing.dbg.install.plan(0).sprung[2]);
pruef(
	'I-6 Klick auf Schritt 3 springt an dessen Anfang',
	s2.aktiv === '2' && s2.cur === '2' && Math.abs(s2.uhr - sp) < 0.6,
	JSON.stringify({ ...s2, sprung: sp }),
);

// reduce: Standbild, keine Pixeländerung
const ctx2 = await browser.newContext({
	viewport: { width: 1440, height: 900 },
	deviceScaleFactor: 1,
	reducedMotion: 'reduce',
});
const p2 = await ctx2.newPage();
await p2.goto(`${url}?qa=1`);
await p2.waitForFunction(() => window.__landing?.bereit, null, { timeout: 15000 }).catch(() => {});
await sleep(1500);
const y = await p2.evaluate(() => Math.round(window.__landing.section('installieren').top));
await p2.evaluate((y) => scrollTo(0, y + 40), y);
await sleep(1200);
const fr2 = p2.locator('[data-ins="frame"]');
const ba = await fr2.screenshot();
await sleep(500);
const bb = await fr2.screenshot();
const diff = async (x, y) => {
	const A = await sharp(x).raw().toBuffer({ resolveWithObject: true });
	const B = await sharp(y).raw().toBuffer();
	let n = 0;
	for (let i = 0; i < A.data.length; i += A.info.channels)
		if (
			Math.abs(A.data[i] - B[i]) +
				Math.abs(A.data[i + 1] - B[i + 1]) +
				Math.abs(A.data[i + 2] - B[i + 2]) >
			24
		)
			n++;
	return n / (A.info.width * A.info.height);
};
const d500 = await diff(ba, bb);
pruef('I-6 reduce: < 0,3 % Pixeländerung in 500 ms', d500 < 0.003, `${(d500 * 100).toFixed(3)} %`);
const stills = [];
for (let i = 0; i < 3; i++) {
	await p2.locator(`[data-istep="${i}"]`).click();
	await sleep(250);
	const f = join(a.out, `reduce-iphone-${i + 1}.png`);
	writeFileSync(f, await fr2.screenshot());
	stills.push(f);
}
const verschieden =
	(await diff(readFileSync(stills[0]), readFileSync(stills[1]))) > 0.05 &&
	(await diff(readFileSync(stills[1]), readFileSync(stills[2]))) > 0.05;
pruef('I-6 reduce: je Schritt ein anderes Standbild', verschieden);
await ctx2.close();

// ---------- I-7: Lesbarkeit ----------
await page.getByRole('tab').nth(0).click();
await sleep(300);
const kontrast = await page.evaluate(() => {
	const lum = (c) => {
		const f = (v) => {
			const x = v / 255;
			return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
		};
		return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
	};
	const inakt = [...document.querySelectorAll('[data-istep]:not([data-aktiv])')];
	const el = inakt[0];
	const o = +getComputedStyle(el).opacity;
	const fg = [250, 250, 250];
	const bg = [10, 10, 10];
	const m = fg.map((v, i) => v * o + bg[i] * (1 - o));
	const L1 = lum(m);
	const L2 = lum(bg);
	return { opacity: o, ratio: (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05) };
});
pruef(
	'I-7 inaktive Schritte ≥ 4,5:1 (Deckkraft nach Übergang)',
	kontrast.ratio >= 4.5,
	JSON.stringify(kontrast),
);
res.kontrast = kontrast;

writeFileSync(join(a.out, 'abnahme.json'), JSON.stringify(res, null, 1));
report(h.log);
await browser.close();
console.log(fehler ? `${fehler} Prüfung(en) fehlgeschlagen` : 'alle Prüfungen bestanden');
process.exit(fehler ? 1 : 0);
