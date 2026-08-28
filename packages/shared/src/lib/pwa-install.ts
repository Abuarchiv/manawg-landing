'use client';

/**
 * Globaler Single-Source-of-Truth für das `beforeinstallprompt`-Event.
 *
 * Browser feuert das Event nur EINMAL pro Page-Load. Ohne globalen Cache
 * verlieren spät-mountende Komponenten den Event komplett, oder mehrere
 * Listener kämpfen um die Konsumierung.
 *
 * Dieses Modul registriert den Listener so früh wie möglich (Module-Top-Level
 * im Browser), cached den Event auf `window` UND in einem Pub/Sub-Set, sodass
 * jeder Konsument ihn erhält — egal wann er sich subscribed.
 */

export type BeforeInstallEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type Subscriber = (event: BeforeInstallEvent | null) => void;

declare global {
	interface Window {
		__manawgDeferredInstallEvent?: BeforeInstallEvent | null;
	}

	interface Navigator {
		standalone?: boolean;
	}
}

const subscribers = new Set<Subscriber>();
let cached: BeforeInstallEvent | null = null;
let installed = false;
let initialized = false;

function notify() {
	for (const fn of subscribers) fn(cached);
}

function init() {
	if (initialized) return;
	if (typeof window === 'undefined') return;
	initialized = true;

	// Falls schon vor diesem Modul-Load gefired (z.B. via inline script in layout)
	if (window.__manawgDeferredInstallEvent) {
		cached = window.__manawgDeferredInstallEvent as BeforeInstallEvent;
	}

	// Bridge vom inline-script-Custom-Event (für Subscriber-Notifications)
	window.addEventListener('manawg:install-ready', () => {
		const ev = window.__manawgDeferredInstallEvent as BeforeInstallEvent | null;
		if (ev) {
			cached = ev;
			notify();
		}
	});

	window.addEventListener('beforeinstallprompt', (e: Event) => {
		e.preventDefault();
		cached = e as BeforeInstallEvent;
		window.__manawgDeferredInstallEvent = cached;
		notify();
	});

	window.addEventListener('appinstalled', () => {
		installed = true;
		cached = null;
		window.__manawgDeferredInstallEvent = null;
		notify();
	});

	// Falls bereits standalone (App schon installiert)
	if (
		window.matchMedia?.('(display-mode: standalone)').matches ||
		window.navigator.standalone === true
	) {
		installed = true;
	}
}

if (typeof window !== 'undefined') {
	init();
}

export function isAppInstalled(): boolean {
	return installed;
}

export function subscribeInstall(fn: Subscriber): () => void {
	subscribers.add(fn);
	// Sofort mit aktuellem State callen
	fn(cached);
	return () => {
		subscribers.delete(fn);
	};
}

/**
 * Triggert den nativen Install-Prompt. Returns:
 *  - 'accepted' / 'dismissed': User hat entschieden
 *  - 'unavailable': Browser hat kein Event geliefert (PWA-Kriterien nicht erfüllt
 *    oder Browser unterstützt kein Native-Prompt — z.B. iOS Safari)
 */
export async function triggerInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
	const ev = cached;
	if (!ev) return 'unavailable';
	try {
		await ev.prompt();
		const choice = await ev.userChoice;
		// Event nach Konsumierung wegwerfen — Browser feuert nicht erneut
		cached = null;
		window.__manawgDeferredInstallEvent = null;
		notify();
		return choice.outcome;
	} catch {
		return 'unavailable';
	}
}
