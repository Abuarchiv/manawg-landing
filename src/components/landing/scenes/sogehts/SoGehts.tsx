'use client';

import { useEffect, useRef } from 'react';
import { useDict } from '../../dict';
import s from './SoGehts.module.css';
import { registerZiffer } from './ziffern';

function Ziffer({ text }: { text: string }) {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => registerZiffer(ref.current as HTMLCanvasElement, { text }), [text]);
	return <canvas ref={ref} aria-hidden="true" className={s.ziffer} />;
}

export function SoGehts() {
	const { howItWorks } = useDict();
	return (
		<section
			id="so-gehts"
			data-sec="so-gehts"
			tabIndex={-1}
			aria-labelledby="so-gehts-titel"
			className={s.sektion}
		>
			<h2 id="so-gehts-titel" className={`label ${s.titel}`} data-entschluesseln="">
				<span aria-hidden="true">{howItWorks.prefix}</span>
				{howItWorks.title}
			</h2>
			<div className={s.raster}>
				{howItWorks.steps.map((x) => (
					<div key={x.number} className={s.spalte}>
						<Ziffer text={x.number} />
						<h3 className={s.h3}>{x.title}</h3>
						<p className={s.text}>{x.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}
