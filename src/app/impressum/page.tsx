import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Impressum — ManaWG',
	description:
		'Kontaktdaten und Anbieterinformationen für ManaWG. Privat und kostenlos betrieben von Abubakar Abditube, Frankfurt am Main.',
	alternates: { canonical: '/impressum' },
};

export default function ImpressumPage() {
	return (
		<main id="main" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
			<div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-2)] mb-8 -ml-2 px-3 py-3 min-h-[44px] rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
					aria-label="Zurück zur Startseite"
				>
					<ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
					Zurück
				</Link>

				<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Impressum</h1>
				<p className="text-sm text-[var(--text-3)] mb-8">
					Angaben gemäß § 5 DDG / § 18 MStV — Stand: 19. Mai 2026
				</p>

				<div className="prose prose-sm max-w-none text-[var(--text-2)] space-y-6 leading-relaxed [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--accent)] [&_a:focus-visible]:rounded-sm">
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Betreiber</h2>
						<p>Abubakar Abditube</p>
						<p className="mt-2 text-[var(--text-3)]">
							ManaWG wird privat und kostenlos betrieben. Es gibt keine Werbung, keine Investoren,
							keinen Verkauf von Daten und kein kostenpflichtiges Angebot.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Anschrift</h2>
						<p>Kurt-Schumacher-Straße 2</p>
						<p>60311 Frankfurt am Main</p>
						<p>Hessen</p>
						<p>Deutschland</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Kontakt</h2>
						<p>
							E-Mail:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
						</p>
						<p className="mt-2 text-[var(--text-3)]">
							Du erreichst uns unter der angegebenen E-Mail-Adresse. Da ManaWG privat betrieben
							wird, können wir nicht immer sofort antworten.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Umsatzsteuer-ID</h2>
						<p>
							Nicht vorhanden. ManaWG wird kostenlos und nicht als entgeltlicher kommerzieller
							Dienst betrieben.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Aufsichtsbehörde</h2>
						<p>
							Nicht erlaubnispflichtig — kein Erlaubnisvorbehalt für diesen Dienst erforderlich.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							Verantwortlich gemäß § 18 Abs. 2 MStV
						</h2>
						<p>Abubakar Abditube</p>
						<p>Kurt-Schumacher-Straße 2</p>
						<p>60311 Frankfurt am Main</p>
						<p>Deutschland</p>
					</section>
				</div>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					<Link href="/agb" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						AGB
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
