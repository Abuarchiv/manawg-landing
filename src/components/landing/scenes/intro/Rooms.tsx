import { useDict } from '../../dict';
import s from './Rooms.module.css';

// The four room cards of the flat. Each card fades in and out via --c0..3 (flat scene cards).

export function Rooms() {
	const { rooms, aria } = useDict();
	return (
		<section data-hole="text" aria-label={aria.flat} className={s.column}>
			{rooms.map((k, j) => (
				<div
					key={k.number}
					className={s.card}
					style={{
						opacity: `var(--c${j},0)`,
						transform: `translateY(calc((1 - var(--c${j},0)) * var(--sp-20) * 2))`,
						clipPath: `inset(0 0 calc((1 - var(--c${j},0)) * 100%) 0)`,
					}}
				>
					<div className={`label ${s.head}`} style={{ opacity: '1' }}>
						<span>{k.number}</span>
						<span style={{ opacity: '0.72' }}>{k.room}</span>
					</div>
					<div className="hairline" />
					<h2 className={s.title}>{k.title}</h2>
					<p className={s.text}>{k.text}</p>
					<div className={s.row}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
							<span className={s.name}>{k.rowTitle}</span>
							<span className={s.detail}>{k.rowSub}</span>
						</div>
						<span className={s.amount}>{k.amount}</span>
					</div>
				</div>
			))}
		</section>
	);
}
