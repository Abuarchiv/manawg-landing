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
				disallow: ['/api/'],
			},
			{
				userAgent: '*',
				allow: ['/'],
				// /wg, /neu und /offline bleiben crawlbar, damit die 308-Weiterleitungen (next.config.ts) gesehen werden.
				disallow: ['/api/'],
			},
		],
		sitemap: `${appUrl}/sitemap.xml`,
	};
}
