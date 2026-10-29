import { LanguageLink } from '@/components/LanguageLink';
import { appUrl } from '@/lib/app-origin';
import { type Locale, TOPIC_SLUG_EN, localiseHref } from '@/lib/locale';
import Link from 'next/link';
import { GROUPS } from './groups';
import { groupName, topics, ui } from './registry';

// Header and footer of the text pages (topics, guides, guide index).
export const mono = 'font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)]';
export const gutter = 'px-5 md:px-8 lg:px-16 mx-auto w-full max-w-[1440px]';

export function TopicHeader({ locale }: { locale: Locale }) {
	const t = ui(locale);
	return (
		<header
			className={`${gutter} flex items-center justify-between pt-[max(1.25rem,env(safe-area-inset-top))] pb-6`}
		>
			{/* No prefetch: the home page brings ~100 KB of scene JS that text pages should not preload. */}
			<Link
				href={localiseHref(locale, '/')}
				prefetch={false}
				aria-label={t.homeLabel}
				className="inline-flex items-center gap-3 min-h-[44px] no-underline"
			>
				<img
					src="/manawg-mark-weiss-80.webp"
					alt=""
					width={416}
					height={346}
					className="h-5 w-auto"
				/>
				<span className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] text-[17px] font-semibold tracking-[-0.03em]">
					ManaWG
				</span>
			</Link>
			<a
				href={appUrl(locale === 'de' ? '/registrieren?action=create' : '/signup?action=create')}
				className="font-mono text-[12px] text-[var(--text-3)] min-h-[44px] inline-flex items-center"
			>
				{t.openApp}
			</a>
		</header>
	);
}

const LEGAL_PATHS: Record<Locale, [notice: string, privacy: string, terms: string]> = {
	de: ['/impressum', '/datenschutz', '/agb'],
	en: ['/en/legal-notice', '/en/privacy', '/en/terms'],
};

/** Footer. `counterpart` is this page's path in the other language; without it no language link shows. */
export function TopicFooter({
	locale,
	active,
	counterpart,
}: { locale: Locale; active?: string; counterpart?: string | null }) {
	const t = ui(locale);
	const data = topics(locale);
	const [notice, privacy, terms] = LEGAL_PATHS[locale];
	const localSlug = (slug: string) => (locale === 'de' ? slug : TOPIC_SLUG_EN[slug]);
	return (
		<footer
			className={`${gutter} linie mt-24 md:mt-32 pt-12 pb-[max(2rem,env(safe-area-inset-bottom))]`}
		>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
				{GROUPS.map((g) => {
					// Slugs without data in this language are skipped; a group left empty is dropped.
					const slugs = g.slugs.map(localSlug).filter((s): s is string => !!s && s in data);
					if (slugs.length === 0) return null;
					const name = groupName(locale, g.id);
					return (
						<nav key={g.id} aria-label={name}>
							<p className={`${mono} m-0 mb-4`}>
								{g.id === 'guides' ? (
									<Link href={locale === 'de' ? '/ratgeber' : '/en/guides'} prefetch={false}>
										{name}
									</Link>
								) : (
									name
								)}
							</p>
							<ul className="list-none m-0 p-0 flex flex-col">
								{slugs.map((slug) => (
									<li key={slug}>
										<Link
											href={localiseHref(locale, `/${slug}`)}
											prefetch={false}
											aria-current={slug === active ? 'page' : undefined}
											className="inline-block py-[7px] text-[14px] text-[var(--text-2)] no-underline hover:text-[#fafafa] aria-[current=page]:text-[#fafafa]"
										>
											{data[slug]?.link}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					);
				})}
			</div>
			<p className={`${mono} mt-12 mb-0 flex flex-wrap gap-x-5`}>
				<span>{t.footerNote}</span>
				<Link href={notice} prefetch={false}>
					{t.legal.notice}
				</Link>
				<Link href={privacy} prefetch={false}>
					{t.legal.privacy}
				</Link>
				<Link href={terms} prefetch={false}>
					{t.legal.terms}
				</Link>
				{counterpart && <LanguageLink to={locale === 'de' ? 'en' : 'de'} href={counterpart} />}
			</p>
		</footer>
	);
}
