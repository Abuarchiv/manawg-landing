import { css } from '../../core/dc';
import { BrLines, useDict } from '../../dict';
import s from './HeroTitel.module.css';

// Titel der Intro: Sternenfeld (sterne.ts) und die Überschrift der Seite. Voll bis P 0,04, null bei
// P 0,086 (T-09: Plateau statt sofortigem Verblassen).

export function HeroTitel() {
	const { hero } = useDict();
	return (
		<div
			style={css(
				'position:absolute;inset:0;z-index:2;pointer-events:none;opacity:calc(1.9 - var(--p,0) * 22)',
			)}
		>
			<canvas
				data-sterne="1"
				aria-hidden="true"
				style={css(
					'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none',
				)}
			/>
			<div className={s.titel}>
				<h1 className={s.h1}>
					<BrLines lines={hero.title} />
				</h1>
				<p className={s.unter}>{hero.sub}</p>
			</div>
		</div>
	);
}
