import { getAppUrl } from '@/lib/app-url';
import type { MetadataRoute } from 'next';

// craftsman-ignore: TS002 — Next.js App Router requires default export for route handlers
export default function robots(): MetadataRoute.Robots {
	const appUrl = getAppUrl();
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/'],
				// Real app routes live under /wg/[code]/... (not the flat
				// /ausgaben, /einkauf, ... paths this list used to name — those
				// never existed) plus /api/. /offline is the PWA fallback shell,
				// not a page worth indexing. /neu stays crawlable — it's the
				// public "create a WG" entry point, listed in the sitemap below.
				disallow: ['/wg/', '/api/', '/offline'],
			},
		],
		sitemap: `${appUrl}/sitemap.xml`,
		host: appUrl,
	};
}
