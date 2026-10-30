// Guides about money, shopping and finding flatmates. General tips, not legal advice.
// Only name features that really exist in manawg-app.
import { euro, rentShares } from '../rent-calculator.ts';
import type { Topic } from '../types.ts';

// Rent example of the calculator page: values come from rentShares, not from hand.
const EXAMPLE_ROOMS = [12, 18, 24];
const EXAMPLE_SHARED = 18;
const EXAMPLE_RENT_CENT = 90000;
const without = rentShares(EXAMPLE_RENT_CENT, EXAMPLE_ROOMS, 0);
const withShared = rentShares(EXAMPLE_RENT_CENT, EXAMPLE_ROOMS, EXAMPLE_SHARED);
const total = (a: number[]) => euro(a.reduce((s, x) => s + x, 0));

// Rundfunkbeitrag per dwelling according to rundfunkbeitrag.de (as of 27 Oct 2026), in cents.
const LICENCE_FEE_MONTH_CENT = 1836;
const LICENCE_FEE_QUARTER_CENT = LICENCE_FEE_MONTH_CENT * 3;

// Free expenses per day according to the Splitwise help centre (kb.splitwise.com/pro/what-is-splitwise-pro, as of 27 Oct 2026).
const SPLITWISE_DAILY_LIMIT = 4;

export const GUIDES_DE_MONEY: Record<string, Topic> = {
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
	'wg-miete-rechner': {
		link: 'WG-Miete Rechner',
		widget: { after: 'Rechner', kind: 'rent-calculator' },
		updated: '2026-10-27',
		published: '2026-10-27',
		title: 'WG-Miete aufteilen: Rechner nach Zimmergröße | ManaWG',
		description:
			'WG-Miete fair aufteilen: Rechner nach Zimmergröße mit Gemeinschaftsfläche, Formel mit Beispiel und Tipps zu Balkon, eigenem Bad und Nebenkosten.',
		h1: 'WG-Miete nach Zimmergröße aufteilen',
		intro:
			'Sind die Zimmer unterschiedlich groß, passt ein gleicher Mietanteil selten. Der Rechner verteilt die Miete nach der Fläche jedes Zimmers und rechnet die gemeinsam genutzten Räume gleichmäßig auf alle Personen um. Das Ergebnis ist ein Vorschlag, auf den ihr euch noch einigen müsst.',
		sections: [
			[
				'Rechner',
				'Tragt die Miete ein, die Fläche jedes Zimmers in Quadratmetern und die Fläche der gemeinsam genutzten Räume wie Küche, Bad und Flur. Ob ihr Kalt- oder Warmmiete nehmt, entscheidet ihr selbst, die Rechnung bleibt gleich. Die vorbelegten Werte sind ein Beispiel. Eure Eingaben bleiben im Browser und werden weder gespeichert noch gesendet.',
			],
			[
				'Die Formel mit Beispiel',
				`Jedes Zimmer zahlt nach seiner Fläche, die Gemeinschaftsfläche wird gleichmäßig auf alle Personen verteilt. Als Formel: Anteil = Miete × (Zimmerfläche + Gemeinschaftsfläche ÷ Personenzahl) ÷ (Summe aller Zimmerflächen + Gemeinschaftsfläche). Beispiel: ${euro(EXAMPLE_RENT_CENT)} Miete, drei Zimmer mit 12, 18 und 24 m² und ${EXAMPLE_SHARED} m² Gemeinschaftsfläche. Jedes Zimmer bekommt 6 m² dazu und zählt dann 18, 24 und 30 m², zusammen 72 m². Auf den Cent wird so gerundet, dass die Anteile genau die Miete ergeben. Andere Modelle, etwa gleiche Anteile oder gemischte Aufteilungen, stehen unter [WG-Kosten fair aufteilen](/wg-kosten-aufteilen).`,
			],
			[
				'Zuschläge: Balkon, eigenes Bad, Dachschräge',
				'Die Flächenformel kennt nur Quadratmeter. Ein Balkon, ein eigenes Bad oder eine Dachschräge machen ein Zimmer mehr oder weniger wert, doch es gibt dafür keinen festen Satz und keinen üblichen Prozentwert. Das ist Verhandlungssache in der WG. Einigt euch auf einen festen Eurobetrag im Monat. Damit die Summe aufgeht, zieht ihr einen Aufschlag erst von der Miete ab, teilt den Rest nach Fläche und rechnet den Aufschlag danach zum Anteil dieser Person. Bei einem Abschlag geht ihr umgekehrt vor. Bei einer Dachschräge messt ihr am besten die Fläche, die ihr wirklich nutzen könnt.',
			],
			[
				'Nebenkosten, Strom und Internet',
				'Gebt im Rechner die Miete ein, die ihr nach Fläche teilen wollt. Mit der Warmmiete steckt die Nebenkosten-Vorauszahlung schon im Ergebnis. Strom und Internet teilen WGs meist gleichmäßig, weil jede Person sie nutzt. Wie das geht und was bei Nachzahlungen gilt, steht bei [WG-Nebenkosten](/wg-nebenkosten).',
			],
			[
				'Ergebnis in ManaWG übernehmen',
				'Legt die Miete in der [WG-Kasse](/wg-kasse) als Fixkosten an: Betrag eintragen, Intervall ein Monat, bei „Bezahlt von“ die Person, die an den Vermieter überweist. Unter „Beteiligte & Aufteilung“ wählt ihr „Manuell“ und tragt für jede Person den Betrag aus dem Rechner ein. ManaWG zeigt an, ob die Anteile zusammen die Miete ergeben. Eine Aufteilung in Prozent gibt es nicht, ihr tragt Eurobeträge ein. Danach bucht die App die Miete jeden Monat automatisch als Ausgabe.',
			],
		],
		tables: [
			{
				after: 'Die Formel mit Beispiel',
				title: 'Beispiel: 900 Euro Miete nach Zimmergröße',
				header: [
					'Zimmer',
					'Fläche',
					'Anteil ohne Gemeinschaftsfläche',
					`Anteil mit ${EXAMPLE_SHARED} m² Gemeinschaftsfläche`,
				],
				rows: [
					...EXAMPLE_ROOMS.map((m, i) => [
						`Zimmer ${i + 1}`,
						`${m} m²`,
						euro(without[i] ?? 0),
						euro(withShared[i] ?? 0),
					]),
					[
						'Summe',
						`${EXAMPLE_ROOMS.reduce((s, m) => s + m, 0)} m²`,
						total(without),
						total(withShared),
					],
				],
				note: 'Ohne Gemeinschaftsfläche zahlt jedes Zimmer nur nach der eigenen Fläche. Mit ihr werden die Unterschiede zwischen großen und kleinen Zimmern kleiner.',
			},
		],
		faq: [
			[
				'Wie teilt man die Miete in der WG fair auf?',
				'Eine gängige Möglichkeit ist die Aufteilung nach Zimmergröße: Wer mehr Fläche hat, zahlt mehr. Sind die Zimmer gleich groß, ist ein gleicher Anteil fair. Gemeinsam genutzte Räume rechnet ihr gleichmäßig auf alle Personen um, wie im Rechner oben.',
			],
			[
				'Zählt die Gemeinschaftsfläche mit?',
				'Sie kann, muss aber nicht. Ohne sie zahlt jedes Zimmer nur nach der eigenen Fläche. Mit ihr zahlt jede Person denselben Flächenanteil für Küche, Bad und Flur dazu, und die Unterschiede werden kleiner. Legt gemeinsam fest, welche Räume ihr als Gemeinschaftsfläche zählt.',
			],
			[
				'Was tun, wenn ein Zimmer einen Balkon hat?',
				'Dafür gibt es keinen festen Satz. Einigt euch auf einen Eurobetrag, den die Person mehr zahlt, und rechnet ihn wie oben beschrieben aus der Miete heraus. Haltet die Absprache schriftlich fest.',
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
	'rundfunkbeitrag-wg': {
		link: 'Rundfunkbeitrag in der WG',
		updated: '2026-10-27',
		published: '2026-10-27',
		title: 'Rundfunkbeitrag in der WG: wer zahlt, wie teilen | ManaWG',
		description:
			'Rundfunkbeitrag in der WG: ein Beitrag pro Wohnung, wie sich Mitbewohner abmelden, wie ihr den Betrag fair teilt und was beim Auszug gilt.',
		h1: 'Rundfunkbeitrag in der WG',
		intro:
			'In einer WG fällt der Rundfunkbeitrag einmal pro Wohnung an, nicht pro Person. Hier steht, wer zahlen muss, wie sich Mitbewohner abmelden, wenn schon jemand zahlt, und wie ihr den Betrag teilt. Die Seite gibt einen Überblick und ersetzt keine Rechtsberatung. Verbindlich ist, was der Beitragsservice schreibt.',
		sections: [
			[
				'Ein Beitrag pro Wohnung',
				'Im privaten Bereich ist nach § 2 Absatz 1 des Rundfunkbeitragsstaatsvertrags (RBStV) für jede Wohnung ein Rundfunkbeitrag zu entrichten, und zwar vom Inhaber der Wohnung. Inhaber ist jede volljährige Person, die die Wohnung selbst bewohnt (§ 2 Absatz 2). Als Inhaber wird vermutet, wer dort nach dem Melderecht gemeldet ist (siehe [Anmeldung in der WG](/wg-anmeldung)) oder im Mietvertrag als Mieter steht. Wie viele Personen in der Wohnung leben, spielt für die Höhe laut Beitragsservice keine Rolle.',
			],
			[
				'Mitbewohner zahlt bereits: so meldet ihr euch ab',
				'Zahlt in eurer WG schon jemand, braucht ihr kein eigenes Beitragskonto. Meldet in diesem Fall euer Konto ab. Haltet dafür am besten Name und Beitragsnummer der Person bereit, die den Beitrag zahlt, und fragt sie zuerst danach. Eure eigene steht auf den Schreiben des Beitragsservice, etwa auf der Anmeldebestätigung oder dem Kontoauszug, und hat neun Stellen. Die Abmeldung läuft über das Formular „Wohnung abmelden“ auf rundfunkbeitrag.de und ist nur unter bestimmten Voraussetzungen möglich. Welche Angaben das Formular verlangt, seht ihr dort. Reagiert auf Briefe des Beitragsservice, damit für dieselbe Wohnung kein zweites Konto stehen bleibt.',
			],
			[
				'Den Beitrag teilen',
				`Der Beitrag beträgt ${euro(LICENCE_FEE_MONTH_CENT)} im Monat je Wohnung. Üblich ist die Zahlung für drei Monate, also ${euro(LICENCE_FEE_QUARTER_CENT)} im Quartal. Auf Wunsch geht es auch halbjährlich (${euro(LICENCE_FEE_MONTH_CENT * 6)}) oder jährlich (${euro(LICENCE_FEE_MONTH_CENT * 12)}) im Voraus. Die Tabelle zeigt den Betrag bei gleichem Anteil für alle (Stand 27. Oktober 2026, laut rundfunkbeitrag.de). Ändert sich der Beitrag, rechnet ihr neu. Den aktuellen Betrag findet ihr auf rundfunkbeitrag.de. Wie ihr Strom, Internet und Nachzahlungen teilt, steht unter [WG-Nebenkosten](/wg-nebenkosten).`,
			],
			[
				'Wer haftet',
				'Mehrere Beitragsschuldner haften nach § 2 Absatz 3 RBStV als Gesamtschuldner entsprechend § 44 der Abgabenordnung. Nach § 44 Absatz 1 AO schuldet dabei jeder Gesamtschuldner die gesamte Leistung, soweit nichts anderes bestimmt ist. Der Beitragsservice kann sich bei einem offenen Beitrag also an jede Person halten, die als Inhaber gilt, auch wenn ihr intern anders geteilt habt. Klärt deshalb, wer den Beitrag zahlt, und gleicht Anteile untereinander aus.',
			],
			[
				'Auszug und Wechsel des Zahlers',
				'Wer auszieht, zeigt das dem Beitragsservice an. Die Beitragspflicht endet nach § 7 Absatz 2 RBStV mit Ablauf des Monats, in dem das Innehaben der Wohnung endet, aber nicht vor Ablauf des Monats, in dem dies angezeigt worden ist. Wer sich nicht meldet, zahlt also unter Umständen weiter. Zieht die zahlende Person aus, bleibt die Wohnung beitragspflichtig. Sprecht rechtzeitig ab, wer künftig zahlt, und meldet das über die Formulare auf rundfunkbeitrag.de, damit Beitragsnummer und Abbuchung zur richtigen Person gehören. Mehr zum Auszug steht in der [Auszug-Checkliste](/wg-auszug-checkliste).',
			],
			[
				'Befreiung',
				'Eine Befreiung oder Ermäßigung gibt es nicht automatisch, sondern nur auf Antrag mit Nachweis. Wer unter welchen Voraussetzungen berechtigt ist, führt der Beitragsservice auf seiner Seite zu den Ausnahmen auf, sie steht unter den Quellen. Den Antrag stellt ihr über das Formular „Befreiung oder Ermäßigung beantragen“. Fragt im Zweifel beim Beitragsservice nach, wie sich die Befreiung einer Person auf die Wohnung auswirkt.',
			],
			[
				'In ManaWG als Fixkosten',
				`Legt den Beitrag in der [WG-Kasse](/wg-kasse) als Fixkosten an: Betrag ${euro(LICENCE_FEE_QUARTER_CENT)}, Intervall „3 Monate (Quartal)“, bei „Bezahlt von“ die zahlende Person und die Aufteilung „Gleichmäßig“ auf alle, die sich beteiligen. Als erste Fälligkeit nehmt ihr den nächsten Abbuchungstermin. ManaWG bucht den Beitrag dann alle drei Monate automatisch als Ausgabe, und die Anteile fließen in den Saldo ein. Zahlt ihr jährlich, wählt ihr als Intervall 12 Monate und tragt den Jahresbetrag ein.`,
			],
		],
		tables: [
			{
				after: 'Den Beitrag teilen',
				title: 'Rundfunkbeitrag je Person bei gleichem Anteil',
				header: ['Personen', 'Anteil im Monat', 'Anteil im Quartal'],
				rows: [2, 3, 4].map((n) => [
					`${n} Personen`,
					euro(LICENCE_FEE_MONTH_CENT / n),
					euro(LICENCE_FEE_QUARTER_CENT / n),
				]),
				note: `Grundlage: ${euro(LICENCE_FEE_MONTH_CENT)} im Monat, ${euro(LICENCE_FEE_QUARTER_CENT)} im Quartal für die ganze Wohnung. Stand 27. Oktober 2026.`,
			},
		],
		faq: [
			[
				'Muss jeder in der WG Rundfunkbeitrag zahlen?',
				'Nein. Der Rundfunkbeitrag fällt einmal pro Wohnung an. Eine Person zahlt, die anderen melden sich ab, und die WG teilt den Betrag unter sich.',
			],
			[
				'Wie hoch ist der Rundfunkbeitrag pro Person in der WG?',
				`Der Beitrag gilt je Wohnung und beträgt ${euro(LICENCE_FEE_MONTH_CENT)} im Monat (Stand 27. Oktober 2026). Bei gleichem Anteil zahlen zwei Personen je ${euro(LICENCE_FEE_MONTH_CENT / 2)}, drei Personen je ${euro(LICENCE_FEE_MONTH_CENT / 3)} und vier Personen je ${euro(LICENCE_FEE_MONTH_CENT / 4)} im Monat.`,
			],
			[
				'Wie melde ich mich ab, wenn mein Mitbewohner zahlt?',
				'Über das Formular „Wohnung abmelden“ auf rundfunkbeitrag.de. Ihr braucht eure eigene Beitragsnummer, und die Abmeldung ist nur unter bestimmten Voraussetzungen möglich. Haltet außerdem Name und Beitragsnummer der zahlenden Person bereit, welche Angaben das Formular verlangt, seht ihr dort.',
			],
			[
				'Wer haftet, wenn der Beitrag nicht bezahlt wird?',
				'Mehrere Beitragsschuldner einer Wohnung haften als Gesamtschuldner (§ 2 Absatz 3 RBStV, § 44 AO). Der Beitragsservice kann sich daher an jede Person halten, die als Inhaber der Wohnung gilt.',
			],
		],
		sources: [
			[
				'Rundfunkbeitrag: Zahlung und Höhe (rundfunkbeitrag.de)',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/informationen/zahlung',
			],
			[
				'Rundfunkbeitrag: Wohnung abmelden (rundfunkbeitrag.de)',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/formulare/abmelden',
			],
			[
				'Rundfunkbeitrag: Ausnahmen von der Beitragspflicht (rundfunkbeitrag.de)',
				'https://www.rundfunkbeitrag.de/ausnahmen-von-der-rundfunkbeitragspflicht',
			],
			[
				'Rundfunkbeitrag: Befreiung oder Ermäßigung beantragen (rundfunkbeitrag.de)',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/formulare/befreiung-oder-ermaessigung-beantragen',
			],
			[
				'RBStV § 2 Rundfunkbeitrag im privaten Bereich',
				'https://www.gesetze-bayern.de/Content/Document/RBeitrStV-2',
			],
			[
				'RBStV § 7 Beginn und Ende der Beitragspflicht',
				'https://www.gesetze-bayern.de/Content/Document/RBeitrStV-7',
			],
			['AO § 44 Gesamtschuldner', 'https://www.gesetze-im-internet.de/ao_1977/__44.html'],
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
	'splitwise-kostenlos': {
		link: 'Splitwise kostenlos',
		updated: '2026-10-27',
		published: '2026-10-27',
		title: 'Splitwise kostenlos: Tageslimit und Pro | ManaWG',
		description:
			'Wie viele Ausgaben erlaubt Splitwise kostenlos pro Tag? Das Limit laut Splitwise-Hilfe, was Pro ergänzt und welche Wege es für WGs mit vielen Einträgen gibt.',
		h1: 'Splitwise kostenlos: Wie viele Ausgaben sind erlaubt?',
		intro:
			'Splitwise lässt sich kostenlos nutzen, begrenzt in der kostenlosen Version aber die Zahl neuer Ausgaben pro Tag. Hier steht, was die Hilfeseite von Splitwise dazu sagt, was Pro ergänzt und was ihr tun könnt, wenn das Limit eure WG bremst. Die Angaben stammen von der verlinkten Hilfeseite, abgerufen am 27. Oktober 2026.',
		sections: [
			[
				'Kurz gesagt',
				`Laut Splitwise-Hilfe können kostenlose Nutzer ${SPLITWISE_DAILY_LIMIT} Ausgaben pro Tag eintragen (Stand 27. Oktober 2026). Andere Seiten nennen teils andere Zahlen; maßgeblich ist die Hilfeseite von Splitwise.`,
			],
			[
				'Was Splitwise Pro ergänzt',
				'Pro hebt laut Splitwise das Tageslimit auf und ergänzt weitere Funktionen, die die Tabelle zeigt. Den aktuellen Preis nennt Splitwise auf der Pro-Seite.',
			],
			[
				'Wann das Limit in der WG stört',
				'Wer jeden Einkauf gleich einträgt, kommt in einer WG schnell auf mehrere Einträge am Tag, etwa nach einem Großeinkauf mit getrennten Belegen. Ob das Limit für euch zählt, hängt davon ab, wie oft ihr eintragt.',
			],
			[
				'Was ihr tun könnt',
				'Wartet bis zum nächsten Tag, wechselt zu Pro oder nutzt eine andere App.\nManaWG ist eine kostenlose WG-App ohne Bezahlstufe und kennt kein Tages- oder Monatslimit für Ausgaben. Sie rechnet nur in Euro, ist auf Deutsch und Englisch verfügbar und fasst bis zu 20 aktive Mitglieder.\nAlte Ausgaben aus Splitwise übernehmt ihr per CSV-Import mit Vorschau, siehe [Umstieg](/splitwise-splid-wechseln). Einen Vergleich findet ihr unter [Splitwise-Alternative](/splitwise-alternative).',
			],
		],
		tables: [
			{
				after: 'Was Splitwise Pro ergänzt',
				title: 'Splitwise Pro laut Hilfeseite',
				header: ['Funktion', 'kostenlos', 'Pro'],
				rows: [
					['Ausgaben', `bis zu ${SPLITWISE_DAILY_LIMIT} pro Tag`, 'unbegrenzt'],
					[
						'Transaktionsimport (nur ausgewählte Länder)',
						'als Pro-Funktion aufgeführt',
						'enthalten',
					],
					['Suche', 'als Pro-Funktion aufgeführt', 'enthalten'],
					['Währungsumrechnung', 'nur mit Pro', 'enthalten'],
					['Belegscan und Aufteilung nach Positionen', 'nur mit Pro', 'enthalten'],
					['Diagramme', 'als Pro-Funktion aufgeführt', 'enthalten'],
					['Standardaufteilungen', 'als Pro-Funktion aufgeführt', 'enthalten'],
				],
				note: 'Quelle: Splitwise-Hilfe, abgerufen am 27. Oktober 2026.',
			},
		],
		faq: [
			[
				'Ist Splitwise noch kostenlos?',
				`Ja, mit Grenzen: laut Splitwise-Hilfe ${SPLITWISE_DAILY_LIMIT} Ausgaben pro Tag in der kostenlosen Version.`,
			],
			[
				'Wie viele Ausgaben pro Tag erlaubt Splitwise kostenlos?',
				`Laut Splitwise-Hilfe ${SPLITWISE_DAILY_LIMIT}, Stand 27. Oktober 2026.`,
			],
			[
				'Kann ich meine Splitwise-Daten mitnehmen?',
				'Liegen eure Ausgaben als CSV-Datei vor, importiert ManaWG sie mit Vorschau. Übernommen werden Beträge in Euro.',
			],
		],
		sources: [
			[
				'Splitwise-Hilfe: What is Splitwise Pro?',
				'https://kb.splitwise.com/pro/what-is-splitwise-pro',
			],
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
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
	'wg-kaution': {
		link: 'Kaution in der WG',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'WG-Kaution: Höhe, Raten, Auszug und Rückzahlung | ManaWG',
		description:
			'Kaution in der WG: höchstens drei Nettokaltmieten, drei Raten, wer sie zahlt und verwahrt, was beim Auszug passiert und wie lange die Rückzahlung dauern darf.',
		h1: 'Kaution in der WG: Höhe, Raten, Auszug und Rückzahlung',
		intro:
			'Die Kaution ist oft der größte Betrag, den ihr beim Einzug in eine WG auf einmal zahlt. Wohin sie geht und wer sie zurückzahlt, hängt davon ab, wie euer [Mietvertrag](/wg-mietvertrag) aufgebaut ist. Beim Auszug einer Person sorgt das regelmäßig für Fragen. Diese Seite fasst die Regeln aus § 551 BGB und die gängige Praxis zusammen und ersetzt keine Rechtsberatung. Bei konkreten Streitfällen helfen Mietervereine.',
		sections: [
			[
				'Höhe: höchstens drei Nettokaltmieten',
				'Die Kaution darf höchstens das Dreifache der Miete betragen, die auf einen Monat entfällt, ohne Betriebskosten, die als Pauschale oder Vorauszahlung ausgewiesen sind (§ 551 Abs. 1 BGB). Gemeint sind drei Nettokaltmieten. Bei 1.200 € Kaltmiete für die ganze Wohnung sind das höchstens 3.600 €, bei einem gemeinsamen Hauptmietvertrag mit vier Personen also 900 € je Person. Bei Einzelmietverträgen gilt die Grenze für jeden Vertrag, bei Untermiete für den Untermietvertrag. Eine höhere Vereinbarung ist zum Nachteil des Mieters unwirksam (§ 551 Abs. 4 BGB). Zu viel gezahlte Kaution könnt ihr zurückfordern.',
			],
			[
				'Drei Raten statt alles auf einmal',
				'Bei einer Geldkaution dürft ihr in drei gleichen monatlichen Teilzahlungen zahlen. Die erste Rate ist zu Beginn des Mietverhältnisses fällig, die beiden weiteren mit den unmittelbar folgenden Mietzahlungen (§ 551 Abs. 2 BGB). Fällig wird die Kaution also erst mit dem vereinbarten Beginn des Mietverhältnisses, nicht schon bei der Besichtigung oder vor Vertragsschluss. Wer vorher Geld überweisen soll, sollte misstrauisch sein: Die Verbraucherzentrale nennt Vorkasse und eine Kaution vor Vertragsschluss als bekannte Betrugsmasche.',
			],
			[
				'Wo die Kaution liegt',
				'Der Vermieter muss das Geld getrennt von seinem eigenen Vermögen bei einem Kreditinstitut anlegen, zu dem für Spareinlagen mit dreimonatiger Kündigungsfrist üblichen Zinssatz. Eine andere Anlageform kann vereinbart werden, auch sie muss getrennt vom Vermögen des Vermieters erfolgen. Die Erträge stehen dem Mieter zu und erhöhen die Kaution (§ 551 Abs. 3 BGB). Die Pflicht zur getrennten Anlage soll euer Geld im Insolvenzfall des Vermieters schützen, setzt aber voraus, dass der Vermieter sie tatsächlich eingehalten hat. Lasst euch bei Bedarf den Nachweis der Anlage zeigen.',
			],
			[
				'Wer zahlt die Kaution, und wer verwahrt sie?',
				'Das hängt vom Vertragsmodell ab. Bei Untermiete zahlt ihr die Kaution an den Hauptmieter, nicht an den Vermieter. Bei Einzelverträgen zahlt jede Person ihre eigene an den Vermieter. Beim gemeinsamen Hauptmietvertrag liegt eine Kaution für den ganzen Vertrag beim Vermieter, und ihr klärt untereinander, wer welchen Anteil eingezahlt hat. Die Tabelle zeigt die vier häufigen Fälle. Die drei Vertragsmodelle selbst erklärt die Seite [WG-Mietvertrag](/wg-mietvertrag).',
			],
			[
				'Auszug und Nachmieter',
				'Zieht jemand aus, hängt es wieder vom Vertrag ab. Bei Untermiete endet nur der Untermietvertrag, die Kaution des Hauptmieters beim Vermieter bleibt unberührt, und ihr fordert eure Kaution beim Hauptmieter zurück. Bei Einzelverträgen bekommt ihr sie vom Vermieter zurück, der vom Nachfolger meist eine neue Kaution verlangt. Beim gemeinsamen Hauptmietvertrag läuft der Vertrag mit den anderen weiter, und die Kaution bleibt beim Vermieter. Einen Rückzahlungsanspruch gegen den Vermieter hat die ausziehende Person dann in der Regel nicht. Meist zahlt der Nachfolger seinen Anteil direkt an sie. Gegenüber dem Vermieter ändert das rechtlich nichts. Haltet die Absprache deshalb schriftlich fest. Das Ausscheiden aus einem gemeinsamen Vertrag setzt grundsätzlich die Zustimmung des Vermieters voraus. Was beim Auszug sonst ansteht, steht in der [Auszugs-Checkliste](/wg-auszug-checkliste) und unter [WG-Zimmer kündigen](/wg-zimmer-kuendigen).',
			],
			[
				'Rückzahlung: Wie lange darf es dauern?',
				'Eine feste gesetzliche Frist gibt es nicht. Der Vermieter hat eine angemessene Prüffrist, um zu klären, ob ihm noch Forderungen zustehen. Der Deutsche Mieterbund nennt für einfache Fälle zwei oder drei Monate, im Einzelfall kann auch eine Frist von mehr als sechs Monaten angemessen sein, zum Beispiel wenn noch eine Betriebskostenabrechnung für das laufende Jahr aussteht. Die oft genannten drei bis sechs Monate sind ein Richtwert, keine Obergrenze. Die Rückzahlung wird fällig, wenn die Prüffrist abgelaufen ist und dem Vermieter keine Forderungen mehr zustehen (BGH, Urteil vom 20.07.2016, VIII ZR 263/14). Bei Untermiete ist der Hauptmieter Vermieter des Untermietvertrags, die Regeln gelten dort entsprechend.',
			],
			[
				'Einbehalt und Schäden',
				'Der Vermieter darf nur Beträge für Forderungen einbehalten, die ihm tatsächlich zustehen können, etwa Schäden oder eine Nebenkostennachzahlung. Steht nur noch die Betriebskostenabrechnung aus, darf er einen großzügig bemessenen Teil zurückhalten und den Rest auszahlen. Ersatzansprüche wegen Veränderungen oder Verschlechterungen der Mietsache verjähren sechs Monate nach der Rückgabe (§ 548 Abs. 1 BGB). Der Bundesgerichtshof hat 2024 entschieden, dass der Vermieter auch verjährte Schadensersatzforderungen noch mit der Kaution verrechnen darf, solange er sie nicht abgerechnet hat (Az. VIII ZR 184/23). Ein Übergabeprotokoll bei Einzug und Auszug hilft deshalb, Streit zu vermeiden.',
			],
			[
				'Alternativen: Bürgschaft oder Kautionsversicherung',
				'Statt Bargeld gibt es die Kautionsbürgschaft oder die Mietkautionsversicherung. Das ist eine freiwillige Vereinbarung: Der Vermieter muss sie nicht akzeptieren, und der Vertrag muss diese Form zulassen. Die Sicherheit insgesamt darf die Grenze von drei Nettokaltmieten nicht überschreiten. Lest die Bedingungen vorher genau, vor allem, ob Kosten anfallen und wer im Ernstfall zahlt. Schließt eine Versicherung erst ab, wenn der Vermieter zugestimmt hat. Eine Empfehlung für einen Anbieter geben wir nicht.',
			],
			[
				'Übergabeprotokoll und Belege',
				'Haltet beim Einzug in einem Übergabeprotokoll mit Fotos und Zählerständen fest, in welchem Zustand das Zimmer und die gemeinsamen Räume sind, und lasst es von beiden Seiten unterschreiben. Schreibt außerdem auf, wer wann welchen Betrag an wen gezahlt hat, am besten per Überweisung statt bar. Bewahrt Mietvertrag, Übergabeprotokoll und Kautionsnachweis auf; die Verbraucherzentrale rät, sie drei Jahre nach dem Auszug aufzubewahren. Der Rückzahlungsanspruch verjährt nach drei Jahren, gerechnet ab dem Ende des Jahres, in dem er entstanden ist (§§ 195, 199 BGB).',
			],
			[
				'Was ManaWG dabei kann und was nicht',
				'ManaWG hat keine eigene Funktion für die Kaution, hilft aber an anderer Stelle. Legt Kaltmiete und Nebenkosten als getrennte Fixkosten in der [WG-Kasse](/wg-kasse) an, dann seht ihr jederzeit, welche Kaltmiete der Kaution zugrunde liegt. Streckt eine Person die Kaution für andere vor, könnt ihr den Betrag als einmalige Ausgabe eintragen und nur die Beteiligten auswählen. Der Saldo zeigt dann, wer wem etwas schuldet. ManaWG rechnet nur in Euro. Wer welchen Anteil eingezahlt hat, haltet ihr außerhalb der App schriftlich fest.',
			],
		],
		tables: [
			{
				after: 'Wer zahlt die Kaution, und wer verwahrt sie?',
				title: 'Kaution je Vertragsform',
				header: ['Vertragsform', 'Kaution geht an', 'Beim Auszug einer Person'],
				rows: [
					[
						'Hauptmieter mit Untermietern',
						'den Hauptmieter',
						'Untermieter fordert sie nach angemessener Prüffrist vom Hauptmieter zurück',
					],
					[
						'Einzelmietverträge',
						'den Vermieter, je Person',
						'Vermieter zahlt nach der Prüffrist zurück, der Nachfolger zahlt meist neu',
					],
					[
						'Gemeinsamer Hauptmietvertrag',
						'den Vermieter, für den ganzen Vertrag',
						'bleibt beim Vermieter, der Anteil wird intern mit Nachfolger oder WG geklärt',
					],
					[
						'Nachmieter tritt in den Vertrag ein',
						'bleibt beim Vermieter',
						'Ausziehende bekommen den Betrag intern vom Nachmieter',
					],
				],
				note: 'Orientierung ohne Rechtsberatung. Im Einzelfall zählt, was im Vertrag steht.',
			},
		],
		faq: [
			[
				'Wie hoch darf die Kaution in der WG sein?',
				'Höchstens drei Nettokaltmieten, also ohne als Pauschale oder Vorauszahlung ausgewiesene Betriebskosten (§ 551 BGB). Bei Einzelverträgen gilt die Grenze für jeden Vertrag, bei Untermiete für den Untermietvertrag.',
			],
			[
				'Muss ich die Kaution auf einmal zahlen?',
				'Nein. Ihr dürft sie in drei gleichen monatlichen Raten zahlen. Die erste ist zu Beginn des Mietverhältnisses fällig, die beiden weiteren mit den folgenden Mietzahlungen.',
			],
			[
				'Wer bekommt die Kaution zurück, wenn ich aus der WG ausziehe?',
				'Bei Untermiete zahlt der Hauptmieter zurück, bei Einzelverträgen der Vermieter. Beim gemeinsamen Hauptmietvertrag bleibt die Kaution beim Vermieter, und meist zahlt der Nachfolger euren Anteil direkt an euch.',
			],
			[
				'Wie lange darf der Vermieter die Kaution behalten?',
				'Es gibt keine feste Frist, nur eine angemessene Prüffrist. Der Mieterbund nennt zwei oder drei Monate für einfache Fälle, im Einzelfall auch mehr als sechs. Nur konkret erwartete Forderungen darf er einbehalten.',
			],
			[
				'Darf ich die Kaution schon vor dem Vertrag zahlen?',
				'Davon rät die Verbraucherzentrale ab. Fällig wird die erste Rate erst mit Beginn des Mietverhältnisses. Eine Zahlung vor Vertragsschluss oder Besichtigung ist ein typisches Betrugsmerkmal.',
			],
		],
		sources: [
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			[
				'§ 548 BGB, Verjährung der Ersatzansprüche und des Wegnahmerechts',
				'https://www.gesetze-im-internet.de/bgb/__548.html',
			],
			[
				'Deutscher Mieterbund, Der Anspruch des Mieters auf Rückgewähr der Kaution (PDF)',
				'https://mieterbund.de/app/uploads/2025/02/5-Beate-Flatow-Der-Anspruch-des-Mieters-auf-Rueckgewaehr-der-Kaution.pdf',
			],
			[
				'Deutscher Mieterbund, BGH zur Aufrechnung verjährter Schadensersatzforderungen mit der Kaution',
				'https://mieterbund.de/aktuelles/meldungen/bgh/bundesgerichtshof-erleichtert-aufrechnung-von-verjaehrten-schadensersatzforderungen-mit-kautionsguthaben/',
			],
			[
				'Verbraucherzentrale, Mietvertrag und Kaution',
				'https://www.verbraucherzentrale.de/laura-zieht-aus/mietvertrag',
			],
			[
				'Verbraucherzentrale, Aufbewahrungspflichten',
				'https://www.verbraucherzentrale.de/wissen/digitale-welt/datenschutz/aufbewahrungspflichten-welche-unterlagen-muss-ich-wie-lange-behalten-84296',
			],
			[
				'Verbraucherzentrale, Fake-Wohnungen im Internet',
				'https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/abzocke/fakewohnungen-im-internet-so-erkennen-sie-falsche-immobilienanzeigen-27576',
			],
			[
				'Juraforum, Muss der Vermieter eine Mietkautionsversicherung akzeptieren?',
				'https://www.juraforum.de/news/muss-der-vermieter-eine-mietkautionsversicherung-akzeptieren_248119',
			],
		],
	},
};
