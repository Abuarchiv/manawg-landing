'use client';

import { useRef, useState } from 'react';
import type { Locale } from '@/lib/locale';
import {
	dayShares,
	EXAMPLE_BILL_CENT,
	EXAMPLE_PEOPLE,
	EXAMPLE_PERIOD,
	inclusiveDays,
	MAX_PEOPLE,
	MAX_PERIOD_DAYS,
	MIN_PEOPLE,
	personDays,
} from './day-split';
import { euro } from './rent-calculator';
import { parseCents } from './settle-up';

const fieldCls =
	'min-h-[44px] min-w-0 w-full px-2 rounded border border-[rgb(var(--ink-rgb)/0.2)] bg-transparent text-(--ink) text-[16px] aria-invalid:border-(--ink) aria-invalid:border-2';
const buttonCls =
	'inline-flex items-center justify-center min-h-[44px] px-6 rounded-full border border-[rgb(var(--ink-rgb)/0.2)] bg-transparent text-(--ink) cursor-pointer hover:bg-[rgb(var(--ink-rgb)/0.1)] transition-colors disabled:opacity-40 disabled:cursor-default';
const removeCls =
	'inline-flex items-center justify-center size-[44px] rounded-full border border-[rgb(var(--ink-rgb)/0.2)] bg-transparent text-(--ink) text-[20px] leading-none cursor-pointer hover:bg-[rgb(var(--ink-rgb)/0.1)] transition-colors disabled:opacity-40 disabled:cursor-default';
const cellCls =
	'px-2 py-2 border-b border-[rgb(var(--ink-rgb)/0.1)] align-top [overflow-wrap:anywhere]';
const mono = 'font-mono text-[12px] tracking-[0.02em] text-(--text-3)';

const TEXT: Record<
	Locale,
	{
		bill: string;
		period: string;
		periodFrom: string;
		periodTo: string;
		people: string;
		nameLabel: (n: number) => string;
		person: string;
		from: string;
		to: string;
		fromLabel: (name: string) => string;
		toLabel: (name: string) => string;
		removeLabel: (name: string) => string;
		add: string;
		emptyHint: string;
		periodDays: (n: number) => string;
		result: string;
		caption: string;
		days: string;
		share: string;
		total: string;
		rest: string;
		noDays: (names: string) => string;
		hint: string;
		invalidBill: string;
		invalidPeriod: string;
		tooLong: string;
		invalidPerson: string;
		nobody: string;
	}
> = {
	de: {
		bill: 'Betrag der Rechnung in Euro',
		period: 'Zeitraum der Rechnung',
		periodFrom: 'Zeitraum von',
		periodTo: 'Zeitraum bis',
		people: 'Wer wohnte wann dort? (2 bis 16 Personen)',
		nameLabel: (n) => `Name von Person ${n}`,
		person: 'Person',
		from: 'Von',
		to: 'Bis',
		fromLabel: (name) => `${name}: erster Tag`,
		toLabel: (name) => `${name}: letzter Tag`,
		removeLabel: (name) => `${name} entfernen`,
		add: 'Person hinzufügen',
		emptyHint: 'Leere Daten gelten für den ganzen Zeitraum. Beide Tage zählen mit.',
		periodDays: (n) => (n === 1 ? 'Zeitraum: 1 Tag' : `Zeitraum: ${n} Tage`),
		result: 'Anteil je Person',
		caption: 'Anteil je Person nach Tagen',
		days: 'Tage',
		share: 'Anteil',
		total: 'Summe',
		rest: 'Übrige Cent gehen an die größten Nachkommastellen, bei Gleichstand an die weiter oben stehende Person.',
		noDays: (names) => `Ohne Tag im Zeitraum, ohne Anteil: ${names}.`,
		hint: 'Tragt den Betrag der Rechnung ein.',
		invalidBill: 'Der Betrag ist keine gültige Zahl. Er ist markiert.',
		invalidPeriod:
			'Der Zeitraum ist nicht gültig: Beide Daten müssen echt sein, das Ende nicht vor dem Anfang.',
		tooLong: `Der Zeitraum darf höchstens ${MAX_PERIOD_DAYS} Tage lang sein.`,
		invalidPerson:
			'Bei mindestens einer Person ist ein Datum ungültig oder das Ende liegt vor dem Anfang. Sie ist markiert.',
		nobody: 'Keine Person hat einen Tag im Zeitraum. So gibt es nichts aufzuteilen.',
	},
	en: {
		bill: 'Bill amount in euros',
		period: 'Period of the bill',
		periodFrom: 'Period from',
		periodTo: 'Period to',
		people: 'Who lived there when? (2 to 16 people)',
		nameLabel: (n) => `Name of person ${n}`,
		person: 'Person',
		from: 'From',
		to: 'To',
		fromLabel: (name) => `${name}: first day`,
		toLabel: (name) => `${name}: last day`,
		removeLabel: (name) => `Remove ${name}`,
		add: 'Add a person',
		emptyHint: 'An empty date means the whole period. Both days count.',
		periodDays: (n) => (n === 1 ? 'Period: 1 day' : `Period: ${n} days`),
		result: 'Share per person',
		caption: 'Share per person by days',
		days: 'Days',
		share: 'Share',
		total: 'Total',
		rest: 'Leftover cents go to the largest fractional parts; on a tie, to the person higher in the list.',
		noDays: (names) => `No day in the period, so no share: ${names}.`,
		hint: 'Enter the amount of the bill.',
		invalidBill: 'The amount is not a valid number. It is marked.',
		invalidPeriod:
			'The period is not valid: both dates must be real and the end not before the start.',
		tooLong: `The period can be at most ${MAX_PERIOD_DAYS} days long.`,
		invalidPerson:
			'For at least one person a date is invalid or the end is before the start. They are marked.',
		nobody: 'Nobody has a day in the period, so there is nothing to split.',
	},
};

interface Row {
	id: number;
	name: string;
	from: string;
	to: string;
}

// No storage and no account: inputs and result live in the browser only.
export default function DaySplit({ locale }: { locale: Locale }) {
	const t = TEXT[locale];
	const nextId = useRef(EXAMPLE_PEOPLE.length);
	const [bill, setBill] = useState(() => {
		const text = (EXAMPLE_BILL_CENT / 100).toFixed(2);
		return locale === 'de' ? text.replace('.', ',') : text;
	});
	const [period, setPeriod] = useState(EXAMPLE_PERIOD);
	const [rows, setRows] = useState<Row[]>(EXAMPLE_PEOPLE.map((p, id) => ({ id, ...p })));

	const label = (row: Row, i: number) => row.name.trim() || `${t.person} ${i + 1}`;
	const update = (id: number, change: Partial<Row>) =>
		setRows(rows.map((r) => (r.id === id ? { ...r, ...change } : r)));

	const billCent = parseCents(bill, locale);
	const length = inclusiveDays(period.from, period.to);
	const periodOk = length !== null && length <= MAX_PERIOD_DAYS;
	const days = rows.map((r) => (periodOk ? personDays(period, r.from, r.to) : null));
	const daysOk = periodOk && days.every((d): d is number => d !== null);
	const dayCounts = daysOk ? (days as number[]) : [];
	const shares = billCent !== null && daysOk ? dayShares(billCent, dayCounts) : null;
	const idle = rows.flatMap((r, i) => (dayCounts[i] === 0 ? [label(r, i)] : []));
	const dateCls = (bad: boolean) => ({
		className: fieldCls,
		'aria-invalid': bad ? true : undefined,
	});

	return (
		<div className="pb-10 md:pb-14 md:grid md:grid-cols-12 md:gap-8">
			<div className="md:col-start-6 md:col-span-6 min-w-0">
				<div className="mb-6 flex flex-col gap-4">
					<label className="flex flex-col gap-1 min-w-0">
						<span className={mono}>{t.bill}</span>
						<input
							className={fieldCls}
							type="text"
							inputMode="decimal"
							autoComplete="off"
							value={bill}
							placeholder="0"
							aria-invalid={billCent === null ? true : undefined}
							onChange={(e) => setBill(e.target.value)}
						/>
					</label>
					<fieldset className="m-0 p-0 border-0 min-w-0">
						<legend className={`${mono} mb-1 p-0`}>{t.period}</legend>
						<div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
							<input
								{...dateCls(!periodOk)}
								type="date"
								value={period.from}
								aria-label={t.periodFrom}
								onChange={(e) => setPeriod({ ...period, from: e.target.value })}
							/>
							<input
								{...dateCls(!periodOk)}
								type="date"
								value={period.to}
								aria-label={t.periodTo}
								onChange={(e) => setPeriod({ ...period, to: e.target.value })}
							/>
						</div>
					</fieldset>
				</div>

				<fieldset className="m-0 mb-6 p-0 border-0 min-w-0">
					<legend className={`${mono} mb-1 p-0`}>{t.people}</legend>
					<p className={`${mono} m-0 mb-3`}>{t.emptyHint}</p>
					<div className="flex flex-col gap-4">
						{rows.map((row, i) => (
							<div
								key={row.id}
								className="flex flex-col gap-2 pb-4 border-b border-[rgb(var(--ink-rgb)/0.1)]"
							>
								<div className="grid grid-cols-[minmax(0,1fr)_44px] gap-2 items-center">
									<input
										className={`${fieldCls} px-3`}
										type="text"
										maxLength={40}
										autoComplete="off"
										value={row.name}
										placeholder={`${t.person} ${i + 1}`}
										aria-label={t.nameLabel(i + 1)}
										onChange={(e) => update(row.id, { name: e.target.value })}
									/>
									<button
										type="button"
										className={removeCls}
										disabled={rows.length <= MIN_PEOPLE}
										aria-label={t.removeLabel(label(row, i))}
										onClick={() => setRows(rows.filter((r) => r.id !== row.id))}
									>
										×
									</button>
								</div>
								<div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
									<label className="flex flex-col gap-1 min-w-0">
										<span className={mono}>{t.from}</span>
										<input
											{...dateCls(periodOk && days[i] === null)}
											type="date"
											value={row.from}
											aria-label={t.fromLabel(label(row, i))}
											onChange={(e) => update(row.id, { from: e.target.value })}
										/>
									</label>
									<label className="flex flex-col gap-1 min-w-0">
										<span className={mono}>{t.to}</span>
										<input
											{...dateCls(periodOk && days[i] === null)}
											type="date"
											value={row.to}
											aria-label={t.toLabel(label(row, i))}
											onChange={(e) => update(row.id, { to: e.target.value })}
										/>
									</label>
								</div>
							</div>
						))}
					</div>
					<div className="mt-3">
						<button
							type="button"
							className={buttonCls}
							disabled={rows.length >= MAX_PEOPLE}
							onClick={() =>
								setRows([...rows, { id: nextId.current++, name: '', from: '', to: '' }])
							}
						>
							{t.add}
						</button>
					</div>
				</fieldset>

				<div aria-live="polite" className="min-w-0">
					{billCent === null ? (
						<p className={`${mono} m-0`}>{t.invalidBill}</p>
					) : length === null ? (
						<p className={`${mono} m-0`}>{t.invalidPeriod}</p>
					) : !periodOk ? (
						<p className={`${mono} m-0`}>{t.tooLong}</p>
					) : !daysOk ? (
						<p className={`${mono} m-0`}>{t.invalidPerson}</p>
					) : billCent === 0 ? (
						<p className={`${mono} m-0`}>{t.hint}</p>
					) : !shares ? (
						<p className={`${mono} m-0`}>{t.nobody}</p>
					) : (
						<>
							<p className={`${mono} m-0 mb-2`}>{t.periodDays(length)}</p>
							<h3 className="font-display font-semibold m-0 mb-3 text-[20px] leading-[1.2] tracking-[-0.02em]">
								{t.result}
							</h3>
							<table className="w-full table-fixed border-collapse text-left text-[14px]">
								<caption className="sr-only">{t.caption}</caption>
								<thead>
									<tr>
										<th scope="col" className={`${cellCls} font-normal ${mono} w-[42%]`}>
											{t.person}
										</th>
										<th scope="col" className={`${cellCls} font-normal ${mono} w-[18%]`}>
											{t.days}
										</th>
										<th scope="col" className={`${cellCls} font-normal ${mono}`}>
											{t.share}
										</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((row, i) => (
										<tr key={row.id}>
											<th scope="row" className={`${cellCls} text-left font-normal`}>
												{label(row, i)}
											</th>
											<td className={cellCls}>{dayCounts[i]}</td>
											<td className={`${cellCls} font-semibold`}>{euro(shares[i] ?? 0, locale)}</td>
										</tr>
									))}
									<tr>
										<th scope="row" className={`${cellCls} text-left font-normal`}>
											{t.total}
										</th>
										<td className={cellCls}>{dayCounts.reduce((a, b) => a + b, 0)}</td>
										<td className={`${cellCls} font-semibold`}>
											{euro(
												shares.reduce((a, b) => a + b, 0),
												locale,
											)}
										</td>
									</tr>
								</tbody>
							</table>
							<p className={`${mono} m-0 mt-3`}>{t.rest}</p>
							{idle.length > 0 && <p className={`${mono} m-0 mt-2`}>{t.noDays(idle.join(', '))}</p>}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
