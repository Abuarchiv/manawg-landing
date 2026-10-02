/**
 * Content-Security-Policy for this site's own middleware.
 *
 * Trimmed down from the old shared policy (which covered a full app with a
 * DB, file storage, and API endpoints) to what a static marketing site
 * actually loads: everything is bundled at build time (fonts, three.js), and
 * the only runtime network calls are same-origin (Vercel Analytics / Speed
 * Insights ship via same-origin script/beacon paths), so 'self' covers it.
 *
 * Why 'unsafe-inline' is still in script-src: every page here is statically
 * rendered, and Next.js ships its bootstrap/flight payload as inline
 * scripts whose contents change on every build. The alternative — a
 * per-request nonce — is impossible on a statically rendered page, so it
 * would force all four pages into dynamic rendering and give up CDN caching
 * of the HTML. That trade is not worth taking for a page that renders no
 * user-controlled markup, so the inline allowance stays and the inline
 * *event handler* vector is closed instead via script-src-attr 'none'.
 */
export function contentSecurityPolicy(): string {
	// wasm-unsafe-eval: Draco-Decoder (WebAssembly) für das 3D-Modell der Startseite
	const scriptSrc = ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"];
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
		"connect-src 'self'",
		"media-src 'self'",
		// DRACOLoader startet seine Worker aus einem blob:-URL
		"worker-src 'self' blob:",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"object-src 'none'",
		'upgrade-insecure-requests',
	].join('; ');
}
