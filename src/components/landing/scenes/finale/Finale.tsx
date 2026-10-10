'use client';

import { appUrl } from '@/lib/app-origin';
import { useEffect, useRef } from 'react';
import s from './Finale.module.css';
import { registerHimmel } from './himmel';

export function Finale() {
	const sec = useRef<HTMLElement>(null);
	const ebene = useRef<HTMLDivElement>(null);
	const himmel = useRef<HTMLCanvasElement>(null);
	useEffect(
		() =>
			registerHimmel(
				ebene.current as HTMLDivElement,
				himmel.current as HTMLCanvasElement,
				sec.current as HTMLElement,
			),
		[],
	);
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
			<div ref={ebene} aria-hidden="true" className={s.feld}>
				<canvas ref={himmel} className={s.feld} />
			</div>
			<div className={s.inhalt}>
				<div className={s.block}>
					<h2 id="finale-titel" className={s.titel}>
						Alltag
						<br />
						teilen.
					</h2>
					<div data-knoepfe="1" className={s.knoepfe}>
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
