import { LegalPage } from '@/components/LegalPage';
import { legalMetadata } from '@/lib/page-metadata';
import { TEXT_LINK } from '@/lib/text-link';

export const metadata = legalMetadata({
	locale: 'en',
	page: 'notice',
	title: 'ManaWG legal notice',
	description:
		'ManaWG legal notice, the free flat-share app: who runs the app and how to get in touch with questions about the app and this website.',
});

export default function LegalNoticePage() {
	return (
		<LegalPage
			locale="en"
			page="notice"
			title="Legal notice"
			intro={
				<>
					<p className="text-sm text-[var(--text-3)] mb-2">Private, non-commercial service</p>
					<p className="text-sm text-[var(--text-3)] mb-8">
						This is a convenience translation. Only the{' '}
						<a href="/impressum" hrefLang="de" lang="de" className={TEXT_LINK}>
							German version
						</a>{' '}
						is legally binding.
					</p>
				</>
			}
		>
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
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Supervisory authority</h2>
				<p>No official licence is required for this service.</p>
			</section>
		</LegalPage>
	);
}
