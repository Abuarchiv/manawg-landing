// The topic pages as machine-readable files per language: Atom feed (feed.xml) and full Markdown text (llms-full.txt).
import { appUrl } from '@/lib/app-origin';
import { getAppUrl } from '@/lib/app-url';
import type { Locale } from '@/lib/locale';
import { groupOf, topics, ui } from '@/topics/registry';
import type { Topic } from '@/topics/types';

const TEXT = {
	de: {
		feedTitle: 'ManaWG: WG-Ratgeber',
		about: 'ueber-manawg',
		source: (url: string, updated: string) => `Quelle: ${url} (Stand ${updated})`,
		faq: 'Häufige Fragen',
		sources: 'Quellen',
		preamble: `# ManaWG: vollständiger Inhalt\n\nManaWG ist eine kostenlose deutsch- und englischsprachige WG-App (Ausgaben teilen, Einkaufsliste, Putzplan, Kalender, Pinnwand, Chat) und hat nichts mit WireGuard zu tun. Start: ${appUrl('/registrieren?action=create')}`,
	},
	en: {
		feedTitle: 'ManaWG: flat-share guides',
		about: 'about-manawg',
		source: (url: string, updated: string) => `Source: ${url} (as of ${updated})`,
		faq: 'Frequently asked questions',
		sources: 'Sources',
		preamble: `# ManaWG: full content\n\nManaWG is a free flat-share app in English and German (split expenses, shopping list, cleaning rota, calendar, noticeboard, chat). It has nothing to do with WireGuard. Start: ${appUrl('/signup?action=create')}`,
	},
} as const;

/** Path prefix of a language: German at the root, English under /en. */
const prefixOf = (locale: Locale) => (locale === 'de' ? '' : '/en');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Atom feed of all topic and guide pages of a language, so aggregators and crawlers find new pages. */
export function atomFeed(locale: Locale): Response {
	const base = getAppUrl();
	const home = `${base}${prefixOf(locale) || '/'}`;
	const all = topics(locale);
	const entries = Object.entries(all)
		.sort(([, a], [, b]) => b.updated.localeCompare(a.updated))
		.map(([slug, t]) => {
			const url = `${base}${prefixOf(locale)}/${slug}`;
			return `<entry><title>${esc(t.h1)}</title><link href="${url}"/><id>${url}</id><published>${t.published}T00:00:00Z</published><updated>${t.updated}T00:00:00Z</updated><summary>${esc(t.description)}</summary></entry>`;
		})
		.join('');
	const newest = Object.values(all).reduce((m, t) => (t.updated > m ? t.updated : m), '');
	const txt = TEXT[locale];
	// RFC 4287 requires an author on the feed or on every entry.
	const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}"><title>${txt.feedTitle}</title><link href="${base}${prefixOf(locale)}/feed.xml" rel="self"/><link href="${home}"/><id>${home}</id><author><name>ManaWG</name><uri>${base}${prefixOf(locale)}/${txt.about}</uri></author><updated>${newest}T00:00:00Z</updated>${entries}</feed>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}

const cell = (value: string) => value.replace(/\|/g, '\\|');

/** A table from the topic data as Markdown, with its title and footnote. */
function markdownTable({ title, header, rows, note }: NonNullable<Topic['tables']>[number]) {
	const row = (fields: string[]) => `| ${fields.map(cell).join(' | ')} |`;
	const table = [row(header), row(header.map(() => '---')), ...rows.map(row)].join('\n');
	return `### ${title}\n\n${table}${note ? `\n\n${note}` : ''}`;
}

/** All topic and guide pages of a language as one Markdown text, so AI systems can read the content without crawling. */
export function llmsFull(locale: Locale): Response {
	const base = getAppUrl();
	const prefix = prefixOf(locale);
	const txt = TEXT[locale];
	// Links in the data are relative to the language root: `](/)` is its home page, `](/slug)` one of its pages.
	const absolute = (text: string) =>
		text.replaceAll('](/)', `](${base}${prefix || '/'})`).replaceAll('](/', `](${base}${prefix}/`);
	const absoluteSource = (url: string) => {
		if (!url.startsWith('/')) return url;
		if (!prefix || url.startsWith(prefix)) return `${base}${url}`;
		return `${base}${prefix}${url === '/' ? '' : url}`;
	};
	const pages = Object.entries(topics(locale)).map(([slug, t]) => {
		const tablesAfter = (anchor: string) =>
			(t.tables ?? []).filter((tab) => tab.after === anchor).map(markdownTable);
		const sources = (t.sources ?? []).map(([name, url]) => `- ${name}: ${absoluteSource(url)}`);
		return [
			`# ${t.h1}`,
			txt.source(`${base}${prefix}/${slug}`, t.updated),
			...(groupOf(locale, slug)?.id === 'compare' ? [ui(locale).comparisonNotice] : []),
			[absolute(t.intro), ...tablesAfter('intro')].join('\n\n'),
			...t.sections.map(([heading, text]) =>
				[`## ${heading}\n\n${absolute(text)}`, ...tablesAfter(heading)].join('\n\n'),
			),
			...(t.faq ? [`## ${txt.faq}`, ...t.faq.map(([q, a]) => `**${q}**\n\n${absolute(a)}`)] : []),
			...(sources.length > 0 ? [`## ${txt.sources}\n\n${sources.join('\n')}`] : []),
		].join('\n\n');
	});
	return new Response([txt.preamble, ...pages].join('\n\n---\n\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
}
