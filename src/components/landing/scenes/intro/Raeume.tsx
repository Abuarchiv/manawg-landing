import { Fragment } from 'react';
import { css } from '../../core/dc';

// Die vier Raumkarten der Wohnung. Jede Karte blendet über --c0..3 ein und aus (wohnung.karten).

const KARTEN = [
	{
		nr: '01 / 04',
		raum: 'KÜCHE',
		titel: 'Einkäufe & Vorräte',
		text: 'Eine Liste für alle. Wer einkauft, hakt ab, der Vorrat zählt mit.',
		zeile: 'Hafermilch',
		detail: '2 Packungen · von Mika',
		betrag: '',
	},
	{
		nr: '02 / 04',
		raum: 'WOHNZIMMER',
		titel: 'Ausgaben & Fixkosten',
		text: 'Jede Ausgabe in unter zehn Sekunden erfasst. Die Salden rechnet ManaWG.',
		zeile: 'Pizzaabend',
		detail: 'Mika bezahlt · durch 4',
		betrag: '28,40 €',
	},
	{
		nr: '03 / 04',
		raum: 'BAD',
		titel: 'Putzplan',
		text: 'Aufgaben rotieren von selbst. Die App erinnert, sie mahnt nicht.',
		zeile: 'Bad ist heute dran.',
		detail: 'Lea · heute',
		betrag: '',
	},
	{
		nr: '04 / 04',
		raum: 'FLUR',
		titel: 'Pinnwand & Chat',
		text: 'Absprachen an einem Ort statt in drei Chats und auf Zetteln.',
		zeile: 'Übergabe am Freitag',
		detail: 'Jona · Schlüssel liegen im Flur',
		betrag: '',
	},
];

export function Raeume() {
	return (
		<section
			data-loch="text"
			aria-label="Die Wohnung"
			style={css(
				'position:absolute;left:var(--rand);top:var(--sp-150);width:var(--w-440);height:var(--h-520);pointer-events:none;color:#FAFAFA',
			)}
		>
			{KARTEN.map((k, j) => (
				<Fragment key={k.nr}>
					<div
						style={css(
							`position:absolute;inset:0;display:flex;flex-direction:column;gap:var(--sp-20);opacity:var(--c${j},0);transform:translateY(calc((1 - var(--c${j},0)) * 40px));filter:blur(calc((1 - var(--c${j},0)) * 6px))`,
						)}
					>
						<div
							className="label"
							style={css('display:flex;align-items:baseline;gap:var(--sp-16);opacity:1')}
						>
							<span>{k.nr}</span>
							<span style={css('opacity:0.72')}>{k.raum}</span>
						</div>
						<div className="haar" />
						<h2
							style={css(
								"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-64);line-height:0.94;letter-spacing:-0.045em",
							)}
						>
							{k.titel}
						</h2>
						<p
							style={css(
								'margin:0;font-size:var(--t-17);line-height:1.5;color:rgba(250,250,250,0.72);max-width:var(--w-380);text-wrap:pretty',
							)}
						>
							{k.text}
						</p>
						<div
							style={css(
								'display:flex;align-items:center;justify-content:space-between;gap:var(--sp-16);border-top:1px solid var(--haar);border-bottom:1px solid var(--haar);padding:var(--sp-14) 0;margin-top:8px',
							)}
						>
							<div style={css('display:flex;flex-direction:column;gap:4px')}>
								<span style={css('font-size:var(--t-15);font-weight:500')}>{k.zeile}</span>
								<span style={css('font-size:var(--t-13);color:rgba(250,250,250,0.72)')}>
									{k.detail}
								</span>
							</div>
							<span
								style={css(
									"font-family:'JetBrains Mono',monospace;font-size:var(--t-15);font-weight:500",
								)}
							>
								{k.betrag}
							</span>
						</div>
					</div>
				</Fragment>
			))}
		</section>
	);
}
