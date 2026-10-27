'use client';

import { useState } from 'react';
import { euro, mieteAnteile, zahl } from './miete-rechner';

const feld = 'min-h-[44px] px-3 rounded border border-white/20 bg-transparent text-[#fafafa]';
const knopf =
	'inline-flex items-center justify-center min-h-[44px] px-6 rounded-full border border-white/20 bg-transparent text-[#fafafa] cursor-pointer hover:bg-white/10 transition-colors disabled:opacity-40';
const zelle = 'px-3 py-2 border-b border-white/10';
const mono = 'font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)]';

// Ohne Speicherung und Konto: Eingaben und Ergebnis leben nur im Browser.
export default function MieteRechner() {
	const [miete, setMiete] = useState('900');
	const [flaechen, setFlaechen] = useState(['12', '18', '24']);
	const [gemeinschaft, setGemeinschaft] = useState('18');

	const zimmer = flaechen.map(zahl).filter((m) => m > 0);
	const mieteCent = Math.round(zahl(miete) * 100);
	const ok = mieteCent > 0 && zimmer.length >= 2 && zimmer.length === flaechen.length;
	const anteile = ok ? mieteAnteile(mieteCent, zimmer, zahl(gemeinschaft)) : [];

	return (
		<div className="pb-10 md:pb-14 md:grid md:grid-cols-12 md:gap-8">
			<div className="md:col-start-6 md:col-span-6 min-w-0">
				<div className="mb-6 grid grid-cols-2 gap-3">
					<label className="flex flex-col gap-2">
						<span className={mono}>Miete im Monat in Euro</span>
						<input
							className={feld}
							type="text"
							inputMode="decimal"
							value={miete}
							onChange={(e) => setMiete(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className={mono}>Gemeinschaftsfläche in m²</span>
						<input
							className={feld}
							type="text"
							inputMode="decimal"
							value={gemeinschaft}
							onChange={(e) => setGemeinschaft(e.target.value)}
						/>
					</label>
				</div>
				<fieldset className="m-0 mb-6 p-0 border-0">
					<legend className={`${mono} mb-3 p-0`}>Zimmer in m² (2 bis 8)</legend>
					<div className="grid grid-cols-2 gap-3">
						{flaechen.map((f, i) => (
							<input
								key={i}
								className={feld}
								type="text"
								inputMode="decimal"
								value={f}
								aria-label={`Zimmer ${i + 1} in m²`}
								onChange={(e) =>
									setFlaechen(flaechen.map((x, j) => (j === i ? e.target.value : x)))
								}
							/>
						))}
					</div>
					<div className="mt-3 flex flex-wrap gap-3">
						<button
							type="button"
							className={knopf}
							disabled={flaechen.length >= 8}
							onClick={() => setFlaechen([...flaechen, ''])}
						>
							Zimmer hinzufügen
						</button>
						<button
							type="button"
							className={knopf}
							disabled={flaechen.length <= 2}
							onClick={() => setFlaechen(flaechen.slice(0, -1))}
						>
							Zimmer entfernen
						</button>
					</div>
				</fieldset>
			</div>

			<div className="md:col-span-12 min-w-0" aria-live="polite">
				{ok ? (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[540px] border-collapse text-left">
							<caption className="sr-only">Mietanteil je Zimmer</caption>
							<thead>
								<tr>
									<th scope="col" className={`${zelle} text-left font-normal`}>
										Zimmer
									</th>
									<th scope="col" className={`${zelle} text-left font-normal`}>
										Fläche
									</th>
									<th scope="col" className={`${zelle} text-left font-normal`}>
										Miete im Monat
									</th>
								</tr>
							</thead>
							<tbody>
								{zimmer.map((m, i) => (
									<tr key={i}>
										<th scope="row" className={`${zelle} text-left font-normal`}>
											Zimmer {i + 1}
										</th>
										<td className={zelle}>{m.toLocaleString('de-DE')} m²</td>
										<td className={zelle}>{euro(anteile[i] ?? 0)}</td>
									</tr>
								))}
								<tr>
									<th scope="row" className={`${zelle} text-left font-normal`}>
										Summe
									</th>
									<td className={zelle} />
									<td className={zelle}>{euro(mieteCent)}</td>
								</tr>
							</tbody>
						</table>
					</div>
				) : (
					<p className={`${mono} m-0`}>
						Tragt die Miete und für jedes Zimmer eine Fläche größer als 0 ein.
					</p>
				)}
			</div>
		</div>
	);
}
