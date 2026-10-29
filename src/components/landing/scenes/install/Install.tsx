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

// Scene [07] INSTALL: the real install flow per platform, time-driven loop
// on the device, step list in sync and clickable, tabs as a tablist with arrow keys.

// The step icons are the same drawings as on the device (Safari iOS 27: side menu ≡ at the left of the address pill, Chrome: three dots)
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

// Design frames: phone 300 x 620, desktop 600 x 400
const FRAMES = [
	[300, 620],
	[300, 620],
	[600, 400],
] as const;

/** Never split the token (German "Home-Bildschirm"), replace symbol characters with the real drawing. */
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
	const [inst, setInst] = useState<TabIndex>(0);
	const instRef = useRef<TabIndex>(0);
	instRef.current = inst;
	const secRef = useRef<HTMLElement>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const scaleRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const api = useRef<ReturnType<typeof registerPlayback> | null>(null);

	// Load device images only once the section is at most two screen heights away (keeps the initial load lean)
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
				// Both variants as variables; Install.module.css picks the one of the current theme (only that one loads)
				for (const [k, v] of Object.entries(images)) {
					el.style.setProperty(`${k}-d`, `url(${v})`);
					el.style.setProperty(`${k}-l`, `url(${v.replace('-dark.webp', '-light.webp')})`);
				}
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
			() => instRef.current,
		);
		api.current = a;
		return () => a.stop();
	}, []);

	// Fit the device into the column: 78 % of the width in portrait, up to 78 % of the height in landscape, at most 1.4x
	useEffect(() => {
		const bu = stageRef.current as HTMLDivElement;
		const sk = scaleRef.current as HTMLDivElement;
		const fit = () => {
			const [fw, fh] = FRAMES[inst];
			// Portrait and phone landscape: the stage has a fixed height, the device fits entirely
			const portrait = matchMedia(
				'(max-aspect-ratio: 1/1), (max-width: 699px), (orientation: landscape) and (max-height: 499px)',
			).matches;
			const cs = getComputedStyle(bu);
			const w =
				bu.clientWidth - Number.parseFloat(cs.paddingLeft) - Number.parseFloat(cs.paddingRight);
			// Portrait: the stage height is 100svh minus header, tabs and step row
			const hh =
				bu.clientHeight - Number.parseFloat(cs.paddingTop) - Number.parseFloat(cs.paddingBottom);
			// Landscape: window height minus the stage padding (header band at top and bottom)
			const free =
				innerHeight - Number.parseFloat(cs.paddingTop) - Number.parseFloat(cs.paddingBottom) - 8;
			const z = Math.min(inst === 2 ? 1.2 : 1.4, w / fw, (portrait ? hh : free) / fh);
			sk.style.setProperty('--z', z.toFixed(4));
			sk.style.width = `${fw * z}px`;
			sk.style.height = `${fh * z}px`;
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

	// Tablist keys: arrows wrap around, Home and End jump to the first and last tab
	const handleKey = (e: KeyboardEvent, i: TabIndex) => {
		const next = { ArrowRight: (i + 1) % 3, ArrowLeft: (i + 2) % 3, Home: 0, End: 2 }[e.key];
		if (next === undefined) return;
		e.preventDefault();
		setInst(next as TabIndex);
		tabRefs.current[next]?.focus();
	};

	const way = WAYS[inst];
	return (
		<section
			id="installieren"
			data-sec="installieren"
			tabIndex={-1}
			ref={secRef}
			aria-labelledby="install-title"
			className={s.section}
		>
			<div className={s.text}>
				<span className="label">{`${install.prefix}${install.title}`}</span>
				<h2 id="install-title" className={s.title}>
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
							onClick={() => setInst(i as TabIndex)}
							onKeyDown={(e) => handleKey(e, i as TabIndex)}
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
									data-active={i === 0 ? '' : undefined}
									className={s.step}
									onClick={() => api.current?.jumpTo(i)}
								>
									<span className={s.nr}>{`0${i + 1}`}</span>
									<span className={s.row} data-row="">
										{keepTogether(t, install.nowrap, install.iconMenuAria, install.iconDotsAria)}
									</span>
								</button>
							</li>
						))}
					</ol>
					{inst === 2 && <p className={`label ${s.more}`}>{install.desktopExtra}</p>}
				</div>
				<a href={appUrl('/')} className={`cta cta--solid cta--large ${s.cta}`}>
					{install.cta}
				</a>
			</div>
			<div aria-hidden="true" inert className={s.stage} ref={stageRef}>
				<div className={s.scale} ref={scaleRef}>
					<div ref={frameRef} data-ins="frame" data-tab={inst} className={s.frame}>
						{/* Buttons on the casing: iPhone 17 (action, volume left; side button, camera control right), Pixel (right) */}
						<i className={s.key} data-t="ios-action" />
						<i className={s.key} data-t="ios-volume1" />
						<i className={s.key} data-t="ios-volume2" />
						<i className={s.key} data-t="ios-side" />
						<i className={s.key} data-t="ios-camera" />
						<i className={s.key} data-t="and-power" />
						<i className={s.key} data-t="and-volume" />
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
			<p className={s.caption} data-caption="" aria-hidden="true" />
		</section>
	);
}
