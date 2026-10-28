import { topics } from '@/topics/registry';
import { topicOgImage } from '@/topics/topic-og';

export const alt = 'ManaWG';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
	return Object.keys(topics('de')).map((thema) => ({ thema }));
}

export default async function Image({ params }: { params: Promise<{ thema: string }> }) {
	const { thema } = await params;
	return topicOgImage('de', thema);
}
