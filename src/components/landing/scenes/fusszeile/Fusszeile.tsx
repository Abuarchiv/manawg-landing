import { THEMEN } from '@/app/[thema]/themen';
import { appUrl } from '@/lib/app-origin';
import { css } from '../../core/dc';
import s from './Fusszeile.module.css';

export function Fusszeile() {
	return (
		<footer id="fusszeile" data-sec="fusszeile" tabIndex={-1} className={s.fuss}>
			<div className={s.raster}>
				<div className={s.marke}>
					<div style={css('display:flex;align-items:center;gap:var(--sp-10)')}>
						<img
							src="/manawg-mark-weiss.png"
							alt=""
							width={416}
							height={346}
							style={css('height:20px;width:auto')}
						/>
						<span
							style={css(
								"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-19);letter-spacing:-0.03em",
							)}
						>
							ManaWG
						</span>
					</div>
					<span style={css('font-size:var(--t-14);opacity:0.72')}>Die App für den WG-Alltag.</span>
					<span className="label" style={css('margin-top:var(--sp-32)')}>
						© 2026 MANAWG
					</span>
				</div>
				<div className={s.spalte}>
					<span className={s.kopf}>Produkt</span>
					<a href="#funktionen" className="fuss-link">
						Funktionen
					</a>
					<a href="#so-gehts" className="fuss-link">
						So geht’s
					</a>
					<a href="#fragen" className="fuss-link">
						Fragen
					</a>
					{Object.entries(THEMEN).map(([slug, t]) => (
						<a key={slug} href={`/${slug}`} className="fuss-link">
							{t.link}
						</a>
					))}
				</div>
				<div className={s.spalte}>
					<span className={s.kopf}>Konto</span>
					<a href={appUrl('/neu?action=create')} className="fuss-link">
						WG erstellen
					</a>
					<a href={appUrl('/neu')} className="fuss-link">
						Einladung einlösen
					</a>
					<a href={appUrl('/')} className="fuss-link">
						Anmelden
					</a>
				</div>
				<div className={s.spalte}>
					<span className={s.kopf}>Rechtliches</span>
					<a href="/impressum" className="fuss-link">
						Impressum
					</a>
					<a href="/datenschutz" className="fuss-link">
						Datenschutz
					</a>
					<a href="/agb" className="fuss-link">
						AGB
					</a>
				</div>
			</div>
		</footer>
	);
}
