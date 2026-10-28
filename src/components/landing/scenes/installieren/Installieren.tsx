'use client';

import { appUrl } from '@/lib/app-origin';
import { EllipsisVertical, Menu } from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { Android } from './Android';
import s from './Installieren.module.css';
import { Iphone } from './Iphone';
import { Rechner } from './Rechner';
import { registerAblauf } from './ablauf';
import type { TabIndex } from './types';

// Szene [07] INSTALLIEREN: je Plattform der echte Installationsablauf (INSTALL-FLOWS), zeitgesteuerte Schleife
// im Gerät, Schrittliste synchron und klickbar, Tabs als Tablist mit Pfeiltasten.

// Die Symbole der Schritte sind dieselben Zeichnungen wie im Gerät (Safari iOS 27: Seitenmenü ≡ links in der Adresspille, Chrome: drei Punkte)
const ICON: Record<string, ReactNode> = {
	'≡': (
		<Menu size="1.1em" strokeWidth={2.4} aria-label="Seitenmenü" role="img" className={s.ikone} />
	),
	'⋮': (
		<EllipsisVertical
			size="1.1em"
			strokeWidth={2.4}
			aria-label="Drei Punkte"
			role="img"
			className={s.ikone}
		/>
	),
};

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
const BILDER = {
	'--b-ios': '/install/seite-ios-gast.webp',
	'--b-and': '/install/seite-android-gast.webp',
	'--b-app': '/install/app-start.webp',
};
// Rahmen des Designs: Handy 300 x 620, Rechner 600 x 400
const RAHMEN = [
	[300, 620],
	[300, 620],
	[600, 400],
];

/** „Home-Bildschirm“ nie am Bindestrich trennen, Symbolzeichen durch die echte Zeichnung ersetzen. */
function umbruch(t: string) {
	return t.split(/([≡⋮])/).flatMap((q, k) => {
		if (ICON[q]) return [<span key={`i${k}`}>{ICON[q]}</span>];
		return q.split('Home-Bildschirm').flatMap((p, i) =>
			i === 0
				? [p]
				: [
						<span key={`${k}-${i}`} className={s.nowrap}>
							Home-Bildschirm
						</span>,
						p,
					],
		);
	});
}

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

	// Gerätbilder erst laden, wenn der Abschnitt höchstens zwei Bildschirmhöhen entfernt ist (Erstladen bleibt schlank)
	useEffect(() => {
		const el = secRef.current as HTMLElement;
		const io = new IntersectionObserver(
			(e) => {
				if (!e.some((x) => x.isIntersecting)) return;
				for (const [k, v] of Object.entries(BILDER)) el.style.setProperty(k, `url(${v})`);
				io.disconnect();
			},
			{ rootMargin: '200% 0px' },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	useEffect(() => {
		const a = registerAblauf(
			frRef.current as HTMLDivElement,
			secRef.current as HTMLElement,
			() => instRef.current as TabIndex,
		);
		api.current = a;
		return () => a.stop();
	}, []);

	// Gerät in die Spalte einpassen: im Hochformat 78 % der Breite, quer bis 78 % der Höhe, höchstens 1,4-fach
	useEffect(() => {
		const bu = buRef.current as HTMLDivElement;
		const sk = skRef.current as HTMLDivElement;
		const fit = () => {
			const [fw, fh] = RAHMEN[inst] as number[];
			// Hochformat und Handy quer: die Bühne hat feste Höhe, das Gerät passt ganz hinein
			const hoch = matchMedia(
				'(max-aspect-ratio: 1/1), (max-width: 699px), (orientation: landscape) and (max-height: 499px)',
			).matches;
			const cs = getComputedStyle(bu);
			const w =
				bu.clientWidth - Number.parseFloat(cs.paddingLeft) - Number.parseFloat(cs.paddingRight);
			// Auf großen Bildschirmen darf das Gerät über seine Entwurfsgröße wachsen (bis 78 % der Fensterhöhe)
			// Hochformat: die Bühne hat feste Höhe (100svh minus Kopf, Tabs, Zeile), das Gerät passt ganz hinein
			const hh =
				bu.clientHeight - Number.parseFloat(cs.paddingTop) - Number.parseFloat(cs.paddingBottom);
			// Breitformat: Fensterhöhe minus Polster der Bühne (Kopfband oben und unten)
			const frei =
				innerHeight - Number.parseFloat(cs.paddingTop) - Number.parseFloat(cs.paddingBottom) - 8;
			const z = Math.min(
				inst === 2 ? 1.2 : 1.4,
				w / (fw as number),
				(hoch ? hh : frei) / (fh as number),
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
				<span className="label" data-entschluesseln="">
					[ 06 ] INSTALLIEREN
				</span>
				<h2 id="installieren-titel" className={s.titel} data-entschluesseln="">
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
									<span className={s.zeile} data-zeile="">
										{umbruch(t)}
									</span>
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
			<div aria-hidden="true" inert className={s.buehne} ref={buRef}>
				<div className={s.skala} ref={skRef}>
					<div ref={frRef} data-ins="frame" data-tab={inst} className={s.rahmen}>
						{/* Tasten am Gehäuse: iPhone 17 (Aktion, Lautstärke links; Seitentaste, Kamerasteuerung rechts), Pixel (rechts) */}
						<i className={s.taste} data-t="ios-aktion" />
						<i className={s.taste} data-t="ios-laut1" />
						<i className={s.taste} data-t="ios-laut2" />
						<i className={s.taste} data-t="ios-seite" />
						<i className={s.taste} data-t="ios-kamera" />
						<i className={s.taste} data-t="and-ein" />
						<i className={s.taste} data-t="and-laut" />
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
			<p className={s.kurz} data-kurz="" aria-hidden="true" />
		</section>
	);
}
