import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('security header configuration', () => {
	it('keeps CSP compatible with statically rendered Next.js pages', () => {
		const source = readFileSync(resolve(process.cwd(), 'src/lib/security-headers.ts'), 'utf8');

		expect(source).toContain('"\'unsafe-inline\'"');
		expect(source).not.toContain("'strict-dynamic'");
	});
});
