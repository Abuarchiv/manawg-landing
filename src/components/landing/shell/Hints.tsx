'use client';

import { useDict } from '../dict';

// Hints at the bottom edge: skip link out of the intro and the word SCROLLEN. The link sits on a small area
// (landing.css .hint) so it stays legible over sky, flood and sculpture.

export function Hints() {
	const dict = useDict();
	return (
		// display:contents: only carries the variable --p (intro/stage.ts), no box of its own
		<div data-hints="" style={{ display: 'contents' }}>
			<a
				className="label hint"
				aria-label={dict.hints.skipIntroAria}
				data-intro-only="1"
				data-hole="hint"
				href="#so-gehts"
			>
				{dict.hints.skipIntro}
			</a>
			<div
				aria-hidden="true"
				className="label"
				style={{
					position: 'fixed',
					right: 'calc(var(--margin) + env(safe-area-inset-right))',
					bottom: 'max(var(--sp-28),calc(env(safe-area-inset-bottom) + 8px))',
					opacity: 'calc(0.72 - var(--p,0) * 10)',
					pointerEvents: 'none',
					zIndex: '20',
				}}
			>
				{dict.hints.scroll}
			</div>
		</div>
	);
}
