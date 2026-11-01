import { POSTHOG_HOST } from './telemetry.ts';

/** Origin of a configured https endpoint (the Sentry DSN), or null. */
function httpsOrigin(value: string | undefined): string | null {
	try {
		const url = new URL(value ?? '');
		return url.protocol === 'https:' ? url.origin : null;
	} catch {
		return null;
	}
}

/**
 * CSP of this static site; only same-origin resources are loaded, so 'self'
 * is enough. The optional telemetry endpoints (src/lib/telemetry.ts) are the only other origins.
 *
 * script-src keeps 'unsafe-inline' because Next.js emits inline bootstrap
 * scripts whose content changes per build, and a per-request nonce would force
 * dynamic rendering (no CDN caching). Inline event handlers are blocked
 * instead via script-src-attr 'none'.
 */
export function contentSecurityPolicy(): string {
	const scriptSrc = ["'self'", "'unsafe-inline'"];
	if (process.env.NODE_ENV === 'development') {
		// React Fast Refresh / the dev overlay evaluate code at runtime; this
		// branch is unreachable in a production build.
		scriptSrc.push("'unsafe-eval'");
	}
	return [
		"default-src 'self'",
		`script-src ${scriptSrc.join(' ')}`,
		// React attaches listeners through its own event system, never through
		// inline on* attributes, so blocking script attributes closes the
		// XSS-by-attribute vector without breaking any component.
		"script-src-attr 'none'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob:",
		"font-src 'self' data:",
		[
			"connect-src 'self'",
			...(process.env.NEXT_PUBLIC_POSTHOG_KEY ? [POSTHOG_HOST] : []),
			...[httpsOrigin(process.env.NEXT_PUBLIC_SENTRY_DSN)].filter(Boolean),
		].join(' '),
		"media-src 'self'",
		"worker-src 'self'",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"object-src 'none'",
		...(process.env.VERCEL ? ['upgrade-insecure-requests'] : []),
	].join('; ');
}
