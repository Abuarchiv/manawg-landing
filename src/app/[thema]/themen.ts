// Themenseiten für Suchanfragen, die die Startseite allein nicht abdeckt.
// Nur Funktionen nennen, die es in manawg-app wirklich gibt.
import { RATGEBER } from './ratgeber';

export interface Thema {
	/** Kurzer Linktext für Querverweise. */
	link: string;
	titel: string;
	beschreibung: string;
	h1: string;
	einleitung: string;
	abschnitte: Array<[string, string]>;
	/** Wird zusätzlich als FAQPage-JSON-LD ausgegeben. */
	fragen?: Array<[string, string]>;
	/** Letzte inhaltliche Änderung (ISO-Datum), für lastmod in der Sitemap. */
	stand: string;
	/** Erste Veröffentlichung (ISO-Datum), für datePublished. */
	erschienen: string;
	/** Belege als [Name, URL]; erscheinen als Quellenliste, Article-citation und llms-full. */
	quellen?: Array<[string, string]>;
}

export const THEMEN: Record<string, Thema> = {
	'wg-app': {
		link: 'WG-App',
		stand: '2026-10-14',
		erschienen: '2026-10-10',
		titel: 'WG App: Organisation für die ganze WG | ManaWG',
		beschreibung:
			'ManaWG ist die kostenlose WG-App auf Deutsch: Ausgaben, Putzplan, Einkauf, Vorräte, Kalender, Chat und Pinnwand für Studenten-WGs und Zweck-WGs.',
		h1: 'Die WG-App für Geld, Putzen, Einkauf und Termine',
		einleitung:
			'Ein Zettel am Kühlschrank und eine WhatsApp-Gruppe, in der Wichtiges untergeht: So läuft der Alltag in vielen WGs. ManaWG bündelt Ausgaben, Putzplan, Einkauf, Vorräte, Kalender, Chat und Pinnwand in einer kostenlosen App auf Deutsch.',
		abschnitte: [
			[
				'Warum eine App statt Zettel und WhatsApp',
				'Ein Zettel rechnet keinen Saldo aus, und im Gruppenchat rutscht die Frage nach dem Putzplan zwischen anderen Nachrichten weg. In ManaWG hat jedes Thema seinen Platz: Beträge werden gerechnet, Aufgaben wandern weiter, Termine stehen im Kalender. Was erledigt ist, bleibt nachvollziehbar, und neue Mitbewohner sehen sofort, wie die WG organisiert ist. Das spart Nachfragen und Streit darüber, wer was zugesagt hatte.',
			],
			[
				'Ausgaben teilen und Schulden ausgleichen',
				'Ausgaben teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person und ordnet sie einer von sechs Kategorien zu, etwa Lebensmittel oder Wohnen und Nebenkosten. Die Anteile ergeben immer genau den Betrag. ManaWG schlägt Ausgleiche mit möglichst wenigen Überweisungen vor. Ihr markiert sie als bezahlt, die App überweist selbst nichts. Wer für jemand anderen erfasst, trägt dabei selbst einen Anteil.',
			],
			[
				'Fixkosten und Monatsabrechnung',
				'Miete und Internet legt ihr einmal als Fixkosten an, im Rhythmus ganzer Monate. ManaWG bucht sie automatisch als Ausgabe. Die Monatsabrechnung zeigt die Gesamtsumme, die Ausgaben je Kategorie und die Überweisungsvorschläge. Am Monatsanfang kommt sie per Mail, jede Person kann das abschalten. Fixkosten lassen sich pausieren, und bei gleichmäßiger Teilung wandert der Cent-Rest von Buchung zu Buchung weiter.',
			],
			[
				'Putzplan, Einkauf und Vorräte',
				'Der Putzplan wiederholt Aufgaben in Tagen oder Monaten und bestimmt anhand überfälliger Aufgaben, wer als Nächstes dran ist. Wer verreist ist, trägt eine Abwesenheit ein und wird übersprungen. Auf der Einkaufsliste hakt ihr ab und könnt den Einkauf danach als Ausgabe erfassen. Die Vorräte zeigen, was knapp wird, und schlagen vor, was ihr nachkaufen solltet. Erinnerungen an fällige Aufgaben kommen als Push.',
			],
			[
				'Kalender, Pinnwand und Chat',
				'Der Kalender kennt Serientermine und lässt sich als Abo in Apple Kalender oder Google Kalender einbinden, nur in diese Richtung. Termine am Vortag meldet ManaWG per Push. Die Pinnwand ist für Ankündigungen, Fragen und Entscheidungen, der Chat für Schnelles mit Antworten, Reaktionen und Erwähnungen. Push-Meldungen schaltet ihr je Bereich ein oder aus.',
			],
			[
				'Für wen ManaWG gedacht ist',
				'Für die Studenten-WG, die Zweck-WG und das Paar mit Mitbewohner: Bis zu 20 aktive Mitglieder passen in eine WG. Beigetreten wird per Code oder Link, Einladungen gehen auch per Mail. Anmelden könnt ihr euch mit Google oder mit E-Mail und Passwort. Die App läuft im Browser und lässt sich auf den Home-Bildschirm legen.',
			],
		],
		fragen: [
			[
				'Was kostet die WG-App ManaWG?',
				'Nichts. ManaWG ist kostenlos und zeigt keine Werbung. Eine Bezahlstufe oder ein Abo-Modell gibt es in der App nicht, alle Bereiche stehen offen.',
			],
			[
				'Gibt es ManaWG im App Store oder auf Englisch?',
				'Nein, ManaWG ist keine native App. Ihr öffnet app.manawg.com im Browser und legt die App auf den Home-Bildschirm. Die Oberfläche ist ausschließlich deutsch, Beträge werden nur in Euro geführt.',
			],
			[
				'Wie viele Leute passen in eine WG?',
				'Bis zu 20 aktive Mitglieder. Ausgezogene Personen zählen nicht mit, ihre Historie bleibt erhalten. Admins können den Beitrittscode erneuern oder das Beitreten sperren.',
			],
			[
				'Kann ich von Splitwise oder Splid wechseln?',
				'Ja, per CSV-Import mit Vorschau und Rückgängig-Funktion. Übernommen werden Zeilen in Euro, andere Währungen lehnt ManaWG zeilenweise ab, ohne den ganzen Import zu stoppen.',
			],
		],
	},
	putzplan: {
		link: 'WG Putzplan App',
		stand: '2026-10-10',
		erschienen: '2026-10-09',
		titel: 'WG Putzplan App: fair, mit Rotation | ManaWG',
		beschreibung:
			'Kostenlose WG Putzplan App statt Vorlage zum Ausdrucken: Aufgaben wiederholen sich, rotieren fair weiter und überspringen Abwesende.',
		h1: 'WG Putzplan App: Aufgaben, Rotation und Abwesenheit',
		einleitung:
			'Eine Putzplan Vorlage zum Ausdrucken hängt schnell veraltet am Kühlschrank: Jemand ist im Urlaub, jemand tauscht, und am Ende weiß niemand, wer dran ist. In ManaWG legt ihr Aufgaben einmal an. Die App rechnet Termine, Zuständigkeit und Abwesenheit selbst aus.',
		abschnitte: [
			[
				'Aufgaben mit festem Rhythmus',
				'Jede Aufgabe wiederholt sich in Tagen oder Monaten, etwa das Bad alle sieben Tage oder die Fenster alle drei Monate. Monatsintervalle bleiben kalendertreu, gerechnet wird nach Berliner Zeit. Eine Aufgabe kann einem Mitglied zugewiesen werden, und jede Erledigung landet in der Historie. So seht ihr später, wer was wann gemacht hat.',
			],
			[
				'Rotation nach Fairness',
				'Eine starre Reihenfolge nach dem Muster „diese Woche A, nächste Woche B“ kippt, sobald jemand aussetzt. ManaWG wählt beim Erledigen die nächste zuständige Person anhand der Zahl überfälliger Aufgaben je Mitglied. Dieselbe Vorhersage zeigt die App vorab als „Nächste:r“ an, ihr wisst also im Voraus, wer als Nächstes dran ist.',
			],
			[
				'Abwesenheit eintragen',
				'Urlaub, Praktikum, Heimatbesuch: Mitglieder tragen Zeiträume mit Grund ein. Wer abwesend ist, wird bei der Rotation übersprungen, und die App nennt, wie viele Personen deshalb ausgelassen werden. Niemand muss dafür Aufgaben von Hand tauschen oder im Gruppenchat nachfragen, wer einspringt. Sobald der Zeitraum endet, gilt die Person nicht mehr als abwesend.',
			],
			[
				'Erinnerung aufs Handy',
				'Täglich schickt ManaWG eine Push-Nachricht für zugewiesene Aufgaben, die heute fällig oder bis zu sieben Tage überfällig sind. Pro Aufgabe kommt sie höchstens alle 18 Stunden. Den Kanal Putzplan schaltet jedes Mitglied einzeln ab, wenn es keine Hinweise möchte. Die App fragt vorher um Erlaubnis für Push. Aufgaben ohne zugewiesene Person lösen keine Erinnerung aus.',
			],
			[
				'Vorlage oder App',
				'Eine Vorlage als Tabelle oder PDF ist ein guter Anfang, wenn eure WG klein und die Woche planbar ist. Sie rechnet aber nicht weiter und kennt keine Abwesenheit, jede Änderung tragt ihr selbst ein. Wer die Reihenfolge nicht dauernd pflegen will, ist mit einer App besser bedient, die Zuständigkeit und Termine selbst fortschreibt.',
			],
			[
				'Einrichten und Umfang',
				'Eine WG hat einen Share-Code. Mitglieder treten per Code oder Link bei, bis zu 20 aktive Personen passen in eine WG. ManaWG ist kostenlos, ohne Werbung und nur auf Deutsch. Installiert wird als PWA über den Browser, einen App-Store-Eintrag gibt es nicht. Neben dem Putzplan gibt es Ausgaben, Einkauf, Vorräte, Kalender, Chat und Pinnwand.',
			],
		],
		fragen: [
			[
				'Brauche ich noch eine Putzplan Vorlage?',
				'Nein, ihr legt die Aufgaben direkt in der App an. Wiederholung, Zuständigkeit und Erledigungshistorie sind eingebaut. Eine ausgedruckte Vorlage hält nur fest, was ihr von Hand einträgt, und rechnet nicht von selbst weiter.',
			],
			[
				'Wie funktioniert die faire Rotation?',
				'Beim Erledigen einer Aufgabe wählt ManaWG die nächste zuständige Person anhand der Zahl überfälliger Aufgaben je Mitglied. In der Oberfläche seht ihr diese Vorhersage vorab als „Nächste:r“.',
			],
			[
				'Was passiert, wenn jemand im Urlaub ist?',
				'Die Person trägt den Zeitraum als Abwesenheit ein. In dieser Zeit wird sie bei der Rotation übersprungen. Die App zeigt an, wie viele Personen wegen Abwesenheit ausgelassen werden.',
			],
			[
				'Kostet die WG Putzplan App etwas?',
				'Nein. ManaWG ist kostenlos und zeigt keine Werbung. Die App ist ausschließlich auf Deutsch, und eine WG kann höchstens 20 aktive Mitglieder haben.',
			],
			[
				'Gibt es die App im App Store?',
				'Nein, ManaWG ist keine native App. Ihr installiert sie als PWA über den Browser, unter iOS und Firefox mit manuellen Schritten, und könnt Push-Benachrichtigungen je Bereich einstellen.',
			],
		],
	},
	'wg-kasse': {
		link: 'WG-Kasse',
		stand: '2026-10-14',
		erschienen: '2026-10-09',
		titel: 'WG Kasse App: Ausgaben teilen, Abrechnung | ManaWG',
		beschreibung:
			'Die kostenlose WG Kasse App: Ausgaben teilen, mit wenigen Überweisungen ausgleichen, Fixkosten buchen und die Monatsabrechnung per Mail bekommen.',
		h1: 'Die WG Kasse App für Ausgaben, Fixkosten und Abrechnung',
		einleitung:
			'Wer hat das Klopapier bezahlt, wer schuldet wem noch etwas? ManaWG ist eine kostenlose, deutschsprachige WG Kasse App. Jede Ausgabe landet sofort im Saldo aller Beteiligten, ohne Zettel und ohne Tabelle.',
		abschnitte: [
			[
				'Ausgaben teilen in der WG',
				'Ihr erfasst Betrag, Bezahler und Beteiligte und wählt eine von sechs Kategorien, etwa Lebensmittel oder Haushalt. Geteilt wird gleichmäßig oder mit eigenen Beträgen pro Person. ManaWG rechnet in ganzen Cent: Bei gleicher Teilung unterscheiden sich die Anteile höchstens um einen Cent, die Summe stimmt immer exakt. Ein Foto vom Beleg hängt ihr direkt an die Ausgabe.',
			],
			[
				'Ausgleich mit wenigen Überweisungen',
				'ManaWG berechnet für jede Person den Saldo und schlägt Zahlungen vor, mit denen die WG mit möglichst wenigen Überweisungen quitt ist. Das spart Aufwand. Überwiesen wird außerhalb der App, per Bank oder bar. Danach markiert ihr einen Anteil oder mehrere gemeinsam als bezahlt. Eine Bankanbindung gibt es nicht, auch kein SEPA.',
			],
			[
				'Fixkosten automatisch buchen',
				'Miete, Strom, Internet oder Streaming legt ihr einmal als Fixkosten an. Das Intervall zählt in ganzen Monaten, zum Beispiel monatlich oder alle drei Monate. Fällige Vorlagen bucht die App täglich selbst als Ausgabe. Ein Termin am 31. rutscht im Februar auf den 28. und springt danach zurück. Eine Vorlage lässt sich pausieren. Wöchentliche Intervalle gibt es nicht.',
			],
			[
				'Die Monatsabrechnung',
				'Die Abrechnung zeigt Gesamtsumme, einzelne Positionen und die Ausgaben je Kategorie mit Prozentanteil. Pro Mitglied steht dort, was gezahlt wurde, wie hoch der Anteil war und wie der Saldo aussieht. Dazu kommen die Überweisungsvorschläge und der Hinweis, ob alles beglichen ist. Sie kommt am Monatsersten per E-Mail, jedes Mitglied kann das abschalten.',
			],
			[
				'Erinnern ohne Streit',
				'Auf der Seite Mahnungen löst ein Mitglied per Erinnern-Button eine Zahlungserinnerung aus. Eine Abkühlzeit begrenzt, wie oft das hintereinander möglich ist, und ein Rate-Limit bremst zu viele Anfragen. Der Saldo bleibt für alle jederzeit einsehbar, etwa in der Monatsabrechnung. Die Seite ist ein eigener Bereich der WG, neben Ausgaben, Abrechnung und Aktivität.',
			],
			[
				'Umzug aus Splitwise oder Splid',
				'Falls eure bisherigen Abrechnungen als CSV-Datei vorliegen, übernehmt ihr sie per Import in eurer WG. Ihr seht vorher eine Vorschau, ein Importverlauf zeigt frühere Läufe, und ein Import lässt sich rückgängig machen. Übernommen werden nur Euro-Beträge, andere Währungen lehnt ManaWG zeilenweise ab. Auch ein Foto oder Bildschirmfoto einer Ausgabenliste lässt sich einlesen und vor dem Speichern korrigieren.',
			],
			[
				'Was ManaWG nicht ist',
				'ManaWG ist für WGs mit bis zu 20 aktiven Mitgliedern gedacht, komplett auf Deutsch und rechnet nur in Euro. Es wird als PWA über den Browser installiert, nicht über App Store oder Play Store. Ihr meldet euch per Google oder E-Mail an. Die App ist kostenlos und ohne Werbung.',
			],
		],
		fragen: [
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
				'Bis zu 20 aktive Mitglieder. Wer auszieht, wird deaktiviert und zählt nicht mehr mit, seine Historie bleibt erhalten. Weitere Personen lassen sich per Code oder Link einladen.',
			],
		],
	},
	einkaufsliste: {
		link: 'Einkaufsliste',
		stand: '2026-10-10',
		erschienen: '2026-10-09',
		titel: 'Gemeinsame Einkaufsliste App für die WG | ManaWG',
		beschreibung:
			'Die gemeinsame Einkaufsliste für die WG: alle tragen ein, Vorräte melden Nachschub, und aus dem Einkauf wird direkt eine geteilte Ausgabe. Kostenlos.',
		h1: 'Eine Einkaufsliste für die ganze WG',
		einleitung:
			'Drei Leute, drei Zettel, zweimal Milch gekauft. ManaWG gibt eurer WG eine gemeinsame Einkaufsliste, die auf jedem Handy gleich aussieht, dazu Vorräte und die Übernahme des Einkaufs in die WG-Kasse.',
		abschnitte: [
			[
				'Alle schreiben mit',
				'Jede Person in der WG trägt ein, was fehlt, auf Wunsch mit Menge wie „2 Packungen“ oder „1 kg“. Wer einkaufen geht, hakt Artikel ab, und alle anderen sehen den Stand. ManaWG merkt sich, wer abgehakt hat, und erkennt Duplikate, bevor derselbe Artikel zweimal auf der Liste steht. Die Liste gehört der WG, nicht einer einzelnen Person.',
			],
			[
				'Vorschläge und Aufräumen',
				'Beim Eintragen macht ManaWG Vorschläge, damit ihr nicht jeden Artikel neu tippt. Abgehakte Einträge bleiben zunächst stehen, so sieht man, was schon besorgt ist. Ist die Liste unübersichtlich, räumt ihr alle abgehakten Einträge über einen Dialog in einem Schritt weg. Die Vorschläge sparen vor allem bei Dingen Zeit, die jede Woche auf der Liste stehen.',
			],
			[
				'Vorräte statt Notizen im Kopf',
				'Für Dinge, die nie ausgehen sollen, führt ihr Vorräte mit Name, Menge, Einheit und Schwellwert. Wer etwas verbraucht, trägt es ein, ManaWG führt ein Verbrauchslog. „Schnell nachkaufen“ schlägt fast leere Vorräte vor und solche, die in den letzten 30 Tagen oft verbraucht wurden. So steht der Nachschub auf dem Zettel, bevor die letzte Packung leer ist.',
			],
			[
				'Vom Einkauf zur Ausgabe',
				'Nach dem Abhaken erscheint bei der Person, die gerade gekauft hat, ein Hinweis, die Artikel direkt als Ausgabe zu erfassen. Er gilt 12 Stunden. Die Ausgabe landet in der WG-Kasse, bekommt die Kategorie Lebensmittel oder Haushalt, und ein Belegfoto könnt ihr anhängen. So muss später niemand rekonstruieren, was im Einkaufswagen lag.',
			],
			[
				'Aufteilen ohne Rundungsstreit',
				'Beträge speichert ManaWG in ganzen Cent. Bei gleichmäßiger Aufteilung ergibt die Summe der Anteile genau den Betrag, die Anteile weichen höchstens um einen Cent voneinander ab. Mit eigenen Beträgen pro Person zahlt nur, wer wirklich mitgegessen hat. Die Salden zeigen danach, wer wem etwas schuldet. Gerechnet wird ausschließlich in Euro, Wechselkurse gibt es nicht.',
			],
			[
				'Im Supermarkt auch ohne gutes Netz',
				'ManaWG läuft im Browser unter app.manawg.com und lässt sich ohne App Store auf den Home-Bildschirm legen. Fehlt unterwegs das Netz, merkt die App Aktionen lokal und sendet sie später nach. Nach 7 Tagen werden liegen gebliebene Aktionen nicht mehr automatisch gesendet, sondern euch zur Prüfung angezeigt. Push-Meldungen für Einkauf und Vorräte schaltet jede Person selbst ein oder aus.',
			],
		],
		fragen: [
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
				'Ihr legt Vorräte mit Menge, Einheit und Schwellwert an und tragt den Verbrauch ein. „Schnell nachkaufen“ schlägt fast leere und oft verbrauchte Vorräte zum Nachkaufen vor.',
			],
		],
	},
	'splitwise-alternative': {
		link: 'Splitwise-Alternative',
		stand: '2026-10-14',
		erschienen: '2026-10-09',
		titel: 'Splitwise-Alternative ohne Werbung und Paywall | ManaWG',
		beschreibung:
			'ManaWG ist eine kostenlose Splitwise-Alternative für WGs: keine Werbung, keine Bezahlstufe, dazu Putzplan, Einkaufsliste und CSV-Import.',
		h1: 'Eine Splitwise-Alternative ohne Paywall und Werbung',
		einleitung:
			'Splitwise teilt Ausgaben zuverlässig und bietet mit Splitwise Pro laut Anbieter unter anderem unbegrenzte Ausgaben, keine Werbung, Belegscan und Währungsumrechnung. Was die kostenlose Version heute genau umfasst, legen wir hier nicht dar, prüft das bei Splitwise selbst. ManaWG kostet nichts, zeigt keine Werbung und kennt keine Bezahlstufe. Dazu kommen Putzplan, Einkaufsliste und Kalender.',
		quellen: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['ManaWG WG-App', 'https://manawg.com/wg-app'],
		],
		abschnitte: [
			[
				'Was Splitwise Pro laut Anbieter enthält',
				'Die Pro-Seite von Splitwise nennt unter anderem unbegrenzte Ausgaben, keine Werbung, das Scannen von Belegen und die Umrechnung von Währungen. Aus Pro lassen sich keine genauen Grenzen der kostenlosen Version ableiten; Details zur kostenlosen Version haben wir hier nicht verifiziert, prüft das bei Splitwise selbst. Tarife ändern sich, verlasst euch deshalb auf die Anbieter-Seite mit Stand 14. Oktober 2026.',
			],
			[
				'Keine Bezahlstufe, keine Werbung',
				'In ManaWG stehen alle Funktionen jeder WG offen. Es gibt keine Anzeigen, kein Pro-Abo und keine Funktion, die erst nach einem Kauf freigeschaltet wird. Eine Grenze gibt es trotzdem: Eine WG fasst höchstens 20 aktive Mitglieder. Für Wohngemeinschaften reicht das, für große Gruppen nicht. Ausgezogene Mitglieder zählen nicht mit, ihre Historie bleibt erhalten.',
			],
			[
				'Fotos lesen, aber kein Kassenbon-Scanner',
				'Im Import wählt ihr die Quelle Screenshot. ManaWG liest ein Foto oder Bildschirmfoto einer Ausgabenliste per Texterkennung im Browser und zeigt eine Vorschau zum Korrigieren. Erkannt werden nur Eurobeträge, das Lesen kann bis zu 30 Sekunden dauern. Am einzelnen Beleg hängt ihr ein Foto nur an, es wird dort nicht ausgewertet.',
			],
			[
				'CSV-Import, falls eure Daten als Datei vorliegen',
				'Falls eure Splitwise-Ausgaben als CSV-Datei vorliegen, öffnet ihr den Import eurer WG und wählt die Quelle. Vor dem Speichern seht ihr eine Vorschau mit allen erkannten Zeilen. Danach steht der Import im Verlauf und lässt sich rückgängig machen, falls etwas nicht stimmt. Ihr prüft also vorher und könnt hinterher zurück. Die Historie anderer Mitglieder importieren dürfen nur WG-Admins.',
			],
			[
				'Nur Euro',
				'ManaWG rechnet ausschließlich in Euro und kennt keine Wechselkurse. Zeilen in anderen Währungen lehnt der Import einzeln ab, der Rest wird übernommen. Für Reisen mit mehreren Währungen ist eine App mit Währungsumrechnung die bessere Wahl, für den WG-Alltag in Euro genügt ManaWG. Die Beträge werden in Cent gespeichert, die Anteile gehen ohne Rundungsrest auf.',
			],
			[
				'Mehr als eine Kasse',
				'Ihr teilt gleichmäßig oder mit eigenen Beträgen, legt Fixkosten wie Miete an und bekommt Überweisungsvorschläge. Dazu gibt es Monatsabrechnung, Putzplan mit fairer Rotation, Einkaufsliste mit Übernahme als Ausgabe, Kalender-Abo, Pinnwand und Chat. Das Geld überweist ihr selbst, in ManaWG markiert ihr einzelne Anteile oder alles auf einmal als bezahlt. Eine Bankanbindung gibt es nicht.',
			],
		],
		fragen: [
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
		stand: '2026-10-14',
		erschienen: '2026-10-10',
		titel: 'Splid Alternative mit Putzplan und Einkaufsliste | ManaWG',
		beschreibung:
			'ManaWG ist eine kostenlose Splid Alternative für WGs: Ausgaben teilen plus Putzplan, Einkaufsliste und Fixkosten.',
		h1: 'Eine Splid Alternative mit Putzplan und Einkaufsliste',
		einleitung:
			'Splid teilt Ausgaben in Gruppen und nennt auf seiner deutschen Seite unter anderem über 150 Währungen, Offline-Nutzung sowie PDF- und Excel-Exporte. Für eine WG reicht eine reine Kasse oft nicht lange, denn der Haushalt besteht aus mehr als Rechnungen. ManaWG verbindet die Kasse mit dem Rest.',
		quellen: [
			['Splid auf Deutsch', 'https://splid.app/german'],
			['ManaWG WG-App', 'https://manawg.com/wg-app'],
		],
		abschnitte: [
			[
				'Was Splid laut Anbieter kann',
				'Die deutsche Splid-Seite nennt unter anderem über 150 Währungen, Gruppen vor Ort und online sowie den Export als PDF und Excel. Details zum Funktionsumfang stehen dort mit Stand 14. Oktober 2026. In ManaWG meldet sich dagegen jede Person mit Google oder E-Mail und Passwort an. Dafür gehören Ausgaben, Salden und Verlauf fest zu eurer WG, und Mitbewohner kommen per Link oder Code dazu. Den Code könnt ihr jederzeit erneuern.',
			],
			[
				'Kasse plus Haushalt in einer App',
				'ManaWG verbindet die Kasse mit dem Rest: Aufgaben wiederholen sich in Tagen oder Monaten und rotieren auf die nächste Person, die Einkaufsliste sieht jeder auf dem Handy, und Fixkosten werden automatisch als Ausgabe gebucht. Zusätzlich gibt es Vorräte, Kalender, Pinnwand und Chat, falls ihr sie braucht.',
			],
			[
				'Fixkosten und Monatsabrechnung',
				'Miete, Internet oder Strom legt ihr einmal als Fixkosten an. Das Intervall zählt in ganzen Monaten, eine Vorlage lässt sich pausieren. Am Monatsende zeigt die Abrechnung Gesamtsumme, Ausgaben je Kategorie und Überweisungsvorschläge. Sie kommt am 1. des Monats per Mail, und jedes Mitglied kann das einzeln abschalten. Bei gleichmäßig geteilten Fixkosten wandert der Cent-Rest zur nächsten Person.',
			],
			[
				'Umzug per CSV-Import',
				'Falls eure Splid-Ausgaben als CSV-Datei vorliegen, ladet ihr sie unter Import in eurer WG hoch. Ihr seht erst eine Vorschau, bevor etwas gespeichert wird, und könnt den Import im Verlauf wieder rückgängig machen. Übernommen werden nur Euro-Zeilen, andere Währungen lehnt ManaWG einzeln ab. Fremde Historie importieren dürfen nur WG-Admins. Wer nur Screenshots hat, liest ein Foto einer Ausgabenliste ein und korrigiert es vor dem Speichern.',
			],
			[
				'Aufteilen und ausgleichen',
				'Ausgaben teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person. Die Cent gehen exakt auf. ManaWG schlägt vor, wer wem wie viel überweist, mit möglichst wenigen Zahlungen. Die Überweisung selbst macht ihr außerhalb der App und markiert den Betrag danach als bezahlt. Eine Erinnerung an Offenes gibt es auch, mit Abkühlzeit, damit niemand genervt wird.',
			],
			[
				'Grenzen von ManaWG',
				'Eine WG fasst höchstens 20 aktive Mitglieder. Die App ist nur auf Deutsch und rechnet nur in Euro. Es gibt keine App im App Store, ihr nutzt ManaWG im Browser unter app.manawg.com und legt sie auf dem Handy auf den Home-Bildschirm. Auch Kalender-Abo und Push-Hinweise funktionieren so, ohne dass ihr etwas aus dem Store installieren müsst.',
			],
		],
		fragen: [
			[
				'Braucht ManaWG ein Konto?',
				'Ja. Jede Person meldet sich mit Google oder mit E-Mail und Passwort an. Beitreten geht danach per Einladungslink oder Code.',
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
		stand: '2026-10-14',
		erschienen: '2026-10-10',
		titel: 'Flatastic-Alternative ohne Werbung und Premium | ManaWG',
		beschreibung:
			'ManaWG ist eine kostenlose Flatastic-Alternative für WGs: Putzplan, WG-Kasse, Einkauf, Kalender und Chat, ohne Werbung und ohne Premium-Stufe.',
		h1: 'Eine WG-App ohne Werbung und ohne Premium',
		einleitung:
			'Flatastic organisiert laut Anbieter Aufgaben, Einkäufe, Finanzen und Pinnwand und bietet ein kostenpflichtiges Premium unter anderem ohne Werbung und mit Verläufen. Den aktuellen Stand prüft ihr am besten selbst bei Flatastic. ManaWG ist kostenlos und kommt ohne Werbung und ohne Bezahlstufe aus.',
		quellen: [
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['ManaWG WG-App', 'https://manawg.com/wg-app'],
		],
		abschnitte: [
			[
				'Kostenlos, ohne Werbung, ohne Premium',
				'ManaWG zeigt keine Werbung und kennt keine Bezahlstufe: Jede WG nutzt Ausgaben, Putzplan, Einkauf, Vorräte, Kalender, Chat und Pinnwand. Ob ihr zu zweit oder zu zehnt seid, ändert daran nichts, solange die WG in das Limit von 20 aktiven Mitgliedern passt. Ausgezogene Personen zählen nicht mit, ihre Historie bleibt erhalten.',
			],
			[
				'Erinnerungen, die ihr selbst steuert',
				'Jedes Mitglied schaltet Push-Benachrichtigungen pro Bereich einzeln ab: Ankündigungen, Putzplan, Ausgaben, Einkauf, Vorräte, Erinnerungen, Chat und Termine. Der Putzplan erinnert an heute fällige und bis zu sieben Tage überfällige Aufgaben, die jemandem zugewiesen sind, höchstens alle 18 Stunden pro Aufgabe. Termine melden sich am Tag davor, auch Serientermine. Mails wie Digest oder Monatsabrechnung lassen sich ebenfalls abschalten.',
			],
			[
				'Putzplan mit fairer Rotation',
				'Aufgaben wiederholen sich im Rhythmus von Tagen oder Monaten. Beim Erledigen bestimmt ManaWG anhand der überfälligen Aufgaben je Mitglied, wer als Nächstes zuständig ist. Wer abwesend ist, wird übersprungen, und die App nennt, wie viele Personen deshalb ausgelassen werden. Monatsintervalle bleiben kalendertreu, gerechnet wird nach Berliner Zeit. Erledigte Aufgaben landen in der Historie.',
			],
			[
				'WG-Kasse und Umstieg',
				'Ausgaben teilt ihr gleichmäßig oder mit eigenen Beträgen, auf den Cent genau. ManaWG zeigt Salden und schlägt Ausgleiche mit wenigen Überweisungen vor. Dazu kommen Fixkosten und eine Monatsabrechnung. Falls eure Splitwise- oder Splid-Ausgaben als CSV-Datei vorliegen, lassen sie sich mit Vorschau importieren. Einen Flatastic-Import gibt es nicht, Altdaten legt ihr bei Bedarf von Hand neu an.',
			],
			[
				'Einkauf, Pinnwand und Chat',
				'Die Einkaufsliste erkennt Duplikate und schlägt nach dem Abhaken vor, den Einkauf direkt als Ausgabe zu erfassen. Vorräte zeigen eine Menge und einen Schwellwert, und „Schnell nachkaufen“ schlägt fast Leeres vor. Die Pinnwand sammelt Infos und Entscheidungen der WG, im Chat antwortet ihr, reagiert mit Emojis und erwähnt Mitbewohner mit @.',
			],
			[
				'Was ManaWG nicht kann',
				'Die Oberfläche ist nur Deutsch, Beträge nur in Euro, und eine WG fasst höchstens 20 aktive Mitglieder. Es gibt keine App im Store, ManaWG installiert ihr als Web-App auf dem Home-Bildschirm. Ausgleiche markiert ihr selbst als bezahlt, eine Überweisung löst die App nicht aus. Kalender gibt es als Abo für Apple und Google Kalender, aber nur in eine Richtung.',
			],
		],
		fragen: [
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
		],
	},
	'ourhome-alternative': {
		link: 'OurHome-Alternative',
		stand: '2026-10-14',
		erschienen: '2026-10-10',
		titel: 'OurHome-Alternative für WGs, kostenlos | ManaWG',
		beschreibung:
			'ManaWG als Alternative zu OurHome: kostenloser Putzplan und WG-Kasse im Browser. Der aktuelle Funktionsumfang von OurHome wurde nicht verifiziert.',
		h1: 'Eine OurHome-Alternative für WGs',
		einleitung:
			'Ob und in welchem Umfang OurHome aktuell verfügbar ist, haben wir nicht verifiziert (Stand 14. Oktober 2026), prüft das selbst. Im Folgenden beschreiben wir nur, wie ManaWG Putzplan und Kasse für WGs löst.',
		quellen: [['ManaWG WG-App', 'https://manawg.com/wg-app']],
		abschnitte: [
			[
				'Fairness statt Punkte',
				'Wenn jemand eine Aufgabe erledigt, schaut ManaWG, wer gerade die wenigsten überfälligen Aufgaben hat, und schlägt diese Person als Nächste vor. Wer schon viel Überfälliges hat, bekommt nicht noch mehr dazu. In der App steht unter „Nächste:r“, wer dran ist. Wer verreist ist, trägt eine Abwesenheit ein und wird bei der Rotation übersprungen. Ein Belohnungssystem gibt es nicht, und eine WG braucht auch keins.',
			],
			[
				'Putzplan mit festem Rhythmus',
				'Aufgaben wiederholen sich in Tagen oder Monaten und sind einem Mitglied zugewiesen. Ob Bad, Küche oder Müll: Ihr entscheidet, wie oft eine Aufgabe wiederkommt. Monatsintervalle bleiben kalendertreu. Erledigte Aufgaben bleiben als Historie sichtbar. Wer zuständig ist, bekommt morgens eine Push-Erinnerung, wenn die Aufgabe heute fällig ist oder bis zu sieben Tage überfällig.',
			],
			[
				'Kasse und Putzplan in einer App',
				'Ausgaben teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person. ManaWG rechnet in Cent, die Anteile ergeben immer genau den Betrag. Jede Ausgabe bekommt eine von sechs Kategorien, etwa Lebensmittel oder Haushalt. Die App zeigt Salden und schlägt Überweisungen vor, damit möglichst wenige nötig sind. Bezahlt markiert ihr per Hand, ManaWG selbst überweist kein Geld.',
			],
			[
				'Fixkosten und Monatsabrechnung',
				'Miete, Internet und Strom legt ihr als Fixkosten an. Sie werden im Monatsrhythmus automatisch als Ausgaben gebucht. Die Monatsabrechnung zeigt Gesamtsumme, Ausgaben je Kategorie und wer wem wie viel überweist. Per Mail kommt sie am Monatsanfang automatisch, jedes Mitglied kann das abschalten. Fixkosten lassen sich pausieren. Das Intervall zählt in ganzen Monaten, wöchentliche Fixkosten gibt es nicht.',
			],
			[
				'Einkauf, Vorräte und Kalender',
				'Die Einkaufsliste gehört der ganzen WG. Wer einkauft, sieht, was schon abgehakt ist. Nach dem Abhaken fragt ManaWG, ob ihr den Einkauf direkt als Ausgabe erfassen wollt. Dazu kommen eine Vorratsübersicht, ein Kalender mit Abo für Apple oder Google Kalender, Pinnwand und Chat. Eine zweite App für den Haushalt entfällt.',
			],
			[
				'Web statt Store',
				'ManaWG läuft unter app.manawg.com und lässt sich auf dem Home-Bildschirm installieren. Die Daten liegen zentral auf dem Server, nicht auf einem einzelnen Gerät. Aktionen ohne Netz merkt sich die App und sendet sie später nach. Anmelden könnt ihr euch mit Google oder E-Mail und Passwort. Beitreten geht per Code, Link oder E-Mail-Einladung.',
			],
		],
		fragen: [
			[
				'Gibt es in ManaWG Punkte oder Belohnungen?',
				'Nein. ManaWG verteilt Aufgaben nach der Zahl überfälliger Aufgaben je Person und berücksichtigt Abwesenheiten. Punkte oder Belohnungen gibt es nicht.',
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
				'Nein. Die App ist ausschließlich auf Deutsch und hat keine Sprachumschaltung. Auch Währungen außer Euro lassen sich in der Bedienung nicht auswählen.',
			],
			[
				'Wie viele Leute passen in eine WG?',
				'Eine WG fasst bis zu 20 aktive Mitglieder. Ausgezogene Mitglieder zählen nicht mit, ihre Historie bleibt erhalten. Admins können den Code erneuern oder das Beitreten sperren.',
			],
		],
	},
	faq: {
		link: 'Häufige Fragen',
		stand: '2026-10-14',
		erschienen: '2026-10-09',
		titel: 'Häufige Fragen zu ManaWG, der WG-App',
		beschreibung:
			'Antworten zu ManaWG: Kosten, Installation, Einladung, Ausgaben teilen, Putzplan, Abwesenheiten und Import aus Splitwise oder Splid.',
		h1: 'Fragen und Antworten',
		einleitung: 'Das Wichtigste zu ManaWG, der kostenlosen App für Wohngemeinschaften.',
		abschnitte: [],
		fragen: [
			['Was kostet ManaWG?', 'Nichts. ManaWG ist kostenlos.'],
			[
				'Brauche ich einen App Store?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com. Auf dem Handy könnt ihr die App auf den Home-Bildschirm legen.',
			],
			[
				'Wie kommen meine Mitbewohner in die WG?',
				'Eine Person erstellt die WG und teilt den Einladungslink. Die anderen melden sich mit Google oder E-Mail an und treten per Link bei.',
			],
			[
				'Wie werden Ausgaben aufgeteilt?',
				'Gleichmäßig auf die Beteiligten oder mit eigenen Beträgen pro Person. ManaWG zeigt, wer wem wie viel schuldet.',
			],
			[
				'Wie funktioniert der Putzplan?',
				'Aufgaben haben einen Rhythmus und rotieren fair weiter. ManaWG zeigt, wer als Nächstes dran ist.',
			],
			[
				'Was passiert, wenn jemand verreist ist?',
				'Abwesenheiten werden eingetragen. In der Zeit wird die Person beim Putzplan übersprungen.',
			],
			[
				'Kann ich Daten aus Splitwise oder Splid mitnehmen?',
				'Falls eure Daten als CSV-Datei vorliegen: per CSV-Import mit Vorschau. Beim Import lässt sich auch ein Foto oder Bildschirmfoto einer Ausgabenliste per Texterkennung einlesen und vor dem Speichern korrigieren; ein Foto am einzelnen Beleg wird nur angehängt, nicht ausgewertet.',
			],
			[
				'Was gibt es außer Geld und Putzen?',
				'Eine gemeinsame Einkaufsliste mit Vorräten, Fixkosten, einen Kalender, den ihr auch abonnieren könnt, eine Pinnwand und einen Chat.',
			],
		],
	},
	...RATGEBER,
};
