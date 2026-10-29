'use client';

import type { Locale } from '@/lib/locale';
import { useState } from 'react';
import { putzplanRotation, tabelleAlsCsv } from './putzplan-rotation';

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
const knopf =
	'inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[#fafafa] text-[#0a0a0a] font-semibold cursor-pointer border-0 hover:bg-[#d4d4d4] transition-colors disabled:opacity-40';
const feld = 'min-h-[44px] px-3 rounded border border-white/20 bg-transparent text-[#fafafa]';
const zelle = 'px-3 py-2 border-b border-white/10';
const mono = 'font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)]';

// Ohne Speicherung und Konto: Eingaben und Plan leben nur im Browser.
export default function PutzplanGenerator({ locale }: { locale: Locale }) {
	const t = TEXT[locale];
	const AUFGABEN = t.tasks;
	const [namen, setNamen] = useState(t.names);
	const [aufgaben, setAufgaben] = useState(AUFGABEN.slice(0, 4));
	const [wochen, setWochen] = useState(4);

	const personen = namen.map((n) => n.trim()).filter(Boolean);
	const gewaehlt = AUFGABEN.filter((a) => aufgaben.includes(a));
	const plan =
		personen.length >= 2 && gewaehlt.length > 0
			? putzplanRotation(personen, gewaehlt, wochen, t.weekLabel)
			: null;
	const mehrfach = Math.ceil(gewaehlt.length / Math.max(personen.length, 1));

	const drucken = () => {
		// Nur der Plan kommt aufs Papier (siehe globals.css).
		document.body.classList.add('plan-drucken');
		window.addEventListener('afterprint', () => document.body.classList.remove('plan-drucken'), {
			once: true,
		});
		window.print();
	};

	const csv = () => {
		if (!plan) return;
		const url = URL.createObjectURL(
			new Blob([tabelleAlsCsv(plan.kopf, plan.zeilen, t.csvSep)], {
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
						{namen.map((name, i) => (
							<input
								key={i}
								className={feld}
								type="text"
								maxLength={20}
								value={name}
								placeholder={t.namePlaceholder(i + 1)}
								aria-label={t.namePlaceholder(i + 1)}
								onChange={(e) => setNamen(namen.map((n, j) => (j === i ? e.target.value : n)))}
							/>
						))}
					</div>
				</fieldset>
				<fieldset className="m-0 mb-6 p-0 border-0">
					<legend className={`${mono} mb-3 p-0`}>{t.tasksLegend}</legend>
					<div className="flex flex-col">
						{AUFGABEN.map((a) => (
							<label key={a} className="flex items-center gap-3 min-h-[44px]">
								<input
									type="checkbox"
									className="h-5 w-5"
									checked={aufgaben.includes(a)}
									onChange={(e) =>
										setAufgaben(
											e.target.checked ? [...aufgaben, a] : aufgaben.filter((x) => x !== a),
										)
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
									checked={wochen === w}
									onChange={() => setWochen(w)}
								/>
								{t.weeks(w)}
							</label>
						))}
					</div>
				</fieldset>
			</div>

			<div className="md:col-span-12 min-w-0 plan-druck" aria-live="polite">
				{plan ? (
					<>
						<h3 className="m-0 mb-4 font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[20px]">
							{t.title(wochen)}
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[540px] border-collapse text-left">
								<caption className="sr-only">{t.caption}</caption>
								<thead>
									<tr>
										{plan.kopf.map((k) => (
											<th key={k} scope="col" className={`${zelle} text-left font-normal`}>
												{k}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{plan.zeilen.map((zeile) => (
										<tr key={zeile[0]}>
											{zeile.map((feldtext, j) =>
												j === 0 ? (
													<th
														key={feldtext}
														scope="row"
														className={`${zelle} text-left font-normal`}
													>
														{feldtext}
													</th>
												) : (
													<td key={j} className={zelle}>
														{feldtext}
													</td>
												),
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{mehrfach > 1 && (
							<p className={`${mono} mt-4 mb-0`}>
								{mehrfach === 2 ? t.twoTasks : t.manyTasks(mehrfach)}
							</p>
						)}
						{personen.length > gewaehlt.length && (
							<p className={`${mono} mt-4 mb-0`}>{t.freeWeek}</p>
						)}
					</>
				) : (
					<p className={`${mono} m-0`}>{t.hint}</p>
				)}
				<div className="mt-6 flex flex-wrap gap-3 druck-aus">
					<button type="button" className={knopf} onClick={drucken} disabled={!plan}>
						{t.print}
					</button>
					<button type="button" className={knopf} onClick={csv} disabled={!plan}>
						{t.download}
					</button>
				</div>
			</div>
		</div>
	);
}
