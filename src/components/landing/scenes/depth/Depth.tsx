'use client';

import { useEffect, useRef } from 'react';
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
			style={{
				position: 'relative',
				height: 'calc(4.5 * 100lvh)',
				background: 'var(--paper)',
				color: 'var(--ink)',
			}}
		>
			<h2 className="sr-only">{depth.srHeading}</h2>
			<div style={{ position: 'sticky', top: '0', height: '100lvh', overflow: 'hidden' }}>
				<canvas
					ref={cvRef}
					aria-hidden="true"
					style={{
						position: 'absolute',
						inset: '0',
						width: '100%',
						height: '100%',
						display: 'block',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: '0',
						right: '0',
						top: '0',
						height: '100svh',
						pointerEvents: 'none',
					}}
				>
					<div
						data-hint="1"
						className="label"
						style={{
							position: 'absolute',
							top: 'calc(var(--header-bottom) + var(--sp-24))',
							left: 'var(--margin)',
						}}
					>
						{depth.hint}
					</div>
					{depth.captions.map((w, i) => (
						<div
							key={w.label}
							data-dcap={i}
							style={{
								position: 'absolute',
								left: 'var(--margin)',
								right: 'var(--margin)',
								bottom: 'var(--sp-72)',
								display: 'flex',
								flexDirection: 'column',
								gap: 'var(--sp-10)',
								opacity: '0',
							}}
						>
							<span className="label" aria-hidden="true">
								{w.label}
							</span>
							<h3
								style={{
									margin: '0',
									fontFamily: "'Inter Tight','Inter Tight Fallback',sans-serif",
									fontWeight: '600',
									fontSize: 'var(--t-44)',
									lineHeight: 'inherit',
									letterSpacing: '-0.03em',
									overflowWrap: 'break-word',
								}}
							>
								{w.text}
							</h3>
						</div>
					))}
					<div
						className="label"
						aria-hidden="true"
						style={{ position: 'absolute', right: 'var(--margin)', bottom: 'var(--sp-28)' }}
					>
						{depth.counter}
						<span data-depth="1">000</span>
					</div>
				</div>
			</div>
		</section>
	);
}
