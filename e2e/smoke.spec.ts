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
	'/wer-schuldet-wem-rechner',
	'/nebenkosten-tagesgenau-rechner',
	'/open-source-splitwise-alternativen',
	'/impressum',
	'/datenschutz',
	'/en/guides',
	'/en/split-flat-costs',
	'/en/who-owes-whom-calculator',
	'/en/split-bill-by-days-calculator',
	'/en/open-source-splitwise-alternatives',
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

// The settle-up calculator answers with the fewest transfers and never scrolls sideways on a phone.
for (const [path, locale, three, amountField] of [
	['/wer-schuldet-wem-rechner', 'de-DE', '3 Überweisungen', 'Bezahlt von Jonas in Euro'],
	['/en/who-owes-whom-calculator', 'en-GB', '3 transfers', 'Amount paid by Jonas in euros'],
] as const) {
	test.describe(`settle-up calculator on ${path}`, () => {
		// German pages redirect visitors whose browser prefers English.
		test.use({ locale });

		test('works at 320 px', async ({ page }) => {
			await page.setViewportSize({ width: 320, height: 640 });
			await page.goto(path);
			const result = page.getByRole('heading', { level: 3, name: three });
			await expect(result).toBeVisible();
			await page.getByLabel(amountField).fill('100');
			await expect(result).toHaveCount(0);
			await page.getByLabel(amountField).fill('20');
			await expect(result).toBeVisible();
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(overflow).toBeLessThanOrEqual(0);
		});
	});
}

// The by-days calculator splits the example exactly and never scrolls sideways on a phone.
for (const [path, locale, caption, share, billField, personField] of [
	[
		'/nebenkosten-tagesgenau-rechner',
		'de-DE',
		'Anteil je Person nach Tagen',
		'255,37 €',
		'Betrag der Rechnung in Euro',
		'Ben: letzter Tag',
	],
	[
		'/en/split-bill-by-days-calculator',
		'en-GB',
		'Share per person by days',
		'€255.37',
		'Bill amount in euros',
		'Ben: last day',
	],
] as const) {
	test.describe(`by-days calculator on ${path}`, () => {
		// German pages redirect visitors whose browser prefers English.
		test.use({ locale });

		test('works at 320 px', async ({ page }) => {
			await page.setViewportSize({ width: 320, height: 640 });
			await page.goto(path);
			const table = page.getByRole('table', { name: caption, exact: true });
			await expect(table).toBeVisible();
			await expect(table.getByRole('cell', { name: share })).toBeVisible();
			await page.getByLabel(billField).fill('abc');
			await expect(table).toHaveCount(0);
			await page.getByLabel(billField).fill('1234.56');
			await page.getByLabel(personField).fill('2025-12-01');
			await expect(table).toBeVisible();
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(overflow).toBeLessThanOrEqual(0);
		});
	});
}

// The comparison page keeps its tables inside their own scroll regions: the page itself never scrolls sideways on a phone.
for (const [path, locale] of [
	['/open-source-splitwise-alternativen', 'de-DE'],
	['/en/open-source-splitwise-alternatives', 'en-GB'],
] as const) {
	test.describe(`comparison page ${path}`, () => {
		// German pages redirect visitors whose browser prefers English.
		test.use({ locale });

		test('does not scroll sideways at 320 px', async ({ page }) => {
			await page.setViewportSize({ width: 320, height: 640 });
			await page.goto(path);
			await expect(page.getByRole('table')).toHaveCount(3);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(overflow).toBeLessThanOrEqual(0);
		});
	});
}

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
