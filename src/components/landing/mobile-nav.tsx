'use client';

import { Drawer } from '@/components/ui/Drawer';
import { Wordmark } from '@/components/ui/Wordmark';
import { appUrl } from '@/lib/app-origin';
import { haptic } from '@/lib/haptics';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
	{ href: '#features', label: 'Features' },
	{ href: '#vergleich', label: 'Vergleich' },
	{ href: '#faq', label: 'FAQ' },
] as const;

export function MobileNav() {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<>
			<button
				type="button"
				aria-label="Menü öffnen"
				aria-expanded={open}
				aria-controls="mobile-nav-drawer"
				onClick={() => {
					haptic('light');
					setOpen(true);
				}}
				className="flex items-center justify-center h-11 w-11 rounded-full border border-black/[0.12] dark:border-white/[0.12] bg-black/[0.04] dark:bg-white/[0.04] text-[var(--text-2)] hover:border-black/25 dark:hover:border-white/25 hover:text-[var(--text-1)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
			>
				<Menu className="h-4 w-4" aria-hidden="true" />
			</button>

			<Drawer
				open={open}
				onClose={close}
				side="left"
				aria-label="Hauptnavigation"
				className="border-r border-[var(--border)] bg-[var(--bg-base)] p-6 shadow-[20px_0_60px_rgba(0,0,0,0.18)] dark:shadow-[20px_0_60px_rgba(0,0,0,0.5)]"
			>
				<div id="mobile-nav-drawer" data-app-chrome className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<Wordmark />
						<button
							type="button"
							aria-label="Menü schließen"
							onClick={() => {
								haptic('light');
								close();
							}}
							className="flex items-center justify-center h-11 w-11 rounded-full border border-black/[0.12] dark:border-white/[0.12] bg-black/[0.04] dark:bg-white/[0.04] text-[var(--text-2)] hover:border-black/25 dark:hover:border-white/25 hover:text-[var(--text-1)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
						>
							<X className="h-4 w-4" aria-hidden="true" />
						</button>
					</div>

					{/* Nav links */}
					<nav aria-label="Seitennavigation" className="flex flex-col gap-1 flex-1">
						{NAV_LINKS.map(({ href, label }) => (
							<a
								key={href}
								href={href}
								onClick={() => {
									haptic('light');
									close();
								}}
								className="flex min-h-[48px] items-center px-4 py-3 rounded-xl text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
							>
								{label}
							</a>
						))}
					</nav>

					{/* CTAs */}
					<div className="flex flex-col gap-3 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
						<a
							href={appUrl('/neu')}
							onClick={() => {
								haptic('medium');
								close();
							}}
							className="btn-modern w-full justify-center min-h-12"
						>
							WG erstellen
							<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
						</a>
					</div>
				</div>
			</Drawer>
		</>
	);
}
