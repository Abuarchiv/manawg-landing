type HapticIntent = 'light' | 'medium';

function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function haptic(intent: HapticIntent = 'light'): void {
	if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
	if (prefersReducedMotion()) return;
	try {
		navigator.vibrate(intent === 'medium' ? 25 : 15);
	} catch {
		// vibrate can throw on some browsers when called from non-user gesture
	}
}
