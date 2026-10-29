import { getAppUrl } from '@/lib/app-url';
import { TOPICS_EN } from '@/topics/en/index';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Atom feed of all English topic and guide pages, so aggregators and crawlers find new pages.
export function GET() {
	const base = getAppUrl();
	const entries = Object.entries(TOPICS_EN)
		.sort(([, a], [, b]) => b.stand.localeCompare(a.stand))
		.map(
			([slug, t]) =>
				`<entry><title>${esc(t.h1)}</title><link href="${base}/en/${slug}"/><id>${base}/en/${slug}</id><published>${t.erschienen}T00:00:00Z</published><updated>${t.stand}T00:00:00Z</updated><summary>${esc(t.beschreibung)}</summary></entry>`,
		)
		.join('');
	const newest = Object.values(TOPICS_EN).reduce((m, t) => (t.stand > m ? t.stand : m), '');
	// RFC 4287 requires an author on the feed or on every entry.
	const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en"><title>ManaWG: flat-share guides</title><link href="${base}/en/feed.xml" rel="self"/><link href="${base}/en"/><id>${base}/en</id><author><name>ManaWG</name><uri>${base}/en/about-manawg</uri></author><updated>${newest}T00:00:00Z</updated>${entries}</feed>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}
