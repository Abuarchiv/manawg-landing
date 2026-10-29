import type { Topic } from '../types.ts';

/** Provider notice for comparison pages: not an independent ranking; evidence is in the linked sources, unverified claims are marked as such. Without a cut-off date, the page shows t.updated. */
export const COMPARISON_NOTICE =
	'Dieser Vergleich wurde von ManaWG, dem Anbieter der hier vorgestellten WG-App, erstellt und ist keine unabhängige Rangliste. Bestätigte Aussagen zu anderen Anbietern verweisen auf die verlinkten Quellen; nicht verifizierte Angaben sind als solche gekennzeichnet. Prüft den aktuellen Stand bei den Anbietern selbst.';

/** Rows and ManaWG column of the comparison tables; ManaWG cells are only backed by the app. */
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
/** Anything the page's sources do not support reads like this in the table. */
export const NOT_CHECKED = 'nicht geprüft';

/** Table of ManaWG against one provider; `cells` follows COMPARISON_ROWS, missing cells read "not checked". */
export function comparisonTable(
	provider: string,
	cells: string[],
	note: string,
): NonNullable<Topic['tables']>[number] {
	return {
		after: 'intro',
		title: `ManaWG und ${provider} im Vergleich`,
		header: ['Merkmal', 'ManaWG', provider],
		rows: COMPARISON_ROWS.map((row, i) => [
			row,
			MANAWG_CELLS[i] ?? NOT_CHECKED,
			cells[i] ?? NOT_CHECKED,
		]),
		note,
	};
}
