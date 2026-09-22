'use client';

import { FAQ_ITEMS } from '@/components/landing/faq-data';
import { haptic } from '@/lib/haptics';
import { ChevronDown } from 'lucide-react';

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
	const panelId = `faq-panel-${index}`;
	const summaryId = `faq-summary-${index}`;

	return (
		<details className="group animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <summary> is natively keyboard-operable (Enter/Space toggles <details>); onClick only fires a touch-haptic side-effect, not the toggle itself. */}
			<summary
				id={summaryId}
				aria-controls={panelId}
				onClick={() => haptic('light')}
				className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 border-b border-black/[0.08] py-4 text-left transition-colors marker:hidden hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 dark:border-white/[0.08] dark:hover:border-white/20 [&::-webkit-details-marker]:hidden"
			>
				<span className="text-base font-medium text-[var(--text-1)] tracking-[-0.01em]">{q}</span>
				<span
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.12] bg-black/[0.03] text-[var(--text-2)] transition-transform group-open:rotate-180 group-hover:border-[var(--accent)]/40 group-hover:text-[var(--accent)] dark:border-white/[0.12] dark:bg-white/[0.03]"
					aria-hidden
				>
					<ChevronDown className="h-4 w-4" strokeWidth={2} />
				</span>
			</summary>
			<section id={panelId} aria-labelledby={summaryId}>
				<p className="pb-5 pt-2 text-sm leading-relaxed text-[var(--text-2)]">{a}</p>
			</section>
		</details>
	);
}

export function FAQ() {
	return (
		<div className="w-full max-w-3xl mx-auto">
			{FAQ_ITEMS.map((f, i) => (
				<FAQItem key={f.q} q={f.q} a={f.a} index={i} />
			))}
		</div>
	);
}
