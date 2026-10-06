import { appUrl } from '@/lib/app-origin';
import { Fragment } from 'react';
import { Dc, type Row, type St, type Vals, css, press } from './dc';

export function HeroTitel() {
	return (
		<>
			<div
				style={css(
					'position:absolute;inset:0;z-index:2;pointer-events:none;opacity:calc(1 - var(--p,0) * 14)',
				)}
			>
				<canvas
					data-art="stars"
					data-w="1280"
					data-h="800"
					aria-hidden="true"
					style={css(
						'position:absolute;inset:0;width:1280px;height:800px;display:block;pointer-events:none',
					)}
				/>
				<div
					style={css(
						'position:absolute;left:40px;bottom:64px;display:flex;flex-direction:column;gap:12px;color:#FAFAFA',
					)}
				>
					<h1
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:80px;line-height:0.92;letter-spacing:-0.05em",
						)}
					>
						Die App
						<br />
						für eure WG.
					</h1>
				</div>
			</div>
		</>
	);
}

export function Kopf() {
	return (
		<>
			<header
				style={css(
					'position:absolute;top:28px;left:40px;right:40px;display:flex;align-items:center;justify-content:space-between;pointer-events:none',
				)}
			>
				<div style={css('display:flex;align-items:center;gap:10px')}>
					<img src="/manawg-mark.svg" alt="" style={css('height:22px;filter:invert(1)')} />
					<span
						style={css(
							"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:20px;letter-spacing:-0.03em",
						)}
					>
						ManaWG
					</span>
				</div>
				<a
					href={appUrl('/neu?action=create')}
					style={css(
						'height:40px;padding:0 16px;display:flex;align-items:center;border:1px solid rgba(250,250,250,0.6);color:#FAFAFA;border-radius:10px;font-size:14px;font-weight:500;pointer-events:auto;cursor:pointer;text-decoration:none',
					)}
				>
					WG erstellen
				</a>
			</header>
		</>
	);
}

export function Raeume() {
	return (
		<>
			<section
				aria-label="Die Wohnung"
				style={css(
					'position:absolute;left:40px;top:150px;width:440px;height:520px;pointer-events:none;color:#FAFAFA',
				)}
			>
				<div
					style={css(
						'position:absolute;inset:0;display:flex;flex-direction:column;gap:20px;opacity:var(--c0,0);transform:translateY(calc((1 - var(--c0,0)) * 40px));filter:blur(calc((1 - var(--c0,0)) * 6px))',
					)}
				>
					<div
						style={css(
							"display:flex;align-items:baseline;gap:16px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em",
						)}
					>
						<span>01 / 04</span>
						<span style={css('opacity:0.72')}>KÜCHE</span>
					</div>
					<div style={css('height:1px;background:rgba(250,250,250,0.18)')} />
					<h2
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:64px;line-height:0.94;letter-spacing:-0.045em",
						)}
					>
						Einkäufe & Vorräte
					</h2>
					<p
						style={css(
							'margin:0;font-size:17px;line-height:1.5;color:rgba(250,250,250,0.72);max-width:380px;text-wrap:pretty',
						)}
					>
						Eine Liste für alle. Wer einkauft, hakt ab, der Vorrat zählt mit.
					</p>
					<div
						style={css(
							'display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid rgba(250,250,250,0.18);border-bottom:1px solid rgba(250,250,250,0.18);padding:14px 0;margin-top:8px',
						)}
					>
						<div style={css('display:flex;flex-direction:column;gap:4px')}>
							<span style={css('font-size:15px;font-weight:500')}>Hafermilch</span>
							<span style={css('font-size:13px;color:rgba(250,250,250,0.72)')}>
								2 Packungen · von Mika
							</span>
						</div>
						<span
							style={css("font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500")}
						/>
					</div>
				</div>
				<div
					style={css(
						'position:absolute;inset:0;display:flex;flex-direction:column;gap:20px;opacity:var(--c1,0);transform:translateY(calc((1 - var(--c1,0)) * 40px));filter:blur(calc((1 - var(--c1,0)) * 6px))',
					)}
				>
					<div
						style={css(
							"display:flex;align-items:baseline;gap:16px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em",
						)}
					>
						<span>02 / 04</span>
						<span style={css('opacity:0.72')}>WOHNZIMMER</span>
					</div>
					<div style={css('height:1px;background:rgba(250,250,250,0.18)')} />
					<h2
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:64px;line-height:0.94;letter-spacing:-0.045em",
						)}
					>
						Ausgaben & Fixkosten
					</h2>
					<p
						style={css(
							'margin:0;font-size:17px;line-height:1.5;color:rgba(250,250,250,0.72);max-width:380px;text-wrap:pretty',
						)}
					>
						Jede Ausgabe in unter zehn Sekunden erfasst. Die Salden rechnet ManaWG.
					</p>
					<div
						style={css(
							'display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid rgba(250,250,250,0.18);border-bottom:1px solid rgba(250,250,250,0.18);padding:14px 0;margin-top:8px',
						)}
					>
						<div style={css('display:flex;flex-direction:column;gap:4px')}>
							<span style={css('font-size:15px;font-weight:500')}>Pizzaabend</span>
							<span style={css('font-size:13px;color:rgba(250,250,250,0.72)')}>
								Mika bezahlt · durch 4
							</span>
						</div>
						<span
							style={css("font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500")}
						>
							28,40 €
						</span>
					</div>
				</div>
				<div
					style={css(
						'position:absolute;inset:0;display:flex;flex-direction:column;gap:20px;opacity:var(--c2,0);transform:translateY(calc((1 - var(--c2,0)) * 40px));filter:blur(calc((1 - var(--c2,0)) * 6px))',
					)}
				>
					<div
						style={css(
							"display:flex;align-items:baseline;gap:16px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em",
						)}
					>
						<span>03 / 04</span>
						<span style={css('opacity:0.72')}>BAD</span>
					</div>
					<div style={css('height:1px;background:rgba(250,250,250,0.18)')} />
					<h2
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:64px;line-height:0.94;letter-spacing:-0.045em",
						)}
					>
						Putzplan
					</h2>
					<p
						style={css(
							'margin:0;font-size:17px;line-height:1.5;color:rgba(250,250,250,0.72);max-width:380px;text-wrap:pretty',
						)}
					>
						Aufgaben rotieren von selbst. Die App erinnert, sie mahnt nicht.
					</p>
					<div
						style={css(
							'display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid rgba(250,250,250,0.18);border-bottom:1px solid rgba(250,250,250,0.18);padding:14px 0;margin-top:8px',
						)}
					>
						<div style={css('display:flex;flex-direction:column;gap:4px')}>
							<span style={css('font-size:15px;font-weight:500')}>Bad ist heute dran.</span>
							<span style={css('font-size:13px;color:rgba(250,250,250,0.72)')}>Lea · heute</span>
						</div>
						<span
							style={css("font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500")}
						/>
					</div>
				</div>
				<div
					style={css(
						'position:absolute;inset:0;display:flex;flex-direction:column;gap:20px;opacity:var(--c3,0);transform:translateY(calc((1 - var(--c3,0)) * 40px));filter:blur(calc((1 - var(--c3,0)) * 6px))',
					)}
				>
					<div
						style={css(
							"display:flex;align-items:baseline;gap:16px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em",
						)}
					>
						<span>04 / 04</span>
						<span style={css('opacity:0.72')}>FLUR</span>
					</div>
					<div style={css('height:1px;background:rgba(250,250,250,0.18)')} />
					<h2
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:64px;line-height:0.94;letter-spacing:-0.045em",
						)}
					>
						Pinnwand & Chat
					</h2>
					<p
						style={css(
							'margin:0;font-size:17px;line-height:1.5;color:rgba(250,250,250,0.72);max-width:380px;text-wrap:pretty',
						)}
					>
						Absprachen an einem Ort statt in drei Chats und auf Zetteln.
					</p>
					<div
						style={css(
							'display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid rgba(250,250,250,0.18);border-bottom:1px solid rgba(250,250,250,0.18);padding:14px 0;margin-top:8px',
						)}
					>
						<div style={css('display:flex;flex-direction:column;gap:4px')}>
							<span style={css('font-size:15px;font-weight:500')}>Übergabe am Freitag</span>
							<span style={css('font-size:13px;color:rgba(250,250,250,0.72)')}>
								Jona · Schlüssel liegen im Flur
							</span>
						</div>
						<span
							style={css("font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500")}
						/>
					</div>
				</div>
			</section>
		</>
	);
}

export function Hinweise() {
	return (
		<>
			<Dc
				as="a"
				style="position:absolute;left:40px;bottom:28px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;cursor:pointer;opacity:calc(0.72 - var(--e,0));z-index:3;text-decoration:none"
				hover="opacity:1"
				data-go="05"
				data-scr="1"
				href="#so-gehts"
			>
				INTRO ÜBERSPRINGEN ↓
			</Dc>

			<div
				aria-hidden="true"
				style={css(
					"position:absolute;right:40px;bottom:28px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:calc(0.72 - var(--p,0) * 10);pointer-events:none;z-index:3",
				)}
			>
				SCROLLEN
			</div>
		</>
	);
}

export function Lader() {
	return (
		<>
			<div
				data-loader="1"
				aria-hidden="true"
				style={css(
					'position:absolute;inset:0;z-index:6;background:#0A0A0A;color:#FAFAFA;display:flex;flex-direction:column;justify-content:flex-end;gap:16px;padding:40px;transition:opacity 0.7s ease',
				)}
			>
				<span
					data-count="1"
					style={css(
						"font-family:'JetBrains Mono',monospace;font-size:176px;font-weight:500;line-height:0.9;letter-spacing:-0.05em",
					)}
				>
					000
				</span>
				<div
					style={css('display:flex;justify-content:space-between;align-items:baseline;gap:24px')}
				>
					<span
						data-bar="1"
						style={css(
							"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;white-space:pre",
						)}
					>
						........................................
					</span>
					<span
						style={css(
							"font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.08em;opacity:0.72",
						)}
					>
						MANAWG · LÄDT DIE WG
					</span>
				</div>
			</div>
		</>
	);
}

export function Ende({ v, st }: { v: Vals; st: St }) {
	return (
		<>
			<section
				data-endov="1"
				aria-label="App-Vorschau"
				style={css(
					'position:absolute;inset:0;opacity:var(--e,0);pointer-events:none;background:#0A0A0A',
				)}
			>
				<canvas
					data-hand="back"
					aria-hidden="true"
					style={css('position:absolute;inset:0;width:100%;height:100%;display:block')}
				/>
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
								<span
									style={css(
										"font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500",
									)}
								>
									100 %
								</span>
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
									{v.tabTitle}
								</span>
							</div>
							<div
								style={css(
									'flex:1;min-height:0;overflow:hidden;padding:0 14px;display:flex;flex-direction:column;gap:8px',
								)}
							>
								{v.isStart && (
									<>
										<div
											style={css(
												'border:1px solid #E5E5E5;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:6px',
											)}
										>
											<span
												style={css(
													"font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;color:#737373",
												)}
											>
												MÄRZ · 4 PERSONEN
											</span>
											<span
												style={css(
													"font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:500",
												)}
											>
												{v.saldo}
											</span>
											<span style={css('font-size:13px;color:#525252')}>{v.saldoText}</span>
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
												<span style={css('font-size:14px;font-weight:500')}>
													Bad ist heute dran.
												</span>
												<span style={css('font-size:12px;color:#737373')}>Lea · heute</span>
											</div>
											<div
												style={css(
													'min-height:56px;display:flex;flex-direction:column;justify-content:center;gap:2px;border-top:1px solid #E5E5E5',
												)}
											>
												<span style={css('font-size:14px;font-weight:500')}>{v.lastAct}</span>
												<span style={css('font-size:12px;color:#737373')}>gerade eben</span>
											</div>
											<div
												style={css(
													'min-height:56px;display:flex;flex-direction:column;justify-content:center;gap:2px;border-top:1px solid #E5E5E5',
												)}
											>
												<span style={css('font-size:14px;font-weight:500')}>{v.openText}</span>
												<span style={css('font-size:12px;color:#737373')}>Einkauf</span>
											</div>
										</div>
									</>
								)}
								{v.isHaus && (
									<>
										<span
											style={css(
												"font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;color:#737373;padding:4px 2px",
											)}
										>
											EINKAUF · {v.openCount} OFFEN
										</span>
										<div
											style={css(
												'border:1px solid #E5E5E5;border-radius:14px;padding:0 14px;display:flex;flex-direction:column',
											)}
										>
											{v.items.map((it: Row, i: number) => (
												<Fragment key={i}>
													<Dc
														as="div"
														style={`min-height:56px;display:flex;align-items:center;gap:12px;border-top:${it.bt};cursor:pointer`}
														active="transform:scale(0.97)"
														{...press(it.toggle)}
														aria-pressed={it.deco === 'line-through'}
													>
														<span
															style={css(
																`width:20px;height:20px;box-sizing:border-box;border-radius:6px;border:1px solid ${it.bc};background:${it.bg};color:#FFFFFF;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0`,
															)}
														>
															{it.mark}
														</span>
														<div style={css('display:flex;flex-direction:column;gap:2px')}>
															<span
																style={css(
																	`font-size:14px;font-weight:500;text-decoration:${it.deco};color:${it.col}`,
																)}
															>
																{it.title}
															</span>
															<span style={css('font-size:12px;color:#737373')}>{it.detail}</span>
														</div>
													</Dc>
												</Fragment>
											))}
										</div>
									</>
								)}
								{v.isFin && (
									<>
										<Dc
											as="div"
											style="height:44px;border:1px solid #0A0A0A;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:500;cursor:pointer"
											active="transform:scale(0.97)"
											{...press(v.addExp)}
										>
											{v.addLabel}
										</Dc>
										<div
											style={css(
												'border:1px solid #E5E5E5;border-radius:14px;padding:0 14px;display:flex;flex-direction:column',
											)}
										>
											{v.exps.map((x: Row, i: number) => (
												<Fragment key={i}>
													<div
														style={css(
															`min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:${x.bt}`,
														)}
													>
														<div style={css('display:flex;flex-direction:column;gap:2px')}>
															<span style={css('font-size:14px;font-weight:500')}>{x.title}</span>
															<span style={css('font-size:12px;color:#737373')}>{x.detail}</span>
														</div>
														<span
															style={css(
																"font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500",
															)}
														>
															{x.amt}
														</span>
													</div>
												</Fragment>
											))}
										</div>
									</>
								)}
								{v.isAus && (
									<>
										<div
											style={css(
												'border:1px solid #E5E5E5;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:4px',
											)}
										>
											<span
												style={css(
													"font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;color:#737373",
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
											{...press(v.reply)}
										>
											{v.replyText}
										</Dc>
									</>
								)}
							</div>
							<div
								style={css(
									'margin:8px 12px 12px;border:1px solid #E5E5E5;border-radius:20px;padding:4px;display:flex;gap:2px;flex-shrink:0',
								)}
							>
								{v.tabs.map((tb: Row, i: number) => (
									<Fragment key={i}>
										<Dc
											as="div"
											style={`flex:1;height:44px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:${tb.bg};border:${tb.bd};color:${tb.col};cursor:pointer`}
											active="transform:scale(0.97)"
											{...press(tb.go)}
											aria-pressed={st.tab === i}
										>
											{tb.label}
										</Dc>
									</Fragment>
								))}
							</div>
						</div>
					</div>
				</div>
				<canvas
					data-hand="front"
					aria-hidden="true"
					style={css(
						'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;mix-blend-mode:difference',
					)}
				/>
				<div
					style={css(
						'position:absolute;left:40px;bottom:48px;display:flex;flex-direction:column;gap:24px;color:#FAFAFA',
					)}
				>
					<h2
						style={css(
							"margin:0;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:96px;line-height:0.9;letter-spacing:-0.05em",
						)}
					>
						Alltag
						<br />
						teilen.
					</h2>
					<a
						data-cta="1"
						href={appUrl('/neu?action=create')}
						style={css(
							'align-self:flex-start;height:48px;padding:0 24px;display:flex;align-items:center;border:1px solid rgba(250,250,250,0.6);color:#FAFAFA;border-radius:10px;font-size:16px;font-weight:500;cursor:pointer;text-decoration:none',
						)}
					>
						WG erstellen
					</a>
				</div>
			</section>
		</>
	);
}
