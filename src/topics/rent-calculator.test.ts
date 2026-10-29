// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { euro, parseAmount, rentShares } from './rent-calculator.ts';

test('900 euro for 12, 18 and 24 m² without shared area', () => {
	assert.deepEqual(rentShares(90000, [12, 18, 24], 0), [20000, 30000, 40000]);
});

test('900 euro for 12, 18 and 24 m² with 18 m² shared area', () => {
	assert.deepEqual(rentShares(90000, [12, 18, 24], 18), [22500, 30000, 37500]);
});

test('sum always equals the rent, the remainder goes to the largest fractional parts', () => {
	assert.deepEqual(rentShares(100000, [15, 15, 15], 0), [33334, 33333, 33333]);
	for (const [miete, zimmer, gemeinsam] of [
		[123457, [11.5, 17.3, 23.9, 9], 14.7],
		[99999, [10, 10, 10, 10, 10, 10, 10], 3],
		[1, [10, 20, 30], 0],
	] as const) {
		const a = rentShares(miete, [...zimmer], gemeinsam);
		assert.equal(
			a.reduce((s, x) => s + x, 0),
			miete,
		);
	}
});

test('German euro format with comma and non-breaking space', () => {
	assert.equal(euro(22500), '225,00 €');
	assert.equal(euro(33334), '333,34 €');
});

test('German input with thousands point and comma', () => {
	assert.equal(parseAmount('1.200'), 1200);
	assert.equal(parseAmount('1.200,50'), 1200.5);
	assert.equal(parseAmount('900,5'), 900.5);
	assert.equal(parseAmount('12.5'), 12.5);
	assert.equal(parseAmount('1.234.567'), 1234567);
	assert.equal(parseAmount('abc'), 0);
});

test('English euro format: symbol first, point as decimal separator, comma as thousands separator', () => {
	assert.equal(euro(22500, 'en'), '€225.00');
	assert.equal(euro(123456, 'en'), '€1,234.56');
	assert.equal(euro(22500), euro(22500, 'de'));
});

test('English input: comma = thousands, point = decimal, single comma with 1-2 digits = decimal', () => {
	assert.equal(parseAmount('1,200', 'en'), 1200);
	assert.equal(parseAmount('1,200.50', 'en'), 1200.5);
	assert.equal(parseAmount('12.5', 'en'), 12.5);
	assert.equal(parseAmount('900,5', 'en'), 900.5);
	assert.equal(parseAmount('1,234,567', 'en'), 1234567);
	assert.equal(parseAmount('abc', 'en'), 0);
});
