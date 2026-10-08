'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { registerTiefe } from './tunnel';

const WOERTER = [
	{ nr: '01 · GELD', text: ['Wer zahlt, trägt ein. ManaWG ', 'teilt auf.'] },
	{ nr: '02 · HAUSHALT', text: ['Einkauf, Vorräte, ', 'Putzplan.'] },
	{ nr: '03 · ABSPRACHEN', text: ['Kalender, Pinnwand, ', 'Chat.'] },
];

export function Tiefe() {
	const secRef = useRef<HTMLElement>(null);
	const cvRef = useRef<HTMLCanvasElement>(null);
	useEffect(
		() => registerTiefe(cvRef.current as HTMLCanvasElement, secRef.current as HTMLElement),
		[],
	);
	return (
		<section
			id="funktionen"
			data-sec="funktionen"
			data-stick="1"
			tabIndex={-1}
			ref={secRef}
			aria-label="Funktionen"
			style={css('position:relative;height:calc(4.5 * 100lvh);background:#0A0A0A;color:#FAFAFA')}
		>
			<h2 className="sr-only">Funktionen</h2>
			<div style={css('position:sticky;top:0;height:100lvh;overflow:hidden')}>
				<canvas
					ref={cvRef}
					aria-hidden="true"
					style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
				/>
				<div
					style={css('position:absolute;left:0;right:0;top:0;height:100svh;pointer-events:none')}
				>
					<div
						data-hint="1"
						className="label"
						style={css(
							'position:absolute;top:calc(var(--kopf-unten) + var(--sp-24));left:var(--rand)',
						)}
					>
						[ TIEFE ] WEITER SCROLLEN
					</div>
					{WOERTER.map((w, i) => (
						<div
							key={w.nr}
							data-dcap={i}
							style={css(
								'position:absolute;left:var(--rand);right:var(--rand);bottom:var(--sp-72);display:flex;flex-direction:column;gap:var(--sp-10);opacity:0',
							)}
						>
							<span className="label tiefe-label" aria-hidden="true">
								{w.nr}
								<i className="leit" />
							</span>
							<h3
								style={css(
									"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-44);line-height:inherit;letter-spacing:-0.03em;overflow-wrap:break-word",
								)}
							>
								{w.text[0]}
								<span className="serife">{w.text[1]}</span>
							</h3>
						</div>
					))}
					<div
						className="label"
						aria-hidden="true"
						style={css('position:absolute;right:var(--rand);bottom:var(--sp-28)')}
					>
						{'TIEFE '}
						<span data-depth="1">000</span>
					</div>
				</div>
			</div>
		</section>
	);
}
