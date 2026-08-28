'use client';

import type React from 'react';
import type { CSSProperties } from 'react';

type ScrollFadeProps = {
	children: React.ReactNode;
	delay?: number;
	y?: number;
	className?: string;
	/** Kept for API compatibility — no-op with CSS animation (always fires on mount). */
	immediate?: boolean;
};

/**
 * CSS-only fade-up animation — no IntersectionObserver, no Framer Motion whileInView.
 * Reliable on Mobile + Lenis smooth-scroll + headless browsers.
 *
 * `delay` accepts seconds (legacy animation callers) or milliseconds.
 * We normalise: values > 5 are treated as ms, else as seconds → converted to ms.
 */
export function ScrollFade({
	children,
	delay = 0,
	// y prop is ignored — the CSS keyframe hardcodes 24px which matches original
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	y: _y,
	className = '',
	// immediate prop no longer needed — kept for API compat
	immediate: _immediate,
}: ScrollFadeProps) {
	// Normalise delay: older callers pass seconds (0.1, 0.2...),
	// so values <= 5 are seconds → multiply by 1000.
	const delayMs = delay > 5 ? delay : delay * 1000;

	const style: CSSProperties = {
		animationDelay: `${delayMs}ms`,
	};

	return (
		<div className={`animate-fade-up ${className}`} style={style}>
			{children}
		</div>
	);
}
