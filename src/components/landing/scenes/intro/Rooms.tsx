import { css } from '../../core/dc';
import { useDict } from '../../dict';
import st from './Rooms.module.css';

// The four room cards of the flat. Each card fades in and out via --c0..3 (flat scene cards).

export function Rooms() {
	const { rooms, aria } = useDict();
	return (
		<section data-loch="text" aria-label={aria.flat} className={st.column}>
			{rooms.map((k, j) => (
				<div
					key={k.number}
					className={st.card}
					style={css(
						`opacity:var(--c${j},0);transform:translateY(calc((1 - var(--c${j},0)) * var(--sp-20) * 2));clip-path:inset(0 0 calc((1 - var(--c${j},0)) * 100%) 0)`,
					)}
				>
					<div className={`label ${st.head}`} style={css('opacity:1')}>
						<span>{k.number}</span>
						<span style={css('opacity:0.72')}>{k.room}</span>
					</div>
					<div className="haar" />
					<h2 className={st.title}>{k.title}</h2>
					<p className={st.text}>{k.text}</p>
					<div className={st.row}>
						<div style={css('display:flex;flex-direction:column;gap:4px')}>
							<span className={st.name}>{k.rowTitle}</span>
							<span className={st.detail}>{k.rowSub}</span>
						</div>
						<span className={st.amount}>{k.amount}</span>
					</div>
				</div>
			))}
		</section>
	);
}
