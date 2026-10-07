'use client';

import { useEffect, useRef } from 'react';
import { css } from '../core/dc';

// Lader: Zähler 000 bis 100 und Balken. Er hängt nicht am WebGL, sondern wartet auf landing:bereit
// (erstes gezeichnetes Hero-Bild oder Fallback), endet aber spätestens nach 4 s.

const DAUER = 1700; // ms bis 100, bei reduzierter Bewegung 1 ms
const HART = 4000; // ms: harter Abbruch

export function Lader() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current as HTMLDivElement;
		if (el.style.opacity === '0') return;
		const cnt = el.querySelector('[data-count]') as HTMLElement;
		const bar = el.querySelector('[data-bar]') as HTMLElement;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const dur = reduce ? 1 : DAUER;
		const l0 = performance.now();
		let bereit = false;
		const onBereit = () => {
			bereit = true;
		};
		document.addEventListener('landing:bereit', onBereit);
		let iv = 0;
		const tick = () => {
			const ms = performance.now() - l0;
			let k = Math.min(1, ms / dur);
			if (!bereit && ms < HART) k = Math.min(k, 0.97);
			const e = 1 - (1 - k) ** 3;
			cnt.textContent = String(Math.round(e * 100)).padStart(3, '0');
			bar.textContent = '#'.repeat(Math.round(e * 40)).padEnd(40, '.');
			if (k >= 1 || ms >= HART) {
				cnt.textContent = '100';
				bar.textContent = '#'.repeat(40);
				clearInterval(iv);
				el.style.opacity = '0';
				el.style.pointerEvents = 'none';
			}
		};
		iv = window.setInterval(tick, 30);
		tick();
		return () => {
			clearInterval(iv);
			document.removeEventListener('landing:bereit', onBereit);
		};
	}, []);

	return (
		<div
			ref={ref}
			data-loader="1"
			aria-hidden="true"
			style={css(
				'position:fixed;inset:0;z-index:100;background:#0A0A0A;color:#FAFAFA;display:flex;flex-direction:column;justify-content:flex-end;gap:var(--sp-16);padding:var(--rand);transition:opacity 0.7s ease',
			)}
		>
			<span
				data-count="1"
				style={css(
					"font-family:'JetBrains Mono',monospace;font-size:var(--t-176);font-weight:500;line-height:0.9;letter-spacing:-0.05em",
				)}
			>
				000
			</span>
			<div
				style={css(
					'display:flex;justify-content:space-between;align-items:baseline;gap:var(--sp-24)',
				)}
			>
				<span data-bar="1" className="label" style={css('white-space:pre;opacity:1')}>
					........................................
				</span>
				<span className="label">MANAWG · LÄDT DIE WG</span>
			</div>
		</div>
	);
}
