// Die acht Orte der WG (Planet, Körper): [Name, Zeile, Titel, Detail, Betrag].
/** Ein Ort: [Name, Zeile, Titel, Detail, Betrag]. */
export type Ort = readonly [
	name: string,
	zeile: string,
	titel: string,
	detail: string,
	betrag: string,
];

export const PL = [
	[
		'Ausgaben',
		'Wer zahlt, trägt ein. ManaWG teilt auf.',
		'Pizzaabend',
		'Mika bezahlt · 4 Personen',
		'28,40 €',
	],
	[
		'Einkauf',
		'Eine Liste für alle. Wer einkauft, hakt ab.',
		'Hafermilch',
		'2 Packungen · von Mika',
		'',
	],
	['Putzen', 'Ein Plan, der reihum geht.', 'Bad putzen', 'Lea · heute', ''],
	[
		'Pinnwand',
		'Absprachen, die stehen bleiben.',
		'Übergabe am Freitag',
		'Jona · Schlüssel liegen im Flur bereit.',
		'',
	],
	[
		'Fixkosten',
		'Miete, Strom und Internet mit Fälligkeit.',
		'Internet',
		'29,99 € monatlich · nächste Zahlung am 3.',
		'',
	],
	[
		'Vorräte',
		'Was im Haus ist, mit Mindestbestand.',
		'Toilettenpapier',
		'2 Packungen · Mindestbestand 1',
		'',
	],
	['Kalender', 'Termine für die ganze WG.', 'Putzplan-Check', 'Freitag · 18:00 Uhr', ''],
	['Chat', 'Nachrichten in der WG.', 'In der WG', '„Bin um acht wieder da.“ · Lea', ''],
] as const satisfies readonly Ort[];
