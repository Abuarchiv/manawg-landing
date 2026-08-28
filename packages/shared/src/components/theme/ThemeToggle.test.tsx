import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

const themeMock = vi.hoisted(() => ({
	toggle: vi.fn(),
}));

vi.mock('./ThemeProvider', () => ({
	useTheme: () => ({ resolvedTheme: 'light', toggle: themeMock.toggle }),
}));

describe('ThemeToggle', () => {
	it('renders the default toggle as a touch-sized control', () => {
		render(<ThemeToggle />);

		expect(screen.getByRole('button', { name: 'Dark Mode aktivieren' })).toHaveClass(
			'h-11',
			'w-11',
		);
	});

	it('renders the compact toggle as a touch-sized control', () => {
		render(<ThemeToggle compact />);

		expect(screen.getByRole('button', { name: 'Dark Mode aktivieren' })).toHaveClass(
			'h-11',
			'w-11',
		);
	});

	it('toggles the current theme', () => {
		render(<ThemeToggle />);

		fireEvent.click(screen.getByRole('button', { name: 'Dark Mode aktivieren' }));

		expect(themeMock.toggle).toHaveBeenCalledTimes(1);
	});
});
