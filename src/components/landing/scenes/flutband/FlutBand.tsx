'use client';

import { useEffect, useRef } from 'react';
import s from './FlutBand.module.css';
import { registerFlutband } from './horizont';

// Übergang zwischen Ende-Szene und "So geht's": ein Horizont aus Zeichen, der sich nach unten zu den
// drei Ziffern zusammenzieht (horizont.ts). Er steht fest im Fluss und scrollt mit der Ende-Bühne nach oben.
export function FlutBand() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => registerFlutband(ref.current as HTMLCanvasElement), []);
	return (
		<div id="flutband" data-sec="flutband" aria-hidden="true" className={s.band}>
			<canvas ref={ref} className={s.cv} />
		</div>
	);
}
