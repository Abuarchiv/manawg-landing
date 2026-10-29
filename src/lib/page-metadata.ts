import type { Metadata } from 'next';
import { type Locale, languageAlternates, OG_LOCALE, PATHS } from '@/lib/locale';

const OG_IMAGE = '/og.png?v=2';
const OG_ALT: Record<Locale, string> = {
	de: 'Das ManaWG-Zeichen als 3D-Körper',
	en: 'The ManaWG mark as a 3D object',
};

/**
 * Title, description, alternates, Open Graph and Twitter card of a page. Next replaces these
 * objects instead of merging them with the layout's, so every page needs all of them: a missing
 * field falls back to the home page (og:url, twitter:title) or drops the feed link.
 */
export function pageMetadata({
	locale,
	path,
	title,
	description,
	languages,
	image = { url: OG_IMAGE, alt: OG_ALT[locale] },
	article,
}: {
	locale: Locale;
	path: string;
	title: string;
	description: string;
	languages?: ReturnType<typeof languageAlternates>;
	image?: { url: string; alt: string };
	/** Publication and update time; makes og:type "article". */
	article?: { publishedTime: string; modifiedTime: string };
}): Metadata {
	return {
		title,
		description,
		alternates: {
			canonical: path,
			...(languages ? { languages } : {}),
			types: { 'application/atom+xml': PATHS[locale].feed },
		},
		openGraph: {
			title,
			description,
			url: path,
			siteName: 'ManaWG',
			locale: OG_LOCALE[locale],
			alternateLocale: OG_LOCALE[locale === 'de' ? 'en' : 'de'],
			...(article ? { type: 'article', ...article } : { type: 'website' }),
			images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }],
		},
		twitter: { title, description, images: [image.url] },
	};
}

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
	const paths = LEGAL_PAGES[page];
	return pageMetadata({
		locale,
		path: paths[locale].path,
		title,
		description,
		languages: languageAlternates(paths.de.path, paths.en.path),
	});
}
