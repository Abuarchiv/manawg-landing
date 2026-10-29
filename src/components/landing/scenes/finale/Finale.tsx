'use client';

import { appUrl } from '@/lib/app-origin';
import { useEffect, useRef } from 'react';
import { BrLines, useDict } from '../../dict';
import s from './Finale.module.css';
import { registerSky } from './sky';

export function Finale() {
	const { finale, links } = useDict();
	const sec = useRef<HTMLElement>(null);
	const layer = useRef<HTMLDivElement>(null);
	const sky = useRef<HTMLCanvasElement>(null);
	useEffect(
		() =>
			registerSky(
				layer.current as HTMLDivElement,
				sky.current as HTMLCanvasElement,
				sec.current as HTMLElement,
			),
		[],
	);
	// Höhe der Fußzeile als --fuss, damit der Titel im Endbild unter dem Kopf steht. Passt die Fußzeile samt
	// Titelblock nicht in den Viewport (Fußzeile mit Kurztext ist höher als ein Bildschirm), gilt die Endbild-Regel
	// nicht: dann steht der Titel in der Mitte des Finales und die Fußzeile folgt darunter.
	useEffect(() => {
		const foot = document.getElementById('fusszeile');
		const el = sec.current;
		const content = el?.querySelector<HTMLElement>(`.${s.content}`);
		const block = el?.querySelector<HTMLElement>(`.${s.block}`);
		if (!foot || !el || !content || !block) return;
		const set = () => {
			const cs = getComputedStyle(content);
			const needed =
				block.offsetHeight + Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom);
			const fits = window.innerHeight - foot.offsetHeight >= needed;
			el.style.setProperty('--fuss', `${fits ? foot.offsetHeight : 0}px`);
		};
		set();
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(set);
		ro.observe(foot);
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
			className={s.section}
		>
			<div ref={layer} aria-hidden="true" className={s.field}>
				<canvas ref={sky} className={s.field} />
			</div>
			<div className={s.content}>
				<div className={s.block}>
					<h2 id="finale-titel" className={s.title} data-entschluesseln="">
						<BrLines lines={finale.title} />
					</h2>
					<div data-knoepfe="1" className={s.buttons}>
						<a href={appUrl(links.create)} className={`cta cta--voll cta--gross ${s.button}`}>
							{finale.create}
						</a>
						<a href={appUrl(links.invite)} className={`cta cta--dunkel cta--gross ${s.button}`}>
							{finale.invite}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
