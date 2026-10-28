import { VERGLEICHS_HINWEIS } from './gruppen.ts';

/** Strings of the topic frame, the topic pages, the guide index and the OG image. German values are the original wording. */
export interface TopicUi {
	/** Frame (header and footer). */
	homeLabel: string;
	openApp: string;
	footerNote: string;
	legal: { notice: string; privacy: string; terms: string };
	/** Topic page. */
	breadcrumbLabel: string;
	contents: string;
	by: string;
	authorName: string;
	published: string;
	updated: string;
	faqHeading: (link: string) => string;
	sources: (date: string) => string;
	guideNoteLabel: string;
	/** Text before the contact address; the address and a closing full stop follow. */
	guideNote: string;
	ctaTagline: string;
	ctaButton: string;
	ctaNote: string;
	readNext: string;
	csvDownload: string;
	printLabel: string;
	comparisonNotice: string;
	/** Group display names and the parent crumb of each group as [label, German-or-English path]. */
	groupNames: Record<'features' | 'compare' | 'guides' | 'about', string>;
	parentCrumbs: Record<'features' | 'compare' | 'guides', [label: string, path: string]>;
	/** OG image. */
	ogSubtitle: string;
	ogFallback: string;
	/** Guide index. */
	guideIndex: {
		title: string;
		description: string;
		h1: string;
		intro: string;
		crumb: string;
		collectionName: string;
		clusters: { money: string; household: string; together: string; moving: string; more: string };
	};
}

export const UI_DE: TopicUi = {
	homeLabel: 'ManaWG, zur Startseite',
	openApp: 'App öffnen',
	footerNote: 'ManaWG, 2026',
	legal: { notice: 'Impressum', privacy: 'Datenschutz', terms: 'AGB' },
	breadcrumbLabel: 'Brotkrumen',
	contents: 'Inhalt',
	by: 'Von',
	authorName: 'Abubakar Abditube (ManaWG)',
	published: 'Veröffentlicht am',
	updated: 'Aktualisiert am',
	// Die FAQ-Seite heißt selbst „Häufige Fragen“; dort bleibt es bei diesem Titel.
	faqHeading: (link) => (link.startsWith('Häufige Fragen') ? link : `Häufige Fragen zu ${link}`),
	sources: (date) => `Quellen (Stand ${date})`,
	guideNoteLabel: 'Über diesen Ratgeber',
	guideNote:
		'Geschrieben vom Betreiber von ManaWG. Wir prüfen die Seite bei Änderungen der Rechtslage oder der App. Fehler gefunden? Schreibt an',
	ctaTagline: 'Eure WG, an einem Ort.',
	ctaButton: 'WG kostenlos erstellen',
	ctaNote: 'Kostenlos, ohne Werbung, im Browser.',
	readNext: 'Weiterlesen',
	csvDownload: 'Als CSV herunterladen',
	printLabel: 'Drucken / als PDF speichern',
	comparisonNotice: VERGLEICHS_HINWEIS,
	groupNames: {
		features: 'Funktionen',
		compare: 'Vergleiche',
		guides: 'Ratgeber',
		about: 'Über ManaWG',
	},
	parentCrumbs: {
		guides: ['Ratgeber', '/ratgeber'],
		compare: ['Beste WG-App', '/beste-wg-app'],
		features: ['WG-App', '/wg-app'],
	},
	ogSubtitle: 'Kostenlose WG-App · manawg.com',
	ogFallback: 'Die App für den WG-Alltag',
	guideIndex: {
		title: 'WG-Ratgeber: Geld, Putzplan, Regeln, Einzug, Auszug | ManaWG',
		description:
			'Alle Ratgeber für das Leben in der WG: Kosten aufteilen, Putzplan, WG-Regeln, Streit, Mietvertrag, Kündigung, Anmeldung, Einzug und Auszug. Kostenlos.',
		h1: 'Ratgeber für das Leben in der WG',
		intro:
			'Von der Gründung über den Alltag bis zum Auszug: Hier stehen alle Ratgeber zu Geld, Putzen, Regeln und Verträgen in der WG. Mit Beispielrechnungen, Vorlagen und Checklisten zum Übernehmen.',
		crumb: 'Ratgeber',
		collectionName: 'WG-Ratgeber',
		clusters: {
			money: 'Geld',
			household: 'Haushalt',
			together: 'Zusammenleben',
			moving: 'Gründen, Ein- und Auszug',
			more: 'Weitere',
		},
	},
};
