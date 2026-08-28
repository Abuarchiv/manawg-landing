'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
	className?: string;
	compact?: boolean;
}

export function ThemeToggle({ className = '', compact = false }: ThemeToggleProps) {
	const { resolvedTheme, toggle } = useTheme();
	const isDark = resolvedTheme === 'dark';

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
			title={isDark ? 'Light Mode' : 'Dark Mode'}
			className={`inline-flex items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] hover:border-[var(--border-strong)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${
				compact ? 'h-11 w-11 sm:h-8 sm:w-8' : 'h-11 w-11 sm:h-9 sm:w-9'
			} ${className}`}
		>
			{isDark ? (
				<Sun className="w-4 h-4" strokeWidth={1.75} />
			) : (
				<Moon className="w-4 h-4" strokeWidth={1.75} />
			)}
		</button>
	);
}
