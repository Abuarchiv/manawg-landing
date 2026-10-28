import type { TopicUi } from './ui.ts';

// First English draft of the topic frame strings; the topics package refines it.
export const UI_EN: TopicUi = {
	homeLabel: 'ManaWG, to the home page',
	openApp: 'Open the app',
	footerNote: 'ManaWG, 2026',
	legal: { notice: 'Legal notice', privacy: 'Privacy policy', terms: 'Terms' },
	breadcrumbLabel: 'Breadcrumb',
	contents: 'Contents',
	by: 'By',
	authorName: 'Abubakar Abditube (ManaWG)',
	published: 'Published',
	updated: 'Updated',
	// The FAQ page is itself called “Frequently asked questions”; it keeps that title.
	faqHeading: (link) =>
		/^(faq|frequently asked)/i.test(link) ? link : `Frequently asked questions about ${link}`,
	sources: (date) => `Sources (as of ${date})`,
	guideNoteLabel: 'About this guide',
	guideNote:
		'Written by the person who runs ManaWG. We review this page when the rules or the app change. Spotted a mistake? Email',
	ctaTagline: 'Your flat, in one place.',
	ctaButton: 'Create a flat for free',
	ctaNote: 'Free, no ads, in the browser.',
	readNext: 'Read next',
	csvDownload: 'Download as CSV',
	printLabel: 'Print / save as PDF',
	comparisonNotice:
		'ManaWG, the provider of the flat-share app featured here, wrote this comparison, so it is not an independent ranking. Confirmed statements about other providers link to their sources; details we could not verify are marked as such. Check the current status with the providers themselves.',
	groupNames: {
		features: 'Features',
		compare: 'Comparisons',
		guides: 'Guides',
		about: 'About ManaWG',
	},
	parentCrumbs: {
		guides: ['Guides', '/en/guides'],
		compare: ['Best flat-share app', '/en/best-flat-share-app'],
		features: ['Flat-share app', '/en/flat-share-app'],
	},
	ogSubtitle: 'Free flat-share app · manawg.com',
	ogFallback: 'The app for everyday flat life',
	guideIndex: {
		title: 'Flat-share guides: money, cleaning, rules, moving in and out | ManaWG',
		description:
			'Guides for life in a shared flat in Germany: splitting costs, a cleaning rota, house rules, conflicts, tenancy, notice, registration, moving in and out. Free.',
		h1: 'Guides for life in a shared flat',
		intro:
			'From starting a flat share through everyday life to moving out: guides on money, cleaning, house rules and contracts in a German WG (shared flat). With worked examples, templates and checklists to copy.',
		crumb: 'Guides',
		collectionName: 'Flat-share guides',
		clusters: {
			money: 'Money',
			household: 'Household',
			together: 'Living together',
			moving: 'Starting, moving in and out',
			more: 'More',
		},
	},
};
