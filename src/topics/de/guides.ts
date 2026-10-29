// Guide pages for search queries about living in a flat share. General tips, not legal advice.
// Only name ManaWG features where manawg-app really has them (see topics.ts).
import type { Topic } from '../types.ts';

import { cleaningRota, tableToCsv } from '../cleaning-rota.ts';
// The pure functions live in a small file so the generator does not load all guide texts.
import { COMPARISON_ROWS, MANAWG_CELLS, NOT_CHECKED } from './comparison.ts';

const TASKS_FOUR = ['Bad', 'Küche', 'Böden', 'Müll und Flur'];
const TASKS_THREE = ['Bad', 'Küche', 'Böden und Müll'];
const TASKS_FIVE = [...TASKS_FOUR, 'Wohnzimmer und Balkon'];

/** Single source of the templates: HTML tables, CSV and Markdown all read from here. A to E stand for example flatmates. */
export const TEMPLATE_FOUR = cleaningRota(['A', 'B', 'C', 'D'], TASKS_FOUR);
const TEMPLATE_TWO = cleaningRota(['A', 'B'], ['Bad', 'Böden', 'Küche', 'Müll und Flur']);
const TEMPLATE_THREE = cleaningRota(['A', 'B', 'C'], TASKS_THREE);
const TEMPLATE_FIVE = cleaningRota(['A', 'B', 'C', 'D', 'E'], TASKS_FIVE);

/** The same template data as a CSV. Static, no user input. */
export function cleaningRotaTemplateCsv(): string {
	return tableToCsv(TEMPLATE_FOUR.header, TEMPLATE_FOUR.rows);
}

export const GUIDES_DE: Record<string, Topic> = {
	'wg-kosten-aufteilen': {
		link: 'WG-Kosten aufteilen',
		updated: '2026-10-27',
		published: '2026-10-11',
		title: 'WG-Kosten fair aufteilen: drei Modelle mit Beispiel | ManaWG',
		description:
			'So teilt ihr in der WG Miete und gemeinsame Einkäufe fair auf: drei Modelle mit Beispielrechnung, Ausgleich ohne Überweisungschaos und Regeln gegen Streit.',
		h1: 'WG-Kosten fair aufteilen',
		intro:
			'Geld ist der häufigste Streitpunkt in Wohngemeinschaften, und selten geht es um große Summen. Meist fehlt eine Regel, auf die sich alle geeinigt haben. Hier steht, welche Kosten es gibt, welche Aufteilung sich bewährt hat und wie ihr den Überblick behaltet.',
		sections: [
			[
				'Welche Kosten in einer WG anfallen',
				'Es gibt drei Gruppen. Erstens die festen Kosten, die jeden Monat gleich sind: Miete, Nebenkosten-Vorauszahlung, Internet, Strom. Zweitens die gemeinsamen laufenden Ausgaben für die [Haushaltskasse](/wg-haushaltskasse) wie Spülmittel, Klopapier, Putzmittel und gemeinsame Lebensmittel. Drittens Einmaliges, etwa ein neuer Staubsauger oder die Küchenausstattung. Wer die drei Gruppen trennt, streitet seltener, weil für jede eine eigene Regel gelten kann.',
			],
			[
				'Modell 1: Alles gleich teilen',
				'Jede Person zahlt denselben Anteil. Das ist einfach und passt bei Zimmern ähnlicher Größe. Beispiel: Internet kostet 36 Euro im Monat, vier Personen zahlen je 9 Euro. Bei Beträgen, die sich nicht glatt teilen lassen, bleibt ein Cent-Rest. Den sollte nicht immer dieselbe Person tragen, sondern er sollte von Buchung zu Buchung weiterwandern.',
			],
			[
				'Modell 2: Miete nach Zimmergröße, Rest gleich',
				'Bei sehr unterschiedlichen Zimmern ist ein gleicher Mietanteil selten fair. Eine gängige Möglichkeit ist, die Miete nach Quadratmetern zu verteilen und Gemeinschaftskosten wie Internet und Strom gleich zu teilen. Beispiel: Ein Zimmer mit 20 m² in einer Wohnung mit 80 m² Gesamtfläche trägt 25 Prozent der Miete. Gemeinschaftsflächen wie Küche und Bad rechnet ihr dabei nach Köpfen oder anteilig zu den Zimmern dazu. Wie das geht, zeigt [WG-Miete nach Zimmergröße aufteilen](/wg-miete-rechner) mit Rechner. Wichtig ist, dass alle die Rechnung gesehen und zugestimmt haben.',
			],
			[
				'Modell 3: Jeder zahlt, was er verursacht',
				'Für Einkäufe und Einzelnes passt es oft besser, nur die Beteiligten zahlen zu lassen. Wer Bier für den eigenen Geburtstag kauft, teilt diese Ausgabe nicht mit der ganzen WG. In der [WG-Kasse von ManaWG](/wg-kasse) legt ihr bei jeder Ausgabe fest, wer beteiligt ist, und teilt gleichmäßig oder mit eigenen Beträgen pro Person. Die Anteile ergeben immer genau den Betrag.',
			],
			[
				'Ausgleichen ohne Überweisungschaos',
				'Wenn jeder mal für alle zahlt, entstehen [Schulden in alle Richtungen](/schulden-mitbewohner). Sinnvoll ist, nicht jede Ausgabe einzeln zu begleichen, sondern am Monatsende den Saldo zu betrachten. Aus den Salden lässt sich ableiten, wer wem etwas überweisen sollte, und zwar mit wenigen Überweisungen. ManaWG berechnet diese Vorschläge automatisch, überweist aber selbst nichts: Ihr markiert Ausgleiche als bezahlt.',
			],
			[
				'Regeln, die Streit vermeiden',
				'Schreibt auf, was gemeinsam bezahlt wird und was nicht. Legt einen festen Tag fest, an dem ihr ausgleicht. Erfasst Ausgaben sofort, solange der Beleg noch da ist. Und bestimmt, ab welchem Betrag vorher gefragt wird, etwa bei Anschaffungen über 50 Euro. Fixkosten wie Miete und Internet legt ihr in ManaWG einmal an, sie werden dann automatisch jeden Monat gebucht.',
			],
		],
		faq: [
			[
				'Wie teilt man die Miete in einer WG fair auf?',
				'Eine gängige Möglichkeit ist die Aufteilung der Miete nach Zimmergröße, mit gleichen Anteilen für Gemeinschaftskosten wie Internet und Strom. Bei gleich großen Zimmern ist auch ein gleicher Anteil für alle fair.',
			],
			[
				'Wer zahlt Internet und Strom in der WG?',
				'Meist teilen sich alle Bewohner diese Kosten gleichmäßig, weil jede Person die Anschlüsse nutzt. Üblich ist, dass eine Person den Vertrag führt und die anderen ihren Anteil per Fixkosten oder Überweisung ausgleichen.',
			],
			[
				'Gibt es eine App zum Aufteilen von WG-Kosten?',
				'Ja, zum Beispiel ManaWG: kostenlos, auf Deutsch, mit Salden, Ausgleichsvorschlägen und Fixkosten. Sie läuft im Browser, ein App Store ist nicht nötig.',
			],
		],
	},
	'putzplan-erstellen': {
		link: 'Putzplan erstellen',
		widget: { after: 'Putzplan-Generator: in einer Minute zum Plan', kind: 'rota-generator' },
		updated: '2026-10-29',
		published: '2026-10-11',
		title: 'Putzplan selber erstellen: Wochenplan & Generator | ManaWG',
		description:
			'Putzplan selber erstellen in fünf Schritten: Aufgaben nach Raum und Rhythmus, Wochenplan als Tabelle, Punktesystem und kostenloser Generator für eure Namen.',
		h1: 'Putzplan erstellen: Schritt für Schritt für Haushalt und WG',
		intro:
			'Ein Putzplan scheitert selten an der Faulheit, sondern an unklaren Aufgaben und an Plänen, die niemand pflegt. In fünf Schritten kommt ihr zu einem Plan für Haushalt oder WG: Aufgaben nach Räumen sammeln, Aufwand schätzen, auf die Woche verteilen, fair zuteilen und sichtbar machen.',
		sections: [
			[
				'In fünf Schritten zum Putzplan',
				'1. Aufgaben nach Räumen sammeln\n2. Aufwand schätzen\n3. Auf die Woche verteilen\n4. Fest oder rotierend verteilen\n5. Sichtbar machen und pflegen',
			],
			[
				'Putzplan-Generator: in einer Minute zum Plan',
				'Wollt ihr nicht bei null anfangen, tragt zwei bis sechs Namen ein und wählt die Aufgaben und die Zahl der Wochen. Der Generator verteilt die Aufgaben im Wechsel, jede Woche rückt jede Person eine Aufgabe weiter. Den Plan könnt ihr drucken, als PDF speichern oder als CSV herunterladen. Nichts wird gespeichert, ihr braucht kein Konto. Eigene Aufgaben und Rhythmen ergänzt ihr mit den Schritten unten.',
			],
			[
				'Schritt 1: Aufgaben nach Räumen sammeln',
				'Schreibt auf, was regelmäßig anfällt, und ordnet es den Räumen zu. Je konkreter die Aufgabe, desto weniger Diskussion: „Bad putzen“ ist besser als „Hygiene“. Legt fest, was dazugehört, etwa Waschbecken, Dusche, WC und Boden. Jede Aufgabe bekommt einen Rhythmus: täglich, wöchentlich, alle 14 Tage oder monatlich. Die Tabelle zeigt ein Beispiel für eine typische WG-Wohnung, streicht darin, was bei euch nicht anfällt.',
			],
			[
				'Kühlschrank und Spülmaschine',
				'Diese beiden Ecken der Küche fallen gern durch, weil sie keinem gehören. Gebt ihnen eigene Zeilen im Plan. Der Kühlschrank wird alle zwei Wochen durchgesehen: Abgelaufenes entsorgen, Fächer abwischen. Die Spülmaschine wird täglich ausgeräumt und ab und zu am Sieb gereinigt. Wer dabei merkt, dass etwas fehlt, trägt es ein: In ManaWG zeigen die Vorräte, was knapp wird, und schlagen vor, was ihr nachkaufen solltet, mehr dazu bei der [gemeinsamen Einkaufsliste](/einkaufsliste).',
			],
			[
				'Schritt 2: Aufwand schätzen',
				'Fair heißt nicht, dass alle gleich viele Aufgaben haben, sondern ungefähr gleich viel Zeit putzen. Schätzt die Zeiten für eure Wohnung einmal gemeinsam, dann gibt es später weniger Streit über ungleiche Lasten. Wer den Müll übernimmt, kann deshalb zusätzlich den Flur oder den Kühlschrank bekommen.',
			],
			[
				'Wie viel Zeit kostet der Plan pro Person?',
				'Rechnet vor dem Start einmal nach, was der Plan kostet. Die vier Wochenaufgaben aus den Richtwerten oben (Bad, Küche, Böden sowie Müll und Pfand) summieren sich auf etwa 90 bis 125 Minuten pro Woche. Verteilt auf vier Personen sind das rund 22 bis 31 Minuten, bei drei Personen 30 bis 42 und zu zweit 45 bis 63 Minuten. Täglich Anfallendes und seltene Aufgaben kommen dazu. Zeigt die Rechnung für eure Wohnung deutlich mehr, streicht Aufgaben oder verlängert den Rhythmus, statt den Plan mit Disziplin zu retten.',
			],
			[
				'Schritt 3: Auf die Woche verteilen',
				'Verteilt die Aufgaben so auf die Tage, dass nicht alles am Wochenende landet. Lasst einen Tag pro Woche frei: Er dient als Puffer für Verschobenes, und niemand muss an diesem Tag putzen.',
			],
			[
				'Täglich, wöchentlich, monatlich: was wann dran ist',
				'Ein Putzplan arbeitet mit drei Ebenen: täglich, wöchentlich und seltener. Was täglich anfällt, erledigt jede Person nebenbei, in den Plan gehören davon nur gemeinsam genutzte Geräte wie die Spülmaschine. Was wöchentlich anfällt, bildet den eigentlichen Wochenplan und wechselt zwischen den Personen. Alles, was seltener ansteht, verteilt ihr getrennt davon, sonst wird die Woche zu voll.',
			],
			[
				'Selten, aber nicht vergessen: Quartal, Halbjahr, Jahr',
				'Was nur selten anfällt, gehört trotzdem in den Plan, sonst wird es vergessen oder bleibt an einer Person hängen. Legt dafür eigene Rhythmen fest: vierteljährlich, halbjährlich und jährlich. Verteilt diese Aufgaben nicht in die Woche, sondern reihum, etwa eine pro Monat. So bleibt der Wochenplan schlank, und trotzdem hat jede seltene Aufgabe einen Termin und einen Namen. Handtücher und Bettwäsche wäscht in der Regel jede Person für sich, haltet aber auch dafür einen gemeinsamen Rhythmus fest. Die Tabelle zeigt Beispiele, die Abstände sind Richtwerte und hängen von Wohnung und Gewohnheiten ab.',
			],
			[
				'Schritt 4: Fest oder rotierend verteilen',
				'Es gibt drei Wege, die Aufgaben auf Personen zu verteilen. Eine fertige Vier-Wochen-Rotation für vier Personen steht in der [Putzplan-Vorlage](/putzplan-vorlage).',
			],
			[
				'Punktesystem: Aufwand fair zählen',
				'Beim Punktesystem zählt nicht die Zahl der Aufgaben, sondern der Aufwand. Legt fest, wie viel Zeit ein Punkt ist, etwa fünf Minuten, und gebt jeder Aufgabe Punkte nach den Richtwerten aus Schritt 2. Am Monatsende sollten alle ungefähr gleich viele Punkte haben. Das ist genauer als eine reine Rotation, verlangt aber, dass jemand mitzählt. Beispiel für drei Personen: Anna übernimmt das Bad mit 8 Punkten, Ben die Böden mit 7, Cem Küche und Müll mit zusammen 7. In der nächsten Woche tauscht ihr, damit niemand dauerhaft beim Bad bleibt.',
			],
			[
				'Schritt 5: Sichtbar machen und pflegen',
				'Der Plan muss für alle sichtbar sein, am besten dort, wo ohnehin jeder täglich hinschaut: als Aushang an Küchentür oder Kühlschrank, als Tabelle in einer geteilten Datei oder in einer App. Pflegt ihn regelmäßig. Zieht jemand aus oder passen Aufgaben nicht mehr, besprecht das in der WG-Runde und ändert den Plan.',
			],
			[
				'Die ersten vier Wochen: Probezeit',
				'Behandelt die ersten vier Wochen als Probezeit. Setzt euch danach kurz zusammen und geht drei Fragen durch: Welche Aufgabe wurde am häufigsten verschoben? Stimmen die geschätzten Zeiten? Gilt für alle dasselbe, wenn es heißt, ein Raum sei fertig? Ändert nur das, was sich wirklich als Problem gezeigt hat, und tragt den neuen Stand sichtbar ein. Danach reicht eine Prüfung alle paar Monate oder wenn jemand ein- oder auszieht.',
			],
			[
				'Besonderheiten in der WG',
				'Abwesenheit: Wer verreist ist, wird übersprungen und holt danach nicht alles doppelt nach, mehr unter [Urlaub und Abwesenheit](/wg-abwesenheit-urlaub)\nGäste: Wer Besuch einlädt, sorgt dafür, dass die Gemeinschaftsräume sauber bleiben\nStreit: Hält sich jemand nicht an den Plan, sprecht sachlich an, was konkret nicht gemacht wurde, und bewertet nicht die Person, mehr unter [Streit lösen](/wg-streit-loesen)',
			],
			[
				'Fertig statt selbst bauen',
				'Die [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) gibt es als Tabelle und als CSV-Download. Sie enthält fertige Rotationen für zwei, drei, vier und fünf Personen und einen Generator für eure Namen.\nDie [Putzplan-App](/putzplan) von ManaWG wiederholt Aufgaben in Tagen oder Monaten und bestimmt nach Auslastung, wer als Nächstes dran ist: Zugewiesene und überfällige Aufgaben zählen, überfällige stärker. Abwesende werden übersprungen, und an fällige zugewiesene Aufgaben erinnert ManaWG per Push.',
			],
		],
		tables: [
			{
				after: 'Selten, aber nicht vergessen: Quartal, Halbjahr, Jahr',
				title: 'Beispiel: seltene Aufgaben',
				header: ['Rhythmus', 'Beispiele', 'So verteilt ihr es'],
				rows: [
					[
						'vierteljährlich',
						'Küchenschränke innen auswischen, Mülleimer gründlich reinigen',
						'reihum, eine Person je Quartal',
					],
					[
						'halbjährlich',
						'Kühlschrank leeren und auswischen, Vorhänge waschen',
						'reihum, zwei feste Termine im Jahr',
					],
					[
						'jährlich',
						'Dunstabzugsfilter reinigen, Gefrierfach abtauen',
						'eine Person pro Aufgabe, im Plan mit Datum',
					],
				],
				note: 'Grobe Richtwerte, keine Messung.',
			},
			{
				after: 'Schritt 1: Aufgaben nach Räumen sammeln',
				title: 'Beispiel: Aufgaben nach Räumen und Rhythmus',
				header: ['Raum', 'Aufgabe', 'Rhythmus'],
				rows: [
					['Küche', 'Herd, Arbeitsflächen, Spüle, Boden', 'wöchentlich'],
					['Küche', 'Spülmaschine ausräumen', 'täglich'],
					['Küche', 'Kühlschrank durchsehen', '14-tägig'],
					['Küche', 'Backofen reinigen', 'monatlich'],
					['Bad', 'Waschbecken, Dusche, WC, Spiegel, Boden', 'wöchentlich'],
					['Flur', 'Boden saugen oder wischen', '14-tägig'],
					['Wohnzimmer', 'Boden saugen, Oberflächen abwischen', 'wöchentlich'],
					['Wohnzimmer', 'Fenster putzen', 'monatlich'],
					['Müll', 'Restmüll, Altpapier und Pfand wegbringen', 'wöchentlich'],
				],
			},
			{
				after: 'Schritt 2: Aufwand schätzen',
				title: 'Zeitaufwand je Aufgabe',
				header: ['Aufgabe', 'Richtwert'],
				rows: [
					['Bad gründlich', '30 bis 45 Minuten'],
					['Küche', '20 bis 30 Minuten'],
					['Böden saugen und wischen', '30 bis 40 Minuten'],
					['Müll und Pfand', '10 Minuten'],
				],
				note: 'Grobe Richtwerte, keine Messung.',
			},
			{
				after: 'Schritt 3: Auf die Woche verteilen',
				title: 'Beispiel: Wochen-Putzplan',
				header: ['Tag', 'Aufgabe', 'Was dazugehört'],
				rows: [
					['Montag', 'Müll', 'Müll, Altpapier und Pfand rausbringen'],
					['Dienstag', 'Küche', 'Herd, Arbeitsflächen, Spüle, Boden'],
					['Mittwoch', 'Bad', 'Waschbecken, Dusche, WC, Spiegel, Boden'],
					['Donnerstag', 'Böden', 'Flur und Wohnzimmer saugen'],
					['Freitag', 'Kühlschrank', 'durchsehen, Abgelaufenes entsorgen'],
					['Samstag', 'Böden und Wäsche', 'Böden wischen, Handtücher und Lappen waschen'],
					['Sonntag', 'frei', 'Puffer für Verschobenes'],
				],
			},
			{
				after: 'Schritt 4: Fest oder rotierend verteilen',
				title: 'Drei Wege der Verteilung',
				header: ['Weg', 'Vorteil', 'Nachteil'],
				rows: [
					[
						'Feste Gebiete',
						'einfach, jede Person weiß, was ihres ist',
						'ungerecht, wenn eine Aufgabe unbeliebt ist',
					],
					[
						'Rotation',
						'fairer, jede Person macht jede Aufgabe im Wechsel',
						'braucht jemanden, der den Überblick hält',
					],
					[
						'Punktesystem',
						'Aufgaben zählen nach Aufwand',
						'mehr Rechnerei, die Punkte müssen gepflegt werden',
					],
				],
			},
			{
				after: 'Täglich, wöchentlich, monatlich: was wann dran ist',
				title: 'Beispiel: Aufgaben nach Rhythmus',
				header: ['Rhythmus', 'Beispiele', 'So verteilt ihr es'],
				rows: [
					[
						'täglich',
						'Spülmaschine ausräumen, Arbeitsfläche abwischen, eigenes Geschirr spülen',
						'jede Person für sich, nur gemeinsame Geräte in den Plan',
					],
					[
						'wöchentlich',
						'Bad, Küche, Böden, Müll und Pfand',
						'im Wochenplan, jede Woche wechseln',
					],
					[
						'alle 14 Tage',
						'Flur, Kühlschrank durchsehen',
						'abwechselnd in geraden und ungeraden Wochen',
					],
					[
						'monatlich',
						'Backofen, Fenster, gemeinsame Vorräte prüfen',
						'reihum, jede Person nimmt einen Monat',
					],
				],
			},
			{
				after: 'Punktesystem: Aufwand fair zählen',
				title: 'Beispiel: Punkte nach Aufwand (1 Punkt = 5 Minuten)',
				header: ['Aufgabe', 'Richtwert', 'Punkte'],
				rows: [
					['Bad gründlich', 'rund 40 Minuten', '8'],
					['Böden saugen und wischen', 'rund 35 Minuten', '7'],
					['Küche', 'rund 25 Minuten', '5'],
					['Müll und Pfand', '10 Minuten', '2'],
				],
				note: 'Grobe Richtwerte, keine Messung. Die Punkte sind ein Beispiel.',
			},
		],
		faq: [
			[
				'Was gehört in einen Putzplan?',
				'Eine Liste der Aufgaben nach Räumen, ein Rhythmus je Aufgabe, eine Zuständigkeit und eine Regel für Abwesenheit. Je konkreter die Aufgabe beschrieben ist, desto weniger Diskussion gibt es.',
			],
			[
				'Wie erstelle ich einen Wochen-Putzplan?',
				'Aufgaben auflisten, nach Häufigkeit sortieren und auf Wochentage verteilen, einen Tag pro Woche lasst ihr frei. Danach legt ihr fest, wer welche Aufgabe übernimmt und wie oft gewechselt wird, meist wöchentlich.',
			],
			[
				'Wie verteile ich Aufgaben fair?',
				'Nach Zeitaufwand, nicht nach der Zahl der Aufgaben. Schätzt die Zeiten gemeinsam, und lasst die Aufgaben rotieren, damit niemand dauerhaft beim unbeliebten Bad bleibt. Wer eine kurze Aufgabe wie den Müll hat, bekommt eine zweite dazu.',
			],
			[
				'Wie funktioniert ein Putzplan mit Punkten?',
				'Jede Aufgabe bekommt Punkte nach ihrem Zeitaufwand, zum Beispiel einen Punkt je fünf Minuten. Wer eine aufwendige Aufgabe wie das Bad übernimmt, braucht weniger weitere Aufgaben. Am Monatsende sollten alle ungefähr gleich viele Punkte haben, mitzählen müsst ihr selbst. Der Generator auf dieser Seite rotiert dagegen einfach der Reihe nach.',
			],
			[
				'Wie oft sollte man welche Räume putzen?',
				'Bad, Küche, Wohnzimmer und Müll wöchentlich, Flur und Kühlschrank alle 14 Tage, Backofen und Fenster monatlich. Die Spülmaschine wird täglich ausgeräumt. Das sind Beispiele, passt den Rhythmus an eure Wohnung an.',
			],
			[
				'Kann ich einen Putzplan online erstellen?',
				'Ja, mit dem Generator auf dieser Seite. Namen eintragen, Aufgaben und Wochen wählen, dann drucken oder als CSV speichern. Ohne Konto und ohne Speicherung.',
			],
			[
				'Gibt es eine Putzplan-App?',
				'Ja, ManaWG enthält einen Putzplan mit Rhythmus, Verteilung nach Auslastung, Abwesenheiten und Erinnerungen. Die App ist kostenlos und läuft im Browser.',
			],
			[
				'Kann ich den Putzplan in Excel oder Google Tabellen selbst bauen?',
				'Ja. Legt eine Tabelle mit den Spalten Woche, Aufgabe, Was dazugehört, Zuständig und Erledigt an, tragt eure Aufgaben aus Schritt 1 ein und lasst die Namen jede Woche eine Zeile weiterrutschen. In Excel, Numbers oder Google Tabellen geht das mit wenigen Zeilen. Wollt ihr nicht von null anfangen, ladet den Plan aus dem Generator als CSV herunter und öffnet ihn dort, die Anleitung steht bei der [Putzplan-Vorlage](/putzplan-vorlage). Das Weiterrücken pflegt ihr danach selbst.',
			],
		],
	},
	'wg-gruenden-checkliste': {
		link: 'WG gründen',
		updated: '2026-10-29',
		published: '2026-10-11',
		title: 'WG gründen: Schritt für Schritt mit Checkliste | ManaWG',
		description:
			'WG gründen Schritt für Schritt: Reihenfolge, Budget, Vertragsform, Kaution, WG-Vereinbarung und Anmeldung. Mit Checkliste zum Abhaken und Rechenbeispiel.',
		h1: 'WG gründen: Ablauf und Checkliste',
		intro:
			'Eine WG zu gründen heißt vor allem, Reihenfolge und Zuständigkeiten zu klären: Wer zieht ein, was darf die Wohnung kosten, welche Vertragsform gilt und wer zahlt wann welchen Anteil? Sie ersetzt keine Rechtsberatung, besonders nicht bei Mietverträgen.',
		sections: [
			[
				'In welcher Reihenfolge eine WG entsteht',
				'Wer eine WG neu gründet, sucht meist zuerst die Mitbewohner und dann die Wohnung: Als Gruppe bewerbt ihr euch geschlossen und kennt Budget und Erwartungen, bevor ihr besichtigt. Übernehmt ihr eine Wohnung, in der schon jemand wohnt, kehrt sich die Reihenfolge um. Die Tabelle zeigt, was in welcher Phase ansteht und in welchem Schritt dieser Seite es steht. Was ihr nach dem Einzug in den ersten Wochen erledigt, steht in der [Einzug-Checkliste](/wg-einzug-checkliste).',
			],
			[
				'1. Passende Mitbewohner finden',
				'Entscheidend ist weniger, ob ihr beste Freunde seid, als ob ihr ähnliche Vorstellungen vom Zusammenleben habt. Sprecht über Ruhezeiten, Besuch, Sauberkeit, Rauchen, Haustiere und darüber, ob ihr eine Zweck-WG oder gemeinsame Abende sucht. Wie ihr passende Leute findet und auswählt, steht unter [Mitbewohner finden](/mitbewohner-finden). Klärt auch, wie lange jede Person ungefähr bleiben will: Eine WG, in der alle zwei Jahre planen, funktioniert anders als eine mit Zwischenmietern.',
			],
			[
				'Budget und Wohnungsgröße vor der Suche',
				'Rechnet rückwärts: Was jede Person im Monat für die Warmmiete zahlen kann, mal die Zahl der Personen, ergibt die Obergrenze für die Wohnung. Bei vier Personen mit je 400 € sind das 1.600 € warm. Strom, Internet und der [Rundfunkbeitrag](/rundfunkbeitrag-wg) kommen meist dazu. Welche laufenden Kosten anfallen, steht unter [Nebenkosten in der WG](/wg-nebenkosten). Jede Person braucht ein eigenes Zimmer. Wollt ihr zusätzlich ein gemeinsames Wohnzimmer, sucht eine Wohnung mit einem Zimmer mehr, als ihr Personen seid. Mit großer Wohnküche reicht oft ein Zimmer pro Person. Ab vier Personen lohnt die Frage nach einem zweiten Bad. Sollen die Anteile nach Zimmergröße statt gleich verteilt werden, rechnet der [Mietrechner](/wg-miete-rechner) sie aus.',
			],
			[
				'2. Wohnung suchen und gemeinsam bewerben',
				'Sucht ihr als Gruppe, tretet gegenüber Vermietern geschlossen auf. Bereitet einen kurzen WG-Steckbrief vor: wer ihr seid, wie lange ihr bleiben wollt und welche Vertragsform ihr euch vorstellt. Häufig verlangen Vermieter von jeder Person eine Schufa-Auskunft, einen Einkommensnachweis und eine Mietschuldenfreiheitsbescheinigung; fragt vorher, was sie brauchen. Bei der Besichtigung fragt ihr nach der Zahl der Bäder, nach den Zählern für Strom und Gas und danach, ob der Vermieter einen gemeinsamen Vertrag, Einzelverträge oder Untermiete zulässt.',
			],
			[
				'Besichtigung: Ist die Wohnung WG-tauglich?',
				'Eine Wohnung kann groß genug sein und trotzdem nicht zur WG passen. Prüft bei der Besichtigung, ob jedes Zimmer eine eigene Tür hat oder ob man durch ein Zimmer gehen muss, um in ein anderes zu kommen. Schaut, ob die Zimmer ähnlich groß sind; bei deutlichen Unterschieden lohnt es sich, die Miete [nach Zimmergröße aufzuteilen](/wg-miete-rechner). Fragt euch, ob Küche und Bad am Morgen für alle reichen und ob es ein separates WC gibt. Gibt es nur einen Balkon, einen Kellerraum oder einen Stellplatz, klärt vorher, wer ihn nutzt. Lasst euch außerdem die Erlaubnis des Vermieters zur Nutzung als WG schriftlich geben.',
			],
			[
				'3. Die richtige Vertragsform wählen',
				'In einer WG gibt es drei übliche Konstellationen. Beim gemeinsamen Hauptmietvertrag unterschreiben alle und haften gemeinsam für die ganze Miete; ausziehen kann eine Person nur mit Zustimmung von Vermieter und Mitbewohnern. Beim Untermietvertrag mietet eine Person die Wohnung und vermietet Zimmer weiter; sie trägt das Risiko, braucht dafür die Erlaubnis des Vermieters und hat mehr Einfluss bei Nachmietern. Bei Einzelmietverträgen hat jede Person einen eigenen Vertrag über ihr Zimmer mit dem Vermieter. Welche Form passt, hängt davon ab, wie fest die WG ist; die Unterschiede stehen im Ratgeber zum [WG-Mietvertrag](/wg-mietvertrag). Im Zweifel hilft ein Mieterverein.',
			],
			[
				'4. Kaution und Übergabe festhalten',
				'Die [Kaution](/wg-kaution) darf höchstens drei Nettokaltmieten betragen und kann in drei Monatsraten gezahlt werden. Haltet fest, wer welchen Anteil eingezahlt hat, damit bei einem Auszug klar ist, wem was zusteht. Bei der Wohnungsübergabe gehört jedes Zimmer ins Übergabeprotokoll, am besten mit Fotos von Schäden und den Zählerständen für Strom, Gas und Wasser.',
			],
			[
				'5. Eine WG-Vereinbarung unter euch',
				'Neben dem Mietvertrag lohnt sich eine kurze Vereinbarung nur unter euch. Sie regelt, was der Vertrag mit dem Vermieter offenlässt: Mietanteile je Zimmer, Nebenkosten, Strom und Internet, Putzplan, gemeinsame Kasse, Gäste und Ruhezeiten und was beim Auszug gilt, etwa wie früh jemand Bescheid sagt und wer bei der Suche nach einem Nachfolger hilft. Die Vereinbarung ist eine Absprache unter Mitbewohnern, am Mietvertrag ändert sie nichts. Ein kurzes Muster: „Wir, [Namen], wohnen ab [Datum] in [Adresse]. Miete: [Aufteilung]. Fixkosten: [Liste]. Putzplan: [Rhythmus]. Gäste: [Regel]. Wer auszieht, sagt es [Zahl] Wochen vorher und hilft bei der Suche nach einem Nachfolger. Nach drei Monaten sprechen wir die Vereinbarung neu durch.“ Vorschläge für einzelne Regeln stehen bei den [WG-Regeln](/wg-regeln). In ManaWG haltet ihr die Vereinbarung als Pinnwand-Beitrag der Art Entscheidung fest, die anderen antworten mit „Passt“.',
			],
			[
				'Ausstiegsplan, bevor ihr unterschreibt',
				'Sprecht den Auszug ab, solange alle sich gut verstehen. Haltet neben der Kündigungsfrist fest, ob alle bei der Wahl des Nachfolgers mitreden. Klärt auch die Kaution: Sie bleibt beim Vermieter, bis das Mietverhältnis endet. Oft zahlt der Nachfolger seinen Kautionsanteil direkt an die ausziehende Person, das notiert ihr in der Vereinbarung. Legt außerdem fest, was passiert, wenn jemand längere Zeit ausfällt, etwa nach einem Jobverlust oder bei einem Auslandssemester: Wer legt die Miete vor, und wie wird sie ausgeglichen? Wie ihr [Abwesenheiten](/wg-abwesenheit-urlaub) fair behandelt, steht in einem eigenen Ratgeber, die [Auszug-Checkliste](/wg-auszug-checkliste) zeigt, was beim Auszug ansteht.',
			],
			[
				'6. Anmelden und Verträge abschließen',
				'Nach dem Einzug muss sich jede Person innerhalb von zwei Wochen beim Bürgeramt anmelden. Dafür braucht es eine [Wohnungsgeberbestätigung](/wg-anmeldung), die der Vermieter ausstellt, bei Untermiete der Hauptmieter. Strom und Internet laufen meist auf eine Person, die Kosten teilt ihr. Der [Rundfunkbeitrag](/rundfunkbeitrag-wg) fällt einmal pro Wohnung an, nicht pro Person: Eine Person meldet sich an, die anderen geben deren Beitragsnummer an. Jede Person sollte eine eigene Haftpflichtversicherung haben und prüfen, ob ihre Hausratversicherung eine WG abdeckt.',
			],
			[
				'7. Geld verbindlich regeln',
				'Legt fest, wie die Miete aufgeteilt wird ([gleich oder nach Zimmergröße](/wg-kosten-aufteilen), der [Mietrechner](/wg-miete-rechner) rechnet es vor), wer welche Verträge führt und was ihr gemeinsam kauft. Wer zahlt, sollte das Geld zuverlässig zurückbekommen, ohne jedes Mal nachfragen zu müssen. Mit der [WG-App ManaWG](/wg-app) legt ihr Miete, Strom und Internet einmal als Fixkosten an und erfasst gemeinsame Einkäufe laufend. Die App zeigt Salden und Ausgleichsvorschläge, ihr überweist selbst.',
			],
			[
				'8. Erstausstattung absprechen',
				'Klärt, was gemeinsam angeschafft wird (Waschmaschine, Staubsauger, Küchengeräte, Putzmittel) und wem es gehört, wenn jemand auszieht. Bei teuren Dingen hilft eine einfache Notiz, wer wie viel bezahlt hat.',
			],
			[
				'Was die Gründung kostet',
				'Klärt vor der Unterschrift, wer wie viel zum Einzug zahlen kann, denn Kaution und erste Miete werden gleich zu Beginn fällig. Wie ihr danach die laufenden Kosten teilt, steht unter [WG-Kosten aufteilen](/wg-kosten-aufteilen).',
			],
			[
				'9. Haushalt und Putzplan organisieren',
				'Einigt euch auf einen Putzplan mit konkreten Aufgaben und festen Zyklen, etwa Bad wöchentlich, Küche wöchentlich, Flur alle zwei Wochen, Müll nach Bedarf. Die Anleitung [Putzplan erstellen](/putzplan-erstellen) zeigt, wie das geht, und eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) hilft beim Start. Eine gemeinsame Einkaufsliste für Dinge, die alle brauchen, verhindert, dass drei Leute Spülmittel kaufen und niemand Klopapier. Beides lässt sich in ManaWG teilen, ohne dass jemand die Liste per Hand pflegen muss.',
			],
			[
				'10. Regeln festhalten',
				'Haltet die wichtigsten Absprachen schriftlich fest, etwa Ruhezeiten, Umgang mit Besuch und Übernachtungsgästen, Gemeinschaftsräume und Vorgehen bei Streit. Eine Vorlage zum Übernehmen steht bei den [WG-Regeln](/wg-regeln). Es geht nicht um Paragrafen, sondern darum, dass später niemand sagen kann, davon habe er nichts gewusst. Die Pinnwand in ManaWG eignet sich dafür, weil Beschlüsse dort sichtbar bleiben und nicht im Chat untergehen.',
			],
			[
				'11. Einen Termin für die WG-Runde festlegen',
				'Einmal im Monat eine halbe Stunde reicht. Ihr gleicht die Salden in der [WG-Kasse](/wg-kasse) aus; die Monatsabrechnung von ManaWG kommt am Monatsanfang per Mail und zeigt Summen je Kategorie und Überweisungsvorschläge. Dazu besprecht ihr Termine im gemeinsamen Kalender und klärt, ob eine eurer Regeln angepasst werden muss. Beschlüsse haltet ihr auf der Pinnwand fest, damit sie nicht im Chatverlauf verschwinden. Wie ihr Konflikte ansprecht, steht unter [Streit in der WG lösen](/wg-streit-loesen).',
			],
			[
				'Wenn jemand auszieht oder nicht zahlt',
				'Beim gemeinsamen Hauptmietvertrag haftet jede Person dem Vermieter gegenüber für die ganze Miete, und ausziehen kann jemand nur mit Zustimmung von Vermieter und Mitbewohnern (siehe Tabelle oben). Bei Untermiete trägt der Hauptmieter das Risiko, wenn ein Zimmer leer steht. Entsteht nach Vertragsschluss ein berechtigtes Interesse, einen Teil der Wohnung unterzuvermieten, kann der Mieter unter bestimmten Voraussetzungen die Erlaubnis verlangen (§ 553 Abs. 1 BGB). Zahlt jemand nicht, sprecht es früh an und klärt, wie ihr Beträge ausgleicht. Mehr dazu unter [Schulden unter Mitbewohnern](/schulden-mitbewohner), [Mitbewohner kündigen](/mitbewohner-kuendigen) und [Zwischenmiete in der WG](/wg-zwischenmiete).',
			],
			[
				'Die Checkliste zum Abhaken',
				'1. Mitbewohner gefunden und Erwartungen besprochen\n2. Unterlagen für die Bewerbung je Person bereit\n3. Vertragsform gewählt und Mietvertrag unterschrieben\n4. Kaution gezahlt, Anteile notiert\n5. Übergabeprotokoll mit Fotos und Zählerständen\n6. WG-Vereinbarung aufgeschrieben und von allen bestätigt\n7. Alle innerhalb von zwei Wochen angemeldet\n8. Strom, Internet und Rundfunkbeitrag auf eine Person, Kosten geteilt\n9. Haftpflicht- und Hausratversicherung geprüft\n10. Mietaufteilung und Fixkosten festgelegt\n11. Erstausstattung abgesprochen\n12. Putzplan, Einkaufsliste und Regeln eingerichtet',
			],
		],
		faq: [
			[
				'Kann man einfach so eine WG gründen?',
				'Ja. Eine WG müsst ihr nicht als solche anmelden. Es braucht einen Mietvertrag, der das Zusammenwohnen erlaubt, und jede Person meldet sich innerhalb von zwei Wochen beim Bürgeramt an (§ 17 Abs. 1 BMG). Mietet eine Person die Wohnung allein und nimmt Mitbewohner auf, braucht sie dafür die Erlaubnis des Vermieters (§ 540 Abs. 1 BGB).',
			],
			[
				'Sind zwei Personen schon eine WG?',
				'Im Alltag ja: Zwei Personen, die sich eine Wohnung teilen, ohne Paar oder Familie zu sein, sind eine WG. Für Mietvertrag, Kaution und Anmeldung gilt dasselbe wie in einer größeren WG.',
			],
			[
				'Soll man erst Mitbewohner oder erst die Wohnung suchen?',
				'Wollt ihr euch als Gruppe bewerben, sucht zuerst die Mitbewohner. Dann wisst ihr vor der Besichtigung, wie viele Zimmer ihr braucht und welches Budget jede Person hat. Tipps zur Suche stehen unter [Mitbewohner finden](/mitbewohner-finden).',
			],
			[
				'Wie viele Zimmer braucht eine neue WG?',
				'Ein Zimmer pro Person, dazu ein Zimmer mehr, wenn ihr ein gemeinsames Wohnzimmer wollt. Vier Personen mit Wohnzimmer suchen also eine Fünf-Zimmer-Wohnung, mit großer Wohnküche reichen oft vier Zimmer.',
			],
			[
				'Was braucht man, um eine WG zu gründen?',
				'Eine geeignete Wohnung, passende Mitbewohner, einen geklärten Mietvertrag, die Anmeldung beim Bürgeramt, verbindliche Regeln für Geld und Haushalt und einen Rhythmus für Absprachen.',
			],
			[
				'Welcher Mietvertrag ist für eine WG am besten?',
				'Das hängt davon ab, wie fest die WG ist. Ein gemeinsamer Hauptmietvertrag gibt allen dieselben Rechte, macht aber den Auszug Einzelner umständlich. Untermiet- und Einzelmietverträge sind flexibler, wenn Mitbewohner öfter wechseln.',
			],
			[
				'Wie hoch darf die Kaution in einer WG sein?',
				'Höchstens drei Monatsmieten ohne Betriebskosten, zahlbar in drei gleichen Monatsraten (§ 551 BGB). Bei 1.200 € Kaltmiete sind das höchstens 3.600 €, bei vier Personen und gleicher Aufteilung 900 € pro Person.',
			],
			[
				'Braucht eine WG eine eigene Vereinbarung?',
				'Vorgeschrieben ist sie nicht. Sie hält fest, was der Mietvertrag nicht regelt: Mietanteile, Kosten, Putzen, Gäste und den Auszug. Am Mietvertrag ändert sie nichts.',
			],
			[
				'Muss jeder in der WG Rundfunkbeitrag zahlen?',
				'Nein. Der Rundfunkbeitrag fällt einmal pro Wohnung an. Eine Person zahlt, die anderen melden sich ab, und die WG teilt den Betrag.',
			],
			[
				'Wie organisiert man Geld in einer neuen WG?',
				'Mit klaren Regeln für Miete, Nebenkosten und gemeinsame Einkäufe und mit einem Werkzeug, das Ausgaben erfasst und Salden berechnet. Fixkosten legt ihr einmal an.',
			],
			[
				'Ist ManaWG für neue WGs geeignet?',
				'Ja. Eine Person erstellt die WG und teilt den Einladungslink, die anderen sind sofort dabei. Die App ist kostenlos und braucht keine Installation aus dem App Store.',
			],
			[
				'Welche Versicherungen braucht man in einer neuen WG?',
				'Für Mieter gibt es keine allgemeine gesetzliche Pflicht zu einer Haftpflicht- oder Hausratversicherung, ein Mietvertrag kann sie aber verlangen; schaut deshalb in den Vertrag. Sinnvoll ist eine private Haftpflichtversicherung für jede Person: Sie springt ein, wenn ihr aus Versehen Dinge von Mitbewohnern oder Dritten beschädigt. Ob auch Schäden an der Mietwohnung selbst eingeschlossen sind, steht in den Vertragsbedingungen. Die Hausratversicherung deckt eigene Sachen bei Einbruch, Feuer oder Leitungswasser. Fragt beim Versicherer nach, ob eine WG mitversichert ist und ob jede Person eine eigene Police braucht. Prüft auch, ob ihr über bestehende Verträge schon abgesichert seid.',
			],
			[
				'Zweck-WG oder Freundes-WG: Was passt zu uns?',
				'In einer Zweck-WG teilt ihr vor allem Wohnung und Kosten, jede Person lebt weitgehend für sich. In einer Freundes-WG kommen gemeinsame Abende, gemeinsames Kochen und oft eine Haushaltskasse dazu. Entscheidet das vor der Suche, denn davon hängt ab, wie viel ihr teilt: Kühlschrankfächer oder gemeinsamer Vorrat, getrennte Einkäufe oder [WG-Haushaltskasse](/wg-haushaltskasse). Auch die [WG-Regeln](/wg-regeln) fallen anders aus, etwa bei Besuch und Ruhezeiten. Zwischen beiden Typen gibt es viele Mischformen. Wichtig ist, dass alle dasselbe Bild haben.',
			],
		],
		tables: [
			{
				after: '4. Kaution und Übergabe festhalten',
				title: 'Beispiel: Kaution bei 1.200 € Kaltmiete und vier Personen',
				header: ['Position', 'Betrag', 'Grundlage'],
				rows: [
					['Höchstbetrag: drei Monatsmieten ohne Betriebskosten', '3.600 €', '§ 551 Abs. 1 BGB'],
					['Anteil je Person bei gleicher Aufteilung', '900 €', 'eure Absprache'],
					[
						'Zahlung in drei Monatsraten',
						'1.200 € je Rate, 300 € je Person',
						'§ 551 Abs. 2 BGB: erste Rate zu Beginn des Mietverhältnisses, die beiden weiteren mit den folgenden Mieten',
					],
				],
				note: 'Rechenbeispiel für eine Kaution in Geld. Bei Einzelmietverträgen gilt die Grenze für jeden Vertrag, bei Untermiete für den Untermietvertrag.',
			},
			{
				after: '3. Die richtige Vertragsform wählen',
				title: 'Drei Vertragsmodelle',
				header: ['Modell', 'Haftung', 'Auszug', 'Kündigung'],
				rows: [
					[
						'Gemeinsamer Hauptmietvertrag',
						'alle gemeinsam für die ganze Miete',
						'nur mit Zustimmung von Vermieter und Mitbewohnern',
						'in der Regel nur alle gemeinsam',
					],
					[
						'Untermiete',
						'der Hauptmieter allein',
						'Nachfolger wählt der Hauptmieter, mit Erlaubnis des Vermieters',
						'eigener Vertrag mit dem Hauptmieter',
					],
					[
						'Einzelmietvertrag',
						'jede Person für ihr Zimmer',
						'Nachfolger wählt meist der Vermieter',
						'eigener Vertrag',
					],
				],
				note: 'Mehr dazu im Ratgeber WG-Mietvertrag.',
			},
			{
				after: 'In welcher Reihenfolge eine WG entsteht',
				title: 'Ablauf der WG-Gründung',
				header: ['Phase', 'Was ihr klärt', 'Schritt'],
				rows: [
					['Vor der Suche', 'Wer zieht ein, Budget je Person, gewünschte Vertragsform', '1, 3, 7'],
					['Während der Suche', 'WG-Steckbrief, Unterlagen, Fragen bei der Besichtigung', '2'],
					[
						'Vor der Unterschrift',
						'Vertragsform, Zustimmung des Vermieters, Kaution und Anteile',
						'3, 4',
					],
					['Am Einzugstag', 'Übergabeprotokoll mit Fotos, Zählerstände, Schlüssel', '4'],
					[
						'In den ersten zwei Wochen',
						'Anmeldung beim Bürgeramt, Strom, Internet, Rundfunkbeitrag',
						'6',
					],
					[
						'Im ersten Monat',
						'WG-Vereinbarung, Mietaufteilung, Putzplan, Regeln, erste WG-Runde',
						'5, 7, 9, 10, 11',
					],
				],
				note: 'Die Anmeldung ist innerhalb von zwei Wochen nach dem Einzug fällig (§ 17 Abs. 1 BMG).',
			},
			{
				after: 'Budget und Wohnungsgröße vor der Suche',
				title: 'Beispiel: Zimmerzahl und Budget',
				header: [
					'Personen',
					'Zimmer ohne Wohnzimmer',
					'Zimmer mit Wohnzimmer',
					'Warmmiete bei 400 € je Person',
				],
				rows: [
					['2', '2', '3', '800 €'],
					['3', '3', '4', '1.200 €'],
					['4', '4', '5', '1.600 €'],
					['5', '5', '6', '2.000 €'],
				],
				note: 'Rechenbeispiel mit gleichem Beitrag je Person. Wie ihr die Miete tatsächlich aufteilt, hängt von Zimmergrößen und eurer Absprache ab.',
			},
			{
				after: 'Was die Gründung kostet',
				title: 'Kosten beim Start',
				header: ['Posten', 'Wann', 'Wer zahlt'],
				rows: [
					[
						'Kaution',
						'zu Mietbeginn, als Geld in drei Monatsraten möglich (§ 551 Abs. 2 BGB)',
						'jede Person ihren Anteil, Anteile notieren',
					],
					['Erste Miete', 'zu Mietbeginn', 'nach eurer Aufteilung'],
					['Umzug', 'vor dem Einzug', 'jede Person für sich'],
					[
						'Gemeinsame Erstausstattung',
						'um den Einzug',
						'gemeinsam, mit Notiz, wer wie viel bezahlt hat',
					],
					[
						'Strom und Internet',
						'ab Einzug, laufend',
						'eine Person führt den Vertrag, die Kosten teilt ihr',
					],
					['Haftpflichtversicherung', 'laufend', 'jede Person für sich'],
					['Hausratversicherung', 'laufend', 'je nach Police, vorher prüfen'],
				],
				note: 'Die Höhe der Kaution rechnet die Tabelle bei Schritt 4 vor.',
			},
		],
		sources: [
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			['§ 17 BMG, An- und Abmeldung', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
			[
				'§ 553 BGB, Gestattung der Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__553.html',
			],
			[
				'§ 540 BGB, Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__540.html',
			],
		],
	},
	'wg-mietvertrag': {
		link: 'WG-Mietvertrag',
		updated: '2026-10-29',
		published: '2026-10-19',
		title: 'WG-Mietvertrag Muster: Mietgemeinschaft, Untermiete | ManaWG',
		description:
			'Mietgemeinschaft, Untermiete oder Einzelverträge im Vergleich: Haftung, Kündigung, Mieterwechsel und Kaution, dazu Muster-Checklisten für den WG-Mietvertrag.',
		h1: 'Der WG-Mietvertrag: drei Modelle im Vergleich',
		intro:
			'Wer in einer WG wohnt, hat nicht automatisch dieselben Rechte wie die Mitbewohner. Entscheidend ist, wie der Mietvertrag aufgebaut ist: ob alle gemeinsam unterschreiben, eine Person untervermietet oder jede Person einen eigenen Vertrag hat. Davon hängt ab, wer für die Miete haftet, wer kündigen kann und wie ein Wechsel abläuft. Diese Seite gibt einen Überblick und ersetzt keine Rechtsberatung. Bei konkreten Fragen helfen Mietervereine.',
		sections: [
			[
				'Modell 1: Gemeinsamer Hauptmietvertrag (Mietgemeinschaft)',
				'Alle Mitbewohner unterschreiben einen Vertrag mit dem Vermieter, man spricht dann von einer Mietgemeinschaft. Jede Person hat damit dieselben Rechte, aber alle haften gemeinsam für die ganze Miete: Zahlt eine Person nicht, kann der Vermieter den vollen Betrag von jeder anderen verlangen. Kündigen können in der Regel nur alle gemeinsam, und [einen Mitbewohner kündigen](/mitbewohner-kuendigen) kann niemand. Will eine Person ausziehen, braucht der Wechsel die Zustimmung des Vermieters und der übrigen Mieter. Manche Vermieter nehmen dafür eine Klausel auf, die Mieterwechsel in der WG ausdrücklich erlaubt. Achtet beim Unterschreiben darauf, ob es sie gibt.',
			],
			[
				'Auszug aus der Mietgemeinschaft: So kommt ihr aus dem Vertrag',
				'Zieht eine Person aus, endet ihre Pflicht gegenüber dem Vermieter nicht von selbst. Wer im Mietvertrag steht, haftet als Gesamtschuldner (§ 421 BGB) weiter, bis der Vertrag endet oder der Vermieter zustimmt und die Person ausdrücklich aus dem Vertrag entlässt. Eine Absprache nur unter Mitbewohnern bindet den Vermieter nicht. So geht ihr vor: Fragt den Vermieter schriftlich, ob die Person ausscheiden darf und wer eintritt. Stellt die Nachfolge vor, denn der Vermieter prüft meist, ob die Miete gesichert ist. Haltet den Wechsel dann in einem schriftlichen Vertrag fest, den alle Beteiligten unterschreiben. Klärt die [Kaution](/wg-kaution) untereinander (sie bleibt beim Vermieter) und rechnet offene Beträge in der WG ab, bevor die Person geht. Auszug, Ummeldung oder Schlüsselrückgabe ändern an der Haftung nichts. Mehr zum Ablauf: [WG-Auszug-Checkliste](/wg-auszug-checkliste).',
			],
			[
				'Modell 2: Hauptmieter mit Untermietern',
				'Eine Person mietet die Wohnung und vermietet einzelne Zimmer weiter. Für die Untervermietung braucht sie die Erlaubnis des Vermieters. Für eine befristete Untervermietung steht der Ablauf unter [Zwischenmiete in der WG](/wg-zwischenmiete). Der Hauptmieter haftet dem Vermieter gegenüber allein für die ganze Miete und trägt damit das Risiko, wenn ein Zimmer leer steht oder jemand nicht zahlt. Dafür entscheidet er mit, wer einzieht. Untermieter haben einen Vertrag nur mit dem Hauptmieter. Wohnen sie in einem möblierten Zimmer in dessen Wohnung, gelten oft kürzere Kündigungsfristen und ein geringerer Kündigungsschutz als bei einer normalen Mietwohnung.',
			],
			[
				'Modell 3: Einzelmietverträge',
				'Jede Person schließt einen eigenen Vertrag mit dem Vermieter über ihr Zimmer und die Mitbenutzung von Küche und Bad. Das ist bei Studentenwohnheimen und gewerblich vermieteten WGs üblich. Niemand haftet für die Miete der anderen, und wer auszieht, kündigt nur den eigenen Vertrag. Den Nachfolger sucht dafür meist der Vermieter aus, die WG hat dabei oft wenig Mitsprache.',
			],
			[
				'Die drei Modelle im Überblick',
				'Haftung für die Miete: Hauptmietvertrag alle gemeinsam, Untermiete der Hauptmieter, Einzelvertrag jede Person für sich\nKündigung: Hauptmietvertrag nur gemeinsam, Untermiete der eigene Vertrag mit dem Hauptmieter, Einzelvertrag der eigene Vertrag\nNeue Mitbewohner: Hauptmietvertrag mit Zustimmung von Vermieter und WG, Untermiete wählt der Hauptmieter mit Erlaubnis des Vermieters, Einzelvertrag wählt der Vermieter\nRisiko bei Leerstand: Hauptmietvertrag alle, Untermiete der Hauptmieter, Einzelvertrag der Vermieter',
			],
			[
				'Kaution in der WG',
				'Die [Kaution](/wg-kaution) darf höchstens drei Nettokaltmieten betragen und kann in drei Monatsraten gezahlt werden. Beim gemeinsamen Hauptmietvertrag zahlt die WG sie gemeinsam. Haltet fest, wer welchen Anteil eingezahlt hat, denn bei einem Wechsel zahlt meist der Nachfolger seinen Anteil an die ausziehende Person, während die Kaution beim Vermieter bleibt. Bei Untermiete zahlt ihr die Kaution an den Hauptmieter.',
			],
			[
				'Was in den Vertrag gehören sollte',
				'1. Wer Mieter ist, mit vollem Namen\n2. Welche Räume zur alleinigen Nutzung gehören und welche gemeinsam genutzt werden\n3. Miete und Nebenkosten, getrennt ausgewiesen\n4. Höhe der Kaution\n5. Ob Untervermietung oder Mieterwechsel erlaubt ist\n6. Kündigungsfristen und gegebenenfalls Befristung\n7. Welche Möbel mitvermietet sind',
			],
			[
				'Muster-Checkliste für den Untermietvertrag',
				'Ein fertiges Vertragsmuster passt selten genau auf eure WG. Die Tabelle zeigt, welche Punkte ein Untermietvertrag für ein WG-Zimmer regeln sollte, jeweils mit einer Beispielangabe zum Anpassen. Ob das Zimmer möbliert ist und der Hauptmieter selbst dort wohnt, entscheidet über die Kündigungsfrist. Welche Fristen gelten, wenn ihr später auszieht, steht unter [WG-Zimmer kündigen](/wg-zimmer-kuendigen).',
			],
			[
				'Kündigungsfristen im Untermietvertrag',
				'Der Normalfall ist die gesetzliche Frist von drei Monaten für die Kündigung durch den Untermieter: Die schriftliche Kündigung muss spätestens am dritten Werktag eines Monats beim Hauptmieter eingegangen sein und beendet den Vertrag zum Ablauf des übernächsten Monats (§ 573c Abs. 1 BGB). Geht sie bis zum dritten Werktag im März ein, endet der Untermietvertrag am 31. Mai. Eine Ausnahme gilt für ein Zimmer, das in der vom Hauptmieter selbst bewohnten Wohnung liegt und überwiegend von ihm möbliert ist, sofern die Person dort nicht dauerhaft mit Familie oder gemeinsamem Haushalt wohnt (§ 573c Abs. 3 i. V. m. § 549 Abs. 2 Nr. 2 BGB). Dann reicht eine Kündigung bis zum 15. eines Monats zum Ablauf dieses Monats. Schreibt in den Vertrag, welcher Fall bei euch gilt, und nennt die Frist nicht nur pauschal „gesetzlich“. Weitere Fälle: [WG-Zimmer kündigen](/wg-zimmer-kuendigen).',
			],
			[
				'Muster-Checkliste für den gemeinsamen Hauptmietvertrag',
				'Steht ihr alle im Vertrag mit dem Vermieter, legt meist er den Vertrag vor. Prüft vor der Unterschrift die Punkte der Tabelle und fragt bei Lücken nach. Ohne andere Absprache tragen Gesamtschuldner untereinander gleiche Anteile (§ 426 BGB). Wollt ihr nach Zimmergröße aufteilen, haltet das in einer separaten WG-Vereinbarung fest, wie es [WG-Kosten aufteilen](/wg-kosten-aufteilen) beschreibt.',
			],
			[
				'Welches Modell passt?',
				'Für eine feste WG unter Freunden, die lange zusammen wohnen will, passt der gemeinsame Hauptmietvertrag mit einer Klausel für Mieterwechsel. Wechseln die Mitbewohner oft, etwa in Studentenstädten, ist Untermiete flexibler, belastet aber den Hauptmieter. Einzelverträge sind am bequemsten, geben der WG aber am wenigsten Einfluss darauf, wer einzieht. Wie ihr danach Miete, Nebenkosten und Einkäufe aufteilt, steht unter [WG-Kosten aufteilen](/wg-kosten-aufteilen), alles Weitere für den Start in der [Checkliste zum WG-Gründen](/wg-gruenden-checkliste).',
			],
		],
		tables: [
			{
				after: 'Muster-Checkliste für den gemeinsamen Hauptmietvertrag',
				title: 'Gemeinsamer Hauptmietvertrag: Punkte mit Beispiel',
				header: ['Punkt', 'Beispielangabe'],
				rows: [
					['Mieter', 'alle Mitbewohner mit vollem Namen, jede Person als Mieter'],
					['Haftung', 'alle als Gesamtschuldner, jede Person für die ganze Miete'],
					[
						'Mieterwechsel',
						'Klausel, dass einzelne Mieter mit Zustimmung des Vermieters ausscheiden und Nachfolger eintreten können (Nachfolgeklausel)',
					],
					['Kündigung', 'nur durch alle gemeinsam, schriftlich mit allen Unterschriften'],
					[
						'Miete',
						'Kaltmiete, Nebenkosten-Vorauszahlung, Fälligkeit und ein gemeinsames Zahlungskonto',
					],
					['Kaution', 'höchstens drei Nettokaltmieten, in drei Raten möglich'],
					['Räume', 'Zimmerzuordnung und gemeinsam genutzte Räume'],
					['Schönheitsreparaturen', 'ob und wie sie auf euch übertragen werden'],
					[
						'Separate WG-Vereinbarung',
						'Anteil jedes Zimmers an der Miete, Putzplan, Gäste, Auszugsregeln',
					],
				],
				note: 'Beispielangaben zum Anpassen, kein geprüftes Vertragsmuster.',
			},
			{
				after: 'Muster-Checkliste für den Untermietvertrag',
				title: 'Untermietvertrag für ein WG-Zimmer: Punkte mit Beispiel',
				header: ['Punkt', 'Beispielangabe'],
				rows: [
					['Vertragsparteien', 'Name und Anschrift von Hauptmieter und Untermieter'],
					['Mietsache', 'Zimmer 2 mit 14 m², Mitbenutzung von Küche, Bad und Flur'],
					['Möbel', 'möbliert mit Bett, Schrank und Schreibtisch, oder unmöbliert'],
					['Miete', '350 € im Monat, davon 80 € Vorauszahlung für Nebenkosten'],
					['Fälligkeit', 'spätestens am dritten Werktag des Monats'],
					['Kaution', 'Betrag, höchstens drei Monatsmieten ohne Nebenkosten'],
					['Beginn und Dauer', 'ab 1. März, unbefristet oder mit Enddatum'],
					['Kündigung', 'Frist und Fall nennen, etwa drei Monate nach § 573c BGB'],
					['Erlaubnis des Vermieters', 'Kopie der Erlaubnis zur Untervermietung als Anlage'],
					['WG-Regeln', 'Hausordnung und WG-Regeln als Anlage'],
					['Unterschriften', 'eigenhändig von beiden Seiten, mit Ort und Datum'],
				],
				note: 'Beispielangaben zum Anpassen, kein geprüftes Vertragsmuster.',
			},
		],
		faq: [
			[
				'Welcher Mietvertrag ist für eine WG am besten?',
				'Das hängt davon ab, wie fest die WG ist. Ein gemeinsamer Hauptmietvertrag gibt allen dieselben Rechte, macht Wechsel aber umständlich. Untermiete und Einzelverträge sind flexibler.',
			],
			[
				'Haften in einer WG alle für die Miete?',
				'Beim gemeinsamen Hauptmietvertrag ja: Der Vermieter kann die ganze Miete von jeder Person verlangen. Bei Untermiete haftet nur der Hauptmieter, bei Einzelverträgen jede Person für ihr Zimmer.',
			],
			[
				'Brauche ich für die Untervermietung eines WG-Zimmers die Erlaubnis des Vermieters?',
				'Ja, Untervermietung braucht die Erlaubnis des Vermieters. Unter bestimmten Voraussetzungen besteht ein Anspruch darauf, etwa wenn nach Vertragsschluss ein berechtigtes Interesse entstanden ist.',
			],
			[
				'Kann ein Mitbewohner allein aus dem gemeinsamen Mietvertrag kündigen?',
				'In der Regel nicht. Beim gemeinsamen Hauptmietvertrag müssen alle Mieter gemeinsam kündigen. Ein Wechsel einzelner Personen braucht die Zustimmung des Vermieters.',
			],

			[
				'Was ist eine Mietgemeinschaft?',
				'So heißt es, wenn mehrere Personen gemeinsam einen Mietvertrag über eine Wohnung unterschreiben. Alle sind gleichberechtigte Mieter und haften zusammen für die ganze Miete.',
			],
			[
				'Was ist ein Nebenmieter?',
				'Meist ist damit eine Person gemeint, die neben anderen im Hauptmietvertrag steht, also ein Mitmieter. Manche benutzen das Wort auch für Untermieter. Entscheidend ist, wer den Vertrag mit wem unterschrieben hat.',
			],
			[
				'Muss ein WG-Mietvertrag schriftlich sein?',
				'Nicht zwingend, ein Mietvertrag kann auch mündlich zustande kommen. Soll er aber länger als ein Jahr laufen, gilt er ohne Schriftform als unbefristet, und eine Kündigung ist frühestens zum Ablauf eines Jahres nach der Überlassung des Wohnraums möglich (§ 550 BGB). Auch die Kündigung selbst muss schriftlich erfolgen (§ 568 BGB). Beim gemeinsamen Hauptmietvertrag unterschreiben deshalb am besten alle Mieter, beim Untermietvertrag Hauptmieter und Untermieter. Jede Person behält ein unterschriebenes Exemplar, dazu gehören Anlagen wie die Erlaubnis des Vermieters, Hausordnung und Übergabeprotokoll.',
			],
		],
		sources: [
			[
				'§ 540 BGB, Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__540.html',
			],
			[
				'§ 553 BGB, Gestattung der Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__553.html',
			],
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			['§ 573c BGB, Kündigungsfristen', 'https://www.gesetze-im-internet.de/bgb/__573c.html'],
			['§ 421 BGB, Gesamtschuldner', 'https://www.gesetze-im-internet.de/bgb/__421.html'],
			[
				'§ 415 BGB, Vertrag zwischen Schuldner und Übernehmer',
				'https://www.gesetze-im-internet.de/bgb/__415.html',
			],
			[
				'§ 426 BGB, Ausgleichungspflicht, Forderungsübergang',
				'https://www.gesetze-im-internet.de/bgb/__426.html',
			],
			[
				'§ 549 BGB, Auf Wohnraummietverhältnisse anwendbare Vorschriften',
				'https://www.gesetze-im-internet.de/bgb/__549.html',
			],
			['§ 550 BGB, Form des Mietvertrags', 'https://www.gesetze-im-internet.de/bgb/__550.html'],
			[
				'§ 568 BGB, Form und Inhalt der Kündigung',
				'https://www.gesetze-im-internet.de/bgb/__568.html',
			],
		],
	},
	'wg-zwischenmiete': {
		link: 'Zwischenmiete',
		updated: '2026-10-29',
		published: '2026-10-19',
		title: 'Zwischenmiete in der WG: Ablauf, Vertrag, Kosten | ManaWG',
		description:
			'WG-Zimmer zwischenvermieten für Auslandssemester oder Praktikum: Erlaubnis des Vermieters, Zwischenmietvertrag, Miete, Kaution, Anmeldung und Übergabe.',
		h1: 'Zwischenmiete in der WG',
		intro:
			'Ein Auslandssemester, ein Praktikum in einer anderen Stadt oder ein paar Monate auf Reisen: Wer das WG-Zimmer behalten will, aber keine Miete für ein leeres Zimmer zahlen möchte, sucht eine Zwischenmiete. Damit das für alle gut geht, braucht es die Erlaubnis des Vermieters, einen klaren Vertrag und die Zustimmung der Mitbewohner. Diese Seite gibt einen Überblick und ersetzt keine Rechtsberatung.',
		sections: [
			[
				'Erst fragen: Vermieter und WG',
				'Eine Zwischenmiete ist rechtlich eine [Untervermietung](/wg-mietvertrag) und braucht die Erlaubnis des Vermieters, am besten schriftlich. Wer nach Vertragsschluss ein berechtigtes Interesse hat, etwa wegen eines befristeten Auslandsaufenthalts, hat unter bestimmten Voraussetzungen einen Anspruch darauf. Genauso wichtig sind die Mitbewohner: Sie leben monatelang mit der neuen Person zusammen und sollten bei der Auswahl mitentscheiden.',
			],
			[
				'Den Zwischenmieter finden',
				'Zwischenmieter suchen oft kurzfristig und für feste Zeiträume, etwa Austauschstudierende oder Praktikanten. Gebt in der Anzeige genau an, von wann bis wann das Zimmer frei ist, was es warm kostet und was im Zimmer bleibt. Kürzel wie WM, KM und ZW erklärt das Glossar [WG-Anzeigen-Abkürzungen](/wg-abkuerzungen). Ein kurzes Kennenlernen mit der WG, notfalls per Videocall, verhindert böse Überraschungen. Wie ihr Bewerbungen sortiert und auswählt, steht unter [Mitbewohner finden](/mitbewohner-finden).',
			],
			[
				'Der Zwischenmietvertrag',
				'1. Namen von Hauptmieter oder Mieter und Zwischenmieter\n2. Genauer Zeitraum mit Anfangs- und Enddatum\n3. Miete inklusive Nebenkosten, Internet und Rundfunkanteil\n4. Kaution und wann sie zurückgezahlt wird\n5. Welche Möbel und Gegenstände im Zimmer bleiben\n6. Dass die Regeln der WG gelten, etwa Putzplan und Ruhezeiten\n7. Übergabe mit Protokoll und Fotos zu Beginn und am Ende',
			],
			[
				'Miete und Kaution',
				'Üblich ist, dass der Zwischenmieter die Miete für das Zimmer übernimmt, also den Anteil an Kaltmiete, Nebenkosten, Strom und Internet. Ihr selbst zahlt an Vermieter oder WG weiter wie bisher und bekommt das Geld vom Zwischenmieter. Eine Kaution von ein bis zwei Monatsmieten schützt euch vor Schäden und offenen Beträgen. Wer möbliert vermietet, darf dafür einen angemessenen Aufschlag nehmen, ein Gewinn auf Kosten des Zwischenmieters ist aber nicht der Sinn.',
			],
			[
				'Anmeldung und Formalitäten',
				'Wer bereits in Deutschland gemeldet ist und nicht länger als sechs Monate bleibt, muss sich für die Zwischenmiete in der Regel nicht ummelden. Bleibt die Person länger, muss sie sich innerhalb von zwei Wochen nach Ablauf der sechs Monate [anmelden](/wg-anmeldung), wer sonst im Ausland wohnt, schon nach drei Monaten. Dafür stellt ihr als Hauptmieter die Wohnungsgeberbestätigung aus. Ihr selbst bleibt während eurer Abwesenheit normalerweise unter der WG-Adresse gemeldet. Denkt an einen Nachsendeauftrag oder bittet die WG, eure Post zu sammeln.',
			],
			[
				'Im WG-Alltag',
				'Für die Zeit der Zwischenmiete ist die neue Person ein vollwertiges WG-Mitglied: Sie steht im Putzplan, zahlt bei gemeinsamen Einkäufen mit und hält sich an die Regeln. In der [WG-App ManaWG](/wg-app) tritt sie der WG per Einladungslink bei und verlässt sie am Ende wieder selbst. Ausgaben werden in dieser Zeit mit ihr geteilt, nicht mit euch. Vor dem Auszug sollte ihr Saldo auf null stehen.',
			],
			[
				'Rückkehr und Übergabe',
				'Macht am Ende eine Übergabe mit dem Protokoll vom Anfang. Prüft Zimmer und Inventar, gleicht offene Beträge aus und zahlt die Kaution zurück, wenn alles in Ordnung ist. Plant ein paar Tage Puffer zwischen Auszug des Zwischenmieters und eurer Rückkehr ein, falls sich ein Termin verschiebt. Wer wegen der Abwesenheit noch Fragen zu Putzplan und Kosten hat, findet sie unter [Urlaub und Abwesenheit in der WG](/wg-abwesenheit-urlaub).',
			],
		],
		faq: [
			[
				'Brauche ich für eine Zwischenmiete die Erlaubnis des Vermieters?',
				'Ja. Zwischenmiete ist Untervermietung und braucht die Erlaubnis des Vermieters. Bei einem befristeten Auslandsaufenthalt besteht unter bestimmten Voraussetzungen ein Anspruch darauf.',
			],
			[
				'Muss sich ein Zwischenmieter anmelden?',
				'Wer schon in Deutschland gemeldet ist und höchstens sechs Monate bleibt, in der Regel nicht. Wer sonst im Ausland wohnt, muss sich nach drei Monaten anmelden.',
			],
			[
				'Wie viel Kaution nimmt man bei einer Zwischenmiete?',
				'Üblich sind ein bis zwei Monatsmieten. Sie wird nach der Übergabe am Ende zurückgezahlt, wenn keine Schäden oder offenen Beträge da sind.',
			],
			[
				'Darf ich bei der Zwischenmiete mehr verlangen, als ich selbst zahle?',
				'Ein angemessener Aufschlag für mitvermietete Möbel ist üblich. Deutlich mehr zu verlangen, ist unfair gegenüber dem Zwischenmieter und kann Ärger mit dem Vermieter bringen.',
			],
		],
		sources: [
			[
				'§ 540 BGB, Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__540.html',
			],
			[
				'§ 553 BGB, Gestattung der Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__553.html',
			],
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			['§ 17 BMG, An- und Abmeldung', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
		],
	},
	'wg-regeln': {
		link: 'WG-Regeln',
		updated: '2026-10-29',
		published: '2026-10-11',
		title: 'WG-Regeln Vorlage: 10 Regeln zum Übernehmen | ManaWG',
		description:
			'WG-Regeln Vorlage mit zehn Regeln für Ruhezeiten, Besuch, Putzen, Kühlschrank und Geld. Mit Spielraum, Folgen bei Verstößen und Aushang zum Ausfüllen.',
		h1: 'WG-Regeln: Vorlage mit zehn Regeln, die funktionieren',
		intro:
			'Viele WGs haben entweder gar keine Regeln oder einen langen Katalog, an den sich niemand hält. Gute WG-Regeln sind kurz, konkret und von allen beschlossen, meist reichen zehn auf einer Seite. Unten steht eine Vorlage mit zehn Regeln zum Übernehmen, danach ein Aushang mit Lücken zum Ausfüllen, die einzelnen Bereiche und Beispiele, welche Folgen ihr bei Verstößen vereinbaren könnt.',
		tables: [
			{
				after: 'Vorlage: zehn WG-Regeln zum Übernehmen',
				title: 'Regeln mit Spielraum',
				header: ['Bereich', 'Standard aus der Vorlage', 'Spielraum'],
				rows: [
					[
						'Ruhezeiten',
						'unter der Woche ab 22 Uhr, am Wochenende ab Mitternacht',
						'Feiern einen Tag vorher ankündigen, Endzeit absprechen',
					],
					[
						'Besuch',
						'Übernachtungsgäste willkommen, ab der vierten Nacht vorher absprechen',
						'in Prüfungsphasen gilt eine Leise-Zeit nach Absprache',
					],
					[
						'Geschirr',
						'am selben Tag spülen oder einräumen',
						'nach einem Abend mit Gästen am nächsten Morgen',
					],
					[
						'Kühlschrank',
						'ein eigenes Fach je Person',
						'Gemeinsames im extra Fach, Fremdes nur nach Frage',
					],
					['Anschaffungen', 'über 30 Euro vorher absprechen', 'Betrag an euer Budget anpassen'],
					[
						'Putzplan',
						'Wechsel jede Woche, Abwesende werden übersprungen',
						'Tauschen erlaubt, wenn es vorher abgesprochen ist',
					],
					[
						'Gemeinsame Kosten',
						'Putzmittel, Klopapier und Spülmittel zahlen alle',
						'private Lebensmittel bleiben privat',
					],
					[
						'Abrechnung',
						'Ausgaben sofort eintragen, am Monatsersten ausgleichen',
						'kleine Beträge auch alle zwei Monate',
					],
					['WG-Runde', 'einmal im Monat', 'nach der Testphase auch seltener'],
				],
				note: 'Die Werte sind Beispiele, keine Vorschrift. Mietvertrag und Hausordnung gehen vor.',
			},
			{
				after: 'Wenn jemand Regeln wiederholt bricht',
				title: 'Folgen, die ihr vorher vereinbaren könnt',
				header: ['Verstoß', 'Vereinbarte Folge', 'Gedanke dahinter'],
				rows: [
					[
						'Putzaufgabe nicht erledigt',
						'innerhalb von zwei Tagen nachholen',
						'der Schaden wird behoben, niemand putzt doppelt',
					],
					[
						'Party nicht angekündigt',
						'die nächste Feier mit Endzeit in der WG-Runde anmelden',
						'die Absprache wird nachgeholt',
					],
					[
						'Fremdes aus dem Kühlschrank gegessen',
						'Ersatz kaufen und künftig vorher fragen',
						'der Schaden wird ausgeglichen',
					],
					[
						'Gemeinsames nicht bezahlt',
						'Betrag bis zum nächsten Monatsersten ausgleichen',
						'passt zur Regel für die Abrechnung',
					],
				],
				note: 'Die Folgen sind Beispiele. Vereinbart sie vor dem ersten Verstoß und schreibt sie zu den Regeln. Geldstrafen verschärfen Streit meist eher.',
			},
		],
		sections: [
			[
				'Vorlage: zehn WG-Regeln zum Übernehmen',
				'1. Unter der Woche ist ab 22 Uhr Ruhe, am Wochenende ab Mitternacht.\n2. Partys werden mindestens einen Tag vorher angekündigt.\n3. Übernachtungsgäste sind willkommen, wer länger als drei Nächte bleibt, wird vorher abgesprochen.\n4. Geschirr wird am selben Tag gespült oder in die Spülmaschine geräumt.\n5. Der Putzplan rotiert wöchentlich, wer verreist ist, wird übersprungen und holt nichts nach.\n6. Jede Person hat ein eigenes Fach im Kühlschrank, Fremdes wird nur nach Frage gegessen.\n7. Putzmittel, Klopapier und Spülmittel zahlen alle gemeinsam, private Lebensmittel jede Person selbst.\n8. Anschaffungen über 30 Euro für die WG werden vorher abgesprochen.\n9. Ausgaben werden sofort eingetragen und am Monatsersten ausgeglichen.\n10. Einmal im Monat gibt es eine kurze WG-Runde, in der Regeln angepasst werden können.',
			],
			[
				'Aushang zum Ausfüllen: die Vorlage mit Lücken',
				'1. Ruhe ist unter der Woche ab ____ Uhr, am Wochenende ab ____ Uhr.\n2. Partys kündigen wir ____ Tage vorher an und sprechen die Endzeit ab.\n3. Übernachtungsgäste sind willkommen, ab der ____. Nacht in Folge sprechen wir es vorher ab.\n4. Geschirr wird spätestens ____ gespült oder eingeräumt.\n5. Der Putzplan wechselt jeden ____. Wer eine Aufgabe nicht schafft, tauscht vorher oder holt sie nach.\n6. Im Kühlschrank hat jede Person ein Fach, Gemeinsames liegt im Fach ____.\n7. Gemeinsam zahlen wir: ____. Selbst zahlt jede Person: ____.\n8. Anschaffungen für die WG über ____ Euro sprechen wir vorher ab.\n9. Ausgaben tragen wir sofort ein und gleichen sie am ____ aus.\n10. Die WG-Runde ist am ____ jedes Monats um ____ Uhr.',
			],
			[
				'Geltung und Unterschriften',
				'Ergänzt unter dem Aushang: Diese Regeln gelten ab ____, die Testphase läuft bis ____. Unterschriften: ____',
			],
			[
				'So einigt ihr euch auf WG-Regeln: Ablauf für den ersten Abend',
				'1. Themen sammeln: Jede Person schreibt zehn Minuten lang auf, was im Alltag wichtig ist oder schon genervt hat.\n2. Sortieren: Behaltet nur, was mehr als eine Person betrifft, und ordnet es den Bereichen der Vorlage zu.\n3. Zahlen festlegen: Uhrzeiten, Nächte, Beträge und Fristen schreibt ihr konkret auf, nicht „spät“ oder „länger“.\n4. Abstimmen: Eine Regel gilt, wenn alle zustimmen. Wer nicht zustimmt, nennt den Grund, dann sucht ihr einen Kompromiss.\n5. Aufhängen und testen: Druckt den Aushang aus oder haltet ihn als Entscheidung auf der Pinnwand fest, tragt Start und Ende der Testphase ein und legt den Termin der ersten WG-Runde fest. Feinheiten klärt ihr dort.',
			],
			[
				'Ruhezeiten und Lärm',
				'Vereinbart feste Zeiten, zu denen Ruhe herrscht, zum Beispiel unter der Woche ab 22 Uhr. Dazu gehört die Absprache, dass Feiern angekündigt werden. Eine Faustregel: Wer feiert, sagt es mindestens einen Tag vorher und nimmt Rücksicht auf Mitbewohner mit Prüfung oder Frühschicht.',
			],
			[
				'Homeoffice, Prüfungen und Schichtarbeit',
				'Grundregel: Feste Ruhezeiten reichen nicht, wenn jemand tagsüber arbeitet oder zu anderen Zeiten schläft. Ergänzt deshalb Ausnahmen, die ihr vorher absprecht.\nHomeoffice: Telefonate und Videocalls im eigenen Zimmer bei geschlossener Tür, Musik und Fernseher in den Kernarbeitszeiten leise oder mit Kopfhörern.\nPrüfungsphase: Eine Leise-Zeit, zum Beispiel von 19 bis 22 Uhr, die die Person vorher ansagt und die auf einige Wochen begrenzt ist.\nSchichtarbeit oder Frühstart: Wer nachts arbeitet oder sehr früh aufsteht, nennt den eigenen Rhythmus. Türen werden dann leise geschlossen, laute Geräte wie der Staubsauger laufen zu anderen Zeiten.\nEnddatum: Gebt jeder Ausnahme ein Enddatum, sonst wird sie zur Dauerregel.',
			],
			[
				'Besuch und Übernachtungsgäste',
				'Klärt, wie oft und wie lange Gäste bleiben dürfen und ob man vorher fragt. Wer Dauerbesuch hat, beteiligt sich an Nebenkosten. Rechtliche Fragen zum Mietvertrag klärt ihr mit Vermieter oder Mieterverein.',
			],
			[
				'Haushalt und Sauberkeit',
				'Haltet fest, wer wann welche Aufgabe übernimmt, und was „sauber“ bedeutet. Ein Putzplan mit festen Aufgaben und Erinnerungen ersetzt Diskussionen. Wie er entsteht, steht unter [Putzplan erstellen](/putzplan-erstellen), und eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) ist ein guter Anfang. Geschirr gehört nicht über Nacht in die Spüle, Gemeinschaftsräume bleiben nutzbar: solche Mini-Regeln verhindern die meisten Konflikte.',
			],
			[
				'Was heißt „sauber genug“? Ein Mindeststandard',
				'Grundidee: Streit um Sauberkeit entsteht oft, weil jede Person etwas anderes meint. Schreibt deshalb einen Mindeststandard auf, der jeden Tag für alle gilt.\nKüche: Arbeitsfläche und Herd nach dem Kochen abgewischt, Geschirr am selben Tag weggeräumt.\nBad: Dusche und Waschbecken nach der Nutzung kurz abgezogen, Haare aus dem Abfluss entfernt, Klopapier nachgelegt.\nMüll: Der Eimer wird geleert, bevor er überquillt.\nFlur: Schuhe stehen auf der Matte oder im Regal, nicht mittendrin.\nGründlich putzen: Das geschieht nach dem [Putzplan](/putzplan-erstellen) mit festen Aufgaben, der Mindeststandard ergänzt ihn für den Alltag. Die Beispiele sind Vorschläge, passt sie an eure Wohnung an.',
			],
			[
				'Gemeinsame Kasse und Einkauf',
				'Definiert, was gemeinsam bezahlt wird (Putzmittel, Klopapier, Gewürze) und was nicht. Legt fest, wie ausgeglichen wird: Wie eine gemeinsame Kasse geführt werden kann, steht im Ratgeber [WG-Haushaltskasse](/wg-haushaltskasse), die Aufteilung der Kosten unter [WG-Kosten fair aufteilen](/wg-kosten-aufteilen). Mit einer gemeinsamen [Einkaufsliste](/wg-einkauf-organisieren) weiß jeder, was fehlt, und doppelte Einkäufe entfallen.',
			],
			[
				'Gemeinsames Eigentum und Anschaffungen',
				'Legt früh fest, was wem gehört. Eine Liste in der WG-Runde genügt: Was hat eine Person mitgebracht, was wurde gemeinsam gekauft und wer hat wie viel bezahlt? Bei Anschaffungen über dem vereinbarten Betrag, in der Vorlage 30 Euro, wird vorher gefragt. Die Kosten teilt ihr unter denen, die das Gerät nutzen, wie unter [WG-Kosten fair aufteilen](/wg-kosten-aufteilen) beschrieben. Klärt auch, wer zahlt, wenn ein gemeinsames Gerät kaputtgeht. Ein Vorschlag: bei normaler Abnutzung alle, bei grober Unachtsamkeit die Person, die es verursacht hat. Beim [Auszug](/wg-auszug-checkliste) nimmt jede Person mit, was sie allein gekauft hat. Bei gemeinsam Gekauftem entscheidet ihr vorher, ob es bleibt und die Person ausgezahlt wird. Eigene Dinge werden nur nach Frage geliehen und zurückgegeben.',
			],
			[
				'Bad, Küche und Gemeinschaftsräume',
				'Morgens wird das Bad schnell knapp. Wer früh raus muss, bekommt ein festes Zeitfenster, alle anderen duschen davor oder danach. In der Küche gilt: Wer kocht, räumt danach auf, und die Arbeitsfläche ist frei für die nächste Person. Im Wohnzimmer bleibt nichts Privates dauerhaft liegen, sonst wird der Raum zum Abstellraum.',
			],
			[
				'Privatsphäre und eigene Zimmer',
				'Anklopfen: Fremde Zimmer betretet ihr nur nach Klopfen und Antwort, ist die Person nicht da, gar nicht.\nAusleihen: Dinge aus fremden Zimmern nehmt ihr nur nach Frage.\nPost und Pakete: Fremde Post bleibt ungeöffnet, angenommene Pakete kommen an einen festen Platz.\nNotfall: Bei Wasserschaden oder Rauch darf jemand ins Zimmer und sagt es danach sofort.\nAls Regel: „Unsere Zimmer sind privat. Wir klopfen an und nehmen nichts ohne Frage.“',
			],
			[
				'Müll, Wäsche, Schlüssel und WLAN',
				'Müll: Wer den vollen Eimer sieht, bringt ihn raus, oder der Müll steht als feste Aufgabe im [Putzplan](/putzplan-erstellen).\nWäsche: Die Waschmaschine wird nach dem Waschgang geleert, der Wäscheständer im Flur nach dem Trocknen weggeräumt.\nSchlüssel: Wer einen Schlüssel verliert, sagt es sofort, wer auszieht, gibt alle zurück.\nWLAN: Legt fest, ob Gäste das Passwort bekommen. Wie ihr die Kosten teilt, steht unter [Nebenkosten, Strom und Internet](/wg-nebenkosten).',
			],
			[
				'Regeln für Kühlschrank und Spülmaschine',
				'Kühlschrank: Alle zwei Wochen wird gemeinsam durchgesehen und Abgelaufenes entsorgt, zum Beispiel als wiederkehrende Putzaufgabe.\nSpülmaschine: Sauberes Geschirr wird gleich ausgeräumt, benutztes kommt in die Maschine statt über Nacht in die Spüle.\nSpülmaschine: Tabs und Klarspüler zahlen alle gemeinsam, wer den letzten nimmt, setzt ihn auf die Einkaufsliste.',
			],
			[
				'Rauchen, Haustiere und Instrumente',
				'Diese drei Punkte sorgen für den meisten Ärger, wenn sie vorher nicht besprochen sind. Klärt, ob in der Wohnung oder nur auf dem Balkon geraucht wird, ob Haustiere erlaubt sind (der Mietvertrag kann hier Grenzen setzen) und zu welchen Zeiten geübt werden darf. Am besten fragt ihr das schon beim [WG-Casting](/wg-casting-fragen).',
			],
			[
				'Regeln für neue Mitbewohner',
				'Wer neu einzieht, kennt die gewachsenen Absprachen nicht. Zeigt die Regeln vor dem Einzug, nicht erst beim ersten Streit, und fragt, ob etwas davon nicht passt. Nach einem Monat lohnt eine kurze Runde: Was ist ungewohnt, was soll sich ändern? So fühlen sich neue Leute als Teil der WG und nicht als Gast mit Pflichten.',
			],
			[
				'Testphase und Überprüfung',
				'Beschließt Regeln nicht für immer. Vereinbart eine Testphase von vier Wochen und einen festen Termin, an dem ihr besprecht, was nicht funktioniert hat. Danach reicht die monatliche WG-Runde, wie sie Regel 10 der Vorlage vorsieht.',
			],
			[
				'Wie ihr Regeln festhaltet',
				'Schreibt sie an einen Ort, den alle sehen. In [ManaWG als WG-App](/wg-app) eignet sich die Pinnwand. Sie kennt die Beitragsarten Info, Frage, Problem, Bitte und Entscheidung. Haltet eine Regel als Entscheidung fest; die Karte bittet die anderen um ein „Passt“. Wichtige Beiträge könnt ihr fixieren und geklärte Fragen als geklärt markieren. Ein Beschluss gilt, wenn alle zugestimmt haben, und lässt sich in der monatlichen WG-Runde anpassen.',
			],
			[
				'Konflikte ansprechen',
				'Sprecht Probleme früh und sachlich an: konkretes Verhalten, konkrete Auswirkung, konkreter Wunsch. „Du lässt oft Geschirr stehen, das stört mich, kannst du es abends spülen?“ funktioniert besser als „Du bist unordentlich“. Mehr dazu im Ratgeber [Streit in der WG lösen](/wg-streit-loesen).',
			],
			[
				'Wenn jemand Regeln wiederholt bricht',
				'1. Unter vier Augen ansprechen, sachlich und konkret.\n2. In der WG-Runde gemeinsam besprechen, ob die Regel noch passt.\n3. Eine klare Folge vereinbaren, etwa dass verpasste Putzaufgaben nachgeholt werden.\n4. Hilft nichts davon, offen über einen Auszug sprechen, bevor die Stimmung ganz kippt.',
			],
			[
				'Regeln, Hausordnung und Mietvertrag',
				'WG-Regeln sind Absprachen unter Mitbewohnern. Sie ergänzen Mietvertrag und Hausordnung, ersetzen sie aber nicht. Was dort steht, etwa Ruhezeiten im Haus oder Regeln zur Tierhaltung, gilt unabhängig von euren Absprachen. Prüft deshalb vorher, was der Vertrag schon festlegt.',
			],
		],
		faq: [
			[
				'Welche Regeln sollte jede WG haben?',
				'Ruhezeiten, Umgang mit Besuch, Putzen, gemeinsame Ausgaben und ein regelmäßiges Treffen für Absprachen. Mehr braucht es meist nicht.',
			],
			[
				'Wo hält man WG-Regeln fest?',
				'Dort, wo sie alle sehen: ausgedruckt in der Küche oder auf einer digitalen Pinnwand wie in ManaWG.',
			],
			[
				'Gibt es eine Vorlage für WG-Regeln?',
				'Ja, oben auf dieser Seite stehen zehn Regeln zu Ruhezeiten, Besuch, Putzen, Kühlschrank und Geld. Übernehmt nur, was zu eurer WG passt, und passt die Zahlen an.',
			],
			[
				'Sind WG-Regeln rechtlich verbindlich?',
				'In der Regel nicht. Es sind Absprachen unter Mitbewohnern. Verbindlich sind Mietvertrag und Hausordnung, die WG-Regeln ergänzen sie im Alltag.',
			],
			[
				'Was tun, wenn sich jemand nicht an die WG-Regeln hält?',
				'Erst unter vier Augen ansprechen, dann in der WG-Runde. Vereinbart eine klare Folge, zum Beispiel, dass verpasste Aufgaben nachgeholt werden.',
			],
			[
				'Wie viele WG-Regeln sind sinnvoll?',
				'Meist reichen zehn Regeln auf einer Seite. Wichtiger als die Zahl ist, dass jede Regel konkret ist und alle sie beschlossen haben. Was nur selten vorkommt, besprecht ihr in der WG-Runde statt in der Regelliste.',
			],
			[
				'Ab wann gilt Ruhe in der WG?',
				'Zuerst gilt, was Mietvertrag und Hausordnung festlegen. Viele WGs vereinbaren zusätzlich Ruhe ab 22 Uhr unter der Woche und ab Mitternacht am Wochenende. Die Zeiten in der Vorlage sind Beispiele, die ihr an euren Alltag anpasst.',
			],
			[
				'Wie lange darf Besuch in der WG bleiben?',
				'Das regelt ihr unter euch. Eine häufige Absprache: Ein bis drei Nächte sind kein Thema, danach wird vorher gefragt. Wer dauerhaft Besuch hat, beteiligt sich an den Nebenkosten, siehe [Nebenkosten, Strom und Internet](/wg-nebenkosten).',
			],
			[
				'Wie kann ich WG-Regeln ausdrucken?',
				'Kopiert den Aushang mit Lücken von dieser Seite in ein Dokument, füllt ihn gemeinsam aus und druckt ihn. Hängt ihn gut sichtbar auf, etwa an die Küchentür. Digital haltet ihr Regeln in ManaWG als Pinnwand-Beitrag der Art Entscheidung fest.',
			],
		],
	},
	'wg-nebenkosten': {
		link: 'WG-Nebenkosten',
		updated: '2026-10-27',
		published: '2026-10-11',
		title: 'WG-Nebenkosten, Strom und Internet fair aufteilen | ManaWG',
		description:
			'Wie WGs Nebenkosten, Strom, Internet und Rundfunkbeitrag aufteilen: Wer den Vertrag führt, wie ihr abrechnet und wie Nachzahlungen fair verteilt werden.',
		h1: 'Nebenkosten, Strom und Internet in der WG',
		intro:
			'Neben der Miete sind Nebenkosten, Strom und Internet die größten Posten im WG-Budget. Weil meist eine Person den Vertrag führt, entstehen Fragen: Wer zahlt was, und was passiert bei Nachzahlungen? Hier stehen die gängigen Lösungen.',
		sections: [
			[
				'Nebenkosten: Vorauszahlung und Abrechnung',
				'Die Nebenkosten bezahlt ihr in der Regel als monatliche Vorauszahlung, im Folgejahr kommt die Abrechnung des Vermieters, spätestens zwölf Monate nach Ende des Abrechnungszeitraums. Kommt sie später, kann der Vermieter in der Regel keine Nachzahlung mehr verlangen. Sie kann zu einer Nachzahlung oder einem Guthaben führen. Verteilt diese so wie die Vorauszahlung, und zwar unter denjenigen, die im Abrechnungszeitraum in der WG gewohnt haben. Zieht jemand zwischendurch aus oder ein, rechnet ihr anteilig nach Monaten.',
			],
			[
				'Beispiel: Nachzahlung bei Wechsel in der WG',
				'Die Abrechnung für das Vorjahr ergibt 360 Euro Nachzahlung. A und B haben das ganze Jahr in der WG gewohnt, C ist nach acht Monaten ausgezogen, D für die letzten vier Monate eingezogen. Zusammen sind das 12 + 12 + 8 + 4 = 36 Personenmonate, also 10 Euro pro Monat: A und B zahlen je 120 Euro, C 80 Euro und D 40 Euro. Ein Guthaben verteilt ihr genauso.',
			],
			[
				'Nach Köpfen oder nach Zimmergröße?',
				'Nach Köpfen ist am einfachsten und üblich, wenn die Zimmer ähnlich groß sind. Unterscheiden sie sich deutlich, teilt ihr nach Fläche. Beispiel: Zimmer mit 20, 16 und 14 Quadratmetern ergeben Anteile von 40, 32 und 28 Prozent. Bei 300 Euro Nebenkosten zahlen die drei 120, 96 und 84 Euro. Viele WGs mischen auch: Heizung nach Fläche, alles andere nach Köpfen. Wie ihr die Miete selbst nach Zimmergröße teilt, rechnet der [WG-Miete-Rechner](/wg-miete-rechner) vor.',
			],
			[
				'Strom und Gas',
				'Läuft der Vertrag auf eine Person, zahlt diese zunächst für alle. Gleichmäßige Aufteilung ist üblich, weil sich der Verbrauch einzelner Personen kaum messen lässt. Wer außergewöhnlich viel verbraucht, etwa durch einen Heimserver oder ein Elektrogerät, kann einen Aufschlag vereinbaren. Legt die monatliche Abschlagszahlung als Fixkosten an, damit nichts vergessen wird.',
			],
			[
				'Internet und Streaming',
				'Internet teilt ihr gleichmäßig. Bei Streaming-Abos klärt, wer sie nutzt: Wenn nur zwei von vier Personen schauen, zahlen auch nur diese. In der [WG-Kasse von ManaWG](/wg-kasse) wählt ihr bei jeder Ausgabe aus, wer beteiligt ist, und legt wiederkehrende Kosten als Fixkosten an.',
			],
			[
				'Rundfunkbeitrag',
				'Der Rundfunkbeitrag wird pro Wohnung erhoben, nicht pro Person. In einer WG zahlt ihn daher nur eine Person, und die Kosten werden unter allen aufgeteilt. Beachtet, dass sich Regelungen ändern können, und prüft die aktuelle Lage beim Beitragsservice. Mehr dazu steht im Ratgeber [Rundfunkbeitrag in der WG](/rundfunkbeitrag-wg).',
			],
			[
				'Monatsabrechnung als Überblick',
				'Eine Monatsübersicht zeigt, was insgesamt ausgegeben wurde und wer wem etwas schuldet. ManaWG erstellt sie automatisch: Gesamtsumme, Ausgaben je Kategorie und Überweisungsvorschläge. Am Monatsanfang kommt sie per Mail, das kann jede Person abschalten.',
			],
			[
				'Bei Auszug an die Abrechnung denken',
				'Die Nebenkostenabrechnung kommt oft erst Monate nach einem [Auszug](/wg-auszug-checkliste). Vereinbart deshalb beim Auszug, wie die ausziehende Person ihren Anteil an einer späteren Nachzahlung trägt oder ein Guthaben bekommt, und tauscht Kontaktdaten aus. Manche WGs behalten dafür einen kleinen Betrag ein, bis die Abrechnung da ist.',
			],
		],
		faq: [
			[
				'Wie werden Nebenkosten in der WG aufgeteilt?',
				'Meist wie die Miete, also nach Köpfen oder Zimmergröße. Nachzahlungen verteilt ihr unter denen, die im Abrechnungszeitraum in der WG wohnten.',
			],
			[
				'Wer zahlt die Nachzahlung, wenn jemand ausgezogen ist?',
				'Alle, die im Abrechnungszeitraum in der WG gewohnt haben, anteilig nach Monaten. Die ausgezogene Person zahlt also für die Monate, in denen sie da war.',
			],
			[
				'Wer zahlt den Rundfunkbeitrag in der WG?',
				'Der Beitrag gilt pro Wohnung. Eine Person meldet und zahlt ihn, die Kosten teilt ihr unter allen auf.',
			],
			[
				'Kann ich wiederkehrende Kosten automatisch buchen?',
				'Ja. In ManaWG legt ihr Miete, Internet oder Strom als Fixkosten an. Sie werden im Rhythmus ganzer Monate automatisch als Ausgabe gebucht.',
			],
		],
		sources: [
			[
				'§ 556 BGB, Vereinbarungen über Betriebskosten',
				'https://www.gesetze-im-internet.de/bgb/__556.html',
			],
			['Rundfunkbeitrag, ein Beitrag je Wohnung', 'https://www.rundfunkbeitrag.de/'],
		],
	},
	'wg-einkauf-organisieren': {
		link: 'WG-Einkauf organisieren',
		updated: '2026-10-21',
		published: '2026-10-11',
		title: 'Einkaufen in der WG: gemeinsam oder getrennt? | ManaWG',
		description:
			'Gemeinsame Kasse, geteilte Einkaufsliste oder jeder für sich: So organisiert ihr den Einkauf in der WG ohne Streit um Lebensmittel und Haushaltsbedarf.',
		h1: 'Einkaufen in der WG organisieren',
		intro:
			'Wer isst wessen Butter? Wer kauft Klopapier? Der Einkauf gehört zu den Dingen, die in WGs ständig Reibung erzeugen. Dabei gibt es drei bewährte Modelle, die sich auch kombinieren lassen.',
		sections: [
			[
				'Modell 1: Alles getrennt',
				'Jede Person kauft und kocht für sich. Das ist konfliktarm bei Menschen mit unterschiedlichen Essgewohnheiten. Gemeinsam bezahlt werden nur Haushaltsartikel wie Putzmittel, Klopapier, Müllbeutel und Gewürze.',
			],
			[
				'Modell 2: Gemeinsamer Grundbedarf',
				'Grundnahrungsmittel wie Öl, Nudeln, Reis, Gewürze und Getränke gehören allen, der Rest ist privat. Dafür braucht ihr eine Liste, in die jeder einträgt, was fehlt. Die [Einkaufsliste von ManaWG](/einkaufsliste) ist gemeinsam: Wer einkauft, hakt ab und kann den Einkauf danach direkt als Ausgabe erfassen.',
			],
			[
				'Beispiel: Grundbedarf in einer Vierer-WG',
				'Lena, Tom, Sara und Ben teilen sich den Grundbedarf: Putzmittel, Klopapier, Müllbeutel und Spülmaschinentabs. In diesem Monat kauft Lena Putzmittel und Klopapier für 20 Euro, Tom Müllbeutel für 12 Euro und Sara Spülmaschinentabs für 16 Euro. Ben kauft diesmal nichts. Zusammen sind das 48 Euro, jeder Anteil beträgt 12 Euro. Lena hat 8 Euro zu viel gezahlt, Sara 4 Euro, Tom genau seinen Anteil, Ben fehlen 12 Euro. Er überweist 8 Euro an Lena und 4 Euro an Sara, mehr Überweisungen braucht es nicht. Die Beträge sind ausgedachte Beispiele. In der App trägt jede Person ihren Einkauf als Ausgabe ein und wählt alle vier als Beteiligte, den Saldo und die Ausgleiche zeigt ManaWG an.',
			],
			[
				'Modell 3: Gemeinsam kochen und einkaufen',
				'Bei gemeinsamem Essen lohnt sich ein reihum geführter Einkauf. Die Kosten teilt ihr unter den Beteiligten. Wer nur gelegentlich mitisst, zahlt nur dann mit. Das lässt sich pro Ausgabe festlegen.',
			],
			[
				'Was in den gemeinsamen Einkauf gehört',
				'Putz- und Spülmittel, Schwämme und Lappen\nKlopapier, Küchenrolle, Müllbeutel\nSalz, Pfeffer, Öl, Essig und Grundgewürze\nKaffee, Tee, Zucker, wenn alle davon nehmen\nGlühbirnen, Batterien für Rauchmelder, Spülmaschinentabs',
			],
			[
				'Kühlschrank und Regale aufteilen',
				'Wer getrennt einkauft, braucht feste Plätze: ein Fach im Kühlschrank und ein Regalbrett pro Person, dazu ein gemeinsames Fach für Geteiltes. Was im gemeinsamen Fach steht, darf jede Person nehmen, alles andere nur nach Fragen. Einmal pro Woche sieht die Person mit dem Küchendienst den Kühlschrank durch und sortiert Abgelaufenes aus.',
			],
			[
				'Einen Rhythmus finden',
				'Viele WGs fahren gut mit einem festen Großeinkauf pro Woche für den Grundbedarf und kleinen Einkäufen nach Bedarf. Den Großeinkauf übernimmt reihum eine Person, die Liste füllen alle vorher. Wer ohnehin im Laden ist, sieht in der geteilten Liste, was fehlt, und bringt es mit.',
			],
			[
				'Vorräte im Blick behalten',
				'Doppelt gekaufte Nudeln und leere Gewürzdosen sind Zeichen fehlender Übersicht. Ein Vorratsbereich zeigt, was knapp wird. In ManaWG schlagen die Vorräte vor, was ihr nachkaufen solltet, und übernehmen es in die Einkaufsliste.',
			],
			[
				'Abrechnen ohne Zettelwirtschaft',
				'Kassenzettel in der Küche gehen verloren. Besser: Beträge sofort in die App eintragen. Beim Import lässt sich ein Foto oder Bildschirmfoto einer Ausgabenliste per Texterkennung einlesen und vor dem Speichern korrigieren. Am Monatsende zeigt der Saldo, wer wem wie viel schuldet. Wie eine gemeinsame Kasse funktioniert, steht unter [WG-Haushaltskasse](/wg-haushaltskasse).',
			],
		],
		faq: [
			[
				'Sollte man in der WG gemeinsam einkaufen?',
				'Das hängt von eurem Essverhalten ab. Gemeinsamer Grundbedarf und getrennte Lebensmittel ist der häufigste Kompromiss.',
			],
			[
				'Was gehört zum gemeinsamen WG-Einkauf?',
				'Meist Haushaltsartikel wie Putzmittel, Klopapier und Müllbeutel sowie Grundzutaten wie Öl, Salz und Gewürze. Lebensmittel für einzelne Personen bleiben privat.',
			],
			[
				'Wie teilt man den Kühlschrank in der WG auf?',
				'Ein Fach pro Person und ein gemeinsames Fach für Geteiltes. Was im gemeinsamen Fach steht, dürfen alle nehmen.',
			],
			[
				'Gibt es eine gemeinsame Einkaufsliste für WGs?',
				'Ja, ManaWG hat eine geteilte Einkaufsliste mit Vorräten. Abgehakte Einkäufe lassen sich direkt als Ausgabe eintragen.',
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
	'putzplan-vorlage': {
		link: 'Putzplan-Vorlage',
		widget: {
			after: 'Putzplan-Generator: Namen eintragen, Plan drucken',
			kind: 'rota-generator',
			csv: '/putzplan-vorlage.csv',
		},
		updated: '2026-10-27',
		published: '2026-10-11',
		title: 'WG-Putzplan Vorlage: 2 bis 5 Personen, PDF & CSV | ManaWG',
		description:
			'Kostenlose WG-Putzplan Vorlage zum Ausdrucken: Rotation für 2, 3, 4 und 5 Personen, Generator mit euren Namen, als PDF drucken oder als CSV für Excel öffnen.',
		h1: 'WG-Putzplan Vorlage zum Ausdrucken und Anpassen',
		intro:
			'Hier steht eine fertige Rotation für zwei, drei, vier und fünf Personen, kostenlos und ohne Konto. Im Generator tragt ihr eure Namen ein und druckt den Plan als PDF oder ladet ihn als CSV herunter.',
		sections: [
			[
				'Vorlage für vier Personen',
				'Bei vier Personen rotieren Bad, Küche, Böden sowie Müll und Flur. Jede Woche rückt jede Person eine Aufgabe weiter, nach vier Wochen hat jede Person alles einmal gemacht. A bis D stehen für eure vier Namen.',
			],
			[
				'Putzplan-Generator: Namen eintragen, Plan drucken',
				'Tragt zwei bis sechs Namen ein, wählt die Aufgaben und die Zahl der Wochen, und der Plan steht da. Er lässt sich drucken, auch als PDF speichern, oder als CSV herunterladen. Nichts wird gespeichert, ihr braucht kein Konto. Der Generator rotiert der Reihe nach. Die App verteilt zusätzlich nach überfälligen Aufgaben und überspringt Abwesende.',
			],
			[
				'Vorlage für drei und fünf Personen',
				'Bei drei Personen rotieren drei Aufgaben. Jede Woche rückt jede Person eine Aufgabe weiter, nach drei Wochen hat jede Person jede Aufgabe einmal gemacht. Bei fünf Personen kommen Wohnzimmer und Balkon als eigene Aufgabe hinzu, die Rotation dauert dann fünf Wochen.',
			],
			[
				'Vorlage für zwei Personen',
				'Zu zweit übernimmt jede Person zwei der vier Aufgaben, und jede Woche wird getauscht. Nach zwei Wochen hat jede Person alles einmal gemacht. Die Aufgaben sind so gepaart, dass beide ungefähr gleich viel zu tun haben: Bad und Küche zusammen, Böden sowie Müll und Flur zusammen. Bleibt ein kleiner Unterschied, gleicht ihn der wöchentliche Tausch aus.',
			],
			[
				'Aufgaben mit Rhythmus',
				'Die Wochenaufgaben stehen in der Rotation. Alles, was seltener anfällt, verteilt ihr extra. Streicht, was bei euch nicht vorkommt. Wie ihr eigene Aufgaben und Rhythmen aufbaut, steht in der Anleitung [Putzplan erstellen](/putzplan-erstellen).',
			],
			[
				'Vorlage in Excel oder Google Tabellen öffnen',
				'1. Plan im Generator erstellen und als CSV herunterladen. Die Datei trennt Spalten mit Semikolon, Umlaute bleiben erhalten\n2. Excel: Mit deutscher Spracheinstellung öffnet ein Doppelklick die Datei als Tabelle, sonst über Daten, Aus Text/CSV\n3. Google Tabellen: Datei, Importieren, Hochladen wählen und als Trennzeichen Semikolon angeben, falls es nicht erkannt wird\n4. Numbers: Die Datei direkt öffnen\n5. Spalten ergänzen, die der Ausdruck nicht hat, etwa „Erledigt“ und „Tausch mit“, dann teilen oder drucken',
			],
			[
				'So setzt ihr die Rotation ein',
				'Aushang: Hängt den Plan dort auf, wo ihn alle täglich sehen, etwa an der Küchentür oder am Kühlschrank\nWeiterrücken: Legt einen festen Wochentag fest, an dem die neue Woche beginnt, und rückt dann jede Person eine Aufgabe weiter\nTauschregel: Wer in einer Woche nicht kann, tauscht Aufgabe gegen Aufgabe mit einer Person und sagt es vorher in der WG\nMonatsaufgaben: Verteilt sie reihum, jede Person nimmt einen Monat',
			],
			[
				'Wann der Zettel nicht reicht',
				'Ein ausgedruckter Plan rotiert nicht von selbst und erinnert niemanden. Wer verreist ist, muss von Hand getauscht werden. Die [WG Putzplan App](/putzplan) von ManaWG legt Aufgaben mit Rhythmus an, zeigt, wer als Nächstes dran ist, überspringt Abwesende und erinnert per Push an fällige Aufgaben. Dafür erstellt ihr eine WG, schickt den Einladungslink und legt die Aufgaben an, kostenlos und im Browser.',
			],
		],
		tables: [
			{
				after: 'Vorlage für vier Personen',
				title: 'Vorlage: Vier-Wochen-Rotation für vier Personen',
				...TEMPLATE_FOUR,
				note: 'A, B, C und D stehen für vier Beispielpersonen.',
			},
			{
				after: 'Vorlage für drei und fünf Personen',
				title: 'Vorlage: Drei-Wochen-Rotation für drei Personen',
				...TEMPLATE_THREE,
				note: 'A, B und C stehen für drei Beispielpersonen.',
			},
			{
				after: 'Vorlage für drei und fünf Personen',
				title: 'Vorlage: Fünf-Wochen-Rotation für fünf Personen',
				...TEMPLATE_FIVE,
				note: 'A bis E stehen für fünf Beispielpersonen.',
			},
			{
				after: 'Vorlage für zwei Personen',
				title: 'Vorlage: Zwei-Wochen-Rotation für zwei Personen',
				...TEMPLATE_TWO,
				note: 'A und B stehen für zwei Beispielpersonen.',
			},
			{
				after: 'Aufgaben mit Rhythmus',
				title: 'Aufgaben mit Rhythmus',
				header: ['Aufgabe', 'Rhythmus', 'Was dazugehört'],
				rows: [
					['Bad', 'wöchentlich', 'Waschbecken, Dusche, WC, Boden'],
					['Küche', 'wöchentlich', 'Herd, Arbeitsflächen, Spüle, Boden'],
					['Böden', 'wöchentlich', 'Wohnzimmer und Gemeinschaftsflächen saugen oder wischen'],
					['Müll und Flur', 'wöchentlich', 'Müll und Pfand wegbringen, Flur saugen oder wischen'],
					[
						'Wohnzimmer und Balkon',
						'wöchentlich',
						'Aufräumen, Oberflächen abwischen, Balkon fegen',
					],
					['Kühlschrank', 'alle zwei Wochen', 'Aufräumen, Abgelaufenes entsorgen'],
					['Spiegel und Oberflächen', 'alle zwei Wochen', 'Spiegel, Oberflächen abwischen'],
					['Backofen', 'monatlich', 'Innenraum reinigen'],
					['Fenster oder Balkon', 'monatlich', 'Fenster putzen, Balkon fegen'],
					['Vorräte', 'monatlich', 'Gemeinsame Vorräte prüfen'],
				],
			},
		],
		faq: [
			[
				'Gibt es eine kostenlose Putzplan-Vorlage für die WG?',
				'Ja. Diese Seite hat fertige Rotationen für zwei, drei, vier und fünf Personen und einen Generator, in den ihr eure Namen eintragt. Der Plan ist kostenlos, ihr braucht kein Konto, und nichts wird gespeichert. Wer nichts ausdrucken will, nutzt den Putzplan in ManaWG.',
			],
			[
				'Wie oft wechseln die Aufgaben?',
				'Üblich ist ein wöchentlicher Wechsel. So macht jede Person jede Aufgabe regelmäßig und niemand bleibt dauerhaft beim unbeliebten Bad.',
			],
			[
				'Wie passe ich die Vorlage an drei oder fünf Personen an?',
				'Für drei und fünf Personen stehen fertige Tabellen auf dieser Seite. Bei drei rotieren Bad, Küche sowie Böden und Müll, bei fünf kommen Wohnzimmer und Balkon hinzu. Im Generator wählt ihr Namen und Aufgaben selbst, die Zahl der Wochen ist 4 oder 8.',
			],
			[
				'PDF oder CSV, was nehme ich?',
				'Für den Aushang nehmt ihr den Druck: Im Druckdialog des Browsers lässt sich der Plan auch als PDF speichern. Die CSV-Datei ist für alle, die den Plan in einem Tabellenprogramm weiterbearbeiten oder in einer geteilten Datei pflegen wollen.',
			],
			[
				'Wie sieht ein Putzplan für zwei Personen aus?',
				'Vier Aufgaben, je zwei pro Person, und jede Woche wird getauscht. Die Zwei-Wochen-Rotation steht als Tabelle auf dieser Seite. Im Generator tragt ihr beide Namen ein und wählt die Aufgaben selbst.',
			],
			[
				'Gibt es die WG-Putzplan Vorlage als Excel-Datei?',
				'Es gibt eine CSV-Datei, die sich in Excel, Numbers und Google Tabellen öffnen lässt. Sie enthält die Rotation mit euren Namen aus dem Generator. Eine xlsx-Datei mit Formeln gibt es nicht, zusätzliche Spalten wie „Erledigt“ ergänzt ihr selbst.',
			],
		],
	},
	'wg-haushaltskasse': {
		link: 'WG-Haushaltskasse',
		updated: '2026-10-27',
		published: '2026-10-11',
		title: 'WG-Haushaltskasse: Bargeld, Konto oder App? | ManaWG',
		description:
			'Gemeinsame Haushaltskasse in der WG: Bargeldkasse, Gemeinschaftskonto oder App? Vor- und Nachteile, Beispielrechnung, Regeln und Abrechnung ohne Streit.',
		h1: 'Die WG-Haushaltskasse: drei Wege',
		intro:
			'Klopapier, Putzmittel, Spülmaschinentabs: Kleinkram summiert sich und sorgt für Reibung. Eine gemeinsame Kasse kann das lösen, wenn klar ist, wie sie geführt wird. Hier stehen die drei üblichen Wege mit ihren Vor- und Nachteilen, eine Beispielrechnung und die Regeln, die bei jedem Weg gelten sollten.',
		sections: [
			[
				'Was in die Haushaltskasse gehört',
				'Bevor ihr über die Form sprecht, klärt den Inhalt. Typisch sind Dinge, die alle verbrauchen: Klopapier, Spülmittel, Putzmittel, Müllbeutel, Glühbirnen, Gewürze und Grundnahrungsmittel wie Öl, Salz oder Kaffee, falls ihr die teilt. Private Lebensmittel, Kosmetik und Dinge für das eigene Zimmer gehören nicht hinein. Größere Anschaffungen wie ein Staubsauger laufen besser getrennt, weil sie beim Auszug die Frage aufwerfen, wem das Gerät gehört.',
			],
			[
				'Weg 1: Bargeldkasse',
				'Alle zahlen monatlich einen festen Betrag in eine Dose, aus der gemeinsame Einkäufe bezahlt werden. Das ist anschaulich und braucht keine Technik. In der Praxis wird es schnell unübersichtlich: Belege gehen verloren, niemand weiß den Stand, wer gerade kein Bargeld hat, legt aus und vergisst es, und wer wegzieht, will seinen Anteil am Restbestand zurück. Wer diesen Weg wählt, sollte ein Kassenbuch führen und den Bestand einmal im Monat gemeinsam zählen.',
			],
			[
				'Weg 2: Gemeinschaftskonto',
				'Ein Konto, auf das alle per Dauerauftrag einzahlen, macht jede Buchung für alle sichtbar. Es braucht aber jemanden, der es eröffnet, führt und dafür geradesteht, und bei vielen Banken fallen Gebühren an. Läuft das Konto auf den Namen einer Person, trägt diese das Risiko, wenn andere nicht zahlen. Bei häufigen Wechseln in der WG wird die Verwaltung der Zugänge zudem mühsam.',
			],
			[
				'Weg 3: Ausgaben erfassen und ausgleichen',
				'Statt Geld vorzuhalten, zahlt jeder, was gerade fehlt, und trägt den Betrag ein, zum Beispiel direkt nach dem Einkauf von der [gemeinsamen Einkaufsliste](/wg-einkauf-organisieren). Am Monatsende zeigen die Salden, wer wem etwas schuldet. Wie ihr offene Salden fair ausgleicht, steht unter [Schulden unter Mitbewohnern](/schulden-mitbewohner). Es gibt keinen Bestand, den jemand verwalten muss, und niemand streckt dauerhaft Geld vor. In [ManaWG als WG-Kasse](/wg-kasse) teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person, ordnet jede Ausgabe einer Kategorie zu und seht, wofür das Geld geht. Die App schlägt Ausgleiche mit wenigen Überweisungen vor. Ihr überweist selbst und markiert als bezahlt. Wer bisher Splitwise oder Splid nutzt, übernimmt die Altdaten per CSV-Import, siehe [Umstieg](/splitwise-splid-wechseln).',
			],
			[
				'Beispielrechnung',
				'Eine WG mit drei Personen kauft im Monat gemeinsam für 90 Euro ein. Anna zahlt Putzmittel für 30 Euro, Ben den Großeinkauf für 51 Euro, Cem Müllbeutel für 9 Euro. Jeder Anteil liegt bei 30 Euro. Anna ist ausgeglichen, Ben hat 21 Euro zu viel gezahlt, Cem 21 Euro zu wenig. Eine einzige Überweisung von Cem an Ben gleicht alles aus. Bei Bargeldkasse oder Konto wären stattdessen drei Einzahlungen und drei Auszahlungen nötig gewesen.',
			],
			[
				'Regeln für jede Kasse',
				'Legt fest, was hineingehört und was nicht. Setzt eine Grenze, ab der vorher gefragt wird, etwa 30 oder 50 Euro. Bestimmt einen festen Tag für den Ausgleich, zum Beispiel den Monatsersten. Und klärt, was beim [Auszug](/wg-auszug-checkliste) passiert: Offene Beträge werden vor dem Auszug beglichen, gemeinsame Anschaffungen bleiben in der WG oder werden abgelöst. In ManaWG kommt am Monatsanfang eine Abrechnung per Mail mit Summen je Kategorie und den Überweisungsvorschlägen, jede Person kann sie abschalten.',
			],
		],
		faq: [
			[
				'Wie viel Geld gehört monatlich in die WG-Kasse?',
				'Das hängt vom Bedarf ab. Rechnet drei Monate eure tatsächlichen Gemeinschaftsausgaben zusammen und teilt durch die Zahl der Bewohner und Monate. Bei der Variante mit Ausgleich entfällt die feste Einzahlung.',
			],
			[
				'Was passiert mit der WG-Kasse, wenn jemand auszieht?',
				'Offene Beträge sollten vor dem Auszug ausgeglichen werden. Bei einer Bargeldkasse oder einem Konto bekommt die Person ihren Anteil am Restbestand. Bei erfassten Ausgaben reicht es, den Saldo auf null zu bringen.',
			],
			[
				'Gibt es eine App für die WG-Kasse?',
				'Ja, ManaWG ist kostenlos, auf Deutsch, ohne Werbung und zeigt Salden und Ausgleichsvorschläge.',
			],
		],
	},
	'wg-einzug-checkliste': {
		link: 'WG-Einzug',
		updated: '2026-10-29',
		published: '2026-10-11',
		title: 'Einzug in die WG: Checkliste für die ersten Wochen | ManaWG',
		description:
			'Checkliste für den Einzug in eine WG: Vertrag, Anmeldung, Schlüssel, Geld, Putzplan, Mitbewohner kennenlernen und die wichtigsten Dinge in der ersten Woche.',
		h1: 'Einzug in die WG: die Checkliste',
		intro:
			'Wer neu in eine WG zieht, muss nicht nur Kisten tragen, sondern auch Gewohnheiten kennenlernen. Die Punkte unten sind nach Zeitpunkt geordnet: vor dem Einzug, am Einzugstag, in der ersten Woche und im ersten Monat. Wer die WG erst aufsetzt, findet den ganzen Ablauf von der Suche bis zur Anmeldung in der [Checkliste zum WG-Gründen](/wg-gruenden-checkliste).',
		sections: [
			[
				'Vor dem Einzug: Vertrag und Formalien',
				'Klärt, ob ihr einen eigenen Mietvertrag mit dem Vermieter bekommt oder einen [Untermietvertrag](/wg-mietvertrag) mit einem Mitbewohner. Fragt nach Höhe und Rückzahlung der [Kaution](/wg-kaution): Sie darf höchstens drei Nettokaltmieten betragen und kann in drei Monatsraten gezahlt werden. Fragt außerdem, ob die Miete warm oder kalt angegeben ist. Was die Kürzel WM und KM in Anzeigen bedeuten, erklärt das Glossar [WG-Anzeigen-Abkürzungen](/wg-abkuerzungen). Lasst euch zeigen, welche Räume, Schränke und Fächer im Kühlschrank euch gehören. Fragt nach den bestehenden [Regeln](/wg-regeln) für Ruhe, Besuch und Putzen und danach, wie die Kosten verteilt werden.',
			],
			[
				'Am Einzugstag',
				'Lasst euch die Schlüssel übergeben und notiert, wie viele es sind. Seht euch das Zimmer mit der Person an, die übergibt, und haltet Schäden mit Fotos fest. Das schützt euch beim Auszug. Fragt nach dem WLAN, nach Sicherungskasten, Haupthahn und dem Platz für Fahrräder. Für die Anmeldung beim Bürgeramt braucht ihr in Deutschland eine Wohnungsgeberbestätigung, die der Vermieter oder Hauptmieter ausstellt. Die Anmeldung ist innerhalb von zwei Wochen nach dem Einzug fällig.',
			],
			[
				'In der ersten Woche',
				'Lernt die Mitbewohner kennen, am besten bei einem gemeinsamen Abendessen. Lasst euch Mülltrennung, Abholtage und Waschmaschinenzeiten erklären. Tragt euch in den Putzplan ein und fragt, wie die Rotation funktioniert. Gibt es noch keinen, hilft die Anleitung [Putzplan erstellen](/putzplan-erstellen), und eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) spart den Anfang. Wenn die WG [ManaWG als WG-App](/wg-app) nutzt, tretet ihr per Einladungslink bei und seht Putzplan, Einkaufsliste, Kalender und Pinnwand sofort.',
			],
			[
				'Geld von Anfang an klären',
				'Fragt, wer Strom, Internet und Rundfunkbeitrag führt und wie ihr euren Anteil zahlt. Der [Rundfunkbeitrag in der WG](/rundfunkbeitrag-wg) wird pro Wohnung nur einmal fällig, also nicht von jedem einzeln. Klärt, ob es eine gemeinsame [Haushaltskasse](/wg-haushaltskasse) gibt und ob bereits vorhandene Dinge wie Waschmaschine oder Küchengeräte abgelöst werden sollen. In ManaWG seht ihr nach dem Beitritt Fixkosten, Ausgaben und Salden der WG, neue Ausgaben werden ab dann mit euch geteilt.',
			],
			[
				'Gewohnheiten abgleichen',
				'Sprecht früh an, was euch wichtig ist: Schlafenszeiten, Gäste über Nacht, Rauchen, Tiere, Lautstärke, gemeinsames Kochen. Kleine Unterschiede lassen sich besprechen, solange sie früh auf dem Tisch liegen. Wer nach drei Monaten zum ersten Mal sagt, dass ihn etwas stört, hat es schwerer. Was die WG vereinbart, könnt ihr auf der Pinnwand festhalten, damit es nicht nur im Gruppenchat untergeht.',
			],
			[
				'Was ins WG-Zimmer mitkommt',
				'Bettzeug, Handtücher und eigene Hygieneartikel\nTeller, Tasse und Besteck, falls die Küche knapp ausgestattet ist\nVerlängerungskabel und Mehrfachstecker\nEin eigenes Fach für Vorräte, beschriftet\nAusweis und Wohnungsgeberbestätigung für die [Anmeldung](/wg-anmeldung)',
			],
			[
				'Nach dem ersten Monat',
				'Setzt euch einmal zusammen und fragt, was gut läuft und was nicht. Passt den Putzplan an, wenn Aufgaben ungleich verteilt sind. Prüft beim ersten Ausgleich, ob die Aufteilung der Kosten so funktioniert wie besprochen.',
			],
		],
		faq: [
			[
				'Was sollte man beim Einzug in eine WG klären?',
				'Mietvertrag oder Untermietvertrag, Kaution, Kostenverteilung, Putzplan, Ruhezeiten und den Umgang mit Besuch. Dazu die Wohnungsgeberbestätigung für die Anmeldung.',
			],
			[
				'Muss in einer WG jeder Rundfunkbeitrag zahlen?',
				'Nein. Der Rundfunkbeitrag wird pro Wohnung einmal fällig. Eine Person meldet die Wohnung an, die anderen beteiligen sich intern an den Kosten.',
			],
			[
				'Wie trete ich einer WG in ManaWG bei?',
				'Über den Einladungslink oder einen Code, den euch ein Mitbewohner schickt. Vorher meldet ihr euch mit Google oder mit E-Mail an.',
			],
		],
		sources: [
			['§ 17 BMG, An- und Abmeldung', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
			['§ 19 BMG, Wohnungsgeberbestätigung', 'https://www.gesetze-im-internet.de/bmg/__19.html'],
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
		],
	},
	'wg-abwesenheit-urlaub': {
		link: 'WG im Urlaub',
		updated: '2026-10-27',
		published: '2026-10-11',
		title: 'WG und Urlaub: Putzplan und Kosten bei Abwesenheit | ManaWG',
		description:
			'Was gilt in der WG, wenn jemand verreist? Putzplan, Miete, gemeinsame Kosten, Auslandssemester und Absprachen bei längerer Abwesenheit fair regeln.',
		h1: 'Urlaub und Abwesenheit in der WG',
		intro:
			'Wenn jemand wochenlang weg ist, fragen sich die anderen, wer die Aufgaben übernimmt und wer welche Kosten trägt. Ob Urlaub, Praktikum oder Auslandssemester: Klare Regeln, die vorher feststehen, vermeiden die meisten Streitigkeiten.',
		sections: [
			[
				'Putzplan bei Abwesenheit',
				'Wer nicht da ist, kann nicht putzen. Beim [Putzplan erstellen](/putzplan-erstellen) gehört dafür eine Regel dazu. Üblich ist, dass Abwesende übersprungen werden und danach nicht alles nachholen müssen. Manche WGs vereinbaren, dass vor einer längeren Reise die eigene Aufgabe noch erledigt wird, damit niemand ein ungeputztes Bad übernimmt. In [ManaWG als Putzplan-App](/putzplan) tragt ihr eine Abwesenheit mit Zeitraum ein. Beim Erledigen einer Aufgabe wird die Person dann bei der nächsten Zuweisung übergangen. Schon zugewiesene Aufgaben bleiben bei ihr, die App markiert sie als abwesend, und jemand anderes kann sie übernehmen.',
			],
			[
				'Miete und Fixkosten',
				'Die Miete läuft weiter, auch wenn das Zimmer leer steht. Bei Fixkosten wie Internet zahlen in der Regel alle weiter, weil der Vertrag unabhängig von der Nutzung kostet. Bei [verbrauchsabhängigen Kosten](/wg-nebenkosten) wie Strom, Heizung oder gemeinsamen Lebensmitteln kann man vereinbaren, dass Abwesende weniger zahlen. Das lohnt sich vor allem bei längeren Zeiträumen. Für zwei Wochen Urlaub ist eine Sonderregel meist mehr Aufwand als Ersparnis.',
			],
			[
				'Gemeinsame Ausgaben während der Abwesenheit',
				'Wer nicht da ist, isst nicht mit. Einkäufe in dieser Zeit sollten nur auf die Anwesenden verteilt werden. In ManaWG wählt ihr bei jeder Ausgabe, wer beteiligt ist, und lasst die abwesende Person einfach weg. So entsteht kein Saldo für Dinge, die sie nie genutzt hat.',
			],
			[
				'Längere Abwesenheit: Praktikum und Auslandssemester',
				'Bei mehreren Monaten stellt sich die Frage nach einer [Zwischenmiete](/wg-zwischenmiete). Ob das erlaubt ist, hängt vom Mietvertrag ab, meist muss der Vermieter zustimmen. Klärt in der WG, ob alle mit der Person einverstanden sind, denn sie lebt in dieser Zeit mit euch. Die Zwischenmieterin oder der Zwischenmieter kann der WG in ManaWG beitreten und übernimmt für die Zeit Aufgaben und Kosten. Danach tritt sie wieder aus.',
			],
			[
				'Beispiel: Auslandssemester ohne Zwischenmiete',
				'Eine Viererwohnung zahlt 120 Euro Strom im Monat, eine Person ist fünf Monate im Ausland und vermietet nicht unter. Die WG vereinbart, dass die abwesende Person in dieser Zeit nur ein Viertel ihres Stromanteils trägt: 7,50 statt 30 Euro. Die übrigen 22,50 Euro teilen sich die drei anderen, je 7,50 Euro mehr. Miete und Internet zahlt sie weiter voll, weil diese Kosten unabhängig von der Nutzung anfallen.',
			],
			[
				'Absprachen vor der Reise',
				'Sagt rechtzeitig Bescheid, wie lange ihr weg seid, und tragt den Zeitraum in den gemeinsamen Kalender ein. Klärt, wer sich um Pflanzen, Post und Haustiere kümmert. Leert verderbliche Lebensmittel aus dem Kühlschrank oder gebt sie frei. Und gleicht offene Beträge vor der Abreise aus, damit niemand wochenlang auf sein Geld wartet.',
			],
		],
		faq: [
			[
				'Muss man in der WG im Urlaub Putzdienst machen?',
				'Das regelt eure WG. Üblich ist, Abwesende zu überspringen. In ManaWG ist das mit der Abwesenheitsfunktion vorgesehen.',
			],
			[
				'Zahlt man in der WG im Urlaub Nebenkosten?',
				'Feste Kosten wie Miete und Internet laufen weiter. Bei verbrauchsabhängigen Kosten könnt ihr etwas anderes vereinbaren.',
			],
			[
				'Darf man sein WG-Zimmer während eines Auslandssemesters untervermieten?',
				'Das hängt vom Mietvertrag ab. In der Regel braucht ihr die Zustimmung des Vermieters, und die Mitbewohner sollten einverstanden sein.',
			],
		],
	},
	'schulden-mitbewohner': {
		link: 'Schulden in der WG',
		updated: '2026-10-27',
		published: '2026-10-11',
		title: 'Schulden unter Freunden und Mitbewohnern klären | ManaWG',
		description:
			'Geld unter Freunden oder Mitbewohnern geschuldet? So haltet ihr Schulden fest, sprecht sie an, gleicht sie aus und wisst, wann sie verjähren. Mit Beispiel.',
		h1: 'Schulden unter Mitbewohnern und Freunden ausgleichen',
		intro:
			'Kleine Beträge vergisst man leicht, und genau deshalb stauen sie sich auf. Nach ein paar Monaten weiß niemand mehr, wer wem was schuldet, und die Stimmung leidet. Das gilt unter Freunden genauso wie in der WG. Hier steht, wie ihr Schulden festhaltet, ansprecht und ausgleicht, was bei geliehenem Geld gilt und wann Schulden verjähren. Die Seite gibt einen Überblick und ersetzt keine Rechtsberatung.',
		sections: [
			[
				'Warum Schulden entstehen',
				'Jeder bezahlt mal für alle: Pizza, Einkauf, Reparatur, die Nachzahlung beim Strom. Ohne Aufzeichnung wissen nach einem Monat weder Gläubiger noch Schuldner, wie viel offen ist. Wer häufiger zahlt, fühlt sich ausgenutzt, wer seltener zahlt, merkt es oft gar nicht. Das Problem ist selten böser Wille, sondern fehlender Überblick.',
			],
			[
				'Sofort erfassen',
				'Tragt jede Ausgabe direkt ein, solange der Beleg da ist. In [ManaWG als WG-Kasse](/wg-kasse) seht ihr jederzeit den Saldo pro Person. Die Anteile ergeben immer genau den Betrag. Bei gleichmäßiger Teilung wandert ein übrig bleibender Cent von Buchung zu Buchung weiter, damit nicht immer dieselbe Person ihn trägt.',
			],
			[
				'Ausgleichen mit wenigen Überweisungen',
				'Wenn mehrere Personen einander Geld schulden, lassen sich die Salden verrechnen. Statt dass jeder jedem einzeln etwas überweist, reichen meist wenige Zahlungen. ManaWG schlägt Überweisungen vor, die mit wenigen Zahlungen alles ausgleichen. Überwiesen wird außerhalb der App, ihr markiert nur als bezahlt.',
			],
			[
				'Beispiel mit vier Personen',
				'In einer Vierer-WG hat Lea 120 Euro mehr bezahlt, als ihr Anteil war, Tim 20 Euro mehr. Jonas hat 80 Euro zu wenig gezahlt, Mia 60 Euro. Einzeln abgerechnet wären bis zu sechs Überweisungen nötig. Verrechnet reichen drei: Jonas überweist 80 Euro an Lea, Mia 40 Euro an Lea und 20 Euro an Tim. Danach stehen alle auf null.',
			],
			[
				'Feste Termine statt ständiger Erinnerungen',
				'Niemand mag es, wegen 4,50 Euro nachzufragen. Ein fester Ausgleichstag, etwa am Monatsersten, nimmt die Peinlichkeit heraus: Dann wird ausgeglichen, egal wie hoch der Betrag ist. ManaWG schickt am Monatsanfang eine Abrechnung per Mail mit den Überweisungsvorschlägen. Jede Person kann diese Mail abschalten.',
			],
			[
				'Wenn jemand mit offenen Beträgen auszieht',
				'Beim [Auszug](/wg-auszug-checkliste) ist der einfachste Moment, alles zu klären, und der letzte, an dem alle noch in einer Wohnung sind. Bringt den Saldo der ausziehenden Person vor dem letzten Tag auf null. Steht noch eine [Nebenkostenabrechnung](/wg-nebenkosten) aus, vereinbart schriftlich, wie Nachzahlung oder Guthaben später verteilt werden, und tauscht Kontaktdaten aus. Wer danach erst hinterherschreibt, wartet oft lange.',
			],
			[
				'Wenn alle gemeinsam haften',
				'Bei einem gemeinsamen [Hauptmietvertrag](/wg-mietvertrag) kann der Vermieter die ganze Miete von jeder Person verlangen, auch wenn andere nicht zahlen (§ 421 BGB). Wer mehr als seinen Anteil gezahlt hat, kann sich den Rest von den Mitbewohnern zurückholen. Im Zweifel gilt dabei Gleichheit: Jeder trägt denselben Anteil, solange nichts anderes vereinbart ist (§ 426 BGB). Haltet vorher schriftlich fest, wie ihr teilt, falls es nicht gleich sein soll.',
			],
			[
				'Wenn jemand nicht zahlt',
				'Sprecht es sachlich und unter vier Augen an, nennt den Betrag und einen Termin. Tipps für solche Gespräche stehen unter [Streit in der WG lösen](/wg-streit-loesen). Hilft das nicht, bringt es in die WG-Runde, ohne die Person bloßzustellen. Klärt, ob eine Ratenzahlung hilft, wenn das Geld gerade knapp ist. Rechtliche Schritte sind bei kleinen Beträgen selten sinnvoll und belasten das Zusammenleben mehr als der offene Betrag.',
			],
			[
				'Geld geliehen statt geteilt: Schulden unter Freunden',
				'Etwas anderes als eine geteilte Ausgabe ist geliehenes Geld: Jemand streckt die Kaution vor oder hilft bis zum Monatsende mit 300 Euro aus. Das ist ein Darlehen, für das § 488 BGB unter Privatleuten keine bestimmte Form vorschreibt. Ist kein Rückzahlungstermin vereinbart, wird es erst fällig, wenn eine Seite kündigt, und die Kündigungsfrist beträgt drei Monate (§ 488 Abs. 3 BGB). Nennt beim Verleihen deshalb immer einen Termin. Kommt es später zum Streit, fehlt meist der Nachweis. Hilfreich sind eine Überweisung mit Verwendungszweck wie „Darlehen, zurück bis 30.11.“, eine Nachricht, in der die andere Person Betrag und Termin bestätigt, oder ein kurzer, unterschriebener Zettel mit Betrag, Datum und Rückzahlungstermin. Führt solche Leihgaben getrennt von den geteilten Ausgaben in der [WG-Kasse](/wg-kasse), damit die Salden stimmen.',
			],
			[
				'Mahnung und Verjährung: wie lange ihr Geld zurückfordern könnt',
				'Ist der vereinbarte Termin verstrichen, erinnert ihr einmal schriftlich mit Betrag und neuem Datum, per Mail oder Nachricht, damit es belegbar ist. War ein fester Kalendertag vereinbart, kommt die Person nach diesem Tag auch ohne Mahnung in Verzug (§ 286 Abs. 2 Nr. 1 BGB), wenn sie die verspätete Zahlung zu vertreten hat (§ 286 Abs. 4 BGB). War kein Termin vereinbart, tritt Verzug erst ein, wenn die Person auf eine Mahnung nach Fälligkeit nicht zahlt (§ 286 Abs. 1 BGB). Der nächste Schritt wäre ein gerichtlicher Mahnbescheid, der Gebühren kostet. Bei kleinen Beträgen und unter Freunden lohnt es sich, das vorher abzuwägen. Wartet aber nicht zu lange: Die regelmäßige Verjährungsfrist beträgt drei Jahre (§ 195 BGB) und beginnt mit dem Schluss des Jahres, in dem der Anspruch entstanden ist und ihr wusstet, wer euch das Geld schuldet (§ 199 Abs. 1 BGB). Beispiel: War die Rückzahlung für den 15. August 2026 vereinbart, beginnt die Frist mit Ablauf des 31. Dezember 2026 und endet mit Ablauf des 31. Dezember 2029. Danach darf der Schuldner die Zahlung verweigern (§ 214 Abs. 1 BGB).',
			],
		],
		faq: [
			[
				'Wie gleicht man Schulden in der WG aus?',
				'Mit einer Übersicht der Salden und festen Ausgleichsterminen, etwa am Monatsende. Eine App berechnet die nötigen Überweisungen.',
			],
			[
				'Wie spreche ich einen Mitbewohner auf Schulden an?',
				'Sachlich und unter vier Augen, mit konkretem Betrag und Termin. Ein fester Ausgleichstag für alle macht das Nachfragen meist überflüssig.',
			],
			[
				'Überweist ManaWG Geld automatisch?',
				'Nein. ManaWG berechnet Vorschläge, ihr überweist selbst und markiert Beträge als bezahlt.',
			],
			[
				'Was passiert mit Schulden, wenn ein Mitbewohner auszieht?',
				'Offene Beträge sollten vor dem Auszug ausgeglichen sein. Für eine spätere Nebenkostenabrechnung vereinbart ihr vorher, wie Nachzahlung oder Guthaben verteilt werden.',
			],
			[
				'Was tun, wenn ein Freund geliehenes Geld nicht zurückzahlt?',
				'Sprecht ihn sachlich an und nennt Betrag und neuen Termin. Hilft das nicht, mahnt schriftlich oder per Nachricht. Bei einem vereinbarten Kalendertermin ist er ohnehin schon in Verzug, sonst spätestens nach der Mahnung (§ 286 Abs. 1 und 2 BGB). Bei kleinen Beträgen ist Loslassen oft vernünftiger als ein Mahnbescheid.',
			],
			[
				'Wie lange kann man Schulden unter Freunden zurückfordern?',
				'Meist drei Jahre (§ 195 BGB). Die Frist beginnt mit dem Ende des Jahres, in dem die Rückzahlung fällig wurde und ihr wusstet, wer euch das Geld schuldet (§ 199 Abs. 1 BGB). Danach darf der Schuldner die Zahlung verweigern (§ 214 Abs. 1 BGB).',
			],
			[
				'Braucht man für geliehenes Geld einen schriftlichen Vertrag?',
				'Nein, § 488 BGB schreibt für ein Darlehen unter Privatleuten keine Form vor. Ohne Beleg lässt sich später aber schwer zeigen, dass es ein Darlehen war und bis wann es zurückgezahlt werden sollte. Haltet Betrag und Termin deshalb schriftlich fest.',
			],
		],
		sources: [
			['§ 421 BGB, Gesamtschuldner', 'https://www.gesetze-im-internet.de/bgb/__421.html'],
			[
				'§ 426 BGB, Ausgleichungspflicht, Forderungsübergang',
				'https://www.gesetze-im-internet.de/bgb/__426.html',
			],
			[
				'§ 488 BGB, Vertragstypische Pflichten beim Darlehensvertrag',
				'https://www.gesetze-im-internet.de/bgb/__488.html',
			],
			['§ 286 BGB, Verzug des Schuldners', 'https://www.gesetze-im-internet.de/bgb/__286.html'],
			[
				'§ 195 BGB, Regelmäßige Verjährungsfrist',
				'https://www.gesetze-im-internet.de/bgb/__195.html',
			],
			[
				'§ 199 BGB, Beginn der regelmäßigen Verjährungsfrist',
				'https://www.gesetze-im-internet.de/bgb/__199.html',
			],
			['§ 214 BGB, Wirkung der Verjährung', 'https://www.gesetze-im-internet.de/bgb/__214.html'],
		],
	},
	'wg-casting-fragen': {
		link: 'WG-Casting',
		updated: '2026-10-29',
		published: '2026-10-19',
		title: 'WG-Casting-Fragen: 53 Fragen, Ablauf, Mustertexte | ManaWG',
		description:
			'WG-Casting-Fragen für WG und Bewerber: 53 Fragen mit Hintergrund, Ablauf, Tipps vor Ort, Mustertexte für Nachricht, Zu- und Absage, Bewertungsbogen.',
		h1: 'WG-Casting: Ablauf und Fragen für WG und Bewerber',
		intro:
			'Beim WG-Casting entscheidet sich in zwanzig Minuten, ob ihr die nächsten Jahre gut zusammenlebt. Beide Seiten prüfen einander: die WG die neue Person, die Bewerberin oder der Bewerber die WG. Mit den richtigen Fragen erfahrt ihr, was wirklich zählt, und nicht nur, wer am sympathischsten wirkt. Kurz gesagt: Plant pro Termin 20 bis 30 Minuten, führt Einzeltermine und entscheidet erst danach, getrennt von den Bewerbern.',
		sections: [
			[
				'Was ist ein WG-Casting und wie läuft es ab?',
				'Ein WG-Casting ist ein Kennenlerntermin, bei dem eine WG und Interessenten für ein freies Zimmer prüfen, ob sie zueinander passen. Manche sagen auch WG-Besichtigung oder Vorstellungsrunde. Es geht nicht um ein Vorsprechen, sondern darum, ob Alltag und Erwartungen zusammenpassen. Meist findet es in der Wohnung statt, oft am Küchentisch, und dauert 20 bis 30 Minuten. Am Ende sagt die WG, bis wann sie sich meldet.',
			],
			[
				'Die zehn wichtigsten Fragen',
				'1. Wie sieht ein normaler Tag bei dir aus?\n2. Wann stehst du auf, wann gehst du schlafen?\n3. Kochst du gern, allein oder mit anderen?\n4. Was bedeutet für dich eine saubere Küche?\n5. Hast du schon mit einem Putzplan gelebt, und wie lief das?\n6. Einkäufe teilen oder jeder für sich?\n7. Wie oft hast du Besuch, auch über Nacht?\n8. Rauchst du, hast du Haustiere oder planst welche?\n9. Suchst du eher eine Zweck-WG oder gemeinsame Abende?\n10. Wie lange möchtest du ungefähr hier wohnen?',
			],
			[
				'Fragen zu Alltag und Rhythmus',
				'Arbeitest oder lernst du viel von zu Hause aus, und brauchst du dafür Ruhe?\nBist du eher Frühaufsteher oder Nachtmensch?\nWie lange brauchst du morgens im Bad?\nIsst du lieber allein oder mit anderen?\nWie oft bist du am Wochenende zu Hause?\nWie viel Zeit möchtest du mit den Mitbewohnern verbringen?',
			],
			[
				'Fragen zu Ordnung und Putzen',
				'Wie oft sollte das Bad geputzt werden?\nWas stört dich in einer Küche am meisten?\nSpülst du sofort oder am nächsten Tag?\nWie gehst du damit um, wenn eine Aufgabe liegen bleibt?\nÜbernimmst du lieber feste Aufgaben oder wechselst du reihum?\nWer soll dich erinnern, wenn du dran bist, und wie?\nEhrliche Antworten sind hier wichtiger als die erwarteten: Wer zugibt, eher unordentlich zu sein, aber feste Aufgaben zuverlässig erledigt, passt oft besser als jemand, der Perfektion verspricht.',
			],
			[
				'Fragen zu Geld und Einkauf',
				'Gibt es Dinge, die du auf keinen Fall teilen möchtest?\nWie sollen Internet, Strom und Putzmittel aufgeteilt werden?\nWürdest du Ausgaben in einer gemeinsamen [WG-Kasse](/wg-kasse) eintragen und am Monatsende ausgleichen?\nWas kaufst du für alle mit, und was kaufst du für dich?\nBeim Grundbedarf wie Spülmittel und Klopapier: Zahlt ihr aus einer Kasse oder reihum?\nSagst du Bescheid, wenn es mal eng wird?\nErzählt dabei offen, wie eure WG bisher abrechnet, siehe [WG-Kosten aufteilen](/wg-kosten-aufteilen). Wer schon beim Casting weiß, wie abgerechnet wird, hat später keine Überraschungen.',
			],
			[
				'Fragen zu Besuch, Partner und Feiern',
				'Wie lange darf Besuch bleiben, bevor man vorher fragt?\nHast du eine Partnerin oder einen Partner, die oder der oft hier wäre?\nFeierst du gern zu Hause?\nAb wann soll unter der Woche Ruhe sein?\nWie sagst du Bescheid, wenn du Gäste oder eine Feier planst?\nWas ist für dich laut, was noch normal?',
			],
			[
				'Fragen zu WG-Erfahrung und Konflikten',
				'Hast du schon in einer WG gewohnt? Was hat dort gut funktioniert, was war schwierig?\nWas ist dir im Zusammenleben heute besonders wichtig?\nWas machst du, wenn dich etwas an einer Mitbewohnerin oder einem Mitbewohner stört?\nWie reagierst du, wenn dich jemand auf etwas anspricht?\nWas würden frühere Mitbewohner über dich sagen?\nDiese Fragen zeigen, wie jemand tatsächlich handelt, nicht nur, was die Person sich vornimmt. Wer von einem früheren Streit sachlich erzählt, ohne die anderen schlechtzumachen, macht einen guten Eindruck.',
			],
			[
				'Rauchen, Haustiere, Instrumente',
				'Darf in der Wohnung geraucht werden, oder nur auf dem Balkon?\nWelche Haustiere hast du oder planst du, und wer kümmert sich im Urlaub?\nSpielst du ein Instrument, und wann übst du?\nStört dich Rauch oder Tiergeruch in den Gemeinschaftsräumen?\nDiese Punkte sorgen für den meisten Ärger, wenn sie vorher nicht besprochen sind. Der Mietvertrag kann Haustieren Grenzen setzen, klärt das vorher.',
			],
			[
				'Fragen von Bewerbern an die WG',
				'Warum wird das Zimmer frei?\nGibt es einen eigenen Mietvertrag oder einen Untermietvertrag, und wer ist Hauptmieter?\nWie hoch ist die Warmmiete, und was ist darin enthalten?\nWie hoch ist die Kaution?\nWelche Kündigungsfrist gilt?\nWer entscheidet über die Auswahl, und bis wann bekomme ich Bescheid?\nWie lange wollen die anderen noch in der WG wohnen?\nWie läuft der Putzplan?\nGibt es eine gemeinsame Kasse, und wie werden Ausgaben geteilt?\nWie viel unternimmt die WG gemeinsam?\nWas zu Vertragsarten und Kaution gehört, steht im Ratgeber [WG-Mietvertrag](/wg-mietvertrag). Kürzel wie WM oder NK in der Anzeige erklärt das Glossar [WG-Anzeigen-Abkürzungen](/wg-abkuerzungen).',
			],
			[
				'Als Bewerber vorbereiten',
				'Anzeige: Lest sie noch einmal und notiert, was euch an der WG gefällt, dann habt ihr auf „Warum möchtest du zu uns?“ eine konkrete Antwort.\nÜber euch: Drei Sätze reichen: was ihr macht, wie euer Tag aussieht und wie lange ihr bleiben wollt.\nEigene Fragen: Zwei bis drei vorbereiten, etwa zum Putzplan, zur Kasse und dazu, warum das Zimmer frei wird.\nPünktlich sein: Wird es später, kurz Bescheid sagen.\nEhrlich bleiben: Wer sich verstellt, fällt spätestens im zweiten Monat auf.',
			],
			[
				'Als Bewerber vor Ort: Verhalten und Kleidung',
				'Kleidung: Zieht an, worin ihr euch wohlfühlt, normal und gepflegt reicht. Ihr besucht eine Wohnung, kein Vorstellungsgespräch.\nAuftreten: Legt das Handy weg und merkt euch die Namen. Schaut euch die Wohnung ohne Bewertung an und lobt nichts, was ihr nicht meint.\nGespräch: Antwortet in zwei, drei Sätzen und stellt zwischendurch selbst eine Frage, damit ein Gespräch entsteht.\nSchwächen: Gebt zu, wo ihr nicht perfekt seid, und nennt, was ihr dafür verlässlich tut.\nAbschluss: Fragt, bis wann sich die WG meldet, und bedankt euch kurz.',
			],
			[
				'Als Bewerber: erste Nachricht und Nachfassen',
				'Eure erste Nachricht entscheidet oft, ob ihr zum WG-Casting eingeladen werdet. Schreibt kurz, fünf bis acht Sätze, und bezieht euch auf die Anzeige: „Hallo Mia und Jonas, ich bin Sara, 24, und arbeite in Teilzeit im Büro. Ab Dezember suche ich ein Zimmer in Leipzig, am liebsten länger als ein Jahr. Eure Anzeige gefällt mir, weil ihr sonntags zusammen esst und trotzdem Ruhe lasst. Unter der Woche bin ich meist ab 18 Uhr zu Hause. Ich würde mich über einen Kennenlerntermin freuen, ab Mittwoch hätte ich Zeit.“ Am Tag nach dem Casting reicht eine Zeile: „Danke für das nette Gespräch gestern, die Wohnung und das Gespräch in der Küche haben mir gefallen. Ich freue mich, wenn ihr euch meldet.“ Meldet sich die WG nicht bis zur genannten Frist, fragt einmal freundlich nach.',
			],
			[
				'Fragen, die nicht ins Casting gehören',
				'Fragen nach Herkunft, Religion, Gesundheit, Schwangerschaft oder Kinderwunsch und sexueller Orientierung sind übergriffig und sagen nichts darüber, ob jemand in den Alltag der WG passt.\nWer so etwas freiwillig erzählt, darf das. Ihr fragt aber nicht danach und bewertet es nicht.\nFragt stattdessen nach dem, was im Alltag zählt: Ruhezeiten, Essgewohnheiten, Besuch und wie lange jemand bleiben möchte.',
			],
			[
				'Heikle Fragen besser stellen',
				'Statt „Hast du einen Freund oder eine Freundin?“: „Wie oft hast du Besuch, auch über Nacht?“\nStatt „Was verdienst du?“: „Ist die Miete für dich auf Dauer gesichert?“\nStatt „Hast du Vorerkrankungen?“: „Gibt es Allergien oder Ernährungsregeln, auf die wir beim Kochen achten sollen?“\nStatt „Willst du Kinder?“: „Wie lange möchtest du hier wohnen?“\nBewerber dürfen sagen, dass ihnen eine Frage zu persönlich ist. Das ist kein Grund, sie schlechter zu bewerten.',
			],
			[
				'Einladen und vorbereiten als WG',
				'Ladet nicht zu viele Leute auf einmal ein. Wie ihr Bewerbungen sammelt und vorsortiert, steht unter [Mitbewohner finden](/mitbewohner-finden). Einzeltermine mit etwas Puffer funktionieren besser als ein Gruppencasting, bei dem die Lautesten gewinnen. Es sollten möglichst alle Mitbewohner dabei sein, denn wer nicht mitentscheidet, fühlt sich später übergangen. Und legt vorher fest, worauf es euch ankommt, damit die Entscheidung nicht nur am Bauchgefühl hängt.',
			],
			[
				'Video-Casting und Betrug',
				'Ist ein Treffen vor Ort nicht möglich, etwa bei einem Umzug aus dem Ausland, geht auch ein Video-Gespräch, bei dem die WG die Wohnung zeigt. Kein Geld vor Vertrag und Besichtigung: Wer Kaution oder Miete überweisen soll, bevor er die Wohnung gesehen und einen Vertrag in der Hand hat, sollte abbrechen. Mehr zur Suche und zu Warnzeichen steht unter [Mitbewohner finden](/mitbewohner-finden).',
			],
			[
				'Nach dem Casting entscheiden',
				'Setzt euch direkt nach dem letzten Termin zusammen, solange die Eindrücke frisch sind. Geht die Punkte durch, die ihr vorher festgelegt habt, und fragt euch ehrlich, mit wem ihr an einem verregneten Sonntag in der Küche sitzen wollt. Sagt der gewählten Person schnell zu und den anderen höflich ab. Wer nichts hört, wartet unnötig und sucht nicht weiter.',
			],
			[
				'Zusage und Absage: Mustertexte',
				'Zusage: „Hallo Tim, wir würden uns freuen, wenn du bei uns einziehst. Das Zimmer ist ab 1. Dezember frei, 420 Euro warm. Sag uns bitte bis Freitag, ob du zusagst, dann schicken wir dir den Vertragsentwurf und unsere WG-Regeln.“\nAbsage: „Hallo Lena, danke für das nette Gespräch gestern. Wir haben uns für jemanden entschieden, bei dem der Alltag noch etwas besser passt. Das war keine leichte Wahl. Wir wünschen dir viel Erfolg bei der Suche.“\nZeitpunkt: Absagen am selben Tag wie die Zusage schicken, damit niemand wartet.\nInhalt: Keine Gründe, die die Person bewerten, und keine Vergleiche mit anderen.\nDanach: Was vor dem Einzug zu klären ist, steht unter [Mitbewohner finden](/mitbewohner-finden) und in der [Einzug-Checkliste](/wg-einzug-checkliste).',
			],
		],
		tables: [
			{
				after: 'Die zehn wichtigsten Fragen',
				title: 'Typische Fragen und was dahintersteckt',
				header: ['Frage', 'Was die WG wissen will', 'Eine ehrliche Antwort'],
				rows: [
					[
						'Wie sieht ein normaler Tag bei dir aus?',
						'Ob sich Rhythmen vertragen und wer wann das Bad braucht.',
						'„Unter der Woche bin ich tagsüber unterwegs und abends meist zu Hause. Am Wochenende schlafe ich gern aus.“',
					],
					[
						'Wie hältst du es mit dem Putzen?',
						'Ob du Aufgaben zuverlässig übernimmst, ohne dass man dich erinnern muss.',
						'„Ich bin kein Ordnungsfanatiker, aber meine Aufgaben mache ich zu festen Zeiten. Ein Putzplan hilft mir dabei.“',
					],
					[
						'Wie oft hast du Besuch?',
						'Ob die Wohnung für alle ein Rückzugsort bleibt.',
						'„Gelegentlich kommen Freunde vorbei. Übernachtungen sage ich vorher an.“',
					],
					[
						'Feierst du gern zu Hause?',
						'Wie laut und wie spät es werden kann.',
						'„Ab und zu gern, aber ich frage vorher in der Gruppe und achte auf die Ruhezeiten.“',
					],
					[
						'Wie stellst du dir das mit dem Geld vor?',
						'Ob Einkäufe und Fixkosten ohne Streit laufen.',
						'„Fixkosten teile ich gleich auf, persönliche Einkäufe bezahle ich selbst. Was ich schulde, gleiche ich zügig aus.“',
					],
					[
						'Wie lange möchtest du bleiben?',
						'Ob ihr bald wieder suchen müsst.',
						'„Ich plane erst einmal ein paar Jahre, wegen Studium oder Job. Ändert sich etwas, sage ich es früh.“',
					],
					[
						'Rauchst du, hast du Haustiere?',
						'Ob es Konflikte um Geruch, Lärm oder Mietvertrag gibt.',
						'„Ich rauche nicht und habe keine Tiere. Falls sich das ändert, spreche ich es vorher mit euch ab.“',
					],
					[
						'Warum möchtest du zu uns?',
						'Ob du die WG kennst oder nur irgendein Zimmer suchst.',
						'„Mir gefällt, dass ihr gemeinsam kocht und trotzdem Ruhe lasst. So eine WG suche ich.“',
					],
				],
			},
			{
				after: 'Nach dem Casting entscheiden',
				title: 'Bewertungsbogen',
				header: ['Kriterium', 'Person A', 'Person B', 'Person C'],
				rows: [
					['Rhythmus passt', '', '', ''],
					['Ordnung ähnlich', '', '', ''],
					['Geldvorstellung', '', '', ''],
					['Erwartung an die WG', '', '', ''],
					['Bauchgefühl', '', '', ''],
				],
				note: 'Skala von 1 (passt gar nicht) bis 5 (passt sehr gut). Jede Person füllt den Bogen direkt nach dem Termin für sich aus, danach vergleicht ihr.',
			},
			{
				after: 'Was ist ein WG-Casting und wie läuft es ab?',
				title: 'Ablauf eines WG-Castings in 30 Minuten',
				header: ['Minute', 'Was passiert', 'Worauf ihr achtet'],
				rows: [
					[
						'0 bis 5',
						'Begrüßung, kurz vorstellen, etwas zu trinken anbieten',
						'entspannte Stimmung, niemand muss sich verstellen',
					],
					[
						'5 bis 10',
						'Rundgang durch Zimmer, Küche und Bad',
						'die Wohnung ehrlich zeigen, auch das Unfertige',
					],
					[
						'10 bis 20',
						'Gespräch mit den Fragen der WG',
						'zuhören, offene Fragen statt Ja-Nein-Fragen',
					],
					[
						'20 bis 27',
						'Fragen der Bewerberin oder des Bewerbers',
						'Miete, Vertrag, Kaution und Alltag offen beantworten',
					],
					[
						'27 bis 30',
						'Verabschiedung und Termin für die Rückmeldung',
						'ein konkretes Datum nennen, noch nichts zusagen',
					],
				],
				note: 'Richtwerte. Bei mehreren Terminen an einem Abend plant zehn Minuten Puffer zwischen den Personen ein.',
			},
		],
		faq: [
			[
				'Was ist ein WG-Casting?',
				'Ein Kennenlerntermin, bei dem WG und Interessenten für ein freies Zimmer prüfen, ob sie zueinander passen. Er dauert meist 20 bis 30 Minuten und findet in der Wohnung statt, mit Rundgang und Gespräch.',
			],
			[
				'Wie bereite ich mich auf ein WG-Casting vor?',
				'Lest die Anzeige noch einmal, überlegt euch drei Sätze über euch und bereitet zwei bis drei eigene Fragen vor, etwa zu Putzplan, Kasse und Mietvertrag. Seid pünktlich und antwortet ehrlich.',
			],
			[
				'Wie sagt man nach einem WG-Casting ab?',
				'Kurz, freundlich und am selben Tag wie die Zusage: Danke für das Gespräch, die Wahl ist auf jemand anderen gefallen, viel Erfolg bei der Suche. Ein Mustertext steht auf dieser Seite.',
			],
			[
				'Welche Fragen stellt man beim WG-Casting?',
				'Fragen zum Tagesrhythmus, zu Ordnung und Putzen, zum Umgang mit Geld und Einkäufen, zu Gästen und Lautstärke und dazu, ob jemand eine Zweck-WG oder gemeinsame Abende sucht.',
			],
			[
				'Wie entscheidet die WG nach dem Casting?',
				'Direkt nach den Terminen gemeinsam, anhand vorher festgelegter Punkte. Allen Bewerbern sollte zeitnah zu- oder abgesagt werden.',
			],
			[
				'Wie lange dauert ein WG-Casting?',
				'Üblich sind 20 bis 30 Minuten pro Person. Das reicht für eine Wohnungsführung und ein Gespräch, ohne dass es für beide Seiten zu anstrengend wird.',
			],
			[
				'Was frage ich als Bewerber beim WG-Casting?',
				'Warum das Zimmer frei wird, ob es einen eigenen Mietvertrag oder Untermiete gibt, wie hoch Warmmiete und Kaution sind, wie der Putzplan funktioniert, wie Ausgaben geteilt werden und wie lange die anderen bleiben wollen.',
			],
			[
				'Welche Fragen sind beim WG-Casting tabu?',
				'Fragen nach Herkunft, Religion, Gesundheit, Schwangerschaft oder Kinderwunsch und sexueller Orientierung. Sie sagen nichts über das Zusammenleben aus. Fragt stattdessen nach Alltag, Ruhezeiten, Besuch und Geld.',
			],
		],
	},
	'mitbewohner-finden': {
		link: 'Mitbewohner finden',
		updated: '2026-10-29',
		published: '2026-10-19',
		title: 'WG-Anzeige aufgeben, Mitbewohner finden: Mustertext | ManaWG',
		description:
			'WG-Anzeige aufgeben: Konto bei WG-Gesucht, Titel mit Beispielen, alle wichtigen Angaben als Tabelle, Fotos, typische Fehler, Mustertext und Zeitplan.',
		h1: 'Mitbewohner finden: WG-Anzeige schreiben und aufgeben',
		intro:
			'Ein Zimmer wird frei, und in wenigen Wochen soll jemand Neues einziehen. Damit es passt, kommt es auf eine ehrliche Anzeige, eine gute Auswahl und klare Absprachen vor dem Einzug an. Hier steht der Ablauf von der Anzeige bis zum ersten gemeinsamen Monat.',
		sections: [
			[
				'Vorher klären: Vermieter und Vertrag',
				'Bevor ihr sucht, klärt, wer den Mietvertrag mit dem Vermieter hat. Ist die WG über Untermiete organisiert, braucht ihr für eine neue Person in der Regel die Erlaubnis des Vermieters. Haben alle einen eigenen Vertrag, regelt der Vermieter den Wechsel oft selbst. Legt außerdem fest, ab wann das Zimmer frei ist, was es warm kostet und ob Möbel übernommen werden sollen. Sucht ihr nicht für ein freies Zimmer, sondern gründet eine neue WG, führt die [Checkliste zum WG-Gründen](/wg-gruenden-checkliste) durch den ganzen Ablauf.',
			],
			[
				'Wo ihr die Anzeige aufgebt',
				'WG-Gesucht: das gängige Portal für WG-Zimmer, besonders in Hochschulstädten\nImmoScout24: hat eine eigene Rubrik für WG-Zimmer\nAushang an der Hochschule und beim Studierendenwerk\nGruppen der Hochschule und Kleinanzeigen\nFür Berufstätige: Aushang beim Arbeitgeber und das eigene Umfeld',
			],
			[
				'WG-Gesucht: Konto erstellen und Anzeige aufgeben',
				'1. Auf wg-gesucht.de das Inserieren starten und die Kategorie WG-Zimmer wählen. Das Konto entsteht dabei, vorher registrieren müsst ihr euch nicht\n2. Mit E-Mail-Adresse registrieren oder über Google oder Apple anmelden\n3. Ein privates Konto wählen, denn ihr bietet als WG ein Zimmer an und vermietet nicht gewerblich\n4. Die Registrierung per SMS-Code bestätigen, das verlangt WG-Gesucht\n5. Miete, Nebenkosten, Kaution und Adresse eintragen. Nur mit vollständiger Adresse erscheint die Anzeige laut WG-Gesucht in der Umkreissuche\n6. Titel, Text und Fotos ergänzen, wie in den Abschnitten unten beschrieben. Inserieren ist laut WG-Gesucht kostenlos, daneben gibt es ein freiwilliges, kostenpflichtiges Premium-Angebot. Stand Oktober 2026, die Oberfläche kann sich ändern',
			],
			[
				'Ohne Konto inserieren: Alternativen',
				'Auf wgfrei.de lässt sich ein WG-Zimmer nach Angabe des Portals ohne Registrierung und ohne Login einstellen. Das Portal nimmt nur provisionsfreie Angebote von Privatpersonen an, erlaubt vier Bilder und ein Video und lässt im Beschreibungstext keine Links, Telefonnummern oder E-Mail-Adressen zu. Fragt außerdem bei der Studierendenvertretung eurer Hochschule nach, ob sie Anzeigen für ihr Schwarzes Brett annimmt.',
			],
			[
				'Was in eine gute WG-Anzeige gehört',
				'Die Fakten zuerst: Größe des Zimmers, Warmmiete mit allen Nebenkosten, Einzugsdatum, Befristung, Lage und Verkehrsanbindung. Was Kürzel wie WM, KM und NK bedeuten, steht unter [WG-Anzeigen-Abkürzungen](/wg-abkuerzungen). Dann die WG selbst: Wie viele Personen, welches Alter, was macht ihr, wie viel Gemeinsames gibt es? Gute Fotos von Zimmer, Küche und Bad bei Tageslicht. Und ein ehrlicher Satz dazu, wie ihr Haushalt und Geld organisiert, etwa mit Putzplan und gemeinsamer Abrechnung in einer App. Das filtert Bewerber, die etwas ganz anderes suchen.',
			],
			[
				'Kosten, Ablöse und Vertragsart angeben',
				'Tragt in allen Kostenfeldern Kaltmiete, Nebenkosten, sonstige Kosten und Kaution ein. WG-Gesucht rät, alle Kosten anzugeben, weil zu niedrige oder lückenhafte Zahlen Anfragen von Leuten bringen können, die sich das Zimmer nicht leisten können. Schreibt dazu, ob die Nebenkosten pauschal sind oder abgerechnet werden und ob Internet, Strom und Heizung enthalten sind. Sollen Möbel gegen Ablöse im Zimmer bleiben, listet jedes Stück mit Preis im Text auf. Laut WG-Gesucht sinken die Chancen, jemanden zu finden, je höher die Ablöse ist. Kennzeichnet Zwischenmiete und Befristung deutlich und nennt, ob die neue Person einen Untermietvertrag bekommt.',
			],
			[
				'Der Anzeigentitel: Formel und Beispiele',
				'Der Titel entscheidet, ob jemand die Anzeige öffnet. Nennt in dieser Reihenfolge Zimmergröße, Lage, Warmmiete und Einzugsdatum. Drei Beispiele: „16 m² in Dreier-WG, Leipzig-Connewitz, 420 Euro warm, ab 1.12.“, „12 m² Zimmer nahe der Uni, Göttingen, 340 Euro warm, ab sofort“, „20 m² mit Balkon, Köln-Ehrenfeld, 560 Euro warm, ab 1.3., befristet bis August“. Lasst Floskeln wie „tolle Lage“ weg, die Zahlen überzeugen mehr.',
			],
			[
				'Beispiel für eine WG-Anzeige',
				'„Ab 1. Dezember wird in unserer Dreier-WG in Leipzig-Connewitz ein 16-Quadratmeter-Zimmer frei, 420 Euro warm inklusive Internet. Wir sind Mia (26, Pflege) und Jonas (24, Informatik) und suchen jemanden zwischen 21 und 30. Unter der Woche kocht jeder für sich, sonntags essen wir oft zusammen. Geputzt wird nach Plan im Wochenwechsel, gemeinsame Ausgaben rechnen wir in einer App ab. Schreib uns kurz, was du machst und wie du dir WG-Leben vorstellst.“',
			],
			[
				'Ausstattung ankreuzen und Fotos beschriften',
				'Ein Teil der Suchenden filtert nach Merkmalen wie Balkon, Garten, möbliert, Haustiere erlaubt oder barrierefrei. Kreuzt deshalb alles an, was bei euch zutrifft; WG-Gesucht empfiehlt das, weil die Anzeige so mehr Aufrufe bekommt. Fotografiert jeden Raum bei Tageslicht und aufgeräumt, dazu Haus und Straße, damit man ein Gefühl für die Umgebung bekommt. Ergänzt zu jedem Bild eine Bildunterschrift mit dem, was das Foto nicht zeigt, etwa „Fenster nach Süden, Schreibtisch bleibt“. Wollt ihr die genaue Adresse nicht veröffentlichen, könnt ihr bei WG-Gesucht die Hausnummer weglassen, bekommt dann laut WG-Gesucht aber unter Umständen weniger Anfragen.',
			],
			[
				'Länge, Fotos und typische Fehler',
				'Länge: Laut WG-Gesucht werden Angebote ab 150 Wörtern am schnellsten vergeben. Das Beispiel oben ist kürzer, eure Anzeige darf länger sein, solange sie konkret bleibt.\nMiete: Immer warm angeben und nennen, was enthalten ist.\nBefristung: Fehlt sie in der Anzeige, fällt sie erst im Gespräch auf und kostet beide Seiten Zeit.\nVerbote: Zwei oder drei echte Ausschlusskriterien reichen, eine lange Liste schreckt ab.\nAntworten: Wer Bewerbungen liegen lässt, verliert die passenden an andere WGs. Fürs Gespräch danach gibt es den [Ratgeber zum WG-Casting](/wg-casting-fragen).',
			],
			[
				'Anzeige verbreiten',
				'Teilt den Link in WhatsApp-Gruppen, in Hochschul- und Stadtgruppen und über Instagram, und bittet Freunde, ihn weiterzuleiten. Nach dem Aufgeben bietet WG-Gesucht an, die Anzeige mit wenigen Klicks auf Facebook zu teilen; laut WG-Gesucht bringt ein Like im Schnitt 25 Prozent mehr Aufrufe (Angabe des Portals). Gebt beim Teilen immer den Link zur Anzeige mit, nicht nur ein Foto, damit Interessierte Preis, Termin und Bedingungen selbst nachlesen können. Antwortet auf Nachrichten, die daraus entstehen, genauso zügig wie auf die aus dem Portal.',
			],
			[
				'Auswählen ohne Chaos',
				'Bei beliebten Zimmern kommen schnell dutzende Nachrichten, deshalb legt ihr fest, wer antwortet, und ladet nur Personen zum Casting ein, deren Nachricht zur WG passt. Entscheidet nach den Terminen zeitnah gemeinsam, sagt allen Eingeladenen ab, die es nicht geworden sind, und nutzt fürs Gespräch den [Ratgeber zum WG-Casting](/wg-casting-fragen).',
			],
			[
				'Vor dem Einzug',
				'Schickt der neuen Person die wichtigsten [Regeln](/wg-regeln) schriftlich und klärt Schlüsselübergabe und Wohnungsgeberbestätigung für die Anmeldung. Wenn eure WG [ManaWG als WG-App](/wg-app) nutzt, schickt ihr einen Einladungslink. Nach dem Beitritt sieht die neue Person Putzplan, Einkaufsliste, Kalender und Pinnwand; neue Ausgaben werden ab dann mit ihr geteilt.',
			],
			[
				'Vorsicht bei unseriösen Anfragen',
				'Auf WG-Portalen melden sich immer wieder Betrüger. Typisch sind Nachrichten von Personen, die angeblich im Ausland sind, das Zimmer ohne Besichtigung nehmen wollen und eine Überweisung über einen höheren Betrag ankündigen, von dem ihr den Rest zurückzahlen sollt. Gebt keine Kontodaten oder Ausweiskopien heraus, bevor ihr die Person gesehen habt, mindestens per Videocall, und zahlt nie Geld zurück, das noch nicht sicher auf eurem Konto ist.',
			],
			[
				'Zeitplan für die Suche',
				'Sechs bis acht Wochen vorher: Vertrag klären, Preis und Einzugsdatum festlegen\nFünf bis sechs Wochen vorher: Anzeige mit Fotos online stellen\nVier Wochen vorher: Casting-Termine an zwei, drei Abenden bündeln\nDrei Wochen vorher: gemeinsam entscheiden, zusagen und allen anderen absagen\nEinzugstag: Schlüssel, Wohnungsgeberbestätigung, Einladung in die WG-App',
			],
		],
		tables: [
			{
				after: 'Was in eine gute WG-Anzeige gehört',
				title: 'Diese Angaben gehören in die Anzeige',
				header: ['Angabe', 'Warum', 'Beispiel'],
				rows: [
					['Zimmergröße', 'die erste Filterfrage der Suchenden', '16 m², möbliert oder leer'],
					['Warmmiete', 'spart Rückfragen', '420 Euro warm inklusive Internet'],
					['Kaution', 'gehört zu den Kosten, die vorher klar sein sollen', 'zwei Monatskaltmieten'],
					['Einzug und Dauer', 'zeigt, ob befristet oder unbefristet', 'ab 1.12., unbefristet'],
					[
						'Lage',
						'der Weg zu Uni oder Arbeit entscheidet oft',
						'8 Minuten zur Tram, Supermarkt um die Ecke',
					],
					[
						'Wer dort wohnt',
						'Alter und Alltag der WG',
						'Mia (26, Pflege) und Jonas (24, Informatik)',
					],
					[
						'Alltag',
						'filtert nach Erwartungen',
						'Putzplan im Wochenwechsel, gemeinsame Abrechnung',
					],
					[
						'Antwortzeit',
						'Bewerber wissen, woran sie sind',
						'Rückmeldung innerhalb von zwei Tagen',
					],
				],
				note: 'Die Werte sind Beispiele, die Angaben zu Zimmer, Miete, Einzug und WG stammen aus dem Mustertext. Maßgeblich ist euer Mietvertrag.',
			},
		],
		faq: [
			[
				'Was gehört in eine WG-Anzeige?',
				'Zimmergröße, Warmmiete mit Nebenkosten, Einzugsdatum, Befristung, Lage, Fotos bei Tageslicht und eine ehrliche Beschreibung der WG und ihres Alltags.',
			],
			[
				'Braucht man für einen neuen Mitbewohner die Erlaubnis des Vermieters?',
				'Bei Untermiete in der Regel ja. Haben alle Mitbewohner einen eigenen Vertrag mit dem Vermieter, regelt er den Wechsel meist selbst. Maßgeblich ist euer Mietvertrag.',
			],
			[
				'Wie lange dauert es, einen Mitbewohner zu finden?',
				'Das hängt von Stadt, Preis und Jahreszeit ab. Plant mindestens vier bis sechs Wochen ein. Zum Semesterbeginn melden sich in Hochschulstädten meist mehr Interessenten als im Sommer oder um den Jahreswechsel.',
			],
			[
				'Was kostet eine WG-Anzeige bei WG-Gesucht?',
				'Laut WG-Gesucht ist das Inserieren eines WG-Zimmers kostenlos. Daneben gibt es ein freiwilliges, kostenpflichtiges Premium-Angebot.',
			],
			[
				'Brauche ich ein Konto, um eine WG-Anzeige aufzugeben?',
				'Ja. Bei WG-Gesucht legt ihr das Konto beim Inserieren an, mit E-Mail-Adresse oder über Google oder Apple. Die Registrierung wird per SMS-Code bestätigt.',
			],
			[
				'Wie lang sollte eine WG-Anzeige sein?',
				'Lang genug für Fakten, WG und Alltag. WG-Gesucht nennt als Richtwert mindestens 150 Wörter, weil solche Angebote am schnellsten vergeben werden.',
			],
		],
		sources: [
			['WG-Gesucht, Portal für WG-Zimmer', 'https://www.wg-gesucht.de/'],
			['ImmoScout24, WG-Zimmer', 'https://www.immobilienscout24.de/wohnen/wg-zimmer.html'],
			[
				'WG-Gesucht, Angebot aufgeben',
				'https://www.wg-gesucht.de/en/artikel/angebot-aufgeben-so-inserieren-sie-erfolgreich-ihre-wg-wohnung',
			],
			['WG-Gesucht, WG inserieren', 'https://www.wg-gesucht.de/en/ic/wg-inserieren.html'],
			['wgfrei.de, WG-Zimmer anbieten', 'https://wgfrei.de/anbieten/'],
		],
	},
	'wg-auszug-checkliste': {
		link: 'WG-Auszug',
		updated: '2026-10-29',
		published: '2026-10-19',
		title: 'WG-Auszug: Checkliste für Kündigung und Kaution | ManaWG',
		description:
			'Checkliste für den Auszug aus der WG: Kündigung, Nachmieter, Kaution, offene Kosten, Rundfunkbeitrag, Ummeldung und Übergabe ohne Streit.',
		h1: 'Auszug aus der WG: die Checkliste',
		intro:
			'Beim Auszug aus einer WG hängt mehr dran als Kisten packen: Kündigung, ein Nachfolger fürs Zimmer, Kaution, offene Beträge und Verträge, die auf euren Namen laufen. Wer die Punkte früh angeht, vermeidet offene Rechnungen und Streit.',
		sections: [
			[
				'Kündigung und Fristen',
				'Prüft zuerst euren [Vertrag](/wg-mietvertrag). Bei einem unbefristeten Mietvertrag gilt für Mieter meist eine Kündigungsfrist von drei Monaten. Bei einem möblierten Zimmer in der Wohnung des Hauptmieters können kürzere Fristen gelten. Beispiele mit Datum und ein Muster stehen unter [WG-Zimmer kündigen](/wg-zimmer-kuendigen). Kündigt schriftlich und sagt der WG möglichst früh Bescheid, auch wenn ihr formal noch Zeit habt. Die anderen brauchen Wochen, um jemanden zu finden.',
			],
			[
				'Nachmieter finden',
				'Oft sucht die WG gemeinsam mit euch einen Nachfolger. Ob die neue Person euren Vertrag übernimmt oder einen eigenen bekommt, entscheidet der Vermieter beziehungsweise der Hauptmieter. Einen allgemeinen Anspruch darauf, durch einen Nachmieter früher aus dem Vertrag zu kommen, gibt es nicht, viele Vermieter lassen sich aber darauf ein. Helft bei [Anzeige und Casting](/mitbewohner-finden), ihr kennt das Zimmer am besten.',
			],
			[
				'Geld: offene Beträge und Kaution',
				'Gleicht alle offenen Beträge vor dem Auszug aus, solange alle noch erreichbar sind. In der [WG-Kasse von ManaWG](/wg-kasse) seht ihr euren Saldo und die vorgeschlagenen Überweisungen. Wenn der Saldo auf null steht, ist alles erledigt. Klärt außerdem, was mit gemeinsamen Anschaffungen passiert: Bleibt der Staubsauger in der WG, und zahlen die anderen euren Anteil? Die [Kaution](/wg-kaution) bekommt ihr vom Vermieter oder Hauptmieter zurück. Die Prüfung kann einige Monate dauern, vor allem wenn noch eine [Nebenkostenabrechnung](/wg-nebenkosten) aussteht.',
			],
			[
				'Verträge und Behörden',
				'Läuft der Internetvertrag, der Stromvertrag oder der [Rundfunkbeitrag](/rundfunkbeitrag-wg) auf euren Namen, muss jemand aus der WG übernehmen oder der Vertrag umgestellt werden. Sprecht das früh ab. In Deutschland meldet ihr euch innerhalb von zwei Wochen am neuen Wohnort [an](/wg-anmeldung). Eine eigene Abmeldung ist nur nötig, wenn ihr ins Ausland zieht oder keine neue Wohnung in Deutschland bezieht. Denkt auch an einen Nachsendeauftrag für die Post.',
			],
			[
				'Zwischenmiete statt Auszug',
				'Wer nur für ein Auslandssemester oder ein Praktikum weg ist, muss nicht ausziehen. Mit Erlaubnis des Vermieters oder Hauptmieters lässt sich das Zimmer für diese Zeit [untervermieten](/wg-zwischenmiete). Klärt vorher schriftlich Zeitraum, Miete, Nebenkosten und was mit euren Möbeln passiert. Für die Abrechnung in der WG zählt in dieser Zeit die Zwischenmieterin oder der Zwischenmieter als Mitbewohner.',
			],
			[
				'Übergabe',
				'Räumt Zimmer und eure Fächer in Küche und Bad vollständig. Streicht das Zimmer, falls der Vertrag das vorsieht. Macht eine Übergabe mit Fotos und gebt alle Schlüssel zurück. Erledigt eure letzte Runde im Putzplan, bevor ihr geht. In ManaWG verlasst ihr die WG zum Schluss selbst über die Einstellungen.',
			],
			[
				'Die Checkliste zum Abhaken',
				'1. Vertrag prüfen und fristgerecht schriftlich kündigen\n2. WG früh informieren und bei der Nachmietersuche helfen\n3. Strom, Internet und Rundfunkbeitrag umstellen, falls sie auf euch laufen\n4. Offene Beträge ausgleichen, bis der Saldo bei null steht\n5. Gemeinsame Anschaffungen aufteilen oder auszahlen lassen\n6. Absprache zur nächsten Nebenkostenabrechnung treffen\n7. Zimmer räumen, Übergabe mit Fotos, Schlüssel zurückgeben\n8. Innerhalb von zwei Wochen am neuen Wohnort anmelden, Nachsendeauftrag einrichten',
			],
		],
		faq: [
			[
				'Welche Kündigungsfrist gilt beim Auszug aus einer WG?',
				'Bei einem unbefristeten Mietvertrag meist drei Monate. Bei einem möblierten Zimmer in der Wohnung des Hauptmieters können kürzere Fristen gelten. Maßgeblich ist euer Vertrag.',
			],
			[
				'Muss ich einen Nachmieter für mein WG-Zimmer stellen?',
				'Eine allgemeine Pflicht gibt es nicht, und ohne Vereinbarung auch keinen Anspruch, dadurch früher aus dem Vertrag zu kommen. In der Praxis sucht die WG aber meist gemeinsam.',
			],
			[
				'Was passiert mit offenen WG-Kosten beim Auszug?',
				'Offene Beträge sollten vor dem Auszug ausgeglichen werden. Eine App wie ManaWG zeigt den Saldo und schlägt die nötigen Überweisungen vor.',
			],
			[
				'Wann bekomme ich die Kaution nach dem Auszug zurück?',
				'Nach einer angemessenen Prüfzeit, die oft einige Monate dauert. Steht noch eine Nebenkostenabrechnung aus, darf ein angemessener Teil bis dahin einbehalten werden.',
			],
		],
		sources: [
			['§ 573c BGB, Kündigungsfristen', 'https://www.gesetze-im-internet.de/bgb/__573c.html'],
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			['§ 17 BMG, An- und Abmeldung', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
		],
	},
	'wg-streit-loesen': {
		link: 'Streit in der WG',
		updated: '2026-10-27',
		published: '2026-10-19',
		title: 'Streit in der WG lösen: Putzen, Lärm, Geld | ManaWG',
		description:
			'Streit in der WG um Putzen, Lärm oder Geld? So sprecht ihr Konflikte an, findet Regeln, die halten, und verhindert, dass kleine Ärgernisse eskalieren.',
		h1: 'Streit in der WG lösen',
		intro:
			'In fast jeder WG gibt es irgendwann Streit, meist um dieselben drei Dinge: Putzen, Lärm und Geld. Selten liegt es an bösem Willen. Meist fehlen klare Absprachen, oder kleine Ärgernisse wurden zu lange nicht angesprochen. Mit ein paar Gewohnheiten lassen sich die meisten Konflikte lösen, bevor sie die Stimmung kippen.',
		sections: [
			[
				'Früh ansprechen, nicht sammeln',
				'Der häufigste Fehler ist, Ärger herunterzuschlucken, bis er sich auf einmal entlädt. Sprecht Dinge an, solange sie klein sind, und am besten direkt mit der betroffenen Person statt zuerst mit den anderen. Ein ruhiger Moment ist besser als der Augenblick, in dem das dreckige Geschirr gerade wieder in der Spüle steht.',
			],
			[
				'Sachlich bleiben: Ich-Botschaften',
				'Beschreibt, was passiert ist und was es bei euch auslöst, statt der anderen Person Eigenschaften zuzuschreiben. „Mich stresst es, wenn die Küche morgens voll ist“ kommt anders an als „Du bist immer so schlampig“. Fragt nach, wie die andere Seite es sieht. Oft gibt es Gründe, die ihr nicht kennt, etwa Prüfungsphasen oder Schichtarbeit.',
			],
			[
				'Streit ums Putzen',
				'Putzstreit entsteht meist, weil unklar ist, wer wann dran ist, oder weil die Aufgaben ungleich verteilt sind. Ein Putzplan mit fester Rotation nimmt die Diskussion heraus: Es ist sichtbar, wer dran ist und was erledigt wurde. Wie er entsteht, zeigt [Putzplan erstellen](/putzplan-erstellen), und eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) hilft beim Start. In der [WG-App ManaWG](/wg-app) wandern Aufgaben automatisch weiter, wer verreist ist, wird übersprungen. Wenn eine Person trotzdem dauerhaft nicht putzt, gehört das in die WG-Runde, nicht in passiv-aggressive Zettel am Kühlschrank.',
			],
			[
				'Streit um Lärm und Gäste',
				'Hier helfen [Regeln, die alle vorher vereinbart haben](/wg-regeln): Ruhezeiten unter der Woche, Ankündigung von Partys, wie lange Gäste bleiben dürfen. Was einmal gemeinsam festgelegt ist, muss nicht jedes Mal neu verhandelt werden. Haltet Beschlüsse schriftlich fest, etwa auf der Pinnwand in ManaWG, damit sich später niemand auf ein anderes Gedächtnis beruft.',
			],
			[
				'Streit ums Geld',
				'Geldstreit entsteht fast immer aus Unübersichtlichkeit: Wer hat was bezahlt, wer schuldet wem? Tragt Ausgaben sofort ein und gleicht zu einem festen Termin aus. Eine App, die Salden rechnet und Überweisungen vorschlägt, ersetzt Erinnerungen an Einzelbeträge. Wie das mit wenigen Überweisungen geht, zeigt der Ratgeber zu [Schulden unter Mitbewohnern](/schulden-mitbewohner). Klärt außerdem vorher, was gemeinsam gekauft wird und ab welchem Betrag gefragt werden muss.',
			],
			[
				'Die WG-Runde',
				'Ein regelmäßiges kurzes Treffen, etwa einmal im Monat, gibt allen einen festen Ort für Themen. Jede Person darf etwas einbringen, Entscheidungen werden festgehalten. Wenn es trotz Gesprächen nicht besser wird, ist es kein Scheitern, zu überlegen, ob die Konstellation passt. Manchmal ist ein [Auszug](/wg-auszug-checkliste) die fairste Lösung für alle. Wer wem kündigen darf, hängt am Vertrag, siehe [Mitbewohner kündigen](/mitbewohner-kuendigen).',
			],
		],
		faq: [
			[
				'Worüber streiten WGs am häufigsten?',
				'Über Putzen, Lärm und Geld. In allen drei Fällen helfen klare, gemeinsam vereinbarte Regeln und ein fester Ort, an dem sie festgehalten sind.',
			],
			[
				'Wie spreche ich ein Problem mit einem Mitbewohner an?',
				'Früh, direkt und in einem ruhigen Moment. Beschreibt, was euch stört, statt der Person Vorwürfe zu machen, und fragt nach ihrer Sicht.',
			],
			[
				'Hilft ein Putzplan gegen Streit in der WG?',
				'Ja, wenn er feste Rotation hat und für alle sichtbar ist. Dann ist klar, wer dran ist, und die Diskussion darüber entfällt.',
			],
		],
	},
	'mitbewohner-kuendigen': {
		link: 'Mitbewohner kündigen',
		updated: '2026-10-27',
		published: '2026-10-20',
		title: 'Mitbewohner kündigen, auch ohne Mietvertrag | ManaWG',
		description:
			'Mitbewohner kündigen oder ohne Mietvertrag loswerden: was bei Untermiete, Hauptmietvertrag und Einzelverträgen gilt, mit Fristen, Schriftform und Muster.',
		h1: 'Mitbewohner kündigen: was je nach Vertrag geht',
		intro:
			'Wenn das Zusammenleben nicht mehr funktioniert, kommt schnell die Frage, ob man einen Mitbewohner einfach rauswerfen kann. Die Antwort hängt fast nur davon ab, wer mit wem einen Vertrag hat. Wer selbst Vermieter des Mitbewohners ist, kann kündigen, alle anderen nicht. Diese Seite gibt einen Überblick nach dem Bürgerlichen Gesetzbuch und ersetzt keine Rechtsberatung. Bei einem konkreten Fall helfen Mietervereine oder eine Anwältin für Mietrecht.',
		sections: [
			[
				'Erst klären: Wer hat welchen Vertrag?',
				'In einer WG gibt es drei übliche Modelle: alle stehen gemeinsam im Hauptmietvertrag, eine Person ist Hauptmieter und vermietet Zimmer unter, oder jede Person hat einen eigenen Vertrag mit dem Vermieter. Nur im zweiten Fall ist ein Mitbewohner Vermieter eines anderen und kann ihm kündigen. Wollt ihr selbst ausziehen, lest [WG-Zimmer kündigen](/wg-zimmer-kuendigen). Wie sich die Modelle sonst unterscheiden, steht im Ratgeber zum [WG-Mietvertrag](/wg-mietvertrag).',
			],
			[
				'Untermiete: Der Hauptmieter kündigt',
				'Ein Untermieter hat grundsätzlich denselben Kündigungsschutz wie jeder Mieter. Der Hauptmieter braucht dann ein berechtigtes Interesse, etwa wenn der Untermieter seine Pflichten erheblich verletzt, und muss mindestens drei Monate Frist einhalten. Wohnt der Hauptmieter selbst in der Wohnung, wird es leichter. Für ein überwiegend vom Hauptmieter möbliertes Zimmer gilt kein Kündigungsschutz, und die Kündigung ist bis zum 15. eines Monats zum Monatsende möglich, außer das Zimmer ist dauerhaft an eine Familie oder ein Paar vermietet. Ist das Zimmer leer vermietet, darf der Hauptmieter ohne Grund kündigen, die Frist verlängert sich aber um drei Monate. Im Schreiben muss dann stehen, dass er sich auf diese erleichterte Kündigung stützt.',
			],
			[
				'Gemeinsamer Hauptmietvertrag: Rauswerfen geht nicht',
				'Stehen alle im Mietvertrag, sind alle gleichberechtigte Mieter. Niemand kann einem anderen kündigen, auch nicht die Mehrheit der WG. Der Vermieter kann ebenfalls nur allen gemeinsam kündigen. Ein Wechsel klappt nur, wenn alle einverstanden sind: Die Person zieht freiwillig aus, und Vermieter und übrige Mieter vereinbaren, dass sie aus dem Vertrag entlassen wird. Will jemand selbst raus und die anderen stellen sich quer, kann im Einzelfall ein Anspruch bestehen, an einer Kündigung mitzuwirken. Das ist umstritten und ein Fall für eine Beratung.',
			],
			[
				'Einzelverträge: Nur der Vermieter kann kündigen',
				'Hat jede Person einen eigenen Vertrag, haben die Mitbewohner keine Handhabe. Kündigen kann nur der Vermieter, und auch er in der Regel nur aus einem gesetzlichen Grund. Ausnahme sind Zimmer in Studenten- und Jugendwohnheimen, dort gilt der Schutz durch das berechtigte Interesse nicht (§ 549 Abs. 3 BGB). Fristlos geht das zum Beispiel, wenn jemand mit zwei Monatsmieten im Rückstand ist oder den Hausfrieden nachhaltig stört. Was ihr tun könnt: Vorfälle mit Datum aufschreiben und dem Vermieter schriftlich melden.',
			],
			[
				'Form und Ablauf der Kündigung',
				'Eine Kündigung von Wohnraum muss schriftlich sein, also auf Papier mit eigenhändiger Unterschrift. E-Mail, Messenger oder ein Zettel ohne Unterschrift reichen nicht. Damit die Frist läuft, muss die Kündigung zugehen. Übergebt sie persönlich mit einer Zeugin oder schickt sie per Einwurf-Einschreiben. Nennt das Datum, zu dem das Mietverhältnis enden soll, und bei Untermiete den Grund oder die Regel, auf die ihr euch stützt.',
			],
			[
				'Was verboten ist',
				'Das Schloss austauschen, Sachen vor die Tür stellen oder Strom und Internet für ein Zimmer abklemmen ist verbotene Eigenmacht und kann strafbar sein, selbst wenn die Kündigung wirksam ist. Zieht jemand nach Ablauf der Frist nicht aus, bleibt nur die Räumungsklage beim Amtsgericht. Bei Gewalt oder Drohungen ruft ihr die Polizei. Das ist etwas anderes als ein Mietstreit.',
			],
			[
				'Muster: Kündigung eines Untermieters',
				'Absender: Name und Anschrift des Hauptmieters\nEmpfänger: Name des Untermieters und Anschrift der Wohnung\nDatum: Ort und Tag des Schreibens\nText: „Hiermit kündige ich das Untermietverhältnis über das Zimmer … zum …“\nGrundlage: Hinweis auf § 573a BGB oder § 549 Abs. 2 Nr. 2 BGB, je nach Fall\nUnterschrift: eigenhändig\nSchriftform: eigenhändig unterschrieben, nicht per Mail oder WhatsApp (§ 568 BGB).',
			],
			[
				'Wenn der Mitbewohner nicht ausziehen will',
				'Sprecht zuerst miteinander, am besten mit konkreten Vorfällen statt Vorwürfen, und haltet fest, was ihr vereinbart.\nBei Untermiete kündigt der Hauptmieter nach den Regeln oben. Zieht die Person danach nicht aus, bleibt nur die Räumungsklage beim Amtsgericht.\nBeim gemeinsamen Hauptmietvertrag hilft nur eine Einigung: Die Person zieht freiwillig aus, und Vermieter und alle übrigen Mieter vereinbaren, dass sie aus dem Vertrag entlassen wird (Aufhebungsvereinbarung).\nMietervereine und Anwälte für Mietrecht klären den Einzelfall.',
			],
			[
				'Mitbewohner ohne Mietvertrag loswerden',
				'Entscheidend: Zahlt die Person für das Zimmer Miete oder nicht?\nMit Miete: Auch ohne Papier besteht ein Mietvertrag, der Vermieter schuldet die Überlassung, der Mieter die vereinbarte Miete (§ 535 BGB). Gekündigt wird schriftlich nach den Regeln oben, und die Person bleibt bis zum Ende der Frist.\nLänger als ein Jahr: Wird ein Mietvertrag für längere Zeit als ein Jahr nicht schriftlich geschlossen, gilt er für unbestimmte Zeit (§ 550 BGB). Gekündigt werden kann dann frühestens zum Ablauf eines Jahres nach Überlassung des Wohnraums.\nOhne Miete: Zahlt die Person nichts und leistet auch sonst keine Gegenleistung, ist das in der Regel kein Mietvertrag, sondern eine unentgeltliche Überlassung, also Leihe (§ 598 BGB). Ist keine Dauer vereinbart und ergibt sie sich nicht aus dem Zweck, kann die Rückgabe jederzeit verlangt werden (§ 604 Abs. 3 BGB). Fordert die Person schriftlich zum Auszug auf und setzt eine angemessene Frist.\nGrauzone: Ob Geld für Strom oder Einkäufe schon als Miete zählt und wer bei einem gemeinsamen Hauptmietvertrag die Rückgabe verlangen kann, hängt vom Einzelfall ab und ist ein Fall für einen Mieterverein.\nWenn die Person bleibt: In beiden Fällen bleibt nur der Weg über das Gericht. Schloss tauschen oder Sachen vor die Tür stellen ist verbotene Eigenmacht (§ 858 Abs. 1 BGB).',
			],
			[
				'Bevor es so weit kommt',
				'Die meisten Konflikte lassen sich lösen, bevor jemand an Kündigung denkt. Sprecht Probleme früh an und haltet Absprachen fest, damit nicht jedes Thema neu verhandelt wird. Wie das gelingt, steht im Ratgeber [Streit in der WG lösen](/wg-streit-loesen). Geht es um Geld, hilft eine gemeinsame Übersicht, siehe [Schulden unter Mitbewohnern](/schulden-mitbewohner). Steht der Auszug fest, klärt Kaution und offene Beträge mit der [Auszugs-Checkliste](/wg-auszug-checkliste).',
			],
		],
		tables: [
			{
				after: 'intro',
				title: 'Mitbewohner kündigen: Auf einen Blick',
				header: ['Vertrag', 'Wer darf kündigen', 'Frist', 'Grund nötig?'],
				rows: [
					[
						'Untermiete, vom Hauptmieter überwiegend möbliertes Zimmer in seiner Wohnung, Mieter ohne Familie oder Partner dort',
						'Hauptmieter',
						'bis zum 15. zum Monatsende (§ 573c Abs. 3 BGB)',
						'Nein (§ 549 Abs. 2 Nr. 2 BGB)',
					],
					[
						'Untermiete, leeres Zimmer in der Wohnung des Hauptmieters',
						'Hauptmieter',
						'drei Monate länger als normal',
						'Nein (§ 573a BGB)',
					],
					[
						'Untermiete, Hauptmieter wohnt nicht selbst dort',
						'Hauptmieter',
						'mindestens drei Monate',
						'Ja, berechtigtes Interesse',
					],
					[
						'Gemeinsamer Hauptmietvertrag',
						'Kein Mitbewohner, der Vermieter nur allen gemeinsam',
						'entfällt, nur Einigung',
						'entfällt',
					],
					[
						'Einzelverträge',
						'Nur der Vermieter',
						'je nach Grund, fristlos nur bei schweren Gründen',
						'In der Regel ja, gesetzlicher Grund (nicht im Studentenwohnheim)',
					],
				],
			},
			{
				after: 'Mitbewohner ohne Mietvertrag loswerden',
				title: 'Ohne schriftlichen Vertrag: was gilt',
				header: ['Situation', 'Rechtlich', 'Beenden', 'Wenn die Person bleibt'],
				rows: [
					[
						'zahlt Miete, nichts schriftlich',
						'mündlicher Mietvertrag (§ 535 BGB)',
						'schriftliche Kündigung (§ 568 Abs. 1 BGB) mit den Fristen oben',
						'Klage auf Räumung, keine Selbsthilfe',
					],
					[
						'Vertrag über mehr als ein Jahr, nur mündlich',
						'gilt als unbefristet (§ 550 BGB)',
						'Kündigung frühestens zum Ablauf eines Jahres nach Überlassung',
						'Klage auf Räumung, keine Selbsthilfe',
					],
					[
						'zahlt nichts, keine Gegenleistung',
						'in der Regel Leihe (§ 598 BGB)',
						'Rückgabe verlangen, wenn keine Dauer vereinbart ist (§ 604 Abs. 3 BGB)',
						'Klage auf Räumung, keine Selbsthilfe (§ 858 Abs. 1 BGB)',
					],
				],
				note: 'Überblick ohne Gewähr für den Einzelfall. Bei Streit hilft ein Mieterverein.',
			},
		],
		faq: [
			[
				'Kann man einen Mitbewohner aus der WG werfen?',
				'Nur wenn ihr sein Vermieter seid, also bei Untermiete. Stehen alle im Hauptmietvertrag oder hat jede Person einen eigenen Vertrag, kann kein Mitbewohner einem anderen kündigen.',
			],
			[
				'Welche Kündigungsfrist gilt für einen Untermieter in der WG?',
				'Für ein vom Hauptmieter überwiegend möbliertes Zimmer in seiner eigenen Wohnung, in dem der Mieter nicht dauerhaft mit Familie oder Partner lebt, bis zum 15. eines Monats zum Monatsende (§ 573c Abs. 3 BGB). Für ein leeres Zimmer in seiner Wohnung drei Monate länger als normal, ohne Grund. Wohnt der Hauptmieter nicht selbst dort, braucht er ein berechtigtes Interesse.',
			],
			[
				'Reicht eine Kündigung per WhatsApp oder E-Mail?',
				'Nein. Die Kündigung von Wohnraum braucht die Schriftform, also ein Schreiben mit eigenhändiger Unterschrift.',
			],
			[
				'Darf ich das Schloss austauschen, wenn der Mitbewohner nicht auszieht?',
				'Nein. Das ist verbotene Eigenmacht und kann strafbar sein. Zieht jemand trotz wirksamer Kündigung nicht aus, bleibt nur die Räumungsklage.',
			],
			[
				'Kann die Mehrheit der WG einen Mitbewohner rauswählen?',
				'Rechtlich nicht. Eine Abstimmung ersetzt keine Kündigung. Sie kann nur der Vertragspartner aussprechen, bei Untermiete der Hauptmieter, sonst der Vermieter.',
			],
			[
				'Wie werde ich einen Mitbewohner ohne Mietvertrag los?',
				'Entscheidend ist, ob die Person Miete zahlt. Zahlt sie, besteht ein mündlicher Mietvertrag, den ihr schriftlich kündigen müsst (§ 568 Abs. 1 BGB). Zahlt sie nichts, könnt ihr in der Regel jederzeit die Rückgabe des Zimmers verlangen (§ 604 Abs. 3 BGB). Zieht sie trotzdem nicht aus, hilft nur das Gericht.',
			],
			[
				'Muss ein Mitbewohner ausziehen, der nicht im Mietvertrag steht?',
				'Nicht automatisch. Zahlt er Miete an einen Mitbewohner, ist er Untermieter und hat Mieterrechte, auch ohne schriftlichen Vertrag. Zahlt er nichts, muss er in der Regel auf Aufforderung gehen. Selbst durchsetzen, etwa mit einem neuen Schloss, dürft ihr das in keinem Fall (§ 858 Abs. 1 BGB).',
			],
		],
		sources: [
			[
				'§ 549 BGB, Ausnahmen vom Mieterschutz',
				'https://www.gesetze-im-internet.de/bgb/__549.html',
			],
			['§ 573a BGB, erleichterte Kündigung', 'https://www.gesetze-im-internet.de/bgb/__573a.html'],
			['§ 573c BGB, Kündigungsfristen', 'https://www.gesetze-im-internet.de/bgb/__573c.html'],
			['§ 568 BGB, Schriftform der Kündigung', 'https://www.gesetze-im-internet.de/bgb/__568.html'],
			['§ 535 BGB, Inhalt des Mietvertrags', 'https://www.gesetze-im-internet.de/bgb/__535.html'],
			['§ 550 BGB, Form des Mietvertrags', 'https://www.gesetze-im-internet.de/bgb/__550.html'],
			['§ 543 BGB, fristlose Kündigung', 'https://www.gesetze-im-internet.de/bgb/__543.html'],
			['§ 598 BGB, Leihe', 'https://www.gesetze-im-internet.de/bgb/__598.html'],
			['§ 604 BGB, Rückgabepflicht', 'https://www.gesetze-im-internet.de/bgb/__604.html'],
			['§ 858 BGB, Verbotene Eigenmacht', 'https://www.gesetze-im-internet.de/bgb/__858.html'],
		],
	},
	'wg-zimmer-kuendigen': {
		link: 'WG-Zimmer kündigen',
		updated: '2026-10-29',
		published: '2026-10-27',
		title: 'WG-Zimmer kündigen: Fristen, Muster, Nachmieter | ManaWG',
		description:
			'WG-Zimmer kündigen: Kündigungsfrist je nach Vertrag, Beispiele mit Datum, Muster zum Anpassen, Nachmieter, gemeinsamer Mietvertrag und was danach kommt.',
		h1: 'WG-Zimmer kündigen: Fristen und Muster',
		intro:
			'Ihr wollt aus der WG ausziehen und fragt euch, wann ihr kündigen müsst und an wen. Das hängt davon ab, mit wem ihr den Vertrag habt und ob das Zimmer möbliert in der Wohnung des Hauptmieters liegt. Hier stehen die Fristen nach dem Bürgerlichen Gesetzbuch, Beispiele mit Datum und ein Muster. Die Seite gibt einen Überblick und ersetzt keine Rechtsberatung. Bei einem konkreten Fall helfen Mietervereine.',
		sections: [
			[
				'Erst den Vertrag ansehen',
				'In einer WG gibt es drei übliche Modelle: Alle stehen gemeinsam im Hauptmietvertrag, ihr wohnt zur Untermiete bei einem Hauptmieter, oder ihr habt einen eigenen Vertrag mit dem Vermieter. Bei Untermiete kündigt ihr beim Hauptmieter, beim Einzelvertrag beim Vermieter. Beim gemeinsamen Vertrag könnt ihr nicht allein kündigen. Die Modelle im Detail stehen unter [WG-Mietvertrag](/wg-mietvertrag). Gibt es keinen schriftlichen Vertrag, besteht trotzdem einer, sobald ihr gegen Miete wohnt (§ 535 BGB). Dann gelten dieselben Fristen.',
			],
			[
				'Die normale Frist: knapp drei Monate',
				'Für einen unbefristeten Vertrag gilt: Geht die Kündigung spätestens am dritten Werktag eines Monats zu, endet das Mietverhältnis mit Ablauf des übernächsten Monats (§ 573c Abs. 1 BGB). Wer bis zum dritten Werktag im März kündigt, ist also Ende Mai raus. Für euch als Mieter bleibt die Frist gleich, egal wie lange ihr schon dort wohnt. Länger wird sie nur für die Seite, die vermietet. Kürzere Fristen zu euren Gunsten darf der Vertrag vorsehen, längere nicht (§ 573c Abs. 4 BGB).',
			],
			[
				'Möbliertes Zimmer beim Hauptmieter: bis zum 15.',
				'Wohnt der Hauptmieter selbst in der Wohnung und hat er euer Zimmer überwiegend möbliert, gilt eine kurze Frist: Kündigung bis zum 15. eines Monats zum Ende desselben Monats (§ 573c Abs. 3 BGB). Das gilt nicht, wenn ihr dort dauerhaft mit Familie oder Partner lebt (§ 549 Abs. 2 Nr. 2 BGB). Die kurze Frist gilt für beide Seiten. Auch der Hauptmieter kann euch dann so kündigen, mehr dazu unter [Mitbewohner kündigen](/mitbewohner-kuendigen).',
			],
			[
				'Gemeinsamer Hauptmietvertrag: allein geht es nicht',
				'Stehen alle im Vertrag, kann ihn nur die ganze WG gemeinsam kündigen. Eine Kündigung von euch allein ist unwirksam. Wollt ihr raus und die anderen bleiben, braucht ihr eine Vereinbarung mit dem Vermieter und allen Mitmietern, dass ihr aus dem Vertrag entlassen werdet. Meist zieht dafür jemand Neues in den Vertrag ein. Sprecht das früh an, denn bis zur Einigung haftet ihr weiter für die ganze Miete mit.',
			],
			[
				'Befristung, Kündigungsausschluss und Sonderkündigung',
				'Ist der Vertrag befristet oder die Kündigung für eine bestimmte Zeit ausgeschlossen, endet er in der Regel erst zum vereinbarten Termin. Ob eine solche Klausel wirksam ist, klärt im Zweifel eine Beratung. Einen Ausweg gibt es: Verweigert der Vermieter euch die Erlaubnis, das Zimmer unterzuvermieten, dürft ihr außerordentlich mit der gesetzlichen Frist kündigen, sofern in der Person des Untermieters kein wichtiger Grund dagegen spricht (§ 540 Abs. 1 BGB). Wer nur ein paar Monate weg ist, kann statt zu kündigen [zur Zwischenmiete](/wg-zwischenmiete) vermieten.',
			],
			[
				'Nachmieter: kein Anspruch, aber oft der schnellste Weg',
				'Einen allgemeinen Anspruch, mit einem Nachmieter früher aus dem Vertrag zu kommen, gibt es nicht. Steht eine Nachmieterklausel im Vertrag, gilt sie. In der Praxis lassen sich Vermieter und Hauptmieter oft darauf ein, wenn ihr eine passende Person mitbringt. Helft der WG bei [Anzeige und Auswahl](/mitbewohner-finden), am besten mit einem gemeinsamen [WG-Casting](/wg-casting-fragen). Haltet eine Einigung über den früheren Auszug schriftlich fest.',
			],
			[
				'So muss die Kündigung aussehen',
				'Eine Kündigung von Wohnraum muss schriftlich sein, also auf Papier mit eigenhändiger Unterschrift (§ 568 Abs. 1 BGB). E-Mail, Messenger oder ein Foto des Schreibens reichen nicht. Die Frist läuft erst, wenn die Kündigung zugeht. Übergebt sie persönlich vor einer Zeugin oder schickt sie per Einwurf-Einschreiben und plant ein paar Tage Puffer vor dem dritten Werktag oder dem 15. ein. Einen Grund müsst ihr als Mieter nicht nennen.',
			],
			[
				'Muster: Kündigung eines WG-Zimmers',
				'Absender: euer Name und eure Anschrift in der WG\nEmpfänger: Hauptmieter bei Untermiete, sonst der Vermieter, mit Anschrift\nDatum: Ort und Tag des Schreibens\nBetreff: Kündigung des Mietverhältnisses über das Zimmer in der Wohnung …\nText: „Hiermit kündige ich das Mietverhältnis über das Zimmer … fristgerecht zum …, hilfsweise zum nächstmöglichen Termin.“\nBitte: Bestätigung der Kündigung, Termin für die Übergabe und Rückzahlung der Kaution auf das Konto …\nUnterschrift: eigenhändig, bei mehreren Personen im Vertrag von allen',
			],
			[
				'Nach der Kündigung',
				'Sagt der WG Bescheid, sobald die Kündigung raus ist, auch wenn ihr formal noch Zeit habt. Gleicht offene Beträge vor dem Auszug aus. In der [WG-Kasse von ManaWG](/wg-kasse) seht ihr euren Saldo und die vorgeschlagenen Überweisungen. Läuft der [Rundfunkbeitrag](/rundfunkbeitrag-wg) auf euch, muss jemand übernehmen. Am neuen Wohnort meldet ihr euch innerhalb von zwei Wochen [an](/wg-anmeldung). Übergabe, [Kaution](/wg-kaution) und alle weiteren Punkte stehen in der [Auszugs-Checkliste](/wg-auszug-checkliste).',
			],
		],
		tables: [
			{
				after: 'intro',
				title: 'WG-Zimmer kündigen: Fristen auf einen Blick',
				header: ['Vertrag', 'Frist für euch', 'Hinweis'],
				rows: [
					[
						'Untermiete oder Einzelvertrag, unbefristet',
						'Zugang bis zum dritten Werktag eines Monats, Ende mit Ablauf des übernächsten Monats',
						'§ 573c Abs. 1 BGB, unabhängig von der Wohndauer',
					],
					[
						'Möbliertes Zimmer in der Wohnung, in der der Hauptmieter selbst wohnt',
						'bis zum 15. eines Monats zum Monatsende',
						'§ 573c Abs. 3 BGB, nicht bei dauerhaftem Zusammenleben mit Familie oder Partner',
					],
					[
						'Gemeinsamer Hauptmietvertrag',
						'allein keine Kündigung möglich',
						'nur alle gemeinsam oder Entlassung aus dem Vertrag per Vereinbarung',
					],
					[
						'Befristeter Vertrag oder Kündigungsausschluss',
						'in der Regel erst zum vereinbarten Termin',
						'Sonderkündigung, wenn die Untervermietung ohne wichtigen Grund verweigert wird (§ 540 BGB)',
					],
				],
			},
			{
				after: 'Möbliertes Zimmer beim Hauptmieter: bis zum 15.',
				title: 'Beispiele: Wann endet der Vertrag?',
				header: ['Kündigung geht zu', 'Unbefristet, normale Frist', 'Möbliert beim Hauptmieter'],
				rows: [
					['am zweiten Werktag im März', '31. Mai', '31. März'],
					['am 10. März', '30. Juni', '31. März'],
					['am 20. März', '30. Juni', '30. April'],
				],
				note: 'Maßgeblich ist der Tag, an dem die Kündigung zugeht, nicht der Tag, an dem ihr sie abschickt.',
			},
		],
		faq: [
			[
				'Wie lange ist die Kündigungsfrist für ein WG-Zimmer?',
				'Bei einem unbefristeten Vertrag knapp drei Monate: Kündigung bis zum dritten Werktag eines Monats zum Ablauf des übernächsten Monats. Für ein möbliertes Zimmer in der Wohnung, in der der Hauptmieter selbst wohnt, bis zum 15. eines Monats zum Monatsende.',
			],
			[
				'Kann ich aus einem gemeinsamen WG-Mietvertrag allein kündigen?',
				'Nein. Den gemeinsamen Vertrag können nur alle Mieter zusammen kündigen. Wer allein raus will, braucht eine Vereinbarung mit dem Vermieter und den Mitmietern.',
			],
			[
				'Muss ich einen Nachmieter suchen, um früher rauszukommen?',
				'Ohne Nachmieterklausel im Vertrag habt ihr keinen Anspruch, mit einem Nachmieter früher rauszukommen. Viele Vermieter und Hauptmieter lassen sich aber darauf ein, wenn ihr eine passende Person mitbringt.',
			],
			[
				'Kann ich mein WG-Zimmer per E-Mail oder WhatsApp kündigen?',
				'Nein. Die Kündigung von Wohnraum braucht die Schriftform, also ein Schreiben mit eigenhändiger Unterschrift, das dem Empfänger zugeht.',
			],
			[
				'Gilt die Kündigungsfrist auch ohne schriftlichen Mietvertrag?',
				'Ja. Wer gegen Miete in einem Zimmer wohnt, hat auch ohne Papier einen Mietvertrag, und es gelten die gesetzlichen Fristen.',
			],
		],
		sources: [
			['§ 573c BGB, Kündigungsfristen', 'https://www.gesetze-im-internet.de/bgb/__573c.html'],
			[
				'§ 549 BGB, Ausnahmen vom Mieterschutz',
				'https://www.gesetze-im-internet.de/bgb/__549.html',
			],
			['§ 568 BGB, Schriftform der Kündigung', 'https://www.gesetze-im-internet.de/bgb/__568.html'],
			[
				'§ 540 BGB, Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__540.html',
			],
			['§ 535 BGB, Inhalt des Mietvertrags', 'https://www.gesetze-im-internet.de/bgb/__535.html'],
		],
	},
	'wg-anmeldung': {
		link: 'Anmeldung in der WG',
		updated: '2026-10-27',
		published: '2026-10-20',
		title: 'Anmeldung in der WG: Meldepflicht, Frist, Muster | ManaWG',
		description:
			'Meldepflicht in der WG: zwei Wochen Frist, wer die Wohnungsgeberbestätigung ausstellt, was drinstehen muss (mit Beispiel) und was hilft, wenn sie verweigert wird.',
		h1: 'Anmeldung in der WG: Wohnungsgeberbestätigung und Frist',
		intro:
			'Wer in ein WG-Zimmer zieht, muss sich beim Bürgeramt anmelden, und dafür braucht es eine Wohnungsgeberbestätigung. Wer sie ausstellt, hängt vom Mietvertrag ab, und gerade bei Untermiete wissen viele Hauptmieter nicht, dass sie zuständig sind. Diese Seite fasst die Regeln des Bundesmeldegesetzes zusammen und ersetzt keine Rechtsberatung. Einzelheiten wie Formulare und Termine regelt eure Stadt.',
		sections: [
			[
				'Frist: zwei Wochen nach dem Einzug',
				'Wer eine Wohnung bezieht, muss sich innerhalb von zwei Wochen nach dem Einzug bei der Meldebehörde anmelden, meist dem Bürgeramt. Das gilt auch für ein WG-Zimmer. In großen Städten sind Termine knapp. Bucht deshalb schon vor dem Umzug, die Frist läuft trotzdem. Viele Städte bieten die Anmeldung inzwischen auch online mit dem Personalausweis an.',
			],
			[
				'Wer stellt die Wohnungsgeberbestätigung aus?',
				'Wohnungsgeber ist, wer euch die Wohnung überlässt. Habt ihr einen eigenen Vertrag mit dem Vermieter oder steht ihr im gemeinsamen Hauptmietvertrag, ist es der Vermieter oder die Hausverwaltung. Bei [Untermiete](/wg-mietvertrag) ist der Hauptmieter der Wohnungsgeber und muss die Bestätigung selbst ausstellen. Er muss den Einzug innerhalb der zwei Wochen bestätigen. Weigert er sich oder kommt die Bestätigung nicht rechtzeitig, sagt ihr der Meldebehörde unverzüglich Bescheid.',
			],
			[
				'Wenn der Hauptmieter die Bestätigung verweigert',
				'Der Wohnungsgeber ist nach § 19 BMG verpflichtet, bei der Anmeldung mitzuwirken. Verweigert er die Bestätigung oder kommt sie nicht rechtzeitig, müsst ihr das der Meldebehörde unverzüglich mitteilen (§ 19 Abs. 2 BMG). Ein Wohnungsgeber, der den Einzug nicht, falsch oder verspätet bestätigt, begeht eine Ordnungswidrigkeit, die mit bis zu 1.000 Euro geahndet werden kann (§ 54 BMG). So geht ihr vor: Bittet den Hauptmieter schriftlich um die Bestätigung, damit ihr es belegen könnt. Setzt eine kurze Frist, die vor dem Ende der zwei Wochen liegt. Kommt nichts, informiert die Meldebehörde und fragt dort, wie ihr weiter vorgeht.',
			],
			[
				'Muster: Was in der Bestätigung steht',
				'Die Bestätigung enthält den Namen und die Anschrift des Wohnungsgebers, bei abweichendem Eigentümer auch dessen Namen, das Einzugsdatum, die Anschrift der Wohnung und die Namen der meldepflichtigen Personen (§ 19 Abs. 3 BMG). Die Tabelle zeigt ein Beispiel mit ausgedachten Angaben. Viele Städte haben eigene Formulare, die Angaben sind dieselben.',
			],
			[
				'Elektronische Bestätigung',
				'Der Wohnungsgeber kann den Einzug auch elektronisch gegenüber der Meldebehörde bestätigen (§ 19 Abs. 1 BMG). Dafür erhält er ein Zuordnungsmerkmal, das er an die meldepflichtige Person weitergibt, damit sie es bei der Anmeldung angibt (§ 19 Abs. 4 BMG). Ob eure Meldebehörde diesen Weg anbietet, erfahrt ihr bei ihr.',
			],
			[
				'Was ihr zum Termin mitbringt',
				'Personalausweis oder Reisepass, die Wohnungsgeberbestätigung und das ausgefüllte Anmeldeformular, falls eure Stadt eines verlangt. Wer aus dem Ausland zuzieht, braucht je nach Herkunft weitere Unterlagen, etwa einen Aufenthaltstitel. Die Anmeldung selbst ist in der Regel kostenlos.',
			],
			[
				'Hauptwohnung oder Nebenwohnung',
				'Wer noch bei den Eltern gemeldet ist, muss angeben, welche Wohnung die Hauptwohnung ist. Das ist die Wohnung, die ihr vorwiegend nutzt, für Studierende meist die WG am Studienort. Viele Städte erheben auf eine Nebenwohnung eine Zweitwohnungsteuer. Prüft das, bevor ihr die WG als Nebenwohnung meldet.',
			],
			[
				'Wann keine Anmeldung nötig ist',
				'Wer in Deutschland schon gemeldet ist und höchstens sechs Monate bleibt, muss sich für die neue Wohnung weder an- noch abmelden, zum Beispiel bei einer [Zwischenmiete](/wg-zwischenmiete) während eines Praktikums. Bleibt ihr länger, meldet ihr euch innerhalb von zwei Wochen nach Ablauf der sechs Monate an. Wer sonst im Ausland wohnt, muss sich schon nach drei Monaten anmelden.',
			],
			[
				'Beim Auszug: abmelden nur in zwei Fällen',
				'Wer innerhalb Deutschlands umzieht, meldet sich am neuen Wohnort an, die alte Adresse wird dabei automatisch abgemeldet. Abmelden müsst ihr euch nur, wenn ihr ins Ausland zieht oder eine Nebenwohnung aufgibt, ohne eine neue zu beziehen. Das geht frühestens eine Woche vor und spätestens zwei Wochen nach dem Auszug. Was beim Auszug sonst ansteht, steht in der [Auszugs-Checkliste](/wg-auszug-checkliste).',
			],
			[
				'Bußgelder',
				'Wer sich nicht oder zu spät anmeldet, begeht eine Ordnungswidrigkeit, die mit bis zu 1.000 Euro geahndet werden kann. Dasselbe gilt für einen Wohnungsgeber, der die Bestätigung nicht oder falsch ausstellt. Eine Gefälligkeitsbestätigung für jemanden, der gar nicht einzieht, kann bis zu 50.000 Euro kosten.',
			],
			[
				'Nach der Anmeldung',
				'Mit der Meldebescheinigung lassen sich Bankkonto, Rundfunkbeitrag und Verträge auf die neue Adresse umstellen. Den Rundfunkbeitrag zahlt die WG nur einmal, wie ihr ihn aufteilt, steht im Ratgeber zum [Rundfunkbeitrag in der WG](/rundfunkbeitrag-wg). Was in den ersten Tagen sonst wichtig ist, fasst die [Einzugs-Checkliste](/wg-einzug-checkliste) zusammen.',
			],
		],
		tables: [
			{
				after: 'Muster: Was in der Bestätigung steht',
				title: 'Beispiel einer Wohnungsgeberbestätigung',
				header: ['Feld', 'Beispiel'],
				rows: [
					[
						'Name und Anschrift des Wohnungsgebers',
						'Erika Beispiel, Musterweg 1, 12345 Musterstadt',
					],
					['Name des Eigentümers, falls abweichend', 'Max Muster'],
					['Einzugsdatum', '01.11.2026'],
					['Anschrift der Wohnung', 'Musterweg 1, 2. Obergeschoss links, 12345 Musterstadt'],
					['Namen der meldepflichtigen Personen', 'Jonas Probe'],
				],
				note: 'Ausgedachte Angaben zur Veranschaulichung. Maßgeblich ist das Formular eurer Stadt.',
			},
		],
		faq: [
			[
				'Wer stellt in der WG die Wohnungsgeberbestätigung aus?',
				'Bei einem eigenen Vertrag oder dem gemeinsamen Hauptmietvertrag der Vermieter oder die Hausverwaltung. Bei Untermiete der Hauptmieter.',
			],
			[
				'Was tun, wenn der Hauptmieter nicht unterschreibt?',
				'Bittet ihn schriftlich um die Bestätigung und setzt eine kurze Frist. Kommt sie nicht rechtzeitig, teilt ihr das der Meldebehörde unverzüglich mit.',
			],
			[
				'Wie lange habe ich Zeit, mich in der WG anzumelden?',
				'Zwei Wochen ab dem Einzug. Ist kein Termin frei, bucht den nächsten möglichen und bewahrt die Bestätigung als Beleg auf.',
			],
			[
				'Muss ich mich für ein WG-Zimmer anmelden, wenn ich nur ein paar Monate bleibe?',
				'Wer in Deutschland schon gemeldet ist und höchstens sechs Monate bleibt, nicht. Wer sonst im Ausland wohnt, muss sich nach drei Monaten anmelden.',
			],
			[
				'Was passiert, wenn ich mich zu spät anmelde?',
				'Es ist eine Ordnungswidrigkeit. Das Bußgeld kann bis zu 1.000 Euro betragen, die Höhe legt die Behörde im Einzelfall fest.',
			],
			[
				'Muss ich mich beim Auszug aus der WG abmelden?',
				'Nur wenn ihr ins Ausland zieht oder eine Nebenwohnung aufgibt. Bei einem Umzug innerhalb Deutschlands reicht die Anmeldung am neuen Ort.',
			],
		],
		sources: [
			['§ 17 BMG, An- und Abmeldung', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
			['§ 19 BMG, Wohnungsgeberbestätigung', 'https://www.gesetze-im-internet.de/bmg/__19.html'],
			['§ 21 BMG, Haupt- und Nebenwohnung', 'https://www.gesetze-im-internet.de/bmg/__21.html'],
			[
				'§ 27 BMG, Ausnahmen von der Meldepflicht',
				'https://www.gesetze-im-internet.de/bmg/__27.html',
			],
			['§ 54 BMG, Bußgeldvorschriften', 'https://www.gesetze-im-internet.de/bmg/__54.html'],
		],
	},
	'splitwise-splid-wechseln': {
		link: 'Von Splitwise oder Splid wechseln',
		updated: '2026-10-29',
		published: '2026-10-21',
		title: 'Von Splitwise oder Splid wechseln: CSV-Import | ManaWG',
		description:
			'Splitwise- oder Splid-Ausgaben in die WG-Kasse übernehmen: CSV-Datei hochladen, Vorschau prüfen, Namen zuordnen, Import bei Bedarf rückgängig machen.',
		h1: 'Von Splitwise oder Splid zu ManaWG wechseln',
		intro:
			'Wenn die WG ihre Ausgaben bisher in Splitwise oder Splid geführt hat, muss beim Wechsel nichts von vorn beginnen. Liegen die Ausgaben als CSV-Datei vor, übernimmt ManaWG sie in die WG-Kasse. Ihr seht vorher eine Vorschau und könnt den Import danach rückgängig machen. Diese Anleitung zeigt den Ablauf und nennt die Grenzen.',
		sections: [
			[
				'Was ihr vorher braucht',
				'1. Eine CSV-Datei mit den Ausgaben aus Splitwise oder Splid. Den Export bietet jeweils der Anbieter an, die Menüs ändern sich, schaut deshalb dort nach.\n2. Eine WG in ManaWG, in der alle Mitbewohner schon Mitglied sind. Die Namen aus der Datei ordnet ihr später den Mitgliedern zu.\n3. Wer die Historie anderer Mitglieder importiert, braucht Admin-Rechte in der WG.\n4. Nur Euro-Beträge: ManaWG rechnet ausschließlich in Euro.',
			],
			[
				'Der Import in vier Schritten',
				'1. Öffnet in eurer WG den Import und wählt die Quelle: Splitwise CSV oder Splid CSV.\n2. Wählt die CSV-Datei aus oder fügt ihren Inhalt ein.\n3. Prüft die Vorschau mit allen erkannten Zeilen und ordnet die Namen aus der Datei euren WG-Mitgliedern zu. Vorgeschlagene Zuordnungen markiert die App, bitte kontrolliert sie.\n4. Bestätigt den Import. Erst jetzt wird gespeichert.',
			],
			[
				'Namen zuordnen und Zeilen abwählen',
				'In der Datei stehen die Namen, die ihr in Splitwise oder Splid vergeben habt. ManaWG schlägt passende Mitglieder vor, offene Namen müsst ihr selbst zuordnen. In der Vorschau wählt ihr einzelne Zeilen ab, die nicht übernommen werden sollen, etwa Ausgaben, die schon in der Kasse stehen.',
			],
			[
				'Was nicht übernommen wird',
				'Zeilen in anderen Währungen lehnt ManaWG einzeln ab, ebenso Zeilen mit ungültigem Datum, ungültigem Betrag oder ohne Beteiligte. Der Rest wird übernommen, die abgelehnten Einträge listet das Ergebnis mit Grund auf. Wer Ausgaben in Fremdwährung hatte, legt diese bei Bedarf von Hand neu an.',
			],
			[
				'Nur Screenshots statt Datei?',
				'Liegt keine CSV-Datei vor, wählt ihr als Quelle Screenshot. ManaWG liest ein Foto oder Bildschirmfoto einer Ausgabenliste per Texterkennung im Browser und zeigt das Ergebnis zum Korrigieren. Erkannt werden nur Eurobeträge, und das Lesen kann bis zu 30 Sekunden dauern. Eine CSV-Datei ist genauer und der bessere Weg, wenn es sie gibt.',
			],
			[
				'Import rückgängig machen',
				'Jeder Import steht im Importverlauf. Falls etwas nicht stimmt, macht ihn der Mitbewohner, der ihn gestartet hat, oder ein Admin rückgängig. Das geht nicht mehr, sobald einzelne Anteile des Imports schon als bezahlt markiert sind. Dann entfernt ihr falsche Ausgaben einzeln. Prüft die Vorschau also gründlich, bevor ihr bestätigt.',
			],
			[
				'Nach dem Wechsel',
				'Ab jetzt läuft alles in der [WG-Kasse](/wg-kasse): Ausgaben teilen, Salden sehen, Ausgleiche mit wenigen Überweisungen vorschlagen lassen, Fixkosten und Monatsabrechnung. Offene Salden aus dem alten System gleicht ihr am besten aus, bevor ihr wechselt, oder ihr übernehmt sie per Import. Wie ihr Schulden fair ausgleicht, steht unter [Schulden unter Mitbewohnern](/schulden-mitbewohner). Einen Vergleich der Apps findet ihr unter [Splitwise-Alternative](/splitwise-alternative), [Splid-Alternative](/splid-alternative) und [Tricount-Alternative](/tricount-alternative), alle Kriterien unter [beste WG-App](/beste-wg-app). Wer lieber eine eigene Kopie betreibt: ManaWG ist Open Source und lässt sich selbst hosten, siehe [Open-Source-WG-App](/open-source-wg-app).',
			],
		],
		faq: [
			[
				'Kann ich Splitwise-Ausgaben in ManaWG importieren?',
				'Ja, falls sie als CSV-Datei vorliegen. Ihr wählt im Import die Quelle Splitwise CSV, prüft die Vorschau und bestätigt. Übernommen werden nur Euro-Zeilen.',
			],
			[
				'Kann ich Splid-Ausgaben in ManaWG importieren?',
				'Ja, über die Quelle Splid CSV. Der Ablauf ist derselbe wie bei Splitwise: Datei auswählen, Vorschau prüfen, Namen zuordnen, bestätigen.',
			],
			[
				'Kann ich einen Import rückgängig machen?',
				'Ja, im Importverlauf, durch die Person, die importiert hat, oder einen Admin. Sind einzelne Anteile schon als bezahlt markiert, entfernt ihr falsche Ausgaben einzeln.',
			],
			[
				'Was passiert mit Ausgaben in anderen Währungen?',
				'ManaWG rechnet nur in Euro. Zeilen in anderen Währungen werden einzeln abgelehnt und im Ergebnis aufgelistet, der Rest wird übernommen.',
			],
			[
				'Gibt es einen Import aus Flatastic oder OurHome?',
				'Nein, einen direkten Import gibt es nur für Splitwise- und Splid-CSV sowie für Fotos von Ausgabenlisten.',
			],
		],
	},
};
