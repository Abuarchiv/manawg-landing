import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeHarness() {
	const { resolvedTheme, toggle } = useTheme();

	return (
		<button type="button" onClick={toggle}>
			{resolvedTheme}
		</button>
	);
}

describe('ThemeProvider', () => {
	it('keeps the document class in sync when toggling from system-dark to explicit light', async () => {
		window.localStorage.setItem('manawg-theme', 'system');

		const matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: query === '(prefers-color-scheme: dark)',
			media: query,
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			writable: true,
			value: matchMedia,
		});

		render(
			<ThemeProvider>
				<ThemeHarness />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument();
			expect(document.documentElement).toHaveClass('dark');
		});

		fireEvent.click(screen.getByRole('button', { name: 'dark' }));

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'light' })).toBeInTheDocument();
			expect(document.documentElement).not.toHaveClass('dark');
			expect(window.localStorage.getItem('manawg-theme')).toBe('light');
		});
	});
});
