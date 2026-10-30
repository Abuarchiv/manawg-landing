// Every user-visible, aria and schema string of the home page, one dictionary per language.
// German lives in de.ts (moved verbatim from the components), English in en.ts. Layout and motion
// never depend on the language; only the copy changes.

/** Text broken over lines with <br />. Keep a trailing space on a line when the original markup had one. */
export type Lines = readonly string[];

/** One of the four room cards of the flat scene. */
interface RoomCard {
	/** Counter, e.g. "01 / 04". */
	number: string;
	/** Mono label of the room, uppercase literal. */
	room: string;
	title: string;
	text: string;
	rowTitle: string;
	rowSub: string;
	/** Amount, empty when the card has none. */
	amount: string;
}

interface Step {
	number: string;
	title: string;
	text: string;
}

export interface HomeDict {
	/** Skip link, first tab stop. */
	skip: string;
	/** Aria labels of the landmarks. */
	aria: {
		intro: string;
		flat: string;
		features: string;
	};
	/** App routes (path only, joined with the app origin) and site routes behind the buttons and footer links. */
	links: {
		create: string;
		/** Second button of the finale. */
		invite: string;
		/** "Accept an invitation" in the footer. */
		inviteFooter: string;
		login: string;
		guides: string;
		legalNotice: string;
		privacy: string;
		terms: string;
		/** Counterpart of this page in the other language. */
		other: string;
		/** Install guide for iPhone, Android and desktop (section of the app topic page), behind the hero button. */
		install: string;
	};
	header: { cta: string };
	loader: { label: string };
	hints: {
		scroll: string;
	};
	hero: { title: Lines; sub: string; install: string };
	/** Demo film on the hero (HeroDemo.tsx). */
	heroDemo: {
		aria: string;
		/** Mono label above the chapters. */
		label: string;
		/** Chapter names, uppercase, in film order. */
		chapters: readonly [string, string, string, string, string];
		pause: string;
		play: string;
	};
	/** The four room cards. */
	rooms: readonly [RoomCard, RoomCard, RoomCard, RoomCard];
	/** Mono labels in the canvas, order of the floor plan: kitchen, bathroom, Jona, hallway, living room, Lea, Lina, Mika. */
	canvasRooms: readonly [string, string, string, string, string, string, string, string];
	/** Names of the flatmates walking through the plan, order of the avatars. */
	people: readonly [string, string, string, string];
	howItWorks: { prefix: string; title: string; steps: readonly [Step, Step, Step] };
	depth: {
		srHeading: string;
		hint: string;
		/** Counter prefix incl. trailing space. */
		counter: string;
		captions: readonly [
			{ label: string; text: string },
			{ label: string; text: string },
			{ label: string; text: string },
		];
	};
	/** Words flown through in the tunnel, uppercase, at most 13 characters. */
	tunnelWords: readonly [string, string, string];
	faq: readonly (readonly [question: string, answer: string])[];
	questions: { prefix: string; title: string };
	finale: { title: Lines; create: string; invite: string };
	footer: {
		tagline: string;
		copyright: string;
		language: string;
		product: string;
		features: string;
		howItWorks: string;
		questions: string;
		guides: string;
		account: string;
		create: string;
		invite: string;
		login: string;
		legal: string;
		legalNotice: string;
		privacy: string;
		terms: string;
	};
	schema: {
		description: string;
		featureList: readonly string[];
		browserRequirements: string;
	};
}
