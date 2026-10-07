'use client';

import { appUrl } from '@/lib/app-origin';
import { Fragment, useEffect, useRef, useState } from 'react';
import { css, press } from '../../core/dc';
import s from './Installieren.module.css';
import { registerAblauf } from './ablauf';

// Erstfassung des Fundaments: Tabs, Schritte und Handy-Mock des Entwurfs. Das Paket INSTALL ersetzt
// Schritte und Handy durch die echten Abläufe.

const MONO = "font-family:'JetBrains Mono',monospace";
const WEGE: [string, string[]][] = [
	[
		'iPhone',
		['Teilen antippen.', '„Zum Home-Bildschirm“ wählen.', '„Hinzufügen“ antippen. Fertig.'],
	],
	[
		'Android',
		['Menü ⋮ antippen.', '„App installieren“ wählen.', '„Installieren“ antippen. Fertig.'],
	],
	[
		'Rechner',
		[
			'Installieren-Symbol in der Adressleiste klicken.',
			'„Installieren“ bestätigen.',
			'ManaWG startet als eigenes Fenster.',
		],
	],
];
const BLATT: [string, string][][] = [
	[
		['Kopieren', '⌘C'],
		['Zur Leseliste hinzufügen', ''],
		['Zum Home-Bildschirm', '+'],
		['Lesezeichen hinzufügen', ''],
	],
	[
		['Neuer Tab', ''],
		['Lesezeichen', '☆'],
		['App installieren', '+'],
		['Teilen', ''],
	],
	[
		['', ''],
		['', ''],
		['', ''],
		['', ''],
	],
];
const DLG_TITEL = ['Zum Home-Bildschirm', 'App installieren', 'App installieren?'];
const DLG_KNOPF = ['Hinzufügen', 'Installieren', 'Installieren'];

export function Installieren() {
	const [inst, setInst] = useState(0);
	const instRef = useRef(0);
	instRef.current = inst;
	const secRef = useRef<HTMLElement>(null);
	const frRef = useRef<HTMLDivElement>(null);
	useEffect(
		() =>
			registerAblauf(
				frRef.current as HTMLDivElement,
				secRef.current as HTMLElement,
				() => instRef.current,
			),
		[],
	);
	return (
		<section
			id="installieren"
			data-sec="installieren"
			tabIndex={-1}
			ref={secRef}
			aria-labelledby="installieren-titel"
			className={s.sektion}
		>
			<div className={s.text}>
				<span className="label">[ 07 ] INSTALLIEREN</span>
				<h2 id="installieren-titel" className={s.titel}>
					Auf den
					<br />
					Home-Bildschirm.
				</h2>
				<p className={s.lead}>Ohne App Store, offlinefähig. app.manawg.com öffnen, dann:</p>
				<div className={s.tabs}>
					{WEGE.map((w, i) => (
						<Fragment key={w[0]}>
							<div
								{...press(() => setInst(i))}
								className="tab"
								aria-pressed={inst === i}
								style={css(
									`background:${i === inst ? '#FAFAFA' : 'transparent'};color:${i === inst ? '#0A0A0A' : '#FAFAFA'}`,
								)}
							>
								{w[0]}
							</div>
						</Fragment>
					))}
				</div>
				<div className={s.schritte}>
					{(WEGE[inst] as [string, string[]])[1].map((t, i) => (
						<Fragment key={t}>
							<div data-istep={String(i)} className={s.schritt}>
								<span className={s.nr}>{`0${i + 1}`}</span>
								<span className={s.zeile}>{t}</span>
							</div>
						</Fragment>
					))}
				</div>
				<a
					href={appUrl('/')}
					className="cta cta--voll cta--gross"
					style={css('align-self:flex-start')}
				>
					App installieren
				</a>
			</div>
			<div aria-hidden="true" className={s.buehne}>
				<div
					ref={frRef}
					data-ins="frame"
					style={css(
						'position:relative;width:300px;height:620px;box-sizing:border-box;padding:10px;background:#0A0A0A;border:1px solid rgba(250,250,250,0.3);border-radius:46px;box-shadow:0 0 120px rgba(250,250,250,0.08);transition:width 0.6s cubic-bezier(0.2,0.8,0.2,1),height 0.6s cubic-bezier(0.2,0.8,0.2,1),border-radius 0.6s',
					)}
				>
					<div
						data-ins="screen"
						style={css(
							'position:relative;width:100%;height:100%;border-radius:36px;overflow:hidden;background:#FFFFFF;color:#0A0A0A;display:flex;flex-direction:column;font-family:Inter,sans-serif;transition:border-radius 0.6s',
						)}
					>
						<div
							data-ins="status"
							style={css(
								'height:34px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font-size:12px;font-weight:600',
							)}
						>
							<span>9:41</span>
							<span style={css(`${MONO};font-size:10px`)}>100 %</span>
						</div>
						<div
							style={css(
								'height:46px;flex-shrink:0;display:flex;align-items:center;gap:8px;padding:0 10px',
							)}
						>
							<div
								style={css(
									`flex:1;height:32px;border-radius:10px;background:#F5F5F5;display:flex;align-items:center;justify-content:center;${MONO};font-size:11px;color:#525252`,
								)}
							>
								app.manawg.com
							</div>
							<div
								data-ins="dicon"
								style={css(
									'display:none;width:26px;height:26px;box-sizing:border-box;border:1.5px solid #0A0A0A;border-radius:7px;align-items:center;justify-content:center;font-size:15px;font-weight:600;line-height:1',
								)}
							>
								+
							</div>
							<div
								data-ins="amenu"
								style={css(
									'display:none;width:26px;height:32px;align-items:center;justify-content:center;font-size:20px;font-weight:700;line-height:1',
								)}
							>
								⋮
							</div>
						</div>
						<div
							style={css(
								'flex:1;min-height:0;padding:20px 18px;display:flex;flex-direction:column;gap:14px',
							)}
						>
							<img src="/manawg-mark.svg" alt="" style={css('height:26px;align-self:flex-start')} />
							<span
								style={css(
									"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:26px;line-height:1;letter-spacing:-0.03em",
								)}
							>
								Die App
								<br />
								für eure WG.
							</span>
							<div style={css('border:1px solid #E5E5E5;border-radius:12px;padding:0 12px')}>
								<div
									style={css(
										'min-height:48px;display:flex;align-items:center;justify-content:space-between;font-size:13px',
									)}
								>
									<span>Pizzaabend</span>
									<span style={css(`${MONO};font-size:12px`)}>28,40 €</span>
								</div>
								<div
									style={css(
										'min-height:48px;display:flex;align-items:center;font-size:13px;border-top:1px solid #E5E5E5',
									)}
								>
									Hafermilch
								</div>
							</div>
						</div>
						<div
							data-ins="ibar"
							style={css(
								'height:50px;flex-shrink:0;border-top:1px solid #E5E5E5;display:flex;align-items:center;justify-content:space-around;font-size:20px;color:#0A0A0A',
							)}
						>
							<span>‹</span>
							<span style={css('color:#D4D4D4')}>›</span>
							<div
								data-ins="share"
								style={css(
									'width:22px;height:22px;box-sizing:border-box;border:1.5px solid #0A0A0A;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700',
								)}
							>
								↑
							</div>
							<span style={css('font-size:16px')}>⧉</span>
						</div>
						<div
							data-ins="sheet"
							style={css(
								'position:absolute;left:0;right:0;bottom:0;background:#F5F5F5;border-radius:20px 20px 0 0;padding:12px 12px 22px;transform:translateY(105%);box-shadow:0 -10px 40px rgba(10,10,10,0.12)',
							)}
						>
							<div
								style={css(
									'width:36px;height:4px;border-radius:2px;background:#D4D4D4;margin:0 auto 12px',
								)}
							/>
							{(BLATT[inst] as [string, string][]).map((r, i) => (
								<Fragment key={i}>
									<div
										data-tgt={i === 2 ? '2' : ''}
										style={css(
											`height:46px;background:#FFFFFF;border-radius:10px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-size:14px;font-weight:${i === 2 ? '600' : '400'}`,
										)}
									>
										<span>{r[0]}</span>
										<span style={css(`${MONO};font-size:11px;color:#737373`)}>{r[1]}</span>
									</div>
								</Fragment>
							))}
						</div>
						<div
							data-ins="dlg"
							style={css(
								'position:absolute;left:14px;right:14px;top:32%;background:#FFFFFF;border:1px solid #E5E5E5;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 60px rgba(10,10,10,0.2);opacity:0',
							)}
						>
							<span style={css('font-size:15px;font-weight:600')}>{DLG_TITEL[inst]}</span>
							<div style={css('display:flex;align-items:center;gap:12px')}>
								<img
									src="/icon-512.png"
									alt=""
									style={css('width:48px;height:48px;border-radius:12px;display:block')}
								/>
								<div style={css('display:flex;flex-direction:column;gap:2px')}>
									<span style={css('font-size:15px;font-weight:600')}>ManaWG</span>
									<span style={css(`${MONO};font-size:10px;color:#737373`)}>app.manawg.com</span>
								</div>
							</div>
							<div style={css('display:flex;justify-content:flex-end;align-items:center;gap:14px')}>
								<span style={css('font-size:13px;color:#525252')}>Abbrechen</span>
								<div
									data-ins="dbtn"
									style={css(
										'height:36px;padding:0 14px;display:flex;align-items:center;background:#0A0A0A;color:#FAFAFA;border-radius:8px;font-size:13px;font-weight:500',
									)}
								>
									{DLG_KNOPF[inst]}
								</div>
							</div>
						</div>
						<div
							data-ins="home"
							style={css(
								'position:absolute;inset:0;background:#0A0A0A;opacity:0;padding:56px 16px;box-sizing:border-box;display:grid;grid-template-columns:repeat(4,1fr);gap:18px 8px;align-content:start;justify-items:center',
							)}
						>
							{Array.from({ length: 16 }, (_, i) => (
								<Fragment key={i}>
									{i === 1 ? (
										<div
											data-ins="micon"
											style={css(
												'display:flex;flex-direction:column;align-items:center;gap:6px;transform:scale(0)',
											)}
										>
											<img
												src="/icon-512.png"
												alt="ManaWG"
												style={css('width:52px;height:52px;border-radius:14px;display:block')}
											/>
											<span style={css('font-size:10px;color:#FAFAFA;white-space:nowrap')}>
												ManaWG
											</span>
										</div>
									) : (
										<div
											style={css('display:flex;flex-direction:column;align-items:center;gap:8px')}
										>
											<span
												style={css(
													'width:52px;height:52px;border-radius:14px;background:#262626;display:block',
												)}
											/>
											<span
												style={css(
													'width:30px;height:5px;border-radius:3px;background:#262626;display:block',
												)}
											/>
										</div>
									)}
								</Fragment>
							))}
						</div>
						<div
							data-ins="tap"
							style={css(
								'position:absolute;left:0;top:0;width:34px;height:34px;border-radius:50%;background:#FAFAFA;mix-blend-mode:difference;opacity:0;pointer-events:none',
							)}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
