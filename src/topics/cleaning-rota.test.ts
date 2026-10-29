// Lauf: pnpm test (Node-Testrunner, kein Framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleaningRota, tableToCsv } from './cleaning-rota.ts';

test('Rotation 3 Personen, 3 Aufgaben, 4 Wochen', () => {
	const t = cleaningRota(['A', 'B', 'C'], ['Bad', 'Küche', 'Böden'], 4);
	assert.equal(t.rows.length, 4);
	assert.deepEqual(t.rows[0], ['Woche 1', 'A', 'B', 'C']);
	assert.deepEqual(t.rows[1], ['Woche 2', 'C', 'A', 'B']);
	assert.deepEqual(
		t.rows[3],
		t.rows[0]?.map((x, i) => (i === 0 ? 'Woche 4' : x)),
	);
});

test('Rotation 5 Personen, 5 Aufgaben, 4 Wochen: jede Woche jede Person genau einmal', () => {
	const t = cleaningRota(['A', 'B', 'C', 'D', 'E'], ['1', '2', '3', '4', '5'], 4);
	assert.equal(t.rows.length, 4);
	for (const row of t.rows) assert.deepEqual([...row.slice(1)].sort(), ['A', 'B', 'C', 'D', 'E']);
	assert.deepEqual(t.rows[1], ['Woche 2', 'E', 'A', 'B', 'C', 'D']);
});

test('Vier Personen, vier Aufgaben entspricht der bisherigen Vorlage', () => {
	const t = cleaningRota(['A', 'B', 'C', 'D'], ['Bad', 'Küche', 'Böden', 'Müll und Flur']);
	assert.deepEqual(t.rows[1], ['Woche 2', 'D', 'A', 'B', 'C']);
	assert.deepEqual(t.rows[3], ['Woche 4', 'B', 'C', 'D', 'A']);
});

test('Wochenbezeichnung ist wählbar', () => {
	const t = cleaningRota(['A', 'B'], ['Bad', 'Küche'], 2, 'Week');
	assert.deepEqual(t.header, ['Week', 'Bad', 'Küche']);
	assert.deepEqual(t.rows[0], ['Week 1', 'A', 'B']);
});

test('CSV mit wählbarem Trenner', () => {
	assert.equal(tableToCsv(['a', 'b'], [['1', '2']]), '\uFEFFa;b\r\n1;2\r\n');
	assert.equal(tableToCsv(['a', 'b'], [['1;x', '2']], ','), '\uFEFFa,b\r\n1;x,2\r\n');
	assert.equal(tableToCsv(['a', 'b'], [['1,x', '2']], ','), '\uFEFFa,b\r\n"1,x",2\r\n');
});
