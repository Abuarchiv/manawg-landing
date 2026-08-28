function cleanEnvUrl(value: string | undefined): string | null {
	const trimmed = value?.trim().replace(/^['"]|['"]$/g, '');
	return trimmed && trimmed.length > 0 ? trimmed : null;
}

function withHttps(value: string): string {
	return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/**
 * Single source of truth for the app's public origin, shared by both the
 * `landing` and `web` zones so SEO metadata (sitemap/robots/OG) and canonical
 * links stay identical across the split — both zones serve the same origin.
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

	return 'http://localhost:3000';
}
