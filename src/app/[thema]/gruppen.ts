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
			'wg-einzug-checkliste',
			'wg-regeln',
			'wg-abwesenheit-urlaub',
		],
	},
	{ name: 'Über ManaWG', slugs: ['ueber-manawg', 'faq'] },
];

export const gruppeVon = (slug: string) => GRUPPEN.find((g) => g.slugs.includes(slug));

/** Drei verwandte Seiten: die nächsten der eigenen Gruppe, aufgefüllt aus der Ratgeber-Gruppe. */
export function verwandte(slug: string): string[] {
	const g = gruppeVon(slug);
	if (!g) return [];
	const i = g.slugs.indexOf(slug);
	const eigene = g.slugs.slice(i + 1).concat(g.slugs.slice(0, i));
	const rest = (GRUPPEN[2]?.slugs ?? []).filter((s) => s !== slug && !eigene.includes(s));
	return [...eigene, ...rest].slice(0, 3);
}
