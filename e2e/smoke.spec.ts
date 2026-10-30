import { expect, type Page, test } from '@playwright/test';

/** Collects page errors, console errors and failed same-origin requests. */
function watch(page: Page) {
	const problems: string[] = [];
	page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
	page.on('console', (m) => {
		if (m.type() === 'error') problems.push(`console: ${m.text()}`);
	});
	page.on('response', (r) => {
		if (r.status() >= 400 && r.url().startsWith(page.url().split('/').slice(0, 3).join('/')))
			problems.push(`${r.status()} ${r.url()}`);
	});
	return problems;
}

for (const path of ['/', '/en']) {
	test(`home ${path} scrolls to the end without errors`, async ({ page }) => {
		const problems = watch(page);
		await page.goto(`${path}?qa=1`);
		// The engine reports ready once the first hero frame (or its 2D fallback) is drawn
		await page.waitForFunction(() => window.__landing?.ready === true);
		await expect(page.locator('h1').first()).toBeVisible();
		const height = await page.evaluate(() => document.documentElement.scrollHeight);
		for (let y = 0; y <= height; y += 900) {
			await page.evaluate((top) => window.scrollTo(0, top), y);
			await page.waitForTimeout(120);
		}
		await expect(page.locator('#fusszeile')).toBeInViewport();
		expect(problems).toEqual([]);
	});
}

const PAGES = [
	'/ratgeber',
	'/putzplan-vorlage',
	'/wg-miete-rechner',
	'/impressum',
	'/datenschutz',
	'/en/guides',
	'/en/split-flat-costs',
	'/en/privacy',
];

for (const path of PAGES) {
	test(`page ${path} renders`, async ({ page }) => {
		const problems = watch(page);
		const res = await page.goto(path);
		expect(res?.status()).toBe(200);
		await expect(page.locator('h1')).toBeVisible();
		expect(problems).toEqual([]);
	});
}

// One static 404 page holds both languages and hides the other one with CSS.
for (const [path, heading] of [
	['/gibts-nicht', 'Seite nicht gefunden'],
	['/en/does-not-exist', 'Page not found'],
] as const) {
	test(`unknown path ${path} answers 404 in its language`, async ({ page }) => {
		const res = await page.goto(path);
		expect(res?.status()).toBe(404);
		await expect(page.locator('h1:visible')).toHaveText(heading);
	});
}

test('machine-readable files', async ({ request }) => {
	for (const path of [
		'/feed.xml',
		'/en/feed.xml',
		'/llms-full.txt',
		'/sitemap.xml',
		'/robots.txt',
	]) {
		const res = await request.get(path);
		expect(res.status(), path).toBe(200);
		expect((await res.text()).length, path).toBeGreaterThan(100);
	}
});

// A horizontally scrolling table must be reachable by keyboard and have a name.
for (const path of ['/wg-miete-rechner', '/putzplan-erstellen']) {
	test(`scrollable tables on ${path} are focusable regions`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(path);
		await expect(page.locator('.overflow-x-auto table').first()).toBeVisible();
		const scrollers = await page.locator('.overflow-x-auto').evaluateAll((els) =>
			els
				.filter((el) => el.scrollWidth > el.clientWidth)
				.map((el) => ({
					tabindex: el.getAttribute('tabindex'),
					role: el.getAttribute('role'),
					label: el.getAttribute('aria-label') ?? '',
				})),
		);
		expect(scrollers.length).toBeGreaterThan(0);
		for (const s of scrollers) {
			expect(s.tabindex).toBe('0');
			expect(s.role).toBe('region');
			expect(s.label).not.toBe('');
		}
	});
}
