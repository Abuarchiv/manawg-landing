// German open-source and self-hosting page. English counterpart: ../en/open-source.ts.
// Facts come from the app repository (README.md, docs/self-hosting.md).
import type { Topic } from '../types.ts';

export const OPEN_SOURCE_DE: Record<string, Topic> = {
	'open-source-wg-app': {
		link: 'Open-Source-WG-App',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'Open-Source-WG-App zum Selbsthosten | ManaWG',
		description:
			'ManaWG ist eine Open-Source-WG-App unter Apache-2.0: kostenlos unter app.manawg.com nutzen oder per Docker selbst hosten. Splitwise-Alternative ohne Werbung.',
		h1: 'Eine Open-Source-App für WGs: kostenlos nutzen oder selbst hosten',
		intro:
			'Die meisten WGs wollen Ausgaben teilen und den Putzplan organisieren, keinen Server betreiben. ManaWG ist für beides gebaut. Der Code ist Open Source unter der Apache-Lizenz 2.0, die gehostete App unter app.manawg.com ist kostenlos und werbefrei, und wer die Daten auf einer eigenen Maschine haben will, startet eine Kopie mit Docker Compose. ManaWG ist eine Splitwise-Alternative für Mitbewohner, auf Deutsch und Englisch und in Euro.',
		sources: [
			['ManaWG-App-Repository (GitHub)', 'https://github.com/Abuarchiv/manawg'],
			[
				'Apache-Lizenz 2.0, Lizenzdatei der App',
				'https://github.com/Abuarchiv/manawg/blob/main/LICENSE',
			],
			['ManaWG-Website-Repository (GitHub)', 'https://github.com/Abuarchiv/manawg-landing'],
			[
				'Self-Hosting-Anleitung (GitHub, Englisch)',
				'https://github.com/Abuarchiv/manawg/blob/main/docs/self-hosting.md',
			],
		],
		sections: [
			[
				'Warum Open Source bei einer WG-App wichtig ist',
				'Eine WG-App weiß, wer wo wohnt, wie hoch die Miete ist und wer wem Geld schuldet. Open Source heißt, dass ihr nachlesen könnt, wie sie funktioniert, statt es nur zu glauben. Außerdem bindet es weniger: Jedes Mitglied kann die Daten der WG als JSON oder CSV exportieren, und der Code bleibt für alle zum Ausführen verfügbar. ManaWG zeigt keine Werbung und kennt keine Bezahlstufe, die WG bekommt also in jedem Fall die ganze App. Was die gehostete App speichert und wo, steht in der Datenschutzerklärung, die der Code nicht ersetzt.',
			],
			[
				'Was offen ist',
				'Die App samt Docker-Setup und Dokumentation liegt im Repository Abuarchiv/manawg auf GitHub. Diese Website mit den Ratgebern liegt in einem zweiten Repository, Abuarchiv/manawg-landing. Beide stehen unter der Apache-Lizenz 2.0, die erlaubt, den Code zu nutzen, zu ändern und weiterzugeben. Die Lizenz der Website gewährt keine Rechte am Namen ManaWG oder am Logo, ein Fork mit eigener Website nutzt also einen eigenen Namen. Die App ist mit Next.js, React und TypeScript auf PostgreSQL gebaut, mit Supabase Auth und Storage. Fragen, Fehlerberichte und Pull Requests sind auf GitHub willkommen.',
			],
			[
				'Kostenlos nutzen unter app.manawg.com',
				'Für die meisten WGs ist das der richtige Weg. Öffnet app.manawg.com, legt eine WG an und teilt den Einladungslink. Es gibt nichts zu installieren oder zu betreiben, alle Funktionen stehen jeder WG offen, und die Datenbank liegt in der EU, in Frankfurt am Main. Was die App kann, beschreibt die Seite [WG-App](/wg-app).',
			],
			[
				'Selbst hosten: was ihr braucht',
				'Selbst hosten lohnt sich, wenn ihr die Daten auf einer Maschine unter eigener Kontrolle haben wollt. Ihr braucht Docker mit Compose v2, git und openssl. Eine laufende Instanz belegt etwa 500 MB Arbeitsspeicher, das Bauen des App-Images einmalig etwa 3 GB. Gestartet werden App, PostgreSQL, Anmeldung, Bildspeicher und ein Caddy-Gateway, alles aus einer Compose-Datei.',
			],
			[
				'Selbst hosten: die Schritte',
				'1. Das Repository mit git clone https://github.com/Abuarchiv/manawg.git klonen und in den Ordner manawg wechseln.\n2. ./docker/setup.sh ausführen. Das Skript legt eine .env-Datei mit frischen Geheimnissen an.\n3. docker compose up -d ausführen. Beim ersten Start wird das App-Image aus eurem Checkout gebaut, das dauert etwa zehn Minuten, und die Datenbank wird eingerichtet.\n4. http://localhost öffnen und ein Konto anlegen. Jede Mail, auch der Anmeldecode, landet in Mailpit unter http://localhost:8025.\n5. Mit docker compose ps -a prüfen, dass der Dienst setup mit Code 0 beendet ist und die übrigen laufen.',
			],
			[
				'Eine Instanz für mehr als die eigene WG',
				'Für eine Instanz, die Menschen über das Internet erreichen, braucht ihr einen Server mit Docker, eine Domain, deren DNS-Eintrag auf ihn zeigt, und offene Ports 80 und 443. Das Gateway holt sich dann ein Let’s-Encrypt-Zertifikat. Die Anmeldung braucht E-Mail, deshalb ist ein SMTP-Konto Pflicht; viele Anbieter haben ein kostenloses Kontingent, das für einen Haushalt reicht. Die Registrierung steht jedem offen, der die Adresse erreicht. Für eine reine Haushalts-Instanz beschränkt ihr den Zugriff deshalb an einem Proxy, etwa per VPN. Wer eine Instanz auch Menschen außerhalb des eigenen Haushalts anbietet, braucht ein eigenes Impressum und eine eigene Datenschutzerklärung. Auch Backups und Updates liegen bei euch: Das Repository enthält Skripte zum Sichern und Wiederherstellen, ein Update ist nach einem Backup ein git pull und danach docker compose up -d --build. Die vollständige Anleitung auf GitHub deckt das alles ab, dazu einen zweiten Weg mit Vercel und Supabase in deren kostenlosen Tarifen.',
			],
			[
				'Von Splitwise oder Splid umziehen',
				'Wenn eure WG schon Splitwise oder Splid nutzt, fangt ihr nicht bei null an. Exportiert die Ausgaben als CSV-Datei, prüft die Vorschau und macht den Import rückgängig, falls etwas nicht stimmt, so wie es [Von Splitwise oder Splid wechseln](/splitwise-splid-wechseln) beschreibt. Der Import ist Teil der App und funktioniert deshalb auf einer selbst gehosteten Kopie genauso. Übernommen werden nur Eurobeträge. Wie ManaWG im Vergleich abschneidet, steht unter [Splitwise-Alternative](/splitwise-alternative), und was die kostenlose Splitwise-Version pro Tag erlaubt, unter [Splitwise kostenlos](/splitwise-kostenlos). Andere quelloffene Apps zum Selbsthosten stellt [Open-Source-Splitwise-Alternativen](/open-source-splitwise-alternativen) daneben.',
			],
			[
				'Grenzen',
				'ManaWG rechnet nur in Euro, ohne Wechselkurse.\nEine WG fasst höchstens 20 aktive Mitglieder.\nEine Bankanbindung gibt es nicht: Ihr überweist selbst und markiert Beträge als bezahlt.\nEs ist eine Web-App, die ihr auf den Home-Bildschirm legt, keine App aus einem Store.\nSelbst gehostet: Die Anmeldung braucht ein SMTP-Konto, und Google-Anmeldung und Push-Meldungen bleiben aus, bis ihr eigene Schlüssel einrichtet.\nSelbst gehostet: Datum, Erinnerungen und Monatsgrenzen folgen der Berliner Zeit, egal in welcher Zeitzone der Server läuft; das lässt sich nicht einstellen.\nSelbst gehostet: Updates, Backups, Rechtstexte und Support liegen bei euch. Fragen gehen an die GitHub Discussions.',
			],
		],
		faq: [
			[
				'Ist ManaWG wirklich Open Source?',
				'Ja. Die App steht unter der Apache-Lizenz 2.0, der Quellcode liegt auf GitHub im Repository Abuarchiv/manawg. Diese Website hat ein eigenes Repository, Abuarchiv/manawg-landing, unter derselben Lizenz.',
			],
			[
				'Muss ich ManaWG selbst hosten?',
				'Nein. app.manawg.com ist kostenlos, werbefrei und braucht keine Einrichtung. Selbst hosten ist für WGs oder Gruppen gedacht, die die Daten auf einer Maschine unter eigener Kontrolle haben wollen.',
			],
			[
				'Was brauche ich zum Selbsthosten von ManaWG?',
				'Docker mit Compose v2, git und openssl, etwa 500 MB Arbeitsspeicher für die laufende Instanz und einmalig etwa 3 GB zum Bauen des Images. Für eine öffentliche Instanz kommen eine Domain und ein SMTP-Konto für die Anmelde-Mails dazu.',
			],
			[
				'Kann ich meine Splitwise-Daten übernehmen?',
				'Falls eure Ausgaben als CSV-Datei vorliegen, ja: Der Import zeigt vorher eine Vorschau und lässt sich rückgängig machen. Übernommen werden nur Eurobeträge. Die Schritte stehen unter [Von Splitwise oder Splid wechseln](/splitwise-splid-wechseln).',
			],
		],
	},
	'open-source-splitwise-alternativen': {
		link: 'Open-Source-Splitwise-Alternativen',
		updated: '2026-11-06',
		published: '2026-11-06',
		title: 'Open-Source-Splitwise-Alternativen zum Selbsthosten | ManaWG',
		description:
			'ManaWG, Spliit, SplitPro, Cospend, IHateMoney und Abrechnung im Vergleich: Lizenz, Selbst-Hosting, Technik, Handy, Import und welche App zu wem passt.',
		h1: 'Open-Source-Alternativen zu Splitwise zum Selbsthosten',
		intro:
			'Sechs Open-Source-Projekte können Splitwise auf einem Server ersetzen, den ihr selbst kontrolliert: ManaWG, Spliit, SplitPro, Cospend, IHateMoney und Abrechnung. Diese Seite stellt sie nebeneinander, nach der README jedes Projekts mit Stand 6. November 2026, und sagt, welches zu welcher Gruppe passt. ManaWG ist unsere eigene App, lest den Vergleich also mit diesem Wissen: Sie ist die jüngste der sechs, hat die kleinste Community und ist für eine WG gebaut, nicht für Reisen.',
		sources: [
			['ManaWG (GitHub)', 'https://github.com/Abuarchiv/manawg'],
			[
				'ManaWG: Self-Hosting-Anleitung (GitHub, Englisch)',
				'https://github.com/Abuarchiv/manawg/blob/main/docs/self-hosting.md',
			],
			['Spliit (GitHub)', 'https://github.com/spliit-app/spliit'],
			['SplitPro (GitHub)', 'https://github.com/oss-apps/split-pro'],
			[
				'SplitPro: Docker-Anleitung (GitHub)',
				'https://github.com/oss-apps/split-pro/blob/main/docker/README.md',
			],
			['Cospend für Nextcloud (GitHub)', 'https://github.com/julien-nc/cospend-nc'],
			['IHateMoney (GitHub)', 'https://github.com/spiral-project/ihatemoney'],
			[
				'IHateMoney: Installation (GitHub)',
				'https://github.com/spiral-project/ihatemoney/blob/main/docs/installation.md',
			],
			[
				'IHateMoney: Changelog (GitHub)',
				'https://github.com/spiral-project/ihatemoney/blob/main/CHANGELOG.md',
			],
			['Abrechnung (GitHub)', 'https://github.com/SFTtech/abrechnung'],
			[
				'Abrechnung: Installation (GitHub)',
				'https://github.com/SFTtech/abrechnung/blob/master/docs/usage/installation.md',
			],
		],
		tables: [
			{
				after: 'intro',
				title: 'Lizenz und Technik der sechs Projekte',
				header: ['Projekt', 'Lizenz', 'Technik'],
				rows: [
					['ManaWG', 'Apache-2.0', 'Next.js, React, PostgreSQL, Supabase Auth'],
					['Spliit', 'MIT', 'Next.js, Prisma, PostgreSQL'],
					['SplitPro', 'MIT', 'Next.js, tRPC, Prisma, PostgreSQL'],
					['Cospend', 'AGPL-3.0', 'PHP und Vue, als Nextcloud-App'],
					['IHateMoney', 'BSD-Variante („Beerware“)', 'Python/Flask; SQLite, PostgreSQL, MariaDB'],
					['Abrechnung', 'AGPL-3.0 oder neuer', 'Python/FastAPI, React, PostgreSQL'],
				],
				note: 'Stand 6. November 2026, nach den READMEs. Aus den Paketdateien der Repositories: Next.js, Prisma, tRPC bei Spliit und SplitPro, Vue bei Cospend, Flask bei IHateMoney. Die Lizenz von Cospend steht im GitHub-Lizenzfeld und im App-Manifest, nicht in der README.',
			},
			{
				after: 'Selbst hosten und Handy',
				title: 'Wege zum Selbsthosten und Handy-Unterstützung',
				header: ['Projekt', 'Selbst hosten', 'Handy'],
				rows: [
					[
						'ManaWG',
						'Docker Compose, oder Vercel und Supabase',
						'Installierbare PWA, offline, Push',
					],
					['Spliit', 'Docker-Image mit PostgreSQL, oder Vercel', 'PWA'],
					[
						'SplitPro',
						'Docker Compose, Proxmox-Skript',
						'PWA, Push braucht zusätzliche Einrichtung',
					],
					[
						'Cospend',
						'App in der eigenen Nextcloud',
						'Weboberfläche; Android-Client, iOS in Arbeit',
					],
					['IHateMoney', 'Docker, pip oder Cloud-Anbieter', 'Dieselbe Weboberfläche auf dem Handy'],
					['Abrechnung', 'Docker Compose, Debian- oder Ubuntu-Paket', 'Installierbare PWA'],
				],
				note: 'Stand 6. November 2026. Die Spalte „Selbst hosten“ nennt die Wege aus README und Installationsanleitung des jeweiligen Projekts, nicht alle denkbaren.',
			},
			{
				after: 'Schwerpunkt und Import',
				title: 'Schwerpunkt und Import aus anderen Apps',
				header: ['Projekt', 'Schwerpunkt', 'Import'],
				rows: [
					[
						'ManaWG',
						'Eine WG: Geld, Putzplan, Einkauf, Kalender, Chat',
						'Splitwise- und Splid-CSV, Screenshot',
					],
					[
						'Spliit',
						'Freie Open-Source-Alternative zu Splitwise: Gruppen mit Freunden teilen',
						'Keiner (Splitwise-Import nur als möglich gelistet)',
					],
					[
						'SplitPro',
						'Ausgaben mit Freunden und in Gruppen',
						'Splitwise-Freunde und -Gruppen, noch keine Ausgaben',
					],
					[
						'Cospend',
						'Gemeinsame Budgets für Haus, Reise, Gruppe',
						'CSV, auch von IHateMoney und Splitwise',
					],
					[
						'IHateMoney',
						'Einfaches Gruppenbudget, Gäste ohne Konto',
						'JSON und CSV (CSV im Cospend-Format)',
					],
					[
						'Abrechnung',
						'Gruppen und Events, ungleiche Anteile, Rollen',
						'Gruppen als JSON, CSV-Export',
					],
				],
				note: 'Stand 6. November 2026, nach den READMEs und, für IHateMoney, dem Changelog. Welche Dateien jede App genau liest, prüft ihr am besten mit einer Testdatei.',
			},
		],
		sections: [
			[
				'So ist der Vergleich entstanden',
				'Wir haben am 6. November 2026 die README jedes Projekts auf GitHub gelesen und jede Zelle der Tabellen daraus genommen. Wo die README schweigt, haben wir die Dokumentation, den Changelog oder die Paketdatei des Projekts angesehen; die Anmerkung unter jeder Tabelle sagt, welche. Sternezahlen, Versionsnummern und ähnliche Zahlen fehlen mit Absicht, weil sie sich täglich ändern. Eine Rangliste ist das nicht: Die Projekte haben verschiedene Ziele. Die fünf anderen haben wir nicht installiert oder getestet, die Tabellen geben also wieder, was die Projekte über sich sagen, nicht wie gut es funktioniert. Prüft vor der Entscheidung die verlinkten Seiten, sie ändern sich.',
			],
			[
				'Selbst hosten und Handy',
				'Fünf der sechs laufen als Docker-Image oder mit einer Compose-Datei. Cospend ist die Ausnahme: Es ist eine App in einer Nextcloud, die ihr schon betreibt. IHateMoney lässt sich auch mit pip installieren, Abrechnung gibt es als Debian-Paket. Vier sind als PWA auf dem Startbildschirm installierbar (ManaWG, Spliit, SplitPro, Abrechnung). IHateMoney und Cospend sind Web-Apps, für Cospend nennt die README Android-Clients. Spliit, SplitPro und IHateMoney nennen in der README außerdem eine gehostete Instanz zum Ausprobieren, Abrechnung eine Demo-Instanz.',
			],
			[
				'Schwerpunkt und Import',
				'Die Projekte gehören zu zwei Sorten. Spliit, SplitPro, Cospend, IHateMoney und Abrechnung teilen Ausgaben für Gruppen aller Art: Freunde, Reisen, Haushalte. ManaWG ist für eine WG gebaut und bringt Putzplan, Einkaufsliste, Kalender und Chat mit; in den READMEs der anderen fünf kommt davon nichts vor. Beim Umzug von Splitwise zählt der Import: ManaWG liest Splitwise- und Splid-CSV und Screenshots, Cospend liest CSV von Splitwise und IHateMoney, IHateMoney liest JSON und CSV im Cospend-Format, Abrechnung liest JSON der eigenen Gruppen, und SplitPro übernimmt Freunde und Gruppen aus Splitwise, aber noch keine Ausgaben. Bei Spliit steht ein Splitwise-Import als mögliche künftige Funktion.',
			],
			[
				'Was ManaWG ist und was nicht',
				'Gebaut für eine WG mit bis zu 20 Mitgliedern: Ausgaben, Putzplan, Einkaufsliste, Kalender, Chat und Pinnwand in einer App.\nBeträge in Euro, keine Währungsumrechnung.\nManaWG bewegt kein Geld: Ihr überweist selbst und markiert den Betrag in der App als bezahlt.\nEine Aufteilung nach Tagen gibt es nicht, nur gleiche oder eigene Beträge. Für Rechnungen nach Tagen gibt es den [Rechner](/nebenkosten-tagesgenau-rechner).\nDie jüngste der sechs Apps mit der kleinsten Community: weniger Leute, die ihr fragen könnt, und weniger Erfahrung im Alltag als bei den anderen.\nKeine Werbung, keine Bezahlstufe, Daten der gehosteten App in der EU.',
			],
			[
				'ManaWG ausprobieren oder selbst betreiben',
				'Die [Demo](/demo) zeigt die echte App mit Beispieldaten, ohne Konto.\nDer Quellcode liegt im [Repository Abuarchiv/manawg](https://github.com/Abuarchiv/manawg).\nDie Anleitung zum Selbsthosten steht in [docs/self-hosting.md](https://github.com/Abuarchiv/manawg/blob/main/docs/self-hosting.md) (Englisch). Eine Zusammenfassung auf Deutsch gibt [Open-Source-WG-App](/open-source-wg-app).',
			],
			[
				'Welche App für wen',
				'Eine WG, die Geld, Putzplan, Einkauf und Chat in einer Handy-App will: ManaWG. Der Preis dafür sind die kleine Community und die kurze Geschichte. Für Reisen, Büros oder Gruppen über 20 Personen ist ManaWG die falsche Wahl, dort passen die anderen besser.\nFreunde auf Reisen: Spliit, wenn es das einfachste Werkzeug sein soll (Gruppe anlegen, Ausgaben eintragen, Salden sehen, ungleich teilen, als PWA installierbar). Abrechnung oder SplitPro, wenn ihr in mehreren Währungen zahlt, denn beide nennen Währungsumrechnung.\nSplitwise-Ersatz mit Einzelpersonen und Gruppen: SplitPro. Die README nennt Ausgaben mit einzelnen Freunden und in Gruppen, Aufteilung nach Prozent oder Anteilen, wiederkehrende Ausgaben und optional Bank-Importe.\nIhr betreibt schon eine Nextcloud: Cospend. Kein zusätzlicher Server, dazu CSV-Import aus Splitwise und IHateMoney.\nDas Kleinste, das funktioniert: IHateMoney. Eingeladene brauchen kein Konto. Die README beschreibt das Projekt seit 2024 als auf dem Weg in den Wartungsmodus, neue Funktionen sind also selten.\nBuchführung für Events mit Rollen: Abrechnung. Laut README gibt es Betrachter, Bearbeiter und Besitzer, Events mit wechselnden Teilnehmern je Tag, Tags und Diagramme. Laut README ist das von den sechs am nächsten an einer Aufteilung nach Tagen.',
			],
			[
				'Was die Tabellen auslassen',
				'Die fünf anderen Projekte haben wir nicht getestet. Die Tabellen sagen nichts zu Sicherheit, Support, Pflegetempo oder dazu, ob die deutsche Übersetzung vollständig ist; alle fünf verwalten ihre Übersetzungen bei Weblate oder Crowdin. Schaut euch vor der Entscheidung die letzten Änderungen und offenen Issues selbst an, bevor ihr das Geld eurer WG auf einem Server ablegt. Gehostete Preise und Bedingungen haben wir nicht verglichen.',
			],
		],
		faq: [
			[
				'Welche Open-Source-Alternative zu Splitwise ist die beste?',
				'Keine für alle. Für Reisen und Freundesgruppen sind Spliit, SplitPro und Abrechnung naheliegend, für Nextcloud-Nutzer Cospend, für das kleinste mögliche Werkzeug IHateMoney. ManaWG ist für eine WG gedacht, mit Putzplan, Einkaufsliste und Chat. Die Abschnitte oben nennen die Gründe.',
			],
			[
				'Kann ich meine Splitwise-Daten übernehmen?',
				'ManaWG liest Splitwise- und Splid-CSV und Screenshots, siehe [Von Splitwise oder Splid wechseln](/splitwise-splid-wechseln). Cospend liest CSV aus Splitwise, SplitPro übernimmt Freunde und Gruppen, aber noch keine Ausgaben. Bei Spliit steht der Import nur als mögliche Funktion in der README.',
			],
			[
				'Muss ich ManaWG selbst hosten?',
				'Nein. app.manawg.com ist kostenlos und werbefrei. Selbst hosten ist für alle gedacht, die die Daten auf einer eigenen Maschine haben wollen, die Schritte stehen unter [Open-Source-WG-App](/open-source-wg-app).',
			],
			[
				'Ist dieser Vergleich unabhängig?',
				'Nein, er stammt von ManaWG. Die Angaben zu den anderen Projekten kommen aus deren READMEs mit Stand 6. November 2026, die Quellen stehen unten. Wo etwas nicht belegt ist, steht es nicht in den Tabellen.',
			],
		],
	},
};
