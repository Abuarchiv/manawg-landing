import { languageAlternates } from '@/lib/locale';
import type { Metadata } from 'next';

// Skeleton: the legal package replaces this page with the English text.
export const metadata: Metadata = {
	title: 'Privacy policy | ManaWG',
	robots: { index: false, follow: true },
	alternates: {
		canonical: '/en/privacy',
		languages: languageAlternates('/datenschutz', '/en/privacy') ?? {},
	},
};

export default function Page() {
	return (
		<main id="main">
			<h1>Privacy policy</h1>
		</main>
	);
}
