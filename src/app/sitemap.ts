import { getAppUrl } from '@/lib/app-url';
import { STATIC_PAIRS, TOPIC_SLUG_EN, languageAlternates, toGermanSlug } from '@/lib/locale';
import { TOPICS_EN } from '@/topics/en/index';
import { THEMEN } from '@/topics/themen';
import type { MetadataRoute } from 'next';

type Entry = MetadataRoute.Sitemap[number];

const newest = (data: Record<string, { stand: string }>) =>
	new Date(Object.values(data).reduce((neu, t) => (t.stand > neu ? t.stand : neu), ''));

// Only topic, guide pages and the guide indexes carry their known Stand date.
// Home page and legal pages have no known date and get none;
// priority/changefreq are dropped (Google ignores them).
export default function sitemap(): MetadataRoute.Sitemap {
	const appUrl = getAppUrl();
	const entry = (
		path: string,
		lastModified: Date | undefined,
		dePath: string,
		enPath: string | null,
	): Entry => {
		const languages = languageAlternates(dePath, enPath);
		return {
			url: `${appUrl}${path}`,
			...(lastModified ? { lastModified } : {}),
			...(languages
				? {
						alternates: {
							languages: Object.fromEntries(
								Object.entries(languages).map(([lang, p]) => [lang, `${appUrl}${p}`]),
							),
						},
					}
				: {}),
		};
	};
	const pair = (de: string) => STATIC_PAIRS.find(([d]) => d === de)?.[1] ?? null;
	const english = Object.keys(TOPICS_EN);
	return [
		entry('/', undefined, '/', pair('/')),
		...Object.entries(THEMEN).map(([thema, t]) => {
			const en = TOPIC_SLUG_EN[thema];
			return entry(
				`/${thema}`,
				new Date(t.stand),
				`/${thema}`,
				en && en in TOPICS_EN ? `/en/${en}` : null,
			);
		}),
		entry('/ratgeber', newest(THEMEN), '/ratgeber', pair('/ratgeber')),
		entry('/agb', undefined, '/agb', pair('/agb')),
		entry('/datenschutz', undefined, '/datenschutz', pair('/datenschutz')),
		entry('/impressum', undefined, '/impressum', pair('/impressum')),
		// English entries: static pairs first, then the topics that exist.
		...STATIC_PAIRS.map(([de, en]) =>
			entry(en, en === '/en/guides' && english.length > 0 ? newest(TOPICS_EN) : undefined, de, en),
		),
		...Object.entries(TOPICS_EN).map(([slug, t]) => {
			const de = toGermanSlug(slug);
			return entry(`/en/${slug}`, new Date(t.stand), de ? `/${de}` : `/en/${slug}`, `/en/${slug}`);
		}),
	];
}
