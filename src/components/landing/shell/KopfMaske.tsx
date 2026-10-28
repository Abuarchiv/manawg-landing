'use client';

import { useEffect, useRef } from 'react';
import { onLies } from '../core/loop';

// Inhalt im Kopfband ausblenden: Läuft Text unter Logo und Knopf durch, deckt dieser Verlauf in der Farbe des
// Abschnitts das Band (Kopfunterkante plus 28 px weicher Auslauf). Er wirkt nur, solange das Band im Inhalt
// liegt (So geht's, Körper, Installieren, Fragen, Finale), nie über den Szenen aus Flut, Wohnung und Tiefe.
const IDS = ['flutband', 'so-gehts', 'installieren', 'fragen', 'finale'];
// Hochformat: auch Tiefe, dort läuft sonst das Wortbild unter dem festen Kopf durch
const IDS_HOCH = [...IDS, 'funktionen'];

export function KopfMaske() {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current as HTMLDivElement;
		const kopf = document.querySelector('[data-kopf]') as HTMLElement | null;
		// Liest in der Lesephase der Bildschleife: als eigener rAF nach den Szenen erzwang jedes Lesen ein Layout
		let h = '';
		let o = '';
		const rechne = () => {
			const band = (kopf?.getBoundingClientRect().bottom ?? 64) + 10;
			let v = 0;
			const hoch = document.getElementById('final')?.dataset.mode === 'hoch';
			for (const id of hoch ? IDS_HOCH : IDS) {
				const s = document.getElementById(id);
				if (!s) continue;
				const r = s.getBoundingClientRect();
				const d = Math.min(r.bottom, band) - Math.max(r.top, 0);
				const e = Math.min(1, Math.max(0, d / band));
				v = Math.max(v, e);
			}
			// Hochformat, Ende-Ebene der Intro: läuft die Bühne nach oben weg, schiebt sich das Handy unter das Band
			if (hoch && document.getElementById('final')?.dataset.phase === 'ende') {
				const b = document.querySelector('[data-buehne]');
				if (b) v = Math.max(v, Math.min(1, Math.max(0, -b.getBoundingClientRect().top / 24)));
			}
			// nur geänderte Werte schreiben
			const hn = `${band + 28}px`;
			const on = v.toFixed(3);
			if (hn !== h) el.style.height = h = hn;
			if (on !== o) el.style.opacity = o = on;
		};
		rechne();
		return onLies(rechne);
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
					'linear-gradient(to bottom, #0a0a0a 0, #0a0a0a calc(100% - 28px), rgba(10,10,10,0) 100%)',
			}}
		/>
	);
}
