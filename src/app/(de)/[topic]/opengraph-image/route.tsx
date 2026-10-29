import { topics } from '@/topics/registry';
import { topicOgImage } from '@/topics/topic-og';

// A route handler instead of the opengraph-image file convention: inside a route group, Next
// appends a hash to the convention URL, but the metadata (and live main) use the plain path.
export const dynamicParams = false;

export function generateStaticParams() {
	return Object.keys(topics('de')).map((topic) => ({ topic }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ topic: string }> }) {
	const { topic } = await params;
	return topicOgImage('de', topic);
}
