import { appUrl } from '@/lib/app-origin';
import Link from 'next/link';
import { GRUPPEN } from './gruppen';
import { THEMEN } from './themen';

// Kopf und Fußzeile der Text-Seiten (Themen, Ratgeber, Ratgeber-Übersicht).
export const mono = 'font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)]';
export const rand = 'px-5 md:px-8 lg:px-16 mx-auto w-full max-w-[1440px]';

export function Kopf() {
	return (
		<header
			className={`${rand} flex items-center justify-between pt-[max(1.25rem,env(safe-area-inset-top))] pb-6`}
		>
			{/* Kein Prefetch: die Startseite bringt ~100 KB Szenen-JS mit, das Textseiten nicht vorladen sollen. */}
			<Link
				href="/"
				prefetch={false}
				aria-label="ManaWG, zur Startseite"
				className="inline-flex items-center gap-3 min-h-[44px] no-underline"
			>
				<img
					src="/manawg-mark-weiss-80.webp"
					alt=""
					width={416}
					height={346}
					className="h-5 w-auto"
				/>
				<span className="font-[family-name:'Inter_Tight'] text-[17px] font-semibold tracking-[-0.03em]">
					ManaWG
				</span>
			</Link>
			<a
				href={appUrl('/registrieren?action=create')}
				className="font-mono text-[12px] text-[var(--text-3)] min-h-[44px] inline-flex items-center"
			>
				App öffnen
			</a>
		</header>
	);
}

export function Fuss({ aktiv }: { aktiv?: string }) {
	return (
		<footer
			className={`${rand} linie mt-24 md:mt-32 pt-12 pb-[max(2rem,env(safe-area-inset-bottom))]`}
		>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
				{GRUPPEN.map((g) => (
					<nav key={g.name} aria-label={g.name}>
						<p className={`${mono} m-0 mb-4`}>
							{g.name === 'Ratgeber' ? <Link href="/ratgeber">Ratgeber</Link> : g.name}
						</p>
						<ul className="list-none m-0 p-0 flex flex-col">
							{g.slugs.map((slug) => (
								<li key={slug}>
									<Link
										href={`/${slug}`}
										aria-current={slug === aktiv ? 'page' : undefined}
										className="inline-block py-[7px] text-[14px] text-[var(--text-2)] no-underline hover:text-[#fafafa] aria-[current=page]:text-[#fafafa]"
									>
										{THEMEN[slug]?.link}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>
			<p className={`${mono} mt-12 mb-0 flex flex-wrap gap-x-5`}>
				<span>ManaWG, 2026</span>
				<Link href="/impressum">Impressum</Link>
				<Link href="/datenschutz">Datenschutz</Link>
				<Link href="/agb">AGB</Link>
			</p>
		</footer>
	);
}
