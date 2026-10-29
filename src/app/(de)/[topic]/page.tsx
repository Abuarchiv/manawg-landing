import { TopicPage, topicMetadata, topicStaticParams } from '@/topics/topic-page';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
	return topicStaticParams('de').map((topic) => ({ topic }));
}

type Props = { params: Promise<{ topic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { topic } = await params;
	return topicMetadata('de', topic);
}

export default async function TopicRoute({ params }: Props) {
	const { topic } = await params;
	return <TopicPage locale="de" slug={topic} />;
}
