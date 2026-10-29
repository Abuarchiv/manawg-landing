'use client';

import { useRef } from 'react';
import { css } from '../core/dc';
import { useDict } from '../dict';

// Hinweise am unteren Rand: Sprunglink aus der Intro und das Wort SCROLLEN. Beim Überfahren des
// Sprunglinks läuft die Zeichen-Verwürfelung des Entwurfs. Der Link steht auf einer kleinen Fläche
// (landing.css .hinweis), damit er auf Himmel, Flut und Skulptur lesbar bleibt.

const CH = '@%#*+=-:';

export function Hinweise() {
	const dict = useDict();
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
		// display:contents: nur Träger der Variablen --p und --e (intro/stage.ts), ohne eigenen Kasten
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
			{/* Fokusanker für Tastatur und Screenreader: springt zur App-Vorschau am Ende der Intro (sichtbar nur bei Fokus) */}
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
