'use client';

import { useEffect, useRef } from 'react';
import s from './Fusszeile.module.css';
import { registerBerg } from './berg';

/** Gestochenes Gebirge unter den Spalten der Fußzeile (WebGL-Canvas über die ganze Fußzeile). */
export function Berg() {
	const flaeche = useRef<HTMLDivElement>(null);
	const cv = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const el = flaeche.current as HTMLDivElement;
		const fuss = el.closest('footer') as HTMLElement;
		return registerBerg(el, cv.current as HTMLCanvasElement, fuss);
	}, []);
	return (
		<div ref={flaeche} aria-hidden="true" className={s.berg}>
			<canvas ref={cv} className={s.bergCv} />
		</div>
	);
}
