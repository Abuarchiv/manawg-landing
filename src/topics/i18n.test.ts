// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TOPIC_SLUG_EN, toEnglishSlug, toGermanSlug } from '../lib/locale.ts';
import { TOPICS_EN } from './en/index.ts';
import { related, topics } from './registry.ts';
import { THEMEN } from './themen.ts';

const heading = (t: { abschnitte: Array<[string, string]> }, h: string) =>
	t.abschnitte.some(([kopf]) => kopf === h);

test('slug map is a bijection over exactly the German topics', () => {
	assert.deepEqual(Object.keys(TOPIC_SLUG_EN).sort(), Object.keys(THEMEN).sort());
	const english = Object.values(TOPIC_SLUG_EN);
	assert.equal(new Set(english).size, english.length);
	for (const [de, en] of Object.entries(TOPIC_SLUG_EN)) {
		assert.equal(toEnglishSlug(de), en);
		assert.equal(toGermanSlug(en), de);
	}
});

test('every English topic key is a value of the slug map', () => {
	const values = new Set(Object.values(TOPIC_SLUG_EN));
	for (const slug of Object.keys(TOPICS_EN)) assert.ok(values.has(slug), slug);
});

test('English markdown links point to /, /guides or a mapped slug', () => {
	const values = new Set(Object.values(TOPIC_SLUG_EN));
	for (const [slug, t] of Object.entries(TOPICS_EN)) {
		const texts = [
			t.einleitung,
			...t.abschnitte.map(([, text]) => text),
			...(t.fragen ?? []).map(([, text]) => text),
		];
		for (const text of texts) {
			for (const m of text.matchAll(/\]\((\/[a-z0-9-]*)\)/g)) {
				const target = m[1] ?? '';
				assert.ok(
					target === '/' || target === '/guides' || values.has(target.slice(1)),
					`${slug} -> ${target}`,
				);
			}
		}
	}
});

test('English tables hang off the introduction or an existing heading', () => {
	for (const [slug, t] of Object.entries(TOPICS_EN)) {
		for (const tab of t.tabellen ?? []) {
			assert.ok(tab.nach === 'einleitung' || heading(t, tab.nach), `${slug}: ${tab.nach}`);
		}
	}
});

test('related() gives three distinct, mapped slugs in both languages', () => {
	for (const locale of ['de', 'en'] as const) {
		for (const slug of Object.keys(topics(locale))) {
			const r = related(locale, slug);
			assert.equal(r.length, 3, `${locale}:${slug}`);
			assert.equal(new Set(r).size, 3, `${locale}:${slug}`);
			for (const target of r) {
				assert.notEqual(target, slug);
				if (locale === 'en') assert.ok(toGermanSlug(target), `${slug} -> ${target}`);
				else assert.ok(target in THEMEN, `${slug} -> ${target}`);
			}
		}
	}
});

test('widget.after matches a heading', () => {
	for (const [slug, t] of [...Object.entries(THEMEN), ...Object.entries(TOPICS_EN)]) {
		if (t.widget) assert.ok(heading(t, t.widget.after), `${slug}: ${t.widget.after}`);
	}
});

test('related() for an English slug mirrors the German list', () => {
	assert.deepEqual(related('en', 'cleaning-rota'), related('de', 'putzplan').map(toEnglishSlug));
});
