'use client';

import { useEffect, useRef } from 'react';
import { onRead } from '../core/loop';

// Hide content in the header band: when text runs under the logo and the button, this gradient covers the band
// in the colour of the section (header bottom edge plus 28 px of soft falloff). It only acts while the band
// lies in content (How it works, FAQ, Finale), never over the scenes of flat and depth.
const IDS = ['so-gehts', 'fragen', 'finale'];
// Portrait: depth as well, where the word image would otherwise run under the fixed header
const IDS_PORTRAIT = [...IDS, 'funktionen'];

export function HeaderMask() {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current as HTMLDivElement;
		const header = document.querySelector('[data-header]') as HTMLElement | null;
		// Reads in the read phase of the frame loop: as an rAF of its own after the scenes, every read forced a layout
		let h = '';
		let o = '';
		const measure = () => {
			const band = (header?.getBoundingClientRect().bottom ?? 64) + 10;
			let v = 0;
			const portrait = document.getElementById('final')?.dataset.mode === 'portrait';
			for (const id of portrait ? IDS_PORTRAIT : IDS) {
				const s = document.getElementById(id);
				if (!s) continue;
				const r = s.getBoundingClientRect();
				const d = Math.min(r.bottom, band) - Math.max(r.top, 0);
				const e = Math.min(1, Math.max(0, d / band));
				v = Math.max(v, e);
			}
			// Portrait, end layer of the intro: when the stage scrolls away upwards, the phone slides under the band
			if (portrait && document.getElementById('final')?.dataset.phase === 'end') {
				const b = document.querySelector('[data-stage]');
				if (b) v = Math.max(v, Math.min(1, Math.max(0, -b.getBoundingClientRect().top / 24)));
			}
			// write changed values only
			const hn = `${band + 28}px`;
			const on = v.toFixed(3);
			if (hn !== h) el.style.height = h = hn;
			if (on !== o) el.style.opacity = o = on;
		};
		measure();
		return onRead(measure);
	}, []);
	return (
		<div
			ref={ref}
			aria-hidden="true"
			style={{
				position: 'fixed',
				left: 0,
				right: 0,
				top: 0,
				height: 72,
				zIndex: 15,
				pointerEvents: 'none',
				opacity: 0,
				background:
					'linear-gradient(to bottom, var(--paper) 0, var(--paper) calc(100% - 28px), rgb(var(--paper-rgb) / 0) 100%)',
			}}
		/>
	);
}
