'use client';

import { useDict } from '../dict';

// Hint at the bottom edge: the word SCROLLEN, fades out once the intro moves.

export function Hints() {
	const dict = useDict();
	return (
		// display:contents: only carries the variable --p (intro/stage.ts), no box of its own
		<div data-hints="" style={{ display: 'contents' }}>
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
