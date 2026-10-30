import { defineConfig, devices } from '@playwright/test';

// Smoke test of the production build: `pnpm build && pnpm test:e2e`.
const PORT = 3200;

export default defineConfig({
	testDir: 'e2e',
	timeout: 60_000,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: { baseURL: `http://localhost:${PORT}` },
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'phone', use: { ...devices['Pixel 7'] } },
	],
	webServer: {
		command: `pnpm start --port ${PORT}`,
		port: PORT,
		reuseExistingServer: !process.env.CI,
	},
});
