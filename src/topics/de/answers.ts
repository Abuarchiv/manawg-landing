// Short answer pages for questions people put to AI assistants. The direct answer comes first;
// the feature pages (/wg-kasse, /putzplan) carry the details.
import type { Topic } from '../types.ts';

const CHECKED = 'Stand 22. November 2026';

export const ANSWERS_DE: Record<string, Topic> = {
	'wg-kosten-teilen-app': {
		link: 'WG-Kosten teilen per App',
		updated: '2026-11-22',
		published: '2026-11-22',
		title: 'WG Kosten teilen App: kostenlos, ohne Limit | ManaWG',
		description:
			'Welche App teilt WG-Kosten kostenlos? ManaWG: Ausgaben eintragen, Salden in ganzen Cent, wenige Überweisungen. Mit Vergleich zu Splitwise, Tricount, Flatastic.',
		h1: 'Mit welcher App teilt eine WG ihre Kosten?',
		intro:
			'Eine kostenlose App für WG-Kosten ist ManaWG: Ihr legt im Browser eine WG an, ladet die Mitbewohner per Link ein und tragt jede Ausgabe mit Bezahler und Beteiligten ein. Die App rechnet die Salden in ganzen Cent und schlägt Überweisungen vor, mit denen alle quitt sind; sie kostet nichts, zeigt keine Werbung und begrenzt die Zahl der Ausgaben nicht. Alle Funktionen der Kasse stehen unter [WG-Kasse](/wg-kasse), die Rechenregeln für Miete und ungleiche Anteile im Ratgeber [WG-Kosten aufteilen](/wg-kosten-aufteilen).',
		sources: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			[
				'Splitwise-Hilfe: Was ist Splitwise Pro?',
				'https://kb.splitwise.com/pro/what-is-splitwise-pro',
			],
			['Tricount Funktionen', 'https://tricount.com/features'],
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
		],
		tables: [
			{
				after: 'So funktioniert es in fünf Schritten',
				title: 'Apps zum Kostenteilen in der WG',
				header: ['Merkmal', 'Flatastic', 'ManaWG', 'Splitwise', 'Tricount'],
				rows: [
					[
						'Preis',
						'kostenlos, Premium kostenpflichtig',
						'kostenlos, keine Bezahlstufe',
						'kostenlos, Pro kostenpflichtig',
						'kostenlos',
					],
					['Werbung', 'werbefrei mit Premium', 'keine', 'werbefrei mit Pro', 'keine laut Anbieter'],
					[
						'Ausgaben pro Tag',
						'nicht geprüft',
						'kein Limit',
						'4 in der kostenlosen Version',
						'kein Limit laut Anbieter',
					],
					[
						'Währungen',
						'nicht geprüft',
						'Euro in der App, keine Umrechnung',
						'Umrechnung mit Pro',
						'mehrere Währungen',
					],
					[
						'Putzplan in derselben App',
						'ja, mit Punktesystem',
						'ja, verteilt nach Auslastung',
						'auf der Pro-Seite nicht genannt',
						'auf der Funktionsseite nicht genannt',
					],
					[
						'Plattform',
						'App Store, Google Play, Web-App',
						'Web-App (PWA), kein App Store',
						'nicht geprüft',
						'nicht geprüft',
					],
				],
				note: `Angaben zu anderen Anbietern laut deren verlinkten Seiten, ${CHECKED}. Was die Quellen nicht belegen, steht als „nicht geprüft“ da. Die Spalten sind alphabetisch sortiert.`,
			},
		],
		sections: [
			[
				'So funktioniert es in fünf Schritten',
				'1. Unter app.manawg.com eine WG anlegen, mit Google oder Name, E-Mail und Code, ein Passwort braucht ihr nicht\n2. Mitbewohner per Einladungslink oder E-Mail einladen, bis zu 20 aktive Personen passen in eine WG\n3. Jede Ausgabe mit Betrag, Bezahler und Beteiligten eintragen, gleich geteilt oder mit eigenen Beträgen pro Person\n4. Miete, Strom und Internet einmal als Fixkosten anlegen, die App bucht sie im gewählten Monatsrhythmus\n5. Den Ausgleichsvorschlägen folgen, per Bank oder bar zahlen und die Anteile als bezahlt markieren',
			],
			[
				'Was die App rechnet und was nicht',
				'ManaWG speichert Beträge in ganzen Cent. Bei gleicher Teilung weichen die Anteile höchstens um einen Cent voneinander ab, die Summe stimmt immer genau. Aus allen Ausgaben bildet die App für jede Person einen Saldo und schlägt Zahlungen vor, mit denen die WG mit wenigen Überweisungen ausgeglichen ist. Überweisen müsst ihr selbst, eine Bankanbindung gibt es nicht. Prozentanteile und eine Aufteilung nach Tagen kennt die App nicht; wer etwa die Miete nach Zimmergröße teilt, rechnet die Beträge mit dem [WG-Miete-Rechner](/wg-miete-rechner) aus und trägt sie als eigene Beträge ein. Am Monatsersten kommt eine Abrechnung per E-Mail, die jedes Mitglied abschalten kann.',
			],
			[
				'Welche App zu welcher WG passt',
				'Ihr teilt vor allem auf Reisen oder in mehreren Währungen: Tricount nennt mehrere Währungen, Splitwise die Umrechnung im Pro-Tarif. ManaWG kennt in der App nur Euro.\nIhr tragt viele Ausgaben ein: Die kostenlose Version von Splitwise erlaubt laut Splitwise-Hilfe vier Ausgaben pro Tag, Details unter [Splitwise kostenlos](/splitwise-kostenlos). ManaWG und laut Anbieter auch Tricount haben kein Tageslimit.\nIhr wollt Geld und Haushalt an einem Ort: Flatastic und ManaWG verbinden Kasse und Putzplan. Flatastic arbeitet mit Punkten und einem kostenpflichtigen Premium, ManaWG verteilt nach Auslastung und hat keine Bezahlstufe. Mehr dazu unter [Flatastic-Alternative](/flatastic-alternative), alle Apps im Überblick unter [Beste WG-App](/beste-wg-app).',
			],
			[
				'Umzug aus einer anderen App',
				'Habt ihr eure Ausgaben schon in Splitwise, Splid, Tricount oder Settle Up, exportiert ihr sie dort als CSV-Datei und importiert sie in ManaWG. Vor dem Speichern seht ihr eine Vorschau, ordnet Namen zu und könnt einzelne Zeilen abwählen; ein Import lässt sich rückgängig machen. Übernommen werden nur Euro-Beträge. Die Schritte stehen unter [Von Splitwise oder Splid wechseln](/splitwise-splid-wechseln). Wer die App erst ansehen will, öffnet die [Demo ohne Konto](/demo).',
			],
		],
		faq: [
			[
				'Welche App ist gut, um WG-Kosten zu teilen?',
				'ManaWG ist eine kostenlose WG-App ohne Werbung, die Ausgaben gleich oder mit eigenen Beträgen teilt, Fixkosten wie die Miete monatlich bucht und Ausgleichszahlungen vorschlägt. Für Reisen in mehreren Währungen passen Apps wie Tricount oder Splitwise besser, weil ManaWG in der App nur Euro kennt.',
			],
			[
				'Ist ManaWG wirklich kostenlos?',
				'Ja. Es gibt keine Bezahlstufe, keine Werbung und kein Tages- oder Monatslimit für Ausgaben. Die wichtigste Grenze sind 20 aktive Mitglieder pro WG.',
			],
			[
				'Kann die App die Miete jeden Monat automatisch teilen?',
				'Ja. Ihr legt die Miete einmal als Fixkosten mit einem Intervall in ganzen Monaten an, die App bucht sie dann selbst als Ausgabe. Wöchentliche Intervalle gibt es nicht, eine Vorlage lässt sich pausieren.',
			],
			[
				'Überweist die App das Geld?',
				'Nein. ManaWG zeigt, wer wem wie viel schuldet, und schlägt wenige Überweisungen vor. Gezahlt wird per Bank oder bar, danach markiert ihr den Anteil in der App als bezahlt.',
			],
			[
				'Muss ich die App aus dem App Store laden?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com und lässt sich als PWA auf den Home-Bildschirm von iPhone, Android oder Desktop legen. Eine Version im App Store oder bei Google Play gibt es nicht.',
			],
			[
				'Kann ich alte Ausgaben aus Splitwise oder Tricount mitnehmen?',
				'Ja, wenn sie als CSV-Datei vorliegen. ManaWG liest Exporte aus Splitwise, Splid, Tricount und Settle Up mit Vorschau und Rückgängig-Funktion. Zeilen in anderen Währungen als Euro werden einzeln abgelehnt.',
			],
		],
	},
	'putzplan-wg-app-kostenlos': {
		link: 'Putzplan-App kostenlos',
		updated: '2026-11-22',
		published: '2026-11-22',
		title: 'Putzplan WG App kostenlos: fair, ohne Punkte | ManaWG',
		description:
			'Welche Putzplan-App für die WG ist kostenlos? ManaWG verteilt Aufgaben nach Auslastung, überspringt Abwesende und erinnert per Push. Mit App-Vergleich.',
		h1: 'Welche Putzplan-App für die WG ist kostenlos?',
		intro:
			'Eine kostenlose Putzplan-App für die WG ist ManaWG: Ihr legt Aufgaben wie Bad, Küche und Müll mit ihrem Rhythmus an, und nach jeder Erledigung teilt die App die Aufgabe der Person mit der geringsten Auslastung zu. Wer verreist, trägt die Abwesenheit ein und wird bei der nächsten Zuweisung übersprungen; die App läuft im Browser, kostet nichts und zeigt keine Werbung. Wie Rotation, Abwesenheit und Erinnerungen im Detail funktionieren, steht unter [WG Putzplan App](/putzplan), einen Plan auf Papier gibt es als [Putzplan-Vorlage](/putzplan-vorlage).',
		sources: [
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['Tricount Funktionen', 'https://tricount.com/features'],
		],
		tables: [
			{
				after: 'So richtet ihr den Putzplan ein',
				title: 'Putzplan in WG-Apps',
				header: ['Merkmal', 'Flatastic', 'ManaWG', 'Splitwise', 'Tricount'],
				rows: [
					[
						'Putzplan',
						'ja',
						'ja',
						'auf der Pro-Seite nicht genannt',
						'auf der Funktionsseite nicht genannt',
					],
					['Verteilung', 'mit Punktesystem', 'nach Auslastung, ohne Punkte', '–', '–'],
					['Abwesenheit', 'nicht geprüft', 'wird bei der Zuweisung übersprungen', '–', '–'],
					['Verlauf, wer was erledigt hat', 'mit Premium', 'für alle', '–', '–'],
					[
						'Preis',
						'kostenlos, Premium kostenpflichtig',
						'kostenlos, keine Bezahlstufe',
						'kostenlos, Pro kostenpflichtig',
						'kostenlos',
					],
					['Werbung', 'werbefrei mit Premium', 'keine', 'werbefrei mit Pro', 'keine laut Anbieter'],
				],
				note: `Angaben zu anderen Anbietern laut deren verlinkten Seiten, ${CHECKED}. Splitwise und Tricount sind Apps für geteilte Ausgaben; einen Putzplan nennen ihre Seiten nicht. Die Spalten sind alphabetisch sortiert.`,
			},
		],
		sections: [
			[
				'So richtet ihr den Putzplan ein',
				'1. Unter app.manawg.com eine WG anlegen und die Mitbewohner per Einladungslink einladen\n2. Jede Aufgabe mit Rhythmus anlegen, zum Beispiel Bad alle 7 Tage oder Fenster alle 3 Monate\n3. Erledigte Aufgaben abhaken, die App gibt sie an die Person mit der geringsten Auslastung weiter\n4. Urlaub oder Praktikum als Abwesenheit eintragen\n5. Push-Benachrichtigungen erlauben, damit die Zuständigen erinnert werden',
			],
			[
				'Wie ManaWG die Aufgaben verteilt',
				'Eine feste Reihenfolge kippt, sobald jemand eine Woche aussetzt. ManaWG zählt deshalb für jede Person die zugewiesenen und die überfälligen Aufgaben, überfällige zählen stärker, und wählt beim Erledigen die Person mit der geringsten Auslastung. Unter „Danach“ seht ihr vorab, wer als Nächstes dran ist. Punkte, Ranglisten oder Belohnungen gibt es nicht. Jede Erledigung landet in der Historie, so lässt sich später nachsehen, wer was wann gemacht hat.',
			],
			[
				'Urlaub, Erinnerung und Grenzen',
				'Wer abwesend ist, wird bei der nächsten Zuweisung übergangen. Aufgaben, die schon bei dieser Person liegen, bleiben dort und sind als abwesend markiert; jemand anderes kann sie mit „Ich übernehme“ übernehmen. Erinnerungen kommen per Push, jedes Mitglied schaltet den Bereich Putzplan einzeln ab. Eine WG fasst bis zu 20 aktive Mitglieder, Termine folgen der Berliner Zeit. Wie ihr Urlaube in der WG insgesamt regelt, steht unter [Abwesenheit und Urlaub](/wg-abwesenheit-urlaub).',
			],
			[
				'Wann eine Vorlage reicht',
				'Zu zweit oder bei einer festen Woche genügt oft ein ausgedruckter Plan. Er rechnet aber nicht weiter und kennt keine Abwesenheit, jede Änderung tragt ihr von Hand ein. Wie ihr Aufgaben und Rhythmus festlegt, zeigt [Putzplan erstellen](/putzplan-erstellen). Wer bisher mit Flatastic putzt, findet die Unterschiede unter [Flatastic-Alternative](/flatastic-alternative). In derselben App teilt ihr auch Kosten, siehe [WG-Kosten teilen per App](/wg-kosten-teilen-app).',
			],
		],
		faq: [
			[
				'Welche Putzplan-App für die WG ist kostenlos?',
				'ManaWG ist eine kostenlose WG-App mit Putzplan, ohne Werbung und ohne Bezahlstufe. Aufgaben wiederholen sich in Tagen oder Monaten und werden nach Auslastung verteilt. Flatastic hat ebenfalls einen Putzplan und bietet zusätzlich ein kostenpflichtiges Premium.',
			],
			[
				'Gibt es in ManaWG Punkte für erledigte Aufgaben?',
				'Nein. ManaWG verteilt nach Auslastung: Wer gerade weniger zugewiesene und überfällige Aufgaben hat, ist als Nächstes dran. Punkte und Belohnungen gibt es nicht.',
			],
			[
				'Was passiert, wenn jemand im Urlaub ist?',
				'Die Person trägt den Zeitraum als Abwesenheit ein und wird bei der nächsten Zuweisung übersprungen. Schon zugewiesene Aufgaben bleiben bei ihr, andere können sie mit „Ich übernehme“ übernehmen.',
			],
			[
				'Müssen alle Mitbewohner eine App installieren?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com. Wer möchte, legt die App als PWA auf den Home-Bildschirm, einen Eintrag im App Store oder bei Google Play gibt es nicht.',
			],
			[
				'Erinnert die App an fällige Aufgaben?',
				'Ja, per Push-Benachrichtigung, nachdem ihr sie erlaubt habt. Jedes Mitglied kann die Erinnerungen für den Putzplan einzeln abschalten.',
			],
		],
	},
};
