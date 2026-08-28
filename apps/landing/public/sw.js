// manawg service worker — installability + minimal offline shell
//
// Registered at runtime by src/components/pwa-register.tsx and exercised by
// src/lib/service-worker-push.test.ts. Nothing imports this file, so
// dead-code tooling reports it as unused — it is not. Deleting it breaks
// installability and the offline shell with no build error.
const VERSION = 'manawg-v2';
const SHELL_CACHE = `${VERSION}-shell`;

const SHELL_ASSETS = [
	'/',
	'/offline',
	'/icon-192.png',
	'/icon-512.png',
	'/apple-touch-icon.png',
	'/manifest.json',
];

const cacheResponse = (request, response) => {
	if (response.ok === false) return;
	caches
		.open(SHELL_CACHE)
		.then((cache) => cache.put(request, response))
		.catch(() => undefined);
};

const matchFromCache = (request) => caches.match(request).catch(() => undefined);

const fallbackPushData = {
	body: 'Benachrichtigung konnte nicht gelesen werden.',
	title: 'manawg',
	url: '/',
};

const isCompletePushData = (data) =>
	data !== null &&
	typeof data === 'object' &&
	!Array.isArray(data) &&
	typeof data.body === 'string' &&
	data.body.length > 0 &&
	typeof data.title === 'string' &&
	data.title.length > 0 &&
	typeof data.url === 'string' &&
	data.url.length > 0;

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(SHELL_CACHE)
			.then((cache) => cache.addAll(SHELL_ASSETS))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))),
			)
			.then(() => self.clients.claim()),
	);
});

// --- Web Push ---

self.addEventListener('push', (event) => {
	if (!event.data) return;
	let data;
	try {
		data = event.data.json();
	} catch {
		data = fallbackPushData;
	}
	if (!isCompletePushData(data)) {
		data = fallbackPushData;
	}
	const notificationOptions = {
		body: data.body,
		icon: typeof data.icon === 'string' && data.icon.length > 0 ? data.icon : '/icon-192.png',
		badge: '/icon-192.png',
		data: { url: data.url },
	};
	if (typeof data.tag === 'string' && data.tag.length > 0) {
		notificationOptions.tag = data.tag;
		notificationOptions.renotify = true;
	}
	event.waitUntil(self.registration.showNotification(data.title || 'manawg', notificationOptions));
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	const url = event.notification.data?.url || '/';
	event.waitUntil(
		clients.matchAll({ type: 'window' }).then((wins) => {
			let targetUrl = null;
			try {
				targetUrl = new URL(url, self.location.origin);
			} catch {
				targetUrl = null;
			}
			const isSameOriginTarget = targetUrl?.origin === self.location.origin;
			for (const w of wins) {
				const windowUrl = new URL(w.url);
				if (
					windowUrl.origin === self.location.origin &&
					isSameOriginTarget &&
					w.url === targetUrl.href &&
					'focus' in w
				) {
					return w.focus();
				}
			}
			for (const w of wins) {
				const windowUrl = new URL(w.url);
				if (
					windowUrl.origin === self.location.origin &&
					isSameOriginTarget &&
					windowUrl.pathname === targetUrl.pathname &&
					'focus' in w
				) {
					return w.focus();
				}
			}
			return clients.openWindow(isSameOriginTarget ? url : '/');
		}),
	);
});

// --- Fetch ---

self.addEventListener('fetch', (event) => {
	const { request } = event;

	// Bypass for non-GET, cross-origin, API, auth, supabase calls
	if (request.method !== 'GET') return;
	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;
	if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth')) return;
	if (url.pathname.includes('/_next/data')) return;

	// Network-first for HTML navigations (always serve fresh app shell when online)
	if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
		event.respondWith(
			fetch(request)
				.then((res) => {
					const copy = res.clone();
					cacheResponse(request, copy);
					return res;
				})
				.catch(() =>
					matchFromCache(request).then(
						(cached) =>
							cached || matchFromCache('/offline').then((off) => off || matchFromCache('/')),
					),
				),
		);
		return;
	}

	// Cache-first for static assets (icons, images, fonts)
	if (
		url.pathname.match(/\.(png|jpg|jpeg|svg|ico|woff2?|webp|avif)$/i) ||
		url.pathname.startsWith('/_next/static')
	) {
		event.respondWith(
			matchFromCache(request).then((cached) => {
				if (cached) return cached;
				return fetch(request).then((res) => {
					const copy = res.clone();
					cacheResponse(request, copy);
					return res;
				});
			}),
		);
	}
});
