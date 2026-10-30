// Run: pnpm test (Node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { de } from './de.ts';
import { en } from './en.ts';

/** Shape of a value: object keys recursively, array lengths, leaf type. Headline lines may differ in count. */
function shape(v: unknown): unknown {
	if (Array.isArray(v)) return v.every((x) => typeof x === 'string') ? 'string[]' : v.map(shape);
	if (v && typeof v === 'object')
		return Object.fromEntries(
			Object.entries(v)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([k, x]) => [k, shape(x)]),
		);
	return typeof v;
}

/** Every string of a value with its path. */
function strings(v: unknown, path = ''): [string, string][] {
	if (typeof v === 'string') return [[path, v]];
	if (Array.isArray(v)) return v.flatMap((x, i) => strings(x, `${path}[${i}]`));
	if (v && typeof v === 'object')
		return Object.entries(v).flatMap(([k, x]) => strings(x, path ? `${path}.${k}` : k));
	return [];
}

test('de and en have the same key structure', () => {
	assert.deepEqual(shape(en), shape(de));
});

test('tunnel words: three, uppercase, at most 13 characters', () => {
	for (const d of [de, en]) {
		assert.equal(d.tunnelWords.length, 3);
		for (const w of d.tunnelWords) {
			assert.ok(w.length <= 13, `${w} is too long`);
			assert.equal(w, w.toUpperCase());
		}
	}
	assert.deepEqual(en.tunnelWords, ['MONEY', 'HOUSEHOLD', 'TOGETHER']);
});

test('canvas rooms: eight uppercase labels in floor plan order', () => {
	for (const d of [de, en]) {
		assert.equal(d.canvasRooms.length, 8);
		for (const r of d.canvasRooms) assert.equal(r, r.toUpperCase());
	}
	assert.deepEqual(en.canvasRooms, [
		'KITCHEN',
		'BATHROOM',
		'ROOM · JONA',
		'HALLWAY',
		'LIVING ROOM',
		'ROOM · LEA',
		'ROOM · LINA',
		'ROOM · MIKA',
	]);
	// The DOM cards use the same words as the canvas labels
	assert.deepEqual(
		en.rooms.map((r) => r.room),
		['KITCHEN', 'LIVING ROOM', 'BATHROOM', 'HALLWAY'],
	);
	for (const r of en.rooms) assert.ok(en.canvasRooms.includes(r.room), r.room);
});

test('headline lengths: hero lines, one-line end, finale lines', () => {
	assert.equal(en.end.title.length, 1);
	assert.ok(en.end.title.join('').length <= 15);
	assert.equal(en.hero.title.length, 2);
	for (const l of en.hero.title) assert.ok(l.trim().length <= 14, `${l} is too long`);
	assert.equal(en.finale.title.length, 2);
	for (const l of en.finale.title) assert.ok(l.length <= 8, `${l} is too long`);
});

test('mono labels are uppercase literals', () => {
	const labels = [
		en.hints.skipIntro,
		en.hints.scroll,
		en.loader.label,
		en.depth.hint,
		en.depth.counter,
		en.howItWorks.title,
		en.install.title,
		en.questions.title,
		en.phone.hint,
		...en.depth.captions.map((c) => c.label),
		...en.people,
	];
	for (const l of labels) assert.equal(l, l.toUpperCase(), l);
	assert.equal(en.hints.skipIntro, 'SKIP INTRO ↓');
	assert.equal(en.phone.hint, 'TAP THE PHONE · THIS IS THE REAL APP');
	assert.equal(`${en.howItWorks.prefix}${en.howItWorks.title}`, '[ 05 ] HOW IT WORKS');
	assert.equal(`${en.install.prefix}${en.install.title}`, '[ 06 ] INSTALL');
	assert.equal(`${en.questions.prefix}${en.questions.title}`, '[ 07 ] QUESTIONS');
});

test('amounts use the English format', () => {
	assert.ok(en.rooms.some((r) => r.amount === '€28.40'));
	assert.ok(de.rooms.some((r) => r.amount === '28,40 €'));
});

// Proper nouns or quoted German terms that may carry German-only letters on English pages.
const GERMAN_LETTER_ALLOWLIST: string[] = [];

test('no English string contains German-only letters', () => {
	for (const [path, s] of strings(en)) {
		if (GERMAN_LETTER_ALLOWLIST.includes(s)) continue;
		assert.ok(!/[äöüÄÖÜß]/.test(s), `${path}: ${s}`);
	}
});

test('install steps keep their symbols and the nowrap token', () => {
	for (const d of [de, en]) {
		const [ios, android, desktop] = d.install.ways;
		assert.ok(ios.steps[0].includes('≡'));
		assert.ok(android.steps[0].includes('⋮'));
		assert.ok(ios.steps[1].includes(d.install.nowrap));
		assert.equal(desktop.steps.length, 3);
	}
	assert.equal(en.install.nowrap, 'Home Screen');
});

test('Android menu: same entries and separators in both languages', () => {
	assert.equal(en.install.android.menu.length, de.install.android.menu.length);
	assert.deepEqual(
		en.install.android.menu.map((m) => m === ''),
		de.install.android.menu.map((m) => m === ''),
	);
});

test('iPhone keyboard: QWERTY in English, QWERTZ in German', () => {
	assert.deepEqual(en.install.ios.keyRows, ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']);
	assert.equal(de.install.ios.keyRows[0].slice(0, 6), 'qwertz');
});

test('links and language switch', () => {
	assert.equal(de.links.other, '/en');
	assert.equal(en.links.other, '/');
	assert.equal(de.footer.language, 'ENGLISH');
	assert.equal(en.footer.language, 'DEUTSCH');
	assert.equal(en.links.guides, '/en/guides');
	assert.equal(en.links.create, '/signup?action=create');
	// German links stay unchanged
	assert.equal(de.links.create, '/signup?action=create');
	assert.equal(de.links.guides, '/ratgeber');
});

test('FAQ: four pairs per language, answers filled', () => {
	for (const d of [de, en]) {
		assert.equal(d.faq.length, 4);
		for (const [q, a] of d.faq) assert.ok(q.endsWith('?') && a.length > 20);
	}
});

test('FAQ: German answers address the group, not one reader', () => {
	const singular = /(^|[^\p{L}])(du|dein\w*|dir|dich)(?![\p{L}])/iu;
	for (const [q, a] of de.faq) {
		assert.doesNotMatch(q, singular);
		assert.doesNotMatch(a, singular);
	}
});
