// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
	type KnownWg,
	type StoredIdentity,
	clearIdentity,
	forgetWg,
	getIdentity,
	getKnownWgs,
	rememberWg,
	setIdentity,
} from '../identity';

const MAX_KNOWN_WGS = 20;
const MEMBER_ABU = '11111111-1111-4111-8111-111111111111';
const MEMBER_LINA = '22222222-2222-4222-8222-222222222222';

function installFakeLocalStorage(): void {
	const store = new Map<string, string>();
	const fake: Storage = {
		get length() {
			return store.size;
		},
		clear: () => {
			store.clear();
		},
		getItem: (key: string) => (store.has(key) ? (store.get(key) ?? null) : null),
		key: (index: number) => Array.from(store.keys())[index] ?? null,
		removeItem: (key: string) => {
			store.delete(key);
		},
		setItem: (key: string, value: string) => {
			store.set(key, value);
		},
	};
	Object.defineProperty(window, 'localStorage', {
		value: fake,
		writable: true,
		configurable: true,
	});
}

function makeWg(code: string, name = `WG ${code}`, lastVisitedAt = Date.now()): KnownWg {
	return { code, name, lastVisitedAt };
}

beforeEach(() => {
	installFakeLocalStorage();
});

describe('identity round-trip', () => {
	it('returns null when no identity has been stored', () => {
		expect(getIdentity('wg-1')).toBeNull();
	});

	it('stores and retrieves an identity for a given WG', () => {
		const identity: StoredIdentity = { memberId: MEMBER_ABU, name: 'Abu' };
		setIdentity('wg-1', identity);

		expect(getIdentity('wg-1')).toEqual(identity);
	});

	it('isolates identities by WG id', () => {
		setIdentity('wg-1', { memberId: MEMBER_ABU, name: 'Abu' });
		setIdentity('wg-2', { memberId: MEMBER_LINA, name: 'Lina' });

		expect(getIdentity('wg-1')).toEqual({ memberId: MEMBER_ABU, name: 'Abu' });
		expect(getIdentity('wg-2')).toEqual({ memberId: MEMBER_LINA, name: 'Lina' });
	});

	it('clearIdentity removes the stored identity', () => {
		setIdentity('wg-1', { memberId: MEMBER_ABU, name: 'Abu' });
		expect(getIdentity('wg-1')).not.toBeNull();

		clearIdentity('wg-1');

		expect(getIdentity('wg-1')).toBeNull();
	});

	it('returns null when stored JSON is malformed', () => {
		window.localStorage.setItem('manawg_identity:wg-1', '{not json');
		expect(getIdentity('wg-1')).toBeNull();
	});

	it('returns null when stored shape is invalid', () => {
		window.localStorage.setItem('manawg_identity:wg-1', JSON.stringify({ memberId: 42 }));
		expect(getIdentity('wg-1')).toBeNull();
	});
});

describe('known WGs', () => {
	it('returns an empty list when nothing has been remembered', () => {
		expect(getKnownWgs()).toEqual([]);
	});

	it('rememberWg adds entries to the front', () => {
		const first = makeWg('AAAA2222', 'First', 1);
		const second = makeWg('BBBB3333', 'Second', 2);
		const third = makeWg('CCCC4444', 'Third', 3);

		rememberWg(first);
		rememberWg(second);
		rememberWg(third);

		const wgs = getKnownWgs();
		expect(wgs).toHaveLength(3);
		expect(wgs.map((w) => w.code)).toEqual([third.code, second.code, first.code]);
	});

	it('rememberWg deduplicates by code, refreshing position to the front', () => {
		const a = makeWg('AAAA2222', 'A', 1);
		const b = makeWg('BBBB3333', 'B', 2);
		rememberWg(a);
		rememberWg(b);

		const refreshedA: KnownWg = { ...a, name: 'A renamed', lastVisitedAt: 99 };
		rememberWg(refreshedA);

		const wgs = getKnownWgs();
		expect(wgs).toHaveLength(2);
		expect(wgs[0]).toEqual(refreshedA);
		expect(wgs[1]).toEqual(b);
	});

	it('rememberWg caps the stored list at 20 entries', () => {
		const suffixes = '23456789ABCDEFGHJKMNPQRST'.split('');
		for (const [i, suffix] of suffixes.entries()) {
			rememberWg(makeWg(`TSTT222${suffix}`, `WG ${i}`, i));
		}

		const wgs = getKnownWgs();
		expect(wgs).toHaveLength(MAX_KNOWN_WGS);
		// Most-recently remembered is at the front.
		expect(wgs[0]?.code).toBe('TSTT222T');
		// Oldest five (0..4) should have been evicted.
		const codes = wgs.map((w) => w.code);
		expect(codes).not.toContain('TSTT2222');
		expect(codes).not.toContain('TSTT2226');
		// 5..24 should remain; tail is TSTT2227.
		expect(wgs[wgs.length - 1]?.code).toBe('TSTT2227');
	});

	it('forgetWg removes the entry with the matching code', () => {
		const a = makeWg('AAAA2222');
		const b = makeWg('BBBB3333');
		const c = makeWg('CCCC4444');
		rememberWg(a);
		rememberWg(b);
		rememberWg(c);

		forgetWg('BBBB3333');

		const wgs = getKnownWgs();
		expect(wgs.map((w) => w.code)).toEqual(['CCCC4444', 'AAAA2222']);
	});

	it('forgetWg is a no-op when the code is unknown', () => {
		rememberWg(makeWg('AAAA2222'));
		forgetWg('ZZZZ9999');
		expect(getKnownWgs().map((w) => w.code)).toEqual(['AAAA2222']);
	});

	it('returns an empty list when stored JSON is malformed', () => {
		window.localStorage.setItem('manawg_known_wgs', '{not json');
		expect(getKnownWgs()).toEqual([]);
	});

	it('treats blocked known-WG reads as an empty list', () => {
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: () => {
					throw new Error('storage blocked');
				},
			},
			writable: true,
			configurable: true,
		});

		expect(getKnownWgs()).toEqual([]);
	});

	it('does not throw when remembering a WG cannot be persisted', () => {
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: () => null,
				setItem: () => {
					throw new Error('quota exceeded');
				},
			},
			writable: true,
			configurable: true,
		});

		expect(() => rememberWg(makeWg('AAAA2222'))).not.toThrow();
	});

	it('returns an empty list when stored value is not an array', () => {
		window.localStorage.setItem('manawg_known_wgs', JSON.stringify({ not: 'an array' }));
		expect(getKnownWgs()).toEqual([]);
	});

	it('cleans duplicate and malformed remembered WGs before pages render them', () => {
		window.localStorage.setItem(
			'manawg_known_wgs',
			JSON.stringify([
				makeWg('aaaa2222', 'First copy', 3),
				null,
				{ code: 'AAAA2222', name: 'Second copy', lastVisitedAt: 2 },
				{ code: 'BAD', name: 'Broken', lastVisitedAt: 1 },
				makeWg('BBBB3333', 'Other', 4),
			]),
		);

		expect(getKnownWgs()).toEqual([
			{ code: 'AAAA2222', name: 'First copy', lastVisitedAt: 3 },
			{ code: 'BBBB3333', name: 'Other', lastVisitedAt: 4 },
		]);
	});
});
