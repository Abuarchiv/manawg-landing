// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { ctaId, referringDomain, safePath } from './telemetry.ts';

const sentrySanitizers = (await import('./telemetry.ts')) as typeof import('./telemetry.ts') & {
	sanitizeSentryEvent: <T>(event: T) => T;
	sanitizeSentryBreadcrumb: (breadcrumb: unknown) => unknown | null;
};

test('page paths are sent as they are, odd paths collapse to one value', () => {
	assert.equal(safePath('/'), '/');
	assert.equal(safePath('/en/guides/wg-putzplan'), '/en/guides/wg-putzplan');
	assert.equal(safePath('/Max.Mustermann@example.com'), '/[other]');
	assert.equal(safePath('/a/b/c/d/e'), '/[other]');
});

test('the button id is a fixed markup id, anything else counts as other', () => {
	assert.equal(ctaId('hero_create'), 'hero_create');
	assert.equal(ctaId(undefined), 'other');
	assert.equal(ctaId('<script>'), 'other');
});

test('only the domain of an external referrer is sent', () => {
	assert.equal(
		referringDomain('https://www.google.com/search?q=wg+app', 'manawg.com'),
		'www.google.com',
	);
	assert.equal(referringDomain('https://manawg.com/en', 'manawg.com'), undefined);
	assert.equal(referringDomain('', 'manawg.com'), undefined);
});

test('Sentry keeps stack traces but removes personal error and request data', () => {
	const event = {
		user: { email: 'person@example.test' },
		message: 'person@example.test',
		logentry: { message: 'invite secret-value' },
		extra: { email: 'person@example.test' },
		contexts: { browser: { userAgent: 'private-agent' }, trace: { trace_id: 'trace-id' } },
		tags: { account: 'private-account' },
		transaction: '/person@example.test?invite=secret-value',
		culprit: '/person@example.test',
		request: {
			method: 'GET',
			url: 'https://manawg.com/person@example.test?invite=secret-value#private',
			headers: { cookie: 'session-secret' },
			data: { email: 'person@example.test' },
		},
		exception: {
			values: [
				{
					type: 'PrivateAccountError',
					value: 'person@example.test invite secret-value',
					stacktrace: { frames: [{ filename: '/_next/static/chunk.js', lineno: 42 }] },
				},
			],
		},
		breadcrumbs: [{ category: 'http', data: { url: 'https://manawg.com/?token=secret-value' } }],
	};

	const sanitized = sentrySanitizers.sanitizeSentryEvent(event) as typeof event;
	assert.equal(sanitized.user, undefined);
	assert.equal(sanitized.message, undefined);
	assert.equal(sanitized.logentry, undefined);
	assert.equal(sanitized.extra, undefined);
	assert.equal(sanitized.contexts, undefined);
	assert.equal(sanitized.tags, undefined);
	assert.equal(sanitized.transaction, undefined);
	assert.equal(sanitized.culprit, undefined);
	assert.deepEqual(sanitized.request, { method: 'GET', url: 'https://manawg.com' });
	assert.equal(sanitized.exception.values[0]?.type, 'Error');
	assert.equal(sanitized.exception.values[0]?.value, '[redacted]');
	assert.deepEqual(sanitized.exception.values[0]?.stacktrace, {
		frames: [{ filename: '/_next/static/chunk.js', lineno: 42 }],
	});
	assert.equal(sanitized.breadcrumbs, undefined);
	assert.doesNotMatch(
		JSON.stringify(sanitized),
		/person@example\.test|secret-value|session-secret|private-account|private-agent/,
	);
});

test('Sentry breadcrumbs are discarded before they can carry request data', () => {
	assert.equal(
		sentrySanitizers.sanitizeSentryBreadcrumb({
			category: 'http',
			data: { url: 'https://manawg.com/?token=secret' },
		}),
		null,
	);
});

test('the privacy texts name every event the website sends', () => {
	const source = readFileSync('src/lib/telemetry.ts', 'utf8');
	const events = source.match(/capture\(event: ([^)]+)\)/)?.[1]?.match(/'([a-z_$]+)'/g) ?? [];
	assert.deepEqual(events, ["'$pageview'", "'app_link_clicked'"]);
	for (const file of ['src/app/(de)/datenschutz/page.tsx', 'src/app/(en)/en/privacy/page.tsx']) {
		assert.match(readFileSync(file, 'utf8'), /app_link_clicked/, file);
	}
});

test('a failing analytics call never throws into the page', async () => {
	process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test';
	const g = globalThis as Record<string, unknown>;
	g.location = { hostname: 'manawg.com', pathname: '/' };
	g.document = { referrer: '' };
	// Plain http on a LAN address: no crypto.randomUUID, as in browsers outside a secure context.
	// A fresh module instance, because the key is read once at load.
	const fresh = './telemetry.ts?insecure';
	const { capture } = (await import(fresh)) as typeof import('./telemetry.ts');
	const randomUUID = crypto.randomUUID;
	Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
	try {
		assert.doesNotThrow(() => capture('$pageview'));
	} finally {
		Object.defineProperty(crypto, 'randomUUID', { value: randomUUID, configurable: true });
	}
});
