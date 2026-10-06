// Nimmt die echte ManaWG-App (über den Demo-Server, Landing-Daten, Betrachter Jona) in 390 × 844 mit DPR 3 auf.
// Je Zustand: PNG, sichtbare Texte (mit Typografie), Icons und das bereinigte DOM für die Standalone-Snippets.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json');
const { chromium } = require('@playwright/test');
const SCR = (process.env.SCR || './out');
const BASE = process.env.BASE || 'http://127.0.0.1:4241', DPR = Number(process.env.DPR || 3);
const OUT = `${SCR}/shots/final`, DATA = `${SCR}/data/final`;
mkdirSync(OUT, { recursive: true }); mkdirSync(DATA, { recursive: true });
const WG = `${BASE}/wg/MTE8PZAT`;
const only = (process.env.ONLY || '').split(',').filter(Boolean);

// ---- im Browser: sichtbare Texte, Icons, Maße ----
const EXTRACT = () => {
	const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
	const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1; const ctx = canvas.getContext('2d', { willReadFrequently: true });
	const hex = (c) => { if (!c || c === 'transparent') return null; ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1); const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data; const h = (n) => n.toString(16).padStart(2, '0'); return a === 255 ? `#${h(r)}${h(g)}${h(b)}` : `#${h(r)}${h(g)}${h(b)}${h(a)}`; };
	const texts = [];
	const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	while (w.nextNode()) {
		const n = w.currentNode, t = n.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue;
		const el = n.parentElement; if (!el || el.closest('script,style,noscript,[hidden]') || !vis(el)) continue;
		const range = document.createRange(); range.selectNodeContents(n); const rr = range.getBoundingClientRect(); if (rr.width === 0) continue;
		const cs = getComputedStyle(el);
		texts.push({ t, x: Math.round(rr.x), y: Math.round(rr.y), w: Math.round(rr.width), h: Math.round(rr.height), size: cs.fontSize, weight: cs.fontWeight, family: cs.fontFamily.split(',')[0].replace(/"/g, ''), line: cs.lineHeight, track: cs.letterSpacing, color: hex(cs.color), sr: !!el.closest('.sr-only') });
	}
	const icons = [...document.querySelectorAll('svg')].filter(vis).map((s) => { const r = s.getBoundingClientRect(), cs = getComputedStyle(s), cls = s.getAttribute('class') || ''; return { name: (cls.match(/lucide-([a-z0-9-]+)/g) || []).pop()?.replace('lucide-', '') || (s.querySelector('circle') ? 'logo-mark' : 'svg'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, stroke: cs.strokeWidth, color: hex(cs.color) }; });
	// Antippbare Ziele mit Maßen (für die Hand/Finger-Animation der Landing); verdeckte (unter Overlays) werden markiert
	const targets = [...document.querySelectorAll('a[href], button, input, textarea, select, summary, [role="checkbox"], [role="menuitem"], [role="tab"], [role="switch"], [role="option"]')].filter(vis).map((e) => {
		const r = e.getBoundingClientRect(); const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
		const top = cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight ? document.elementFromPoint(cx, cy) : null;
		const label = (e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70);
		return { name: label, tag: e.tagName.toLowerCase(), role: e.getAttribute('role') || undefined, type: e.getAttribute('type') || undefined, href: e.tagName === 'A' ? new URL(e.href, location.href).pathname : undefined, x: Math.round(r.x * 10) / 10, y: Math.round(r.y * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, free: !!top && (e.contains(top) || top.contains(e)) };
	}).filter((t) => t.w > 0 && t.h > 0);
	return { texts, icons, targets, scrollH: document.documentElement.scrollHeight, viewport: [innerWidth, innerHeight] };
};
// ---- im Browser: bereinigtes DOM für ein Standalone-Dokument ----
const SERIALIZE = () => {
	const body = document.body.cloneNode(true);
	body.querySelectorAll('script,noscript,template,next-route-announcer,[data-nextjs-toast],[data-nextjs-dialog-overlay],link,style').forEach((e) => e.remove());
	body.querySelectorAll('[hidden]').forEach((e) => { if (!e.textContent.trim() && !e.querySelector('svg,img')) e.remove(); });
	const live = [...document.body.querySelectorAll('input,textarea,select')];
	const cl = [...body.querySelectorAll('input,textarea,select')];
	cl.forEach((c, i) => { const o = live[i]; if (!o) return; if (c.tagName === 'INPUT') { if (o.type === 'checkbox' || o.type === 'radio') { o.checked ? c.setAttribute('checked', '') : c.removeAttribute('checked'); } else c.setAttribute('value', o.value); } else if (c.tagName === 'TEXTAREA') c.textContent = o.value; else if (c.tagName === 'SELECT') [...c.options].forEach((op, j) => (o.options[j].selected ? op.setAttribute('selected', '') : op.removeAttribute('selected'))); });
	const ae = document.activeElement; const ai = live.indexOf(ae); if (ai >= 0) cl[ai].setAttribute('autofocus', ''); // Fokuszustand (Ring) im Standalone-Dokument wiederherstellen
	const walk = document.createTreeWalker(body, NodeFilter.SHOW_COMMENT); const comments = []; while (walk.nextNode()) comments.push(walk.currentNode); comments.forEach((c) => c.remove());
	body.querySelectorAll('[href]').forEach((a) => { a.setAttribute('data-href', a.getAttribute('href')); a.setAttribute('href', '#'); });
	body.querySelectorAll('*').forEach((e) => { for (const a of [...e.attributes]) if (/^(data-dgst|data-nextjs|data-next-|tabindex$|data-base-ui-)/.test(a.name) && a.name !== 'data-base-ui-inert') e.removeAttribute(a.name); });
	const h = document.documentElement;
	return { lang: h.lang, htmlClass: h.className, htmlStyle: h.getAttribute('style') || '', bodyClass: document.body.className, bodyStyle: document.body.getAttribute('style') || '', html: body.innerHTML, css: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href), title: document.title };
};

const b = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const errors = [];
let ctx, pg;
const UA = {
	ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
	android: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
};
// frischer Browserkontext + Demo-Zustand zurücksetzen; opts: dark, ua, noInstallApi
async function fresh(opts = {}) {
	if (ctx) await ctx.close();
	ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true, locale: 'de-DE', timezoneId: 'Europe/Berlin', serviceWorkers: 'block', colorScheme: opts.dark ? 'dark' : 'light', ...(opts.ua ? { userAgent: UA[opts.ua] } : {}) });
	await ctx.addInitScript((noInstallApi) => {
		try { localStorage.setItem('manawg_identity:989ac820-58b7-431f-9c65-28721264f333', JSON.stringify({ memberId: '7d898f9e-5ad7-4f5d-abed-8c3e99a76973', name: 'Jona', memberToken: 'fixture-member-token' })); } catch {}
		if (noInstallApi) { delete Window.prototype.onbeforeinstallprompt; delete window.onbeforeinstallprompt; }
	}, !!opts.noInstallApi);
	pg = await ctx.newPage();
	pg.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
	pg.on('console', (m) => { if (m.type() === 'error') errors.push('console.error ' + m.text().slice(0, 200)); });
	pg.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('favicon')) errors.push(`HTTP ${r.status()} ${r.url().slice(0, 120)}`); });
	await pg.goto(`${BASE}/demo-reset`);
}
const open = async (path = '', wait = 1400) => { await pg.goto(`${WG}${path}`, { waitUntil: 'networkidle', timeout: 120000 }); await pg.waitForTimeout(wait); };
const done = [];
async function snap(name, { settle = 600, noDoc = false } = {}) {
	if (only.length && !only.some((o) => name.startsWith(o))) return;
	await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(settle);
	await pg.screenshot({ path: `${OUT}/${name}.png`, animations: 'disabled' });
	const info = await pg.evaluate(EXTRACT); info.name = name; info.url = pg.url();
	if (info.scrollH > info.viewport[1] + 6) { await pg.screenshot({ path: `${OUT}/${name}-full.png`, animations: 'disabled', fullPage: true }); info.full = true; }
	writeFileSync(`${DATA}/${name}.json`, JSON.stringify(info));
	if (!noDoc) writeFileSync(`${DATA}/${name}.doc.json`, JSON.stringify(await pg.evaluate(SERIALIZE)));
	done.push(name); console.log('ok', name, info.full ? '(+full)' : '');
}
const stepRe = process.env.STEPS ? new RegExp(process.env.STEPS) : null;
const step = async (label, fn) => { if (stepRe && !stepRe.test(label)) return; try { await fn(); } catch (e) { errors.push(`STEP ${label}: ${e.message.split('\n')[0].slice(0, 160)}`); console.log('STEP FAIL', label, e.message.split('\n')[0].slice(0, 160)); } };

// ===== A. Ausgangszustand der Landing (Spülmittel erledigt, Saldo 0,00 €) =====
await fresh();
await step('start', async () => { await open(''); await snap('01-start'); });
await step('start-woche', async () => { await pg.getByRole('button', { name: /Neu in deiner WG/ }).first().click(); await pg.waitForTimeout(500); await snap('02-start-neu-in-der-wg'); });
await step('putzen', async () => { await open('/putzen'); await snap('03-haushalt-putzplan'); });
await step('einkauf', async () => { await open('/einkauf'); await snap('04-haushalt-einkaeufe'); });
await step('vorraete', async () => { await open('/vorraete'); await snap('05-haushalt-vorraete'); });
await step('ausgaben', async () => { await open('/ausgaben'); await snap('06-finanzen-ausgaben'); });
await step('fixkosten', async () => { await open('/abos'); await snap('07-finanzen-fixkosten'); });
await step('pinnwand', async () => { await open('/pinnwand'); await snap('08-austausch-pinnwand'); });
await step('chat', async () => { await open('/chat', 9800); await snap('09-austausch-chat'); });
await step('kalender', async () => { await open('/kalender'); await snap('10-austausch-kalender'); });
await step('kalender-monat', async () => { await open('/kalender'); await pg.getByText('Monat', { exact: true }).first().click(); await pg.waitForTimeout(800); await snap('19-kalender-monat'); });

// ===== B. Overlays und Eingaben im Ausgangszustand =====
await step('putzen-dialog', async () => { await fresh(); await open('/putzen'); await pg.getByRole('button', { name: /Bad putzen/ }).first().click(); await pg.waitForTimeout(700); await snap('11-putzplan-erledigen-dialog'); });
await step('einkauf-eingabe', async () => { await fresh(); await open('/einkauf'); await pg.getByLabel('Artikel-Name').fill('2 Hafermilch'); await snap('12-einkaeufe-artikel-eingabe'); });
await step('einkauf-menue', async () => { await fresh(); await open('/einkauf'); await pg.getByRole('button', { name: 'Artikelaktionen: Hafermilch' }).click(); await pg.waitForTimeout(700); await snap('13-einkaeufe-artikelaktionen'); });
await step('vorraete-sheet', async () => { await fresh(); await open('/vorraete'); await pg.getByRole('button', { name: 'Schnell nachfüllen' }).click(); await pg.waitForTimeout(800); await snap('14-vorraete-schnell-nachfuellen'); });
await step('ausgabe-leer', async () => { await fresh(); await open('/ausgaben'); await pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click(); await pg.waitForTimeout(700); await snap('15-ausgabe-hinzufuegen-leer'); });
await step('ausgabe-gefuellt', async () => {
	await pg.getByLabel('Beschreibung').fill('Kinoabend'); await pg.getByLabel('Betrag').fill('24,00');
	await pg.getByRole('button', { name: 'Aufteilung: Manuell' }).click();
	await pg.getByLabel('Anteil Jona in Euro').fill('12,00'); await pg.getByLabel('Anteil Lea in Euro').fill('12,00');
	await snap('16-ausgabe-hinzufuegen-kinoabend');
});
await step('pinnwand-neu', async () => { await fresh(); await open('/pinnwand'); await pg.locator('button:has(svg.lucide-plus)').last().click(); await pg.waitForTimeout(900); await snap('17-pinnwand-beitrag-erstellen'); });
await step('chat-menue', async () => { await fresh(); await open('/chat', 9800); await pg.getByText('Bin um acht wieder da.').click(); await pg.waitForTimeout(700); await snap('18-chat-nachrichtenmenue'); });
await step('termin-neu', async () => { await fresh(); await open('/kalender'); await pg.locator('button:has(svg.lucide-plus)').last().click(); await pg.waitForTimeout(900); await snap('20-kalender-termin-erstellen'); });

// ===== C1. Abhaken: Hafermilch =====
await step('abhaken', async () => {
	await fresh(); await open('/einkauf');
	await pg.getByRole('checkbox', { name: 'Hafermilch erledigen' }).click(); await pg.waitForTimeout(1500);
	await snap('21-einkaeufe-nach-abhaken');
	await pg.locator('summary', { hasText: /Erledigt/ }).click(); await pg.waitForTimeout(500); await snap('22-einkaeufe-nach-abhaken-erledigt-offen');
	await open(''); await snap('23-start-nach-abhaken');
});
// ===== C2. Ausgabe erfassen: Kinoabend (Jona bezahlt, Jona und Lea) =====
await step('ausgabe', async () => {
	await fresh(); await open('/ausgaben');
	await pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click();
	await pg.getByLabel('Beschreibung').fill('Kinoabend'); await pg.getByLabel('Betrag').fill('24,00');
	await pg.getByRole('button', { name: 'Aufteilung: Manuell' }).click();
	await pg.getByLabel('Anteil Jona in Euro').fill('12,00'); await pg.getByLabel('Anteil Lea in Euro').fill('12,00');
	await pg.getByRole('button', { name: 'Ausgabe speichern' }).click();
	await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(900);
	await snap('24-ausgaben-nach-speichern-meldung');
	await open('/ausgaben'); await snap('26-ausgaben-nach-speichern');
	await open(''); await snap('27-start-nach-ausgabe');
});
// ===== C3. Antworten im Chat =====
await step('antworten', async () => {
	await fresh(); await open('/chat', 9800);
	await pg.getByText('Bin um acht wieder da.').click(); await pg.waitForTimeout(600);
	await pg.getByRole('menuitem', { name: 'Antworten' }).click(); await pg.waitForTimeout(700);
	await snap('28-chat-antwort-vorbereitet');
	await pg.getByPlaceholder('Nachricht schreiben').fill('Passt, ich bin auch da.'); await snap('29-chat-antwort-getippt');
	await pg.getByRole('button', { name: 'Nachricht senden' }).click(); await pg.waitForTimeout(1500); await snap('30-chat-nach-antwort');
});
// ===== C4. Putzplan erledigen =====
await step('erledigen', async () => {
	await fresh(); await open('/putzen');
	await pg.getByRole('button', { name: /Bad putzen/ }).first().click(); await pg.waitForTimeout(600);
	await pg.getByRole('button', { name: 'Erledigt bestätigen' }).click(); await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(2200);
	await snap('31-putzplan-nach-erledigen');
	await open(''); await snap('32-start-nach-erledigen');
});
// ===== C5. Pinnwand: Kommentarfeld =====
await step('kommentar', async () => {
	await fresh(); await open('/pinnwand');
	await pg.locator('button:has(svg.lucide-message-circle)').last().click(); await pg.waitForTimeout(800); await snap('33-pinnwand-kommentieren');
});

// ===== D. Laden, Installationshinweis, Dunkel, Einstieg =====
await step('laedt', async () => {
	await fresh(); await pg.route('**/api/wg/MTE8PZAT/dashboard', async (r) => { await new Promise((res) => setTimeout(res, 8000)); await r.continue(); });
	await pg.goto(`${WG}`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(1200); await snap('34-start-laedt', { noDoc: true });
});
for (const [os, n] of [['ios', 35], ['android', 36]]) await step('install-' + os, async () => {
	await fresh({ ua: os, noInstallApi: true }); await open('', 2600); await snap(`${n}-start-installhinweis-${os}`);
	await pg.getByRole('button', { name: 'So installierst du ManaWG' }).click(); await pg.waitForTimeout(900); await snap(`${n + 2}-installanleitung-${os}`);
});
await step('install-desktop', async () => { await fresh({ noInstallApi: true }); await open('', 2600); await pg.getByRole('button', { name: 'So installierst du ManaWG' }).click(); await pg.waitForTimeout(900); await snap('39-installanleitung-desktop'); });
await step('dunkel', async () => { await fresh({ dark: true }); await open(''); await snap('40-start-dunkel'); await open('/ausgaben'); await snap('41-ausgaben-dunkel'); });
await step('einstieg', async () => {
	await fresh(); await pg.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(1500); await snap('42-einstieg-start');
	await pg.goto(`${BASE}/neu`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(1500); await snap('43-einstieg-neue-wg');
});


// ===== E. Öffentliche Entdecken-Seiten der App (Quelle der Landing-Beispieltexte: PublicModulePreview.tsx) =====
await step('entdecken', async () => {
	await fresh();
	let n = 44;
	for (const slug of ['ausgaben', 'einkauf', 'putzen', 'pinnwand', 'fixkosten', 'vorraete', 'kalender', 'chat', 'aktivitaet', 'mahnungen']) {
		await pg.goto(`${BASE}/entdecken/${slug}`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(1200);
		await snap(`${n++}-entdecken-${slug}`);
	}
});


// ===== F. Weitere Zustände (54+) =====
const kino = async () => {
	await pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click();
	await pg.getByLabel('Beschreibung').fill('Kinoabend'); await pg.getByLabel('Betrag').fill('24,00');
	await pg.getByRole('button', { name: 'Aufteilung: Manuell' }).click();
	await pg.getByLabel('Anteil Jona in Euro').fill('12,00'); await pg.getByLabel('Anteil Lea in Euro').fill('12,00');
	await pg.getByRole('button', { name: 'Ausgabe speichern' }).click();
	await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(900);
};
await step('einkauf-ausgabe', async () => {
	await fresh(); await open('/einkauf');
	await pg.getByRole('checkbox', { name: 'Hafermilch erledigen' }).click(); await pg.waitForTimeout(1500);
	await pg.getByRole('link', { name: 'Ausgabe erfassen' }).first().click(); await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(1200);
	await snap('54-einkaeufe-ausgabe-erfassen-vorbefuellt');
});
await step('ausgleichen', async () => {
	await fresh(); await open('/ausgaben'); await kino();
	await pg.getByRole('button', { name: 'Ausgleichen' }).first().click(); await pg.waitForTimeout(900);
	await snap('55-ausgaben-ausgleichen-dialog');
	const ok = pg.getByRole('button', { name: /als bezahlt eintragen/ }).first();
	if (await ok.count()) { await ok.click(); await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(1500); await snap('64-ausgaben-nach-ausgleichen'); }
});
await step('verteilung', async () => {
	await fresh(); await open('/putzen');
	await pg.getByText('So wird verteilt').first().click(); await pg.waitForTimeout(700);
	await snap('56-putzplan-verteilung-offen');
});
await step('vorraete-minus', async () => {
	await fresh(); await open('/vorraete');
	await pg.locator('button[aria-label$="verringern"]').first().click(); await pg.waitForTimeout(1300);
	await snap('57-vorraete-nach-minus');
});
await step('ausgabe-menue', async () => {
	await fresh(); await open('/ausgaben');
	await pg.locator('button[aria-label^="Aktionen für"]').first().click(); await pg.waitForTimeout(700);
	await snap('58-ausgaben-aktionen-menue');
});
await step('konto', async () => {
	await fresh(); await open('');
	await pg.locator('header a[aria-label^="Konto"]').click(); await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(1500);
	await snap('59-konto');
});
await step('vorraete-neu', async () => {
	await fresh(); await open('/vorraete');
	await pg.locator('button:has(svg.lucide-plus)').last().click(); await pg.waitForTimeout(900);
	await snap('60-vorraete-hinzufuegen');
});
await step('putzen-aktionen', async () => {
	await fresh(); await open('/putzen');
	await pg.getByRole('button', { name: /Aufgabenaktionen: Bad putzen/ }).click(); await pg.waitForTimeout(800);
	await snap('61-putzplan-aufgabenaktionen');
});
await step('putzen-neu', async () => {
	await fresh(); await open('/putzen');
	await pg.locator('button:has(svg.lucide-plus)').last().click(); await pg.waitForTimeout(900);
	await snap('62-putzplan-aufgabe-hinzufuegen');
});
await step('fixkosten-offen', async () => {
	await fresh(); await open('/abos');
	await pg.locator('main li svg.lucide-chevron-down').first().click(); await pg.waitForTimeout(800);
	await snap('63-fixkosten-aufgeklappt');
});


// ===== G. Dunkel (Landing-Szenen mit dunklem Handy) =====
await step('dunkel-seiten', async () => {
	await fresh({ dark: true });
	await open('/einkauf'); await snap('65-haushalt-einkaeufe-dunkel');
	await open('/putzen'); await snap('66-haushalt-putzplan-dunkel');
	await open('/vorraete'); await snap('72-haushalt-vorraete-dunkel');
	await open('/pinnwand'); await snap('68-austausch-pinnwand-dunkel');
	await open('/kalender'); await snap('71-austausch-kalender-dunkel');
	await open('/chat', 9800); await snap('67-austausch-chat-dunkel');
});
await step('dunkel-dialog', async () => {
	await fresh({ dark: true }); await open('/putzen');
	await pg.getByRole('button', { name: /Bad putzen/ }).first().click(); await pg.waitForTimeout(700); await snap('70-putzplan-erledigen-dialog-dunkel');
});
await step('dunkel-ausgabe', async () => {
	await fresh({ dark: true }); await open('/ausgaben');
	await pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click();
	await pg.getByLabel('Beschreibung').fill('Kinoabend'); await pg.getByLabel('Betrag').fill('24,00');
	await pg.getByRole('button', { name: 'Aufteilung: Manuell' }).click();
	await pg.getByLabel('Anteil Jona in Euro').fill('12,00'); await pg.getByLabel('Anteil Lea in Euro').fill('12,00');
	await snap('69-ausgabe-hinzufuegen-kinoabend-dunkel');
});

writeFileSync(`${DATA}/_errors.json`, JSON.stringify(errors, null, 1));
console.log('\nFertig:', done.length, 'Zustände;', errors.length, 'Meldungen');
console.log([...new Set(errors)].join('\n'));
await b.close();
