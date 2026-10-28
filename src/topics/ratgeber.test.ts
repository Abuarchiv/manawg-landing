// Lauf: pnpm test (Node-Testrunner, kein Framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { putzplanRotation, tabelleAlsCsv } from './putzplan-rotation.ts';

test('Rotation 3 Personen, 3 Aufgaben, 4 Wochen', () => {
	const t = putzplanRotation(['A', 'B', 'C'], ['Bad', 'Küche', 'Böden'], 4);
	assert.equal(t.zeilen.length, 4);
	assert.deepEqual(t.zeilen[0], ['Woche 1', 'A', 'B', 'C']);
	assert.deepEqual(t.zeilen[1], ['Woche 2', 'C', 'A', 'B']);
	assert.deepEqual(
		t.zeilen[3],
		t.zeilen[0]?.map((x, i) => (i === 0 ? 'Woche 4' : x)),
	);
});

test('Rotation 5 Personen, 5 Aufgaben, 4 Wochen: jede Woche jede Person genau einmal', () => {
	const t = putzplanRotation(['A', 'B', 'C', 'D', 'E'], ['1', '2', '3', '4', '5'], 4);
	assert.equal(t.zeilen.length, 4);
	for (const zeile of t.zeilen)
		assert.deepEqual([...zeile.slice(1)].sort(), ['A', 'B', 'C', 'D', 'E']);
	assert.deepEqual(t.zeilen[1], ['Woche 2', 'E', 'A', 'B', 'C', 'D']);
});

test('Vier Personen, vier Aufgaben entspricht der bisherigen Vorlage', () => {
	const t = putzplanRotation(['A', 'B', 'C', 'D'], ['Bad', 'Küche', 'Böden', 'Müll und Flur']);
	assert.deepEqual(t.zeilen[1], ['Woche 2', 'D', 'A', 'B', 'C']);
	assert.deepEqual(t.zeilen[3], ['Woche 4', 'B', 'C', 'D', 'A']);
});

test('Wochenbezeichnung ist wählbar', () => {
	const t = putzplanRotation(['A', 'B'], ['Bad', 'Küche'], 2, 'Week');
	assert.deepEqual(t.kopf, ['Week', 'Bad', 'Küche']);
	assert.deepEqual(t.zeilen[0], ['Week 1', 'A', 'B']);
});

test('CSV mit wählbarem Trenner', () => {
	assert.equal(tabelleAlsCsv(['a', 'b'], [['1', '2']]), '\uFEFFa;b\r\n1;2\r\n');
	assert.equal(tabelleAlsCsv(['a', 'b'], [['1;x', '2']], ','), '\uFEFFa,b\r\n1;x,2\r\n');
	assert.equal(tabelleAlsCsv(['a', 'b'], [['1,x', '2']], ','), '\uFEFFa,b\r\n"1,x",2\r\n');
});
