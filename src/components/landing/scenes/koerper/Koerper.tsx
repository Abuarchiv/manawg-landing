'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import m from './Koerper.module.css';
import { registerKoerper } from './physik';

export function Koerper() {
	const ref = useRef<HTMLCanvasElement>(null);
	const sek = useRef<HTMLElement>(null);
	// Beim Verlassen nach oben blendet der Abschnitt aus (keine abgeschnittenen Kugelkuppen unter dem Kopf)
	useEffect(() => {
		const el = sek.current as HTMLElement;
		let raf = 0;
		const f = () => {
			raf = 0;
			const o = Math.min(1, Math.max(0, el.getBoundingClientRect().bottom / (0.55 * innerHeight)));
			const v = o.toFixed(2);
			if (el.style.getPropertyValue('--kb') !== v) el.style.setProperty('--kb', v);
		};
		const on = () => {
			if (!raf) raf = requestAnimationFrame(f);
		};
		f();
		window.addEventListener('scroll', on, { passive: true });
		window.addEventListener('resize', on);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('scroll', on);
			window.removeEventListener('resize', on);
		};
	}, []);
	const api = useRef<{ wurf?: () => void }>({});
	useEffect(() => registerKoerper(ref.current as HTMLCanvasElement, api.current), []);
	return (
		<section
			ref={sek}
			id="koerper"
			data-sec="koerper"
			tabIndex={-1}
			aria-labelledby="koerper-titel"
			className={m.sektion}
		>
			<canvas
				ref={ref}
				aria-hidden="true"
				style={css(
					'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:var(--kb,1);touch-action:pan-y',
				)}
			/>
			<div
				data-titel="1"
				style={css(
					'position:absolute;left:var(--rand);top:calc(var(--kopf-unten) + var(--sp-14));display:flex;flex-direction:column;gap:var(--sp-10);pointer-events:none',
				)}
			>
				<span className="label">[ ACHT KÖRPER ]</span>
				<h2
					id="koerper-titel"
					style={css(
						"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-40);line-height:1.1;letter-spacing:-0.03em;margin:0;overflow-wrap:break-word;mix-blend-mode:difference",
					)}
				>
					Wirf sie. Sie finden zurück.
				</h2>
				<span className="label" aria-hidden="true">
					<span className={m.maus}>[ ZIEHEN ZUM WERFEN ]</span>
					<span className={m.touch}>[ ANTIPPEN UND WERFEN ]</span>
				</span>
			</div>
			{/* Tastatur: ein Wurf für alle Körper (sichtbar nur bei Fokus) */}
			<button type="button" className={`label ${m.wurf}`} onClick={() => api.current.wurf?.()}>
				Körper werfen
			</button>
		</section>
	);
}
