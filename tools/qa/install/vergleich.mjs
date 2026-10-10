// Gegenüberstellung mit den Referenzen (Abnahme I-10): oben die Referenz, unten die Szene zur entsprechenden Zeit.
// iPhone: tools/qa/install/ref/ios-flow-real.webm. Android: Standbilder and-new-01..03 und and-06..08.
// node tools/qa/install/vergleich.mjs --url http://localhost:3122/ --out <dir>
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { args, launch, open, sheet, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
mkdirSync(a.out, { recursive: true });
const ref = join(import.meta.dirname, 'ref');

// iPhone: Zeit im Referenzclip (s) -> Zeit in der Schleife (s); Tippzeiten Referenz 0,44 2,50 5,26 7,35 11,67, hier 1,3 2,9 4,5 6,1 8,1
const PAARE = [
	[0.2, 0.2, 'Ruhe, Banner'],
	[1.0, 1.65, '≡: Menü wächst'],
	[1.6, 2.2, 'Menü in Ruhe'],
	[3.0, 3.4, 'Teilen: Share-Sheet'],
	[5.9, 4.85, 'Mehr anzeigen'],
	[7.9, 6.5, 'Zum Home-Bildschirm'],
	[9.5, 7.6, 'Dialog in Ruhe'],
	[12.0, 8.45, 'Hinzufügen: Übergang'],
	[13.5, 9.5, 'Home mit Icon'],
	[18.5, 10.6, 'Icon: Zoom'],
];
const browser = await launch();
const h = await open(browser, { vp: vpOf('1440x900@2'), url: a.url ?? 'http://localhost:3122/' });
await toMark(h, 'installieren:0.05');
await sleep(600);
await h.page.getByRole('tab').nth(0).click();
await sleep(900);
await h.page.evaluate(() => window.__landing.dbg.install.halte(true));
const frame = h.page.locator('[data-ins="frame"]');
const oben = [];
const unten = [];
const labels = [];
for (const [tr, ts, text] of PAARE) {
	const f = join(a.out, `ref-${tr}.png`);
	execFileSync('ffmpeg', [
		'-y',
		'-loglevel',
		'error',
		'-ss',
		String(tr),
		'-i',
		join(ref, 'ios-flow-real.webm'),
		'-frames:v',
		'1',
		f,
	]);
	oben.push(f);
	await h.page.evaluate((t) => window.__landing.dbg.install.setze(t), ts);
	await sleep(160);
	const g = join(a.out, `ours-${ts}.png`);
	await frame.screenshot({ path: g });
	unten.push(g);
	labels.push(`${text} (Ref ${tr}s / hier ${ts}s)`);
}
await sheet(
	[...oben, ...unten],
	[...labels.map((l) => `REF ${l}`), ...labels.map((l) => `HIER ${l}`)],
	join(a.out, 'vergleich-iphone.jpg'),
	PAARE.length,
	250,
);
await browser.close();
console.log('fertig');
