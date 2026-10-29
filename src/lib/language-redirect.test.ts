// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { languageDecision, preferredLocale } from './language-redirect.ts';

const visit = (over: Partial<Parameters<typeof languageDecision>[0]> = {}) =>
	languageDecision({
		path: '/',
		cookie: undefined,
		acceptLanguage: 'en-US,en;q=0.9',
		userAgent: 'Mozilla/5.0 (Macintosh) Chrome/140',
		referer: null,
		origin: 'https://manawg.com',
		...over,
	});

test('preferredLocale follows the first supported language, English for other languages', () => {
	assert.equal(preferredLocale('de-DE,de;q=0.9,en;q=0.8'), 'de');
	assert.equal(preferredLocale('en-GB,de;q=0.5'), 'en');
	assert.equal(preferredLocale('fr-FR,fr;q=0.9'), 'en');
	assert.equal(preferredLocale('tr,de;q=0.8'), 'de');
	assert.equal(preferredLocale('fr;q=0.5,de;q=0.9'), 'de');
	assert.equal(preferredLocale('fr,en;q=0'), null);
	assert.equal(preferredLocale(''), null);
	assert.equal(preferredLocale(null), null);
	assert.equal(preferredLocale('*'), null);
});

test('a non-German system arriving from outside goes to the English page', () => {
	assert.deepEqual(visit(), { redirect: '/en' });
	assert.deepEqual(visit({ path: '/putzplan' }), { redirect: '/en/cleaning-rota' });
	assert.deepEqual(visit({ path: '/datenschutz' }), { redirect: '/en/privacy' });
	assert.deepEqual(visit({ acceptLanguage: 'pl-PL' }), { redirect: '/en' });
});

test('German systems, crawlers and pages without a pair stay where they are', () => {
	assert.deepEqual(visit({ acceptLanguage: 'de-DE,de;q=0.9' }), {});
	assert.deepEqual(visit({ acceptLanguage: null }), {});
	assert.deepEqual(visit({ userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0)' }), {});
	assert.deepEqual(visit({ userAgent: 'WhatsApp/2.23' }), {});
	assert.deepEqual(visit({ path: '/en/cleaning-rota' }), {});
	assert.deepEqual(visit({ path: '/gibt-es-nicht' }), {});
});

test('a stored choice beats the system language', () => {
	assert.deepEqual(visit({ cookie: 'de' }), {});
	assert.deepEqual(visit({ cookie: 'en', acceptLanguage: 'de-DE' }), { redirect: '/en' });
});

test('navigation inside the site is never redirected', () => {
	assert.deepEqual(visit({ path: '/wg-app', referer: 'https://manawg.com/ratgeber' }), {});
});

test('switching language with the footer link stores the choice', () => {
	assert.deepEqual(visit({ path: '/putzplan', referer: 'https://manawg.com/en/cleaning-rota' }), {
		remember: 'de',
	});
	assert.deepEqual(
		visit({
			path: '/en/cleaning-rota',
			referer: 'https://manawg.com/putzplan',
			acceptLanguage: 'de',
		}),
		{ remember: 'en' },
	);
	assert.deepEqual(visit({ path: '/putzplan', referer: 'https://evil.example/en/cleaning-rota' }), {
		redirect: '/en/cleaning-rota',
	});
});
