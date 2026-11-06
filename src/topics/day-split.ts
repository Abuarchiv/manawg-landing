/** Largest period the calculator accepts, in days (ten years); keeps every product far below the integer limit. */
export const MAX_PERIOD_DAYS = 3660;
export const MIN_PEOPLE = 2;
export const MAX_PEOPLE = 16;

const DAY_MS = 86_400_000;

/**
 * Day number of an ISO date (YYYY-MM-DD), counted in whole UTC days, so leap years are right and
 * summer time never shifts a day. Null for text that is not a real calendar date (1900 to 2200).
 */
export function dayNumber(iso: string): number | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!m) return null;
	const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
	if (year < 1900 || year > 2200) return null;
	const ms = Date.UTC(year, month - 1, day);
	const check = new Date(ms);
	const real =
		check.getUTCFullYear() === year &&
		check.getUTCMonth() === month - 1 &&
		check.getUTCDate() === day;
	return real ? ms / DAY_MS : null;
}

/** Days from `from` to `to`, both ends counted: the same day is 1 day. Null if a date is invalid or `to` is before `from`. */
export function inclusiveDays(from: string, to: string): number | null {
	const a = dayNumber(from);
	const b = dayNumber(to);
	return a === null || b === null || b < a ? null : b - a + 1;
}

/**
 * Days a person counts within the period. An empty date means the start or the end of the period,
 * days outside the period are ignored. Null if a date is invalid or, when both are given, the
 * person's end is before the start; 0 if the person's days lie entirely outside the period, also
 * when only one date is given.
 */
export function personDays(
	period: { from: string; to: string },
	from: string,
	to: string,
): number | null {
	const periodFrom = dayNumber(period.from);
	const periodTo = dayNumber(period.to);
	const given = (text: string) => (text.trim() === '' ? undefined : dayNumber(text));
	const first = given(from);
	const last = given(to);
	if (periodFrom === null || periodTo === null || first === null || last === null) return null;
	if (first !== undefined && last !== undefined && last < first) return null;
	const start = Math.max(first ?? periodFrom, periodFrom);
	const end = Math.min(last ?? periodTo, periodTo);
	return Math.max(0, end - start + 1);
}

/**
 * Shares of a bill in cents, proportional to each person's days. Everyone gets the floor of
 * total × days ÷ all days; the leftover cents (fewer than the number of people with days) go one
 * each to the largest fractional parts, ties to the earlier person in the list. The shares add up
 * to the total exactly and nobody without days gets a cent. Null if nobody has any day.
 */
export function dayShares(totalCent: number, days: number[]): number[] | null {
	const all = days.reduce((a, b) => a + b, 0);
	if (all === 0) return null;
	const numerators = days.map((d) => totalCent * d);
	const shares = numerators.map((x) => Math.floor(x / all));
	const rest = numerators.map((x) => x % all);
	const remaining = totalCent - shares.reduce((a, b) => a + b, 0);
	const order = [...rest.keys()].sort((a, b) => (rest[b] ?? 0) - (rest[a] ?? 0) || a - b);
	for (const i of order.slice(0, remaining)) shares[i] = (shares[i] ?? 0) + 1;
	return shares;
}

/** The example on the calculator page and in its text: a year of electricity with a move-out and a move-in. */
export const EXAMPLE_PERIOD = { from: '2026-01-01', to: '2026-12-31' };
export const EXAMPLE_BILL_CENT = 123456;
export const EXAMPLE_PEOPLE: Array<{ name: string; from: string; to: string }> = [
	{ name: 'Anna', from: '', to: '' },
	{ name: 'Ben', from: '', to: '2026-05-31' },
	{ name: 'Cem', from: '2026-06-01', to: '' },
];
