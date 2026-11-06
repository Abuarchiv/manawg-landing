// English page on the open-source side of ManaWG and self-hosting. German counterpart: ../de/open-source.ts.
// Facts come from the app repository (README.md, docs/self-hosting.md); links are prefix-free.
import type { Topic } from '../types.ts';

export const OPEN_SOURCE_EN: Record<string, Topic> = {
	'open-source-flat-share-app': {
		link: 'Open-source flat-share app',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Open-source flat-share app you can self-host | ManaWG',
		description:
			'ManaWG is an open-source flat-share app under Apache-2.0: use it free at app.manawg.com or self-host it with Docker. A Splitwise alternative with no ads.',
		h1: 'An open-source app for shared flats: use it free or host it yourself',
		intro:
			'Most flats want to split bills and share the cleaning, not run a server. ManaWG is built for both. The code is open source under the Apache License 2.0, the hosted app at app.manawg.com is free and ad-free, and anyone who wants the data on their own machine can run a copy with Docker Compose. It works as a Splitwise alternative for flatmates and roommates in Germany, in English and German, in euros.',
		sources: [
			['ManaWG app repository (GitHub)', 'https://github.com/Abuarchiv/manawg'],
			[
				'Apache License 2.0, licence file of the app',
				'https://github.com/Abuarchiv/manawg/blob/main/LICENSE',
			],
			['ManaWG website repository (GitHub)', 'https://github.com/Abuarchiv/manawg-landing'],
			[
				'Self-hosting guide (GitHub)',
				'https://github.com/Abuarchiv/manawg/blob/main/docs/self-hosting.md',
			],
		],
		sections: [
			[
				'Why open source matters for a flat app',
				'A flat app knows who lives where, what the rent is and who owes whom. Open source means you can read how it works instead of taking it on trust. It also limits lock-in: any member can export the flat’s data as JSON or CSV, and the code stays available for anyone to run. ManaWG shows no ads and has no paid tier, so a flat gets the whole app either way. What the hosted app stores and where is set out in the privacy policy, which the code does not replace.',
			],
			[
				'What is open',
				'The app, including the Docker setup and the documentation, is in the repository Abuarchiv/manawg on GitHub. This website with its guides is in a second repository, Abuarchiv/manawg-landing. Both are licensed under the Apache License 2.0, which lets you use, change and share the code. The website’s licence does not grant rights to the name ManaWG or its logo, so a fork that publishes its own site uses its own name. The app is built with Next.js, React and TypeScript on PostgreSQL, with Supabase Auth and Storage. Questions, bug reports and pull requests are welcome on GitHub.',
			],
			[
				'Use it free at app.manawg.com',
				'For most flats this is the right choice. Open app.manawg.com, create a flat and share the invite link. There is nothing to install or run, every feature is open to every flat, and the database is hosted in the EU, in Frankfurt am Main. What the app does is described on [Flat-share app](/flat-share-app).',
			],
			[
				'Host it yourself: what you need',
				'Self-hosting is for when you want the data on a machine you control. You need Docker with Compose v2, git and openssl. A running instance uses about 500 MB of memory, and building the app image needs about 3 GB once. The stack that starts is the app, PostgreSQL, sign-in, image storage and a Caddy gateway, all from one compose file.',
			],
			[
				'Host it yourself: the steps',
				'1. Clone the repository with git clone https://github.com/Abuarchiv/manawg.git and go into the manawg folder.\n2. Run ./docker/setup.sh. It creates a .env file with fresh secrets.\n3. Run docker compose up -d. The first start builds the app image from your checkout, which takes about ten minutes, and sets up the database.\n4. Open http://localhost and create an account. Every email, including the sign-in code, lands in Mailpit at http://localhost:8025.\n5. Check with docker compose ps -a that the setup service has exited with code 0 and the others are running.',
			],
			[
				'An instance for more than your own flat',
				'For an instance that people reach over the internet you need a server with Docker, a domain whose DNS record points at it and ports 80 and 443 open. The gateway then fetches a Let’s Encrypt certificate. Sign-in needs email, so an SMTP account is required, and many providers have a free tier that is enough for a household. Registration is open to anyone who can reach the address, so for a household-only instance restrict access at a proxy, for example with a VPN. If you offer an instance to people outside your household, you need your own legal notice and privacy policy. Backups and updates are yours too: the repository has backup and restore scripts, and an update is a git pull followed by docker compose up -d --build, after a backup. The full guide on GitHub covers all of this, plus a second route with Vercel and Supabase on their free tiers.',
			],
			[
				'Moving from Splitwise or Splid',
				'If your flat already uses Splitwise or Splid, you do not start from nothing. Export the expenses as a CSV file, check the preview and undo the import if something is wrong, as set out in [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). The import is part of the app, so it works the same on a self-hosted copy. Only euro amounts are imported. How ManaWG compares is on [Splitwise alternative](/splitwise-alternative), and what the free Splitwise version allows per day is in [Splitwise’s free limit](/splitwise-free-limit). Other open-source apps you can self-host are set beside ManaWG in [Open-source Splitwise alternatives](/open-source-splitwise-alternatives).',
			],
			[
				'Limits',
				'ManaWG works in euros only, with no exchange rates.\nA flat holds at most 20 active members.\nThere is no bank connection: you make transfers yourselves and mark them as paid.\nIt is a web app you add to the home screen, not an app in a store.\nSelf-hosted: sign-in needs an SMTP account, and Google sign-in and push notifications stay off until you set up your own keys.\nSelf-hosted: dates, reminders and month boundaries follow Berlin time, whatever time zone the server uses, and this is not configurable.\nSelf-hosted: updates, backups, legal pages and support are your job. Questions go to GitHub Discussions.',
			],
		],
		faq: [
			[
				'Is ManaWG really open source?',
				'Yes. The app is licensed under the Apache License 2.0, and the source code is on GitHub in the repository Abuarchiv/manawg. This website has its own repository, Abuarchiv/manawg-landing, under the same licence.',
			],
			[
				'Do I have to self-host ManaWG?',
				'No. app.manawg.com is free, has no ads and needs no setup. Self-hosting is for flats or groups that want the data on a machine they control.',
			],
			[
				'What do I need to self-host ManaWG?',
				'Docker with Compose v2, git and openssl, about 500 MB of memory for the running instance and about 3 GB once to build the image. For a public instance you also need a domain and an SMTP account for the sign-in emails.',
			],
			[
				'Can I move my Splitwise data over?',
				'If your expenses exist as a CSV file, yes: the import shows a preview first and can be undone. Only euro amounts are imported. The steps are in [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid).',
			],
		],
	},
	'open-source-splitwise-alternatives': {
		link: 'Open-source Splitwise alternatives',
		updated: '2026-11-06',
		published: '2026-11-06',
		title: 'Open-source Splitwise alternatives you can self-host | ManaWG',
		description:
			'ManaWG, Spliit, SplitPro, Cospend, IHateMoney and Abrechnung side by side: licence, self-hosting, stack, phone use, import, and which one fits whom.',
		h1: 'Open-source Splitwise alternatives you can host yourself',
		intro:
			'Six open-source projects can replace Splitwise on a server you control: ManaWG, Spliit, SplitPro, Cospend, IHateMoney and Abrechnung. This page sets them side by side, taken from each project’s README as of 6 November 2026, and says which one fits which group. ManaWG is our own app, so read the comparison with that in mind: it is the youngest of the six, it has the smallest community, and it is built for one flat rather than for trips.',
		sources: [
			['ManaWG (GitHub)', 'https://github.com/Abuarchiv/manawg'],
			[
				'ManaWG: self-hosting guide (GitHub)',
				'https://github.com/Abuarchiv/manawg/blob/main/docs/self-hosting.md',
			],
			['Spliit (GitHub)', 'https://github.com/spliit-app/spliit'],
			['SplitPro (GitHub)', 'https://github.com/oss-apps/split-pro'],
			[
				'SplitPro: Docker guide (GitHub)',
				'https://github.com/oss-apps/split-pro/blob/main/docker/README.md',
			],
			['Cospend for Nextcloud (GitHub)', 'https://github.com/julien-nc/cospend-nc'],
			['IHateMoney (GitHub)', 'https://github.com/spiral-project/ihatemoney'],
			[
				'IHateMoney: installation (GitHub)',
				'https://github.com/spiral-project/ihatemoney/blob/main/docs/installation.md',
			],
			[
				'IHateMoney: changelog (GitHub)',
				'https://github.com/spiral-project/ihatemoney/blob/main/CHANGELOG.md',
			],
			['Abrechnung (GitHub)', 'https://github.com/SFTtech/abrechnung'],
			[
				'Abrechnung: installation (GitHub)',
				'https://github.com/SFTtech/abrechnung/blob/master/docs/usage/installation.md',
			],
		],
		tables: [
			{
				after: 'intro',
				title: 'Licence and stack of the six projects',
				header: ['Project', 'Licence', 'Stack'],
				rows: [
					['ManaWG', 'Apache-2.0', 'Next.js, React, PostgreSQL, Supabase Auth'],
					['Spliit', 'MIT', 'Next.js, Prisma, PostgreSQL'],
					['SplitPro', 'MIT', 'Next.js, tRPC, Prisma, PostgreSQL'],
					['Cospend', 'AGPL-3.0', 'PHP and Vue, as a Nextcloud app'],
					['IHateMoney', 'BSD “beerware” derivative', 'Python/Flask; SQLite, PostgreSQL, MariaDB'],
					['Abrechnung', 'AGPL-3.0 or later', 'Python/FastAPI, React, PostgreSQL'],
				],
				note: 'As of 6 November 2026, from the READMEs. From the repositories’ package files: Next.js, Prisma and tRPC for Spliit and SplitPro, Vue for Cospend, Flask for IHateMoney. Cospend’s licence is in the GitHub licence field and the app manifest, not in the README.',
			},
			{
				after: 'Self-hosting and phone use',
				title: 'Ways to self-host and phone support',
				header: ['Project', 'Self-hosting', 'Phone'],
				rows: [
					['ManaWG', 'Docker Compose, or Vercel and Supabase', 'Installable PWA, offline, push'],
					['Spliit', 'Docker image with PostgreSQL, or Vercel', 'PWA'],
					['SplitPro', 'Docker Compose, Proxmox script', 'PWA, push needs extra setup'],
					['Cospend', 'App inside your own Nextcloud', 'Web UI; Android client, iOS in progress'],
					['IHateMoney', 'Docker, pip or a cloud provider', 'Same web interface on mobile'],
					['Abrechnung', 'Docker Compose, Debian or Ubuntu package', 'Installable PWA'],
				],
				note: 'As of 6 November 2026. The self-hosting column lists the ways named in each project’s README and installation guide, not every way that could work.',
			},
			{
				after: 'Focus and import',
				title: 'Focus and import from other apps',
				header: ['Project', 'Focus', 'Import'],
				rows: [
					[
						'ManaWG',
						'One flat: money, rota, shopping, calendar, chat',
						'Splitwise or Splid CSV, screenshot',
					],
					[
						'Spliit',
						'Free open-source alternative to Splitwise: groups shared with friends',
						'None (Splitwise import listed as possible)',
					],
					[
						'SplitPro',
						'Expenses with friends and in groups',
						'Splitwise friends and groups, not expenses yet',
					],
					[
						'Cospend',
						'Shared budgets for houses, trips, groups',
						'CSV, also from IHateMoney and Splitwise',
					],
					[
						'IHateMoney',
						'Simple shared budget, guests need no account',
						'JSON and CSV (CSV in Cospend format)',
					],
					['Abrechnung', 'Groups and events, uneven shares, roles', 'Groups as JSON, CSV export'],
				],
				note: 'As of 6 November 2026, from the READMEs and, for IHateMoney, the changelog. Which files each app really reads is best checked with a test file.',
			},
		],
		sections: [
			[
				'How this comparison was made',
				'On 6 November 2026 we read the README of each project on GitHub and took every cell of the tables from it. Where the README is silent, we looked at the project’s documentation, changelog or package file; the note under each table says which. Star counts, version numbers and similar figures are left out on purpose because they change daily. This is not a ranking: the projects have different aims. We did not install or test the other five, so the tables say what the projects state about themselves, not how well it works. Check the linked pages before you decide, they change.',
			],
			[
				'Self-hosting and phone use',
				'Five of the six run from a Docker image or a Compose file. Cospend is the exception: it is an app inside a Nextcloud you already run. IHateMoney also installs with pip, and Abrechnung comes as a Debian package. Four can be installed as a PWA on the home screen (ManaWG, Spliit, SplitPro, Abrechnung). IHateMoney and Cospend are web apps, and the Cospend README lists Android clients. Spliit, SplitPro and IHateMoney also name a hosted instance in their README that you can try, and Abrechnung names a demo instance.',
			],
			[
				'Focus and import',
				'The projects come in two kinds. Spliit, SplitPro, Cospend, IHateMoney and Abrechnung split expenses for groups of any sort: friends, trips, households. ManaWG is built for one shared flat and adds a cleaning rota, shopping list, calendar and chat; none of that appears in the READMEs of the other five. When you move from Splitwise, import counts: ManaWG reads Splitwise and Splid CSV files and screenshots, Cospend reads CSV from Splitwise and IHateMoney, IHateMoney reads JSON and CSV in the Cospend format, Abrechnung reads JSON of its own groups, and SplitPro brings over friends and groups from Splitwise but not the expenses yet. Spliit lists a Splitwise import as a possible future feature.',
			],
			[
				'What ManaWG is and what it is not',
				'Built for one flat of up to 20 members: expenses, cleaning rota, shopping list, calendar, chat and pinboard in one app.\nAmounts are in euros, with no currency conversion.\nManaWG moves no money: you pay each other yourselves and mark the transfer as paid in the app.\nThere is no split by days, only equal or custom amounts. For bills by days there is the [calculator](/split-bill-by-days-calculator).\nThe youngest of the six with the smallest community: fewer people to ask, and less time in everyday use than the others.\nNo ads and no paid tier; the hosted app keeps its data in the EU.',
			],
			[
				'Try ManaWG or run your own',
				'The [demo](/demo) shows the real app on sample data, no account needed.\nThe source code is in the [repository Abuarchiv/manawg](https://github.com/Abuarchiv/manawg).\nThe self-hosting steps are in [docs/self-hosting.md](https://github.com/Abuarchiv/manawg/blob/main/docs/self-hosting.md). A summary is on [Open-source flat-share app](/open-source-flat-share-app).',
			],
			[
				'Which one for whom',
				'A flat that wants money, cleaning rota, shopping and chat in one phone app: ManaWG. The price is the small community and the short history. For trips, offices or groups of more than 20 people ManaWG is the wrong choice, and the others fit better.\nFriends on a trip: Spliit if you want the simplest tool (create a group, add expenses, see balances, split unevenly, install as a PWA). Abrechnung or SplitPro if you pay in several currencies, since both name currency conversion.\nA Splitwise replacement for single friends and for groups: SplitPro. Its README names expenses with individual friends and in groups, splits by percentage or shares, recurring expenses and optional bank imports.\nYou already run Nextcloud: Cospend. No extra server, plus CSV import from Splitwise and IHateMoney.\nThe smallest thing that works: IHateMoney. Invited people need no account. Its README describes the project as heading towards maintenance mode since 2024, so new features are rare.\nBookkeeping for events with roles: Abrechnung. Its README lists viewer, editor and owner roles, events with different participants each day, tags and charts. Going by the README, it is the closest of the six to splitting a bill by days.',
			],
			[
				'What the tables leave out',
				'We did not test the other five projects. The tables say nothing about security, support, how often they are updated, or whether the German translation is complete; all five manage translations on Weblate or Crowdin. Look at recent changes and open issues yourself before you put your flat’s money on a server. We did not compare hosted prices or terms.',
			],
		],
		faq: [
			[
				'Which open-source Splitwise alternative is the best?',
				'None for everyone. For trips and groups of friends Spliit, SplitPro and Abrechnung are the obvious ones, for Nextcloud users Cospend, for the smallest possible tool IHateMoney. ManaWG is meant for a shared flat, with a cleaning rota, shopping list and chat. The sections above give the reasons.',
			],
			[
				'Can I bring my Splitwise data over?',
				'ManaWG reads Splitwise and Splid CSV files and screenshots, see [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). Cospend reads CSV from Splitwise, SplitPro brings over friends and groups but not the expenses yet. For Spliit the import is only a possible feature in the README.',
			],
			[
				'Do I have to host ManaWG myself?',
				'No. app.manawg.com is free and ad-free. Self-hosting is for anyone who wants the data on their own machine; the steps are on [Open-source flat-share app](/open-source-flat-share-app).',
			],
			[
				'Is this comparison independent?',
				'No, it comes from ManaWG. The statements about the other projects come from their READMEs as of 6 November 2026, and the sources are listed below. Where something is not backed, it is not in the tables.',
			],
		],
	},
};
