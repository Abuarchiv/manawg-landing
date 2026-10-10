// Themenseiten für Suchanfragen, die die Startseite allein nicht abdeckt.
// Nur Funktionen nennen, die es in manawg-app wirklich gibt.

export interface Thema {
	/** Kurzer Linktext für Querverweise. */
	link: string;
	titel: string;
	beschreibung: string;
	h1: string;
	einleitung: string;
	abschnitte: Array<[string, string]>;
	/** Wird zusätzlich als FAQPage-JSON-LD ausgegeben. */
	fragen?: Array<[string, string]>;
	/** Letzte inhaltliche Änderung (ISO-Datum), für lastmod in der Sitemap. */
	stand: string;
}

export const THEMEN: Record<string, Thema> = {
	putzplan: {
		link: 'Putzplan',
		stand: '2026-10-10',
		titel: 'Putzplan für die WG: fair und automatisch | ManaWG',
		beschreibung:
			'Der kostenlose WG-Putzplan von ManaWG: Aufgaben wiederholen sich, rotieren fair weiter und überspringen, wer gerade nicht da ist.',
		h1: 'Der WG-Putzplan, der von selbst weiterläuft',
		einleitung:
			'Ein Putzplan am Kühlschrank hält meistens zwei Wochen. Danach weiß niemand mehr, wer dran ist. In ManaWG legt ihr Aufgaben einmal an, den Rest übernimmt die App.',
		abschnitte: [
			[
				'Aufgaben mit Wiederholung',
				'Bad, Küche, Müll, Flur: Jede Aufgabe bekommt einen Rhythmus. Ist sie erledigt, plant ManaWG den nächsten Termin von selbst ein.',
			],
			[
				'Faire Verteilung',
				'ManaWG zählt mit, wer wie oft dran war und wer Aufgaben hat liegen lassen. Daraus ergibt sich, wer als Nächstes übernimmt.',
			],
			[
				'Abwesenheiten',
				'Wer verreist ist, trägt das ein. Für diese Zeit fällt die Person aus der Verteilung und wird beim Putzplan übersprungen.',
			],
			[
				'Mehr als ein Putzplan',
				'Im selben Haushalt laufen auch Ausgaben, Einkaufsliste, Kalender, Pinnwand und Chat. Ihr braucht keine zweite App.',
			],
		],
	},
	'wg-kasse': {
		link: 'WG-Kasse',
		stand: '2026-10-10',
		titel: 'WG-Kasse: Ausgaben teilen und Schulden sehen | ManaWG',
		beschreibung:
			'Die kostenlose WG-Kasse von ManaWG: Ausgaben gleich oder mit eigenen Beträgen aufteilen, Salden sehen und Schulden mit möglichst wenigen Überweisungen ausgleichen.',
		h1: 'Die WG-Kasse ohne Zettelwirtschaft',
		einleitung:
			'Wer hat das Klopapier bezahlt, wer schuldet wem noch was? ManaWG rechnet das für eure WG mit, jede Ausgabe landet sofort im Saldo aller Beteiligten.',
		abschnitte: [
			[
				'Ausgaben aufteilen',
				'Eine Ausgabe wird gleichmäßig auf die Beteiligten verteilt oder mit eigenen Beträgen pro Person. Wer nicht beteiligt war, zahlt nichts.',
			],
			[
				'Weniger Überweisungen',
				'ManaWG fasst die offenen Beträge zusammen und schlägt vor, wer wem wie viel überweist, damit alle mit möglichst wenigen Zahlungen quitt sind.',
			],
			[
				'Fixkosten und Monatsabrechnung',
				'Miete, Internet, Streaming: Wiederkehrende Kosten legt ihr einmal an. Die Monatsabrechnung zeigt, was im Monat angefallen ist.',
			],
			[
				'Umzug aus Splitwise oder Splid',
				'Bestehende Ausgaben übernehmt ihr per CSV-Import. Beim Import kann ManaWG auch Belege aus einem Foto lesen.',
			],
		],
	},
	einkaufsliste: {
		link: 'Einkaufsliste',
		stand: '2026-10-10',
		titel: 'Gemeinsame Einkaufsliste für die WG | ManaWG',
		beschreibung:
			'Die geteilte Einkaufsliste von ManaWG: Alle tragen ein, alle sehen den Stand, und der Einkauf wird direkt zur geteilten Ausgabe.',
		h1: 'Eine Einkaufsliste für die ganze WG',
		einleitung:
			'Drei Leute, drei Zettel, zweimal Milch gekauft. Mit ManaWG hat die WG eine Liste, die auf jedem Handy gleich aussieht.',
		abschnitte: [
			[
				'Alle schreiben mit',
				'Wer etwas braucht, trägt es ein. Wer einkaufen geht, hakt ab, und alle anderen sehen das sofort.',
			],
			[
				'Vom Einkauf zur Ausgabe',
				'Nach dem Einkauf bietet ManaWG an, die abgehakten Sachen direkt als Ausgabe einzutragen. So landet der Betrag gleich in der WG-Kasse.',
			],
			[
				'Vorräte im Blick',
				'Für Dinge, die immer da sein sollten, gibt es eine Vorratsübersicht. Ihr seht, was zur Neige geht, bevor es fehlt.',
			],
		],
	},
	'splitwise-alternative': {
		link: 'Splitwise-Alternative',
		stand: '2026-10-10',
		titel: 'Splitwise-Alternative für WGs, kostenlos mit Putzplan | ManaWG',
		beschreibung:
			'ManaWG ist eine kostenlose Alternative zu Splitwise und Splid für Wohngemeinschaften: Ausgaben teilen plus Putzplan, Einkaufsliste und Pinnwand. Mit CSV-Import.',
		h1: 'Eine Splitwise-Alternative, die für WGs gebaut ist',
		einleitung:
			'Splitwise und Splid sind gut im Ausgabenteilen. Eine WG hat aber mehr zu organisieren als Geld. ManaWG verbindet die Kasse mit dem Rest des Haushalts.',
		abschnitte: [
			[
				'Daten mitnehmen',
				'Ausgaben aus Splitwise oder Splid übernehmt ihr per CSV-Import. Ihr fangt nicht bei null an.',
			],
			[
				'Alles an einem Ort',
				'Neben der WG-Kasse gibt es Putzplan, gemeinsame Einkaufsliste, Kalender mit Kalender-Abo, Pinnwand und Chat.',
			],
			[
				'Kostenlos und ohne App Store',
				'ManaWG kostet nichts und läuft im Browser. Auf dem Handy legt ihr die App auf den Home-Bildschirm.',
			],
		],
	},
	'flatastic-alternative': {
		link: 'Flatastic-Alternative',
		stand: '2026-10-10',
		titel: 'Flatastic-Alternative: WG-App ohne Werbung und Paywall | ManaWG',
		beschreibung:
			'ManaWG ist eine kostenlose WG-App als Alternative zu Flatastic: Putzplan, WG-Kasse, Einkaufsliste, Kalender, Pinnwand und Chat ohne Werbung und ohne Premium-Stufe.',
		h1: 'Eine WG-App ohne Werbung und ohne Premium',
		einleitung:
			'Flatastic hat die WG-App bekannt gemacht. Wer sie nutzt, kennt die Werbung nach dem Abhaken und die Funktionen hinter der Bezahlschranke. ManaWG macht dasselbe ohne beides.',
		abschnitte: [
			[
				'Keine Werbung, keine Premium-Stufe',
				'Alle Funktionen stehen jeder WG offen. Es gibt keine Anzeigen im Ablauf und keine Stufe, die man kaufen müsste.',
			],
			[
				'Putzplan, der zeigt, wer dran ist',
				'Aufgaben rotieren fair und überspringen, wer verreist ist. Wer als Nächstes dran ist, steht sichtbar in der App.',
			],
			[
				'WG-Kasse mit Monatsabrechnung',
				'Ausgaben teilen, Fixkosten wie Miete anlegen, Salden sehen und am Monatsende die Abrechnung lesen. Bestehende Daten kommen per CSV-Import mit.',
			],
			[
				'Im Browser, ohne App Store',
				'ManaWG läuft unter app.manawg.com und lässt sich auf iPhone und Android auf den Home-Bildschirm legen. Die Daten liegen in Frankfurt am Main.',
			],
		],
	},
	faq: {
		link: 'Häufige Fragen',
		stand: '2026-10-10',
		titel: 'Häufige Fragen zu ManaWG, der WG-App',
		beschreibung:
			'Antworten zu ManaWG: Kosten, Installation, Einladung, Ausgaben teilen, Putzplan, Abwesenheiten und Import aus Splitwise oder Splid.',
		h1: 'Fragen und Antworten',
		einleitung: 'Das Wichtigste zu ManaWG, der kostenlosen App für Wohngemeinschaften.',
		abschnitte: [],
		fragen: [
			['Was kostet ManaWG?', 'Nichts. ManaWG ist kostenlos.'],
			[
				'Brauche ich einen App Store?',
				'Nein. ManaWG läuft im Browser unter app.manawg.com. Auf dem Handy könnt ihr die App auf den Home-Bildschirm legen.',
			],
			[
				'Wie kommen meine Mitbewohner in die WG?',
				'Eine Person erstellt die WG und teilt den Einladungslink. Die anderen öffnen ihn und sind drin.',
			],
			[
				'Wie werden Ausgaben aufgeteilt?',
				'Gleichmäßig auf die Beteiligten oder mit eigenen Beträgen pro Person. ManaWG zeigt, wer wem wie viel schuldet.',
			],
			[
				'Wie funktioniert der Putzplan?',
				'Aufgaben haben einen Rhythmus und rotieren fair weiter. ManaWG zeigt, wer als Nächstes dran ist.',
			],
			[
				'Was passiert, wenn jemand verreist ist?',
				'Abwesenheiten werden eingetragen. In der Zeit wird die Person beim Putzplan übersprungen.',
			],
			[
				'Kann ich Daten aus Splitwise oder Splid mitnehmen?',
				'Ja, per CSV-Import. Beim Import kann ManaWG auch Belege aus einem Foto lesen.',
			],
			[
				'Was gibt es außer Geld und Putzen?',
				'Eine gemeinsame Einkaufsliste mit Vorräten, Fixkosten, einen Kalender, den ihr auch abonnieren könnt, eine Pinnwand und einen Chat.',
			],
		],
	},
};
