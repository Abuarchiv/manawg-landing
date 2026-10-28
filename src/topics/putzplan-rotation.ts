/**
 * Rundlauf-Rotation: In Woche w übernimmt Person (a - w) mod n die Aufgabe a.
 * Jede Woche rückt jede Person eine Aufgabe weiter. Bei mehr Aufgaben als Personen
 * trägt eine Person mehrere Aufgaben pro Woche, bei mehr Personen hat jemand frei.
 */
export function putzplanRotation(
	namen: string[],
	aufgaben: string[],
	wochen = namen.length,
	weekLabel = 'Woche',
) {
	const n = namen.length;
	return {
		kopf: [weekLabel, ...aufgaben],
		zeilen: Array.from({ length: wochen }, (_, w) => [
			`${weekLabel} ${w + 1}`,
			...aufgaben.map((_, a) => namen[(((a - w) % n) + n) % n] ?? ''),
		]),
	};
}

/** Tabelle als CSV (Trenner `sep`, Standard Semikolon; CRLF, BOM vorn), von Generator und Download gemeinsam genutzt. */
export function tabelleAlsCsv(kopf: string[], zeilen: string[][], sep = ';'): string {
	const feld = (wert: string): string =>
		wert.includes(sep) || /["\r\n]/.test(wert) ? `"${wert.replace(/"/g, '""')}"` : wert;
	return `\uFEFF${[kopf, ...zeilen].map((zeile) => zeile.map(feld).join(sep)).join('\r\n')}\r\n`;
}
