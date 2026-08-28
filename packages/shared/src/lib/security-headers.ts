/**
 * Content-Security-Policy shared by both zones' middleware so the policy
 * can't drift between `web` and `landing` — they serve one origin and must
 * agree on what that origin is allowed to load.
 */
export function contentSecurityPolicy(): string {
	const scriptSrc = ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'];
	const styleSrc = ["'self'", "'unsafe-inline'"];
	const connectSrc = [
		"'self'",
		'https://cdn.jsdelivr.net',
		'https://*.s3.amazonaws.com',
		'https://*.amazonaws.com',
		'https://*.neon.tech',
		'https://*.vercel-storage.com',
	];
	const workerSrc = ["'self'", 'blob:', 'https://cdn.jsdelivr.net'];
	if (process.env.NODE_ENV === 'development') {
		scriptSrc.push("'unsafe-eval'");
	}
	return [
		"default-src 'self'",
		`script-src ${scriptSrc.join(' ')}`,
		`style-src ${styleSrc.join(' ')}`,
		"img-src 'self' data: blob: https://*.amazonaws.com",
		"font-src 'self' data:",
		`connect-src ${connectSrc.join(' ')}`,
		"media-src 'self' blob: https://*.amazonaws.com",
		`worker-src ${workerSrc.join(' ')}`,
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"object-src 'none'",
		'upgrade-insecure-requests',
	].join('; ');
}
