import { appUrl } from '@/lib/app-origin';
import { getAppUrl } from '@/lib/app-url';
import { VERGLEICHS_HINWEIS, gruppeVon } from '../[thema]/gruppen';
import { THEMEN } from '../[thema]/themen';
import type { Thema } from '../[thema]/themen';

export const dynamic = 'force-static';

const zelle = (wert: string) => wert.replace(/\|/g, '\\|');

// Tabelle aus den Themendaten als Markdown, mit Titel und Fußnote.
function markdownTabelle({ titel, kopf, zeilen, hinweis }: NonNullable<Thema['tabellen']>[number]) {
	const reihe = (felder: string[]) => `| ${felder.map(zelle).join(' | ')} |`;
	const tabelle = [reihe(kopf), reihe(kopf.map(() => '---')), ...zeilen.map(reihe)].join('\n');
	return `### ${titel}\n\n${tabelle}${hinweis ? `\n\n${hinweis}` : ''}`;
}

// Alle Themen- und Ratgeberseiten als ein Markdown-Text, damit KI-Systeme den Inhalt ohne Crawl lesen können.
export function GET() {
	const base = getAppUrl();
	const seiten = Object.entries(THEMEN).map(([slug, t]) => {
		const quellen = (t.quellen ?? []).map(
			([name, url]) => [name, url.startsWith('/') ? `${base}${url}` : url] as [string, string],
		);
		const teile = [
			`# ${t.h1}`,
			`Quelle: ${base}/${slug} (Stand ${t.stand})`,
			...(gruppeVon(slug)?.name === 'Vergleiche' ? [VERGLEICHS_HINWEIS] : []),
			[
				t.einleitung,
				...(t.tabellen ?? []).filter((tab) => tab.nach === 'einleitung').map(markdownTabelle),
			].join('\n\n'),
			...t.abschnitte.map(([kopf, text]) => {
				const tabellen = (t.tabellen ?? []).filter((tab) => tab.nach === kopf).map(markdownTabelle);
				return [`## ${kopf}\n\n${text.replaceAll('](/', `](${base}/`)}`, ...tabellen].join('\n\n');
			}),
			...(t.fragen ? ['## Häufige Fragen', ...t.fragen.map(([f, a]) => `**${f}**\n\n${a}`)] : []),
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
