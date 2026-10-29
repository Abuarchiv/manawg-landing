// Lauf: pnpm test (Node-Testrunner, kein Framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { relatedSlugs } from '../groups.ts';
import { TOPICS_DE } from './index.ts';

const slugs = Object.keys(TOPICS_DE);

test('Weiterlesen: drei verschiedene, vorhandene Seiten ohne die eigene', () => {
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

test('Tabellen hängen an der Einleitung oder an einer vorhandenen Abschnittsüberschrift', () => {
	for (const [slug, t] of Object.entries(TOPICS_DE))
		for (const tab of t.tables ?? [])
			assert.ok(
				tab.after === 'intro' || t.sections.some(([h]) => h === tab.after),
				`${slug}: ${tab.after}`,
			);
});

test('Markdown-Links im Text zeigen auf vorhandene Seiten', () => {
	const ok = (target: string) =>
		target === '/' || target === '/ratgeber' || target.slice(1) in TOPICS_DE;
	for (const [slug, t] of Object.entries(TOPICS_DE)) {
		const texts = [t.intro, ...t.sections.map(([, a]) => a), ...(t.faq ?? []).map(([, a]) => a)];
		for (const text of texts)
			for (const m of text.matchAll(/\]\((\/[a-z0-9-]*)\)/g))
				assert.ok(ok(m[1] ?? ''), `${slug}: ${m[1]}`);
	}
});
