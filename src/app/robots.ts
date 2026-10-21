import { getAppUrl } from '@/lib/app-url';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const appUrl = getAppUrl();
	return {
		rules: [
			// KI-Crawler und Suchassistenten ausdrücklich erlaubt, damit ManaWG in Antworten vorkommen kann.
			{
				userAgent: [
					'GPTBot',
					'OAI-SearchBot',
					'ChatGPT-User',
					'ClaudeBot',
					'Claude-SearchBot',
					'Claude-User',
					'PerplexityBot',
					'Perplexity-User',
					'Google-Extended',
					'Applebot-Extended',
					'CCBot',
				],
				allow: ['/'],
				disallow: ['/wg/', '/api/', '/offline'],
			},
			{
				userAgent: '*',
				allow: ['/'],
				// /wg, /api und /offline leiten nur auf app.manawg.com weiter (next.config.ts).
				disallow: ['/wg/', '/api/', '/offline'],
			},
		],
		sitemap: `${appUrl}/sitemap.xml`,
	};
}
