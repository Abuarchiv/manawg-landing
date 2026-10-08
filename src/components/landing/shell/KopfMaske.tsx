'use client';

import { useEffect, useRef } from 'react';
import { ss } from '../core/math';
import { nachAnteil } from '../scenes/uebergang/pixelband';

// Inhalt im Kopfband ausblenden: Läuft Text unter Logo und Knopf durch, deckt dieser Verlauf in der Farbe des
// Abschnitts das Band (Kopfunterkante plus 28 px weicher Auslauf). Er wirkt nur, solange das Band im Inhalt
// liegt (So geht's, Körper, Bereiche, Installieren, Fragen, Finale und die Pixelübergänge), nie über den Szenen aus
// Flut, Wohnung und Tiefe.
// Zwei Flächen: Schwarz und Papier. Der Verlauf hat je eine Ebene in beiden Farben, die Mischung folgt der Fläche unter
// dem Kopf (in einem Pixelübergang der Anteil „nach“ in der Zeile unter dem Kopf). Die Schrift des Kopfes wechselt mit
// Hysterese zwischen Weiß und Schwarz (data-hell am Kopf, papier.css), damit sie an der Kante nicht flackert.
// Bereiche in jedem Format: Überschrift und Ortskarte laufen beim Verlassen der Szene unter das Band.

/** Abschnitte auf Papier (1) und auf Schwarz (0). */
const FLAECHE: Record<string, 0 | 1> = {
	'so-gehts': 1,
	koerper: 0,
	bereiche: 0,
	installieren: 1,
	fragen: 1,
	finale: 0,
};
// Hochformat: auch Tiefe, dort läuft sonst das Wortbild unter dem festen Kopf durch
const HOCH: Record<string, 0 | 1> = { ...FLAECHE, funktionen: 0 };
/** Pixelübergänge mit der Fläche unten (1 = Papier). Oben steht die jeweils andere. */
const BAENDER: Record<string, 0 | 1> = {
	flutband: 1,
	'uebergang-koerper': 0,
	'uebergang-installieren': 1,
	'uebergang-finale': 0,
};

const GRAD = (c: string) =>
	`linear-gradient(to bottom, rgb(${c}) 0, rgb(${c}) calc(100% - 28px), rgba(${c},0) 100%)`;

export function KopfMaske() {
	const ref = useRef<HTMLDivElement>(null);
	const schwarz = useRef<HTMLDivElement>(null);
	const papier = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current as HTMLDivElement;
		const schw = schwarz.current as HTMLDivElement;
		const pap = papier.current as HTMLDivElement;
		const kopf = document.querySelector('[data-kopf]') as HTMLElement | null;
		let raf = 0;
		let hell = false;
		const rechne = () => {
			raf = 0;
			const kr = kopf?.getBoundingClientRect();
			const band = (kr?.bottom ?? 64) + 10;
			const mitte = kr ? (kr.top + kr.bottom) / 2 : 32;
			let v = 0;
			let tMaske = 0;
			// Fläche unter der Kopfmitte (0 Schwarz, 1 Papier), Abschnitte außerhalb der Liste sind schwarz
			let tKopf = 0;
			const root = document.getElementById('final');
			const hoch = root?.dataset.mode === 'hoch';
			const stufe = (e: number, t: number) => {
				if (e > v) {
					v = e;
					tMaske = t;
				}
			};
			for (const [id, t] of Object.entries(hoch ? HOCH : FLAECHE)) {
				const s = document.getElementById(id);
				if (!s) continue;
				const r = s.getBoundingClientRect();
				if (r.top <= mitte && r.bottom > mitte) tKopf = t;
				const d = Math.min(r.bottom, band) - Math.max(r.top, 0);
				let e = Math.min(1, Math.max(0, d / band));
				// Bereiche: steht die Szene still, liegen Label und Titel unter dem Kopfband und müssen voll lesbar sein.
				// Gedeckt wird erst, wenn der Titel (nicht der Abschnittsrand) ins Band läuft.
				if (id === 'bereiche' && e > 0) {
					const q = s.querySelector('[data-titel]')?.getBoundingClientRect();
					if (q) e = Math.min(e, Math.max(0, (band + 6 - q.top) / 24));
				}
				stufe(e, t);
			}
			for (const [id, nach] of Object.entries(BAENDER)) {
				const s = document.getElementById(id);
				if (!s) continue;
				const r = s.getBoundingClientRect();
				// Pixelübergang (Blöcke in beiden Flächen): volle Deckung, sobald seine Oberkante in den Auslauf des
				// Verlaufs läuft, sonst stünden Logo und Knopf auf den Blöcken. Die Fläche folgt dem Band unter dem Kopf.
				const a = nachAnteil(s, mitte);
				// Mischung steil schalten: der graue Zwischenton unter dem Kopf währt nur wenige Pixel Scrollweg
				const sp = (x: number) => ss((x - 0.3) / 0.4);
				const t = a === null ? (r.bottom <= mitte ? nach : 1 - nach) : sp(nach ? a : 1 - a);
				if (r.top <= mitte && r.bottom > mitte) tKopf = t;
				if (r.bottom > 0) stufe(Math.min(1, Math.max(0, (band + 28 - r.top) / 28)), t);
			}
			// Hochformat, Ende-Ebene der Intro: läuft die Bühne nach oben weg, schiebt sich das Handy unter das Band
			if (hoch && root?.dataset.phase === 'ende') {
				const b = document.querySelector('[data-buehne]');
				if (b) v = Math.max(v, Math.min(1, Math.max(0, -b.getBoundingClientRect().top / 24)));
			}
			// Kopfschrift mit Hysterese
			if (tKopf > 0.58) hell = true;
			else if (tKopf < 0.42) hell = false;
			if (kopf && kopf.hasAttribute('data-hell') !== hell) kopf.toggleAttribute('data-hell', hell);
			// Zwei Ebenen mischen: oben Papier mit e·t, darunter Schwarz so, dass Farbe e·(t·P + (1−t)·K) bleibt
			const beta = v * tMaske;
			const alpha = beta < 1 ? (v * (1 - tMaske)) / (1 - beta) : 0;
			el.style.height = `${band + 28}px`;
			schw.style.opacity = alpha.toFixed(3);
			pap.style.opacity = beta.toFixed(3);
		};
		const an = () => {
			if (!raf) raf = requestAnimationFrame(rechne);
		};
		rechne();
		addEventListener('scroll', an, { passive: true });
		addEventListener('resize', an);
		return () => {
			removeEventListener('scroll', an);
			removeEventListener('resize', an);
			cancelAnimationFrame(raf);
		};
	}, []);
	const ebene = (c: string): React.CSSProperties => ({
		position: 'absolute',
		inset: 0,
		opacity: 0,
		background: GRAD(c),
	});
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
			}}
		>
			<div ref={schwarz} style={ebene('10,10,10')} />
			<div ref={papier} style={ebene('242,242,242')} />
		</div>
	);
}
