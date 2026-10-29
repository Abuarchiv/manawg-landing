import type { Metadata, Viewport } from 'next';
import { SiteHead, siteMetadata, siteViewport } from '@/lib/site';
import '../../globals.css';

export const metadata: Metadata = siteMetadata('en');
export const viewport: Viewport = siteViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en-GB" suppressHydrationWarning>
			<SiteHead locale="en" />
			<body>{children}</body>
		</html>
	);
}
