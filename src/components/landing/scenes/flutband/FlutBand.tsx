import { css } from '../../core/dc';

// Flut-Band zwischen Intro und "So geht's": 3 Zeilen aus weißen Zellen und Ziffern, dekorativ.

const FLUT =
	'##5#####5###################4###3#3#####4#####5########44##5#5##5####45#313##6#42#433223#44#43211222122222333#211_1223#2';
const CELL =
	"display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:rgba(250,250,250,0.6)";

export function FlutBand() {
	return (
		<div
			id="flutband"
			data-sec="flutband"
			aria-hidden="true"
			style={css('background:#0A0A0A;overflow:hidden')}
		>
			<div
				style={css(
					'display:grid;grid-template-columns:repeat(40,32px);grid-auto-rows:32px;width:1280px',
				)}
			>
				{[...FLUT].map((c, i) =>
					c === '#' ? (
						<div key={i} style={css('background:#FAFAFA')} />
					) : (
						<div key={i} style={css(CELL)}>
							{c === '_' ? '' : c}
						</div>
					),
				)}
			</div>
		</div>
	);
}
