'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { registerKoerper } from './physik';

export function Koerper() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => registerKoerper(ref.current as HTMLCanvasElement), []);
	return (
		<section
			id="koerper"
			data-sec="koerper"
			tabIndex={-1}
			aria-labelledby="koerper-titel"
			style={css(
				'position:relative;height:max(520px,95lvh);background:#0A0A0A;color:#FAFAFA;overflow:hidden',
			)}
		>
			<canvas
				ref={ref}
				aria-hidden="true"
				style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
			/>
			<div
				style={css(
					'position:absolute;left:var(--rand);top:var(--sp-48);display:flex;flex-direction:column;gap:var(--sp-10);pointer-events:none',
				)}
			>
				<span className="label">[ ACHT KÖRPER ]</span>
				<h2
					id="koerper-titel"
					style={css(
						"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-40);line-height:1.1;letter-spacing:-0.03em;margin:0;overflow-wrap:break-word",
					)}
				>
					Wirf sie. Sie finden zurück.
				</h2>
			</div>
		</section>
	);
}
