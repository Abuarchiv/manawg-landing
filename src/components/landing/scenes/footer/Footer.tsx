import { LanguageLink } from '@/components/LanguageLink';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { appUrl } from '@/lib/app-origin';
import { useDict, useLocale } from '../../dict';
import s from './Footer.module.css';

// Kept short: all topic pages are reachable via /ratgeber and the sitemap.
export function Footer() {
	const { footer, links } = useDict();
	const locale = useLocale();
	return (
		<footer id="fusszeile" data-sec="fusszeile" tabIndex={-1} className={s.foot}>
			<div className={s.columns}>
				<div className={s.brand}>
					<span style={{ fontSize: 'var(--t-14)', opacity: '0.72' }}>{footer.tagline}</span>
					<span className="label" style={{ marginTop: 'var(--sp-32)' }}>
						{footer.copyright}
					</span>
					{/* Counterpart of this page in the other language: a plain link, quiet, outside the design's composition */}
					<LanguageLink
						to={locale === 'de' ? 'en' : 'de'}
						href={links.other}
						label={footer.language}
						className={`label ${s.language}`}
						style={{ marginTop: 'calc(var(--sp-12) - 5px)' }}
					/>
					<ThemeSwitch locale={locale} className={`label ${s.theme}`} />
				</div>
				<div className={s.column}>
					<span className={s.head}>{footer.product}</span>
					<a href="#funktionen" className="footer-link">
						{footer.features}
					</a>
					<a href="#so-gehts" className="footer-link">
						{footer.howItWorks}
					</a>
					<a href="#fragen" className="footer-link">
						{footer.questions}
					</a>
					<a href={links.guides} className="footer-link">
						{footer.guides}
					</a>
				</div>
				<div className={s.column}>
					<span className={s.head}>{footer.account}</span>
					<a href={appUrl(links.create)} className="footer-link">
						{footer.create}
					</a>
					<a href={appUrl(links.inviteFooter)} className="footer-link">
						{footer.invite}
					</a>
					<a href={appUrl(links.login)} className="footer-link">
						{footer.login}
					</a>
				</div>
				<div className={s.column}>
					<span className={s.head}>{footer.legal}</span>
					<a href={links.legalNotice} className="footer-link">
						{footer.legalNotice}
					</a>
					<a href={links.privacy} className="footer-link">
						{footer.privacy}
					</a>
					<a href={links.terms} className="footer-link">
						{footer.terms}
					</a>
				</div>
			</div>
		</footer>
	);
}
