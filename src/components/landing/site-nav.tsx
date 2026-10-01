import { MobileNav } from '@/components/landing/mobile-nav';
import { Wordmark } from '@/components/ui/wordmark';
import Link from 'next/link';

export function SiteNav() {
	return (
		<nav
			aria-label="Hauptnavigation"
			className="fixed inset-x-0 top-0 z-50 px-4"
			style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between rounded-full glass-strong px-5 py-3">
				<Link
					href="/"
					aria-label="manawg — Startseite"
					className="inline-flex min-h-11 items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
				>
					<Wordmark />
				</Link>

				<div className="hidden items-center gap-8 md:flex">
					<a
						href="#features"
						className="inline-flex min-h-11 items-center text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
					>
						Features
					</a>
					<a
						href="#vergleich"
						className="inline-flex min-h-11 items-center text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
					>
						Vergleich
					</a>
					<a
						href="#faq"
						className="inline-flex min-h-11 items-center text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
					>
						FAQ
					</a>
				</div>

				<div className="flex items-center gap-2 md:hidden">
					<MobileNav />
				</div>
			</div>
		</nav>
	);
}
