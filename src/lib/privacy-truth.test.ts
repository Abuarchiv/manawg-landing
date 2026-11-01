// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const pages = {
	'en/privacy': 'src/app/(en)/en/privacy/page.tsx',
	'de/datenschutz': 'src/app/(de)/datenschutz/page.tsx',
};

const text = (file: string) => readFileSync(file, 'utf8').replace(/\s+/g, ' ');

test('the privacy texts do not name jsDelivr, because the app serves the OCR files itself', () => {
	for (const [name, file] of Object.entries(pages)) {
		assert.doesNotMatch(text(file), /jsdelivr/i, name);
	}
});

test('the privacy texts name the password check and the IndexedDB storage', () => {
	for (const [name, file] of Object.entries(pages)) {
		assert.match(text(file), /Have I Been Pwned/, name);
		assert.match(text(file), /IndexedDB/, name);
	}
});

test('the privacy texts do not limit browser storage to flat assignments and name drafts', () => {
	assert.doesNotMatch(
		text(pages['de/datenschutz']),
		/WG-Zuordnungen und Namensentwürfe im lokalen/,
	);
	assert.doesNotMatch(text(pages['en/privacy']), /flat assignments and name drafts may be held/);
});
