import { getAppUrl } from '@/lib/app-url';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const appUrl = getAppUrl();
	return {
		rules: [
			// AI crawlers and search assistants are explicitly allowed so ManaWG can appear in answers.
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
				// /wg, /neu and /offline stay crawlable so the 308 redirects (next.config.ts) are seen.
				disallow: ['/api/'],
			},
		],
		sitemap: `${appUrl}/sitemap.xml`,
	};
}
