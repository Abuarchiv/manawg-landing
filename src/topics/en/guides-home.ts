// English guides, batch B: household, rules and living together.
// General tips, not legal advice. ManaWG features only where the app really has them (see topics.ts).
import { cleaningRota, tableToCsv } from '../cleaning-rota.ts';
import type { Topic } from '../types.ts';

const TASKS_FOUR = ['Bathroom', 'Kitchen', 'Floors', 'Bins and hallway'];
const TASKS_THREE = ['Bathroom', 'Kitchen', 'Floors and bins'];
const TASKS_FIVE = [...TASKS_FOUR, 'Living room and balcony'];

/** Single source of the templates: HTML tables and CSV both read from here. A to E stand for example flatmates. */
const TEMPLATE_FOUR = cleaningRota(['A', 'B', 'C', 'D'], TASKS_FOUR, undefined, 'Week');
const TEMPLATE_TWO = cleaningRota(
	['A', 'B'],
	['Bathroom', 'Floors', 'Kitchen', 'Bins and hallway'],
	undefined,
	'Week',
);
const TEMPLATE_THREE = cleaningRota(['A', 'B', 'C'], TASKS_THREE, undefined, 'Week');
const TEMPLATE_FIVE = cleaningRota(['A', 'B', 'C', 'D', 'E'], TASKS_FIVE, undefined, 'Week');

/** The same template data as a CSV. Comma separated, static, no user input. */
export function cleaningRotaTemplateCsv(): string {
	return tableToCsv(TEMPLATE_FOUR.header, TEMPLATE_FOUR.rows, ',');
}

export const GUIDES_EN_HOME: Record<string, Topic> = {
	'make-a-cleaning-rota': {
		link: 'Make a cleaning rota',
		widget: {
			after: 'Cleaning rota generator: a plan in one minute',
			kind: 'rota-generator',
		},
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Make a cleaning rota or chore chart for flatmates | ManaWG',
		description:
			'Make a cleaning rota or chore chart in five steps: tasks by room and rhythm, a weekly plan as a table, a points system and a free generator for flatmates.',
		h1: 'Make a cleaning rota, step by step, for a home or flat share',
		intro:
			'A cleaning rota rarely fails because people are lazy. It fails because the tasks are vague and nobody keeps the plan up to date. In five steps you get to a rota for a household or flat share: collect tasks by room, estimate the effort, spread them over the week, share them fairly and make the plan visible. All figures and days are examples that you adapt to your own flat.',
		sections: [
			[
				'Five steps to a cleaning rota',
				'1. Collect tasks by room\n2. Estimate the effort\n3. Spread them over the week\n4. Share them out: fixed or rotating\n5. Make the plan visible and keep it up to date',
			],
			[
				'Cleaning rota generator: a plan in one minute',
				'If you would rather not start from scratch, enter two to six names and choose the tasks and the number of weeks. The generator hands the tasks out in turn, and every week each person moves on by one task. You can print the plan, save it as a PDF or download it as a CSV. Nothing is stored and you do not need an account. Add your own tasks and rhythms with the steps below.',
			],
			[
				'Step 1: collect tasks by room',
				'Write down what comes up regularly and assign it to a room. The more concrete the task, the less there is to discuss: “clean the bathroom” beats “hygiene”. Decide what it includes, for example sink, shower, toilet and floor. Give each task a rhythm: daily, weekly, every two weeks or monthly. The table shows an example for a typical shared flat, so strike out whatever does not apply to you.',
			],
			[
				'Fridge and dishwasher',
				'These two corners of the kitchen tend to get missed because they belong to nobody. Give them their own lines in the plan. Go through the fridge every two weeks: bin anything out of date and wipe the shelves. Empty the dishwasher daily and clean its filter now and then. If someone notices that something has run out, they add it to the list. In ManaWG the supplies show what is running low and suggest what to buy. More on that on the [shared shopping list](/shopping-list) page.',
			],
			[
				'Step 2: estimate the effort',
				'Fair does not mean everyone has the same number of tasks. It means everyone cleans for roughly the same amount of time. Estimate the times for your flat once, together, and there will be fewer arguments about uneven loads later. Whoever takes the bins can also get the hallway or the fridge. The table gives rough guide values as a starting point.',
			],
			[
				'Step 3: spread them over the week',
				'Spread the tasks across the days so that not everything lands on the weekend. Keep one day a week free: it is a buffer for anything that slipped, and nobody has to clean on that day. The table shows an example weekly plan that you adjust to your own schedule.',
			],
			[
				'Daily, weekly, monthly: what is due when',
				'A cleaning rota works on three levels: daily, weekly and less often. Everyone deals with daily jobs as they go, so only shared appliances such as the dishwasher belong in the plan. Weekly jobs make up the weekly plan proper and rotate between people. Anything less frequent is shared out separately, otherwise the week gets too full. The table sorts typical tasks. Adapt the rhythms to your flat.',
			],
			[
				'Step 4: share them out, fixed or rotating',
				'There are three ways to hand tasks out. The table compares them. A ready-made four-week rotation for four people is in the [cleaning rota template](/cleaning-rota-template).',
			],
			[
				'Points system: counting effort fairly',
				'With a points system it is not the number of tasks that counts but the effort. Decide how much time one point is, say five minutes, and give each task points using the guide values from step 2. At the end of the month everyone should have roughly the same number of points. This is more exact than a plain rotation, but someone has to keep count. Example for three people: Anna takes the bathroom for 8 points, Ben the floors for 7, and Cem the kitchen and bins for 7 together. Next week you swap, so nobody is stuck with the bathroom for good.',
			],
			[
				'Step 5: make the plan visible and keep it up to date',
				'Everyone needs to be able to see the plan, ideally where they already look every day: a sheet on the kitchen door or fridge, a table in a shared file or an app. Keep it current. If someone moves out or tasks stop fitting, talk it over at your flat meeting and change the plan. Nobody wants to be the one who polices it, so reminders help more than checking up.',
			],
			[
				'Things that come up in a flat share',
				'Time away: someone who is away is skipped and does not catch up on everything afterwards, more at [holidays and time away](/holidays-and-time-away)\nGuests: whoever invites visitors makes sure the shared rooms stay clean\nFriction: if someone does not stick to the plan, say calmly what exactly was not done and do not judge the person, more at [solving flatmate conflict](/flatmate-conflict)',
			],
			[
				'Ready-made instead of building your own',
				'The [cleaning rota template to print](/cleaning-rota-template) comes as a table and as a CSV download. It has ready rotations for two, three, four and five people and a generator for your names.\nThe [cleaning rota in ManaWG](/cleaning-rota) repeats tasks every few days or months and works out who is next based on workload: assigned and overdue tasks count, overdue ones more. Anyone who is away is skipped, and ManaWG sends a push reminder for assigned tasks that are due.',
			],
		],
		tables: [
			{
				after: 'Step 1: collect tasks by room',
				title: 'Example: tasks by room and rhythm',
				header: ['Room', 'Task', 'Rhythm'],
				rows: [
					['Kitchen', 'Hob, worktops, sink, floor', 'weekly'],
					['Kitchen', 'Empty the dishwasher', 'daily'],
					['Kitchen', 'Go through the fridge', 'every two weeks'],
					['Kitchen', 'Clean the oven', 'monthly'],
					['Bathroom', 'Sink, shower, toilet, mirror, floor', 'weekly'],
					['Hallway', 'Hoover or mop the floor', 'every two weeks'],
					['Living room', 'Hoover the floor, wipe surfaces', 'weekly'],
					['Living room', 'Clean the windows', 'monthly'],
					['Bins', 'Take out general waste, paper and deposit bottles', 'weekly'],
				],
			},
			{
				after: 'Step 2: estimate the effort',
				title: 'Time needed per task',
				header: ['Task', 'Guide value'],
				rows: [
					['Bathroom, thorough', '30 to 45 minutes'],
					['Kitchen', '20 to 30 minutes'],
					['Hoover and mop the floors', '30 to 40 minutes'],
					['Bins and deposit bottles', '10 minutes'],
				],
				note: 'Rough guide values, not measurements.',
			},
			{
				after: 'Step 3: spread them over the week',
				title: 'Example: weekly cleaning plan',
				header: ['Day', 'Task', 'What it includes'],
				rows: [
					['Monday', 'Bins', 'Take out rubbish, paper and deposit bottles'],
					['Tuesday', 'Kitchen', 'Hob, worktops, sink, floor'],
					['Wednesday', 'Bathroom', 'Sink, shower, toilet, mirror, floor'],
					['Thursday', 'Floors', 'Hoover the hallway and living room'],
					['Friday', 'Fridge', 'Go through it, bin anything out of date'],
					['Saturday', 'Floors and laundry', 'Mop the floors, wash towels and cloths'],
					['Sunday', 'free', 'Buffer for anything that slipped'],
				],
			},
			{
				after: 'Step 4: share them out, fixed or rotating',
				title: 'Three ways to share tasks out',
				header: ['Approach', 'Upside', 'Downside'],
				rows: [
					[
						'Fixed areas',
						'simple, everyone knows what is theirs',
						'unfair when one task is unpopular',
					],
					['Rotation', 'fairer, everyone does every task in turn', 'needs someone to keep track'],
					[
						'Points system',
						'tasks count by effort',
						'more arithmetic, the points have to be kept up to date',
					],
				],
			},
			{
				after: 'Daily, weekly, monthly: what is due when',
				title: 'Example: tasks by rhythm',
				header: ['Rhythm', 'Examples', 'How to share them'],
				rows: [
					[
						'daily',
						'Empty the dishwasher, wipe the worktop, wash your own dishes',
						'each person for themselves, only shared appliances go in the plan',
					],
					[
						'weekly',
						'Bathroom, kitchen, floors, bins and deposit bottles',
						'in the weekly plan, rotate every week',
					],
					[
						'every two weeks',
						'Hallway, go through the fridge',
						'alternate between even and odd weeks',
					],
					[
						'monthly',
						'Oven, windows, check shared supplies',
						'in turn, each person takes one month',
					],
				],
			},
			{
				after: 'Points system: counting effort fairly',
				title: 'Example: points by effort (1 point = 5 minutes)',
				header: ['Task', 'Guide value', 'Points'],
				rows: [
					['Bathroom, thorough', 'about 40 minutes', '8'],
					['Hoover and mop the floors', 'about 35 minutes', '7'],
					['Kitchen', 'about 25 minutes', '5'],
					['Bins and deposit bottles', '10 minutes', '2'],
				],
				note: 'Rough guide values, not measurements. The points are an example.',
			},
		],
		faq: [
			[
				'What belongs in a cleaning rota?',
				'A list of tasks by room, a rhythm for each task, someone responsible and a rule for time away. The more concretely a task is described, the less there is to discuss.',
			],
			[
				'How do I make a weekly cleaning rota?',
				'List the tasks, sort them by how often they come up and spread them over the days of the week, leaving one day free. Then decide who takes which task and how often you swap, usually every week.',
			],
			[
				'How do I share tasks fairly?',
				'By time needed, not by number of tasks. Estimate the times together and let the tasks rotate so nobody is stuck with the unpopular bathroom. Whoever has a short task such as the bins gets a second one.',
			],
			[
				'How does a cleaning rota with points work?',
				'Each task gets points according to the time it takes, for example one point per five minutes. Whoever takes a demanding task such as the bathroom needs fewer other tasks. At the end of the month everyone should have roughly the same points, and you keep count yourselves. The generator on this page simply rotates in turn.',
			],
			[
				'How often should which rooms be cleaned?',
				'Bathroom, kitchen, living room and bins weekly, hallway and fridge every two weeks, oven and windows monthly. The dishwasher is emptied daily. These are examples, so adapt the rhythm to your flat.',
			],
			[
				'Can I make a cleaning rota online?',
				'Yes, with the generator on this page. Enter the names, choose the tasks and weeks, then print it or save it as a CSV. No account and nothing stored.',
			],
			[
				'Is there a cleaning rota app?',
				'Yes, ManaWG includes a cleaning rota with rhythms, sharing by workload, time away and reminders. The app is free and runs in the browser.',
			],
		],
	},
	'cleaning-rota-template': {
		link: 'Cleaning rota template',
		widget: {
			after: 'Cleaning rota generator: enter names, print the plan',
			kind: 'rota-generator',
			csv: '/en/cleaning-rota-template.csv',
		},
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Chore chart template for flatmates: 2–5 people | ManaWG',
		description:
			'Free printable chore chart and cleaning rota template: rotations for 2 to 5 flatmates, a generator with your names, print as PDF or open the CSV in Excel.',
		h1: 'Flat-share chore chart and cleaning rota template to print and adapt',
		intro:
			'Here is a ready-made rotation for two, three, four and five people, free and without an account. In the generator you enter your names and print the plan as a PDF or download it as a CSV.',
		sections: [
			[
				'Template for four people',
				'With four people, the bathroom, kitchen, floors and bins plus hallway rotate. Every week each person moves on by one task, and after four weeks everyone has done everything once. A to D stand for your four names.',
			],
			[
				'Cleaning rota generator: enter names, print the plan',
				'Enter two to six names, choose the tasks and the number of weeks, and the plan appears. You can print it, save it as a PDF too, or download it as a CSV. Nothing is stored and you do not need an account. The generator rotates in turn. The ManaWG app instead assigns each task by workload, where overdue tasks count for more, and skips anyone who is away.',
			],
			[
				'Template for three and five people',
				'With three people, three tasks rotate. Every week each person moves on by one task, and after three weeks everyone has done each task once. With five people, living room and balcony is added as its own task, so the rotation takes five weeks.',
			],
			[
				'Template for two people',
				'As a pair, each person takes two of the four tasks and you swap every week. After two weeks everyone has done everything once. The tasks are paired so that both have roughly the same amount to do: bathroom and kitchen together, floors and bins plus hallway together. If a small difference remains, the weekly swap evens it out.',
			],
			[
				'Tasks with a rhythm',
				'The weekly tasks are in the rotation. Anything that comes up less often is shared out separately. Strike out whatever does not apply to you. How to build your own tasks and rhythms is covered in the guide to [making a cleaning rota](/make-a-cleaning-rota).',
			],
			[
				'Open the template in Excel or Google Sheets',
				'1. Create the plan in the generator and download it as a CSV. The file separates columns with commas and opens directly in Excel set to a UK or US region and in Google Sheets, with accented letters kept\n2. Excel: double-click the file and it opens as a table. Excel set to a German region splits columns on semicolons, so in that case use Data > From Text/CSV and choose comma as the delimiter\n3. Google Sheets: choose File, Import, Upload, and pick comma as the separator if it is not detected\n4. Numbers: open the file directly\n5. Add columns the printout does not have, such as “Done” and “Swap with”, then share or print',
			],
			[
				'How to use the rotation',
				'Display: put the plan where everyone sees it daily, such as the kitchen door or the fridge\nMoving on: choose a fixed weekday on which the new week starts, then move everyone on by one task\nSwap rule: whoever cannot do their task in a given week swaps task for task with another person and says so in the flat beforehand\nMonthly tasks: share them out in turn, each person takes one month',
			],
			[
				'When a sheet of paper is not enough',
				'A printed plan does not rotate by itself and does not remind anyone. Someone who is away has to be swapped by hand. The [cleaning rota app](/cleaning-rota) from ManaWG sets up tasks with a rhythm, shows who is next, skips anyone who is away and sends a push reminder for tasks that are due. For that you create a flat, send the invite link and add the tasks, free and in the browser.',
			],
		],
		tables: [
			{
				after: 'Template for four people',
				title: 'Template: four-week rotation for four people',
				...TEMPLATE_FOUR,
				note: 'A, B, C and D stand for four example flatmates.',
			},
			{
				after: 'Template for three and five people',
				title: 'Template: three-week rotation for three people',
				...TEMPLATE_THREE,
				note: 'A, B and C stand for three example flatmates.',
			},
			{
				after: 'Template for three and five people',
				title: 'Template: five-week rotation for five people',
				...TEMPLATE_FIVE,
				note: 'A to E stand for five example flatmates.',
			},
			{
				after: 'Template for two people',
				title: 'Template: two-week rotation for two people',
				...TEMPLATE_TWO,
				note: 'A and B stand for two example flatmates.',
			},
			{
				after: 'Tasks with a rhythm',
				title: 'Tasks with a rhythm',
				header: ['Task', 'Rhythm', 'What it includes'],
				rows: [
					['Bathroom', 'weekly', 'Sink, shower, toilet, floor'],
					['Kitchen', 'weekly', 'Hob, worktops, sink, floor'],
					['Floors', 'weekly', 'Hoover or mop the living room and shared areas'],
					[
						'Bins and hallway',
						'weekly',
						'Take out rubbish and deposit bottles, hoover or mop the hallway',
					],
					['Living room and balcony', 'weekly', 'Tidy, wipe surfaces, sweep the balcony'],
					['Fridge', 'every two weeks', 'Tidy, bin anything out of date'],
					['Mirrors and surfaces', 'every two weeks', 'Mirrors, wipe surfaces'],
					['Oven', 'monthly', 'Clean the inside'],
					['Windows or balcony', 'monthly', 'Clean the windows, sweep the balcony'],
					['Supplies', 'monthly', 'Check shared supplies'],
				],
			},
		],
		faq: [
			[
				'Is there a free cleaning rota template for a flat share?',
				'Yes. This page has ready rotations for two, three, four and five people and a generator where you enter your names. The plan is free: you do not need an account, and nothing is stored. If you do not want to print anything, use the cleaning rota in ManaWG.',
			],
			[
				'How often should the tasks change?',
				'A weekly swap is usual. That way everyone does every task regularly and nobody is stuck with the unpopular bathroom.',
			],
			[
				'How do I adapt the template for three or five people?',
				'There are ready tables for three and five people on this page. With three, the bathroom, kitchen, and floors and bins rotate, and with five, living room and balcony is added. In the generator you choose names and tasks yourself, and the number of weeks is 4 or 8.',
			],
			[
				'PDF or CSV, which should I use?',
				'To put it up on the wall, print it: in the browser’s print dialog you can also save the plan as a PDF. The CSV file is for anyone who wants to keep editing the plan in a spreadsheet or maintain it in a shared file.',
			],
			[
				'What does a cleaning rota for two people look like?',
				'Four tasks, two for each person, swapped every week. The two-week rotation is shown as a table on this page. In the generator you enter both names and choose the tasks yourselves.',
			],
			[
				'Is the cleaning rota template available as an Excel file?',
				'There is a CSV file that opens in Excel, Numbers and Google Sheets. It contains the rotation with your names from the generator. There is no xlsx file with formulas, and you add extra columns such as “Done” yourself.',
			],
		],
	},
	'house-rules': {
		link: 'House rules',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'House rules template: 10 rules for a flat share | ManaWG',
		description:
			'House rules template with ten rules on quiet hours, guests, cleaning, the fridge and money. With room to flex, agreed consequences and a fill-in sheet to print.',
		h1: 'House rules for a flat share: a template with ten rules that work',
		intro:
			'Many flat shares have either no rules at all or a long list that nobody keeps to. Good house rules are short, concrete and agreed by everyone, and ten on one page are usually enough. Below is a template with ten rules to take over, then a fill-in-the-blanks sheet, the individual areas and examples of the consequences you can agree if rules are broken.',
		tables: [
			{
				after: 'Template: ten house rules to take over',
				title: 'Rules with room to flex',
				header: ['Area', 'Default in the template', 'Room to flex'],
				rows: [
					[
						'Quiet hours',
						'from 10 pm on weekdays, from midnight at weekends',
						'announce parties a day ahead, agree an end time',
					],
					[
						'Guests',
						'overnight guests welcome, agree in advance from the fourth night',
						'a quiet period by agreement during exam time',
					],
					[
						'Dishes',
						'wash up or load the dishwasher on the same day',
						'the next morning after an evening with guests',
					],
					[
						'Fridge',
						'one shelf per person',
						'shared food on its own shelf, other people’s food only after asking',
					],
					['Purchases', 'agree anything over €30 beforehand', 'adjust the amount to your budget'],
					[
						'Cleaning rota',
						'swap every week, skip anyone who is away',
						'swapping allowed if agreed beforehand',
					],
					[
						'Shared costs',
						'everyone pays for cleaning supplies, toilet paper and washing-up liquid',
						'private food stays private',
					],
					[
						'Settling up',
						'enter expenses at once, settle up on the first of the month',
						'small amounts every two months is fine',
					],
					['Flat meeting', 'once a month', 'less often after the trial period'],
				],
				note: 'The values are examples, not a requirement. Your tenancy agreement and the building’s house rules (Hausordnung) take precedence.',
			},
			{
				after: 'When someone breaks the rules repeatedly',
				title: 'Consequences you can agree in advance',
				header: ['Breach', 'Agreed consequence', 'The thinking behind it'],
				rows: [
					[
						'Cleaning task not done',
						'catch up within two days',
						'the problem is fixed and nobody cleans twice',
					],
					[
						'Party not announced',
						'announce the next one at the flat meeting with an end time',
						'the agreement is made after the fact',
					],
					[
						'Ate someone else’s food from the fridge',
						'buy a replacement and ask first from now on',
						'the loss is made good',
					],
					[
						'Shared item not paid for',
						'settle the amount by the first of next month',
						'fits the rule for settling up',
					],
				],
				note: 'The consequences are examples. Agree them before the first breach and write them next to the rules. Fines usually make an argument worse.',
			},
		],
		sections: [
			[
				'Template: ten house rules to take over',
				'1. Quiet from 10 pm on weekdays and from midnight at weekends.\n2. Parties are announced at least a day ahead.\n3. Overnight guests are welcome, and anyone staying longer than three nights is agreed in advance.\n4. Dishes are washed up or loaded into the dishwasher on the same day.\n5. The cleaning rota rotates weekly, and anyone who is away is skipped and does not catch up.\n6. Everyone has their own shelf in the fridge, and other people’s food is only eaten after asking.\n7. Cleaning supplies, toilet paper and washing-up liquid are paid for together, private food by each person.\n8. Purchases for the flat over €30 are agreed beforehand.\n9. Expenses are entered at once and settled up on the first of the month.\n10. Once a month there is a short flat meeting where the rules can be adjusted.',
			],
			[
				'Fill-in-the-blanks sheet: the template with gaps',
				'1. Quiet from ____ on weekdays and from ____ at weekends.\n2. We announce parties ____ days ahead and agree an end time.\n3. Overnight guests are welcome, and from the ____ night in a row we agree it in advance.\n4. Dishes are washed up or loaded by ____ at the latest.\n5. The cleaning rota changes every ____. Whoever cannot manage a task swaps beforehand or catches up.\n6. Everyone has a shelf in the fridge, and shared food goes on shelf ____.\n7. We pay for ____ together. Each person pays for ____ themselves.\n8. We agree purchases for the flat over €____ beforehand.\n9. We enter expenses at once and settle up on ____.\n10. The flat meeting is on the ____ of each month at ____.',
			],
			[
				'Start date and signatures',
				'Add underneath the sheet: These rules apply from ____, the trial period runs until ____. Signatures: ____',
			],
			[
				'Quiet hours and noise',
				'Set fixed times when it is quiet, for example from 10 pm on weekdays. Part of this is the agreement that parties are announced. A rule of thumb: whoever is having people round says so at least a day ahead and takes account of flatmates with an exam or an early shift.',
			],
			[
				'Guests and overnight visitors',
				'Settle how often and how long guests can stay and whether people ask first. Anyone with a regular visitor contributes to the utility costs. These are agreements, not laws. Legal questions about the tenancy agreement are settled with the landlord or a tenants’ association (Mieterverein).',
			],
			[
				'Housework and cleanliness',
				'Record who does which task and when, and what “clean” means. A cleaning rota with fixed tasks and reminders replaces discussions. How to set one up is covered in [making a cleaning rota](/make-a-cleaning-rota), and a [cleaning rota template to print](/cleaning-rota-template) is a good start. Dishes do not belong in the sink overnight and shared rooms stay usable: mini-rules like these prevent most conflicts.',
			],
			[
				'The shared kitty and shopping',
				'Define what is paid for together (cleaning supplies, toilet paper, spices) and what is not. Decide how you settle up: how a shared kitty can be run is in the [household kitty](/household-kitty) guide, and how to divide the costs under [splitting flat costs fairly](/split-flat-costs). With a shared list for [organising flat shopping](/organise-flat-shopping), everyone knows what is missing and double purchases disappear.',
			],
			[
				'Bathroom, kitchen and shared rooms',
				'The bathroom gets busy quickly in the morning. Anyone who has to leave early gets a fixed slot, and everyone else showers before or after. In the kitchen, whoever cooks tidies up afterwards, and the worktop is free for the next person. Nothing private stays in the living room for good, otherwise the room turns into a storeroom.',
			],
			[
				'Privacy and private rooms',
				'Knocking: you only enter someone else’s room after knocking and an answer, and not at all if they are out.\nBorrowing: you only take things from other people’s rooms after asking.\nPost and parcels: other people’s post stays unopened, and parcels you accept go in a fixed place.\nEmergencies: if there is water damage or smoke, someone may go into the room and says so straight afterwards.\nAs a rule: “Our rooms are private. We knock and take nothing without asking.”',
			],
			[
				'Bins, laundry, keys and wifi',
				'Bins: whoever sees a full bin takes it out, or the bins are a fixed task in the [cleaning rota](/make-a-cleaning-rota).\nLaundry: the washing machine is emptied after the cycle, and the clothes airer in the hallway is put away once dry.\nKeys: whoever loses a key says so at once, and whoever moves out hands back all of theirs.\nWifi: decide whether guests get the password. How to split the cost is in [utilities and internet](/utilities-and-internet).',
			],
			[
				'Rules for the fridge and dishwasher',
				'Fridge: everyone has their own shelf, and there is another for shared food. Other people’s food is only eaten after asking.\nFridge: every two weeks you go through it together and bin anything out of date, for example as a recurring cleaning task.\nDishwasher: clean dishes are put away straight away, and used ones go in the machine instead of the sink overnight.\nDishwasher: everyone pays for tablets and rinse aid together, and whoever takes the last one puts it on the shopping list.',
			],
			[
				'Smoking, pets and instruments',
				'These three points cause the most trouble when they are not discussed beforehand. Settle whether smoking is allowed in the flat or only on the balcony, whether pets are allowed (the tenancy agreement can set limits here) and at what times people may practise. It is best to raise them at the [WG-Casting](/wg-casting-questions) (flat interview).',
			],
			[
				'Rules for new flatmates',
				'Someone who moves in does not know the agreements that have grown up. Show the rules before they move in, not at the first argument, and ask whether any of them do not suit. After a month a short chat is worthwhile: what feels unfamiliar, what should change? That way new people feel part of the flat and not a guest with duties.',
			],
			[
				'Trial period and review',
				'Do not agree rules for ever. Set a trial period of four weeks and a fixed date to talk about what did not work. After that the monthly flat meeting is enough, as rule 10 of the template provides. Write underneath the template when it starts and when the trial period ends.',
			],
			[
				'How to keep the rules on record',
				'Put them somewhere everyone sees them. In [ManaWG as a flat-share app](/flat-share-app), the noticeboard is a good fit. It has the post types Info, Question, Problem, Request and Decision. Record a rule as a Decision, and the card invites the others to react with “Works for me”. You can pin important posts and mark answered questions as resolved. A decision stands once everyone has agreed, and it can be adjusted at the monthly flat meeting.',
			],
			[
				'Raising conflicts',
				'Raise problems early and calmly: concrete behaviour, concrete effect, concrete request. “You often leave dishes out. That bothers me. Could you wash them in the evening?” works better than “You are messy”. More in the guide to [solving flatmate conflict](/flatmate-conflict).',
			],
			[
				'When someone breaks the rules repeatedly',
				'1. Speak to them one to one, calmly and concretely.\n2. Talk it through together at the flat meeting and ask whether the rule still fits.\n3. Agree a clear consequence, for example that missed cleaning tasks are caught up.\n4. If none of that helps, talk openly about moving out before the mood turns completely.',
			],
			[
				'House rules, Hausordnung and tenancy agreement',
				'Flat rules are agreements between flatmates. They add to the tenancy agreement and the building’s house rules (Hausordnung) but do not replace them. What those say, for example quiet hours in the building or rules on keeping pets, applies regardless of your agreements. So check beforehand what the agreement already sets.',
			],
		],
		faq: [
			[
				'Which rules should every flat share have?',
				'Quiet hours, how to handle guests, cleaning, shared expenses and a regular meeting to agree things. Usually nothing more is needed.',
			],
			[
				'Where do you keep house rules?',
				'Where everyone sees them: printed in the kitchen or on a digital noticeboard such as the one in ManaWG.',
			],
			[
				'Is there a template for house rules?',
				'Yes, at the top of this page are ten rules on quiet hours, guests, cleaning, the fridge and money. Take over only what suits your flat and adjust the figures.',
			],
			[
				'Are house rules legally binding?',
				'As a rule, no. They are agreements between flatmates. The tenancy agreement and the building’s house rules (Hausordnung) are binding, and your flat rules add to them in daily life.',
			],
			[
				'What should I do if someone does not keep to the rules?',
				'Speak to them one to one first, then at the flat meeting. Agree a clear consequence, for example that missed tasks are caught up.',
			],
			[
				'How many house rules make sense?',
				'Ten rules on one page are usually enough. More important than the number is that each rule is concrete and everybody agreed to it. Anything that comes up only rarely is discussed at the flat meeting rather than in the list.',
			],
			[
				'When do quiet hours start in a flat share?',
				'What the tenancy agreement and the building’s house rules (Hausordnung) say comes first. Many flats also agree quiet from 10 pm on weekdays and from midnight at weekends. The times in the template are examples that you adapt to your daily life.',
			],
			[
				'How long can a guest stay in a flat share?',
				'You settle that between yourselves. A common agreement: one to three nights is no issue, after that people ask first. Anyone with a permanent visitor contributes to the utility costs, see [utilities and internet](/utilities-and-internet).',
			],
			[
				'How can I print the house rules?',
				'Copy the fill-in sheet from this page into a document, fill it in together and print it. Put it up where it is easy to see, for example on the kitchen door. Digitally, you record rules in ManaWG as a noticeboard post of the type Decision.',
			],
		],
	},
	'flatmate-conflict': {
		link: 'Flatmate conflict',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Flatmate conflict: cleaning, noise and money | ManaWG',
		description:
			'Rows with flatmates over cleaning, noise or money? How to raise conflicts, find rules that last and stop small irritations from escalating in a flat share.',
		h1: 'Solving conflict between flatmates',
		intro:
			'Almost every flat share has a row sooner or later, usually about the same three things: cleaning, noise and money. It is rarely down to ill will. Mostly there are no clear agreements, or small irritations went unmentioned for too long. A few habits settle most conflicts before they spoil the atmosphere.',
		sections: [
			[
				'Raise things early, do not save them up',
				'The most common mistake is to swallow annoyance until it all comes out at once. Raise things while they are small, and ideally with the person concerned directly rather than with the others first. A calm moment is better than the instant the dirty dishes are in the sink again.',
			],
			[
				'Stay factual: “I” statements',
				'Describe what happened and what it sets off in you, instead of attributing traits to the other person. “It stresses me when the kitchen is full in the morning” lands differently from “You are always so sloppy”. Ask how the other side sees it. There are often reasons you do not know about, such as exams or shift work.',
			],
			[
				'Rows about cleaning',
				'Cleaning rows usually arise because it is unclear whose turn it is or because tasks are shared unevenly. A cleaning rota with a fixed rotation takes the discussion out: it is visible who is next and what is done. How to build one is in [making a cleaning rota](/make-a-cleaning-rota), and a [cleaning rota template to print](/cleaning-rota-template) helps you start. In the [flat-share app ManaWG](/flat-share-app), tasks move on automatically and anyone who is away is skipped. If one person still keeps not cleaning, that belongs at the flat meeting, not in passive-aggressive notes on the fridge.',
			],
			[
				'Rows about noise and guests',
				'What helps here are [rules everyone has agreed beforehand](/house-rules): quiet hours on weekdays, announcing parties, how long guests may stay. Once something has been settled together, it does not need to be renegotiated each time. Put decisions in writing, for example on the noticeboard in ManaWG, so nobody later relies on a different memory.',
			],
			[
				'Rows about money',
				'Money rows almost always come from a lack of overview: who paid what, who owes whom? Enter expenses at once and settle up at a fixed date. An app that works out balances and suggests payments replaces reminders about individual amounts. How to do this with few transfers is in the guide to [debts between flatmates](/flatmate-debts). Also settle beforehand what is bought together and above what amount people ask first.',
			],
			[
				'The flat meeting',
				'A regular short meeting, say once a month, gives everyone a fixed place for topics. Anyone can bring something, and decisions are written down. If things do not improve despite talking, it is no failure to ask whether the mix of people fits. Sometimes [moving out](/moving-out-checklist) is the fairest solution for everyone. Who may give notice to whom depends on the contract, see [asking a flatmate to leave](/asking-a-flatmate-to-leave).',
			],
		],
		faq: [
			[
				'What do flat shares argue about most?',
				'Cleaning, noise and money. In all three cases clear rules that everyone has agreed, and a fixed place where they are written down, help.',
			],
			[
				'How do I raise a problem with a flatmate?',
				'Early, directly and at a calm moment. Describe what bothers you instead of blaming the person, and ask for their view.',
			],
			[
				'Does a cleaning rota help against rows in a flat share?',
				'Yes, if it has a fixed rotation and everyone can see it. Then it is clear whose turn it is and the discussion about it falls away.',
			],
		],
	},
	'holidays-and-time-away': {
		link: 'Holidays and time away',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Flat share and holidays: rota and costs while away | ManaWG',
		description:
			'What applies in a flat share when someone travels? Cleaning rota, rent, shared costs, a semester abroad and agreements for longer absences, settled fairly.',
		h1: 'Holidays and time away in a flat share',
		intro:
			'When someone is gone for weeks, the others wonder who takes over the tasks and who bears which costs. Whether it is a holiday, an internship or a semester abroad, clear rules that are settled beforehand mean no rows.',
		sections: [
			[
				'Cleaning rota while someone is away',
				'Someone who is not there cannot clean. When you are [making a cleaning rota](/make-a-cleaning-rota), a rule for this belongs in it. The usual approach is that people who are away are skipped and do not have to catch up on everything afterwards. Some flats agree that before a long trip the person does their own task first, so nobody takes over an uncleaned bathroom. In the [ManaWG cleaning rota](/cleaning-rota) you enter time away with a date range. When a task is marked done, that person is passed over at the next assignment. Tasks already assigned stay with them, the app marks them as away, and someone else can take them over.',
			],
			[
				'Rent and fixed costs',
				'The rent keeps running even if the room stands empty. With fixed costs such as internet, everyone normally keeps paying, because the contract costs the same regardless of use. With [usage-based costs](/utilities-and-internet) such as electricity, heating or shared food, you can agree that people who are away pay less. That is mainly worth it for longer periods. For two weeks of holiday, a special rule is usually more effort than saving.',
			],
			[
				'Shared expenses while someone is away',
				'Someone who is not there does not eat there. Shopping during that time should only be split between those present. In ManaWG’s [shared expenses](/shared-expenses) you choose who is involved in each expense and simply leave the absent person out. That way no balance builds up for things they never used. The same applies to a [household kitty](/household-kitty): agree whether someone who is away pays in during that time.',
			],
			[
				'Longer absence: internship and semester abroad',
				'With several months, the question of [subletting a room](/subletting-a-room) arises. Whether that is allowed depends on the tenancy agreement, and usually the landlord has to agree. Settle in the flat whether everyone is happy with the person, because they will live with you in that time. The subtenant can join the flat in ManaWG and takes over tasks and costs for the period. Afterwards they leave again.',
			],
			[
				'Example: a semester abroad without subletting',
				'A flat of four pays €120 for electricity a month, and one person is abroad for five months and does not sublet. The flat agrees that in that time the absent person bears only a quarter of their electricity share: €7.50 instead of €30. The remaining €22.50 is split between the other three, €7.50 more each. They keep paying rent and internet in full, because those costs arise regardless of use.',
			],
			[
				'Agreements before the trip',
				'Say in good time how long you will be away and put the dates in the shared calendar. Settle who looks after plants, post and pets. Empty perishable food from the fridge or offer it to the others. And settle open amounts before you leave, so nobody waits weeks for their money.',
			],
		],
		faq: [
			[
				'Do I still have cleaning duties while I am on holiday?',
				'That is up to your flat. It is usual to skip people who are away. In ManaWG this is covered by the time away feature.',
			],
			[
				'Do I still pay utilities while I am on holiday?',
				'Fixed costs such as rent and internet carry on. For usage-based costs you can agree something different.',
			],
			[
				'Can I sublet my room during a semester abroad?',
				'That depends on the tenancy agreement. As a rule you need the landlord’s consent, and your flatmates should be happy with it.',
			],
		],
	},
	'wg-casting-questions': {
		link: 'Flat interviews (WG-Casting)',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'WG-Casting explained: 48 questions, templates | ManaWG',
		description:
			'What is a WG-Casting and how does it work? 48 questions for the flat and for applicants, off-limits questions, reply templates and a scoring sheet.',
		h1: 'WG-Casting: how it works and what to ask, for the flat and for applicants',
		intro:
			'At a WG-Casting, the flat interview for a free room in a German shared flat, twenty minutes decide whether you will live well together for the next few years. Both sides check each other: the flat checks the newcomer, and the applicant checks the flat. With the right questions you learn what really counts, not just who seems the nicest. In short: plan 20 to 30 minutes per appointment, meet applicants one at a time and decide afterwards, separately from the applicants.',
		sections: [
			[
				'What is a WG-Casting and how does it work?',
				'A WG-Casting is a get-to-know-you meeting at which a WG (shared flat) and people interested in a free room check whether they suit each other. Some call it a flat viewing or an introduction round. It is not an audition; it is about whether daily life and expectations fit. It usually takes place in the flat, often at the kitchen table, and lasts 20 to 30 minutes. At the end the flat says by when it will get back to you.',
			],
			[
				'For newcomers to Germany: what to expect',
				'In many German cities the flatmates, not a landlord or an agency, choose who gets a free room, so you apply to the people you will live with. If you are the applicant: expect to be shown the flat and asked about your daily routine, and prepare questions of your own. If you are the flat: you are choosing a person to share a kitchen and bathroom with, so look beyond a good first impression. Two terms come up early. Kaution is the deposit, a security payment held by the landlord. Untermiete is subletting, which means you rent a room from a main tenant (Hauptmieter) rather than directly from the landlord.',
			],
			[
				'The ten most important questions',
				'1. What does a normal day look like for you?\n2. When do you get up and when do you go to bed?\n3. Do you like cooking, alone or with others?\n4. What does a clean kitchen mean to you?\n5. Have you lived with a cleaning rota before, and how did it go?\n6. Would you rather share the shopping or buy for yourself?\n7. How often do you have visitors, including overnight?\n8. Do you smoke, do you have pets or plan to?\n9. Are you looking for a practical flat share or shared evenings?\n10. Roughly how long would you like to live here?',
			],
			[
				'Questions about daily life and rhythm',
				'Do you work or study a lot from home, and do you need quiet for it?\nAre you more of an early bird or a night owl?\nHow long do you need in the bathroom in the morning?\nDo you prefer to eat alone or with others?\nHow often are you at home at weekends?\nHow much time would you like to spend with your flatmates?',
			],
			[
				'Questions about tidiness and cleaning',
				'How often should the bathroom be cleaned?\nWhat bothers you most in a kitchen?\nDo you wash up straight away or the next day?\nHow do you deal with it when a task is left undone?\nDo you prefer fixed tasks or to rotate in turn?\nWho should remind you when it is your turn, and how?\nHonest answers matter more here than the expected ones: someone who admits to being rather untidy but reliably does fixed tasks often fits better than someone who promises perfection.',
			],
			[
				'Questions about money and shopping',
				'Are there things you definitely do not want to share?\nHow should internet, electricity and cleaning supplies be split?\nWould you enter expenses in a [shared expenses app](/shared-expenses) and settle up at the end of the month?\nWhat do you buy for everyone, and what for yourself?\nFor basics such as washing-up liquid and toilet paper: do you pay from a kitty or in turn?\nWould you say so if money gets tight?\nTell them openly how your flat has settled up so far, see [splitting flat costs](/split-flat-costs). Anyone who knows at the casting how things are settled has no surprises later.',
			],
			[
				'Questions about guests, partners and parties',
				'How long can a guest stay before people ask first?\nDo you have a partner who would often be here?\nDo you like having parties at home?\nFrom when should it be quiet on weekdays?\nHow do you tell people when you plan guests or a party?\nWhat is loud for you, and what is still normal?',
			],
			[
				'Smoking, pets, instruments',
				'Is smoking allowed in the flat, or only on the balcony?\nWhat pets do you have or plan to have, and who looks after them on holiday?\nDo you play an instrument, and when do you practise?\nDo smoke or pet smells in the shared rooms bother you?\nThese points cause the most trouble when they are not discussed beforehand. The tenancy agreement can set limits on pets, so settle that first.',
			],
			[
				'Questions applicants ask the flat',
				'Why is the room becoming free?\nIs there a tenancy agreement of your own or a sublease, and who is the main tenant (Hauptmieter)?\nHow high is the Warmmiete (rent including heating and other utilities), and what does it cover?\nHow high is the Kaution (deposit)?\nWhat notice period applies?\nWho decides on the choice, and by when will I hear?\nHow long do the others want to go on living in the flat?\nHow does the cleaning rota work?\nIs there a shared kitty, and how are expenses split?\nHow much does the flat do together?\nContract types and deposits are covered in the guide to the [flat-share tenancy agreement](/flat-share-tenancy-agreement). In short: a deposit for a regular tenancy in Germany is capped at three months’ Kaltmiete (rent excluding utilities) and may be paid in three equal monthly instalments.',
			],
			[
				'Preparing as an applicant',
				'The ad: read it again and note what you like about the flat, then you have a concrete answer to “Why would you like to join us?”.\nAbout you: three sentences are enough: what you do, what your day looks like and how long you want to stay.\nYour own questions: prepare two or three, for example about the cleaning rota, the kitty and why the room is becoming free.\nBe on time: if you will be late, say so briefly.\nStay honest: anyone who pretends is noticed by the second month at the latest.\nWarning signs: if someone asks for money before a viewing and a contract, stop.',
			],
			[
				'Questions that do not belong in a casting',
				'Questions about origin, religion, health, pregnancy or wanting children, and sexual orientation are intrusive and say nothing about whether someone fits the daily life of the flat.\nIf someone volunteers such things, that is their right. But you do not ask about them and do not weigh them.\nAsk instead about what counts in daily life: quiet hours, eating habits, visitors and how long someone wants to stay.\nDeclining: the reply templates further down show how to do it kindly.',
			],
			[
				'Inviting and preparing as a flat',
				'Do not invite too many people at once. How you collect and pre-sort applications is covered in [find a flatmate](/find-a-flatmate). Individual appointments with some buffer work better than a group casting where the loudest win. As many flatmates as possible should be there, because anyone who does not help decide feels overruled later. Show the flat honestly, including the small bathroom and the full kitchen. And agree beforehand what matters to you, so the decision does not hang on gut feeling alone.',
			],
			[
				'Video casting and scams',
				'If meeting in person is not possible, for example when moving from abroad, a video call in which the flat shows the rooms also works. No money before a contract and a viewing: anyone asked to transfer a deposit or rent before they have seen the flat and have a contract in hand should walk away. More on the search and warning signs is in [find a flatmate](/find-a-flatmate).',
			],
			[
				'Deciding after the casting',
				'Sit down together straight after the last meeting while impressions are fresh. Go through the points you set beforehand and ask yourselves honestly who you want to sit with in the kitchen on a rainy Sunday. Say yes quickly to the person chosen and decline the others politely. Anyone who hears nothing waits needlessly and does not keep looking.',
			],
			[
				'Accepting and declining: reply templates',
				'Offer: “Hi Tim, we would be glad if you moved in with us. The room is free from 1 December, €420 all-in. Please tell us by Friday whether you accept, and we will send you the draft contract and our house rules.”\nDecline: “Hi Lena, thank you for the nice chat yesterday. We have chosen someone whose daily life fits a little better. It was not an easy choice. We wish you every success with the search.”\nTiming: send declines on the same day as the offer, so nobody waits.\nContent: no reasons that judge the person, and no comparisons with others.\nAfterwards: what to settle before moving in is covered in [find a flatmate](/find-a-flatmate) and in the [moving-in checklist](/moving-in-checklist).',
			],
		],
		tables: [
			{
				after: 'The ten most important questions',
				title: 'Typical questions and what is behind them',
				header: ['Question', 'What the flat wants to know', 'An honest answer'],
				rows: [
					[
						'What does a normal day look like for you?',
						'Whether your rhythms fit and who needs the bathroom when.',
						'“On weekdays I am out during the day and mostly home in the evening. At weekends I like to sleep in.”',
					],
					[
						'How do you feel about cleaning?',
						'Whether you take on tasks reliably without needing a reminder.',
						'“I am not a tidiness fanatic, but I do my tasks at set times. A cleaning rota helps me with that.”',
					],
					[
						'How often do you have visitors?',
						'Whether the flat stays a place of retreat for everyone.',
						'“Friends drop by occasionally. I mention overnight stays beforehand.”',
					],
					[
						'Do you like having parties at home?',
						'How loud and how late it can get.',
						'“Now and then, but I ask the group first and respect quiet hours.”',
					],
					[
						'How do you picture money working?',
						'Whether shopping and fixed costs run without rows.',
						'“I split fixed costs equally and pay for personal shopping myself. I settle what I owe promptly.”',
					],
					[
						'How long would you like to stay?',
						'Whether you will have to search again soon.',
						'“For now I am planning on a few years, for my studies or work. If that changes, I will say so early.”',
					],
					[
						'Do you smoke, do you have pets?',
						'Whether there will be conflict over smell, noise or the tenancy agreement.',
						'“I do not smoke and have no pets. If that changes, I will agree it with you first.”',
					],
					[
						'Why would you like to join us?',
						'Whether you know the flat or are just looking for any room.',
						'“I like that you cook together and still give each other space. That is the kind of flat I am looking for.”',
					],
				],
			},
			{
				after: 'Deciding after the casting',
				title: 'Scoring sheet',
				header: ['Criterion', 'Person A', 'Person B', 'Person C'],
				rows: [
					['Rhythm fits', '', '', ''],
					['Similar tidiness', '', '', ''],
					['View on money', '', '', ''],
					['Expectations of the flat', '', '', ''],
					['Gut feeling', '', '', ''],
				],
				note: 'Scale from 1 (does not fit at all) to 5 (fits very well). Each person fills in the sheet alone straight after the meeting, then you compare.',
			},
			{
				after: 'What is a WG-Casting and how does it work?',
				title: 'How a WG-Casting runs in 30 minutes',
				header: ['Minute', 'What happens', 'What to look out for'],
				rows: [
					[
						'0 to 5',
						'Welcome, brief introductions, offer a drink',
						'a relaxed mood, nobody needs to put on an act',
					],
					[
						'5 to 10',
						'Tour of the room, kitchen and bathroom',
						'show the flat honestly, including what is unfinished',
					],
					[
						'10 to 20',
						'Conversation with the flat’s questions',
						'listen, and ask open questions rather than yes/no ones',
					],
					[
						'20 to 27',
						'The applicant’s questions',
						'answer openly on rent, contract, deposit and daily life',
					],
					[
						'27 to 30',
						'Goodbye and a date for the reply',
						'name a concrete date, do not promise anything yet',
					],
				],
				note: 'Guide values. If you hold several meetings in one evening, allow ten minutes of buffer between people.',
			},
		],
		faq: [
			[
				'What is a WG-Casting?',
				'A get-to-know-you meeting at which a flat share and people interested in a free room check whether they suit each other. It usually lasts 20 to 30 minutes and takes place in the flat, with a tour and a conversation.',
			],
			[
				'How do I prepare for a WG-Casting?',
				'Read the ad again, think of three sentences about yourself and prepare two or three questions of your own, for example on the cleaning rota, the kitty and the tenancy agreement. Be on time and answer honestly.',
			],
			[
				'How do you decline after a WG-Casting?',
				'Briefly, kindly and on the same day as the offer: thanks for the chat, you have chosen someone else, good luck with the search. A template is on this page.',
			],
			[
				'What do you ask at a WG-Casting?',
				'Questions about daily rhythm, tidiness and cleaning, handling money and shopping, guests and noise, and whether someone wants a practical flat share or shared evenings.',
			],
			[
				'How does the flat decide after the casting?',
				'Together straight after the meetings, using points agreed beforehand. All applicants should hear back promptly, yes or no.',
			],
			[
				'How long does a WG-Casting take?',
				'20 to 30 minutes per person is usual. That is enough for a tour and a conversation without becoming too tiring for either side.',
			],
			[
				'What do I ask as an applicant at a WG-Casting?',
				'Why the room is becoming free, whether there is a tenancy agreement of your own or a sublease, how high the Warmmiete (rent including heating and other utilities) and the Kaution (deposit) are, how the cleaning rota works, how expenses are split and how long the others want to stay.',
			],
			[
				'Which questions are off limits at a WG-Casting?',
				'Questions about origin, religion, health, pregnancy or wanting children, and sexual orientation. They say nothing about living together. Ask about daily life, quiet hours, visitors and money instead.',
			],
		],
		sources: [
			[
				'§ 551 BGB, limits and investment of rental deposits (in German)',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
		],
	},
	'subletting-a-room': {
		link: 'Subletting a room',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Subletting a room in Germany: permission, contract | ManaWG',
		description:
			'Subletting a flat-share room in Germany for a semester abroad or internship: landlord permission, sublease, rent, deposit, address registration and handover.',
		h1: 'Subletting a room in a German flat share',
		intro:
			'A semester abroad, an internship in another city or a few months of travel: if you want to keep your room in a WG (shared flat) but not pay rent for an empty one, you look for a Zwischenmiete, a temporary sublet. For this to go well for everyone you need the landlord’s permission, a clear contract and your flatmates’ agreement. This page describes how it works in Germany, gives an overview and is not legal advice.',
		sections: [
			[
				'Ask first: landlord and flat',
				'In Germany a sublet is legally a [sublease](/flat-share-tenancy-agreement) (Untermiete) and needs the landlord’s permission, ideally in writing. If a legitimate interest arises after you sign your contract, for example a temporary stay abroad, you can, under certain conditions, demand that permission (§ 553 para. 1 BGB). Your flatmates matter just as much: they will live with the new person for months and should help choose.',
			],
			[
				'Finding the subtenant',
				'Subtenants often search at short notice and for fixed periods, for example exchange students or interns. State exactly in the ad from when until when the room is free, what it costs all-in (Warmmiete) and what stays in the room. A short meeting with the flat, by video call if need be, prevents nasty surprises. How to sort and choose applications is in [find a flatmate](/find-a-flatmate), and what the interview usually looks like in [WG-Casting questions](/wg-casting-questions).',
			],
			[
				'The sublease',
				'1. The names of the main tenant (Hauptmieter) and the subtenant\n2. The exact period with start and end date\n3. Rent including utilities, internet and the broadcasting fee share\n4. The deposit (Kaution) and when it is paid back\n5. Which furniture and items stay in the room\n6. That the flat’s rules apply, such as the cleaning rota and quiet hours\n7. A written handover record (Übergabeprotokoll) with photos at the start and at the end',
			],
			[
				'Rent and deposit',
				'It is usual for the subtenant to take over the rent for the room, meaning their share of the Kaltmiete (rent excluding utilities), the utilities, electricity and internet. You keep paying the landlord or the flat as before and receive the money from the subtenant. A deposit (Kaution) of one to two months’ rent protects you against damage and open amounts. Anyone letting a furnished room may charge a reasonable supplement for it, but profit at the subtenant’s expense is not the point.',
			],
			[
				'Address registration and formalities',
				'Someone who is already registered in Germany and stays no longer than six months does not usually have to re-register for the sublet. If the person stays longer, they must register (Anmeldung, address registration) within two weeks after the six months have passed, and someone who otherwise lives abroad must already do so after three months. For this, you as main tenant issue the Wohnungsgeberbestätigung (landlord’s confirmation of move-in). You yourself normally stay registered at the flat address while you are away. Set up a mail redirection (Nachsendeauftrag) or ask the flat to collect your post. More on registering is in [Anmeldung in a shared flat](/anmeldung-shared-flat).',
			],
			[
				'In daily life in the flat',
				'For the time of the sublet the new person is a full member of the flat: they are in the cleaning rota, chip in on shared shopping and keep to the rules. In the [flat-share app ManaWG](/flat-share-app) they join the flat with an invite link and leave it themselves at the end. Expenses are split with them in that time, not with you. Before they move out their balance should be at zero.',
			],
			[
				'Return and handover',
				'At the end, do a handover using the handover record from the start. Check the room and inventory, settle open amounts and pay back the deposit if everything is in order. Allow a few days of buffer between the subtenant moving out and your return in case a date shifts. If you still have questions about the rota and costs during your absence, see [holidays and time away in a flat share](/holidays-and-time-away).',
			],
		],
		faq: [
			[
				'Do I need the landlord’s permission to sublet in Germany?',
				'Yes. Subletting needs the landlord’s permission. For a temporary stay abroad you can demand it under certain conditions.',
			],
			[
				'Does a subtenant have to register their address?',
				'Usually not, if they are already registered in Germany and stay six months at most. Someone who otherwise lives abroad must register after three months.',
			],
			[
				'How much deposit do you take for a sublet?',
				'One to two months’ rent is usual. It is paid back after the handover at the end if there is no damage or open amounts.',
			],
			[
				'May I charge more for a sublet than I pay myself?',
				'A reasonable supplement for furniture let with the room is usual. Charging clearly more is unfair to the subtenant and can cause trouble with the landlord.',
			],
		],
		sources: [
			[
				'§ 540 BGB, letting to third parties (in German)',
				'https://www.gesetze-im-internet.de/bgb/__540.html',
			],
			[
				'§ 553 BGB, permission to sublet (in German)',
				'https://www.gesetze-im-internet.de/bgb/__553.html',
			],
			[
				'§ 551 BGB, limits and investment of rental deposits (in German)',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			[
				'§ 17 BMG, registration and deregistration (in German)',
				'https://www.gesetze-im-internet.de/bmg/__17.html',
			],
			[
				'§ 27 BMG, exemptions from the duty to register (in German)',
				'https://www.gesetze-im-internet.de/bmg/__27.html',
			],
		],
	},
};
