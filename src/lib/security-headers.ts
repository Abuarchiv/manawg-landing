/**
 * Content-Security-Policy for this site's own middleware.
 *
 * Trimmed down from the old shared policy (which covered a full app with a
 * DB, file storage, and API endpoints) to what a static marketing site
 * actually loads: everything is bundled at build time (fonts, three.js), and
 * the only runtime network calls are same-origin (Vercel Analytics / Speed
 * Insights ship via same-origin script/beacon paths), so 'self' covers it.
 */
export function contentSecurityPolicy(): string {
	const scriptSrc = ["'self'", "'unsafe-inline'"];
	if (process.env.NODE_ENV === 'development') {
		scriptSrc.push("'unsafe-eval'");
	}
	return [
		"default-src 'self'",
		`script-src ${scriptSrc.join(' ')}`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob:",
		"font-src 'self' data:",
		"connect-src 'self'",
		"media-src 'self'",
		"worker-src 'self'",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"object-src 'none'",
		'upgrade-insecure-requests',
	].join('; ');
}
