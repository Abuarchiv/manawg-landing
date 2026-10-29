'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '../../core/dc';
import { GLYPHS } from '../../core/decode';
import { useDict } from '../../dict';

// Akkordeon: je Frage ein Knopf mit aria-expanded und aria-controls, die Antwort ist eine Region.
// Die Höhe läuft über grid-template-rows (landing.css .faq-antwort), nur eine Antwort ist offen.

const KOPF = 10; // Breite der Entschlüsselungs-Front in Zeichen

/** Antwort entschlüsselt sich beim Öffnen von vorn nach hinten; der Rest bleibt unsichtbar reserviert, damit nichts umbricht. */
function Antwort({ text, an }: { text: string; an: boolean }) {
	const [k, setK] = useState(text.length);
	const erst = useRef(true);
	useEffect(() => {
		// beim ersten Rendern (erste Frage offen) und bei reduzierter Bewegung steht der Text sofort
		if (erst.current || !an || matchMedia('(prefers-reduced-motion: reduce)').matches) {
			erst.current = false;
			setK(text.length);
			return;
		}
		let raf = 0;
		const t0 = performance.now();
		const f = (now: number) => {
			const n = Math.min(text.length, Math.round(((now - t0) / 650) * text.length));
			setK(n);
			if (n < text.length) raf = requestAnimationFrame(f);
		};
		setK(0);
		raf = requestAnimationFrame(f);
		return () => cancelAnimationFrame(raf);
	}, [an, text]);
	if (k >= text.length) return <p>{text}</p>;
	const kopf = [...text.slice(k, k + KOPF)]
		.map((c) => (c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
		.join('');
	return (
		<p>
			<span className="faq-sr">{text}</span>
			<span aria-hidden="true">
				{text.slice(0, k)}
				<span className="faq-kopf">{kopf}</span>
				<span style={css('visibility:hidden')}>{text.slice(k + KOPF)}</span>
			</span>
		</p>
	);
}

export function Fragen() {
	const { faq, questions } = useDict();
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
			<h2 id="fragen-titel" className="label" style={css('margin:0')} data-entschluesseln="">
				<span aria-hidden="true">{questions.prefix}</span>
				{questions.title}
			</h2>
			<div style={css('display:flex;flex-direction:column;border-bottom:1px solid var(--haar)')}>
				{faq.map((q, i) => (
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
								<span>
									<span className="label faq-nr" aria-hidden="true">
										{String(i + 1).padStart(2, '0')}
									</span>
									{q[0]}
								</span>
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
								<Antwort text={q[1]} an={offen === i} />
							</div>
						</section>
					</div>
				))}
			</div>
		</section>
	);
}
