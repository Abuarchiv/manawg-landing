import { type Page, expect, test } from '@playwright/test';

const STORAGE_KEY = 'manawg-theme';

async function gotoWithRetry(page: Page, path: string) {
	let lastError: unknown;
	for (let attempt = 0; attempt < 3; attempt += 1) {
		try {
			await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 120_000 });
			return;
		} catch (err) {
			lastError = err;
			await page.waitForTimeout(1000);
		}
	}
	throw lastError;
}

test.describe('Theme system', () => {
	test.setTimeout(300_000);

	test('light mode by default — html has no dark class on first visit', async ({ page }) => {
		await gotoWithRetry(page, '/');
		await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
		await page.reload();

		const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
		expect(hasDark).toBe(false);
	});

	test('click toggle → dark class applied → persists after reload', async ({ page }) => {
		await gotoWithRetry(page, '/');
		await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
		await page.reload();

		await page.getByRole('button', { name: 'Dark Mode aktivieren' }).click();
		await expect
			.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
			.toBe(true);

		await page.reload();
		await expect
			.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
			.toBe(true);
	});

	test('toggle dark → toggle back to light → reload still light', async ({ page }) => {
		await gotoWithRetry(page, '/');
		await page.evaluate((key) => localStorage.setItem(key, 'dark'), STORAGE_KEY);
		await page.reload();

		await page.getByRole('button', { name: 'Light Mode aktivieren' }).click();
		await expect
			.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
			.toBe(false);

		await page.reload();
		await expect
			.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
			.toBe(false);
	});

	test('stored system theme follows dark OS preference before hydration', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await gotoWithRetry(page, '/');
		await page.evaluate((key) => localStorage.setItem(key, 'system'), STORAGE_KEY);
		await page.reload({ waitUntil: 'domcontentloaded' });

		await expect
			.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
			.toBe(true);
	});

	test('toggle switches from system dark to explicit light mode', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await gotoWithRetry(page, '/');
		await page.evaluate((key) => localStorage.setItem(key, 'system'), STORAGE_KEY);
		await page.reload({ waitUntil: 'domcontentloaded' });

		await expect(page.getByRole('button', { name: 'Light Mode aktivieren' })).toBeVisible({
			timeout: 30_000,
		});
		await page.getByRole('button', { name: 'Light Mode aktivieren' }).click();

		await expect
			.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
			.toBe(false);
		await expect
			.poll(() => page.evaluate((storageKey) => localStorage.getItem(storageKey), STORAGE_KEY))
			.toBe('light');
	});
});
