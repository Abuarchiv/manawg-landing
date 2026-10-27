// Gliederung der Themenseiten für Breadcrumb, "Weiterlesen" und Fußzeile.
import type { Thema } from './themen';

export const GRUPPEN: Array<{ name: string; slugs: string[] }> = [
	{ name: 'Funktionen', slugs: ['wg-app', 'putzplan', 'wg-kasse', 'einkaufsliste'] },
	{
		name: 'Vergleiche',
		slugs: [
			'beste-wg-app',
			'splitwise-alternative',
			'splid-alternative',
			'flatastic-alternative',
			'tricount-alternative',
			'ourhome-alternative',
		],
	},
	{
		name: 'Ratgeber',
		slugs: [
			'wg-kosten-aufteilen',
			'wg-miete-rechner',
			'wg-nebenkosten',
			'rundfunkbeitrag-wg',
			'wg-haushaltskasse',
			'schulden-mitbewohner',
			'splitwise-splid-wechseln',
			'splitwise-kostenlos',
			'putzplan-erstellen',
			'putzplan-vorlage',
			'wg-einkauf-organisieren',
			'wg-gruenden-checkliste',
			'wg-mietvertrag',
			'mitbewohner-finden',
			'wg-casting-fragen',
			'wg-einzug-checkliste',
			'wg-anmeldung',
			'wg-regeln',
			'wg-streit-loesen',
			'mitbewohner-kuendigen',
			'wg-abwesenheit-urlaub',
			'wg-zwischenmiete',
			'wg-auszug-checkliste',
		],
	},
	{ name: 'Über ManaWG', slugs: ['ueber-manawg', 'faq'] },
];

export const gruppeVon = (slug: string) => GRUPPEN.find((g) => g.slugs.includes(slug));

/** Anbieterhinweis für Vergleichsseiten: keine unabhängige Rangliste; Belege stehen in den verlinkten Quellen, Unverifiziertes ist als solches gekennzeichnet. Ohne Stichtag, die Seite zeigt t.stand. */
export const VERGLEICHS_HINWEIS =
	'Dieser Vergleich wurde von ManaWG, dem Anbieter der hier vorgestellten WG-App, erstellt und ist keine unabhängige Rangliste. Bestätigte Aussagen zu anderen Anbietern verweisen auf die verlinkten Quellen; nicht verifizierte Angaben sind als solche gekennzeichnet. Prüft den aktuellen Stand bei den Anbietern selbst.';

/** Funktionsseite je Ratgeber: Ratgeber und Funktion verweisen in „Weiterlesen“ aufeinander (Themen-Cluster). */
export const FUNKTION_ZU_RATGEBER: Record<string, string[]> = {
	'wg-kasse': [
		'splitwise-splid-wechseln',
		'wg-kosten-aufteilen',
		'wg-haushaltskasse',
		'wg-nebenkosten',
		'schulden-mitbewohner',
		'wg-miete-rechner',
		'rundfunkbeitrag-wg',
		'splitwise-kostenlos',
	],
	putzplan: ['putzplan-erstellen', 'putzplan-vorlage', 'wg-abwesenheit-urlaub'],
	einkaufsliste: ['wg-einkauf-organisieren'],
	'wg-app': [
		'wg-gruenden-checkliste',
		'wg-einzug-checkliste',
		'wg-regeln',
		'wg-streit-loesen',
		'wg-mietvertrag',
		'wg-zwischenmiete',
		'wg-anmeldung',
		'mitbewohner-finden',
		'wg-casting-fragen',
		'mitbewohner-kuendigen',
		'wg-auszug-checkliste',
	],
};
const funktionVon = (slug: string) =>
	Object.keys(FUNKTION_ZU_RATGEBER).find((f) => FUNKTION_ZU_RATGEBER[f]?.includes(slug));

/** Feste, thematisch gewählte „Weiterlesen“-Ziele; alle anderen Seiten nehmen den Rückfall in verwandte(). */
const WEITERLESEN: Record<string, string[]> = {
	'wg-miete-rechner': ['wg-kasse', 'wg-kosten-aufteilen', 'wg-nebenkosten'],
	'wg-nebenkosten': ['wg-kasse', 'wg-miete-rechner', 'rundfunkbeitrag-wg'],
	'rundfunkbeitrag-wg': ['wg-nebenkosten', 'wg-anmeldung', 'wg-kasse'],
	'wg-haushaltskasse': ['wg-kasse', 'wg-kosten-aufteilen', 'wg-einkauf-organisieren'],
	'schulden-mitbewohner': ['wg-kasse', 'wg-streit-loesen', 'wg-auszug-checkliste'],
	'splitwise-splid-wechseln': ['wg-kasse', 'splitwise-alternative', 'splid-alternative'],
	'splitwise-kostenlos': ['splitwise-alternative', 'splitwise-splid-wechseln', 'wg-kasse'],
	'putzplan-vorlage': ['putzplan', 'putzplan-erstellen', 'wg-regeln'],
	'putzplan-erstellen': ['putzplan', 'putzplan-vorlage', 'wg-regeln'],
	'wg-einkauf-organisieren': ['einkaufsliste', 'wg-haushaltskasse', 'wg-kosten-aufteilen'],
	'wg-mietvertrag': ['wg-gruenden-checkliste', 'wg-zwischenmiete', 'mitbewohner-kuendigen'],
	'wg-zwischenmiete': ['wg-mietvertrag', 'wg-abwesenheit-urlaub', 'wg-auszug-checkliste'],
	'wg-anmeldung': ['wg-einzug-checkliste', 'wg-mietvertrag', 'rundfunkbeitrag-wg'],
	'wg-auszug-checkliste': ['wg-zwischenmiete', 'wg-anmeldung', 'schulden-mitbewohner'],
	'wg-streit-loesen': ['wg-regeln', 'schulden-mitbewohner', 'mitbewohner-kuendigen'],
	'mitbewohner-kuendigen': ['wg-mietvertrag', 'wg-streit-loesen', 'wg-auszug-checkliste'],
	'wg-regeln': ['wg-app', 'wg-streit-loesen', 'wg-einzug-checkliste'],
	'wg-casting-fragen': ['mitbewohner-finden', 'wg-regeln', 'wg-einzug-checkliste'],
	'mitbewohner-finden': ['wg-casting-fragen', 'wg-mietvertrag', 'wg-einzug-checkliste'],
	'wg-abwesenheit-urlaub': ['putzplan', 'wg-zwischenmiete', 'wg-nebenkosten'],
	'splitwise-alternative': ['beste-wg-app', 'splid-alternative', 'wg-kasse'],
	'splid-alternative': ['beste-wg-app', 'tricount-alternative', 'wg-kasse'],
	'tricount-alternative': ['beste-wg-app', 'splitwise-alternative', 'wg-kasse'],
	'flatastic-alternative': ['beste-wg-app', 'ourhome-alternative', 'putzplan'],
	'ourhome-alternative': ['beste-wg-app', 'flatastic-alternative', 'putzplan'],
	faq: ['wg-app', 'wg-kasse', 'putzplan'],
	'ueber-manawg': ['faq', 'wg-app', 'beste-wg-app'],
};

/** Drei verwandte Seiten: Ratgeber zuerst die passende Funktionsseite, Funktionen zuerst ihre Ratgeber, dann die eigene Gruppe. */
export function verwandte(slug: string): string[] {
	const w = WEITERLESEN[slug];
	if (w) return w;
	const g = gruppeVon(slug);
	if (!g) return [];
	const i = g.slugs.indexOf(slug);
	const eigene = g.slugs.slice(i + 1).concat(g.slugs.slice(0, i));
	const rest = (GRUPPEN[2]?.slugs ?? []).filter((s) => s !== slug && !eigene.includes(s));
	const cluster = FUNKTION_ZU_RATGEBER[slug] ?? [funktionVon(slug)].filter((s) => s !== undefined);
	return [...new Set([...cluster, ...eigene, ...rest])].slice(0, 3);
}

/** Zeilen und ManaWG-Spalte der Vergleichstabellen; Zellen zu ManaWG nur aus der App belegt. */
export const VERGLEICH_ZEILEN = [
	'Ausgaben teilen',
	'Putzplan',
	'Einkaufsliste',
	'Kalender',
	'Chat',
	'Währungen',
	'Preis',
];
export const VERGLEICH_MANAWG = [
	'gleich oder mit eigenen Beträgen, Fixkosten, Monatsabrechnung',
	'mit fairer Verteilung, Abwesenheit und Erinnerung',
	'mit Vorräten',
	'mit Kalender-Abo',
	'Chat und Pinnwand',
	'nur Euro',
	'kostenlos, ohne Werbung',
];
/** Alles, was die Quellen der Seite nicht belegen, steht so in der Tabelle. */
export const NG = 'nicht geprüft';

/** Tabelle ManaWG gegen einen Anbieter; `zellen` folgt VERGLEICH_ZEILEN, Fehlendes wird „nicht geprüft“. */
export function vergleichsTabelle(
	anbieter: string,
	zellen: string[],
	hinweis: string,
): NonNullable<Thema['tabellen']>[number] {
	return {
		nach: 'einleitung',
		titel: `ManaWG und ${anbieter} im Vergleich`,
		kopf: ['Merkmal', 'ManaWG', anbieter],
		zeilen: VERGLEICH_ZEILEN.map((z, i) => [z, VERGLEICH_MANAWG[i] ?? NG, zellen[i] ?? NG]),
		hinweis,
	};
}
