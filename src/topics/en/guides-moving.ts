import type { Topic } from '../types.ts';

// English guides for starting, moving into and leaving a flat share in Germany.
// German law (BGB, BMG) is cited with its German sources; only the German text is binding.

export const BGB_EN: [string, string] = [
	'German Civil Code (BGB), English translation (for information, only the German text is binding)',
	'https://www.gesetze-im-internet.de/englisch_bgb/',
];
const BMG_EN: [string, string] = [
	'Federal Registration Act (BMG), English translation (for information, only the German text is binding)',
	'https://www.gesetze-im-internet.de/englisch_bmg/',
];

export const GUIDES_EN_MOVING: Record<string, Topic> = {
	'start-a-flat-share': {
		link: 'Start a flat share',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Start a flat share in Germany: steps and checklist | ManaWG',
		description:
			'Start a WG (shared flat) in Germany step by step: the right order, budget, tenancy type, deposit, flat agreement and Anmeldung. With a tick-off checklist.',
		h1: 'Start a flat share in Germany: steps and checklist',
		intro:
			'Starting a WG (Wohngemeinschaft, a shared flat) in Germany is mostly about getting the order and the responsibilities right: who moves in, what the flat may cost, which type of tenancy applies and who pays which share when. This checklist runs from the first conversation to the first flat meeting after move-in, with a worked deposit example and a list to tick off at the end. It is general information and not legal advice, particularly on tenancy agreements.',
		sections: [
			[
				'The order in which a flat share comes together',
				'Most people who start a flat share from scratch look for flatmates first and the flat second. You then apply as a group and know your budget and expectations before the first viewing. If you are taking over a flat where someone already lives, the order is reversed. The table shows what comes up in each phase and which step on this page covers it. What to do in the first weeks after move-in is in the [moving-in checklist](/moving-in-checklist).',
			],
			[
				'1. Find the right flatmates',
				'It matters less whether you are best friends than whether you share similar ideas about living together. Talk about quiet hours, guests, cleanliness, smoking, pets, and whether you want a practical arrangement or shared evenings. How to find and choose the right people is covered in [find a flatmate](/find-a-flatmate). Also ask how long each person plans to stay: a flat where everyone is planning for two years works differently from one with short-term subtenants.',
			],
			[
				'Budget and flat size before you search',
				'Work backwards. What each person can pay per month for the Warmmiete (rent including heating and other utilities), multiplied by the number of people, gives the ceiling for the flat. Four people at €400 each means €1,600 all-in. Electricity, internet and the [Rundfunkbeitrag](/rundfunkbeitrag-shared-flat) (the German broadcasting fee) usually come on top. For the running costs to expect, see [utilities and internet in a flat share](/utilities-and-internet). Everyone needs a room of their own. If you also want a shared living room, look for a flat with one room more than you have people. With a large kitchen-diner, one room per person is often enough. From four people upwards it is worth asking about a second bathroom. If you want shares based on room size rather than an equal split, the [rent split calculator](/rent-split-calculator) works them out.',
			],
			[
				'2. Search for a flat and apply together',
				'If you search as a group, present yourselves to landlords as one. Prepare a short flat-share profile: who you are, how long you want to stay and which type of tenancy you have in mind. Landlords often ask each person for a Schufa credit report, proof of income and a Mietschuldenfreiheitsbescheinigung (confirmation that you have no rent arrears), so ask in advance what they need. At the viewing, ask how many bathrooms there are, where the electricity and gas meters are, and whether the landlord allows a joint contract, individual contracts or subletting (Untermiete).',
			],
			[
				'3. Choose the right type of tenancy',
				'There are three common set-ups in a flat share. With a joint main tenancy (Hauptmietvertrag), everyone signs and is jointly liable for the whole rent. One person can only leave with the consent of the landlord and the other tenants. With a subletting arrangement, one person is the Hauptmieter (main tenant), rents the flat and sublets rooms. They carry the risk and need the landlord’s permission, but have more say over who moves in. With individual tenancy agreements, each person has their own contract with the landlord for their room. Which one fits depends on how settled the flat share is. The differences are set out in the guide to the [flat-share tenancy agreement](/flat-share-tenancy-agreement). If in doubt, a Mieterverein (tenants’ association) can advise you.',
			],
			[
				'4. Agree the deposit and the handover',
				'The [Kaution (deposit)](/flat-share-deposit) may be at most three months’ Kaltmiete (rent excluding utilities), and can be paid in three monthly instalments. Write down who paid which share, so it is clear who is owed what when someone leaves. At the handover, every room belongs in the handover record (Übergabeprotokoll), ideally with photos of any damage and the meter readings for electricity, gas and water.',
			],
			[
				'5. A flat agreement between yourselves',
				'Alongside the tenancy agreement, a short agreement between flatmates is worth having. It covers what the contract with the landlord leaves open: rent shares per room, utilities, electricity and internet, the cleaning rota, a shared kitty, guests, quiet hours and what happens when someone moves out, such as how early they tell the others and who helps find a replacement. The agreement is an understanding between flatmates and does not change the tenancy agreement. A short model: “We, [names], live at [address] from [date]. Rent: [split]. Fixed costs: [list]. Cleaning rota: [rhythm]. Guests: [rule]. Anyone moving out tells the others [number] weeks ahead and helps find a successor. After three months we review this agreement.” Suggestions for individual rules are in [house rules](/house-rules). In ManaWG, you can record the agreement as a noticeboard post of the type Decision, and the others react with “Works for me”.',
			],
			[
				'6. Register and set up contracts',
				'After moving in, everyone has to register their address with the local citizens’ office (Bürgeramt) within two weeks. This is the Anmeldung, and it needs a Wohnungsgeberbestätigung (landlord’s confirmation of move-in) issued by the landlord, or by the main tenant if you sublet. The [guide to the Anmeldung](/anmeldung-shared-flat) explains how. Electricity and internet usually run in one person’s name, and you split the costs. The [Rundfunkbeitrag](/rundfunkbeitrag-shared-flat) is due once per flat, not per person: one person registers, and the others deregister, quoting that person’s contribution number. Everyone should have their own personal liability insurance (Haftpflichtversicherung) and check whether their contents insurance (Hausratversicherung) covers a flat share.',
			],
			[
				'7. Settle the money',
				'Decide how the rent is divided ([equally or by room size](/split-flat-costs), with the [rent split calculator](/rent-split-calculator) to show the figures), who holds which contracts and what you buy together. Whoever pays should reliably get the money back without having to ask each time. With the [flat-share app ManaWG](/flat-share-app) you enter rent, electricity and internet once as fixed costs and add shared purchases as they happen. The app shows balances and settlement suggestions, and you make the transfers yourselves.',
			],
			[
				'8. Agree on the initial equipment',
				'Agree what is bought together (washing machine, vacuum cleaner, kitchen appliances, cleaning supplies) and who owns it when someone moves out. For expensive items, a simple note of who paid how much helps. Many flat shares buy the basics together and everyone brings the rest themselves.',
			],
			[
				'What starting up costs',
				'There are one-off and running costs at the start. One-off costs are mainly the deposit, initial equipment and the move. Running costs are rent, electricity, internet and insurance. Settle before signing who can pay how much at move-in, because the deposit and the first rent are due straight away. How to share the running costs afterwards is covered in [splitting flat costs](/split-flat-costs).',
			],
			[
				'9. Organise the household and the cleaning rota',
				'Agree on a cleaning rota with specific tasks and fixed cycles, for example bathroom weekly, kitchen weekly, hallway every two weeks, rubbish as needed. The guide to [making a cleaning rota](/make-a-cleaning-rota) shows how, and a [printable cleaning rota template](/cleaning-rota-template) helps you get going. A shared shopping list for things everyone needs stops three people buying washing-up liquid while nobody buys toilet paper. You can share both in ManaWG without anyone maintaining the list by hand.',
			],
			[
				'10. Write down the house rules',
				'Put the most important agreements in writing, such as quiet hours, how to handle visitors and overnight guests, shared rooms and what to do in a dispute. A template to adapt is in [house rules](/house-rules). The point is not paragraphs, it is that nobody can say later that they were never told. The noticeboard in ManaWG suits this, because decisions stay visible and do not disappear in the chat.',
			],
			[
				'11. Set a date for the flat meeting',
				'Half an hour once a month is enough. You settle the balances in the [shared expenses](/shared-expenses); the ManaWG monthly statement arrives by email at the start of the month and shows totals per category and settlement suggestions. You also go through dates in the shared calendar and check whether any of your rules need adjusting. How to raise conflicts is covered in [resolving flatmate conflicts](/flatmate-conflict). People who talk regularly rarely need to escalate.',
			],
			[
				'When someone moves out or does not pay',
				'With a joint main tenancy, each person is liable to the landlord for the whole rent, and someone can only leave with the consent of the landlord and the other tenants (see the table above). With subletting, the main tenant carries the risk if a room stands empty. If a legitimate interest in subletting part of the flat arises after the contract is signed, the tenant can, under certain conditions, demand permission (§ 553 para. 1 BGB). If someone is not paying, raise it early and agree how you will settle the amounts. More in [debts between flatmates](/flatmate-debts), [asking a flatmate to leave](/asking-a-flatmate-to-leave) and [subletting a room](/subletting-a-room).',
			],
			[
				'The checklist to tick off',
				'1. Flatmates found and expectations discussed\n2. Application documents ready for each person\n3. Type of tenancy chosen and tenancy agreement signed\n4. Deposit paid, shares noted down\n5. Handover record with photos and meter readings\n6. Flat agreement written down and confirmed by everyone\n7. Everyone registered within two weeks\n8. Electricity, internet and Rundfunkbeitrag in one person’s name, costs shared\n9. Liability and contents insurance checked\n10. Rent split and fixed costs agreed\n11. Initial equipment agreed\n12. Cleaning rota, shopping list and house rules set up',
			],
		],
		faq: [
			[
				'Can you just start a flat share?',
				'Yes. You do not register a flat share as such. You need a tenancy agreement that allows people to live together, and each person registers their address with the Bürgeramt within two weeks (§ 17 para. 1 BMG). If one person rents the flat alone and takes in flatmates, they need the landlord’s permission (§ 540 para. 1 BGB).',
			],
			[
				'Are two people already a flat share?',
				'In everyday terms, yes: two people who share a flat without being a couple or family are a flat share. The same rules on tenancy, deposit and registration apply as in a larger flat share.',
			],
			[
				'Should you look for flatmates or a flat first?',
				'If you want to apply as a group, find the flatmates first. Then you know before the viewing how many rooms you need and what budget each person has. Tips for the search are in [find a flatmate](/find-a-flatmate).',
			],
			[
				'How many rooms does a new flat share need?',
				'One room per person, plus one more if you want a shared living room. Four people with a living room therefore look for a five-room flat. With a large kitchen-diner, four rooms are often enough.',
			],
			[
				'What do you need to start a flat share?',
				'A suitable flat, compatible flatmates, a clear tenancy agreement, registration with the Bürgeramt, binding rules for money and the household, and a rhythm for agreeing things.',
			],
			[
				'Which tenancy agreement is best for a flat share?',
				'It depends on how settled the flat share is. A joint main tenancy gives everyone the same rights but makes it awkward for one person to leave. Subletting and individual agreements are more flexible if flatmates change often.',
			],
			[
				'How high can the deposit be in a flat share?',
				'At most three months’ rent excluding utilities, payable in three equal monthly instalments (§ 551 BGB). With €1,200 Kaltmiete that is at most €3,600, or €900 per person for four people sharing equally.',
			],
			[
				'Does a flat share need its own agreement?',
				'It is not required. It records what the tenancy agreement does not cover: rent shares, costs, cleaning, guests and moving out. It does not change the tenancy agreement.',
			],
			[
				'Does everyone in a flat share have to pay the Rundfunkbeitrag?',
				'No. The Rundfunkbeitrag is due once per flat. One person pays, the others deregister themselves, and the flat splits the amount.',
			],
			[
				'How do you organise money in a new flat share?',
				'With clear rules for rent, utilities and shared purchases, and a tool that records expenses and calculates balances. You set up fixed costs once.',
			],
			[
				'Is ManaWG suitable for new flat shares?',
				'Yes. One person creates the flat and shares the invite link, and the others are in straight away. The app is free, available in English and German, and needs no installation from an app store.',
			],
		],
		tables: [
			{
				after: '4. Agree the deposit and the handover',
				title: 'Example: deposit with €1,200 Kaltmiete and four people',
				header: ['Item', 'Amount', 'Basis'],
				rows: [
					['Maximum: three months’ rent excluding utilities', '€3,600', '§ 551 para. 1 BGB'],
					['Share per person with an equal split', '€900', 'your agreement'],
					[
						'Payment in three monthly instalments',
						'€1,200 per instalment, €300 per person',
						'§ 551 para. 2 BGB: first instalment at the start of the tenancy, the other two with the following rent payments',
					],
				],
				note: 'Worked example for a cash deposit. With individual tenancy agreements the limit applies to each contract, with subletting to the sublease.',
			},
			{
				after: '3. Choose the right type of tenancy',
				title: 'Three tenancy models',
				header: ['Model', 'Liability', 'Moving out', 'Notice'],
				rows: [
					[
						'Joint main tenancy',
						'everyone together for the whole rent',
						'only with the consent of the landlord and flatmates',
						'usually only everyone together',
					],
					[
						'Subletting',
						'the main tenant alone',
						'the main tenant chooses the successor, with the landlord’s permission',
						'own contract with the main tenant',
					],
					[
						'Individual tenancy',
						'each person for their room',
						'the landlord usually chooses the successor',
						'own contract',
					],
				],
				note: 'More in the guide to the flat-share tenancy agreement.',
			},
			{
				after: 'The order in which a flat share comes together',
				title: 'Starting a flat share: the phases',
				header: ['Phase', 'What you settle', 'Step'],
				rows: [
					[
						'Before the search',
						'Who moves in, budget per person, preferred type of tenancy',
						'1, 3, 7',
					],
					['During the search', 'Flat-share profile, documents, questions at the viewing', '2'],
					['Before signing', 'Type of tenancy, landlord’s consent, deposit and shares', '3, 4'],
					['On move-in day', 'Handover record with photos, meter readings, keys', '4'],
					[
						'In the first two weeks',
						'Anmeldung (address registration) at the Bürgeramt, electricity, internet, Rundfunkbeitrag',
						'6',
					],
					[
						'In the first month',
						'Flat agreement, rent split, cleaning rota, rules, first flat meeting',
						'5, 7, 9, 10, 11',
					],
				],
				note: 'The Anmeldung is due within two weeks of moving in (§ 17 para. 1 BMG).',
			},
			{
				after: 'Budget and flat size before you search',
				title: 'Example: number of rooms and budget',
				header: [
					'People',
					'Rooms without living room',
					'Rooms with living room',
					'All-in rent at €400 per person',
				],
				rows: [
					['2', '2', '3', '€800'],
					['3', '3', '4', '€1,200'],
					['4', '4', '5', '€1,600'],
					['5', '5', '6', '€2,000'],
				],
				note: 'Worked example with an equal contribution per person. How you actually split the rent depends on room sizes and your agreement.',
			},
			{
				after: 'What starting up costs',
				title: 'Costs at the start',
				header: ['Item', 'When', 'Who pays'],
				rows: [
					[
						'Deposit',
						'at the start of the tenancy, three monthly instalments possible for a money deposit (§ 551 para. 2 BGB)',
						'each person their share, note the shares down',
					],
					['First rent', 'at the start of the tenancy', 'according to your split'],
					['Move', 'before moving in', 'each person for themselves'],
					[
						'Shared initial equipment',
						'around move-in',
						'together, with a note of who paid how much',
					],
					[
						'Electricity and internet',
						'from move-in, ongoing',
						'one person holds the contract, you share the costs',
					],
					['Liability insurance', 'ongoing', 'each person for themselves'],
					['Contents insurance', 'ongoing', 'depends on the policy, check beforehand'],
				],
				note: 'The table at step 4 works out the deposit.',
			},
		],
		sources: [
			[
				'§ 551 BGB, limits and investment of rental deposits (in German)',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			[
				'§ 17 BMG, registration and deregistration (in German)',
				'https://www.gesetze-im-internet.de/bmg/__17.html',
			],
			[
				'§ 553 BGB, permission to sublet (in German)',
				'https://www.gesetze-im-internet.de/bgb/__553.html',
			],
			[
				'§ 540 BGB, letting to third parties (in German)',
				'https://www.gesetze-im-internet.de/bgb/__540.html',
			],
			BGB_EN,
			BMG_EN,
		],
	},
	'flat-share-tenancy-agreement': {
		link: 'Flat-share tenancy',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Flat-share tenancy agreement in Germany: 3 models | ManaWG',
		description:
			'Which tenancy fits a WG (shared flat) in Germany? Joint tenancy, subletting or individual contracts compared, plus a sublease checklist and deposit rules.',
		h1: 'The flat-share tenancy agreement in Germany: three models compared',
		intro:
			'Living in a WG (shared flat) in Germany does not automatically give you the same rights as your flatmates. What matters is how the tenancy is set up: whether everyone signs together, one person sublets, or each person has their own contract. That decides who is liable for the rent, who can give notice and how a change of flatmate works. This page gives an overview and is not legal advice. For a specific case, a Mieterverein (tenants’ association) can help.',
		sections: [
			[
				'Model 1: joint main tenancy (Mietgemeinschaft)',
				'All flatmates sign one contract with the landlord, which Germans call a Mietgemeinschaft (joint tenancy). Everyone has the same rights, but everyone is jointly liable for the whole rent: if one person does not pay, the landlord can demand the full amount from any of the others. As a rule, only everyone together can give notice, and nobody can [ask a flatmate to leave](/asking-a-flatmate-to-leave). If one person wants to move out, the change needs the consent of the landlord and the other tenants. Some landlords add a clause that expressly allows flatmates to change, so check whether yours has one before you sign.',
			],
			[
				'Model 2: main tenant with subtenants',
				'One person rents the flat and sublets individual rooms. That person needs the landlord’s permission to sublet. For a temporary sublet, the process is covered in [subletting a room](/subletting-a-room). The Hauptmieter (main tenant) alone is liable to the landlord for the whole rent, and so carries the risk if a room stands empty or someone does not pay. In return, the main tenant has a say in who moves in. Subtenants have a contract only with the main tenant. If they live in a furnished room in the main tenant’s own flat, shorter notice periods and weaker protection against termination often apply than in an ordinary rented flat.',
			],
			[
				'Model 3: individual tenancy agreements',
				'Each person signs their own contract with the landlord for their room and the shared use of kitchen and bathroom. This is common in student halls and in flat shares run commercially. Nobody is liable for anyone else’s rent, and someone moving out gives notice on their own contract only. In return, the landlord usually picks the successor, and the flat share often has little say.',
			],
			[
				'The three models at a glance',
				'Liability for the rent: joint tenancy everyone together, subletting the main tenant, individual contract each person for themselves\nNotice: joint tenancy only together, subletting your own contract with the main tenant, individual contract your own contract\nNew flatmates: joint tenancy with the consent of the landlord and the flat share, subletting chosen by the main tenant with the landlord’s permission, individual contract chosen by the landlord\nRisk of an empty room: joint tenancy everyone, subletting the main tenant, individual contract the landlord',
			],
			[
				'The deposit in a flat share',
				'The [Kaution (deposit)](/flat-share-deposit) may be at most three months’ Kaltmiete (rent excluding utilities), and can be paid in three monthly instalments. With a joint main tenancy, the flat share pays it together. Write down who paid which share, because when someone leaves, the successor usually pays their share to the person moving out, while the deposit stays with the landlord. With subletting, you pay the deposit to the main tenant.',
			],
			[
				'What the contract should contain',
				'1. Who the tenants are, with full names\n2. Which rooms are for your sole use and which are shared\n3. Rent and utilities, shown separately\n4. The amount of the deposit\n5. Whether subletting or a change of tenant is allowed\n6. Notice periods and any fixed term\n7. Which furniture is included',
			],
			[
				'Sublease checklist',
				'A ready-made contract template rarely fits your flat share exactly. The table shows which points a sublease for a room in a flat share should cover, each with an example entry to adapt. Whether the room is furnished and whether the main tenant lives there decides the notice period. Which periods apply when you move out later is explained in [giving notice on a room](/give-notice-on-a-room).',
			],
			[
				'Which model fits?',
				'For a settled flat share of friends who want to live together for a long time, a joint main tenancy with a clause for changes of tenant fits well. If flatmates change often, as in student cities, subletting is more flexible but puts the burden on the main tenant. Individual contracts are the most convenient, but give the flat share the least influence over who moves in. How you then split rent, utilities and shopping is covered in [splitting flat costs](/split-flat-costs), and everything else you need to get started is in the [checklist for starting a flat share](/start-a-flat-share).',
			],
		],
		tables: [
			{
				after: 'Sublease checklist',
				title: 'Sublease for a flat-share room: points with examples',
				header: ['Point', 'Example entry'],
				rows: [
					['Parties', 'Name and address of main tenant and subtenant'],
					['Rented space', 'Room 2, 14 m², shared use of kitchen, bathroom and hallway'],
					['Furniture', 'furnished with bed, wardrobe and desk, or unfurnished'],
					['Rent', '€350 per month, of which €80 advance payment for utilities'],
					['Due date', 'by the third working day of the month at the latest'],
					['Deposit', 'amount, at most three months’ rent excluding utilities'],
					['Start and term', 'from 1 March, open-ended or with an end date'],
					['Notice', 'statutory periods under § 573c BGB'],
					['Landlord’s permission', 'copy of the permission to sublet as an annex'],
					['House rules', 'house rules and flat-share rules as an annex'],
					['Signatures', 'handwritten by both sides, with place and date'],
				],
				note: 'Example entries to adapt, not a legally checked contract template.',
			},
		],
		faq: [
			[
				'Which tenancy agreement is best for a flat share?',
				'It depends on how settled the flat share is. A joint main tenancy gives everyone the same rights but makes changes awkward. Subletting and individual contracts are more flexible.',
			],
			[
				'Is everyone in a flat share liable for the rent?',
				'With a joint main tenancy, yes: the landlord can demand the full rent from any tenant. With subletting only the main tenant is liable, and with individual contracts each person for their own room.',
			],
			[
				'Do I need the landlord’s permission to sublet a flat-share room?',
				'Yes, subletting needs the landlord’s permission. Under certain conditions you have a right to it, for example if a legitimate interest arose after the contract was signed.',
			],
			[
				'Can one flatmate give notice alone on a joint tenancy?',
				'As a rule, no. With a joint main tenancy, all tenants have to give notice together. A change of individual people needs the landlord’s consent.',
			],
			[
				'What is a Mietgemeinschaft?',
				'It is the German term for several people signing one tenancy agreement for a flat together. All of them are equal tenants and jointly liable for the whole rent.',
			],
			[
				'What is a Nebenmieter?',
				'It usually means a person named in the main tenancy alongside others, in other words a co-tenant. Some people also use the word for subtenants. What matters is who signed the contract with whom.',
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
				'§ 573c BGB, notice periods (in German)',
				'https://www.gesetze-im-internet.de/bgb/__573c.html',
			],
			BGB_EN,
		],
	},
	'moving-in-checklist': {
		link: 'Moving in',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Moving into a flat share in Germany: checklist | ManaWG',
		description:
			'Checklist for moving into a WG (shared flat) in Germany: contract, Anmeldung, keys, money, cleaning rota and getting to know your flatmates in the first weeks.',
		h1: 'Moving into a flat share in Germany: the checklist',
		intro:
			'Moving into a WG (shared flat) in Germany means more than carrying boxes: you also learn new habits. The points below are ordered by timing: before moving in, on move-in day, in the first week and in the first month. If you are setting up the flat share yourselves, the whole process from search to registration is in the [checklist for starting a flat share](/start-a-flat-share).',
		sections: [
			[
				'Before moving in: contract and paperwork',
				'Find out whether you get your own tenancy agreement with the landlord or a [sublease](/flat-share-tenancy-agreement) with a flatmate. Ask about the amount and repayment of the [Kaution (deposit)](/flat-share-deposit): it may be at most three months’ Kaltmiete (rent excluding utilities), and can be paid in three monthly instalments. Also ask whether the rent is quoted as Warmmiete (including heating and other utilities) or Kaltmiete (excluding them). Abbreviations such as WM and KM are explained in the [flat-share glossary](/german-flat-share-glossary). Have the rooms, cupboards and fridge shelves that are yours pointed out to you. Ask about the existing [house rules](/house-rules) on quiet, visitors and cleaning, and how costs are split.',
			],
			[
				'On move-in day',
				'Have the keys handed over and note how many there are. Look at the room together with the person handing over, and photograph any damage. That protects you when you move out. Ask about the wifi, the fuse box, the main water tap and where to keep bicycles. For your Anmeldung (address registration) in Germany at the Bürgeramt (citizens’ office), you need a Wohnungsgeberbestätigung (landlord’s confirmation of move-in), issued by the landlord or the main tenant. The registration is due within two weeks of moving in.',
			],
			[
				'In the first week',
				'Get to know your flatmates, ideally over a shared dinner. Have rubbish separation, collection days and washing machine times explained. Add yourself to the cleaning rota and ask how the rotation works. If there is none yet, the guide to [making a cleaning rota](/make-a-cleaning-rota) helps, and a [printable cleaning rota template](/cleaning-rota-template) gets you started. If the flat share uses [ManaWG as its flat-share app](/flat-share-app), you join with an invite link and immediately see the cleaning rota, shopping list, calendar and noticeboard.',
			],
			[
				'Settle the money from the start',
				'Ask who holds the electricity, internet and Rundfunkbeitrag (broadcasting fee) contracts and how you pay your share. The [Rundfunkbeitrag in a flat share](/rundfunkbeitrag-shared-flat) is due only once per flat, not from each person individually. Find out whether there is a shared [household kitty](/household-kitty), and whether existing items such as the washing machine or kitchen appliances should be bought out. In ManaWG, after joining you see the flat’s fixed costs, expenses and balances, and new expenses are shared with you from then on.',
			],
			[
				'Talk about how you live',
				'Raise early what matters to you: bedtimes, overnight guests, smoking, pets, noise, cooking together. Small differences are easy to settle when they come up early. Raising a problem only after three months is harder. What the flat share agrees can go on the noticeboard so it does not get lost in the group chat.',
			],
			[
				'What comes with you to the flat-share room',
				'Bedding, towels and your own toiletries\nPlate, cup and cutlery, if the kitchen is sparsely equipped\nExtension lead and multi-socket adaptor\nYour own labelled shelf for food\nPassport or ID and the landlord’s confirmation of move-in for the [Anmeldung](/anmeldung-shared-flat)',
			],
			[
				'After the first month',
				'Sit down together once and ask what is going well and what is not. Adjust the cleaning rota if tasks are unevenly spread. At the first settlement, check that the cost split works as you discussed.',
			],
		],
		faq: [
			[
				'What should you settle when moving into a flat share?',
				'Tenancy or sublease, deposit, how costs are split, cleaning rota, quiet hours and how to handle visitors. Plus the landlord’s confirmation of move-in (Wohnungsgeberbestätigung) for the Anmeldung.',
			],
			[
				'Does everyone in a flat share have to pay the Rundfunkbeitrag?',
				'No. The Rundfunkbeitrag is due once per flat. One person registers the flat, and the others share the cost internally.',
			],
			[
				'How do I join a flat in ManaWG?',
				'With the invite link a flatmate sends you, or the invitation they email you. Before that, you sign up with Google or with your email address.',
			],
		],
		sources: [
			[
				'§ 17 BMG, registration and deregistration (in German)',
				'https://www.gesetze-im-internet.de/bmg/__17.html',
			],
			[
				'§ 19 BMG, landlord’s confirmation of move-in (in German)',
				'https://www.gesetze-im-internet.de/bmg/__19.html',
			],
			[
				'§ 551 BGB, limits and investment of rental deposits (in German)',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			BGB_EN,
			BMG_EN,
		],
	},
	'anmeldung-shared-flat': {
		link: 'Registering your address (Anmeldung)',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Anmeldung in a flat share: deadline and form | ManaWG',
		description:
			'Register your address (Anmeldung) in a German flat share: the two-week deadline, who issues the landlord’s move-in confirmation and what to do if it is refused.',
		h1: 'Anmeldung in a flat share in Germany: landlord’s confirmation of move-in and deadline',
		intro:
			'If you move into a flat-share room in Germany, you have to register your address at the local citizens’ office (Bürgeramt). This is called the Anmeldung, and it needs a Wohnungsgeberbestätigung (landlord’s confirmation of move-in). Who issues it depends on your tenancy, and with subletting in particular, many main tenants do not know they are responsible. This page summarises the rules of the Bundesmeldegesetz (BMG, the Federal Registration Act) for people moving to Germany and is not legal advice. Details such as forms and appointments are set by your city.',
		sections: [
			[
				'Deadline: two weeks after moving in',
				'Anyone who moves into a flat has to register with the registration authority (Meldebehörde), usually the Bürgeramt, within two weeks of moving in. That includes a room in a flat share. Appointments are scarce in big cities, so book before the move; the deadline runs regardless. Many cities now also offer the registration online with an electronic ID card. If you are new to Germany, the registration certificate (Meldebescheinigung) matters beyond the law itself: banks, employers and authorities regularly ask for it, and the residence permit and your tax ID depend on it.',
			],
			[
				'Who issues the landlord’s confirmation of move-in?',
				'The Wohnungsgeber (the person who provides the housing) is whoever lets you the flat. If you have your own contract with the landlord or you are named in a joint main tenancy, that is the landlord or the property management. With [subletting](/flat-share-tenancy-agreement), the Hauptmieter (main tenant) is the Wohnungsgeber and has to issue the confirmation personally. They must confirm your move-in within the two weeks. If they refuse or the confirmation does not arrive in time, you tell the registration authority without delay.',
			],
			[
				'If the main tenant refuses the confirmation',
				'Under § 19 BMG, the Wohnungsgeber is obliged to cooperate in the registration. If they refuse or the confirmation does not arrive in time, you have to tell the registration authority without delay (§ 19 para. 2 BMG). A Wohnungsgeber who does not confirm a move-in, or confirms it incorrectly or late commits an administrative offence (Ordnungswidrigkeit) that can be fined up to €1,000 (§ 54 BMG). What to do: ask the main tenant in writing for the confirmation, so you can prove it. Set a short deadline that ends before the two weeks are up. If nothing comes, inform the registration authority and ask how to continue.',
			],
			[
				'Model: what the confirmation contains',
				'The confirmation contains the name and address of the Wohnungsgeber, the owner’s name if different, the move-in date, the address of the flat and the names of the people who must register (§ 19 para. 3 BMG). The table shows an example with invented details. Many cities have their own forms; the details are the same. The forms are usually in German, but the fields are few and the table below shows what each one means.',
			],
			[
				'Electronic confirmation',
				'The Wohnungsgeber can also confirm the move-in electronically to the registration authority (§ 19 para. 1 BMG). They then receive an assignment code (Zuordnungsmerkmal) that they pass on to the person registering, who quotes it at the Anmeldung (§ 19 para. 4 BMG). Ask your registration authority whether it offers this route.',
			],
			[
				'What to bring to the appointment',
				'Your ID card or passport, the landlord’s confirmation of move-in and the completed registration form, if your city requires one. If you are moving from abroad, you may need further documents depending on where you come from, such as a residence permit. The registration itself is usually free. Berlin’s official welcome guide also advises being wary of anyone selling appointments or certificates: they are not official.',
			],
			[
				'Main residence or second residence',
				'If you are still registered at your parents’ home, you have to state which residence is your main residence (Hauptwohnung). That is the one you mainly use, which for students is usually the flat share in the town where they study. Many cities charge a second-home tax (Zweitwohnungsteuer) on a secondary residence. Check that before you register the flat share as a secondary residence.',
			],
			[
				'When you do not need to register',
				'If you are already registered in Germany and stay for six months at most, you need neither to register nor to deregister for the new flat, for example during a [sublet](/subletting-a-room) for an internship. If you stay longer, you register within two weeks after the six months are up. If you otherwise live abroad, you have to register after only three months.',
			],
			[
				'Moving out: deregistering only in two cases',
				'If you move within Germany, you register at your new address and the old one is deregistered automatically. You only have to deregister if you move abroad or give up a secondary residence without taking a new one. You can deregister no earlier than one week before moving out and must do so within two weeks after. What else is on the list when you leave is in the [moving-out checklist](/moving-out-checklist).',
			],
			[
				'Fines',
				'Anyone who does not register, or registers late, commits an administrative offence that can be fined up to €1,000. The same applies to a Wohnungsgeber who does not issue the confirmation or issues it incorrectly. A confirmation as a favour for someone who is not actually moving in can cost up to €50,000.',
			],
			[
				'After the Anmeldung',
				'With the registration certificate you can switch your bank account, Rundfunkbeitrag (broadcasting fee) and contracts to the new address. A flat share pays the Rundfunkbeitrag only once; how to split it is covered in the guide to the [Rundfunkbeitrag in a flat share](/rundfunkbeitrag-shared-flat). If it is your first registration in Germany, your tax ID (Steuer-ID) is sent by post, so make sure your name is on the letterbox. What else matters in the first days is summarised in the [moving-in checklist](/moving-in-checklist).',
			],
		],
		tables: [
			{
				after: 'Model: what the confirmation contains',
				title: 'Example of a landlord’s confirmation of move-in (Wohnungsgeberbestätigung)',
				header: ['Field', 'Example'],
				rows: [
					[
						'Name and address of the Wohnungsgeber (landlord or main tenant)',
						'Erika Beispiel, Musterweg 1, 12345 Musterstadt',
					],
					['Name of the owner, if different', 'Max Muster'],
					['Move-in date', '1 November 2026'],
					['Address of the flat', 'Musterweg 1, 2nd floor left, 12345 Musterstadt'],
					['Names of the people who must register', 'Jonas Probe'],
				],
				note: 'Invented details for illustration. The form of your city is the one that counts.',
			},
		],
		faq: [
			[
				'Who issues the landlord’s confirmation of move-in in a flat share?',
				'With your own contract or a joint main tenancy, the landlord or property management. With subletting, the main tenant.',
			],
			[
				'What if the main tenant does not sign?',
				'Ask for the confirmation in writing and set a short deadline. If it does not arrive in time, tell the registration authority without delay.',
			],
			[
				'How long do I have to register at my flat share?',
				'Two weeks from moving in. If no appointment is free, book the next one available and keep the booking confirmation.',
			],
			[
				'Do I have to register for a flat-share room if I only stay a few months?',
				'Not if you are already registered in Germany and stay for six months at most. If you otherwise live abroad, you have to register after three months.',
			],
			[
				'What happens if I register late?',
				'It is an administrative offence. The fine can be up to €1,000, and the authority sets the amount in each case.',
			],
			[
				'Do I have to deregister when I leave the flat share?',
				'Only if you move abroad or give up a secondary residence. For a move within Germany, registering at the new address is enough.',
			],
		],
		sources: [
			[
				'§ 17 BMG, registration and deregistration (in German)',
				'https://www.gesetze-im-internet.de/bmg/__17.html',
			],
			[
				'§ 19 BMG, landlord’s confirmation of move-in (in German)',
				'https://www.gesetze-im-internet.de/bmg/__19.html',
			],
			[
				'§ 21 BMG, main and secondary residence (in German)',
				'https://www.gesetze-im-internet.de/bmg/__21.html',
			],
			[
				'§ 27 BMG, exemptions from the duty to register (in German)',
				'https://www.gesetze-im-internet.de/bmg/__27.html',
			],
			['§ 54 BMG, fines (in German)', 'https://www.gesetze-im-internet.de/bmg/__54.html'],
			BMG_EN,
			[
				'Anmeldung (residence registration), Berlin Welcome Centre',
				'https://willkommenszentrum.berlin.de/en/housing/anmeldung-residence-registration',
			],
		],
	},
	'asking-a-flatmate-to-leave': {
		link: 'Asking a flatmate to leave',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Asking a flatmate to leave in Germany | ManaWG',
		description:
			'Can you end a flatmate’s tenancy in Germany? What applies to subletting, joint tenancy and individual contracts, plus notice periods, written form and a model.',
		h1: 'Asking a flatmate to leave in Germany: what is possible under each contract',
		intro:
			'When living together stops working, the question comes quickly whether you can simply throw a flatmate out. In Germany the answer depends almost entirely on who has a contract with whom. Only someone who is the flatmate’s landlord can give notice (kündigen), nobody else. This page gives an overview under the Bürgerliches Gesetzbuch (BGB, the German Civil Code) and is not legal advice. For a specific case, a Mieterverein (tenants’ association) or a lawyer specialising in tenancy law can help.',
		sections: [
			[
				'First settle who has which contract',
				'In a WG (shared flat) there are three common set-ups: everyone is named in the joint main tenancy, one person is the Hauptmieter (main tenant) and sublets rooms (Untermiete), or each person has their own contract with the landlord. Only in the second case is a flatmate another flatmate’s landlord and able to give them notice. If you want to leave yourself, read [giving notice on a room](/give-notice-on-a-room). How the models differ otherwise is explained in the guide to the [flat-share tenancy agreement](/flat-share-tenancy-agreement).',
			],
			[
				'Subletting: the main tenant gives notice',
				'A subtenant has, in principle, the same protection against termination as any tenant. The main tenant then needs a legitimate interest, for example if the subtenant seriously breaches their obligations, and has to give at least three months’ notice. If the main tenant lives in the flat too, it gets easier. For a room furnished mostly by the main tenant, there is no protection against termination, and notice can be given up to the 15th of a month to take effect at the end of that month, unless the room is let on a lasting basis to a family or couple. If the room is let unfurnished, the main tenant may give notice without a reason, but the period is extended by three months. The letter must then say that the main tenant relies on this simplified termination.',
			],
			[
				'Joint main tenancy: you cannot throw someone out',
				'If everyone is on the tenancy agreement, everyone is an equal tenant. Nobody can give notice to anybody else, not even a majority of the flat share. The landlord can likewise only give notice to everyone together. A change works only if everyone agrees: the person moves out voluntarily, and the landlord and the remaining tenants agree to release them from the contract. If someone wants out and the others stand in the way, there may in individual cases be a claim that they cooperate in giving notice. That is disputed and a matter for advice.',
			],
			[
				'Individual contracts: only the landlord can give notice',
				'If each person has their own contract, the flatmates have no hold over each other. Only the landlord can give notice, and usually only for a legal reason. The exception is rooms in student and youth halls, where the protection of the legitimate-interest requirement does not apply (§ 549 para. 3 BGB). Immediate termination is possible, for example, if someone is two months’ rent in arrears or persistently disturbs the peace of the house. What you can do: write down incidents with dates and report them to the landlord in writing.',
			],
			[
				'Form and procedure of notice',
				'Notice on a home has to be in writing, meaning on paper with a handwritten signature. Email, messenger or a note without a signature are not enough. For the period to run, the notice has to be received. Hand it over in person with a witness, or send it by Einwurf-Einschreiben (registered post with proof of delivery to the letterbox). State the date the tenancy should end and, for subletting, the reason or the rule you rely on.',
			],
			[
				'What is not allowed',
				'Changing the lock, putting someone’s belongings outside the door or cutting off electricity and internet for a room is forbidden self-help (verbotene Eigenmacht) and can be a criminal offence, even if the notice is valid. If someone does not move out after the period ends, the only route is an eviction lawsuit (Räumungsklage) at the local court (Amtsgericht). If there is violence or threats, call the police. That is something different from a tenancy dispute.',
			],
			[
				'Model: notice to a subtenant',
				'Sender: name and address of the main tenant\nRecipient: name of the subtenant and address of the flat\nDate: place and day of the letter\nText: “I hereby give notice to terminate the sublease of the room … with effect from …” (a German-language letter is usual in Germany: „Hiermit kündige ich das Untermietverhältnis über das Zimmer … zum …“)\nBasis: reference to § 573a BGB or § 549 para. 2 no. 2 BGB, depending on the case\nSignature: handwritten\nWritten form: signed by hand, not by email or WhatsApp (§ 568 BGB).',
			],
			[
				'If the flatmate does not want to leave',
				'Talk to each other first, preferably about specific incidents rather than accusations, and write down what you agree.\nWith subletting, the main tenant gives notice under the rules above. If the person then does not move out, the only route is an eviction lawsuit at the local court.\nWith a joint main tenancy, only an agreement helps: the person moves out voluntarily, and the landlord and all the other tenants agree to release them from the contract (Aufhebungsvereinbarung, a termination agreement).\nTenants’ associations and lawyers specialising in tenancy law assess the individual case.',
			],
			[
				'Getting rid of a flatmate without a tenancy agreement',
				'What matters: does the person pay rent for the room or not?\nWith rent: a tenancy exists even without paper, with the landlord owing the use of the room and the tenant the agreed rent (§ 535 BGB). Notice is given in writing under the rules above, and the person stays until the period ends.\nLonger than a year: if a tenancy for longer than a year is not concluded in writing, it counts as open-ended (§ 550 BGB). It can then be ended at the earliest at the end of one year after the home was handed over.\nWithout rent: if the person pays nothing and gives nothing else in return, it is usually not a tenancy but an unpaid loan of the space (Leihe, § 598 BGB). If no duration was agreed and none follows from the purpose, you can ask for the room back at any time (§ 604 para. 3 BGB). Ask the person in writing to leave and set a reasonable deadline.\nGrey area: whether money for electricity or shopping already counts as rent, and who can demand the return under a joint main tenancy, depends on the case and is one for a tenants’ association.\nIf the person stays: in both cases the court is the only route. Changing the lock or putting belongings outside is forbidden self-help (§ 858 para. 1 BGB).',
			],
			[
				'Before it comes to that',
				'Most conflicts can be solved before anyone thinks of notice. Raise problems early and write down agreements, so not every topic is renegotiated. How that works is covered in [resolving flatmate conflicts](/flatmate-conflict). If it is about money, a shared overview helps, see [debts between flatmates](/flatmate-debts). If the move-out is settled, clarify the deposit and open amounts with the [moving-out checklist](/moving-out-checklist).',
			],
		],
		tables: [
			{
				after: 'intro',
				title: 'Asking a flatmate to leave: at a glance',
				header: ['Contract', 'Who can give notice', 'Period', 'Reason needed?'],
				rows: [
					[
						'Subletting, room furnished mostly by the main tenant in their own flat, tenant not living there with family or partner',
						'Main tenant',
						'up to the 15th for the end of the month (§ 573c para. 3 BGB)',
						'No (§ 549 para. 2 no. 2 BGB)',
					],
					[
						'Subletting, unfurnished room in the main tenant’s flat',
						'Main tenant',
						'three months longer than normal',
						'No (§ 573a BGB)',
					],
					[
						'Subletting, main tenant does not live there',
						'Main tenant',
						'at least three months',
						'Yes, legitimate interest',
					],
					[
						'Joint main tenancy',
						'No flatmate; the landlord only to everyone together',
						'not applicable, agreement only',
						'not applicable',
					],
					[
						'Individual contracts',
						'Only the landlord',
						'depends on the reason, immediate only for serious grounds',
						'Usually yes, a legal reason (not in student halls)',
					],
				],
			},
			{
				after: 'Getting rid of a flatmate without a tenancy agreement',
				title: 'Without a written contract: what applies',
				header: ['Situation', 'Legally', 'Ending it', 'If the person stays'],
				rows: [
					[
						'pays rent, nothing in writing',
						'oral tenancy (§ 535 BGB)',
						'written notice (§ 568 para. 1 BGB) with the periods above',
						'eviction lawsuit, no self-help',
					],
					[
						'contract for more than a year, oral only',
						'counts as open-ended (§ 550 BGB)',
						'notice at the earliest at the end of one year after handover',
						'eviction lawsuit, no self-help',
					],
					[
						'pays nothing, gives nothing in return',
						'usually an unpaid loan (§ 598 BGB)',
						'ask for the return if no duration was agreed (§ 604 para. 3 BGB)',
						'eviction lawsuit, no self-help (§ 858 para. 1 BGB)',
					],
				],
				note: 'Overview without guarantee for the individual case. In a dispute, a tenants’ association can help.',
			},
		],
		faq: [
			[
				'Can you throw a flatmate out of a flat share?',
				'Only if you are their landlord, so with subletting. If everyone is on the main tenancy or each person has their own contract, no flatmate can give notice to another.',
			],
			[
				'What notice period applies to a subtenant in a flat share?',
				'For a room furnished mostly by the main tenant in their own flat, where the tenant does not live permanently with family or partner, up to the 15th of a month to take effect at the end of that month (§ 573c para. 3 BGB). For an unfurnished room in their flat, three months longer than normal, without a reason. If the main tenant does not live there, they need a legitimate interest.',
			],
			[
				'Is notice by WhatsApp or email enough?',
				'No. Notice on a home needs written form, meaning a letter with a handwritten signature.',
			],
			[
				'Can I change the lock if my flatmate does not move out?',
				'No. That is forbidden self-help and can be a criminal offence. If someone does not move out despite valid notice, the only route is an eviction lawsuit.',
			],
			[
				'Can the majority of the flat share vote a flatmate out?',
				'Not legally. A vote does not replace notice. Only the contracting party can give it: the main tenant with subletting, otherwise the landlord.',
			],
			[
				'How do I get rid of a flatmate without a tenancy agreement?',
				'What matters is whether the person pays rent. If they do, there is an oral tenancy that you have to end in writing (§ 568 para. 1 BGB). If they pay nothing, you can usually ask for the room back at any time (§ 604 para. 3 BGB). If they still do not leave, only the court helps.',
			],
			[
				'Does a flatmate who is not on the tenancy agreement have to leave?',
				'Not automatically. If they pay rent to a flatmate, they are a subtenant with tenant rights, even without a written contract. If they pay nothing, they usually have to go when asked. You may never enforce this yourselves, for example with a new lock (§ 858 para. 1 BGB).',
			],
		],
		sources: [
			[
				'§ 549 BGB, exceptions to tenant protection (in German)',
				'https://www.gesetze-im-internet.de/bgb/__549.html',
			],
			[
				'§ 573a BGB, simplified termination (in German)',
				'https://www.gesetze-im-internet.de/bgb/__573a.html',
			],
			[
				'§ 573c BGB, notice periods (in German)',
				'https://www.gesetze-im-internet.de/bgb/__573c.html',
			],
			[
				'§ 568 BGB, written form of notice (in German)',
				'https://www.gesetze-im-internet.de/bgb/__568.html',
			],
			[
				'§ 535 BGB, content of the tenancy agreement (in German)',
				'https://www.gesetze-im-internet.de/bgb/__535.html',
			],
			[
				'§ 550 BGB, form of the tenancy agreement (in German)',
				'https://www.gesetze-im-internet.de/bgb/__550.html',
			],
			[
				'§ 543 BGB, termination without notice (in German)',
				'https://www.gesetze-im-internet.de/bgb/__543.html',
			],
			['§ 598 BGB, loan for use (in German)', 'https://www.gesetze-im-internet.de/bgb/__598.html'],
			[
				'§ 604 BGB, duty to return (in German)',
				'https://www.gesetze-im-internet.de/bgb/__604.html',
			],
			[
				'§ 858 BGB, forbidden self-help (in German)',
				'https://www.gesetze-im-internet.de/bgb/__858.html',
			],
			BGB_EN,
		],
	},
	'give-notice-on-a-room': {
		link: 'Give notice on a room',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Give notice on a flat-share room in Germany | ManaWG',
		description:
			'Giving notice on a WG room in Germany: notice period by contract type, dated examples, a model letter, a replacement tenant and a joint tenancy.',
		h1: 'Give notice on a flat-share room in Germany: periods and model letter',
		intro:
			'You want to move out of your WG (shared flat) and wonder when you must give notice and to whom. In Germany, that depends on who your contract is with and whether the room is furnished in the main tenant’s own flat. This page sets out the notice periods (Kündigungsfristen) under the Bürgerliches Gesetzbuch (BGB, the German Civil Code), dated examples and a model letter. It is an overview and not legal advice. For a specific case, a Mieterverein (tenants’ association) can help.',
		sections: [
			[
				'Look at the contract first',
				'In a flat share there are three common set-ups: everyone is named in the joint main tenancy, you live as a subtenant (Untermiete) with a Hauptmieter (main tenant), or you have your own contract with the landlord. With subletting, you give notice to the main tenant; with an individual contract, to the landlord. With a joint contract, you cannot give notice alone. The models are explained in the [flat-share tenancy agreement](/flat-share-tenancy-agreement). If there is no written contract, you still have one as soon as you live there for rent (§ 535 BGB). The same periods then apply.',
			],
			[
				'The normal period: just under three months',
				'For an open-ended contract, if your notice arrives by the third working day of a month at the latest, the tenancy ends at the end of the month after next (§ 573c para. 1 BGB). Give notice by the third working day in March, for example, and you are out at the end of May. For you as a tenant, the period stays the same however long you have lived there. It only gets longer for the landlord’s side. The contract may provide shorter periods in your favour, but not longer ones (§ 573c para. 4 BGB).',
			],
			[
				'Furnished room with the main tenant: by the 15th',
				'If the main tenant lives in the flat and has furnished your room for the most part, a short period applies: notice by the 15th of a month to take effect at the end of the same month (§ 573c para. 3 BGB). That does not apply if you live there permanently with family or a partner (§ 549 para. 2 no. 2 BGB). The short period applies to both sides. The main tenant can then give you notice the same way, more on that in [asking a flatmate to leave](/asking-a-flatmate-to-leave).',
			],
			[
				'Joint main tenancy: you cannot do it alone',
				'If everyone is on the contract, only the whole flat share together can give notice. Notice from you alone is invalid. If you want out and the others stay, you need an agreement with the landlord and all co-tenants that you are released from the contract. Usually someone new joins the contract for that. Raise it early, because until you agree, you remain liable for the whole rent.',
			],
			[
				'Fixed term, no-notice clause and special termination',
				'If the contract has a fixed term or notice is excluded for a certain time, it usually ends only on the agreed date. Whether such a clause is valid is for advice to clarify. There is one way out: if the landlord refuses you permission to sublet the room, you may give extraordinary notice with the statutory period, unless there is an important reason relating to the subtenant that speaks against it (§ 540 para. 1 BGB). If you are away for only a few months, you can [sublet the room](/subletting-a-room) instead of giving notice.',
			],
			[
				'Replacement tenant: no right, but often the fastest way',
				'There is no general right to leave the contract early by finding a replacement tenant (Nachmieter). If the contract has a replacement-tenant clause, it applies. In practice, landlords and main tenants often agree if you bring a suitable person. Help the flat share with [advertising and choosing](/find-a-flatmate), ideally with a joint [WG-Casting](/wg-casting-questions) (an informal interview with applicants). Put any agreement on an earlier move-out in writing.',
			],
			[
				'What the notice must look like',
				'Notice on a home has to be in writing, meaning on paper with a handwritten signature (§ 568 para. 1 BGB). Email, messenger or a photo of the letter are not enough. The period only starts once the notice is received. Hand it over in person in front of a witness, or send it by Einwurf-Einschreiben (registered post with proof of delivery to the letterbox), and allow a few days of buffer before the third working day or the 15th. As a tenant, you do not have to give a reason.',
			],
			[
				'Model: notice on a flat-share room',
				'Sender: your name and your address in the flat share\nRecipient: the main tenant if you sublet, otherwise the landlord, with address\nDate: place and day of the letter\nSubject: notice of the tenancy for the room in the flat at …\nText: “I hereby give notice to terminate the tenancy of the room … with effect from …, or failing that, on the next permissible date.”\nRequest: confirmation of the notice, a date for the handover and repayment of the deposit to the account …\nSignature: handwritten, from everyone named in the contract if there are several\nLanguage: towards German landlords and main tenants, a German letter is usual and avoids misunderstandings. You can use this text as a guide and ask a German speaker to check it. A German version of the key sentence: „Hiermit kündige ich das Mietverhältnis über das Zimmer … fristgerecht zum …, hilfsweise zum nächstmöglichen Termin.“',
			],
			[
				'After giving notice',
				'Tell your flatmates as soon as the notice is out, even if you formally have time. Settle open amounts before you move out. In the [shared expenses](/shared-expenses) in ManaWG you see your balance and the suggested transfers. If the [Rundfunkbeitrag](/rundfunkbeitrag-shared-flat) (broadcasting fee) is in your name, someone has to take it over. At your new address you register (Anmeldung) within two weeks, see [Anmeldung in a flat share](/anmeldung-shared-flat). Handover, [deposit](/flat-share-deposit) and all further points are in the [moving-out checklist](/moving-out-checklist).',
			],
		],
		tables: [
			{
				after: 'intro',
				title: 'Giving notice on a flat-share room: periods at a glance',
				header: ['Contract', 'Your period', 'Note'],
				rows: [
					[
						'Subletting or individual contract, open-ended',
						'received by the third working day of a month, ends at the end of the month after next',
						'§ 573c para. 1 BGB, regardless of how long you have lived there',
					],
					[
						'Furnished room in the flat where the main tenant lives',
						'by the 15th of a month for the end of the month',
						'§ 573c para. 3 BGB, not if you live there permanently with family or partner',
					],
					[
						'Joint main tenancy',
						'no notice possible alone',
						'only everyone together, or release from the contract by agreement',
					],
					[
						'Fixed-term contract or notice excluded',
						'usually only on the agreed date',
						'special termination if permission to sublet is refused without good reason (§ 540 BGB)',
					],
				],
			},
			{
				after: 'Furnished room with the main tenant: by the 15th',
				title: 'Examples: when does the contract end?',
				header: ['Notice arrives', 'Open-ended, normal period', 'Furnished, with the main tenant'],
				rows: [
					['on the second working day in March', '31 May', '31 March'],
					['on 10 March', '30 June', '31 March'],
					['on 20 March', '30 June', '30 April'],
				],
				note: 'What counts is the day the notice is received, not the day you send it.',
			},
		],
		faq: [
			[
				'How long is the notice period for a flat-share room?',
				'For an open-ended contract, just under three months: notice by the third working day of a month, to take effect at the end of the month after next. For a furnished room in the flat where the main tenant lives, by the 15th of a month for the end of that month.',
			],
			[
				'Can I give notice alone on a joint flat-share contract?',
				'No. Only all tenants together can give notice on the joint contract. Anyone who wants out alone needs an agreement with the landlord and the co-tenants.',
			],
			[
				'Do I have to find a replacement tenant to leave earlier?',
				'Without a replacement-tenant clause in the contract, you have no right to leave earlier with a replacement tenant. Many landlords and main tenants agree, though, if you bring a suitable person.',
			],
			[
				'Can I give notice on my flat-share room by email or WhatsApp?',
				'No. Notice on a home needs written form, meaning a letter with a handwritten signature that reaches the recipient.',
			],
			[
				'Does the notice period apply without a written tenancy agreement?',
				'Yes. If you live in a room for rent, you have a tenancy even without paper, and the statutory periods apply.',
			],
		],
		sources: [
			[
				'§ 573c BGB, notice periods (in German)',
				'https://www.gesetze-im-internet.de/bgb/__573c.html',
			],
			[
				'§ 549 BGB, exceptions to tenant protection (in German)',
				'https://www.gesetze-im-internet.de/bgb/__549.html',
			],
			[
				'§ 568 BGB, written form of notice (in German)',
				'https://www.gesetze-im-internet.de/bgb/__568.html',
			],
			[
				'§ 540 BGB, letting to third parties (in German)',
				'https://www.gesetze-im-internet.de/bgb/__540.html',
			],
			[
				'§ 535 BGB, content of the tenancy agreement (in German)',
				'https://www.gesetze-im-internet.de/bgb/__535.html',
			],
			BGB_EN,
		],
	},
	'moving-out-checklist': {
		link: 'Moving out',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Moving out of a flat share in Germany: checklist | ManaWG',
		description:
			'Checklist for leaving a WG (shared flat) in Germany: notice, replacement tenant, deposit, open costs, Rundfunkbeitrag, registration and handover.',
		h1: 'Moving out of a flat share in Germany: the checklist',
		intro:
			'Leaving a WG (shared flat) in Germany involves more than packing boxes: notice, a successor for the room, the deposit, open amounts and contracts in your name. If you tackle the points early, you leave without unpaid bills and without arguments.',
		sections: [
			[
				'Notice and deadlines',
				'Check your [contract](/flat-share-tenancy-agreement) first. For an open-ended tenancy, the notice period (Kündigungsfrist) for tenants is usually three months. For a furnished room in the main tenant’s flat, shorter periods can apply. Examples with dates and a model letter are in [giving notice on a room](/give-notice-on-a-room). Give notice in writing and tell the flat share as early as possible, even if formally you still have time. The others need weeks to find someone.',
			],
			[
				'Finding a replacement tenant',
				'Often the flat share looks for a successor together with you. Whether the new person takes over your contract or gets their own is for the landlord or the Hauptmieter (main tenant) to decide. There is no general right to leave the contract earlier through a replacement tenant (Nachmieter), but many landlords agree. Help with the [advert and the casting](/find-a-flatmate), because you know the room best.',
			],
			[
				'Money: open amounts and the deposit',
				'Settle all open amounts before you leave, while everyone is still reachable. In the [ManaWG shared expenses](/shared-expenses) you see your balance and the suggested transfers. When the balance is at zero, everything is done. Also clarify what happens to shared purchases: does the vacuum cleaner stay in the flat, and do the others pay your share? You get the [Kaution (deposit)](/flat-share-deposit) back from the landlord or the main tenant. The check can take a few months, especially if the annual utilities statement (Nebenkostenabrechnung, see [utilities in a flat share](/utilities-and-internet)) is still to come.',
			],
			[
				'Contracts and authorities',
				'If the internet contract, the electricity contract or the [Rundfunkbeitrag](/rundfunkbeitrag-shared-flat) (broadcasting fee) is in your name, someone from the flat share has to take over or the contract has to be changed. Agree that early. In Germany you register at your new address within two weeks ([Anmeldung](/anmeldung-shared-flat)). You only need to deregister yourself if you move abroad or do not take a new home in Germany. Also think of a mail redirection (Nachsendeauftrag) with the postal service.',
			],
			[
				'Subletting instead of moving out',
				'If you are only away for a semester abroad or an internship, you do not have to move out. With the permission of the landlord or main tenant, you can [sublet the room](/subletting-a-room) for that time. Agree in writing beforehand the period, rent, utilities and what happens to your furniture. For the flat share’s accounts, the subtenant counts as a flatmate during this time.',
			],
			[
				'Handover',
				'Clear the room and your shelves in the kitchen and bathroom completely. Repaint the room if the contract requires it. Do a handover with photos and return all keys. Do your last round on the cleaning rota before you go. In ManaWG, you leave the flat yourself at the end under Settings → Access → Leave flat.',
			],
			[
				'The checklist to tick off',
				'1. Check the contract and give notice in writing in time\n2. Tell the flat share early and help look for a replacement tenant\n3. Switch electricity, internet and Rundfunkbeitrag if they are in your name\n4. Settle open amounts until the balance is at zero\n5. Split shared purchases or have them paid out\n6. Agree what happens with the next utilities statement\n7. Clear the room, hand over with photos, return the keys\n8. Register at your new address within two weeks, set up mail redirection',
			],
		],
		faq: [
			[
				'What notice period applies when leaving a flat share?',
				'For an open-ended tenancy, usually three months. For a furnished room in the main tenant’s flat, shorter periods can apply. Your contract is what counts.',
			],
			[
				'Do I have to provide a replacement tenant for my flat-share room?',
				'There is no general duty, and without an agreement no right to leave the contract earlier that way. In practice, though, the flat share usually searches together.',
			],
			[
				'What happens to open flat costs when I move out?',
				'Open amounts should be settled before you move out. An app like ManaWG shows your balance and suggests the transfers needed.',
			],
			[
				'When do I get my deposit back after moving out?',
				'After a reasonable review period, which often takes a few months. If a utilities statement is still outstanding, a reasonable part may be kept until then.',
			],
		],
		sources: [
			[
				'§ 573c BGB, notice periods (in German)',
				'https://www.gesetze-im-internet.de/bgb/__573c.html',
			],
			[
				'§ 551 BGB, limits and investment of rental deposits (in German)',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			[
				'§ 17 BMG, registration and deregistration (in German)',
				'https://www.gesetze-im-internet.de/bmg/__17.html',
			],
			BGB_EN,
			BMG_EN,
		],
	},
};
