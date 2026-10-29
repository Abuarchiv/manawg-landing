export interface Topic {
	/** Short link text for cross references. */
	link: string;
	title: string;
	description: string;
	h1: string;
	intro: string;
	sections: Array<[string, string]>;
	/** Tables as data; `after` is the section heading the table follows. */
	tables?: Array<{
		after: string;
		title: string;
		header: string[];
		rows: string[][];
		/** Footnote below the table. */
		note?: string;
	}>;
	/** Additionally emitted as FAQPage JSON-LD. */
	faq?: Array<[string, string]>;
	/** Last content change (ISO date), for lastmod in the sitemap. */
	updated: string;
	/** First publication (ISO date), for datePublished. */
	published: string;
	/** Sources as [name, URL]; shown as the source list, Article citation and llms-full. */
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
