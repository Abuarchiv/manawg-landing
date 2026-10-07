'use client';

import { appUrl } from '@/lib/app-origin';
import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { registerAscii } from './ascii';

export function Finale() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => registerAscii(ref.current as HTMLCanvasElement), []);
	return (
		<section
			id="finale"
			data-sec="finale"
			tabIndex={-1}
			aria-labelledby="finale-titel"
			style={css(
				'position:relative;height:max(560px,95lvh);background:#0A0A0A;color:#FAFAFA;overflow:hidden',
			)}
		>
			<canvas
				ref={ref}
				aria-hidden="true"
				style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
			/>
			<div
				style={css(
					'position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:var(--sp-32);padding:0 var(--rand);pointer-events:none',
				)}
			>
				<h2
					id="finale-titel"
					style={css(
						"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-200);line-height:0.88;letter-spacing:-0.06em;overflow-wrap:break-word",
					)}
				>
					Alltag
					<br />
					teilen.
				</h2>
				<div style={css('display:flex;flex-wrap:wrap;gap:8px;pointer-events:auto')}>
					<a href={appUrl('/neu?action=create')} className="cta cta--voll cta--gross">
						WG erstellen
					</a>
					<a href={appUrl('/neu')} className="cta cta--dunkel cta--gross">
						Einladung einlösen
					</a>
				</div>
			</div>
		</section>
	);
}
