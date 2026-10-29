/**
 * Origin of the product app (app.manawg.com). manawg.com is the marketing
 * site only — both origins are separate deployments, so every link that
 * leaves this site has to be built from one single constant instead of a
 * literal repeated in pages, nav components and next.config.ts.
 */
export const APP_ORIGIN = 'https://app.manawg.com';

/** Absolute URL on the app origin, e.g. `appUrl('/login')`. */
export function appUrl(path: string): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${APP_ORIGIN}${normalized}`;
}
