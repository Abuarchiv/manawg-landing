import type { Topic } from '../types.ts';
import { BGB_EN } from './guides-moving.ts';

// English counterparts of ../de/new-guides.ts: the flat-share deposit and the glossary of WG ads.
// German law is cited with its German sources; only the German text is binding.

export const GUIDES_EN_NEW: Record<string, Topic> = {
	'flat-share-deposit': {
		link: 'Flat-share deposit',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Flat-share deposit in Germany: amount, return | ManaWG',
		description:
			'The Kaution (deposit) in a WG in Germany: at most three months’ Kaltmiete, three instalments, who pays and holds it, moving out and how long repayment can take.',
		h1: 'The deposit in a German flat share: amount, instalments, moving out and repayment',
		intro:
			'The Kaution (deposit) is often the largest sum you pay in one go when moving into a WG (shared flat). Where it goes and who pays it back depends on how your [tenancy agreement](/flat-share-tenancy-agreement) is set up, and that regularly raises questions when a flatmate leaves. This page summarises the rules of § 551 BGB and common practice and is not legal advice. For a dispute, a Mieterverein (tenants’ association) can help.',
		sections: [
			[
				'Amount: at most three months’ Kaltmiete',
				'The deposit may be at most three times the monthly rent, not counting utilities that are shown as a flat rate or as an advance payment (§ 551 para. 1 BGB). This means three months’ Kaltmiete (rent excluding utilities). With a Kaltmiete of €1,200 for the whole flat, that is at most €3,600, or, with a joint main tenancy and four people, €900 per person. With individual tenancy agreements the limit applies to each contract, and with subletting to the sublease. An agreement for a higher amount is void to the tenant’s disadvantage (§ 551 para. 4 BGB). If you paid too much, you can claim the excess back.',
			],
			[
				'Three instalments instead of everything at once',
				'For a cash deposit you may pay in three equal monthly instalments. The first is due at the start of the tenancy, the other two with the next two rent payments (§ 551 para. 2 BGB). So the deposit only falls due when the tenancy is meant to begin as agreed, not at a viewing or before a contract is signed. If someone asks you to transfer money earlier, be wary: the Verbraucherzentrale (consumer advice centre) lists advance payment and a deposit before the contract as a known scam.',
			],
			[
				'Where the deposit is kept',
				'The landlord has to invest the money separately from their own assets with a bank, at the rate usual for savings accounts with three months’ notice. Another form of investment can be agreed, but it must also be separate from the landlord’s assets. The interest belongs to the tenant and increases the deposit (§ 551 para. 3 BGB). The duty to keep it separate is meant to protect your money if the landlord becomes insolvent, but only if the landlord actually complied. You can ask for proof of where it is held.',
			],
			[
				'Who pays and who holds the deposit?',
				'That depends on the tenancy model. With subletting, you pay the deposit to the main tenant, not to the landlord. With individual agreements, each person pays their own deposit to the landlord. With a joint main tenancy, one deposit for the whole contract sits with the landlord, and you agree among yourselves who paid which share. The table shows the four common cases. The three tenancy models themselves are explained in [flat-share tenancy agreement](/flat-share-tenancy-agreement).',
			],
			[
				'Moving out and a successor',
				'When someone leaves, it again depends on the contract. With subletting, only the sublease ends, the main tenant’s own deposit with the landlord is not affected, and you claim your deposit back from the main tenant. With individual agreements, you get it back from the landlord, who usually asks the successor for a new deposit. With a joint main tenancy, the contract continues with the others and the deposit stays with the landlord. The person leaving then usually has no claim against the landlord. Most often the successor pays their share straight to them. This changes nothing as far as the landlord is concerned, so put it in writing. Leaving a joint contract generally needs the landlord’s consent. Everything else that comes up when leaving is in the [moving-out checklist](/moving-out-checklist) and under [giving notice on a room](/give-notice-on-a-room).',
			],
			[
				'Repayment: how long can it take?',
				'There is no fixed legal deadline. The landlord gets a reasonable period to check whether any claims remain. The Deutscher Mieterbund (German tenants’ association) names two or three months for simple cases, and in an individual case more than six months can be reasonable, for example while a utilities statement for the current year is still outstanding. The often-quoted three to six months is a rule of thumb, not an upper limit. Repayment falls due once that period has passed and the landlord has no remaining claims (BGH, judgment of 20 July 2016, case no. VIII ZR 263/14). With a sublease the main tenant is the landlord of that sublease, so the same rules apply by analogy.',
			],
			[
				'Deductions and damage',
				'The landlord may only keep amounts for claims that can really be due, such as damage or a utilities back payment. If only the utilities statement is outstanding, they may hold back a generously calculated part and must pay out the rest. Claims for changes or deterioration of the rented property expire six months after the keys are returned (§ 548 para. 1 BGB). In 2024 the Federal Court of Justice ruled that a landlord may still offset even time-barred damage claims against the deposit as long as the deposit has not been settled (case no. VIII ZR 184/23). A handover record at move-in and move-out therefore helps to avoid disputes.',
			],
			[
				'Alternatives: guarantee or deposit insurance',
				'Instead of cash there is the Kautionsbürgschaft (deposit guarantee) or the Mietkautionsversicherung (deposit insurance). This is a voluntary arrangement: the landlord does not have to accept it, and the contract has to allow this form. The security as a whole must not exceed the limit of three months’ Kaltmiete. Read the terms carefully beforehand, above all whether there are costs and who pays in the worst case. Only take out a policy once the landlord has agreed. We do not recommend any provider.',
			],
			[
				'Handover record and proof',
				'At move-in, record the condition of the room and the shared rooms in a handover record with photos and meter readings, and have both sides sign it. Also write down who paid which amount to whom and when, preferably by bank transfer rather than in cash. Keep the tenancy agreement, the handover record and the proof of the deposit; the Verbraucherzentrale advises keeping them for three years after moving out. The claim for repayment expires after three years, counted from the end of the year in which it arose (§§ 195, 199 BGB).',
			],
			[
				'What ManaWG can and cannot do',
				'ManaWG has no feature of its own for the deposit, but it helps elsewhere. Set up the Kaltmiete and utilities as separate fixed costs in [shared expenses](/shared-expenses), and you can always see which Kaltmiete the deposit is based on. If one person advances the deposit for others, you can enter the amount as a one-off expense and pick only the people involved. The balance then shows who owes whom. ManaWG works in euros only. Write down the agreement on who paid which share outside the app.',
			],
		],
		tables: [
			{
				after: 'Who pays and who holds the deposit?',
				title: 'The deposit by type of tenancy',
				header: ['Tenancy model', 'Deposit goes to', 'When someone moves out'],
				rows: [
					[
						'Main tenant with subtenants',
						'the main tenant',
						'subtenant claims it back from the main tenant after a reasonable checking period',
					],
					[
						'Individual agreements',
						'the landlord, per person',
						'landlord repays it after the checking period, the successor usually pays a new one',
					],
					[
						'Joint main tenancy',
						'the landlord, for the whole contract',
						'stays with the landlord, the share is settled inside the flat share or with the successor',
					],
					[
						'Successor takes over the contract',
						'stays with the landlord',
						'the person leaving gets the amount from the successor',
					],
				],
				note: 'Orientation, not legal advice. In an individual case, what the contract says counts.',
			},
		],
		faq: [
			[
				'How high can the deposit be in a flat share?',
				'At most three months’ Kaltmiete, not counting utilities shown as a flat rate or advance payment (§ 551 BGB). With individual agreements the limit applies to each contract, and with subletting to the sublease.',
			],
			[
				'Do I have to pay the deposit all at once?',
				'No. You may pay it in three equal monthly instalments. The first is due at the start of the tenancy, the other two with the following rent payments.',
			],
			[
				'Who gets the deposit back when I move out of a flat share?',
				'With subletting, the main tenant repays it, and with individual agreements the landlord. With a joint main tenancy the deposit stays with the landlord, and the successor usually pays your share straight to you.',
			],
			[
				'How long can a landlord keep the deposit?',
				'There is no fixed deadline, only a reasonable checking period. The Mieterbund names two or three months for simple cases and sometimes more than six. The landlord may only keep amounts for claims they concretely expect.',
			],
			[
				'May I pay the deposit before signing the contract?',
				'The Verbraucherzentrale advises against it. The first instalment only falls due when the tenancy starts. A payment before the contract or a viewing is a typical sign of a scam.',
			],
		],
		sources: [
			[
				'§ 551 BGB, limits and investment of rental deposits (in German)',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			[
				'§ 548 BGB, limitation of the landlord’s claims (in German)',
				'https://www.gesetze-im-internet.de/bgb/__548.html',
			],
			[
				'Deutscher Mieterbund, the tenant’s claim to repayment of the deposit (PDF, in German)',
				'https://mieterbund.de/app/uploads/2025/02/5-Beate-Flatow-Der-Anspruch-des-Mieters-auf-Rueckgewaehr-der-Kaution.pdf',
			],
			[
				'Deutscher Mieterbund, BGH on offsetting time-barred damage claims against the deposit (in German)',
				'https://mieterbund.de/aktuelles/meldungen/bgh/bundesgerichtshof-erleichtert-aufrechnung-von-verjaehrten-schadensersatzforderungen-mit-kautionsguthaben/',
			],
			[
				'Verbraucherzentrale, tenancy agreement and deposit (in German)',
				'https://www.verbraucherzentrale.de/laura-zieht-aus/mietvertrag',
			],
			[
				'Verbraucherzentrale, how long to keep documents (in German)',
				'https://www.verbraucherzentrale.de/wissen/digitale-welt/datenschutz/aufbewahrungspflichten-welche-unterlagen-muss-ich-wie-lange-behalten-84296',
			],
			[
				'Verbraucherzentrale, fake flats on the internet (in German)',
				'https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/abzocke/fakewohnungen-im-internet-so-erkennen-sie-falsche-immobilienanzeigen-27576',
			],
			[
				'Juraforum, must a landlord accept deposit insurance? (in German)',
				'https://www.juraforum.de/news/muss-der-vermieter-eine-mietkautionsversicherung-akzeptieren_248119',
			],
			BGB_EN,
		],
	},
	'german-flat-share-glossary': {
		link: 'Flat-share glossary',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'German flat-share glossary: WG ad terms | ManaWG',
		description:
			'German flat-share glossary: WG ads and terms explained, from NK, KM and WM to ZW, EG and OG, with notes from practice and links to the matching guides.',
		h1: 'German flat-share glossary: WG ads and terms explained',
		intro:
			'WG (shared flat) ads in Germany say a lot in shorthand: “14 m², möbl., 420 € WM inkl. NK, ab sofort”. If you are new to Germany or looking for your first room, it is easy to guess wrong. This page explains the most common terms in three tables and points to the matching guides. Abbreviations are not standardised, and not every ad means the same. When in doubt, ask before you say yes. This page is not legal advice.',
		sections: [
			[
				'Rent and costs',
				'What matters is what the rent includes and what comes on top. KM is the Kaltmiete (rent excluding utilities), WM the Warmmiete (rent including heating and other utilities), and NK, BK and HK are Nebenkosten, Betriebskosten and Heizkosten (utilities, running costs and heating). Which items sit inside the WM is explained in [utilities and internet](/utilities-and-internet), and the broadcasting fee is covered in [Rundfunkbeitrag in a shared flat](/rundfunkbeitrag-shared-flat). The rules on the deposit are in [the flat-share deposit](/flat-share-deposit).',
			],
			[
				'Flat and room',
				'These terms describe how the flat is laid out and what is in the room. Floors are counted differently from what many internationals expect: the Erdgeschoss (EG) is the ground floor, and the 1. OG is the floor above it, which Britons call the first floor.',
			],
			[
				'Contract and moving in',
				'These terms cover the contract, moving in and getting to know each other. Which type of contract fits you is explained in [flat-share tenancy agreement](/flat-share-tenancy-agreement), and temporary letting is described in [subletting a room](/subletting-a-room). For registering at the Bürgeramt (citizens’ office) there is the guide [Anmeldung in a shared flat](/anmeldung-shared-flat), and questions for the first meeting are collected in [WG casting questions](/wg-casting-questions).',
			],
			[
				'A sample ad decoded',
				'“3-Zi-WG, 14 m², möbl., 420 € WM inkl. NK und Internet, Kaution 2 KM, ab 01.12. frei, befristet bis 31.03., Anmeldung möglich” means: a flat with three rooms, in which a furnished room of 14 m² is becoming free. The Warmmiete of €420 includes utilities and internet. The deposit is two months’ Kaltmiete, which is below the limit of three. You can move in from 1 December, the contract ends on 31 March, and you can register at the address. The ad is made up.',
			],
			[
				'Questions to ask before you say yes',
				'1. Which type of contract applies: main tenancy, sublease or individual agreement?\n2. What is included in the Warmmiete, and what comes on top?\n3. How high is the deposit, and who gets it?\n4. Is there a fixed term, and what does the contract say about the end date?\n5. Is registration possible, and who issues the Wohnungsgeberbestätigung (landlord’s confirmation of move-in)?\n6. What comes with the room, and is there an inventory list?\n7. Do I have to pay anything to the previous tenant, and for exactly what?',
			],
		],
		tables: [
			{
				after: 'Rent and costs',
				title: 'Rent and costs: abbreviations in WG ads',
				header: ['Term', 'Meaning', 'Note'],
				rows: [
					[
						'KM',
						'Kaltmiete, rent excluding utilities and heating',
						'The basis of the deposit, at most three months’ Kaltmiete',
					],
					[
						'WM',
						'Warmmiete, rent including heating and running costs',
						'The total you pay monthly. WM can also mean washing machine, the context shows which',
					],
					[
						'NK',
						'Nebenkosten (utilities), such as water, waste and cleaning, in some ads also heating',
						'Ask whether they are advance payments with a statement or a flat rate',
					],
					[
						'BK',
						'Betriebskosten (running costs), legally almost the same as NK',
						'Unclear in ads, ask what is included',
					],
					[
						'HK',
						'Heizkosten (heating costs)',
						'Sometimes listed separately: KM + NK + HK gives the total rent if the NK do not include heating',
					],
					[
						'inkl. / zzgl.',
						'inclusive (is included) / plus (comes on top)',
						'“zzgl. NK” means utilities are still added',
					],
					[
						'Kaution (KT)',
						'The deposit you hand over at the start',
						'At most three months’ Kaltmiete, payable in three instalments',
					],
					[
						'Ablöse',
						'Payment to the previous tenant for furniture, kitchen or fittings',
						'Buying furnishings is possible, but the price must not be clearly out of proportion to their value (otherwise void to that extent, § 4a para. 2 WoVermRG). A payment only for the previous tenant leaving is void (para. 1), though proven moving costs may be reimbursed',
					],
					[
						'Rundfunkbeitrag (formerly GEZ)',
						'Compulsory broadcasting fee',
						'It is charged per flat, not per person. One person registers, the flat share splits it',
					],
				],
				note: 'As of 29 October 2026. Abbreviations are not standardised, the meaning can vary from ad to ad.',
			},
			{
				after: 'Flat and room',
				title: 'Flat and room: abbreviations in WG ads',
				header: ['Term', 'Meaning', 'Note'],
				rows: [
					[
						'WG',
						'Wohngemeinschaft, several people share a flat',
						'Always ask which type of contract applies',
					],
					[
						'Zi. / 3-Zi-WG',
						'Zimmer (room) / flat with three rooms',
						'Kitchen and bathroom are not counted. Ask whether the living room is',
					],
					[
						'qm / m²',
						'square metres',
						'In a flat share usually the size of the room, and the rent often follows it',
					],
					[
						'EG / OG / DG',
						'ground floor / upper floor / attic floor',
						'1. OG is the floor above the ground floor. The DG can get hot in summer. Ask about a lift',
					],
					[
						'möbl. / teilmöbl.',
						'furnished / partly furnished',
						'Record the inventory in the contract or on a handover list',
					],
					[
						'EBK',
						'Einbauküche, fitted kitchen',
						'Ask what in the kitchen belongs to the flat and what to individual flatmates',
					],
					[
						'Zweck-WG',
						'a flat share where people mainly live together to save costs',
						'Little shared daily life. Settle expectations about cleaning and meals first',
					],
				],
				note: 'As of 29 October 2026. Abbreviations are not standardised, the meaning can vary from ad to ad.',
			},
			{
				after: 'Contract and moving in',
				title: 'Contract and moving in: terms in WG ads',
				header: ['Term', 'Meaning', 'Note'],
				rows: [
					[
						'Hauptmieter / Untermieter',
						'The main tenant has the contract with the landlord, the subtenant rents from them',
						'Subletting needs the landlord’s permission',
					],
					[
						'Zwischenmiete (ZW)',
						'temporary sublet while the main tenant is away',
						'ZW is not standardised and often stands for Zwischenmiete. Ask',
					],
					[
						'befristet / unbefristet',
						'with an end date / open-ended',
						'A fixed term for housing usually needs a legal reason, and for subletting it depends on the case',
					],
					[
						'ab sofort',
						'available from now',
						'Still check the viewing, the start date and the previous tenant’s notice period',
					],
					[
						'NM',
						'Nachmieter, the person taking over a running contract or a room',
						'Clarify whether you join the contract or sign a new one',
					],
					[
						'Anmeldung möglich',
						'You can register officially at the address',
						'Due two weeks after moving in. Never offer or accept a sham registration',
					],
					[
						'Wohnungsgeberbestätigung',
						'Form confirming that you moved in',
						'Needed for the Anmeldung. With a sublease, the main tenant issues it',
					],
					[
						'WBS',
						'Wohnberechtigungsschein, proof for subsidised flats',
						'Rare in WG ads. Limits and levels change, ask your city',
					],
					[
						'WG-Casting',
						'Meeting where applicants introduce themselves to the flat share',
						'Bring a list of questions. Pay nothing before the contract and a viewing',
					],
				],
				note: 'As of 29 October 2026. Abbreviations are not standardised, the meaning can vary from ad to ad.',
			},
		],
		faq: [
			[
				'What does NK mean in a WG ad?',
				'NK stands for Nebenkosten (utilities), items such as water, waste and cleaning, in some ads also heating. Ask whether they are advance payments with a statement or a flat rate.',
			],
			[
				'What is the difference between KM and WM?',
				'KM is the Kaltmiete, excluding utilities and heating, and WM the Warmmiete, including heating and running costs. The deposit is based on the Kaltmiete.',
			],
			[
				'What does ZW mean for flat-share rooms?',
				'ZW is not standardised, but in ads it often stands for Zwischenmiete. That is a temporary sublet, for example during a semester abroad. Ask what is meant.',
			],
			[
				'What is a WG casting?',
				'A meeting where a flat share meets applicants who answered an ad. Before it, ask about the type of contract, the deposit and the Warmmiete.',
			],
		],
		sources: [
			[
				'Hamburg Welcome Center, abbreviations in housing ads (PDF, in German)',
				'https://welcome.hamburg.de/resource/blob/1056182/fcfffaa0bb0b35d7b539efb84532bb2e/abkuerzungen-in-wohnungsanzeigen-data.pdf',
			],
			[
				'Heidelberg University, encyclopaedia of flat hunting',
				'https://www.uni-heidelberg.de/en/study/international-studies/study-in-heidelberg/living-and-accomodation/encyclopaedia-of-flat-hunting',
			],
			[
				'FU Berlin, FAQ about WGs',
				'https://www.fu-berlin.de/en/sites/principles-cultural-dynamics/FAQs/FUB/WG.html',
			],
			[
				'§ 551 BGB, limits and investment of rental deposits (in German)',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			[
				'§ 575 BGB, fixed-term tenancy (in German)',
				'https://www.gesetze-im-internet.de/bgb/__575.html',
			],
			[
				'§ 4a WoVermRG, void agreements (in German)',
				'https://www.gesetze-im-internet.de/wovermrg/__4a.html',
			],
			['§ 17 BMG, registration (in German)', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
			[
				'Rundfunkbeitrag, information for citizens (in German)',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/informationen',
			],
			BGB_EN,
		],
	},
};
