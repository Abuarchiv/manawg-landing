import { INTL_LOCALE, type Locale } from '../lib/locale.ts';

/**
 * Mietanteil je Zimmer in Cent: Miete × (Zimmer + Gemeinschaft / n) / (Σ Zimmer + Gemeinschaft).
 * Flächen in m², auf 0,1 m² gerundet. Gerundet wird auf Cent, der Rest geht an die größten
 * Nachkommaanteile, sodass die Summe immer genau der Miete entspricht.
 */
export function rentShares(rentCent: number, rooms: number[], shared: number): number[] {
	const n = rooms.length;
	const z = rooms.map((m) => Math.round(m * 10));
	const g = Math.round(shared * 10);
	const denominator = (z.reduce((a, b) => a + b, 0) + g) * n;
	const numerators = z.map((m) => rentCent * (m * n + g));
	const shares = numerators.map((x) => (x - (x % denominator)) / denominator);
	const rest = numerators.map((x) => x % denominator);
	const remaining = rentCent - shares.reduce((a, b) => a + b, 0);
	const order = [...rest.keys()].sort((a, b) => (rest[b] ?? 0) - (rest[a] ?? 0) || a - b);
	for (const i of order.slice(0, remaining)) shares[i] = (shares[i] ?? 0) + 1;
	return shares;
}

/** Cent als Euro-Text, z. B. 22500 wird zu "225,00 €" (de) beziehungsweise "€225.00" (en). */
export const euro = (cent: number, locale: Locale = 'de'): string => {
	if (locale === 'de') {
		return `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(cent / 100)} €`;
	}
	const amount = new Intl.NumberFormat(INTL_LOCALE[locale], { minimumFractionDigits: 2 }).format(
		Math.abs(cent) / 100,
	);
	return `${cent < 0 ? '-' : ''}€${amount}`;
};

/**
 * Zahl in deutscher Schreibweise: Punkte vor drei Ziffern sind Tausendertrenner ("1.200" ist 1200),
 * ein Komma ist das Dezimalzeichen. Leer oder ungültig ergibt 0.
 */
export function parseAmount(s: string, locale: Locale = 'de'): number {
	const t = s.trim();
	// English: comma = thousands, point = decimal; one comma followed by 1-2 digits is a decimal comma.
	const english = /^\d*,\d{1,2}$/.test(t) ? t.replace(',', '.') : t.replace(/,/g, '');
	const german = /,|^\d{1,3}(\.\d{3})+$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : t;
	const normalised = locale === 'en' ? english : german;
	const x = Number.parseFloat(normalised);
	return Number.isFinite(x) && x > 0 ? x : 0;
}
