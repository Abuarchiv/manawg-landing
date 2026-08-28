import { describe, expect, it } from 'vitest';
import { SHARE_CODE, generateShareCode, isValidShareCode, normalizeShareCode } from '../share-code';

const ITERATIONS = 100;
const CONFUSABLE_CHARS = ['I', 'L', 'O', 'U'];

describe('generateShareCode', () => {
	it('returns an 8-character string', () => {
		const code = generateShareCode();
		expect(typeof code).toBe('string');
		expect(code).toHaveLength(SHARE_CODE.LENGTH);
		expect(code).toHaveLength(8);
	});

	it('uses only the Crockford alphabet (no I, L, O, U)', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			const code = generateShareCode();
			expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{8}$/);
			for (const ch of CONFUSABLE_CHARS) {
				expect(code).not.toContain(ch);
			}
		}
	});

	it('produces codes that pass isValidShareCode across many iterations', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			const code = generateShareCode();
			expect(isValidShareCode(code)).toBe(true);
		}
	});

	it('generates values with reasonable entropy (no immediate duplicates)', () => {
		const seen = new Set<string>();
		for (let i = 0; i < ITERATIONS; i++) {
			seen.add(generateShareCode());
		}
		// 100 draws from ~1.1T combos — collisions are vanishingly unlikely.
		expect(seen.size).toBe(ITERATIONS);
	});
});

describe('isValidShareCode', () => {
	it('accepts valid 8-char Crockford codes', () => {
		expect(isValidShareCode('ABCDEFGH')).toBe(true);
		expect(isValidShareCode('23456789')).toBe(true);
		expect(isValidShareCode('JKMNPQRS')).toBe(true);
		expect(isValidShareCode('TVWXYZ23')).toBe(true);
	});

	it('rejects codes that are too short', () => {
		expect(isValidShareCode('')).toBe(false);
		expect(isValidShareCode('ABC')).toBe(false);
		expect(isValidShareCode('ABCDEFG')).toBe(false);
	});

	it('rejects codes that are too long', () => {
		expect(isValidShareCode('ABCDEFGHJ')).toBe(false);
		expect(isValidShareCode('ABCDEFGHJKMN')).toBe(false);
	});

	it('rejects lowercase characters', () => {
		expect(isValidShareCode('abcdefgh')).toBe(false);
		expect(isValidShareCode('ABCDEFGh')).toBe(false);
		expect(isValidShareCode('aBCDEFGH')).toBe(false);
	});

	it('rejects confusable characters I, L, O, U', () => {
		expect(isValidShareCode('IBCDEFGH')).toBe(false);
		expect(isValidShareCode('ABCDEFGL')).toBe(false);
		expect(isValidShareCode('OBCDEFGH')).toBe(false);
		expect(isValidShareCode('UBCDEFGH')).toBe(false);
	});

	it('rejects digits 0 and 1 (not in alphabet)', () => {
		expect(isValidShareCode('0BCDEFGH')).toBe(false);
		expect(isValidShareCode('1BCDEFGH')).toBe(false);
	});

	it('rejects special characters and whitespace', () => {
		expect(isValidShareCode('ABCD-EFG')).toBe(false);
		expect(isValidShareCode('ABCD EFG')).toBe(false);
		expect(isValidShareCode(' ABCDEFG')).toBe(false);
		expect(isValidShareCode('ABCDEFG ')).toBe(false);
	});

	it('rejects non-string-like inputs cast through unknown', () => {
		expect(isValidShareCode(null as unknown as string)).toBe(false);
		expect(isValidShareCode(undefined as unknown as string)).toBe(false);
		expect(isValidShareCode(12345678 as unknown as string)).toBe(false);
	});
});

describe('normalizeShareCode', () => {
	it('trims surrounding whitespace', () => {
		expect(normalizeShareCode('  ABCDEFGH  ')).toBe('ABCDEFGH');
		expect(normalizeShareCode('\tABCDEFGH\n')).toBe('ABCDEFGH');
	});

	it('uppercases input', () => {
		expect(normalizeShareCode('abcdefgh')).toBe('ABCDEFGH');
		expect(normalizeShareCode('aBcDeFgH')).toBe('ABCDEFGH');
	});

	it('swaps I to 1', () => {
		expect(normalizeShareCode('IIIIIIII')).toBe('11111111');
		expect(normalizeShareCode('iiiiiiii')).toBe('11111111');
	});

	it('swaps L to 1', () => {
		expect(normalizeShareCode('LLLLLLLL')).toBe('11111111');
		expect(normalizeShareCode('llllllll')).toBe('11111111');
	});

	it('swaps O to 0', () => {
		expect(normalizeShareCode('OOOOOOOO')).toBe('00000000');
		expect(normalizeShareCode('oooooooo')).toBe('00000000');
	});

	it('swaps U to V', () => {
		expect(normalizeShareCode('UUUUUUUU')).toBe('VVVVVVVV');
		expect(normalizeShareCode('uuuuuuuu')).toBe('VVVVVVVV');
	});

	it('combines all transformations', () => {
		expect(normalizeShareCode('  iLoU2345  ')).toBe('110V2345');
		expect(normalizeShareCode('ilou')).toBe('110V');
	});

	it('leaves valid codes unchanged after normalization', () => {
		expect(normalizeShareCode('ABCDEFGH')).toBe('ABCDEFGH');
		expect(normalizeShareCode('23456789')).toBe('23456789');
	});
});

describe('share-code integration', () => {
	it('a freshly generated code always passes isValidShareCode', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			const code = generateShareCode();
			expect(isValidShareCode(code)).toBe(true);
		}
	});

	it('normalizing a freshly generated code is a no-op', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			const code = generateShareCode();
			expect(normalizeShareCode(code)).toBe(code);
			expect(isValidShareCode(normalizeShareCode(code))).toBe(true);
		}
	});
});
