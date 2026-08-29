import { getAppUrl } from '@/lib/app-url';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';

const geist = Geist({
	subsets: ['latin'],
	variable: '--font-geist',
	display: 'swap',
});

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
	display: 'swap',
});

const instrumentSerif = Instrument_Serif({
	subsets: ['latin'],
	weight: ['400'],
	style: ['normal', 'italic'],
	variable: '--font-instrument-serif',
	display: 'swap',
});

const appUrl = getAppUrl();

const metaDescription =
	'Die WG-App für Ausgaben, Putzplan, Einkauf und Pinnwand. In Deutschland gehostet, DSGVO-konform, ohne Tracking.';

const organizationSchema = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: 'ManaWG',
	url: appUrl,
	logo: `${appUrl}/icon-512.png`,
	description:
		'Die WG-App für Ausgaben, Putzplan, Einkauf und Pinnwand. Kostenlos, kein Account, kein Tracking.',
};

const softwareApplicationSchema = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	name: 'ManaWG',
	description:
		'Die WG-App für Ausgaben, Putzplan, Einkauf und Pinnwand. Kostenlos, kein Account, kein Tracking.',
	url: appUrl,
	applicationCategory: 'LifestyleApplication',
	operatingSystem: 'Web, iOS, Android',
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'EUR',
	},
};

export const metadata: Metadata = {
	metadataBase: new URL(appUrl),
	title: 'ManaWG — Deine WG-App',
	description: metaDescription,
	keywords: ['WG', 'Wohngemeinschaft', 'Ausgaben teilen', 'Putzplan', 'WG App', 'DSGVO'],
	authors: [{ name: 'ManaWG' }],
	applicationName: 'ManaWG',
	alternates: {
		canonical: '/',
	},
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: 'ManaWG — Deine WG-App',
		description: metaDescription,
		type: 'website',
		locale: 'de_DE',
		siteName: 'ManaWG',
		images: [
			{
				url: '/opengraph-image',
				width: 1200,
				height: 630,
				alt: 'ManaWG — Die WG-App, die einfach funktioniert.',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ManaWG — Deine WG-App',
		description: 'Die WG-App, die einfach funktioniert.',
		images: ['/opengraph-image'],
	},
	// No manifest on purpose: manawg.com is the marketing site. The installable
	// app is app.manawg.com, which ships its own manifest and service worker.
	// Two installable origins would compete for the same "ManaWG" install —
	// that is exactly what sent PWA installs to this page instead of the app.
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
			{ url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
		],
		apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
	},
	formatDetection: {
		telephone: false,
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#2f5d4a' },
		{ media: '(prefers-color-scheme: dark)', color: '#2f5d4a' },
	],
};

// craftsman-ignore: TS002 — Next.js App Router requires default export for layouts
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="de"
			suppressHydrationWarning
			className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
		>
			<head>
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				{/* Organization + SoftwareApplication JSON-LD for rich results. Content is static JSON.stringify of trusted constants — no XSS surface. */}
				<Script
					id="manawg-org-schema"
					type="application/ld+json"
				>{`${JSON.stringify(organizationSchema)}`}</Script>
				<Script
					id="manawg-software-schema"
					type="application/ld+json"
				>{`${JSON.stringify(softwareApplicationSchema)}`}</Script>
			</head>
			<body suppressHydrationWarning>
				{/* WCAG 2.4.1 Bypass Blocks — keyboard-only skip link.
				    Targets the <main id="main"> rendered by per-route layouts. */}
				<a href="#main" className="skip-link">
					Zum Hauptinhalt springen
				</a>
				{children}
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
