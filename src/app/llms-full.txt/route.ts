import { appUrl } from '@/lib/app-origin';
import { getAppUrl } from '@/lib/app-url';
import { VERGLEICHS_HINWEIS, gruppeVon } from '../[thema]/gruppen';
import { putzplanVorlageMarkdown } from '../[thema]/ratgeber';
import { THEMEN } from '../[thema]/themen';

export const dynamic = 'force-static';

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
			t.einleitung,
			...t.abschnitte.map(([kopf, text]) => `## ${kopf}\n\n${text}`),
			...(slug === 'putzplan-vorlage'
				? [
						`## Vier-Wochen-Rotation für vier Personen\n\nVier-Wochen-Rotation: jede Woche rückt jede Person eine Aufgabe weiter.\n\nA, B, C und D stehen für vier Beispielpersonen.\n\n${putzplanVorlageMarkdown()}\n\nQuelle: ${base}/putzplan-vorlage · CSV-Download: ${base}/putzplan-vorlage.csv`,
					]
				: []),
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
