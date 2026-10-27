'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { startZerfall } from './zeichen';

// Fest am Fenster über dem Inhalt, unter dem Kopf: die Zeichen des Übergangs Handy → So geht's (zeichen.ts).
export function Zerfall() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => startZerfall(ref.current as HTMLCanvasElement), []);
	return (
		<canvas
			ref={ref}
			aria-hidden="true"
			style={css(
				'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:12',
			)}
		/>
	);
}
