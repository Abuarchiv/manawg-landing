'use client';

import { appUrl } from '@/lib/app-origin';
import { useEffect, useRef } from 'react';
import s from './Finale.module.css';
import { registerAscii } from './ascii';

export function Finale() {
	const ref = useRef<HTMLCanvasElement>(null);
	const sec = useRef<HTMLElement>(null);
	useEffect(() => registerAscii(ref.current as HTMLCanvasElement), []);
	// Höhe der Fußzeile als --fuss, damit der Titel im Endbild unter dem Kopf steht
	useEffect(() => {
		const fuss = document.getElementById('fusszeile');
		const el = sec.current;
		if (!fuss || !el) return;
		const set = () => el.style.setProperty('--fuss', `${fuss.offsetHeight}px`);
		set();
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(set);
		ro.observe(fuss);
		return () => ro.disconnect();
	}, []);
	return (
		<section
			id="finale"
			data-sec="finale"
			tabIndex={-1}
			ref={sec}
			aria-labelledby="finale-titel"
			className={s.sektion}
		>
			<canvas ref={ref} aria-hidden="true" className={s.feld} />
			<div className={s.inhalt}>
				<div className={s.block}>
					<h2 id="finale-titel" className={s.titel}>
						Alltag
						<br />
						teilen.
					</h2>
					<div className={s.knoepfe}>
						<a
							href={appUrl('/neu?action=create')}
							className={`cta cta--voll cta--gross ${s.knopf}`}
						>
							WG erstellen
						</a>
						<a href={appUrl('/neu')} className={`cta cta--dunkel cta--gross ${s.knopf}`}>
							Einladung einlösen
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
