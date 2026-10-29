import { LanguageLink } from '@/components/LanguageLink';
import type { Locale } from '@/lib/locale';
import { LEGAL_PAGES, type LegalPageId } from '@/lib/page-metadata';
import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

const HOME: Record<Locale, { href: string; label: string }> = {
	de: { href: '/', label: 'Zur Startseite' },
	en: { href: '/en', label: 'Back to home' },
};

const FOCUS_RING =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

/** Frame of the legal pages: back link, language switch, title, optional intro, text and links to the other two pages. */
export function LegalPage({
	locale,
	page,
	title,
	intro,
	children,
}: {
	locale: Locale;
	page: LegalPageId;
	title: string;
	/** Lines between the title and the text (status, note on the binding version). */
	intro?: ReactNode;
	children: ReactNode;
}) {
	const other: Locale = locale === 'de' ? 'en' : 'de';
	const home = HOME[locale];
	const siblings = (Object.keys(LEGAL_PAGES) as LegalPageId[]).filter((id) => id !== page);
	return (
		<main id="main" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
			<div className="flex-1 max-w-2xl mx-auto w-full box-border px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
				<Link
					href={home.href}
					prefetch={false}
					className={`inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-2)] mb-8 -ml-2 px-3 py-3 min-h-[44px] rounded-lg hover:bg-[rgb(var(--ink-rgb)/0.04)] transition-colors ${FOCUS_RING}`}
					aria-label={home.label}
				>
					<ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
					{home.label}
				</Link>
				<LanguageLink
					to={other}
					href={LEGAL_PAGES[page][other].path}
					className={`float-right inline-flex min-h-[44px] items-center rounded-lg px-3 py-3 font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)] transition-colors hover:text-[var(--text-2)] ${FOCUS_RING}`}
				/>

				<h1 className={`text-2xl font-bold text-[var(--text-1)] ${intro ? 'mb-2' : 'mb-8'}`}>
					{title}
				</h1>
				{intro}

				<div className="prose prose-sm max-w-none text-[var(--text-2)] space-y-6 leading-relaxed [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--accent)] [&_a:focus-visible]:rounded-sm">
					{children}
				</div>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					{siblings.map((id, i) => (
						<Fragment key={id}>
							{i > 0 && ' · '}
							<Link
								href={LEGAL_PAGES[id][locale].path}
								className={`${TEXT_LINK} inline-block px-2 py-3.5`}
							>
								{LEGAL_PAGES[id][locale].name}
							</Link>
						</Fragment>
					))}
				</p>
			</footer>
		</main>
	);
}
