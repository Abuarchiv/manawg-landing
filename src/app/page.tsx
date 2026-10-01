import { ComparisonTable } from '@/components/landing/comparison-table';
import { FAQ } from '@/components/landing/faq';
import { FAQ_JSON_LD } from '@/components/landing/faq-data';
import { FeatureBento } from '@/components/landing/feature-bento';
import { FinalCta } from '@/components/landing/final-cta';
import { LandingFooter } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { LenisProvider } from '@/components/landing/lenis-provider';
import { ScrollFade } from '@/components/landing/scroll-fade';
import { SiteNav } from '@/components/landing/site-nav';

export default function LandingPage() {
	return (
		<LenisProvider>
			{/* FAQ rich result — static JSON built from local constants, rendered
			    in the initial HTML instead of being injected on the client. */}
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON.stringify of trusted local constants, no user input
				dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
			/>
			<main
				id="main"
				tabIndex={-1}
				className="relative min-h-dvh overflow-x-hidden bg-[var(--bg-base)] text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
			>
				<SiteNav />

				<Hero />

				{/* ─── FEATURES BENTO ─────────────────────────────────────── */}
				<section id="features" className="relative mesh-bg px-5 py-16 md:py-20 lg:py-24">
					<div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1480px]">
						<div className="mx-auto max-w-4xl lg:max-w-5xl text-center">
							<ScrollFade delay={0.1}>
								<h2
									className="heading-grad font-extrabold leading-[0.96] tracking-[-0.045em]"
									style={{
										fontSize: 'clamp(34px, 5vw, 80px)',
									}}
								>
									Fünf Werkzeuge. <span className="text-gradient">Mehr braucht keine WG.</span>
								</h2>
							</ScrollFade>

							<ScrollFade delay={0.2}>
								<p className="mt-6 mx-auto max-w-2xl lg:max-w-3xl text-lg lg:text-xl text-[var(--text-2)] leading-relaxed">
									Fünf Module, die ineinandergreifen. Keine Add-ons, keine Tarif-Stufen, kein
									versteckter Funktionsumfang hinter Paywalls.
								</p>
							</ScrollFade>
						</div>

						<div className="mt-16">
							<FeatureBento />
						</div>
					</div>
				</section>

				{/* ─── COMPARISON ─────────────────────────────────────── */}
				<section id="vergleich" className="relative mesh-bg px-5 py-16 md:py-20 lg:py-24">
					<div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1480px]">
						<div className="mx-auto max-w-4xl lg:max-w-5xl text-center">
							<ScrollFade delay={0.1}>
								<h2
									className="heading-grad font-extrabold leading-[0.96] tracking-[-0.045em]"
									style={{
										fontSize: 'clamp(34px, 5vw, 80px)',
									}}
								>
									ManaWG vs. der Rest.
								</h2>
							</ScrollFade>

							<ScrollFade delay={0.2}>
								<p className="mt-6 mx-auto max-w-2xl lg:max-w-3xl text-lg lg:text-xl text-[var(--text-2)] leading-relaxed">
									Splitwise begrenzt seit 2024 den Free-Plan und zeigt Werbung. Tricount kann nur
									Geld. Wir machen die ganze WG.
								</p>
							</ScrollFade>
						</div>

						<div className="mt-16">
							<ComparisonTable />
						</div>
					</div>
				</section>

				{/* ─── FAQ ─────────────────────────────────────── */}
				<section id="faq" className="relative mesh-bg px-5 py-16 md:py-20 lg:py-24">
					<div className="mx-auto grid max-w-6xl xl:max-w-7xl 2xl:max-w-[1480px] grid-cols-1 gap-16 md:grid-cols-[1fr_1.4fr]">
						<div>
							<ScrollFade delay={0.1}>
								<h2
									className="heading-grad font-extrabold leading-[0.96] tracking-[-0.045em]"
									style={{
										fontSize: 'clamp(34px, 5vw, 80px)',
									}}
								>
									Fragen, die kommen.
								</h2>
							</ScrollFade>

							<ScrollFade delay={0.2}>
								<p className="mt-6 max-w-sm text-base text-[var(--text-2)] leading-relaxed">
									Wir sind erreichbar — auch wenn die Antwort schon hier steht. Schreib uns einfach
									per Mail:{' '}
									<a
										href="mailto:info@manawg.com"
										className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
									>
										info@manawg.com
									</a>
								</p>
							</ScrollFade>
						</div>

						<div>
							<FAQ />
						</div>
					</div>
				</section>

				<FinalCta />

				{/* ─── FOOTER ─────────────────────────────────────── */}
				<LandingFooter />
			</main>
		</LenisProvider>
	);
}
