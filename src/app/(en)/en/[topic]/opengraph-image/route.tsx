import { topics } from '@/topics/registry';
import { topicOgImage } from '@/topics/topic-og';

// Route handler, not the file convention: see the German counterpart (no hash in the URL).
export const dynamicParams = false;

export function generateStaticParams() {
	return Object.keys(topics('en')).map((topic) => ({ topic }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ topic: string }> }) {
	const { topic } = await params;
	return topicOgImage('en', topic);
}
