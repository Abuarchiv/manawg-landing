// Topic pages for search queries that the home page alone does not cover.
// Only name features that really exist in manawg-app.
import type { Topic } from '../types.ts';
import { COMPARISON_ROWS, comparisonTable, MANAWG_CELLS, NOT_CHECKED } from './comparison.ts';

export const TOPICS_DE_CORE: Record<string, Topic> = {
	'wg-app': {
		link: 'WG-App',
		updated: '2026-10-27',
		published: '2026-10-10',
		title: 'WG-App kostenlos: Ausgaben, Putzplan, Einkauf | ManaWG',
		description:
			'ManaWG ist die kostenlose WG-App für den Alltag, keine Zimmersuche: Ausgaben, Putzplan, Einkaufsliste, Kalender und Chat im Browser, ohne App Store.',
		h1: 'Die WG-App für Geld, Putzen, Einkauf und Termine',
		intro:
			'Ein Zettel am Kühlschrank und eine WhatsApp-Gruppe, in der Wichtiges untergeht: So läuft der Alltag in vielen WGs. ManaWG bündelt Ausgaben, Putzplan, Einkauf, Vorräte, Kalender, Chat und Pinnwand in einer kostenlosen App auf Deutsch.',
		sections: [
			[
				'Warum eine App statt Zettel und WhatsApp',
				'Ein Zettel rechnet keinen Saldo aus, und im Gruppenchat rutscht die Frage nach dem Putzplan zwischen anderen Nachrichten weg. In ManaWG hat jedes Thema seinen Platz: Beträge werden gerechnet, Aufgaben wandern weiter, Termine stehen im Kalender. Was erledigt ist, bleibt nachvollziehbar, und neue Mitbewohner sehen sofort, wie die WG organisiert ist. Welche Kriterien bei der Wahl zählen, zeigt die Seite [WG-Apps im Vergleich](/beste-wg-app).',
			],
			[
				'Zimmersuche oder Alltag: was eine WG-App ist',
				'Unter „WG-App“ suchen manche ein Portal für Zimmer und Mitbewohner, andere eine App für den Alltag in einer bestehenden WG. ManaWG gehört zur zweiten Art: Ihr teilt Ausgaben, führt Putzplan und Einkaufsliste, plant Termine und sprecht euch ab. Zimmer oder Mitbewohner vermittelt ManaWG nicht. Für die Suche helfen [Mitbewohner finden](/mitbewohner-finden) und die [WG-Casting-Fragen](/wg-casting-fragen), wie ihr eine WG aufsetzt, zeigt die [Checkliste zum WG-Gründen](/wg-gruenden-checkliste).',
			],
			[
				'Ausgaben teilen und Schulden ausgleichen',
				'[Gemeinsame Ausgaben](/wg-kasse) teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person und ordnet sie einer von sechs Kategorien zu, etwa Lebensmittel oder Wohnen und Nebenkosten. Die Anteile ergeben immer genau den Betrag. ManaWG schlägt Ausgleiche mit wenigen Überweisungen vor. Ihr markiert sie als bezahlt, die App überweist selbst nichts. Wer für jemand anderen erfasst, trägt dabei selbst einen Anteil.',
			],
			[
				'Fixkosten und Monatsabrechnung',
				'Miete und Internet legt ihr einmal als Fixkosten an, im Rhythmus ganzer Monate. ManaWG bucht sie automatisch als Ausgabe. Die Monatsabrechnung zeigt die Gesamtsumme, die Ausgaben je Kategorie und die Überweisungsvorschläge. Am Monatsanfang kommt sie per Mail, jede Person kann das abschalten. Fixkosten lassen sich pausieren, und bei gleichmäßiger Teilung wandert der Cent-Rest von Buchung zu Buchung weiter.',
			],
			[
				'Putzplan, Einkauf und Vorräte',
				'Die [Putzplan-App](/putzplan) wiederholt Aufgaben in Tagen oder Monaten und bestimmt nach der Auslastung, wer als Nächstes dran ist. Wer verreist ist, trägt eine Abwesenheit ein und wird bei der nächsten Zuweisung übergangen. Auf der [gemeinsamen Einkaufsliste](/einkaufsliste) hakt ihr ab und könnt den Einkauf danach als Ausgabe erfassen. Die Vorräte zeigen, was knapp wird, und schlagen vor, was ihr nachkaufen solltet. Erinnerungen an fällige Aufgaben kommen als Push.',
			],
			[
				'Kalender, Pinnwand und Chat',
				'Der Kalender kennt Serientermine und lässt sich als Abo in Apple Kalender oder Google Kalender einbinden, nur in diese Richtung. Termine am Vortag meldet ManaWG per Push. Die Pinnwand ist für Ankündigungen, Fragen und Entscheidungen, der Chat für Schnelles mit Antworten, Reaktionen und Erwähnungen. Push-Meldungen schaltet ihr je Bereich ein oder aus.',
			],
			[
				'Für wen ManaWG gedacht ist',
				'Für die Studenten-WG, die Zweck-WG und das Paar mit Mitbewohner: Bis zu 20 aktive Mitglieder passen in eine WG. Beigetreten wird per Einladungslink, Einladungen gehen auch per Mail. Anmelden könnt ihr euch mit Google oder mit E-Mail und Passwort. Die App läuft im Browser und lässt sich auf den Home-Bildschirm legen.',
			],
			[
				'So startet eure WG',
				'Eine Person meldet sich mit Google oder E-Mail und Passwort an, erstellt die WG und teilt den Einladungslink. Die anderen melden sich ebenfalls an und treten über den Link bei. Fangt mit einem konkreten Alltagsproblem an: Erfasst die [erste gemeinsame Ausgabe](/wg-kasse) oder legt eine wiederkehrende Putzaufgabe an. So nutzt ihr die App direkt zusammen, statt erst alle Bereiche einzurichten.',
			],
			[
				'ManaWG installieren: iPhone, Android, Desktop',
				'iPhone: In Safari auf Teilen tippen, „Zum Home-Bildschirm“ wählen und oben rechts auf Hinzufügen tippen. Danach ManaWG vom Home-Bildschirm öffnen und einmal anmelden.\nAndroid: In Chrome im Menü „App installieren“ oder „Zum Startbildschirm“ wählen und bestätigen.\nDesktop: In der Adressleiste auf Installieren klicken oder im Menü „ManaWG installieren“ wählen.',
			],
			[
				'Auch ohne Netz',
				'Fehlt unterwegs das Netz, speichert ManaWG neue Einträge auf dem Gerät und sendet sie, sobald ihr wieder online seid. Das gilt für Einkaufseinträge, Abwesenheiten, neue und erledigte Putzaufgaben, Ausgaben und Fixkosten. In den Einstellungen seht ihr, wie viele Aktionen noch warten. Nach etwa sieben Tagen werden liegen gebliebene Aktionen nicht mehr automatisch gesendet, sondern euch zur Prüfung angezeigt.',
			],
			[
				'Daten und Abrechnung mitnehmen',
				'Jedes Mitglied kann die Daten der WG in den Einstellungen unter Daten herunterladen: komplett als JSON oder einzelne Bereiche als CSV, zum Beispiel Ausgaben, Fixkosten, Einkauf, Putzplan, Vorräte, Termine, Pinnwand oder Chat. Die Monatsabrechnung blättert ihr Monat für Monat durch und druckt sie über „Als PDF“ oder speichert sie als PDF.',
			],
		],
		tables: [
			{
				after: 'intro',
				title: 'Was die WG-App ManaWG abdeckt',
				header: ['Bereich', 'Das könnt ihr', 'Grenzen'],
				rows: [
					[
						'Ausgaben',
						'gleichmäßig oder mit eigenen Eurobeträgen teilen, Fixkosten automatisch buchen, Überweisungsvorschläge, Monatsabrechnung als PDF',
						'nur Euro, keine Prozentanteile, ihr überweist selbst',
					],
					[
						'Putzplan',
						'Wiederholung in Tagen oder Monaten, Verteilung nach Auslastung, Vorschau „Nächste:r“, Abwesenheiten, Push-Erinnerung',
						'keine feste Reihenfolge, keine Punkte',
					],
					[
						'Einkauf',
						'gemeinsame Liste, Vorräte, Einkauf als Ausgabe übernehmen',
						'Einträge ohne Netz werden später gesendet',
					],
					[
						'Kalender',
						'Serientermine, Abo in Apple oder Google Kalender, Push am Vortag',
						'Abo nur in eine Richtung',
					],
					[
						'Chat und Pinnwand',
						'Antworten, Reaktionen, Erwähnungen, Ankündigungen und Entscheidungen',
						'Push je Bereich abschaltbar',
					],
					[
						'Daten',
						'Import aus Splitwise- und Splid-CSV oder per Screenshot, Export als JSON und CSV',
						'kein Import aus Tricount oder Flatastic',
					],
					[
						'Zugang',
						'im Browser, auf dem Home-Bildschirm installierbar, Beitritt per Einladungslink oder E-Mail-Einladung',
						'kein App Store, auf Deutsch und Englisch, bis zu 20 aktive Mitglieder',
					],
				],
				note: 'Angaben aus der App, Stand 27. Oktober 2026.',
			},
		],
		faq: [
			[
				'Was kostet die WG-App ManaWG?',
				'Nichts. ManaWG ist kostenlos und zeigt keine Werbung. Eine Bezahlstufe oder ein Abo-Modell gibt es in der App nicht, alle Bereiche stehen offen.',
			],
			[
				'Gibt es ManaWG im App Store oder auf Englisch?',
				'Im App Store nicht, auf Englisch ja. ManaWG ist keine native App: Ihr öffnet app.manawg.com im Browser und legt die App auf den Home-Bildschirm. Die Oberfläche gibt es auf Deutsch und Englisch, Beträge werden nur in Euro geführt.',
			],
			[
				'Wie viele Leute passen in eine WG?',
				'Bis zu 20 aktive Mitglieder. Ausgezogene Personen zählen nicht mit, ihre Historie bleibt erhalten. Admins können Einladungen jederzeit widerrufen.',
			],
			[
				'Kann ich von Splitwise oder Splid wechseln?',
				'Ja, per CSV-Import mit Vorschau und Rückgängig-Funktion. Übernommen werden Zeilen in Euro, andere Währungen lehnt ManaWG zeilenweise ab, ohne den ganzen Import zu stoppen.',
			],
			[
				'Funktioniert ManaWG ohne Internet?',
				'Teilweise. Fehlt unterwegs das Netz, speichert ManaWG neue Einträge auf dem Gerät und sendet sie, sobald ihr wieder online seid: Einkaufseinträge, Abwesenheiten, neue und erledigte Putzaufgaben, Ausgaben und Fixkosten. Nach etwa sieben Tagen werden liegen gebliebene Aktionen nicht mehr automatisch gesendet, sondern euch zur Prüfung angezeigt.',
			],
			[
				'Kann ich unsere WG-Daten exportieren?',
				'Ja. Jedes Mitglied lädt die Daten der WG in den Einstellungen unter Daten herunter, komplett als JSON oder einzelne Bereiche als CSV, etwa Ausgaben, Fixkosten, Einkauf oder Putzplan. Die Monatsabrechnung lässt sich über „Als PDF“ drucken oder als PDF speichern.',
			],
			[
				'Ist ManaWG eine App für die Zimmersuche?',
				'Nein. ManaWG vermittelt weder Zimmer noch Mitbewohner, sondern organisiert eine WG, die schon besteht. Für die Suche helfen [Mitbewohner finden](/mitbewohner-finden) und die [WG-Casting-Fragen](/wg-casting-fragen).',
			],
			[
				'Kann ich ManaWG am Laptop nutzen?',
				'Ja. ManaWG läuft im Browser unter app.manawg.com, am Laptop genauso wie am Handy. Auf beiden lässt es sich auch als App installieren.',
			],
		],
	},
	putzplan: {
		link: 'WG Putzplan App',
		updated: '2026-10-27',
		published: '2026-10-09',
		title: 'WG Putzplan App: fair verteilt, kostenlos | ManaWG',
		description:
			'Kostenlose WG Putzplan App: Aufgaben wiederholen sich im festen Rhythmus, die App verteilt fair, überspringt Abwesende und erinnert, wer dran ist.',
		h1: 'WG Putzplan App: Aufgaben, faire Verteilung und Abwesenheit',
		intro:
			'Ihr legt die Aufgaben einmal an, ManaWG rechnet Termine, Zuständigkeit und Abwesenheit selbst aus. Kostenlos und im Browser, ohne Zettel am Kühlschrank, der schnell veraltet. Wer einen Plan zum Ausdrucken sucht, findet ihn in der [Putzplan-Vorlage](/putzplan-vorlage), die Schritte zum eigenen Plan stehen unter [Putzplan erstellen](/putzplan-erstellen).',
		sections: [
			[
				'Aufgaben mit festem Rhythmus',
				'Jede Aufgabe wiederholt sich in Tagen oder Monaten, etwa das Bad alle sieben Tage oder die Fenster alle drei Monate. Monatsintervalle bleiben kalendertreu, gerechnet wird nach Berliner Zeit. Eine Aufgabe kann einem Mitglied zugewiesen werden, und jede Erledigung landet in der Historie. So seht ihr später, wer was wann gemacht hat.',
			],
			[
				'Rotation nach Fairness',
				'Eine starre Reihenfolge nach dem Muster „diese Woche A, nächste Woche B“ kippt, sobald jemand aussetzt. ManaWG wählt beim Erledigen die Person mit der geringsten Auslastung. Gezählt werden zugewiesene und überfällige Aufgaben, überfällige zählen stärker. Dieselbe Vorhersage zeigt die App vorab als „Nächste:r“ an, ihr wisst also im Voraus, wer als Nächstes dran ist.',
			],
			[
				'Abwesenheit eintragen',
				'Urlaub, Praktikum, Heimatbesuch: Mitglieder tragen Zeiträume mit Grund ein. Wer abwesend ist, wird bei der nächsten Zuweisung übergangen, und die App nennt, wie viele Personen deshalb ausgelassen werden. Schon zugewiesene Aufgaben verteilt die App nicht um. Sie markiert sie als abwesend, und jemand anderes kann sie mit „Ich übernehme“ übernehmen. Sobald der Zeitraum endet, gilt die Person nicht mehr als abwesend.',
			],
			[
				'Erinnerung aufs Handy',
				'Täglich schickt ManaWG eine Push-Nachricht für zugewiesene Aufgaben, die heute fällig oder bis zu sieben Tage überfällig sind. Pro Aufgabe kommt sie höchstens alle 18 Stunden. Den Kanal Putzplan schaltet jedes Mitglied einzeln ab, wenn es keine Hinweise möchte. Die App fragt vorher um Erlaubnis für Push. Aufgaben ohne zugewiesene Person lösen keine Erinnerung aus.',
			],
			[
				'Vorlage oder App',
				'Eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) ist ein guter Anfang, wenn eure WG klein und die Woche planbar ist. Sie rechnet aber nicht weiter und kennt keine Abwesenheit, jede Änderung tragt ihr selbst ein. Wer die Reihenfolge nicht dauernd pflegen will, ist mit einer App besser bedient, die Zuständigkeit und Termine selbst fortschreibt. Wie ihr Aufgaben, Rhythmus und Zuständigkeiten festlegt, zeigt die Anleitung [Putzplan erstellen](/putzplan-erstellen).',
			],
			[
				'Einrichten und Umfang',
				'Mitglieder treten per Einladungslink oder E-Mail-Einladung bei, bis zu 20 aktive Personen passen in eine WG. ManaWG ist kostenlos, ohne Werbung und auf Deutsch und Englisch verfügbar. Installiert wird als PWA über den Browser, einen App-Store-Eintrag gibt es nicht. Neben dem Putzplan gibt es Ausgaben, Einkauf, Vorräte, Kalender, Chat und Pinnwand. Alle Bereiche stellt die Seite [WG-App kostenlos](/wg-app) vor.',
			],
		],
		faq: [
			[
				'Was ist der Unterschied zwischen Putzplan-App und Vorlage?',
				'Eine Vorlage zum Ausdrucken hält nur fest, was ihr von Hand einträgt, und rechnet nicht von selbst weiter. In der App legt ihr die Aufgaben direkt an, Wiederholung, Zuständigkeit und Erledigungshistorie sind eingebaut. Die ausgedruckte Variante gibt es auf der Seite Putzplan-Vorlage.',
			],
			[
				'Wie funktioniert die faire Rotation?',
				'Beim Erledigen einer Aufgabe wählt ManaWG die Person mit der geringsten Auslastung. Gezählt werden zugewiesene und überfällige Aufgaben (überfällige zählen stärker); wer abwesend ist, wird übergangen. In der Oberfläche seht ihr diese Vorhersage vorab als „Nächste:r“.',
			],
			[
				'Was passiert, wenn jemand im Urlaub ist?',
				'Die Person trägt den Zeitraum als Abwesenheit ein. Bei der nächsten Zuweisung nach dem Erledigen einer Aufgabe wird sie übergangen. Schon zugewiesene Aufgaben bleiben bei ihr und sind als abwesend markiert. Die App zeigt an, wie viele Personen wegen Abwesenheit ausgelassen werden.',
			],
			[
				'Kostet die WG Putzplan App etwas?',
				'Nein. ManaWG ist kostenlos und zeigt keine Werbung. Die App gibt es auf Deutsch und Englisch, und eine WG kann höchstens 20 aktive Mitglieder haben.',
			],
			[
				'Gibt es die App im App Store?',
				'Nein, ManaWG ist keine native App. Ihr installiert sie als PWA über den Browser, unter iOS und Firefox mit manuellen Schritten, und könnt Push-Benachrichtigungen je Bereich einstellen.',
			],
		],
		tables: [
			{
				after: 'Vorlage oder App',
				title: 'Vorlage zum Ausdrucken und ManaWG im Vergleich',
				header: ['Merkmal', 'Vorlage zum Ausdrucken', 'ManaWG'],
				rows: [
					['Verteilung', 'von Hand', 'nach Auslastung'],
					['Abwesenheit', 'selbst eintragen', 'wird bei der Zuweisung übergangen'],
					['Erinnerung', 'keine', 'Erinnerung an die Zuständigen'],
				],
			},
		],
	},
	'wg-kasse': {
		link: 'WG-Kasse',
		updated: '2026-10-27',
		published: '2026-10-09',
		title: 'WG Kasse App: Ausgaben teilen, Abrechnung | ManaWG',
		description:
			'Die kostenlose WG Kasse App: Ausgaben teilen, mit wenigen Überweisungen ausgleichen, Fixkosten buchen und die Monatsabrechnung per Mail bekommen.',
		h1: 'Die WG Kasse App für Ausgaben, Fixkosten und Abrechnung',
		intro:
			'Wer hat das Klopapier bezahlt, wer schuldet wem noch etwas? ManaWG ist eine kostenlose, deutschsprachige WG Kasse App. Jede Ausgabe landet sofort im Saldo aller Beteiligten, ohne Zettel und ohne Tabelle.',
		sections: [
			[
				'Ausgaben teilen in der WG',
				'Ihr erfasst Betrag, Bezahler und Beteiligte und wählt eine von sechs Kategorien, etwa Lebensmittel oder Haushalt. Geteilt wird gleichmäßig oder mit eigenen Beträgen pro Person. ManaWG rechnet in ganzen Cent: Bei gleicher Teilung unterscheiden sich die Anteile höchstens um einen Cent, die Summe stimmt immer exakt. Ein Foto vom Beleg hängt ihr direkt an die Ausgabe.',
			],
			[
				'Rechenbeispiel: 120 Euro für drei Personen',
				'Ein fiktives Beispiel: Lea bezahlt 90 Euro für gemeinsame Lebensmittel, Jona 30 Euro für Haushaltsbedarf und Lina noch nichts. Beide Einkäufe werden gleichmäßig auf alle drei verteilt. Zusammen sind das 120 Euro, also 40 Euro pro Person. Lea hat 50 Euro mehr bezahlt als ihren Anteil, Jona fehlen 10 Euro und Lina 40 Euro. Zum Ausgleich zahlt Jona 10 Euro an Lea und Lina 40 Euro an Lea. Diese Zahlungen erledigt ihr außerhalb der App und markiert sie anschließend als bezahlt. Weitere Beispiele und Regeln für unterschiedliche Anteile findet ihr im Ratgeber [WG-Kosten aufteilen](/wg-kosten-aufteilen).',
			],
			[
				'Ausgleich mit wenigen Überweisungen',
				'ManaWG berechnet für jede Person den Saldo und schlägt Zahlungen vor, mit denen die WG mit wenigen Überweisungen quitt ist. Überwiesen wird außerhalb der App, per Bank oder bar. Danach markiert ihr einen Anteil oder mehrere gemeinsam als bezahlt. Eine Bankanbindung gibt es nicht, auch kein SEPA.',
			],
			[
				'Fixkosten automatisch buchen',
				'Miete, Strom, Internet oder Streaming legt ihr einmal als Fixkosten an. Das Intervall zählt in ganzen Monaten, zum Beispiel monatlich oder alle drei Monate. Fällige Vorlagen bucht die App täglich selbst als Ausgabe. Ein Termin am 31. rutscht im Februar auf den 28. und springt danach zurück. Eine Vorlage lässt sich pausieren. Wöchentliche Intervalle gibt es nicht. Wie ihr die Miete nach Zimmergröße verteilt, rechnet der [WG-Miete-Rechner](/wg-miete-rechner) vor. Strom, Internet und Nachzahlungen behandelt der Ratgeber [WG-Nebenkosten](/wg-nebenkosten), den Rundfunk die Seite [Rundfunkbeitrag in der WG](/rundfunkbeitrag-wg).',
			],
			[
				'Die Monatsabrechnung',
				'Die Abrechnung zeigt Gesamtsumme, einzelne Positionen und die Ausgaben je Kategorie mit Prozentanteil. Pro Mitglied steht dort, was gezahlt wurde, wie hoch der Anteil war und wie der Saldo aussieht. Dazu kommen die Überweisungsvorschläge und der Hinweis, ob alles beglichen ist. Sie kommt am Monatsersten per E-Mail, jedes Mitglied kann das abschalten.',
			],
			[
				'Erinnern ohne Streit',
				'Auf der Seite Mahnungen löst ein Mitglied per Erinnern-Button eine Zahlungserinnerung aus. Eine Abkühlzeit begrenzt, wie oft das hintereinander möglich ist, und ein Rate-Limit bremst zu viele Anfragen. Der Saldo bleibt für alle jederzeit einsehbar, etwa in der Monatsabrechnung. Wie ihr offene Beträge ohne Streit ansprecht, steht unter [Schulden unter Mitbewohnern](/schulden-mitbewohner).',
			],
			[
				'Umzug aus Splitwise oder Splid',
				'Falls eure bisherigen Abrechnungen als CSV-Datei vorliegen, übernehmt ihr sie per Import in eurer WG, die Schritte stehen im [Umstieg](/splitwise-splid-wechseln). Ihr seht vorher eine Vorschau, ein Importverlauf zeigt frühere Läufe, und ein Import lässt sich rückgängig machen. Übernommen werden nur Euro-Beträge, andere Währungen lehnt ManaWG zeilenweise ab. Auch ein Foto oder Bildschirmfoto einer Ausgabenliste lässt sich einlesen und vor dem Speichern korrigieren. Wer von Tricount kommt, findet die Unterschiede unter [Tricount-Alternative](/tricount-alternative).',
			],
			[
				'Was ManaWG nicht ist',
				'ManaWG ist für WGs mit bis zu 20 aktiven Mitgliedern gedacht, auf Deutsch und Englisch nutzbar und rechnet nur in Euro. Es wird als PWA über den Browser installiert, nicht über App Store oder Play Store. Ihr meldet euch per Google oder E-Mail an. Die App ist kostenlos und ohne Werbung. Was die App außer der Kasse bietet, steht unter [WG-App kostenlos](/wg-app).',
			],
		],
		faq: [
			[
				'Ist die WG Kasse App kostenlos?',
				'Ja, ManaWG kostet nichts und zeigt keine Werbung. Ihr nutzt die App im Browser oder installiert sie als PWA auf dem Handy.',
			],
			[
				'Wie funktioniert der Ausgleich mit wenigen Überweisungen?',
				'ManaWG bildet für jede Person den Netto-Saldo aus Gezahltem und Geschuldetem und schlägt Zahlungen vor, die alle ausgleichen. Gezahlt wird außerhalb der App, danach markiert ihr es als bezahlt.',
			],
			[
				'Kann ich Fixkosten wie die Miete automatisch teilen?',
				'Ja, als Vorlage mit Intervall in Monaten. Bei gleicher Teilung wandert ein Cent-Rest von Buchung zu Buchung zur nächsten Person.',
			],
			[
				'Kann ich Daten aus Splitwise übernehmen?',
				'Falls sie als CSV-Datei vorliegen: per CSV-Import aus Splitwise oder Splid, mit Vorschau und Rückgängig-Funktion. Übernommen werden nur Beträge in Euro, Zeilen mit anderen Währungen werden einzeln abgelehnt.',
			],
			[
				'Wie viele Leute passen in eine WG?',
				'Bis zu 20 aktive Mitglieder. Wer auszieht, wird deaktiviert und zählt nicht mehr mit, seine Historie bleibt erhalten. Weitere Personen kommen per Einladungslink oder E-Mail-Einladung dazu.',
			],
		],
	},
	einkaufsliste: {
		link: 'Einkaufsliste',
		updated: '2026-10-23',
		published: '2026-10-09',
		title: 'Gemeinsame Einkaufsliste App für die WG | ManaWG',
		description:
			'Die gemeinsame Einkaufsliste für die WG: alle tragen ein, Vorräte melden Nachschub, und aus dem Einkauf wird direkt eine geteilte Ausgabe. Kostenlos.',
		h1: 'Eine Einkaufsliste für die ganze WG',
		intro:
			'Drei Leute, drei Zettel, zweimal Milch gekauft. ManaWG gibt eurer WG eine gemeinsame Einkaufsliste, die auf jedem Handy gleich aussieht, dazu Vorräte und die Übernahme des Einkaufs in die WG-Kasse.',
		sections: [
			[
				'Alle schreiben mit',
				'Jede Person in der WG trägt ein, was fehlt, auf Wunsch mit Menge wie „2 Packungen“ oder „1 kg“. Wer einkaufen geht, hakt Artikel ab, und alle anderen sehen den Stand. ManaWG merkt sich, wer abgehakt hat, und erkennt Duplikate, bevor derselbe Artikel zweimal auf der Liste steht. Die Liste gehört der WG, nicht einer einzelnen Person. Welche Einkäufe ihr gemeinsam plant und was privat bleibt, klärt ihr mit der Anleitung [WG-Einkauf organisieren](/wg-einkauf-organisieren).',
			],
			[
				'Vorschläge und Aufräumen',
				'Beim Eintragen macht ManaWG Vorschläge, damit ihr nicht jeden Artikel neu tippt. Abgehakte Einträge bleiben zunächst stehen, so sieht man, was schon besorgt ist. Ist die Liste unübersichtlich, räumt ihr alle abgehakten Einträge über einen Dialog in einem Schritt weg. Die Vorschläge sparen vor allem bei Dingen Zeit, die jede Woche auf der Liste stehen.',
			],
			[
				'Vorräte statt Notizen im Kopf',
				'Für Dinge, die nie ausgehen sollen, führt ihr Vorräte mit Name, Menge, Einheit und Schwellwert. Wer etwas verbraucht, trägt es ein, ManaWG führt ein Verbrauchslog. „Schnell nachfüllen“ schlägt fast leere Vorräte vor und solche, die in den letzten 30 Tagen oft verbraucht wurden. So steht der Nachschub auf dem Zettel, bevor die letzte Packung leer ist.',
			],
			[
				'Vom Einkauf zur Ausgabe',
				'Nach dem Abhaken erscheint bei der Person, die gerade gekauft hat, ein Hinweis, die Artikel direkt als Ausgabe zu erfassen. Er gilt 12 Stunden. Die Ausgabe landet in der [WG-Kasse](/wg-kasse), bekommt die Kategorie Lebensmittel oder Haushalt, und ein Belegfoto könnt ihr anhängen. So muss später niemand rekonstruieren, was im Einkaufswagen lag.',
			],
			[
				'Aufteilen ohne Rundungsstreit',
				'Beträge speichert ManaWG in ganzen Cent. Bei gleichmäßiger Aufteilung ergibt die Summe der Anteile genau den Betrag, die Anteile weichen höchstens um einen Cent voneinander ab. Mit eigenen Beträgen pro Person zahlt nur, wer wirklich mitgegessen hat. Die Salden zeigen danach, wer wem etwas schuldet. Gerechnet wird ausschließlich in Euro, Wechselkurse gibt es nicht.',
			],
			[
				'Im Supermarkt auch ohne gutes Netz',
				'ManaWG läuft im Browser unter app.manawg.com und lässt sich ohne App Store auf den Home-Bildschirm legen. Fehlt unterwegs das Netz, merkt die App Aktionen lokal und sendet sie später nach. Nach etwa sieben Tagen werden liegen gebliebene Aktionen nicht mehr automatisch gesendet, sondern euch zur Prüfung angezeigt. Push-Meldungen für Einkauf und Vorräte schaltet jede Person selbst ein oder aus. Was die App sonst noch kann, steht auf der Seite [ManaWG als WG-App](/wg-app).',
			],
		],
		faq: [
			[
				'Ist die gemeinsame Einkaufsliste kostenlos?',
				'Ja. ManaWG kostet nichts, es gibt keine Bezahlstufe und keine Werbung. Einkaufsliste, Vorräte und alle anderen Bereiche stehen jeder WG offen.',
			],
			[
				'Wie wird aus dem Einkauf eine Ausgabe?',
				'Nach dem Abhaken zeigt ManaWG der Person, die gekauft hat, einen Hinweis, die Artikel als Ausgabe zu erfassen. Er gilt 12 Stunden. Dann tragt ihr den Betrag ein und teilt ihn auf.',
			],
			[
				'Brauche ich dafür einen App Store?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com. Auf iPhone und Android legt ihr es auf den Home-Bildschirm. Eine native App im App Store oder bei Google Play gibt es nicht.',
			],
			[
				'Wie viele Leute können die Liste nutzen?',
				'Eine WG fasst bis zu 20 aktive Mitglieder. Ausgezogene Mitglieder zählen nicht mit. Alle sehen dieselbe Einkaufsliste und dieselben Vorräte.',
			],
			[
				'Wie funktionieren die Vorräte?',
				'Ihr legt Vorräte mit Menge, Einheit und Schwellwert an und tragt den Verbrauch ein. „Schnell nachfüllen“ schlägt fast leere und oft verbrauchte Vorräte zum Nachkaufen vor.',
			],
		],
	},
	'beste-wg-app': {
		link: 'Beste WG-App',
		updated: '2026-10-29',
		published: '2026-10-11',
		title: 'Beste WG-App 2026: Flatastic, Splitwise, Splid | ManaWG',
		description:
			'Welche WG-App passt zu euch? Vergleich nach Ausgaben, Putzplan, Einkauf, Kalender und Preis: ManaWG, Flatastic, Splitwise, Splid, Tricount und OurHome.',
		h1: 'Die beste WG-App: 7 Kriterien für die Auswahl',
		intro:
			'Es gibt viele Apps für Wohngemeinschaften, und keine ist für jede WG die beste. Manche rechnen nur Geld, andere organisieren nur den Haushalt. Diese Seite ist kein unabhängiges Ranking, sondern die Sicht des Anbieters ManaWG. Mit diesen sieben Kriterien findet ihr die App, die zu eurem Alltag passt, bevor ihr alle Mitbewohner zum Umstieg bewegt.',
		sources: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['Splid auf Deutsch', 'https://splid.app/german'],
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['Tricount Funktionen', 'https://tricount.com/features'],
			[
				'Tricount im App Store',
				'https://apps.apple.com/de/app/tricount-ausgaben-teilen/id349866256',
			],
			['Was ist ManaWG?', 'https://manawg.com/ueber-manawg'],
		],
		tables: [
			{
				after: 'intro',
				title: 'WG-Apps im Vergleich',
				header: ['Merkmal', 'Flatastic', 'ManaWG', 'OurHome', 'Splid', 'Splitwise', 'Tricount'],
				// Columns are alphabetical so the table does not suggest a ranking.
				rows: COMPARISON_ROWS.map((row, i) => [
					row,
					...[
						[
							'Finanzen laut Anbieter',
							'Aufgaben laut Anbieter',
							'Einkäufe laut Anbieter',
							NOT_CHECKED,
							'Pinnwand laut Anbieter, Chat nicht geprüft',
							NOT_CHECKED,
							'Premium kostenpflichtig laut Anbieter',
						],
						MANAWG_CELLS,
						[],
						[
							'ja, in Gruppen',
							NOT_CHECKED,
							NOT_CHECKED,
							NOT_CHECKED,
							NOT_CHECKED,
							'über 150 laut Anbieter',
							NOT_CHECKED,
						],
						[
							'ja',
							NOT_CHECKED,
							NOT_CHECKED,
							NOT_CHECKED,
							NOT_CHECKED,
							'Umrechnung im Pro-Tarif laut Anbieter',
							'Pro-Tarif laut Anbieter',
						],
						[
							'ja',
							NOT_CHECKED,
							NOT_CHECKED,
							NOT_CHECKED,
							NOT_CHECKED,
							'mehrere Währungen laut Anbieter',
							'kostenlos laut Anbieter',
						],
					].map((column) => column[i] ?? NOT_CHECKED),
				]),
				note: 'Angaben zu anderen Anbietern laut deren Seiten, Stand 14. Oktober 2026 (Tricount: 27. Oktober 2026). Was die Quellen nicht belegen, steht als „nicht geprüft“ da. Die Spalten sind alphabetisch sortiert, kein Ranking.',
			},
		],
		sections: [
			[
				'1. Was kostet die App wirklich?',
				'Prüft, ob Funktionen erst im Abo freigeschaltet werden, ob Werbung erscheint und ob es Grenzen bei der Zahl der Einträge gibt. Tarife ändern sich, schaut deshalb bei jedem Anbieter selbst nach. Die [kostenlose WG-App ManaWG](/wg-app) kommt ohne Werbung und ohne Bezahlstufe aus. Splitwise Pro nennt laut Anbieter unter anderem unbegrenzte Ausgaben, keine Werbung, das Scannen von Belegen und die Umrechnung von Währungen. Was die [kostenlose Version von Splitwise](/splitwise-kostenlos) begrenzt, steht auf einer eigenen Seite. Splid nennt auf seiner deutschen Seite über 150 Währungen, Offline-Nutzung sowie PDF- und Excel-Exporte. Flatastic organisiert laut Anbieter Aufgaben, Einkäufe, Finanzen und Pinnwand und bietet ein kostenpflichtiges Premium, unter anderem ohne Werbung und mit Verläufen. ManaWG ist kostenlos und werbefrei und verbindet Kasse, Putzplan, Einkaufsliste, Kalender, Pinnwand und Chat, Es rechnet nur in Euro, ist auf Deutsch und Englisch verfügbar und für höchstens 20 aktive Mitglieder pro WG gedacht.',
			],
			[
				'2. Deckt sie Geld und Haushalt ab?',
				'Reine Ausgaben-Apps lösen das Geldproblem, Haushalts-Apps organisieren Aufgaben. Wollt ihr Geld und Haushalt wirklich an einem Ort regeln, braucht ihr eine App mit Kasse, Putzplan und Einkaufsliste, zum Beispiel ManaWG. ManaWG deckt beides ab: Ausgaben, Fixkosten und Monatsabrechnung auf der einen Seite, Putzplan mit Abwesenheiten, Einkaufsliste mit Vorräten, Kalender, Pinnwand und Chat auf der anderen.',
			],
			[
				'3. Wie gut ist die Kasse?',
				'Gute Kassen teilen ungleich, kennen Fixkosten, zeigen Salden und schlagen Ausgleiche mit wenigen Überweisungen vor. Achtet auch darauf, wie Cent-Reste behandelt werden und ob ihr vorhandene Daten als Datei importieren könnt.',
			],
			[
				'4. Wie fair ist der Putzplan?',
				'Entscheidend sind faire Rotation, Wiederholung in Tagen oder Monaten, Umgang mit Abwesenheit und Erinnerungen. Ein Punktesystem motiviert manche WGs, andere empfinden es als Gängelung. ManaWG verteilt nach Auslastung und kommt ohne Punkte aus.',
			],
			[
				'5. Müssen alle eine App installieren?',
				'Je höher die Hürde, desto eher macht jemand nicht mit. Eine Web-App, die im Browser läuft und per Link beitritt, senkt diese Hürde. ManaWG läuft ohne App Store und lässt sich auf den Home-Bildschirm legen.',
			],
			[
				'6. Datenschutz und Sprache',
				'Wo liegen die Daten, gibt es Werbung und Tracking, ist die App auf Deutsch? Bei ManaWG liegen die Daten in der EU, es gibt keine Werbung, und die App gibt es auf Deutsch und Englisch. Der Code ist Open Source unter Apache-2.0 und lässt sich selbst hosten, siehe [Open-Source-WG-App](/open-source-wg-app). Andere Währungen als Euro gibt es nicht. Wer international in vielen Währungen teilt, ist bei einer App mit Währungsumrechnung besser aufgehoben.',
			],
			[
				'7. Wie leicht ist der Umstieg?',
				'Wer Daten aus Splitwise oder Splid bereits als CSV-Datei hat, sollte sie mitnehmen können. ManaWG importiert Ausgaben aus solchen CSV-Dateien und zeigt vorher eine Vorschau, die Schritte stehen im [Umstieg](/splitwise-splid-wechseln). Ausführliche Vergleiche findet ihr unter [Splitwise-Alternative](/splitwise-alternative), [Splid-Alternative](/splid-alternative), [Flatastic-Alternative](/flatastic-alternative), [Tricount-Alternative](/tricount-alternative) und [OurHome-Alternative](/ourhome-alternative).',
			],
			[
				'Welche App passt zu welcher WG?',
				'Ihr teilt vor allem Geld, auch auf Reisen und in mehreren Währungen: Splid nennt über 150 Währungen, Tricount mehrere Währungen, Splitwise die Umrechnung im Pro-Tarif, jeweils laut Anbieter. ManaWG rechnet nur in Euro.\nIhr wollt Geld, Putzplan, Einkauf, Kalender und Pinnwand in einer deutschsprachigen App ohne Abo und ohne App Store: dafür ist ManaWG gebaut.\nIhr wollt Punkte oder Belohnungen fürs Putzen: Das bietet ManaWG nicht, der Putzplan verteilt nach Auslastung.\nIhr habt alte Ausgaben aus Splitwise oder Splid als CSV-Datei: ManaWG übernimmt sie mit Vorschau, die Schritte stehen im [Umstieg](/splitwise-splid-wechseln).\nIhr seid mehr als 20 Personen: Eine WG in ManaWG fasst höchstens 20 aktive Mitglieder.',
			],
		],
		faq: [
			[
				'Welche WG-App ist kostenlos?',
				'ManaWG ist vollständig kostenlos, ohne Werbung und ohne Bezahlstufe. Bei anderen Apps hängt der Umfang des kostenlosen Tarifs vom Anbieter ab und kann sich ändern.',
			],
			[
				'Gibt es eine WG-App mit Putzplan und Kasse in einem?',
				'Ja. ManaWG verbindet Ausgaben teilen, Putzplan, Einkaufsliste, Kalender, Pinnwand und Chat in einer App, auf Deutsch, in Euro und für bis zu 20 Mitglieder pro WG.',
			],
			[
				'Welche App eignet sich für Reisen mit mehreren Währungen?',
				'Dafür ist eine Ausgaben-App mit Wechselkursen besser geeignet. ManaWG rechnet nur in Euro und ist für den WG-Alltag gedacht.',
			],
			[
				'Wo liegen die Daten von ManaWG?',
				'Die Datenbank liegt bei Supabase in Frankfurt am Main (EU). Für den E-Mail-Versand wird Resend (USA) eingesetzt. Welche Daten an wen gehen, steht in der Datenschutzerklärung.',
			],
			[
				'Gibt es eine WG-App ohne App Store?',
				'Ja, zum Beispiel ManaWG: Die Web-App läuft im Browser unter app.manawg.com und lässt sich auf den Home-Bildschirm legen.',
			],
			[
				'Flatastic oder Splitwise: Was passt besser zu einer WG?',
				'Das hängt davon ab, was ihr braucht. Splitwise ist auf geteilte Ausgaben ausgerichtet. Flatastic verbindet laut Anbieter Putzplan, Einkaufsliste, Finanzen und Pinnwand, Premium ist kostenpflichtig. Wer Geld und Haushalt in einer kostenlosen deutschsprachigen Web-App ohne Werbung möchte, findet das in der [WG-App ManaWG](/wg-app), die dafür nur in Euro und für höchstens 20 Mitglieder rechnet.',
			],
		],
	},
	'splitwise-alternative': {
		link: 'Splitwise-Alternative',
		updated: '2026-10-29',
		published: '2026-10-09',
		title: 'Splitwise-Alternative ohne Werbung und Paywall | ManaWG',
		description:
			'ManaWG ist eine kostenlose Splitwise-Alternative für WGs: keine Werbung, keine Bezahlstufe, dazu Putzplan, Einkaufsliste und CSV-Import.',
		h1: 'Eine Splitwise-Alternative ohne Paywall und Werbung',
		intro:
			'Splitwise teilt Ausgaben zuverlässig und bietet mit Splitwise Pro laut Anbieter unter anderem unbegrenzte Ausgaben, keine Werbung, Belegscan und Währungsumrechnung. Was die kostenlose Version umfasst, steht unter [Splitwise kostenlos](/splitwise-kostenlos). ManaWG kostet nichts, zeigt keine Werbung und kennt keine Bezahlstufe. Dazu kommen Putzplan, Einkaufsliste und Kalender.',
		sources: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['ManaWG WG-App', 'https://manawg.com/wg-app'],
		],
		tables: [
			comparisonTable(
				'Splitwise',
				[
					'ja',
					NOT_CHECKED,
					NOT_CHECKED,
					NOT_CHECKED,
					NOT_CHECKED,
					'Umrechnung im Pro-Tarif laut Anbieter',
					'Pro-Tarif laut Anbieter; Umfang der kostenlosen Version nicht geprüft',
				],
				'Angaben zu Splitwise laut Pro-Seite des Anbieters, Stand 14. Oktober 2026. Was die Quellen nicht belegen, steht als „nicht geprüft“ da.',
			),
		],
		sections: [
			[
				'Was Splitwise Pro laut Anbieter enthält',
				'Die Pro-Seite von Splitwise nennt unter anderem unbegrenzte Ausgaben, keine Werbung, das Scannen von Belegen und die Umrechnung von Währungen. Aus Pro lassen sich keine genauen Grenzen der kostenlosen Version ableiten; Details zur kostenlosen Version haben wir hier nicht verifiziert, prüft das bei Splitwise selbst. Tarife ändern sich, verlasst euch deshalb auf die Anbieter-Seite mit Stand 14. Oktober 2026.',
			],
			[
				'Keine Bezahlstufe, keine Werbung',
				'In ManaWG stehen alle Funktionen jeder WG offen. Es gibt keine Anzeigen, kein Pro-Abo und keine Funktion, die erst nach einem Kauf freigeschaltet wird. Eine Grenze gibt es trotzdem: Eine WG fasst höchstens 20 aktive Mitglieder. Für Wohngemeinschaften reicht das, für große Gruppen nicht. Ausgezogene Mitglieder zählen nicht mit, ihre Historie bleibt erhalten. ManaWG ist außerdem Open Source unter der Apache-Lizenz 2.0, und ihr könnt eine eigene Kopie betreiben, siehe [Open-Source-WG-App](/open-source-wg-app).',
			],
			[
				'Fotos lesen, aber kein Kassenbon-Scanner',
				'Im Import wählt ihr die Quelle Screenshot. ManaWG liest ein Foto oder Bildschirmfoto einer Ausgabenliste per Texterkennung im Browser und zeigt eine Vorschau zum Korrigieren. Erkannt werden nur Eurobeträge, das Lesen kann bis zu 30 Sekunden dauern. Am einzelnen Beleg hängt ihr ein Foto nur an, es wird dort nicht ausgewertet.',
			],
			[
				'CSV-Import, falls eure Daten als Datei vorliegen',
				'Falls eure Splitwise-Ausgaben als CSV-Datei vorliegen, öffnet ihr den Import eurer WG und wählt die Quelle. Vor dem Speichern seht ihr eine Vorschau mit allen erkannten Zeilen. Danach steht der Import im Verlauf und lässt sich rückgängig machen, falls etwas nicht stimmt. Die Schritte stehen in der Anleitung zum [Umstieg](/splitwise-splid-wechseln). Die Historie anderer Mitglieder importieren dürfen nur WG-Admins.',
			],
			[
				'Nur Euro',
				'ManaWG rechnet ausschließlich in Euro und kennt keine Wechselkurse. Zeilen in anderen Währungen lehnt der Import einzeln ab, der Rest wird übernommen. Für Reisen mit mehreren Währungen ist eine App mit Währungsumrechnung die bessere Wahl, für den WG-Alltag in Euro genügt ManaWG. Die Beträge werden in Cent gespeichert, die Anteile gehen ohne Rundungsrest auf.',
			],
			[
				'Mehr als eine Kasse',
				'Ihr teilt gleichmäßig oder mit eigenen Beträgen, legt Fixkosten wie Miete an und bekommt Überweisungsvorschläge. Dazu gibt es Monatsabrechnung, Putzplan mit fairer Rotation, Einkaufsliste mit Übernahme als Ausgabe, Kalender-Abo, Pinnwand und Chat. Das Geld überweist ihr selbst, in ManaWG markiert ihr einzelne Anteile oder alles auf einmal als bezahlt. Eine Bankanbindung gibt es nicht. Die Kasse im Detail beschreibt die Seite [WG-Kasse](/wg-kasse), den Putzplan die Seite [WG Putzplan App](/putzplan).',
			],
		],
		faq: [
			[
				'Ist ManaWG wirklich kostenlos?',
				'Ja. Es gibt keine Bezahlstufe und keine Werbung. Alle Funktionen stehen jeder WG offen, einschließlich Import, Fixkosten und Monatsabrechnung. Die wichtigste Grenze sind 20 aktive Mitglieder pro WG, dazu kommen etwa Euro als einzige Währung und Größenlimits für Bilder.',
			],
			[
				'Kann ich meine Splitwise-Daten mitnehmen?',
				'Falls sie als CSV-Datei vorliegen: per CSV-Import. Ihr seht vorab eine Vorschau, und der Import lässt sich im Verlauf rückgängig machen. Nur Euro-Zeilen werden übernommen.',
			],
			[
				'Liest ManaWG Kassenbons per Foto?',
				'Nicht im engeren Sinn. Der Import liest Fotos oder Bildschirmfotos von Ausgabenlisten und erkennt Eurobeträge. Ein Foto am einzelnen Beleg wird nur angehängt, nicht ausgewertet.',
			],
			[
				'Funktioniert ManaWG auch mit Fremdwährungen?',
				'Nein. ManaWG rechnet nur in Euro, ohne Wechselkurse. Wer auf Reisen in mehreren Währungen teilt, ist bei einer App mit Währungsumrechnung besser aufgehoben.',
			],
			[
				'Gibt es eine App im App Store?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com und lässt sich als PWA auf den Home-Bildschirm legen. Es gibt keine native App, dafür Push-Benachrichtigungen, die ihr pro Bereich abschalten könnt.',
			],
		],
	},
	'splid-alternative': {
		link: 'Splid-Alternative',
		updated: '2026-10-27',
		published: '2026-10-10',
		title: 'Splid Alternative mit Putzplan und Einkaufsliste | ManaWG',
		description:
			'ManaWG ist eine kostenlose Splid Alternative für WGs: Ausgaben teilen plus Putzplan, Einkaufsliste, Fixkosten und Monatsabrechnung, ohne Werbung.',
		h1: 'Eine Splid Alternative mit Putzplan und Einkaufsliste',
		intro:
			'Splid teilt Ausgaben in Gruppen und nennt auf seiner deutschen Seite unter anderem über 150 Währungen, Offline-Nutzung sowie PDF- und Excel-Exporte. Für eine WG reicht eine reine Kasse oft nicht lange, denn der Haushalt besteht aus mehr als Rechnungen. ManaWG verbindet die Kasse mit dem Rest.',
		sources: [
			['Splid auf Deutsch', 'https://splid.app/german'],
			['ManaWG WG-App', 'https://manawg.com/wg-app'],
		],
		tables: [
			comparisonTable(
				'Splid',
				[
					'ja, in Gruppen',
					NOT_CHECKED,
					NOT_CHECKED,
					NOT_CHECKED,
					NOT_CHECKED,
					'über 150 laut Anbieter',
					NOT_CHECKED,
				],
				'Angaben zu Splid laut deutscher Seite des Anbieters, Stand 14. Oktober 2026. Was die Quellen nicht belegen, steht als „nicht geprüft“ da.',
			),
		],
		sections: [
			[
				'Was Splid laut Anbieter kann',
				'Die deutsche Splid-Seite nennt unter anderem über 150 Währungen, Gruppen vor Ort und online sowie den Export als PDF und Excel. Details zum Funktionsumfang stehen dort mit Stand 14. Oktober 2026. In ManaWG meldet sich dagegen jede Person mit Google oder E-Mail und Passwort an. Dafür gehören Ausgaben, Salden und Verlauf fest zu eurer WG, und Mitbewohner kommen per Einladungslink dazu. Einladungen könnt ihr jederzeit widerrufen.',
			],
			[
				'Kasse plus Haushalt in einer App',
				'ManaWG verbindet die Kasse mit dem Rest: Aufgaben wiederholen sich in Tagen oder Monaten und gehen fair an die Person mit der geringsten Auslastung, die Einkaufsliste sieht jeder auf dem Handy, und Fixkosten werden automatisch als Ausgabe gebucht. Zusätzlich gibt es Vorräte, Kalender, Pinnwand und Chat, falls ihr sie braucht. Wie die Kasse arbeitet, zeigt die Seite [WG Kasse App](/wg-kasse). Wie der Putzplan Aufgaben verteilt, steht bei der [WG Putzplan App](/putzplan).',
			],
			[
				'Fixkosten und Monatsabrechnung',
				'Miete, Internet oder Strom legt ihr einmal als Fixkosten an. Das Intervall zählt in ganzen Monaten, eine Vorlage lässt sich pausieren. Am Monatsende zeigt die Abrechnung Gesamtsumme, Ausgaben je Kategorie und Überweisungsvorschläge. Sie kommt am 1. des Monats per Mail, und jedes Mitglied kann das einzeln abschalten. Bei gleichmäßig geteilten Fixkosten wandert der Cent-Rest zur nächsten Person.',
			],
			[
				'Umzug per CSV-Import',
				'Falls eure Splid-Ausgaben als CSV-Datei vorliegen, ladet ihr sie unter Import in eurer WG hoch. Ihr seht erst eine Vorschau, bevor etwas gespeichert wird, und könnt den Import im Verlauf wieder rückgängig machen. Übernommen werden nur Euro-Zeilen, andere Währungen lehnt ManaWG einzeln ab. Fremde Historie importieren dürfen nur WG-Admins. Wer nur Screenshots hat, liest ein Foto einer Ausgabenliste ein und korrigiert es vor dem Speichern. Die Anleitung zum [Umstieg](/splitwise-splid-wechseln) führt durch alle Schritte.',
			],
			[
				'Aufteilen und ausgleichen',
				'Ausgaben teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person. Die Cent gehen exakt auf. ManaWG schlägt vor, wer wem wie viel überweist, mit wenigen Zahlungen. Die Überweisung selbst macht ihr außerhalb der App und markiert den Betrag danach als bezahlt. Eine Erinnerung an Offenes gibt es auch, mit Abkühlzeit, damit niemand genervt wird.',
			],
			[
				'Grenzen von ManaWG',
				'Eine WG fasst höchstens 20 aktive Mitglieder. Die App gibt es auf Deutsch und Englisch, sie rechnet nur in Euro. Es gibt keine App im App Store, ihr nutzt ManaWG im Browser unter app.manawg.com und legt sie auf dem Handy auf den Home-Bildschirm. Auch Kalender-Abo und Push-Hinweise funktionieren so, ohne dass ihr etwas aus dem Store installieren müsst.',
			],
		],
		faq: [
			[
				'Braucht ManaWG ein Konto?',
				'Ja. Jede Person meldet sich mit Google oder mit E-Mail und Passwort an. Beitreten geht danach per Einladungslink.',
			],
			[
				'Wie übernehme ich meine Daten aus Splid?',
				'Falls sie als CSV-Datei vorliegen, ladet ihr die Datei unter Import in eurer WG hoch. Nach der Vorschau bestätigt ihr den Import. Falls etwas nicht stimmt, macht ihr ihn im Verlauf rückgängig.',
			],
			[
				'Was kostet ManaWG?',
				'Nichts. Es gibt keine Bezahlstufe und keine Werbung. Alle Funktionen stehen jeder WG offen, auch Putzplan, Einkaufsliste und Fixkosten, ohne Aufpreis.',
			],
			[
				'Kann ich Fremdwährungen eintragen?',
				'Nein. ManaWG rechnet nur in Euro. Beim Import werden Zeilen in anderen Währungen einzeln abgelehnt, der Rest des Imports bleibt davon unberührt.',
			],
			[
				'Gibt es ManaWG im App Store?',
				'Nein. ManaWG läuft im Browser und lässt sich auf iPhone und Android als App auf den Home-Bildschirm legen. Ein Download aus dem Store ist nicht nötig.',
			],
		],
	},
	'flatastic-alternative': {
		link: 'Flatastic-Alternative',
		updated: '2026-10-27',
		published: '2026-10-10',
		title: 'Flatastic-Alternative ohne Werbung und Premium | ManaWG',
		description:
			'ManaWG ist eine kostenlose Flatastic-Alternative für WGs: Putzplan, WG-Kasse, Einkauf, Kalender und Chat, ohne Werbung und ohne Premium-Stufe.',
		h1: 'Flatastic-Alternative: WG-App ohne Werbung und Premium',
		intro:
			'Flatastic organisiert laut Anbieter Aufgaben, Einkäufe, Finanzen und Pinnwand und bietet ein kostenpflichtiges Premium unter anderem ohne Werbung und mit Verläufen. Den aktuellen Stand prüft ihr am besten selbst bei Flatastic. ManaWG ist kostenlos und kommt ohne Werbung und ohne Bezahlstufe aus.',
		sources: [
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['ManaWG WG-App', 'https://manawg.com/wg-app'],
		],
		tables: [
			comparisonTable(
				'Flatastic',
				[
					'Finanzen laut Anbieter',
					'Aufgaben laut Anbieter',
					'Einkäufe laut Anbieter',
					NOT_CHECKED,
					'Pinnwand laut Anbieter, Chat nicht geprüft',
					NOT_CHECKED,
					'Premium kostenpflichtig laut Anbieter; Umfang der kostenlosen Version nicht geprüft',
				],
				'Angaben zu Flatastic laut Seiten des Anbieters, Stand 14. Oktober 2026. Was die Quellen nicht belegen, steht als „nicht geprüft“ da.',
			),
			{
				after: 'Was Flatastic Premium freischaltet',
				title: 'Flatastic Premium und ManaWG',
				header: ['Funktion', 'Flatastic laut Anbieter', 'ManaWG'],
				rows: [
					['Werbung', 'ohne Werbung mit Premium', 'keine Werbung'],
					['Putzplan-Verlauf', 'Premium', 'Historie jeder Erledigung'],
					[
						'Frühere Abrechnungen',
						'Premium (Archiv der Budgetauswertungen)',
						'Monatsabrechnung, Monate blätterbar, Druck als PDF',
					],
					[
						'Export',
						'CSV der Finanzeinträge mit Premium',
						'JSON und CSV je Bereich für jedes Mitglied',
					],
					['Bilder an Ausgaben', 'Premium', 'Foto am Beleg, wird angehängt, nicht ausgewertet'],
				],
				note: 'Angaben zu Flatastic laut Premium-Seite des Anbieters, Stand 27. Oktober 2026. Nicht Belegtes steht als „nicht geprüft“ da.',
			},
		],
		sections: [
			[
				'Kostenlos, ohne Werbung, ohne Premium',
				'ManaWG zeigt keine Werbung und kennt keine Bezahlstufe: Jede WG nutzt Ausgaben, Putzplan, Einkauf, Vorräte, Kalender, Chat und Pinnwand. Ob ihr zu zweit oder zu zehnt seid, ändert daran nichts, solange die WG in das Limit von 20 aktiven Mitgliedern passt. Ausgezogene Personen zählen nicht mit, ihre Historie bleibt erhalten.',
			],
			[
				'Was Flatastic Premium freischaltet',
				'Flatastic ist kostenlos nutzbar und bietet ein kostenpflichtiges Premium. Die Premium-Seite des Anbieters nennt unter anderem den Verzicht auf Werbung, den Verlauf des Putzplans, Zugriff auf frühere Budgetauswertungen im Archiv, Bilder an Ausgaben und einen CSV-Export der Finanzeinträge (abgerufen am 27. Oktober 2026). Preise nennen wir nicht, sie ändern sich; ihr findet sie beim Anbieter. In ManaWG sind alle Bereiche ohne Bezahlstufe offen.',
			],
			[
				'Erinnerungen, die ihr selbst steuert',
				'Jedes Mitglied schaltet Push-Benachrichtigungen pro Bereich einzeln ab: Ankündigungen, Putzplan, Ausgaben, Einkauf, Vorräte, Erinnerungen, Chat und Termine. Der Putzplan erinnert an heute fällige und bis zu sieben Tage überfällige Aufgaben, die jemandem zugewiesen sind, höchstens alle 18 Stunden pro Aufgabe. Termine melden sich am Tag davor, auch Serientermine. Mails wie Digest oder Monatsabrechnung lassen sich ebenfalls abschalten.',
			],
			[
				'Putzplan mit fairer Rotation',
				'Aufgaben wiederholen sich im Rhythmus von Tagen oder Monaten. Beim Erledigen bestimmt ManaWG nach Auslastung, wer als Nächstes zuständig ist. Wer abwesend ist, wird dabei übergangen, und die App nennt, wie viele Personen deshalb ausgelassen werden. Monatsintervalle bleiben kalendertreu, gerechnet wird nach Berliner Zeit. Erledigte Aufgaben landen in der Historie. Mehr dazu steht auf der Seite [WG Putzplan App](/putzplan).',
			],
			[
				'WG-Kasse und Umstieg',
				'Ausgaben teilt ihr gleichmäßig oder mit eigenen Beträgen, auf den Cent genau. ManaWG zeigt Salden und schlägt Ausgleiche mit wenigen Überweisungen vor. Dazu kommen Fixkosten und eine Monatsabrechnung. Falls eure Splitwise- oder Splid-Ausgaben als CSV-Datei vorliegen, lassen sie sich mit Vorschau importieren, siehe [Umstieg](/splitwise-splid-wechseln). Einen Flatastic-Import gibt es nicht, Altdaten legt ihr bei Bedarf von Hand neu an. Die Kasse im Überblick beschreibt die Seite [WG Kasse App](/wg-kasse).',
			],
			[
				'Einkauf, Pinnwand und Chat',
				'Die Einkaufsliste erkennt Duplikate und schlägt nach dem Abhaken vor, den Einkauf direkt als Ausgabe zu erfassen. Vorräte zeigen eine Menge und einen Schwellwert, und „Schnell nachfüllen“ schlägt fast Leeres vor. Die Pinnwand sammelt Infos und Entscheidungen der WG, im Chat antwortet ihr, reagiert mit Emojis und erwähnt Mitbewohner mit @.',
			],
			[
				'Was ManaWG nicht kann',
				'Die Oberfläche gibt es auf Deutsch und Englisch, Beträge nur in Euro, und eine WG fasst höchstens 20 aktive Mitglieder. Es gibt keine App im Store, ManaWG installiert ihr als Web-App auf dem Home-Bildschirm. Ausgleiche markiert ihr selbst als bezahlt, eine Überweisung löst die App nicht aus. Kalender gibt es als Abo für Apple und Google Kalender, aber nur in eine Richtung.',
			],
		],
		faq: [
			[
				'Ist ManaWG wirklich kostenlos?',
				'Ja. Es gibt keine Bezahlstufe und keine Funktion, die ihr freischalten müsstet. Alle Bereiche stehen jeder WG offen, von Ausgaben bis Chat.',
			],
			[
				'Zeigt ManaWG Werbung?',
				'Nein. In ManaWG erscheint keine Werbung, und es gibt keine Funktionen, die erst nach einem Upgrade nutzbar sind.',
			],
			[
				'Kann ich meine Daten aus Flatastic übernehmen?',
				'Einen direkten Flatastic-Import gibt es nicht. Falls eure Splitwise- oder Splid-Ausgaben als CSV-Datei vorliegen, importiert ihr sie mit Vorschau, Importverlauf und Rückgängig-Funktion. Es werden nur Euro-Beträge übernommen, andere Währungen werden abgelehnt.',
			],
			[
				'Gibt es ManaWG im App Store?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com und lässt sich auf iPhone und Android auf den Home-Bildschirm legen. Es braucht keinen Store-Download.',
			],
			[
				'Wie genau lassen sich Erinnerungen einstellen?',
				'Push-Benachrichtigungen schaltet jedes Mitglied pro Bereich einzeln ab, etwa für Putzplan, Ausgaben oder Chat. Der tägliche Digest und die Monatsabrechnung per Mail haben einen Abmeldelink.',
			],
			[
				'Ist Flatastic kostenlos?',
				'Laut Anbieter ist Flatastic kostenlos nutzbar und bietet ein kostenpflichtiges Premium. Die Premium-Seite nennt unter anderem den Verzicht auf Werbung, den Verlauf des Putzplans, frühere Budgetauswertungen, Bilder an Ausgaben und den CSV-Export der Finanzeinträge (abgerufen am 27. Oktober 2026). ManaWG hat keine Bezahlstufe.',
			],
			[
				'Hat Flatastic ein Punktesystem fürs Putzen?',
				'Laut Startseite des Anbieters ja, ein Punktesystem soll alle bei der Stange halten (abgerufen am 27. Oktober 2026). In ManaWG gibt es keine Punkte: Der Putzplan verteilt Aufgaben nach Auslastung und zeigt vorab, wer als Nächstes dran ist. Mehr auf der Seite [WG Putzplan App](/putzplan).',
			],
		],
	},
	'tricount-alternative': {
		link: 'Tricount-Alternative',
		updated: '2026-10-27',
		published: '2026-10-27',
		title: 'Tricount-Alternative für WG und feste Gruppen | ManaWG',
		description:
			'Tricount rechnet mit mehreren Währungen und passt zu Reisen. Für die WG mit Miete, Fixkosten und Putzplan passt ManaWG: kostenlos, im Browser, mit Abrechnung.',
		h1: 'Tricount-Alternative für WG und feste Gruppen',
		intro:
			'Tricount teilt Ausgaben in Gruppen und rechnet laut Anbieter mit mehreren Währungen. Wer dauerhaft zusammenwohnt, braucht dazu meist Miete, Fixkosten und einen Putzplan. ManaWG verbindet das in einer kostenlosen Web-App auf Deutsch. Die Angaben zu Tricount stammen von den verlinkten Seiten des Anbieters und von bunq, abgerufen am 27. Oktober 2026.',
		sources: [
			['Tricount Funktionen', 'https://tricount.com/features'],
			[
				'Tricount im App Store',
				'https://apps.apple.com/de/app/tricount-ausgaben-teilen/id349866256',
			],
			[
				'bunq: Tricount',
				'https://press.bunq.com/246591-von-roadtrips-bis-reisekosten-tricount-app-zahlt-satte-16-4-milliarden-euro-an-gruppenausgaben-im-jahr-2024/',
			],
			['ManaWG WG-App', 'https://manawg.com/wg-app'],
		],
		tables: [
			comparisonTable(
				'Tricount',
				[
					'ja',
					NOT_CHECKED,
					NOT_CHECKED,
					NOT_CHECKED,
					NOT_CHECKED,
					'mehrere Währungen laut Anbieter',
					'kostenlos laut Anbieter',
				],
				'Angaben zu Tricount laut Funktionsseite und App-Store-Eintrag des Anbieters, abgerufen am 27. Oktober 2026. Was die Quellen nicht belegen, steht als „nicht geprüft“ da.',
			),
		],
		sections: [
			[
				'Was Tricount gut kann',
				'Laut Anbieter ist Tricount kostenlos und rechnet mit mehreren Währungen. Ausgaben lassen sich ohne Netz erfassen und später synchronisieren. Tricount gehört seit 2022 zu bunq, und eine bunq-Karte lässt sich mit Tricount koppeln. Tarife und Funktionen ändern sich, prüft den aktuellen Stand bei Tricount selbst.',
			],
			[
				'Wann ihr bei Tricount bleiben solltet',
				'Für Reisen mit Fremdwährung ist Tricount die bessere Wahl, denn ManaWG rechnet nur in Euro. Das Gleiche gilt, wenn ihr eine Gruppe mit mehr als 20 Personen abrechnet. Auch wer nur eine einzelne Reise teilt, braucht weder Fixkosten noch Putzplan.',
			],
			[
				'Wann ManaWG besser passt',
				'Ihr wohnt dauerhaft zusammen und teilt Ausgaben jeden Monat.\nMiete, Internet und Strom legt ihr einmal als Fixkosten an, im Rhythmus ganzer Monate. ManaWG bucht sie automatisch.\nDie Monatsabrechnung zeigt Gesamtsumme, Ausgaben je Kategorie und Überweisungsvorschläge mit wenigen Zahlungen.\nAn offene Beträge könnt ihr die Schuldner erinnern, mit Abkühlzeit gegen Dauerpiepen.\nPutzplan, Einkaufsliste und Kalender stehen in derselben App, dazu Pinnwand und Chat. Die Kasse im Detail beschreibt die Seite [WG-Kasse](/wg-kasse).',
			],
			[
				'Grenzen',
				'Beträge nur in Euro, Zeilen in anderen Währungen lehnt der Import einzeln ab.\nManaWG läuft im Browser und lässt sich auf den Home-Bildschirm legen. Eine native App im Store gibt es nicht.\nEine WG fasst höchstens 20 aktive Mitglieder.\nKeine Bankanbindung: Ihr überweist selbst und markiert Beträge danach als bezahlt.\nKein Import aus Tricount: Der Import liest nur CSV-Dateien aus Splitwise und Splid sowie Bildschirmfotos von Ausgabenlisten.',
			],
			[
				'Umstieg von Tricount',
				'Gleicht offene Beträge am besten in Tricount aus und startet in ManaWG ohne Altlasten. Wollt ihr den Stand übernehmen, lest ihr ein Bildschirmfoto der Ausgabenliste im Import ein. ManaWG zeigt eine Vorschau zum Korrigieren und erkennt nur Eurobeträge. Oder jemand trägt für jede Person, die noch Geld bekommt, eine Ausgabe mit ihr als Zahlerin ein und teilt sie von Hand auf die Schuldner auf. Wie ein Import abläuft, steht in der Anleitung zum [Umstieg](/splitwise-splid-wechseln).',
			],
		],
		faq: [
			[
				'Kann ich Daten aus Tricount in ManaWG importieren?',
				'Nicht direkt. Der Import kennt CSV-Dateien aus Splitwise und Splid sowie Bildschirmfotos von Ausgabenlisten, die per Texterkennung gelesen und vor dem Speichern korrigiert werden. Einen Tricount-Import gibt es nicht.',
			],
			[
				'Kann ManaWG Fremdwährungen?',
				'Nein. ManaWG rechnet nur in Euro und kennt keine Wechselkurse. Für Reisen mit mehreren Währungen passt Tricount besser.',
			],
			[
				'Was kostet ManaWG?',
				'Nichts. Es gibt keine Werbung und keine Bezahlstufe. Alle Funktionen stehen jeder WG offen.',
			],
			[
				'Gibt es ManaWG im App Store?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com und lässt sich auf iPhone und Android auf den Home-Bildschirm legen.',
			],
			[
				'Für wie viele Personen eignet sich ManaWG?',
				'Eine WG fasst bis zu 20 aktive Mitglieder. Ausgezogene Mitglieder zählen nicht mit, ihre Historie bleibt erhalten.',
			],
		],
	},
	'ourhome-alternative': {
		link: 'OurHome-Alternative',
		updated: '2026-10-27',
		published: '2026-10-10',
		title: 'OurHome-Alternative für WGs, kostenlos | ManaWG',
		description:
			'ManaWG als Alternative zu OurHome: kostenloser Putzplan und WG-Kasse im Browser. Der aktuelle Funktionsumfang von OurHome wurde nicht verifiziert.',
		h1: 'Eine OurHome-Alternative für WGs',
		intro:
			'Ob und in welchem Umfang OurHome aktuell verfügbar ist, haben wir nicht verifiziert (Stand 14. Oktober 2026), prüft das selbst. Im Folgenden beschreiben wir nur, wie ManaWG Putzplan und Kasse für WGs löst.',
		sources: [['ManaWG WG-App', 'https://manawg.com/wg-app']],
		tables: [
			comparisonTable(
				'OurHome',
				[NOT_CHECKED, NOT_CHECKED, NOT_CHECKED, NOT_CHECKED, NOT_CHECKED, NOT_CHECKED, NOT_CHECKED],
				'Zu OurHome liegt keine geprüfte Quelle vor, deshalb steht dort überall „nicht geprüft“. Die ManaWG-Spalte stammt aus der App.',
			),
		],
		sections: [
			[
				'Fairness statt Punkte',
				'Wenn jemand eine Aufgabe erledigt, schaut ManaWG, wer gerade am wenigsten ausgelastet ist, und weist diese Person zu. Gezählt werden zugewiesene und überfällige Aufgaben, Überfälliges zählt stärker. Wer schon viel zu tun hat, bekommt nicht noch mehr dazu. In der App steht unter „Nächste:r“, wer dran ist. Wer verreist ist, trägt eine Abwesenheit ein und wird bei der nächsten Zuweisung übergangen. Schon zugewiesene Aufgaben bleiben bei der Person. Ein Belohnungssystem gibt es nicht. Die Funktion im Detail steht auf der Seite [WG Putzplan App](/putzplan).',
			],
			[
				'Putzplan mit festem Rhythmus',
				'Aufgaben wiederholen sich in Tagen oder Monaten und sind einem Mitglied zugewiesen. Ob Bad, Küche oder Müll: Ihr entscheidet, wie oft eine Aufgabe wiederkommt. Monatsintervalle bleiben kalendertreu. Erledigte Aufgaben bleiben als Historie sichtbar. Wer zuständig ist, bekommt morgens eine Push-Erinnerung, wenn die Aufgabe heute fällig ist oder bis zu sieben Tage überfällig.',
			],
			[
				'Kasse und Putzplan in einer App',
				'Ausgaben teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person. ManaWG rechnet in Cent, die Anteile ergeben immer genau den Betrag. Jede Ausgabe bekommt eine von sechs Kategorien, etwa Lebensmittel oder Haushalt. Die App zeigt Salden und schlägt Überweisungen vor, damit wenige nötig sind. Bezahlt markiert ihr per Hand, ManaWG selbst überweist kein Geld. Mehr zur Abrechnung unter [WG-Kasse](/wg-kasse).',
			],
			[
				'Fixkosten und Monatsabrechnung',
				'Miete, Internet und Strom legt ihr als Fixkosten an. Sie werden im Monatsrhythmus automatisch als Ausgaben gebucht. Die Monatsabrechnung zeigt Gesamtsumme, Ausgaben je Kategorie und wer wem wie viel überweist. Per Mail kommt sie am Monatsanfang automatisch, jedes Mitglied kann das abschalten. Fixkosten lassen sich pausieren. Das Intervall zählt in ganzen Monaten, wöchentliche Fixkosten gibt es nicht.',
			],
			[
				'Einkauf, Vorräte und Kalender',
				'Die Einkaufsliste gehört der ganzen WG. Wer einkauft, sieht, was schon abgehakt ist. Nach dem Abhaken fragt ManaWG, ob ihr den Einkauf direkt als Ausgabe erfassen wollt. Dazu kommen eine Vorratsübersicht, ein Kalender mit Abo für Apple oder Google Kalender, Pinnwand und Chat.',
			],
			[
				'Web statt Store',
				'ManaWG läuft unter app.manawg.com und lässt sich auf dem Home-Bildschirm installieren. Die Daten liegen zentral auf dem Server, nicht auf einem einzelnen Gerät. Aktionen ohne Netz merkt sich die App und sendet sie später nach. Anmelden könnt ihr euch mit Google oder E-Mail und Passwort. Beitreten geht per Einladungslink oder E-Mail-Einladung.',
			],
		],
		faq: [
			[
				'Gibt es in ManaWG Punkte oder Belohnungen?',
				'Nein. ManaWG verteilt Aufgaben nach Auslastung: Je Person zählen zugewiesene und überfällige Aufgaben, Abwesenheiten werden berücksichtigt. Punkte oder Belohnungen gibt es nicht.',
			],
			[
				'Kostet ManaWG etwas?',
				'Nein. ManaWG ist kostenlos, zeigt keine Werbung und hat keine Bezahlstufe. Alle Funktionen stehen jeder WG offen, auch Putzplan, Kasse und Kalender.',
			],
			[
				'Gibt es ManaWG im App Store?',
				'Nein. ManaWG ist eine Web-App. Ihr öffnet app.manawg.com im Browser und legt die App auf iPhone oder Android auf den Home-Bildschirm.',
			],
			[
				'Gibt es ManaWG auch auf Englisch?',
				'Ja. Die App gibt es auf Deutsch und Englisch, sie folgt der Sprache des Geräts und lässt sich in der App umstellen. Währungen außer Euro lassen sich in der Bedienung nicht auswählen.',
			],
			[
				'Wie viele Leute passen in eine WG?',
				'Eine WG fasst bis zu 20 aktive Mitglieder. Ausgezogene Mitglieder zählen nicht mit, ihre Historie bleibt erhalten. Admins können den Code erneuern oder das Beitreten sperren.',
			],
		],
	},
	faq: {
		link: 'Häufige Fragen',
		updated: '2026-10-29',
		published: '2026-10-09',
		title: 'Häufige Fragen zu ManaWG: Kosten, Anmeldung, Datenort',
		description:
			'Ist ManaWG kostenlos? Gibt es die WG-App im App Store? Antworten zu Anmeldung, Putzplan, Export, Datenort in Frankfurt und Import aus Splitwise oder Splid.',
		h1: 'Häufige Fragen zu ManaWG',
		intro:
			'Das Wichtigste zu ManaWG, der kostenlosen [WG-App](/wg-app) für Wohngemeinschaften: Kosten, Installation, Einladung, Geld, Putzplan, Abwesenheiten, Währung, Datenort, Import und Selbsthosten.',
		sections: [],
		faq: [
			[
				'Was kostet ManaWG?',
				'Nichts. ManaWG ist kostenlos, ohne Werbung und ohne Bezahlstufe. Eine WG fasst bis zu 20 aktive Mitglieder.',
			],
			[
				'Brauche ich einen App Store?',
				'Nein. ManaWG ist eine [Web-App](/wg-app) und läuft im Browser unter app.manawg.com. Auf dem Handy könnt ihr die App auf den Home-Bildschirm legen. Push-Meldungen schaltet ihr je Bereich ein oder aus.',
			],
			[
				'Wie kommen meine Mitbewohner in die WG?',
				'Eine Person erstellt die WG und teilt den Einladungslink. Die anderen melden sich mit Google oder E-Mail an und treten per Link bei.',
			],
			[
				'Wie werden Ausgaben aufgeteilt?',
				'Bei jeder Ausgabe wählt ihr, wer beteiligt ist, und teilt gleichmäßig oder mit eigenen Beträgen pro Person, auf den Cent genau. Die [WG-Kasse](/wg-kasse) zeigt den Saldo pro Person und schlägt Ausgleiche mit wenigen Überweisungen vor. Überwiesen wird außerhalb der App, ihr markiert den Betrag danach als bezahlt.',
			],
			[
				'Wie funktioniert der Putzplan?',
				'Im [Putzplan](/putzplan) hat jede Aufgabe einen Rhythmus in Tagen oder Monaten. Beim Erledigen wählt ManaWG die Person mit der geringsten Auslastung; gezählt werden zugewiesene und überfällige Aufgaben. Wer abwesend ist, wird übergangen. Punkte oder Belohnungen gibt es nicht.',
			],
			[
				'Was passiert, wenn jemand verreist ist?',
				'Mitglieder tragen einen Abwesenheitszeitraum ein, zum Beispiel für einen Urlaub. Wer abwesend ist, wird bei der nächsten Zuweisung im Putzplan übergangen.',
			],
			[
				'Kann ich Daten aus Splitwise oder Splid mitnehmen?',
				'Falls eure Daten als CSV-Datei vorliegen: per [CSV-Import mit Vorschau](/splitwise-splid-wechseln). Beim Import lässt sich auch ein Foto oder Bildschirmfoto einer Ausgabenliste per Texterkennung einlesen und vor dem Speichern korrigieren; ein Foto am einzelnen Beleg wird nur angehängt, nicht ausgewertet.',
			],
			[
				'Was gibt es außer Geld und Putzen?',
				'Eine [gemeinsame Einkaufsliste](/einkaufsliste) mit Vorräten, Fixkosten, einen Kalender, den ihr auch abonnieren könnt, eine Pinnwand und einen Chat.',
			],
			[
				'Wie melde ich mich an?',
				'Mit Google oder mit E-Mail und Passwort. Beitreten geht per Einladungslink, den euch ein Mitbewohner schickt.',
			],
			[
				'Funktioniert ManaWG mit anderen Währungen?',
				'Nein. ManaWG rechnet nur in Euro, ohne Wechselkurse. Wer auf Reisen in mehreren Währungen teilt, ist bei einer App mit Währungsumrechnung besser aufgehoben. Worauf es bei der Wahl einer App ankommt, steht unter [Beste WG-App](/beste-wg-app).',
			],
			[
				'Überweist ManaWG Geld automatisch?',
				'Nein. ManaWG berechnet Vorschläge, ihr überweist selbst außerhalb der App und markiert Beträge als bezahlt. Eine Bankanbindung gibt es nicht.',
			],
			[
				'Wo liegen meine Daten?',
				'Die Datenbank liegt bei Supabase in Frankfurt am Main (EU). Für den E-Mail-Versand wird Resend (USA) eingesetzt. Welche Daten an wen gehen, steht in der Datenschutzerklärung.',
			],
			[
				'Ist ManaWG Open Source?',
				'Ja. ManaWG steht unter der Apache-Lizenz 2.0, der Quellcode liegt auf GitHub unter github.com/Abuarchiv/manawg. Diese Website hat ein eigenes Repository, Abuarchiv/manawg-landing. Mehr steht unter [Open-Source-WG-App](/open-source-wg-app).',
			],
			[
				'Kann ich ManaWG selbst hosten?',
				'Ja, mit Docker Compose: Das Repository enthält ein Setup, das App, PostgreSQL, Anmeldung und Bildspeicher auf einer Maschine startet, beschrieben in docs/self-hosting.md (deutsch: docs/self-hosting.de.md) auf GitHub. Die meisten WGs brauchen das nicht, weil app.manawg.com kostenlos ist. Wer die Daten auf einer Maschine unter eigener Kontrolle haben will, findet Schritte und Grenzen unter [Open-Source-WG-App](/open-source-wg-app).',
			],
			[
				'Funktioniert ManaWG ohne Internet?',
				'Teilweise. Fehlt unterwegs das Netz, speichert ManaWG neue Einträge auf dem Gerät und sendet sie, sobald ihr wieder online seid: Einkaufseinträge, Abwesenheiten, neue und erledigte Putzaufgaben, Ausgaben und Fixkosten. Nach etwa sieben Tagen werden liegen gebliebene Aktionen nicht mehr automatisch gesendet, sondern euch zur Prüfung angezeigt.',
			],
			[
				'Kann ich unsere WG-Daten exportieren?',
				'Ja. Jedes Mitglied lädt die Daten der WG in den Einstellungen unter Daten herunter, komplett als JSON oder einzelne Bereiche als CSV, etwa Ausgaben, Fixkosten, Einkauf oder Putzplan. Die Monatsabrechnung lässt sich über „Als PDF“ drucken oder als PDF speichern.',
			],
			[
				'Wie erinnere ich Mitbewohner ans Bezahlen?',
				'Auf der Seite Mahnungen gibt es einen Erinnern-Knopf. Für dieselben zwei Personen geht höchstens alle 48 Stunden eine Erinnerung raus.',
			],
			[
				'Wie installiere ich ManaWG auf dem iPhone?',
				'In Safari app.manawg.com öffnen, auf Teilen tippen, „Zum Home-Bildschirm“ wählen und oben rechts auf Hinzufügen tippen. Danach ManaWG vom Home-Bildschirm öffnen und einmal anmelden.',
			],
			[
				'Wer steckt hinter ManaWG?',
				'Betreiber ist Abubakar Abditube, mehr unter [Über ManaWG](/ueber-manawg). ManaWG wird privat und nicht-kommerziell betrieben, Kontakt: info@manawg.com.',
			],
			[
				'Hat ManaWG etwas mit WireGuard zu tun?',
				'Nein. WireGuard ist ein VPN-Protokoll. ManaWG steht für Wohngemeinschaft (WG) und ist eine Haushalts-App.',
			],
		],
	},
	'ueber-manawg': {
		link: 'Über ManaWG',
		updated: '2026-10-29',
		published: '2026-10-11',
		title: 'Was ist ManaWG? Die kostenlose WG-App im Überblick',
		description:
			'ManaWG ist eine kostenlose Open-Source-WG-App für Ausgaben, Einkauf, Putzplan, Kalender, Pinnwand und Chat. Fakten, Betreiber, Abgrenzung zu WireGuard.',
		h1: 'Was ist ManaWG?',
		intro:
			'ManaWG ist eine kostenlose Open-Source-Web-App für Wohngemeinschaften, auf Deutsch und Englisch. Sie bündelt Ausgaben teilen, Einkaufsliste, Putzplan, Kalender, Pinnwand und Chat. ManaWG hat nichts mit dem VPN-Protokoll WireGuard zu tun.',
		sources: [
			['Impressum', '/impressum'],
			['Datenschutz', '/datenschutz'],
			['AGB', '/agb'],
		],
		sections: [
			[
				'Kurzfassung',
				'ManaWG (auch Mana WG) ist eine Haushalts-App für Wohngemeinschaften. Mitbewohner teilen Ausgaben und gleichen Salden mit wenigen Überweisungen aus, führen eine gemeinsame Einkaufsliste, organisieren einen fair verteilten Putzplan und halten Absprachen an einer Pinnwand fest. Die App ist kostenlos, werbefrei und läuft im Browser unter app.manawg.com.',
			],
			[
				'Fakten auf einen Blick',
				'Preis: kostenlos, keine Werbung, keine Bezahlstufe. Sprachen: Deutsch und Englisch, Währung: Euro. Plattform: Web-App (PWA), installierbar auf iPhone, Android und Desktop, ohne App Store. Anmeldung: Google oder E-Mail. Größe: bis zu 20 aktive Mitglieder pro WG. Daten: in der EU gespeichert (Frankfurt am Main). Beitritt: per Einladungslink. Lizenz: Apache-2.0, Quellcode auf GitHub, selbst hostbar mit Docker, mehr unter [Open-Source-WG-App](/open-source-wg-app).',
			],
			[
				'Funktionen',
				'Ausgaben gleichmäßig oder mit eigenen Beträgen teilen, Fixkosten und Monatsabrechnung, Import von Splitwise- und Splid-CSV-Dateien, Einkaufsliste mit Vorräten, Putzplan mit fairer Rotation und Abwesenheiten, Kalender mit Kalender-Abo, Pinnwand, Chat und Push-Erinnerungen. Eine Bankanbindung und Überweisungen aus der App gibt es nicht. Die Einzelheiten stehen unter [WG-App](/wg-app), der Vergleich mit Splitwise unter [Splitwise-Alternative](/splitwise-alternative), häufige Fragen unter [Häufige Fragen](/faq).',
			],
			[
				'Betreiber und Kontakt',
				'Betreiber ist Abubakar Abditube. ManaWG wird privat und nicht-kommerziell betrieben. Kontakt: info@manawg.com.',
			],
			[
				'Abgrenzung: ManaWG und WireGuard',
				'Der Name wird manchmal mit WireGuard verwechselt, einem VPN-Protokoll. Beide haben nichts miteinander zu tun. ManaWG steht für eine Wohngemeinschaft (WG), nicht für WireGuard.',
			],
			[
				'Für wen die App gedacht ist',
				'Für Studenten-WGs, Zweck-WGs und alle, die sich Wohnung und Haushaltskasse teilen. Für große Gruppen über 20 Mitglieder, Reisen mit mehreren Währungen oder Firmenbuchhaltung ist sie nicht gedacht.',
			],
		],
		faq: [
			[
				'Was ist ManaWG?',
				'Eine kostenlose Open-Source-WG-App für Ausgaben, Einkauf, Putzplan, Kalender, Pinnwand und Chat. Sie läuft im Browser unter app.manawg.com.',
			],
			[
				'Hat ManaWG etwas mit WireGuard zu tun?',
				'Nein. ManaWG ist eine Haushalts-App für Wohngemeinschaften. WireGuard ist ein VPN-Protokoll.',
			],
			['Wo liegen die Daten von ManaWG?', 'In der EU, auf Servern in Frankfurt am Main.'],
		],
	},
};
