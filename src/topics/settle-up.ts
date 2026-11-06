import type { Locale } from '../lib/locale.ts';

export const MIN_PEOPLE = 2;
/** Up to this many people the search for the fewest transfers is exhaustive. */
export const MAX_PEOPLE = 16;
/** Largest amount per person in cents (one million euros), far below any integer limit. */
const MAX_CENT = 100_000_000;

/** The example on the calculator page and in its text: shares of 100 euros, balances +120, +20, -80, -60. */
export const EXAMPLE_NAMES = ['Lea', 'Tim', 'Jonas', 'Mia'];
export const EXAMPLE_PAID_CENT = [22000, 12000, 2000, 4000];

export interface Transfer {
	/** Index of the person who pays. */
	from: number;
	/** Index of the person who receives. */
	to: number;
	cent: number;
}

/**
 * Amount typed by a person as whole cents. Empty means 0. Only the notation of the page language
 * is accepted: German has "." for thousands in groups of three and "," for the decimals, English
 * the other way round; a single separator before 1 or 2 digits also counts as the decimal mark
 * ("12.5" and "12,5" on both pages). At most 2 decimals. Anything else (repeated or mixed
 * separators, "1,234.50" on the German page, "1.234,50" on the English page, a third decimal),
 * negative or too large yields null. The cents come from the digits, not from a float.
 */
export function parseCents(input: string, locale: Locale = 'de'): number | null {
	const text = input.trim();
	if (text === '') return 0;
	const [group, decimal] = locale === 'en' ? [',', '.'] : ['.', ','];
	const g = `\\${group}`;
	const d = `\\${decimal}`;
	const grouped = new RegExp(`^(\\d{1,3}(?:${g}\\d{3})+)(?:${d}(\\d{1,2}))?$`).exec(text);
	const plain = new RegExp(`^(\\d*)(?:${d}(\\d{0,2}))?$`).exec(text);
	const other = new RegExp(`^(\\d*)${g}(\\d{1,2})$`).exec(text);
	const match = grouped ?? plain ?? other;
	if (!match) return null;
	const whole = (match[1] ?? '').split(group).join('');
	const fraction = match[2] ?? '';
	if (whole === '' && fraction === '') return null;
	if (whole.replace(/^0+/, '').length > 9) return null;
	const cent = Number(whole || '0') * 100 + Number(fraction.padEnd(2, '0'));
	return cent > MAX_CENT ? null : cent;
}

/**
 * Equal shares of a total in cents. Everyone gets floor(total / n), the leftover cents (fewer
 * than n) go one each to the first people of the list, so the shares add up to the total.
 */
export function equalShares(totalCent: number, people: number): number[] {
	const base = Math.floor(totalCent / people);
	const rest = totalCent - base * people;
	return Array.from({ length: people }, (_, i) => base + (i < rest ? 1 : 0));
}

/** Balance per person in cents: paid minus share. Positive receives money, negative pays. */
export function balances(paidCent: number[]): number[] {
	const total = paidCent.reduce((a, b) => a + b, 0);
	const shares = equalShares(total, paidCent.length);
	return paidCent.map((paid, i) => paid - (shares[i] ?? 0));
}

/**
 * Splits the open balances into the largest number of groups that each add up to zero. A group
 * of k people settles with k - 1 transfers, so the most groups give the fewest transfers. The
 * search over all subsets costs O(n * 2^n) and runs for at most MAX_PEOPLE open balances; with
 * more it returns one group and the greedy pass may need extra transfers.
 */
function zeroSumGroups(open: number[], balance: number[]): number[][] {
	const size = open.length;
	if (size < 2 || size > MAX_PEOPLE) return [open];
	const total = 1 << size;
	const sum = new Float64Array(total);
	const best = new Uint8Array(total);
	const last = new Int8Array(total);
	for (let mask = 1; mask < total; mask++) {
		const low = 31 - Math.clz32(mask & -mask);
		sum[mask] = (sum[mask & (mask - 1)] ?? 0) + (balance[open[low] ?? 0] ?? 0);
		const closes = sum[mask] === 0 ? 1 : 0;
		for (let i = 0; i < size; i++) {
			if (!(mask & (1 << i))) continue;
			const value = (best[mask ^ (1 << i)] ?? 0) + closes;
			if (value >= (best[mask] ?? 0)) {
				best[mask] = value;
				last[mask] = i;
			}
		}
	}
	const groups: number[][] = [];
	let group: number[] = [];
	for (let mask = total - 1; mask > 0; ) {
		const i = last[mask] ?? 0;
		group.push(open[i] ?? 0);
		mask ^= 1 << i;
		if (sum[mask] === 0) {
			groups.push(group.sort((a, b) => a - b));
			group = [];
		}
	}
	return groups.sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));
}

/** Largest creditor is paid by the largest debtor first; ties go to the earlier person in the list. */
function settleGroup(group: number[], balance: number[]): Transfer[] {
	const left = new Map(group.map((i) => [i, balance[i] ?? 0]));
	const creditors = group
		.filter((i) => (left.get(i) ?? 0) > 0)
		.sort((a, b) => (left.get(b) ?? 0) - (left.get(a) ?? 0) || a - b);
	const debtors = group
		.filter((i) => (left.get(i) ?? 0) < 0)
		.sort((a, b) => (left.get(a) ?? 0) - (left.get(b) ?? 0) || a - b);
	const transfers: Transfer[] = [];
	let d = 0;
	let c = 0;
	while (d < debtors.length && c < creditors.length) {
		const from = debtors[d] ?? 0;
		const to = creditors[c] ?? 0;
		const cent = Math.min(-(left.get(from) ?? 0), left.get(to) ?? 0);
		transfers.push({ from, to, cent });
		left.set(from, (left.get(from) ?? 0) + cent);
		left.set(to, (left.get(to) ?? 0) - cent);
		if (left.get(from) === 0) d++;
		if (left.get(to) === 0) c++;
	}
	return transfers;
}

/**
 * The fewest transfers that bring every balance to zero. The balances must add up to zero.
 * The same input always gives the same transfers: ties are broken by the order of the list.
 */
export function settle(balance: number[]): Transfer[] {
	const open = balance.flatMap((cent, i) => (cent === 0 ? [] : [i]));
	return zeroSumGroups(open, balance).flatMap((group) => settleGroup(group, balance));
}
