// English feature, comparison, FAQ and about pages. Keys are English slugs (see TOPIC_SLUG_EN).
// Internal links are written without the /en prefix; the renderer adds it.
import type { Thema } from '../themen.ts';

/** Anything the cited sources do not support reads like this in a comparison table. */
const NC = 'not checked';

const COMPARISON_ROWS = [
	'Split expenses',
	'Cleaning rota',
	'Shopping list',
	'Calendar',
	'Chat',
	'Currencies',
	'Price',
];

/** The ManaWG column; every cell is backed by the app itself. */
const MANAWG_CELLS = [
	'equal or custom amounts, fixed costs, monthly statement',
	'fair rotation, time away, reminders',
	'with supplies',
	'with calendar subscription',
	'chat and noticeboard',
	'euros only',
	'free, no ads',
];

/** ManaWG against one provider. `cells` follows COMPARISON_ROWS; missing cells read “not checked”. */
function comparisonTable(
	provider: string,
	cells: string[],
	note: string,
): NonNullable<Thema['tabellen']>[number] {
	return {
		nach: 'einleitung',
		titel: `ManaWG and ${provider} compared`,
		kopf: ['Feature', 'ManaWG', provider],
		zeilen: COMPARISON_ROWS.map((row, i) => [row, MANAWG_CELLS[i] ?? NC, cells[i] ?? NC]),
		hinweis: note,
	};
}

export const TOPICS_EN_CORE: Record<string, Thema> = {
	'flat-share-app': {
		link: 'Flat-share app',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Free flat-share app: expenses, rota, shopping | ManaWG',
		beschreibung:
			'ManaWG is the free app for everyday flat life, not a room search: expenses, cleaning rota, shopping list, calendar and chat in your browser, no app store.',
		h1: 'The flat-share app for money, cleaning, shopping and plans',
		einleitung:
			'A note on the fridge and a WhatsApp group where anything important gets buried: that is how many a WG (shared flat) runs. ManaWG brings expenses, cleaning rota, shopping, supplies, calendar, chat and noticeboard into one free app, in English and German.',
		abschnitte: [
			[
				'Why an app instead of notes and WhatsApp',
				'A note cannot work out a balance, and in a group chat the question about the cleaning rota slips away between other messages. In ManaWG every topic has its place: amounts are calculated, tasks move on, events sit in the calendar. What is done stays traceable, and a new flatmate sees straight away how the flat is organised. That saves follow-up questions and arguments about who promised what. Which criteria matter when choosing an app is covered on [Best flat-share app](/best-flat-share-app).',
			],
			[
				'Room search or everyday life: what a flat-share app is',
				'People who search for a “flat-share app” sometimes want a portal for rooms and flatmates, and sometimes an app for daily life in a flat they already share. ManaWG is the second kind: you split expenses, keep a cleaning rota and a shopping list, plan events and talk things through. ManaWG does not match rooms or flatmates. For the search, [Find a flatmate](/find-a-flatmate) and the [WG-Casting questions](/wg-casting-questions) help, and [Start a flat share](/start-a-flat-share) shows how to set one up.',
			],
			[
				'Split expenses and settle up',
				'[Shared expenses](/shared-expenses) can be split equally or with a custom amount per person, and each belongs to one of six categories, such as groceries or housing. The shares always add up to exactly the amount. ManaWG suggests settlements with as few transfers as possible. You mark them as paid, because the app does not move money itself. Anyone who records an expense for someone else also carries a share of it.',
			],
			[
				'Fixed costs and the monthly statement',
				'You enter rent and internet once as fixed costs, repeating in whole months, and ManaWG books them automatically as expenses. The monthly statement shows the total, the expenses per category and the suggested transfers. It arrives by email at the start of the month, and each person can switch that off. Fixed costs can be paused, and with an equal split the odd cent moves on from one booking to the next.',
			],
			[
				'Cleaning rota, shopping and supplies',
				'The [cleaning rota app](/cleaning-rota) repeats tasks every few days or months and picks who is next according to workload. Anyone who is away enters their dates and is skipped at the next assignment. On the [shared shopping list](/shopping-list) you tick items off and can then record the shop as an expense. Supplies show what is running low and suggest what to buy. Reminders for due tasks arrive as push notifications.',
			],
			[
				'Calendar, noticeboard and chat',
				'The calendar handles repeating events and can be subscribed to from Apple Calendar or Google Calendar, in that direction only. ManaWG sends a push notification the day before an event. The noticeboard is for announcements, questions and decisions, and the chat for quick exchanges with replies, reactions and mentions. You switch push notifications on or off for each area.',
			],
			[
				'Who ManaWG is for',
				'Student flats, professional flat shares and a couple sharing with a flatmate: up to 20 active members fit in one flat. People join with a code or a link, and invitations can also go out by email. You sign in with Google or with email and password. The app runs in the browser and can be added to your home screen. The interface is in English and German and follows the language of your device.',
			],
			[
				'How your flat gets started',
				'One person signs in with Google or email and password, creates the flat and shares the invite link. The others sign in too and join through the link. Start with one concrete everyday problem: record the [first shared expense](/shared-expenses) or add a repeating cleaning task. That way you use the app together straight away, rather than setting up every area first.',
			],
			[
				'Installing ManaWG: iPhone, Android, desktop',
				'iPhone: in Safari, tap ≡, then Share, then Show More, choose “Add to Home Screen” and tap Add. Then open ManaWG from the home screen and sign in once.\nAndroid: in Chrome, tap the menu ⋮, choose “Install and create shortcut”, then “Install” and confirm.\nDesktop: click the “Install” icon on the right of the address bar, then “Install” in the dialog.',
			],
			[
				'Working without a connection',
				'If the network drops while you are out, ManaWG saves new entries on your device and sends them as soon as you are back online. That covers shopping entries, time away, new and completed cleaning tasks, expenses and fixed costs. Settings show how many actions are still waiting. After about seven days, actions that were left behind are no longer sent automatically but shown to you for review.',
			],
			[
				'Taking your data and statements with you',
				'Any member can download the flat’s data from Settings under Data: everything as JSON, or single areas as CSV, for example expenses, fixed costs, shopping, cleaning rota, supplies, events, noticeboard or chat. You can page through the monthly statement month by month and print it or save it as a PDF.',
			],
		],
		tabellen: [
			{
				nach: 'einleitung',
				titel: 'What the ManaWG flat-share app covers',
				kopf: ['Area', 'What you can do', 'Limits'],
				zeilen: [
					[
						'Expenses',
						'split equally or with custom euro amounts, book fixed costs automatically, suggested transfers, monthly statement as PDF',
						'euros only, no percentage shares, you transfer the money yourselves',
					],
					[
						'Cleaning rota',
						'repeat every few days or months, distribution by workload, “Next up” preview, time away, push reminders',
						'no fixed order, no points',
					],
					[
						'Shopping',
						'shared list, supplies, turn a shop into an expense',
						'entries made offline are sent later',
					],
					[
						'Calendar',
						'repeating events, subscription in Apple or Google Calendar, push the day before',
						'subscription works in one direction only',
					],
					[
						'Chat and noticeboard',
						'replies, reactions, mentions, announcements and decisions',
						'push can be switched off per area',
					],
					[
						'Data',
						'import from Splitwise or Splid CSV or from a screenshot, export as JSON and CSV',
						'no import from Tricount or Flatastic',
					],
					[
						'Access',
						'in the browser, installable on the home screen, join by invite link or email invitation',
						'no app store, English and German, up to 20 active members',
					],
				],
				hinweis: 'Details from the app, as of 29 October 2026.',
			},
		],
		fragen: [
			[
				'How much does the ManaWG flat-share app cost?',
				'Nothing. ManaWG is free and shows no ads. There is no paid tier or subscription, and every area is open to every flat.',
			],
			[
				'Is ManaWG in the App Store, and is it available in English?',
				'It is available in English, but not in the App Store. ManaWG is not a native app: you open app.manawg.com in the browser and add it to your home screen. The interface is in English and German, and amounts are kept in euros only.',
			],
			[
				'How many people fit in one flat?',
				'Up to 20 active members. People who have moved out do not count, and their history is kept. Admins can revoke invitations at any time.',
			],
			[
				'Can I switch from Splitwise or Splid?',
				'Yes, with a CSV import that has a preview and an undo. Rows in euros are imported, and rows in other currencies are rejected one by one without stopping the whole import.',
			],
			[
				'Does ManaWG work without internet?',
				'In part. If the network drops, ManaWG saves new entries on your device and sends them once you are back online: shopping entries, time away, new and completed cleaning tasks, expenses and fixed costs. After about seven days, actions that were left behind are no longer sent automatically but shown to you for review.',
			],
			[
				'Can I export our flat’s data?',
				'Yes. Any member downloads the flat’s data from Settings under Data, everything as JSON or single areas as CSV, such as expenses, fixed costs, shopping or cleaning rota. The monthly statement can be printed or saved as a PDF.',
			],
			[
				'Is ManaWG an app for finding a room?',
				'No. ManaWG matches neither rooms nor flatmates. It organises a flat that already exists. For the search, [Find a flatmate](/find-a-flatmate) and the [WG-Casting questions](/wg-casting-questions) help.',
			],
			[
				'Can I use ManaWG on a laptop?',
				'Yes. ManaWG runs in the browser at app.manawg.com, on a laptop just as on a phone. On both you can also install it as an app.',
			],
		],
	},
	'cleaning-rota': {
		link: 'Cleaning rota app',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Cleaning rota app for flats: fair and free | ManaWG',
		beschreibung:
			'Free cleaning rota app for a shared flat: tasks repeat on a set rhythm, the app shares them fairly, skips anyone away and reminds whoever is next.',
		h1: 'Cleaning rota app: tasks, fair rotation and time away',
		einleitung:
			'You add the tasks once, and ManaWG works out the dates, who is responsible and who is away. Free and in the browser, with no note on the fridge that goes out of date. If you want a rota to print, use the [cleaning rota template](/cleaning-rota-template). The steps to your own plan are in [Make a cleaning rota](/make-a-cleaning-rota).',
		abschnitte: [
			[
				'Tasks on a fixed rhythm',
				'Every task repeats every few days or months, for example the bathroom every seven days or the windows every three months. Monthly intervals stay true to the calendar, and dates are worked out in Berlin time. A task can be assigned to a member, and every completion goes into the history. That way you can see later who did what and when.',
			],
			[
				'Rotation by fairness',
				'A rigid order of “A this week, B next week” falls apart as soon as someone skips a turn. When a task is done, ManaWG picks the person with the lowest workload. Assigned and overdue tasks are counted, and overdue ones count for more. The app shows the same prediction in advance as “Next up”, so you know who is next before it happens.',
			],
			[
				'Entering time away',
				'Holiday, internship, a visit home: members enter their dates with a reason. Anyone who is away is skipped at the next assignment, and the app says how many people were left out for that reason. Tasks that are already assigned are not redistributed. The app marks them as away, and someone else can take them with “I’ll take it”. As soon as the period ends, the person counts as present again.',
			],
			[
				'Reminders on your phone',
				'Every day ManaWG sends a push notification for assigned tasks that are due today or up to seven days overdue. It arrives at most every 18 hours for each task. Each member can switch off the cleaning rota channel if they would rather not get notices. The app asks for permission before sending push. Tasks without an assigned person trigger no reminder.',
			],
			[
				'Template or app',
				'A [printable cleaning rota template](/cleaning-rota-template) is a good start if your flat is small and the week is predictable. It does not carry on by itself and knows nothing about time away, so you enter every change yourself. If you do not want to keep the order up to date all the time, an app that carries responsibility and dates forward is the better fit. How to set tasks, rhythm and responsibilities is explained in [Make a cleaning rota](/make-a-cleaning-rota).',
			],
			[
				'Setting up and scope',
				'Members join through an invite link or an email invitation, and up to 20 active people fit in one flat. ManaWG is free, has no ads and is available in English and German. You install it as a PWA through the browser, and there is no app store listing. Besides the cleaning rota there are expenses, shopping, supplies, calendar, chat and noticeboard. All areas are introduced on [Flat-share app](/flat-share-app).',
			],
		],
		fragen: [
			[
				'What is the difference between a cleaning rota app and a template?',
				'A printable template only holds what you write in by hand and does not carry on by itself. In the app you add the tasks directly, and the rhythm, responsibility and history of completions are built in. The printable version is on the cleaning rota template page.',
			],
			[
				'How does the fair rotation work?',
				'When a task is completed, ManaWG picks the person with the lowest workload. Assigned and overdue tasks are counted (overdue ones count for more), and anyone who is away is skipped. In the interface you see this prediction in advance as “Next up”.',
			],
			[
				'What happens when someone is on holiday?',
				'The person enters the dates as time away. At the next assignment after a task is completed, they are skipped. Tasks that were already assigned stay with them and are marked as away. The app shows how many people were left out because of time away.',
			],
			[
				'Does the cleaning rota app cost anything?',
				'No. ManaWG is free and shows no ads. The app is available in English and German, and a flat can have at most 20 active members.',
			],
			[
				'Is the app in the App Store?',
				'No, ManaWG is not a native app. You install it as a PWA through the browser, with manual steps on iOS and Firefox, and you can set push notifications for each area.',
			],
		],
		tabellen: [
			{
				nach: 'Template or app',
				titel: 'Printable template and ManaWG compared',
				kopf: ['Feature', 'Printable template', 'ManaWG'],
				zeilen: [
					['Distribution', 'by hand', 'by workload'],
					['Time away', 'enter it yourself', 'skipped at assignment'],
					['Reminders', 'none', 'reminder to whoever is responsible'],
				],
			},
		],
	},
	'shared-expenses': {
		link: 'Shared expenses',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Shared expenses app: split costs, settle up | ManaWG',
		beschreibung:
			'The free app for shared flat expenses: split costs, settle up with few transfers, book fixed costs and get the monthly statement by email.',
		h1: 'The shared expenses app for costs, fixed costs and statements',
		einleitung:
			'Who paid for the loo roll, and who still owes whom? ManaWG is a free shared expenses app in English and German for a WG (shared flat). Every expense lands in everyone’s balance at once, with no notes and no spreadsheet.',
		abschnitte: [
			[
				'Splitting expenses in a flat',
				'You enter the amount, who paid and who took part, and pick one of six categories, such as groceries or household. You split equally or with a custom amount per person. ManaWG works in whole cents: with an equal split the shares differ by one cent at most, and the total is always exact. A photo of the receipt can be attached straight to the expense.',
			],
			[
				'Worked example: €120 for three people',
				'A fictional example: Lea pays €90 for shared groceries, Jona pays €30 for household supplies and Lina has paid nothing yet. Both purchases are split equally between all three. Together that is €120, so €40 per person. Lea has paid €50 more than her share, Jona is €10 short and Lina €40. To settle up, Jona pays Lea €10 and Lina pays Lea €40. You make these payments outside the app and then mark them as paid. More examples and rules for unequal shares are in the guide [Split flat costs](/split-flat-costs).',
			],
			[
				'Settling up with few transfers',
				'ManaWG works out a balance for each person and suggests payments that square the flat with as few transfers as possible. That saves effort. The money moves outside the app, by bank or in cash. Afterwards you mark one share, or several together, as paid. There is no bank connection and no SEPA.',
			],
			[
				'Booking fixed costs automatically',
				'You enter rent, electricity, internet or streaming once as fixed costs. The interval counts in whole months, for example monthly or every three months. The app books due items itself as expenses each day. A date on the 31st moves to the 28th in February and then jumps back. A fixed cost can be paused. There are no weekly intervals. How to share the rent by room size is worked out by the [rent split calculator](/rent-split-calculator). Electricity, internet and back payments are covered in [Utilities and internet](/utilities-and-internet), and the broadcasting fee in [Rundfunkbeitrag in a shared flat](/rundfunkbeitrag-shared-flat).',
			],
			[
				'The monthly statement',
				'The statement shows the total, individual items and the expenses per category with a percentage share. For each member it shows what was paid, what the share was and what the balance is. It also lists the suggested transfers and says whether everything is settled. It arrives by email on the first of the month, and each member can switch that off.',
			],
			[
				'Reminders without the friction',
				'On the Reminders page a member can send a payment reminder with the Remind button. A cooling-off period limits how often that can happen in a row, and a rate limit stops too many requests. The balance stays visible to everyone at any time, for example in the monthly statement. The page is its own area of the flat, next to expenses, statement and activity. How to bring up open amounts without an argument is covered in [Flatmate debts](/flatmate-debts).',
			],
			[
				'Moving over from Splitwise or Splid',
				'If your previous accounts exist as a CSV file, you bring them into your flat with the import, and the steps are in [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). You see a preview first, an import history shows earlier runs, and an import can be undone. Only euro amounts are imported, and ManaWG rejects other currencies row by row. A photo or screenshot of an expense list can also be read in and corrected before saving. If you come from Tricount, the differences are on [Tricount alternative](/tricount-alternative).',
			],
			[
				'What ManaWG is not',
				'ManaWG is meant for flats with up to 20 active members, is available in English and German and works in euros only. It is installed as a PWA through the browser, not through an app store. You sign in with Google or email. The app is free and has no ads. What the app offers beyond expenses is on [Flat-share app](/flat-share-app).',
			],
		],
		fragen: [
			[
				'Is the shared expenses app free?',
				'Yes, ManaWG costs nothing and shows no ads. You use the app in the browser or install it as a PWA on your phone.',
			],
			[
				'How does settling up with few transfers work?',
				'ManaWG forms a net balance for each person from what they paid and what they owe, and suggests payments that settle everyone. You pay outside the app and then mark the amount as paid.',
			],
			[
				'Can I split fixed costs such as rent automatically?',
				'Yes, as a template with an interval in months. With an equal split, an odd cent moves on from one booking to the next person.',
			],
			[
				'Can I bring over data from Splitwise?',
				'If it exists as a CSV file, yes: through the CSV import from Splitwise or Splid, with a preview and an undo. Only amounts in euros are imported, and rows in other currencies are rejected one by one.',
			],
			[
				'How many people fit in one flat?',
				'Up to 20 active members. Anyone who moves out is deactivated and no longer counts, and their history is kept. Others join through an invite link or an email invitation.',
			],
		],
	},
	'shopping-list': {
		link: 'Shopping list',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Shared shopping list app for your flat | ManaWG',
		beschreibung:
			'The shared shopping list for a flat: everyone adds items, supplies flag what to restock, and a shop becomes a shared expense in one step. Free.',
		h1: 'One shopping list for the whole flat',
		einleitung:
			'Three people, three notes, milk bought twice. ManaWG gives your flat one shopping list that looks the same on every phone, plus supplies and a way to turn a shop into an expense.',
		abschnitte: [
			[
				'Everyone adds to it',
				'Anyone in the flat adds what is missing, with a quantity such as “2 packs” or “1 kg” if they like. Whoever goes shopping ticks items off, and everyone else sees the current state. ManaWG remembers who ticked an item and spots duplicates before the same item appears twice. The list belongs to the flat, not to one person. Which purchases you plan together and which stay private is worked out with the guide [Organise flat shopping](/organise-flat-shopping).',
			],
			[
				'Suggestions and tidying up',
				'As you type, ManaWG makes suggestions so you do not retype every item. Ticked entries stay on the list at first, so you can see what is already bought. When the list gets cluttered, you clear all ticked entries in one step through a dialog. The suggestions save most time on things that are on the list every week.',
			],
			[
				'Supplies instead of notes in your head',
				'For things that should never run out, you keep supplies with a name, quantity, unit and threshold. Whoever uses something logs it, and ManaWG keeps a usage log. “Quick restock” suggests items that are nearly empty and those used often in the last 30 days. That way the restock is on the list before the last pack is empty.',
			],
			[
				'From shop to expense',
				'After ticking items off, the person who has just shopped sees a prompt to record the items straight away as an expense. It stays for 12 hours. The expense lands in [Shared expenses](/shared-expenses), gets the category groceries or household, and you can attach a photo of the receipt. Nobody has to reconstruct later what was in the trolley.',
			],
			[
				'Splitting without rounding arguments',
				'ManaWG stores amounts in whole cents. With an equal split the shares add up to exactly the amount, and no share differs from another by more than one cent. With custom amounts per person, only those who really ate pay. The balances then show who owes whom. Everything is calculated in euros, and there are no exchange rates.',
			],
			[
				'In the supermarket, even with a weak signal',
				'ManaWG runs in the browser at app.manawg.com and can be added to the home screen without an app store. If the network drops while you are out, the app keeps actions locally and sends them later. After 7 days, actions that were left behind are no longer sent automatically but shown to you for review. Each person switches push notifications for shopping and supplies on or off. What else the app can do is on [Flat-share app](/flat-share-app).',
			],
		],
		fragen: [
			[
				'Is the shared shopping list free?',
				'Yes. ManaWG costs nothing, and there is no paid tier and no ads. The shopping list, supplies and every other area are open to every flat.',
			],
			[
				'How does a shop become an expense?',
				'After ticking items off, ManaWG shows the person who bought them a prompt to record the items as an expense. It stays for 12 hours. Then you enter the amount and split it.',
			],
			[
				'Do I need an app store for this?',
				'No. ManaWG runs in the browser at app.manawg.com. On iPhone and Android you add it to the home screen. There is no native app in the App Store or on Google Play.',
			],
			[
				'How many people can use the list?',
				'A flat holds up to 20 active members. Members who have moved out do not count. Everyone sees the same shopping list and the same supplies.',
			],
			[
				'How do supplies work?',
				'You add supplies with a quantity, unit and threshold and log what is used. “Quick restock” suggests items that are nearly empty or used often for you to buy again.',
			],
		],
	},
	'best-flat-share-app': {
		link: 'Best flat-share app',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Best flat-share app 2026: 7 criteria | ManaWG',
		beschreibung:
			'Which flat-share app suits you? Compared on expenses, cleaning rota, shopping, calendar and price: ManaWG, Flatastic, Splitwise, Splid, Tricount, OurHome.',
		h1: 'The best flat-share app: 7 criteria for choosing',
		einleitung:
			'There are many apps for a WG (shared flat), and none is the best for every flat. Some only handle money, others only organise the household. This page is not an independent ranking but the view of ManaWG, the provider. These seven criteria help you find the app that fits your daily life before you ask every flatmate to switch.',
		quellen: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['Splid (English)', 'https://splid.app/english'],
			['Flatastic', 'https://www.flatastic-app.com/en/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['Tricount features', 'https://tricount.com/features'],
			[
				'Tricount on the App Store (UK)',
				'https://apps.apple.com/gb/app/tricount-split-group-expenses/id349866256',
			],
			['What is ManaWG?', 'https://manawg.com/en/about-manawg'],
		],
		tabellen: [
			{
				nach: 'einleitung',
				titel: 'Flat-share apps compared',
				kopf: ['Feature', 'Flatastic', 'ManaWG', 'OurHome', 'Splid', 'Splitwise', 'Tricount'],
				// Columns are alphabetical so the table does not suggest a ranking.
				zeilen: COMPARISON_ROWS.map((row, i) => [
					row,
					...[
						[
							'finances per provider',
							'chores per provider',
							'shopping per provider',
							NC,
							'noticeboard per provider, chat not checked',
							NC,
							'Premium is paid per provider',
						],
						MANAWG_CELLS,
						[],
						['yes, in groups', NC, NC, NC, NC, 'over 150 per provider', 'free per provider'],
						['yes', NC, NC, NC, NC, 'conversion in Pro per provider', 'Pro plan per provider'],
						['yes', NC, NC, NC, NC, 'multiple currencies per provider', 'free per provider'],
					].map((column) => column[i] ?? NC),
				]),
				hinweis:
					'Details on other providers come from their English pages, checked on 29 October 2026. Anything the sources do not support reads “not checked”. Columns are alphabetical, not a ranking.',
			},
		],
		abschnitte: [
			[
				'1. What does the app really cost?',
				'Check whether features are unlocked only with a subscription, whether ads appear and whether there are limits on the number of entries. Plans change, so look at each provider yourself. The [free flat-share app ManaWG](/flat-share-app) has no ads and no paid tier. Splitwise Pro lists, among other things, unlimited expenses, no ads, receipt scanning and currency conversion. The limits of [the free version of Splitwise](/splitwise-free-limit) are covered on their own page. Splid says on its English page that it is free, with over 150 currencies, offline use and PDF and Excel export. Flatastic covers chores, shopping, finances and a pinboard, and offers a paid Premium with no ads and a cleaning history, among other things. ManaWG is free and ad-free and combines expenses, cleaning rota, shopping list, calendar, noticeboard and chat. It works in euros only, is available in English and German, and is meant for at most 20 active members per flat. Plans and features change, so check the current state with the providers themselves.',
			],
			[
				'2. Does it cover money and household?',
				'Pure expense apps solve the money problem, household apps organise tasks. If you want money and household in one place, you need an app with expenses, a cleaning rota and a shopping list, such as ManaWG. ManaWG covers both: expenses, fixed costs and a monthly statement on one side, cleaning rota with time away, shopping list with supplies, calendar, noticeboard and chat on the other.',
			],
			[
				'3. How good is the expense tracking?',
				'Good expense tracking splits unequally, handles fixed costs, shows balances and suggests settlements with few transfers. Also look at how odd cents are handled and whether you can import existing data from a file.',
			],
			[
				'4. How fair is the cleaning rota?',
				'What matters is fair rotation, repeating every few days or months, how time away is handled and reminders. A points system motivates some flats and feels like policing to others. ManaWG distributes by workload and manages without points.',
			],
			[
				'5. Does everyone have to install an app?',
				'The higher the hurdle, the likelier someone does not join in. A web app that runs in the browser and is joined by link lowers that hurdle. ManaWG runs without an app store and can be added to the home screen.',
			],
			[
				'6. Privacy and language',
				'Where is the data stored, are there ads and tracking, and is the app in your language? With ManaWG the data is stored in the EU, there are no ads, and the app is available in English and German. There are no currencies other than the euro. If you split costs in many currencies internationally, an app with currency conversion is the better choice.',
			],
			[
				'7. How easy is switching?',
				'If you already have data from Splitwise or Splid as a CSV file, you should be able to take it with you. ManaWG imports expenses from such CSV files and shows a preview first, and the steps are in [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). Detailed comparisons are on [Splitwise alternative](/splitwise-alternative), [Splid alternative](/splid-alternative), [Flatastic alternative](/flatastic-alternative), [Tricount alternative](/tricount-alternative) and [OurHome alternative](/ourhome-alternative).',
			],
			[
				'Which app suits which flat?',
				'You mostly share money, also on trips and in several currencies: Splid lists over 150 currencies, Tricount multiple currencies and Splitwise conversion in its Pro plan, each per the provider. ManaWG works in euros only.\nYou want money, cleaning rota, shopping, calendar and noticeboard in one app with no subscription and no app store, in English or German: ManaWG is built for that.\nYou want points or rewards for cleaning: ManaWG does not offer that, as the cleaning rota distributes by workload.\nYou have old expenses from Splitwise or Splid as a CSV file: ManaWG imports them with a preview, and the steps are in [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid).\nThere are more than 20 of you: a flat in ManaWG holds at most 20 active members.',
			],
		],
		fragen: [
			[
				'Which flat-share app is free?',
				'ManaWG is completely free, with no ads and no paid tier. With other apps, what the free plan covers depends on the provider and can change.',
			],
			[
				'Is there a flat-share app with a cleaning rota and expenses in one?',
				'Yes. ManaWG combines expense splitting, cleaning rota, shopping list, calendar, noticeboard and chat in one app, in English and German, in euros and for up to 20 members per flat.',
			],
			[
				'Which app suits trips with several currencies?',
				'An expense app with exchange rates suits that better. ManaWG works in euros only and is meant for everyday flat life.',
			],
			[
				'Where is ManaWG’s data stored?',
				'The database is hosted with Supabase in Frankfurt am Main (EU). Resend (USA) is used to send email. Which data goes to whom is set out in the privacy policy.',
			],
			[
				'Is there a flat-share app without an app store?',
				'Yes, for example ManaWG: the web app runs in the browser at app.manawg.com and can be added to the home screen.',
			],
			[
				'Flatastic or Splitwise: which suits a flat better?',
				'It depends on what you need. Splitwise is built around shared expenses. Flatastic combines cleaning rota, shopping list, finances and a pinboard per the provider, and Premium is paid. If you want money and household in a free web app with no ads, in English or German, you will find that in the [ManaWG flat-share app](/flat-share-app), which in return works in euros only and for at most 20 members.',
			],
		],
	},
	'splitwise-alternative': {
		link: 'Splitwise alternative',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Splitwise alternative with no ads or paywall | ManaWG',
		beschreibung:
			'ManaWG is a free Splitwise alternative for flats: no ads, no paid tier, plus a cleaning rota, shopping list and CSV import.',
		h1: 'A Splitwise alternative with no paywall and no ads',
		einleitung:
			'Splitwise splits expenses reliably, and its Pro plan lists, per the provider, unlimited expenses, no ads, receipt scanning and currency conversion, among other things. What the free version covers is on [Splitwise free limit](/splitwise-free-limit). ManaWG costs nothing, shows no ads and has no paid tier. It also adds a cleaning rota, shopping list and calendar.',
		quellen: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['ManaWG flat-share app', 'https://manawg.com/en/flat-share-app'],
		],
		tabellen: [
			comparisonTable(
				'Splitwise',
				[
					'yes',
					NC,
					NC,
					NC,
					NC,
					'conversion in Pro per provider',
					'Pro plan per provider; scope of the free version not checked',
				],
				'Details on Splitwise come from the provider’s Pro page, checked on 29 October 2026. Anything the sources do not support reads “not checked”.',
			),
		],
		abschnitte: [
			[
				'What Splitwise Pro includes, per the provider',
				'The Splitwise Pro page lists unlimited expenses, an ad-free experience, receipt scanning with itemisation and conversion of bills into any currency, among other things. Transaction import from a card is described for the US only. The Pro page does not tell us exactly where the free version stops, and we have not verified the details of the free version here, so check that with Splitwise itself. Plans change, so rely on the provider’s page as of 29 October 2026.',
			],
			[
				'No paid tier, no ads',
				'In ManaWG every feature is open to every flat. There are no ads, no Pro subscription and no feature that unlocks only after a purchase. There is one limit all the same: a flat holds at most 20 active members. For shared flats that is enough, for large groups it is not. Members who have moved out do not count, and their history is kept.',
			],
			[
				'Reads photos, but is not a receipt scanner',
				'In the import you choose the source Screenshot. ManaWG reads a photo or screenshot of an expense list with text recognition in the browser and shows a preview you can correct. Only euro amounts are recognised, and reading can take up to 30 seconds. On a single receipt you only attach a photo, and it is not analysed there.',
			],
			[
				'CSV import, if your data exists as a file',
				'If your Splitwise expenses exist as a CSV file, you open your flat’s import and choose the source. Before anything is saved you see a preview of all recognised rows. Afterwards the import appears in the history and can be undone if something is wrong. So you check beforehand and can go back afterwards. The steps are in the guide [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). Only flat admins may import other members’ history.',
			],
			[
				'Euros only',
				'ManaWG works in euros only and has no exchange rates. The import rejects rows in other currencies one by one and takes the rest. For trips with several currencies an app with currency conversion is the better choice, and for everyday flat life in euros ManaWG is enough. Amounts are stored in cents, and shares add up with no rounding remainder.',
			],
			[
				'More than a shared purse',
				'You split equally or with custom amounts, add fixed costs such as rent and get suggested transfers. On top of that come the monthly statement, a cleaning rota with fair rotation, a shopping list that turns into an expense, calendar subscription, noticeboard and chat. You make the transfers yourselves, and in ManaWG you mark single shares or everything at once as paid. There is no bank connection. The expenses in detail are on [Shared expenses](/shared-expenses), the cleaning rota on [Cleaning rota app](/cleaning-rota).',
			],
		],
		fragen: [
			[
				'Is ManaWG really free?',
				'Yes. There is no paid tier and no ads. Every feature is open to every flat, including import, fixed costs and the monthly statement. The main limit is 20 active members per flat, along with euros as the only currency and size limits on images.',
			],
			[
				'Can I take my Splitwise data with me?',
				'If it exists as a CSV file, yes, through the CSV import. You see a preview first, and the import can be undone from the history. Only euro rows are imported.',
			],
			[
				'Does ManaWG read receipts from a photo?',
				'Not in the strict sense. The import reads photos or screenshots of expense lists and recognises euro amounts. A photo on a single receipt is only attached, not analysed.',
			],
			[
				'Does ManaWG work with foreign currencies?',
				'No. ManaWG works in euros only, with no exchange rates. If you split costs in several currencies on trips, an app with currency conversion suits you better.',
			],
			[
				'Is there an app in the App Store?',
				'No. ManaWG runs in the browser at app.manawg.com and can be added to the home screen as a PWA. There is no native app, but there are push notifications that you can switch off for each area.',
			],
		],
	},
	'splid-alternative': {
		link: 'Splid alternative',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Splid alternative with a cleaning rota and list | ManaWG',
		beschreibung:
			'ManaWG is a free Splid alternative for flats: split expenses plus a cleaning rota, shopping list, fixed costs and monthly statement, with no ads.',
		h1: 'A Splid alternative with a cleaning rota and shopping list',
		einleitung:
			'Splid splits expenses in groups and, on its English page, lists over 150 currencies, offline use and PDF and Excel export. For a flat, a pure expense tracker often falls short, because a household is more than bills. ManaWG joins the expenses with the rest.',
		quellen: [
			['Splid (English)', 'https://splid.app/english'],
			['ManaWG flat-share app', 'https://manawg.com/en/flat-share-app'],
		],
		tabellen: [
			comparisonTable(
				'Splid',
				['yes, in groups', NC, NC, NC, NC, 'over 150 per provider', 'free per provider'],
				'Details on Splid come from the provider’s English page, checked on 29 October 2026. Anything the sources do not support reads “not checked”.',
			),
		],
		abschnitte: [
			[
				'What Splid does, per the provider',
				'The English Splid page lists over 150 currencies, groups that work offline or online and export as PDF or Excel, and says the app is free. Details of the feature set are there as of 29 October 2026. In ManaWG, by contrast, each person signs in with Google or with email and password. In return, expenses, balances and history belong firmly to your flat, and flatmates join through an invite link or an email invitation.',
			],
			[
				'Expenses and household in one app',
				'ManaWG joins the expenses with the rest: tasks repeat every few days or months and go fairly to the person with the lowest workload, everyone sees the shopping list on their phone, and fixed costs are booked automatically as expenses. There are also supplies, calendar, noticeboard and chat if you need them. How the expenses work is shown on [Shared expenses](/shared-expenses). How the cleaning rota distributes tasks is on [Cleaning rota app](/cleaning-rota).',
			],
			[
				'Fixed costs and the monthly statement',
				'You enter rent, internet or electricity once as fixed costs. The interval counts in whole months, and a template can be paused. At the end of the month the statement shows the total, expenses per category and suggested transfers. It arrives on the 1st of the month by email, and each member can switch that off individually. With equally split fixed costs, the odd cent moves on to the next person.',
			],
			[
				'Moving over with a CSV import',
				'If your Splid expenses exist as a CSV file, you upload them under Import in your flat. You see a preview before anything is saved, and you can undo the import from the history. Only euro rows are imported, and ManaWG rejects other currencies one by one. Only flat admins may import other people’s history. If you only have screenshots, you read in a photo of an expense list and correct it before saving. The guide [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid) walks through every step.',
			],
			[
				'Splitting and settling up',
				'You split expenses equally or with custom amounts per person. The cents add up exactly. ManaWG suggests who pays whom how much, with few payments. You make the transfer yourselves, outside the app, and then mark the amount as paid. There is also a reminder for open amounts, with a cooling-off period so nobody gets pestered.',
			],
			[
				'The limits of ManaWG',
				'A flat holds at most 20 active members. The app is available in English and German and works in euros only. There is no app in the App Store: you use ManaWG in the browser at app.manawg.com and add it to your phone’s home screen. Calendar subscription and push notifications work that way too, with nothing to install from a store.',
			],
		],
		fragen: [
			[
				'Does ManaWG need an account?',
				'Yes. Each person signs in with Google or with email and password. Joining then works through an invite link or an email invitation.',
			],
			[
				'How do I bring my data over from Splid?',
				'If it exists as a CSV file, you upload the file under Import in your flat. After the preview you confirm the import. If something is wrong, you undo it from the history.',
			],
			[
				'What does ManaWG cost?',
				'Nothing. There is no paid tier and no ads. Every feature is open to every flat, including cleaning rota, shopping list and fixed costs, at no extra charge.',
			],
			[
				'Can I enter foreign currencies?',
				'No. ManaWG works in euros only. In an import, rows in other currencies are rejected one by one, and the rest of the import is unaffected.',
			],
			[
				'Is ManaWG in the App Store?',
				'No. ManaWG runs in the browser and can be added to the home screen as an app on iPhone and Android. No download from a store is needed.',
			],
		],
	},
	'flatastic-alternative': {
		link: 'Flatastic alternative',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Flatastic alternative with no ads or Premium | ManaWG',
		beschreibung:
			'ManaWG is a free Flatastic alternative for flats: cleaning rota, shared expenses, shopping, calendar and chat, with no ads and no Premium tier.',
		h1: 'Flatastic alternative: a flat-share app with no ads or Premium',
		einleitung:
			'Flatastic covers chores, shopping, finances and a pinboard per the provider, and offers a paid Premium with no ads and a cleaning history, among other things. It is best to check the current state with Flatastic itself. ManaWG is free and manages without ads and without a paid tier.',
		quellen: [
			['Flatastic', 'https://www.flatastic-app.com/en/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['ManaWG flat-share app', 'https://manawg.com/en/flat-share-app'],
		],
		tabellen: [
			comparisonTable(
				'Flatastic',
				[
					'finances per provider',
					'chores per provider',
					'shopping per provider',
					NC,
					'noticeboard per provider, chat not checked',
					NC,
					'Premium is paid per provider; scope of the free version not checked',
				],
				'Details on Flatastic come from the provider’s English pages, checked on 29 October 2026. Anything the sources do not support reads “not checked”.',
			),
			{
				nach: 'What Flatastic Premium unlocks',
				titel: 'Flatastic Premium and ManaWG',
				kopf: ['Feature', 'Flatastic per provider', 'ManaWG'],
				zeilen: [
					['Ads', 'no advertising with Premium', 'no ads'],
					['Cleaning history', 'Premium', 'history of every completion'],
					[
						'Earlier statements',
						'Premium (archive of budget breakdowns)',
						'monthly statement, page through months, print as PDF',
					],
					[
						'Export',
						'CSV of financial entries with Premium',
						'JSON and CSV for each area, for any member',
					],
					['Images on expenses', 'Premium', 'photo on a receipt, attached, not analysed'],
				],
				hinweis:
					'Details on Flatastic come from the provider’s Premium page, checked on 29 October 2026. Anything the sources do not support reads “not checked”.',
			},
		],
		abschnitte: [
			[
				'Free, no ads, no Premium',
				'ManaWG shows no ads and has no paid tier: every flat uses expenses, cleaning rota, shopping, supplies, calendar, chat and noticeboard. Whether there are two of you or ten makes no difference, as long as the flat fits within the limit of 20 active members. Members who have moved out do not count, and their history is kept.',
			],
			[
				'What Flatastic Premium unlocks',
				'Flatastic can be used free and offers a paid Premium. The provider’s Premium page lists, among other things, no advertising, the history of the cleaning plan, access to earlier budget breakdowns in an archive, images on expense entries and a CSV export of financial entries (checked on 29 October 2026). We do not quote prices, because they change; you will find them with the provider. In ManaWG every area is open with no paid tier.',
			],
			[
				'Reminders you control yourself',
				'Each member switches push notifications off for each area individually: noticeboard, cleaning rota, expenses, reminders, shopping, supplies, chat and calendar. The cleaning rota reminds about tasks that are due today or up to seven days overdue and assigned to someone, at most every 18 hours for each task. Events notify you the day before, repeating ones too. Emails such as the monthly statement or payment reminders can be switched off as well.',
			],
			[
				'A cleaning rota with fair rotation',
				'Tasks repeat every few days or months. When one is done, ManaWG decides by workload who is responsible next. Anyone who is away is skipped, and the app says how many people were left out for that reason. Monthly intervals stay true to the calendar, and dates are worked out in Berlin time. Completed tasks go into the history. More is on [Cleaning rota app](/cleaning-rota). Flatastic describes a points system in its chore planner. ManaWG has none.',
			],
			[
				'Shared expenses and switching',
				'You split expenses equally or with custom amounts, exact to the cent. ManaWG shows balances and suggests settlements with few transfers. Fixed costs and a monthly statement come on top. If your Splitwise or Splid expenses exist as a CSV file, they can be imported with a preview, see [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). There is no Flatastic import, so you enter old data again by hand if you need it. The expenses are described on [Shared expenses](/shared-expenses).',
			],
			[
				'Shopping, noticeboard and chat',
				'The shopping list spots duplicates and, after ticking, suggests recording the shop straight away as an expense. Supplies show a quantity and a threshold, and “Quick restock” suggests what is almost empty. The noticeboard collects the flat’s information and decisions, and in the chat you reply, react with emojis and mention flatmates with @.',
			],
			[
				'What ManaWG cannot do',
				'The interface is in English and German, amounts are in euros only, and a flat holds at most 20 active members. There is no app in a store: you install ManaWG as a web app on the home screen. You mark settlements as paid yourselves, and the app does not trigger a transfer. The calendar is available as a subscription for Apple and Google Calendar, but in one direction only.',
			],
		],
		fragen: [
			[
				'Is ManaWG really free?',
				'Yes. There is no paid tier and no feature you would have to unlock. Every area is open to every flat, from expenses to chat.',
			],
			[
				'Does ManaWG show ads?',
				'No. No ads appear in ManaWG, and no features are usable only after an upgrade.',
			],
			[
				'Can I bring my data over from Flatastic?',
				'There is no direct Flatastic import. If your Splitwise or Splid expenses exist as a CSV file, you import them with a preview, an import history and an undo. Only euro amounts are imported, and other currencies are rejected.',
			],
			[
				'Is ManaWG in the App Store?',
				'No. ManaWG runs in the browser at app.manawg.com and can be added to the home screen on iPhone and Android. No store download is needed.',
			],
			[
				'How precisely can reminders be set?',
				'Each member switches push notifications off for each area, for example cleaning rota, expenses or chat. Emails such as the monthly statement and payment reminders have an unsubscribe link.',
			],
			[
				'Is Flatastic free?',
				'Per the provider, Flatastic is free to use and offers a paid Premium. The Premium page lists, among other things, no advertising, the history of the cleaning plan, earlier budget breakdowns, images on expenses and the CSV export of financial entries (checked on 29 October 2026). ManaWG has no paid tier.',
			],
			[
				'Does Flatastic have a points system for cleaning?',
				'Per the provider’s website, yes: the chore planner includes a score system that shows how much each person has contributed (checked on 29 October 2026). ManaWG has no points: the cleaning rota distributes tasks by workload and shows in advance who is next. More on [Cleaning rota app](/cleaning-rota).',
			],
		],
	},
	'tricount-alternative': {
		link: 'Tricount alternative',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Tricount alternative for flats and fixed groups | ManaWG',
		beschreibung:
			'Tricount handles several currencies and suits trips. For a flat with rent, fixed costs and a cleaning rota, ManaWG is free, in the browser, with statements.',
		h1: 'Tricount alternative for flats and fixed groups',
		einleitung:
			'Tricount splits expenses in groups and, per the provider, works with several currencies. If you live together long term, you usually also need rent, fixed costs and a cleaning rota. ManaWG joins them in a free web app in English and German. Details on Tricount come from the provider’s linked pages, checked on 29 October 2026.',
		quellen: [
			['Tricount features', 'https://tricount.com/features'],
			[
				'Tricount on the App Store (UK)',
				'https://apps.apple.com/gb/app/tricount-split-group-expenses/id349866256',
			],
			['ManaWG flat-share app', 'https://manawg.com/en/flat-share-app'],
		],
		tabellen: [
			comparisonTable(
				'Tricount',
				['yes', NC, NC, NC, NC, 'multiple currencies per provider', 'free per provider'],
				'Details on Tricount come from the provider’s features page and App Store listing, checked on 29 October 2026. Anything the sources do not support reads “not checked”.',
			),
		],
		abschnitte: [
			[
				'What Tricount does well',
				'Per the provider, Tricount is free and works with several currencies. Expenses can be added without a signal and synced later. The provider also lists payment requests and a connection to a bunq Card. Plans and features change, so check the current state with Tricount itself.',
			],
			[
				'When to stay with Tricount',
				'For trips with a foreign currency Tricount is the better choice, because ManaWG works in euros only. The same goes if you split costs for a group of more than 20 people. And if you are only sharing a single trip, you need neither fixed costs nor a cleaning rota.',
			],
			[
				'When ManaWG fits better',
				'You live together long term and split expenses every month.\nYou enter rent, internet and electricity once as fixed costs, repeating in whole months. ManaWG books them automatically.\nThe monthly statement shows the total, expenses per category and suggested transfers with few payments.\nYou can remind people of open amounts, with a cooling-off period against constant nagging.\nCleaning rota, shopping list and calendar are in the same app, along with noticeboard and chat. The expenses are described in detail on [Shared expenses](/shared-expenses).',
			],
			[
				'Honest limits',
				'Amounts in euros only, and the import rejects rows in other currencies one by one.\nManaWG runs in the browser and can be added to the home screen. There is no native app in a store.\nA flat holds at most 20 active members.\nNo bank connection: you make the transfers yourselves and then mark amounts as paid.\nNo import from Tricount: the import only reads CSV files from Splitwise and Splid, plus screenshots of expense lists.',
			],
			[
				'Switching from Tricount',
				'It is best to settle open amounts in Tricount and start in ManaWG with a clean slate. If you want to carry the balance over, read in a screenshot of the expense list in the import. ManaWG shows a preview you can correct and recognises euro amounts only. Or someone enters, for each person who is still owed money, an expense with them as the payer and splits it by hand across those who owe. How an import works is explained in the guide [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid).',
			],
		],
		fragen: [
			[
				'Can I import data from Tricount into ManaWG?',
				'Not directly. The import handles CSV files from Splitwise and Splid, and screenshots of expense lists that are read with text recognition and corrected before saving. There is no Tricount import.',
			],
			[
				'Can ManaWG handle foreign currencies?',
				'No. ManaWG works in euros only and has no exchange rates. For trips with several currencies Tricount suits you better.',
			],
			[
				'What does ManaWG cost?',
				'Nothing. There are no ads and no paid tier. Every feature is open to every flat.',
			],
			[
				'Is ManaWG in the App Store?',
				'No. ManaWG runs in the browser at app.manawg.com and can be added to the home screen on iPhone and Android.',
			],
			[
				'How many people is ManaWG suited for?',
				'A flat holds up to 20 active members. Members who have moved out do not count, and their history is kept.',
			],
		],
	},
	'ourhome-alternative': {
		link: 'OurHome alternative',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'OurHome alternative for flats, free | ManaWG',
		beschreibung:
			'ManaWG as an alternative to OurHome: a free cleaning rota and shared expenses in the browser. OurHome’s current feature set has not been verified.',
		h1: 'An OurHome alternative for flats',
		einleitung:
			'Whether OurHome is available today, and to what extent, we have not verified (as of 29 October 2026), so check that yourself. Below we only describe how ManaWG handles the cleaning rota and expenses for a WG (shared flat).',
		quellen: [['ManaWG flat-share app', 'https://manawg.com/en/flat-share-app']],
		tabellen: [
			comparisonTable(
				'OurHome',
				[NC, NC, NC, NC, NC, NC, NC],
				'There is no verified source for OurHome, so every cell there reads “not checked”. The ManaWG column comes from the app.',
			),
		],
		abschnitte: [
			[
				'Fairness instead of points',
				'When someone completes a task, ManaWG looks at who has the lowest workload at the moment and assigns it to that person. Assigned and overdue tasks are counted, and overdue ones count for more. Someone who already has a lot to do does not get more. In the app, “Next up” shows who is next. Anyone who is away enters their dates and is skipped at the next assignment. Tasks that are already assigned stay with the person. There is no reward system, and a flat does not need one. The feature in detail is on [Cleaning rota app](/cleaning-rota).',
			],
			[
				'A cleaning rota with a fixed rhythm',
				'Tasks repeat every few days or months and are assigned to a member. Bathroom, kitchen or bins: you decide how often a task comes back. Monthly intervals stay true to the calendar. Completed tasks stay visible as history. Whoever is responsible gets a push reminder in the morning if the task is due today or up to seven days overdue.',
			],
			[
				'Expenses and cleaning rota in one app',
				'You split expenses equally or with custom amounts per person. ManaWG works in cents, and the shares always add up to exactly the amount. Each expense gets one of six categories, such as groceries or household. The app shows balances and suggests transfers so that few are needed. You mark amounts as paid by hand, and ManaWG itself does not transfer money. More on settling up is on [Shared expenses](/shared-expenses).',
			],
			[
				'Fixed costs and the monthly statement',
				'You add rent, internet and electricity as fixed costs. They are booked automatically as expenses every month. The monthly statement shows the total, expenses per category and who pays whom how much. It arrives by email at the start of the month, and each member can switch that off. Fixed costs can be paused. The interval counts in whole months, and there are no weekly fixed costs.',
			],
			[
				'Shopping, supplies and calendar',
				'The shopping list belongs to the whole flat. Whoever shops sees what is already ticked. After ticking, ManaWG asks whether you want to record the shop straight away as an expense. There is also a supplies overview, a calendar with a subscription for Apple or Google Calendar, a noticeboard and chat. A second app for the household is not needed.',
			],
			[
				'Web instead of a store',
				'ManaWG runs at app.manawg.com and can be installed on the home screen. The data is stored centrally on the server, not on a single device. The app remembers actions made offline and sends them later. You can sign in with Google or with email and password. Joining works through an invite link or an email invitation.',
			],
		],
		fragen: [
			[
				'Are there points or rewards in ManaWG?',
				'No. ManaWG distributes tasks by workload: for each person, assigned and overdue tasks are counted, and time away is taken into account. There are no points or rewards.',
			],
			[
				'Does ManaWG cost anything?',
				'No. ManaWG is free, shows no ads and has no paid tier. Every feature is open to every flat, including cleaning rota, expenses and calendar.',
			],
			[
				'Is ManaWG in the App Store?',
				'No. ManaWG is a web app. You open app.manawg.com in the browser and add the app to the home screen on iPhone or Android.',
			],
			[
				'Is ManaWG available in English?',
				'Yes. The app is available in English and German, follows the language of your device and can be switched in the app. You cannot choose currencies other than the euro.',
			],
			[
				'How many people fit in one flat?',
				'A flat holds up to 20 active members. Members who have moved out do not count, and their history is kept. Admins can revoke invitations at any time.',
			],
		],
	},
	faq: {
		link: 'Frequently asked questions',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'ManaWG FAQ: cost, sign-up, data location | ManaWG',
		beschreibung:
			'Is ManaWG free? Is the flat-share app in the App Store? Answers on sign-up, cleaning rota, export, data in Frankfurt and importing from Splitwise or Splid.',
		h1: 'Frequently asked questions about ManaWG',
		einleitung:
			'The essentials about ManaWG, the free [flat-share app](/flat-share-app) for a WG (shared flat): cost, installation, invitations, money, cleaning rota, time away, currency, data location and import.',
		abschnitte: [],
		fragen: [
			[
				'What does ManaWG cost?',
				'Nothing. ManaWG is free, with no ads and no paid tier. A flat holds up to 20 active members.',
			],
			[
				'Do I need an app store?',
				'No. ManaWG is a [web app](/flat-share-app) and runs in the browser at app.manawg.com. On your phone you can add the app to the home screen. You switch push notifications on or off for each area.',
			],
			[
				'How do my flatmates join the flat?',
				'One person creates the flat and shares the invite link. The others sign in with Google or email and join through the link.',
			],
			[
				'How are expenses split?',
				'For each expense you choose who took part and split equally or with custom amounts per person, exact to the cent. [Shared expenses](/shared-expenses) shows each person’s balance and suggests settlements with few transfers. The money moves outside the app, and you then mark the amount as paid.',
			],
			[
				'How does the cleaning rota work?',
				'In the [cleaning rota](/cleaning-rota) every task has a rhythm in days or months. When one is done, ManaWG picks the person with the lowest workload; assigned and overdue tasks are counted. Anyone who is away is skipped. There are no points or rewards.',
			],
			[
				'What happens when someone is away?',
				'Members enter a period of time away, for example for a holiday. Anyone who is away is skipped at the next assignment in the cleaning rota.',
			],
			[
				'Can I take data from Splitwise or Splid with me?',
				'If your data exists as a CSV file, through the [CSV import with a preview](/switch-from-splitwise-or-splid). In the import you can also read in a photo or screenshot of an expense list with text recognition and correct it before saving; a photo on a single receipt is only attached, not analysed.',
			],
			[
				'What is there besides money and cleaning?',
				'A [shared shopping list](/shopping-list) with supplies, fixed costs, a calendar you can also subscribe to, a noticeboard and a chat.',
			],
			[
				'How do I sign in?',
				'With Google or with email and password. You join through an invite link or an email invitation from a flatmate.',
			],
			[
				'Does ManaWG work with other currencies?',
				'No. ManaWG works in euros only, with no exchange rates. If you split costs in several currencies on trips, an app with currency conversion suits you better. What matters when choosing an app is covered on [Best flat-share app](/best-flat-share-app).',
			],
			[
				'Does ManaWG transfer money automatically?',
				'No. ManaWG calculates suggestions, you transfer the money yourselves outside the app and mark amounts as paid. There is no bank connection.',
			],
			[
				'Where is my data stored?',
				'The database is hosted with Supabase in Frankfurt am Main (EU). Resend (USA) is used to send email. Which data goes to whom is set out in the privacy policy.',
			],
			[
				'Does ManaWG work without internet?',
				'In part. If the network drops, ManaWG saves new entries on your device and sends them once you are back online: shopping entries, time away, new and completed cleaning tasks, expenses and fixed costs. After about seven days, actions that were left behind are no longer sent automatically but shown to you for review.',
			],
			[
				'Can I export our flat’s data?',
				'Yes. Any member downloads the flat’s data from Settings under Data, everything as JSON or single areas as CSV, such as expenses, fixed costs, shopping or cleaning rota. The monthly statement can be printed or saved as a PDF.',
			],
			[
				'How do I remind flatmates to pay?',
				'On the Reminders page there is a Remind button. For the same two people, a reminder goes out at most every 48 hours.',
			],
			[
				'How do I install ManaWG on an iPhone?',
				'Open app.manawg.com in Safari, tap ≡, then Share, then Show More, choose “Add to Home Screen” and tap Add. Then open ManaWG from the home screen and sign in once.',
			],
			[
				'Who is behind ManaWG?',
				'The operator is Abubakar Abditube, and there is more on [About ManaWG](/about-manawg). ManaWG is run privately and non-commercially. Contact: info@manawg.com.',
			],
			[
				'Does ManaWG have anything to do with WireGuard?',
				'No. WireGuard is a VPN protocol. ManaWG stands for Wohngemeinschaft (WG, a shared flat) and is a household app.',
			],
		],
	},
	'about-manawg': {
		link: 'About ManaWG',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'What is ManaWG? The free flat-share app | ManaWG',
		beschreibung:
			'ManaWG is a free flat-share app in English and German for expenses, shopping, cleaning rota, calendar, noticeboard and chat. Facts, operator, not WireGuard.',
		h1: 'What is ManaWG?',
		einleitung:
			'ManaWG is a free web app for a WG (Wohngemeinschaft, a shared flat), in English and German. It brings together expense splitting, shopping list, cleaning rota, calendar, noticeboard and chat. ManaWG has nothing to do with the VPN protocol WireGuard.',
		quellen: [
			['Legal notice', '/en/legal-notice'],
			['Privacy policy', '/en/privacy'],
			['Terms', '/en/terms'],
		],
		abschnitte: [
			[
				'In short',
				'ManaWG (also written Mana WG) is a household app for shared flats. Flatmates split expenses and settle balances with few transfers, keep a shared shopping list, organise a fairly distributed cleaning rota and record agreements on a noticeboard. The app is free, ad-free and runs in the browser at app.manawg.com.',
			],
			[
				'Facts at a glance',
				'Price: free, no ads, no paid tier. Languages: English and German, currency: euro. Platform: web app (PWA), installable on iPhone, Android and desktop, no app store. Sign-in: Google or email. Size: up to 20 active members per flat. Data: stored in the EU (Frankfurt am Main). Joining: by invite link or email invitation.',
			],
			[
				'Features',
				'Splitting expenses equally or with custom amounts, fixed costs and a monthly statement, import of suitable existing CSV files, shopping list with supplies, cleaning rota with fair rotation and time away, calendar with calendar subscription, noticeboard, chat and push reminders. There is no bank connection and no transfers from the app.',
			],
			[
				'Operator and contact',
				'The operator is Abubakar Abditube. ManaWG is run privately and non-commercially. Contact: info@manawg.com.',
			],
			[
				'ManaWG and WireGuard',
				'The name is sometimes confused with WireGuard, a VPN protocol. The two have nothing to do with each other. ManaWG stands for Wohngemeinschaft (WG, a shared flat), not for WireGuard.',
			],
			[
				'Who the app is for',
				'For student flats, professional flat shares and anyone who shares a home and a household kitty. It is not meant for large groups of more than 20 members, trips with several currencies or company bookkeeping.',
			],
		],
		fragen: [
			[
				'What is ManaWG?',
				'A free flat-share app in English and German for expenses, shopping, cleaning rota, calendar, noticeboard and chat. It runs in the browser at app.manawg.com.',
			],
			[
				'Does ManaWG have anything to do with WireGuard?',
				'No. ManaWG is a household app for shared flats. WireGuard is a VPN protocol.',
			],
			['Where is ManaWG’s data stored?', 'In the EU, on servers in Frankfurt am Main.'],
		],
	},
};
