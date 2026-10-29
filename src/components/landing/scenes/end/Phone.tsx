'use client';

import { APP_DEMO } from '@/content/app-demo';
import { useEffect, useRef, useState } from 'react';
import { onFrame } from '../../core/loop';
import { cl } from '../../core/math';
import { useDict, useLocale } from '../../dict';
import { live } from '../intro/stage';
import s from './Phone.module.css';
import { dateLines } from './date';

// The phone of the end scene with the real ManaWG app: a same-origin iframe on
// /app-demo/index.html (standalone DOM and CSS of the app, state machine in demo.js). Shell and geometry
// 650/90, 300 x 620, radius 48, screen inset 11, radius 37). The screen is 278 x 598,
// the app runs at 390 x 839 CSS pixels and is fitted with scale(278/390). The status bar (iOS 27)
// sits on top as SVG, the app computes its safe area from --sai-t / --sai-b (see app-demo/demo.js).

/**
 * Scroll choreography: on the last stretch of the stage (P 0.95 to 1) the pointing hand taps through the
 * four tabs of the app as the page scrolls (a quarter per tab), and back again in reverse. Without a pointing hand (touch, reduced motion)
 * the app switches directly. The first tap by the visitor ends the choreography (used).
 */
const TABS = [
	['Start', '/|'],
	['Haushalt', '/putzen|'],
	['Finanzen', '/ausgaben|'],
	['Austausch', '/chat|'],
] as const;

/** State machine of the app in the iframe (app-demo/demo.js). */
interface Demo {
	enter: (
		w: string,
		id: string,
		opts?: { force?: boolean; instant?: boolean; vt?: boolean },
	) => boolean;
	state: () => { w: string; id: string };
	prewarm?: (ids: string[]) => void;
}

/** Status bar of an installed PWA on iOS 27: 09:41, Dynamic Island, signal, Wi-Fi, battery. */
function StatusBar() {
	return (
		<div className={s.status} aria-hidden="true">
			<span className={s.time}>09:41</span>
			<span className={s.island} />
			<svg
				aria-hidden="true"
				className={s.signal}
				viewBox="0 0 20 12"
				width="20"
				height="12"
				fill="currentColor"
			>
				<rect x="0" y="8" width="3.6" height="4" rx="1.2" />
				<rect x="5.4" y="5.5" width="3.6" height="6.5" rx="1.2" />
				<rect x="10.8" y="2.8" width="3.6" height="9.2" rx="1.2" />
				<rect x="16.2" y="0" width="3.6" height="12" rx="1.2" />
			</svg>
			<svg
				aria-hidden="true"
				className={s.wifi}
				viewBox="0 0 19 14"
				width="19"
				height="14"
				fill="currentColor"
			>
				<path d="M9.5 2.6c2.7 0 5.2 1 7.1 2.8.1.1.3.1.4 0l1.1-1.1c.1-.1.1-.3 0-.4C15.7 1.6 12.7.4 9.5.4S3.3 1.6.9 3.9c-.1.1-.1.3 0 .4L2 5.4c.1.1.3.1.4 0 1.9-1.8 4.4-2.8 7.1-2.8Z" />
				<path d="M9.5 6.9c1.6 0 3.1.6 4.3 1.6.1.1.3.1.4 0l1.1-1.1c.1-.1.1-.3 0-.4a9 9 0 0 0-11.6 0c-.1.1-.1.3 0 .4l1.1 1.1c.1.1.3.1.4 0 1.2-1 2.7-1.6 4.3-1.6Z" />
				<path d="M9.5 11.1c.9 0 1.7.3 2.3.9.1.1.1.3 0 .4l-1.9 1.9c-.2.2-.4.2-.6 0l-1.9-1.9c-.1-.1-.1-.3 0-.4.6-.6 1.4-.9 2.1-.9Z" />
			</svg>
			<svg aria-hidden="true" className={s.battery} viewBox="0 0 28 14" width="28" height="14">
				<rect
					x="0.5"
					y="0.5"
					width="24"
					height="13"
					rx="4"
					fill="none"
					stroke="currentColor"
					strokeOpacity="0.4"
				/>
				<rect x="2" y="2" width="21" height="10" rx="2.8" fill="currentColor" />
				<path
					d="M26 4.6v4.8c.9-.4 1.5-1.4 1.5-2.4S26.9 5 26 4.6Z"
					fill="currentColor"
					fillOpacity="0.45"
				/>
			</svg>
		</div>
	);
}

export function Phone() {
	const { phone } = useDict();
	const { src: SRC, still: STILL, lang } = APP_DEMO[useLocale()];
	const rootRef = useRef<HTMLDivElement>(null);
	const frameRef = useRef<HTMLIFrameElement>(null);
	const [src, setSrc] = useState<string | undefined>(undefined);
	const [still, setStill] = useState<string | undefined>(undefined);
	const [ready, setReady] = useState(false);
	const [lines, setLines] = useState<[string, string] | null>(null);
	const [used, setUsed] = useState(false);
	useEffect(() => setLines(dateLines(lang)), [lang]);

	// Demo of the pointing hand (hand.js, demo): the hand moves to the target and reports the touch (hand:contact),
	// only then a synthetic click goes into the same-origin app. The visitor's own clicks, keyboard and focus go
	// straight into the app (no catch layer), the pointing hand follows the pointer over the glass (see onLoad).
	useEffect(() => {
		const el = rootRef.current as HTMLDivElement;
		const host = el.closest('[data-stage]');
		if (!host) return;
		const onContact = (e: Event) => {
			const { x, y, demo } = (e as CustomEvent<{ x: number; y: number; demo?: boolean }>).detail;
			if (!demo) setUsed(true);
			const fr = frameRef.current;
			const doc = fr?.contentDocument;
			if (!fr || !doc?.defaultView) return;
			const r = fr.getBoundingClientRect();
			const k = r.width / fr.clientWidth;
			const lx = (x - r.left) / k;
			const ly = (y - r.top) / k;
			const target = doc.elementFromPoint(lx, ly);
			// The iframe's own MouseEvent, so the app's listeners see a native event of their realm
			target?.dispatchEvent(
				new doc.defaultView.MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					composed: true,
					clientX: lx,
					clientY: ly,
					button: 0,
				}),
			);
		};
		host.addEventListener('hand:contact', onContact);
		return () => host.removeEventListener('hand:contact', onContact);
	}, []);

	// Scroll choreography, frame by frame from the progress of the stage
	useEffect(() => {
		if (!ready || used) return;
		let step = -1;
		let warm = false;
		const off = onFrame(() => {
			const st = live.stage?.state;
			const fr = frameRef.current;
			const demo = (fr?.contentWindow as (Window & { __demo?: Demo }) | null)?.__demo;
			// Prebuild the pages of the choreography while idle so the first switch while scrolling does not stutter
			if (demo && !warm) {
				warm = true;
				demo.prewarm?.(TABS.map(([, id]) => id));
			}
			if (!st || !demo || !st.endOn) return;
			const next = Math.min(TABS.length - 1, Math.floor(cl((st.P - 0.95) / 0.05) * TABS.length));
			if (next === step) return;
			// First frame: just remember, the app already shows the right tab (Start)
			const first = step < 0;
			step = next;
			if (first && next === 0) return;
			// Scrolling switches immediately (no approach of the pointing hand: that felt delayed)
			const [, id] = TABS[next] ?? TABS[0];
			demo.enter('-', id, { vt: false });
		});
		return off;
	}, [ready, used]);

	// Set the still image and the iframe src only from P 0.55 (stage.ts sets data-near on #final)
	useEffect(() => {
		const el = rootRef.current as HTMLDivElement;
		const root = el.closest('#final') as HTMLElement | null;
		if (!root) return;
		const check = () => {
			if (root.dataset.near === '1') {
				mo.disconnect();
				setStill(STILL); // still image together with the counting from P 0.55, not on first load
				// The iframe runs on the same main thread as the landing page: load and build during an idle period
				const startLoad = () => setSrc(SRC);
				if ('requestIdleCallback' in window)
					window.requestIdleCallback(startLoad, { timeout: 2000 });
				else setTimeout(startLoad, 300);
			}
		};
		const mo = new MutationObserver(check);
		mo.observe(root, { attributes: true, attributeFilter: ['data-near'] });
		check();
		return () => mo.disconnect();
	}, [STILL, SRC]);

	return (
		<div
			ref={rootRef}
			data-cta="1"
			// biome-ignore lint/a11y/useSemanticElements: div stays div (same box, no fieldset)
			role="group"
			aria-label={phone.aria}
			style={{
				position: 'absolute',
				left: '650px',
				top: '90px',
				width: '300px',
				height: '620px',
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					boxSizing: 'border-box',
					background:
						'linear-gradient(145deg,#525252 0%,#171717 18%,#0A0A0A 50%,#262626 82%,#737373 100%)',
					borderRadius: '48px',
					padding: '11px',
					boxShadow:
						'inset 0 0 0 1px rgba(250,250,250,0.35),inset 0 0 0 3px #0A0A0A,0 50px 120px rgba(0,0,0,0.7),0 0 90px rgba(250,250,250,0.1)',
				}}
			>
				<span
					style={{
						position: 'absolute',
						left: '-3px',
						top: '118px',
						width: '3px',
						height: '30px',
						borderRadius: '2px 0 0 2px',
						background: 'linear-gradient(90deg,#737373,#262626)',
					}}
				/>
				<span
					style={{
						position: 'absolute',
						left: '-3px',
						top: '164px',
						width: '3px',
						height: '52px',
						borderRadius: '2px 0 0 2px',
						background: 'linear-gradient(90deg,#737373,#262626)',
					}}
				/>
				<span
					style={{
						position: 'absolute',
						left: '-3px',
						top: '226px',
						width: '3px',
						height: '52px',
						borderRadius: '2px 0 0 2px',
						background: 'linear-gradient(90deg,#737373,#262626)',
					}}
				/>
				<span
					style={{
						position: 'absolute',
						right: '-3px',
						top: '180px',
						width: '3px',
						height: '80px',
						borderRadius: '0 2px 2px 0',
						background: 'linear-gradient(270deg,#737373,#262626)',
					}}
				/>
				<div
					data-lenis-prevent
					style={{
						position: 'relative',
						width: '100%',
						height: '100%',
						background: 'var(--paper)',
						borderRadius: '37px',
						overflow: 'hidden',
						boxShadow: '0 0 0 1px #000',
					}}
				>
					{/* Still image: same state and same insets as the iframe, sits underneath and stays until the iframe has loaded */}
					<div
						className={s.surface}
						style={{ opacity: ready ? 0 : 'calc(1 - var(--app-out, 0))' }}
						aria-hidden="true"
					>
						{/* One still per theme; the other one is display:none and is not loaded (globals.css [data-only]) */}
						<img
							src={still}
							alt=""
							width={390}
							height={839}
							loading="lazy"
							decoding="async"
							className={s.still}
							data-only="dark"
						/>
						<img
							src={still?.replace('start.webp', 'start-light.webp')}
							alt=""
							width={390}
							height={839}
							loading="lazy"
							decoding="async"
							className={s.still}
							data-only="light"
						/>
						{lines && (
							<>
								<span className={s.date} style={{ top: 523.375 }}>
									{lines[0]}
								</span>
								<span className={s.date} style={{ top: 573.625 }}>
									{lines[1]}
								</span>
							</>
						)}
					</div>
					{src && (
						<iframe
							ref={frameRef}
							className={s.app}
							title={phone.frameTitle}
							src={src}
							loading="eager"
							onLoad={(e) => {
								const fr = e.currentTarget;
								const doc = fr.contentDocument;
								if (doc) {
									// The first tap by the visitor ends the hint
									doc.addEventListener('pointerdown', () => setUsed(true), { once: true });
									doc.addEventListener('keydown', () => setUsed(true), { once: true });
									// Pointer events do not bubble out of the iframe: mouse and pen are reported to the stage
									// with window coordinates (marked as direct) so the pointing hand follows and presses on click
									// without triggering the click a second time (stage.js, hand.js)
									const proceed = (ev: Event) => {
										const pe = ev as PointerEvent;
										if (pe.pointerType === 'touch') return;
										const r = fr.getBoundingClientRect();
										const k = r.width / fr.clientWidth;
										const w = new PointerEvent(pe.type, {
											bubbles: true,
											clientX: r.left + pe.clientX * k,
											clientY: r.top + pe.clientY * k,
											pointerType: pe.pointerType,
											button: pe.button,
										}) as PointerEvent & { direct?: boolean };
										w.direct = true;
										fr.dispatchEvent(w);
									};
									for (const t of ['pointermove', 'pointerdown', 'pointerup', 'pointercancel'])
										doc.addEventListener(t, proceed);
									// Over the glass the drawn fingertip replaces the pointer (hand.js sets data-hand)
									const st = doc.createElement('style');
									st.textContent = 'html[data-hand] *{cursor:none!important}';
									doc.head.appendChild(st);
								}
								requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
							}}
							// Transition: the app disintegrates into characters (scenes/decay sets --app-out)
							style={{
								border: 0,
								background: 'var(--paper)',
								opacity: 'calc(1 - var(--app-out, 0))',
							}}
						/>
					)}
					<StatusBar />
					<span
						style={{
							position: 'absolute',
							inset: '0',
							borderRadius: '37px',
							background:
								'linear-gradient(118deg,rgba(255,255,255,0.13) 0%,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(255,255,255,0.05) 100%)',
							pointerEvents: 'none',
							zIndex: '5',
						}}
					/>
				</div>
				{/* Hint under the phone: until the visitor's first tap */}
				<span
					className="label"
					data-end-hint="1"
					aria-hidden="true"
					style={{
						position: 'absolute',
						left: '-40px',
						right: '-40px',
						top: '-30px',
						textAlign: 'center',
						whiteSpace: 'nowrap',
						transition: 'opacity 0.5s ease',
						opacity: used ? 0 : 1,
					}}
				>
					{phone.hint}
				</span>
			</div>
		</div>
	);
}
