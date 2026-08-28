import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAppUrl } from './app-url';

describe('app URL utils', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('ignores quoted empty app URLs and falls back to Vercel URLs', () => {
		vi.stubEnv('NEXT_PUBLIC_APP_URL', '""');
		vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'manawg.vercel.app');

		expect(getAppUrl()).toBe('https://manawg.vercel.app');
	});

	it('does not double-prefix Vercel URLs that already include a protocol', () => {
		vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
		vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'https://manawg.vercel.app/');

		expect(getAppUrl()).toBe('https://manawg.vercel.app');
	});
});
