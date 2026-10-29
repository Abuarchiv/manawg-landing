import { LanguageLink } from '@/components/LanguageLink';
import { appUrl } from '@/lib/app-origin';
import { css } from '../../core/dc';
import { useDict, useLocale } from '../../dict';
import s from './Fusszeile.module.css';

// Kurz gehalten: alle Themenseiten erreicht man über /ratgeber und die Sitemap.
export function Fusszeile() {
	const { footer, links } = useDict();
	const locale = useLocale();
	return (
		<footer id="fusszeile" data-sec="fusszeile" tabIndex={-1} className={s.fuss}>
			<div className={s.raster}>
				<div className={s.marke}>
					<span style={css('font-size:var(--t-14);opacity:0.72')}>{footer.tagline}</span>
					<span className="label" style={css('margin-top:var(--sp-32)')}>
						{footer.copyright}
					</span>
					{/* Counterpart of this page in the other language: a plain link, quiet, outside the design's composition */}
					<LanguageLink
						to={locale === 'de' ? 'en' : 'de'}
						href={links.other}
						label={footer.language}
						className="label"
						style={css('margin-top:var(--sp-12)')}
					/>
				</div>
				<div className={s.spalte}>
					<span className={s.kopf}>{footer.product}</span>
					<a href="#funktionen" className="fuss-link">
						{footer.features}
					</a>
					<a href="#so-gehts" className="fuss-link">
						{footer.howItWorks}
					</a>
					<a href="#fragen" className="fuss-link">
						{footer.questions}
					</a>
					<a href={links.guides} className="fuss-link">
						{footer.guides}
					</a>
				</div>
				<div className={s.spalte}>
					<span className={s.kopf}>{footer.account}</span>
					<a href={appUrl(links.create)} className="fuss-link">
						{footer.create}
					</a>
					<a href={appUrl(links.inviteFooter)} className="fuss-link">
						{footer.invite}
					</a>
					<a href={appUrl(links.login)} className="fuss-link">
						{footer.login}
					</a>
				</div>
				<div className={s.spalte}>
					<span className={s.kopf}>{footer.legal}</span>
					<a href={links.legalNotice} className="fuss-link">
						{footer.legalNotice}
					</a>
					<a href={links.privacy} className="fuss-link">
						{footer.privacy}
					</a>
					<a href={links.terms} className="fuss-link">
						{footer.terms}
					</a>
				</div>
			</div>
		</footer>
	);
}
