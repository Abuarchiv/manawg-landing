// Lauf: pnpm test (Node-Testrunner, kein Framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { verwandte } from './gruppen.ts';
import { THEMEN } from './themen.ts';

const slugs = Object.keys(THEMEN);

test('Weiterlesen: drei verschiedene, vorhandene Seiten ohne die eigene', () => {
	for (const slug of slugs) {
		const v = verwandte(slug);
		assert.equal(v.length, 3, slug);
		assert.equal(new Set(v).size, 3, slug);
		for (const ziel of v) {
			assert.ok(ziel in THEMEN, `${slug} -> ${ziel}`);
			assert.notEqual(ziel, slug);
		}
	}
});

test('Tabellen hängen an der Einleitung oder an einer vorhandenen Abschnittsüberschrift', () => {
	for (const [slug, t] of Object.entries(THEMEN))
		for (const tab of t.tabellen ?? [])
			assert.ok(
				tab.nach === 'einleitung' || t.abschnitte.some(([h]) => h === tab.nach),
				`${slug}: ${tab.nach}`,
			);
});

test('Markdown-Links im Text zeigen auf vorhandene Seiten', () => {
	const ok = (ziel: string) => ziel === '/' || ziel === '/ratgeber' || ziel.slice(1) in THEMEN;
	for (const [slug, t] of Object.entries(THEMEN)) {
		const texte = [
			t.einleitung,
			...t.abschnitte.map(([, a]) => a),
			...(t.fragen ?? []).map(([, a]) => a),
		];
		for (const text of texte)
			for (const m of text.matchAll(/\]\((\/[a-z0-9-]*)\)/g))
				assert.ok(ok(m[1] ?? ''), `${slug}: ${m[1]}`);
	}
});
