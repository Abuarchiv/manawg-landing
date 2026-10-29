import { LanguageLink } from '@/components/LanguageLink';
import { languageAlternates } from '@/lib/locale';
import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'ManaWG privacy policy',
	description:
		'What data ManaWG processes, who it is passed to, how long it is kept and what rights you have.',
	alternates: {
		canonical: '/en/privacy',
		languages: languageAlternates('/datenschutz', '/en/privacy') ?? {},
	},
	// openGraph is not merged with the layout, so it is spelled out in full: og:url would point at the home page otherwise.
	openGraph: {
		title: 'ManaWG privacy policy',
		description:
			'What data ManaWG processes, who it is passed to, how long it is kept and what rights you have.',
		url: '/en/privacy',
		siteName: 'ManaWG',
		locale: 'en_GB',
		type: 'website',
		images: ['/og.png?v=2'],
	},
};

export default function PrivacyPage() {
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
					href="/datenschutz"
					className="float-right inline-flex min-h-[44px] items-center rounded-lg px-3 py-3 font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)] transition-colors hover:text-[var(--text-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
				/>

				<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Privacy policy</h1>
				<p className="text-sm text-[var(--text-3)] mb-8">
					This is a convenience translation. Only the{' '}
					<a href="/datenschutz" hrefLang="de" lang="de" className={TEXT_LINK}>
						German version
					</a>{' '}
					is legally binding.
				</p>

				<div className="prose prose-sm max-w-none text-[var(--text-2)] space-y-6 leading-relaxed [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--accent)] [&_a:focus-visible]:rounded-sm">
					{/* 1. Controller */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">1. Controller</h2>
						<p>Abubakar Abditube</p>
						<p>
							Email:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
						</p>
					</section>

					{/* 2. Data protection officer */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							2. Data protection officer
						</h2>
						<p>
							ManaWG is run privately by Abubakar Abditube. No data protection officer has been
							appointed.
						</p>
					</section>

					{/* 3. Who we are */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">3. Who we are</h2>
						<p>
							ManaWG is an app for shared flats (WGs, or Wohngemeinschaften). We do not sell
							personal data and we do not show ads. For product analytics we send only the details
							described in section 4f to PostHog Cloud EU. The accounts you create to sign in and to
							be a member of your flat are separate from this; section 4a has more on them. The
							app's source code is published as open source under the Apache License 2.0.
						</p>
					</section>

					{/* 4. Processing activities */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							4. Processing activities
						</h2>

						<h3 id="4a" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4a. Account, authentication and local data
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Purpose:</strong> So that contributions can be assigned to your flat
								membership.
							</li>
							<li>
								<strong>Legal basis:</strong> Art. 6(1)(b) GDPR (performance of the contract of use)
							</li>
							<li>
								<strong>Sign-in and local data:</strong> You can sign in with Google or with an
								email address and password. With Google sign-in we receive your email address and
								name from Google. With email sign-in, Supabase sends confirmation emails and
								password-reset emails to your address. Resend delivers them; the sender appears as
								noreply@manawg.com. Supabase Auth manages sign-in, and the session is stored in
								cookies. In addition, flat assignments and name drafts may be held in the browser’s
								local storage.
							</li>
							<li>
								<strong>Retention:</strong> We keep account data until you delete your account under{' '}
								<em>Settings → Access → Delete account</em>. Local flat assignments and name drafts
								stay in the browser until you clear its storage manually.
							</li>
							<li>
								<strong>Recipients and processors:</strong> Supabase for sign-in and database
								hosting; Resend for sending email (see section 5).
							</li>
							<li>
								<strong>Storage location and transfers to third countries:</strong> Supabase stores
								data in Frankfurt am Main (EU). This region setting does not rule out further
								transfers. Resend, Inc. (USA) receives your email address and the message content
								when an email is sent. The transfer relies on EU standard contractual clauses or the
								EU-US Data Privacy Framework.
							</li>
						</ul>

						<h3 id="4b" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4b. Flat data (flat name, memberships, expenses, fixed costs, cleaning rota, shopping
							list, supplies, calendar, noticeboard, chat)
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Purpose:</strong> So that the organisation features of your flat are
								available.
							</li>
							<li>
								<strong>Legal basis:</strong> Art. 6(1)(b) GDPR (performance of the contract of use)
							</li>
							<li>
								<strong>Retention:</strong> Shared flat data is kept for as long as the flat exists.
								When a member leaves the flat, this data is not deleted for that reason. If the flat
								is deleted permanently, we remove the related data from the active database. If you
								delete your account while others stay in the flat, your display name remains on the
								expenses and contributions you recorded, so that the remaining members can keep
								settling up correctly (Art. 6(1)(f) GDPR). The link between these entries and your
								account is removed.
							</li>
							<li>
								<strong>Recipients and processors:</strong> Supabase for database hosting.
							</li>
							<li>
								<strong>Storage location and transfers to third countries:</strong> Supabase stores
								data in Frankfurt am Main (EU). This region setting does not rule out further
								transfers.
							</li>
						</ul>

						<h3 id="4c" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4c. Technical logs and error diagnostics
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Purpose:</strong> For secure, stable operation, troubleshooting and
								protection against misuse.
							</li>
							<li>
								<strong>Legal basis:</strong> Art. 6(1)(f) GDPR (our legitimate interest in secure
								and stable operation).
							</li>
							<li>
								<strong>Retention:</strong> Vercel logs are kept for 30 days at most. If Sentry is
								enabled for the deployment in question, the deletion period for error events depends
								on the applicable Sentry plan.{' '}
								<a
									href="https://docs.sentry.io/security-legal-pii/security/data-retention-periods/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Sentry lists the retention periods for each plan.
								</a>
							</li>
							<li>
								<strong>Recipients:</strong> Vercel Inc. (USA) provides the hosting and processes
								server logs. If Sentry is enabled for an app deployment, Sentry (Functional
								Software, Inc.) receives technical error data, such as error types, stack traces
								(the sequence of code leading up to an error) and approved diagnostic identifiers.
								For ManaWG, the EU is set as the Sentry storage region; this does not rule out
								further transfers. Before anything is sent, variable error messages, user details,
								context data that has not been approved, and request headers and bodies are removed.
								Request paths are cleaned; values from URL queries and fragments, flat codes,
								calendar access tokens and signed file URLs are made unrecognisable. The Sentry
								integration adds neither user details nor automatically detected IP addresses to
								error events. It does not send automatically collected session data or performance
								traces.
							</li>
							<li>
								<strong>Transfer to third countries:</strong> Vercel logs may be routed through
								servers in the USA. EU standard contractual clauses are in place.
							</li>
						</ul>

						<h3 id="4d" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4d. Photo uploads
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Purpose:</strong> So that photos you upload in the flat app (for example for
								the noticeboard or as a receipt) can be stored and displayed.
							</li>
							<li>
								<strong>Legal basis:</strong> Art. 6(1)(b) GDPR (performance of the contract of
								use).
							</li>
							<li>
								<strong>Retention:</strong> Photos in shared flat content stay available to active
								members for as long as that content refers to them. When a member leaves the flat,
								the shared photos are therefore not removed. When the last reference to a photo is
								removed or the flat is deleted, we block access straight away. A later maintenance
								run triggers the physical deletion. We cannot promise a maximum period for final
								deletion or for provider backups.
							</li>
							<li>
								<strong>Recipients and processors:</strong> Supabase stores the photos in non-public
								file storage (see section 5). Only members of the flat can retrieve them.
							</li>
							<li>
								<strong>Storage location and transfers to third countries:</strong> The photos are
								held in the Frankfurt am Main (EU) region. This region setting does not rule out
								further transfers.
							</li>
						</ul>

						<p className="mb-3 text-sm">
							If you start text recognition of a screenshot in the import (OCR), the app loads
							Tesseract worker and core files as well as German and English language models from
							jsDelivr when needed. Recognition runs in your browser. The screenshot and the
							recognised text are not sent to jsDelivr. According to the{' '}
							<a
								href="https://www.jsdelivr.com/terms/privacy-policy"
								target="_blank"
								rel="noopener noreferrer"
							>
								jsDelivr privacy policy
							</a>
							, jsDelivr and its CDN providers may receive technical data when the files are
							retrieved, such as IP address, browser type and version, referring domain, requested
							file URL, time of retrieval, device identifiers and other diagnostic data. If you then
							open the preview or confirm the import, ManaWG sends the recognised data to its own
							import API.
						</p>

						<h3 id="4e" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4e. Rate limiting (protection against misuse)
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Purpose:</strong> To protect against automated requests, password guessing
								(brute force) and other misuse. For this we keep counters per IP address or
								membership ID.
							</li>
							<li>
								<strong>Legal basis:</strong> Art. 6(1)(f) GDPR (our legitimate interest in
								protecting the infrastructure).
							</li>
							<li>
								<strong>Time windows:</strong> The counters run in sliding time windows of one
								minute or one hour.
							</li>
							<li>
								<strong>Retention:</strong> In production, the additional Upstash analytics are
								switched off. The additional analytics metadata stored up to 30 September 2026 was
								deleted on that day; before then it had no automatic expiry. Rate-limit counters
								expire 2 hours and 1 second after they are created at the latest.
							</li>
							<li>
								<strong>Recipients and processors:</strong> Vercel KV / Upstash, Inc. (USA). For
								IP-based limits, the service receives the detected IP address in full, neither
								truncated nor hashed, as a key. For other limits we use membership IDs.
							</li>
						</ul>

						<h3 id="4f" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4f. Product analytics without analytics cookies (PostHog)
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Purpose:</strong> To develop ManaWG further, we record page views and count
								how often a flat is created or someone joins a flat.
							</li>
							<li>
								<strong>Legal basis:</strong> Art. 6(1)(f) GDPR (our legitimate interest in
								developing ManaWG further).
							</li>
							<li>
								<strong>Retention:</strong> On the free PostHog plan currently in use, analytics
								events are kept for one year. You can send deletion requests to info@manawg.com.
							</li>
							<li>
								<strong>Recipients and processors:</strong> PostHog Inc. processes the data via
								PostHog Cloud EU in Frankfurt (eu.i.posthog.com). ManaWG sends only page views and
								the events wg_created and wg_joined. Other events, and extra details passed on by
								app features, are removed before sending. Also sent are an event identifier (UUID),
								the time, the project identifier, a technical assignment identifier, the hostname
								and the browser identifier. The IP address reaches PostHog with the request.
							</li>
							<li>
								<strong>Processing region and transfers to third countries:</strong> PostHog Cloud
								EU in Frankfurt. This region setting does not rule out further transfers.
							</li>
						</ul>
						<p className="mb-3">
							Product analytics runs without analytics cookies and stores nothing in the browser’s
							local storage for this purpose. ManaWG does not build analytics profiles; automatic
							click capture, session recordings and surveys are not enabled. Names, email addresses,
							flat names, flat codes, messages, shopping data and financial data are not sent. For
							its analysis, PostHog may form an identifier that changes daily from the IP address,
							browser identifier and domain. Browser protection features or content blockers can
							prevent the analytics; ManaWG keeps working in that case.
						</p>

						<h3 id="4g" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4g. Push notifications
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Purpose:</strong> So that you receive alerts about new flat events such as
								expenses, tasks or messages if you switch on notifications.
							</li>
							<li>
								<strong>Legal basis:</strong> Art. 6(1)(a) GDPR (your consent, given through the
								browser’s prompt). You can withdraw it at any time in the app settings or in the
								browser.
							</li>
							<li>
								<strong>Data processed:</strong> The push address generated by the browser, its keys
								and the text of the notification.
							</li>
							<li>
								<strong>Retention:</strong> Until you switch off notifications, leave the flat or
								delete your account.
							</li>
							<li>
								<strong>Recipients:</strong> The push service of the browser or operating system
								vendor (for example Google, Apple or Mozilla) delivers the message to your device.
							</li>
							<li>
								<strong>Transfer to third countries:</strong> Possible, because these push services
								may use servers in the USA.
							</li>
						</ul>
					</section>

					{/* 5. Recipients and processors */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							5. Recipients and processors
						</h2>
						<p className="mb-2">
							The following services receive data for the purposes stated in each case:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm">
							<li>
								<strong>Supabase</strong>: manages sign-ins and hosts the Postgres database and the
								file storage for photos in Frankfurt am Main (EU).
							</li>
							<li>
								<strong>Resend, Inc.</strong> (USA): in production, sends the confirmation and
								password-reset emails triggered by Supabase Auth. The sender is noreply@manawg.com
								(see section 4a). The transfer relies on EU standard contractual clauses or the
								EU-US Data Privacy Framework.
							</li>
							<li>
								<strong>Vercel Inc.</strong> (USA): hosts the web app and runs the edge network;
								server logs are generated in the process. A data processing agreement and EU
								standard contractual clauses are in place.
							</li>
							<li>
								<strong>Vercel KV / Upstash, Inc.</strong> (USA): runs the Redis-based counters for
								protection against misuse (per IP address or identifier, see section 4e).
							</li>
							<li>
								<strong>PostHog Inc.</strong>: processes product analytics via PostHog Cloud EU in
								Frankfurt am Main (see section 4f).
							</li>
							<li>
								<strong>Sentry (Functional Software, Inc.)</strong>: investigates technical errors
								if Sentry is enabled for the app deployment in question (see section 4c). See{' '}
								<a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">
									Sentry’s privacy notices
								</a>{' '}
								and the{' '}
								<a href="https://sentry.io/legal/dpa/" target="_blank" rel="noopener noreferrer">
									official Data Processing Addendum
								</a>
								. The Data Processing Addendum (a data processing agreement) was concluded on 30
								September 2026.
							</li>
							<li>
								<strong>jsDelivr and CDN providers</strong>: deliver Tesseract worker, core and
								language files when you explicitly start local OCR (see section 4d).
							</li>
						</ul>
					</section>

					{/* 6. No advertising and no advertising profiles */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							6. No advertising and no advertising profiles
						</h2>
						<p>
							ManaWG contains <strong>no advertising</strong>, <strong>no Google Analytics</strong>{' '}
							and no social media trackers. We do not use data for advertising and we do not track
							you across different websites. The product analytics without analytics cookies
							described in section 4f serves to develop ManaWG further; no analytics profiles are
							created for it. The accounts for sign-in and flat membership are separate from this;
							they are described in section 4a.
						</p>
					</section>

					{/* 7. Cookies & local storage */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							7. Cookies and local browser storage
						</h2>
						<p>
							ManaWG uses cookies for sign-in with Supabase. In addition, flat assignments and name
							drafts may be held in the browser’s local storage (<strong>Local Storage</strong>). If
							you clear the browser storage, this local data is removed as well.
						</p>
					</section>

					{/* 8. Data subject rights */}
					<section>
						<h2 id="rechte" className="text-lg font-semibold text-[var(--text-1)] mb-2">
							8. Your rights (data subject rights)
						</h2>
						<p className="mb-2">You can assert the following rights against us:</p>
						<ul className="list-disc pl-5 space-y-1 text-sm">
							<li>
								<strong>Art. 15 GDPR</strong>: access to the data we hold about you
							</li>
							<li>
								<strong>Art. 16 GDPR</strong>: rectification of inaccurate data
							</li>
							<li>
								<strong>Art. 17 GDPR</strong>: erasure. You can delete your account at any time.
								Choose <em>Settings → Access → Delete account</em>. This removes your sign-in
								details and you leave all flats. Data of a flat in which you are the only member is
								removed from the active database; for the related photos see section{' '}
								<a href="#4d">4d</a>. If other members stay in a flat, your display name remains on
								your earlier contributions (see section <a href="#4b">4b</a>). The person who
								created a flat can remove it irrevocably under{' '}
								<em>Settings → Access → Delete flat permanently</em>. All members, expenses, lists,
								tasks and noticeboard posts of the flat are then removed from the active database.
								Access to the related images is blocked straight away; the physical deletion follows
								later (see section <a href="#4d">4d</a>
								). You can request more extensive deletion by emailing{' '}
								<a href="mailto:info@manawg.com" className="break-all">
									info@manawg.com
								</a>
								.
							</li>
							<li>
								<strong>Art. 18 GDPR</strong>: restriction of processing
							</li>
							<li>
								<strong>Art. 20 GDPR</strong>: data portability
							</li>
							<li>
								<strong>Art. 21 GDPR</strong>: objection to processing based on Art. 6(1)(f) GDPR on
								grounds relating to your particular situation, for example for logs or rate limiting
							</li>
							<li>
								<strong>Art. 77 GDPR</strong>: complaint to the competent supervisory authority:
								<br />
								<strong>
									<span lang="de">
										Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
									</span>{' '}
									(HBDI), the Hessian Commissioner for Data Protection and Freedom of Information
								</strong>
								<br />
								Gustav-Stresemann-Ring 1, 65189 Wiesbaden
								<br />
								<a
									href="https://datenschutz.hessen.de"
									target="_blank"
									rel="noopener noreferrer"
									className="break-all"
								>
									https://datenschutz.hessen.de
								</a>
							</li>
						</ul>
						<p className="mt-2 text-sm">
							Requests to:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
						</p>
						<p className="mt-2 text-sm">
							We will answer your request without undue delay and at the latest within one month.
							For complex requests or a large number of requests, we may extend this period by up to
							two further months. We will tell you about the extension and the reasons for it within
							the first month (Art. 12(3) GDPR). This response period is not a promise that all data
							will be physically deleted within one month; for photos in particular, the description
							in section <a href="#4d">4d</a> applies. Statutory deletion obligations remain
							unaffected.
						</p>
						<p className="mt-2 text-sm">
							Where we process data on the basis of your consent, you can withdraw your consent at
							any time with effect for the future. Withdrawal does not affect the lawfulness of
							processing carried out before it (Art. 7(3) GDPR). For push notifications, see section{' '}
							<a href="#4g">4g</a>.
						</p>
					</section>

					{/* 9. No automated decision-making */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							9. No automated decision-making / profiling
						</h2>
						<p>
							We do not make automated decisions within the meaning of Art. 22 GDPR and we do not
							carry out profiling. We use your data for the purposes described in this policy.
						</p>
					</section>

					{/* 10. Obligation to provide data */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							10. Obligation to provide data
						</h2>
						<p>
							You are neither legally nor contractually obliged to provide personal data (Art.
							13(2)(e) GDPR). However, without signing in with Google or with an email address and
							password, and without a display name, you cannot use the app.
						</p>
					</section>

					{/* 11. Updates */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							11. Updates to this policy
						</h2>
						<p>
							If our data processing changes, we may update this privacy policy. We will tell you
							about material changes by email or in the app.
						</p>
					</section>
				</div>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					<Link href="/en/legal-notice" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Legal notice
					</Link>
					{' · '}
					<Link href="/en/terms" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Terms
					</Link>
				</p>
			</footer>
		</main>
	);
}
