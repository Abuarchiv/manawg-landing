import { appUrl } from '@/lib/app-origin';
import { BrLines, useDict } from '../../dict';
import { HeroDemo } from './HeroDemo';
import s from './HeroTitle.module.css';

// Title of the intro: star field (stars.ts), the demo film (HeroDemo.tsx) and the page heading. Full until P 0.04, zero at
// P 0.086 (a plateau instead of an immediate fade).

export function HeroTitle() {
	const { hero, links } = useDict();
	return (
		<div
			style={{
				position: 'absolute',
				inset: '0',
				zIndex: '2',
				pointerEvents: 'none',
				opacity: 'calc(1.9 - var(--p,0) * 22)',
			}}
		>
			<canvas
				data-stars="1"
				aria-hidden="true"
				style={{
					position: 'absolute',
					inset: '0',
					width: '100%',
					height: '100%',
					display: 'block',
					pointerEvents: 'none',
				}}
			/>
			<HeroDemo />
			<div className={s.title}>
				<h1 className={s.h1}>
					<BrLines lines={hero.title} />
				</h1>
				<p className={s.sub}>{hero.sub}</p>
				<p className={s.trust}>
					<a href={links.openSource} data-hero-cta="">
						{hero.trust.openSource}
					</a>
					{hero.trust.rest}
				</p>
				{/* Sign-up in the app, then the install guide for all platforms on the app topic page; stage.ts makes
				    the links inert once the title has faded */}
				<div className={s.actions}>
					<a
						href={appUrl(links.create)}
						data-hero-cta=""
						data-cta="hero_create"
						className="cta cta--solid"
					>
						{hero.create}
					</a>
					<a
						href={links.install}
						data-hero-cta=""
						data-cta="hero_install"
						className="cta cta--dark"
					>
						{hero.install}
					</a>
				</div>
			</div>
		</div>
	);
}
