'use client';

import { css } from '../core/dc';
import { useDict } from '../dict';

// Hints at the bottom edge: skip link out of the intro and the word SCROLLEN. The link sits on a small area
// (landing.css .hinweis) so it stays legible over sky, flood and sculpture.

export function Hints() {
	const dict = useDict();
	return (
		// display:contents: only carries the variables --p and --e (intro/stage.ts), no box of its own
		<div data-hinweise="" style={css('display:contents')}>
			<a
				className="label hinweis"
				aria-label={dict.hints.skipIntroAria}
				data-nur-intro="1"
				data-loch="hinweis"
				data-dunkel="differenz"
				href="#so-gehts"
			>
				{dict.hints.skipIntro}
			</a>
			{/* Focus anchor for keyboard and screen reader: jumps to the app preview at the end of the intro (visible only on focus) */}
			<a className="label fokus-anker" data-nur-intro="1" href="#app-demo">
				{dict.hints.tryApp}
			</a>
			{/* Only over the mountain (fades out with the title): dark like it */}
			<div
				aria-hidden="true"
				data-dunkel=""
				className="label"
				style={css(
					'position:fixed;right:calc(var(--margin) + env(safe-area-inset-right));bottom:max(var(--sp-28),calc(env(safe-area-inset-bottom) + 8px));opacity:calc(0.72 - var(--p,0) * 10);pointer-events:none;z-index:20',
				)}
			>
				{dict.hints.scroll}
			</div>
		</div>
	);
}
