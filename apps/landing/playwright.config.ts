// craftsman-ignore: TS002
import { defineConfig, devices } from '@playwright/test';

const DEFAULT_E2E_PORT = process.env.E2E_PORT ?? '3101';
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${DEFAULT_E2E_PORT}`;
const parsedBaseUrl = new URL(BASE_URL);
const isLocalBase = ['localhost', '127.0.0.1', '::1'].includes(parsedBaseUrl.hostname);
const isRemoteBase = /^https?:\/\//i.test(BASE_URL) && !isLocalBase;
const serverPort = parsedBaseUrl.port || (parsedBaseUrl.protocol === 'https:' ? '443' : '80');
const APP_DIR = process.cwd().endsWith('/apps/landing') ? process.cwd() : 'apps/landing';
const useBuiltServer = process.env.PLAYWRIGHT_USE_BUILD === 'true';
const e2eDistDir = `.next-e2e-${serverPort}`;
const isolatedNextEnv = `NEXT_DIST_DIR=${e2eDistDir}`;
const webServerCommand = useBuiltServer
	? `CI=true ${isolatedNextEnv} pnpm exec next build && CI=true ${isolatedNextEnv} pnpm exec next start --port ${serverPort}`
	: `CI=true ${isolatedNextEnv} pnpm exec next dev --port ${serverPort}`;

export default defineConfig({
	testDir: './e2e',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: [['html', { open: 'never' }], ['list']],
	workers: 1,
	use: {
		baseURL: BASE_URL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		// Same reasoning as apps/web/playwright.config.ts — pinned so assertions
		// on rendered text don't depend on the host's locale/timezone.
		timezoneId: 'Europe/Berlin',
		locale: 'de-DE',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: isRemoteBase
		? undefined
		: {
				command: webServerCommand,
				cwd: APP_DIR,
				url: BASE_URL,
				reuseExistingServer: false,
				timeout: 180_000,
			},
});
