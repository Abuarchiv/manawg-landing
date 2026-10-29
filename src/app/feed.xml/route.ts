import { getAppUrl } from '@/lib/app-url';
import { TOPICS_DE } from '@/topics/de/index';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Atom feed of all German topic and guide pages, so aggregators and crawlers find new pages.
export function GET() {
	const base = getAppUrl();
	const entries = Object.entries(TOPICS_DE)
		.sort(([, a], [, b]) => b.updated.localeCompare(a.updated))
		.map(
			([slug, t]) =>
				`<entry><title>${esc(t.h1)}</title><link href="${base}/${slug}"/><id>${base}/${slug}</id><published>${t.published}T00:00:00Z</published><updated>${t.updated}T00:00:00Z</updated><summary>${esc(t.description)}</summary></entry>`,
		)
		.join('');
	const newest = Object.values(TOPICS_DE).reduce((m, t) => (t.updated > m ? t.updated : m), '');
	// RFC 4287 requires an author on the feed or on every entry.
	const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="de"><title>ManaWG: WG-Ratgeber</title><link href="${base}/feed.xml" rel="self"/><link href="${base}/"/><id>${base}/</id><author><name>ManaWG</name><uri>${base}/ueber-manawg</uri></author><updated>${newest}T00:00:00Z</updated>${entries}</feed>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}
