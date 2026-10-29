import { LegalPage } from '@/components/LegalPage';
import { legalMetadata } from '@/lib/legal-metadata';

export const metadata = legalMetadata({
	locale: 'de',
	page: 'notice',
	title: 'Impressum von ManaWG',
	description:
		'Impressum von ManaWG, der kostenlosen WG-App: wer die App betreibt und wie ihr bei Fragen zur App und zu dieser Website Kontakt aufnehmt.',
});

export default function LegalNoticePage() {
	return (
		<LegalPage
			locale="de"
			page="notice"
			title="Impressum"
			intro=<p className="text-sm text-[var(--text-3)] mb-8">
				Privates, nicht-kommerzielles Angebot
			</p>
		>
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
		</LegalPage>
	);
}
