import { getAppUrl } from '@/lib/app-url';
import { schemaIds } from '@/lib/schema-ids';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const appUrl = getAppUrl();
const ids = schemaIds();

const title = 'Kostenlose WG-App: Ausgaben, Putzplan & Einkauf | ManaWG';
const description =
	'Die kostenlose, werbefreie WG-App auf Deutsch: Ausgaben teilen, Putzplan organisieren und gemeinsam einkaufen. Für eure WG im Browser – ohne App-Store.';

const organizationSchema = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': ids.organisation,
	name: 'ManaWG',
	url: ids.site,
	logo: { '@type': 'ImageObject', url: `${appUrl}/icon-512.png`, width: 512, height: 512 },
	image: `${appUrl}/og.png`,
	description,
	email: 'info@manawg.com',
	contactPoint: {
		'@type': 'ContactPoint',
		contactType: 'customer support',
		email: 'info@manawg.com',
		availableLanguage: 'de',
	},
	// Verknüpft die Marke mit ihren offiziellen Profilen (Abgrenzung zu gleichnamigen WireGuard-Projekten).
	sameAs: ['https://github.com/Abuarchiv/manawg-landing'],
};

const webSiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': ids.webseite,
	name: 'ManaWG',
	alternateName: ['Mana WG', 'ManaWG App'],
	url: ids.site,
	inLanguage: 'de-DE',
	publisher: { '@id': ids.organisation },
};

export const metadata: Metadata = {
	metadataBase: new URL(appUrl),
	title,
	description,
	keywords: ['WG', 'Wohngemeinschaft', 'Ausgaben teilen', 'Putzplan', 'WG-App'],
	authors: [{ name: 'ManaWG' }],
	applicationName: 'ManaWG',
	alternates: { canonical: '/', types: { 'application/atom+xml': '/feed.xml' } },
	robots: { index: true, follow: true },
	openGraph: {
		title,
		description,
		url: '/',
		siteName: 'ManaWG',
		locale: 'de_DE',
		type: 'website',
		images: [
			{ url: '/og.png?v=2', width: 1200, height: 630, alt: 'Das ManaWG-Zeichen als 3D-Körper' },
		],
	},
	twitter: { card: 'summary_large_image', title, description, images: ['/og.png?v=2'] },
	// Bewusst kein Manifest: manawg.com ist die Werbeseite, installierbar ist nur app.manawg.com.
	icons: {
		// ?v=2 erzwingt, dass Suchmaschinen die Symbole neu laden (Google behält Favicons wochenlang)
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

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	themeColor: '#0a0a0a',
	colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="de" suppressHydrationWarning>
			<head>
				{/* Schriften des ersten Bildes (H1, Lader-Ziffern) sofort anfordern, nicht erst nach dem CSS-Parse */}
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
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify statischer Konstanten, kein Nutzerinhalt
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
				/>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify statischer Konstanten, kein Nutzerinhalt
					dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
