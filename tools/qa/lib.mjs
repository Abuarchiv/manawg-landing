// Gemeinsame Helfer der QA-Werkzeuge (PLAN-V2 §7). Echte GPU (Metal), realistisches Scrollen, Marken aus §11.
//
// Aufrufbeispiele (aus dem Repo-Wurzelordner, Seite läuft auf :3120 mit ?qa=1):
//   node tools/qa/sheet.mjs --url http://localhost:3120/ --vp 1440x900@2 --marks all --out <dir>
//   node tools/qa/check.mjs --url http://localhost:3120/ --vp all --out <dir>
//   node tools/qa/jump.mjs --url http://localhost:3120/ --out <dir>
// Viewport-Schreibweise: BreitexHöhe@dpr, angehängtes t = Touch (Handy, CDP-Wisch), z. B. 390x844@3t.
// Ausgaben nur über --out <dir> (nie ins Repo, Standard: tools/out/qa, gitignored).
import { mkdirSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const req = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json');
export const { chromium, webkit } = req('@playwright/test');
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
export const sharp = createRequire(realpathSync(join(root, 'node_modules/next/package.json')))(
	'sharp',
);

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const GPU_ARGS = ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'];

/** Kommandozeile: --schluessel wert, --flag. */
export function args(argv = process.argv.slice(2)) {
	const o = { _: [] };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith('--')) {
			const k = a.slice(2);
			const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
			o[k] = v;
		} else o._.push(a);
	}
	o.url ??= 'http://localhost:3120/';
	o.out ??= join(root, 'tools/out/qa');
	mkdirSync(o.out, { recursive: true });
	return o;
}

/** Die zehn Viewports aus PLAN-V2 §7 (Abnahme "Kein Balken"). */
export const VIEWPORTS = [
	'1920x1080@1',
	'1440x900@2',
	'1280x800@1',
	'1024x768@2',
	'2560x1440@1',
	'1536x730@1.25',
	'768x1024@2t',
	'390x844@3t',
	'360x740@3t',
	'844x390@3t',
];

/** "1440x900@2" oder "390x844@3t" -> { w, h, dpr, touch, name } */
export function vpOf(str) {
	const m = /^(\d+)x(\d+)(?:@([\d.]+))?(t?)$/.exec(str);
	if (!m) throw new Error(`Viewport nicht lesbar: ${str}`);
	return {
		w: +m[1],
		h: +m[2],
		dpr: +(m[3] ?? 1),
		touch: m[4] === 't',
		name: str.replace('.', '_'),
	};
}

export function vpList(v) {
	if (!v || v === 'all') return VIEWPORTS.map(vpOf);
	return String(v).split(',').map(vpOf);
}

export async function launch(o = {}) {
	const args = [...GPU_ARGS, ...(o.args ?? [])];
	if (o.gl === false)
		args.splice(0, args.length, '--disable-3d-apis', '--disable-webgl', '--disable-webgl2');
	return chromium.launch({ headless: true, args });
}

/** WebKit-Smoke: Zielseite über einen Proxy ohne CSP (upgrade-insecure-requests bricht lokales http). */
export async function launchWebkit() {
	return webkit.launch();
}
export async function startCspProxy(target, port) {
	const http = await import('node:http');
	const t = new URL(target);
	const srv = http.createServer((rq, rs) => {
		const p = http.request(
			{ host: t.hostname, port: t.port, path: rq.url, method: rq.method, headers: rq.headers },
			(r) => {
				const h = Object.fromEntries(
					Object.entries(r.headers).filter(
						([k]) => k !== 'content-security-policy' && k !== 'strict-transport-security',
					),
				);
				rs.writeHead(r.statusCode, h);
				r.pipe(rs);
			},
		);
		p.on('error', () => rs.end());
		rq.pipe(p);
	});
	await new Promise((r) => srv.listen(port, '127.0.0.1', r));
	return srv;
}

/**
 * Seite öffnen. Konsolen- und Netzwächter laufen mit (log.err, log.warn, log.fail).
 * o: { vp, url, init, reducedMotion, js, noWait, settle, ua }
 */
export async function open(browser, o = {}) {
	const vp = o.vp ?? vpOf('1440x900@1');
	const ctx = await browser.newContext({
		viewport: { width: vp.w, height: vp.h },
		deviceScaleFactor: vp.dpr,
		hasTouch: vp.touch,
		isMobile: vp.touch,
		reducedMotion: o.reducedMotion,
		javaScriptEnabled: o.js ?? true,
	});
	if (o.init) await ctx.addInitScript(o.init);
	const page = await ctx.newPage();
	const log = { err: [], warn: [], fail: [], all: [] };
	page.on('pageerror', (e) => log.err.push(`pageerror ${e.message}`));
	page.on('console', (m) => {
		const t = m.type();
		log.all.push(`${t} ${m.text()}`);
		if (t === 'error') log.err.push(`console.error ${m.text()}`);
		else if (t === 'warning') log.warn.push(`console.warn ${m.text()}`);
	});
	page.on('requestfailed', (r) => log.fail.push(`${r.url()} ${r.failure()?.errorText}`));
	page.on('response', (r) => {
		if (r.status() >= 400) log.fail.push(`${r.url()} ${r.status()}`);
	});
	const sep = (o.url ?? 'http://localhost:3120/').includes('?') ? '&' : '?';
	await page.goto(`${o.url ?? 'http://localhost:3120/'}${o.qa === false ? '' : `${sep}qa=1`}`, {
		waitUntil: 'load',
	});
	let cdp = null;
	try {
		cdp = await ctx.newCDPSession(page);
	} catch {}
	if (o.js !== false && !o.noWait) {
		await page.evaluate(() => document.fonts.ready);
		await page
			.waitForFunction(
				() => {
					const l = document.querySelector('[data-loader]');
					return !!window.__landing?.bereit && (!l || getComputedStyle(l).opacity === '0');
				},
				null,
				{ timeout: 15000 },
			)
			.catch(() => log.err.push('bereit: Lader nach 15 s nicht weg'));
	}
	await sleep(o.settle ?? 700);
	return { page, ctx, cdp, log, vp };
}

/** Echte GPU prüfen. */
export function renderer(page) {
	return page.evaluate(() => {
		const g = document.createElement('canvas').getContext('webgl2');
		const e = g?.getExtension('WEBGL_debug_renderer_info');
		return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : null;
	});
}

/** Zustand für Berichte. */
export function state(page) {
	return page.evaluate(() => {
		const r = document.getElementById('final');
		const cs = getComputedStyle(r);
		const L = window.__landing;
		return {
			y: Math.round(scrollY),
			H: document.documentElement.scrollHeight,
			P: L ? +L.P().toFixed(4) : null,
			phase: r.dataset.phase,
			e: +cs.getPropertyValue('--e'),
			f: +cs.getPropertyValue('--f'),
			g: +cs.getPropertyValue('--g'),
			c: [0, 1, 2, 3].map((j) => +cs.getPropertyValue(`--c${j}`)),
			kopfAus: +cs.getPropertyValue('--kopf-aus'),
		};
	});
}

// --- Marken (PLAN-V2 §11) -------------------------------------------------------------------------

export const MARKS = [
	'intro:0',
	'intro:0.0625',
	'intro:0.1875',
	'intro:0.297',
	'intro:0.406',
	'intro:0.516',
	'intro:0.594',
	'intro:0.676',
	'intro:0.732',
	'intro:0.788',
	'intro:0.844',
	'intro:0.891',
	'intro:0.9375',
	'intro:1',
	'intro-aus:0.625',
	'so-gehts:-0.2',
	'so-gehts:0.55',
	'koerper:0.2',
	'funktionen:0.088',
	'funktionen:0.544',
	'funktionen:1',
	'bereiche:0',
	'installieren:0',
	'fragen:0',
	'finale:-0.3',
	'ende-der-seite',
];

export function marksOf(v) {
	if (!v || v === 'all') return MARKS;
	return String(v).split(',');
}

/** Dokument-y einer Marke. */
export function yOf(page, mark) {
	return page.evaluate((mark) => {
		const L = window.__landing;
		const H = innerHeight;
		const max = document.documentElement.scrollHeight - H;
		if (mark === 'ende-der-seite') return max;
		const [id, v] = mark.split(':');
		const p = Number(v);
		if (id === 'intro') return Math.round(L.yForP(p));
		const sec = id === 'intro-aus' ? L.section('intro') : L.section(id);
		if (!sec) return null;
		if (id === 'intro-aus') return Math.round(sec.top + sec.height - H + p * H);
		if (id === 'funktionen') return Math.round(sec.top + p * (sec.height - H));
		return Math.round(sec.top + p * sec.height);
	}, mark);
}

async function curY(page) {
	return page.evaluate(() => Math.round(scrollY));
}

/** Warten bis scrollY ruht. */
export async function waitIdle(page, quiet = 250, max = 4000) {
	let last = await curY(page);
	const t0 = Date.now();
	let t = t0;
	for (;;) {
		await sleep(50);
		const y = await curY(page);
		if (y !== last) {
			last = y;
			t = Date.now();
		} else if (Date.now() - t >= quiet) return y;
		if (Date.now() - t0 > max) return y;
	}
}

/** Rad: offene Schleife in kleinen Schritten (60-120 px, 30-60 ms), danach Feinkorrektur. */
export async function wheelTo(page, ziel, o = {}) {
	const step = o.step ?? 90;
	const pause = o.pause ?? 40;
	const vp = page.viewportSize();
	await page.mouse.move(o.mx ?? vp.width * 0.5, o.my ?? vp.height * 0.5);
	let y = await waitIdle(page, 80, 1500);
	for (let round = 0; round < 8; round++) {
		const d = ziel - y;
		if (Math.abs(d) <= 2) break;
		const n = Math.floor(Math.abs(d) / step);
		const rest = Math.abs(d) - n * step;
		const sg = Math.sign(d);
		for (let i = 0; i < n; i++) {
			await page.mouse.wheel(0, sg * step);
			await sleep(pause);
		}
		if (rest > 0) await page.mouse.wheel(0, sg * rest);
		y = await waitIdle(page, 300, 6000);
	}
	await sleep(o.settle ?? 350);
	return y;
}

/** Touch: CDP-Wisch mit 150-250 px je Geste. */
export async function touchTo(page, cdp, ziel, o = {}) {
	const vp = page.viewportSize();
	let y = await waitIdle(page, 80, 1500);
	for (let g = 0; g < 600; g++) {
		const d = ziel - y;
		if (Math.abs(d) <= 2) break;
		const dist = Math.sign(d) * Math.min(Math.abs(d), o.step ?? 200);
		await cdp.send('Input.synthesizeScrollGesture', {
			x: vp.width / 2,
			y: vp.height * (dist > 0 ? 0.7 : 0.3),
			yDistance: -dist,
			speed: o.speed ?? 900,
			gestureSourceType: 'touch',
			preventFling: true,
		});
		await sleep(o.pause ?? 90);
		y = await curY(page);
	}
	await waitIdle(page, 250, 3000);
	await sleep(o.settle ?? 350);
	return curY(page);
}

/** Zur Marke scrollen (Rad auf Desktop, Wisch auf Touch). */
export async function toMark(h, mark, o = {}) {
	const y = await yOf(h.page, mark);
	if (y == null) throw new Error(`Marke ${mark} unbekannt`);
	if (h.vp.touch) await touchTo(h.page, h.cdp, y, o);
	else await wheelTo(h.page, y, o);
	return y;
}

export async function shot(h, name, o = {}) {
	const path = join(o.out, `${name}.png`);
	await h.page.screenshot({ path, clip: o.clip });
	return path;
}

/** Kontaktbogen: PNG-Liste -> ein JPG (cols Spalten), jede Zelle w breit, mit Beschriftung. */
export async function sheet(files, labels, out, cols = 3, w = 560) {
	const imgs = await Promise.all(
		files.map(async (f) => {
			const b = await sharp(f).resize({ width: w }).jpeg({ quality: 85 }).toBuffer();
			const m = await sharp(b).metadata();
			return { b, h: m.height };
		}),
	);
	const h = Math.max(...imgs.map((i) => i.h)) + 22;
	const rows = Math.ceil(imgs.length / cols);
	const comp = [];
	imgs.forEach((im, i) => {
		const x = (i % cols) * w;
		const y = Math.floor(i / cols) * h;
		comp.push({ input: im.b, left: x, top: y + 22 });
		comp.push({
			input: Buffer.from(
				`<svg width="${w}" height="22"><rect width="${w}" height="22" fill="#222"/><text x="6" y="16" font-family="monospace" font-size="13" fill="#fff">${String(labels[i]).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`,
			),
			left: x,
			top: y,
		});
	});
	await sharp({ create: { width: cols * w, height: rows * h, channels: 3, background: '#111' } })
		.composite(comp)
		.jpeg({ quality: 82 })
		.toFile(out);
}

/** Konsolen- und Netzbericht, gibt Anzahl Verstöße zurück. */
export function report(log, label = '') {
	const n = log.err.length + log.warn.length + log.fail.length;
	console.log(
		`${n ? 'FAIL' : 'OK  '} Konsole${label ? ` ${label}` : ''}: ${log.err.length} Fehler, ${log.warn.length} Warnungen, ${log.fail.length} fehlgeschlagene Anfragen`,
	);
	for (const l of [...log.err, ...log.warn, ...log.fail].slice(0, 6)) console.log(`     ${l}`);
	return n;
}

/** 60-Hz-Emulation: jedes zweite rAF des 120-Hz-Takts. */
export const HZ60 = () => {
	const raf = window.requestAnimationFrame.bind(window);
	window.requestAnimationFrame = (cb) => raf(() => raf(cb));
};
