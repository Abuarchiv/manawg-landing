'use client';

import Lenis from 'lenis';
import { type ReactNode, useEffect } from 'react';

const LG_BREAKPOINT_PX = 1024;

export function LenisProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		if (typeof window === 'undefined') return;
		// Skip on touch/small viewports — Lenis jank on mobile + saves bundle eval cost.
		if (window.innerWidth < LG_BREAKPOINT_PX) return;
		if (matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

		let lenis: Lenis | null = null;
		let rafId = 0;
		let cancelled = false;

		const init = (): void => {
			if (cancelled) return;
			lenis = new Lenis({
				duration: 1.1,
				easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 1.5,
			});
			const raf = (time: number): void => {
				lenis?.raf(time);
				rafId = requestAnimationFrame(raf);
			};
			rafId = requestAnimationFrame(raf);
		};

		// Lenis mutates document.documentElement.className on construction (adds
		// "lenis lenis-smooth"). Because this happens during a useEffect that may
		// commit synchronously alongside the hydration commit, React 19 can flag
		// the class mismatch as a #418 hydration error on the very first paint.
		// Deferring construction to a follow-up task after `requestAnimationFrame`
		// gives the hydration commit a chance to settle first.
		const handle = requestAnimationFrame(() => requestAnimationFrame(init));

		return () => {
			cancelled = true;
			cancelAnimationFrame(handle);
			cancelAnimationFrame(rafId);
			lenis?.destroy();
		};
	}, []);

	return <>{children}</>;
}
