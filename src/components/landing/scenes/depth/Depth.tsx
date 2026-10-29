'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { useDict } from '../../dict';
import { registerDepth } from '../depth/tunnel';

export function Depth() {
	const { depth, tunnelWords } = useDict();
	const secRef = useRef<HTMLElement>(null);
	const cvRef = useRef<HTMLCanvasElement>(null);
	useEffect(
		() =>
			registerDepth(cvRef.current as HTMLCanvasElement, secRef.current as HTMLElement, tunnelWords),
		[tunnelWords],
	);
	return (
		<section
			id="funktionen"
			data-sec="funktionen"
			data-stick="1"
			tabIndex={-1}
			ref={secRef}
			aria-label={depth.srHeading}
			style={css('position:relative;height:calc(4.5 * 100lvh);background:#0A0A0A;color:#FAFAFA')}
		>
			<h2 className="sr-only">{depth.srHeading}</h2>
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
						{depth.hint}
					</div>
					{depth.captions.map((w, i) => (
						<div
							key={w.label}
							data-dcap={i}
							style={css(
								'position:absolute;left:var(--rand);right:var(--rand);bottom:var(--sp-72);display:flex;flex-direction:column;gap:var(--sp-10);opacity:0',
							)}
						>
							<span className="label" aria-hidden="true">
								{w.label}
							</span>
							<h3
								style={css(
									"margin:0;font-family:'Inter Tight','Inter Tight Fallback',sans-serif;font-weight:600;font-size:var(--t-44);line-height:inherit;letter-spacing:-0.03em;overflow-wrap:break-word",
								)}
							>
								{w.text}
							</h3>
						</div>
					))}
					<div
						className="label"
						aria-hidden="true"
						style={css('position:absolute;right:var(--rand);bottom:var(--sp-28)')}
					>
						{depth.counter}
						<span data-depth="1">000</span>
					</div>
				</div>
			</div>
		</section>
	);
}
