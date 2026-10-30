// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const pages = {
	'en/privacy': 'src/app/(en)/en/privacy/page.tsx',
	'en/terms': 'src/app/(en)/en/terms/page.tsx',
	'de/datenschutz': 'src/app/(de)/datenschutz/page.tsx',
	'de/agb': 'src/app/(de)/agb/page.tsx',
};

const text = (file: string) => readFileSync(file, 'utf8').replace(/\s+/g, ' ');

test('the legal texts do not name the creator as the one who deletes a flat', () => {
	for (const [name, file] of Object.entries(pages)) {
		assert.doesNotMatch(text(file), /created a flat|\bErsteller/, name);
	}
});

test('the legal texts say the flat admin deletes a flat', () => {
	assert.match(text(pages['en/privacy']), /flat’s admin can remove it irrevocably/);
	assert.match(text(pages['en/terms']), /flat’s admin can remove it irrevocably/);
	assert.match(text(pages['de/datenschutz']), /Wer in der WG Admin ist, kann sie über/);
	assert.match(text(pages['de/agb']), /Wer in der WG Admin ist, kann sie über/);
});
