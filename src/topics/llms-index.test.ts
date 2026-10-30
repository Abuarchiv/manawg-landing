// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { TOPICS_DE } from './de/index.ts';
import { TOPICS_EN } from './en/index.ts';

const listed = (file: string, base: string, slugs: string[]) => {
	const text = readFileSync(new URL(`../../public/${file}`, import.meta.url), 'utf8');
	return slugs.filter((slug) => !text.includes(`(${base}/${slug})`));
};

test('llms.txt links every German topic', () => {
	assert.deepEqual(listed('llms.txt', 'https://manawg.com', Object.keys(TOPICS_DE)), []);
});

test('en/llms.txt links every English topic', () => {
	assert.deepEqual(listed('en/llms.txt', 'https://manawg.com/en', Object.keys(TOPICS_EN)), []);
});
