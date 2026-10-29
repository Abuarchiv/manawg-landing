// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleaningRota, tableToCsv } from './cleaning-rota.ts';

test('rotation with 3 people, 3 tasks, 4 weeks', () => {
	const t = cleaningRota(['A', 'B', 'C'], ['Bad', 'Küche', 'Böden'], 4);
	assert.equal(t.rows.length, 4);
	assert.deepEqual(t.rows[0], ['Woche 1', 'A', 'B', 'C']);
	assert.deepEqual(t.rows[1], ['Woche 2', 'C', 'A', 'B']);
	assert.deepEqual(
		t.rows[3],
		t.rows[0]?.map((x, i) => (i === 0 ? 'Woche 4' : x)),
	);
});

test('rotation with 5 people, 5 tasks, 4 weeks: every person exactly once per week', () => {
	const t = cleaningRota(['A', 'B', 'C', 'D', 'E'], ['1', '2', '3', '4', '5'], 4);
	assert.equal(t.rows.length, 4);
	for (const row of t.rows) assert.deepEqual([...row.slice(1)].sort(), ['A', 'B', 'C', 'D', 'E']);
	assert.deepEqual(t.rows[1], ['Woche 2', 'E', 'A', 'B', 'C', 'D']);
});

test('four people, four tasks match the published template', () => {
	const t = cleaningRota(['A', 'B', 'C', 'D'], ['Bad', 'Küche', 'Böden', 'Müll und Flur']);
	assert.deepEqual(t.rows[1], ['Woche 2', 'D', 'A', 'B', 'C']);
	assert.deepEqual(t.rows[3], ['Woche 4', 'B', 'C', 'D', 'A']);
});

test('week label is configurable', () => {
	const t = cleaningRota(['A', 'B'], ['Bad', 'Küche'], 2, 'Week');
	assert.deepEqual(t.header, ['Week', 'Bad', 'Küche']);
	assert.deepEqual(t.rows[0], ['Week 1', 'A', 'B']);
});

test('CSV with configurable separator', () => {
	assert.equal(tableToCsv(['a', 'b'], [['1', '2']]), '\uFEFFa;b\r\n1;2\r\n');
	assert.equal(tableToCsv(['a', 'b'], [['1;x', '2']], ','), '\uFEFFa,b\r\n1;x,2\r\n');
	assert.equal(tableToCsv(['a', 'b'], [['1,x', '2']], ','), '\uFEFFa,b\r\n"1,x",2\r\n');
});
