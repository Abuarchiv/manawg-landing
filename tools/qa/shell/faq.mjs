// SH-6: FAQ. Zwischenbild der Höhenanimation, aria-expanded und aria-controls, Enter und Leertaste.
//   node tools/qa/shell/faq.mjs --url http://localhost:3115/ --out <dir>
import { join } from 'node:path';
import { args, launch, open, report, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
const browser = await launch();
const vp = vpOf(a.vp ?? '1440x900@1');
const h = await open(browser, { vp, url: a.url });
const { page } = h;
let bad = 0;
const check = (ok, text) => {
	console.log(`${ok ? 'OK  ' : 'FAIL'} ${text}`);
	if (!ok) bad++;
};
await toMark(h, 'fragen:0');
await page.evaluate(() => document.querySelector('#fragen').scrollIntoView({ block: 'start' }));
await sleep(500);
const st = () =>
	page.evaluate(() =>
		[...document.querySelectorAll('.faq-frage')].map((b) => {
			const r = document.getElementById(b.getAttribute('aria-controls'));
			return {
				exp: b.getAttribute('aria-expanded'),
				ctl: !!r,
				lab: r?.getAttribute('aria-labelledby') === b.id,
				h: Math.round(r.getBoundingClientRect().height),
				vis: getComputedStyle(r).visibility,
				name: b.textContent,
			};
		}),
	);
let s = await st();
check(s[0].name.startsWith('Wie kommen meine Mitbewohner in die WG?'), `Frage 1: "${s[0].name}"`);
check(
	s.every((x) => x.ctl && x.lab),
	'aria-controls zeigt auf eine Region mit aria-labelledby',
);
check(
	s[0].exp === 'true' && s[1].exp === 'false' && s[2].exp === 'false',
	'Start: nur Frage 1 offen',
);
check(
	s[0].h > 20 && s[1].h === 0 && s[1].vis === 'hidden',
	`Höhen: ${s.map((x) => x.h)} (geschlossene Region unsichtbar)`,
);

// Klick auf Frage 2: Zwischenbild nach 150 ms
const btn = page.locator('.faq-frage').nth(1);
const box = await btn.boundingBox();
await page.mouse.move(box.x + 40, box.y + 10);
await page.mouse.down();
await page.mouse.up();
await sleep(140);
const mitte = await st();
await page.screenshot({
	path: join(a.out, 'faq-zwischen.png'),
	clip: { x: 0, y: Math.max(0, box.y - 260), width: vp.w, height: Math.min(vp.h - 1, 560) },
});
await sleep(450);
s = await st();
check(
	mitte[1].h > 0 && mitte[1].h < s[1].h && mitte[0].h > 0 && mitte[0].h < 200,
	`Zwischenbild: Antwort 2 ${mitte[1].h}px (Ziel ${s[1].h}), Antwort 1 ${mitte[0].h}px beim Schließen`,
);
check(
	s[0].exp === 'false' && s[1].exp === 'true' && s[0].h === 0,
	'exklusiv: Frage 2 offen, Frage 1 zu',
);

// Tastatur: Enter und Leertaste
await btn.focus();
await page.keyboard.press('Enter');
await sleep(500);
s = await st();
check(s[1].exp === 'false', 'Enter schließt Frage 2');
await page.locator('.faq-frage').nth(2).focus();
await page.keyboard.press('Space');
await sleep(500);
s = await st();
check(s[2].exp === 'true', 'Leertaste öffnet Frage 3');
const fok = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
check(fok === 'solid', `Fokusring sichtbar (${fok})`);
bad += report(h.log);
await browser.close();
process.exit(bad ? 1 : 0);
