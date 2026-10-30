// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Long tokens (URLs, commands) in the body text must wrap, or the open-source pages scroll
// sideways at 320 px. `anywhere` also lowers the min-content width, which `break-words` does not.
test('topic body text wraps long tokens', () => {
	const source = readFileSync(new URL('./topic-page.tsx', import.meta.url), 'utf8');
	const classNames = source.match(/[^"`]*max-w-\[62ch\][^"`]*/g) ?? [];
	assert.equal(classNames.length, 3);
	for (const cls of classNames) assert.match(cls, /\[overflow-wrap:anywhere\]/);
});
