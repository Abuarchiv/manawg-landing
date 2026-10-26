/**
 * Rundlauf-Rotation: In Woche w übernimmt Person (a - w) mod n die Aufgabe a.
 * Jede Woche rückt jede Person eine Aufgabe weiter. Bei mehr Aufgaben als Personen
 * trägt eine Person mehrere Aufgaben pro Woche, bei mehr Personen hat jemand frei.
 */
export function putzplanRotation(namen: string[], aufgaben: string[], wochen = namen.length) {
	const n = namen.length;
	return {
		kopf: ['Woche', ...aufgaben],
		zeilen: Array.from({ length: wochen }, (_, w) => [
			`Woche ${w + 1}`,
			...aufgaben.map((_, a) => namen[(((a - w) % n) + n) % n] ?? ''),
		]),
	};
}

const csvFeld = (wert: string): string =>
	/[;"\r\n]/.test(wert) ? `"${wert.replace(/"/g, '""')}"` : wert;

/** Tabelle als CSV (Semikolon, CRLF, BOM vorn), von Generator und Download gemeinsam genutzt. */
export function tabelleAlsCsv(kopf: string[], zeilen: string[][]): string {
	return `\uFEFF${[kopf, ...zeilen].map((zeile) => zeile.map(csvFeld).join(';')).join('\r\n')}\r\n`;
}
