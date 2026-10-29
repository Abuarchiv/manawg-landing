import { LanguageLink } from '@/components/LanguageLink';
import { languageAlternates } from '@/lib/locale';
import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Legal notice of ManaWG',
	description:
		'Legal notice of ManaWG, the free flat-share app: who runs the app and how to get in touch with questions about the app and this website.',
	alternates: {
		canonical: '/en/legal-notice',
		languages: languageAlternates('/impressum', '/en/legal-notice') ?? {},
	},
	// openGraph is not merged with the layout, so it is spelled out in full: og:url would point at the home page otherwise.
	openGraph: {
		title: 'Legal notice of ManaWG',
		description:
			'Legal notice of ManaWG, the free flat-share app: who runs the app and how to get in touch with questions about the app and this website.',
		url: '/en/legal-notice',
		siteName: 'ManaWG',
		locale: 'en_GB',
		type: 'website',
		images: ['/og.png?v=2'],
	},
};

export default function LegalNoticePage() {
	return (
		<main id="main" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
			<div className="flex-1 max-w-2xl mx-auto w-full box-border px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
				<Link
					href="/en"
					prefetch={false}
					className="inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-2)] mb-8 -ml-2 px-3 py-3 min-h-[44px] rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
					aria-label="Back to home"
				>
					<ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
					Back to home
				</Link>
				<LanguageLink
					to="de"
					href="/impressum"
					className="float-right inline-flex min-h-[44px] items-center rounded-lg px-3 py-3 font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)] transition-colors hover:text-[var(--text-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
				/>

				<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Legal notice</h1>
				<p className="text-sm text-[var(--text-3)] mb-2">Private, non-commercial service</p>
				<p className="text-sm text-[var(--text-3)] mb-8">
					This is a convenience translation. Only the{' '}
					<a href="/impressum" hrefLang="de" lang="de" className={TEXT_LINK}>
						German version
					</a>{' '}
					is legally binding.
				</p>

				<div className="prose prose-sm max-w-none text-[var(--text-2)] space-y-6 leading-relaxed [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--accent)] [&_a:focus-visible]:rounded-sm">
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Operator</h2>
						<p>Abubakar Abditube</p>
						<p className="mt-2 text-[var(--text-3)]">ManaWG is run privately and is free to use.</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Contact</h2>
						<p>
							Email:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">VAT ID</h2>
						<p>There is no VAT identification number.</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							Supervisory authority
						</h2>
						<p>No official licence is required for this service.</p>
					</section>
				</div>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					<Link href="/en/terms" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Terms of use
					</Link>
					{' · '}
					<Link href="/en/privacy" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Privacy policy
					</Link>
				</p>
			</footer>
		</main>
	);
}
