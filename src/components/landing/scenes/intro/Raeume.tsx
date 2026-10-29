import { css } from '../../core/dc';
import { useDict } from '../../dict';
import st from './Raeume.module.css';

// Die vier Raumkarten der Wohnung. Jede Karte blendet über --c0..3 ein und aus (wohnung.karten).

export function Raeume() {
	const { rooms, aria } = useDict();
	return (
		<section data-loch="text" aria-label={aria.flat} className={st.spalte}>
			{rooms.map((k, j) => (
				<div
					key={k.number}
					className={st.karte}
					style={css(
						`opacity:var(--c${j},0);transform:translateY(calc((1 - var(--c${j},0)) * var(--sp-20) * 2));clip-path:inset(0 0 calc((1 - var(--c${j},0)) * 100%) 0)`,
					)}
				>
					<div className={`label ${st.kopf}`} style={css('opacity:1')}>
						<span>{k.number}</span>
						<span style={css('opacity:0.72')}>{k.room}</span>
					</div>
					<div className="haar" />
					<h2 className={st.titel}>{k.title}</h2>
					<p className={st.text}>{k.text}</p>
					<div className={st.zeile}>
						<div style={css('display:flex;flex-direction:column;gap:4px')}>
							<span className={st.name}>{k.rowTitle}</span>
							<span className={st.detail}>{k.rowSub}</span>
						</div>
						<span className={st.betrag}>{k.amount}</span>
					</div>
				</div>
			))}
		</section>
	);
}
