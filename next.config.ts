import type { NextConfig } from 'next';
import { APP_ORIGIN } from './src/lib/app-origin';

// HSTS und upgrade-insecure-requests nur auf Vercel (https). Ein lokaler Prod-Start über http bliebe sonst
// für WebKit/Chrome auf Geräten unerreichbar (Subressourcen werden auf https hochgestuft).
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
		value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
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
// (app.manawg.com) so that installing the PWA opens the app rather than this
// page — the multi-zone proxy that used to serve /wg and /neu from here made
// the install land on the landing page, which is why the two were split.
//
// Old app paths still REDIRECT rather than 404, so existing links and
// bookmarks keep working. They are 307 (temporary) on purpose while the new
// origin settles; make them permanent once app.manawg.com is confirmed
// stable, because a 308 is cached hard by browsers and painful to walk back.
// The origin itself lives in src/lib/app-origin.ts so the redirects, the
// sitemap and the in-page CTAs cannot drift apart.

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
		// Die letzte Regel mit gleichem Schlüssel gewinnt: das Demo-Dokument der App darf im eigenen
		// Ursprung eingebettet werden (Handy der Ende-Szene), alles andere bleibt DENY.
		return [
			{ source: '/:path*', headers: securityHeaders },
			{ source: '/app-demo/:path*', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
			// Das Demo-Dokument liegt außerhalb der Middleware (Punkt im Pfad), daher hier eine eigene CSP.
			{
				source: '/app-demo/index.html',
				headers: [{ key: 'Content-Security-Policy', value: demoCsp }],
			},
			// Dateien aus public ohne Hash im Namen: einen Tag frisch, danach im Hintergrund erneuern (F-18.8).
			...[
				'/manawg-mark.svg',
				'/icon-512.png',
				'/og.png',
				'/apple-touch-icon.png',
				'/hand/:path*',
				'/install/:path*',
				'/fonts/:path*',
			].map((source) => ({ source, headers: [{ key: 'Cache-Control', value: publicCache }] })),
			// Demo-Dateien ohne Hash im Namen: immer per ETag prüfen, damit index.html, demo.js und app.css zusammenpassen.
			{
				source: '/app-demo/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
			},
		];
	},
	experimental: {
		optimizePackageImports: ['lucide-react', '@react-three/drei'],
		inlineCss: true,
	},
	async redirects() {
		return [
			{ source: '/wg', destination: `${APP_ORIGIN}/wg`, permanent: false },
			{ source: '/wg/:path*', destination: `${APP_ORIGIN}/wg/:path*`, permanent: false },
			{ source: '/neu', destination: `${APP_ORIGIN}/neu`, permanent: false },
			{ source: '/offline', destination: `${APP_ORIGIN}/offline`, permanent: false },
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
