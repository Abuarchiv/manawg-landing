import type { TopicUi } from './ui.ts';

// English topic frame strings. German terms stay out of the frame; pages explain them once.
export const UI_EN: TopicUi = {
	homeLabel: 'ManaWG home page',
	openApp: 'Open the app',
	footerNote: 'ManaWG, 2026',
	legal: { notice: 'Legal notice', privacy: 'Privacy policy', terms: 'Terms' },
	breadcrumbLabel: 'Breadcrumb',
	contents: 'Contents',
	by: 'By',
	authorName: 'Abubakar Abditube (ManaWG)',
	published: 'Published',
	updated: 'Updated',
	// One fixed section title; deriving it from the page link reads badly for verb phrases and German nouns.
	faqHeading: () => 'Frequently asked questions',
	sources: (date) => `Sources (as of ${date})`,
	guideNoteLabel: 'About this guide',
	guideNote:
		'Written by the person who runs ManaWG. This page is reviewed whenever the rules or the app change. Spotted a mistake? Email',
	ctaTagline: 'Your flat, in one place.',
	ctaButton: 'Create a flat for free',
	ctaNote: 'Free, no ads, in the browser.',
	readNext: 'Read next',
	csvDownload: 'Download as CSV',
	printLabel: 'Print / save as PDF',
	comparisonNotice:
		'This comparison was written by ManaWG, the provider of the flat-share app featured here, so it is not an independent ranking. Confirmed statements about other providers link to their sources, and anything we could not verify is marked as such. Please check the current details with the providers themselves.',
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
		title: 'Flat-share guides: money, rota, rules, moving | ManaWG',
		description:
			'Guides to life in a shared flat in Germany: splitting costs, a cleaning rota, house rules, conflicts, tenancy, notice, registration, moving in and out. Free.',
		h1: 'Guides to living in a shared flat',
		intro:
			'From starting a flat share through everyday life to moving out: guides on money, cleaning, house rules and contracts in a German WG (shared flat). They come with worked examples, templates and checklists you can copy.',
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
