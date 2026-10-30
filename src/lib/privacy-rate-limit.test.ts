// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const text = (path: string) => readFileSync(path, 'utf8').replace(/\s+/g, ' ');

const pages = [
	{
		name: 'en',
		source: text('src/app/(en)/en/privacy/page.tsx'),
		window: 'between one minute and one day',
		retention: 'at most 48 hours and 1 second',
		hash: 'SHA-256 hash of the invited email address',
		stale: ['one minute or one hour', '2 hours and 1 second'],
	},
	{
		name: 'de',
		source: text('src/app/(de)/datenschutz/page.tsx'),
		window: 'zwischen einer Minute und einem Tag',
		retention: 'spätestens 48 Stunden und 1 Sekunde',
		hash: 'SHA-256-Hash der eingeladenen E-Mail-Adresse',
		stale: ['einer Minute oder einer Stunde', '2 Stunden und 1 Sekunde'],
	},
];

for (const page of pages) {
	test(`privacy 4e (${page.name}) states the rate-limit windows, counter lifetime and key types`, () => {
		assert.ok(page.source.includes(page.window), page.window);
		assert.ok(page.source.includes(page.retention), page.retention);
		assert.ok(page.source.includes(page.hash), page.hash);
		for (const stale of page.stale) assert.ok(!page.source.includes(stale), stale);
	});
}
