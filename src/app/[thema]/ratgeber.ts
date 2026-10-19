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
		stand: '2026-10-11',
		titel: 'Putzplan für die WG erstellen: Vorlage, Regeln, Beispiele | ManaWG',
		beschreibung:
			'So erstellt ihr einen Putzplan für die WG, den alle einhalten: Aufgaben, Rhythmus, faire Rotation, Umgang mit Abwesenheit und eine Beispielverteilung.',
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
				'Gibt es eine Putzplan-App für die WG?',
				'Ja, ManaWG enthält einen Putzplan mit Rhythmus, fairer Rotation, Abwesenheiten und Erinnerungen. Die App ist kostenlos und läuft im Browser.',
			],
		],
	},
	'wg-gruenden-checkliste': {
		link: 'WG gründen',
		stand: '2026-10-11',
		titel: 'WG gründen: Checkliste für Start, Geld und Regeln | ManaWG',
		beschreibung:
			'Checkliste für eine neue WG: Mitbewohner finden, Mietvertrag klären, Geld und Haushalt organisieren, Regeln festhalten und gut in den Alltag starten.',
		h1: 'WG gründen: die Checkliste',
		einleitung:
			'Eine neue WG fängt oft mit Begeisterung an und endet mit Streit über Dinge, die niemand besprochen hat. Diese Checkliste hilft, die wichtigen Fragen vor dem Einzug zu klären. Sie ersetzt keine Rechtsberatung, besonders nicht bei Mietverträgen.',
		abschnitte: [
			[
				'1. Passende Mitbewohner finden',
				'Entscheidend ist weniger, ob ihr beste Freunde seid, als ob ihr ähnliche Vorstellungen vom Zusammenleben habt. Sprecht über Ruhezeiten, Besuch, Sauberkeit, Rauchen und Haustiere, bevor ihr zusagt. Wer Zimmer nachbesetzt, sollte diese Fragen auch beim Kennenlernen stellen.',
			],
			[
				'2. Mietvertrag und Rechtliches klären',
				'In einer WG gibt es verschiedene Konstellationen: Ein gemeinsamer Hauptmietvertrag für alle, Untermietverträge oder Einzelmietverträge. Das bestimmt, wer wem gegenüber haftet und wer bei Auszug kündigen kann. Lasst euch den Vertrag vor dem Unterschreiben erklären und holt im Zweifel Rat bei einem Mieterverein ein. Auch Kaution und Übergabeprotokoll gehören vorher geklärt.',
			],
			[
				'3. Geld verbindlich regeln',
				'Legt fest, wer den Vertrag für Internet und Strom führt, wie die Miete aufgeteilt wird und was ihr gemeinsam kauft. Wer die Kosten gleich zu Beginn sauber erfasst, vermeidet späteren Streit. Mit ManaWG legt ihr Miete und Internet einmal als Fixkosten an und erfasst gemeinsame Einkäufe laufend. Die App zeigt Salden und Ausgleichsvorschläge, ihr überweist selbst.',
			],
			[
				'4. Haushalt organisieren',
				'Klärt, welche Dinge gemeinsam gehören (Putzmittel, Küchenausstattung) und was privat bleibt. Einigt euch auf einen Putzplan mit konkreten Aufgaben und eine gemeinsame Einkaufsliste für Dinge, die alle brauchen. Beides lässt sich in ManaWG teilen, ohne dass jemand die Liste per Hand pflegen muss.',
			],
			[
				'5. Regeln festhalten',
				'Haltet die wichtigsten Absprachen schriftlich fest, etwa Ruhezeiten, Umgang mit Besuch und Übernachtungsgästen, Gemeinschaftsräume und Vorgehen bei Streit. Es geht nicht um Paragrafen, sondern darum, dass später niemand sagen kann, davon habe er nichts gewusst. Die Pinnwand in ManaWG eignet sich dafür, weil Beschlüsse dort sichtbar bleiben und nicht im Chat untergehen.',
			],
			[
				'6. Einen Termin für die WG-Runde festlegen',
				'Einmal im Monat eine halbe Stunde reicht: Geld ausgleichen, Termine besprechen, Dinge ansprechen, die stören. Wer regelmäßig redet, muss selten eskalieren.',
			],
		],
		fragen: [
			[
				'Was braucht man, um eine WG zu gründen?',
				'Eine geeignete Wohnung, passende Mitbewohner, einen geklärten Mietvertrag, verbindliche Regeln für Geld und Haushalt und einen Rhythmus für Absprachen.',
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
		stand: '2026-10-11',
		titel: 'WG-Regeln: Beispiele für Haushalt, Ruhe und Besuch | ManaWG',
		beschreibung:
			'Welche Regeln sinnvoll sind und wie ihr sie festhaltet: Ruhezeiten, Besuch, Putzen, gemeinsame Kasse und Umgang mit Konflikten, mit Formulierungsbeispielen.',
		h1: 'WG-Regeln, die wirklich funktionieren',
		einleitung:
			'Viele WGs haben entweder gar keine Regeln oder einen langen Katalog, an den sich niemand hält. Gute Regeln sind kurz, konkret und von allen beschlossen. Hier sind die Bereiche, die sich zu klären lohnen, mit Beispielen.',
		abschnitte: [
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
				'Wie ihr Regeln festhaltet',
				'Schreibt sie an einen Ort, den alle sehen. In ManaWG eignet sich die Pinnwand: Beschlüsse und Ankündigungen bleiben dort stehen, statt im Chatverlauf zu verschwinden. Ein Beschluss gilt, wenn alle zugestimmt haben, und lässt sich in der monatlichen WG-Runde anpassen.',
			],
			[
				'Konflikte ansprechen',
				'Sprecht Probleme früh und sachlich an: konkretes Verhalten, konkrete Auswirkung, konkreter Wunsch. „Du lässt oft Geschirr stehen, das stört mich, kannst du es abends spülen?“ funktioniert besser als „Du bist unordentlich“.',
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
		],
	},
	'wg-nebenkosten': {
		link: 'WG-Nebenkosten',
		stand: '2026-10-11',
		titel: 'WG-Nebenkosten, Strom und Internet: Verteilung und Abrechnung | ManaWG',
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
		],
		fragen: [
			[
				'Wie werden Nebenkosten in der WG aufgeteilt?',
				'Meist wie die Miete, also nach Köpfen oder Zimmergröße. Nachzahlungen verteilt ihr unter denen, die im Abrechnungszeitraum in der WG wohnten.',
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
		stand: '2026-10-14',
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
				'Staples wie Öl, Nudeln, Reis, Gewürze und Getränke gehören allen, der Rest ist privat. Dafür braucht ihr eine Liste, in die jeder einträgt, was fehlt. In ManaWG gibt es eine gemeinsame Einkaufsliste: Wer einkauft, hakt ab und kann den Einkauf danach direkt als Ausgabe erfassen.',
			],
			[
				'Modell 3: Gemeinsam kochen und einkaufen',
				'Bei gemeinsamem Essen lohnt sich ein reihum geführter Einkauf. Die Kosten teilt ihr unter den Beteiligten. Wer nur gelegentlich mitisst, zahlt nur dann mit. Das lässt sich pro Ausgabe festlegen.',
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
				'Gibt es eine gemeinsame Einkaufsliste für WGs?',
				'Ja, ManaWG hat eine geteilte Einkaufsliste mit Vorräten. Abgehakte Einkäufe lassen sich direkt als Ausgabe eintragen.',
			],
		],
	},
	'beste-wg-app': {
		link: 'Beste WG-App',
		stand: '2026-10-14',
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
		stand: '2026-10-14',
		titel: 'Putzplan Vorlage für die WG: Beispiel zum Übernehmen | ManaWG',
		beschreibung:
			'Putzplan-Vorlage für 4 Personen als CSV-Download: Aufgabenliste, Rhythmus und Vier-Wochen-Rotation zum Übernehmen, mit Hinweisen für 3 und 5 Personen und der digitalen Variante ohne Ausdrucken.',
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
		],
	},
	'wg-haushaltskasse': {
		link: 'WG-Haushaltskasse',
		stand: '2026-10-19',
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
};
