'use client';

import { useEffect, useRef, useState } from 'react';
import { isLight } from '@/lib/theme';
import { onFrame } from '../../core/loop';
import { useDict, useLocale } from '../../dict';
import s from './HeroDemo.module.css';
import { live } from './stage';

// Demo film on the hero: a phone on the mountain plays the way from installing to everyday use in a loop, the
// chapters next to it jump into the film. One video per language and theme (public/hero-demo, recorded with
// landing-konzept/werkzeuge/hero-demo). It loads once the first hero frame stands and pauses while the title is gone.

/** Chapter starts in seconds and film length (printed by build.py of the recording). */
const CHAPTERS = [0, 13.458, 18.667, 22.083, 25.5] as const;
const LENGTH = 29.5;
/** The title has faded out from here on (HeroTitle.tsx); the film pauses. */
const AWAY_P = 0.09;

export function HeroDemo() {
	const { heroDemo } = useDict();
	const lang = useLocale();
	const videoRef = useRef<HTMLVideoElement>(null);
	const railRef = useRef<HTMLDivElement>(null);
	const loadRef = useRef<() => void>(() => {});
	const [chapter, setChapter] = useState(0);
	const [shown, setShown] = useState(false);
	// Visitor's choice; with reduced motion the film waits for the play button
	const [paused, setPaused] = useState(false);
	const pausedRef = useRef(false);
	pausedRef.current = paused;

	// Source follows the language and the theme; loading waits for the first hero frame and an idle period
	useEffect(() => {
		const v = videoRef.current as HTMLVideoElement;
		const pick = () => `/hero-demo/${lang}-${isLight() ? 'light' : 'dark'}.mp4`;
		// The loop reads the preference only once it starts (after this effect), so ask the media query directly
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
		let started = false;
		const load = () => {
			if (started) return;
			started = true;
			v.src = pick();
		};
		loadRef.current = load;
		const idle = { id: 0, timer: 0 };
		const later = () => {
			if ('requestIdleCallback' in window)
				idle.id = window.requestIdleCallback(load, { timeout: 3000 });
			else idle.timer = setTimeout(load, 500) as unknown as number;
		};
		if (live.stage?.state.ready) later();
		else document.addEventListener('landing:ready', later, { once: true });
		const mo = new MutationObserver(() => {
			const src = pick();
			if (!started || v.src.endsWith(src)) return;
			const t = v.currentTime;
			v.src = src;
			v.currentTime = t;
		});
		mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => {
			document.removeEventListener('landing:ready', later);
			if (idle.id) window.cancelIdleCallback(idle.id);
			clearTimeout(idle.timer);
			mo.disconnect();
		};
	}, [lang]);

	// Each frame: play only while the title is visible, chapter and its progress from the film time
	useEffect(() => {
		const v = videoRef.current as HTMLVideoElement;
		const rail = railRef.current as HTMLDivElement;
		let last = -1;
		let k = '';
		return onFrame(() => {
			if (!v.currentSrc) return;
			const want = !pausedRef.current && !document.hidden && (live.stage?.state.P ?? 0) < AWAY_P;
			if (want && v.paused) v.play().catch(() => {});
			else if (!want && !v.paused) v.pause();
			const t = v.currentTime;
			let c = 0;
			for (const [i, start] of CHAPTERS.entries()) if (t >= start) c = i;
			if (c !== last) {
				last = c;
				setChapter(c);
			}
			const a = CHAPTERS[c] ?? 0;
			const b = CHAPTERS[c + 1] ?? LENGTH;
			const kk = Math.min(1, (t - a) / (b - a)).toFixed(3);
			if (kk !== k) {
				k = kk;
				rail.style.setProperty('--k', kk);
			}
		});
	}, []);

	const seek = (i: number) => {
		const v = videoRef.current as HTMLVideoElement;
		loadRef.current();
		v.currentTime = (CHAPTERS[i] ?? 0) + 0.01;
		setChapter(i);
	};

	return (
		<div className={s.demo}>
			<figure className={s.phone} aria-label={heroDemo.aria}>
				<div className={s.body}>
					<span className={s.key} style={{ left: '-3px', top: '19.03cqh', height: '4.84cqh' }} />
					<span className={s.key} style={{ left: '-3px', top: '26.45cqh', height: '8.39cqh' }} />
					<span className={s.key} style={{ left: '-3px', top: '36.45cqh', height: '8.39cqh' }} />
					<span className={s.key} style={{ right: '-3px', top: '29.03cqh', height: '12.9cqh' }} />
					<div className={s.screen}>
						{/* One poster per theme; the other one is display:none and is not loaded (globals.css [data-only]) */}
						<img
							src={`/hero-demo/${lang}-dark.webp`}
							alt=""
							width={560}
							height={1200}
							loading="lazy"
							decoding="async"
							data-only="dark"
							className={s.media}
						/>
						<img
							src={`/hero-demo/${lang}-light.webp`}
							alt=""
							width={560}
							height={1200}
							loading="lazy"
							decoding="async"
							data-only="light"
							className={s.media}
						/>
						<video
							ref={videoRef}
							className={s.media}
							style={{ opacity: shown ? 1 : 0 }}
							onLoadedData={() => setShown(true)}
							muted
							loop
							playsInline
							preload="auto"
							disablePictureInPicture
							disableRemotePlayback
							aria-hidden="true"
						/>
						<span className={s.glare} />
					</div>
				</div>
			</figure>
			<div ref={railRef} className={s.rail} data-hero-cta="">
				<p className={`label ${s.head}`}>{heroDemo.label}</p>
				<ol className={s.list}>
					{heroDemo.chapters.map((name, i) => (
						<li key={name} className={s.item} data-on={i === chapter ? '' : undefined}>
							<button
								type="button"
								className={`label ${s.jump}`}
								aria-current={i === chapter ? 'step' : undefined}
								onClick={() => seek(i)}
							>
								<span>{`0${i + 1}`}</span>
								<span className={s.of}>{`/ 0${heroDemo.chapters.length}`}</span>
								<span>{name}</span>
							</button>
							<span className={s.bar} aria-hidden="true" />
						</li>
					))}
				</ol>
				<button
					type="button"
					className={`label ${s.toggle}`}
					onClick={() => {
						loadRef.current();
						setPaused(!paused);
					}}
				>
					{paused ? heroDemo.play : heroDemo.pause}
				</button>
			</div>
		</div>
	);
}
