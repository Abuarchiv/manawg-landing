import { contentSecurityPolicy } from '@manawg/shared/lib/security-headers';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * CSP for pages this zone actually renders itself. /wg, /api, /neu,
 * /offline, /.well-known and /wg-assets are proxied to the `web` zone via
 * next.config.ts rewrites — the matcher below excludes them so this
 * middleware never runs on those requests, leaving the `web` zone's own
 * middleware (see apps/web/src/middleware.ts) as the single source of
 * headers for its own responses.
 */
export function middleware(req: NextRequest): NextResponse {
	const csp = contentSecurityPolicy();
	const requestHeaders = new Headers(req.headers);
	requestHeaders.set('Content-Security-Policy', csp);

	const res = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
	res.headers.set('Content-Security-Policy', csp);
	return res;
}

export const config = {
	matcher: [
		'/((?!wg|api|neu|offline|\\.well-known|wg-assets|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\..*).*)',
	],
};
