/**
 * Round-robin rotation: in week w, person (a - w) mod n takes task a.
 * Every week each person moves on by one task. With more tasks than people,
 * a person carries several tasks per week; with more people, someone has the week off.
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

/** Table as CSV (separator `sep`, semicolon by default; CRLF, BOM first), shared by the generator and the download. */
export function tableToCsv(header: string[], rows: string[][], sep = ';'): string {
	const field = (value: string): string =>
		value.includes(sep) || /["\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
	return `\uFEFF${[header, ...rows].map((row) => row.map(field).join(sep)).join('\r\n')}\r\n`;
}
