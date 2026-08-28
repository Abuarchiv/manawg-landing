import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

function loadServiceWorker() {
	const listeners = new Map<string, (event: unknown) => void>();
	const showNotification = vi.fn((_title: string, _options?: NotificationOptions) =>
		Promise.resolve(),
	);

	const context = {
		URL,
		caches: {
			keys: vi.fn(),
			match: vi.fn(),
			open: vi.fn(),
		},
		clients: {
			matchAll: vi.fn(),
			openWindow: vi.fn(),
		},
		fetch: vi.fn(),
		self: {
			addEventListener: (type: string, listener: (event: unknown) => void) => {
				listeners.set(type, listener);
			},
			clients: {
				claim: vi.fn(),
			},
			location: {
				origin: 'https://mana.test',
			},
			registration: {
				showNotification,
			},
			skipWaiting: vi.fn(),
		},
	};

	const source = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');
	vm.runInNewContext(source, context, { filename: 'public/sw.js' });

	return { context, listeners, showNotification };
}

function createRequest(path: string, options: { accept?: string; mode?: string } = {}) {
	return {
		headers: {
			get: vi.fn((name: string) =>
				name.toLowerCase() === 'accept' ? (options.accept ?? null) : null,
			),
		},
		method: 'GET',
		mode: options.mode ?? 'same-origin',
		url: `https://mana.test${path}`,
	};
}

function createFetchEvent(request: ReturnType<typeof createRequest>) {
	let responsePromise: Promise<unknown> | undefined;

	return {
		event: {
			request,
			respondWith: vi.fn((promise: Promise<unknown>) => {
				responsePromise = promise;
			}),
		},
		getResponsePromise: () => {
			expect(responsePromise).toBeDefined();
			return responsePromise as Promise<unknown>;
		},
	};
}

async function waitForBackgroundPromises() {
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('service worker push handler', () => {
	it('RED BUG-120/330: survives malformed push payloads and shows a safe fallback notification', async () => {
		const { listeners, showNotification } = loadServiceWorker();
		const push = listeners.get('push');
		const waitUntil = vi.fn();

		expect(push).toBeTypeOf('function');

		expect(() =>
			push?.({
				data: {
					json: () => {
						throw new SyntaxError('Unexpected token < in JSON');
					},
				},
				waitUntil,
			}),
		).not.toThrow();
		expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
		await waitUntil.mock.calls[0]?.[0];
		expect(showNotification).toHaveBeenCalledWith(
			'manawg',
			expect.objectContaining({
				body: expect.stringContaining('Benachrichtigung'),
				data: { url: '/' },
			}),
		);
	});

	it.each([
		['null', null],
		['string', 'not-an-object'],
		['number', 42],
		['array', []],
		['empty object', {}],
		['missing body', { title: 'Titel', url: '/' }],
		['numeric title', { title: 7, body: 'Hallo', url: '/' }],
		['object body', { title: 'Titel', body: { text: 'Hallo' }, url: '/' }],
		['object url', { title: 'Titel', body: 'Hallo', url: { path: '/wg/MTE8PZAT' } }],
	])(
		'RED BUG-582: treats semantically invalid JSON %s payloads as fallback notifications',
		async (_label, payload) => {
			const { listeners, showNotification } = loadServiceWorker();
			const push = listeners.get('push');
			const waitUntil = vi.fn();

			expect(push).toBeTypeOf('function');

			expect(() =>
				push?.({
					data: {
						json: () => payload,
					},
					waitUntil,
				}),
			).not.toThrow();
			expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
			await waitUntil.mock.calls[0]?.[0];
			expect(showNotification).toHaveBeenCalledWith(
				'manawg',
				expect.objectContaining({
					body: expect.stringContaining('Benachrichtigung'),
					data: { url: '/' },
				}),
			);
		},
	);

	it('RED BUG-331: does not request renotify without a notification tag', async () => {
		const { listeners, showNotification } = loadServiceWorker();
		const push = listeners.get('push');
		const waitUntil = vi.fn();

		expect(push).toBeTypeOf('function');

		push?.({
			data: {
				json: () => ({
					body: 'Du hast eine neue Mahnung.',
					title: 'Neue Mahnung',
					url: '/wg/MTE8PZAT/ausgaben',
				}),
			},
			waitUntil,
		});

		expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
		await waitUntil.mock.calls[0]?.[0];
		const [, options] = showNotification.mock.calls[0] ?? [];

		expect(options).not.toEqual(
			expect.objectContaining({
				renotify: true,
				tag: undefined,
			}),
		);
	});

	it('RED BUG-332: focuses an existing path-matched tab when the notification URL has query params', async () => {
		const { context, listeners } = loadServiceWorker();
		const click = listeners.get('notificationclick');
		const focus = vi.fn(() => Promise.resolve());
		const waitUntil = vi.fn();

		expect(click).toBeTypeOf('function');
		context.clients.matchAll.mockResolvedValue([
			{
				focus,
				url: 'https://mana.test/wg/MTE8PZAT/ausgaben',
			},
		]);
		context.clients.openWindow.mockResolvedValue(undefined);

		click?.({
			notification: {
				close: vi.fn(),
				data: { url: '/wg/MTE8PZAT/ausgaben?highlight=split-1' },
			},
			waitUntil,
		});

		expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
		await waitUntil.mock.calls[0]?.[0];

		expect(context.clients.openWindow).not.toHaveBeenCalled();
		expect(focus).toHaveBeenCalled();
	});

	it('RED BUG-497: falls back to an app URL instead of opening cross-origin notification URLs', async () => {
		const { context, listeners } = loadServiceWorker();
		const click = listeners.get('notificationclick');
		const waitUntil = vi.fn();

		expect(click).toBeTypeOf('function');
		context.clients.matchAll.mockResolvedValue([]);
		context.clients.openWindow.mockResolvedValue(undefined);

		click?.({
			notification: {
				close: vi.fn(),
				data: { url: 'https://evil.test/wg/MTE8PZAT/ausgaben' },
			},
			waitUntil,
		});

		expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
		await waitUntil.mock.calls[0]?.[0];

		expect(context.clients.openWindow).toHaveBeenCalledWith('/');
		expect(context.clients.openWindow).not.toHaveBeenCalledWith(
			'https://evil.test/wg/MTE8PZAT/ausgaben',
		);
	});

	it('RED BUG-575: falls back to an app URL for malformed notification URLs', async () => {
		const { context, listeners } = loadServiceWorker();
		const click = listeners.get('notificationclick');
		const waitUntil = vi.fn();

		expect(click).toBeTypeOf('function');
		context.clients.matchAll.mockResolvedValue([]);
		context.clients.openWindow.mockResolvedValue(undefined);

		click?.({
			notification: {
				close: vi.fn(),
				data: { url: 'http://[malformed-url' },
			},
			waitUntil,
		});

		expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
		await expect(waitUntil.mock.calls[0]?.[0]).resolves.toBeUndefined();

		expect(context.clients.openWindow).toHaveBeenCalledWith('/');
	});

	it('RED BUG-576: prefers an exact notification URL tab before a same-path tab', async () => {
		const { context, listeners } = loadServiceWorker();
		const click = listeners.get('notificationclick');
		const samePathFocus = vi.fn(() => Promise.resolve('same-path'));
		const exactFocus = vi.fn(() => Promise.resolve('exact'));
		const waitUntil = vi.fn();

		expect(click).toBeTypeOf('function');
		context.clients.matchAll.mockResolvedValue([
			{
				focus: samePathFocus,
				url: 'https://mana.test/wg/MTE8PZAT/ausgaben',
			},
			{
				focus: exactFocus,
				url: 'https://mana.test/wg/MTE8PZAT/ausgaben?highlight=split-1',
			},
		]);
		context.clients.openWindow.mockResolvedValue(undefined);

		click?.({
			notification: {
				close: vi.fn(),
				data: { url: '/wg/MTE8PZAT/ausgaben?highlight=split-1' },
			},
			waitUntil,
		});

		expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
		await waitUntil.mock.calls[0]?.[0];

		expect(exactFocus).toHaveBeenCalled();
		expect(samePathFocus).not.toHaveBeenCalled();
		expect(context.clients.openWindow).not.toHaveBeenCalled();
	});
});

describe('service worker fetch cache resilience', () => {
	it('BUG-735: navigation does not write non-OK network responses to cache', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/dashboard', { accept: 'text/html', mode: 'navigate' });
		const networkResponse = {
			clone: vi.fn(() => ({ ok: false, source: 'copy', status: 500 })),
			ok: false,
			source: 'network',
			status: 500,
		};
		const { event, getResponsePromise } = createFetchEvent(request);

		context.fetch.mockResolvedValue(networkResponse);

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(networkResponse);
		await waitForBackgroundPromises();
		expect(context.caches.open).not.toHaveBeenCalled();
	});

	it('BUG-735: static assets do not write non-OK network responses to cache', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/icon-404.png');
		const networkResponse = {
			clone: vi.fn(() => ({ ok: false, source: 'copy', status: 404 })),
			ok: false,
			source: 'network',
			status: 404,
		};
		const { event, getResponsePromise } = createFetchEvent(request);

		context.caches.match.mockResolvedValue(undefined);
		context.fetch.mockResolvedValue(networkResponse);

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(networkResponse);
		await waitForBackgroundPromises();
		expect(context.caches.open).not.toHaveBeenCalled();
	});

	it('BUG-559: navigation falls back to offline shell when reading the navigation cache fails', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/dashboard', { accept: 'text/html', mode: 'navigate' });
		const offlineResponse = { source: 'offline' };
		const { event, getResponsePromise } = createFetchEvent(request);

		context.fetch.mockRejectedValue(new Error('network down'));
		context.caches.match.mockImplementation((candidate: unknown) => {
			if (candidate === request) return Promise.reject(new Error('navigation cache match failed'));
			if (candidate === '/offline') return Promise.resolve(offlineResponse);
			return Promise.resolve(undefined);
		});

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(offlineResponse);
		expect(context.caches.match).toHaveBeenCalledWith('/offline');
	});

	it('BUG-559: static assets try the network when reading the cache fails', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/icon-192.png');
		const networkResponse = { clone: vi.fn(() => ({ source: 'copy' })), source: 'network' };
		const { event, getResponsePromise } = createFetchEvent(request);

		context.caches.match.mockRejectedValue(new Error('static cache match failed'));
		context.caches.open.mockResolvedValue({ put: vi.fn(() => Promise.resolve()) });
		context.fetch.mockResolvedValue(networkResponse);

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(networkResponse);
		expect(context.fetch).toHaveBeenCalledWith(request);
	});

	it('BUG-559: navigation ignores background cache-open failures after a network response', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/dashboard', { accept: 'text/html', mode: 'navigate' });
		const networkResponse = { clone: vi.fn(() => ({ source: 'copy' })), source: 'network' };
		const { event, getResponsePromise } = createFetchEvent(request);

		context.fetch.mockResolvedValue(networkResponse);
		context.caches.open.mockRejectedValue(new Error('cache open failed'));

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(networkResponse);
		await waitForBackgroundPromises();
		expect(context.caches.open).toHaveBeenCalled();
	});

	it('BUG-559: navigation ignores background cache-put failures after a network response', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/dashboard', { accept: 'text/html', mode: 'navigate' });
		const networkResponse = { clone: vi.fn(() => ({ source: 'copy' })), source: 'network' };
		const put = vi.fn(() => Promise.reject(new Error('cache put failed')));
		const { event, getResponsePromise } = createFetchEvent(request);

		context.fetch.mockResolvedValue(networkResponse);
		context.caches.open.mockResolvedValue({ put });

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(networkResponse);
		await waitForBackgroundPromises();
		expect(put).toHaveBeenCalled();
	});

	it('BUG-559: static assets ignore background cache-open failures after a network response', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/icon-192.png');
		const networkResponse = { clone: vi.fn(() => ({ source: 'copy' })), source: 'network' };
		const { event, getResponsePromise } = createFetchEvent(request);

		context.caches.match.mockResolvedValue(undefined);
		context.caches.open.mockRejectedValue(new Error('static cache open failed'));
		context.fetch.mockResolvedValue(networkResponse);

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(networkResponse);
		await waitForBackgroundPromises();
		expect(context.caches.open).toHaveBeenCalled();
	});

	it('BUG-559: static assets ignore background cache-put failures after a network response', async () => {
		const { context, listeners } = loadServiceWorker();
		const fetchHandler = listeners.get('fetch');
		const request = createRequest('/icon-192.png');
		const networkResponse = { clone: vi.fn(() => ({ source: 'copy' })), source: 'network' };
		const put = vi.fn(() => Promise.reject(new Error('static cache put failed')));
		const { event, getResponsePromise } = createFetchEvent(request);

		context.caches.match.mockResolvedValue(undefined);
		context.caches.open.mockResolvedValue({ put });
		context.fetch.mockResolvedValue(networkResponse);

		fetchHandler?.(event);

		await expect(getResponsePromise()).resolves.toBe(networkResponse);
		await waitForBackgroundPromises();
		expect(put).toHaveBeenCalled();
	});
});
