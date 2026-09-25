'use client';

import type React from 'react';
import type { CSSProperties } from 'react';

type ScrollFadeProps = {
	children: React.ReactNode;
	delay?: number;
	className?: string;
};

/**
 * CSS-only fade-up animation — no IntersectionObserver, no Framer Motion whileInView.
 * Reliable on Mobile + Lenis smooth-scroll + headless browsers.
 *
 * `delay` is in seconds.
 */
export function ScrollFade({ children, delay = 0, className = '' }: ScrollFadeProps) {
	const style: CSSProperties = {
		animationDelay: `${delay}s`,
	};

	return (
		<div className={`animate-fade-up ${className}`} style={style}>
			{children}
		</div>
	);
}
