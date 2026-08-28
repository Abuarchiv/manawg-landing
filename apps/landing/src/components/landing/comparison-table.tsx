'use client';

import { Check, Minus, X } from 'lucide-react';

type Cell = 'yes' | 'no' | 'half';

const rows: { feature: string; splitwise: Cell; tricount: Cell; manawg: Cell }[] = [
	{ feature: 'Free-Tier ohne Limits', splitwise: 'no', tricount: 'half', manawg: 'yes' },
	{ feature: 'Server in der EU', splitwise: 'no', tricount: 'yes', manawg: 'yes' },
	{ feature: 'Putzplan inklusive', splitwise: 'no', tricount: 'no', manawg: 'yes' },
	{ feature: 'Einkaufsliste geteilt', splitwise: 'no', tricount: 'no', manawg: 'yes' },
	{ feature: 'Pinnwand für Notizen', splitwise: 'no', tricount: 'no', manawg: 'yes' },
	{ feature: 'Werbefrei (Free-Tier)', splitwise: 'no', tricount: 'half', manawg: 'yes' },
	{ feature: 'Schulden auflösen (Simplify)', splitwise: 'yes', tricount: 'yes', manawg: 'yes' },
	{
		feature: 'Installierbar auf iOS & Android',
		splitwise: 'yes',
		tricount: 'yes',
		manawg: 'yes',
	},
	{ feature: 'Mehrwährungs-Support', splitwise: 'yes', tricount: 'yes', manawg: 'no' },
];

const CELL_LABEL: Record<Cell, string> = {
	yes: 'Ja',
	no: 'Nein',
	half: 'Teilweise',
};

function Mark({ kind }: { kind: Cell }) {
	if (kind === 'yes') {
		return (
			<span
				className="inline-flex h-7 w-7 items-center justify-center rounded-full"
				style={{
					backgroundColor: 'rgba(47, 93, 74, 0.12)',
					boxShadow: '0 0 14px rgba(47, 93, 74, 0.28), inset 0 0 0 1px rgba(47, 93, 74, 0.4)',
				}}
				role="img"
				aria-label="Ja"
			>
				<Check className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={3} aria-hidden="true" />
			</span>
		);
	}
	if (kind === 'half') {
		return (
			<span
				className="inline-flex h-7 w-7 items-center justify-center rounded-full"
				style={{
					backgroundColor: 'rgba(184, 147, 42, 0.1)',
					boxShadow: 'inset 0 0 0 1px rgba(184, 147, 42, 0.4)',
				}}
				role="img"
				aria-label="Teilweise"
			>
				<Minus
					className="h-3.5 w-3.5"
					strokeWidth={3}
					style={{ color: '#b8932a' }}
					aria-hidden="true"
				/>
			</span>
		);
	}
	return (
		<span
			className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]"
			role="img"
			aria-label="Nein"
		>
			<X className="h-3.5 w-3.5 text-[var(--text-3)]" strokeWidth={2.4} aria-hidden="true" />
		</span>
	);
}

/** Card-per-feature layout for viewports < sm (< 640px). */
function MobileCards() {
	return (
		<div className="sm:hidden space-y-3">
			{rows.map((row, i) => (
				<div
					key={row.feature}
					className="relative overflow-hidden rounded-2xl glass gradient-border p-4 animate-fade-up"
					style={{ animationDelay: `${100 + i * 50}ms` }}
				>
					<p className="text-sm font-medium text-[var(--text-1)] mb-3">{row.feature}</p>
					<div className="grid grid-cols-3 gap-2">
						{[
							{ name: 'Splitwise', cell: row.splitwise, accent: false },
							{ name: 'Tricount', cell: row.tricount, accent: false },
							{ name: 'manawg', cell: row.manawg, accent: true },
						].map(({ name, cell, accent }) => (
							<div key={name} className="flex flex-col items-center gap-1.5">
								<span
									className={`label-mono text-[10px] ${accent ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`}
								>
									{name}
								</span>
								<Mark kind={cell} />
								<span className="text-[10px] text-[var(--text-3)]">{CELL_LABEL[cell]}</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

/** Full table for sm+ viewports. */
function DesktopTable() {
	return (
		/* Horizontal-scroll wrapper keeps the table intact on narrow sm breakpoints. */
		// biome-ignore lint/a11y/useSemanticElements: focusable scroll region — region role + label announces the horizontally scrollable table to AT
		<div
			role="region"
			aria-label="Vergleichstabelle, horizontal scrollbar"
			// biome-ignore lint/a11y/noNoninteractiveTabindex: tabIndex=0 makes the overflow container keyboard-scrollable (WCAG 2.1.1) — intentional, not interactive
			tabIndex={0}
			className="hidden sm:block overflow-x-auto -mx-5 px-5 no-scrollbar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
		>
			<div className="relative overflow-hidden rounded-3xl glass gradient-border animate-fade-up min-w-[420px] sm:min-w-0">
				{/* Semantic <table> — preserves row/column relationships for screen readers
				    (NVDA/JAWS table-nav keys) while CSS keeps the visual grid layout. */}
				<table
					className="w-full border-collapse"
					aria-label="Vergleich: manawg vs. Splitwise vs. Tricount"
				>
					<caption className="sr-only">
						Feature-Vergleich zwischen Splitwise, Tricount und manawg
					</caption>
					<colgroup>
						<col style={{ width: '40%' }} />
						<col style={{ width: '20%' }} />
						<col style={{ width: '20%' }} />
						<col style={{ width: '20%' }} />
					</colgroup>
					<thead>
						<tr className="border-b border-black/[0.08] dark:border-white/[0.08]">
							<th scope="col" className="label-mono px-6 py-5 text-left md:px-10">
								FEATURE
							</th>
							<th scope="col" className="label-mono px-2 py-5 text-center">
								Splitwise
							</th>
							<th scope="col" className="label-mono px-2 py-5 text-center">
								Tricount
							</th>
							<th scope="col" className="label-mono px-2 py-5 text-center text-[var(--accent)]">
								manawg
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, i) => (
							<tr
								key={row.feature}
								className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-b-0 transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.015] animate-fade-up"
								style={{ animationDelay: `${100 + i * 50}ms` }}
							>
								<th
									scope="row"
									className="px-6 py-4 text-left text-sm font-medium text-[var(--text-1)] sm:text-[0.9375rem] md:px-10"
								>
									{row.feature}
								</th>
								<td
									className="px-2 py-4 text-center"
									aria-label={`Splitwise: ${CELL_LABEL[row.splitwise]}`}
								>
									<div className="flex justify-center">
										<Mark kind={row.splitwise} />
									</div>
								</td>
								<td
									className="px-2 py-4 text-center"
									aria-label={`Tricount: ${CELL_LABEL[row.tricount]}`}
								>
									<div className="flex justify-center">
										<Mark kind={row.tricount} />
									</div>
								</td>
								<td
									className="px-2 py-4 text-center"
									aria-label={`manawg: ${CELL_LABEL[row.manawg]}`}
								>
									<div className="flex justify-center">
										<Mark kind={row.manawg} />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export function ComparisonTable() {
	return (
		<>
			<MobileCards />
			<DesktopTable />
		</>
	);
}
