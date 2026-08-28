import { describe, expect, it } from 'vitest';

import { SHARE_CODE, generateShareCode, isValidShareCode, normalizeShareCode } from './share-code';

const SAMPLE_SIZE = 500;

describe('generateShareCode', () => {
	it('only ever produces codes that pass its own validator', () => {
		const codes = Array.from({ length: SAMPLE_SIZE }, () => generateShareCode());

		expect(codes.every(isValidShareCode)).toBe(true);
	});

	it('produces codes of the declared length', () => {
		expect(generateShareCode()).toHaveLength(SHARE_CODE.LENGTH);
	});

	it('does not repeat itself across a sample, so codes are not effectively sequential', () => {
		const codes = new Set(Array.from({ length: SAMPLE_SIZE }, () => generateShareCode()));

		expect(codes.size).toBe(SAMPLE_SIZE);
	});

	it('never emits a character outside the alphabet', () => {
		const outside = Array.from({ length: SAMPLE_SIZE }, () => generateShareCode())
			.join('')
			.split('')
			.filter((char) => !SHARE_CODE.ALPHABET.includes(char));

		expect(outside).toEqual([]);
	});
});

describe('isValidShareCode', () => {
	it('accepts a well-formed code', () => {
		expect(isValidShareCode('MTE8PZAT')).toBe(true);
	});

	it.each([
		['too short', 'MTE8PZA'],
		['too long', 'MTE8PZATX'],
		['lowercase', 'mte8pzat'],
		['empty', ''],
		['excluded letter I', 'MTE8PZAI'],
		['excluded letter L', 'MTE8PZAL'],
		['excluded letter O', 'MTE8PZAO'],
		['excluded letter U', 'MTE8PZAU'],
		['digit 0 is not in the alphabet', 'MTE8PZA0'],
		['digit 1 is not in the alphabet', 'MTE8PZA1'],
		['whitespace', 'MTE8 ZAT'],
	])('rejects %s', (_label, code) => {
		expect(isValidShareCode(code)).toBe(false);
	});
});

describe('normalizeShareCode', () => {
	it('uppercases so links shared in lowercase still resolve', () => {
		expect(normalizeShareCode('mte8pzat')).toBe('MTE8PZAT');
	});

	it('trims surrounding whitespace from copy-paste', () => {
		expect(normalizeShareCode('  MTE8PZAT \n')).toBe('MTE8PZAT');
	});

	it('leaves a valid code untouched, so normalizing twice changes nothing', () => {
		const code = generateShareCode();

		expect(normalizeShareCode(code)).toBe(code);
		expect(normalizeShareCode(normalizeShareCode(code))).toBe(code);
	});

	it('never turns a valid code into an invalid one', () => {
		const codes = Array.from({ length: SAMPLE_SIZE }, () => generateShareCode());

		expect(codes.every((code) => isValidShareCode(normalizeShareCode(code)))).toBe(true);
	});

	/**
	 * Documents current behaviour rather than endorsing it.
	 *
	 * The look-alike substitution maps I/L to `1` and O to `0` — but neither `0`
	 * nor `1` is in the alphabet, so the "correction" can only ever produce an
	 * invalid code. Typing `O` where the real code has `Q` fails either way, so
	 * nothing is broken; the mapping simply cannot do the job it looks like it
	 * is doing. Fixing it means either dropping the substitution or adding 0/1
	 * to the alphabet, and both change user-visible behaviour.
	 */
	it.each([
		['I', 'IIIIIIII', '11111111'],
		['L', 'LLLLLLLL', '11111111'],
		['O', 'OOOOOOOO', '00000000'],
		['U', 'UUUUUUUU', 'VVVVVVVV'],
	])('maps excluded letter %s to a substitute', (_label, input, expected) => {
		expect(normalizeShareCode(input)).toBe(expected);
	});

	it('cannot rescue a code containing I, L or O — the substitutes are not in the alphabet', () => {
		expect(isValidShareCode(normalizeShareCode('MTE8PZAI'))).toBe(false);
		expect(isValidShareCode(normalizeShareCode('MTE8PZAO'))).toBe(false);
	});

	it('does rescue U, because V is in the alphabet', () => {
		expect(isValidShareCode(normalizeShareCode('MTE8PZAU'))).toBe(true);
	});
});
