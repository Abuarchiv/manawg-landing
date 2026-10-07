import { getAppUrl } from '@/lib/app-url';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const appUrl = getAppUrl();

const title = 'ManaWG: Ausgaben, Einkauf und Putzplan für eure WG';
const description =
	'Mit ManaWG teilt ihr Ausgaben, organisiert Einkäufe und verteilt Aufgaben im Putzplan. Die App ist kostenlos und läuft im Browser.';

const organizationSchema = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: 'ManaWG',
	url: appUrl,
	logo: `${appUrl}/icon-512.png`,
	description,
};

const softwareApplicationSchema = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	name: 'ManaWG',
	description,
	url: appUrl,
	applicationCategory: 'LifestyleApplication',
	operatingSystem: 'Web, iOS, Android',
	offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
};

export const metadata: Metadata = {
	metadataBase: new URL(appUrl),
	title,
	description,
	keywords: ['WG', 'Wohngemeinschaft', 'Ausgaben teilen', 'Putzplan', 'WG-App'],
	authors: [{ name: 'ManaWG' }],
	applicationName: 'ManaWG',
	alternates: { canonical: '/' },
	robots: { index: true, follow: true },
	openGraph: {
		title,
		description,
		url: '/',
		siteName: 'ManaWG',
		locale: 'de_DE',
		type: 'website',
		images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Das ManaWG-Zeichen als 3D-Körper' }],
	},
	twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
	// Bewusst kein Manifest: manawg.com ist die Werbeseite, installierbar ist nur app.manawg.com.
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon-32.png', sizes: '32x32' },
		],
		apple: '/apple-touch-icon.png',
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
					dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
