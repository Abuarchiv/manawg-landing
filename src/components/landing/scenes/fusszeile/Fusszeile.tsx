import { appUrl } from '@/lib/app-origin';
import { css } from '../../core/dc';
import s from './Fusszeile.module.css';

// Kurz gehalten: alle Themenseiten erreicht man über /ratgeber und die Sitemap.
export function Fusszeile() {
	return (
		<footer id="fusszeile" data-sec="fusszeile" tabIndex={-1} className={s.fuss}>
			<div className={s.raster}>
				<div className={s.marke}>
					<span style={css('font-size:var(--t-14);opacity:0.72')}>
						ManaWG, die App für den WG-Alltag.
					</span>
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
					<a href="/ratgeber" className="fuss-link">
						Ratgeber
					</a>
				</div>
				<div className={s.spalte}>
					<span className={s.kopf}>Konto</span>
					<a href={appUrl('/registrieren?action=create')} className="fuss-link">
						WG erstellen
					</a>
					<a href={appUrl('/registrieren')} className="fuss-link">
						Einladung einlösen
					</a>
					<a href={appUrl('/neu')} className="fuss-link">
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
