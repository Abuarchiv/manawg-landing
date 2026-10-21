// Gliederung der Themenseiten für Breadcrumb, "Weiterlesen" und Fußzeile.
export const GRUPPEN: Array<{ name: string; slugs: string[] }> = [
	{ name: 'Funktionen', slugs: ['wg-app', 'putzplan', 'wg-kasse', 'einkaufsliste'] },
	{
		name: 'Vergleiche',
		slugs: [
			'beste-wg-app',
			'splitwise-alternative',
			'splid-alternative',
			'flatastic-alternative',
			'ourhome-alternative',
		],
	},
	{
		name: 'Ratgeber',
		slugs: [
			'wg-kosten-aufteilen',
			'wg-nebenkosten',
			'wg-haushaltskasse',
			'schulden-mitbewohner',
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
		'wg-kosten-aufteilen',
		'wg-haushaltskasse',
		'wg-nebenkosten',
		'schulden-mitbewohner',
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

/** Drei verwandte Seiten: Ratgeber zuerst die passende Funktionsseite, Funktionen zuerst ihre Ratgeber, dann die eigene Gruppe. */
export function verwandte(slug: string): string[] {
	const g = gruppeVon(slug);
	if (!g) return [];
	const i = g.slugs.indexOf(slug);
	const eigene = g.slugs.slice(i + 1).concat(g.slugs.slice(0, i));
	const rest = (GRUPPEN[2]?.slugs ?? []).filter((s) => s !== slug && !eigene.includes(s));
	const cluster = FUNKTION_ZU_RATGEBER[slug] ?? [funktionVon(slug)].filter((s) => s !== undefined);
	return [...new Set([...cluster, ...eigene, ...rest])].slice(0, 3);
}
