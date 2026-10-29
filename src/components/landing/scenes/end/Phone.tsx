'use client';

import { APP_DEMO } from '@/content/app-demo';
import { useEffect, useRef, useState } from 'react';
import { css } from '../../core/dc';
import { onFrame } from '../../core/loop';
import { cl } from '../../core/math';
import { useDict, useLocale } from '../../dict';
import { live } from '../intro/stage';
import s from './Phone.module.css';
import { dateLines } from './date';

// Das Handy der Ende-Szene mit der echten ManaWG-App: ein gleich-originiges iframe auf
// /app-demo/index.html (Standalone-DOM und CSS der App, Zustandsautomat in demo.js). Hülle und Geometrie
// wie im Entwurf (650/90, 300 x 620, Radius 48, Bildschirm Inset 11, Radius 37). Der Bildschirm ist 278 x 598,
// die App läuft in 390 x 839 CSS-Pixeln und wird per scale(278/390) eingepasst. Die Statusleiste (iOS 27)
// liegt als SVG darüber, die App rechnet ihre Safe-Area aus --sai-t / --sai-b (siehe app-demo/demo.js).

/**
 * Scroll-Choreografie: auf dem letzten Stück der Bühne (P 0,95 bis 1) tippt die Zeigehand mit dem Scroll durch die
 * vier Tabs der App (ein Viertel je Tab), rückwärts wieder zurück. Ohne Zeigehand (Touch, reduzierte Bewegung)
 * schaltet die App direkt um. Der erste eigene Tipp beendet die Choreografie (benutzt).
 */
const TABS = [
	['Start', '/|'],
	['Haushalt', '/putzen|'],
	['Finanzen', '/ausgaben|'],
	['Austausch', '/chat|'],
] as const;

/** Zustandsautomat der App im iframe (app-demo/demo.js). */
interface Demo {
	enter: (
		w: string,
		id: string,
		opts?: { force?: boolean; instant?: boolean; vt?: boolean },
	) => boolean;
	state: () => { w: string; id: string };
	vorwaermen?: (ids: string[]) => void;
}

/** Statusleiste einer installierten PWA unter iOS 27: 09:41, Dynamic Island, Signal, WLAN, Akku. */
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
				fill="#FAFAFA"
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
				fill="#FAFAFA"
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
					stroke="#FAFAFA"
					strokeOpacity="0.4"
				/>
				<rect x="2" y="2" width="21" height="10" rx="2.8" fill="#FAFAFA" />
				<path
					d="M26 4.6v4.8c.9-.4 1.5-1.4 1.5-2.4S26.9 5 26 4.6Z"
					fill="#FAFAFA"
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

	// Vorführung der Zeigehand (hand.js, demo): die Hand fährt zum Ziel und meldet die Berührung (hand:kontakt),
	// erst dann geht ein synthetischer Klick in die gleich-originige App. Eigene Klicks, Tastatur und Fokus gehen
	// direkt in die App (keine Fangschicht), die Zeigehand folgt dem Zeiger über das Glas (siehe onLoad).
	useEffect(() => {
		const el = rootRef.current as HTMLDivElement;
		const host = el.closest('[data-buehne]');
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
			const MouseCtor = (doc.defaultView as unknown as { MouseEvent: typeof MouseEvent })
				.MouseEvent;
			target?.dispatchEvent(
				new MouseCtor('click', {
					bubbles: true,
					cancelable: true,
					composed: true,
					clientX: lx,
					clientY: ly,
					button: 0,
				}),
			);
		};
		host.addEventListener('hand:kontakt', onContact);
		return () => host.removeEventListener('hand:kontakt', onContact);
	}, []);

	// Scroll-Choreografie, Bild für Bild am Fortschritt der Bühne
	useEffect(() => {
		if (!ready || used) return;
		let step = -1;
		let warm = false;
		const off = onFrame(() => {
			const st = live.stage?.state;
			const fr = frameRef.current;
			const demo = (fr?.contentWindow as (Window & { __demo?: Demo }) | null)?.__demo;
			// Die Seiten der Choreografie im Leerlauf vorbauen, damit der erste Wechsel im Scroll nicht ruckelt
			if (demo && !warm) {
				warm = true;
				demo.vorwaermen?.(TABS.map(([, id]) => id));
			}
			if (!st || !demo || !st.endOn) return;
			const next = Math.min(TABS.length - 1, Math.floor(cl((st.P - 0.95) / 0.05) * TABS.length));
			if (next === step) return;
			// Erstes Bild: nur merken, die App steht schon richtig (Start)
			const first = step < 0;
			step = next;
			if (first && next === 0) return;
			// Der Scroll schaltet sofort um (kein Anfahren der Zeigehand: das wirkte verzögert)
			const [, id] = TABS[next] ?? TABS[0];
			demo.enter('-', id, { vt: false });
		});
		return off;
	}, [ready, used]);

	// Standbild und iframe-src erst ab P 0,55 setzen (stage.ts setzt data-nah am #final)
	useEffect(() => {
		const el = rootRef.current as HTMLDivElement;
		const root = el.closest('#final') as HTMLElement | null;
		if (!root) return;
		const check = () => {
			if (root.dataset.nah === '1') {
				mo.disconnect();
				setStill(STILL); // Standbild gleichzeitig mit dem Zählen ab P 0,55, nicht schon beim Erstladen
				// Das iframe läuft im selben Hauptthread wie die Landing: Laden und Aufbau in einer Leerlaufpause
				const startLoad = () => setSrc(SRC);
				if ('requestIdleCallback' in window)
					window.requestIdleCallback(startLoad, { timeout: 2000 });
				else setTimeout(startLoad, 300);
			}
		};
		const mo = new MutationObserver(check);
		mo.observe(root, { attributes: true, attributeFilter: ['data-nah'] });
		check();
		return () => mo.disconnect();
	}, [STILL, SRC]);

	return (
		<div
			ref={rootRef}
			data-cta="1"
			// biome-ignore lint/a11y/useSemanticElements: div bleibt div (gleiche Box, kein fieldset)
			role="group"
			aria-label={phone.aria}
			style={css(
				'position:absolute;left:650px;top:90px;width:300px;height:620px;pointer-events:none',
			)}
		>
			<div
				style={css(
					'position:relative;width:100%;height:100%;box-sizing:border-box;background:linear-gradient(145deg,#525252 0%,#171717 18%,#0A0A0A 50%,#262626 82%,#737373 100%);border-radius:48px;padding:11px;box-shadow:inset 0 0 0 1px rgba(250,250,250,0.35),inset 0 0 0 3px #0A0A0A,0 50px 120px rgba(0,0,0,0.7),0 0 90px rgba(250,250,250,0.1)',
				)}
			>
				<span
					style={css(
						'position:absolute;left:-3px;top:118px;width:3px;height:30px;border-radius:2px 0 0 2px;background:linear-gradient(90deg,#737373,#262626)',
					)}
				/>
				<span
					style={css(
						'position:absolute;left:-3px;top:164px;width:3px;height:52px;border-radius:2px 0 0 2px;background:linear-gradient(90deg,#737373,#262626)',
					)}
				/>
				<span
					style={css(
						'position:absolute;left:-3px;top:226px;width:3px;height:52px;border-radius:2px 0 0 2px;background:linear-gradient(90deg,#737373,#262626)',
					)}
				/>
				<span
					style={css(
						'position:absolute;right:-3px;top:180px;width:3px;height:80px;border-radius:0 2px 2px 0;background:linear-gradient(270deg,#737373,#262626)',
					)}
				/>
				<div
					data-lenis-prevent
					style={css(
						'position:relative;width:100%;height:100%;background:#0A0A0A;border-radius:37px;overflow:hidden;box-shadow:0 0 0 1px #000',
					)}
				>
					{/* Standbild: derselbe Zustand und dieselben Insets wie das iframe, liegt darunter und bleibt bis zum Laden stehen */}
					<div
						className={s.surface}
						style={{ opacity: ready ? 0 : 'calc(1 - var(--app-aus, 0))' }}
						aria-hidden="true"
					>
						<img
							src={still}
							alt=""
							width={390}
							height={839}
							loading="lazy"
							decoding="async"
							className={s.still}
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
									// Der erste eigene Tipp beendet den Hinweis
									doc.addEventListener('pointerdown', () => setUsed(true), { once: true });
									doc.addEventListener('keydown', () => setUsed(true), { once: true });
									// Zeigerereignisse steigen nicht aus dem iframe auf: Maus und Stift werden mit Fensterkoordinaten
									// an die Bühne gemeldet (als direkt markiert), damit die Zeigehand folgt und beim Klick drückt,
									// ohne den Klick ein zweites Mal auszulösen (stage.js, hand.js)
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
									// Über dem Glas ersetzt die gezeichnete Fingerspitze den Zeiger (hand.js setzt data-hand)
									const st = doc.createElement('style');
									st.textContent = 'html[data-hand] *{cursor:none!important}';
									doc.head.appendChild(st);
								}
								requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
							}}
							// Übergang: die App zerfällt in Zeichen (scenes/zerfall setzt --app-aus)
							style={{ border: 0, background: '#0A0A0A', opacity: 'calc(1 - var(--app-aus, 0))' }}
						/>
					)}
					<StatusBar />
					<span
						style={css(
							'position:absolute;inset:0;border-radius:37px;background:linear-gradient(118deg,rgba(255,255,255,0.13) 0%,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(255,255,255,0.05) 100%);pointer-events:none;z-index:5',
						)}
					/>
				</div>
				{/* Hinweis unter dem Handy: bis zum ersten eigenen Tipp */}
				<span
					className="label"
					data-ende-hinweis="1"
					aria-hidden="true"
					style={css(
						`position:absolute;left:-40px;right:-40px;top:-30px;text-align:center;white-space:nowrap;transition:opacity 0.5s ease;opacity:${used ? 0 : 1}`,
					)}
				>
					{phone.hint}
				</span>
			</div>
		</div>
	);
}
