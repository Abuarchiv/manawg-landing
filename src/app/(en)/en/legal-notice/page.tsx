import { languageAlternates } from '@/lib/locale';
import type { Metadata } from 'next';

// Skeleton: the legal package replaces this page with the English text.
export const metadata: Metadata = {
	title: 'Legal notice | ManaWG',
	robots: { index: false, follow: true },
	alternates: {
		canonical: '/en/legal-notice',
		languages: languageAlternates('/impressum', '/en/legal-notice') ?? {},
	},
};

export default function Page() {
	return (
		<main id="main">
			<h1>Legal notice</h1>
		</main>
	);
}
