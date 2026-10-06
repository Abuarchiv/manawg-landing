import { appUrl } from '@/lib/app-origin';
import { Fragment } from 'react';
import { type Row, type St, type Vals, css, press } from './dc';

const FLUT =
	'##5#####5###################4###3#3#####4#####5########44##5#5##5####45#313##6#42#433223#44#43211222122222333#211_1223#2';
const CELL =
	"display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:rgba(250,250,250,0.6)";

export function Intro() {
	return (
		<>
			<section aria-label="Intro" style={css('position:relative')}>
				<div style={css('position:sticky;top:0;width:1280px;height:800px')}>
					<canvas
						aria-hidden="true"
						style={css(
							'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:var(--g,1)',
						)}
					/>
					<canvas
						aria-hidden="true"
						style={css(
							'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:var(--f,0)',
						)}
					/>
					<canvas
						data-flood="1"
						aria-hidden="true"
						style={css(
							'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none',
						)}
					/>
				</div>
				<div style={css('height:6400px')} />
			</section>
		</>
	);
}

export function Flut() {
	return (
		<>
			<div
				aria-hidden="true"
				style={css(
					'display:grid;grid-template-columns:repeat(40,32px);grid-auto-rows:32px;background:#0A0A0A',
				)}
			>
				{[...FLUT].map((c, i) =>
					c === '#' ? (
						<div key={i} style={css('background:#FAFAFA')} />
					) : (
						<div key={i} style={css(CELL)}>
							{c === '_' ? '' : c}
						</div>
					),
				)}
			</div>
		</>
	);
}

export function SoGehts() {
	return (
		<>
			<section
				aria-labelledby="so-gehts"
				style={css(
					'position:relative;background:#0A0A0A;color:#FAFAFA;padding:96px 40px 120px;display:flex;flex-direction:column;gap:48px',
				)}
			>
				<h2
					data-sec="05"
					id="so-gehts"
					style={css(
						"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72;margin:0",
					)}
				>
					[ 05 ] SO GEHT’S
				</h2>
				<div
					style={css(
						'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid rgba(250,250,250,0.18)',
					)}
				>
					<div
						style={css(
							'padding:28px 28px 0 0;display:flex;flex-direction:column;gap:16px;border-right:1px solid rgba(250,250,250,0.18)',
						)}
					>
						<canvas
							data-art="ptext"
							data-glyph="1"
							data-w="340"
							data-h="150"
							data-text="01"
							data-fs="150"
							data-cs="8"
							data-font="mono"
							aria-hidden="true"
							style={css('width:340px;height:150px;display:block;')}
						/>
						<h3
							style={css(
								"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:30px;letter-spacing:-0.03em",
							)}
						>
							WG erstellen
						</h3>
						<p style={css('margin:0;font-size:16px;line-height:1.5;opacity:0.72')}>
							Namen eingeben. Mehr braucht es nicht.
						</p>
					</div>
					<div
						style={css(
							'padding:28px 28px 0 28px;display:flex;flex-direction:column;gap:16px;border-right:1px solid rgba(250,250,250,0.18)',
						)}
					>
						<canvas
							data-art="ptext"
							data-glyph="1"
							data-w="340"
							data-h="150"
							data-text="02"
							data-fs="150"
							data-cs="8"
							data-font="mono"
							aria-hidden="true"
							style={css('width:340px;height:150px;display:block;')}
						/>
						<h3
							style={css(
								"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:30px;letter-spacing:-0.03em",
							)}
						>
							Einladen
						</h3>
						<p style={css('margin:0;font-size:16px;line-height:1.5;opacity:0.72')}>
							Link teilen, die anderen treten bei.
						</p>
					</div>
					<div style={css('padding:28px 0 0 28px;display:flex;flex-direction:column;gap:16px;')}>
						<canvas
							data-art="ptext"
							data-glyph="1"
							data-w="340"
							data-h="150"
							data-text="03"
							data-fs="150"
							data-cs="8"
							data-font="mono"
							aria-hidden="true"
							style={css('width:340px;height:150px;display:block;')}
						/>
						<h3
							style={css(
								"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:30px;letter-spacing:-0.03em",
							)}
						>
							Eintragen
						</h3>
						<p style={css('margin:0;font-size:16px;line-height:1.5;opacity:0.72')}>
							Erste Ausgabe, erster Einkauf, erster Putztermin.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export function Koerper() {
	return (
		<>
			<section
				aria-labelledby="koerper-titel"
				style={css(
					'position:relative;height:760px;background:#0A0A0A;color:#FAFAFA;overflow:hidden',
				)}
			>
				<canvas
					data-art="physics"
					data-w="1280"
					data-h="760"
					aria-hidden="true"
					style={css('position:absolute;inset:0;width:1280px;height:760px;display:block')}
				/>
				<div
					style={css(
						'position:absolute;left:40px;top:48px;display:flex;flex-direction:column;gap:10px;pointer-events:none',
					)}
				>
					<span
						style={css(
							"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
						)}
					>
						[ ACHT KÖRPER ]
					</span>
					<h2
						id="koerper-titel"
						style={css(
							"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:40px;line-height:1.1;letter-spacing:-0.03em;margin:0",
						)}
					>
						Wirf sie. Sie finden zurück.
					</h2>
				</div>
			</section>
		</>
	);
}

export function Tiefe() {
	return (
		<>
			<section
				data-stick="1"
				aria-label="Funktionen"
				style={css('position:relative;height:3600px;background:#0A0A0A;color:#FAFAFA')}
			>
				<div style={css('position:sticky;top:0;height:800px;overflow:hidden')}>
					<canvas
						data-art="depth"
						data-w="1280"
						data-h="800"
						aria-hidden="true"
						style={css('position:absolute;inset:0;width:1280px;height:800px;display:block')}
					/>
					<div
						style={css(
							"position:absolute;top:72px;left:40px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72;pointer-events:none",
						)}
					>
						[ TIEFE ] WEITER SCROLLEN
					</div>
					<div
						data-dcap="0"
						style={css(
							'position:absolute;left:40px;bottom:72px;display:flex;flex-direction:column;gap:10px;opacity:0;pointer-events:none',
						)}
					>
						<span
							style={css(
								"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
							)}
						>
							01 · GELD
						</span>
						<span
							style={css(
								"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:44px;letter-spacing:-0.03em",
							)}
						>
							Wer zahlt, trägt ein. ManaWG teilt auf.
						</span>
					</div>
					<div
						data-dcap="1"
						style={css(
							'position:absolute;left:40px;bottom:72px;display:flex;flex-direction:column;gap:10px;opacity:0;pointer-events:none',
						)}
					>
						<span
							style={css(
								"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
							)}
						>
							02 · HAUSHALT
						</span>
						<span
							style={css(
								"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:44px;letter-spacing:-0.03em",
							)}
						>
							Einkauf, Vorräte, Putzplan.
						</span>
					</div>
					<div
						data-dcap="2"
						style={css(
							'position:absolute;left:40px;bottom:72px;display:flex;flex-direction:column;gap:10px;opacity:0;pointer-events:none',
						)}
					>
						<span
							style={css(
								"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
							)}
						>
							03 · ABSPRACHEN
						</span>
						<span
							style={css(
								"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:44px;letter-spacing:-0.03em",
							)}
						>
							Kalender, Pinnwand, Chat.
						</span>
					</div>
					<div
						style={css(
							"position:absolute;right:40px;bottom:28px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72;pointer-events:none",
						)}
					>
						{'TIEFE '}
						<span data-depth="1">000</span>
					</div>
				</div>
			</section>
		</>
	);
}

export function Bereiche({ v }: { v: Vals }) {
	return (
		<>
			<section
				aria-labelledby="bereiche-titel"
				style={css(
					'position:relative;height:800px;background:#0A0A0A;color:#FAFAFA;overflow:hidden',
				)}
			>
				<canvas
					data-art="planet"
					data-w="1280"
					data-h="800"
					aria-hidden="true"
					style={css('position:absolute;inset:0;width:1280px;height:800px;display:block')}
				/>
				<div
					style={css(
						'position:absolute;top:72px;left:40px;display:flex;flex-direction:column;gap:14px;pointer-events:none',
					)}
				>
					<span
						data-sec="06"
						id="bereiche"
						style={css(
							"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
						)}
					>
						[ 06 ] BEREICHE
					</span>
					<h2
						id="bereiche-titel"
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:64px;line-height:0.95;letter-spacing:-0.04em",
						)}
					>
						Acht Orte.
						<br />
						Eine WG.
					</h2>
					<span
						style={css(
							"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
						)}
					>
						ZIEHEN ZUM DREHEN · ORT ANKLICKEN
					</span>
				</div>
				<div
					style={css(
						'position:absolute;left:40px;bottom:48px;width:380px;display:flex;flex-direction:column;gap:14px;pointer-events:none',
					)}
				>
					<span
						style={css(
							"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
						)}
					>{`${v.plNo} · ${v.plName}`}</span>
					<span
						style={css(
							"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:32px;line-height:1.1;letter-spacing:-0.03em",
						)}
					>
						{v.plLine}
					</span>
					<div
						style={css(
							'background:#FFFFFF;color:#0A0A0A;border-radius:14px;padding:0 16px;min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px',
						)}
					>
						<div style={css('display:flex;flex-direction:column;gap:2px')}>
							<span style={css('font-size:14px;font-weight:500')}>{v.plTitle}</span>
							<span style={css('font-size:12px;color:#737373')}>{v.plDetail}</span>
						</div>
						<span style={css("font-family:'JetBrains Mono',monospace;font-size:13px")}>
							{v.plAmt}
						</span>
					</div>
				</div>
			</section>
		</>
	);
}

export function Installieren({ v, st }: { v: Vals; st: St }) {
	return (
		<>
			<section
				aria-labelledby="installieren-titel"
				style={css(
					'position:relative;height:800px;background:#0A0A0A;color:#FAFAFA;overflow:hidden',
				)}
			>
				<div
					style={css(
						'position:absolute;left:40px;top:96px;width:520px;display:flex;flex-direction:column;gap:24px',
					)}
				>
					<span
						data-sec="07"
						id="installieren"
						style={css(
							"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
						)}
					>
						[ 07 ] INSTALLIEREN
					</span>
					<h2
						id="installieren-titel"
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:72px;line-height:0.95;letter-spacing:-0.045em",
						)}
					>
						Auf den
						<br />
						Home-Bildschirm.
					</h2>
					<p style={css('margin:0;font-size:18px;line-height:1.5;opacity:0.72;max-width:420px')}>
						Ohne App Store, offlinefähig. app.manawg.com öffnen, dann:
					</p>
					<div
						style={css(
							'display:flex;gap:4px;border:1px solid rgba(250,250,250,0.18);border-radius:12px;padding:4px;align-self:flex-start',
						)}
					>
						{v.instTabs.map((it: Row, i: number) => (
							<Fragment key={i}>
								<div
									{...press(it.go)}
									aria-pressed={st.inst === i}
									style={css(
										`height:40px;padding:0 16px;display:flex;align-items:center;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;background:${it.bg};color:${it.col};white-space:nowrap`,
									)}
								>
									{it.label}
								</div>
							</Fragment>
						))}
					</div>
					<div
						style={css(
							'display:flex;flex-direction:column;border-top:1px solid rgba(250,250,250,0.18)',
						)}
					>
						{v.instSteps.map((sp: Row, i: number) => (
							<Fragment key={i}>
								<div
									data-istep={sp.i}
									style={css(
										'display:grid;grid-template-columns:48px minmax(0,1fr);align-items:baseline;border-bottom:1px solid rgba(250,250,250,0.18);padding:16px 0;opacity:0.35;transition:opacity 0.3s',
									)}
								>
									<span style={css("font-family:'JetBrains Mono',monospace;font-size:13px")}>
										{sp.n}
									</span>
									<span style={css('font-size:19px;font-weight:500')}>{sp.t}</span>
								</div>
							</Fragment>
						))}
					</div>
					<a
						href={appUrl('/')}
						style={css(
							'align-self:flex-start;height:48px;padding:0 24px;display:flex;align-items:center;background:#FAFAFA;color:#0A0A0A;border-radius:10px;font-size:16px;font-weight:500;cursor:pointer;white-space:nowrap;text-decoration:none',
						)}
					>
						App installieren
					</a>
				</div>
				<div
					aria-hidden="true"
					style={css(
						'position:absolute;left:620px;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center',
					)}
				>
					<div
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
								<span style={css("font-family:'JetBrains Mono',monospace;font-size:10px")}>
									100 %
								</span>
							</div>
							<div
								style={css(
									'height:46px;flex-shrink:0;display:flex;align-items:center;gap:8px;padding:0 10px',
								)}
							>
								<div
									style={css(
										"flex:1;height:32px;border-radius:10px;background:#F5F5F5;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:11px;color:#525252",
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
								<img
									src="/manawg-mark.svg"
									alt=""
									style={css('height:26px;align-self:flex-start')}
								/>
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
										<span style={css("font-family:'JetBrains Mono',monospace;font-size:12px")}>
											28,40 €
										</span>
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
								{v.sheetRows.map((r: Row, i: number) => (
									<Fragment key={i}>
										<div
											data-tgt={r.tgt}
											style={css(
												`height:46px;background:#FFFFFF;border-radius:10px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-size:14px;font-weight:${r.fw}`,
											)}
										>
											<span>{r.t}</span>
											<span
												style={css(
													"font-family:'JetBrains Mono',monospace;font-size:11px;color:#737373",
												)}
											>
												{r.k}
											</span>
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
								<span style={css('font-size:15px;font-weight:600')}>{v.dlgTitle}</span>
								<div style={css('display:flex;align-items:center;gap:12px')}>
									<img
										src="/icon-512.png"
										alt=""
										style={css('width:48px;height:48px;border-radius:12px;display:block')}
									/>
									<div style={css('display:flex;flex-direction:column;gap:2px')}>
										<span style={css('font-size:15px;font-weight:600')}>ManaWG</span>
										<span
											style={css(
												"font-family:'JetBrains Mono',monospace;font-size:10px;color:#737373",
											)}
										>
											app.manawg.com
										</span>
									</div>
								</div>
								<div
									style={css('display:flex;justify-content:flex-end;align-items:center;gap:14px')}
								>
									<span style={css('font-size:13px;color:#525252')}>Abbrechen</span>
									<div
										data-ins="dbtn"
										style={css(
											'height:36px;padding:0 14px;display:flex;align-items:center;background:#0A0A0A;color:#FAFAFA;border-radius:8px;font-size:13px;font-weight:500',
										)}
									>
										{v.dlgBtn}
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
		</>
	);
}

export function Fragen({ v }: { v: Vals }) {
	return (
		<>
			<section
				aria-labelledby="fragen"
				style={css(
					'position:relative;background:#0A0A0A;color:#FAFAFA;padding:96px 40px 120px;display:flex;flex-direction:column;gap:48px',
				)}
			>
				<h2
					data-sec="08"
					id="fragen"
					style={css(
						"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72;margin:0",
					)}
				>
					[ 08 ] FRAGEN
				</h2>
				<div
					style={css(
						'display:flex;flex-direction:column;border-bottom:1px solid rgba(250,250,250,0.18)',
					)}
				>
					{v.faqs.map((q: Row, i: number) => (
						<Fragment key={i}>
							<div
								{...press(q.toggle)}
								aria-expanded={q.open}
								style={css(
									'border-top:1px solid rgba(250,250,250,0.18);padding:26px 0;display:flex;flex-direction:column;gap:14px;cursor:pointer',
								)}
							>
								<div
									style={css(
										'display:flex;justify-content:space-between;align-items:baseline;gap:24px',
									)}
								>
									<span
										style={css(
											"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:32px;letter-spacing:-0.03em",
										)}
									>
										{q.q}
									</span>
									<span
										style={css(
											"font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:500",
										)}
									>
										{q.mark}
									</span>
								</div>
								{q.open && (
									<p
										style={css(
											'margin:0;font-size:17px;line-height:1.5;opacity:0.72;max-width:640px',
										)}
									>
										{q.a}
									</p>
								)}
							</div>
						</Fragment>
					))}
				</div>
			</section>
		</>
	);
}

export function Finale() {
	return (
		<>
			<section
				aria-labelledby="finale-titel"
				style={css(
					'position:relative;height:760px;background:#0A0A0A;color:#FAFAFA;overflow:hidden',
				)}
			>
				<canvas
					data-art="ascii"
					data-mode="sun"
					data-w="1280"
					data-h="760"
					aria-hidden="true"
					style={css('position:absolute;inset:0;width:1280px;height:760px;display:block')}
				/>
				<div
					style={css(
						'position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:32px;padding:0 40px;pointer-events:none',
					)}
				>
					<h2
						id="finale-titel"
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:200px;line-height:0.88;letter-spacing:-0.06em",
						)}
					>
						Alltag
						<br />
						teilen.
					</h2>
					<div style={css('display:flex;gap:8px;pointer-events:auto')}>
						<a
							href={appUrl('/neu?action=create')}
							style={css(
								'height:48px;padding:0 24px;display:flex;align-items:center;background:#FAFAFA;color:#0A0A0A;border-radius:10px;font-size:16px;font-weight:500;cursor:pointer;white-space:nowrap;flex-shrink:0;text-decoration:none',
							)}
						>
							WG erstellen
						</a>
						<a
							href={appUrl('/neu')}
							style={css(
								'height:48px;padding:0 24px;display:flex;align-items:center;border:1px solid rgba(250,250,250,0.3);background:#0A0A0A;border-radius:10px;font-size:16px;font-weight:500;cursor:pointer;white-space:nowrap;flex-shrink:0;text-decoration:none',
							)}
						>
							Einladung einlösen
						</a>
					</div>
				</div>
			</section>
		</>
	);
}

export function Fusszeile() {
	return (
		<>
			<footer
				style={css(
					'position:relative;background:#0A0A0A;color:#FAFAFA;padding:0 40px 0;display:flex;flex-direction:column',
				)}
			>
				<div
					style={css(
						'display:grid;grid-template-columns:minmax(0,2fr) repeat(3,minmax(0,1fr));border-top:1px dashed rgba(250,250,250,0.18);margin:0 -40px;position:relative;background:#0A0A0A',
					)}
				>
					<div style={css('padding:32px 40px 40px;display:flex;flex-direction:column;gap:12px')}>
						<div style={css('display:flex;align-items:center;gap:10px')}>
							<img src="/manawg-mark.svg" alt="" style={css('height:20px;filter:invert(1)')} />
							<span
								style={css(
									"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:19px;letter-spacing:-0.03em",
								)}
							>
								ManaWG
							</span>
						</div>
						<span style={css('font-size:14px;opacity:0.72')}>Die App für den WG-Alltag.</span>
						<span
							style={css(
								"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72;margin-top:32px",
							)}
						>
							© 2026 MANAWG
						</span>
					</div>
					<div
						style={css(
							'padding:32px 24px;border-left:1px dashed rgba(250,250,250,0.18);display:flex;flex-direction:column;gap:12px',
						)}
					>
						<span style={css('font-size:14px;font-weight:600')}>Produkt</span>
						<a
							href="#bereiche"
							data-go="06"
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							Funktionen
						</a>
						<a
							href="#so-gehts"
							data-go="05"
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							So geht’s
						</a>
						<a
							href="#fragen"
							data-go="08"
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							Fragen
						</a>
					</div>
					<div
						style={css(
							'padding:32px 24px;border-left:1px dashed rgba(250,250,250,0.18);display:flex;flex-direction:column;gap:12px',
						)}
					>
						<span style={css('font-size:14px;font-weight:600')}>Konto</span>
						<a
							href={appUrl('/neu?action=create')}
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							WG erstellen
						</a>
						<a
							href={appUrl('/neu')}
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							Einladung einlösen
						</a>
						<a
							href={appUrl('/')}
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							Anmelden
						</a>
					</div>
					<div
						style={css(
							'padding:32px 24px;border-left:1px dashed rgba(250,250,250,0.18);display:flex;flex-direction:column;gap:12px',
						)}
					>
						<span style={css('font-size:14px;font-weight:600')}>Rechtliches</span>
						<a
							href="/impressum"
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							Impressum
						</a>
						<a
							href="/datenschutz"
							style={css('font-size:14px;opacity:0.72;cursor:pointer;text-decoration:none')}
						>
							Datenschutz
						</a>
					</div>
				</div>
			</footer>
		</>
	);
}
