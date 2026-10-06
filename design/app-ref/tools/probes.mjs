// Misst Design-Tokens und Komponenten der echten App (über den Demo-Server) und schreibt data/probes.json.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('/Users/abu/Company/manawg-app/apps/web/package.json');
const { chromium } = require('@playwright/test');
const SCR = (process.env.SCR || './out');
const BASE = process.env.BASE || 'http://127.0.0.1:4241', WG = `${BASE}/wg/MTE8PZAT`;

const MEASURE = (list) => {
	const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1; const c = canvas.getContext('2d', { willReadFrequently: true });
	const hex = (v) => { if (!v || v === 'transparent' || v === 'rgba(0, 0, 0, 0)') return null; c.clearRect(0, 0, 1, 1); c.fillStyle = '#000'; c.fillStyle = v; c.fillRect(0, 0, 1, 1); const [r, g, b, a] = c.getImageData(0, 0, 1, 1).data; const h = (n) => n.toString(16).padStart(2, '0'); return a === 255 ? `#${h(r)}${h(g)}${h(b)}` : `#${h(r)}${h(g)}${h(b)}${h(a)}`; };
	const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
	const out = {};
	for (const [name, sel] of list) {
		let el = null; try { el = [...document.querySelectorAll(sel)].find(vis) || null; } catch (e) { out[name] = { error: e.message }; continue; }
		if (!el) { out[name] = null; continue; }
		const r = el.getBoundingClientRect(), s = getComputedStyle(el), pxs = (p) => s.getPropertyValue(p);
		const box = (p) => [pxs(`${p}-top`), pxs(`${p}-right`), pxs(`${p}-bottom`), pxs(`${p}-left`)].map((x) => x.replace('px', ''));
		const border = ['top', 'right', 'bottom', 'left'].map((d) => `${s.getPropertyValue(`border-${d}-width`)} ${s.getPropertyValue(`border-${d}-style`)} ${hex(s.getPropertyValue(`border-${d}-color`))}`);
		const o = {
			tag: el.tagName.toLowerCase(), slot: el.getAttribute('data-slot') || undefined,
			rect: [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100),
			display: s.display, position: s.position !== 'static' ? s.position : undefined,
			padding: box('padding').join(' '), margin: box('margin').join(' ').replace(/^0 0 0 0$/, ''),
			gap: s.gap !== 'normal' ? s.gap : undefined, flex: s.display.includes('flex') ? `${s.flexDirection}${s.flexWrap !== 'nowrap' ? ' ' + s.flexWrap : ''} · ai:${s.alignItems} jc:${s.justifyContent}` : undefined,
			bg: hex(s.backgroundColor), color: hex(s.color), border: border.every((b) => b === border[0]) ? border[0] : border.join(' | '),
			radius: s.borderTopLeftRadius === s.borderBottomRightRadius ? s.borderTopLeftRadius : `${s.borderTopLeftRadius} ${s.borderTopRightRadius} ${s.borderBottomRightRadius} ${s.borderBottomLeftRadius}`,
			shadow: s.boxShadow !== 'none' ? s.boxShadow : undefined, opacity: s.opacity !== '1' ? s.opacity : undefined,
			font: `${s.fontFamily.split(',')[0].replace(/"/g, '')} ${s.fontWeight} ${s.fontSize}/${s.lineHeight}${s.letterSpacing !== 'normal' ? ' ls ' + s.letterSpacing : ''}`,
			text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) || undefined,
		};
		if (el.tagName.toLowerCase() === 'svg') { o.stroke = s.strokeWidth; o.fill = s.fill; }
		if (s.fontVariantNumeric !== 'normal') o.numeric = s.fontVariantNumeric;
		if (s.textTransform !== 'none') o.transform = s.textTransform;
		if (s.textDecorationLine !== 'none') o.deco = s.textDecorationLine;
		out[name] = o;
	}
	return out;
};
const TOKENS = () => {
	const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1; const c = canvas.getContext('2d', { willReadFrequently: true });
	const hex = (v) => { c.clearRect(0, 0, 1, 1); c.fillStyle = '#000'; c.fillStyle = v; c.fillRect(0, 0, 1, 1); const [r, g, b, a] = c.getImageData(0, 0, 1, 1).data; const h = (n) => n.toString(16).padStart(2, '0'); return a === 255 ? `#${h(r)}${h(g)}${h(b)}` : `#${h(r)}${h(g)}${h(b)}${h(a)}`; };
	const names = ['background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground', 'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring', 'settled', 'text-2', 'text-3', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'border-strong', 'app-backdrop'];
	const probe = document.createElement('div'); document.body.appendChild(probe);
	const res = {};
	for (const n of names) {
		const raw = getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();
		probe.style.color = `var(--${n})`; const resolved = getComputedStyle(probe).color;
		res[n] = { raw, hex: hex(resolved) };
	}
	probe.remove();
	const r = getComputedStyle(document.documentElement);
	const dims = {}; for (const n of ['radius', 'app-frame-width', 'app-nav-height', 'spacing', 'font-sans', 'font-heading', 'font-mono', 'text-xs', 'text-sm', 'text-lg', 'text-2xl', 'text-3xl', 'text-5xl', 'font-inter', 'font-inter-tight', 'font-jetbrains-mono']) dims[n] = r.getPropertyValue(`--${n}`).trim();
	const radii = {}; for (const n of ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']) { const d = document.createElement('div'); d.style.borderRadius = `var(--radius-${n})`; document.body.appendChild(d); radii[n] = getComputedStyle(d).borderTopLeftRadius; d.remove(); }
	return { colors: res, dims, radii, rootFontSize: r.fontSize, bodyFont: getComputedStyle(document.body).fontFeatureSettings, bodyFontSize: getComputedStyle(document.body).fontSize, bodyLine: getComputedStyle(document.body).lineHeight, fonts: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`) };
};

const COMMON = [
	['html', 'html'], ['body', 'body'], ['frame', 'body > div.relative'], ['shell', 'div.group\\/wg-shell'],
	['header', 'header'], ['headerRow', 'header > div'], ['logoMark', 'header svg'], ['headerTitle', 'header h1, header p.font-heading'],
	['headerChatBtn', 'header a[aria-label^="Chat"]'], ['headerChatIcon', 'header a[aria-label^="Chat"] svg'], ['headerUserBtn', 'header a[aria-label^="Konto"]'],
	['bottomNav', 'nav[aria-label="WG Hauptnavigation"]'], ['bottomNavBox', 'nav[aria-label="WG Hauptnavigation"] > div'], ['bottomNavList', 'nav[aria-label="WG Hauptnavigation"] ul'],
	['bottomNavItem', 'nav[aria-label="WG Hauptnavigation"] li a:not([aria-current])'], ['bottomNavItemIcon', 'nav[aria-label="WG Hauptnavigation"] li a:not([aria-current]) svg'], ['bottomNavItemLabel', 'nav[aria-label="WG Hauptnavigation"] li a:not([aria-current]) span'],
	['bottomNavActive', 'nav[aria-label="WG Hauptnavigation"] a[aria-current]'], ['bottomNavActiveLabel', 'nav[aria-label="WG Hauptnavigation"] a[aria-current] span'], ['bottomNavActiveIcon', 'nav[aria-label="WG Hauptnavigation"] a[aria-current] svg'],
	['main', 'main'], ['mainContent', 'main > div'],
];
const SUBNAV = [['subNav', 'main nav[aria-label] ul'], ['subNavItem', 'main nav[aria-label] li a:not([aria-current])'], ['subNavActive', 'main nav[aria-label] a[aria-current="page"]'], ['subNavIcon', 'main nav[aria-label] a[aria-current="page"] svg'], ['subNavCount', 'main nav[aria-label] a[aria-current="page"] span.tabular-nums']];
const FAB = [['fab', 'button:has(svg.lucide-plus)']];
const SCREENS = {
	'/': [...COMMON, ['sectionH2', 'main section h2'], ['cardList', 'main section ul'], ['cardRow', 'main section ul li'], ['cardRowIcon', 'main section ul li > span:first-child'], ['cardRowIconSvg', 'main section ul li > span:first-child svg'], ['cardRowLink', 'main section ul li a'], ['cardRowTitle', 'main section ul li a > span > span:first-child'], ['cardRowDesc', 'main section ul li a > span > span:nth-child(2)'], ['cardRowChevron', 'main section ul li a svg'], ['weekLink', 'main a:has(> svg.lucide-chevron-right)'], ['disclosure', 'main button[aria-expanded]']],
	'/putzen': [...SUBNAV, ['sectionLabel', 'main p.text-muted-foreground, main h2'], ['list', 'main ul'], ['item', 'li[data-slot="item"]'], ['avatar', 'span.inline-flex.rounded-full.border'], ['itemTitle', '[data-slot="item-title"]'], ['itemDesc', '[data-slot="item-description"]'], ['checkDue', 'button[aria-label^="Als erledigt markieren"]'], ['checkDueIcon', 'button[aria-label^="Als erledigt markieren"] svg'], ['checkOpen', 'li:nth-child(2) button[aria-label^="Als erledigt markieren"]'], ['moreBtn', 'button[aria-label^="Aufgabenaktionen"]'], ['moreIcon', 'button[aria-label^="Aufgabenaktionen"] svg'], ...FAB, ['monthCard', '[data-slot="card"]']],
	'/einkauf': [...SUBNAV, ['list', 'ul[aria-label="Einkaufsartikel"], main ul'], ['item', '[data-slot="item"]'], ['checkbox', '[data-slot="checkbox"]'], ['itemTitle', '[data-slot="item-title"]'], ['itemDesc', '[data-slot="item-description"]'], ['moreBtn', 'button[aria-label^="Artikelaktionen"]'], ['doneSummary', 'summary'], ['alert', '[data-slot="alert"]'], ['alertBtn', '[data-slot="alert"] a, [data-slot="alert"] button'], ['addInput', 'input[aria-label="Artikel-Name"]'], ['addBtn', 'button[aria-label="Artikel hinzufügen"]']],
	'/vorraete': [...SUBNAV, ['quickBtn', 'button:has(svg.lucide-zap)'], ['groupLabel', 'main h2, main h3'], ['item', '[data-slot="item"]'], ['itemTitle', '[data-slot="item-title"]'], ['itemDesc', '[data-slot="item-description"]'], ['stepper', 'button[aria-label$="verringern"]'], ['stepperIcon', 'button[aria-label$="verringern"] svg'], ['editBtn', 'button[aria-label$="bearbeiten"]'], ['deleteBtn', 'button[aria-label$="entfernen"]'], ...FAB],
	'/ausgaben': [...SUBNAV, ['saldoCard', '[data-slot="card"]'], ['saldoLabel', '[data-slot="card"] p, [data-slot="card"] span'], ['bellBtn', 'button:has(svg.lucide-bell), a:has(svg.lucide-bell)'], ['memberRowStatus', '[data-slot="card"] .font-mono'], ['weekLabel', 'main section h3'], ['expenseList', 'main section ul'], ['expenseRow', 'main section ul li [data-slot="item"]'], ['expenseTitle', 'main section ul li span.font-medium'], ['expenseDesc', 'main section ul li span.text-muted-foreground.leading-normal'], ['expenseAmount', 'main section ul li span.font-mono'], ['avatar', 'main section ul li span.rounded-full.border'], ['moreBtn', 'button[aria-label^="Aktionen für"]'], ['importLink', 'a[href*="import"], a:has(svg.lucide-file-input), a:has(svg.lucide-file-down)'], ...FAB],
	'/abos': [...SUBNAV, ['statCard', '[data-slot="card"]'], ['statLabel', '[data-slot="card"] p'], ['statValue', '[data-slot="card"] .font-mono'], ['row', 'main li'], ['rowTitle', 'main li span.font-medium'], ['rowAmount', 'main li span.font-mono'], ['rowDesc', 'main li span.text-muted-foreground'], ['avatar', 'main li span.rounded-full.border'], ['chevron', 'main li svg.lucide-chevron-down'], ...FAB],
	'/pinnwand': [...SUBNAV, ['card', 'main article, main [data-slot="card"], main li'], ['author', 'main article span.font-medium, main li span.font-medium'], ['content', 'main article p, main li p'], ['gesehen', 'button:has(svg.lucide-eye)'], ['commentBtn', 'button:has(svg.lucide-message-circle)'], ...FAB],
	'/kalender': [...SUBNAV, ['viewToggle', 'main button:has(svg.lucide-list)'], ['viewToggleItem', 'main button:has(svg.lucide-calendar-days)'], ['dayList', 'main ul[aria-label]'], ['dayRow', 'main ul[aria-label] li > button, main ul[aria-label] li > a'], ['dayTitle', 'main ul[aria-label] li span.font-medium'], ['dayMeta', 'main ul[aria-label] li span.text-muted-foreground'], ['dateCol', 'main li h3'], ['dateColNum', 'main li h3 span.font-semibold'], ['subscribe', 'main details'], ['subscribeSummary', 'main details summary'], ...FAB],
	'/chat': [...SUBNAV, ['chatFrame', '[data-chat-frame]'], ['dateSep', '[data-slot="marker-content"]'], ['bubbleOther', '[data-slot="bubble"][data-variant="secondary"]'], ['bubbleOtherContent', '[data-slot="bubble"][data-variant="secondary"] [data-slot="bubble-content"]'], ['messageAvatar', '[data-slot="message-avatar"]'], ['senderName', '[data-slot="message-header"]'], ['bubbleOwn', '[data-slot="bubble"][data-variant="default"]'], ['bubbleOwnContent', '[data-slot="bubble"][data-variant="default"] [data-slot="bubble-content"]'], ['replyQuote', '[data-slot="bubble-content"] span.border-s-2'], ['bubbleTime', '[data-slot="bubble-content"] time'], ['composer', 'textarea, input[placeholder="Nachricht schreiben"]'], ['sendBtn', 'button[aria-label="Nachricht senden"]']],
};

const b = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'de-DE', timezoneId: 'Europe/Berlin', serviceWorkers: 'block', colorScheme: 'light' });
await ctx.addInitScript(() => localStorage.setItem('manawg_identity:989ac820-58b7-431f-9c65-28721264f333', JSON.stringify({ memberId: '7d898f9e-5ad7-4f5d-abed-8c3e99a76973', name: 'Jona', memberToken: 'fixture-member-token' })));
const pg = await ctx.newPage();
await pg.goto(`${BASE}/demo-reset`);
const result = { screens: {} };
for (const [path, list] of Object.entries(SCREENS)) {
	await pg.goto(`${WG}${path === '/' ? '' : path}`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(path === '/chat' ? 9800 : 1500);
	result.screens[path] = await pg.evaluate(MEASURE, list);
	if (path === '/') { result.tokens = await pg.evaluate(TOKENS); await pg.evaluate(() => document.documentElement.classList.add('dark')); result.tokensDark = await pg.evaluate(TOKENS); await pg.evaluate(() => document.documentElement.classList.remove('dark')); }
}
// Overlays: Dialog, Sheet, Alert-Dialog, Toast-Banner, Menü
await pg.goto(`${WG}/putzen`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(1200);
await pg.getByRole('button', { name: /Bad putzen/ }).first().click(); await pg.waitForTimeout(800);
result.screens['dialog:putzen'] = await pg.evaluate(MEASURE, [['popup', '[role="alertdialog"], [role="dialog"]'], ['backdrop', '[data-slot*="overlay"], [data-slot*="backdrop"]'], ['title', '[role="alertdialog"] h2, [role="dialog"] h2, [data-slot*="title"]'], ['desc', '[data-slot*="description"]'], ['primaryBtn', '[role="alertdialog"] button:first-of-type, [role="dialog"] button:first-of-type'], ['buttons', '[role="alertdialog"] button, [role="dialog"] button']]);
await pg.goto(`${WG}/einkauf`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(1200);
await pg.getByRole('button', { name: 'Artikelaktionen: Hafermilch' }).click(); await pg.waitForTimeout(900);
result.screens['sheet:einkauf'] = await pg.evaluate(MEASURE, [['popup', '[role="dialog"]'], ['handle', '[data-slot="drawer-handle"], [role="dialog"] > div:first-child'], ['title', '[role="dialog"] h2, [data-slot*="title"]'], ['desc', '[data-slot*="description"]'], ['destructive', '[role="dialog"] button'], ['closeBtn', '[role="dialog"] button:last-of-type']]);
await pg.goto(`${WG}/ausgaben`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(1200);
await pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click(); await pg.waitForTimeout(900);
await pg.getByLabel('Beschreibung').fill('Kinoabend'); await pg.getByLabel('Betrag').fill('24,00');
result.screens['form:ausgabe'] = await pg.evaluate(MEASURE, [['page', '[role="dialog"]'], ['topbar', '[role="dialog"] > div:first-child, [role="dialog"] header'], ['topbarTitle', '[role="dialog"] h2'], ['label', '[data-slot="field-label"]'], ['input', 'input[type="text"]'], ['amountInput', 'input[inputmode="decimal"]'], ['select', 'select'], ['segmented', '[data-slot="toggle-group"]'], ['segmentedItem', '[data-slot="toggle-group-item"][aria-pressed="false"]'], ['segmentedActive', '[data-slot="toggle-group-item"][aria-pressed="true"]'], ['shareItem', '[role="list"] [data-slot="item"]'], ['shareBadge', '[data-slot="badge"]'], ['saveBtn', 'button[type="submit"]'], ['cancelBtn', 'button:not([type="submit"])'].slice(0, 0)].filter((p) => p.length));
await pg.getByRole('button', { name: 'Ausgabe speichern' }).click().catch(() => {}); await pg.waitForTimeout(1500);
result.screens['alert:ausgaben-nach'] = await pg.evaluate(MEASURE, [['banner', '[data-slot="alert"], output'], ['saldoAmount', '[data-slot="card"] .font-mono'], ['debtRow', '[data-slot="card"] [data-slot="item"]'], ['debtBtn', '[data-slot="card"] button, [data-slot="card"] a'], ['expenseAmount', '[data-slot="item"] .font-mono.text-green-700, [data-slot="item"] .font-mono']]);
await b.close();
writeFileSync(`${SCR}/data/probes.json`, JSON.stringify(result, null, 1));
const missing = []; for (const [k, v] of Object.entries(result.screens)) for (const [n, m] of Object.entries(v)) if (m === null || m?.error) missing.push(`${k}:${n}${m?.error ? '(' + m.error.slice(0, 40) + ')' : ''}`);
console.log('Probes:', Object.values(result.screens).reduce((a, v) => a + Object.keys(v).length, 0), '| fehlend:', missing.join(', '));
