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
				'Wenn eure WG schon Splitwise oder Splid nutzt, fangt ihr nicht bei null an. Exportiert die Ausgaben als CSV-Datei, prüft die Vorschau und macht den Import rückgängig, falls etwas nicht stimmt, so wie es [Von Splitwise oder Splid wechseln](/splitwise-splid-wechseln) beschreibt. Der Import ist Teil der App und funktioniert deshalb auf einer selbst gehosteten Kopie genauso. Übernommen werden nur Eurobeträge. Wie ManaWG im Vergleich abschneidet, steht unter [Splitwise-Alternative](/splitwise-alternative), und was die kostenlose Splitwise-Version pro Tag erlaubt, unter [Splitwise kostenlos](/splitwise-kostenlos).',
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
};
