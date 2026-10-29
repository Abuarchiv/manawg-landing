import { LanguageLink } from '@/components/LanguageLink';
import { languageAlternates } from '@/lib/locale';
import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Impressum von ManaWG',
	description:
		'Impressum von ManaWG, der kostenlosen WG-App: wer die App betreibt und wie ihr bei Fragen zur App und zu dieser Website Kontakt aufnehmt.',
	alternates: {
		canonical: '/impressum',
		languages: languageAlternates('/impressum', '/en/legal-notice') ?? {},
	},
	// openGraph wird nicht mit dem Layout gemischt, daher vollständig: og:url zeigte sonst auf die Startseite.
	openGraph: {
		title: 'Impressum von ManaWG',
		description:
			'Impressum von ManaWG, der kostenlosen WG-App: wer die App betreibt und wie ihr bei Fragen zur App und zu dieser Website Kontakt aufnehmt.',
		url: '/impressum',
		siteName: 'ManaWG',
		locale: 'de_DE',
		type: 'website',
		images: ['/og.png?v=2'],
	},
};

export default function ImpressumPage() {
	return (
		<main id="main" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
			<div className="flex-1 max-w-2xl mx-auto w-full box-border px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
				<Link
					href="/"
					prefetch={false}
					className="inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-2)] mb-8 -ml-2 px-3 py-3 min-h-[44px] rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
					aria-label="Zur Startseite"
				>
					<ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
					Zur Startseite
				</Link>
				<LanguageLink
					to="en"
					href="/en/legal-notice"
					className="float-right inline-flex min-h-[44px] items-center rounded-lg px-3 py-3 font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)] transition-colors hover:text-[var(--text-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
				/>

				<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Impressum</h1>
				<p className="text-sm text-[var(--text-3)] mb-8">Privates, nicht-kommerzielles Angebot</p>

				<div className="prose prose-sm max-w-none text-[var(--text-2)] space-y-6 leading-relaxed [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--accent)] [&_a:focus-visible]:rounded-sm">
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Betreiber</h2>
						<p>Abubakar Abditube</p>
						<p className="mt-2 text-[var(--text-3)]">ManaWG wird privat und kostenlos betrieben.</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Kontakt</h2>
						<p>
							E-Mail:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Umsatzsteuer-ID</h2>
						<p>Eine Umsatzsteuer-Identifikationsnummer ist nicht vorhanden.</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Aufsichtsbehörde</h2>
						<p>Für diesen Dienst ist keine behördliche Erlaubnis erforderlich.</p>
					</section>
				</div>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					<Link href="/agb" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Nutzungsbedingungen
					</Link>
					{' · '}
					<Link href="/datenschutz" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Datenschutz
					</Link>
				</p>
			</footer>
		</main>
	);
}
