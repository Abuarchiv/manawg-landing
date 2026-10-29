// Two lines of the app still image depend on today's date: the hero phone and the install devices build them
// from the same source (same reference day, same appointments).
const SHORT_DATE = {
	de: new Intl.DateTimeFormat('de-DE', {
		timeZone: 'UTC',
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	}),
	// "Thu 8 Oct"
	en: new Intl.DateTimeFormat('en-GB', {
		timeZone: 'UTC',
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	}),
};
// Fixed clock of the app preview (public/app-demo/demo.js, REF_NOW): still image and live preview show the same day
const REF_NOW = Date.parse('2026-10-06T15:43:00Z');
/** lang: language of the app still the lines are drawn over (APP_DEMO[locale].lang). */
export function dateLines(lang: 'de' | 'en'): [string, string] {
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
	const dayAt = (k: number) => Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day) + k, 12);
	// Heating meter reading and taking out the trash, both the day after tomorrow (seed in landing-konzept/werkzeuge/app-demo/demo-server.mjs)
	const fmt = SHORT_DATE[lang];
	return [`${fmt.format(dayAt(2))} · 10:00`, `${fmt.format(dayAt(2))} · Lina`];
}
