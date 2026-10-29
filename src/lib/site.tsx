import { getAppUrl } from '@/lib/app-url';
import { type Locale, OG_LOCALE, languageAlternates } from '@/lib/locale';
import { schemaIds } from '@/lib/schema-ids';
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
		feed: '/feed.xml',
		ogAlt: 'Das ManaWG-Zeichen als 3D-Körper',
	},
	en: {
		title: 'Free flat-share app: expenses, cleaning rota & shopping | ManaWG',
		description:
			'The free, ad-free app for shared flats, in English and German: split expenses, run a cleaning rota and shop together. In the browser, no app store needed.',
		path: '/en',
		feed: '/en/feed.xml',
		ogAlt: 'The ManaWG mark as a 3D object',
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
	const { title, description, path, feed, ogAlt } = TEXT[locale];
	const languages = languageAlternates('/', '/en');
	return {
		metadataBase: new URL(appUrl),
		title,
		description,
		authors: [{ name: 'ManaWG' }],
		applicationName: 'ManaWG',
		alternates: {
			canonical: path,
			...(languages ? { languages } : {}),
			types: { 'application/atom+xml': feed },
		},
		robots: { index: true, follow: true },
		openGraph: {
			title,
			description,
			url: path,
			siteName: 'ManaWG',
			locale: OG_LOCALE[locale],
			type: 'website',
			images: [{ url: '/og.png?v=2', width: 1200, height: 630, alt: ogAlt }],
		},
		twitter: { card: 'summary_large_image', title, description, images: ['/og.png?v=2'] },
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
	themeColor: '#0a0a0a',
	colorScheme: 'dark',
};

/** Contents of <head>: preloads for the fonts of the first paint, then the two site-wide JSON-LD blocks. */
export function SiteHead({ locale }: { locale: Locale }) {
	return (
		<head>
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
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of static constants, no user content
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema(locale)) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of static constants, no user content
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
			/>
		</head>
	);
}
