// Guides for starting, moving into and leaving a flat share. General tips, not legal advice.
// Only name ManaWG features where manawg-app really has them (see topics.ts).
import type { Topic } from '../types.ts';

export const GUIDES_DE_MOVING: Record<string, Topic> = {
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
	'wg-abkuerzungen': {
		link: 'WG-Abkürzungen',
		updated: '2026-10-29',
		published: '2026-10-29',
		title: 'WG-Anzeigen-Abkürzungen: NK, KM, WM, ZW erklärt | ManaWG',
		description:
			'WG-Anzeigen-Abkürzungen erklärt: NK, KM, WM, ZW, BK, HK, EG, OG, DG und mehr, mit Bedeutung, Hinweisen aus der Praxis und Links zu den passenden Ratgebern.',
		h1: 'WG-Anzeigen-Abkürzungen erklärt: NK, KM, WM, ZW und mehr',
		intro:
			'In WG-Anzeigen steht viel in Kurzform: „14 m², möbl., 420 € WM inkl. NK, ab sofort“. Wer neu in Deutschland ist oder zum ersten Mal ein WG-Zimmer sucht, rät schnell falsch. Diese Seite erklärt die häufigsten Begriffe in drei Tabellen und verweist auf die passenden Ratgeber. Abkürzungen sind nicht genormt, und nicht jede Anzeige meint dasselbe. Fragt im Zweifel nach, bevor ihr zusagt. Die Seite ersetzt keine Rechtsberatung.',
		sections: [
			[
				'Miete und Kosten',
				'Entscheidend ist, was in der Miete steckt und was dazukommt. KM ist die Kaltmiete, WM die Warmmiete, und NK, BK und HK sind die Nebenkosten, Betriebskosten und Heizkosten. Welche Posten in der WM stecken, erklärt der Ratgeber [WG-Nebenkosten](/wg-nebenkosten), den Rundfunkbeitrag beschreibt die Seite [Rundfunkbeitrag in der WG](/rundfunkbeitrag-wg). Was bei der Kaution gilt, steht unter [Kaution in der WG](/wg-kaution).',
			],
			[
				'Wohnung und Zimmer',
				'Hier geht es darum, wie die Wohnung aufgebaut ist und was im Zimmer steht. Wer aus dem Ausland kommt, achtet auf die Zählweise der Etagen: Das Erdgeschoss (EG) ist die unterste Etage, das 1. OG liegt darüber und entspricht dem britischen „first floor“.',
			],
			[
				'Vertrag und Einzug',
				'Diese Begriffe betreffen Vertrag, Einzug und Kennenlernen. Welche Vertragsform zu euch passt, steht unter [WG-Mietvertrag](/wg-mietvertrag), die befristete Untervermietung beschreibt [Zwischenmiete in der WG](/wg-zwischenmiete). Zur Anmeldung beim Bürgeramt gibt es den Ratgeber [Anmeldung in der WG](/wg-anmeldung), Fragen für das Kennenlernen sammelt [WG-Casting: Fragen](/wg-casting-fragen).',
			],
			[
				'Beispielanzeige entschlüsselt',
				'„3-Zi-WG, 14 m², möbl., 420 € WM inkl. NK und Internet, Kaution 2 KM, ab 01.12. frei, befristet bis 31.03., Anmeldung möglich“ heißt: Eine Wohnung mit drei Zimmern, in der ein 14 m² großes, möbliertes Zimmer frei wird. Die Warmmiete von 420 € enthält Nebenkosten und Internet. Die Kaution beträgt zwei Kaltmieten, was unter der Obergrenze von drei liegt. Einziehen könnt ihr ab dem 1. Dezember, der Vertrag endet am 31. März, und ihr könnt euch an der Adresse anmelden. Die Anzeige ist ausgedacht.',
			],
			[
				'Diese Fragen stellt ihr vor der Zusage',
				'1. Welche Vertragsform gilt: Hauptmietvertrag, Untermiete oder Einzelvertrag?\n2. Was steckt in der Warmmiete, und was kommt dazu?\n3. Wie hoch ist die Kaution, und an wen geht sie?\n4. Gibt es eine Befristung, und was steht im Vertrag zum Enddatum?\n5. Ist die Anmeldung möglich, und wer stellt die Wohnungsgeberbestätigung aus?\n6. Was gehört zum Zimmer, und gibt es eine Inventarliste?\n7. Muss ich etwas an den Vormieter zahlen, und wofür genau?',
			],
		],
		tables: [
			{
				after: 'Miete und Kosten',
				title: 'Miete und Kosten: Abkürzungen in WG-Anzeigen',
				header: ['Begriff', 'Bedeutung', 'Hinweis'],
				rows: [
					[
						'KM',
						'Kaltmiete, die Miete ohne Neben- und Heizkosten',
						'Grundlage für die Kaution, höchstens drei Nettokaltmieten',
					],
					[
						'WM',
						'Warmmiete, Miete mit Heiz- und Betriebskosten',
						'Der Gesamtbetrag, den ihr monatlich zahlt. WM kann auch Waschmaschine heißen, der Zusammenhang zeigt es',
					],
					[
						'NK',
						'Nebenkosten, etwa Wasser, Müll und Hausreinigung, je nach Anzeige auch Heizung',
						'Klärt, ob sie als Vorauszahlung mit Abrechnung oder als Pauschale gelten',
					],
					[
						'BK',
						'Betriebskosten, rechtlich fast dasselbe wie Nebenkosten',
						'In Anzeigen unklar, fragt nach, was enthalten ist',
					],
					[
						'HK',
						'Heizkosten',
						'Manchmal getrennt genannt: KM + NK + HK ergibt die Gesamtmiete, wenn die NK keine Heizung enthalten',
					],
					[
						'inkl. / zzgl.',
						'inklusive (ist enthalten) / zuzüglich (kommt oben drauf)',
						'„zzgl. NK“ heißt, dass Nebenkosten noch dazukommen',
					],
					[
						'Kaution (KT)',
						'Mietsicherheit, die ihr zu Beginn hinterlegt',
						'Höchstens drei Nettokaltmieten, zahlbar in drei Raten',
					],
					[
						'Ablöse',
						'Zahlung an den Vormieter für Möbel, Küche oder Einbauten',
						'Der Kauf von Einrichtung ist möglich, der Preis darf aber nicht in auffälligem Missverhältnis zum Wert stehen (sonst insoweit unwirksam, § 4a Abs. 2 WoVermRG). Eine Zahlung nur dafür, dass der Vormieter auszieht, ist unwirksam (§ 4a Abs. 1), nachgewiesene Umzugskosten dürfen erstattet werden',
					],
					[
						'Rundfunkbeitrag (früher GEZ)',
						'Pflichtbeitrag für den öffentlich-rechtlichen Rundfunk',
						'Er gilt je Wohnung, nicht je Person. Eine Person meldet an, die WG teilt',
					],
				],
				note: 'Stand 29. Oktober 2026. Abkürzungen sind nicht genormt, die Bedeutung kann je nach Anzeige abweichen.',
			},
			{
				after: 'Wohnung und Zimmer',
				title: 'Wohnung und Zimmer: Abkürzungen in WG-Anzeigen',
				header: ['Begriff', 'Bedeutung', 'Hinweis'],
				rows: [
					[
						'WG',
						'Wohngemeinschaft, mehrere Personen teilen sich eine Wohnung',
						'Fragt immer, welche Vertragsform gilt',
					],
					[
						'Zi. / 3-Zi-WG',
						'Zimmer / Wohnung mit drei Zimmern',
						'Küche und Bad zählen nicht mit. Fragt, ob das Wohnzimmer mitgezählt ist',
					],
					[
						'qm / m²',
						'Quadratmeter',
						'In einer WG meist die Größe des Zimmers, die Miete richtet sich oft danach',
					],
					[
						'EG / OG / DG',
						'Erdgeschoss / Obergeschoss / Dachgeschoss',
						'1. OG ist die Etage über dem Erdgeschoss. Im DG kann es im Sommer heiß werden. Fragt nach dem Aufzug',
					],
					[
						'möbl. / teilmöbl.',
						'möbliert / teilmöbliert',
						'Haltet das Inventar im Vertrag oder in einer Übergabeliste fest',
					],
					[
						'EBK',
						'Einbauküche',
						'Fragt, was in der Küche zur Wohnung gehört und was einzelnen Mitbewohnern gehört',
					],
					[
						'Zweck-WG',
						'WG, in der man vor allem zusammenwohnt, um Kosten zu sparen',
						'Wenig gemeinsamer Alltag. Klärt Erwartungen zu Putzen und Essen vorher',
					],
				],
				note: 'Stand 29. Oktober 2026. Abkürzungen sind nicht genormt, die Bedeutung kann je nach Anzeige abweichen.',
			},
			{
				after: 'Vertrag und Einzug',
				title: 'Vertrag und Einzug: Begriffe in WG-Anzeigen',
				header: ['Begriff', 'Bedeutung', 'Hinweis'],
				rows: [
					[
						'Hauptmieter / Untermieter',
						'Der Hauptmieter hat den Vertrag mit dem Vermieter, der Untermieter mietet von ihm',
						'Die Untervermietung braucht die Erlaubnis des Vermieters',
					],
					[
						'Zwischenmiete (ZW)',
						'befristete Untervermietung, solange der Hauptmieter weg ist',
						'ZW ist nicht genormt und steht oft für Zwischenmiete. Fragt nach',
					],
					[
						'befristet / unbefristet',
						'mit Enddatum / ohne Enddatum',
						'Eine Befristung von Wohnraum braucht in der Regel einen gesetzlichen Grund, bei Untermiete kommt es auf den Fall an',
					],
					[
						'ab sofort',
						'ab jetzt verfügbar',
						'Prüft trotzdem Besichtigung, Vertragsbeginn und Kündigungsfrist des Vormieters',
					],
					[
						'NM',
						'Nachmieter, die Person, die einen laufenden Vertrag oder ein Zimmer übernimmt',
						'Klärt, ob ihr eintretet oder neu mietet',
					],
					[
						'Anmeldung möglich',
						'Ihr könnt euch an der Adresse behördlich anmelden',
						'Frist zwei Wochen nach dem Einzug. Scheinanmeldungen nie anbieten oder annehmen',
					],
					[
						'Wohnungsgeberbestätigung',
						'Formular, das den Einzug bestätigt',
						'Gebraucht für die Anmeldung. Bei Untermiete stellt der Hauptmieter sie aus',
					],
					[
						'WBS',
						'Wohnberechtigungsschein, Nachweis für geförderte Wohnungen',
						'In WG-Anzeigen selten. Grenzen und Stufen ändern sich, fragt bei eurer Stadt',
					],
					[
						'WG-Casting',
						'Kennenlerntermin, bei dem sich Bewerber der WG vorstellen',
						'Bringt eine Fragenliste mit. Zahlt nichts vor Vertrag und Besichtigung',
					],
				],
				note: 'Stand 29. Oktober 2026. Abkürzungen sind nicht genormt, die Bedeutung kann je nach Anzeige abweichen.',
			},
		],
		faq: [
			[
				'Was heißt NK in einer WG-Anzeige?',
				'NK steht für Nebenkosten, also Posten wie Wasser, Müll und Hausreinigung, je nach Anzeige auch Heizung. Klärt, ob sie als Vorauszahlung mit Abrechnung oder als Pauschale gelten.',
			],
			[
				'Was ist der Unterschied zwischen KM und WM?',
				'KM ist die Kaltmiete ohne Neben- und Heizkosten, WM die Warmmiete mit Heiz- und Betriebskosten. Die Kaution richtet sich nach der Kaltmiete.',
			],
			[
				'Was bedeutet ZW bei WG-Zimmern?',
				'ZW ist nicht genormt, steht aber in Anzeigen häufig für Zwischenmiete. Das ist eine befristete Untervermietung, etwa während eines Auslandssemesters. Fragt nach, was gemeint ist.',
			],
			[
				'Was ist ein WG-Casting?',
				'Ein Kennenlerntermin, bei dem eine WG Bewerber trifft, die auf eine Anzeige geantwortet haben. Vorher solltet ihr Vertragsform, Kaution und Warmmiete erfragen.',
			],
		],
		sources: [
			[
				'Hamburg Welcome Center, Abkürzungen in Wohnungsanzeigen (PDF)',
				'https://welcome.hamburg.de/resource/blob/1056182/fcfffaa0bb0b35d7b539efb84532bb2e/abkuerzungen-in-wohnungsanzeigen-data.pdf',
			],
			[
				'Universität Heidelberg, Encyclopaedia of flat hunting',
				'https://www.uni-heidelberg.de/en/study/international-studies/study-in-heidelberg/living-and-accomodation/encyclopaedia-of-flat-hunting',
			],
			[
				'FU Berlin, FAQ zu WGs',
				'https://www.fu-berlin.de/en/sites/principles-cultural-dynamics/FAQs/FUB/WG.html',
			],
			[
				'§ 551 BGB, Begrenzung und Anlage von Mietsicherheiten',
				'https://www.gesetze-im-internet.de/bgb/__551.html',
			],
			['§ 575 BGB, Zeitmietvertrag', 'https://www.gesetze-im-internet.de/bgb/__575.html'],
			[
				'§ 4a WoVermRG, Unwirksame Vereinbarungen',
				'https://www.gesetze-im-internet.de/wovermrg/__4a.html',
			],
			['§ 17 BMG, Anmeldung', 'https://www.gesetze-im-internet.de/bmg/__17.html'],
			[
				'Rundfunkbeitrag, Informationen für Bürgerinnen und Bürger',
				'https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/informationen',
			],
		],
	},
};
