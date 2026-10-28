'use client';

import { useEffect, useRef } from 'react';
import s from './SoGehts.module.css';
import { registerZiffer } from './ziffern';

const SCHRITTE = [
	{ z: '01', titel: 'WG erstellen', text: 'Namen eingeben. Mehr braucht es nicht.' },
	{ z: '02', titel: 'Einladen', text: 'Link teilen, die anderen treten bei.' },
	{ z: '03', titel: 'Eintragen', text: 'Erste Ausgabe, erster Einkauf, erster Putztermin.' },
];

function Ziffer({ text }: { text: string }) {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => registerZiffer(ref.current as HTMLCanvasElement, { text }), [text]);
	return <canvas ref={ref} aria-hidden="true" className={s.ziffer} />;
}

export function SoGehts() {
	return (
		<section
			id="so-gehts"
			data-sec="so-gehts"
			tabIndex={-1}
			aria-labelledby="so-gehts-titel"
			className={s.sektion}
		>
			<h2 id="so-gehts-titel" className={`label ${s.titel}`} data-entschluesseln="">
				<span aria-hidden="true">[ 05 ] </span>SO GEHT’S
			</h2>
			<div className={s.raster}>
				{SCHRITTE.map((x) => (
					<div key={x.z} className={s.spalte}>
						<Ziffer text={x.z} />
						<h3 className={s.h3}>{x.titel}</h3>
						<p className={s.text}>{x.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}
