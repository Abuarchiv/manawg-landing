import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('does not emit React warnings for the closed inert panel', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		render(
			<Drawer open={false} onClose={() => undefined}>
				<a href="/neu">Neu</a>
			</Drawer>,
		);

		expect(await screen.findByRole('dialog', { hidden: true })).toHaveAttribute('inert');
		expect(consoleError).not.toHaveBeenCalledWith(
			expect.stringContaining('Received an empty string for a boolean attribute'),
			expect.anything(),
			expect.anything(),
		);
	});
});
