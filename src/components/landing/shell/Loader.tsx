'use client';

import { useEffect, useRef } from 'react';
import { css } from '../core/dc';
import { useDict } from '../dict';
import { live } from '../scenes/intro/stage';

// Loader: counter 000 to 100 and bar. The count follows the real readiness (first painted
// hero frame or fallback = landing:bereit, plus document.fonts.ready), not just time.
//   - gone 0.8 s after the start at the earliest, 0.3 s after readiness at the latest, hard stop after 4 s
//   - skipped on back, reload and on a repeat visit in the same session
//   - gone immediately with reduced motion

const MIN = 800; // ms from the start
const HARD_LIMIT = 4000; // ms from the navigation start: hard stop
const AFTER_READY = 100; // ms: after readiness the loader counts up to 100
const FADE_MS = 150; // ms: fade-out (matches the transition below)
const KEY = 'manawg-lader';

// Runs while parsing right after the loader, so before the first paint: prevents the brief flash
// on back, reload and return visits. Opacity 0 (not display:none) so that QA tools can see the end.
const PRE_PAINT_SCRIPT = `(function(){try{var l=document.querySelector('[data-loader]');var n=performance.getEntriesByType('navigation')[0];var t=n&&n.type;if(t==='reload'||t==='back_forward'||sessionStorage.getItem('${KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){l.style.cssText+=';opacity:0;visibility:hidden;pointer-events:none;transition:none'}}catch(e){}})()`;

// Before hydration the dot bar runs via CSS (40 steps) so something moves immediately on a slow network; JS takes over (data-js).
const FAILSAFE_CSS =
	'[data-loader]{animation:lader-weg 0s linear 6s forwards}@keyframes lader-weg{to{opacity:0;visibility:hidden;pointer-events:none}}[data-bar]{position:relative}[data-bar]:not([data-js])::after{content:"########################################";position:absolute;left:0;top:0;clip-path:inset(0 100% 0 0);animation:lader-leiste 5s steps(40) forwards}@keyframes lader-leiste{to{clip-path:inset(0 0 0 0)}}';

function hide(el: HTMLElement, instant = false) {
	if (instant) el.style.transition = 'none';
	el.style.opacity = '0';
	el.style.pointerEvents = 'none';
	window.setTimeout(() => {
		el.style.visibility = 'hidden';
	}, FADE_MS + 20);
}

export function Loader() {
	const dict = useDict();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current as HTMLElement;
		const cnt = el.querySelector('[data-count]') as HTMLElement;
		const bar = el.querySelector('[data-bar]') as HTMLElement;
		const nav = (
			performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
		)?.type;
		let seen = false;
		try {
			seen = !!sessionStorage.getItem(KEY);
			sessionStorage.setItem(KEY, '1');
		} catch {}
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce || nav === 'reload' || nav === 'back_forward' || seen) {
			hide(el, true);
			return;
		}

		// Start = first visible frame of the loader (hydration comes later)
		const l0 = performance.getEntriesByName('first-paint')[0]?.startTime ?? performance.now();
		const hardAt = Math.max(HARD_LIMIT - l0, MIN + 200); // 4 s from the navigation start
		let ready = false; // readiness reported
		let fonts = false;
		const onReady = () => {
			ready = true;
		};
		document.addEventListener('landing:bereit', onReady);
		document.fonts.ready.then(() => {
			fonts = true;
		});

		let iv = 0;
		let v = 0; // displayed progress 0..1, only increases
		let vR = -1; // progress at the moment of readiness
		let last = l0;
		const finish = () => {
			clearInterval(iv);
			cnt.textContent = '100';
			bar.textContent = '#'.repeat(40);
			hide(el);
		};
		const tick = () => {
			bar.setAttribute('data-js', '1');
			const now = performance.now();
			const ms = now - l0;
			const dt = now - last;
			last = now;
			if (live.stage?.state.ready) ready = true;
			const eased = 1 - (1 - Math.min(1, ms / MIN)) ** 2;
			if (ready && fonts) {
				// real readiness: up to 100 within AFTER_READY ms, never faster than the time curve before that
				if (vR < 0) vR = v;
				v = Math.min(eased, Math.max(v, 0) + (dt * (1 - vR)) / AFTER_READY);
			} else {
				// without readiness held at 92 %, then creeping on to 99 %
				v = Math.max(
					v,
					Math.min(eased, 0.92) + 0.07 * (1 - Math.exp(-Math.max(0, ms - MIN) / 1500)),
				);
			}
			if (ms >= hardAt) v = 1;
			cnt.textContent = String(Math.round(v * 100)).padStart(3, '0');
			bar.textContent = '#'.repeat(Math.round(v * 40)).padEnd(40, '.');
			if (v >= 1) finish();
		};
		iv = window.setInterval(tick, 16);
		tick();
		return () => {
			clearInterval(iv);
			document.removeEventListener('landing:bereit', onReady);
		};
	}, []);

	return (
		<>
			<div
				ref={ref}
				data-loader="1"
				aria-hidden="true"
				suppressHydrationWarning
				style={css(
					`position:fixed;inset:0;z-index:100;background:#0A0A0A;color:#FAFAFA;display:flex;flex-direction:column;justify-content:flex-end;gap:var(--sp-16);padding:var(--rand);transition:opacity ${FADE_MS}ms ease`,
				)}
			>
				<span
					data-count="1"
					style={css(
						"font-family:'JetBrains Mono','JetBrains Mono Fallback',monospace;font-size:var(--t-176);font-weight:500;line-height:0.9;letter-spacing:-0.05em",
					)}
				>
					000
				</span>
				<div
					style={css(
						'display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:var(--sp-10) var(--sp-24)',
					)}
				>
					<span data-bar="1" className="label" style={css('white-space:pre;opacity:1')}>
						........................................
					</span>
					<span className="label">{dict.loader.label}</span>
				</div>
			</div>
			{/* Failsafe without JS and without a stylesheet: if the loader does not fade out by itself (chunks blocked,
			    network gone), it clears the field after 6 s via CSS animation. The JS control finishes earlier. */}
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user content */}
			<style dangerouslySetInnerHTML={{ __html: FAILSAFE_CSS }} />
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user content */}
			<script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
		</>
	);
}
