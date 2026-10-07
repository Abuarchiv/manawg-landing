'use client';

import { appUrl } from '@/lib/app-origin';
import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { modeOf } from '../../core/loop';
import { Phone } from './Phone';
import { kamera } from './kamera';

// Ende-Ebene der Intro-Bühne: Handy und Hände auf #0A0A0A, darunter Titel und Knopf. Die Ebene liegt in
// der Sticky-Bühne und scrollt mit ihr weg. Der Ende-Raum [data-ende-space] ist 1280 x 800 groß und wird
// über --ende-x, --ende-y und --ende-f per kamera() in die Bühne eingepasst.

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
				'position:absolute;inset:0;opacity:var(--e,0);pointer-events:none;background:#0A0A0A',
			)}
		>
			<canvas
				data-hand="back"
				aria-hidden="true"
				style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
			/>
			<div
				ref={spaceRef}
				data-ende-space="1"
				style={css(
					'position:absolute;left:0;top:0;width:1280px;height:800px;transform-origin:0 0;transform:translate(var(--ende-x,0px),var(--ende-y,0px)) scale(var(--ende-f,1))',
				)}
			>
				<Phone />
			</div>
			<canvas
				data-hand="front"
				aria-hidden="true"
				style={css(
					'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;mix-blend-mode:difference',
				)}
			/>
			<div
				data-safe-ende="1"
				style={css('position:absolute;left:0;right:0;top:0;height:100svh;pointer-events:none')}
			>
				<div
					style={css(
						'position:absolute;left:var(--rand);bottom:var(--sp-48);display:flex;flex-direction:column;gap:var(--sp-24);color:#FAFAFA',
					)}
				>
					<h2
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-96);line-height:0.9;letter-spacing:-0.05em",
						)}
					>
						Alltag
						<br />
						teilen.
					</h2>
					<a
						data-cta="1"
						className="cta cta--rand cta--gross"
						href={appUrl('/neu?action=create')}
						style={css('align-self:flex-start')}
					>
						WG erstellen
					</a>
				</div>
			</div>
		</section>
	);
}
