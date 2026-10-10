// Gemeinsame Helfer für die Aufnahme der Demo-Zustände (crawl-demo.mjs): Browser mit fester Uhr,
// Betrachter Jona, Schnappschuss des DOM (Seite und Overlays getrennt, Bedienelemente nummeriert).
// Die Uhr von App und Demo-Server wird über anchor.json gesetzt (siehe REF.md, Abschnitt 13).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';

const require = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json');
export const { chromium } = require('@playwright/test');

export const BASE = process.env.BASE || 'http://127.0.0.1:4241';
export const CODE = 'MTE8PZAT';
export const WG = `${BASE}/wg/${CODE}`;
const ANCHOR = process.env.ANCHOR || '/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/v2-app/anchor.json';

export const launch = () =>
	chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });

/** Frischer Kontext (390 x 844, DPR 3, de-DE, Berlin), Uhr = Anker-Zeit, Demo-Zustand zurückgesetzt. */
export async function fresh(b, old, opts = {}) {
	if (old?.ctx) await old.ctx.close();
	const ctx = await b.newContext({
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: opts.dpr || 3,
		isMobile: true,
		hasTouch: true,
		locale: 'de-DE',
		timezoneId: 'Europe/Berlin',
		serviceWorkers: 'block',
		colorScheme: opts.dark ? 'dark' : 'light',
		...(opts.ua ? { userAgent: opts.ua } : {}),
	});
	const { s0, a } = JSON.parse(readFileSync(ANCHOR, 'utf8'));
	await ctx.clock.install({ time: new Date(Date.now() - s0 + a) });
	await ctx.addInitScript(() => {
		try {
			localStorage.setItem(
				'manawg_identity:989ac820-58b7-431f-9c65-28721264f333',
				JSON.stringify({ memberId: '7d898f9e-5ad7-4f5d-abed-8c3e99a76973', name: 'Jona', memberToken: 'fixture-member-token' }),
			);
		} catch {}
	});
	const pg = await ctx.newPage();
	const mut = [];
	pg.on('request', (r) => {
		if (r.method() !== 'GET' && r.method() !== 'HEAD' && !/posthog|vercel|sentry/.test(r.url())) mut.push(`${r.method()} ${r.url().replace(BASE, '')}`);
	});
	const errors = [];
	pg.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`));
	pg.on('console', (m) => m.type() === 'error' && errors.push(`console.error ${m.text().slice(0, 200)}`));
	if (!opts.noReset) await pg.goto(`${BASE}/demo-reset`);
	return { ctx, pg, mut, errors };
}

export async function open(pg, route, wait) {
	// Hinweise, die der Nutzer wegklickt (z. B. "Nicht jetzt"), merkt sich die App im Browser: vor jedem Laden leeren.
	await pg
		.evaluate(() => {
			for (const k of Object.keys(localStorage)) if (!k.startsWith('manawg_identity')) localStorage.removeItem(k);
			sessionStorage.clear();
		})
		.catch(() => {});
	await pg.goto(`${WG}${route === '/' ? '' : route}`, { waitUntil: 'networkidle', timeout: 120000 });
	await settle(pg, route, wait);
}

/** Wartet, bis die Seite ruhig ist (Fonts, Chat-Nachrichten, Animationen). */
export async function settle(pg, route, wait) {
	await pg.evaluate(() => document.fonts.ready);
	if (route === '/chat') await pg.getByText('Bin um acht wieder da.').first().waitFor({ timeout: 20000 }).catch(() => {});
	await pg.waitForTimeout(wait ?? 900);
}

// Für den Vergleich zählen Uhrzeiten und "vor n Min/Std" nicht (laufen mit der Uhr), ebenso die zufälligen Ids.
export const norm = (s) =>
	s
		.replace(/_r_[0-9a-z]+_/g, '_r_')
		.replace(/base-ui-[0-9a-z_-]+/g, 'base-ui')
		.replace(/datetime="[^"]*"/g, 'datetime="T"')
		.replace(/\b\d{2}:\d{2}\b/g, 'HH:MM')
		.replace(/vor \d+ (Min|Std)/g, 'vor N $1');
export const hash = (s) => createHash('sha1').update(norm(s)).digest('hex').slice(0, 10);

// ---- im Browser ----
const SEL =
	'a[href],button,summary,input:not([type=hidden]),textarea,select,[role=checkbox],[role=menuitem],[role=tab],[role=switch],[role=option],[role=radio]';

/** Nummeriert alle sichtbaren Bedienelemente (data-demo-i) und liefert ihre Daten. */
export const MARK = (SEL) => {
	for (const e of document.querySelectorAll('[data-demo-i]')) e.removeAttribute('data-demo-i');
	const items = [];
	let i = 0;
	for (const e of document.querySelectorAll(SEL)) {
		if (e.classList.contains('skip-link')) continue;
		const r = e.getBoundingClientRect();
		if (r.width <= 0 || r.height <= 0) continue;
		const cs = getComputedStyle(e);
		if (cs.visibility === 'hidden' || cs.display === 'none') continue;
		const cx = r.x + r.width / 2;
		const cy = r.y + r.height / 2;
		let free = false;
		if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
			const top = document.elementFromPoint(cx, cy);
			free = !!top && (e.contains(top) || top.contains(e));
		}
		const label = (e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
		e.setAttribute('data-demo-i', String(i));
		items.push({
			i,
			tag: e.tagName.toLowerCase(),
			role: e.getAttribute('role') || undefined,
			type: e.getAttribute('type') || undefined,
			label,
			href: e.tagName === 'A' ? new URL(e.href, location.href).pathname : undefined,
			disabled: e.disabled === true || e.getAttribute('aria-disabled') === 'true',
			x: Math.round(r.x * 10) / 10,
			y: Math.round(r.y * 10) / 10,
			w: Math.round(r.width * 10) / 10,
			h: Math.round(r.height * 10) / 10,
			free,
		});
		i++;
	}
	return items;
};

/** Bereinigter Schnappschuss: Seite (Skip-Link + App-Wurzel) und Overlays (alles danach) getrennt. */
export const SERIALIZE = () => {
	const live = [...document.body.querySelectorAll('input,textarea,select')];
	const body = document.body.cloneNode(true);
	body
		.querySelectorAll('script,noscript,template,next-route-announcer,[data-nextjs-toast],[data-nextjs-dialog-overlay],nextjs-portal,link,style,meta,title')
		.forEach((e) => e.remove());
	const cl = [...body.querySelectorAll('input,textarea,select')];
	cl.forEach((c, j) => {
		const o = live[j];
		if (!o) return;
		if (c.tagName === 'INPUT') {
			if (o.type === 'checkbox' || o.type === 'radio') {
				if (o.checked) c.setAttribute('checked', '');
				else c.removeAttribute('checked');
			} else c.setAttribute('value', o.value);
		} else if (c.tagName === 'TEXTAREA') c.textContent = o.value;
		else if (c.tagName === 'SELECT') [...c.options].forEach((op, k) => (o.options[k].selected ? op.setAttribute('selected', '') : op.removeAttribute('selected')));
	});
	body.querySelectorAll('[href]').forEach((a) => {
		a.setAttribute('data-href', a.getAttribute('href'));
		a.setAttribute('href', '#');
	});
	body.querySelectorAll('*').forEach((e) => {
		for (const a of [...e.attributes]) {
			if (/^(data-dgst|data-nextjs|data-next-|data-base-ui-)/.test(a.name)) e.removeAttribute(a.name);
		}
	});
	const kids = [...body.children];
	const rootIdx = kids.findIndex((k) => k.tagName === 'DIV' && /min-h-svh/.test(k.className));
	const page = kids.filter((k, j) => j <= rootIdx);
	const over = kids.filter((k, j) => j > rootIdx);
	for (const k of page) k.removeAttribute('aria-hidden');
	const ae = document.activeElement;
	const html = document.documentElement;
	return {
		page: page.map((k) => k.outerHTML).join(''),
		over: over.map((k) => k.outerHTML).join(''),
		bodyStyle: document.body.getAttribute('style') || '',
		htmlClass: html.className,
		htmlStyle: html.getAttribute('style') || '',
		focus: ae?.getAttribute?.('data-demo-i') ?? null,
		path: location.pathname.replace(/^\/wg\/[^/]+/, '') || '/',
		scrollH: document.documentElement.scrollHeight,
	};
};

/** Nummeriert und liest den Zustand: { items, snap, pageId, overId } */
export async function read(pg) {
	const items = await pg.evaluate(MARK, SEL);
	const snap = await pg.evaluate(SERIALIZE);
	return { items, snap, pageId: hash(snap.page), overId: snap.over ? hash(snap.over) : null };
}

/** Wie read, aber erst wenn zwei Schnappschüsse im Abstand von 350 ms gleich sind. */
export async function readStable(pg) {
	let a = await read(pg);
	for (let k = 0; k < 8; k++) {
		await pg.waitForTimeout(350);
		const b = await read(pg);
		if (b.pageId === a.pageId && b.overId === a.overId) return b;
		a = b;
	}
	return a;
}

/** Stabiler Schlüssel eines Bedienelements: Tag, Beschriftung (Ziffern als #, Zahlen und Uhrzeiten wandern) und Vorkommen. */
export const keyBase = (it) => `${it.tag}|${it.label}`.replace(/\d+/g, '#');
export const keyOf = (it, items) => `${keyBase(it)}@${items.filter((x) => x.i < it.i && keyBase(x) === keyBase(it)).length}`;
