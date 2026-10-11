// Ratgeberseiten für Suchanfragen rund um das WG-Leben. Allgemeine Tipps, kein Rechtsrat.
// ManaWG-Funktionen nur nennen, wenn es sie in manawg-app wirklich gibt (siehe themen.ts).
import type { Thema } from './themen';

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
		stand: '2026-10-11',
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
				'Kassenzettel in der Küche gehen verloren. Besser: Beträge sofort in die App eintragen. ManaWG kann beim Import auch Belege aus einem Foto lesen. Am Monatsende zeigt der Saldo, wer wem wie viel schuldet.',
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
};
