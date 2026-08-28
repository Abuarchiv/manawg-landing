import Link from 'next/link';

const LEGAL_LINKS = [
	{ label: 'Impressum', href: '/impressum' },
	{ label: 'Datenschutz', href: '/datenschutz' },
	{ label: 'AGB', href: '/agb' },
] as const;

export function LandingFooter() {
	return (
		<footer
			className="relative border-t border-[var(--border)] px-5 pt-10"
			style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))' }}
		>
			<div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 text-center">
				<p className="text-[12px] text-[var(--text-3)]">
					© 2026 manawg · DSGVO-konform, Server in Deutschland
				</p>
				<nav aria-label="Rechtliche Links">
					<ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
						{LEGAL_LINKS.map(({ label, href }) => (
							<li key={label}>
								<Link
									href={href}
									className="inline-flex min-h-11 min-w-11 items-center justify-center px-3 py-3 text-[12px] font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:rounded"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
