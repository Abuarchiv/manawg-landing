import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InstallPrompt } from './install-prompt';

const navigationMock = vi.hoisted(() => ({
	pathname: '/wg/MTE8PZAT',
}));

const pwaInstallMock = vi.hoisted(() => ({
	event: {
		prompt: vi.fn(),
		userChoice: Promise.resolve({ outcome: 'dismissed', platform: 'web' }),
	},
	isAppInstalled: vi.fn(() => false),
	subscribeInstall: vi.fn((listener: (event: unknown) => void) => {
		listener(pwaInstallMock.event);
		return vi.fn();
	}),
	triggerInstall: vi.fn(),
}));

vi.mock('next/navigation', () => ({
	usePathname: () => navigationMock.pathname,
}));

vi.mock('../lib/pwa-install', () => ({
	isAppInstalled: pwaInstallMock.isAppInstalled,
	subscribeInstall: pwaInstallMock.subscribeInstall,
	triggerInstall: pwaInstallMock.triggerInstall,
}));

describe('InstallPrompt', () => {
	const localStorageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		navigationMock.pathname = '/wg/MTE8PZAT';
	});

	afterEach(() => {
		vi.useRealTimers();
		if (localStorageDescriptor) {
			Object.defineProperty(window, 'localStorage', localStorageDescriptor);
		}
	});

	it('still appears when localStorage access is blocked', async () => {
		Object.defineProperty(window, 'localStorage', {
			configurable: true,
			get: () => {
				throw new Error('blocked');
			},
		});

		render(<InstallPrompt />);

		await act(async () => {
			vi.advanceTimersByTime(1200);
		});

		expect(screen.getByRole('status', { name: 'App installieren' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Jetzt installieren' })).toBeVisible();
	});
});
