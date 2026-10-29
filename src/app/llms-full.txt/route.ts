import { appUrl } from '@/lib/app-origin';
import { getAppUrl } from '@/lib/app-url';
import { COMPARISON_NOTICE } from '@/topics/de/comparison';
import { TOPICS_DE } from '@/topics/de/index';
import { groupOfSlug } from '@/topics/groups';
import type { Topic } from '@/topics/types';

export const dynamic = 'force-static';

const cell = (value: string) => value.replace(/\|/g, '\\|');

// A table from the topic data as Markdown, with its title and footnote.
function markdownTable({ title, header, rows, note }: NonNullable<Topic['tables']>[number]) {
	const row = (fields: string[]) => `| ${fields.map(cell).join(' | ')} |`;
	const table = [row(header), row(header.map(() => '---')), ...rows.map(row)].join('\n');
	return `### ${title}\n\n${table}${note ? `\n\n${note}` : ''}`;
}

// All German topic and guide pages as one Markdown text, so AI systems can read the content without crawling.
export function GET() {
	const base = getAppUrl();
	const pages = Object.entries(TOPICS_DE).map(([slug, t]) => {
		const sources = (t.sources ?? []).map(
			([name, url]) => [name, url.startsWith('/') ? `${base}${url}` : url] as [string, string],
		);
		const parts = [
			`# ${t.h1}`,
			`Quelle: ${base}/${slug} (Stand ${t.updated})`,
			...(groupOfSlug(slug)?.id === 'compare' ? [COMPARISON_NOTICE] : []),
			[
				t.intro.replaceAll('](/', `](${base}/`),
				...(t.tables ?? []).filter((tab) => tab.after === 'intro').map(markdownTable),
			].join('\n\n'),
			...t.sections.map(([heading, text]) => {
				const tables = (t.tables ?? []).filter((tab) => tab.after === heading).map(markdownTable);
				return [`## ${heading}\n\n${text.replaceAll('](/', `](${base}/`)}`, ...tables].join('\n\n');
			}),
			...(t.faq
				? [
						'## Häufige Fragen',
						...t.faq.map(([f, a]) => `**${f}**\n\n${a.replaceAll('](/', `](${base}/`)}`),
					]
				: []),
			...(sources.length > 0
				? [`## Quellen\n\n${sources.map(([name, url]) => `- ${name}: ${url}`).join('\n')}`]
				: []),
		];
		return parts.join('\n\n');
	});
	const preamble = `# ManaWG: vollständiger Inhalt\n\nManaWG ist eine kostenlose deutsch- und englischsprachige WG-App (Ausgaben teilen, Einkaufsliste, Putzplan, Kalender, Pinnwand, Chat) und hat nichts mit WireGuard zu tun. Start: ${appUrl('/registrieren?action=create')}`;
	return new Response([preamble, ...pages].join('\n\n---\n\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
}
