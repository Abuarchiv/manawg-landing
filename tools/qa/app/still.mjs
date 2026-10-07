// Standbild des Handys (Zustand 01 mit iPhone-Insets) für public/app-demo/start.webp.
// Die zwei Zeilen mit tagesabhängigem Datum werden unsichtbar gerendert; Phone.tsx setzt sie zur Laufzeit darüber.
// Aufruf: node tools/qa/app/still.mjs [base]  (Demo-Dokument muss unter base erreichbar sein)
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, sharp } from '../lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const base = process.argv[2] || 'http://127.0.0.1:4261/app-demo/index.html';
const b = await launch();
const ctx = await b.newContext({
	viewport: { width: 390, height: 839 },
	deviceScaleFactor: 3,
	isMobile: true,
	hasTouch: true,
	locale: 'de-DE',
	timezoneId: 'Europe/Berlin',
});
const pg = await ctx.newPage();
await pg.goto(base);
await pg.waitForSelector('html[data-bereit]');
await pg.waitForTimeout(800);
const zeilen = await pg.evaluate(() => {
	const out = [];
	const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	while (w.nextNode()) {
		const n = w.currentNode;
		const t = n.textContent.trim();
		if (!/^[A-Z][a-z]\., \d+\. [A-Za-zä]+\.?( · .*)?$/.test(t)) continue;
		const el = n.parentElement;
		const r = el.getBoundingClientRect();
		const cs = getComputedStyle(el);
		out.push({
			text: t,
			x: r.x,
			y: r.y,
			w: r.width,
			h: r.height,
			size: cs.fontSize,
			line: cs.lineHeight,
			weight: cs.fontWeight,
			color: cs.color,
		});
		el.style.color = 'transparent';
	}
	return out;
});
console.log(JSON.stringify(zeilen));
const png = await pg.screenshot({ animations: 'disabled' });
const webp = await sharp(png).webp({ quality: 80, effort: 6 }).toBuffer();
writeFileSync(join(root, 'public/app-demo/start.webp'), webp);
console.log('start.webp', Math.round(webp.length / 1024), 'kB');
await b.close();
