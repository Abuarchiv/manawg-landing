// Zwei Zeilen des App-Standbilds hängen vom heutigen Tag ab: Hero-Handy und Installieren-Geräte setzen sie
// aus derselben Quelle (gleicher Stichtag, gleiche Termine).
const KURZ = new Intl.DateTimeFormat('de-DE', {
	timeZone: 'UTC',
	weekday: 'short',
	day: 'numeric',
	month: 'short',
});
export function datumsZeilen(): [string, string] {
	const p: Record<string, string> = Object.fromEntries(
		new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Europe/Berlin',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		})
			.formatToParts(new Date())
			.map((x) => [x.type, x.value]),
	);
	const tag = (k: number) => Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day) + k, 12);
	const dow = new Date(tag(0)).getUTCDay();
	const freitag = (5 - dow + 7) % 7 || 7;
	return [`${KURZ.format(tag(2))} · Lina`, `${KURZ.format(tag(freitag))} · 18:00`];
}
