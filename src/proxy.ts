import { type NextRequest, NextResponse } from 'next/server';
import { LOCALE_COOKIE, languageDecision } from '@/lib/language-redirect';
import { contentSecurityPolicy } from '@/lib/security-headers';

/**
 * CSP for pages this site actually renders itself. /wg, /api, /neu and
 * /offline redirect to app.manawg.com (see next.config.ts), and
 * /.well-known is rewritten there — the matcher below excludes all of
 * these so this proxy never sets a landing-only CSP header on a
 * response that's about to leave this origin anyway.
 *
 * It also picks the language on arrival (src/lib/language-redirect.ts): a visitor from outside whose
 * system does not prefer German is sent to the English page, and the footer language link stores the choice.
 */
export function proxy(req: NextRequest): NextResponse {
	const language =
		req.method === 'GET'
			? languageDecision({
					path: req.nextUrl.pathname,
					cookie: req.cookies.get(LOCALE_COOKIE)?.value,
					acceptLanguage: req.headers.get('accept-language'),
					userAgent: req.headers.get('user-agent'),
					referer: req.headers.get('referer'),
					origin: req.nextUrl.origin,
				})
			: {};
	if (language.redirect) {
		const url = req.nextUrl.clone();
		url.pathname = language.redirect;
		const res = NextResponse.redirect(url, 307);
		res.headers.set('Cache-Control', 'private, no-store');
		res.headers.set('Vary', 'Accept-Language, Cookie');
		return res;
	}

	const csp = contentSecurityPolicy();
	const requestHeaders = new Headers(req.headers);
	requestHeaders.set('Content-Security-Policy', csp);

	const res = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
	res.headers.set('Content-Security-Policy', csp);
	if (language.remember) {
		res.cookies.set(LOCALE_COOKIE, language.remember, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax',
			secure: req.nextUrl.protocol === 'https:',
		});
	}
	return res;
}

export const config = {
	matcher: [
		// Segment-exact: /wg-app, /wg-kasse etc. are pages of their own and get the CSP; only /wg, /api, /neu, /offline and their subpaths do not.
		'/((?!(?:wg|api|neu|offline)(?:/|$)|\\.well-known|wg-assets|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\..*).*)',
	],
};
