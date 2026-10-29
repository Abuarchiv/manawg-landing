'use client';

import { useState } from 'react';
import { css } from '../../core/dc';
import { useDict } from '../../dict';

// Accordion: one button per question with aria-expanded and aria-controls, the answer is a region.
// The height runs via grid-template-rows (landing.css .faq-antwort), only one answer is open.

export function Faq() {
	const { faq, questions } = useDict();
	const [openIndex, setOpenIndex] = useState(0);
	return (
		<section
			id="fragen"
			data-sec="fragen"
			tabIndex={-1}
			aria-labelledby="fragen-titel"
			style={css(
				'position:relative;background:#0A0A0A;color:#FAFAFA;padding:var(--section-top) var(--margin) var(--section-bottom);display:flex;flex-direction:column;gap:var(--sp-48)',
			)}
		>
			<h2 id="fragen-titel" className="label" style={css('margin:0')}>
				<span aria-hidden="true">{questions.prefix}</span>
				{questions.title}
			</h2>
			<div
				style={css('display:flex;flex-direction:column;border-bottom:1px solid var(--hairline)')}
			>
				{faq.map((q, i) => (
					<div key={q[0]} className="faq-zeile">
						<h3 style={css('margin:0;font-size:inherit;font-weight:inherit')}>
							<button
								type="button"
								id={`faq-frage-${i}`}
								className="faq-frage"
								aria-expanded={openIndex === i}
								aria-controls={`faq-antwort-${i}`}
								onClick={() => setOpenIndex((o) => (o === i ? -1 : i))}
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
							data-offen={openIndex === i}
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
