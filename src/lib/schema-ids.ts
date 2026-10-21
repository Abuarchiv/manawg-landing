import { APP_ORIGIN } from './app-origin';
import { getAppUrl } from './app-url';

/** Stabile JSON-LD-IDs für Organization, WebSite und die App (eine Quelle, kein Drift; die App referenziert dieselben IDs). */
export function schemaIds() {
	const site = getAppUrl();
	return {
		site,
		organisation: `${site}/#organisation`,
		webseite: `${site}/#webseite`,
		app: `${APP_ORIGIN}/#app`,
	};
}
