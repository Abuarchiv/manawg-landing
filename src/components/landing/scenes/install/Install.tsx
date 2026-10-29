'use client';

import { APP_DEMO } from '@/content/app-demo';
import { appUrl } from '@/lib/app-origin';
import { EllipsisVertical, Menu } from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { useDict, useLocale } from '../../dict';
import { Android } from './Android';
import { Desktop } from './Desktop';
import s from './Install.module.css';
import { Iphone } from './Iphone';
import { registerPlayback } from './playback';
import type { TabIndex } from './types';

// Szene [07] INSTALLIEREN: je Plattform der echte Installationsablauf (INSTALL-FLOWS), zeitgesteuerte Schleife
// im Gerät, Schrittliste synchron und klickbar, Tabs als Tablist mit Pfeiltasten.

// Die Symbole der Schritte sind dieselben Zeichnungen wie im Gerät (Safari iOS 27: Seitenmenü ≡ links in der Adresspille, Chrome: drei Punkte)
function icon(symbol: string, menuAria: string, dotsAria: string): ReactNode {
	if (symbol === '≡')
		return (
			<Menu size="1.1em" strokeWidth={2.4} aria-label={menuAria} role="img" className={s.icon} />
		);
	if (symbol === '⋮')
		return (
			<EllipsisVertical
				size="1.1em"
				strokeWidth={2.4}
				aria-label={dotsAria}
				role="img"
				className={s.icon}
			/>
		);
	return null;
}

// Rahmen des Designs: Handy 300 x 620, Rechner 600 x 400
const FRAMES = [
	[300, 620],
	[300, 620],
	[600, 400],
];

/** Das Token (deutsch „Home-Bildschirm“) nie trennen, Symbolzeichen durch die echte Zeichnung ersetzen. */
function keepTogether(t: string, nowrap: string, menuAria: string, dotsAria: string) {
	return t.split(/([≡⋮])/).flatMap((q, k) => {
		const ic = icon(q, menuAria, dotsAria);
		if (ic) return [<span key={`i${k}`}>{ic}</span>];
		return q.split(nowrap).flatMap((p, i) =>
			i === 0
				? [p]
				: [
						<span key={`${k}-${i}`} className={s.nowrap}>
							{nowrap}
						</span>,
						p,
					],
		);
	});
}

export function Install() {
	const { install } = useDict();
	const demo = APP_DEMO[useLocale()];
	const WAYS = install.ways;
	const [inst, setInst] = useState(0);
	const instRef = useRef(0);
	instRef.current = inst;
	const secRef = useRef<HTMLElement>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const scaleRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const api = useRef<ReturnType<typeof registerPlayback> | null>(null);

	// Gerätbilder erst laden, wenn der Abschnitt höchstens zwei Bildschirmhöhen entfernt ist (Erstladen bleibt schlank)
	useEffect(() => {
		const el = secRef.current as HTMLElement;
		const io = new IntersectionObserver(
			(e) => {
				if (!e.some((x) => x.isIntersecting)) return;
				const images = {
					'--b-ios': demo.installIos,
					'--b-and': demo.installAndroid,
					'--b-app': demo.installApp,
				};
				for (const [k, v] of Object.entries(images)) el.style.setProperty(k, `url(${v})`);
				io.disconnect();
			},
			{ rootMargin: '200% 0px' },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [demo]);

	useEffect(() => {
		const a = registerPlayback(
			frameRef.current as HTMLDivElement,
			secRef.current as HTMLElement,
			() => instRef.current as TabIndex,
		);
		api.current = a;
		return () => a.stop();
	}, []);

	// Gerät in die Spalte einpassen: im Hochformat 78 % der Breite, quer bis 78 % der Höhe, höchstens 1,4-fach
	useEffect(() => {
		const bu = stageRef.current as HTMLDivElement;
		const sk = scaleRef.current as HTMLDivElement;
		const fit = () => {
			const [fw, fh] = FRAMES[inst] as number[];
			// Hochformat und Handy quer: die Bühne hat feste Höhe, das Gerät passt ganz hinein
			const portrait = matchMedia(
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
			const free =
				innerHeight - Number.parseFloat(cs.paddingTop) - Number.parseFloat(cs.paddingBottom) - 8;
			const z = Math.min(
				inst === 2 ? 1.2 : 1.4,
				w / (fw as number),
				(portrait ? hh : free) / (fh as number),
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

	const handleKey = (e: KeyboardEvent, i: number) => {
		const n = WAYS.length;
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

	const way = WAYS[inst] as (typeof WAYS)[number];
	return (
		<section
			id="installieren"
			data-sec="installieren"
			tabIndex={-1}
			ref={secRef}
			aria-labelledby="installieren-titel"
			className={s.section}
		>
			<div className={s.text}>
				<span className="label" data-entschluesseln="">
					{`${install.prefix}${install.title}`}
				</span>
				<h2 id="installieren-titel" className={s.title} data-entschluesseln="">
					{install.heading[0]}
					<br />
					<span className={s.nowrap}>{install.heading[1]}</span>
				</h2>
				<p className={s.lead}>{install.lead}</p>
				<div className={s.tabs} role="tablist" aria-label={install.platformAria}>
					{WAYS.map((w, i) => (
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
							onKeyDown={(e) => handleKey(e, i)}
						>
							{w.name}
						</button>
					))}
				</div>
				<div id="ins-panel" role="tabpanel" aria-labelledby={`ins-tab-${inst}`} className={s.panel}>
					<ol className={s.steps}>
						{way.steps.map((t, i) => (
							<li key={t}>
								<button
									type="button"
									data-istep={String(i)}
									data-aktiv={i === 0 ? '' : undefined}
									className={s.step}
									onClick={() => api.current?.jumpTo(i)}
								>
									<span className={s.nr}>{`0${i + 1}`}</span>
									<span className={s.row} data-zeile="">
										{keepTogether(t, install.nowrap, install.iconMenuAria, install.iconDotsAria)}
									</span>
								</button>
							</li>
						))}
					</ol>
					{inst === 2 && <p className={`label ${s.more}`}>{install.desktopExtra}</p>}
				</div>
				<a href={appUrl('/')} className={`cta cta--voll cta--gross ${s.cta}`}>
					{install.cta}
				</a>
			</div>
			<div aria-hidden="true" inert className={s.stage} ref={stageRef}>
				<div className={s.scale} ref={scaleRef}>
					<div ref={frameRef} data-ins="frame" data-tab={inst} className={s.frame}>
						{/* Tasten am Gehäuse: iPhone 17 (Aktion, Lautstärke links; Seitentaste, Kamerasteuerung rechts), Pixel (rechts) */}
						<i className={s.key} data-t="ios-aktion" />
						<i className={s.key} data-t="ios-laut1" />
						<i className={s.key} data-t="ios-laut2" />
						<i className={s.key} data-t="ios-seite" />
						<i className={s.key} data-t="ios-kamera" />
						<i className={s.key} data-t="and-ein" />
						<i className={s.key} data-t="and-laut" />
						<div data-ins="screen" className={s.screen}>
							<div className={s.device} hidden={inst !== 0}>
								<Iphone />
							</div>
							<div className={s.device} hidden={inst !== 1}>
								<Android />
							</div>
							<div className={s.device} hidden={inst !== 2}>
								<Desktop />
							</div>
							<div className={s.veil} data-k="veil" />
							<div data-ins="tap" className={s.tap} />
						</div>
					</div>
				</div>
			</div>
			<p className={s.caption} data-kurz="" aria-hidden="true" />
		</section>
	);
}
