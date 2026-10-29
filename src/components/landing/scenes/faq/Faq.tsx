'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '../../core/dc';
import { GLYPHS } from '../../core/decode';
import { useDict } from '../../dict';

// Accordion: one button per question with aria-expanded and aria-controls, the answer is a region.
// The height runs via grid-template-rows (landing.css .faq-antwort), only one answer is open.

const FRONT_WIDTH = 10; // width of the decryption front in characters

/** The answer decrypts from front to back when opened; the rest stays invisibly reserved so nothing reflows. */
function Answer({ text, open }: { text: string; open: boolean }) {
	const [revealed, setRevealed] = useState(text.length);
	const first = useRef(true);
	useEffect(() => {
		// on first render (first question open) and with reduced motion the text appears immediately
		if (first.current || !open || matchMedia('(prefers-reduced-motion: reduce)').matches) {
			first.current = false;
			setRevealed(text.length);
			return;
		}
		let raf = 0;
		const t0 = performance.now();
		const f = (now: number) => {
			const n = Math.min(text.length, Math.round(((now - t0) / 650) * text.length));
			setRevealed(n);
			if (n < text.length) raf = requestAnimationFrame(f);
		};
		setRevealed(0);
		raf = requestAnimationFrame(f);
		return () => cancelAnimationFrame(raf);
	}, [open, text]);
	if (revealed >= text.length) return <p>{text}</p>;
	const front = [...text.slice(revealed, revealed + FRONT_WIDTH)]
		.map((c) => (c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
		.join('');
	return (
		<p>
			<span className="faq-sr">{text}</span>
			<span aria-hidden="true">
				{text.slice(0, revealed)}
				<span className="faq-kopf">{front}</span>
				<span style={css('visibility:hidden')}>{text.slice(revealed + FRONT_WIDTH)}</span>
			</span>
		</p>
	);
}

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
			<h2 id="fragen-titel" className="label" style={css('margin:0')} data-entschluesseln="">
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
								<Answer text={q[1]} open={openIndex === i} />
							</div>
						</section>
					</div>
				))}
			</div>
		</section>
	);
}
