import { APP_ORIGIN } from './app-origin';
import { getAppUrl } from './app-url';

/** Stable JSON-LD ids for Organization, WebSite and the app (one source, no drift; the app references the same ids). */
export function schemaIds() {
	const site = getAppUrl();
	return {
		site,
		organisation: `${site}/#organisation`,
		website: `${site}/#webseite`,
		app: `${APP_ORIGIN}/#app`,
	};
}
