/**
 * FAQ content, kept out of the client component so the JSON-LD can be
 * rendered server-side in the initial HTML (see app/page.tsx) while the
 * accordion itself stays interactive.
 */
export const FAQ_ITEMS = [
	{
		q: 'Ist manawg dauerhaft kostenlos?',
		a: 'Ja. Dauerhaft kostenlos. Kein Werbe-, kein Datenverkaufs-, kein Premium-Plan. ManaWG wird privat betrieben und läuft auf kostenlosen bzw. sehr günstigen Hosting-Angeboten. Sollte sich an dieser Grundlage je etwas ändern müssen, steht das transparent auf der Seite.',
	},
	{
		q: 'Wie viele Mitbewohner kann eine WG haben?',
		a: 'Beliebig viele. Splitwise limitiert dich auf 5 Einträge pro Tag im Free-Plan. Tricount macht nur Geld, keine WG. Bei manawg: füge zwölf Leute hinzu, niemand zuckt.',
	},
	{
		q: 'Was passiert mit meinen Daten, wenn ich aufhöre?',
		a: 'Dein Zugang ist an dein Google-, Apple- oder Facebook-Konto gebunden und nicht nur an ein einzelnes Gerät. So kannst du deine WGs nach der Anmeldung auf weiteren Geräten wiederfinden. Wenn eine WG gelöscht wird, werden die dazugehörigen Daten gelöscht; zusätzliche Löschanfragen kannst du jederzeit per E-Mail stellen (DSGVO-Recht auf Löschung).',
	},
	{
		q: 'Kann ich meine WG-Daten exportieren oder löschen?',
		a: 'Ja. Die WG-Einstellungen enthalten einen Export sämtlicher Daten als JSON sowie eine WG-Löschen-Funktion. Zusätzlich greift dein DSGVO-Recht auf Auskunft, Berichtigung und Löschung — formlos per E-Mail an den Betreiber (siehe Impressum).',
	},
	{
		q: 'Funktioniert manawg auf dem Handy?',
		a: 'Ja. Es ist eine Progressive Web App — installierbar auf iOS und Android über den Browser-Share-Knopf (das Viereck mit Pfeil nach oben → „zum Home-Bildschirm hinzufügen"). Wir bauen keine native App, weil eine PWA für eine WG-Liste völlig reicht und weniger Energie verbraucht.',
	},
] as const;

export const FAQ_JSON_LD = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: FAQ_ITEMS.map((faq) => ({
		'@type': 'Question',
		name: faq.q,
		acceptedAnswer: {
			'@type': 'Answer',
			text: faq.a,
		},
	})),
};
