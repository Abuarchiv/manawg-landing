// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	dayNumber,
	dayShares,
	EXAMPLE_BILL_CENT,
	EXAMPLE_PEOPLE,
	EXAMPLE_PERIOD,
	inclusiveDays,
	personDays,
} from './day-split.ts';

test('both ends count: one day is 1, a month is its length', () => {
	assert.equal(inclusiveDays('2026-03-15', '2026-03-15'), 1);
	assert.equal(inclusiveDays('2026-05-01', '2026-05-31'), 31);
	assert.equal(inclusiveDays('2026-05-31', '2026-05-01'), null);
});

test('leap years: 29 February exists in 2024 only, the year has 366 days', () => {
	assert.equal(inclusiveDays('2024-01-01', '2024-12-31'), 366);
	assert.equal(inclusiveDays('2026-01-01', '2026-12-31'), 365);
	assert.equal(inclusiveDays('2024-02-28', '2024-03-01'), 3);
	assert.equal(inclusiveDays('2025-02-28', '2025-03-01'), 2);
	assert.equal(inclusiveDays('1900-02-28', '1900-03-01'), 2);
	assert.equal(inclusiveDays('2000-02-28', '2000-03-01'), 3);
	assert.notEqual(dayNumber('2024-02-29'), null);
	assert.equal(dayNumber('2025-02-29'), null);
});

test('summer time does not shift a day', () => {
	assert.equal(inclusiveDays('2026-03-28', '2026-03-30'), 3);
	assert.equal(inclusiveDays('2026-10-24', '2026-10-26'), 3);
});

test('text that is not a date is rejected', () => {
	for (const bad of ['', '2026-02-30', '2026-13-01', '2026-1-1', '01.02.2026', '1800-01-01'])
		assert.equal(dayNumber(bad), null, bad);
});

test('empty dates mean the whole period, days outside it are cut off', () => {
	const period = { from: '2026-01-01', to: '2026-12-31' };
	assert.equal(personDays(period, '', ''), 365);
	assert.equal(personDays(period, '2025-06-01', '2027-06-01'), 365);
	assert.equal(personDays(period, '2026-06-01', ''), 214);
	assert.equal(personDays(period, '', '2026-05-31'), 151);
	assert.equal(personDays(period, '2026-07-04', '2026-07-04'), 1);
	assert.equal(personDays(period, '2025-01-01', '2025-12-31'), 0);
	assert.equal(personDays(period, '2026-06-02', '2026-06-01'), null);
	assert.equal(personDays(period, '2026-02-30', ''), null);
	// One empty bound with a date outside the period: the person was not there, that is 0 days.
	assert.equal(personDays(period, '', '2025-12-31'), 0);
	assert.equal(personDays(period, '2027-01-01', ''), 0);
	assert.equal(personDays(period, '', '2026-01-01'), 1);
	assert.equal(personDays(period, '2026-12-31', ''), 1);
});

test('shares add up to the bill, the largest remainder gets the leftover cent', () => {
	assert.deepEqual(dayShares(10000, [1, 1, 1]), [3334, 3333, 3333]);
	assert.deepEqual(dayShares(100, [2, 1]), [67, 33]);
	assert.deepEqual(dayShares(1, [1, 1, 1]), [1, 0, 0]);
	assert.deepEqual(dayShares(0, [4, 5]), [0, 0]);
	assert.equal(dayShares(5000, [0, 0]), null);
});

test('the example: three people, 730 person days, sum equals the bill', () => {
	const days = EXAMPLE_PEOPLE.map((p) => personDays(EXAMPLE_PERIOD, p.from, p.to) ?? 0);
	assert.deepEqual(days, [365, 151, 214]);
	const shares = dayShares(EXAMPLE_BILL_CENT, days);
	assert.deepEqual(shares, [61728, 25537, 36191]);
	assert.equal(
		shares?.reduce((a, b) => a + b, 0),
		EXAMPLE_BILL_CENT,
	);
});

test('random bills and days: exact sum, within one cent of the exact share, zero days get nothing', () => {
	let seed = 11;
	const next = (max: number) => {
		seed = (seed * 1103515245 + 12345) % 2147483648;
		return seed % max;
	};
	for (let round = 0; round < 500; round++) {
		const days = Array.from({ length: 2 + next(15) }, () => (next(4) === 0 ? 0 : 1 + next(3659)));
		if (days.every((d) => d === 0)) continue;
		const bill = next(100_000_000);
		const shares = dayShares(bill, days) ?? [];
		const all = days.reduce((a, b) => a + b, 0);
		assert.equal(
			shares.reduce((a, b) => a + b, 0),
			bill,
		);
		shares.forEach((s, i) => {
			const exact = (bill * (days[i] ?? 0)) / all;
			assert.ok(Math.abs(s - exact) < 1, `${bill} ${days} ${i}`);
			if (days[i] === 0) assert.equal(s, 0);
		});
	}
});
