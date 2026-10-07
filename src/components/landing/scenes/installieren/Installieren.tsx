'use client';

import { appUrl } from '@/lib/app-origin';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Android } from './Android';
import s from './Installieren.module.css';
import { Iphone } from './Iphone';
import { Rechner } from './Rechner';
import { registerAblauf } from './ablauf';

// Szene [07] INSTALLIEREN: je Plattform der echte Installationsablauf (INSTALL-FLOWS), zeitgesteuerte Schleife
// im Gerät, Schrittliste synchron und klickbar, Tabs als Tablist mit Pfeiltasten.

const WEGE: { name: string; schritte: string[] }[] = [
	{
		name: 'iPhone',
		schritte: [
			'≡ antippen, dann „Teilen“',
			'„Mehr anzeigen“, dann „Zum Home-Bildschirm“',
			'„Hinzufügen“ antippen. Fertig.',
		],
	},
	{
		name: 'Android',
		schritte: [
			'Menü ⋮ antippen.',
			'„Installieren und Verknüpfung erstellen“, dann „Installieren“',
			'Im Dialog „Installieren“ bestätigen. Fertig.',
		],
	},
	{
		name: 'Rechner',
		schritte: [
			'Symbol „Installieren“ rechts in der Adressleiste klicken.',
			'Im Dialog „App installieren“ auf „Installieren“ klicken.',
			'ManaWG öffnet als eigenes Fenster.',
		],
	},
];
// Rahmen des Designs: Handy 300 x 620, Rechner 600 x 400
const RAHMEN = [
	[300, 620],
	[300, 620],
	[600, 400],
];

export function Installieren() {
	const [inst, setInst] = useState(0);
	const instRef = useRef(0);
	instRef.current = inst;
	const secRef = useRef<HTMLElement>(null);
	const frRef = useRef<HTMLDivElement>(null);
	const skRef = useRef<HTMLDivElement>(null);
	const buRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const api = useRef<ReturnType<typeof registerAblauf> | null>(null);

	useEffect(() => {
		const a = registerAblauf(
			frRef.current as HTMLDivElement,
			secRef.current as HTMLElement,
			() => instRef.current,
		);
		api.current = a;
		return () => a.stop();
	}, []);

	// Gerät in die Spalte einpassen: im Hochformat 72–80 % der Breite, nie größer als 1 und nie höher als das Bild
	useEffect(() => {
		const bu = buRef.current as HTMLDivElement;
		const sk = skRef.current as HTMLDivElement;
		const fit = () => {
			const [fw, fh] = RAHMEN[inst] as number[];
			const hoch = matchMedia('(max-aspect-ratio: 1/1), (max-width: 699px)').matches;
			const cs = getComputedStyle(bu);
			const w =
				bu.clientWidth - Number.parseFloat(cs.paddingLeft) - Number.parseFloat(cs.paddingRight);
			const z = Math.min(
				1,
				(w * (hoch && inst !== 2 ? 0.78 : 1)) / (fw as number),
				(innerHeight * 0.88) / (fh as number),
			);
			sk.style.setProperty('--z', z.toFixed(4));
			sk.style.width = `${(fw as number) * z}px`;
			sk.style.height = `${(fh as number) * z}px`;
		};
		fit();
		const ro = new ResizeObserver(fit);
		ro.observe(bu);
		addEventListener('resize', fit);
		return () => {
			ro.disconnect();
			removeEventListener('resize', fit);
		};
	}, [inst]);

	const taste = (e: KeyboardEvent, i: number) => {
		const n = WEGE.length;
		const k =
			e.key === 'ArrowRight'
				? (i + 1) % n
				: e.key === 'ArrowLeft'
					? (i + n - 1) % n
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? n - 1
							: -1;
		if (k < 0) return;
		e.preventDefault();
		setInst(k);
		tabRefs.current[k]?.focus();
	};

	const weg = WEGE[inst] as (typeof WEGE)[number];
	return (
		<section
			id="installieren"
			data-sec="installieren"
			tabIndex={-1}
			ref={secRef}
			aria-labelledby="installieren-titel"
			className={s.sektion}
		>
			<div className={s.text}>
				<span className="label">[ 07 ] INSTALLIEREN</span>
				<h2 id="installieren-titel" className={s.titel}>
					Auf den <br />
					<span className={s.nowrap}>Home-Bildschirm.</span>
				</h2>
				<p className={s.lead}>Ohne App Store, offlinefähig. app.manawg.com öffnen, dann:</p>
				<div className={s.tabs} role="tablist" aria-label="Plattform">
					{WEGE.map((w, i) => (
						<button
							key={w.name}
							ref={(el) => {
								tabRefs.current[i] = el;
							}}
							type="button"
							role="tab"
							id={`ins-tab-${i}`}
							aria-selected={inst === i}
							aria-controls="ins-panel"
							tabIndex={inst === i ? 0 : -1}
							className={`tab ${s.tab}`}
							onClick={() => setInst(i)}
							onKeyDown={(e) => taste(e, i)}
						>
							{w.name}
						</button>
					))}
				</div>
				<div id="ins-panel" role="tabpanel" aria-labelledby={`ins-tab-${inst}`} className={s.panel}>
					<ol className={s.schritte}>
						{weg.schritte.map((t, i) => (
							<li key={t}>
								<button
									type="button"
									data-istep={String(i)}
									data-aktiv={i === 0 ? '' : undefined}
									className={s.schritt}
									onClick={() => api.current?.sprung(i)}
								>
									<span className={s.nr}>{`0${i + 1}`}</span>
									<span className={s.zeile}>{t}</span>
								</button>
							</li>
						))}
					</ol>
					{inst === 2 && (
						<p className={`label ${s.weitere}`}>
							Edge: „App verfügbar“ → „Installieren“ · Safari (Mac): Ablage → „Zum Dock hinzufügen
							…“ → „Hinzufügen“
						</p>
					)}
				</div>
				<a href={appUrl('/')} className={`cta cta--voll cta--gross ${s.cta}`}>
					App installieren
				</a>
			</div>
			<div aria-hidden="true" className={s.buehne} ref={buRef}>
				<div className={s.skala} ref={skRef}>
					<div ref={frRef} data-ins="frame" data-tab={inst} className={s.rahmen}>
						<div data-ins="screen" className={s.schirm}>
							<div className={s.geraet} hidden={inst !== 0}>
								<Iphone />
							</div>
							<div className={s.geraet} hidden={inst !== 1}>
								<Android />
							</div>
							<div className={s.geraet} hidden={inst !== 2}>
								<Rechner />
							</div>
							<div className={s.schleier} data-k="veil" />
							<div data-ins="tap" className={s.tipp} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
