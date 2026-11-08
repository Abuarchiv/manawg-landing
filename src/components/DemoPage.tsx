import Link from 'next/link';
import { LanguageLink } from '@/components/LanguageLink';
import { appUrl } from '@/lib/app-origin';
import type { Locale } from '@/lib/locale';

const TEXT = {
	de: {
		home: '/',
		frame: '/app-demo/index.html',
		other: '/en/demo',
		note: 'Beispieldaten',
		cta: 'WG erstellen',
		frameTitle: 'ManaWG-Demo mit Beispieldaten',
	},
	en: {
		home: '/en',
		frame: '/app-demo-en/index.html',
		other: '/demo',
		note: 'Sample data',
		cta: 'Create your flat',
		frameTitle: 'ManaWG demo with sample data',
	},
} as const;

const LINK =
	'inline-flex min-h-[44px] items-center whitespace-nowrap px-2 text-[12px] text-(--text-3) hover:text-(--text-2)';

/** The app on sample data, without an account: the recorded app in public/app-demo, in a phone-sized frame. */
export function DemoPage({ locale }: { locale: Locale }) {
	const t = TEXT[locale];
	return (
		<main id="main" className="flex h-dvh flex-col items-center">
			<header className="box-border flex w-full max-w-[430px] flex-none items-center justify-between gap-2 px-2">
				<Link href={t.home} prefetch={false} className={`${LINK} font-semibold text-(--text-1)`}>
					ManaWG
				</Link>
				<p className="min-w-0 truncate text-[12px] text-(--text-3)">{t.note}</p>
				<LanguageLink to={locale === 'de' ? 'en' : 'de'} href={t.other} className={LINK} />
				{/* Solid pill, the one primary action of the page; ::after keeps the 44 px touch target around the 32 px pill. */}
				<a
					href={appUrl('/signup?action=create')}
					data-cta="demo_create"
					className="relative inline-flex h-8 flex-none items-center whitespace-nowrap rounded-full bg-(--ink) px-2.5 text-[12px] font-semibold text-(--paper) no-underline after:absolute after:inset-x-0 after:-inset-y-[6px] after:content-['']"
				>
					{t.cta}
				</a>
			</header>
			<iframe
				src={t.frame}
				title={t.frameTitle}
				className="box-border min-h-0 w-full max-w-[430px] flex-1 border-0 md:mb-4 md:rounded-[28px] md:border md:border-(--text-3)"
			/>
		</main>
	);
}
