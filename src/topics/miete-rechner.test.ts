// Lauf: pnpm test (Node-Testrunner, kein Framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { euro, mieteAnteile, zahl } from './miete-rechner.ts';

test('900 Euro bei 12, 18 und 24 m² ohne Gemeinschaftsfläche', () => {
	assert.deepEqual(mieteAnteile(90000, [12, 18, 24], 0), [20000, 30000, 40000]);
});

test('900 Euro bei 12, 18 und 24 m² mit 18 m² Gemeinschaftsfläche', () => {
	assert.deepEqual(mieteAnteile(90000, [12, 18, 24], 18), [22500, 30000, 37500]);
});

test('Summe entspricht immer der Miete, Rest geht an die größten Nachkommaanteile', () => {
	assert.deepEqual(mieteAnteile(100000, [15, 15, 15], 0), [33334, 33333, 33333]);
	for (const [miete, zimmer, gemeinsam] of [
		[123457, [11.5, 17.3, 23.9, 9], 14.7],
		[99999, [10, 10, 10, 10, 10, 10, 10], 3],
		[1, [10, 20, 30], 0],
	] as const) {
		const a = mieteAnteile(miete, [...zimmer], gemeinsam);
		assert.equal(
			a.reduce((s, x) => s + x, 0),
			miete,
		);
	}
});

test('Euro-Format mit Komma und festem Leerzeichen', () => {
	assert.equal(euro(22500), '225,00 €');
	assert.equal(euro(33334), '333,34 €');
});

test('Eingabe mit Tausenderpunkt und Komma', () => {
	assert.equal(zahl('1.200'), 1200);
	assert.equal(zahl('1.200,50'), 1200.5);
	assert.equal(zahl('900,5'), 900.5);
	assert.equal(zahl('12.5'), 12.5);
	assert.equal(zahl('1.234.567'), 1234567);
	assert.equal(zahl('abc'), 0);
});

test('Euro-Format englisch: Symbol vorn, Punkt als Dezimalzeichen, Komma als Tausendertrenner', () => {
	assert.equal(euro(22500, 'en'), '€225.00');
	assert.equal(euro(123456, 'en'), '€1,234.56');
	assert.equal(euro(22500), euro(22500, 'de'));
});

test('Eingabe englisch: Komma = Tausender, Punkt = Dezimal, einzelnes Komma mit 1-2 Ziffern = Dezimal', () => {
	assert.equal(zahl('1,200', 'en'), 1200);
	assert.equal(zahl('1,200.50', 'en'), 1200.5);
	assert.equal(zahl('12.5', 'en'), 12.5);
	assert.equal(zahl('900,5', 'en'), 900.5);
	assert.equal(zahl('1,234,567', 'en'), 1234567);
	assert.equal(zahl('abc', 'en'), 0);
});
