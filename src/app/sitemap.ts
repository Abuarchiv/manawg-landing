import { getAppUrl } from '@/lib/app-url';
import type { MetadataRoute } from 'next';
import { THEMEN } from './[thema]/themen';

// Nur Themen- und Ratgeberseiten tragen ihr bekanntes Stand-Datum.
// Startseite und Rechtliches haben kein bekanntes Datum und bekommen keins;
// priority/changefreq entfallen (werden von Google ignoriert).
export default function sitemap(): MetadataRoute.Sitemap {
	const appUrl = getAppUrl();
	return [
		{ url: `${appUrl}/` },
		...Object.entries(THEMEN).map(([thema, t]) => ({
			url: `${appUrl}/${thema}`,
			lastModified: new Date(t.stand),
		})),
		{ url: `${appUrl}/agb` },
		{ url: `${appUrl}/datenschutz` },
		{ url: `${appUrl}/impressum` },
	];
}
