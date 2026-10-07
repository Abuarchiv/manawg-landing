// Verifikation PORT-SPEC Abschnitt 5 (Gate A): Port gegen Referenz (http://localhost:4191/final.html), 1280x800.
// Aufruf: PORT_URL=http://localhost:3120/ node tools/pixel.mjs [main|interact|nojs|rm|links|kbd|all]
// STOPS=6900,7186 beschränkt den Lauf auf einzelne Messpunkte (Standard: alle 26 aus dem Plan).
// Voraussetzung: Port-Seite läuft (NEXT_DIST_DIR=.next-fundament pnpm exec next start -p 3120), Referenz auf :4191 (site-1zu1).
// Ausgabe: tools/out/ (gitignored). Chromium mit Swiftshader (WebGL auf der CPU).
import { mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const { chromium } = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json')(
	'@playwright/test',
);
const sharp = createRequire(realpathSync('node_modules/next/package.json'))('sharp');

const PORT = process.env.PORT_URL ?? 'http://localhost:3100/';
const REF = process.env.REF_URL ?? 'http://localhost:4191/final.html';
const OUT = 'tools/out';
mkdirSync(OUT, { recursive: true });

const ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
// STOPS=6900,7186 (Umgebungsvariable) beschränkt den Lauf auf einzelne Messpunkte.
const ALL_STOPS = [
	0, 400, 1200, 1900, 2600, 3300, 3800, 4326, 4685, 5043, 5402, 5700, 6000, 6400, 6900, 7186, 7600,
	8000, 8853, 10130, 11407, 12207, 13007, 13807, 14200, 14574,
];
const STOPS = process.env.STOPS ? process.env.STOPS.split(',').map(Number) : ALL_STOPS;

const seedScript = (skip) =>
	`(() => { const nat = Math.random; let n = ${skip}; let a = 0x9e3779b9; Math.random = () => { if (n-- > 0) return nat(); a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();`;

// Referenz: Rahmen ist das zweite Kind von #final (Scroll-Container im Rahmen). Port: ganze Seite, Dokument-Scroll.
const FRAME_REF = '#final > div:nth-child(2)';
const FRAME_PORT = '#final';
const frameOf = (h) => (h.kind === 'ref' ? FRAME_REF : FRAME_PORT);

async function open(browser, kind, opts = {}) {
	const ctx = await browser.newContext({
		viewport: opts.viewport ?? { width: 1280, height: 800 },
		deviceScaleFactor: 1,
		reducedMotion: opts.reducedMotion,
		javaScriptEnabled: opts.js !== false,
	});
	const page = await ctx.newPage();
	const log = { err: [], fail: [], fonts: [] };
	page.on('pageerror', (e) => log.err.push(`pageerror ${e.message}`));
	page.on('console', (m) => m.type() === 'error' && log.err.push(`console ${m.text()}`));
	page.on('requestfailed', (r) => log.fail.push(`${r.url()} ${r.failure()?.errorText}`));
	page.on('response', (r) => {
		if (r.status() >= 400) log.fail.push(`${r.url()} ${r.status()}`);
		if (/\.woff2/.test(r.url())) log.fonts.push(r.url());
	});
	if (opts.js === false) {
		await page.goto(kind === 'ref' ? REF : PORT);
		return { page, ctx, kind, log };
	}
	// Next/React ziehen beim Start 2 Zufallswerte (Framework, nicht Engine). Die bekommen echten Zufall,
	// damit die Engine auf beiden Seiten dieselbe Folge sieht.
	await page.addInitScript(seedScript(kind === 'port' ? 2 : 0));
	await page.clock.install({ time: 0 });
	await page.clock.pauseAt(1000);
	await page.goto(kind === 'ref' ? REF : PORT);
	await page.evaluate(() => document.fonts.ready);
	await page.waitForFunction(
		() => {
			const e = document.querySelector('[data-root]') ?? document.querySelector('#final');
			return (
				!!e &&
				(e.hasAttribute('data-root')
					? Object.keys(e).some((k) => k.startsWith('__reactFiber'))
					: true)
			);
		},
		null,
		{
			timeout: 30000,
			polling: 100,
		},
	);
	if (kind === 'ref') {
		await page.addStyleTag({
			content:
				'section[data-screen-label]{padding:0!important;gap:0!important} section[data-screen-label]>div:first-child,#final>div:first-child{display:none!important} #final>div:nth-child(2){border-radius:0!important}',
		});
	}
	if (!opts.noInit) await page.clock.runFor(2500);
	return { page, ctx, kind, log, pos: 0 };
}

async function setTop(h, v) {
	if (h.kind === 'ref') {
		await h.page.evaluate((v) => {
			document.querySelector('#final > div:nth-child(2) > div').scrollTop = v;
		}, v);
	} else {
		await h.page.evaluate((v) => {
			window.scrollTo(0, v);
			window.dispatchEvent(new Event('scroll'));
		}, v);
	}
}

async function goTo(h, v) {
	while (h.pos !== v) {
		h.pos = h.pos < v ? Math.min(v, h.pos + 100) : Math.max(v, h.pos - 100);
		await setTop(h, h.pos);
		await h.page.clock.runFor(32);
	}
}

async function settle(h, ms = 1500) {
	await h.page.clock.runFor(ms);
	await h.page.waitForTimeout(800);
}

async function geom(h, skipTop = false) {
	return h.page.evaluate(
		([sel, skipTop]) => {
			const frame = document.querySelector(sel);
			const out = [];
			const w = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT);
			const r = document.createRange();
			while (w.nextNode()) {
				const n = w.currentNode;
				const t = n.nodeValue.replace(/\s+/g, ' ').trim();
				if (!t || n.parentElement.closest('canvas,style,script')) continue;
				r.selectNodeContents(n);
				const b = r.getBoundingClientRect();
				if (!b.width && !b.height) continue;
				if (b.right <= 0 || b.bottom <= 0 || b.left >= innerWidth || b.top >= innerHeight) continue;
				// unsichtbarer Text (Deckkraft der Eltern < 0,02) zählt nicht, seine Lage hängt am Aufbau
				let o = 1;
				for (let e = n.parentElement; e && o > 0; e = e.parentElement)
					o *= Number(getComputedStyle(e).opacity);
				if (o < 0.02) continue;
				// Kopf in der Ende-Szene: PLAN-V2 §5, der Port blendet ihn aus, die Referenz verdeckt ihn
				if (skipTop && b.top < 80) continue;
				out.push([t, b.x, b.y, b.width, b.height]);
			}
			// Reihenfolge im DOM ist nicht Teil des Vergleichs: nach Text und Lage sortieren
			return out.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[2] - b[2] || a[1] - b[1]));
		},
		[frameOf(h), skipTop],
	);
}

function geomDiff(a, b) {
	const bad = [];
	if (a.length !== b.length) bad.push(`Anzahl ${a.length} vs ${b.length}`);
	for (let i = 0; i < Math.min(a.length, b.length); i++) {
		const [ta, ...ra] = a[i];
		const [tb, ...rb] = b[i];
		if (ta !== tb) bad.push(`Text[${i}] "${ta}" vs "${tb}"`);
		else if (ra.some((x, j) => Math.abs(x - rb[j]) > 0.5))
			bad.push(`"${ta}" ${ra.map((x) => x.toFixed(1))} vs ${rb.map((x) => x.toFixed(1))}`);
	}
	return bad;
}

async function pixDiff(bufA, bufB, name) {
	const A = await sharp(bufA).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const B = await sharp(bufB).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const { width, height, channels } = A.info;
	if (B.info.width !== width || B.info.height !== height) return { pct: 100, n: -1 };
	let n = 0;
	const dif = Buffer.alloc(width * height * 3);
	for (let p = 0; p < width * height; p++) {
		let m = 0;
		for (let c = 0; c < channels; c++)
			m = Math.max(m, Math.abs(A.data[p * 3 + c] - B.data[p * 3 + c]));
		if (m > 16) {
			n++;
			dif[p * 3] = 255;
		} else {
			for (let c = 0; c < 3; c++) dif[p * 3 + c] = A.data[p * 3 + c] * 0.3;
		}
	}
	const pct = (n / (width * height)) * 100;
	if (pct > 0.1 || process.env.ALL_DIFFS)
		await sharp(dif, { raw: { width, height, channels: 3 } })
			.png()
			.toFile(`${OUT}/diff-${name}.png`);
	return { pct, n };
}

async function shotPair(r, p, name, skipTop = false) {
	const [a, b] = await Promise.all([r.page.screenshot(), p.page.screenshot()]);
	writeFileSync(`${OUT}/ref-${name}.png`, a);
	writeFileSync(`${OUT}/port-${name}.png`, b);
	const d = await pixDiff(a, b, name);
	const [ga, gb] = await Promise.all([geom(r, skipTop), geom(p, skipTop)]);
	const gd = geomDiff(ga, gb);
	if (process.env.GEOM_ALL && gd.length) console.log(gd.join('\n'));
	const ok = d.pct <= 0.1 && gd.length === 0;
	console.log(
		`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(14)} Pixel ${d.pct.toFixed(4)} % (${d.n})  Text ${gd.length ? `${gd.length} Abw: ${gd.slice(0, 3).join(' | ')}` : 'ok'}`,
	);
	return ok;
}

async function center(page, text, scope) {
	return page.evaluate(
		([t, sel]) => {
			const w = document.createTreeWalker(document.querySelector(sel), NodeFilter.SHOW_TEXT);
			const r = document.createRange();
			while (w.nextNode()) {
				const n = w.currentNode;
				if (n.nodeValue.trim() !== t) continue;
				r.selectNodeContents(n);
				const b = r.getBoundingClientRect();
				if (b.width && b.bottom > 0 && b.top < innerHeight)
					return [b.x + b.width / 2, b.y + b.height / 2];
			}
			return null;
		},
		[text, scope],
	);
}

async function runMain(browser) {
	const [r, p] = await Promise.all([open(browser, 'ref'), open(browser, 'port')]);
	let fails = 0;
	for (const v of STOPS) {
		await Promise.all([goTo(r, v), goTo(p, v)]);
		await Promise.all([settle(r), settle(p)]);
		if (!(await shotPair(r, p, `st${String(v).padStart(5, '0')}`, v >= 6000 && v < 7200))) fails++;
	}
	console.log('Port Konsole/Netz:', JSON.stringify(p.log.err), JSON.stringify(p.log.fail));
	console.log(
		'Port Fonts:',
		p.log.fonts.length,
		p.log.fonts.every((u) => u.includes('/_next/static/media/')),
	);
	console.log(
		`main: ${fails} Messpunkte außerhalb der Schwelle, ${p.log.err.length} Fehler, ${p.log.fail.length} Netzfehler`,
	);
	await Promise.all([r.ctx.close(), p.ctx.close()]);
	return fails + p.log.err.length + p.log.fail.length;
}

async function runInteract(browser) {
	const [r, p] = await Promise.all([open(browser, 'ref'), open(browser, 'port')]);
	let fails = 0;
	const click = async (text, wait, name) => {
		const c = await center(r.page, text, FRAME_REF);
		if (!c) {
			console.log(`FAIL ${name}: "${text}" nicht gefunden`);
			fails++;
			return;
		}
		await Promise.all([r, p].map((h) => h.page.mouse.click(c[0], c[1])));
		await Promise.all([r, p].map((h) => h.page.clock.runFor(wait)));
	};
	await Promise.all([goTo(r, 6400), goTo(p, 6400)]);
	await Promise.all([settle(r), settle(p)]);
	await click('Finanzen', 600, 'tab-finanzen');
	await click('Ausgabe erfassen', 600, 'ausgabe');
	await Promise.all([r, p].map((h) => h.page.waitForTimeout(800)));
	if (!(await shotPair(r, p, 'i-handy'))) fails++;
	await Promise.all([goTo(r, 13007), goTo(p, 13007)]);
	await Promise.all([settle(r), settle(p)]);
	await click('Android', 3000, 'install-android');
	await Promise.all([r, p].map((h) => h.page.waitForTimeout(800)));
	if (!(await shotPair(r, p, 'i-android'))) fails++;
	await Promise.all([goTo(r, 13807), goTo(p, 13807)]);
	await Promise.all([settle(r), settle(p)]);
	await click('Brauche ich eine App aus dem Store?', 600, 'faq');
	await Promise.all([r, p].map((h) => h.page.waitForTimeout(800)));
	if (!(await shotPair(r, p, 'i-faq'))) fails++;
	console.log('interact Port Konsole:', JSON.stringify(p.log.err));
	await Promise.all([r.ctx.close(), p.ctx.close()]);
	return fails + p.log.err.length;
}

async function runNoJs(browser) {
	const p = await open(browser, 'port', { js: false });
	const m = await p.page.evaluate(() => {
		const l = document.querySelector('[data-loader]');
		const h1 = document.querySelector('h1');
		window.scrollTo(0, 13807);
		return {
			loader: getComputedStyle(l).display,
			h1: h1?.textContent,
			h1vis: h1 ? h1.getBoundingClientRect().height > 0 : false,
			scrollY: Math.round(scrollY),
			overflowY: getComputedStyle(document.documentElement).overflowY,
		};
	});
	await p.page.screenshot({ path: `${OUT}/nojs.png` });
	console.log('nojs', JSON.stringify(m));
	await p.ctx.close();
	return m.loader === 'none' && m.h1?.includes('Die App') && Math.abs(m.scrollY - 13807) <= 2
		? 0
		: 1;
}

async function runRm(browser) {
	const p = await open(browser, 'port', { reducedMotion: 'reduce', noInit: true });
	await p.page.clock.runFor(100);
	const op = await p.page.evaluate(() => document.querySelector('[data-loader]').style.opacity);
	await p.page.clock.runFor(1500);
	await p.page.click('a[href="#so-gehts"]');
	await p.page.waitForTimeout(100);
	const top = await p.page.evaluate(() => Math.round(scrollY));
	console.log(`rm: Lader opacity nach 100 ms = "${op}", Sprung scrollY = ${top}`);
	await p.ctx.close();
	// Ankerziel "Intro überspringen": Oberkante So geht's (7296) minus Kopfabstand 110
	return op === '0' && Math.abs(top - 7186) <= 2 ? 0 : 1;
}

async function runLinks(browser) {
	const p = await open(browser, 'port', { js: false });
	const hrefs = await p.page.evaluate(() =>
		[...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
	);
	const A = 'https://app.manawg.com';
	const want = [
		`${A}/`,
		`${A}/neu?action=create`,
		`${A}/neu`,
		'#bereiche',
		'#so-gehts',
		'#fragen',
		`${A}/neu?action=create`,
		`${A}/neu`,
		`${A}/`,
		'/impressum',
		'/datenschutz',
		`${A}/neu?action=create`,
		'#so-gehts',
		`${A}/neu?action=create`,
	];
	console.log('links', JSON.stringify(hrefs));
	await p.ctx.close();
	// Reihenfolge im DOM: Kopf und Hinweise stehen jetzt vor dem Inhalt (F-04), verglichen wird die Menge
	return JSON.stringify([...hrefs].sort()) === JSON.stringify([...want].sort()) ? 0 : 1;
}

async function runKbd(browser) {
	const p = await open(browser, 'port');
	await p.page.keyboard.press('Tab');
	const seen = new Set();
	// bei P < 0.9: Ende-Overlay nicht fokussierbar
	const early = await p.page.evaluate(() =>
		[...document.querySelectorAll('[data-ende] a, [data-ende] [tabindex], [data-cta]')].map(
			(e) => e.closest('[data-cta]')?.inert ?? e.inert,
		),
	);
	console.log('kbd P<0.9: [data-cta] inert =', JSON.stringify(early));
	for (let i = 0; i < 80; i++) {
		const d = await p.page.evaluate(() => {
			const e = document.activeElement;
			return e
				? `${e.tagName}|${e.getAttribute('role') ?? ''}|${(e.textContent || '').trim().slice(0, 24)}`
				: '';
		});
		seen.add(d);
		await p.page.keyboard.press('Tab');
	}
	const list = [...seen];
	console.log('kbd fokussiert:', JSON.stringify(list));
	await p.page.evaluate(() => window.scrollTo(0, 13807));
	await p.page.evaluate(() => window.dispatchEvent(new Event('scroll')));
	await p.page.clock.runFor(500);
	const c = await p.page.evaluate(() => {
		const el = [...document.querySelectorAll('[role=button]')].find((e) =>
			e.textContent.includes('Brauche ich'),
		);
		el.focus();
		return !!el;
	});
	await p.page.keyboard.press('Enter');
	await p.page.clock.runFor(100);
	const isOpen = await p.page.evaluate(() =>
		document.body.textContent.includes('Nein. ManaWG läuft im Browser'),
	);
	console.log('kbd Enter auf FAQ 2:', c, isOpen);
	await p.ctx.close();
	return isOpen ? 0 : 1;
}

const mode = process.argv[2] ?? 'all';
const browser = await chromium.launch({ args: ARGS });
const jobs = {
	main: runMain,
	interact: runInteract,
	nojs: runNoJs,
	rm: runRm,
	links: runLinks,
	kbd: runKbd,
};
let bad = 0;
for (const [k, f] of Object.entries(jobs)) {
	if (mode !== 'all' && mode !== k) continue;
	console.log(`--- ${k}`);
	bad += await f(browser);
}
await browser.close();
console.log(bad ? `GESAMT: ${bad} Abweichungen` : 'GESAMT: alles innerhalb der Schwellen');
process.exit(bad ? 1 : 0);
