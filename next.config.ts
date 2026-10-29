import type { NextConfig } from 'next';
import { APP_ORIGIN } from './src/lib/app-origin';

// HSTS and upgrade-insecure-requests only on Vercel (https). A local production start over http would
// otherwise be unreachable for WebKit/Chrome on devices (subresources get upgraded to https).
const hsts = process.env.VERCEL
	? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
	: [];
const securityHeaders = [
	...hsts,
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
	},
	{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
	{ key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const demoCsp = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob:",
	"font-src 'self' data:",
	"connect-src 'self'",
	"frame-ancestors 'self'",
	"base-uri 'self'",
	"form-action 'none'",
	"object-src 'none'",
].join('; ');
const publicCache = 'public, max-age=86400, stale-while-revalidate=604800';

// manawg.com is the marketing site only. The app lives on its own origin
// (app.manawg.com) so that installing the PWA opens the app, not this site.
// Old app paths redirect (308) instead of returning 404, so existing links and
// bookmarks keep working and search engines drop the old URLs.
// The origin lives in src/lib/app-origin.ts so the redirects, the sitemap and
// the in-page links cannot drift apart.

const nextConfig: NextConfig = {
	distDir: process.env.NEXT_DIST_DIR ?? '.next',
	typescript: {
		ignoreBuildErrors: false,
		tsconfigPath: process.env.NEXT_TSCONFIG_PATH ?? 'tsconfig.json',
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
	async headers() {
		// The last rule with the same key wins: the app's demo document may be embedded from its own
		// origin (phone in the end scene), everything else stays DENY.
		return [
			{ source: '/:path*', headers: securityHeaders },
			{ source: '/app-demo/:path*', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
			{ source: '/app-demo-en/:path*', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
			// The demo document sits outside the proxy (dot in the path), so it gets its own CSP here.
			{
				source: '/app-demo/index.html',
				headers: [{ key: 'Content-Security-Policy', value: demoCsp }],
			},
			{
				source: '/app-demo-en/index.html',
				headers: [{ key: 'Content-Security-Policy', value: demoCsp }],
			},
			// Files from public without a hash in the name: fresh for one day, then revalidated in the background.
			...[
				'/manawg-mark.svg',
				'/icon-512.png',
				'/og.png',
				'/apple-touch-icon.png',
				'/hand/:path*',
				'/install/:path*',
				'/install-en/:path*',
				'/hero/:path*',
				'/himmel/:path*',
				'/manawg-mark-weiss-80.webp',
				'/manawg-mark-weiss.png',
				'/favicon-16.png',
				'/favicon-32.png',
				'/favicon-48.png',
				'/favicon-96.png',
				'/favicon-192.png',
				'/icon-192.png',
			].map((source) => ({ source, headers: [{ key: 'Cache-Control', value: publicCache }] })),
			// Fonts never change under the same name: cache for one year. A new font file means a new file name.
			{
				source: '/fonts/:path*',
				headers: [
					{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
					// Google listed the font files as "pages" in the index report; they must never enter search.
					{ key: 'X-Robots-Tag', value: 'noindex' },
				],
			},
			// Demo files without a hash in the name: always revalidate via ETag so index.html, demo.js and app.css match.
			{
				source: '/app-demo/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
			},
			{
				source: '/app-demo-en/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
			},
		];
	},
	experimental: {
		globalNotFound: true,
		optimizePackageImports: ['lucide-react', '@react-three/drei'],
		inlineCss: true,
	},
	async redirects() {
		return [
			{ source: '/wg', destination: `${APP_ORIGIN}/neu`, permanent: true },
			{ source: '/wg/:path*', destination: `${APP_ORIGIN}/wg/:path*`, permanent: true },
			{ source: '/neu', destination: `${APP_ORIGIN}/neu`, permanent: true },
			{ source: '/offline', destination: `${APP_ORIGIN}/offline`, permanent: true },
		];
	},
	async rewrites() {
		return [
			// Domain-association files must be served from the apex domain the
			// native apps claim, so these stay proxied rather than redirected —
			// a redirect would break association.
			{ source: '/.well-known/:path*', destination: `${APP_ORIGIN}/.well-known/:path*` },
		];
	},
};

export default nextConfig;
