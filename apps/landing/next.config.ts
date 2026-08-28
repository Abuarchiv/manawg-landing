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

// This zone owns the domain root ("/") in the multi-zone setup — every path
// not listed here is served by this app directly. The listed prefixes proxy
// through to the `web` zone's deployment so the browser never leaves
// manawg.com (required for the shared-origin localStorage auth model — see
// specs/anonymous-auth-no-login.md).
const APP_ZONE_URL = (process.env.APP_ZONE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

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
	// @manawg/shared ships raw TS/TSX (no build step) — Next transpiles it
	// itself, same as it does for this app's own src/.
	transpilePackages: ['@manawg/shared'],
	async headers() {
		return [{ source: '/:path*', headers: securityHeaders }];
	},
	experimental: {
		optimizePackageImports: ['lucide-react', '@react-three/drei'],
	},
	async rewrites() {
		return [
			{ source: '/wg', destination: `${APP_ZONE_URL}/wg` },
			{ source: '/wg/:path*', destination: `${APP_ZONE_URL}/wg/:path*` },
			{ source: '/api/:path*', destination: `${APP_ZONE_URL}/api/:path*` },
			{ source: '/neu', destination: `${APP_ZONE_URL}/neu` },
			{ source: '/offline', destination: `${APP_ZONE_URL}/offline` },
			{ source: '/.well-known/:path*', destination: `${APP_ZONE_URL}/.well-known/:path*` },
			// The web zone's own static assets — see its `assetPrefix` in
			// apps/web/next.config.ts for why this prefix exists.
			{ source: '/wg-assets/:path*', destination: `${APP_ZONE_URL}/wg-assets/:path*` },
		];
	},
};

export default nextConfig;
