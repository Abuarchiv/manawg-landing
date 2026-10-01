import { Hero3DMount } from '@/components/landing/hero-3d-mount';
import { ScrollFade } from '@/components/landing/scroll-fade';
import { appUrl } from '@/lib/app-origin';
import { ArrowRight } from 'lucide-react';

export function Hero() {
	return (
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
	);
}
