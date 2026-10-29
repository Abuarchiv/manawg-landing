'use client';

import { useEffect, useRef } from 'react';
import { css } from '../core/dc';
import { useDict } from '../dict';
import { live } from '../scenes/intro/stage';

// Lader: Zähler 000 bis 100 und Balken. Die Zählung folgt der echten Bereitschaft (erstes gezeichnetes
// Hero-Bild bzw. Fallback = landing:bereit, dazu document.fonts.ready), nicht nur der Zeit.
//   - frühestens 0,8 s nach dem Start weg, spätestens 0,3 s nach der Bereitschaft, hart nach 4 s
//   - entfällt bei Zurück, Neuladen und bei erneutem Besuch in derselben Sitzung
//   - bei reduzierter Bewegung sofort weg

const MIN = 800; // ms ab Start
const HARD_LIMIT = 4000; // ms ab Navigationsbeginn: harter Abbruch
const AFTER_READY = 100; // ms: nach der Bereitschaft zählt der Lader bis 100
const FADE_MS = 150; // ms: Ausblenden (deckt sich mit transition unten)
const KEY = 'manawg-lader';

// Läuft beim Parsen direkt hinter dem Lader, also vor dem ersten Bild: verhindert den kurzen Blitz
// bei Zurück, Neuladen und Wiederkehr. Deckkraft 0 (nicht display:none), damit Prüfwerkzeuge das Ende sehen.
const PRE_PAINT_SCRIPT = `(function(){try{var l=document.querySelector('[data-loader]');var n=performance.getEntriesByType('navigation')[0];var t=n&&n.type;if(t==='reload'||t==='back_forward'||sessionStorage.getItem('${KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){l.style.cssText+=';opacity:0;visibility:hidden;pointer-events:none;transition:none'}}catch(e){}})()`;

// Vor der Hydration läuft die Punktleiste per CSS (40 Schritte), damit sich auf langsamem Netz sofort etwas bewegt; JS übernimmt (data-js).
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

		// Start = erstes sichtbares Bild des Laders (Hydration kommt später)
		const l0 = performance.getEntriesByName('first-paint')[0]?.startTime ?? performance.now();
		const hardAt = Math.max(HARD_LIMIT - l0, MIN + 200); // 4 s ab Navigationsbeginn
		let ready = false; // Bereitschaft gemeldet
		let fonts = false;
		const onReady = () => {
			ready = true;
		};
		document.addEventListener('landing:bereit', onReady);
		document.fonts.ready.then(() => {
			fonts = true;
		});

		let iv = 0;
		let v = 0; // angezeigter Fortschritt 0..1, steigt nur
		let vR = -1; // Fortschritt im Moment der Bereitschaft
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
			if (live.stage?.state.bereit) ready = true;
			const eased = 1 - (1 - Math.min(1, ms / MIN)) ** 2;
			if (ready && fonts) {
				// echte Bereitschaft: bis 100 in NACH ms, vorher nie schneller als die Zeitkurve
				if (vR < 0) vR = v;
				v = Math.min(eased, Math.max(v, 0) + (dt * (1 - vR)) / AFTER_READY);
			} else {
				// ohne Bereitschaft bei 92 % gehalten, danach träge weiter bis 99 %
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
			{/* Ausfallsicherung ohne JS und ohne Stylesheet: blendet der Lader nicht selbst aus (Chunks blockiert,
			    Netz weg), räumt er nach 6 s per CSS-Animation das Feld. Die JS-Steuerung ist früher fertig. */}
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: statische Zeichenkette, kein Nutzerinhalt */}
			<style dangerouslySetInnerHTML={{ __html: FAILSAFE_CSS }} />
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: statische Zeichenkette, kein Nutzerinhalt */}
			<script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
		</>
	);
}
