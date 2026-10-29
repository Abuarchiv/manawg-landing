/**
 * Rundlauf-Rotation: In Woche w übernimmt Person (a - w) mod n die Aufgabe a.
 * Jede Woche rückt jede Person eine Aufgabe weiter. Bei mehr Aufgaben als Personen
 * trägt eine Person mehrere Aufgaben pro Woche, bei mehr Personen hat jemand frei.
 */
export function cleaningRota(
	names: string[],
	tasks: string[],
	weeks = names.length,
	weekLabel = 'Woche',
) {
	const n = names.length;
	return {
		header: [weekLabel, ...tasks],
		rows: Array.from({ length: weeks }, (_, w) => [
			`${weekLabel} ${w + 1}`,
			...tasks.map((_, a) => names[(((a - w) % n) + n) % n] ?? ''),
		]),
	};
}

/** Tabelle als CSV (Trenner `sep`, Standard Semikolon; CRLF, BOM vorn), von Generator und Download gemeinsam genutzt. */
export function tableToCsv(header: string[], rows: string[][], sep = ';'): string {
	const field = (value: string): string =>
		value.includes(sep) || /["\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
	return `\uFEFF${[header, ...rows].map((row) => row.map(field).join(sep)).join('\r\n')}\r\n`;
}
