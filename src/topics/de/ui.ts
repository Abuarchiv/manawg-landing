import type { TopicUi } from '../types.ts';
import { COMPARISON_NOTICE } from './comparison.ts';

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
	// The FAQ page is itself called "Häufige Fragen"; it keeps this title there.
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
	comparisonNotice: COMPARISON_NOTICE,
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
