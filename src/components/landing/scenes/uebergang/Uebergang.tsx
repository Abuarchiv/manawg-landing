'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { type Flaeche, registerUebergang } from './pixelband';

// Band zwischen zwei Abschnitten, der von einer Fläche in die andere frisst (siehe pixelband.ts).
// Es steht fest im Dokumentfluss, oben in der Farbe des Abschnitts davor, unten in der des Abschnitts danach.
// Ohne Skript (oder vor dem ersten Bild) liegt die Farbe des Abschnitts danach als Grund darunter.

const GRUND: Record<Flaeche, string> = { schwarz: '#0A0A0A', papier: '#F2F2F2' };

export function Uebergang({ id, nach, seed }: { id: string; nach: Flaeche; seed: number }) {
	const band = useRef<HTMLDivElement>(null);
	const cv = useRef<HTMLCanvasElement>(null);
	useEffect(
		() =>
			registerUebergang(
				cv.current as HTMLCanvasElement,
				band.current as HTMLDivElement,
				nach,
				seed,
			),
		[nach, seed],
	);
	return (
		<div
			ref={band}
			id={id}
			data-sec={id}
			aria-hidden="true"
			style={css(
				`position:relative;height:clamp(280px,56svh,620px);overflow:hidden;background:${GRUND[nach]}`,
			)}
		>
			<canvas
				ref={cv}
				style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
			/>
		</div>
	);
}
