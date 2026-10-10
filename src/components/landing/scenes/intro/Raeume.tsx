import { css } from '../../core/dc';
import st from './Raeume.module.css';

// Die vier Raumkarten der Wohnung. Jede Karte blendet über --c0..3 ein und aus (wohnung.karten).

const KARTEN = [
	{
		nr: '01 / 04',
		raum: 'KÜCHE',
		titel: 'Einkäufe & Vorräte',
		text: 'Eine Liste für alle. Wer einkauft, hakt ab, der Vorrat zählt mit.',
		zeile: 'Hafermilch',
		detail: '2 Packungen · von Mika',
		betrag: '',
	},
	{
		nr: '02 / 04',
		raum: 'WOHNZIMMER',
		titel: 'Ausgaben & Fixkosten',
		text: 'Jede Ausgabe in unter zehn Sekunden erfasst. Die Salden rechnet ManaWG.',
		zeile: 'Pizzaabend',
		detail: 'Mika bezahlt · durch 4',
		betrag: '28,40 €',
	},
	{
		nr: '03 / 04',
		raum: 'BAD',
		titel: 'Putzplan',
		text: 'Aufgaben rotieren von selbst. Die App erinnert, sie mahnt nicht.',
		zeile: 'Bad ist heute dran.',
		detail: 'Lea · heute',
		betrag: '',
	},
	{
		nr: '04 / 04',
		raum: 'FLUR',
		titel: 'Pinnwand & Chat',
		text: 'Absprachen an einem Ort statt in drei Chats und auf Zetteln.',
		zeile: 'Übergabe am Freitag',
		detail: 'Jona · Schlüssel liegen im Flur',
		betrag: '',
	},
];

export function Raeume() {
	return (
		<section data-loch="text" aria-label="Die Wohnung" className={st.spalte}>
			{KARTEN.map((k, j) => (
				<div
					key={k.nr}
					className={st.karte}
					style={css(
						`opacity:var(--c${j},0);transform:translateY(calc((1 - var(--c${j},0)) * var(--sp-20) * 2));filter:blur(calc((1 - var(--c${j},0)) * 6px))`,
					)}
				>
					<div className={`label ${st.kopf}`} style={css('opacity:1')}>
						<span>{k.nr}</span>
						<span style={css('opacity:0.72')}>{k.raum}</span>
					</div>
					<div className="haar" />
					<h2 className={st.titel}>{k.titel}</h2>
					<p className={st.text}>{k.text}</p>
					<div className={st.zeile}>
						<div style={css('display:flex;flex-direction:column;gap:4px')}>
							<span className={st.name}>{k.zeile}</span>
							<span className={st.detail}>{k.detail}</span>
						</div>
						<span className={st.betrag}>{k.betrag}</span>
					</div>
				</div>
			))}
		</section>
	);
}
