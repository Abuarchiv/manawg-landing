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
				'1. Clone the repository with git clone https://github.com/Abuarchiv/manawg.git and go into the manawg folder.\n2. Run ./docker/setup.sh. It creates a .env file with fresh secrets.\n3. Run docker compose up -d. The first start builds the app image from your checkout, which takes about ten minutes, and sets up the database.\n4. Open http://localhost and create an account. Every email, including the sign-in code, lands in Mailpit at http://localhost:8025.\n5. Check with docker compose ps that the setup service has exited with code 0 and the others are running.',
			],
			[
				'An instance for more than your own flat',
				'For an instance that people reach over the internet you need a server with Docker, a domain whose DNS record points at it and ports 80 and 443 open. The gateway then fetches a Let’s Encrypt certificate. Sign-in needs email, so an SMTP account is required, and many providers have a free tier that is enough for a household. Registration is open to anyone who can reach the address, so for a household-only instance restrict access at a proxy, for example with a VPN. If you offer an instance to people outside your household, you need your own legal notice and privacy policy. Backups and updates are yours too: the repository has backup and restore scripts, and an update is a git pull followed by docker compose up -d --build, after a backup. The full guide on GitHub covers all of this, plus a second route with Vercel and Supabase on their free tiers.',
			],
			[
				'Moving from Splitwise or Splid',
				'If your flat already uses Splitwise or Splid, you do not start from nothing. Export the expenses as a CSV file, check the preview and undo the import if something is wrong, as set out in [Switch from Splitwise or Splid](/switch-from-splitwise-or-splid). The import is part of the app, so it works the same on a self-hosted copy. Only euro amounts are imported. How ManaWG compares is on [Splitwise alternative](/splitwise-alternative), and what the free Splitwise version allows per day is in [Splitwise’s free limit](/splitwise-free-limit).',
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
};
