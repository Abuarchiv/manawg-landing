export interface Topic {
	/** Kurzer Linktext für Querverweise. */
	link: string;
	title: string;
	description: string;
	h1: string;
	intro: string;
	sections: Array<[string, string]>;
	/** Tabellen als Daten; `nach` ist die Abschnittsüberschrift, hinter der die Tabelle steht. */
	tables?: Array<{
		after: string;
		title: string;
		header: string[];
		rows: string[][];
		/** Fußnote unter der Tabelle. */
		note?: string;
	}>;
	/** Wird zusätzlich als FAQPage-JSON-LD ausgegeben. */
	faq?: Array<[string, string]>;
	/** Letzte inhaltliche Änderung (ISO-Datum), für lastmod in der Sitemap. */
	updated: string;
	/** Erste Veröffentlichung (ISO-Datum), für datePublished. */
	published: string;
	/** Belege als [Name, URL]; erscheinen als Quellenliste, Article-citation und llms-full. */
	sources?: Array<[string, string]>;
	/** Interactive tool rendered after the section with the exact heading `after`; `csv` adds a download and print link. */
	widget?: { after: string; kind: 'rota-generator' | 'rent-calculator'; csv?: string };
}

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
