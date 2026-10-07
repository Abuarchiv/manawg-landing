import { css } from '../../core/dc';

// Titel der Intro: Sternenfeld (sterne.js) und die Überschrift der Seite. Blendet mit --p aus.

export function HeroTitel() {
	return (
		<div
			style={css(
				'position:absolute;inset:0;z-index:2;pointer-events:none;opacity:calc(1 - var(--p,0) * 14)',
			)}
		>
			<canvas
				data-sterne="1"
				aria-hidden="true"
				style={css(
					'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none',
				)}
			/>
			<div
				style={css(
					'position:absolute;left:var(--rand);bottom:var(--sp-64);display:flex;flex-direction:column;gap:var(--sp-12);color:#FAFAFA',
				)}
			>
				<h1
					style={css(
						"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-80);line-height:0.92;letter-spacing:-0.05em",
					)}
				>
					Die App
					<br />
					für eure WG.
				</h1>
			</div>
		</div>
	);
}
