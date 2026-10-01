import { getAppUrl } from '@/lib/app-url';
import type { MetadataRoute } from 'next';

const LAST_MODIFIED = '2026-05-18';

export default function sitemap(): MetadataRoute.Sitemap {
	const appUrl = getAppUrl();
	return [
		{ url: `${appUrl}/`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 1 },
		{
			url: `${appUrl}/agb`,
			lastModified: LAST_MODIFIED,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${appUrl}/datenschutz`,
			lastModified: LAST_MODIFIED,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${appUrl}/impressum`,
			lastModified: LAST_MODIFIED,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
	];
}
