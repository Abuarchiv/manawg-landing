// Languages of the site, the German-English path pairs and helpers built on them.
// German keeps its current URLs; English lives under /en with English slugs.

export type Locale = 'de' | 'en';

export const HTML_LANG: Record<Locale, string> = { de: 'de', en: 'en-GB' };
export const IN_LANGUAGE = { de: 'de-DE', en: 'en-GB' } as const;
export const OG_LOCALE = { de: 'de_DE', en: 'en_GB' } as const;
export const INTL_LOCALE = { de: 'de-DE', en: 'en-GB' } as const;

/** Pages that exist once per language outside the topic system, as [German path, English path]. */
export const STATIC_PAIRS: ReadonlyArray<readonly [de: string, en: string]> = [
	['/', '/en'],
	['/ratgeber', '/en/guides'],
	['/impressum', '/en/legal-notice'],
	['/datenschutz', '/en/privacy'],
	['/agb', '/en/terms'],
];

/** German topic slug to English topic slug. A bijection; the keys are exactly the German topics. */
export const TOPIC_SLUG_EN: Readonly<Record<string, string>> = {
	'wg-app': 'flat-share-app',
	putzplan: 'cleaning-rota',
	'wg-kasse': 'shared-expenses',
	einkaufsliste: 'shopping-list',
	'beste-wg-app': 'best-flat-share-app',
	'splitwise-alternative': 'splitwise-alternative',
	'splid-alternative': 'splid-alternative',
	'flatastic-alternative': 'flatastic-alternative',
	'tricount-alternative': 'tricount-alternative',
	'ourhome-alternative': 'ourhome-alternative',
	faq: 'faq',
	'ueber-manawg': 'about-manawg',
	'wg-kosten-aufteilen': 'split-flat-costs',
	'wg-miete-rechner': 'rent-split-calculator',
	'wg-nebenkosten': 'utilities-and-internet',
	'rundfunkbeitrag-wg': 'rundfunkbeitrag-shared-flat',
	'wg-haushaltskasse': 'household-kitty',
	'schulden-mitbewohner': 'flatmate-debts',
	'splitwise-splid-wechseln': 'switch-from-splitwise-or-splid',
	'splitwise-kostenlos': 'splitwise-free-limit',
	'wg-einkauf-organisieren': 'organise-flat-shopping',
	'mitbewohner-finden': 'find-a-flatmate',
	'putzplan-erstellen': 'make-a-cleaning-rota',
	'putzplan-vorlage': 'cleaning-rota-template',
	'wg-regeln': 'house-rules',
	'wg-streit-loesen': 'flatmate-conflict',
	'wg-abwesenheit-urlaub': 'holidays-and-time-away',
	'wg-casting-fragen': 'wg-casting-questions',
	'wg-zwischenmiete': 'subletting-a-room',
	'wg-gruenden-checkliste': 'start-a-flat-share',
	'wg-mietvertrag': 'flat-share-tenancy-agreement',
	'wg-einzug-checkliste': 'moving-in-checklist',
	'wg-anmeldung': 'anmeldung-shared-flat',
	'mitbewohner-kuendigen': 'asking-a-flatmate-to-leave',
	'wg-zimmer-kuendigen': 'give-notice-on-a-room',
	'wg-auszug-checkliste': 'moving-out-checklist',
	'open-source-wg-app': 'open-source-flat-share-app',
};

const EN_TO_DE: Readonly<Record<string, string>> = Object.fromEntries(
	Object.entries(TOPIC_SLUG_EN).map(([de, en]) => [en, de]),
);

export const toEnglishSlug = (de: string): string | undefined => TOPIC_SLUG_EN[de];
export const toGermanSlug = (en: string): string | undefined => EN_TO_DE[en];

/** Prefix an internal data link: de unchanged, en '/' -> '/en', '/x' -> '/en/x'. */
export function localiseHref(locale: Locale, href: string): string {
	if (locale === 'de') return href;
	return href === '/' ? '/en' : `/en${href}`;
}

/** Counterpart path of a site path, or null if none. */
export function counterpartPath(path: string): string | null {
	for (const [de, en] of STATIC_PAIRS) {
		if (path === de) return en;
		if (path === en) return de;
	}
	const german = path.slice(1);
	const english = toEnglishSlug(german);
	if (path.startsWith('/') && english) return `/en/${english}`;
	if (path.startsWith('/en/')) {
		const back = toGermanSlug(path.slice(4));
		if (back) return `/${back}`;
	}
	return null;
}

/** alternates.languages for a pair; undefined if a side is missing. */
export function languageAlternates(
	dePath: string,
	enPath: string | null | undefined,
): { de: string; en: string; 'x-default': string } | undefined {
	if (!enPath) return undefined;
	return { de: dePath, en: enPath, 'x-default': dePath };
}
