'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { Ende } from '../ende/Ende';
import { HeroTitel } from './HeroTitel';
import { Raeume } from './Raeume';
import { createStage } from './stage';
import { INTRO_SCREENS } from './zeitachse';

// Intro: eine Sticky-Bühne in voller Fenstergröße (100lvh) über (1 + INTRO_SCREENS) Bildschirmhöhen.
// Ebenen von unten nach oben: Berg und Zeichen (Hero), Wohnung, Flut, sicherer Kasten mit Titel und
// Raumkarten (100svh), Ende-Ebene. Die Ende-Ebene scrollt mit der Bühne natürlich weg.

const FLAECHE = 'position:absolute;inset:0;width:100%;height:100%;display:block';

export function Intro() {
	const secRef = useRef<HTMLElement>(null);
	const buehneRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const stage = createStage({
			sec: secRef.current as HTMLElement,
			buehne: buehneRef.current as HTMLDivElement,
		});
		return () => stage.destroy();
	}, []);

	return (
		<section
			id="intro"
			data-sec="intro"
			tabIndex={-1}
			ref={secRef}
			aria-label="Intro"
			style={css(`position:relative;height:calc(${1 + INTRO_SCREENS} * 100lvh)`)}
		>
			<div
				data-buehne="intro"
				ref={buehneRef}
				style={css('position:sticky;top:0;height:100lvh;overflow:hidden')}
			>
				<canvas data-intro="hero" aria-hidden="true" style={css(`${FLAECHE};opacity:var(--g,1)`)} />
				<canvas
					data-intro="wohnung"
					aria-hidden="true"
					style={css(`${FLAECHE};opacity:var(--f,0)`)}
				/>
				<canvas
					data-intro="flut"
					aria-hidden="true"
					style={css(`${FLAECHE};pointer-events:none`)}
				/>
				<div
					data-safe="1"
					style={css('position:absolute;left:0;right:0;top:0;height:100svh;pointer-events:none')}
				>
					<HeroTitel />
					<Raeume />
				</div>
				<Ende />
			</div>
		</section>
	);
}
