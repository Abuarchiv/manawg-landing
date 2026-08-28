// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
	createInstallDismissedAt,
	isInstallDismissed,
	parseInstallDismissedAt,
} from './install-dismissal';

describe('install dismissal helpers', () => {
	it('parses only positive integer timestamps', () => {
		expect(parseInstallDismissedAt('1700000000000')).toBe(1700000000000);
		expect(parseInstallDismissedAt(null)).toBeNull();
		expect(parseInstallDismissedAt('')).toBeNull();
		expect(parseInstallDismissedAt('abc')).toBeNull();
		expect(parseInstallDismissedAt('123.4')).toBeNull();
		expect(parseInstallDismissedAt('-1')).toBeNull();
	});

	it('treats recent dismissals as active and stale/corrupt values as inactive', () => {
		const now = new Date('2026-05-19T10:00:00.000Z').getTime();
		expect(isInstallDismissed(String(now - 13 * 24 * 60 * 60 * 1000), now)).toBe(true);
		expect(isInstallDismissed(String(now - 15 * 24 * 60 * 60 * 1000), now)).toBe(false);
		expect(isInstallDismissed('not-a-time', now)).toBe(false);
	});

	it('serializes dismissal timestamps for localStorage', () => {
		expect(createInstallDismissedAt(1700000000000)).toBe('1700000000000');
	});
});
