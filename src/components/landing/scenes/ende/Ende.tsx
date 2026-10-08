'use client';

import { appUrl } from '@/lib/app-origin';
import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { modeOf } from '../../core/loop';
import s from './Ende.module.css';
import { Phone } from './Phone';
import { kamera } from './kamera';

// Ende-Ebene der Intro-Bühne: Handy und Hände auf #0A0A0A, darunter Titel und Knopf. Die Ebene liegt in
// der Sticky-Bühne und scrollt mit ihr weg. Der Ende-Raum [data-ende-space] ist 1280 x 800 groß und wird
// über --ende-x, --ende-y und --ende-f per kamera() in die Bühne eingepasst. Titel und Knopf stehen im DOM vor dem
// Handy, damit Shift+Tab aus dem App-iframe auf dem Knopf landet (nicht auf dem Body); Kopf und Hinweise sind im Ende inert.

export function Ende() {
	const spaceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const space = spaceRef.current as HTMLDivElement;
		const stage = space.closest('[data-buehne]') as HTMLElement;
		const safe = stage.querySelector('[data-safe]') as HTMLElement;
		const set = () => {
			const W = stage.clientWidth;
			const cam = kamera(W, stage.clientHeight, safe.clientHeight, modeOf(W, innerHeight).mode);
			space.style.setProperty('--ende-x', `${cam.ox}px`);
			space.style.setProperty('--ende-y', `${cam.oy}px`);
			space.style.setProperty('--ende-f', String(cam.f));
		};
		set();
		const ro = new ResizeObserver(set);
		ro.observe(stage);
		ro.observe(safe);
		return () => ro.disconnect();
	}, []);

	return (
		<section
			data-ende="1"
			aria-label="App-Vorschau"
			style={css(
				'position:absolute;inset:0;opacity:calc(clamp(0, (var(--e,0) - 0.35) * 1.54, 1) * (1 - var(--ab,0)));pointer-events:none;background:#0A0A0A',
			)}
		>
			<canvas
				data-hand="back"
				aria-hidden="true"
				style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
			/>
			<div
				data-safe-ende="1"
				style={css('position:absolute;left:0;right:0;top:0;height:100svh;pointer-events:none')}
			>
				<div className={s.titel} data-ende-titel="1">
					<h2 data-quiet="1" className={s.h}>
						Alltag <br />
						teilen.
					</h2>
					<a
						data-cta="1"
						data-quiet="1"
						className={`cta cta--voll cta--gross ${s.knopf}`}
						href={appUrl('/neu?action=create')}
					>
						WG erstellen
					</a>
				</div>
			</div>
			<div
				ref={spaceRef}
				data-ende-space="1"
				style={css(
					'position:absolute;left:0;top:0;width:1280px;height:800px;transform-origin:0 0;transform:translate(var(--ende-x,0px),var(--ende-y,0px)) scale(var(--ende-f,1)) translate(var(--ax,0px),var(--ay,0px)) translate(800px,400px) rotate(var(--ar,0deg)) translate(-800px,-400px)',
				)}
			>
				<Phone />
			</div>
			<canvas
				data-hand="front"
				aria-hidden="true"
				style={css(
					'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none',
				)}
			/>
		</section>
	);
}
