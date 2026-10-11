'use client';

import { useState } from 'react';
import { css } from '../../core/dc';
import { FRAGEN } from './fragenDaten';

// Akkordeon: je Frage ein Knopf mit aria-expanded und aria-controls, die Antwort ist eine Region.
// Die Höhe läuft über grid-template-rows (landing.css .faq-antwort), nur eine Antwort ist offen.
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
				<span aria-hidden="true">[ 08 ] </span>FRAGEN
			</h2>
			<div style={css('display:flex;flex-direction:column;border-bottom:1px solid var(--haar)')}>
				{FRAGEN.map((q, i) => (
					<div key={q[0]} className="faq-zeile">
						<h3 style={css('margin:0;font-size:inherit;font-weight:inherit')}>
							<button
								type="button"
								id={`faq-frage-${i}`}
								className="faq-frage"
								aria-expanded={offen === i}
								aria-controls={`faq-antwort-${i}`}
								onClick={() => setOffen((o) => (o === i ? -1 : i))}
							>
								<span>{q[0]}</span>
								<span className="faq-marke" aria-hidden="true">
									<i />
									<i />
								</span>
							</button>
						</h3>
						<section
							id={`faq-antwort-${i}`}
							aria-labelledby={`faq-frage-${i}`}
							className="faq-antwort"
							data-offen={offen === i}
						>
							<div className="faq-innen">
								<p>{q[1]}</p>
							</div>
						</section>
					</div>
				))}
			</div>
		</section>
	);
}
