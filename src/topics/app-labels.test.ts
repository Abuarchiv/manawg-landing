// Run with: pnpm test (node test runner, no framework)
// Topic copy quotes labels and mail kinds exactly as the app shows them.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (lang: 'de' | 'en') =>
	readdirSync(new URL(`./${lang}/`, import.meta.url))
		.filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
		.map((f) => [f, readFileSync(new URL(`./${lang}/${f}`, import.meta.url), 'utf8')] as const);

const de = read('de');
const en = read('en');
const source = (files: ReadonlyArray<readonly [string, string]>, name: string) =>
	files.find(([f]) => f === name)?.[1] ?? '';

test('German topics name only mail kinds, labels and pages the app has', () => {
	const banned = [/\bDigest\b/i, /Nächste:r/, /Seite Mahnungen/, /3 Monate \(Quartal\)/];
	for (const [file, text] of de) {
		for (const re of banned) assert.ok(!re.test(text), `${file} matches ${re}`);
	}
});

test('German fixed-cost intervals use the app labels', () => {
	const money = source(de, 'guides-money.ts');
	assert.ok(money.includes('„Quartal“'));
	assert.ok(money.includes('„Jahr“'));
});

test('English fixed-cost intervals use the app labels', () => {
	const money = source(en, 'guides-money.ts');
	assert.ok(!/interval “(Quarter|Year)”/.test(money));
	assert.ok(money.includes('“3 months”'));
	assert.ok(money.includes('“12 months”'));
});
