// Ratgeberseiten für Suchanfragen rund um das WG-Leben. Allgemeine Tipps, kein Rechtsrat.
// ManaWG-Funktionen nur nennen, wenn es sie in manawg-app wirklich gibt (siehe themen.ts).
import type { Thema } from './themen';

/** Einzige Quelle der Vier-Wochen-Rotation: HTML-Tabelle, CSV und Markdown lesen hier. */
export const PUTZPLAN_VORLAGE = {
	aufgaben: ['Bad', 'Küche', 'Böden', 'Müll und Flur'],
	/** Vier Wochen, je Woche eine Person pro Aufgabe (zyklisch rotiert, A wandert Bad->Küche->Böden->Müll/Flur). */
	wochen: [
		['A', 'B', 'C', 'D'],
		['D', 'A', 'B', 'C'],
		['C', 'D', 'A', 'B'],
		['B', 'C', 'D', 'A'],
	],
} as const;

const csvFeld = (wert: string): string =>
	/[;"\r\n]/.test(wert) ? `"${wert.replace(/"/g, '""')}"` : wert;

/** Dieselben Vorlagendaten als CSV (Semikolon, CRLF, BOM vorn). Statisch, keine Nutzereingaben. */
export function putzplanVorlageCsv(): string {
	const zeilen = [
		['Woche', ...PUTZPLAN_VORLAGE.aufgaben],
		...PUTZPLAN_VORLAGE.wochen.map((woche, i) => [`Woche ${i + 1}`, ...woche]),
	];
	return `\uFEFF${zeilen.map((zeile) => zeile.map(csvFeld).join(';')).join('\r\n')}\r\n`;
}

const mdZelle = (wert: string): string => wert.replace(/\|/g, '\\|');

/** Dieselben Vorlagendaten als Markdown-Tabelle (gleiche Werte wie HTML und CSV). */
export function putzplanVorlageMarkdown(): string {
	const kopf = ['Woche', ...PUTZPLAN_VORLAGE.aufgaben].map(mdZelle);
	const zeilen = PUTZPLAN_VORLAGE.wochen.map((woche, i) =>
		[`Woche ${i + 1}`, ...woche].map(mdZelle),
	);
	const trenner = kopf.map(() => '---');
	return [kopf, trenner, ...zeilen].map((zeile) => `| ${zeile.join(' | ')} |`).join('\n');
}

export const RATGEBER: Record<string, Thema> = {
	'wg-kosten-aufteilen': {
		link: 'WG-Kosten aufteilen',
		stand: '2026-10-11',
		erschienen: '2026-10-11',
		titel: 'WG-Kosten fair aufteilen: Miete, Nebenkosten, Internet | ManaWG',
		beschreibung:
			'So teilt ihr in der WG Miete, Nebenkosten, Strom, Internet und Einkäufe fair auf: drei Modelle mit Beispielrechnung und Tipps gegen Streit ums Geld.',
		h1: 'WG-Kosten fair aufteilen',
		einleitung:
			'Geld ist der häufigste Streitpunkt in Wohngemeinschaften, und selten geht es um große Summen. Meist fehlt eine Regel, auf die sich alle geeinigt haben. Hier steht, welche Kosten es gibt, welche Aufteilung sich bewährt hat und wie ihr den Überblick behaltet.',
		abschnitte: [
			[
				'Welche Kosten in einer WG anfallen',
				'Es gibt drei Gruppen. Erstens die festen Kosten, die jeden Monat gleich sind: Miete, Nebenkosten-Vorauszahlung, Internet, Strom. Zweitens die gemeinsamen laufenden Ausgaben wie Spülmittel, Klopapier, Putzmittel und gemeinsame Lebensmittel. Drittens Einmaliges, etwa ein neuer Staubsauger oder die Küchenausstattung. Wer die drei Gruppen trennt, streitet seltener, weil für jede eine eigene Regel gelten kann.',
			],
			[
				'Modell 1: Alles gleich teilen',
				'Jede Person zahlt denselben Anteil. Das ist einfach und passt bei Zimmern ähnlicher Größe. Beispiel: Internet kostet 36 Euro im Monat, vier Personen zahlen je 9 Euro. Bei Beträgen, die sich nicht glatt teilen lassen, bleibt ein Cent-Rest. Den sollte nicht immer dieselbe Person tragen, sondern er sollte von Buchung zu Buchung weiterwandern.',
			],
			[
				'Modell 2: Miete nach Zimmergröße, Rest gleich',
				'Bei sehr unterschiedlichen Zimmern ist ein gleicher Mietanteil selten fair. Üblich ist, die Kaltmiete nach Quadratmetern zu verteilen und Gemeinschaftskosten wie Internet und Strom gleich zu teilen. Beispiel: Ein Zimmer mit 20 m² in einer Wohnung mit 80 m² Gesamtfläche trägt 25 Prozent der Miete. Gemeinschaftsflächen wie Küche und Bad rechnet ihr dabei nach Köpfen oder anteilig zu den Zimmern dazu. Wichtig ist, dass alle die Rechnung gesehen und zugestimmt haben.',
			],
			[
				'Modell 3: Jeder zahlt, was er verursacht',
				'Für Einkäufe und Einzelnes passt es oft besser, nur die Beteiligten zahlen zu lassen. Wer Bier für den eigenen Geburtstag kauft, teilt diese Ausgabe nicht mit der ganzen WG. In ManaWG legt ihr bei jeder Ausgabe fest, wer beteiligt ist, und teilt gleichmäßig oder mit eigenen Beträgen pro Person. Die Anteile ergeben immer genau den Betrag.',
			],
			[
				'Ausgleichen ohne Überweisungschaos',
				'Wenn jeder mal für alle zahlt, entstehen Schulden in alle Richtungen. Sinnvoll ist, nicht jede Ausgabe einzeln zu begleichen, sondern am Monatsende den Saldo zu betrachten. Aus den Salden lässt sich ableiten, wer wem etwas überweisen sollte, und zwar mit möglichst wenigen Überweisungen. ManaWG berechnet diese Vorschläge automatisch, überweist aber selbst nichts: Ihr markiert Ausgleiche als bezahlt.',
			],
			[
				'Regeln, die Streit vermeiden',
				'Schreibt auf, was gemeinsam bezahlt wird und was nicht. Legt einen festen Tag fest, an dem ihr ausgleicht. Erfasst Ausgaben sofort, solange der Beleg noch da ist. Und bestimmt, ab welchem Betrag vorher gefragt wird, etwa bei Anschaffungen über 50 Euro. Fixkosten wie Miete und Internet legt ihr in ManaWG einmal an, sie werden dann automatisch jeden Monat gebucht.',
			],
		],
		fragen: [
			[
				'Wie teilt man die Miete in einer WG fair auf?',
				'Am verbreitetsten ist die Aufteilung der Kaltmiete nach Zimmergröße, mit gleichen Anteilen für Gemeinschaftskosten wie Internet und Strom. Bei gleich großen Zimmern ist auch ein gleicher Anteil für alle fair.',
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
		stand: '2026-10-19',
		erschienen: '2026-10-11',
		titel: 'WG-Putzplan erstellen: Wochenplan, Regeln, Beispiele | ManaWG',
		beschreibung:
			'Putzplan selbst erstellen: Aufgaben, Zeitaufwand, Wochenplan, faire Rotation und Umgang mit Abwesenheit. Mit Beispiel für vier Personen.',
		h1: 'Putzplan für die WG erstellen',
		einleitung:
			'Ein Putzplan scheitert selten an der Faulheit, sondern an unklaren Aufgaben und an Plänen, die niemand pflegt. Hier steht, wie ihr Aufgaben zuschneidet, fair verteilt und dafür sorgt, dass der Plan im Alltag funktioniert.',
		abschnitte: [
			[
				'Schritt 1: Aufgaben auflisten',
				'Schreibt alles auf, was regelmäßig anfällt, und trennt nach Häufigkeit. Wöchentlich sind meist Bad, Küche, Boden saugen und wischen sowie Müll. Alle zwei Wochen Kühlschrank und Flur. Monatlich Backofen, Fenster und Vorräte prüfen. Je konkreter die Aufgabe, desto weniger Diskussion: „Bad putzen“ ist besser als „Hygiene“. Legt fest, was dazugehört, etwa Waschbecken, Dusche, WC und Boden.',
			],
			[
				'Schritt 2: Rhythmus und Verteilung festlegen',
				'Zwei Wege funktionieren. Entweder hat jede Person ein festes Gebiet, das ist einfach, wird aber ungerecht, wenn eine Aufgabe unbeliebt ist. Oder die Aufgaben rotieren, sodass jede Person jede Aufgabe im Wechsel übernimmt. Rotation ist fairer, braucht aber jemanden, der den Überblick hält. Genau das kann eine App übernehmen: In ManaWG wiederholt ihr Aufgaben in Tagen oder Monaten, und die App bestimmt anhand überfälliger Aufgaben, wer als Nächstes dran ist.',
			],
			[
				'Schritt 3: Abwesenheit und Ausnahmen regeln',
				'Pläne brechen, wenn jemand im Urlaub ist oder am Semesterende nicht da. Legt vorab fest, dass Abwesende übersprungen werden und danach nicht doppelt nachholen müssen. In ManaWG tragt ihr eine Abwesenheit ein, die Person wird in dieser Zeit beim Putzplan übersprungen. Für Gäste und Besuch gilt: Wer sie einlädt, sorgt dafür, dass die Gemeinschaftsräume sauber bleiben.',
			],
			[
				'Schritt 4: Erinnern statt kontrollieren',
				'Niemand will der Aufpasser sein. Sinnvoller sind automatische Erinnerungen an fällige Aufgaben. In ManaWG kommen sie als Push-Meldung an die zugewiesene Person, erledigte Aufgaben haken alle sichtbar ab. So gibt es keine Nachfragen im Gruppenchat, und niemand muss Verantwortung einfordern.',
			],
			[
				'Beispielverteilung für vier Personen',
				'Vier Aufgaben, vier Personen, jede Woche eine Position weiter: Bad, Küche, Boden und Müll/Flur. Nach vier Wochen hat jede Person jede Aufgabe einmal gemacht. Alle zwei Wochen kommen Kühlschrank und Backofen dazu, monatlich die Fenster. Wichtig: Der Plan muss für alle sichtbar sein, am besten dort, wo ohnehin jeder täglich hinschaut.',
			],
			[
				'Aufgaben nach Aufwand gewichten',
				'Fair heißt nicht, dass alle gleich viele Aufgaben haben, sondern ungefähr gleich viel Zeit putzen. Grobe Richtwerte für eine typische WG-Wohnung: Bad gründlich 30 bis 45 Minuten, Küche 20 bis 30 Minuten, Böden saugen und wischen 30 bis 40 Minuten, Müll und Pfand 10 Minuten. Wer den Müll übernimmt, kann deshalb zusätzlich den Flur oder den Kühlschrank bekommen. Schätzt die Zeiten für eure Wohnung einmal gemeinsam, dann gibt es später weniger Streit über ungleiche Lasten.',
			],
			[
				'Ein Wochen-Putzplan als Beispiel',
				'Montag: Müll, Altpapier und Pfand rausbringen\nDienstag: Küche (Herd, Arbeitsflächen, Spüle, Boden)\nMittwoch: Bad (Waschbecken, Dusche, WC, Spiegel, Boden)\nDonnerstag: Böden in Flur und Wohnzimmer saugen\nFreitag: Kühlschrank durchsehen, Abgelaufenes entsorgen\nWochenende: Böden wischen, Handtücher und Lappen waschen',
			],
		],
		fragen: [
			[
				'Wie oft sollte man in der WG putzen?',
				'Bad und Küche wöchentlich, Böden wöchentlich oder alle zwei Wochen, Müll nach Bedarf. Seltener anfallende Aufgaben wie Backofen und Fenster monatlich oder quartalsweise.',
			],
			[
				'Was tun, wenn sich jemand nicht an den Putzplan hält?',
				'Zuerst sachlich ansprechen, was konkret nicht gemacht wurde, nicht die Person bewerten. Hilft das nicht, sprecht in der WG-Runde über Regeln und Folgen, zum Beispiel, dass nicht erledigte Aufgaben nachgeholt werden.',
			],
			[
				'Wie erstelle ich einen Wochen-Putzplan?',
				'Aufgaben auflisten, nach Häufigkeit sortieren und auf Wochentage verteilen. Danach festlegen, wer welche Aufgabe übernimmt und wie oft gewechselt wird, meist wöchentlich.',
			],
			[
				'Gibt es eine Putzplan-App für die WG?',
				'Ja, ManaWG enthält einen Putzplan mit Rhythmus, fairer Rotation, Abwesenheiten und Erinnerungen. Die App ist kostenlos und läuft im Browser.',
			],
		],
	},
	'wg-gruenden-checkliste': {
		link: 'WG gründen',
		stand: '2026-10-19',
		erschienen: '2026-10-11',
		titel: 'WG gründen: Checkliste von Mietvertrag bis Putzplan | ManaWG',
		beschreibung:
			'WG gründen Schritt für Schritt: Mietvertrag, Kaution, Anmeldung, Strom und Internet, Kosten aufteilen und Regeln festlegen. Mit Checkliste zum Abhaken.',
		h1: 'WG gründen: die Checkliste',
		einleitung:
			'Eine neue WG fängt oft mit Begeisterung an und endet mit Streit über Dinge, die niemand besprochen hat. Diese Checkliste führt durch die Fragen, die vor und kurz nach dem Einzug geklärt sein sollten: vom Mietvertrag über Anmeldung und Verträge bis zu Geld, Putzplan und Regeln. Sie ersetzt keine Rechtsberatung, besonders nicht bei Mietverträgen.',
		abschnitte: [
			[
				'1. Passende Mitbewohner finden',
				'Entscheidend ist weniger, ob ihr beste Freunde seid, als ob ihr ähnliche Vorstellungen vom Zusammenleben habt. Sprecht über Ruhezeiten, Besuch, Sauberkeit, Rauchen, Haustiere und darüber, ob ihr eine Zweck-WG oder gemeinsame Abende sucht. Klärt auch, wie lange jede Person ungefähr bleiben will: Eine WG, in der alle zwei Jahre planen, funktioniert anders als eine mit Zwischenmietern.',
			],
			[
				'2. Die richtige Vertragsform wählen',
				'In einer WG gibt es drei übliche Konstellationen. Beim gemeinsamen Hauptmietvertrag unterschreiben alle und haften gemeinsam für die ganze Miete; ausziehen kann eine Person nur mit Zustimmung von Vermieter und Mitbewohnern. Beim Untermietvertrag mietet eine Person die Wohnung und vermietet Zimmer weiter; sie trägt das Risiko, braucht dafür die Erlaubnis des Vermieters und hat mehr Einfluss bei Nachmietern. Bei Einzelmietverträgen hat jede Person einen eigenen Vertrag über ihr Zimmer mit dem Vermieter. Welche Form passt, hängt davon ab, wie fest die WG ist. Im Zweifel hilft ein Mieterverein.',
			],
			[
				'3. Kaution und Übergabe festhalten',
				'Die Kaution darf höchstens drei Nettokaltmieten betragen und kann in drei Monatsraten gezahlt werden. Haltet fest, wer welchen Anteil eingezahlt hat, damit bei einem Auszug klar ist, wem was zusteht. Bei der Wohnungsübergabe gehört jedes Zimmer ins Übergabeprotokoll, am besten mit Fotos von Schäden und den Zählerständen für Strom, Gas und Wasser.',
			],
			[
				'4. Anmelden und Verträge abschließen',
				'Nach dem Einzug muss sich jede Person innerhalb von zwei Wochen beim Bürgeramt anmelden. Dafür braucht es eine Wohnungsgeberbestätigung, die der Vermieter ausstellt, bei Untermiete der Hauptmieter. Strom und Internet laufen meist auf eine Person, die Kosten teilt ihr. Der Rundfunkbeitrag fällt einmal pro Wohnung an, nicht pro Person: Eine Person meldet sich an, die anderen geben deren Beitragsnummer an. Jede Person sollte eine eigene Haftpflichtversicherung haben und prüfen, ob ihre Hausratversicherung eine WG abdeckt.',
			],
			[
				'5. Geld verbindlich regeln',
				'Legt fest, wie die Miete aufgeteilt wird (gleich oder nach Zimmergröße), wer welche Verträge führt und was ihr gemeinsam kauft. Wer zahlt, sollte das Geld zuverlässig zurückbekommen, ohne jedes Mal nachfragen zu müssen. Mit ManaWG legt ihr Miete, Strom und Internet einmal als Fixkosten an und erfasst gemeinsame Einkäufe laufend. Die App zeigt Salden und Ausgleichsvorschläge, ihr überweist selbst.',
			],
			[
				'6. Erstausstattung absprechen',
				'Klärt, was gemeinsam angeschafft wird (Waschmaschine, Staubsauger, Küchengeräte, Putzmittel) und wem es gehört, wenn jemand auszieht. Bei teuren Dingen hilft eine einfache Notiz, wer wie viel bezahlt hat. Viele WGs kaufen Grundausstattung gemeinsam und den Rest bringt jede Person selbst mit.',
			],
			[
				'7. Haushalt und Putzplan organisieren',
				'Einigt euch auf einen Putzplan mit konkreten Aufgaben und festen Zyklen, etwa Bad wöchentlich, Küche wöchentlich, Flur alle zwei Wochen, Müll nach Bedarf. Eine gemeinsame Einkaufsliste für Dinge, die alle brauchen, verhindert, dass drei Leute Spülmittel kaufen und niemand Klopapier. Beides lässt sich in ManaWG teilen, ohne dass jemand die Liste per Hand pflegen muss.',
			],
			[
				'8. Regeln festhalten',
				'Haltet die wichtigsten Absprachen schriftlich fest, etwa Ruhezeiten, Umgang mit Besuch und Übernachtungsgästen, Gemeinschaftsräume und Vorgehen bei Streit. Es geht nicht um Paragrafen, sondern darum, dass später niemand sagen kann, davon habe er nichts gewusst. Die Pinnwand in ManaWG eignet sich dafür, weil Beschlüsse dort sichtbar bleiben und nicht im Chat untergehen.',
			],
			[
				'9. Einen Termin für die WG-Runde festlegen',
				'Einmal im Monat eine halbe Stunde reicht: Geld ausgleichen, Termine besprechen, Dinge ansprechen, die stören. Wer regelmäßig redet, muss selten eskalieren.',
			],
			[
				'Die Checkliste zum Abhaken',
				'1. Mitbewohner gefunden und Erwartungen besprochen\n2. Vertragsform gewählt und Mietvertrag unterschrieben\n3. Kaution gezahlt, Anteile notiert\n4. Übergabeprotokoll mit Fotos und Zählerständen\n5. Alle innerhalb von zwei Wochen angemeldet\n6. Strom, Internet und Rundfunkbeitrag auf eine Person, Kosten geteilt\n7. Haftpflicht- und Hausratversicherung geprüft\n8. Mietaufteilung und Fixkosten festgelegt\n9. Erstausstattung abgesprochen\n10. Putzplan, Einkaufsliste und Regeln eingerichtet',
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
				'Muss jeder in der WG Rundfunkbeitrag zahlen?',
				'Nein. Der Rundfunkbeitrag fällt einmal pro Wohnung an. Eine Person zahlt, die anderen melden sich mit deren Beitragsnummer ab, und die WG teilt den Betrag.',
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
	},
	'wg-regeln': {
		link: 'WG-Regeln',
		stand: '2026-10-19',
		erschienen: '2026-10-11',
		titel: 'WG-Regeln: Vorlage und Beispiele zum Übernehmen | ManaWG',
		beschreibung:
			'WG-Regeln als Vorlage: zehn Regeln zum Übernehmen für Ruhezeiten, Besuch, Putzen, Kühlschrank und gemeinsame Kasse, dazu Tipps, wie ihr sie festhaltet.',
		h1: 'WG-Regeln, die wirklich funktionieren',
		einleitung:
			'Viele WGs haben entweder gar keine Regeln oder einen langen Katalog, an den sich niemand hält. Gute Regeln sind kurz, konkret und von allen beschlossen. Unten steht eine Vorlage mit zehn Regeln, die ihr übernehmen und anpassen könnt, danach die Bereiche im Einzelnen.',
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
				'Haltet fest, wer wann welche Aufgabe übernimmt, und was „sauber“ bedeutet. Ein Putzplan mit Rotation und Erinnerungen ersetzt Diskussionen. Geschirr gehört nicht über Nacht in die Spüle, Gemeinschaftsräume bleiben nutzbar: solche Mini-Regeln verhindern die meisten Konflikte.',
			],
			[
				'Gemeinsame Kasse und Einkauf',
				'Definiert, was gemeinsam bezahlt wird (Putzmittel, Klopapier, Gewürze) und was nicht. Legt fest, wie ausgeglichen wird. Mit einer gemeinsamen Einkaufsliste weiß jeder, was fehlt, und doppelte Einkäufe entfallen.',
			],
			[
				'Bad, Küche und Gemeinschaftsräume',
				'Morgens wird das Bad schnell knapp. Wer früh raus muss, bekommt ein festes Zeitfenster, alle anderen duschen davor oder danach. In der Küche gilt: Wer kocht, räumt danach auf, und die Arbeitsfläche ist frei für die nächste Person. Im Wohnzimmer bleibt nichts Privates dauerhaft liegen, sonst wird der Raum zum Abstellraum.',
			],
			[
				'Rauchen, Haustiere und Instrumente',
				'Diese drei Punkte sorgen für den meisten Ärger, wenn sie vorher nicht besprochen sind. Klärt, ob in der Wohnung oder nur auf dem Balkon geraucht wird, ob Haustiere erlaubt sind (der Mietvertrag kann hier Grenzen setzen) und zu welchen Zeiten geübt werden darf. Am besten fragt ihr das schon beim WG-Casting.',
			],
			[
				'Regeln für neue Mitbewohner',
				'Wer neu einzieht, kennt die gewachsenen Absprachen nicht. Zeigt die Regeln vor dem Einzug, nicht erst beim ersten Streit, und fragt, ob etwas davon nicht passt. Nach einem Monat lohnt eine kurze Runde: Was ist ungewohnt, was soll sich ändern? So fühlen sich neue Leute als Teil der WG und nicht als Gast mit Pflichten.',
			],
			[
				'Wie ihr Regeln festhaltet',
				'Schreibt sie an einen Ort, den alle sehen. In ManaWG eignet sich die Pinnwand: Beschlüsse und Ankündigungen bleiben dort stehen, statt im Chatverlauf zu verschwinden. Ein Beschluss gilt, wenn alle zugestimmt haben, und lässt sich in der monatlichen WG-Runde anpassen.',
			],
			[
				'Konflikte ansprechen',
				'Sprecht Probleme früh und sachlich an: konkretes Verhalten, konkrete Auswirkung, konkreter Wunsch. „Du lässt oft Geschirr stehen, das stört mich, kannst du es abends spülen?“ funktioniert besser als „Du bist unordentlich“.',
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
		stand: '2026-10-19',
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
				'Die Nebenkosten bezahlt ihr in der Regel als monatliche Vorauszahlung, im Folgejahr kommt die Abrechnung des Vermieters. Sie kann zu einer Nachzahlung oder einem Guthaben führen. Verteilt diese so wie die Vorauszahlung, und zwar unter denjenigen, die im Abrechnungszeitraum in der WG gewohnt haben. Zieht jemand zwischendurch aus oder ein, rechnet ihr anteilig nach Monaten.',
			],
			[
				'Beispiel: Nachzahlung bei Wechsel in der WG',
				'Die Abrechnung für das Vorjahr ergibt 360 Euro Nachzahlung. A und B haben das ganze Jahr in der WG gewohnt, C ist nach acht Monaten ausgezogen, D für die letzten vier Monate eingezogen. Zusammen sind das 12 + 12 + 8 + 4 = 36 Personenmonate, also 10 Euro pro Monat: A und B zahlen je 120 Euro, C 80 Euro und D 40 Euro. Ein Guthaben verteilt ihr genauso.',
			],
			[
				'Nach Köpfen oder nach Zimmergröße?',
				'Nach Köpfen ist am einfachsten und üblich, wenn die Zimmer ähnlich groß sind. Unterscheiden sie sich deutlich, teilt ihr nach Fläche. Beispiel: Zimmer mit 20, 16 und 14 Quadratmetern ergeben Anteile von 40, 32 und 28 Prozent. Bei 300 Euro Nebenkosten zahlen die drei 120, 96 und 84 Euro. Viele WGs mischen auch: Heizung nach Fläche, alles andere nach Köpfen.',
			],
			[
				'Strom und Gas',
				'Läuft der Vertrag auf eine Person, zahlt diese zunächst für alle. Gleichmäßige Aufteilung ist üblich, weil sich der Verbrauch einzelner Personen kaum messen lässt. Wer außergewöhnlich viel verbraucht, etwa durch einen Heimserver oder ein Elektrogerät, kann einen Aufschlag vereinbaren. Legt die monatliche Abschlagszahlung als Fixkosten an, damit nichts vergessen wird.',
			],
			[
				'Internet und Streaming',
				'Internet teilt ihr gleichmäßig. Bei Streaming-Abos klärt, wer sie nutzt: Wenn nur zwei von vier Personen schauen, zahlen auch nur diese. In ManaWG wählt ihr bei jeder Ausgabe aus, wer beteiligt ist, und legt wiederkehrende Kosten als Fixkosten an.',
			],
			[
				'Rundfunkbeitrag',
				'Der Rundfunkbeitrag wird pro Wohnung erhoben, nicht pro Person. In einer WG zahlt ihn daher nur eine Person, und die Kosten werden unter allen aufgeteilt. Beachtet, dass sich Regelungen ändern können, und prüft die aktuelle Lage beim Beitragsservice.',
			],
			[
				'Monatsabrechnung als Überblick',
				'Eine Monatsübersicht zeigt, was insgesamt ausgegeben wurde und wer wem etwas schuldet. ManaWG erstellt sie automatisch: Gesamtsumme, Ausgaben je Kategorie und Überweisungsvorschläge. Am Monatsanfang kommt sie per Mail, das kann jede Person abschalten.',
			],
			[
				'Bei Auszug an die Abrechnung denken',
				'Die Nebenkostenabrechnung kommt oft erst Monate nach einem Auszug. Vereinbart deshalb beim Auszug, wie die ausziehende Person ihren Anteil an einer späteren Nachzahlung trägt oder ein Guthaben bekommt, und tauscht Kontaktdaten aus. Manche WGs behalten dafür einen kleinen Betrag ein, bis die Abrechnung da ist.',
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
	},
	'wg-einkauf-organisieren': {
		link: 'WG-Einkauf organisieren',
		stand: '2026-10-19',
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
				'Grundnahrungsmittel wie Öl, Nudeln, Reis, Gewürze und Getränke gehören allen, der Rest ist privat. Dafür braucht ihr eine Liste, in die jeder einträgt, was fehlt. In ManaWG gibt es eine gemeinsame Einkaufsliste: Wer einkauft, hakt ab und kann den Einkauf danach direkt als Ausgabe erfassen.',
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
				'Kassenzettel in der Küche gehen verloren. Besser: Beträge sofort in die App eintragen. Beim Import lässt sich ein Foto oder Bildschirmfoto einer Ausgabenliste per Texterkennung einlesen und vor dem Speichern korrigieren. Am Monatsende zeigt der Saldo, wer wem wie viel schuldet.',
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
		stand: '2026-10-14',
		erschienen: '2026-10-11',
		titel: 'Die beste WG-App finden: 7 Kriterien im Vergleich | ManaWG',
		beschreibung:
			'Welche WG-App passt zu euch? Sieben Kriterien von Kosten über Putzplan bis Datenschutz, dazu Vergleiche mit Splitwise, Splid und Flatastic.',
		h1: 'Die beste WG-App: 7 Kriterien für die Auswahl',
		einleitung:
			'Es gibt viele Apps für Wohngemeinschaften, und keine ist für jede WG die beste. Manche rechnen nur Geld, andere organisieren nur den Haushalt. Diese Seite ist kein unabhängiges Ranking, sondern die Sicht des Anbieters ManaWG. Mit diesen sieben Kriterien findet ihr die App, die zu eurem Alltag passt, bevor ihr alle Mitbewohner zum Umstieg bewegt.',
		quellen: [
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
			['Splid auf Deutsch', 'https://splid.app/german'],
			['Flatastic', 'https://www.flatastic-app.com/'],
			['Flatastic Premium', 'https://www.flatastic-app.com/en/premium'],
			['Was ist ManaWG?', 'https://manawg.com/ueber-manawg'],
		],
		abschnitte: [
			[
				'1. Was kostet die App wirklich?',
				'Prüft, ob Funktionen erst im Abo freigeschaltet werden, ob Werbung erscheint und ob es Grenzen bei der Zahl der Einträge gibt. Tarife ändern sich, schaut deshalb bei jedem Anbieter selbst nach. ManaWG ist kostenlos, ohne Werbung und ohne Bezahlstufe.',
			],
			[
				'2. Deckt sie Geld und Haushalt ab?',
				'Reine Ausgaben-Apps lösen das Geldproblem, Haushalts-Apps organisieren Aufgaben. Wollt ihr alles an einem Ort, braucht ihr eine App mit Kasse, Putzplan und Einkaufsliste, zum Beispiel ManaWG.',
			],
			[
				'3. Wie gut ist die Kasse?',
				'Gute Kassen teilen ungleich, kennen Fixkosten, zeigen Salden und schlagen Ausgleiche mit wenigen Überweisungen vor. Achtet auch darauf, wie Cent-Reste behandelt werden und ob ihr vorhandene Daten als Datei importieren könnt.',
			],
			[
				'4. Wie fair ist der Putzplan?',
				'Entscheidend sind faire Rotation, Wiederholung in Tagen oder Monaten, Umgang mit Abwesenheit und Erinnerungen. Ein Punktesystem motiviert manche WGs, andere empfinden es als Gängelung. ManaWG rotiert nach überfälligen Aufgaben und kommt ohne Punkte aus.',
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
				'Wer Daten aus Splitwise oder Splid bereits als CSV-Datei hat, sollte sie mitnehmen können. ManaWG importiert Ausgaben aus solchen CSV-Dateien und zeigt vorher eine Vorschau. Ausführliche Vergleiche findet ihr unter Splitwise-Alternative, Splid-Alternative, Flatastic-Alternative und OurHome-Alternative.',
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
		],
	},
	'ueber-manawg': {
		link: 'Über ManaWG',
		stand: '2026-10-16',
		erschienen: '2026-10-11',
		titel: 'Was ist ManaWG? Die kostenlose WG-App im Überblick',
		beschreibung:
			'ManaWG ist eine kostenlose deutschsprachige WG-App für Ausgaben, Einkauf, Putzplan, Kalender, Pinnwand und Chat. Fakten, Funktionen und Abgrenzung zu WireGuard.',
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
				'ManaWG (auch Mana WG) ist eine Haushalts-App für Wohngemeinschaften. Mitbewohner teilen Ausgaben und gleichen Salden mit möglichst wenigen Überweisungen aus, führen eine gemeinsame Einkaufsliste, organisieren einen rotierenden Putzplan und halten Absprachen an einer Pinnwand fest. Die App ist kostenlos, werbefrei und läuft im Browser unter app.manawg.com.',
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
		stand: '2026-10-19',
		erschienen: '2026-10-11',
		titel: 'Putzplan Vorlage für die WG: Beispiel zum Übernehmen | ManaWG',
		beschreibung:
			'Putzplan-Vorlage für 4 Personen als CSV-Download: Aufgaben, Rhythmus und Vier-Wochen-Rotation zum Übernehmen, mit Hinweisen für 3 und 5 Personen.',
		h1: 'Putzplan-Vorlage für die WG',
		einleitung:
			'Eine Vorlage spart die Diskussion am Anfang. Hier steht eine Aufgabenliste mit Rhythmus, die ihr direkt übernehmen und an eure Wohnung anpassen könnt, und wie ihr sie ohne Ausdrucken pflegt.',
		abschnitte: [
			[
				'Die Aufgabenliste',
				'Wöchentlich: Bad (Waschbecken, Dusche, WC, Boden), Küche (Herd, Arbeitsflächen, Spüle, Boden), Flur und Wohnzimmer saugen oder wischen, Müll und Pfand wegbringen. Alle zwei Wochen: Kühlschrank aufräumen, Spiegel und Oberflächen. Monatlich: Backofen, Fenster oder Balkon, Vorräte prüfen. Passt die Liste an eure Wohnung an und streicht, was bei euch nicht anfällt.',
			],
			[
				'Vorlage für drei Personen',
				'Drei Wochenaufgaben im Wechsel: Bad, Küche, Boden und Müll zusammen. Jede Woche rückt jede Person eine Aufgabe weiter, nach drei Wochen hatte jeder alles einmal. Monatsaufgaben verteilt ihr reihum, jede Person nimmt einen Monat.',
			],
			[
				'Vorlage für vier und fünf Personen',
				'Bei vier Personen rotieren Bad, Küche, Böden sowie Müll und Flur (siehe Vorlage unten): Jede Woche rückt jede Person eine Aufgabe weiter, nach vier Wochen hatte jede alles einmal. Bei fünf kommt Wohnzimmer oder Balkon als eigene Aufgabe hinzu. Wer verreist, wird übersprungen und holt nichts doppelt nach.',
			],
			[
				'Die Vier-Wochen-Rotation',
				'Woche 1: Person A Bad, B Küche, C Böden, D Müll und Flur\nWoche 2: Person A Küche, B Böden, C Müll und Flur, D Bad\nWoche 3: Person A Böden, B Müll und Flur, C Bad, D Küche\nWoche 4: Person A Müll und Flur, B Bad, C Küche, D Böden',
			],
			[
				'Warum der Zettel scheitert',
				'Ausgedruckte Pläne rotieren nicht von selbst, werden nicht aktualisiert und erinnern niemanden. Nach ein paar Wochen weiß keiner mehr, wer dran ist. Eine App löst das: In ManaWG legt ihr Aufgaben mit Rhythmus an, die App zeigt, wer als Nächstes dran ist, überspringt Abwesende und erinnert per Push an fällige Aufgaben.',
			],
			[
				'Digital starten in zwei Minuten',
				'WG in ManaWG erstellen, Einladungslink an die Mitbewohner schicken (sie melden sich mit Google oder E-Mail an und treten per Link bei), die Aufgaben aus der Liste oben als Putzplan anlegen. Fertig, ohne App Store und kostenlos.',
			],
		],
		fragen: [
			[
				'Gibt es eine kostenlose Putzplan-Vorlage für die WG?',
				'Ja, die Aufgabenliste und die Verteilung auf dieser Seite lassen sich direkt übernehmen. Wer nichts ausdrucken will, nutzt den Putzplan in ManaWG.',
			],
			[
				'Wie oft wechseln die Aufgaben?',
				'Üblich ist ein wöchentlicher Wechsel. So macht jede Person jede Aufgabe regelmäßig und niemand bleibt dauerhaft beim unbeliebten Bad.',
			],
			[
				'Wie erstelle ich einen Putzplan selber?',
				'Nehmt die Aufgabenliste oben, streicht, was bei euch nicht anfällt, und tragt die Namen in die Vier-Wochen-Rotation ein. Bei drei oder fünf Personen passt ihr die Zahl der Wochenaufgaben an die Zahl der Personen an.',
			],
		],
	},
	'wg-haushaltskasse': {
		link: 'WG-Haushaltskasse',
		stand: '2026-10-19',
		erschienen: '2026-10-11',
		titel: 'WG-Haushaltskasse: gemeinsame Kasse führen und abrechnen | ManaWG',
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
				'Statt Geld vorzuhalten, zahlt jeder, was gerade fehlt, und trägt den Betrag ein. Am Monatsende zeigen die Salden, wer wem etwas schuldet. Es gibt keinen Bestand, den jemand verwalten muss, und niemand streckt dauerhaft Geld vor. In ManaWG teilt ihr gleichmäßig oder mit eigenen Beträgen pro Person, ordnet jede Ausgabe einer Kategorie zu und seht, wofür das Geld geht. Die App schlägt Ausgleiche mit möglichst wenigen Überweisungen vor. Ihr überweist selbst und markiert als bezahlt.',
			],
			[
				'Beispielrechnung',
				'Eine WG mit drei Personen kauft im Monat gemeinsam für 90 Euro ein. Anna zahlt Putzmittel für 30 Euro, Ben den Großeinkauf für 51 Euro, Cem Müllbeutel für 9 Euro. Jeder Anteil liegt bei 30 Euro. Anna ist ausgeglichen, Ben hat 21 Euro zu viel gezahlt, Cem 21 Euro zu wenig. Eine einzige Überweisung von Cem an Ben gleicht alles aus. Bei Bargeldkasse oder Konto wären stattdessen drei Einzahlungen und drei Auszahlungen nötig gewesen.',
			],
			[
				'Regeln für jede Kasse',
				'Legt fest, was hineingehört und was nicht. Setzt eine Grenze, ab der vorher gefragt wird, etwa 30 oder 50 Euro. Bestimmt einen festen Tag für den Ausgleich, zum Beispiel den Monatsersten. Und klärt, was beim Auszug passiert: Offene Beträge werden vor dem Auszug beglichen, gemeinsame Anschaffungen bleiben in der WG oder werden abgelöst. In ManaWG kommt am Monatsanfang eine Abrechnung per Mail mit Summen je Kategorie und den Überweisungsvorschlägen, jede Person kann sie abschalten.',
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
		stand: '2026-10-19',
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
				'Klärt, ob ihr einen eigenen Mietvertrag mit dem Vermieter bekommt oder einen Untermietvertrag mit einem Mitbewohner. Fragt nach Höhe und Rückzahlung der Kaution und danach, ob die Miete warm oder kalt angegeben ist. Lasst euch zeigen, welche Räume, Schränke und Fächer im Kühlschrank euch gehören. Fragt nach den bestehenden Regeln für Ruhe, Besuch und Putzen und danach, wie die Kosten verteilt werden.',
			],
			[
				'Am Einzugstag',
				'Lasst euch die Schlüssel übergeben und notiert, wie viele es sind. Seht euch das Zimmer mit der Person an, die übergibt, und haltet Schäden mit Fotos fest. Das schützt euch beim Auszug. Fragt nach dem WLAN, nach Sicherungskasten, Haupthahn und dem Platz für Fahrräder. Für die Anmeldung beim Bürgeramt braucht ihr in Deutschland eine Wohnungsgeberbestätigung, die der Vermieter oder Hauptmieter ausstellt. Die Anmeldung ist innerhalb von zwei Wochen nach dem Einzug fällig.',
			],
			[
				'In der ersten Woche',
				'Lernt die Mitbewohner kennen, am besten bei einem gemeinsamen Abendessen. Lasst euch Mülltrennung, Abholtage und Waschmaschinenzeiten erklären. Tragt euch in den Putzplan ein und fragt, wie die Rotation funktioniert. Wenn die WG ManaWG nutzt, tretet ihr per Einladungslink oder Code bei und seht Putzplan, Einkaufsliste, Kalender und Pinnwand sofort.',
			],
			[
				'Geld von Anfang an klären',
				'Fragt, wer Strom, Internet und Rundfunkbeitrag führt und wie ihr euren Anteil zahlt. Der Rundfunkbeitrag wird pro Wohnung nur einmal fällig, also nicht von jedem einzeln. Klärt, ob es eine gemeinsame Haushaltskasse gibt und ob bereits vorhandene Dinge wie Waschmaschine oder Küchengeräte abgelöst werden sollen. In ManaWG seht ihr nach dem Beitritt Fixkosten, Ausgaben und Salden der WG, neue Ausgaben werden ab dann mit euch geteilt.',
			],
			[
				'Gewohnheiten abgleichen',
				'Sprecht früh an, was euch wichtig ist: Schlafenszeiten, Gäste über Nacht, Rauchen, Tiere, Lautstärke, gemeinsames Kochen. Kleine Unterschiede lassen sich besprechen, solange sie früh auf dem Tisch liegen. Wer nach drei Monaten zum ersten Mal sagt, dass ihn etwas stört, hat es schwerer. Was die WG vereinbart, könnt ihr auf der Pinnwand festhalten, damit es nicht nur im Gruppenchat untergeht.',
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
	},
	'wg-abwesenheit-urlaub': {
		link: 'WG im Urlaub',
		stand: '2026-10-19',
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
				'Wer nicht da ist, kann nicht putzen. Üblich ist, dass Abwesende übersprungen werden und danach nicht alles nachholen müssen. Manche WGs vereinbaren, dass vor einer längeren Reise die eigene Aufgabe noch erledigt wird, damit niemand ein ungeputztes Bad übernimmt. In ManaWG tragt ihr eine Abwesenheit mit Zeitraum ein. Die Person wird in dieser Zeit beim Putzplan übersprungen, und die Aufgabe geht an die Nächste in der Reihe.',
			],
			[
				'Miete und Fixkosten',
				'Die Miete läuft weiter, auch wenn das Zimmer leer steht. Bei Fixkosten wie Internet zahlen in der Regel alle weiter, weil der Vertrag unabhängig von der Nutzung kostet. Bei verbrauchsabhängigen Kosten wie Strom, Heizung oder gemeinsamen Lebensmitteln kann man vereinbaren, dass Abwesende weniger zahlen. Das lohnt sich vor allem bei längeren Zeiträumen. Für zwei Wochen Urlaub ist eine Sonderregel meist mehr Aufwand als Ersparnis.',
			],
			[
				'Gemeinsame Ausgaben während der Abwesenheit',
				'Wer nicht da ist, isst nicht mit. Einkäufe in dieser Zeit sollten nur auf die Anwesenden verteilt werden. In ManaWG wählt ihr bei jeder Ausgabe, wer beteiligt ist, und lasst die abwesende Person einfach weg. So entsteht kein Saldo für Dinge, die sie nie genutzt hat.',
			],
			[
				'Längere Abwesenheit: Praktikum und Auslandssemester',
				'Bei mehreren Monaten stellt sich die Frage nach einer Zwischenmiete. Ob das erlaubt ist, hängt vom Mietvertrag ab, meist muss der Vermieter zustimmen. Klärt in der WG, ob alle mit der Person einverstanden sind, denn sie lebt in dieser Zeit mit euch. Die Zwischenmieterin oder der Zwischenmieter kann der WG in ManaWG beitreten und übernimmt für die Zeit Aufgaben und Kosten. Danach tritt sie wieder aus.',
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
		stand: '2026-10-19',
		erschienen: '2026-10-11',
		titel: 'Schulden unter Mitbewohnern: ausgleichen ohne Streit | ManaWG',
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
				'Tragt jede Ausgabe direkt ein, solange der Beleg da ist. In ManaWG seht ihr jederzeit den Saldo pro Person. Die Anteile ergeben immer genau den Betrag. Bei gleichmäßiger Teilung wandert ein übrig bleibender Cent von Buchung zu Buchung weiter, damit nicht immer dieselbe Person ihn trägt.',
			],
			[
				'Ausgleichen mit wenigen Überweisungen',
				'Wenn mehrere Personen einander Geld schulden, lassen sich die Salden verrechnen. Statt dass jeder jedem einzeln etwas überweist, reichen meist wenige Zahlungen. ManaWG schlägt Überweisungen vor, die mit möglichst wenigen Zahlungen alles ausgleichen. Überwiesen wird außerhalb der App, ihr markiert nur als bezahlt.',
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
				'Wenn jemand nicht zahlt',
				'Sprecht es sachlich und unter vier Augen an, nennt den Betrag und einen Termin. Hilft das nicht, bringt es in die WG-Runde, ohne die Person bloßzustellen. Klärt, ob eine Ratenzahlung hilft, wenn das Geld gerade knapp ist. Rechtliche Schritte sind bei kleinen Beträgen selten sinnvoll und belasten das Zusammenleben mehr als der offene Betrag.',
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
		],
	},
	'wg-casting-fragen': {
		link: 'WG-Casting',
		stand: '2026-10-19',
		erschienen: '2026-10-19',
		titel: 'WG-Casting: Fragen, Ablauf und Tipps für beide Seiten | ManaWG',
		beschreibung:
			'Gute Fragen fürs WG-Casting: Alltag, Geld, Putzen, Gäste. Wie die WG das Casting plant und wie Bewerber sich vorbereiten, mit Fragenliste zum Übernehmen.',
		h1: 'WG-Casting: die richtigen Fragen',
		einleitung:
			'Beim WG-Casting entscheidet sich in zwanzig Minuten, ob ihr die nächsten Jahre gut zusammenlebt. Beide Seiten prüfen einander: die WG die neue Person, die Bewerberin oder der Bewerber die WG. Mit den richtigen Fragen erfahrt ihr, was wirklich zählt, und nicht nur, wer am sympathischsten wirkt.',
		abschnitte: [
			[
				'Ablauf für die WG',
				'Ladet nicht zu viele Leute auf einmal ein. Einzeltermine von 20 bis 30 Minuten mit etwas Puffer funktionieren besser als ein Gruppencasting, bei dem die Lautesten gewinnen. Es sollten möglichst alle Mitbewohner dabei sein, denn wer nicht mitentscheidet, fühlt sich später übergangen. Zeigt die Wohnung ehrlich, auch das kleine Bad und die volle Küche. Und legt vorher fest, worauf es euch ankommt, damit die Entscheidung nicht nur am Bauchgefühl hängt.',
			],
			[
				'Fragen zum Alltag',
				'Wie sieht ein normaler Tag bei dir aus, wann stehst du auf, wann gehst du schlafen? Kochst du gern, und isst du lieber allein oder mit anderen? Wie oft bist du am Wochenende zu Hause? Arbeitest oder lernst du viel von zu Hause aus? Diese Fragen zeigen, ob sich Rhythmen ergänzen oder ständig kollidieren, etwa wenn zwei Personen gleichzeitig ins Bad müssen.',
			],
			[
				'Fragen zu Ordnung und Putzen',
				'Was bedeutet für dich sauber? Wie oft sollte das Bad geputzt werden? Hast du schon mit einem Putzplan gelebt, und wie lief das? Was stört dich in einer Küche am meisten? Ehrliche Antworten sind hier wichtiger als die erwartete. Wer zugibt, eher unordentlich zu sein, aber feste Aufgaben zuverlässig erledigt, passt oft besser als jemand, der Perfektion verspricht.',
			],
			[
				'Fragen zu Geld und Gemeinsamem',
				'Wie stellst du dir das mit gemeinsamen Einkäufen vor, alles teilen oder jeder für sich? Wie sollen Kosten wie Internet und Putzmittel aufgeteilt werden? Erzählt dabei offen, wie eure WG es bisher macht, zum Beispiel mit einer App wie ManaWG, in der jede Ausgabe eingetragen und am Monatsende ausgeglichen wird. Wer schon beim Casting weiß, wie abgerechnet wird, hat später keine Überraschungen.',
			],
			[
				'Fragen zu Gästen, Lautstärke und Erwartungen',
				'Wie oft hast du Besuch, und übernachtet der auch mal länger? Feierst du gern zu Hause? Rauchst du, hast du Haustiere oder planst welche? Suchst du eher eine Zweck-WG oder Anschluss und gemeinsame Abende? Gerade die letzte Frage wird oft vergessen, dabei ist sie einer der häufigsten Gründe, warum es später nicht passt.',
			],
			[
				'Tipps für Bewerberinnen und Bewerber',
				'Stellt selbst Fragen, das zeigt Interesse und schützt euch vor einer falschen Wahl. Fragt, warum das Zimmer frei wird, wie Kosten verteilt werden, ob es einen Putzplan gibt und wie oft die WG gemeinsam etwas unternimmt. Fragt nach der Warmmiete und den Nebenkosten und danach, ob es einen eigenen Mietvertrag oder einen Untermietvertrag gibt. Und seid ehrlich: Eine WG, in die ihr nur mit einer geschönten Version von euch passt, wird auf Dauer anstrengend.',
			],
		],
		fragen: [
			[
				'Welche Fragen stellt man beim WG-Casting?',
				'Fragen zum Tagesrhythmus, zu Ordnung und Putzen, zum Umgang mit Geld und Einkäufen, zu Gästen und Lautstärke und dazu, ob jemand eine Zweck-WG oder gemeinsame Abende sucht.',
			],
			[
				'Wie lange dauert ein WG-Casting?',
				'Üblich sind 20 bis 30 Minuten pro Person. Das reicht für eine Wohnungsführung und ein Gespräch, ohne dass es für beide Seiten zu anstrengend wird.',
			],
			[
				'Was sollte ich als Bewerber beim WG-Casting fragen?',
				'Warum das Zimmer frei wird, wie Miete und Nebenkosten aufgeteilt werden, ob es einen eigenen Mietvertrag gibt, wie der Putzplan funktioniert und wie viel die WG gemeinsam unternimmt.',
			],
		],
	},
	'mitbewohner-finden': {
		link: 'Mitbewohner finden',
		stand: '2026-10-19',
		erschienen: '2026-10-19',
		titel: 'Mitbewohner finden: WG-Anzeige schreiben und auswählen | ManaWG',
		beschreibung:
			'So findet ihr einen neuen Mitbewohner: Wo ihr die WG-Anzeige schaltet, was hineingehört, wie ihr auswählt und was vor dem Einzug geklärt sein sollte.',
		h1: 'Neuen Mitbewohner finden',
		einleitung:
			'Ein Zimmer wird frei, und in wenigen Wochen soll jemand Neues einziehen. Damit es passt, kommt es auf eine ehrliche Anzeige, eine gute Auswahl und klare Absprachen vor dem Einzug an. Hier steht der Ablauf von der Anzeige bis zum ersten gemeinsamen Monat.',
		abschnitte: [
			[
				'Vorher klären: Vermieter und Vertrag',
				'Bevor ihr sucht, klärt, wer den Mietvertrag mit dem Vermieter hat. Ist die WG über Untermiete organisiert, braucht ihr für eine neue Person in der Regel die Erlaubnis des Vermieters. Haben alle einen eigenen Vertrag, regelt der Vermieter den Wechsel oft selbst. Legt außerdem fest, ab wann das Zimmer frei ist, was es warm kostet und ob Möbel übernommen werden sollen.',
			],
			[
				'Wo ihr die Anzeige schaltet',
				'Für Studenten-WGs sind WG-Portale wie WG-Gesucht der übliche Weg, dazu kommen Gruppen der Hochschule, Aushänge beim Studierendenwerk und Kleinanzeigen. Für Berufstätige lohnen sich zusätzlich Aushänge beim Arbeitgeber und das eigene Umfeld. Wer persönlich empfohlen wird, passt nicht automatisch besser, aber ihr wisst schneller, woran ihr seid.',
			],
			[
				'Was in eine gute WG-Anzeige gehört',
				'Die Fakten zuerst: Größe des Zimmers, Warmmiete mit allen Nebenkosten, Einzugsdatum, Befristung, Lage und Verkehrsanbindung. Dann die WG selbst: Wie viele Personen, welches Alter, was macht ihr, wie viel Gemeinsames gibt es? Gute Fotos von Zimmer, Küche und Bad bei Tageslicht. Und ein ehrlicher Satz dazu, wie ihr Haushalt und Geld organisiert, etwa mit Putzplan und gemeinsamer Abrechnung in einer App. Das filtert Bewerber, die etwas ganz anderes suchen.',
			],
			[
				'Auswählen ohne Chaos',
				'Bei beliebten Zimmern kommen schnell dutzende Nachrichten. Legt fest, wer antwortet, und sammelt die Bewerbungen an einer Stelle. Ladet nur die Personen zum Casting ein, deren Nachricht zur WG passt. Nach den Terminen entscheidet ihr gemeinsam, möglichst zeitnah, denn gute Bewerber haben oft mehrere Zusagen. Sagt allen Eingeladenen ab, die es nicht geworden sind. Passende Fragen fürs Gespräch stehen im Ratgeber zum WG-Casting.',
			],
			[
				'Vor dem Einzug',
				'Schickt der neuen Person die wichtigsten Regeln schriftlich: Putzplan, Kostenverteilung, Ruhezeiten, Müll. Klärt die Schlüsselübergabe und die Wohnungsgeberbestätigung für die Anmeldung. Wenn eure WG ManaWG nutzt, schickt ihr einen Einladungslink oder Code. Nach dem Beitritt sieht die neue Person Putzplan, Einkaufsliste, Kalender und Pinnwand sofort, neue Ausgaben werden ab dann mit ihr geteilt.',
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
		],
	},
	'wg-auszug-checkliste': {
		link: 'WG-Auszug',
		stand: '2026-10-19',
		erschienen: '2026-10-19',
		titel: 'WG-Auszug: Checkliste für Kündigung und Abrechnung | ManaWG',
		beschreibung:
			'Checkliste für den Auszug aus der WG: Kündigung, Nachmieter, Kaution, offene Kosten, Rundfunkbeitrag, Ummeldung und Übergabe ohne Streit.',
		h1: 'Auszug aus der WG: die Checkliste',
		einleitung:
			'Beim Auszug aus einer WG hängt mehr dran als Kisten packen: Kündigung, ein Nachfolger fürs Zimmer, Kaution, offene Beträge und Verträge, die auf euren Namen laufen. Wer die Punkte früh angeht, geht ohne offene Rechnungen und ohne Streit.',
		abschnitte: [
			[
				'Kündigung und Fristen',
				'Prüft zuerst euren Vertrag. Bei einem unbefristeten Mietvertrag gilt für Mieter meist eine Kündigungsfrist von drei Monaten. Bei einem möblierten Zimmer in der Wohnung des Hauptmieters können kürzere Fristen gelten. Kündigt schriftlich und sagt der WG möglichst früh Bescheid, auch wenn ihr formal noch Zeit habt. Die anderen brauchen Wochen, um jemanden zu finden.',
			],
			[
				'Nachmieter finden',
				'Oft sucht die WG gemeinsam mit euch einen Nachfolger. Ob die neue Person euren Vertrag übernimmt oder einen eigenen bekommt, entscheidet der Vermieter beziehungsweise der Hauptmieter. Einen allgemeinen Anspruch darauf, durch einen Nachmieter früher aus dem Vertrag zu kommen, gibt es nicht, viele Vermieter lassen sich aber darauf ein. Helft bei Anzeige und Casting, ihr kennt das Zimmer am besten.',
			],
			[
				'Geld: offene Beträge und Kaution',
				'Gleicht alle offenen Beträge vor dem Auszug aus, solange alle noch erreichbar sind. In ManaWG seht ihr euren Saldo und die vorgeschlagenen Überweisungen. Wenn der Saldo auf null steht, ist alles erledigt. Klärt außerdem, was mit gemeinsamen Anschaffungen passiert: Bleibt der Staubsauger in der WG, und zahlen die anderen euren Anteil? Die Kaution bekommt ihr vom Vermieter oder Hauptmieter zurück. Die Prüfung kann einige Monate dauern, vor allem wenn noch eine Nebenkostenabrechnung aussteht.',
			],
			[
				'Verträge und Behörden',
				'Läuft der Internetvertrag, der Stromvertrag oder der Rundfunkbeitrag auf euren Namen, muss jemand aus der WG übernehmen oder der Vertrag umgestellt werden. Sprecht das früh ab. In Deutschland meldet ihr euch innerhalb von zwei Wochen am neuen Wohnort an. Eine eigene Abmeldung ist nur nötig, wenn ihr ins Ausland zieht oder keine neue Wohnung in Deutschland bezieht. Denkt auch an einen Nachsendeauftrag für die Post.',
			],
			[
				'Übergabe',
				'Räumt Zimmer und eure Fächer in Küche und Bad vollständig. Streicht das Zimmer, falls der Vertrag das vorsieht. Macht eine Übergabe mit Fotos und gebt alle Schlüssel zurück. Erledigt eure letzte Runde im Putzplan, bevor ihr geht. In ManaWG verlasst ihr die WG zum Schluss selbst über die Einstellungen.',
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
		],
	},
	'wg-streit-loesen': {
		link: 'Streit in der WG',
		stand: '2026-10-19',
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
				'Putzstreit entsteht meist, weil unklar ist, wer wann dran ist, oder weil die Aufgaben ungleich verteilt sind. Ein Putzplan mit fester Rotation nimmt die Diskussion heraus: Es ist sichtbar, wer dran ist und was erledigt wurde. In ManaWG wandern Aufgaben automatisch weiter, wer verreist ist, wird übersprungen. Wenn eine Person trotzdem dauerhaft nicht putzt, gehört das in die WG-Runde, nicht in passive Zettel am Kühlschrank.',
			],
			[
				'Streit um Lärm und Gäste',
				'Hier helfen Regeln, die alle vorher vereinbart haben: Ruhezeiten unter der Woche, Ankündigung von Partys, wie lange Gäste bleiben dürfen. Was einmal gemeinsam festgelegt ist, muss nicht jedes Mal neu verhandelt werden. Haltet Beschlüsse schriftlich fest, etwa auf der Pinnwand in ManaWG, damit sich später niemand auf ein anderes Gedächtnis beruft.',
			],
			[
				'Streit ums Geld',
				'Geldstreit entsteht fast immer aus Unübersichtlichkeit: Wer hat was bezahlt, wer schuldet wem? Tragt Ausgaben sofort ein und gleicht zu einem festen Termin aus. Eine App, die Salden rechnet und Überweisungen vorschlägt, ersetzt Erinnerungen an Einzelbeträge. Klärt außerdem vorher, was gemeinsam gekauft wird und ab welchem Betrag gefragt werden muss.',
			],
			[
				'Die WG-Runde',
				'Ein regelmäßiges kurzes Treffen, etwa einmal im Monat, gibt allen einen festen Ort für Themen. Jede Person darf etwas einbringen, Entscheidungen werden festgehalten. Wenn es trotz Gesprächen nicht besser wird, ist es kein Scheitern zu überlegen, ob die Konstellation passt. Manchmal ist ein Auszug die fairste Lösung für alle.',
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
};
