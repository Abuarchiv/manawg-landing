// Every user-visible, aria and schema string of the home page, one dictionary per language.
// German lives in de.ts (moved verbatim from the components), English in en.ts. Layout and motion
// never depend on the language; only the copy changes.

/** Text broken over lines with <br />. Keep a trailing space on a line when the original markup had one. */
export type Lines = readonly string[];

/** One of the four room cards of the flat scene. */
export interface RoomCard {
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

export interface Step {
	number: string;
	title: string;
	text: string;
}

export interface InstallWay {
	/** Tab name. */
	name: string;
	/** Three steps; "≡" and "⋮" are swapped for the real icons. */
	steps: readonly [string, string, string];
}

export interface IosStrings {
	/** Labels below the app icons of the home screen. */
	homeFitness: string;
	homeWatch: string;
	homeReminders: string;
	homeFiles: string;
	homePreview: string;
	homeUtilities: string;
	homeContacts: string;
	search: string;
	/** Safari page menu ("side menu" in the German UI), eight rows. */
	pageMenuAria: string;
	menuShare: string;
	menuAddBookmark: string;
	menuAddBookmarkTo: string;
	menuFind: string;
	menuZoom: string;
	menuNotify: string;
	menuHideItems: string;
	menuExtension: string;
	/** Share sheet. */
	sheetTitle: string;
	sheetOptions: string;
	sheetReminders: string;
	sheetMore: string;
	actionCopy: string;
	actionBookmark: Lines;
	actionReadingList: Lines;
	actionShowMore: Lines;
	actionShowLess: Lines;
	listAddBookmarkTo: string;
	listFavourites: string;
	listFind: string;
	listAddToHome: string;
	listMarkup: string;
	listPrint: string;
	listOpenInSafari: string;
	/** Add to Home Screen dialog. */
	dialogTitle: string;
	dialogAdd: string;
	dialogWebApp: string;
	dialogFoot: string;
	/** Keyboard: suggestion, three letter rows with their side padding [left, right], space bar label. */
	keySuggestion: string;
	keyRows: readonly [string, string, string];
	keyPadding: readonly [
		readonly [number, number],
		readonly [number, number],
		readonly [number, number],
	];
	keySpace: string;
}

export interface AndroidStrings {
	/** Chrome menu entries; an empty string is a separator. */
	menu: readonly string[];
	sheetTitle: Lines;
	sheetInstall: string;
	sheetShortcut: string;
	sheetShortcutNote: string;
	dialogTitle: string;
	dialogCancel: string;
	dialogInstall: string;
	toastInstalling: string;
	toastInstalled: string;
}

export interface DesktopStrings {
	chip: string;
	tooltip: string;
	dialogTitle: string;
	dialogCancel: string;
	dialogInstall: string;
}

export interface HomeDict {
	/** Skip link, first tab stop. */
	skip: string;
	/** Aria labels of the landmarks. */
	aria: {
		intro: string;
		flat: string;
		appPreview: string;
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
	};
	header: { cta: string };
	loader: { label: string };
	hints: {
		skipIntro: string;
		skipIntroAria: string;
		/** Focus anchor to the app preview. */
		tryApp: string;
		scroll: string;
	};
	hero: { title: Lines; sub: string; install: string };
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
	install: {
		prefix: string;
		title: string;
		/** Heading in two lines; the second one never breaks. */
		heading: readonly [string, string];
		lead: string;
		platformAria: string;
		ways: readonly [InstallWay, InstallWay, InstallWay];
		/** Token kept on one line inside the steps. */
		nowrap: string;
		iconMenuAria: string;
		iconDotsAria: string;
		/** Extra line below the desktop steps. */
		desktopExtra: string;
		cta: string;
		ios: IosStrings;
		android: AndroidStrings;
		desktop: DesktopStrings;
	};
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
	end: { title: Lines; cta: string };
	phone: { aria: string; frameTitle: string; hint: string };
	schema: {
		description: string;
		featureList: readonly string[];
		browserRequirements: string;
	};
}
