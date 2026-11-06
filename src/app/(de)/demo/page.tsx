import { DemoPage } from '@/components/DemoPage';
import { languageAlternates } from '@/lib/locale';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
	locale: 'de',
	path: '/demo',
	title: 'ManaWG ausprobieren: Demo ohne Anmeldung',
	description:
		'Die WG-App mit Beispieldaten durchklicken: Ausgaben, Putzplan, Einkaufsliste und Chat, ohne Konto.',
	languages: languageAlternates('/demo', '/en/demo'),
});

export default function Page() {
	return <DemoPage locale="de" />;
}
