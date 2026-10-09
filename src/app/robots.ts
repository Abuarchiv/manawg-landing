import { getAppUrl } from '@/lib/app-url';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const appUrl = getAppUrl();
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/'],
				// /wg, /api und /offline leiten nur auf app.manawg.com weiter (next.config.ts).
				disallow: ['/wg/', '/api/', '/offline'],
			},
		],
		sitemap: `${appUrl}/sitemap.xml`,
		host: appUrl,
	};
}
