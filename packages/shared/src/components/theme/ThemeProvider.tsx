'use client';

import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	type ResolvedTheme,
	THEME_STORAGE_KEY,
	type Theme,
	parseStoredTheme,
	resolveTheme,
} from '../../lib/theme';

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
	toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolve(theme: Theme): ResolvedTheme {
	return resolveTheme(theme, systemPrefersDark());
}

function safeLocalStorage(): Storage | null {
	if (typeof window === 'undefined') return null;
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

function readStoredTheme(): Theme {
	return parseStoredTheme(safeLocalStorage()?.getItem(THEME_STORAGE_KEY) ?? null);
}

function writeStoredTheme(next: Theme): void {
	try {
		safeLocalStorage()?.setItem(THEME_STORAGE_KEY, next);
	} catch {
		// Storage may be blocked; theme still applies for this session.
	}
}

function applyResolved(next: ResolvedTheme): void {
	const root = document.documentElement;
	if (next === 'dark') root.classList.add('dark');
	else root.classList.remove('dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('light');
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

	useEffect(() => {
		const initial = readStoredTheme();
		setThemeState(initial);
		const r = resolve(initial);
		setResolvedTheme(r);
	}, []);

	useEffect(() => {
		applyResolved(resolvedTheme);
	}, [resolvedTheme]);

	useEffect(() => {
		if (theme !== 'system' || typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = (): void => {
			const r: ResolvedTheme = mq.matches ? 'dark' : 'light';
			setResolvedTheme(r);
			applyResolved(r);
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		setThemeState(next);
		writeStoredTheme(next);
		const r = resolve(next);
		setResolvedTheme(r);
	}, []);

	const toggle = useCallback(() => {
		setThemeState((prev) => {
			const next: Theme = resolve(prev) === 'dark' ? 'light' : 'dark';
			writeStoredTheme(next);
			const r = resolve(next);
			setResolvedTheme(r);
			return next;
		});
	}, []);

	const value = useMemo<ThemeContextValue>(
		() => ({ theme, resolvedTheme, setTheme, toggle }),
		[theme, resolvedTheme, setTheme, toggle],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
	return ctx;
}
