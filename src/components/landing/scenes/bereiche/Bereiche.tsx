'use client';

import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { css } from '../../core/dc';
import m from './Bereiche.module.css';
import { type Ort, PL } from './orte';
import { registerPlanet } from './planet';

export function Bereiche() {
	const [sel, setSel] = useState(0);
	const selRef = useRef(0);
	selRef.current = sel;
	const cvRef = useRef<HTMLCanvasElement>(null);
	const api = useRef<{ face?: (i: number) => void }>({});
	const knoepfe = useRef<(HTMLButtonElement | null)[]>([]);
	useEffect(
		() =>
			registerPlanet(cvRef.current as HTMLCanvasElement, {
				getSel: () => selRef.current,
				onSelect: setSel,
				api: api.current,
			}),
		[],
	);
	// Ortsliste: dieselbe Auswahl wie auf dem Planeten, der Ort dreht nach vorn
	const wahl = (i: number) => {
		setSel(i);
		api.current.face?.(i);
	};
	const taste = (e: KeyboardEvent, i: number) => {
		const n = PL.length;
		const d =
			e.key === 'ArrowRight' || e.key === 'ArrowDown'
				? 1
				: e.key === 'ArrowLeft' || e.key === 'ArrowUp'
					? -1
					: e.key === 'Home'
						? -i
						: e.key === 'End'
							? n - 1 - i
							: 0;
		if (!d) return;
		e.preventDefault();
		const j = (i + d + n) % n;
		wahl(j);
		knoepfe.current[j]?.focus();
	};
	const pl = PL[sel] as Ort;
	return (
		<section
			id="bereiche"
			data-sec="bereiche"
			tabIndex={-1}
			aria-labelledby="bereiche-titel"
			className={m.sektion}
		>
			<canvas
				ref={cvRef}
				aria-hidden="true"
				style={css(
					// Unten weich auslaufen: der Planetenschein reicht quer über die Abschnittskante hinaus und
					// würde sonst beim Verlassen der Szene als harte Linie über der nächsten Szene stehen
					'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;mask-image:linear-gradient(#000 calc(100% - 72px),transparent)',
				)}
			/>
			<div
				data-titel="1"
				style={css(
					'position:absolute;top:max(var(--sp-72),calc(var(--kopf-unten) + var(--sp-14)));left:var(--rand);right:var(--rand);display:flex;flex-direction:column;gap:var(--sp-14);pointer-events:none',
				)}
			>
				<span className="label">[ 06 ] BEREICHE</span>
				<h2
					id="bereiche-titel"
					style={css(
						"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-64);line-height:0.95;letter-spacing:-0.04em;overflow-wrap:break-word",
					)}
				>
					Acht Orte.
					<br />
					Eine <span className="serife">WG.</span>
				</h2>
				<span className={`label ${m.hinweis}`}>ZIEHEN ZUM DREHEN · ORT ANKLICKEN</span>
			</div>
			<div data-karte="1" className={m.karte}>
				<nav className={m.orte} aria-label="Orte der WG">
					{PL.map((p, i) => (
						<button
							type="button"
							key={p[0]}
							ref={(el) => {
								knoepfe.current[i] = el;
							}}
							tabIndex={i === sel ? 0 : -1}
							aria-pressed={i === sel}
							onClick={() => wahl(i)}
							onKeyDown={(e) => taste(e, i)}
						>
							{`${String(i + 1).padStart(2, '0')} ${(p[0] as string).toUpperCase()}`}
						</button>
					))}
				</nav>
				<span className="label">{`${String(sel + 1).padStart(2, '0')} · ${pl[0].toUpperCase()}`}</span>
				<span
					style={css(
						"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-32);line-height:1.1;letter-spacing:-0.03em",
					)}
				>
					{pl[1]}
				</span>
				<div
					style={css(
						'background:#FFFFFF;color:#0A0A0A;border-radius:14px;padding:0 var(--sp-16);min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:var(--sp-12)',
					)}
				>
					<div style={css('display:flex;flex-direction:column;gap:2px')}>
						<span style={css('font-size:var(--t-14);font-weight:500')}>{pl[2]}</span>
						<span style={css('font-size:12px;color:#737373')}>{pl[3]}</span>
					</div>
					<span
						style={css("font-family:'JetBrains Mono',monospace;font-size:14px;white-space:nowrap")}
					>
						{pl[4]}
					</span>
				</div>
			</div>
		</section>
	);
}
