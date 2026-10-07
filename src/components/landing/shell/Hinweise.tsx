'use client';

import { useRef } from 'react';
import { Dc } from '../core/dc';

// Hinweise am unteren Rand: Sprunglink aus der Intro und das Wort SCROLLEN. Beim Überfahren des
// Sprunglinks läuft die Zeichen-Verwürfelung des Entwurfs.

const CH = '@%#*+=-:';

export function Hinweise() {
	const busy = useRef(false);
	const scramble = (e: React.PointerEvent<HTMLElement>) => {
		const el = e.currentTarget;
		if (busy.current) return;
		const orig = el.textContent ?? '';
		busy.current = true;
		let fr = 0;
		const run = () => {
			fr++;
			el.textContent = orig
				.split('')
				.map((c, i) =>
					c === ' ' || i < fr / 2 ? c : (CH[Math.floor(Math.random() * CH.length)] as string),
				)
				.join('');
			if (fr / 2 < orig.length) requestAnimationFrame(run);
			else {
				el.textContent = orig;
				busy.current = false;
			}
		};
		run();
	};
	return (
		<>
			<Dc
				as="a"
				className="label"
				style="position:fixed;left:calc(var(--rand) + env(safe-area-inset-left));bottom:max(var(--sp-28),calc(env(safe-area-inset-bottom) + 8px));cursor:pointer;opacity:calc(0.72 - var(--e,0));z-index:20;text-decoration:none"
				hover="opacity:1"
				data-nur-intro="1"
				data-loch="hinweis"
				href="#so-gehts"
				onPointerOver={scramble}
			>
				INTRO ÜBERSPRINGEN ↓
			</Dc>
			<div
				aria-hidden="true"
				className="label"
				style={{
					position: 'fixed',
					right: 'calc(var(--rand) + env(safe-area-inset-right))',
					bottom: 'max(var(--sp-28),calc(env(safe-area-inset-bottom) + 8px))',
					opacity: 'calc(0.72 - var(--p,0) * 10)',
					pointerEvents: 'none',
					zIndex: 20,
				}}
			>
				SCROLLEN
			</div>
		</>
	);
}
