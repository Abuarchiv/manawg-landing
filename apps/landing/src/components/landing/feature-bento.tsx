'use client';

import { PinIcon, Receipt, ShoppingBag } from 'lucide-react';
import type React from 'react';

function BentoCard({
	children,
	className = '',
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	return (
		<div
			className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl glass gradient-border p-6 sm:p-8 animate-fade-up ${className}`}
			style={{ animationDelay: `${delay * 1000}ms` }}
		>
			{children}
		</div>
	);
}

function CardLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2 label-mono text-[var(--text-2)]">
			<span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-glow" />
			{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
			{children}
		</div>
	);
}

/* ─── mini visuals — CSS-staggered fade-up, no whileInView ─── */

function ExpensesVisual() {
	const rows = [
		{ who: 'Lea', amt: '+47,20 €', tone: 'mint' },
		{ who: 'Max', amt: '−12,40 €', tone: 'pink' },
		{ who: 'Jonas', amt: '+8,90 €', tone: 'mint' },
		{ who: 'Hannah', amt: '−43,70 €', tone: 'pink' },
	];
	return (
		<div className="relative mt-8 space-y-2.5">
			{rows.map((r, i) => (
				<div
					key={r.who}
					className="flex items-center justify-between rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] px-4 py-3 animate-fade-up"
					style={{ animationDelay: `${200 + i * 80}ms` }}
				>
					<span className="font-medium text-[var(--text-1)]">{r.who}</span>
					<span
						className="font-mono text-sm font-semibold tabular-nums"
						style={{
							color: r.tone === 'mint' ? 'var(--accent-deep)' : 'var(--clay)',
						}}
					>
						{r.amt}
					</span>
				</div>
			))}
		</div>
	);
}

function ChoresVisual() {
	const tasks = [
		{ name: 'Bad', who: 'Lea', done: true },
		{ name: 'Küche', who: 'Max', done: true },
		{ name: 'Flur', who: 'Jonas', done: false },
		{ name: 'Müll', who: 'Hannah', done: false },
	];
	return (
		<div className="relative mt-8 grid grid-cols-2 gap-2.5">
			{tasks.map((t, i) => (
				<div
					key={t.name}
					className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] p-3.5 animate-fade-up"
					style={{ animationDelay: `${200 + i * 70}ms` }}
				>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-[var(--text-1)]">{t.name}</span>
						<span
							className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
								t.done
									? 'bg-[var(--accent)] text-[var(--accent-fg)]'
									: 'border border-black/20 dark:border-white/20 text-transparent'
							}`}
						>
							<span aria-hidden>✓</span>
							<span className="sr-only">{t.done ? 'erledigt' : 'offen'}</span>
						</span>
					</div>
					<div className="label-mono mt-2 text-[10px]">{t.who}</div>
				</div>
			))}
		</div>
	);
}

function ShoppingVisual() {
	const items = [
		{ name: 'Klopapier', done: true },
		{ name: 'Hafermilch', done: true },
		{ name: 'Spülmaschinen-Tabs', done: false },
		{ name: 'Olivenöl', done: false },
	];
	return (
		<div className="relative mt-8 space-y-2">
			{items.map((it, i) => (
				<div
					key={it.name}
					className="flex items-center gap-3 rounded-lg px-2 py-2 animate-fade-up"
					style={{ animationDelay: `${180 + i * 60}ms` }}
				>
					<span
						className={`flex h-4 w-4 items-center justify-center rounded-md border ${
							it.done
								? 'border-[var(--accent)] bg-[var(--accent)]/20'
								: 'border-black/20 dark:border-white/20'
						}`}
					>
						{it.done && <span className="text-[9px] text-[var(--accent)]">✓</span>}
					</span>
					<span
						className={`text-sm ${
							it.done
								? 'text-[var(--text-3)] line-through decoration-[var(--text-3)]/60'
								: 'text-[var(--text-1)]'
						}`}
					>
						{it.name}
					</span>
				</div>
			))}
		</div>
	);
}

function PinboardVisual() {
	const notes = [
		{ text: 'Hausmeister kommt Di 10 Uhr', color: 'var(--accent)' },
		{ text: 'Heizung Wartung erledigt', color: 'var(--warning)' },
		{ text: 'Schwester pennt am Wochenende', color: 'var(--clay)' },
	];
	return (
		<div className="relative mt-8 space-y-3">
			{notes.map((n, i) => (
				<div
					key={n.text}
					className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.04] dark:bg-white/[0.04] px-4 py-3 backdrop-blur animate-fade-up"
					style={{
						animationDelay: `${180 + i * 100}ms`,
						boxShadow: `0 0 0 1px ${n.color}33, 0 4px 20px ${n.color}22`,
					}}
				>
					<div className="flex items-start justify-between gap-3">
						<span className="text-sm text-[var(--text-1)]">{n.text}</span>
						<span
							className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
							style={{ backgroundColor: n.color, boxShadow: `0 0 12px ${n.color}` }}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

/* ─── main grid ─── */

export function FeatureBento() {
	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(0,1fr)]">
			{/* TILE 1 — large hero, spans 4 cols, 2 rows — Ausgaben */}
			<BentoCard
				className="sm:col-span-2 lg:col-span-4 lg:row-span-2 min-h-[340px] sm:min-h-[360px] lg:min-h-[440px]"
				delay={0}
			>
				<div className="flex h-full flex-col justify-between">
					<div>
						<CardLabel>{'01 — AUSGABEN'}</CardLabel>
						<h3 className="mt-5 text-xl sm:text-2xl lg:text-4xl font-semibold tracking-[-0.04em] leading-[0.96] text-[var(--text-1)]">
							Wer schuldet wem was. <span className="text-gradient">Live.</span>
						</h3>
						<p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-[var(--text-2)]">
							Tipp ein, was du gezahlt hast. ManaWG rechnet automatisch — wer hat ausgelegt, wer
							schuldet, wer kriegt was zurück. Ein Klick: erledigt.
						</p>
					</div>
					<ExpensesVisual />
				</div>
				<Receipt
					className="absolute bottom-4 right-4 h-8 w-8 text-[var(--accent)] opacity-[0.07] sm:-bottom-6 sm:-right-6 sm:h-32 sm:w-32"
					strokeWidth={1.2}
				/>
			</BentoCard>

			{/* TILE 2 — top right, spans 1 col (sm) / 2 cols (lg), 1 row — Putzplan */}
			<BentoCard
				className="lg:col-span-2 lg:row-span-1 min-h-[220px] sm:min-h-[200px] lg:min-h-[210px]"
				delay={0.1}
			>
				<CardLabel>{'02 — PUTZPLAN'}</CardLabel>
				<h3 className="mt-4 text-xl sm:text-2xl font-semibold tracking-[-0.04em] leading-[0.96] text-[var(--text-1)]">
					Rotiert <span className="italic font-normal font-serif">fair</span>.
				</h3>
				<p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-2)]">
					Bad, Küche, Flur — wer dran ist, weiß es. Urlaub übersprungen.
				</p>
				<ChoresVisual />
			</BentoCard>

			{/* TILE 3 — middle right, spans 1 col (sm) / 2 cols (lg), 1 row — Pinnwand mini */}
			<BentoCard
				className="lg:col-span-2 lg:row-span-1 min-h-[220px] sm:min-h-[200px] lg:min-h-[210px]"
				delay={0.18}
			>
				<CardLabel>{'03 — PINNWAND'}</CardLabel>
				<h3 className="mt-4 text-xl sm:text-2xl font-semibold tracking-[-0.04em] leading-[0.96] text-[var(--text-1)]">
					Drei Zeilen. <span className="text-gradient">Alle sehen's.</span>
				</h3>
				<p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-2)]">
					Statt Chat-Chaos: ein Kühlschrank, digital.
				</p>
				<PinIcon
					className="absolute -bottom-4 -right-4 h-8 w-8 text-[var(--clay)] opacity-[0.08]"
					strokeWidth={1.2}
				/>
			</BentoCard>

			{/* TILE 4 — bottom left, span 2 cols (sm) / 3 cols (lg) — Einkaufsliste */}
			<BentoCard
				className="sm:col-span-2 lg:col-span-3 lg:row-span-1 min-h-[280px] sm:min-h-[280px] lg:min-h-[300px]"
				delay={0.22}
			>
				<div className="flex h-full flex-col justify-between">
					<div>
						<CardLabel>{'04 — EINKAUFSLISTE'}</CardLabel>
						<h3 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[-0.04em] leading-[0.96] text-[var(--text-1)]">
							Eine Liste. Für{' '}
							<span className="italic font-normal font-serif text-gradient">alle</span>.
						</h3>
						<p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-2)]">
							Wer einkauft, hakt ab. Alle sehen es sofort — keine Doppelkäufe mehr.
						</p>
					</div>
					<ShoppingVisual />
				</div>
				<ShoppingBag
					className="absolute -bottom-4 -right-4 h-8 w-8 text-[var(--accent)] opacity-[0.08]"
					strokeWidth={1.2}
				/>
			</BentoCard>

			{/* TILE 5 — bottom right, span 2 cols (sm) / 3 cols (lg) — Pinnwand bigger */}
			<BentoCard
				className="sm:col-span-2 lg:col-span-3 lg:row-span-1 min-h-[280px] sm:min-h-[280px] lg:min-h-[300px]"
				delay={0.3}
			>
				<div className="flex h-full flex-col justify-between">
					<div>
						<CardLabel>{'05 — KÜHLSCHRANK-NOTIZEN'}</CardLabel>
						<h3 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[-0.04em] leading-[0.96] text-[var(--text-1)]">
							Was <span className="italic font-normal font-serif">jeder</span> wissen muss.
						</h3>
						<p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-2)]">
							Kein „hab ich nicht gesehen" mehr — du siehst sofort, wer gelesen hat.
						</p>
					</div>
					<PinboardVisual />
				</div>
			</BentoCard>
		</div>
	);
}
