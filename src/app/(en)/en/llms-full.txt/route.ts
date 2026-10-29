import { appUrl } from '@/lib/app-origin';
import { getAppUrl } from '@/lib/app-url';
import { TOPICS_EN } from '@/topics/en/index';
import { groupOf, ui } from '@/topics/registry';
import type { Thema } from '@/topics/themen';

export const dynamic = 'force-static';

const cell = (value: string) => value.replace(/\|/g, '\\|');

// A table from the topic data as Markdown, with its title and footnote.
function markdownTable({ titel, kopf, zeilen, hinweis }: NonNullable<Thema['tabellen']>[number]) {
	const row = (fields: string[]) => `| ${fields.map(cell).join(' | ')} |`;
	const table = [row(kopf), row(kopf.map(() => '---')), ...zeilen.map(row)].join('\n');
	return `### ${titel}\n\n${table}${hinweis ? `\n\n${hinweis}` : ''}`;
}

// All English topic and guide pages as one Markdown text, so AI systems can read the content without crawling.
export function GET() {
	const base = getAppUrl();
	// English data links are prefix-free: `](/)` is the home page, `](/slug)` an English page.
	const absolute = (text: string) =>
		text.replaceAll('](/)', `](${base}/en)`).replaceAll('](/', `](${base}/en/`);
	const pages = Object.entries(TOPICS_EN).map(([slug, t]) => {
		const sources = (t.quellen ?? []).map(
			([name, url]) =>
				[
					name,
					url.startsWith('/en')
						? `${base}${url}`
						: url.startsWith('/')
							? `${base}/en${url === '/' ? '' : url}`
							: url,
				] as [string, string],
		);
		const parts = [
			`# ${t.h1}`,
			`Source: ${base}/en/${slug} (as of ${t.stand})`,
			...(groupOf('en', slug)?.id === 'compare' ? [ui('en').comparisonNotice] : []),
			[
				absolute(t.einleitung),
				...(t.tabellen ?? []).filter((tab) => tab.nach === 'einleitung').map(markdownTable),
			].join('\n\n'),
			...t.abschnitte.map(([heading, text]) => {
				const tables = (t.tabellen ?? []).filter((tab) => tab.nach === heading).map(markdownTable);
				return [`## ${heading}\n\n${absolute(text)}`, ...tables].join('\n\n');
			}),
			...(t.fragen
				? [
						'## Frequently asked questions',
						...t.fragen.map(([q, a]) => `**${q}**\n\n${absolute(a)}`),
					]
				: []),
			...(sources.length > 0
				? [`## Sources\n\n${sources.map(([name, url]) => `- ${name}: ${url}`).join('\n')}`]
				: []),
		];
		return parts.join('\n\n');
	});
	const header = `# ManaWG: full content\n\nManaWG is a free flat-share app in English and German (split expenses, shopping list, cleaning rota, calendar, noticeboard, chat). It has nothing to do with WireGuard. Start: ${appUrl('/signup?action=create')}`;
	return new Response([header, ...pages].join('\n\n---\n\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
}
