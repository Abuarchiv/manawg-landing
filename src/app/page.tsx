import { ComparisonTable } from '@/components/landing/comparison-table';
import { FAQ } from '@/components/landing/faq';
import { FAQ_JSON_LD } from '@/components/landing/faq-data';
import { FeatureBento } from '@/components/landing/feature-bento';
import { LandingFooter } from '@/components/landing/footer';
import { Hero3DMount } from '@/components/landing/hero-3d-mount';
import { LenisProvider } from '@/components/landing/lenis-provider';
import { MobileNav } from '@/components/landing/mobile-nav';
import { ScrollFade } from '@/components/landing/scroll-fade';
import { Wordmark } from '@/components/ui/Wordmark';
import { appUrl } from '@/lib/app-origin';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// craftsman-ignore: TS002 — Next.js App Router requires default export for pages
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
				{/* ─── NAV ─────────────────────────────────────────── */}
				<nav
					aria-label="Hauptnavigation"
					className="fixed inset-x-0 top-0 z-50 px-4"
					style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
				>
					<div className="mx-auto flex max-w-7xl items-center justify-between rounded-full glass-strong px-5 py-3">
						<Link
							href="/"
							aria-label="manawg — Startseite"
							className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
						>
							<Wordmark />
						</Link>

						<div className="hidden items-center gap-8 md:flex">
							<a
								href="#features"
								className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] px-2 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
							>
								Features
							</a>
							<a
								href="#vergleich"
								className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] px-2 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
							>
								Vergleich
							</a>
							<a
								href="#faq"
								className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] px-2 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
							>
								FAQ
							</a>
						</div>

						<div className="flex items-center gap-2 md:hidden">
							<MobileNav />
						</div>
					</div>
				</nav>

				{/* ─── HERO ─────────────────────────────────────────── */}
				<section className="relative mesh-bg spotlight min-h-[88dvh] overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
					{/* grid backdrop */}
					<div className="absolute inset-0 grid-pattern grid-mask opacity-50" aria-hidden />

					{/* 3D scene — client-only, gated by prefers-reduced-motion. */}
					<div className="absolute inset-0 z-0">
						<Hero3DMount />
					</div>

					{/* aurora blob — desktop only, dark-mode only */}
					<div
						className="absolute left-1/2 top-1/3 -z-0 hidden dark:sm:block h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-30 animate-aurora motion-reduce:animate-none motion-reduce:opacity-20"
						style={{
							background:
								'radial-gradient(circle, rgba(132,225,188,0.4) 0%, rgba(74,125,101,0.22) 40%, transparent 70%)',
							filter: 'blur(80px)',
						}}
						aria-hidden
					/>

					{/* ── Hero content — fluid scale, wider on desktop ── */}
					<div className="relative z-10 mx-auto max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1480px] px-5 pt-16 md:pt-24">
						<div className="flex flex-col items-center text-center">
							{/* headline */}
							<ScrollFade delay={0.1}>
								<p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--text-2)]">
									Die WG-App
								</p>
								<h1
									className="heading-grad font-extrabold leading-[0.94] tracking-[-0.04em]"
									style={{
										fontSize: 'clamp(44px, 6.8vw, 104px)',
									}}
								>
									<span className="block">Finanzen teilen.</span>
									<span className="block">
										<span className="text-gradient">Vertrauen sparen.</span>
									</span>
								</h1>
							</ScrollFade>

							{/* subhead */}
							<ScrollFade delay={0.25}>
								<p className="mt-7 max-w-md sm:max-w-lg md:max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-[var(--text-2)]">
									Ausgaben, Putzplan, Einkaufsliste, Pinnwand — ein Tab für die ganze WG.
									<br className="hidden sm:block" />
									<span className="sm:hidden"> </span>
									Mit Google oder E-Mail anmelden, dauerhaft kostenlos.
								</p>
							</ScrollFade>

							{/* Trust badge — DSGVO / Social Login / EU servers */}
							<ScrollFade delay={0.32}>
								<p className="mt-4 max-w-md text-xs text-[var(--text-3)]">
									DSGVO-konform · Server in Deutschland
								</p>
							</ScrollFade>

							{/* CTA row */}
							<ScrollFade delay={0.4}>
								<div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
									<a
										href={appUrl('/neu?action=create')}
										className="btn-modern w-full justify-center min-h-12 sm:w-auto"
									>
										WG in 30 Sek erstellen
										<ArrowRight className="h-4 w-4" aria-hidden="true" />
									</a>
								</div>
							</ScrollFade>
						</div>
					</div>
				</section>

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

				{/* ─── FINAL CTA ─────────────────────────────────────── */}
				<section className="relative overflow-hidden px-5 py-20 md:py-28">
					<div className="mesh-bg spotlight absolute inset-0 -z-10" aria-hidden />
					<div
						className="absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full hidden dark:block dark:opacity-40 animate-aurora motion-reduce:animate-none dark:motion-reduce:opacity-20"
						style={{
							background:
								'radial-gradient(circle, rgba(132,225,188,0.5), rgba(74,125,101,0.25) 45%, transparent 75%)',
							filter: 'blur(60px)',
						}}
						aria-hidden
					/>

					<div className="relative mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-[1280px] text-center">
						<ScrollFade delay={0.1}>
							<h2
								className="heading-grad font-extrabold leading-[0.96] tracking-[-0.045em]"
								style={{
									fontSize: 'clamp(36px, 5.4vw, 88px)',
								}}
							>
								<span className="block">Bereit für</span>
								<span className="block">
									<span className="text-gradient">deine WG?</span>
								</span>
							</h2>
						</ScrollFade>

						<ScrollFade delay={0.3}>
							<p className="mx-auto mt-8 max-w-lg text-lg text-[var(--text-2)] leading-relaxed">
								Mit Google oder E-Mail anmelden, deinen Namen wählen, Code teilen — fertig.
							</p>
						</ScrollFade>

						<ScrollFade delay={0.55}>
							<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
								<a href={appUrl('/neu?action=create')} className="btn-modern text-base">
									WG in 30 Sek erstellen
									<ArrowRight className="h-4 w-4" aria-hidden="true" />
								</a>
							</div>
						</ScrollFade>
					</div>
				</section>

				{/* ─── FOOTER ─────────────────────────────────────── */}
				<LandingFooter />
			</main>
		</LenisProvider>
	);
}
