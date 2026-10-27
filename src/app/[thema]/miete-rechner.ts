/**
 * Mietanteil je Zimmer in Cent: Miete × (Zimmer + Gemeinschaft / n) / (Σ Zimmer + Gemeinschaft).
 * Flächen in m², auf 0,1 m² gerundet. Gerundet wird auf Cent, der Rest geht an die größten
 * Nachkommaanteile, sodass die Summe immer genau der Miete entspricht.
 */
export function mieteAnteile(mieteCent: number, zimmer: number[], gemeinschaft: number): number[] {
	const n = zimmer.length;
	const z = zimmer.map((m) => Math.round(m * 10));
	const g = Math.round(gemeinschaft * 10);
	const nenner = (z.reduce((a, b) => a + b, 0) + g) * n;
	const zaehler = z.map((m) => mieteCent * (m * n + g));
	const anteile = zaehler.map((x) => (x - (x % nenner)) / nenner);
	const rest = zaehler.map((x) => x % nenner);
	const offen = mieteCent - anteile.reduce((a, b) => a + b, 0);
	const reihenfolge = [...rest.keys()].sort((a, b) => (rest[b] ?? 0) - (rest[a] ?? 0) || a - b);
	for (const i of reihenfolge.slice(0, offen)) anteile[i] = (anteile[i] ?? 0) + 1;
	return anteile;
}

/** Cent als Euro-Text mit Komma, z. B. 22500 wird zu "225,00 €". */
export const euro = (cent: number): string =>
	`${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(cent / 100)} €`;

/**
 * Zahl in deutscher Schreibweise: Punkte vor drei Ziffern sind Tausendertrenner ("1.200" ist 1200),
 * ein Komma ist das Dezimalzeichen. Leer oder ungültig ergibt 0.
 */
export function zahl(s: string): number {
	const t = s.trim();
	const klar = /,|^\d{1,3}(\.\d{3})+$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : t;
	const x = Number.parseFloat(klar);
	return Number.isFinite(x) && x > 0 ? x : 0;
}
