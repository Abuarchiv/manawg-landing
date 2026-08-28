import { customAlphabet } from 'nanoid';

/**
 * Crockford base32 minus look-alikes (I, L, O, U).
 * 32^8 ≈ 1.1 trillion combinations.
 */
const SHARE_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
const SHARE_CODE_LENGTH = 8;
const SHARE_CODE_REGEX = /^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{8}$/;

const nano = customAlphabet(SHARE_CODE_ALPHABET, SHARE_CODE_LENGTH);

export function generateShareCode(): string {
	return nano();
}

export function isValidShareCode(code: string): boolean {
	return typeof code === 'string' && SHARE_CODE_REGEX.test(code);
}

export function normalizeShareCode(input: string): string {
	return input
		.trim()
		.toUpperCase()
		.replace(/[ILOU]/g, (ch) => {
			switch (ch) {
				case 'I':
					return '1';
				case 'L':
					return '1';
				case 'O':
					return '0';
				case 'U':
					return 'V';
				default:
					return ch;
			}
		});
}

export const SHARE_CODE = {
	ALPHABET: SHARE_CODE_ALPHABET,
	LENGTH: SHARE_CODE_LENGTH,
	REGEX: SHARE_CODE_REGEX,
} as const;
