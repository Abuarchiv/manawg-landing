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
	// Höhe der Fußzeile als --fuss, damit der Titel im Endbild unter dem Kopf steht. Passt die Fußzeile samt
	// Titelblock nicht in den Viewport (Fußzeile mit Kurztext ist höher als ein Bildschirm), gilt die Endbild-Regel
	// nicht: dann steht der Titel in der Mitte des Finales und die Fußzeile folgt darunter.
	useEffect(() => {
		const fuss = document.getElementById('fusszeile');
		const el = sec.current;
		const inhalt = el?.querySelector<HTMLElement>(`.${s.inhalt}`);
		const block = el?.querySelector<HTMLElement>(`.${s.block}`);
		if (!fuss || !el || !inhalt || !block) return;
		const set = () => {
			const cs = getComputedStyle(inhalt);
			const noetig =
				block.offsetHeight + Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom);
			const passt = window.innerHeight - fuss.offsetHeight >= noetig;
			el.style.setProperty('--fuss', `${passt ? fuss.offsetHeight : 0}px`);
		};
		set();
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(set);
		ro.observe(fuss);
		ro.observe(block);
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
						Zieht
						<br />
						ein.
					</h2>
					<div data-knoepfe="1" className={s.knoepfe}>
						<a
							href={appUrl('/registrieren?action=create')}
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
