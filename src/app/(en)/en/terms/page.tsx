import { languageAlternates } from '@/lib/locale';
import type { Metadata } from 'next';

// Skeleton: the legal package replaces this page with the English text.
export const metadata: Metadata = {
	title: 'Terms | ManaWG',
	robots: { index: false, follow: true },
	alternates: {
		canonical: '/en/terms',
		languages: languageAlternates('/agb', '/en/terms') ?? {},
	},
};

export default function Page() {
	return (
		<main id="main">
			<h1>Terms</h1>
		</main>
	);
}
