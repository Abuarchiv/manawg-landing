import { contentSecurityPolicy } from '@/lib/security-headers';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * CSP for pages this site actually renders itself. /wg, /api, /neu and
 * /offline redirect to app.manawg.com (see next.config.ts), and
 * /.well-known is rewritten there — the matcher below excludes all of
 * these so this middleware never sets a landing-only CSP header on a
 * response that's about to leave this origin anyway.
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
		// Segmentgenau: /wg-app, /wg-kasse usw. sind eigene Seiten und bekommen die CSP; nur /wg, /api, /neu, /offline samt Unterpfaden nicht.
		'/((?!(?:wg|api|neu|offline)(?:/|$)|\\.well-known|wg-assets|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\..*).*)',
	],
};
