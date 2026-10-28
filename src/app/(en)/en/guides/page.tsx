import { GuideIndex, guideIndexMetadata } from '@/topics/guide-index';

export const metadata = guideIndexMetadata('en');

export default function GuidesPage() {
	return <GuideIndex locale="en" />;
}
