// Which language a visitor sees on arrival. German stays the site's default; a visitor whose system
// prefers another language is sent to the English counterpart once, on entry from outside the site.
// Same rule as the app (apps/web/src/shared/i18n/locale.ts): the first supported language wins,
// English when the system only names languages we do not offer.

import { type Locale, counterpartPath } from './locale.ts';

export const LOCALE_COOKIE = 'manawg_locale';

const isLocale = (value: unknown): value is Locale => value === 'de' || value === 'en';

/** Crawlers and link previews keep the URL they asked for, so every page stays indexable in its language. */
const BOT =
	/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|lighthouse|headless/i;

export function preferredLocale(header: string | null | undefined): Locale | null {
	if (!header) return null;
	const entries = header.split(',').map((part, index) => {
		const [tag = '', ...params] = part.trim().split(';');
		const qParam = params.map((p) => p.trim()).find((p) => p.toLowerCase().startsWith('q='));
		const q = qParam ? Number(qParam.slice(2)) : 1;
		return { primary: tag.trim().toLowerCase().split('-')[0] ?? '', q, index };
	});
	const ranked = entries
		.filter((entry) => Number.isFinite(entry.q) && entry.q > 0)
		.sort((a, b) => b.q - a.q || a.index - b.index);
	const match = ranked.find((entry) => isLocale(entry.primary));
	if (match && isLocale(match.primary)) return match.primary;
	const namesLanguage = ranked.some((entry) => /^[a-z]{2,3}$/.test(entry.primary));
	const refusesEnglish = entries.some((entry) => entry.primary === 'en' && entry.q === 0);
	return namesLanguage && !refusesEnglish ? 'en' : null;
}

export function languageDecision(req: {
	path: string;
	cookie: string | undefined;
	acceptLanguage: string | null;
	userAgent: string | null;
	referer: string | null;
	origin: string;
}): { redirect?: string; remember?: Locale } {
	const counterpart = counterpartPath(req.path);
	if (!counterpart) return {};
	const here: Locale = req.path === '/en' || req.path.startsWith('/en/') ? 'en' : 'de';

	let from: string | null = null;
	try {
		const ref = req.referer ? new URL(req.referer) : null;
		if (ref?.origin === req.origin) from = ref.pathname;
	} catch {}
	// Inside the site nothing moves; arriving from this page's counterpart is the language switch.
	if (from !== null) return from === counterpart ? { remember: here } : {};

	if (here === 'en' || (req.userAgent && BOT.test(req.userAgent))) return {};
	const wanted = isLocale(req.cookie) ? req.cookie : preferredLocale(req.acceptLanguage);
	return wanted === 'en' ? { redirect: counterpart } : {};
}
