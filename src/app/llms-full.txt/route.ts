import { appUrl } from '@/lib/app-origin';
import { getAppUrl } from '@/lib/app-url';
import { COMPARISON_NOTICE } from '@/topics/de/comparison';
import { TOPICS_DE } from '@/topics/de/index';
import { groupOfSlug } from '@/topics/groups';
import type { Topic } from '@/topics/types';

export const dynamic = 'force-static';

const zelle = (wert: string) => wert.replace(/\|/g, '\\|');

// Tabelle aus den Themendaten als Markdown, mit Titel und Fußnote.
function markdownTabelle({
	title: titel,
	header: kopf,
	rows: zeilen,
	note: hinweis,
}: NonNullable<Topic['tables']>[number]) {
	const reihe = (felder: string[]) => `| ${felder.map(zelle).join(' | ')} |`;
	const tabelle = [reihe(kopf), reihe(kopf.map(() => '---')), ...zeilen.map(reihe)].join('\n');
	return `### ${titel}\n\n${tabelle}${hinweis ? `\n\n${hinweis}` : ''}`;
}

// Alle Themen- und Ratgeberseiten als ein Markdown-Text, damit KI-Systeme den Inhalt ohne Crawl lesen können.
export function GET() {
	const base = getAppUrl();
	const seiten = Object.entries(TOPICS_DE).map(([slug, t]) => {
		const quellen = (t.sources ?? []).map(
			([name, url]) => [name, url.startsWith('/') ? `${base}${url}` : url] as [string, string],
		);
		const teile = [
			`# ${t.h1}`,
			`Quelle: ${base}/${slug} (Stand ${t.updated})`,
			...(groupOfSlug(slug)?.name === 'Vergleiche' ? [COMPARISON_NOTICE] : []),
			[
				t.intro.replaceAll('](/', `](${base}/`),
				...(t.tables ?? []).filter((tab) => tab.after === 'intro').map(markdownTabelle),
			].join('\n\n'),
			...t.sections.map(([kopf, text]) => {
				const tabellen = (t.tables ?? []).filter((tab) => tab.after === kopf).map(markdownTabelle);
				return [`## ${kopf}\n\n${text.replaceAll('](/', `](${base}/`)}`, ...tabellen].join('\n\n');
			}),
			...(t.faq
				? [
						'## Häufige Fragen',
						...t.faq.map(([f, a]) => `**${f}**\n\n${a.replaceAll('](/', `](${base}/`)}`),
					]
				: []),
			...(quellen.length > 0
				? [`## Quellen\n\n${quellen.map(([name, url]) => `- ${name}: ${url}`).join('\n')}`]
				: []),
		];
		return teile.join('\n\n');
	});
	const kopf = `# ManaWG: vollständiger Inhalt\n\nManaWG ist eine kostenlose deutschsprachige WG-App (Ausgaben teilen, Einkaufsliste, Putzplan, Kalender, Pinnwand, Chat) und hat nichts mit WireGuard zu tun. Start: ${appUrl('/registrieren?action=create')}`;
	return new Response([kopf, ...seiten].join('\n\n---\n\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
}
