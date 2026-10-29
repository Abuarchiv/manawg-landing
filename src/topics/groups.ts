// Structure of the topic pages for breadcrumb, "further reading" and footer.

export const GROUPS: Array<{
	id: 'features' | 'compare' | 'guides' | 'about';
	name: string;
	slugs: string[];
}> = [
	{
		id: 'features',
		name: 'Funktionen',
		slugs: ['wg-app', 'putzplan', 'wg-kasse', 'einkaufsliste'],
	},
	{
		id: 'compare',
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
		id: 'guides',
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
			'wg-kaution',
			'mitbewohner-finden',
			'wg-casting-fragen',
			'wg-abkuerzungen',
			'wg-einzug-checkliste',
			'wg-anmeldung',
			'wg-regeln',
			'wg-streit-loesen',
			'mitbewohner-kuendigen',
			'wg-zimmer-kuendigen',
			'wg-abwesenheit-urlaub',
			'wg-zwischenmiete',
			'wg-auszug-checkliste',
			'open-source-wg-app',
		],
	},
	{ id: 'about', name: 'Über ManaWG', slugs: ['ueber-manawg', 'faq'] },
];

export const groupOfSlug = (slug: string) => GROUPS.find((g) => g.slugs.includes(slug));

/** Feature page per guide: guide and feature link to each other in "further reading" (topic cluster). */
export const FEATURE_GUIDES: Record<string, string[]> = {
	'wg-kasse': [
		'splitwise-splid-wechseln',
		'wg-kosten-aufteilen',
		'wg-haushaltskasse',
		'wg-nebenkosten',
		'schulden-mitbewohner',
		'wg-miete-rechner',
		'rundfunkbeitrag-wg',
		'splitwise-kostenlos',
		'wg-kaution',
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
		'wg-zimmer-kuendigen',
		'wg-auszug-checkliste',
		'wg-abkuerzungen',
	],
};
const featureOf = (slug: string) =>
	Object.keys(FEATURE_GUIDES).find((f) => FEATURE_GUIDES[f]?.includes(slug));

/** Fixed, topically chosen "further reading" targets; all other pages fall back to relatedSlugs(). */
const READ_NEXT: Record<string, string[]> = {
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
	'wg-kaution': ['wg-mietvertrag', 'wg-auszug-checkliste', 'wg-kasse'],
	'wg-abkuerzungen': ['wg-mietvertrag', 'wg-kaution', 'wg-casting-fragen'],
	'wg-auszug-checkliste': ['wg-zimmer-kuendigen', 'wg-anmeldung', 'schulden-mitbewohner'],
	'wg-zimmer-kuendigen': ['wg-auszug-checkliste', 'wg-mietvertrag', 'mitbewohner-kuendigen'],
	'wg-streit-loesen': ['wg-regeln', 'schulden-mitbewohner', 'mitbewohner-kuendigen'],
	'mitbewohner-kuendigen': ['wg-mietvertrag', 'wg-zimmer-kuendigen', 'wg-streit-loesen'],
	'wg-regeln': ['wg-app', 'wg-streit-loesen', 'wg-einzug-checkliste'],
	'wg-casting-fragen': ['mitbewohner-finden', 'wg-regeln', 'wg-einzug-checkliste'],
	'mitbewohner-finden': ['wg-casting-fragen', 'wg-mietvertrag', 'wg-einzug-checkliste'],
	'wg-abwesenheit-urlaub': ['putzplan', 'wg-zwischenmiete', 'wg-nebenkosten'],
	'splitwise-alternative': ['beste-wg-app', 'splid-alternative', 'wg-kasse'],
	'splid-alternative': ['beste-wg-app', 'tricount-alternative', 'wg-kasse'],
	'tricount-alternative': ['beste-wg-app', 'splitwise-alternative', 'wg-kasse'],
	'flatastic-alternative': ['beste-wg-app', 'ourhome-alternative', 'putzplan'],
	'ourhome-alternative': ['beste-wg-app', 'flatastic-alternative', 'putzplan'],
	'open-source-wg-app': ['wg-app', 'splitwise-alternative', 'splitwise-splid-wechseln'],
	faq: ['wg-app', 'wg-kasse', 'putzplan'],
	'ueber-manawg': ['faq', 'wg-app', 'beste-wg-app'],
};

/** Three related pages: guides first get the matching feature page, features first get their guides, then the page's own group. */
export function relatedSlugs(slug: string): string[] {
	const w = READ_NEXT[slug];
	if (w) return w;
	const g = groupOfSlug(slug);
	if (!g) return [];
	const i = g.slugs.indexOf(slug);
	const ownGroup = g.slugs.slice(i + 1).concat(g.slugs.slice(0, i));
	const rest = (GROUPS[2]?.slugs ?? []).filter((s) => s !== slug && !ownGroup.includes(s));
	const cluster = FEATURE_GUIDES[slug] ?? [featureOf(slug)].filter((s) => s !== undefined);
	return [...new Set([...cluster, ...ownGroup, ...rest])].slice(0, 3);
}
