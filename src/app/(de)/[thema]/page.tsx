import { TopicPage, topicMetadata, topicStaticParams } from '@/topics/topic-page';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
	return topicStaticParams('de').map((thema) => ({ thema }));
}

type Props = { params: Promise<{ thema: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { thema } = await params;
	return topicMetadata('de', thema);
}

export default async function ThemaPage({ params }: Props) {
	const { thema } = await params;
	return <TopicPage locale="de" slug={thema} />;
}
