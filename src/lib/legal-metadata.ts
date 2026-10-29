import { type Locale, OG_LOCALE, languageAlternates } from '@/lib/locale';
import type { Metadata } from 'next';

export type LegalPageId = 'notice' | 'privacy' | 'terms';

/** The three legal pages per language: path and short name (footer links). */
export const LEGAL_PAGES: Record<LegalPageId, Record<Locale, { path: string; name: string }>> = {
	notice: {
		de: { path: '/impressum', name: 'Impressum' },
		en: { path: '/en/legal-notice', name: 'Legal notice' },
	},
	privacy: {
		de: { path: '/datenschutz', name: 'Datenschutz' },
		en: { path: '/en/privacy', name: 'Privacy policy' },
	},
	terms: {
		de: { path: '/agb', name: 'Nutzungsbedingungen' },
		en: { path: '/en/terms', name: 'Terms' },
	},
};

const OG_ALT: Record<Locale, string> = {
	de: 'Das ManaWG-Zeichen als 3D-Körper',
	en: 'The ManaWG mark as a 3D object',
};

/** Metadata of a legal page, with the page in the other language as alternate. */
export function legalMetadata({
	locale,
	page,
	title,
	description,
}: {
	locale: Locale;
	page: LegalPageId;
	title: string;
	description: string;
}): Metadata {
	const other: Locale = locale === 'de' ? 'en' : 'de';
	const path = LEGAL_PAGES[page][locale].path;
	return {
		title,
		description,
		alternates: {
			canonical: path,
			languages: languageAlternates(LEGAL_PAGES[page].de.path, LEGAL_PAGES[page].en.path) ?? {},
		},
		// openGraph is not merged with the layout, so it is spelled out in full: og:url would point at the home page otherwise.
		openGraph: {
			title,
			description,
			url: path,
			siteName: 'ManaWG',
			locale: OG_LOCALE[locale],
			alternateLocale: OG_LOCALE[other],
			type: 'website',
			images: [{ url: '/og.png?v=2', width: 1200, height: 630, alt: OG_ALT[locale] }],
		},
	};
}
