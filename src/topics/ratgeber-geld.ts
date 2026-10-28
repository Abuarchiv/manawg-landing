// Ratgeber rund ums Geld in der WG; wird in themen.ts eingebunden.
// Nur Funktionen nennen, die es in manawg-app wirklich gibt.
import { euro, mieteAnteile } from './miete-rechner.ts';
import type { Thema } from './themen';

// Beispiel der Mietseite: Werte kommen aus mieteAnteile, nicht von Hand.
const BEISPIEL_ZIMMER = [12, 18, 24];
const BEISPIEL_GEMEINSCHAFT = 18;
const BEISPIEL_MIETE_CENT = 90000;
const ohne = mieteAnteile(BEISPIEL_MIETE_CENT, BEISPIEL_ZIMMER, 0);
const mit = mieteAnteile(BEISPIEL_MIETE_CENT, BEISPIEL_ZIMMER, BEISPIEL_GEMEINSCHAFT);
const summe = (a: number[]) => euro(a.reduce((s, x) => s + x, 0));

// Rundfunkbeitrag je Wohnung laut rundfunkbeitrag.de (Stand 27.10.2026), in Cent.
const RUNDFUNK_MONAT_CENT = 1836;
const RUNDFUNK_QUARTAL_CENT = RUNDFUNK_MONAT_CENT * 3;

// Kostenlose Ausgaben pro Tag laut Splitwise-Hilfe (kb.splitwise.com/pro/what-is-splitwise-pro, Stand 27.10.2026).
const SPLITWISE_TAGESLIMIT = 4;

export const RATGEBER_GELD: Record<string, Thema> = {
	'wg-miete-rechner': {
		link: 'WG-Miete Rechner',
		widget: { after: 'Rechner', kind: 'rent-calculator' },
		stand: '2026-10-27',
		erschienen: '2026-10-27',
		titel: 'WG-Miete aufteilen: Rechner nach Zimmergröße | ManaWG',
		beschreibung:
			'WG-Miete fair aufteilen: Rechner nach Zimmergröße mit Gemeinschaftsfläche, Formel mit Beispiel und Tipps zu Balkon, eigenem Bad und Nebenkosten.',
		h1: 'WG-Miete nach Zimmergröße aufteilen',
		einleitung:
			'Sind die Zimmer unterschiedlich groß, passt ein gleicher Mietanteil selten. Der Rechner verteilt die Miete nach der Fläche jedes Zimmers und rechnet die gemeinsam genutzten Räume gleichmäßig auf alle Personen um. Das Ergebnis ist ein Vorschlag, auf den ihr euch noch einigen müsst.',
		abschnitte: [
			[
				'Rechner',
				'Tragt die Miete ein, die Fläche jedes Zimmers in Quadratmetern und die Fläche der gemeinsam genutzten Räume wie Küche, Bad und Flur. Ob ihr Kalt- oder Warmmiete nehmt, entscheidet ihr selbst, die Rechnung bleibt gleich. Die vorbelegten Werte sind ein Beispiel. Eure Eingaben bleiben im Browser und werden weder gespeichert noch gesendet.',
			],
			[
				'Die Formel mit Beispiel',
				`Jedes Zimmer zahlt nach seiner Fläche, die Gemeinschaftsfläche wird gleichmäßig auf alle Personen verteilt. Als Formel: Anteil = Miete × (Zimmerfläche + Gemeinschaftsfläche ÷ Personenzahl) ÷ (Summe aller Zimmerflächen + Gemeinschaftsfläche). Beispiel: ${euro(BEISPIEL_MIETE_CENT)} Miete, drei Zimmer mit 12, 18 und 24 m² und ${BEISPIEL_GEMEINSCHAFT} m² Gemeinschaftsfläche. Jedes Zimmer bekommt 6 m² dazu und zählt dann 18, 24 und 30 m², zusammen 72 m². Auf den Cent wird so gerundet, dass die Anteile genau die Miete ergeben. Andere Modelle, etwa gleiche Anteile oder gemischte Aufteilungen, stehen unter [WG-Kosten fair aufteilen](/wg-kosten-aufteilen).`,
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
		tabellen: [
			{
				nach: 'Die Formel mit Beispiel',
				titel: 'Beispiel: 900 Euro Miete nach Zimmergröße',
				kopf: [
					'Zimmer',
					'Fläche',
					'Anteil ohne Gemeinschaftsfläche',
					`Anteil mit ${BEISPIEL_GEMEINSCHAFT} m² Gemeinschaftsfläche`,
				],
				zeilen: [
					...BEISPIEL_ZIMMER.map((m, i) => [
						`Zimmer ${i + 1}`,
						`${m} m²`,
						euro(ohne[i] ?? 0),
						euro(mit[i] ?? 0),
					]),
					['Summe', `${BEISPIEL_ZIMMER.reduce((s, m) => s + m, 0)} m²`, summe(ohne), summe(mit)],
				],
				hinweis:
					'Ohne Gemeinschaftsfläche zahlt jedes Zimmer nur nach der eigenen Fläche. Mit ihr werden die Unterschiede zwischen großen und kleinen Zimmern kleiner.',
			},
		],
		fragen: [
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
	'rundfunkbeitrag-wg': {
		link: 'Rundfunkbeitrag in der WG',
		stand: '2026-10-27',
		erschienen: '2026-10-27',
		titel: 'Rundfunkbeitrag in der WG: wer zahlt, wie teilen | ManaWG',
		beschreibung:
			'Rundfunkbeitrag in der WG: ein Beitrag pro Wohnung, wie sich Mitbewohner abmelden, wie ihr den Betrag fair teilt und was beim Auszug gilt.',
		h1: 'Rundfunkbeitrag in der WG',
		einleitung:
			'In einer WG fällt der Rundfunkbeitrag einmal pro Wohnung an, nicht pro Person. Hier steht, wer zahlen muss, wie sich Mitbewohner abmelden, wenn schon jemand zahlt, und wie ihr den Betrag teilt. Die Seite gibt einen Überblick und ersetzt keine Rechtsberatung. Verbindlich ist, was der Beitragsservice schreibt.',
		abschnitte: [
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
				`Der Beitrag beträgt ${euro(RUNDFUNK_MONAT_CENT)} im Monat je Wohnung. Üblich ist die Zahlung für drei Monate, also ${euro(RUNDFUNK_QUARTAL_CENT)} im Quartal. Auf Wunsch geht es auch halbjährlich (${euro(RUNDFUNK_MONAT_CENT * 6)}) oder jährlich (${euro(RUNDFUNK_MONAT_CENT * 12)}) im Voraus. Die Tabelle zeigt den Betrag bei gleichem Anteil für alle (Stand 27. Oktober 2026, laut rundfunkbeitrag.de). Ändert sich der Beitrag, rechnet ihr neu. Den aktuellen Betrag findet ihr auf rundfunkbeitrag.de. Wie ihr Strom, Internet und Nachzahlungen teilt, steht unter [WG-Nebenkosten](/wg-nebenkosten).`,
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
				`Legt den Beitrag in der [WG-Kasse](/wg-kasse) als Fixkosten an: Betrag ${euro(RUNDFUNK_QUARTAL_CENT)}, Intervall „3 Monate (Quartal)“, bei „Bezahlt von“ die zahlende Person und die Aufteilung „Gleichmäßig“ auf alle, die sich beteiligen. Als erste Fälligkeit nehmt ihr den nächsten Abbuchungstermin. ManaWG bucht den Beitrag dann alle drei Monate automatisch als Ausgabe, und die Anteile fließen in den Saldo ein. Zahlt ihr jährlich, wählt ihr als Intervall 12 Monate und tragt den Jahresbetrag ein.`,
			],
		],
		tabellen: [
			{
				nach: 'Den Beitrag teilen',
				titel: 'Rundfunkbeitrag je Person bei gleichem Anteil',
				kopf: ['Personen', 'Anteil im Monat', 'Anteil im Quartal'],
				zeilen: [2, 3, 4].map((n) => [
					`${n} Personen`,
					euro(RUNDFUNK_MONAT_CENT / n),
					euro(RUNDFUNK_QUARTAL_CENT / n),
				]),
				hinweis: `Grundlage: ${euro(RUNDFUNK_MONAT_CENT)} im Monat, ${euro(RUNDFUNK_QUARTAL_CENT)} im Quartal für die ganze Wohnung. Stand 27. Oktober 2026.`,
			},
		],
		fragen: [
			[
				'Muss jeder in der WG Rundfunkbeitrag zahlen?',
				'Nein. Der Rundfunkbeitrag fällt einmal pro Wohnung an. Eine Person zahlt, die anderen melden sich ab, und die WG teilt den Betrag unter sich.',
			],
			[
				'Wie hoch ist der Rundfunkbeitrag pro Person in der WG?',
				`Der Beitrag gilt je Wohnung und beträgt ${euro(RUNDFUNK_MONAT_CENT)} im Monat (Stand 27. Oktober 2026). Bei gleichem Anteil zahlen zwei Personen je ${euro(RUNDFUNK_MONAT_CENT / 2)}, drei Personen je ${euro(RUNDFUNK_MONAT_CENT / 3)} und vier Personen je ${euro(RUNDFUNK_MONAT_CENT / 4)} im Monat.`,
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
		quellen: [
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
	'splitwise-kostenlos': {
		link: 'Splitwise kostenlos',
		stand: '2026-10-27',
		erschienen: '2026-10-27',
		titel: 'Splitwise kostenlos: Tageslimit und Pro | ManaWG',
		beschreibung:
			'Wie viele Ausgaben erlaubt Splitwise kostenlos pro Tag? Das Limit laut Splitwise-Hilfe, was Pro ergänzt und welche Wege es für WGs mit vielen Einträgen gibt.',
		h1: 'Splitwise kostenlos: Wie viele Ausgaben sind erlaubt?',
		einleitung:
			'Splitwise lässt sich kostenlos nutzen, begrenzt in der kostenlosen Version aber die Zahl neuer Ausgaben pro Tag. Hier steht, was die Hilfeseite von Splitwise dazu sagt, was Pro ergänzt und was ihr tun könnt, wenn das Limit eure WG bremst. Die Angaben stammen von der verlinkten Hilfeseite, abgerufen am 27. Oktober 2026.',
		abschnitte: [
			[
				'Kurz gesagt',
				`Laut Splitwise-Hilfe können kostenlose Nutzer ${SPLITWISE_TAGESLIMIT} Ausgaben pro Tag eintragen (Stand 27. Oktober 2026). Andere Seiten nennen teils andere Zahlen; maßgeblich ist die Hilfeseite von Splitwise.`,
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
				'Wartet bis zum nächsten Tag, wechselt zu Pro oder nutzt eine andere App.\nManaWG ist eine kostenlose WG-App ohne Bezahlstufe und kennt kein Tages- oder Monatslimit für Ausgaben. Sie rechnet nur in Euro, gibt es auf Deutsch und Englisch und fasst bis zu 20 aktive Mitglieder.\nAlte Ausgaben aus Splitwise übernehmt ihr per CSV-Import mit Vorschau, siehe [Umstieg](/splitwise-splid-wechseln). Einen Vergleich findet ihr unter [Splitwise-Alternative](/splitwise-alternative).',
			],
		],
		tabellen: [
			{
				nach: 'Was Splitwise Pro ergänzt',
				titel: 'Splitwise Pro laut Hilfeseite',
				kopf: ['Funktion', 'kostenlos', 'Pro'],
				zeilen: [
					['Ausgaben', `bis zu ${SPLITWISE_TAGESLIMIT} pro Tag`, 'unbegrenzt'],
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
				hinweis: 'Quelle: Splitwise-Hilfe, abgerufen am 27. Oktober 2026.',
			},
		],
		fragen: [
			[
				'Ist Splitwise noch kostenlos?',
				`Ja, mit Grenzen: laut Splitwise-Hilfe ${SPLITWISE_TAGESLIMIT} Ausgaben pro Tag in der kostenlosen Version.`,
			],
			[
				'Wie viele Ausgaben pro Tag erlaubt Splitwise kostenlos?',
				`Laut Splitwise-Hilfe ${SPLITWISE_TAGESLIMIT}, Stand 27. Oktober 2026.`,
			],
			[
				'Kann ich meine Splitwise-Daten mitnehmen?',
				'Liegen eure Ausgaben als CSV-Datei vor, importiert ManaWG sie mit Vorschau. Übernommen werden Beträge in Euro.',
			],
		],
		quellen: [
			[
				'Splitwise-Hilfe: What is Splitwise Pro?',
				'https://kb.splitwise.com/pro/what-is-splitwise-pro',
			],
			['Splitwise Pro', 'https://www.splitwise.com/pro'],
		],
	},
};
