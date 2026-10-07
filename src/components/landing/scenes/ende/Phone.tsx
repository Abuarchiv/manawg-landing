'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '../../core/dc';
import s from './Phone.module.css';
import { datumsZeilen } from './datum';

// Das Handy der Ende-Szene mit der echten ManaWG-App: ein gleich-originiges iframe auf
// /app-demo/index.html (Standalone-DOM und CSS der App, Zustandsautomat in demo.js). Hülle und Geometrie
// wie im Entwurf (650/90, 300 x 620, Radius 48, Bildschirm Inset 11, Radius 37). Der Bildschirm ist 278 x 598,
// die App läuft in 390 x 839 CSS-Pixeln und wird per scale(278/390) eingepasst. Die Statusleiste (iOS 27)
// liegt als SVG darüber, die App rechnet ihre Safe-Area aus --sai-t / --sai-b (siehe app-demo/demo.js).

const SRC = '/app-demo/index.html';
const BILD = '/app-demo/start.webp';
const AB_P = 0.8; // ab hier laden Standbild und (im Leerlauf) das iframe, kurz vor der Szene

/** Statusleiste einer installierten PWA unter iOS 27: 09:41, Dynamic Island, Signal, WLAN, Akku. */
function Statusleiste() {
	return (
		<div className={s.status} aria-hidden="true">
			<span className={s.zeit}>09:41</span>
			<span className={s.insel} />
			<svg
				aria-hidden="true"
				className={s.signal}
				viewBox="0 0 20 12"
				width="20"
				height="12"
				fill="#0A0A0A"
			>
				<rect x="0" y="8" width="3.6" height="4" rx="1.2" />
				<rect x="5.4" y="5.5" width="3.6" height="6.5" rx="1.2" />
				<rect x="10.8" y="2.8" width="3.6" height="9.2" rx="1.2" />
				<rect x="16.2" y="0" width="3.6" height="12" rx="1.2" />
			</svg>
			<svg
				aria-hidden="true"
				className={s.wlan}
				viewBox="0 0 19 14"
				width="19"
				height="14"
				fill="#0A0A0A"
			>
				<path d="M9.5 2.6c2.7 0 5.2 1 7.1 2.8.1.1.3.1.4 0l1.1-1.1c.1-.1.1-.3 0-.4C15.7 1.6 12.7.4 9.5.4S3.3 1.6.9 3.9c-.1.1-.1.3 0 .4L2 5.4c.1.1.3.1.4 0 1.9-1.8 4.4-2.8 7.1-2.8Z" />
				<path d="M9.5 6.9c1.6 0 3.1.6 4.3 1.6.1.1.3.1.4 0l1.1-1.1c.1-.1.1-.3 0-.4a9 9 0 0 0-11.6 0c-.1.1-.1.3 0 .4l1.1 1.1c.1.1.3.1.4 0 1.2-1 2.7-1.6 4.3-1.6Z" />
				<path d="M9.5 11.1c.9 0 1.7.3 2.3.9.1.1.1.3 0 .4l-1.9 1.9c-.2.2-.4.2-.6 0l-1.9-1.9c-.1-.1-.1-.3 0-.4.6-.6 1.4-.9 2.1-.9Z" />
			</svg>
			<svg aria-hidden="true" className={s.akku} viewBox="0 0 28 14" width="28" height="14">
				<rect
					x="0.5"
					y="0.5"
					width="24"
					height="13"
					rx="4"
					fill="none"
					stroke="#0A0A0A"
					strokeOpacity="0.4"
				/>
				<rect x="2" y="2" width="21" height="10" rx="2.8" fill="#0A0A0A" />
				<path
					d="M26 4.6v4.8c.9-.4 1.5-1.4 1.5-2.4S26.9 5 26 4.6Z"
					fill="#0A0A0A"
					fillOpacity="0.45"
				/>
			</svg>
		</div>
	);
}

export function Phone() {
	const wurzel = useRef<HTMLDivElement>(null);
	const rahmen = useRef<HTMLIFrameElement>(null);
	const [src, setSrc] = useState<string | undefined>(undefined);
	const [bild, setBild] = useState<string | undefined>(undefined);
	const [bereit, setBereit] = useState(false);
	const [zeilen, setZeilen] = useState<[string, string] | null>(null);
	useEffect(() => setZeilen(datumsZeilen()), []);

	// Klick mit Maus oder Stift: die Fangschicht über dem Glas hält den Druck zurück, die Zeigehand fährt zum Ziel
	// und meldet die Berührung (hand:kontakt). Erst dann geht der Klick in die gleich-originige App. Touch läuft
	// ohne Fangschicht direkt in die App (der echte Finger tippt).
	useEffect(() => {
		const el = wurzel.current as HTMLDivElement;
		const host = el.closest('[data-buehne]');
		if (!host) return;
		const an = (e: Event) => {
			const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
			const fr = rahmen.current;
			const doc = fr?.contentDocument;
			if (!fr || !doc?.defaultView) return;
			const r = fr.getBoundingClientRect();
			const k = r.width / fr.clientWidth;
			const lx = (x - r.left) / k;
			const ly = (y - r.top) / k;
			const ziel = doc.elementFromPoint(lx, ly);
			const Maus = (doc.defaultView as unknown as { MouseEvent: typeof MouseEvent }).MouseEvent;
			ziel?.dispatchEvent(
				new Maus('click', {
					bubbles: true,
					cancelable: true,
					composed: true,
					clientX: lx,
					clientY: ly,
					button: 0,
				}),
			);
		};
		host.addEventListener('hand:kontakt', an);
		return () => host.removeEventListener('hand:kontakt', an);
	}, []);

	// Standbild und iframe-src erst ab P > AB_P setzen (Fortschritt steht als --p am #final)
	useEffect(() => {
		const el = wurzel.current as HTMLDivElement;
		const root = el.closest('#final') as HTMLElement | null;
		if (!root) return;
		const pruefe = () => {
			if (Number.parseFloat(root.style.getPropertyValue('--p') || '0') > AB_P) {
				mo.disconnect();
				setBild(BILD); // Standbild gleichzeitig mit dem Zählen ab AB_P, nicht schon beim Erstladen
				// Das iframe läuft im selben Hauptthread wie die Landing: Laden und Aufbau in einer Leerlaufpause
				const los = () => setSrc(SRC);
				if ('requestIdleCallback' in window) window.requestIdleCallback(los, { timeout: 2000 });
				else setTimeout(los, 300);
			}
		};
		const mo = new MutationObserver(pruefe);
		mo.observe(root, { attributes: true, attributeFilter: ['style'] });
		pruefe();
		return () => mo.disconnect();
	}, []);

	return (
		<div
			ref={wurzel}
			data-cta="1"
			// biome-ignore lint/a11y/useSemanticElements: div bleibt div (gleiche Box, kein fieldset)
			role="group"
			aria-label="ManaWG zum Ausprobieren"
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
					style={css(
						'position:relative;width:100%;height:100%;background:#FFFFFF;border-radius:37px;overflow:hidden;box-shadow:0 0 0 1px #000',
					)}
				>
					{/* Standbild: derselbe Zustand und dieselben Insets wie das iframe, liegt darunter und bleibt bis zum Laden stehen */}
					<div className={s.flaeche} style={{ opacity: bereit ? 0 : 1 }} aria-hidden="true">
						<img
							src={bild}
							alt=""
							width={390}
							height={839}
							loading="lazy"
							decoding="async"
							className={s.bild}
						/>
						{zeilen && (
							<>
								<span className={s.datum} style={{ top: 422.875 }}>
									{zeilen[0]}
								</span>
								<span className={s.datum} style={{ top: 473.125 }}>
									{zeilen[1]}
								</span>
							</>
						)}
					</div>
					{src && (
						<iframe
							ref={rahmen}
							className={s.app}
							title="ManaWG-App"
							src={src}
							loading="eager"
							onLoad={() =>
								requestAnimationFrame(() => requestAnimationFrame(() => setBereit(true)))
							}
							style={{ border: 0, background: '#FFFFFF' }}
						/>
					)}
					<span className={s.fang} data-fang="1" aria-hidden="true" />
					<Statusleiste />
					<span
						style={css(
							'position:absolute;inset:0;border-radius:37px;background:linear-gradient(118deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(255,255,255,0.08) 100%);pointer-events:none;z-index:5',
						)}
					/>
				</div>
			</div>
		</div>
	);
}
