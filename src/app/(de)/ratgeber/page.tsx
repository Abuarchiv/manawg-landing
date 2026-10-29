import { GuideIndex, guideIndexMetadata } from '@/topics/guide-index';

export const metadata = guideIndexMetadata('de');

export default function GuidesPage() {
	return <GuideIndex locale="de" />;
}
