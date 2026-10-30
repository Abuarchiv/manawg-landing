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

type RGB = [number, number, number];

// The dimmed FAQ question blends its number into the paper; WCAG 1.4.3 asks 4.5:1 for that blend.
test.describe('light theme', () => {
	test.use({ colorScheme: 'light' });

	for (const path of ['/', '/en']) {
		test(`closed FAQ number on ${path} keeps 4.5:1 after the dim`, async ({ page }) => {
			await page.goto(path);
			await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
			const question = page.locator('#faq-frage-2');
			await expect(question).toHaveAttribute('aria-expanded', 'false');
			// Wait for the opacity transition to settle on the closed value.
			await expect.poll(() => question.evaluate((el) => getComputedStyle(el).opacity)).toBe('0.72');
			const { fg, opacity, bg } = await page.evaluate(() => {
				const num = document.querySelector('#faq-frage-2 .faq-num') as HTMLElement;
				const rgb = (v: string) => (v.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number) as RGB;
				const probe = document.createElement('i');
				probe.style.color = 'var(--paper)';
				document.body.append(probe);
				const bg = rgb(getComputedStyle(probe).color);
				probe.remove();
				return {
					fg: rgb(getComputedStyle(num).color),
					opacity: Number(getComputedStyle(num.closest('.faq-question') as Element).opacity),
					bg,
				};
			});
			const lum = (c: RGB) => {
				const [r, g, b] = c.map((v) => {
					const s = v / 255;
					return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
				});
				return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
			};
			// Rendered pixels are 8-bit, so the blend rounds like the compositor does.
			const blend = fg.map((v, i) => Math.round(opacity * v + (1 - opacity) * (bg[i] ?? 0))) as RGB;
			const [a, b] = [lum(blend), lum(bg)];
			expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(4.5);
		});
	}
});
