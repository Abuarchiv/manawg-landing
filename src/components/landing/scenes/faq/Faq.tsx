'use client';

import { useState } from 'react';
import { useDict } from '../../dict';

// Accordion: one button per question with aria-expanded and aria-controls, the answer is a region.
// The height runs via grid-template-rows (landing.css .faq-answer), only one answer is open.

export function Faq() {
	const { faq, questions } = useDict();
	const [openIndex, setOpenIndex] = useState(0);
	return (
		<section
			id="fragen"
			data-sec="fragen"
			tabIndex={-1}
			aria-labelledby="faq-title"
			style={{
				position: 'relative',
				background: 'var(--paper)',
				color: 'var(--ink)',
				padding: 'var(--section-top) var(--margin) var(--section-bottom)',
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--sp-48)',
			}}
		>
			<h2 id="faq-title" className="label" style={{ margin: '0' }}>
				<span aria-hidden="true">{questions.prefix}</span>
				{questions.title}
			</h2>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					borderBottom: '1px solid var(--hairline)',
				}}
			>
				{faq.map((q, i) => (
					<div key={q[0]} className="faq-row">
						<h3 style={{ margin: '0', fontSize: 'inherit', fontWeight: 'inherit' }}>
							<button
								type="button"
								id={`faq-frage-${i}`}
								className="faq-question"
								aria-expanded={openIndex === i}
								aria-controls={`faq-antwort-${i}`}
								onClick={() => setOpenIndex((o) => (o === i ? -1 : i))}
							>
								<span>
									<span className="label faq-num" aria-hidden="true">
										{String(i + 1).padStart(2, '0')}
									</span>
									{q[0]}
								</span>
								<span className="faq-mark" aria-hidden="true">
									<i />
									<i />
								</span>
							</button>
						</h3>
						<section
							id={`faq-antwort-${i}`}
							aria-labelledby={`faq-frage-${i}`}
							className="faq-answer"
							data-open={openIndex === i}
						>
							<div className="faq-inner">
								<p>{q[1]}</p>
							</div>
						</section>
					</div>
				))}
			</div>
		</section>
	);
}
