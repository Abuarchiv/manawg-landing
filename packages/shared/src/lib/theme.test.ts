import { describe, expect, it } from 'vitest';
import { parseStoredTheme, resolveTheme } from './theme';

describe('theme helpers', () => {
	it('accepts stored app theme values and falls back to light for corrupt storage', () => {
		expect(parseStoredTheme('dark')).toBe('dark');
		expect(parseStoredTheme('light')).toBe('light');
		expect(parseStoredTheme('system')).toBe('system');
		expect(parseStoredTheme(null)).toBe('light');
		expect(parseStoredTheme('neon')).toBe('light');
	});

	it('resolves system themes with the current media preference', () => {
		expect(resolveTheme('system', true)).toBe('dark');
		expect(resolveTheme('system', false)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});
});
