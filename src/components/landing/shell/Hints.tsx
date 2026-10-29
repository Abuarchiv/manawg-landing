'use client';

import { useRef } from 'react';
import { css } from '../core/dc';
import { useDict } from '../dict';

// Hints at the bottom edge: skip link out of the intro and the word SCROLLEN. Hovering the
// skip link runs the character scramble of the design. The link sits on a small area
// (landing.css .hinweis) so it stays legible over sky, flood and sculpture.

const CH = '@%#*+=-:';

export function Hints() {
	const dict = useDict();
	const busy = useRef(false);
	const scramble = (e: React.PointerEvent<HTMLElement>) => {
		const el = e.currentTarget;
		if (busy.current) return;
		const original = el.textContent ?? '';
		busy.current = true;
		let fr = 0;
		const run = () => {
			fr++;
			el.textContent = original
				.split('')
				.map((c, i) =>
					c === ' ' || i < fr / 2 ? c : (CH[Math.floor(Math.random() * CH.length)] as string),
				)
				.join('');
			if (fr / 2 < original.length) requestAnimationFrame(run);
			else {
				el.textContent = original;
				busy.current = false;
			}
		};
		run();
	};
	return (
		// display:contents: only carries the variables --p and --e (intro/stage.ts), no box of its own
		<div data-hinweise="" style={css('display:contents')}>
			<a
				className="label hinweis"
				aria-label={dict.hints.skipIntroAria}
				data-nur-intro="1"
				data-loch="hinweis"
				href="#so-gehts"
				onPointerOver={scramble}
			>
				{dict.hints.skipIntro}
			</a>
			{/* Focus anchor for keyboard and screen reader: jumps to the app preview at the end of the intro (visible only on focus) */}
			<a className="label fokus-anker" data-nur-intro="1" href="#app-demo">
				{dict.hints.tryApp}
			</a>
			<div
				aria-hidden="true"
				className="label"
				style={css(
					'position:fixed;right:calc(var(--rand) + env(safe-area-inset-right));bottom:max(var(--sp-28),calc(env(safe-area-inset-bottom) + 8px));opacity:calc(0.72 - var(--p,0) * 10);pointer-events:none;z-index:20',
				)}
			>
				{dict.hints.scroll}
			</div>
		</div>
	);
}
