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

/**
 * A local `next start` with pulled production variables must not count as real traffic, and neither
 * must automated browsers (QA runs, Lighthouse, headless crawlers set navigator.webdriver).
 */
function isLocal(): boolean {
	return (
		['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) ||
		(typeof navigator !== 'undefined' && navigator.webdriver === true)
	);
}

/** Site paths are public; anything outside the route charset (a mistyped URL) collapses to one value. */
export function safePath(pathname: string): string {
	return /^(\/[a-z0-9-]+){0,4}\/?$/.test(pathname) ? pathname : '/[other]';
}

/** Button ids are fixed strings from the markup; links without one count as `other`. */
export function ctaId(id: string | undefined): string {
	return id && /^[a-z_]{1,32}$/.test(id) ? id : 'other';
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

/**
 * `document.referrer` stays the entry referrer across client-side navigations, so only the first
 * page view names it; later views come from this site. Clicks keep it for attribution.
 */
export function pageReferrer(
	event: '$pageview' | 'app_link_clicked',
	firstView: boolean,
	referrer: string,
): string {
	return event === '$pageview' && !firstView ? '' : referrer;
}

let firstView = true;

/** `cta`: fixed id of the clicked button (data-cta, e.g. `hero_create`), only on app_link_clicked. */
export function capture(event: '$pageview' | 'app_link_clicked', cta?: string): void {
	if (!POSTHOG_KEY || isLocal()) return;
	const referrer = pageReferrer(event, firstView, document.referrer);
	if (event === '$pageview') firstView = false;
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
				$referring_domain: referringDomain(referrer, location.hostname),
				cta,
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
		capture('app_link_clicked', ctaId(link.dataset.cta));
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

type SentryEventShape = {
	user?: unknown;
	request?: { method?: unknown; url?: unknown; [key: string]: unknown };
	message?: unknown;
	logentry?: unknown;
	extra?: unknown;
	contexts?: unknown;
	tags?: unknown;
	transaction?: unknown;
	culprit?: unknown;
	breadcrumbs?: unknown;
	exception?: {
		values?: Array<{
			type?: unknown;
			value?: unknown;
			stacktrace?: unknown;
			[key: string]: unknown;
		}>;
	};
};

const SAFE_ERROR_TYPES = new Set([
	'Error',
	'RangeError',
	'ReferenceError',
	'SyntaxError',
	'TypeError',
	'URIError',
	'EvalError',
	'AggregateError',
	'AbortError',
	'ChunkLoadError',
	'NetworkError',
	'SecurityError',
	'TimeoutError',
]);

function safeErrorType(value: unknown): string {
	return typeof value === 'string' && SAFE_ERROR_TYPES.has(value) ? value : 'Error';
}

function safeRequestOrigin(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : undefined;
	} catch {
		return undefined;
	}
}

/** Keep only technical error types, stack traces, request methods and origins. */
export function sanitizeSentryEvent<T>(event: T): T {
	const safe = event as unknown as SentryEventShape;
	delete safe.user;
	delete safe.message;
	delete safe.logentry;
	delete safe.extra;
	delete safe.contexts;
	delete safe.tags;
	delete safe.transaction;
	delete safe.culprit;
	delete safe.breadcrumbs;

	if (safe.request) {
		const method = typeof safe.request.method === 'string' ? safe.request.method : undefined;
		const origin = safeRequestOrigin(safe.request.url);
		const request = {
			...(method ? { method } : {}),
			...(origin ? { url: origin } : {}),
		};
		if (Object.keys(request).length > 0) safe.request = request;
		else delete safe.request;
	}

	if (safe.exception?.values) {
		safe.exception = {
			values: safe.exception.values.map((value) => ({
				type: safeErrorType(value.type),
				value: '[redacted]',
				...(value.stacktrace !== undefined ? { stacktrace: value.stacktrace } : {}),
			})),
		};
	}

	return event;
}

export function sanitizeSentryBreadcrumb(_breadcrumb: unknown): null {
	return null;
}

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
				beforeBreadcrumb: sanitizeSentryBreadcrumb,
				beforeSend: sanitizeSentryEvent,
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
