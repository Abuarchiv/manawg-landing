export const INSTALL_DISMISS_KEY = 'manawg:install-dismissed';
const INSTALL_DISMISS_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseInstallDismissedAt(value: string | null): number | null {
	if (value === null || value.trim() === '') return null;
	if (!/^\d+$/.test(value)) return null;
	const dismissedAt = Number(value);
	return Number.isSafeInteger(dismissedAt) && dismissedAt > 0 ? dismissedAt : null;
}

export function isInstallDismissed(value: string | null, now = Date.now()): boolean {
	const dismissedAt = parseInstallDismissedAt(value);
	if (dismissedAt === null) return false;
	return now - dismissedAt < INSTALL_DISMISS_DAYS * MS_PER_DAY;
}

export function createInstallDismissedAt(now = Date.now()): string {
	return String(now);
}
