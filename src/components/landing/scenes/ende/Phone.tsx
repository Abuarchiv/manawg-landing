'use client';

import { Fragment, useState } from 'react';
import { Dc, css, press } from '../../core/dc';

// Erstfassung des Fundaments: das Handy des Entwurfs mit eigenem Zustand. Das Paket APP ersetzt den
// Bildschirm durch die echte App. Die Hülle liegt im Ende-Raum bei 650/90, 300 x 620.

const TABS = ['Start', 'Haushalt', 'Finanzen', 'Austausch'];
const TITEL = ['WG Lindenstraße', 'Haushalt', 'Finanzen', 'Austausch'];
const ARTIKEL: [string, string][] = [
	['Hafermilch', '2 Packungen · von Mika'],
	['Bananen', '6 Stück · von Lea'],
	['Spülmittel', '1 Flasche · von Jona'],
	['Toilettenpapier', '2 Packungen · Vorrat 1'],
];
const MONO = "font-family:'JetBrains Mono',monospace";

export function Phone() {
	const [tab, setTab] = useState(0);
	const [done, setDone] = useState<Record<string, boolean>>({ Spülmittel: true });
	const [added, setAdded] = useState(false);
	const [replied, setReplied] = useState(false);

	const offen = ARTIKEL.filter((x) => !done[x[0] as string]).length;
	const ausgaben: [string, string, string][] = [
		['Pizzaabend', 'Mika bezahlt · durch 4', '28,40 €'],
		['Internet', 'Fixkosten · monatlich', '29,99 €'],
		['Wocheneinkauf', 'Lina bezahlt · durch 4', '18,90 €'],
	];
	if (added) ausgaben.unshift(['Kinoabend', 'Jona bezahlt · Jona und Lea', '24,00 €']);
	const saldo = added ? '12,00 €' : '0,00 €';
	const saldoText = added ? 'Lea gibt Jona 12,00 €.' : 'Diesen Monat ist alles ausgeglichen.';
	const letzte = added ? 'Jona hat 24,00 € ausgelegt.' : 'Lina hat 18,90 € ausgelegt.';
	const offenText = offen ? `${offen} Dinge stehen auf der Liste.` : 'Die Liste ist leer.';

	return (
		<div
			data-cta="1"
			// biome-ignore lint/a11y/useSemanticElements: div bleibt div (gleiche Box, kein fieldset)
			role="group"
			aria-label="ManaWG zum Ausprobieren"
			style={css(
				'position:absolute;left:650px;top:90px;width:300px;height:620px;pointer-events:none',
			)}
		>
			<div
				style={css(
					'position:relative;width:100%;height:100%;box-sizing:border-box;background:linear-gradient(145deg,#525252 0%,#171717 18%,#0A0A0A 50%,#262626 82%,#737373 100%);border-radius:48px;padding:11px;box-shadow:inset 0 0 0 1px rgba(250,250,250,0.35),inset 0 0 0 3px #0A0A0A,0 50px 120px rgba(0,0,0,0.7),0 0 90px rgba(250,250,250,0.1)',
				)}
			>
				<span
					style={css(
						'position:absolute;left:-3px;top:118px;width:3px;height:30px;border-radius:2px 0 0 2px;background:linear-gradient(90deg,#737373,#262626)',
					)}
				/>
				<span
					style={css(
						'position:absolute;left:-3px;top:164px;width:3px;height:52px;border-radius:2px 0 0 2px;background:linear-gradient(90deg,#737373,#262626)',
					)}
				/>
				<span
					style={css(
						'position:absolute;left:-3px;top:226px;width:3px;height:52px;border-radius:2px 0 0 2px;background:linear-gradient(90deg,#737373,#262626)',
					)}
				/>
				<span
					style={css(
						'position:absolute;right:-3px;top:180px;width:3px;height:80px;border-radius:0 2px 2px 0;background:linear-gradient(270deg,#737373,#262626)',
					)}
				/>
				<div
					style={css(
						'position:relative;width:100%;height:100%;background:#FFFFFF;border-radius:37px;overflow:hidden;display:flex;flex-direction:column;color:#0A0A0A;font-family:Inter,sans-serif;text-align:left;box-shadow:0 0 0 1px #000',
					)}
				>
					<span
						style={css(
							'position:absolute;inset:0;border-radius:37px;background:linear-gradient(118deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(255,255,255,0.08) 100%);pointer-events:none;z-index:5',
						)}
					/>
					<div
						style={css(
							'height:40px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font-size:13px;font-weight:600',
						)}
					>
						<span>9:41</span>
						<span
							style={css(
								'width:92px;height:26px;border-radius:999px;background:#0A0A0A;box-shadow:inset 0 0 0 1px #171717',
							)}
						/>
						<span style={css(`${MONO};font-size:11px;font-weight:500`)}>100 %</span>
					</div>
					<div
						style={css(
							'padding:4px 16px 12px;display:flex;align-items:center;gap:8px;flex-shrink:0',
						)}
					>
						<img src="/manawg-mark.svg" alt="" style={css('height:15px')} />
						<span
							style={css(
								"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:18px;letter-spacing:-0.02em",
							)}
						>
							{TITEL[tab]}
						</span>
					</div>
					<div
						style={css(
							'flex:1;min-height:0;overflow:hidden;padding:0 14px;display:flex;flex-direction:column;gap:8px',
						)}
					>
						{tab === 0 && (
							<>
								<div
									style={css(
										'border:1px solid #E5E5E5;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:6px',
									)}
								>
									<span
										style={css(
											`${MONO};font-size:11px;font-weight:500;letter-spacing:0.08em;color:#737373`,
										)}
									>
										MÄRZ · 4 PERSONEN
									</span>
									<span style={css(`${MONO};font-size:28px;font-weight:500`)}>{saldo}</span>
									<span style={css('font-size:13px;color:#525252')}>{saldoText}</span>
								</div>
								<div
									style={css(
										'border:1px solid #E5E5E5;border-radius:14px;padding:0 14px;display:flex;flex-direction:column',
									)}
								>
									<div
										style={css(
											'min-height:56px;display:flex;flex-direction:column;justify-content:center;gap:2px',
										)}
									>
										<span style={css('font-size:14px;font-weight:500')}>Bad ist heute dran.</span>
										<span style={css('font-size:12px;color:#737373')}>Lea · heute</span>
									</div>
									<div
										style={css(
											'min-height:56px;display:flex;flex-direction:column;justify-content:center;gap:2px;border-top:1px solid #E5E5E5',
										)}
									>
										<span style={css('font-size:14px;font-weight:500')}>{letzte}</span>
										<span style={css('font-size:12px;color:#737373')}>gerade eben</span>
									</div>
									<div
										style={css(
											'min-height:56px;display:flex;flex-direction:column;justify-content:center;gap:2px;border-top:1px solid #E5E5E5',
										)}
									>
										<span style={css('font-size:14px;font-weight:500')}>{offenText}</span>
										<span style={css('font-size:12px;color:#737373')}>Einkauf</span>
									</div>
								</div>
							</>
						)}
						{tab === 1 && (
							<>
								<span
									style={css(
										`${MONO};font-size:11px;font-weight:500;letter-spacing:0.08em;color:#737373;padding:4px 2px`,
									)}
								>{`EINKAUF · ${offen} OFFEN`}</span>
								<div
									style={css(
										'border:1px solid #E5E5E5;border-radius:14px;padding:0 14px;display:flex;flex-direction:column',
									)}
								>
									{ARTIKEL.map((it, i) => {
										const d = !!done[it[0]];
										return (
											<Fragment key={it[0]}>
												<Dc
													as="div"
													style={`min-height:56px;display:flex;align-items:center;gap:12px;border-top:${i ? '1px solid #E5E5E5' : '0'};cursor:pointer`}
													active="transform:scale(0.97)"
													{...press(() => setDone((s) => ({ ...s, [it[0]]: !s[it[0]] })))}
													aria-pressed={d}
												>
													<span
														style={css(
															`width:20px;height:20px;box-sizing:border-box;border-radius:6px;border:1px solid ${d ? '#0A0A0A' : '#D4D4D4'};background:${d ? '#0A0A0A' : 'transparent'};color:#FFFFFF;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0`,
														)}
													>
														{d ? '✓' : ''}
													</span>
													<div style={css('display:flex;flex-direction:column;gap:2px')}>
														<span
															style={css(
																`font-size:14px;font-weight:500;text-decoration:${d ? 'line-through' : 'none'};color:${d ? '#737373' : '#0A0A0A'}`,
															)}
														>
															{it[0]}
														</span>
														<span style={css('font-size:12px;color:#737373')}>{it[1]}</span>
													</div>
												</Dc>
											</Fragment>
										);
									})}
								</div>
							</>
						)}
						{tab === 2 && (
							<>
								<Dc
									as="div"
									style="height:44px;border:1px solid #0A0A0A;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:500;cursor:pointer"
									active="transform:scale(0.97)"
									{...press(() => setAdded((a) => !a))}
								>
									{added ? 'Kinoabend entfernen' : 'Ausgabe erfassen'}
								</Dc>
								<div
									style={css(
										'border:1px solid #E5E5E5;border-radius:14px;padding:0 14px;display:flex;flex-direction:column',
									)}
								>
									{ausgaben.map((x, i) => (
										<Fragment key={x[0]}>
											<div
												style={css(
													`min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:${i ? '1px solid #E5E5E5' : '0'}`,
												)}
											>
												<div style={css('display:flex;flex-direction:column;gap:2px')}>
													<span style={css('font-size:14px;font-weight:500')}>{x[0]}</span>
													<span style={css('font-size:12px;color:#737373')}>{x[1]}</span>
												</div>
												<span style={css(`${MONO};font-size:13px;font-weight:500`)}>{x[2]}</span>
											</div>
										</Fragment>
									))}
								</div>
							</>
						)}
						{tab === 3 && (
							<>
								<div
									style={css(
										'border:1px solid #E5E5E5;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:4px',
									)}
								>
									<span
										style={css(
											`${MONO};font-size:11px;font-weight:500;letter-spacing:0.08em;color:#737373`,
										)}
									>
										PINNWAND · JONA
									</span>
									<span style={css('font-size:15px;font-weight:600')}>Übergabe am Freitag</span>
									<span style={css('font-size:13px;color:#525252')}>
										Schlüssel liegen im Flur bereit.
									</span>
								</div>
								<div
									style={css(
										'align-self:flex-start;max-width:80%;background:#F5F5F5;border-radius:14px;padding:10px 12px;font-size:13px',
									)}
								>
									Bin um acht wieder da.
									<div style={css('font-size:11px;color:#737373;margin-top:2px')}>Lea</div>
								</div>
								<Dc
									as="div"
									style="align-self:flex-end;max-width:80%;border:1px solid #E5E5E5;border-radius:14px;padding:10px 12px;font-size:13px;cursor:pointer"
									active="transform:scale(0.97)"
									{...press(() => setReplied((r) => !r))}
								>
									{replied ? 'Passt, ich bin auch da.' : 'Antworten …'}
								</Dc>
							</>
						)}
					</div>
					<div
						style={css(
							'margin:8px 12px 12px;border:1px solid #E5E5E5;border-radius:20px;padding:4px;display:flex;gap:2px;flex-shrink:0',
						)}
					>
						{TABS.map((label, i) => (
							<Fragment key={label}>
								<Dc
									as="div"
									style={`flex:1;height:44px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:${i === tab ? '#F5F5F5' : 'transparent'};border:${i === tab ? '1px solid #E5E5E5' : '1px solid transparent'};color:${i === tab ? '#0A0A0A' : '#525252'};cursor:pointer`}
									active="transform:scale(0.97)"
									{...press(() => setTab(i))}
									aria-pressed={tab === i}
								>
									{label}
								</Dc>
							</Fragment>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
