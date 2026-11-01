/**
 * Page views and errors for manawg.com, both optional: without NEXT_PUBLIC_POSTHOG_KEY or
 * NEXT_PUBLIC_SENTRY_DSN (forks, local builds, previews) nothing is sent.
 *
 * Analytics goes straight to PostHog's capture endpoint instead of loading posthog-js: the site
 * needs a page-view count, where visitors come from and how many open the app, not the SDK.
 * Same cookieless contract as the app (privacy policy 4f): no cookies, no browser storage, no
 * person profiles; PostHog derives a daily rotating id from IP, user agent and domain.
 */
import { APP_ORIGIN } from './app-origin.ts';

export const POSTHOG_HOST = 'https://eu.i.posthog.com';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/** A local `next start` with pulled production variables must not count as real traffic. */
function isLocal(): boolean {
	return ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
}

/** Site paths are public; anything outside the route charset (a mistyped URL) collapses to one value. */
export function safePath(pathname: string): string {
	return /^(\/[a-z0-9-]+){0,4}\/?$/.test(pathname) ? pathname : '/[other]';
}

/** Only the domain of an external referrer, e.g. `www.google.com`; never the full URL. */
export function referringDomain(referrer: string, ownHost: string): string | undefined {
	try {
		const host = new URL(referrer).hostname;
		return host && host !== ownHost ? host : undefined;
	} catch {
		return undefined;
	}
}

export function capture(event: '$pageview' | 'app_link_clicked'): void {
	if (!POSTHOG_KEY || isLocal()) return;
	try {
		const body = JSON.stringify({
			api_key: POSTHOG_KEY,
			event,
			uuid: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			distinct_id: '$posthog_cookieless',
			properties: {
				$cookieless_mode: true,
				$process_person_profile: false,
				$host: location.hostname,
				$pathname: safePath(location.pathname),
				$raw_user_agent: navigator.userAgent,
				$referring_domain: referringDomain(document.referrer, location.hostname),
			},
		});
		// A beacon survives the navigation to the app and needs no CORS preflight.
		navigator.sendBeacon(`${POSTHOG_HOST}/i/v0/e/`, body);
	} catch {
		// Analytics must never affect the page (randomUUID is missing outside https, for one).
	}
}

function onClick(event: MouseEvent): void {
	const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
	if (link instanceof HTMLAnchorElement && link.href.startsWith(APP_ORIGIN)) {
		capture('app_link_clicked');
	}
}

// Errors thrown before the Sentry SDK has loaded (stage set-up, hydration) are kept and sent once it is ready.
const early: unknown[] = [];
const keepEarly = (event: ErrorEvent | PromiseRejectionEvent) =>
	early.push('reason' in event ? event.reason : event.error);

if (typeof window !== 'undefined' && SENTRY_DSN && !isLocal()) {
	addEventListener('error', keepEarly);
	addEventListener('unhandledrejection', keepEarly);
}

let sentry: Promise<typeof import('@sentry/browser') | null> | undefined;

function loadSentry(dsn: string) {
	sentry ??= import('@sentry/browser')
		.then((Sentry) => {
			Sentry.init({
				dsn,
				environment: 'production',
				release: process.env.NEXT_PUBLIC_RELEASE ?? 'local',
				// No release health: the privacy policy promises no session data.
				integrations: (integrations) =>
					integrations.filter((integration) => integration.name !== 'BrowserSession'),
				beforeBreadcrumb: (crumb) =>
					crumb.category === 'console' || crumb.category === 'ui' ? null : crumb,
				beforeSend(event) {
					delete event.user;
					if (event.request?.url) event.request.url = event.request.url.replace(/[?#].*/, '');
					return event;
				},
			});
			removeEventListener('error', keepEarly);
			removeEventListener('unhandledrejection', keepEarly);
			for (const error of early.splice(0)) Sentry.captureException(error);
			return Sentry;
		})
		.catch(() => null);
	return sentry;
}

/** Errors caught by a React error boundary never reach the window handlers. */
export function reportError(error: unknown): void {
	if (!SENTRY_DSN || isLocal()) return;
	void loadSentry(SENTRY_DSN).then((Sentry) => Sentry?.captureException(error));
}

/** Called once from the root layouts; page views per route come from `capture`. */
export function startTelemetry(): () => void {
	if (isLocal()) return () => {};
	if (POSTHOG_KEY) document.addEventListener('click', onClick, { capture: true });
	const dsn = SENTRY_DSN;
	// The SDK is not needed for the first paint; it loads once the page is idle (Safari has no
	// requestIdleCallback, so a timer stands in).
	const load = () => dsn && loadSentry(dsn);
	const idle = typeof requestIdleCallback === 'function';
	const handle = idle
		? requestIdleCallback(load, { timeout: 4000 })
		: window.setTimeout(load, 2000);
	return () => {
		document.removeEventListener('click', onClick, { capture: true });
		if (idle) cancelIdleCallback(handle);
		else clearTimeout(handle);
	};
}
