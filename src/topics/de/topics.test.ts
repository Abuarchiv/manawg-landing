// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TOPICS_EN } from '../en/index.ts';
import { relatedSlugs } from '../groups.ts';
import { TOPICS_DE } from './index.ts';

const slugs = Object.keys(TOPICS_DE);

test('further reading: three distinct, existing pages excluding the page itself', () => {
	for (const slug of slugs) {
		const v = relatedSlugs(slug);
		assert.equal(v.length, 3, slug);
		assert.equal(new Set(v).size, 3, slug);
		for (const target of v) {
			assert.ok(target in TOPICS_DE, `${slug} -> ${target}`);
			assert.notEqual(target, slug);
		}
	}
});

test('tables attach to the intro or to an existing section heading', () => {
	for (const [slug, t] of Object.entries(TOPICS_DE))
		for (const tab of t.tables ?? [])
			assert.ok(
				tab.after === 'intro' || t.sections.some(([h]) => h === tab.after),
				`${slug}: ${tab.after}`,
			);
});

test('markdown links in the text point to existing pages', () => {
	const ok = (target: string) =>
		target === '/' || target === '/ratgeber' || target.slice(1) in TOPICS_DE;
	for (const [slug, t] of Object.entries(TOPICS_DE)) {
		const texts = [t.intro, ...t.sections.map(([, a]) => a), ...(t.faq ?? []).map(([, a]) => a)];
		for (const text of texts)
			for (const m of text.matchAll(/\]\((\/[a-z0-9-]*)\)/g))
				assert.ok(ok(m[1] ?? ''), `${slug}: ${m[1]}`);
	}
});

test('files of the app repository named in the text exist there', () => {
	const existing = new Set(['docs/self-hosting.md', 'LICENSE']);
	const pattern =
		/(?:github\.com\/Abuarchiv\/manawg\/blob\/main\/|\b)(docs\/[\w.-]+\.md|LICENSE)\b/g;
	for (const [slug, t] of [...Object.entries(TOPICS_DE), ...Object.entries(TOPICS_EN)])
		for (const m of JSON.stringify(t).matchAll(pattern))
			assert.ok(existing.has(m[1] ?? ''), `${slug}: ${m[1]}`);
});
