import { getAppUrl } from '@/lib/app-url';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const description =
	'Ausgaben, Putzplan, Einkaufsliste und Pinnwand in einer App für die ganze WG. Kostenlos, ohne Werbung, DSGVO-konform.';

export const metadata: Metadata = {
	metadataBase: new URL(getAppUrl()),
	title: 'ManaWG – Die App für eure WG.',
	description,
	alternates: { canonical: '/' },
	robots: { index: true, follow: true },
	openGraph: {
		title: 'ManaWG – Die App für eure WG.',
		description,
		url: '/',
		siteName: 'ManaWG',
		locale: 'de_DE',
		type: 'website',
		images: [{ url: '/og-zeichen.png', alt: 'Das ManaWG-Zeichen als 3D-Körper' }],
	},
	twitter: { card: 'summary_large_image', images: ['/og-zeichen.png'] },
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon-32.png', sizes: '32x32' },
		],
		apple: '/apple-touch-icon.png',
	},
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
			<body>{children}</body>
		</html>
	);
}
