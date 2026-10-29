import type { Topic } from '../types.ts';

/** Anbieterhinweis für Vergleichsseiten: keine unabhängige Rangliste; Belege stehen in den verlinkten Quellen, Unverifiziertes ist als solches gekennzeichnet. Ohne Stichtag, die Seite zeigt t.stand. */
export const COMPARISON_NOTICE =
	'Dieser Vergleich wurde von ManaWG, dem Anbieter der hier vorgestellten WG-App, erstellt und ist keine unabhängige Rangliste. Bestätigte Aussagen zu anderen Anbietern verweisen auf die verlinkten Quellen; nicht verifizierte Angaben sind als solche gekennzeichnet. Prüft den aktuellen Stand bei den Anbietern selbst.';

/** Zeilen und ManaWG-Spalte der Vergleichstabellen; Zellen zu ManaWG nur aus der App belegt. */
export const COMPARISON_ROWS = [
	'Ausgaben teilen',
	'Putzplan',
	'Einkaufsliste',
	'Kalender',
	'Chat',
	'Währungen',
	'Preis',
];
export const MANAWG_CELLS = [
	'gleich oder mit eigenen Beträgen, Fixkosten, Monatsabrechnung',
	'mit fairer Verteilung, Abwesenheit und Erinnerung',
	'mit Vorräten',
	'mit Kalender-Abo',
	'Chat und Pinnwand',
	'nur Euro',
	'kostenlos, ohne Werbung',
];
/** Alles, was die Quellen der Seite nicht belegen, steht so in der Tabelle. */
export const NOT_CHECKED = 'nicht geprüft';

/** Tabelle ManaWG gegen einen Anbieter; `zellen` folgt VERGLEICH_ZEILEN, Fehlendes wird „nicht geprüft“. */
export function comparisonTable(
	provider: string,
	cells: string[],
	note: string,
): NonNullable<Topic['tables']>[number] {
	return {
		after: 'intro',
		title: `ManaWG und ${provider} im Vergleich`,
		header: ['Merkmal', 'ManaWG', provider],
		rows: COMPARISON_ROWS.map((z, i) => [
			z,
			MANAWG_CELLS[i] ?? NOT_CHECKED,
			cells[i] ?? NOT_CHECKED,
		]),
		note,
	};
}
