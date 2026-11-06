'use client';

import { useRef, useState } from 'react';
import type { Locale } from '@/lib/locale';
import { euro } from './rent-calculator';
import {
	balances,
	EXAMPLE_NAMES,
	EXAMPLE_PAID_CENT,
	equalShares,
	MAX_PEOPLE,
	MIN_PEOPLE,
	parseCents,
	settle,
} from './settle-up';

const fieldCls =
	'min-h-[44px] min-w-0 w-full px-3 rounded border border-[rgb(var(--ink-rgb)/0.2)] bg-transparent text-(--ink) text-[16px] aria-invalid:border-(--ink) aria-invalid:border-2';
const buttonCls =
	'inline-flex items-center justify-center min-h-[44px] px-6 rounded-full border border-[rgb(var(--ink-rgb)/0.2)] bg-transparent text-(--ink) cursor-pointer hover:bg-[rgb(var(--ink-rgb)/0.1)] transition-colors disabled:opacity-40 disabled:cursor-default';
const removeCls =
	'inline-flex items-center justify-center size-[44px] rounded-full border border-[rgb(var(--ink-rgb)/0.2)] bg-transparent text-(--ink) text-[20px] leading-none cursor-pointer hover:bg-[rgb(var(--ink-rgb)/0.1)] transition-colors disabled:opacity-40 disabled:cursor-default';
const rowCls = 'grid grid-cols-[minmax(0,1fr)_minmax(0,6.5rem)_44px] gap-2 items-center';
const cellCls =
	'px-2 py-2 border-b border-[rgb(var(--ink-rgb)/0.1)] align-top [overflow-wrap:anywhere]';
const mono = 'font-mono text-[12px] tracking-[0.02em] text-(--text-3)';

const TEXT: Record<
	Locale,
	{
		people: string;
		name: string;
		paid: string;
		nameLabel: (n: number) => string;
		paidLabel: (name: string) => string;
		removeLabel: (name: string) => string;
		person: string;
		add: string;
		total: string;
		share: string;
		shareRest: string;
		transfers: (n: number) => string;
		pays: string;
		caption: string;
		balance: string;
		even: string;
		hint: string;
		invalid: string;
	}
> = {
	de: {
		people: 'Wer hat wie viel bezahlt? (2 bis 16 Personen)',
		name: 'Name',
		paid: 'Bezahlt in €',
		nameLabel: (n) => `Name von Person ${n}`,
		paidLabel: (name) => `Bezahlt von ${name} in Euro`,
		removeLabel: (name) => `${name} entfernen`,
		person: 'Person',
		add: 'Person hinzufügen',
		total: 'Zusammen bezahlt',
		share: 'Anteil je Person',
		shareRest: 'Bleiben Cent übrig, tragen die ersten Personen der Liste je 1 Cent mehr.',
		transfers: (n) => (n === 1 ? '1 Überweisung' : `${n} Überweisungen`),
		pays: 'zahlt',
		caption: 'Saldo je Person',
		balance: 'Saldo',
		even: 'Alle haben genau ihren Anteil bezahlt. Niemand schuldet etwas.',
		hint: 'Tragt ein, was die Personen bezahlt haben. Wer nichts bezahlt hat, bekommt eine 0.',
		invalid: 'Mindestens ein Betrag ist keine gültige Zahl. Er ist markiert.',
	},
	en: {
		people: 'Who paid how much? (2 to 16 people)',
		name: 'Name',
		paid: 'Paid in €',
		nameLabel: (n) => `Name of person ${n}`,
		paidLabel: (name) => `Amount paid by ${name} in euros`,
		removeLabel: (name) => `Remove ${name}`,
		person: 'Person',
		add: 'Add a person',
		total: 'Paid in total',
		share: 'Share per person',
		shareRest: 'If cents are left over, the first people in the list pay 1 cent more.',
		transfers: (n) => (n === 1 ? '1 transfer' : `${n} transfers`),
		pays: 'pays',
		caption: 'Balance per person',
		balance: 'Balance',
		even: 'Everyone paid exactly their share. Nobody owes anything.',
		hint: 'Enter what each person paid. Anyone who paid nothing gets a 0.',
		invalid: 'At least one amount is not a valid number. It is marked.',
	},
};

// The example of the page text: shares of 100 euros each.
const EXAMPLE: Array<[string, string]> = EXAMPLE_NAMES.map((name, i) => [
	name,
	String((EXAMPLE_PAID_CENT[i] ?? 0) / 100),
]);

interface Row {
	id: number;
	name: string;
	paid: string;
}

// No storage and no account: inputs and result live in the browser only.
export default function SettleUp({ locale }: { locale: Locale }) {
	const t = TEXT[locale];
	const nextId = useRef(EXAMPLE.length);
	const [rows, setRows] = useState<Row[]>(EXAMPLE.map(([name, paid], id) => ({ id, name, paid })));

	const label = (row: Row, i: number) => row.name.trim() || `${t.person} ${i + 1}`;
	const update = (id: number, change: Partial<Row>) =>
		setRows(rows.map((r) => (r.id === id ? { ...r, ...change } : r)));

	const paid = rows.map((r) => parseCents(r.paid, locale));
	const valid = paid.every((x): x is number => x !== null);
	const paidCent = valid ? (paid as number[]) : [];
	const totalCent = paidCent.reduce((a, b) => a + b, 0);
	const shares = valid ? equalShares(totalCent, rows.length) : [];
	const balance = valid ? balances(paidCent) : [];
	const transfers = valid ? settle(balance) : [];
	const sign = (cent: number) => (cent > 0 ? `+${euro(cent, locale)}` : euro(cent, locale));

	return (
		<div className="pb-10 md:pb-14 md:grid md:grid-cols-12 md:gap-8">
			<div className="md:col-start-6 md:col-span-6 min-w-0">
				<fieldset className="m-0 mb-6 p-0 border-0 min-w-0">
					<legend className={`${mono} mb-3 p-0`}>{t.people}</legend>
					<div className={`${rowCls} mb-2`} aria-hidden="true">
						<span className={mono}>{t.name}</span>
						<span className={mono}>{t.paid}</span>
						<span />
					</div>
					<div className="flex flex-col gap-2">
						{rows.map((row, i) => (
							<div key={row.id} className={rowCls}>
								<input
									className={fieldCls}
									type="text"
									maxLength={40}
									autoComplete="off"
									value={row.name}
									placeholder={`${t.person} ${i + 1}`}
									aria-label={t.nameLabel(i + 1)}
									onChange={(e) => update(row.id, { name: e.target.value })}
								/>
								<input
									className={fieldCls}
									type="text"
									inputMode="decimal"
									autoComplete="off"
									value={row.paid}
									placeholder="0"
									aria-label={t.paidLabel(label(row, i))}
									aria-invalid={paid[i] === null ? true : undefined}
									onChange={(e) => update(row.id, { paid: e.target.value })}
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
						))}
					</div>
					<div className="mt-3">
						<button
							type="button"
							className={buttonCls}
							disabled={rows.length >= MAX_PEOPLE}
							onClick={() => {
								setRows([...rows, { id: nextId.current++, name: '', paid: '' }]);
							}}
						>
							{t.add}
						</button>
					</div>
				</fieldset>

				<div aria-live="polite" className="min-w-0">
					{!valid ? (
						<p className={`${mono} m-0`}>{t.invalid}</p>
					) : totalCent === 0 ? (
						<p className={`${mono} m-0`}>{t.hint}</p>
					) : (
						<>
							<p className="m-0 mb-1 text-[17px] leading-[1.5] text-(--text-2)">
								{t.total}: {euro(totalCent, locale)}
								<br />
								{t.share}: {euro(shares.at(-1) ?? 0, locale)}
							</p>
							{totalCent % rows.length !== 0 && <p className={`${mono} m-0 mb-4`}>{t.shareRest}</p>}
							{transfers.length === 0 ? (
								<p className="m-0 mt-4 text-[17px] leading-[1.5] text-(--text-2)">{t.even}</p>
							) : (
								<>
									<h3 className="font-display font-semibold m-0 mt-4 mb-3 text-[20px] leading-[1.2] tracking-[-0.02em]">
										{t.transfers(transfers.length)}
									</h3>
									<ol className="list-none m-0 mb-6 p-0">
										{transfers.map((tr) => (
											<li
												key={`${tr.from}-${tr.to}`}
												className="py-3 border-b border-[rgb(var(--ink-rgb)/0.1)] text-[17px] leading-[1.4] [overflow-wrap:anywhere]"
											>
												{label(rows[tr.from] as Row, tr.from)} {t.pays}{' '}
												{label(rows[tr.to] as Row, tr.to)}{' '}
												<span className="font-semibold whitespace-nowrap">
													{euro(tr.cent, locale)}
												</span>
											</li>
										))}
									</ol>
								</>
							)}
							<table className="w-full table-fixed border-collapse text-left text-[14px]">
								<caption className="sr-only">{t.caption}</caption>
								<thead>
									<tr>
										<th scope="col" className={`${cellCls} font-normal ${mono} w-[38%]`}>
											{t.person}
										</th>
										<th scope="col" className={`${cellCls} font-normal ${mono}`}>
											{t.paid}
										</th>
										<th scope="col" className={`${cellCls} font-normal ${mono}`}>
											{t.balance}
										</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((row, i) => (
										<tr key={row.id}>
											<th scope="row" className={`${cellCls} text-left font-normal`}>
												{label(row, i)}
											</th>
											<td className={cellCls}>{euro(paidCent[i] ?? 0, locale)}</td>
											<td className={cellCls}>{sign(balance[i] ?? 0)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
