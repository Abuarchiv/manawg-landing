import { useDict } from '../../dict';
import st from './Rooms.module.css';

// The four room cards of the flat. Each card fades in and out via --c0..3 (flat scene cards).

export function Rooms() {
	const { rooms, aria } = useDict();
	return (
		<section data-hole="text" aria-label={aria.flat} className={st.column}>
			{rooms.map((k, j) => (
				<div
					key={k.number}
					className={st.card}
					style={{
						opacity: `var(--c${j},0)`,
						transform: `translateY(calc((1 - var(--c${j},0)) * var(--sp-20) * 2))`,
						clipPath: `inset(0 0 calc((1 - var(--c${j},0)) * 100%) 0)`,
					}}
				>
					<div className={`label ${st.head}`} style={{ opacity: '1' }}>
						<span>{k.number}</span>
						<span style={{ opacity: '0.72' }}>{k.room}</span>
					</div>
					<div className="hairline" />
					<h2 className={st.title}>{k.title}</h2>
					<p className={st.text}>{k.text}</p>
					<div className={st.row}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
