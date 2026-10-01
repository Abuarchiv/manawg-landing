// Tombstone service worker.
//
// manawg.com used to serve the app through a multi-zone proxy and registered a
// caching service worker here. The app now lives on its own origin
// (app.manawg.com) with its own worker, so this one must stand down — a
// browser keeps an installed worker running until it is explicitly
// unregistered, and the old one would otherwise keep serving a cached app
// shell from a zone that no longer exists.
//
// Deleting the file would NOT achieve that: an already-installed worker
// survives a 404 on its script. So this replaces it with one that clears every
// cache, unregisters itself, and reloads any open page onto the live site.
//
// Keep this file until it is safe to assume no installed worker remains.

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.map((key) => caches.delete(key)));
			await self.registration.unregister();
			const clientList = await self.clients.matchAll({ type: 'window' });
			for (const client of clientList) {
				// navigate() drops the page off the dead worker; if the client
				// disallows it, the next normal load is already uncontrolled.
				client.navigate(client.url).catch(() => undefined);
			}
		})(),
	);
});

// No fetch handler on purpose: with none registered the browser bypasses this
// worker entirely, so nothing is served from cache while it is being removed.
