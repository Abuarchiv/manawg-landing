import { JsonLd } from '@/components/JsonLd';
import { getAppUrl } from '@/lib/app-url';
import { type Locale, languageAlternates } from '@/lib/locale';
import { pageMetadata } from '@/lib/page-metadata';
import { schemaIds } from '@/lib/schema-ids';
import { THEME_COLOR, THEME_SCRIPT } from '@/lib/theme';
import type { Metadata, Viewport } from 'next';

// Parts of the root layout shared by the German and the English tree.

const appUrl = getAppUrl();
const ids = schemaIds();

const TEXT = {
	de: {
		title: 'Kostenlose WG-App: Ausgaben, Putzplan & Einkauf | ManaWG',
		description:
			'Die kostenlose, werbefreie WG-App auf Deutsch: Ausgaben teilen, Putzplan organisieren und gemeinsam einkaufen. Für eure WG im Browser – ohne App-Store.',
		path: '/',
	},
	en: {
		title: 'Free flatmate app: split bills, rota & shopping | ManaWG',
		description:
			'The free, ad-free and open-source app for flatmates and roommates: split bills, run a cleaning rota and shop together. In English and German, in the browser.',
		path: '/en',
	},
} as const;

function organizationSchema(locale: Locale) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ids.organisation,
		name: 'ManaWG',
		url: ids.site,
		logo: { '@type': 'ImageObject', url: `${appUrl}/icon-512.png`, width: 512, height: 512 },
		image: `${appUrl}/og.png`,
		description: TEXT[locale].description,
		email: 'info@manawg.com',
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer support',
			email: 'info@manawg.com',
			availableLanguage: ['de', 'en'],
		},
		// Operator named in the legal notice
		founder: { '@type': 'Person', name: 'Abubakar Abditube' },
		sameAs: ['https://github.com/Abuarchiv/manawg', 'https://github.com/Abuarchiv/manawg-landing'],
	};
}

const webSiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': ids.website,
	name: 'ManaWG',
	alternateName: ['Mana WG', 'ManaWG App'],
	url: ids.site,
	inLanguage: ['de-DE', 'en-GB'],
	publisher: { '@id': ids.organisation },
};

export function siteMetadata(locale: Locale): Metadata {
	const { title, description, path } = TEXT[locale];
	return {
		metadataBase: new URL(appUrl),
		...pageMetadata({
			locale,
			path,
			title,
			description,
			languages: languageAlternates('/', '/en'),
		}),
		authors: [{ name: 'ManaWG' }],
		applicationName: 'ManaWG',
		robots: { index: true, follow: true },
		// Deliberately no manifest: manawg.com is the marketing site, only app.manawg.com is installable.
		icons: {
			// ?v=2 forces search engines to reload the icons (Google keeps favicons for weeks)
			icon: [
				{ url: '/favicon.ico?v=2', sizes: '48x48' },
				{ url: '/favicon.svg?v=2', type: 'image/svg+xml' },
				{ url: '/favicon-96.png?v=2', sizes: '96x96', type: 'image/png' },
				{ url: '/icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
				{ url: '/icon-512.png?v=2', sizes: '512x512', type: 'image/png' },
			],
			shortcut: '/favicon.ico?v=2',
			apple: { url: '/apple-touch-icon.png?v=2', sizes: '180x180' },
		},
		formatDetection: { telephone: false },
	};
}

export const siteViewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	themeColor: THEME_COLOR.dark,
	colorScheme: 'dark light',
};

/** Contents of <head>: preloads for the fonts of the first paint, then the two site-wide JSON-LD blocks. */
export function SiteHead({ locale }: { locale: Locale }) {
	return (
		<head>
			<script
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static constant, sets the theme before the first paint
				dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
			/>
			{/* Request the fonts of the first paint (H1, loader digits) now, not after the CSS parse */}
			<link
				rel="preload"
				as="font"
				type="font/woff2"
				href="/fonts/inter-tight-latin.woff2"
				crossOrigin="anonymous"
			/>
			<link
				rel="preload"
				as="font"
				type="font/woff2"
				href="/fonts/jetbrains-mono-latin.woff2"
				crossOrigin="anonymous"
			/>
			<JsonLd data={organizationSchema(locale)} />
			<JsonLd data={webSiteSchema} />
		</head>
	);
}
