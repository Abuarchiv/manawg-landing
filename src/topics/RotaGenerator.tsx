'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locale';
import { cleaningRota, tableToCsv } from './cleaning-rota';

const TEXT: Record<
	Locale,
	{
		tasks: string[];
		names: string[];
		weekLabel: string;
		csvSep: string;
		csvFile: string;
		namesLegend: string;
		namePlaceholder: (n: number) => string;
		tasksLegend: string;
		durationLegend: string;
		weeks: (n: number) => string;
		title: (n: number) => string;
		caption: string;
		twoTasks: string;
		manyTasks: (n: number) => string;
		freeWeek: string;
		hint: string;
		print: string;
		download: string;
	}
> = {
	de: {
		tasks: ['Bad', 'Küche', 'Böden', 'Müll und Flur', 'Wohnzimmer und Balkon'],
		names: ['Anna', 'Ben', 'Clara', 'David', '', ''],
		weekLabel: 'Woche',
		csvSep: ';',
		csvFile: 'putzplan.csv',
		namesLegend: 'Namen (2 bis 6)',
		namePlaceholder: (n) => `Name ${n}`,
		tasksLegend: 'Aufgaben',
		durationLegend: 'Dauer',
		weeks: (n) => `${n} Wochen`,
		title: (n) => `WG-Putzplan für ${n} Wochen`,
		caption: 'Putzplan mit Namen und Aufgaben',
		twoTasks: 'Eine Person übernimmt zwei Aufgaben pro Woche.',
		manyTasks: (n) => `Eine Person übernimmt bis zu ${n} Aufgaben pro Woche.`,
		freeWeek: 'Wer keine Aufgabe hat, hat frei.',
		hint: 'Tragt mindestens zwei Namen ein und wählt mindestens eine Aufgabe.',
		print: 'Drucken / als PDF speichern',
		download: 'Als CSV herunterladen',
	},
	en: {
		tasks: ['Bathroom', 'Kitchen', 'Floors', 'Bins and hallway', 'Living room and balcony'],
		names: ['Anna', 'Ben', 'Clara', 'David', '', ''],
		weekLabel: 'Week',
		csvSep: ',',
		csvFile: 'cleaning-rota.csv',
		namesLegend: 'Names (2 to 6)',
		namePlaceholder: (n) => `Name ${n}`,
		tasksLegend: 'Tasks',
		durationLegend: 'Duration',
		weeks: (n) => `${n} weeks`,
		title: (n) => `Flat cleaning rota for ${n} weeks`,
		caption: 'Cleaning rota with names and tasks',
		twoTasks: 'One person takes two tasks each week.',
		manyTasks: (n) => `One person takes up to ${n} tasks each week.`,
		freeWeek: 'Anyone without a task has the week off.',
		hint: 'Enter at least two names and choose at least one task.',
		print: 'Print / save as PDF',
		download: 'Download as CSV',
	},
};
const buttonCls =
	'inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[var(--ink)] text-[var(--paper)] font-semibold cursor-pointer border-0 hover:bg-[rgb(var(--ink-rgb)/0.82)] transition-colors disabled:opacity-40';
const fieldCls =
	'min-h-[44px] px-3 rounded border border-[rgb(var(--ink-rgb)/0.2)] bg-transparent text-[var(--ink)]';
const cellCls = 'px-3 py-2 border-b border-[rgb(var(--ink-rgb)/0.1)]';
const mono = 'font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)]';

// No storage and no account: inputs and plan live in the browser only.
export default function RotaGenerator({ locale }: { locale: Locale }) {
	const t = TEXT[locale];
	const allTasks = t.tasks;
	const [names, setNames] = useState(t.names);
	const [tasks, setTasks] = useState(allTasks.slice(0, 4));
	const [weeks, setWeeks] = useState(4);

	const people = names.map((n) => n.trim()).filter(Boolean);
	const chosen = allTasks.filter((a) => tasks.includes(a));
	const plan =
		people.length >= 2 && chosen.length > 0
			? cleaningRota(people, chosen, weeks, t.weekLabel)
			: null;
	const perPerson = Math.ceil(chosen.length / Math.max(people.length, 1));

	const print = () => {
		// Only the plan goes to paper (see globals.css).
		document.body.classList.add('plan-printing');
		window.addEventListener('afterprint', () => document.body.classList.remove('plan-printing'), {
			once: true,
		});
		window.print();
	};

	const csv = () => {
		if (!plan) return;
		const url = URL.createObjectURL(
			new Blob([tableToCsv(plan.header, plan.rows, t.csvSep)], {
				type: 'text/csv;charset=utf-8',
			}),
		);
		const a = document.createElement('a');
		a.href = url;
		a.download = t.csvFile;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="pb-10 md:pb-14 md:grid md:grid-cols-12 md:gap-8">
			<div className="md:col-start-6 md:col-span-6 min-w-0">
				<fieldset className="m-0 mb-6 p-0 border-0">
					<legend className={`${mono} mb-3 p-0`}>{t.namesLegend}</legend>
					<div className="grid grid-cols-2 gap-3">
						{names.map((name, i) => (
							<input
								key={i}
								className={fieldCls}
								type="text"
								maxLength={20}
								value={name}
								placeholder={t.namePlaceholder(i + 1)}
								aria-label={t.namePlaceholder(i + 1)}
								onChange={(e) => setNames(names.map((n, j) => (j === i ? e.target.value : n)))}
							/>
						))}
					</div>
				</fieldset>
				<fieldset className="m-0 mb-6 p-0 border-0">
					<legend className={`${mono} mb-3 p-0`}>{t.tasksLegend}</legend>
					<div className="flex flex-col">
						{allTasks.map((a) => (
							<label key={a} className="flex items-center gap-3 min-h-[44px]">
								<input
									type="checkbox"
									className="h-5 w-5"
									checked={tasks.includes(a)}
									onChange={(e) =>
										setTasks(e.target.checked ? [...tasks, a] : tasks.filter((x) => x !== a))
									}
								/>
								{a}
							</label>
						))}
					</div>
				</fieldset>
				<fieldset className="m-0 mb-8 p-0 border-0">
					<legend className={`${mono} mb-3 p-0`}>{t.durationLegend}</legend>
					<div className="flex gap-6">
						{[4, 8].map((w) => (
							<label key={w} className="flex items-center gap-3 min-h-[44px]">
								<input
									type="radio"
									name="wochen"
									className="h-5 w-5"
									checked={weeks === w}
									onChange={() => setWeeks(w)}
								/>
								{t.weeks(w)}
							</label>
						))}
					</div>
				</fieldset>
			</div>

			<div className="md:col-span-12 min-w-0 plan-print" aria-live="polite">
				{plan ? (
					<>
						<h3 className="m-0 mb-4 font-display font-semibold text-[20px]">{t.title(weeks)}</h3>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[540px] border-collapse text-left">
								<caption className="sr-only">{t.caption}</caption>
								<thead>
									<tr>
										{plan.header.map((k) => (
											<th key={k} scope="col" className={`${cellCls} text-left font-normal`}>
												{k}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{plan.rows.map((row) => (
										<tr key={row[0]}>
											{row.map((cellText, j) =>
												j === 0 ? (
													<th
														key={cellText}
														scope="row"
														className={`${cellCls} text-left font-normal`}
													>
														{cellText}
													</th>
												) : (
													<td key={j} className={cellCls}>
														{cellText}
													</td>
												),
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{perPerson > 1 && (
							<p className={`${mono} mt-4 mb-0`}>
								{perPerson === 2 ? t.twoTasks : t.manyTasks(perPerson)}
							</p>
						)}
						{people.length > chosen.length && <p className={`${mono} mt-4 mb-0`}>{t.freeWeek}</p>}
					</>
				) : (
					<p className={`${mono} m-0`}>{t.hint}</p>
				)}
				<div className="mt-6 flex flex-wrap gap-3 no-print">
					<button type="button" className={buttonCls} onClick={print} disabled={!plan}>
						{t.print}
					</button>
					<button type="button" className={buttonCls} onClick={csv} disabled={!plan}>
						{t.download}
					</button>
				</div>
			</div>
		</div>
	);
}
