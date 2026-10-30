import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';
import { legalMetadata } from '@/lib/page-metadata';
import { TEXT_LINK } from '@/lib/text-link';

export const metadata = legalMetadata({
	locale: 'en',
	page: 'terms',
	title: 'ManaWG terms of use',
	description:
		'ManaWG terms of use, the free flat-share app: account, use, flat content, liability, termination and deletion of data.',
});

export default function TermsPage() {
	return (
		<LegalPage
			locale="en"
			page="terms"
			title="Terms of use"
			intro=<p className="text-sm text-(--text-3) mb-8">
				This is a convenience translation. Only the{' '}
				<a href="/agb" hrefLang="de" lang="de" className={TEXT_LINK}>
					German version
				</a>{' '}
				is legally binding.
			</p>
		>
			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">1. Scope</h2>
				<p>
					These terms apply to your use of the ManaWG web app, which helps people organise a shared
					flat (a WG, or Wohngemeinschaft). The operator is Abubakar Abditube. You can reach him at{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>
					.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">2. Services</h2>
				<p>
					ManaWG offers expense tracking, a cleaning rota, a shopping list with supplies, a
					calendar, a noticeboard and a chat. Using it is free. We cannot promise uninterrupted
					availability, data recovery, support or any particular feature.
				</p>
				<p className="mt-2">
					<strong>Use by minors:</strong> If you are under 16, you need the express consent of a
					parent or legal guardian to use ManaWG.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					3. Membership and obligations
				</h2>
				<p>
					You sign in with your Google account or with an email address and a password or a one-time
					email code. You are responsible for the content you post. Protect your device and the
					browser access stored on it against unauthorised use. You must not post unlawful content,
					misuse ManaWG or carry out automated attacks.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">4. Photo uploads</h2>
				<p>
					Only upload photos that you have the necessary rights to. Respect the copyright and
					personality rights of others. We store photos with <strong>Supabase</strong> in Frankfurt
					am Main and make them available only to the members of your flat. How long they are kept
					and how deletion works is explained in section{' '}
					<Link href="/en/privacy#4d">4d of the privacy policy</Link>.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					5. Rights to use your content
				</h2>
				<p>
					You keep all rights to your content, for example noticeboard posts and photos. To run the
					flat, you grant us a simple, non-transferable permission to store, transmit, display and
					technically back up this content, as far as the shared features require. If you leave the
					flat, this permission continues only for content that remains available to the flat under
					section 10 of these terms and sections <Link href="/en/privacy#4b">4b</Link> and{' '}
					<Link href="/en/privacy#4d">4d of the privacy policy</Link>. It ends as soon as the
					content in question is deleted. For the deletion of stored data and photos, the
					information in sections 4b and 4d of the privacy policy applies.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					6. Free use and statutory rights
				</h2>
				<p>
					Using ManaWG is free. Your statutory consumer rights, including any right of withdrawal
					that may apply, remain unaffected. You can end your membership at any time under section
					10.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">7. Liability</h2>
				<p>
					We are fully liable for intent and gross negligence, for injury to life, body or health,
					and under the German Product Liability Act. In cases of simple negligence we are liable
					only if we breach an essential contractual obligation; our liability is then limited to
					the foreseeable damage typical for this kind of contract. To the extent the law allows,
					any further liability is excluded. Do not rely on the app alone for important financial,
					legal or organisational decisions.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">8. Licence / source code</h2>
				<p>
					The source code of ManaWG is published as open-source software under the Apache License
					2.0. Use, distribution and modification of the source code are governed by the terms of
					that licence. Use of the hosted service is governed by these terms.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					9. Reporting unlawful content (DSA Art. 16)
				</h2>
				<p>
					Please report unlawful content to{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>
					. We review every report and remove unlawful content without undue delay.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">10. Termination</h2>
				<p>
					You can end your membership at any time under <em>Settings → Access → Leave flat</em>.
					Your earlier contributions remain available to the flat; you can read more in sections{' '}
					<Link href="/en/privacy#4b">4b</Link> and{' '}
					<Link href="/en/privacy#4d">4d of the privacy policy</Link>.
				</p>
				<p className="mt-2">
					You can delete your account at any time under <em>Settings → Access → Delete account</em>.
					What happens to your data when you do is explained in section{' '}
					<Link href="/en/privacy#rechte">8 of the privacy policy</Link>.
				</p>
				<p className="mt-2">
					The flat’s admin can remove it irrevocably under{' '}
					<em>Settings → Access → Delete flat permanently</em>. The flat’s data is removed from the
					active database. From that moment, images can no longer be retrieved; for the physical
					deletion that follows, see{' '}
					<Link href="/en/privacy#4d">section 4d of the privacy policy</Link>. The admin role can be
					handed over to another active member.
				</p>
				<p className="mt-2">
					You can also ask for data that can be linked to you to be deleted, such as your membership
					ID, your content or photos, by emailing{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>
					. We will answer your request without undue delay and at the latest within one month. For
					complex requests or a large number of requests, we may extend this period by up to two
					further months; we will tell you the reasons within the first month (Art. 12(3) GDPR; see
					also section <Link href="/en/privacy#rechte">8 of the privacy policy</Link>
					). This response period does not guarantee that photos are physically deleted within one
					month; see section <Link href="/en/privacy#4d">4d</Link>. Statutory deletion obligations
					remain unaffected.
				</p>
				<p className="mt-2">
					If these terms are breached, we may block or delete memberships or flats.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">11. Changes</h2>
				<p>
					We may change these terms for an objective reason, for example when features, hosting or
					legal requirements change, and only within the limits the law allows. We will tell you
					about material changes in the app or on the website. If a change needs your consent, we
					will ask for it expressly; continuing to use ManaWG does not count as consent on its own.
					If you do not agree to a change, you can stop using ManaWG and, under section 10, have
					your membership or flat deleted. Your statutory rights remain unaffected.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">12. Governing law</h2>
				<p>
					German law applies; the UN Convention on Contracts for the International Sale of Goods is
					excluded.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					13. Consumer dispute resolution
				</h2>
				<p>
					We are neither obliged nor willing to take part in dispute resolution proceedings before a
					consumer arbitration board (§ 36(1) no. 1 VSBG, the German Consumer Dispute Resolution
					Act).
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">14. Severability</h2>
				<p>
					If any provision of these terms is invalid, the remaining provisions are unaffected. The
					invalid provision is replaced by the statutory rule.
				</p>
			</section>
		</LegalPage>
	);
}
