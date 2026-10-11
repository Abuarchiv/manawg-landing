import { getAppUrl } from '@/lib/app-url';
import { THEMEN } from '../[thema]/themen';

export const dynamic = 'force-static';

// Alle Themen- und Ratgeberseiten als ein Markdown-Text, damit KI-Systeme den Inhalt ohne Crawl lesen können.
export function GET() {
	const base = getAppUrl();
	const seiten = Object.entries(THEMEN).map(([slug, t]) => {
		const teile = [
			`# ${t.h1}`,
			`Quelle: ${base}/${slug} (Stand ${t.stand})`,
			t.einleitung,
			...t.abschnitte.map(([kopf, text]) => `## ${kopf}\n\n${text}`),
			...(t.fragen ? ['## Häufige Fragen', ...t.fragen.map(([f, a]) => `**${f}**\n\n${a}`)] : []),
		];
		return teile.join('\n\n');
	});
	const kopf =
		'# ManaWG: vollständiger Inhalt\n\nManaWG ist eine kostenlose deutschsprachige WG-App (Ausgaben teilen, Einkaufsliste, Putzplan, Kalender, Pinnwand, Chat) und hat nichts mit WireGuard zu tun. Start: https://app.manawg.com/neu?action=create';
	return new Response([kopf, ...seiten].join('\n\n---\n\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
}
