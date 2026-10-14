import { getAppUrl } from './app-url';

/** Stabile JSON-LD-IDs für Organization und WebSite (eine Quelle, kein Drift). */
export function schemaIds() {
	const site = getAppUrl();
	return { site, organisation: `${site}/#organisation`, webseite: `${site}/#webseite` };
}
