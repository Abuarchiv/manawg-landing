import { getAppUrl } from '@/lib/app-url';
import type { MetadataRoute } from 'next';

// Zeitpunkt des Builds (die Route wird statisch erzeugt)
const LAST_MODIFIED = new Date();

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
