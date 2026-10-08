'use client';

import { useState } from 'react';
import { css } from '../../core/dc';
import { StichGrund } from '../stichgrund/StichGrund';

const FRAGEN: [string, string][] = [
	[
		'Wie kommen meine Mitbewohner in die WG?',
		'Du erstellst die WG und teilst den Einladungslink. Wer ihn öffnet, kann beitreten.',
	],
	[
		'Brauche ich eine App aus dem Store?',
		'Nein. ManaWG läuft im Browser unter app.manawg.com und lässt sich auf den Home-Bildschirm installieren.',
	],
	['Was kostet ManaWG?', 'Nichts. ManaWG ist kostenlos.'],
	[
		'Wie wird abgerechnet?',
		'Jede Ausgabe wird auf die Personen verteilt, die beteiligt waren. ManaWG zeigt, wer wem wie viel schuldet.',
	],
];

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
				'position:relative;isolation:isolate;background:#0A0A0A;color:#FAFAFA;padding:var(--abschnitt-oben) var(--rand) var(--abschnitt-unten);display:flex;flex-direction:column;gap:var(--sp-48)',
			)}
		>
			<StichGrund
				frei=":scope > h2, :scope > div"
				puls={offen}
				ziel={(r) => {
					// Breit: der Schein sitzt rechts auf Höhe der offenen Antwort. Schmal: unter der Liste, wo kein Text steht
					const sec = document.getElementById('fragen');
					const _liste = sec?.lastElementChild?.getBoundingClientRect();
					const o = sec?.querySelector('.faq-antwort[data-offen="true"]')?.parentElement;
					const b = o?.getBoundingClientRect();
					// Schmal: kleiner und leiser, damit zwischen den Textzeilen wenig Linie steht
					if (r.width < 700)
						return {
							x: r.width * 0.78,
							y: b ? b.top + b.height / 2 - r.top : r.height * 0.5,
							rx: r.width * 0.55,
							ry: 150,
							a: 0.55,
						};
					return {
						x: r.width * 0.8,
						y: b ? b.top + b.height / 2 - r.top : r.height * 0.55,
						rx: Math.max(240, r.width * 0.3),
						ry: 200,
					};
				}}
			/>
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
