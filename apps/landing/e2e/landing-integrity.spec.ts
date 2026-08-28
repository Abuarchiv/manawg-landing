import { expect, test } from '@playwright/test';

test.describe('Landing integrity', () => {
	test.setTimeout(300_000);

	for (const viewport of [
		{ name: 'mobile', width: 390, height: 844 },
		{ name: 'desktop', width: 1280, height: 900 },
	]) {
		test(`renders without client errors or horizontal overflow on ${viewport.name}`, async ({
			page,
		}) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('console', (message) => {
				if (message.type() === 'error') errors.push(message.text());
			});

			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });
			await expect(page.getByRole('heading', { name: 'manawg' })).toBeVisible({
				timeout: 30_000,
			});

			expect(errors).toEqual([]);
			await expect
				.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
				.toBeLessThanOrEqual(2);
		});
	}
});
