/**
 * Native-app haptic feedback via the Vibration API.
 *
 * Why: short, mechanically-meaningful vibrations communicate confirmation
 * the way a native iOS / Android tap does. Web doesn't have UIImpactFeedback,
 * so we approximate by mapping intent → vibration duration:
 *
 *   - light    (15ms)   primary tap, FAB open, toggle
 *   - medium   (25ms)   success confirmation, save
 *   - heavy    (40ms)   destructive confirm, error
 *   - selection ([10,30,10])  picker change
 *
 * No-op on devices without navigator.vibrate (most desktops, iOS Safari).
 * Respects the user's prefers-reduced-motion preference: when set, all
 * haptics are suppressed entirely.
 */

type HapticIntent = 'light' | 'medium' | 'heavy' | 'selection';

const PATTERNS: Readonly<Record<HapticIntent, number | readonly number[]>> = {
	light: 15,
	medium: 25,
	heavy: 40,
	selection: [10, 30, 10],
};

function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function haptic(intent: HapticIntent = 'light'): void {
	if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
	if (prefersReducedMotion()) return;
	const pattern = PATTERNS[intent];
	try {
		navigator.vibrate(pattern as number | number[]);
	} catch {
		// vibrate can throw on some browsers when called from non-user gesture
	}
}
