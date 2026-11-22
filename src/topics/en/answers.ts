// English counterparts of ../de/answers.ts: short answer pages, the direct answer first.
import type { Topic } from '../types.ts';

const CHECKED = 'as of 22 November 2026';

export const ANSWERS_EN: Record<string, Topic> = {
	'app-to-split-flat-costs': {
		link: 'App to split flat costs',
		updated: '2026-11-22',
		published: '2026-11-22',
		title: 'App to split flat costs: free, no daily limit | ManaWG',
		description:
			'Which app splits flat-share costs for free? ManaWG: log expenses, balances to the cent, few transfers to settle. Compared with Splitwise, Tricount, Flatastic.',
		h1: 'Which app should a flat share use to split costs?',
		intro:
			'A free app for splitting flat costs is ManaWG: you create a flat in the browser, invite your flatmates with a link and log each expense with who paid and who shares it. The app keeps balances to the cent and suggests transfers that leave everyone square; it costs nothing, shows no ads and puts no cap on how many expenses you add. Every feature of the money side is on [Shared expenses](/shared-expenses), and the rules for rent and unequal shares are in the guide [Split flat costs](/split-flat-costs).',
		sources: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			[
				'Splitwise help: What is Splitwise Pro?',
				'https://kb.splitwise.com/pro/what-is-splitwise-pro',
			],
			['Tricount features', 'https://tricount.com/features'],
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
		],
		tables: [
			{
				after: 'How it works in five steps',
				title: 'Apps for splitting costs in a flat share',
				header: ['Feature', 'Flatastic', 'ManaWG', 'Splitwise', 'Tricount'],
				rows: [
					['Price', 'free, Premium is paid', 'free, no paid tier', 'free, Pro is paid', 'free'],
					['Ads', 'ad-free with Premium', 'none', 'ad-free with Pro', 'none, says the provider'],
					[
						'Expenses per day',
						'not checked',
						'no limit',
						'4 in the free version',
						'no limit, says the provider',
					],
					[
						'Currencies',
						'not checked',
						'euros in the app, no conversion',
						'conversion with Pro',
						'several currencies',
					],
					[
						'Cleaning rota in the same app',
						'yes, with a points system',
						'yes, assigned by workload',
						'not named on the Pro page',
						'not named on the features page',
					],
					[
						'Platform',
						'App Store, Google Play, web app',
						'web app (PWA), no app store',
						'not checked',
						'not checked',
					],
				],
				note: `Details about other providers come from their linked pages, ${CHECKED}. Anything the sources do not back up reads “not checked”. Columns are in alphabetical order.`,
			},
		],
		sections: [
			[
				'How it works in five steps',
				'1. Create a flat at app.manawg.com with Google or with your name, email and a code; you do not need a password\n2. Invite flatmates by invite link or email; up to 20 active people fit in one flat\n3. Log each expense with amount, payer and who shares it, split equally or with your own amount per person\n4. Add rent, electricity and internet once as recurring costs; the app books them at the monthly interval you choose\n5. Follow the settle-up suggestions, pay by bank or in cash and mark the shares as paid',
			],
			[
				'What the app works out and what it does not',
				'ManaWG stores amounts in whole cents. With an equal split, shares differ by one cent at most and always add up to the exact total. From all expenses the app builds a balance for each person and suggests payments that settle the flat with few transfers. You make the transfers yourself; there is no bank connection. The app has no percentage shares and no split by days. If you split rent by room size, work out the amounts with the [rent split calculator](/rent-split-calculator) and enter them as custom amounts. On the first of each month a statement arrives by email, and each member can switch it off.',
			],
			[
				'Which app suits which flat',
				'You mostly split on trips or in several currencies: Tricount names several currencies, Splitwise currency conversion in its Pro plan. ManaWG only knows euros in the app.\nYou log a lot of expenses: according to the Splitwise help pages, the free version allows four expenses a day, details on [Splitwise free limit](/splitwise-free-limit). ManaWG has no daily limit, and Tricount says it has none either.\nYou want money and housework in one place: Flatastic and ManaWG both combine expenses and a cleaning rota. Flatastic works with points and a paid Premium; ManaWG assigns by workload and has no paid tier. More on [Flatastic alternative](/flatastic-alternative), and every app side by side on [Best flat-share app](/best-flat-share-app).',
			],
			[
				'Moving over from another app',
				'If your expenses already live in Splitwise, Splid, Tricount or Settle Up, export them there as a CSV file and import them into ManaWG. Before saving you see a preview, match names and can untick single rows; an import can be undone. Only euro amounts come across. The steps are on [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). To look at the app first, open the [demo without an account](/demo).',
			],
		],
		faq: [
			[
				'Which app is good for splitting flat costs?',
				'ManaWG is a free flat-share app without ads that splits expenses equally or by custom amounts, books recurring costs such as rent every month and suggests settle-up payments. For trips in several currencies, apps like Tricount or Splitwise fit better, because ManaWG only knows euros in the app.',
			],
			[
				'Is ManaWG really free?',
				'Yes. There is no paid tier, no advertising and no daily or monthly limit on expenses. The main limit is 20 active members per flat.',
			],
			[
				'Can the app split the rent automatically every month?',
				'Yes. You add the rent once as a recurring cost with an interval in whole months, and the app books it as an expense by itself. Weekly intervals do not exist, and a template can be paused.',
			],
			[
				'Does the app transfer the money?',
				'No. ManaWG shows who owes whom how much and suggests a few transfers. You pay by bank or in cash, then mark the share as paid in the app.',
			],
			[
				'Do I need to get the app from an app store?',
				'No. ManaWG runs in the browser at app.manawg.com and can be added to the home screen of an iPhone, Android phone or desktop as a PWA. There is no version in the App Store or on Google Play.',
			],
			[
				'Can I bring old expenses over from Splitwise or Tricount?',
				'Yes, if you have them as a CSV file. ManaWG reads exports from Splitwise, Splid, Tricount and Settle Up with a preview and an undo. Rows in currencies other than euros are rejected one by one.',
			],
		],
	},
	'free-cleaning-rota-app': {
		link: 'Free cleaning rota app',
		updated: '2026-11-22',
		published: '2026-11-22',
		title: 'Free cleaning rota app for flat shares | ManaWG',
		description:
			'Which cleaning rota app for a flat share is free? ManaWG assigns chores by workload, skips people who are away and sends push reminders. With an app comparison.',
		h1: 'Which cleaning rota app for a flat share is free?',
		intro:
			'A free cleaning rota app for flat shares is ManaWG: you add chores such as bathroom, kitchen and bins with how often they repeat, and each time one is done the app hands it to the person with the lightest load. Anyone going away enters the absence and is skipped at the next assignment; the app runs in the browser, costs nothing and shows no ads. How rotation, absences and reminders work in detail is on [Cleaning rota app](/cleaning-rota), and a paper version is the [cleaning rota template](/cleaning-rota-template).',
		sources: [
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['Tricount features', 'https://tricount.com/features'],
		],
		tables: [
			{
				after: 'How to set up the rota',
				title: 'Cleaning rotas in flat-share apps',
				header: ['Feature', 'Flatastic', 'ManaWG', 'Splitwise', 'Tricount'],
				rows: [
					[
						'Cleaning rota',
						'yes',
						'yes',
						'not named on the Pro page',
						'not named on the features page',
					],
					['Assignment', 'with a points system', 'by workload, no points', '–', '–'],
					['Absence', 'not checked', 'skipped at the next assignment', '–', '–'],
					['History of who did what', 'with Premium', 'for everyone', '–', '–'],
					['Price', 'free, Premium is paid', 'free, no paid tier', 'free, Pro is paid', 'free'],
					['Ads', 'ad-free with Premium', 'none', 'ad-free with Pro', 'none, says the provider'],
				],
				note: `Details about other providers come from their linked pages, ${CHECKED}. Splitwise and Tricount are apps for shared expenses; their pages do not name a cleaning rota. Columns are in alphabetical order.`,
			},
		],
		sections: [
			[
				'How to set up the rota',
				'1. Create a flat at app.manawg.com and invite your flatmates with an invite link\n2. Add each chore with how often it repeats, for example bathroom every 7 days or windows every 3 months\n3. Tick off chores when they are done; the app passes them to the person with the lightest load\n4. Enter holidays or placements as an absence\n5. Allow push notifications so the person responsible gets a reminder',
			],
			[
				'How ManaWG assigns chores',
				'A fixed order falls apart as soon as someone misses a week. So ManaWG counts the assigned and overdue chores for each person, with overdue ones weighing more, and picks the person with the lightest load when a chore is done. Under “Next up” you see in advance who is next. There are no points, leaderboards or rewards. Every completed chore goes into the history, so you can look up later who did what and when.',
			],
			[
				'Time away, reminders and limits',
				'Anyone who is away is passed over at the next assignment. Chores already assigned to that person stay with them and are marked as away; someone else can take them over. Reminders arrive as push notifications, and each member can switch off the cleaning rota area on their own. A flat holds up to 20 active members, and dates follow Berlin time. How to handle time away in the flat as a whole is on [Holidays and time away](/holidays-and-time-away).',
			],
			[
				'When a template is enough',
				'For two people or a fixed weekly routine, a printed rota is often enough. It does not move on by itself and knows nothing about absences, so you update every change by hand. How to choose chores and how often they repeat is on [Make a cleaning rota](/make-a-cleaning-rota). If you clean with Flatastic today, the differences are on [Flatastic alternative](/flatastic-alternative). The same app also splits costs, see [App to split flat costs](/app-to-split-flat-costs).',
			],
		],
		faq: [
			[
				'Which cleaning rota app for a flat share is free?',
				'ManaWG is a free flat-share app with a cleaning rota, without ads and without a paid tier. Chores repeat in days or months and are assigned by workload. Flatastic also has a cleaning rota and offers a paid Premium on top.',
			],
			[
				'Does ManaWG give points for finished chores?',
				'No. ManaWG assigns by workload: whoever currently has fewer assigned and overdue chores is next. There are no points or rewards.',
			],
			[
				'What happens when someone is on holiday?',
				'They enter the dates as an absence and are skipped at the next assignment. Chores already assigned stay with them, and others can take them over.',
			],
			[
				'Does every flatmate have to install an app?',
				'No. ManaWG runs in the browser at app.manawg.com. Anyone who wants can add it to the home screen as a PWA; there is no listing in the App Store or on Google Play.',
			],
			[
				'Does the app remind people about chores that are due?',
				'Yes, by push notification once you allow it. Each member can switch off cleaning rota reminders on their own.',
			],
		],
	},
};
