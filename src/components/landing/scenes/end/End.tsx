'use client';

import { useEffect, useRef } from 'react';
import { appUrl } from '@/lib/app-origin';
import { modeOf } from '../../core/loop';
import { BrLines, useDict } from '../../dict';
import { camera } from './camera';
import s from './End.module.css';
import { Phone } from './Phone';

// End layer of the intro stage: phone and hands on var(--paper), title and button below. The layer sits in
// the sticky stage and scrolls away with it. The end space [data-end-space] is 1280 x 800 and is fitted
// into the stage via --end-x, --end-y and --end-f by camera(). Title and button precede the phone in the
// DOM so that Shift+Tab from the app iframe lands on the button (not on the body); header and hints are inert in the end.

export function End() {
	const { end, links, aria } = useDict();
	const spaceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const space = spaceRef.current as HTMLDivElement;
		const stage = space.closest('[data-stage]') as HTMLElement;
		const safe = stage.querySelector('[data-safe]') as HTMLElement;
		const set = () => {
			const W = stage.clientWidth;
			const cam = camera(W, stage.clientHeight, safe.clientHeight, modeOf(W, innerHeight).mode);
			space.style.setProperty('--end-x', `${cam.ox}px`);
			space.style.setProperty('--end-y', `${cam.oy}px`);
			space.style.setProperty('--end-f', String(cam.f));
		};
		set();
		const ro = new ResizeObserver(set);
		ro.observe(stage);
		ro.observe(safe);
		return () => ro.disconnect();
	}, []);

	return (
		<section
			data-end="1"
			aria-label={aria.appPreview}
			style={{
				position: 'absolute',
				inset: '0',
				opacity: 'clamp(0, (var(--e,0) - 0.35) * 1.54, 1)',
				pointerEvents: 'none',
				background: 'var(--paper)',
			}}
		>
			<canvas
				data-hand="back"
				aria-hidden="true"
				style={{
					position: 'absolute',
					inset: '0',
					width: '100%',
					height: '100%',
					display: 'block',
				}}
			/>
			<div
				data-safe-end="1"
				style={{
					position: 'absolute',
					left: '0',
					right: '0',
					top: '0',
					height: '100svh',
					pointerEvents: 'none',
				}}
			>
				<div className={s.title} data-end-title="1">
					<h2 data-quiet="1" className={s.h}>
						<BrLines lines={end.title} />
					</h2>
					<a
						data-cta="1"
						data-quiet="1"
						className={`cta cta--solid cta--large ${s.button}`}
						href={appUrl(links.create)}
					>
						{end.cta}
					</a>
				</div>
			</div>
			<div
				ref={spaceRef}
				data-end-space="1"
				style={{
					position: 'absolute',
					left: '0',
					top: '0',
					width: '1280px',
					height: '800px',
					transformOrigin: '0 0',
					transform:
						'translate(var(--end-x,0px),var(--end-y,0px)) scale(var(--end-f,1)) translate(var(--ax,0px),var(--ay,0px)) translate(800px,400px) rotate(var(--ar,0deg)) translate(-800px,-400px)',
				}}
			>
				<Phone />
			</div>
			<canvas
				data-hand="front"
				aria-hidden="true"
				style={{
					position: 'absolute',
					inset: '0',
					width: '100%',
					height: '100%',
					display: 'block',
					pointerEvents: 'none',
				}}
			/>
		</section>
	);
}
