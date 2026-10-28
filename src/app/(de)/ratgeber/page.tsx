import { GuideIndex, guideIndexMetadata } from '@/topics/guide-index';

export const metadata = guideIndexMetadata('de');

export default function RatgeberPage() {
	return <GuideIndex locale="de" />;
}
