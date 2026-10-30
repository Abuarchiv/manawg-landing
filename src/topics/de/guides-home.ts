// Guides on household, rules and living together. General tips, not legal advice.
// Only name ManaWG features where manawg-app really has them (see topics.ts).
import { cleaningRota, tableToCsv } from '../cleaning-rota.ts';
import type { Topic } from '../types.ts';

const TASKS_FOUR = ['Bad', 'Küche', 'Böden', 'Müll und Flur'];
const TASKS_THREE = ['Bad', 'Küche', 'Böden und Müll'];
const TASKS_FIVE = [...TASKS_FOUR, 'Wohnzimmer und Balkon'];

/** Single source of the templates: HTML tables, CSV and Markdown all read from here. A to E stand for example flatmates. */
const TEMPLATE_FOUR = cleaningRota(['A', 'B', 'C', 'D'], TASKS_FOUR);
const TEMPLATE_TWO = cleaningRota(['A', 'B'], ['Bad', 'Böden', 'Küche', 'Müll und Flur']);
const TEMPLATE_THREE = cleaningRota(['A', 'B', 'C'], TASKS_THREE);
const TEMPLATE_FIVE = cleaningRota(['A', 'B', 'C', 'D', 'E'], TASKS_FIVE);

/** The same template data as a CSV. Static, no user input. */
export function cleaningRotaTemplateCsv(): string {
	return tableToCsv(TEMPLATE_FOUR.header, TEMPLATE_FOUR.rows);
}

export const GUIDES_DE_HOME: Record<string, Topic> = {
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
};
