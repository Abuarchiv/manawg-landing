import { type Locale, OG_LOCALE, languageAlternates } from '@/lib/locale';
import type { Metadata } from 'next';

const OG_ALT: Record<Locale, string> = {
	de: 'Das ManaWG-Zeichen als 3D-Körper',
	en: 'The ManaWG mark as a 3D object',
};

/** Metadata of a legal page. `path` is this page, `counterpart` the page in the other language. */
export function legalMetadata({
	locale,
	path,
	counterpart,
	title,
	description,
}: {
	locale: Locale;
	path: string;
	counterpart: string;
	title: string;
	description: string;
}): Metadata {
	const other: Locale = locale === 'de' ? 'en' : 'de';
	const [dePath, enPath] = locale === 'de' ? [path, counterpart] : [counterpart, path];
	return {
		title,
		description,
		alternates: { canonical: path, languages: languageAlternates(dePath, enPath) ?? {} },
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
