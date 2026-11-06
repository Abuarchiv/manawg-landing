import { DemoPage } from '@/components/DemoPage';
import { languageAlternates } from '@/lib/locale';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
	locale: 'en',
	path: '/en/demo',
	title: 'Try ManaWG: demo without an account',
	description:
		'Tap through the flat app on sample data: expenses, cleaning rota, shopping list and chat, no account needed.',
	languages: languageAlternates('/demo', '/en/demo'),
});

export default function Page() {
	return <DemoPage locale="en" />;
}
