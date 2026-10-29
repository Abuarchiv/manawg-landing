import type { Metadata, Viewport } from 'next';
import { SiteHead, siteMetadata, siteViewport } from '@/lib/site';
import '../globals.css';

export const metadata: Metadata = siteMetadata('de');
export const viewport: Viewport = siteViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="de" suppressHydrationWarning>
			<SiteHead locale="de" />
			<body>{children}</body>
		</html>
	);
}
