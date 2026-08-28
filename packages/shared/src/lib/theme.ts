export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'manawg-theme';

export function parseStoredTheme(value: string | null): Theme {
	return value === 'dark' || value === 'light' || value === 'system' ? value : 'light';
}

export function resolveTheme(theme: Theme, systemDark: boolean): ResolvedTheme {
	if (theme === 'system') return systemDark ? 'dark' : 'light';
	return theme;
}
