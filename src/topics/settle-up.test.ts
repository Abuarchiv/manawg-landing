// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { balances, equalShares, parseCents, settle, type Transfer } from './settle-up.ts';

const net = (n: number, transfers: Transfer[]) => {
	const out = new Array<number>(n).fill(0);
	for (const t of transfers) {
		out[t.from] = (out[t.from] ?? 0) - t.cent;
		out[t.to] = (out[t.to] ?? 0) + t.cent;
	}
	return out;
};

// Fewest transfers by brute force: open balances minus the most disjoint zero-sum groups.
function fewest(balance: number[]): number {
	const open = balance.filter((x) => x !== 0);
	const split = (rest: number[]): number => {
		if (rest.length === 0) return 0;
		const [first = 0, ...others] = rest;
		let most = 0;
		for (let mask = 0; mask < 1 << others.length; mask++) {
			const inside = others.filter((_, i) => mask & (1 << i));
			if (first + inside.reduce((a, b) => a + b, 0) !== 0) continue;
			most = Math.max(most, 1 + split(others.filter((_, i) => !(mask & (1 << i)))));
		}
		return most;
	};
	return open.length - split(open);
}

test('example of four people: three transfers, everyone ends at zero', () => {
	const bal = balances([22000, 12000, 2000, 4000]);
	assert.deepEqual(bal, [12000, 2000, -8000, -6000]);
	const transfers = settle(bal);
	assert.deepEqual(transfers, [
		{ from: 2, to: 0, cent: 8000 },
		{ from: 3, to: 0, cent: 4000 },
		{ from: 3, to: 1, cent: 2000 },
	]);
	assert.deepEqual(net(4, transfers), bal);
});

test('leftover cents go to the first people and the shares add up to the total', () => {
	assert.deepEqual(equalShares(10000, 3), [3334, 3333, 3333]);
	assert.deepEqual(equalShares(1, 3), [1, 0, 0]);
	assert.deepEqual(balances([10000, 0, 0]), [6666, -3333, -3333]);
});

test('balances add up to zero and the transfers settle them exactly, with the fewest transfers', () => {
	let seed = 7;
	const next = (max: number) => {
		seed = (seed * 1103515245 + 12345) % 2147483648;
		return seed % max;
	};
	for (let round = 0; round < 300; round++) {
		const people = 2 + next(7);
		const paid = Array.from({ length: people }, () =>
			next(3) === 0 ? 0 : next(5000) * 10 + next(3),
		);
		const bal = balances(paid);
		assert.equal(
			bal.reduce((a, b) => a + b, 0),
			0,
		);
		const transfers = settle(bal);
		assert.deepEqual(net(people, transfers), bal);
		assert.ok(transfers.every((t) => t.cent > 0 && t.from !== t.to));
		assert.equal(transfers.length, fewest(bal), `round ${round}: ${paid.join(',')}`);
	}
});

test('balances made of several zero-sum groups still give the fewest transfers', () => {
	let seed = 11;
	const next = (max: number) => {
		seed = (seed * 1103515245 + 12345) % 2147483648;
		return seed % max;
	};
	for (let round = 0; round < 300; round++) {
		const bal: number[] = [];
		for (let g = 0; g < 1 + next(3); g++) {
			const size = 2 + next(3);
			const part = Array.from({ length: size - 1 }, () => next(2000) - 1000);
			bal.push(...part, 0 - part.reduce((a, b) => a + b, 0));
		}
		const order = bal.map((value) => ({ value, key: next(1000) })).sort((a, b) => a.key - b.key);
		const mixed = order.map((x) => x.value);
		const transfers = settle(mixed);
		assert.deepEqual(net(mixed.length, transfers), mixed);
		assert.equal(transfers.length, fewest(mixed), `round ${round}: ${mixed.join(',')}`);
	}
});

test('two separate pairs settle as two transfers, not through one hub', () => {
	const transfers = settle([500, -500, 300, -300]);
	assert.deepEqual(transfers, [
		{ from: 1, to: 0, cent: 500 },
		{ from: 3, to: 2, cent: 300 },
	]);
});

test('ties are broken by the order of the list and the result is repeatable', () => {
	const bal = [-100, -100, 100, 100];
	const first = settle(bal);
	assert.deepEqual(first, [
		{ from: 0, to: 2, cent: 100 },
		{ from: 1, to: 3, cent: 100 },
	]);
	assert.deepEqual(settle([...bal]), first);
});

test('nobody owes anything when everyone paid the same', () => {
	assert.deepEqual(settle(balances([2500, 2500, 2500])), []);
});

test('amount input in whole cents, invalid input is null', () => {
	assert.equal(parseCents(''), 0);
	assert.equal(parseCents('0'), 0);
	assert.equal(parseCents('19,99'), 1999);
	assert.equal(parseCents('1.234,50'), 123450);
	assert.equal(parseCents('19.99', 'en'), 1999);
	assert.equal(parseCents('1,234.50', 'en'), 123450);
	assert.equal(parseCents('abc'), null);
	assert.equal(parseCents('12abc'), null);
	assert.equal(parseCents('-5'), null);
	assert.equal(parseCents('99999999999'), null);
});
