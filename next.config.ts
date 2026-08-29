import type { NextConfig } from 'next';

const securityHeaders = [
	{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
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

// manawg.com is the marketing site only. The app lives on its own origin
// (app.manawg.com) so that installing the PWA opens the app rather than this
// page — the multi-zone proxy that used to serve /wg and /neu from here made
// the install land on the landing page, which is why the two were split.
//
// Old app paths still REDIRECT rather than 404, so existing links and
// bookmarks keep working. They are 307 (temporary) on purpose while the new
// origin settles; make them permanent once app.manawg.com is confirmed
// stable, because a 308 is cached hard by browsers and painful to walk back.
const APP_ORIGIN = (process.env.APP_ZONE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

// craftsman-ignore: TS002 — Next.js config requires default export
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
		return [{ source: '/:path*', headers: securityHeaders }];
	},
	experimental: {
		optimizePackageImports: ['lucide-react', '@react-three/drei'],
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
