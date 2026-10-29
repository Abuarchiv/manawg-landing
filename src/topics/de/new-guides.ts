// Guide pages: Kaution in der WG and Abkürzungen in WG-Anzeigen. General tips, not legal advice.
// Only name ManaWG features where manawg-app really has them (see topics.ts).
import type { Topic } from '../types.ts';

export const GUIDES_DE_NEW: Record<string, Topic> = {
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
