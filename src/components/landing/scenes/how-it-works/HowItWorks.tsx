'use client';

import { useEffect, useRef } from 'react';
import { useDict } from '../../dict';
import { registerDigit } from '../how-it-works/digits';
import s from './HowItWorks.module.css';

function Digit({ text }: { text: string }) {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => registerDigit(ref.current as HTMLCanvasElement, { text }), [text]);
	return <canvas ref={ref} aria-hidden="true" className={s.digit} />;
}

export function HowItWorks() {
	const { howItWorks } = useDict();
	return (
		<section
			id="so-gehts"
			data-sec="so-gehts"
			tabIndex={-1}
			aria-labelledby="so-gehts-titel"
			className={s.section}
		>
			<h2 id="so-gehts-titel" className={`label ${s.title}`} data-entschluesseln="">
				<span aria-hidden="true">{howItWorks.prefix}</span>
				{howItWorks.title}
			</h2>
			<div className={s.columns}>
				{howItWorks.steps.map((x) => (
					<div key={x.number} className={s.column}>
						<Digit text={x.number} />
						<h3 className={s.h3}>{x.title}</h3>
						<p className={s.text}>{x.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}
