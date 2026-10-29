// English money and flatmate-search guides (batch A). Keys are English slugs; the German
// counterparts live in ../ratgeber.ts and ../ratgeber-geld.ts. Links are prefix-free.
import { euro, mieteAnteile } from '../miete-rechner.ts';
import type { Thema } from '../themen.ts';
import { BGB_EN } from './guides-moving.ts';

// Rent example of the calculator page: values come from mieteAnteile, not from hand.
const EXAMPLE_ROOMS = [12, 18, 24];
const EXAMPLE_SHARED = 18;
const EXAMPLE_RENT_CENT = 90000;
const without = mieteAnteile(EXAMPLE_RENT_CENT, EXAMPLE_ROOMS, 0);
const withShared = mieteAnteile(EXAMPLE_RENT_CENT, EXAMPLE_ROOMS, EXAMPLE_SHARED);
const total = (a: number[]) =>
	euro(
		a.reduce((s, x) => s + x, 0),
		'en',
	);

// Rundfunkbeitrag per dwelling according to rundfunkbeitrag.de (checked 27 October 2026), in cents.
const RUNDFUNK_MONAT_CENT = 1836;
const RUNDFUNK_QUARTAL_CENT = RUNDFUNK_MONAT_CENT * 3;

// Free expenses per day according to the Splitwise help centre (checked 27 October 2026).
const SPLITWISE_TAGESLIMIT = 4;

export const GUIDES_EN_MONEY: Record<string, Thema> = {
	'split-flat-costs': {
		link: 'Splitting flat costs',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Split flat costs fairly: three models with examples | ManaWG',
		beschreibung:
			'How to split rent and shared shopping in a flat share: three models with worked examples, settling up without a transfer mess, and rules that prevent arguments.',
		h1: 'How to split flat costs fairly',
		einleitung:
			'Money is the most common source of friction in shared flats, and it is rarely about large sums. Usually there is simply no rule that everyone has agreed on. This guide covers which costs a flat share has, which ways of splitting them work well and how to keep track. It is written for flat shares in Germany, where a shared flat is called a WG (Wohngemeinschaft).',
		abschnitte: [
			[
				'Which costs a flat share has',
				'There are three groups. First, fixed costs that are the same every month: rent, the advance payment for Nebenkosten (utility and service charges), internet and electricity. Second, running shared expenses for the [household kitty](/household-kitty), such as washing-up liquid, loo roll, cleaning products and shared groceries. Third, one-off purchases, for example a new vacuum cleaner or kitchen equipment. If you keep the three groups apart, you argue less, because each can follow its own rule.',
			],
			[
				'Model 1: split everything equally',
				'Everyone pays the same share. It is simple and suits rooms of similar size. Example: internet costs €36 a month, so four people pay €9 each. When an amount does not divide evenly, a few cents are left over. They should not always fall on the same person but move on from one entry to the next.',
			],
			[
				'Model 2: rent by room size, the rest equally',
				'When rooms differ a lot in size, an equal share of the rent is rarely fair. A common approach is to split the rent by square metres and share running costs such as internet and electricity equally. Example: a 20 m² room in an 80 m² flat carries 25 per cent of the rent. Shared areas such as the kitchen and bathroom are added per head or in proportion to the rooms. The [rent split calculator](/rent-split-calculator) shows how this works. What matters is that everyone has seen the calculation and agreed to it.',
			],
			[
				'Model 3: everyone pays for what they cause',
				'For shopping and one-off items it often works better to let only the people involved pay. If you buy drinks for your own birthday, you do not split that with the whole flat. In [ManaWG’s shared expenses](/shared-expenses) you choose who is involved in each expense and split it equally or with individual amounts per person. The shares always add up to exactly the total.',
			],
			[
				'Settling up without a transfer mess',
				'When everyone pays for everyone now and then, [debts run in all directions](/flatmate-debts). Rather than settle every expense on its own, look at the balance at the end of the month. From the balances you can work out who should transfer money to whom, using as few transfers as possible. ManaWG calculates these suggestions automatically but does not move any money itself: you mark settlements as paid.',
			],
			[
				'Rules that prevent arguments',
				'Write down what is paid jointly and what is not. Pick a fixed day on which you settle up. Record expenses straight away, while the receipt is still to hand. And decide above which amount you ask first, for example for purchases over €50. Fixed costs such as rent and internet are set up once in ManaWG and then booked automatically every month.',
			],
		],
		fragen: [
			[
				'How do you split rent fairly in a flat share?',
				'A common approach is to split the rent by room size, with equal shares for shared costs such as internet and electricity. If the rooms are the same size, an equal share for everyone is fair too.',
			],
			[
				'Who pays for internet and electricity in a flat share?',
				'Usually everyone shares these costs equally, because everyone uses the connections. It is normal for one person to hold the contract while the others pay their share through a fixed cost or a bank transfer.',
			],
			[
				'Is there an app for splitting flat costs?',
				'Yes, for example ManaWG: free, with no ads, in English and German, with balances, settlement suggestions and fixed costs. It runs in the browser, so no app store is needed.',
			],
		],
	},
	'rent-split-calculator': {
		link: 'Rent split calculator',
		widget: { after: 'Calculator', kind: 'rent-calculator' },
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Flat-share rent calculator by room size | ManaWG',
		beschreibung:
			'Split flat-share rent fairly: calculator by room size with shared areas, the formula with an example, and tips on balconies, private bathrooms and utilities.',
		h1: 'Split flat-share rent by room size',
		einleitung:
			'When the rooms in a shared flat (WG) are different sizes, an equal rent share rarely fits. The calculator splits the rent by the floor area of each room and spreads the shared rooms equally across everyone. The result is a proposal that you still need to agree on.',
		abschnitte: [
			[
				'Calculator',
				'Enter the rent, the area of each room in square metres and the area of the shared rooms such as the kitchen, bathroom and hallway. Whether you use Kaltmiete (rent excluding utilities) or Warmmiete (rent including heating and other utilities) is up to you; the calculation stays the same. The pre-filled values are an example. What you enter stays in your browser and is neither stored nor sent anywhere.',
			],
			[
				'The formula with an example',
				`Each room pays according to its area, and the shared area is spread equally across all people. As a formula: share = rent × (room area + shared area ÷ number of people) ÷ (sum of all room areas + shared area). Example: ${euro(EXAMPLE_RENT_CENT, 'en')} rent, three rooms of 12, 18 and 24 m² and ${EXAMPLE_SHARED} m² of shared area. Each room is credited with 6 m² and then counts as 18, 24 and 30 m², 72 m² in total. Amounts are rounded to the cent so that the shares add up to exactly the rent. Other models, such as equal shares or mixed splits, are covered in [how to split flat costs fairly](/split-flat-costs).`,
			],
			[
				'Surcharges: balcony, private bathroom, sloping ceiling',
				'The area formula only knows square metres. A balcony, a private bathroom or a sloping ceiling make a room worth more or less, but there is no fixed rate and no usual percentage. It is a matter of agreement within the flat. Settle on a fixed monthly amount in euros. To make the total add up, deduct a surcharge from the rent first, split the rest by area, then add the surcharge to that person’s share. For a discount, work the other way round. For a sloping ceiling, it is best to measure the area you can actually use.',
			],
			[
				'Utilities, electricity and internet',
				'Enter the rent you want to split by area in the calculator. With Warmmiete, the advance payment for Nebenkosten (utility and service charges) is already part of the result. Flat shares usually split electricity and internet equally, because everyone uses them. How that works and what applies to back payments is covered in [utilities and internet in a flat share](/utilities-and-internet).',
			],
			[
				'Using the result in ManaWG',
				'Set the rent up as a fixed cost in [shared expenses](/shared-expenses): enter the amount, choose an interval of one month, and under “Paid by” pick the person who transfers the rent to the landlord. Under the split, choose “Manually” and enter each person’s amount from the calculator. ManaWG shows whether the shares add up to the rent. Splitting by percentage is not available; you enter euro amounts. After that, the app books the rent as an expense every month automatically.',
			],
		],
		tabellen: [
			{
				nach: 'The formula with an example',
				titel: `Example: ${euro(EXAMPLE_RENT_CENT, 'en')} rent split by room size`,
				kopf: [
					'Room',
					'Area',
					'Share without shared area',
					`Share with ${EXAMPLE_SHARED} m² shared area`,
				],
				zeilen: [
					...EXAMPLE_ROOMS.map((m, i) => [
						`Room ${i + 1}`,
						`${m} m²`,
						euro(without[i] ?? 0, 'en'),
						euro(withShared[i] ?? 0, 'en'),
					]),
					[
						'Total',
						`${EXAMPLE_ROOMS.reduce((s, m) => s + m, 0)} m²`,
						total(without),
						total(withShared),
					],
				],
				hinweis:
					'Without shared area, each room pays only for its own area. With it, the gap between large and small rooms gets smaller.',
			},
		],
		fragen: [
			[
				'How do you split rent fairly in a flat share?',
				'A common approach is to split by room size: the person with more floor area pays more. If the rooms are the same size, an equal share is fair. Shared rooms are spread equally across everyone, as in the calculator above.',
			],
			[
				'Does the shared area count?',
				'It can, but it does not have to. Without it, each room pays only for its own area. With it, everyone pays the same area share for the kitchen, bathroom and hallway, and the differences get smaller. Agree together which rooms count as shared area.',
			],
			[
				'What if a room has a balcony?',
				'There is no fixed rate. Agree on an amount in euros that this person pays extra, and work it out of the rent as described above. Put the agreement in writing.',
			],
		],
	},
	'utilities-and-internet': {
		link: 'Utilities and internet',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Utilities, electricity and internet in a flat share | ManaWG',
		beschreibung:
			'How German flat shares split Nebenkosten, electricity, internet and the broadcasting fee: who holds the contract, how to settle up and share back payments.',
		h1: 'Utilities, electricity and internet in a flat share',
		einleitung:
			'After the rent, Nebenkosten (utility and service charges such as heating, water and waste), electricity and internet are the biggest items in a flat-share budget in Germany. Because usually one person holds the contract, questions come up: who pays what, and what happens with back payments? This guide covers the usual solutions.',
		abschnitte: [
			[
				'Nebenkosten: advance payment and annual statement',
				'You normally pay Nebenkosten as a monthly advance payment (Vorauszahlung). The following year the landlord sends an annual statement (Abrechnung), at the latest twelve months after the end of the billing period. If it arrives later, the landlord can generally no longer demand a back payment. The statement can lead to a back payment or a credit. Split it the way you split the advance payment, among the people who lived in the flat during the billing period. If someone moves in or out in between, work it out pro rata by month.',
			],
			[
				'Example: back payment when people change',
				'The statement for last year shows a back payment of €360. A and B lived in the flat all year, C moved out after eight months and D moved in for the last four. That makes 12 + 12 + 8 + 4 = 36 person-months, or €10 per month: A and B pay €120 each, C pays €80 and D pays €40. A credit is shared out the same way.',
			],
			[
				'Per head or by room size?',
				'Per head is the simplest and usual when rooms are about the same size. If they differ clearly, split by area. Example: rooms of 20, 16 and 14 square metres give shares of 40, 32 and 28 per cent. With €300 of Nebenkosten, the three pay €120, €96 and €84. Many flat shares mix the two: heating by area, everything else per head. How to split the rent itself by room size is shown in the [rent split calculator](/rent-split-calculator).',
			],
			[
				'Electricity and gas',
				'If the contract is in one person’s name, that person pays for everyone at first. An equal split is usual, because individual consumption is hard to measure. Someone who uses a lot more than the rest, for example through a home server or a large appliance, can agree a surcharge. Set the monthly instalment up as a fixed cost so that nothing gets forgotten.',
			],
			[
				'Internet and streaming',
				'Split internet equally. For streaming subscriptions, agree who uses them: if only two of four people watch, only those two pay. In [ManaWG’s shared expenses](/shared-expenses) you choose who is involved in each expense and set up recurring costs as fixed costs.',
			],
			[
				'Rundfunkbeitrag (broadcasting fee)',
				'The Rundfunkbeitrag, the German public broadcasting fee, is charged per dwelling, not per person. In a flat share only one person pays it, and the cost is split among everyone. Rules can change, so check the current position with the Beitragsservice. More is in the guide to the [Rundfunkbeitrag in a shared flat](/rundfunkbeitrag-shared-flat).',
			],
			[
				'The monthly statement as an overview',
				'A monthly overview shows what was spent in total and who owes whom. ManaWG creates it automatically: the total, expenses by category and transfer suggestions. It arrives by email at the start of the month, and anyone can switch that off.',
			],
			[
				'Think of the statement when someone moves out',
				'The Nebenkosten statement often arrives months after someone [moves out](/moving-out-checklist). Agree when they leave how the departing person bears their share of a later back payment or receives a credit, and swap contact details. Some flat shares keep back a small amount until the statement has arrived.',
			],
		],
		fragen: [
			[
				'How are Nebenkosten split in a flat share?',
				'Usually the same way as the rent, so per head or by room size. Back payments are shared among the people who lived in the flat during the billing period.',
			],
			[
				'Who pays the back payment if someone has moved out?',
				'Everyone who lived in the flat during the billing period, pro rata by month. The person who moved out pays for the months they were there.',
			],
			[
				'Who pays the Rundfunkbeitrag in a flat share?',
				'The fee applies per dwelling. One person registers and pays it, and you split the cost among everyone.',
			],
			[
				'Can recurring costs be booked automatically?',
				'Yes. In ManaWG you set up rent, internet or electricity as fixed costs. They are booked as an expense automatically at an interval of whole months.',
			],
		],
		quellen: [
			[
				'§ 556 BGB, agreements on utility costs (in German)',
				'https://www.gesetze-im-internet.de/bgb/__556.html',
			],
			BGB_EN,
			[
				'Rundfunkbeitrag: one contribution per dwelling (English)',
				'https://www.rundfunkbeitrag.de/welcome/english',
			],
		],
	},
	'rundfunkbeitrag-shared-flat': {
		link: 'Rundfunkbeitrag in a shared flat',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Rundfunkbeitrag in a shared flat: who pays | ManaWG',
		beschreibung:
			'The German broadcasting fee (Rundfunkbeitrag) in a flat share: one fee per dwelling, how flatmates deregister, how to split it and what applies on moving out.',
		h1: 'Rundfunkbeitrag (broadcasting fee) in a shared flat in Germany',
		einleitung:
			'In Germany, every dwelling pays the Rundfunkbeitrag, the broadcasting fee for public radio and television, once, not once per person. This guide explains who has to pay, how flatmates deregister when someone already pays, and how to split the cost. It gives an overview and is not legal advice. What the Beitragsservice (the contribution service of ARD, ZDF and Deutschlandradio) writes is what counts. Its letters and forms are in German.',
		abschnitte: [
			[
				'One fee per dwelling',
				'In the private sphere, § 2 para. 1 of the Rundfunkbeitragsstaatsvertrag (RBStV, the state treaty on the broadcasting fee) requires a fee for every dwelling, payable by the holder of the dwelling. The holder is every adult who lives in the dwelling themselves (§ 2 para. 2). A person is presumed to be the holder if they are registered there under residence registration law (see [Anmeldung in a shared flat](/anmeldung-shared-flat)) or named as a tenant in the tenancy agreement. According to the Beitragsservice, the number of people who live in the flat has no effect on the amount.',
			],
			[
				'A flatmate already pays: how to deregister',
				'If someone in your flat already pays, you do not need a contribution account of your own. In that case, deregister yours. It helps to have the name and the Beitragsnummer (contribution number) of the person who pays ready, so ask them first. Your own number is on the letters from the Beitragsservice, for example on the registration confirmation or the account statement, and has nine digits. Deregistering is done with the form “Wohnung abmelden” (deregister a dwelling) on rundfunkbeitrag.de and is only possible under certain conditions. The form tells you which details it asks for. Reply to letters from the Beitragsservice so that no second account is left open for the same dwelling.',
			],
			[
				'Splitting the fee',
				`The fee is ${euro(RUNDFUNK_MONAT_CENT, 'en')} a month per dwelling. Payment every three months is the norm, which is ${euro(RUNDFUNK_QUARTAL_CENT, 'en')} a quarter. On request you can also pay every six months (${euro(RUNDFUNK_MONAT_CENT * 6, 'en')}) or yearly (${euro(RUNDFUNK_MONAT_CENT * 12, 'en')}) in advance. The table shows the amount with an equal share for everyone (as of 27 October 2026, according to rundfunkbeitrag.de). If the fee changes, recalculate. You can find the current amount on rundfunkbeitrag.de. How to split electricity, internet and back payments is covered in [utilities and internet](/utilities-and-internet).`,
			],
			[
				'Who is liable',
				'Under § 2 para. 3 RBStV, several people liable for the fee are jointly and severally liable, in line with § 44 of the Abgabenordnung (AO, the German fiscal code). Under § 44 para. 1 AO, each joint debtor owes the whole amount unless something else is provided. So if a fee is outstanding, the Beitragsservice can turn to any person who counts as a holder, even if you split things differently among yourselves. Agree who pays the fee, and settle shares between you.',
			],
			[
				'Moving out and changing the payer',
				'Anyone who moves out should tell the Beitragsservice. Under § 7 para. 2 RBStV, the obligation ends at the end of the month in which the person stops holding the dwelling, but not before the end of the month in which this was reported. If you do not report it, you may carry on paying. If the paying person moves out, the dwelling is still liable. Agree in good time who pays from then on, and report it using the forms on rundfunkbeitrag.de so that the contribution number and the direct debit belong to the right person. More on moving out is in the [moving-out checklist](/moving-out-checklist).',
			],
			[
				'Exemption',
				'An exemption or reduction is not automatic. It is only granted on application, with proof. The Beitragsservice sets out on its page about exceptions who is entitled and under what conditions, and its English pages explain the main cases, including students on BAföG (student finance). One person’s exemption does not usually cover their flatmates. If anyone in the flat is not exempt, the fee for the dwelling is still due, and that person pays it. You apply using the form “Befreiung oder Ermäßigung beantragen” (apply for exemption or reduction). If in doubt, ask the Beitragsservice how one person’s exemption affects the dwelling.',
			],
			[
				'As a fixed cost in ManaWG',
				`Set the fee up in [shared expenses](/shared-expenses) as a fixed cost: amount ${euro(RUNDFUNK_QUARTAL_CENT, 'en')}, interval “Quarter”, under “Paid by” the person who pays, and the split “Equally” among everyone taking part. Use the next direct debit date as the first due date. ManaWG then books the fee as an expense every three months automatically, and the shares go into the balance. If you pay yearly, choose the interval “Year” and enter the annual amount.`,
			],
		],
		tabellen: [
			{
				nach: 'Splitting the fee',
				titel: 'Rundfunkbeitrag per person with an equal share',
				kopf: ['People', 'Share per month', 'Share per quarter'],
				zeilen: [2, 3, 4].map((n) => [
					`${n} people`,
					euro(RUNDFUNK_MONAT_CENT / n, 'en'),
					euro(RUNDFUNK_QUARTAL_CENT / n, 'en'),
				]),
				hinweis: `Basis: ${euro(RUNDFUNK_MONAT_CENT, 'en')} a month, ${euro(RUNDFUNK_QUARTAL_CENT, 'en')} a quarter for the whole dwelling. As of 27 October 2026.`,
			},
		],
		fragen: [
			[
				'Does everyone in a flat share have to pay the Rundfunkbeitrag?',
				'No. The fee applies once per dwelling. One person pays, the others deregister, and the flat splits the amount among themselves.',
			],
			[
				'How much is the Rundfunkbeitrag per person in a flat share?',
				`The fee applies per dwelling and is ${euro(RUNDFUNK_MONAT_CENT, 'en')} a month (as of 27 October 2026). With an equal share, two people pay ${euro(RUNDFUNK_MONAT_CENT / 2, 'en')} each, three people ${euro(RUNDFUNK_MONAT_CENT / 3, 'en')} each and four people ${euro(RUNDFUNK_MONAT_CENT / 4, 'en')} each per month.`,
			],
			[
				'How do I deregister if my flatmate pays?',
				'Using the form “Wohnung abmelden” on rundfunkbeitrag.de. You need your own contribution number, and deregistering is only possible under certain conditions. Also have the name and contribution number of the paying person ready. The form shows what details it asks for.',
			],
			[
				'Who is liable if the fee is not paid?',
				'Several people liable for the fee in one dwelling are jointly and severally liable (§ 2 para. 3 RBStV, § 44 AO). The Beitragsservice can therefore turn to any person who counts as a holder of the dwelling.',
			],
		],
		quellen: [
			[
				'Rundfunkbeitrag: information in English (rundfunkbeitrag.de)',
				'https://www.rundfunkbeitrag.de/welcome/english',
			],
			[
				'Rundfunkbeitrag: students and apprentices, in English (rundfunkbeitrag.de)',
				'https://www.rundfunkbeitrag.de/welcome/english/students-and-apprentices',
			],
			[
				'Rundfunkbeitrag: payment and amount (rundfunkbeitrag.de, in German)',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/informationen/zahlung',
			],
			[
				'Rundfunkbeitrag: deregister a dwelling (rundfunkbeitrag.de, in German)',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/formulare/abmelden',
			],
			[
				'Rundfunkbeitrag: exemptions from the fee (rundfunkbeitrag.de, in German)',
				'https://www.rundfunkbeitrag.de/ausnahmen-von-der-rundfunkbeitragspflicht',
			],
			[
				'Rundfunkbeitrag: apply for exemption or reduction (rundfunkbeitrag.de, in German)',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/formulare/befreiung-oder-ermaessigung-beantragen',
			],
			[
				'RBStV § 2, the fee in the private sphere (in German)',
				'https://www.gesetze-bayern.de/Content/Document/RBeitrStV-2',
			],
			[
				'RBStV § 7, start and end of the obligation to pay (in German)',
				'https://www.gesetze-bayern.de/Content/Document/RBeitrStV-7',
			],
			[
				'AO § 44, joint debtors (in German)',
				'https://www.gesetze-im-internet.de/ao_1977/__44.html',
			],
		],
	},
	'household-kitty': {
		link: 'Household kitty',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Flat-share household kitty: cash, account or app? | ManaWG',
		beschreibung:
			'A shared household kitty in a flat share: cash tin, joint account or app? Pros and cons, a worked example, rules and settling up without arguments.',
		h1: 'The flat-share household kitty: three options',
		einleitung:
			'Loo roll, cleaning products, dishwasher tablets: small items add up and cause friction. A shared kitty can solve that, as long as it is clear how it is run. This guide covers the three usual ways with their pros and cons, a worked example and the rules that should apply whichever you choose.',
		abschnitte: [
			[
				'What belongs in the household kitty',
				'Before you discuss the form, settle the content. Typical items are things everyone uses up: loo roll, washing-up liquid, cleaning products, bin bags, light bulbs, spices and staples such as oil, salt or coffee, if you share those. Private groceries, toiletries and things for your own room do not belong in it. Bigger purchases such as a vacuum cleaner are better kept separate, because when someone moves out the question comes up of who owns the appliance.',
			],
			[
				'Option 1: a cash tin',
				'Everyone pays a fixed amount into a tin every month, and shared shopping is paid from it. It is easy to see and needs no technology. In practice it quickly gets messy: receipts go missing, nobody knows the balance, someone without cash pays out of pocket and forgets, and whoever moves out wants their share of what is left. If you choose this way, keep a cash book and count the tin together once a month.',
			],
			[
				'Option 2: a joint account',
				'An account that everyone pays into by standing order is transparent, because every transaction is visible. But someone has to open it, run it and answer for it, and many banks charge fees. If the account is in one person’s name, they carry the risk if others do not pay. When people in the flat change often, managing access gets tedious too.',
			],
			[
				'Option 3: record expenses and settle up',
				'Instead of holding money, everyone pays for what is missing and records the amount, for example straight after shopping (see [organising flat shopping](/organise-flat-shopping)). At the end of the month the balances show who owes whom. How to settle open balances fairly is covered in [debts between flatmates](/flatmate-debts). There is no pot for anyone to manage, and nobody is permanently out of pocket. In [ManaWG’s shared expenses](/shared-expenses) you split equally or with individual amounts per person, give each expense a category and see where the money goes. The app suggests settlements with few transfers. You transfer the money yourselves and mark it as paid. If you have been using Splitwise or Splid, bring the old data across with the CSV import, see [Switching from Splitwise or Splid](/switch-from-splitwise-or-splid).',
			],
			[
				'Worked example',
				'A flat share of three spends €90 a month on shared shopping. Anna pays €30 for cleaning products, Ben €51 for the big shop and Cem €9 for bin bags. Each share is €30. Anna is even, Ben has paid €21 too much and Cem €21 too little. A single transfer from Cem to Ben settles everything. With a cash tin or an account, three payments in and three payments out would have been needed.',
			],
			[
				'Rules for any kitty',
				'Decide what belongs in it and what does not. Set a limit above which you ask first, for example €30 or €50. Choose a fixed day for settling up, such as the first of the month. And agree what happens when someone [moves out](/moving-out-checklist): open amounts are settled before they leave, and shared purchases either stay in the flat or are bought out. In ManaWG a monthly statement arrives by email at the start of the month with totals per category and the transfer suggestions. Anyone can switch it off.',
			],
		],
		fragen: [
			[
				'How much should go into the household kitty each month?',
				'It depends on your needs. Add up your actual shared spending over three months and divide by the number of flatmates and months. With the settle-up approach there is no fixed payment in.',
			],
			[
				'What happens to the kitty when someone moves out?',
				'Open amounts should be settled before they leave. With a cash tin or an account, the person gets their share of the balance. With recorded expenses, it is enough to bring the balance to zero.',
			],
			[
				'Is there an app for a household kitty?',
				'Yes. ManaWG is free, has no ads, works in English and German and shows balances and settlement suggestions.',
			],
		],
	},
	'flatmate-debts': {
		link: 'Debts in a flat share',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Settling debts between flatmates and friends | ManaWG',
		beschreibung:
			'Money owed between flatmates or friends in Germany? How to record it, raise it, settle up and when claims expire under German law. With a worked example.',
		h1: 'Settling debts between flatmates and friends in Germany',
		einleitung:
			'Small amounts are easy to forget, which is exactly why they pile up. After a few months nobody knows who owes whom, and the mood suffers. That applies among friends as much as in a flat share. This guide covers how to record, raise and settle debts, what applies to borrowed money and when claims expire. The legal parts describe the position in Germany; this is an overview and not legal advice.',
		abschnitte: [
			[
				'Why debts build up',
				'Everyone pays for everyone now and then: pizza, shopping, a repair, the back payment on electricity. Without a record, after a month neither creditor nor debtor knows how much is open. Whoever pays more often feels taken advantage of, and whoever pays less often does not notice. The problem is rarely ill will. Usually nobody has an overview.',
			],
			[
				'Record it straight away',
				'Enter every expense immediately, while the receipt is to hand. In [ManaWG’s shared expenses](/shared-expenses) you can see each person’s balance at any time. The shares always add up to exactly the total. With an equal split, any leftover cent moves on from one entry to the next, so it does not always fall on the same person.',
			],
			[
				'Settle up with a few transfers',
				'When several people owe each other money, the balances can be netted off. Instead of everyone transferring to everyone else, a few payments are usually enough. ManaWG suggests transfers that settle everything with few payments. The money moves outside the app; you only mark it as paid.',
			],
			[
				'Example with four people',
				'In a flat share of four, Lea has paid €120 more than her share and Tim €20 more. Jonas has paid €80 too little, Mia €60. Settled one by one, up to six transfers would be needed. Netted off, three are enough: Jonas transfers €80 to Lea, Mia transfers €40 to Lea and €20 to Tim. After that, everyone is at zero.',
			],
			[
				'Fixed dates instead of constant reminders',
				'Nobody likes asking about €4.50. A fixed settling-up day, such as the first of the month, takes the awkwardness out: that is when you settle, whatever the amount. ManaWG sends a monthly statement by email at the start of the month with the transfer suggestions. Anyone can switch that email off.',
			],
			[
				'When someone moves out with open amounts',
				'[Moving out](/moving-out-checklist) is the easiest moment to sort everything out, and the last one when everyone is still in one flat. Bring the departing person’s balance to zero before their last day. If a [Nebenkosten statement](/utilities-and-internet) is still due, agree in writing how the back payment or credit will be shared later, and swap contact details. Anyone who chases afterwards often waits a long time.',
			],
			[
				'When everyone is liable together',
				'With a joint main tenancy (Hauptmietvertrag, the tenancy agreement with the landlord, see the [tenancy agreement guide](/flat-share-tenancy-agreement)), the landlord can demand the whole rent from any one tenant, even if the others do not pay (§ 421 BGB, the German Civil Code). Anyone who has paid more than their share can reclaim the rest from the others. If in doubt, equality applies: everyone bears the same share unless something else is agreed (§ 426 BGB). Put in writing beforehand how you split if it should not be equal.',
			],
			[
				'When someone does not pay',
				'Raise it calmly and in private, name the amount and a date. Tips for conversations like this are in [resolving conflict in a flat share](/flatmate-conflict). If that does not help, bring it to the flat meeting without embarrassing the person. Find out whether paying in instalments helps if money is tight. Legal steps are rarely worthwhile for small amounts and strain living together more than the open amount does.',
			],
			[
				'Lent instead of shared: debts between friends',
				'Borrowed money is different from a shared expense: someone fronts the Kaution (rental deposit) or helps out with €300 until the end of the month. That is a loan (Darlehen), for which § 488 BGB prescribes no particular form between private individuals. If no repayment date is agreed, it only falls due when one side gives notice, and the notice period is three months (§ 488 para. 3 BGB). So always name a date when you lend. If an argument comes later, proof is usually missing. What helps is a bank transfer with a reference such as “Loan, repay by 30 Nov”, a message in which the other person confirms the amount and date, or a short signed note with amount, date and repayment date. Keep such loans out of your [shared expenses](/shared-expenses) so that the balances stay right.',
			],
			[
				'Reminders and limitation: how long you can claim the money back',
				'Once the agreed date has passed, send one written reminder with the amount and a new date, by email or message so that it can be proved. If a fixed calendar day was agreed, the person is in default after that day even without a reminder (§ 286 para. 2 no. 1 BGB), provided they are responsible for the late payment (§ 286 para. 4 BGB). If no date was agreed, default only begins when the person fails to pay after a reminder sent once the money is due (§ 286 para. 1 BGB). The next step would be a court order for payment (Mahnbescheid), which costs fees. For small amounts and among friends, it is worth weighing that up first. But do not wait too long: the regular limitation period is three years (§ 195 BGB) and starts at the end of the year in which the claim arose and you knew who owed you the money (§ 199 para. 1 BGB). Example: if repayment was agreed for 15 August 2026, the period starts at the end of 31 December 2026 and ends at the end of 31 December 2029. After that, the debtor may refuse to pay (§ 214 para. 1 BGB).',
			],
		],
		fragen: [
			[
				'How do you settle debts in a flat share?',
				'With an overview of balances and fixed settling-up dates, for example at the end of the month. An app works out the transfers needed.',
			],
			[
				'How do I raise money owed with a flatmate?',
				'Calmly and in private, with a specific amount and date. A fixed settling-up day for everyone usually makes chasing unnecessary.',
			],
			[
				'Does ManaWG transfer money automatically?',
				'No. ManaWG calculates suggestions, you transfer the money yourselves and mark amounts as paid.',
			],
			[
				'What happens to debts when a flatmate moves out?',
				'Open amounts should be settled before they leave. For a later Nebenkosten statement, agree beforehand how the back payment or credit will be shared.',
			],
			[
				'What can you do if a friend does not repay borrowed money in Germany?',
				'Speak to them calmly and name the amount and a new date. If that does not help, send a reminder in writing or by message. If a calendar date was agreed, they are in default once it has passed; otherwise only after a reminder sent once the money is due (§ 286 para. 1 and 2 BGB). For small amounts, letting go is often more sensible than a court order for payment.',
			],
			[
				'How long can you claim back debts between friends in Germany?',
				'Usually three years (§ 195 BGB). The period starts at the end of the year in which repayment fell due and you knew who owed you the money (§ 199 para. 1 BGB). After that, the debtor may refuse to pay (§ 214 para. 1 BGB).',
			],
			[
				'Do you need a written contract for borrowed money in Germany?',
				'No, § 488 BGB prescribes no form for a loan between private individuals. Without proof, though, it is hard to show later that it was a loan and by when it was due back. So put the amount and date in writing.',
			],
		],
		quellen: [
			BGB_EN,
			['§ 421 BGB, joint debtors (in German)', 'https://www.gesetze-im-internet.de/bgb/__421.html'],
			[
				'§ 426 BGB, contribution between joint debtors, transfer of the claim (in German)',
				'https://www.gesetze-im-internet.de/bgb/__426.html',
			],
			[
				'§ 488 BGB, core duties under a loan agreement (in German)',
				'https://www.gesetze-im-internet.de/bgb/__488.html',
			],
			[
				'§ 286 BGB, debtor in default (in German)',
				'https://www.gesetze-im-internet.de/bgb/__286.html',
			],
			[
				'§ 195 BGB, standard limitation period (in German)',
				'https://www.gesetze-im-internet.de/bgb/__195.html',
			],
			[
				'§ 199 BGB, start of the standard limitation period (in German)',
				'https://www.gesetze-im-internet.de/bgb/__199.html',
			],
			[
				'§ 214 BGB, effect of limitation (in German)',
				'https://www.gesetze-im-internet.de/bgb/__214.html',
			],
		],
	},
	'switch-from-splitwise-or-splid': {
		link: 'Switching from Splitwise or Splid',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Switch from Splitwise or Splid: CSV import | ManaWG',
		beschreibung:
			'Bring Splitwise or Splid expenses into your flat’s shared expenses: upload the CSV, check the preview, match names and undo the import if needed.',
		h1: 'Switching from Splitwise or Splid to ManaWG',
		einleitung:
			'If your flat has been keeping its expenses in Splitwise or Splid, switching does not mean starting from scratch. If you have the expenses as a CSV file, ManaWG brings them into your flat’s shared expenses. You see a preview first and can undo the import afterwards. This guide shows the steps and the limits.',
		abschnitte: [
			[
				'What you need first',
				'1. A CSV file with the expenses from Splitwise or Splid. Each provider offers the export, and its menus change, so look there.\n2. A flat in ManaWG in which all flatmates are already members. You match the names in the file to the members later.\n3. Whoever imports the history of other members needs admin rights in the flat.\n4. Euro amounts only: ManaWG works in euros exclusively.',
			],
			[
				'The import in four steps',
				'1. Open the import in your flat and choose the source: Splitwise CSV or Splid CSV.\n2. Choose the CSV file or paste its contents.\n3. Check the preview with all recognised rows and match the names in the file to your flatmates. The app marks suggested matches; check them before you confirm.\n4. Confirm the import. Only then is anything saved.',
			],
			[
				'Matching names and leaving rows out',
				'The file contains the names you used in Splitwise or Splid. ManaWG suggests matching flatmates, and you match any open names yourself. In the preview you untick individual rows that should not be imported, for example expenses that are already in your shared expenses.',
			],
			[
				'What is not imported',
				'ManaWG rejects rows in other currencies one by one, as well as rows with an invalid date, an invalid amount or no people involved. The rest is imported, and the result lists the rejected entries with the reason. If you had expenses in a foreign currency, re-enter them by hand if needed.',
			],
			[
				'Screenshots instead of a file?',
				'If you have no CSV file, choose Screenshot as the source. ManaWG reads a photo or screenshot of an expense list using text recognition in your browser and shows the result for you to correct. Only euro amounts are recognised, and reading can take up to 30 seconds. A CSV file is more accurate and the better way if you have one.',
			],
			[
				'Undoing an import',
				'Every import appears in the import history. If something is wrong, the flatmate who started it or an admin can undo it. That is no longer possible once individual shares of the import have been marked as paid. In that case, remove the wrong expenses one by one. So check the preview carefully before you confirm.',
			],
			[
				'After the switch',
				'From now on everything runs in [shared expenses](/shared-expenses): split expenses, see balances, get settlements suggested with few transfers, plus fixed costs and the monthly statement. It is best to settle open balances from the old system before you switch, or bring them across with the import. How to settle debts fairly is covered in [debts between flatmates](/flatmate-debts). For comparisons of the apps, see [Splitwise alternative](/splitwise-alternative), [Splid alternative](/splid-alternative) and [Tricount alternative](/tricount-alternative), and for all criteria the [best flat-share app](/best-flat-share-app).',
			],
		],
		fragen: [
			[
				'Can I import Splitwise expenses into ManaWG?',
				'Yes, if you have them as a CSV file. Choose Splitwise CSV as the source in the import, check the preview and confirm. Only rows in euros are imported.',
			],
			[
				'Can I import Splid expenses into ManaWG?',
				'Yes, using the source Splid CSV. The steps are the same as for Splitwise: choose the file, check the preview, match names, confirm.',
			],
			[
				'Can I undo an import?',
				'Yes, in the import history, by the person who imported or by an admin. If individual shares are already marked as paid, remove the wrong expenses one by one.',
			],
			[
				'What happens to expenses in other currencies?',
				'ManaWG works only in euros. Rows in other currencies are rejected individually and listed in the result, and the rest is imported.',
			],
			[
				'Is there an import from Flatastic or OurHome?',
				'No, there is a direct import only for Splitwise and Splid CSV files and for photos of expense lists.',
			],
		],
	},
	'splitwise-free-limit': {
		link: 'Splitwise free limit',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Splitwise free: daily limit and Pro | ManaWG',
		beschreibung:
			'How many expenses does Splitwise allow for free each day? The limit according to Splitwise’s help centre, what Pro adds and options for flats with many entries.',
		h1: 'Splitwise free: how many expenses are allowed?',
		einleitung:
			'Splitwise is free to use, but the free version limits the number of new expenses per day. This guide sets out what Splitwise’s help page says about it, what Pro adds and what you can do if the limit slows your flat down. The details come from the linked help page, accessed on 27 October 2026.',
		abschnitte: [
			[
				'In short',
				`According to Splitwise’s help centre, free users can add ${SPLITWISE_TAGESLIMIT} expenses per day (as of 27 October 2026). Other sites sometimes quote other numbers; Splitwise’s own help page is the one that counts.`,
			],
			[
				'What Splitwise Pro adds',
				'According to Splitwise, Pro removes the daily limit and adds further features, shown in the table. Splitwise states the current price on its Pro page.',
			],
			[
				'When the limit gets in the way in a flat',
				'If you record every purchase straight away, a flat share quickly reaches several entries a day, for example after a big shop with separate receipts. Whether the limit matters to you depends on how often you record.',
			],
			[
				'What you can do',
				'Wait until the next day, switch to Pro or use another app.\nManaWG is a free flat-share app with no paid tier and no daily or monthly limit on expenses. It works only in euros, comes in English and German and holds up to 20 active members.\nYou bring old expenses across from Splitwise with the CSV import and a preview, see [Switching from Splitwise or Splid](/switch-from-splitwise-or-splid). For a comparison, see [Splitwise alternative](/splitwise-alternative).',
			],
		],
		tabellen: [
			{
				nach: 'What Splitwise Pro adds',
				titel: 'Splitwise Pro according to its help page',
				kopf: ['Feature', 'Free', 'Pro'],
				zeilen: [
					['Expenses', `up to ${SPLITWISE_TAGESLIMIT} per day`, 'unlimited'],
					[
						'Transaction import (selected countries only)',
						'not included (listed as Pro)',
						'included',
					],
					['Search', 'not included (listed as Pro)', 'included'],
					['Currency conversion', 'not included (listed as Pro)', 'included'],
					['Receipt scanning and itemised splits', 'not included (listed as Pro)', 'included'],
					['Charts', 'not included (listed as Pro)', 'included'],
					['Default splits', 'not included (listed as Pro)', 'included'],
				],
				hinweis: 'Source: Splitwise help centre, accessed on 27 October 2026.',
			},
		],
		fragen: [
			[
				'Is Splitwise still free?',
				`Yes, with limits: according to Splitwise’s help centre, ${SPLITWISE_TAGESLIMIT} expenses per day in the free version.`,
			],
			[
				'How many expenses per day does Splitwise allow for free?',
				`According to Splitwise’s help centre, ${SPLITWISE_TAGESLIMIT}, as of 27 October 2026.`,
			],
			[
				'Can I take my Splitwise data with me?',
				'If your expenses are available as a CSV file, ManaWG imports them with a preview. Amounts in euros are imported.',
			],
		],
		quellen: [
			[
				'Splitwise help centre: What is Splitwise Pro?',
				'https://kb.splitwise.com/pro/what-is-splitwise-pro',
			],
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
		],
	},
	'organise-flat-shopping': {
		link: 'Organising flat shopping',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Shopping in a flat share: together or separate? | ManaWG',
		beschreibung:
			'A shared kitty, a shared shopping list or everyone for themselves: how to organise shopping in a flat share without arguments over food and household supplies.',
		h1: 'Organising shopping in a flat share',
		einleitung:
			'Who ate whose butter? Who buys the loo roll? Shopping is one of those things that cause constant friction in shared flats. There are three tried and tested models, and you can combine them.',
		abschnitte: [
			[
				'Model 1: everything separate',
				'Everyone buys and cooks for themselves. This causes little conflict among people with different eating habits. Only household items such as cleaning products, loo roll, bin bags and spices are paid for jointly.',
			],
			[
				'Model 2: shared basics',
				'Staples such as oil, pasta, rice, spices and drinks belong to everyone, and the rest is private. For that you need a list where everyone writes what is missing. The [ManaWG shopping list](/shopping-list) is shared: whoever shops ticks items off and can then record the shop as an expense straight away.',
			],
			[
				'Example: shared basics in a flat of four',
				'Lena, Tom, Sara and Ben share the basics: cleaning products, loo roll, bin bags and dishwasher tablets. This month Lena buys cleaning products and loo roll for €20, Tom buys bin bags for €12 and Sara buys dishwasher tablets for €16. Ben buys nothing this time. That is €48 in total, so each share is €12. Lena has paid €8 too much, Sara €4, Tom exactly his share, and Ben is €12 short. He transfers €8 to Lena and €4 to Sara, and no more transfers are needed. The amounts are made-up examples. In the app, each person enters their shopping as an expense and picks all four as people involved, and ManaWG shows the balance and the settlements.',
			],
			[
				'Model 3: cooking and shopping together',
				'If you eat together, it is worth taking turns to do the shopping. You split the cost among the people taking part. Someone who only occasionally joins in pays only then. You can set that per expense.',
			],
			[
				'What belongs in the shared shopping',
				'Cleaning products and washing-up liquid, sponges and cloths\nLoo roll, kitchen roll, bin bags\nSalt, pepper, oil, vinegar and basic spices\nCoffee, tea, sugar, if everyone takes from them\nLight bulbs, smoke alarm batteries, dishwasher tablets',
			],
			[
				'Dividing up the fridge and shelves',
				'If you shop separately, you need fixed places: one fridge shelf and one cupboard shelf per person, plus a shared shelf for shared items. Anyone may take what is on the shared shelf, and everything else only after asking. Once a week, the person on kitchen duty goes through the fridge and throws out anything past its date.',
			],
			[
				'Finding a rhythm',
				'Many flat shares do well with one fixed big shop a week for the basics and small top-up shops as needed. One person does the big shop in turn, and everyone fills the list beforehand. Anyone who is at the shop anyway sees in the shared list what is missing and brings it back.',
			],
			[
				'Keeping an eye on supplies',
				'Pasta bought twice and empty spice jars are signs of a missing overview. A supplies area shows what is running low. In ManaWG, supplies suggest what you should buy and add it to the shopping list.',
			],
			[
				'Settling up without paper chaos',
				'Receipts left in the kitchen get lost. Better to enter amounts in the app straight away. During an import, a photo or screenshot of an expense list can be read using text recognition and corrected before saving. At the end of the month, the balance shows who owes whom how much. How a shared kitty works is covered in [the household kitty](/household-kitty).',
			],
		],
		fragen: [
			[
				'Should you shop together in a flat share?',
				'It depends on how you eat. Shared basics with separate groceries is the most common compromise.',
			],
			[
				'What belongs in the shared flat shopping?',
				'Usually household items such as cleaning products, loo roll and bin bags, plus basic ingredients such as oil, salt and spices. Groceries for individual people stay private.',
			],
			[
				'How do you divide up the fridge in a flat share?',
				'One shelf per person and one shared shelf for shared items. Everyone may take what is on the shared shelf.',
			],
			[
				'Is there a shared shopping list for flat shares?',
				'Yes, ManaWG has a shared shopping list with supplies. Items you have ticked off can be recorded straight away as an expense.',
			],
		],
	},
	'find-a-flatmate': {
		link: 'Finding a flatmate',
		stand: '2026-10-29',
		erschienen: '2026-10-29',
		titel: 'Find a flatmate in Germany: WG ad template | ManaWG',
		beschreibung:
			'Advertise a room in a German WG: WG-Gesucht account, ad titles with examples, the key details as a table, photos, common mistakes, a template and a timeline.',
		h1: 'Finding a flatmate in Germany: writing and placing a WG ad',
		einleitung:
			'A room is becoming free, and in a few weeks someone new should move in. For it to work out, you need an honest ad, a good selection and clear agreements before the move. This guide covers the process from the ad to the first month together, for a WG (Wohngemeinschaft, a shared flat) in Germany. It also explains the German platforms for people who are new to them.',
		abschnitte: [
			[
				'Clear this first: landlord and contract',
				'Before you search, find out who holds the tenancy agreement with the landlord. If the flat share is set up through Untermiete (subletting, where the main tenant rents rooms on to the others), you generally need the landlord’s permission for a new person. If everyone has their own contract, the landlord often handles the change. Also decide from when the room is free, what it costs all-in and whether furniture is to be taken over. If you are not looking for a free room but starting a new flat share, the [checklist for starting a flat share](/start-a-flat-share) walks you through the whole process.',
			],
			[
				'Where to place the ad',
				'WG-Gesucht (wg-gesucht.de): the standard portal for rooms in a WG, especially in university towns. It has an English-language interface, though most ads and messages are in German\nImmoScout24: has a separate category for WG rooms\nNoticeboards at the university and at the Studierendenwerk (the student services organisation that runs student housing)\nUniversity groups and classified ads sites such as Kleinanzeigen\nFor working people: a notice at the employer and your own network',
			],
			[
				'WG-Gesucht: creating an account and placing an ad',
				'1. Start posting on wg-gesucht.de and choose the category WG room. The account is created in the process; you do not need to register beforehand\n2. Register with an email address or sign in with Google or Apple\n3. Choose a private account, because you are offering a room as a flat share and not letting commercially\n4. Confirm the registration with an SMS code, which WG-Gesucht requires\n5. Enter rent, Nebenkosten (utility charges), Kaution (deposit) and address. According to WG-Gesucht, the ad only appears in the nearby search with a full address\n6. Add title, text and photos as described in the sections below. According to WG-Gesucht, posting is free, and there is also an optional, paid premium offer. As of October 2026; the interface may change',
			],
			[
				'What belongs in a good WG ad',
				'The facts first: room size, Warmmiete (rent including heating and other utilities), move-in date, any fixed term, location and transport links. Then the flat share itself: how many people, what age, what do you do, how much do you do together? Good photos of the room, kitchen and bathroom in daylight. And one honest sentence about how you run the household and money, for example with a cleaning rota and shared expenses in an app. That filters out applicants who are looking for something quite different.',
			],
			[
				'The ad title: formula and examples',
				'The title decides whether anyone opens the ad. Give, in this order, room size, location, Warmmiete and move-in date. Three examples: “16 m² in a three-person WG, Leipzig-Connewitz, €420 all-in, from 1 Dec”, “12 m² room near the university, Göttingen, €340 all-in, available now”, “20 m² with balcony, Cologne-Ehrenfeld, €560 all-in, from 1 Mar, fixed term until August”. Leave out filler such as “great location”, because the numbers are more convincing.',
			],
			[
				'An example WG ad',
				'“From 1 December, a 16 square metre room is becoming free in our three-person WG in Leipzig-Connewitz, €420 all-in including internet. We are Mia (26, nursing) and Jonas (24, computer science) and are looking for someone between 21 and 30. During the week everyone cooks for themselves, and on Sundays we often eat together. Cleaning follows a rota that changes weekly, and we settle shared expenses in an app. Write and tell us briefly what you do and how you picture life in a WG. English is fine.” Details like these are specific enough that the right people get in touch and the others do not bother writing.',
			],
			[
				'For international applicants and English-speaking flats',
				'Many people who are new to Germany look for rooms in English. If your flat welcomes that, say so in the ad, ideally in both languages, and name what you expect in practice: Anmeldung (address registration at the local registration office), which you will need to support, and the Wohnungsgeberbestätigung (the landlord’s confirmation of move-in that the office requires). Applicants should expect some German-language messages, and often a Kaution of up to three months’ Kaltmiete (rent excluding utilities). Scam messages are common in the rental market, so see the warning below.',
			],
			[
				'Length, photos and common mistakes',
				'Length: according to WG-Gesucht, rooms in ads of 150 words or more are let fastest. The example above is shorter, and your ad can be longer as long as it stays concrete.\nPhotos: room, kitchen, bathroom and hallway, in daylight and tidy.\nFiller: “nice flat share” says nothing, while numbers and examples do.\nRent: always state it all-in and say what is included.\nFixed term: if it is missing from the ad, it only comes out in the conversation and costs both sides time.\nNo-gos: two or three real dealbreakers are enough, a long list puts people off.\nReplies: if you leave applications unanswered, you lose the right ones to other flat shares. For the conversation afterwards, see the [WG-Casting guide](/wg-casting-questions).',
			],
			[
				'Choosing without chaos',
				'For popular rooms, dozens of messages come in quickly. Decide who replies and collect the applications in one place. Invite only the people whose message suits the flat to a viewing (a “WG-Casting”, where applicants meet the flat). After the appointments, decide together, as soon as you can, because good applicants often have several offers. Tell everyone you invited who did not get the room. Suitable questions for the conversation are in the [WG-Casting guide](/wg-casting-questions).',
			],
			[
				'Before the move',
				'Send the new person the most important [house rules](/house-rules) in writing: cleaning rota, how costs are split, quiet hours, bins. Arrange the key handover and the Wohnungsgeberbestätigung for the Anmeldung. If your flat uses [ManaWG as its flat-share app](/flat-share-app), send an invite link. After joining, the new person sees the cleaning rota, shopping list, calendar and noticeboard straight away, and new expenses are shared with them from then on.',
			],
			[
				'Watch out for dodgy enquiries',
				'Scammers turn up on flat-share portals again and again. Typical are messages from people who are supposedly abroad, want to take the room without a viewing and announce a transfer of a higher amount, the rest of which you are meant to pay back. Do not hand over bank details or copies of ID before you have seen the person, at least by video call, and never pay back money that is not safely in your account.',
			],
			[
				'Timeline for the search',
				'Six to eight weeks before: clear up the contract, fix the price and move-in date\nFive to six weeks before: put the ad online with photos\nFour weeks before: bundle viewings into two or three evenings\nThree weeks before: decide together, say yes to one and no to everyone else\nMove-in day: keys, Wohnungsgeberbestätigung, invitation to the flat-share app',
			],
		],
		tabellen: [
			{
				nach: 'What belongs in a good WG ad',
				titel: 'These details belong in the ad',
				kopf: ['Detail', 'Why', 'Example'],
				zeilen: [
					[
						'Room size',
						'the first filter question for people searching',
						'16 m², furnished or empty',
					],
					['Warmmiete', 'saves follow-up questions', '€420 all-in including internet'],
					['Kaution', 'one of the costs that should be clear up front', 'two months’ Kaltmiete'],
					[
						'Move-in and duration',
						'shows whether fixed term or open-ended',
						'from 1 Dec, open-ended',
					],
					[
						'Location',
						'the route to university or work often decides',
						'8 minutes to the tram, supermarket around the corner',
					],
					[
						'Who lives there',
						'age and everyday life of the flat share',
						'Mia (26, nursing) and Jonas (24, computer science)',
					],
					[
						'Everyday life',
						'filters by expectations',
						'weekly rotating cleaning rota, shared expenses',
					],
					['Reply time', 'applicants know where they stand', 'reply within two days'],
				],
				hinweis:
					'The values are examples, and the details about room, rent, move-in and flat come from the template text. Your tenancy agreement is what counts.',
			},
		],
		fragen: [
			[
				'Where do I find a new flatmate in Germany?',
				'On WG portals such as WG-Gesucht, in university groups, through noticeboards at the Studierendenwerk, on classified ads sites such as Kleinanzeigen and through your own network.',
			],
			[
				'What belongs in a WG ad?',
				'Room size, Warmmiete with utility charges, move-in date, any fixed term, location, photos in daylight and an honest description of the flat share and its everyday life.',
			],
			[
				'Do you need the landlord’s permission for a new flatmate?',
				'With Untermiete (subletting), generally yes. If all flatmates have their own contract with the landlord, the landlord usually handles the change. Your tenancy agreement is what counts.',
			],
			[
				'How long does it take to find a flatmate?',
				'It depends on city, price and time of year. Allow at least four to six weeks. At the start of term in university towns, more people usually get in touch than in summer or around the new year.',
			],
			[
				'What does a WG ad on WG-Gesucht cost?',
				'According to WG-Gesucht, posting a WG room is free. There is also an optional, paid premium offer.',
			],
			[
				'Do I need an account to place a WG ad?',
				'Yes. On WG-Gesucht you create the account when you post, with an email address or through Google or Apple. The registration is confirmed with an SMS code.',
			],
			[
				'How long should a WG ad be?',
				'Long enough for the facts, the flat share and everyday life. WG-Gesucht gives a guideline of at least 150 words, because such ads fill their rooms fastest.',
			],
		],
		quellen: [
			['WG-Gesucht (English interface)', 'https://www.wg-gesucht.de/en/'],
			['WG-Gesucht: portal for rooms in shared flats (in German)', 'https://www.wg-gesucht.de/'],
			[
				'ImmoScout24: rooms in shared flats (in German)',
				'https://www.immobilienscout24.de/wohnen/wg-zimmer.html',
			],
			[
				'WG-Gesucht: place a listing (in German)',
				'https://www.wg-gesucht.de/artikel/angebot-aufgeben-so-inserieren-sie-erfolgreich-ihre-wg-wohnung',
			],
			[
				'WG-Gesucht: advertise a shared flat (in German)',
				'https://www.wg-gesucht.de/ic/wg-inserieren.html',
			],
		],
	},
};
