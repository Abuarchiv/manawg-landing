function cleanEnvUrl(value: string | undefined): string | null {
	const trimmed = value?.trim().replace(/^['"]|['"]$/g, '');
	return trimmed && trimmed.length > 0 ? trimmed : null;
}

function withHttps(value: string): string {
	return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/**
 * Public origin of this site (manawg.com), used for canonical links, sitemap,
 * robots and OG metadata. The app has its own origin in app-origin.ts.
 */
export function getAppUrl(): string {
	const rawAppUrl = cleanEnvUrl(process.env.NEXT_PUBLIC_APP_URL);
	if (rawAppUrl) {
		return rawAppUrl.replace(/\/$/, '');
	}

	const rawProdUrl = cleanEnvUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
	if (rawProdUrl) {
		return withHttps(rawProdUrl).replace(/\/$/, '');
	}

	const rawVercelUrl = cleanEnvUrl(process.env.VERCEL_URL);
	if (rawVercelUrl) {
		return withHttps(rawVercelUrl).replace(/\/$/, '');
	}

	// A production build without variables (local, vercel build --prebuilt) would otherwise bake localhost into canonical and OG
	return process.env.NODE_ENV === 'production' ? 'https://manawg.com' : 'http://localhost:3100';
}
