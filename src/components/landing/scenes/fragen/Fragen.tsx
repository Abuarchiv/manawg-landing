'use client';

import { Fragment, useState } from 'react';
import { css, press } from '../../core/dc';

const FRAGEN: [string, string][] = [
	[
		'Wie kommen meine Mitbewohner dazu?',
		'Du erstellst die WG und teilst den Einladungslink. Wer ihn öffnet, kann beitreten.',
	],
	[
		'Brauche ich eine App aus dem Store?',
		'Nein. ManaWG läuft im Browser unter app.manawg.com und lässt sich auf den Home-Bildschirm installieren.',
	],
	[
		'Wie wird abgerechnet?',
		'Jede Ausgabe wird auf die Personen verteilt, die beteiligt waren. ManaWG zeigt, wer wem wie viel schuldet.',
	],
];

export function Fragen() {
	const [offen, setOffen] = useState(0);
	return (
		<section
			id="fragen"
			data-sec="fragen"
			tabIndex={-1}
			aria-labelledby="fragen-titel"
			style={css(
				'position:relative;background:#0A0A0A;color:#FAFAFA;padding:var(--abschnitt-oben) var(--rand) var(--abschnitt-unten);display:flex;flex-direction:column;gap:var(--sp-48)',
			)}
		>
			<h2 id="fragen-titel" className="label" style={css('margin:0')}>
				[ 08 ] FRAGEN
			</h2>
			<div style={css('display:flex;flex-direction:column;border-bottom:1px solid var(--haar)')}>
				{FRAGEN.map((q, i) => (
					<Fragment key={q[0]}>
						<div
							{...press(() => setOffen((o) => (o === i ? -1 : i)))}
							className="faq-zeile"
							aria-expanded={offen === i}
						>
							<div
								style={css(
									'display:flex;justify-content:space-between;align-items:baseline;gap:var(--sp-24)',
								)}
							>
								<span
									style={css(
										"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-32);letter-spacing:-0.03em;overflow-wrap:break-word;min-width:0",
									)}
								>
									{q[0]}
								</span>
								<span
									style={css(
										"font-family:'JetBrains Mono',monospace;font-size:var(--t-26);font-weight:500",
									)}
								>
									{offen === i ? '−' : '+'}
								</span>
							</div>
							{offen === i && (
								<p
									style={css(
										'margin:0;font-size:var(--t-17);line-height:1.5;opacity:0.72;max-width:var(--w-640)',
									)}
								>
									{q[1]}
								</p>
							)}
						</div>
					</Fragment>
				))}
			</div>
		</section>
	);
}
