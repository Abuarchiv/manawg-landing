'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '../../core/dc';
import { PL } from './orte';
import { registerPlanet } from './planet';

export function Bereiche() {
	const [sel, setSel] = useState(0);
	const selRef = useRef(0);
	selRef.current = sel;
	const cvRef = useRef<HTMLCanvasElement>(null);
	useEffect(
		() =>
			registerPlanet(cvRef.current as HTMLCanvasElement, {
				getSel: () => selRef.current,
				onSelect: setSel,
			}),
		[],
	);
	const pl = PL[sel] as string[];
	return (
		<section
			id="bereiche"
			data-sec="bereiche"
			tabIndex={-1}
			aria-labelledby="bereiche-titel"
			style={css(
				'position:relative;height:max(560px,100lvh);background:#0A0A0A;color:#FAFAFA;overflow:hidden',
			)}
		>
			<canvas
				ref={cvRef}
				aria-hidden="true"
				style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
			/>
			<div
				style={css(
					'position:absolute;top:var(--sp-72);left:var(--rand);right:var(--rand);display:flex;flex-direction:column;gap:var(--sp-14);pointer-events:none',
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
					Eine WG.
				</h2>
				<span className="label">ZIEHEN ZUM DREHEN · ORT ANKLICKEN</span>
			</div>
			<div
				style={css(
					'position:absolute;left:var(--rand);bottom:var(--sp-48);width:var(--w-380);max-width:calc(100% - 2 * var(--rand));display:flex;flex-direction:column;gap:var(--sp-14);pointer-events:none',
				)}
			>
				<span className="label">{`${String(sel + 1).padStart(2, '0')} · ${(pl[0] as string).toUpperCase()}`}</span>
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
					<span style={css("font-family:'JetBrains Mono',monospace;font-size:var(--t-13)")}>
						{pl[4]}
					</span>
				</div>
			</div>
		</section>
	);
}
