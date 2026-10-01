import { ScrollFade } from '@/components/landing/scroll-fade';
import { appUrl } from '@/lib/app-origin';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
	return (
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
	);
}
