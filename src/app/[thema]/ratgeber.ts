// Ratgeberseiten für Suchanfragen rund um das WG-Leben. Allgemeine Tipps, kein Rechtsrat.
// ManaWG-Funktionen nur nennen, wenn es sie in manawg-app wirklich gibt (siehe themen.ts).
import type { Thema } from './themen';

// Die reinen Funktionen liegen in einer kleinen Datei, damit der Generator nicht alle Ratgebertexte lädt.
import { NG, VERGLEICH_MANAWG, VERGLEICH_ZEILEN } from './gruppen.ts';
import { putzplanRotation, tabelleAlsCsv } from './putzplan-rotation.ts';

const AUFGABEN_VIER = ['Bad', 'Küche', 'Böden', 'Müll und Flur'];
const AUFGABEN_DREI = ['Bad', 'Küche', 'Böden und Müll'];
const AUFGABEN_FUENF = [...AUFGABEN_VIER, 'Wohnzimmer und Balkon'];

/** Einzige Quelle der Vorlagen: HTML-Tabellen, CSV und Markdown lesen hier. A bis E stehen für Beispielpersonen. */
export const PUTZPLAN_VORLAGE = putzplanRotation(['A', 'B', 'C', 'D'], AUFGABEN_VIER);
const VORLAGE_DREI = putzplanRotation(['A', 'B', 'C'], AUFGABEN_DREI);
const VORLAGE_FUENF = putzplanRotation(['A', 'B', 'C', 'D', 'E'], AUFGABEN_FUENF);

/** Dieselben Vorlagendaten als CSV. Statisch, keine Nutzereingaben. */
export function putzplanVorlageCsv(): string {
	return tabelleAlsCsv(PUTZPLAN_VORLAGE.kopf, PUTZPLAN_VORLAGE.zeilen);
}

export const RATGEBER: Record<string, Thema> = {
	'wg-kosten-aufteilen': {
		link: 'WG-Kosten aufteilen',
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'WG-Kosten fair aufteilen: drei Modelle mit Beispiel | ManaWG',
		beschreibung:
			'So teilt ihr in der WG Miete und gemeinsame Einkäufe fair auf: drei Modelle mit Beispielrechnung, Ausgleich ohne Überweisungschaos und Regeln gegen Streit.',
		h1: 'WG-Kosten fair aufteilen',
		einleitung:
			'Geld ist der häufigste Streitpunkt in Wohngemeinschaften, und selten geht es um große Summen. Meist fehlt eine Regel, auf die sich alle geeinigt haben. Hier steht, welche Kosten es gibt, welche Aufteilung sich bewährt hat und wie ihr den Überblick behaltet.',
		abschnitte: [
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
		fragen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'Putzplan erstellen: Anleitung, Tabelle, Wochenplan | ManaWG',
		beschreibung:
			'Putzplan selber erstellen in 5 Schritten: Aufgaben nach Raum und Rhythmus, Wochenplan als Tabelle, faire Verteilung für Haushalt und WG. Mit Beispiel.',
		h1: 'Putzplan erstellen: Schritt für Schritt für Haushalt und WG',
		einleitung:
			'Ein Putzplan scheitert selten an der Faulheit, sondern an unklaren Aufgaben und an Plänen, die niemand pflegt. In fünf Schritten kommt ihr zu einem Plan für Haushalt oder WG: Aufgaben nach Räumen sammeln, Aufwand schätzen, auf die Woche verteilen, fair zuteilen und sichtbar machen. Alle Zahlen und Tage sind Beispiele, die ihr an eure Wohnung anpasst.',
		abschnitte: [
			[
				'In fünf Schritten zum Putzplan',
				'1. Aufgaben nach Räumen sammeln\n2. Aufwand schätzen\n3. Auf die Woche verteilen\n4. Fest oder rotierend verteilen\n5. Sichtbar machen und pflegen',
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
				'Fair heißt nicht, dass alle gleich viele Aufgaben haben, sondern ungefähr gleich viel Zeit putzen. Schätzt die Zeiten für eure Wohnung einmal gemeinsam, dann gibt es später weniger Streit über ungleiche Lasten. Wer den Müll übernimmt, kann deshalb zusätzlich den Flur oder den Kühlschrank bekommen. Die Tabelle nennt grobe Richtwerte als Ausgangspunkt.',
			],
			[
				'Schritt 3: Auf die Woche verteilen',
				'Verteilt die Aufgaben so auf die Tage, dass nicht alles am Wochenende landet. Lasst einen Tag pro Woche frei: Er dient als Puffer für Verschobenes, und niemand muss an diesem Tag putzen. Die Tabelle zeigt einen Wochenplan als Beispiel, den ihr an eure Termine anpasst.',
			],
			[
				'Schritt 4: Fest oder rotierend verteilen',
				'Es gibt drei Wege, die Aufgaben auf Personen zu verteilen. Die Tabelle stellt sie gegenüber. Eine fertige Vier-Wochen-Rotation für vier Personen steht in der [Putzplan-Vorlage](/putzplan-vorlage).',
			],
			[
				'Schritt 5: Sichtbar machen und pflegen',
				'Der Plan muss für alle sichtbar sein, am besten dort, wo ohnehin jeder täglich hinschaut: als Aushang an Küchentür oder Kühlschrank, als Tabelle in einer geteilten Datei oder in einer App. Pflegt ihn regelmäßig. Zieht jemand aus oder passen Aufgaben nicht mehr, besprecht das in der WG-Runde und ändert den Plan. Niemand will der Aufpasser sein, deshalb helfen Erinnerungen mehr als Kontrolle.',
			],
			[
				'Besonderheiten in der WG',
				'Abwesenheit: Wer verreist ist, wird übersprungen und holt danach nicht alles doppelt nach, mehr unter [Urlaub und Abwesenheit](/wg-abwesenheit-urlaub)\nGäste: Wer Besuch einlädt, sorgt dafür, dass die Gemeinschaftsräume sauber bleiben\nStreit: Hält sich jemand nicht an den Plan, sprecht sachlich an, was konkret nicht gemacht wurde, und bewertet nicht die Person, mehr unter [Streit lösen](/wg-streit-loesen)',
			],
			[
				'Fertig statt selbst bauen',
				'Die [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) gibt es als Tabelle und als CSV-Download. Sie enthält fertige Rotationen für drei, vier und fünf Personen und einen Generator für eure Namen.\nDie [Putzplan-App](/putzplan) von ManaWG wiederholt Aufgaben in Tagen oder Monaten und bestimmt anhand überfälliger Aufgaben, wer als Nächstes dran ist. Abwesende werden übersprungen, und an fällige zugewiesene Aufgaben erinnert ManaWG per Push.',
			],
		],
		tabellen: [
			{
				nach: 'Schritt 1: Aufgaben nach Räumen sammeln',
				titel: 'Beispiel: Aufgaben nach Räumen und Rhythmus',
				kopf: ['Raum', 'Aufgabe', 'Rhythmus'],
				zeilen: [
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
				nach: 'Schritt 2: Aufwand schätzen',
				titel: 'Zeitaufwand je Aufgabe',
				kopf: ['Aufgabe', 'Richtwert'],
				zeilen: [
					['Bad gründlich', '30 bis 45 Minuten'],
					['Küche', '20 bis 30 Minuten'],
					['Böden saugen und wischen', '30 bis 40 Minuten'],
					['Müll und Pfand', '10 Minuten'],
				],
				hinweis: 'Grobe Richtwerte, keine Messung.',
			},
			{
				nach: 'Schritt 3: Auf die Woche verteilen',
				titel: 'Beispiel: Wochen-Putzplan',
				kopf: ['Tag', 'Aufgabe', 'Was dazugehört'],
				zeilen: [
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
				nach: 'Schritt 4: Fest oder rotierend verteilen',
				titel: 'Drei Wege der Verteilung',
				kopf: ['Weg', 'Vorteil', 'Nachteil'],
				zeilen: [
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
		],
		fragen: [
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
				'Wie oft sollte man welche Räume putzen?',
				'Bad, Küche, Wohnzimmer und Müll wöchentlich, Flur und Kühlschrank alle 14 Tage, Backofen und Fenster monatlich. Die Spülmaschine wird täglich ausgeräumt. Das sind Beispiele, passt den Rhythmus an eure Wohnung an.',
			],
			[
				'Gibt es eine Putzplan-App?',
				'Ja, ManaWG enthält einen Putzplan mit Rhythmus, fairer Rotation, Abwesenheiten und Erinnerungen. Die App ist kostenlos und läuft im Browser.',
			],
		],
	},
	'wg-gruenden-checkliste': {
		link: 'WG gründen',
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'WG gründen: Checkliste mit Kaution und Vertrag | ManaWG',
		beschreibung:
			'WG gründen Schritt für Schritt: Mitbewohner und Wohnung finden, Vertragsform wählen, Kaution berechnen, WG-Vereinbarung, Anmeldung und Kosten. Mit Checkliste.',
		h1: 'WG gründen: die Checkliste',
		einleitung:
			'Eine neue WG fängt oft mit Begeisterung an und endet mit Streit über Dinge, die niemand besprochen hat. Diese Checkliste zur WG-Gründung führt durch die Fragen, die vor und kurz nach dem Einzug geklärt sein sollten: vom Mietvertrag über Anmeldung und Verträge bis zu Geld, Putzplan und Regeln. Sie ersetzt keine Rechtsberatung, besonders nicht bei Mietverträgen.',
		abschnitte: [
			[
				'1. Passende Mitbewohner finden',
				'Entscheidend ist weniger, ob ihr beste Freunde seid, als ob ihr ähnliche Vorstellungen vom Zusammenleben habt. Sprecht über Ruhezeiten, Besuch, Sauberkeit, Rauchen, Haustiere und darüber, ob ihr eine Zweck-WG oder gemeinsame Abende sucht. Wie ihr passende Leute findet und auswählt, steht unter [Mitbewohner finden](/mitbewohner-finden). Klärt auch, wie lange jede Person ungefähr bleiben will: Eine WG, in der alle zwei Jahre planen, funktioniert anders als eine mit Zwischenmietern.',
			],
			[
				'2. Wohnung suchen und gemeinsam bewerben',
				'Sucht ihr als Gruppe, tretet gegenüber Vermietern geschlossen auf. Bereitet einen kurzen WG-Steckbrief vor: wer ihr seid, wie lange ihr bleiben wollt und welche Vertragsform ihr euch vorstellt. Häufig verlangen Vermieter von jeder Person eine Schufa-Auskunft, einen Einkommensnachweis und eine Mietschuldenfreiheitsbescheinigung; fragt vorher, was sie brauchen. Bei der Besichtigung fragt ihr nach der Zahl der Bäder, nach den Zählern für Strom und Gas und danach, ob der Vermieter einen gemeinsamen Vertrag, Einzelverträge oder Untermiete zulässt.',
			],
			[
				'3. Die richtige Vertragsform wählen',
				'In einer WG gibt es drei übliche Konstellationen. Beim gemeinsamen Hauptmietvertrag unterschreiben alle und haften gemeinsam für die ganze Miete; ausziehen kann eine Person nur mit Zustimmung von Vermieter und Mitbewohnern. Beim Untermietvertrag mietet eine Person die Wohnung und vermietet Zimmer weiter; sie trägt das Risiko, braucht dafür die Erlaubnis des Vermieters und hat mehr Einfluss bei Nachmietern. Bei Einzelmietverträgen hat jede Person einen eigenen Vertrag über ihr Zimmer mit dem Vermieter. Welche Form passt, hängt davon ab, wie fest die WG ist; die Unterschiede stehen im Ratgeber zum [WG-Mietvertrag](/wg-mietvertrag). Im Zweifel hilft ein Mieterverein.',
			],
			[
				'4. Kaution und Übergabe festhalten',
				'Die Kaution darf höchstens drei Nettokaltmieten betragen und kann in drei Monatsraten gezahlt werden. Haltet fest, wer welchen Anteil eingezahlt hat, damit bei einem Auszug klar ist, wem was zusteht. Bei der Wohnungsübergabe gehört jedes Zimmer ins Übergabeprotokoll, am besten mit Fotos von Schäden und den Zählerständen für Strom, Gas und Wasser.',
			],
			[
				'5. Eine WG-Vereinbarung unter euch',
				'Neben dem Mietvertrag lohnt sich eine kurze Vereinbarung nur unter euch. Sie regelt, was der Vertrag mit dem Vermieter offenlässt: Mietanteile je Zimmer, Nebenkosten, Strom und Internet, Putzplan, gemeinsame Kasse, Gäste und Ruhezeiten und was beim Auszug gilt, etwa wie früh jemand Bescheid sagt und wer bei der Suche nach einem Nachfolger hilft. Die Vereinbarung ist eine Absprache unter Mitbewohnern, am Mietvertrag ändert sie nichts. Ein kurzes Muster: „Wir, [Namen], wohnen ab [Datum] in [Adresse]. Miete: [Aufteilung]. Fixkosten: [Liste]. Putzplan: [Rhythmus]. Gäste: [Regel]. Wer auszieht, sagt es [Zahl] Wochen vorher und hilft bei der Suche nach einem Nachfolger. Nach drei Monaten sprechen wir die Vereinbarung neu durch.“ Vorschläge für einzelne Regeln stehen bei den [WG-Regeln](/wg-regeln). In ManaWG haltet ihr die Vereinbarung als Pinnwand-Beitrag der Art Entscheidung fest, die anderen antworten mit „Passt“.',
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
				'Klärt, was gemeinsam angeschafft wird (Waschmaschine, Staubsauger, Küchengeräte, Putzmittel) und wem es gehört, wenn jemand auszieht. Bei teuren Dingen hilft eine einfache Notiz, wer wie viel bezahlt hat. Viele WGs kaufen Grundausstattung gemeinsam und den Rest bringt jede Person selbst mit.',
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
				'Einmal im Monat eine halbe Stunde reicht. Ihr gleicht die Salden in der [WG-Kasse](/wg-kasse) aus; die Monatsabrechnung von ManaWG kommt am Monatsanfang per Mail und zeigt Summen je Kategorie und Überweisungsvorschläge. Dazu besprecht ihr Termine im gemeinsamen Kalender und klärt, ob eine eurer Regeln angepasst werden muss. Beschlüsse haltet ihr auf der Pinnwand fest, damit sie nicht im Chatverlauf verschwinden. Wie ihr Konflikte ansprecht, steht unter [Streit in der WG lösen](/wg-streit-loesen). Wer regelmäßig redet, muss selten eskalieren.',
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
		fragen: [
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
		],
		tabellen: [
			{
				nach: '4. Kaution und Übergabe festhalten',
				titel: 'Beispiel: Kaution bei 1.200 € Kaltmiete und vier Personen',
				kopf: ['Position', 'Betrag', 'Grundlage'],
				zeilen: [
					['Höchstbetrag: drei Monatsmieten ohne Betriebskosten', '3.600 €', '§ 551 Abs. 1 BGB'],
					['Anteil je Person bei gleicher Aufteilung', '900 €', 'eure Absprache'],
					[
						'Zahlung in drei Monatsraten',
						'1.200 € je Rate, 300 € je Person',
						'§ 551 Abs. 2 BGB: erste Rate zu Beginn des Mietverhältnisses, die beiden weiteren mit den folgenden Mieten',
					],
				],
				hinweis:
					'Rechenbeispiel für eine Kaution in Geld. Bei Einzelmietverträgen gilt die Grenze für jeden Vertrag, bei Untermiete für den Untermietvertrag.',
			},
			{
				nach: '3. Die richtige Vertragsform wählen',
				titel: 'Drei Vertragsmodelle',
				kopf: ['Modell', 'Haftung', 'Auszug', 'Kündigung'],
				zeilen: [
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
				hinweis: 'Mehr dazu im Ratgeber WG-Mietvertrag.',
			},
		],
		quellen: [
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			['§ 17 BMG, An- und Abmeldung', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
			[
				'§ 553 BGB, Gestattung der Gebrauchsüberlassung an Dritte',
				'https://www.gesetze-im-internet.de/bgb/__553.html',
			],
		],
	},
	'wg-mietvertrag': {
		link: 'WG-Mietvertrag',
		stand: '2026-10-27',
		erschienen: '2026-10-19',
		titel: 'WG-Mietvertrag: Haupt-, Untermiete, Einzelvertrag | ManaWG',
		beschreibung:
			'Welcher Mietvertrag passt zur WG? Gemeinsamer Hauptmietvertrag, Untermiete oder Einzelverträge im Vergleich: Haftung, Kündigung, Mieterwechsel und Kaution.',
		h1: 'Der WG-Mietvertrag: drei Modelle im Vergleich',
		einleitung:
			'Wer in einer WG wohnt, hat nicht automatisch dieselben Rechte wie die Mitbewohner. Entscheidend ist, wie der Mietvertrag aufgebaut ist: ob alle gemeinsam unterschreiben, eine Person untervermietet oder jede Person einen eigenen Vertrag hat. Davon hängt ab, wer für die Miete haftet, wer kündigen kann und wie ein Wechsel abläuft. Diese Seite gibt einen Überblick und ersetzt keine Rechtsberatung. Bei konkreten Fragen helfen Mietervereine.',
		abschnitte: [
			[
				'Modell 1: Gemeinsamer Hauptmietvertrag',
				'Alle Mitbewohner unterschreiben einen Vertrag mit dem Vermieter. Jede Person hat damit dieselben Rechte, aber alle haften gemeinsam für die ganze Miete: Zahlt eine Person nicht, kann der Vermieter den vollen Betrag von jeder anderen verlangen. Kündigen können in der Regel nur alle gemeinsam, und [einen Mitbewohner kündigen](/mitbewohner-kuendigen) kann niemand. Will eine Person ausziehen, braucht der Wechsel die Zustimmung des Vermieters und der übrigen Mieter. Manche Vermieter nehmen dafür eine Klausel auf, die Mieterwechsel in der WG ausdrücklich erlaubt. Achtet beim Unterschreiben darauf, ob es sie gibt.',
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
				'Die Kaution darf höchstens drei Nettokaltmieten betragen und kann in drei Monatsraten gezahlt werden. Beim gemeinsamen Hauptmietvertrag zahlt die WG sie gemeinsam. Haltet fest, wer welchen Anteil eingezahlt hat, denn bei einem Wechsel zahlt meist der Nachfolger seinen Anteil an die ausziehende Person, während die Kaution beim Vermieter bleibt. Bei Untermiete zahlt ihr die Kaution an den Hauptmieter.',
			],
			[
				'Was in den Vertrag gehören sollte',
				'1. Wer Mieter ist, mit vollem Namen\n2. Welche Räume zur alleinigen Nutzung gehören und welche gemeinsam genutzt werden\n3. Miete und Nebenkosten, getrennt ausgewiesen\n4. Höhe der Kaution\n5. Ob Untervermietung oder Mieterwechsel erlaubt ist\n6. Kündigungsfristen und gegebenenfalls Befristung\n7. Welche Möbel mitvermietet sind',
			],
			[
				'Welches Modell passt?',
				'Für eine feste WG unter Freunden, die lange zusammen wohnen will, passt der gemeinsame Hauptmietvertrag mit einer Klausel für Mieterwechsel. Wechseln die Mitbewohner oft, etwa in Studentenstädten, ist Untermiete flexibler, belastet aber den Hauptmieter. Einzelverträge sind am bequemsten, geben der WG aber am wenigsten Einfluss darauf, wer einzieht. Wie ihr danach Miete, Nebenkosten und Einkäufe aufteilt, steht unter [WG-Kosten aufteilen](/wg-kosten-aufteilen), alles Weitere für den Start in der [Checkliste zum WG-Gründen](/wg-gruenden-checkliste).',
			],
		],
		fragen: [
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
		],
		quellen: [
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
		],
	},
	'wg-zwischenmiete': {
		link: 'Zwischenmiete',
		stand: '2026-10-27',
		erschienen: '2026-10-19',
		titel: 'Zwischenmiete in der WG: Ablauf, Vertrag, Kosten | ManaWG',
		beschreibung:
			'WG-Zimmer zwischenvermieten für Auslandssemester oder Praktikum: Erlaubnis des Vermieters, Zwischenmietvertrag, Miete, Kaution, Anmeldung und Übergabe.',
		h1: 'Zwischenmiete in der WG',
		einleitung:
			'Ein Auslandssemester, ein Praktikum in einer anderen Stadt oder ein paar Monate auf Reisen: Wer das WG-Zimmer behalten will, aber keine Miete für ein leeres Zimmer zahlen möchte, sucht eine Zwischenmiete. Damit das für alle gut geht, braucht es die Erlaubnis des Vermieters, einen klaren Vertrag und die Zustimmung der Mitbewohner. Diese Seite gibt einen Überblick und ersetzt keine Rechtsberatung.',
		abschnitte: [
			[
				'Erst fragen: Vermieter und WG',
				'Eine Zwischenmiete ist rechtlich eine [Untervermietung](/wg-mietvertrag) und braucht die Erlaubnis des Vermieters, am besten schriftlich. Wer nach Vertragsschluss ein berechtigtes Interesse hat, etwa wegen eines befristeten Auslandsaufenthalts, hat unter bestimmten Voraussetzungen einen Anspruch darauf. Genauso wichtig sind die Mitbewohner: Sie leben monatelang mit der neuen Person zusammen und sollten bei der Auswahl mitentscheiden.',
			],
			[
				'Den Zwischenmieter finden',
				'Zwischenmieter suchen oft kurzfristig und für feste Zeiträume, etwa Austauschstudierende oder Praktikanten. Gebt in der Anzeige genau an, von wann bis wann das Zimmer frei ist, was es warm kostet und was im Zimmer bleibt. Ein kurzes Kennenlernen mit der WG, notfalls per Videocall, verhindert böse Überraschungen. Wie ihr Bewerbungen sortiert und auswählt, steht unter [Mitbewohner finden](/mitbewohner-finden).',
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
		fragen: [
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
		quellen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'WG-Regeln: 10 Regeln als Vorlage zum Übernehmen | ManaWG',
		beschreibung:
			'Zehn WG-Regeln als Vorlage für Ruhezeiten, Besuch, Putzen, Kühlschrank und Geld, mit Spielraum je Regel, Testphase und Tipps, wie ihr Verstöße ansprecht.',
		h1: 'WG-Regeln, die wirklich funktionieren',
		einleitung:
			'Viele WGs haben entweder gar keine Regeln oder einen langen Katalog, an den sich niemand hält. Gute Regeln sind kurz, konkret und von allen beschlossen. Unten steht eine Vorlage mit zehn Regeln, die ihr übernehmen und anpassen könnt, danach die Bereiche im Einzelnen.',
		tabellen: [
			{
				nach: 'Vorlage: zehn WG-Regeln zum Übernehmen',
				titel: 'Regeln mit Spielraum',
				kopf: ['Bereich', 'Standard aus der Vorlage', 'Spielraum'],
				zeilen: [
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
				],
				hinweis:
					'Die Werte sind Beispiele, keine Vorschrift. Mietvertrag und Hausordnung gehen vor.',
			},
		],
		abschnitte: [
			[
				'Vorlage: zehn WG-Regeln zum Übernehmen',
				'1. Unter der Woche ist ab 22 Uhr Ruhe, am Wochenende ab Mitternacht.\n2. Partys werden mindestens einen Tag vorher angekündigt.\n3. Übernachtungsgäste sind willkommen, wer länger als drei Nächte bleibt, wird vorher abgesprochen.\n4. Geschirr wird am selben Tag gespült oder in die Spülmaschine geräumt.\n5. Der Putzplan rotiert wöchentlich, wer verreist ist, wird übersprungen und holt nichts nach.\n6. Jede Person hat ein eigenes Fach im Kühlschrank, Fremdes wird nur nach Frage gegessen.\n7. Putzmittel, Klopapier und Spülmittel zahlen alle gemeinsam, private Lebensmittel jede Person selbst.\n8. Anschaffungen über 30 Euro für die WG werden vorher abgesprochen.\n9. Ausgaben werden sofort eingetragen und am Monatsersten ausgeglichen.\n10. Einmal im Monat gibt es eine kurze WG-Runde, in der Regeln angepasst werden können.',
			],
			[
				'Ruhezeiten und Lärm',
				'Legt feste Zeiten fest, zu denen Ruhe herrscht, zum Beispiel unter der Woche ab 22 Uhr. Dazu gehört die Absprache, dass Feiern angekündigt werden. Eine Faustregel: Wer feiert, sagt es mindestens einen Tag vorher und nimmt Rücksicht auf Mitbewohner mit Prüfung oder Frühschicht.',
			],
			[
				'Besuch und Übernachtungsgäste',
				'Klärt, wie oft und wie lange Gäste bleiben dürfen und ob man vorher fragt. Wer Dauerbesuch hat, beteiligt sich an Nebenkosten. Das sind Absprachen, keine Gesetze. Rechtliche Fragen zum Mietvertrag klärt ihr mit Vermieter oder Mieterverein.',
			],
			[
				'Haushalt und Sauberkeit',
				'Haltet fest, wer wann welche Aufgabe übernimmt, und was „sauber“ bedeutet. Ein Putzplan mit Rotation und Erinnerungen ersetzt Diskussionen. Wie er entsteht, steht unter [Putzplan erstellen](/putzplan-erstellen), und eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) ist ein guter Anfang. Geschirr gehört nicht über Nacht in die Spüle, Gemeinschaftsräume bleiben nutzbar: solche Mini-Regeln verhindern die meisten Konflikte.',
			],
			[
				'Gemeinsame Kasse und Einkauf',
				'Definiert, was gemeinsam bezahlt wird (Putzmittel, Klopapier, Gewürze) und was nicht. Legt fest, wie ausgeglichen wird: Wie eine gemeinsame Kasse geführt werden kann, steht im Ratgeber [WG-Haushaltskasse](/wg-haushaltskasse), die Aufteilung der Kosten unter [WG-Kosten fair aufteilen](/wg-kosten-aufteilen). Mit einer gemeinsamen [Einkaufsliste](/wg-einkauf-organisieren) weiß jeder, was fehlt, und doppelte Einkäufe entfallen.',
			],
			[
				'Bad, Küche und Gemeinschaftsräume',
				'Morgens wird das Bad schnell knapp. Wer früh raus muss, bekommt ein festes Zeitfenster, alle anderen duschen davor oder danach. In der Küche gilt: Wer kocht, räumt danach auf, und die Arbeitsfläche ist frei für die nächste Person. Im Wohnzimmer bleibt nichts Privates dauerhaft liegen, sonst wird der Raum zum Abstellraum.',
			],
			[
				'Regeln für Kühlschrank und Spülmaschine',
				'Kühlschrank: Jede Person hat ein eigenes Fach, für Gemeinsames gibt es ein weiteres. Fremdes wird nur nach Frage gegessen.\nKühlschrank: Alle zwei Wochen wird gemeinsam durchgesehen und Abgelaufenes entsorgt, zum Beispiel als wiederkehrende Putzaufgabe.\nSpülmaschine: Sauberes Geschirr wird gleich ausgeräumt, benutztes kommt in die Maschine statt über Nacht in die Spüle.\nSpülmaschine: Tabs und Klarspüler zahlen alle gemeinsam, wer den letzten nimmt, setzt ihn auf die Einkaufsliste.',
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
				'Beschließt Regeln nicht für immer. Vereinbart eine Testphase von vier Wochen und einen festen Termin, an dem ihr besprecht, was nicht funktioniert hat. Danach reicht die monatliche WG-Runde, wie sie Regel 10 der Vorlage vorsieht. Schreibt unter die Vorlage, ab wann sie gilt und bis wann die Testphase läuft.',
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
		fragen: [
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
		],
	},
	'wg-nebenkosten': {
		link: 'WG-Nebenkosten',
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'WG-Nebenkosten, Strom und Internet fair aufteilen | ManaWG',
		beschreibung:
			'Wie WGs Nebenkosten, Strom, Internet und Rundfunkbeitrag aufteilen: Wer den Vertrag führt, wie ihr abrechnet und wie Nachzahlungen fair verteilt werden.',
		h1: 'Nebenkosten, Strom und Internet in der WG',
		einleitung:
			'Neben der Miete sind Nebenkosten, Strom und Internet die größten Posten im WG-Budget. Weil meist eine Person den Vertrag führt, entstehen Fragen: Wer zahlt was, und was passiert bei Nachzahlungen? Hier stehen die gängigen Lösungen.',
		abschnitte: [
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
		fragen: [
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
		quellen: [
			[
				'§ 556 BGB, Vereinbarungen über Betriebskosten',
				'https://www.gesetze-im-internet.de/bgb/__556.html',
			],
			['Rundfunkbeitrag, ein Beitrag je Wohnung', 'https://www.rundfunkbeitrag.de/'],
		],
	},
	'wg-einkauf-organisieren': {
		link: 'WG-Einkauf organisieren',
		stand: '2026-10-21',
		erschienen: '2026-10-11',
		titel: 'Einkaufen in der WG: gemeinsam oder getrennt? | ManaWG',
		beschreibung:
			'Gemeinsame Kasse, geteilte Einkaufsliste oder jeder für sich: So organisiert ihr den Einkauf in der WG ohne Streit um Lebensmittel und Haushaltsbedarf.',
		h1: 'Einkaufen in der WG organisieren',
		einleitung:
			'Wer isst wessen Butter? Wer kauft Klopapier? Der Einkauf gehört zu den Dingen, die in WGs ständig Reibung erzeugen. Dabei gibt es drei bewährte Modelle, die sich auch kombinieren lassen.',
		abschnitte: [
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
		fragen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'Beste WG-App: Vergleich mit Tabelle | ManaWG',
		beschreibung:
			'Welche WG-App passt zu euch? Vergleich nach Ausgaben, Putzplan, Einkauf, Kalender und Preis: ManaWG, Flatastic, Splitwise, Splid, Tricount und OurHome.',
		h1: 'Die beste WG-App: 7 Kriterien für die Auswahl',
		einleitung:
			'Es gibt viele Apps für Wohngemeinschaften, und keine ist für jede WG die beste. Manche rechnen nur Geld, andere organisieren nur den Haushalt. Diese Seite ist kein unabhängiges Ranking, sondern die Sicht des Anbieters ManaWG. Mit diesen sieben Kriterien findet ihr die App, die zu eurem Alltag passt, bevor ihr alle Mitbewohner zum Umstieg bewegt.',
		quellen: [
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
		tabellen: [
			{
				nach: 'einleitung',
				titel: 'WG-Apps im Vergleich',
				kopf: ['Merkmal', 'Flatastic', 'ManaWG', 'OurHome', 'Splid', 'Splitwise', 'Tricount'],
				// Spalten alphabetisch, damit die Tabelle keine Rangfolge nahelegt.
				zeilen: VERGLEICH_ZEILEN.map((z, i) => [
					z,
					...[
						[
							'Finanzen laut Anbieter',
							'Aufgaben laut Anbieter',
							'Einkäufe laut Anbieter',
							NG,
							'Pinnwand laut Anbieter, Chat nicht geprüft',
							NG,
							'Premium kostenpflichtig laut Anbieter',
						],
						VERGLEICH_MANAWG,
						[],
						['ja, in Gruppen', NG, NG, NG, NG, 'über 150 laut Anbieter', NG],
						[
							'ja',
							NG,
							NG,
							NG,
							NG,
							'Umrechnung im Pro-Tarif laut Anbieter',
							'Pro-Tarif laut Anbieter',
						],
						['ja', NG, NG, NG, NG, 'mehrere Währungen laut Anbieter', 'kostenlos laut Anbieter'],
					].map((spalte) => spalte[i] ?? NG),
				]),
				hinweis:
					'Angaben zu anderen Anbietern laut deren Seiten, Stand 14. Oktober 2026 (Tricount: 27. Oktober 2026). Was die Quellen nicht belegen, steht als „nicht geprüft“ da. Die Spalten sind alphabetisch sortiert, kein Ranking.',
			},
		],
		abschnitte: [
			[
				'1. Was kostet die App wirklich?',
				'Prüft, ob Funktionen erst im Abo freigeschaltet werden, ob Werbung erscheint und ob es Grenzen bei der Zahl der Einträge gibt. Tarife ändern sich, schaut deshalb bei jedem Anbieter selbst nach. Die [kostenlose WG-App ManaWG](/wg-app) kommt ohne Werbung und ohne Bezahlstufe aus. Splitwise Pro nennt laut Anbieter unter anderem unbegrenzte Ausgaben, keine Werbung, das Scannen von Belegen und die Umrechnung von Währungen. Was die [kostenlose Version von Splitwise](/splitwise-kostenlos) begrenzt, steht auf einer eigenen Seite. Splid nennt auf seiner deutschen Seite über 150 Währungen, Offline-Nutzung sowie PDF- und Excel-Exporte. Flatastic organisiert laut Anbieter Aufgaben, Einkäufe, Finanzen und Pinnwand und bietet ein kostenpflichtiges Premium, unter anderem ohne Werbung und mit Verläufen. ManaWG ist kostenlos und werbefrei und verbindet Kasse, Putzplan, Einkaufsliste, Kalender, Pinnwand und Chat, rechnet aber nur in Euro, nur auf Deutsch und für höchstens 20 aktive Mitglieder pro WG. Tarife und Funktionen ändern sich, prüft den aktuellen Stand deshalb bei den Anbietern selbst.',
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
				'Wo liegen die Daten, gibt es Werbung und Tracking, ist die App auf Deutsch? Bei ManaWG liegen die Daten in der EU, es gibt keine Werbung, und die App ist durchgehend deutsch. Eine englische Oberfläche und andere Währungen als Euro gibt es nicht. Wer international in vielen Währungen teilt, ist bei einer App mit Währungsumrechnung besser aufgehoben.',
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
		fragen: [
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
		],
	},
	'ueber-manawg': {
		link: 'Über ManaWG',
		stand: '2026-10-16',
		erschienen: '2026-10-11',
		titel: 'Was ist ManaWG? Die kostenlose WG-App im Überblick',
		beschreibung:
			'ManaWG ist eine kostenlose deutschsprachige WG-App für Ausgaben, Einkauf, Putzplan, Kalender, Pinnwand und Chat. Fakten, Betreiber, Abgrenzung zu WireGuard.',
		h1: 'Was ist ManaWG?',
		einleitung:
			'ManaWG ist eine kostenlose Web-App für Wohngemeinschaften auf Deutsch. Sie bündelt Ausgaben teilen, Einkaufsliste, Putzplan, Kalender, Pinnwand und Chat. ManaWG hat nichts mit dem VPN-Protokoll WireGuard zu tun.',
		quellen: [
			['Impressum', '/impressum'],
			['Datenschutz', '/datenschutz'],
			['AGB', '/agb'],
		],
		abschnitte: [
			[
				'Kurzfassung',
				'ManaWG (auch Mana WG) ist eine Haushalts-App für Wohngemeinschaften. Mitbewohner teilen Ausgaben und gleichen Salden mit wenigen Überweisungen aus, führen eine gemeinsame Einkaufsliste, organisieren einen fair verteilten Putzplan und halten Absprachen an einer Pinnwand fest. Die App ist kostenlos, werbefrei und läuft im Browser unter app.manawg.com.',
			],
			[
				'Fakten auf einen Blick',
				'Preis: kostenlos, keine Werbung, keine Bezahlstufe. Sprache: Deutsch, Währung: Euro. Plattform: Web-App (PWA), installierbar auf iPhone, Android und Desktop, ohne App Store. Anmeldung: Google oder E-Mail. Größe: bis zu 20 aktive Mitglieder pro WG. Daten: in der EU gespeichert (Frankfurt am Main). Beitritt: per Einladungslink oder Code.',
			],
			[
				'Funktionen',
				'Ausgaben gleichmäßig oder mit eigenen Beträgen teilen, Fixkosten und Monatsabrechnung, Import bereits vorhandener passender CSV-Dateien, Einkaufsliste mit Vorräten, Putzplan mit fairer Rotation und Abwesenheiten, Kalender mit Kalender-Abo, Pinnwand, Chat und Push-Erinnerungen. Eine Bankanbindung und Überweisungen aus der App gibt es nicht.',
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
		fragen: [
			[
				'Was ist ManaWG?',
				'Eine kostenlose deutschsprachige WG-App für Ausgaben, Einkauf, Putzplan, Kalender, Pinnwand und Chat. Sie läuft im Browser unter app.manawg.com.',
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
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'WG-Putzplan Vorlage zum Ausdrucken: PDF & CSV | ManaWG',
		beschreibung:
			'Kostenlose WG-Putzplan Vorlage für 3, 4 und 5 Personen: Rotationstabelle, Aufgaben mit Rhythmus, Generator mit euren Namen, als PDF drucken oder als CSV.',
		h1: 'WG-Putzplan Vorlage zum Ausdrucken und Anpassen',
		einleitung:
			'Hier steht eine fertige Rotation für drei, vier und fünf Personen, kostenlos und ohne Konto. Im Generator tragt ihr eure Namen ein und druckt den Plan als PDF oder ladet ihn als CSV herunter.',
		abschnitte: [
			[
				'Vorlage für vier Personen',
				'Bei vier Personen rotieren Bad, Küche, Böden sowie Müll und Flur. Jede Woche rückt jede Person eine Aufgabe weiter, nach vier Wochen hatte jede alles einmal. A bis D stehen für eure vier Namen.',
			],
			[
				'Putzplan-Generator: Namen eintragen, Plan drucken',
				'Tragt zwei bis sechs Namen ein, wählt die Aufgaben und die Zahl der Wochen, und der Plan steht da. Er lässt sich drucken, auch als PDF speichern, oder als CSV herunterladen. Nichts wird gespeichert, ihr braucht kein Konto. Der Generator rotiert der Reihe nach. Die App verteilt zusätzlich nach überfälligen Aufgaben und überspringt Abwesende.',
			],
			[
				'Vorlage für drei und fünf Personen',
				'Bei drei Personen rotieren drei Aufgaben. Jede Woche rückt jede Person eine Aufgabe weiter, nach drei Wochen hatte jede jede Aufgabe einmal. Bei fünf Personen kommen Wohnzimmer und Balkon als eigene Aufgabe hinzu, die Rotation dauert dann fünf Wochen.',
			],
			[
				'Aufgaben mit Rhythmus',
				'Die Wochenaufgaben stehen in der Rotation. Alles, was seltener anfällt, verteilt ihr extra. Streicht, was bei euch nicht vorkommt. Wie ihr eigene Aufgaben und Rhythmen aufbaut, steht in der Anleitung [Putzplan erstellen](/putzplan-erstellen).',
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
		tabellen: [
			{
				nach: 'Vorlage für vier Personen',
				titel: 'Vorlage: Vier-Wochen-Rotation für vier Personen',
				...PUTZPLAN_VORLAGE,
				hinweis: 'A, B, C und D stehen für vier Beispielpersonen.',
			},
			{
				nach: 'Vorlage für drei und fünf Personen',
				titel: 'Vorlage: Drei-Wochen-Rotation für drei Personen',
				...VORLAGE_DREI,
				hinweis: 'A, B und C stehen für drei Beispielpersonen.',
			},
			{
				nach: 'Vorlage für drei und fünf Personen',
				titel: 'Vorlage: Fünf-Wochen-Rotation für fünf Personen',
				...VORLAGE_FUENF,
				hinweis: 'A bis E stehen für fünf Beispielpersonen.',
			},
			{
				nach: 'Aufgaben mit Rhythmus',
				titel: 'Aufgaben mit Rhythmus',
				kopf: ['Aufgabe', 'Rhythmus', 'Was dazugehört'],
				zeilen: [
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
		fragen: [
			[
				'Gibt es eine kostenlose Putzplan-Vorlage für die WG?',
				'Ja. Diese Seite hat fertige Rotationen für drei, vier und fünf Personen und einen Generator, in den ihr eure Namen eintragt. Der Plan ist kostenlos, ihr braucht kein Konto, und nichts wird gespeichert. Wer nichts ausdrucken will, nutzt den Putzplan in ManaWG.',
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
		],
	},
	'wg-haushaltskasse': {
		link: 'WG-Haushaltskasse',
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'WG-Haushaltskasse: Bargeld, Konto oder App? | ManaWG',
		beschreibung:
			'Gemeinsame Haushaltskasse in der WG: Bargeldkasse, Gemeinschaftskonto oder App? Vor- und Nachteile, Beispielrechnung, Regeln und Abrechnung ohne Streit.',
		h1: 'Die WG-Haushaltskasse: drei Wege',
		einleitung:
			'Klopapier, Putzmittel, Spülmaschinentabs: Kleinkram summiert sich und sorgt für Reibung. Eine gemeinsame Kasse kann das lösen, wenn klar ist, wie sie geführt wird. Hier stehen die drei üblichen Wege mit ihren Vor- und Nachteilen, eine Beispielrechnung und die Regeln, die bei jedem Weg gelten sollten.',
		abschnitte: [
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
				'Ein Konto, auf das alle per Dauerauftrag einzahlen, bietet Transparenz, weil jede Buchung sichtbar ist. Es braucht aber jemanden, der es eröffnet, führt und dafür geradesteht, und bei vielen Banken fallen Gebühren an. Läuft das Konto auf den Namen einer Person, trägt diese das Risiko, wenn andere nicht zahlen. Bei häufigen Wechseln in der WG wird die Verwaltung der Zugänge zudem mühsam.',
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
		fragen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'Einzug in die WG: Checkliste für die ersten Wochen | ManaWG',
		beschreibung:
			'Checkliste für den Einzug in eine WG: Vertrag, Anmeldung, Schlüssel, Geld, Putzplan, Mitbewohner kennenlernen und die wichtigsten Dinge in der ersten Woche.',
		h1: 'Einzug in die WG: die Checkliste',
		einleitung:
			'Wer neu in eine WG zieht, muss nicht nur Kisten tragen, sondern auch Gewohnheiten kennenlernen. Die Punkte unten sind nach Zeitpunkt geordnet: vor dem Einzug, am Einzugstag, in der ersten Woche und im ersten Monat. Damit startet ihr ohne Missverständnisse.',
		abschnitte: [
			[
				'Vor dem Einzug: Vertrag und Formalien',
				'Klärt, ob ihr einen eigenen Mietvertrag mit dem Vermieter bekommt oder einen [Untermietvertrag](/wg-mietvertrag) mit einem Mitbewohner. Fragt nach Höhe und Rückzahlung der Kaution: Sie darf höchstens drei Nettokaltmieten betragen und kann in drei Monatsraten gezahlt werden. Fragt außerdem, ob die Miete warm oder kalt angegeben ist. Lasst euch zeigen, welche Räume, Schränke und Fächer im Kühlschrank euch gehören. Fragt nach den bestehenden [Regeln](/wg-regeln) für Ruhe, Besuch und Putzen und danach, wie die Kosten verteilt werden.',
			],
			[
				'Am Einzugstag',
				'Lasst euch die Schlüssel übergeben und notiert, wie viele es sind. Seht euch das Zimmer mit der Person an, die übergibt, und haltet Schäden mit Fotos fest. Das schützt euch beim Auszug. Fragt nach dem WLAN, nach Sicherungskasten, Haupthahn und dem Platz für Fahrräder. Für die Anmeldung beim Bürgeramt braucht ihr in Deutschland eine Wohnungsgeberbestätigung, die der Vermieter oder Hauptmieter ausstellt. Die Anmeldung ist innerhalb von zwei Wochen nach dem Einzug fällig.',
			],
			[
				'In der ersten Woche',
				'Lernt die Mitbewohner kennen, am besten bei einem gemeinsamen Abendessen. Lasst euch Mülltrennung, Abholtage und Waschmaschinenzeiten erklären. Tragt euch in den Putzplan ein und fragt, wie die Rotation funktioniert. Gibt es noch keinen, hilft die Anleitung [Putzplan erstellen](/putzplan-erstellen), und eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) spart den Anfang. Wenn die WG [ManaWG als WG-App](/wg-app) nutzt, tretet ihr per Einladungslink oder Code bei und seht Putzplan, Einkaufsliste, Kalender und Pinnwand sofort.',
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
		fragen: [
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
		quellen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'WG und Urlaub: Putzplan und Kosten bei Abwesenheit | ManaWG',
		beschreibung:
			'Was gilt in der WG, wenn jemand verreist? Putzplan, Miete, gemeinsame Kosten, Auslandssemester und Absprachen bei längerer Abwesenheit fair regeln.',
		h1: 'Urlaub und Abwesenheit in der WG',
		einleitung:
			'Wenn jemand wochenlang weg ist, fragen sich die anderen, wer die Aufgaben übernimmt und wer welche Kosten trägt. Ob Urlaub, Praktikum oder Auslandssemester: Mit klaren Regeln, die vorher feststehen, gibt es keinen Streit.',
		abschnitte: [
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
		fragen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-11',
		titel: 'Schulden unter Mitbewohnern ausgleichen | ManaWG',
		beschreibung:
			'Mitbewohner schuldet dir Geld? So behaltet ihr den Überblick, sprecht es an und gleicht Schulden in der WG mit wenigen Überweisungen aus. Mit Beispiel.',
		h1: 'Schulden unter Mitbewohnern ausgleichen',
		einleitung:
			'Kleine Beträge vergisst man leicht, und genau deshalb stauen sie sich auf. Nach ein paar Monaten weiß niemand mehr, wer wem was schuldet, und die Stimmung leidet. Mit einem Überblick und festen Zeitpunkten entsteht kein Groll.',
		abschnitte: [
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
		],
		fragen: [
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
		],
		quellen: [
			['§ 421 BGB, Gesamtschuldner', 'https://www.gesetze-im-internet.de/bgb/__421.html'],
			[
				'§ 426 BGB, Ausgleichungspflicht, Forderungsübergang',
				'https://www.gesetze-im-internet.de/bgb/__426.html',
			],
		],
	},
	'wg-casting-fragen': {
		link: 'WG-Casting',
		stand: '2026-10-27',
		erschienen: '2026-10-19',
		titel: 'WG-Casting Fragen: 48 Fragen für WG und Bewerber | ManaWG',
		beschreibung:
			'Fragen fürs WG-Casting, sortiert nach Alltag, Putzen, Geld und Besuch. Dazu Fragen der Bewerber an die WG, ein Bewertungsbogen und Mustertexte.',
		h1: 'WG-Casting Fragen: Was WG und Bewerber klären sollten',
		einleitung:
			'Beim WG-Casting entscheidet sich in zwanzig Minuten, ob ihr die nächsten Jahre gut zusammenlebt. Beide Seiten prüfen einander: die WG die neue Person, die Bewerberin oder der Bewerber die WG. Mit den richtigen Fragen erfahrt ihr, was wirklich zählt, und nicht nur, wer am sympathischsten wirkt. Kurz gesagt: Plant pro Termin 20 bis 30 Minuten, führt Einzeltermine und entscheidet erst danach, getrennt von den Bewerbern.',
		abschnitte: [
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
				'Rauchen, Haustiere, Instrumente',
				'Darf in der Wohnung geraucht werden, oder nur auf dem Balkon?\nWelche Haustiere hast du oder planst du, und wer kümmert sich im Urlaub?\nSpielst du ein Instrument, und wann übst du?\nStört dich Rauch oder Tiergeruch in den Gemeinschaftsräumen?\nDiese Punkte sorgen für den meisten Ärger, wenn sie vorher nicht besprochen sind. Der Mietvertrag kann Haustieren Grenzen setzen, klärt das vorher.',
			],
			[
				'Fragen von Bewerbern an die WG',
				'Warum wird das Zimmer frei?\nGibt es einen eigenen Mietvertrag oder einen Untermietvertrag, und wer ist Hauptmieter?\nWie hoch ist die Warmmiete, und was ist darin enthalten?\nWie hoch ist die Kaution?\nWelche Kündigungsfrist gilt?\nWer entscheidet über die Auswahl, und bis wann bekomme ich Bescheid?\nWie lange wollen die anderen noch in der WG wohnen?\nWie läuft der Putzplan?\nGibt es eine gemeinsame Kasse, und wie werden Ausgaben geteilt?\nWie viel unternimmt die WG gemeinsam?\nWas zu Vertragsarten und Kaution gehört, steht im Ratgeber [WG-Mietvertrag](/wg-mietvertrag).',
			],
			[
				'Fragen, die nicht ins Casting gehören',
				'Fragen nach Herkunft, Religion, Gesundheit, Schwangerschaft oder Kinderwunsch und sexueller Orientierung sind übergriffig und sagen nichts darüber, ob jemand in den Alltag der WG passt.\nWer so etwas freiwillig erzählt, darf das. Ihr fragt aber nicht danach und bewertet es nicht.\nFragt stattdessen nach dem, was im Alltag zählt: Ruhezeiten, Essgewohnheiten, Besuch und wie lange jemand bleiben möchte.\nHöflich absagen geht kurz und ehrlich: „Danke für das Gespräch. Wir haben uns für jemand anderen entschieden, weil der Alltag besser passt. Wir wünschen dir viel Erfolg bei der Suche.“',
			],
			[
				'Ablauf für die WG',
				'Ladet nicht zu viele Leute auf einmal ein. Wie ihr Bewerbungen sammelt und vorsortiert, steht unter [Mitbewohner finden](/mitbewohner-finden). Einzeltermine mit etwas Puffer funktionieren besser als ein Gruppencasting, bei dem die Lautesten gewinnen. Es sollten möglichst alle Mitbewohner dabei sein, denn wer nicht mitentscheidet, fühlt sich später übergangen. Zeigt die Wohnung ehrlich, auch das kleine Bad und die volle Küche. Und legt vorher fest, worauf es euch ankommt, damit die Entscheidung nicht nur am Bauchgefühl hängt.',
			],
			[
				'Video-Casting und Betrug',
				'Ist ein Treffen vor Ort nicht möglich, etwa bei einem Umzug aus dem Ausland, geht auch ein Video-Gespräch, bei dem die WG die Wohnung zeigt. Kein Geld vor Vertrag und Besichtigung: Wer Kaution oder Miete überweisen soll, bevor er die Wohnung gesehen und einen Vertrag in der Hand hat, sollte abbrechen. Mehr zur Suche und zu Warnzeichen steht unter [Mitbewohner finden](/mitbewohner-finden).',
			],
			[
				'Nach dem Casting entscheiden',
				'Setzt euch direkt nach dem letzten Termin zusammen, solange die Eindrücke frisch sind. Geht die Punkte durch, die ihr vorher festgelegt habt, und fragt euch ehrlich, mit wem ihr an einem verregneten Sonntag in der Küche sitzen wollt. Sagt der gewählten Person schnell zu und den anderen höflich ab. Wer nichts hört, wartet unnötig und sucht nicht weiter.',
			],
		],
		tabellen: [
			{
				nach: 'Die zehn wichtigsten Fragen',
				titel: 'Typische Fragen und was dahintersteckt',
				kopf: ['Frage', 'Was die WG wissen will', 'Eine ehrliche Antwort'],
				zeilen: [
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
				nach: 'Nach dem Casting entscheiden',
				titel: 'Bewertungsbogen',
				kopf: ['Kriterium', 'Person A', 'Person B', 'Person C'],
				zeilen: [
					['Rhythmus passt', '', '', ''],
					['Ordnung ähnlich', '', '', ''],
					['Geldvorstellung', '', '', ''],
					['Erwartung an die WG', '', '', ''],
					['Bauchgefühl', '', '', ''],
				],
				hinweis:
					'Skala von 1 (passt gar nicht) bis 5 (passt sehr gut). Jede Person füllt den Bogen direkt nach dem Termin für sich aus, danach vergleicht ihr.',
			},
		],
		fragen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-19',
		titel: 'WG-Anzeige aufgeben und Mitbewohner finden | ManaWG',
		beschreibung:
			'So gebt ihr eine WG-Anzeige auf: wo inserieren, Anzeigentitel mit Beispielen, die wichtigsten Angaben und ein Mustertext zum Anpassen.',
		h1: 'Mitbewohner finden: WG-Anzeige schreiben und aufgeben',
		einleitung:
			'Ein Zimmer wird frei, und in wenigen Wochen soll jemand Neues einziehen. Damit es passt, kommt es auf eine ehrliche Anzeige, eine gute Auswahl und klare Absprachen vor dem Einzug an. Hier steht der Ablauf von der Anzeige bis zum ersten gemeinsamen Monat.',
		abschnitte: [
			[
				'Vorher klären: Vermieter und Vertrag',
				'Bevor ihr sucht, klärt, wer den Mietvertrag mit dem Vermieter hat. Ist die WG über Untermiete organisiert, braucht ihr für eine neue Person in der Regel die Erlaubnis des Vermieters. Haben alle einen eigenen Vertrag, regelt der Vermieter den Wechsel oft selbst. Legt außerdem fest, ab wann das Zimmer frei ist, was es warm kostet und ob Möbel übernommen werden sollen.',
			],
			[
				'Wo ihr die Anzeige aufgebt',
				'WG-Gesucht: das gängige Portal für WG-Zimmer, besonders in Hochschulstädten\nImmoScout24: hat eine eigene Rubrik für WG-Zimmer\nAushang an der Hochschule und beim Studierendenwerk\nGruppen der Hochschule und Kleinanzeigen\nFür Berufstätige: Aushang beim Arbeitgeber und das eigene Umfeld',
			],
			[
				'Was in eine gute WG-Anzeige gehört',
				'Die Fakten zuerst: Größe des Zimmers, Warmmiete mit allen Nebenkosten, Einzugsdatum, Befristung, Lage und Verkehrsanbindung. Dann die WG selbst: Wie viele Personen, welches Alter, was macht ihr, wie viel Gemeinsames gibt es? Gute Fotos von Zimmer, Küche und Bad bei Tageslicht. Und ein ehrlicher Satz dazu, wie ihr Haushalt und Geld organisiert, etwa mit Putzplan und gemeinsamer Abrechnung in einer App. Das filtert Bewerber, die etwas ganz anderes suchen.',
			],
			[
				'Der Anzeigentitel: Formel und Beispiele',
				'Der Titel entscheidet, ob jemand die Anzeige öffnet. Nennt in dieser Reihenfolge Zimmergröße, Lage, Warmmiete und Einzugsdatum. Drei Beispiele: „16 m² in Dreier-WG, Leipzig-Connewitz, 420 Euro warm, ab 1.12.“, „12 m² Zimmer nahe der Uni, Göttingen, 340 Euro warm, ab sofort“, „20 m² mit Balkon, Köln-Ehrenfeld, 560 Euro warm, ab 1.3., befristet bis August“. Lasst Floskeln wie „tolle Lage“ weg, die Zahlen überzeugen mehr.',
			],
			[
				'Beispiel für eine WG-Anzeige',
				'„Ab 1. Dezember wird in unserer Dreier-WG in Leipzig-Connewitz ein 16-Quadratmeter-Zimmer frei, 420 Euro warm inklusive Internet. Wir sind Mia (26, Pflege) und Jonas (24, Informatik) und suchen jemanden zwischen 21 und 30. Unter der Woche kocht jeder für sich, sonntags essen wir oft zusammen. Geputzt wird nach Plan im Wochenwechsel, gemeinsame Ausgaben rechnen wir in einer App ab. Schreib uns kurz, was du machst und wie du dir WG-Leben vorstellst.“ Solche Angaben sind konkret genug, dass sich die Richtigen melden und die anderen gar nicht erst schreiben.',
			],
			[
				'Auswählen ohne Chaos',
				'Bei beliebten Zimmern kommen schnell dutzende Nachrichten. Legt fest, wer antwortet, und sammelt die Bewerbungen an einer Stelle. Ladet nur die Personen zum Casting ein, deren Nachricht zur WG passt. Nach den Terminen entscheidet ihr gemeinsam, möglichst zeitnah, denn gute Bewerber haben oft mehrere Zusagen. Sagt allen Eingeladenen ab, die es nicht geworden sind. Passende Fragen fürs Gespräch stehen im [Ratgeber zum WG-Casting](/wg-casting-fragen).',
			],
			[
				'Vor dem Einzug',
				'Schickt der neuen Person die wichtigsten [Regeln](/wg-regeln) schriftlich: Putzplan, Kostenverteilung, Ruhezeiten, Müll. Klärt die Schlüsselübergabe und die Wohnungsgeberbestätigung für die Anmeldung. Wenn eure WG [ManaWG als WG-App](/wg-app) nutzt, schickt ihr einen Einladungslink oder Code. Nach dem Beitritt sieht die neue Person Putzplan, Einkaufsliste, Kalender und Pinnwand sofort, neue Ausgaben werden ab dann mit ihr geteilt.',
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
		fragen: [
			[
				'Wo finde ich einen neuen Mitbewohner?',
				'Auf WG-Portalen wie WG-Gesucht, in Gruppen der Hochschule, über Aushänge beim Studierendenwerk, Kleinanzeigen und das eigene Umfeld.',
			],
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
		],
		quellen: [
			['WG-Gesucht, Portal für WG-Zimmer', 'https://www.wg-gesucht.de/'],
			['ImmoScout24, WG-Zimmer', 'https://www.immobilienscout24.de/wohnen/wg-zimmer.html'],
		],
	},
	'wg-auszug-checkliste': {
		link: 'WG-Auszug',
		stand: '2026-10-27',
		erschienen: '2026-10-19',
		titel: 'WG-Auszug: Checkliste für Kündigung und Kaution | ManaWG',
		beschreibung:
			'Checkliste für den Auszug aus der WG: Kündigung, Nachmieter, Kaution, offene Kosten, Rundfunkbeitrag, Ummeldung und Übergabe ohne Streit.',
		h1: 'Auszug aus der WG: die Checkliste',
		einleitung:
			'Beim Auszug aus einer WG hängt mehr dran als Kisten packen: Kündigung, ein Nachfolger fürs Zimmer, Kaution, offene Beträge und Verträge, die auf euren Namen laufen. Wer die Punkte früh angeht, geht ohne offene Rechnungen und ohne Streit.',
		abschnitte: [
			[
				'Kündigung und Fristen',
				'Prüft zuerst euren [Vertrag](/wg-mietvertrag). Bei einem unbefristeten Mietvertrag gilt für Mieter meist eine Kündigungsfrist von drei Monaten. Bei einem möblierten Zimmer in der Wohnung des Hauptmieters können kürzere Fristen gelten. Kündigt schriftlich und sagt der WG möglichst früh Bescheid, auch wenn ihr formal noch Zeit habt. Die anderen brauchen Wochen, um jemanden zu finden.',
			],
			[
				'Nachmieter finden',
				'Oft sucht die WG gemeinsam mit euch einen Nachfolger. Ob die neue Person euren Vertrag übernimmt oder einen eigenen bekommt, entscheidet der Vermieter beziehungsweise der Hauptmieter. Einen allgemeinen Anspruch darauf, durch einen Nachmieter früher aus dem Vertrag zu kommen, gibt es nicht, viele Vermieter lassen sich aber darauf ein. Helft bei [Anzeige und Casting](/mitbewohner-finden), ihr kennt das Zimmer am besten.',
			],
			[
				'Geld: offene Beträge und Kaution',
				'Gleicht alle offenen Beträge vor dem Auszug aus, solange alle noch erreichbar sind. In der [WG-Kasse von ManaWG](/wg-kasse) seht ihr euren Saldo und die vorgeschlagenen Überweisungen. Wenn der Saldo auf null steht, ist alles erledigt. Klärt außerdem, was mit gemeinsamen Anschaffungen passiert: Bleibt der Staubsauger in der WG, und zahlen die anderen euren Anteil? Die Kaution bekommt ihr vom Vermieter oder Hauptmieter zurück. Die Prüfung kann einige Monate dauern, vor allem wenn noch eine [Nebenkostenabrechnung](/wg-nebenkosten) aussteht.',
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
		fragen: [
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
		quellen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-19',
		titel: 'Streit in der WG lösen: Putzen, Lärm, Geld | ManaWG',
		beschreibung:
			'Streit in der WG um Putzen, Lärm oder Geld? So sprecht ihr Konflikte an, findet Regeln, die halten, und verhindert, dass kleine Ärgernisse eskalieren.',
		h1: 'Streit in der WG lösen',
		einleitung:
			'In fast jeder WG gibt es irgendwann Streit, meist um dieselben drei Dinge: Putzen, Lärm und Geld. Selten liegt es an bösem Willen. Meist fehlen klare Absprachen, oder kleine Ärgernisse wurden zu lange nicht angesprochen. Mit ein paar Gewohnheiten lassen sich die meisten Konflikte lösen, bevor sie die Stimmung kippen.',
		abschnitte: [
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
				'Putzstreit entsteht meist, weil unklar ist, wer wann dran ist, oder weil die Aufgaben ungleich verteilt sind. Ein Putzplan mit fester Rotation nimmt die Diskussion heraus: Es ist sichtbar, wer dran ist und was erledigt wurde. Wie er entsteht, zeigt [Putzplan erstellen](/putzplan-erstellen), und eine [Putzplan-Vorlage zum Ausdrucken](/putzplan-vorlage) hilft beim Start. In der [WG-App ManaWG](/wg-app) wandern Aufgaben automatisch weiter, wer verreist ist, wird übersprungen. Wenn eine Person trotzdem dauerhaft nicht putzt, gehört das in die WG-Runde, nicht in passive Zettel am Kühlschrank.',
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
				'Ein regelmäßiges kurzes Treffen, etwa einmal im Monat, gibt allen einen festen Ort für Themen. Jede Person darf etwas einbringen, Entscheidungen werden festgehalten. Wenn es trotz Gesprächen nicht besser wird, ist es kein Scheitern zu überlegen, ob die Konstellation passt. Manchmal ist ein [Auszug](/wg-auszug-checkliste) die fairste Lösung für alle. Wer wem kündigen darf, hängt am Vertrag, siehe [Mitbewohner kündigen](/mitbewohner-kuendigen).',
			],
		],
		fragen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-20',
		titel: 'Mitbewohner kündigen: Fristen je nach Vertrag | ManaWG',
		beschreibung:
			'Kann man einen Mitbewohner kündigen? Antwort je nach Vertrag: Untermiete, gemeinsamer Hauptmietvertrag oder Einzelverträge. Mit Fristen und Kündigungsmuster.',
		h1: 'Mitbewohner kündigen: was je nach Vertrag geht',
		einleitung:
			'Wenn das Zusammenleben nicht mehr funktioniert, kommt schnell die Frage, ob man einen Mitbewohner einfach rauswerfen kann. Die Antwort hängt fast nur davon ab, wer mit wem einen Vertrag hat. Wer selbst Vermieter des Mitbewohners ist, kann kündigen, alle anderen nicht. Diese Seite gibt einen Überblick nach dem Bürgerlichen Gesetzbuch und ersetzt keine Rechtsberatung. Bei einem konkreten Fall helfen Mietervereine oder eine Anwältin für Mietrecht.',
		abschnitte: [
			[
				'Erst klären: Wer hat welchen Vertrag?',
				'In einer WG gibt es drei übliche Modelle: alle stehen gemeinsam im Hauptmietvertrag, eine Person ist Hauptmieter und vermietet Zimmer unter, oder jede Person hat einen eigenen Vertrag mit dem Vermieter. Nur im zweiten Fall ist ein Mitbewohner Vermieter eines anderen und kann ihm kündigen. Wie sich die Modelle sonst unterscheiden, steht im Ratgeber zum [WG-Mietvertrag](/wg-mietvertrag).',
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
				'Mitbewohner ohne Mietvertrag',
				'Ein Zimmer, das gegen Miete überlassen wird, ist auch ohne Papier ein Mietvertrag. Der Vermieter schuldet die Überlassung, der Mieter die vereinbarte Miete (§ 535 BGB). Das Gesetz verlangt die Schriftform nur für Verträge über mehr als ein Jahr, und auch dann ist der Vertrag ohne sie nicht unwirksam, sondern gilt als unbefristet (§ 550 BGB). Gekündigt werden kann dann aber frühestens zum Ablauf eines Jahres nach Überlassung des Wohnraums. Danach gelten für die Kündigung die Regeln oben.',
			],
			[
				'Bevor es so weit kommt',
				'Die meisten Konflikte lassen sich lösen, bevor jemand an Kündigung denkt. Sprecht Probleme früh an und haltet Absprachen fest, damit nicht jedes Thema neu verhandelt wird. Wie das gelingt, steht im Ratgeber [Streit in der WG lösen](/wg-streit-loesen). Geht es um Geld, hilft eine gemeinsame Übersicht, siehe [Schulden unter Mitbewohnern](/schulden-mitbewohner). Steht der Auszug fest, klärt Kaution und offene Beträge mit der [Auszugs-Checkliste](/wg-auszug-checkliste).',
			],
		],
		tabellen: [
			{
				nach: 'einleitung',
				titel: 'Mitbewohner kündigen: Auf einen Blick',
				kopf: ['Vertrag', 'Wer darf kündigen', 'Frist', 'Grund nötig?'],
				zeilen: [
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
		],
		fragen: [
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
		],
		quellen: [
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
		],
	},
	'wg-anmeldung': {
		link: 'Anmeldung in der WG',
		stand: '2026-10-27',
		erschienen: '2026-10-20',
		titel: 'Anmeldung in der WG: Frist, Bestätigung, Muster | ManaWG',
		beschreibung:
			'WG-Zimmer anmelden: zwei Wochen Frist, wer die Wohnungsgeberbestätigung ausstellt, was drinstehen muss (mit Beispiel) und was hilft, wenn sie verweigert wird.',
		h1: 'Anmeldung in der WG: Wohnungsgeberbestätigung und Frist',
		einleitung:
			'Wer in ein WG-Zimmer zieht, muss sich beim Bürgeramt anmelden, und dafür braucht es eine Wohnungsgeberbestätigung. Wer sie ausstellt, hängt vom Mietvertrag ab, und gerade bei Untermiete wissen viele Hauptmieter nicht, dass sie zuständig sind. Diese Seite fasst die Regeln des Bundesmeldegesetzes zusammen und ersetzt keine Rechtsberatung. Einzelheiten wie Formulare und Termine regelt eure Stadt.',
		abschnitte: [
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
		tabellen: [
			{
				nach: 'Muster: Was in der Bestätigung steht',
				titel: 'Beispiel einer Wohnungsgeberbestätigung',
				kopf: ['Feld', 'Beispiel'],
				zeilen: [
					[
						'Name und Anschrift des Wohnungsgebers',
						'Erika Beispiel, Musterweg 1, 12345 Musterstadt',
					],
					['Name des Eigentümers, falls abweichend', 'Max Muster'],
					['Einzugsdatum', '01.11.2026'],
					['Anschrift der Wohnung', 'Musterweg 1, 2. Obergeschoss links, 12345 Musterstadt'],
					['Namen der meldepflichtigen Personen', 'Jonas Probe'],
				],
				hinweis:
					'Ausgedachte Angaben zur Veranschaulichung. Maßgeblich ist das Formular eurer Stadt.',
			},
		],
		fragen: [
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
				'Zwei Wochen ab dem Einzug. Ist kein Termin frei, bucht den nächsten möglichen und hebt die Bestätigung auf.',
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
		quellen: [
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
		stand: '2026-10-27',
		erschienen: '2026-10-21',
		titel: 'Von Splitwise oder Splid wechseln: CSV-Import | ManaWG',
		beschreibung:
			'Splitwise- oder Splid-Ausgaben in die WG-Kasse übernehmen: CSV-Datei hochladen, Vorschau prüfen, Namen zuordnen, Import bei Bedarf rückgängig machen.',
		h1: 'Von Splitwise oder Splid zu ManaWG wechseln',
		einleitung:
			'Wenn die WG ihre Ausgaben bisher in Splitwise oder Splid geführt hat, muss beim Wechsel nichts von vorn beginnen. Liegen die Ausgaben als CSV-Datei vor, übernimmt ManaWG sie in die WG-Kasse. Ihr seht vorher eine Vorschau und könnt den Import danach rückgängig machen. Diese Anleitung zeigt den Ablauf und nennt die Grenzen.',
		abschnitte: [
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
				'Ab jetzt läuft alles in der [WG-Kasse](/wg-kasse): Ausgaben teilen, Salden sehen, Ausgleiche mit wenigen Überweisungen vorschlagen lassen, Fixkosten und Monatsabrechnung. Offene Salden aus dem alten System gleicht ihr am besten aus, bevor ihr wechselt, oder ihr übernehmt sie per Import. Wie ihr Schulden fair ausgleicht, steht unter [Schulden unter Mitbewohnern](/schulden-mitbewohner). Einen Vergleich der Apps findet ihr unter [Splitwise-Alternative](/splitwise-alternative), [Splid-Alternative](/splid-alternative) und [Tricount-Alternative](/tricount-alternative), alle Kriterien unter [beste WG-App](/beste-wg-app).',
			],
		],
		fragen: [
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
