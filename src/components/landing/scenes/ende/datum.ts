// Zwei Zeilen des App-Standbilds hängen vom heutigen Tag ab: Hero-Handy und Installieren-Geräte setzen sie
// aus derselben Quelle (gleicher Stichtag, gleiche Termine).
const KURZ = new Intl.DateTimeFormat('de-DE', {
	timeZone: 'UTC',
	weekday: 'short',
	day: 'numeric',
	month: 'short',
});
// Feste Uhr der App-Vorschau (public/app-demo/demo.js, REF_NOW): Standbild und Live-Vorschau zeigen denselben Tag
const REF_NOW = Date.parse('2026-10-06T15:43:00Z');
export function datumsZeilen(): [string, string] {
	const p: Record<string, string> = Object.fromEntries(
		new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Europe/Berlin',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		})
			.formatToParts(REF_NOW)
			.map((x) => [x.type, x.value]),
	);
	const tag = (k: number) => Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day) + k, 12);
	// Heizungsableser und Müll runterbringen, beide übermorgen (Seed in tools/app-demo/demo-server.mjs)
	return [`${KURZ.format(tag(2))} · 10:00`, `${KURZ.format(tag(2))} · Lina`];
}
