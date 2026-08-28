'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker for PWA installability.
 * Mounted in the root layout — runs once on hydration.
 */
export function PwaRegister() {
	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (!('serviceWorker' in navigator)) return;
		if (process.env.NODE_ENV === 'development') {
			// Skip SW in dev to avoid cache surprises during HMR
			return;
		}

		const register = () => {
			const serviceWorker = navigator.serviceWorker;
			if (!serviceWorker || typeof serviceWorker.register !== 'function') return;

			serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
				// Non-fatal: site still works without SW
				// eslint-disable-next-line no-console
				console.warn('[manawg] SW registration failed:', err);
			});
		};

		if (document.readyState === 'complete') {
			register();
		} else {
			window.addEventListener('load', register, { once: true });
		}
	}, []);

	return null;
}
