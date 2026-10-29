import { type Locale, toEnglishSlug, toGermanSlug } from '../lib/locale.ts';
import { TOPICS_DE } from './de/index.ts';
import { UI_DE } from './de/ui.ts';
import { TOPICS_EN } from './en/index.ts';
import { UI_EN } from './en/ui.ts';
import { GROUPS, relatedSlugs } from './groups.ts';
import type { Topic } from './types.ts';

type GroupId = (typeof GROUPS)[number]['id'];

export const ui = (locale: Locale) => (locale === 'de' ? UI_DE : UI_EN);

/** All topic pages of a language, keyed by that language's slug. */
export const topics = (locale: Locale): Record<string, Topic> =>
	locale === 'de' ? TOPICS_DE : TOPICS_EN;

const germanSlug = (locale: Locale, slug: string) =>
	locale === 'de' ? slug : (toGermanSlug(slug) ?? slug);

/** Group of a topic (looked up through the German slug), or undefined. */
export const groupOf = (locale: Locale, slug: string) =>
	GROUPS.find((g) => g.slugs.includes(germanSlug(locale, slug)));

export const groupName = (locale: Locale, id: GroupId): string => ui(locale).groupNames[id];

/** Three related slugs. English mirrors German `relatedSlugs()` through the slug map. */
export function related(locale: Locale, slug: string): string[] {
	const de = relatedSlugs(germanSlug(locale, slug));
	return locale === 'de' ? de : de.map((s) => toEnglishSlug(s) ?? s);
}

/** Path of the same topic in the other language, or null when that page does not exist (yet). */
export function counterpartOf(locale: Locale, slug: string): string | null {
	if (locale === 'de') {
		const en = toEnglishSlug(slug);
		return en && en in TOPICS_EN ? `/en/${en}` : null;
	}
	const de = toGermanSlug(slug);
	return de && de in TOPICS_DE ? `/${de}` : null;
}
