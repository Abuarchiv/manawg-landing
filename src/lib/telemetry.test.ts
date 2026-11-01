// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { referringDomain, safePath } from './telemetry.ts';

test('page paths are sent as they are, odd paths collapse to one value', () => {
	assert.equal(safePath('/'), '/');
	assert.equal(safePath('/en/guides/wg-putzplan'), '/en/guides/wg-putzplan');
	assert.equal(safePath('/Max.Mustermann@example.com'), '/[other]');
	assert.equal(safePath('/a/b/c/d/e'), '/[other]');
});

test('only the domain of an external referrer is sent', () => {
	assert.equal(
		referringDomain('https://www.google.com/search?q=wg+app', 'manawg.com'),
		'www.google.com',
	);
	assert.equal(referringDomain('https://manawg.com/en', 'manawg.com'), undefined);
	assert.equal(referringDomain('', 'manawg.com'), undefined);
});

test('the privacy texts name every event the website sends', () => {
	const source = readFileSync('src/lib/telemetry.ts', 'utf8');
	const events = source.match(/capture\(event: ([^)]+)\)/)?.[1]?.match(/'([a-z_$]+)'/g) ?? [];
	assert.deepEqual(events, ["'$pageview'", "'app_link_clicked'"]);
	for (const file of ['src/app/(de)/datenschutz/page.tsx', 'src/app/(en)/en/privacy/page.tsx']) {
		assert.match(readFileSync(file, 'utf8'), /app_link_clicked/, file);
	}
});

test('a failing analytics call never throws into the page', async () => {
	process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test';
	const g = globalThis as Record<string, unknown>;
	g.location = { hostname: 'manawg.com', pathname: '/' };
	g.document = { referrer: '' };
	// Plain http on a LAN address: no crypto.randomUUID, as in browsers outside a secure context.
	// A fresh module instance, because the key is read once at load.
	const fresh = './telemetry.ts?insecure';
	const { capture } = (await import(fresh)) as typeof import('./telemetry.ts');
	const randomUUID = crypto.randomUUID;
	Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
	try {
		assert.doesNotThrow(() => capture('$pageview'));
	} finally {
		Object.defineProperty(crypto, 'randomUUID', { value: randomUUID, configurable: true });
	}
});
