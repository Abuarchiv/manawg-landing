// SH-7: Rechtsseiten und 404 bei 320, 360, 390 und 768 px. Kein Überlauf, Texte korrigiert, 404 ohne Emoji.
//   node tools/qa/shell/legal.mjs --url http://localhost:3115/ --out <dir>
import { join } from 'node:path';
import { args, launch, report, sleep } from '../lib.mjs';

const a = args();
const base = a.url.replace(/\/$/, '');
const browser = await launch();
let bad = 0;
const check = (ok, text) => {
	console.log(`${ok ? 'OK  ' : 'FAIL'} ${text}`);
	if (!ok) bad++;
};
for (const w of [320, 360, 390, 768]) {
	const ctx = await browser.newContext({
		viewport: { width: w, height: 800 },
		deviceScaleFactor: 2,
		isMobile: w < 700,
		hasTouch: w < 700,
	});
	const page = await ctx.newPage();
	const log = { err: [], warn: [], fail: [] };
	page.on('pageerror', (e) => log.err.push(e.message));
	page.on('console', (m) => {
		if (m.type() === 'error' && !m.text().includes('404')) log.err.push(m.text());
		if (m.type() === 'warning') log.warn.push(m.text());
	});
	for (const p of ['impressum', 'datenschutz', 'agb', 'gibtsnicht']) {
		await page.goto(`${base}/${p}`, { waitUntil: 'load' });
		await sleep(200);
		const m = await page.evaluate(() => {
			const t = document.body.innerText;
			return {
				sw: document.documentElement.scrollWidth,
				cw: document.documentElement.clientWidth,
				strasse: /Strasse/.test(t),
				iso: /\d{4}-\d{2}-\d{2}/.test(t),
				stand: (t.match(/Stand: [\d.]+/) ?? [''])[0],
				emoji: /\p{Extended_Pictographic}/u.test(t),
				marke: !!document.querySelector('img[src="/manawg-mark.svg"]'),
			};
		});
		const ok = m.sw === m.cw && !m.strasse && !m.iso && !m.emoji;
		check(
			ok,
			`${w} /${p}: scrollWidth ${m.sw} = clientWidth ${m.cw}, Strasse ${m.strasse}, ISO-Datum ${m.iso}, Emoji ${m.emoji}${m.stand ? `, ${m.stand}` : ''}${p === 'gibtsnicht' ? `, Zeichen ${m.marke}` : ''}`,
		);
		if (p === 'impressum' || p === 'gibtsnicht')
			await page.screenshot({ path: join(a.out, `legal-${w}-${p}.png`), fullPage: false });
		if (p === 'gibtsnicht') check(m.marke, `${w} 404 zeigt das ManaWG-Zeichen`);
	}
	bad += report(log, `${w}`);
	await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
