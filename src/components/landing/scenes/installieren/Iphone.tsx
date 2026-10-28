// iPhone-Bildschirm (iOS 27, Safari im Layout „Kompakt“) als DOM nach INSTALL-FLOWS 2. Bühne 390 x 844 pt.
// Alle bewegten Teile tragen data-k, ablauf.js setzt ihre Stile je Bild. Keine Bildschirmfotos von Apple.

import {
	ArrowBigUp,
	BellRing,
	BookMarked,
	BookOpen,
	Bookmark,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Compass,
	Copy,
	EyeOff,
	FileSearch,
	Glasses,
	Menu,
	Mic,
	PenLine,
	Printer,
	RotateCw,
	Search,
	Share,
	SquarePlus,
	Star,
	X,
	ZoomIn,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import s from './Iphone.module.css';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif';
const ICON = '/apple-touch-icon.png';
// Bilder laden erst, wenn der Abschnitt nahe kommt (Variablen setzt Installieren.tsx)
const SEITE = 'var(--b-ios)';
const APPSEITE = 'var(--b-app)';

const abs = (o: CSSProperties): CSSProperties => ({ position: 'absolute', ...o });
const scheibe = (y0: number, y1: number, top: number, src = SEITE): CSSProperties =>
	abs({
		left: 0,
		top,
		width: 390,
		height: y1 - y0,
		backgroundImage: src,
		backgroundSize: '390px 844px',
		backgroundPosition: `0 ${-y0}px`,
		backgroundRepeat: 'no-repeat',
	});

function Status({ hell }: { hell?: boolean }) {
	const c = hell ? '#fff' : '#000';
	return (
		<div className={s.ios_status} style={{ color: c }}>
			<span className={s.ios_zeit}>09:41</span>
			<svg width="68" height="14" viewBox="0 0 68 14" fill={c} aria-hidden="true">
				<rect x="0" y="8" width="3.4" height="5" rx="1" />
				<rect x="5" y="5.5" width="3.4" height="7.5" rx="1" />
				<rect x="10" y="3" width="3.4" height="10" rx="1" />
				<rect x="15" y="0" width="3.4" height="13" rx="1" />
				<path d="M30.5 3.2c2.6 0 5 1 6.800 2.700l-1.200 1.300a7.300 7.300 0 0 0-5.600-2.300 7.300 7.300 0 0 0-5.600 2.300l-1.200-1.300a9.900 9.900 0 0 1 6.800-2.700Zm0 4a5.500 5.500 0 0 1 3.900 1.600l-1.300 1.300a3.700 3.700 0 0 0-5.200 0l-1.300-1.300a5.500 5.500 0 0 1 3.900-1.600Zm0 3.900 1.800 1.800-1.800 1.800-1.800-1.800Z" />
				<rect
					x="42"
					y="0.5"
					width="22"
					height="12.500"
					rx="4"
					fill="none"
					stroke={c}
					strokeOpacity=".4"
				/>
				<rect x="43.800" y="2.300" width="18.400" height="8.900" rx="2.600" />
				<rect x="65" y="4.500" width="1.800" height="4.500" rx=".9" fillOpacity=".4" />
			</svg>
		</div>
	);
}

function Zeile({ ic, t, tag }: { ic: ReactNode; t: string; tag?: string }) {
	return (
		<div className={s.ios_zeile} data-tag={tag}>
			<span className={s.ios_zeile_t}>{t}</span>
			<span className={s.ios_zeile_i}>{ic}</span>
		</div>
	);
}

function Kachel({
	k,
	children,
	style,
}: { k?: string; children?: ReactNode; style?: CSSProperties }) {
	return (
		<span className={s.ios_app} data-k={k} style={style}>
			{children}
		</span>
	);
}

const REIHEN = ['qwertzuiopü', 'asdfghjklöä', 'yxcvbnm'];

export function Iphone() {
	return (
		<div className={s.ios} data-k="ios" style={{ fontFamily: SF }}>
			{/* Home-Bildschirm hinter allem */}
			<div className={s.ios_home} data-k="ios-home">
				<div className={s.ios_wall} />
				<div className={s.ios_grid}>
					<div className={s.ios_cell} style={{ left: 31, top: 69 }}>
						<Kachel>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<rect width="60" height="60" fill="#0b0b0b" />
								<circle cx="30" cy="30" r="22" fill="none" stroke="#fa114f" strokeWidth="7" />
								<circle cx="30" cy="30" r="14.500" fill="none" stroke="#a6ff00" strokeWidth="7" />
								<circle cx="30" cy="30" r="7" fill="none" stroke="#00e1d0" strokeWidth="6" />
							</svg>
						</Kachel>
						<em>Fitness</em>
					</div>
					<div className={s.ios_cell} style={{ left: 122, top: 69 }}>
						<Kachel style={{ background: '#0b0b0b' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<rect
									x="17"
									y="12"
									width="26"
									height="36"
									rx="9"
									fill="#1c1c1e"
									stroke="#d6d6d9"
									strokeWidth="2"
								/>
								<rect x="20" y="16" width="20" height="28" rx="6" fill="#050505" />
							</svg>
						</Kachel>
						<em>Watch</em>
					</div>
					<div className={s.ios_cell} style={{ left: 211, top: 69 }}>
						<Kachel style={{ background: '#fff' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								{[16, 30, 44].map((y, i) => (
									<g key={y}>
										<circle
											cx="15"
											cy={y}
											r="4"
											fill="none"
											stroke={['#3a8bf2', '#fb4a3d', '#fda31b'][i]}
											strokeWidth="2.400"
										/>
										<rect x="24" y={y - 1} width="26" height="2" rx="1" fill="#d6d6da" />
									</g>
								))}
							</svg>
						</Kachel>
						<em>Erinnerungen</em>
					</div>
					<div className={s.ios_cell} style={{ left: 301, top: 69 }}>
						<Kachel style={{ background: '#fff' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<path
									d="M10 20a4 4 0 0 1 4-4h11l5 5h16a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z"
									fill="#2f8ef7"
								/>
								<path d="M10 25h40v19a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z" fill="#59b1ff" />
							</svg>
						</Kachel>
						<em>Dateien</em>
					</div>
					<div className={s.ios_cell} style={{ left: 31, top: 165 }}>
						<Kachel style={{ background: 'linear-gradient(160deg,#f6f1ff,#cfe3ff)' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<circle cx="33" cy="35" r="12" fill="#3b4a66" />
								<circle cx="33" cy="35" r="7" fill="#7a8cff" />
								<rect x="12" y="14" width="22" height="16" rx="4" fill="#ff5d7a" opacity=".85" />
							</svg>
						</Kachel>
						<em>Vorschau</em>
					</div>
					<div className={s.ios_cell} style={{ left: 122, top: 165 }}>
						<Kachel style={{ background: 'linear-gradient(160deg,#8b7a6d,#5e4f45)' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								{[0, 1, 2, 3].map((i) => (
									<rect
										key={i}
										x={13 + (i % 2) * 18}
										y={13 + Math.floor(i / 2) * 18}
										width="15"
										height="15"
										rx="4"
										fill={['#e7e0d8', '#2b2b2d', '#5ba5ff', '#ffb02e'][i]}
									/>
								))}
							</svg>
						</Kachel>
						<em>Dienstprogr.</em>
					</div>
					<div className={s.ios_cell} style={{ left: 211, top: 165 }}>
						<Kachel style={{ background: 'linear-gradient(180deg,#d6d7da,#a9abb0)' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<circle cx="30" cy="23" r="9" fill="#fff" />
								<path d="M12 52a18 14 0 0 1 36 0Z" fill="#fff" />
							</svg>
						</Kachel>
						<em>Kontakte</em>
					</div>
					<div className={s.ios_cell} data-k="ios-icon" style={{ left: 301, top: 165 }}>
						<Kachel>
							<img
								loading="lazy"
								src={ICON}
								alt="ManaWG"
								width="60"
								height="60"
								data-k="ios-icon-img"
							/>
						</Kachel>
						<em>ManaWG</em>
					</div>
				</div>
				<div className={s.ios_dock}>
					<div className={s.ios_dockapp} style={{ left: 119 }}>
						<Kachel style={{ background: '#fff' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<circle cx="30" cy="30" r="22" fill="#2b88f5" />
								<circle
									cx="30"
									cy="30"
									r="19"
									fill="none"
									stroke="#fff"
									strokeOpacity=".6"
									strokeWidth="1.200"
								/>
								<path d="m38 22-5.500 11.500L22 38l5.500-11.500Z" fill="#fff" />
								<path d="m38 22-5.500 11.500L28 28Z" fill="#ff4b3e" />
							</svg>
						</Kachel>
					</div>
					<div className={s.ios_dockapp} style={{ left: 210 }}>
						<Kachel style={{ background: 'linear-gradient(180deg,#5ee66f,#1fc23b)' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<path
									d="M30 15c-9.400 0-17 6.100-17 13.600 0 4.300 2.500 8.100 6.400 10.600L17.500 46l7.600-3.700c1.600.4 3.200.6 4.900.6 9.400 0 17-6.100 17-13.600S39.400 15 30 15Z"
									fill="#fff"
								/>
							</svg>
						</Kachel>
					</div>
				</div>
				<div className={s.ios_suche}>
					<Search size={12} strokeWidth={2.4} aria-hidden="true" /> Suchen
				</div>
			</div>

			{/* Seite mit Safari-Leisten und allem, was darüber liegt */}
			<div className={s.ios_stack} data-k="ios-stack">
				<div style={abs({ inset: 0, background: '#0a0a0a' })} />
				<div style={scheibe(0, 490, 54)} />

				<div style={scheibe(676, 844, 580)} />
				<div className={s.ios_bar} data-k="ios-bar">
					<span className={s.ios_rund} style={{ left: 33 }}>
						<ChevronLeft size={24} strokeWidth={1.8} color="#a3a3a8" aria-hidden="true" />
					</span>
					<div className={s.ios_pille}>
						<Menu
							size={22}
							strokeWidth={2}
							aria-label="Seitenmenü"
							role="img"
							data-k="ios-menubtn"
						/>
						<span>app.manawg.com</span>
						<RotateCw size={19} strokeWidth={2} aria-hidden="true" />
					</div>
					<span className={s.ios_rund} style={{ left: 306 }}>
						<span className={s.ios_tabs} />
					</span>
				</div>
				<div className={s.ios_scrim} data-k="ios-scrim1" />

				{/* Seitenmenü */}
				<div className={s.ios_menu} data-k="ios-menu">
					<div className={s.ios_menu_in} data-k="ios-menu-in">
						<Zeile ic={<Share size={22} strokeWidth={1.7} />} t="Teilen" tag="teilen" />
						<Zeile ic={<Bookmark size={21} strokeWidth={1.7} />} t="Zu Lesezeichen hinzufügen" />
						<Zeile
							ic={<BookMarked size={22} strokeWidth={1.7} />}
							t="Lesezeichen hinzufügen zu …"
						/>
						<i className={s.ios_trenner} />
						<Zeile ic={<FileSearch size={22} strokeWidth={1.7} />} t="Auf der Seite suchen" />
						<Zeile ic={<ZoomIn size={22} strokeWidth={1.7} />} t="Seitenzoom" />
						<Zeile ic={<BellRing size={21} strokeWidth={1.7} />} t="Mitteilung an mich" />
						<Zeile ic={<EyeOff size={22} strokeWidth={1.7} />} t="Ablenkende Objekte ausblenden" />
						<i className={s.ios_trenner} />
						<Zeile ic={<SquarePlus size={22} strokeWidth={1.7} />} t="Erweiterung beschreiben" />
					</div>
				</div>

				{/* Share-Sheet (kompakt, dann erweitert) */}
				<div className={s.ios_share} data-k="ios-share">
					<div className={s.ios_kopf}>
						<span className={s.ios_tile}>
							<img loading="lazy" src={ICON} alt="" width="60" height="60" />
						</span>
						<div className={s.ios_kopf_t}>
							<b>Deine WG-App</b>
							<span>app.manawg.com</span>
							<em>
								Optionen <ChevronRight size={14} strokeWidth={2.6} aria-hidden="true" />
							</em>
						</div>
						<span className={s.ios_x} data-k="ios-share-x">
							<X size={22} strokeWidth={2.4} aria-hidden="true" />
						</span>
					</div>
					<i className={s.ios_haar} style={{ top: 146 }} />
					<div className={s.ios_reihe} style={{ top: 160 }}>
						<div>
							<span
								className={s.ios_gk}
								style={{ background: 'linear-gradient(160deg,#ff4f6f,#e8183d)' }}
							>
								<svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
									<path d="M8 9l11 18V9ZM19 9l9 18V9Z" fill="#fff" opacity=".9" />
								</svg>
							</span>
							<em>News</em>
						</div>
						<div>
							<span className={s.ios_gk} style={{ background: '#fff' }}>
								<svg viewBox="0 0 60 60" width="64" height="64" aria-hidden="true">
									{[16, 30, 44].map((y, i) => (
										<g key={y}>
											<circle
												cx="15"
												cy={y}
												r="4"
												fill="none"
												stroke={['#3a8bf2', '#fb4a3d', '#fda31b'][i]}
												strokeWidth="2.400"
											/>
											<rect x="24" y={y - 1} width="26" height="2" rx="1" fill="#d6d6da" />
										</g>
									))}
								</svg>
							</span>
							<em>Erinnerungen</em>
						</div>
						<div>
							<span className={s.ios_gk} style={{ background: '#fff' }}>
								<svg viewBox="0 0 60 60" width="64" height="64" aria-hidden="true">
									<circle cx="30" cy="30" r="22" fill="#2b88f5" />
									<circle
										cx="30"
										cy="30"
										r="19"
										fill="none"
										stroke="#fff"
										strokeOpacity=".6"
										strokeWidth="1.2"
									/>
									<path d="m38 22-5.5 11.5L22 38l5.5-11.5Z" fill="#fff" />
									<path d="m38 22-5.5 11.5L28 28Z" fill="#ff4b3e" />
								</svg>
							</span>
							<em>Safari</em>
						</div>
						<div>
							<span className={s.ios_gk} style={{ background: '#fff' }}>
								<b className={s.ios_punkte}>•••</b>
							</span>
							<em>Mehr</em>
						</div>
					</div>
					<i className={s.ios_haar} style={{ top: 256 }} />
					<div className={s.ios_reihe} style={{ top: 270 }}>
						<div>
							<span className={s.ios_gr}>
								<Copy size={28} strokeWidth={1.5} aria-hidden="true" />
							</span>
							<em>Kopieren</em>
						</div>
						<div>
							<span className={s.ios_gr}>
								<Bookmark size={28} strokeWidth={1.5} aria-hidden="true" />
							</span>
							<em>
								Zu Lesezeichen <br />
								hinzufügen
							</em>
						</div>
						<div>
							<span className={s.ios_gr}>
								<Glasses size={30} strokeWidth={1.5} aria-hidden="true" />
							</span>
							<em>
								Zur Leseliste <br />
								hinzufügen
							</em>
						</div>
						<div data-tag="mehr">
							<span className={s.ios_gr}>
								<ChevronDown
									size={30}
									strokeWidth={1.7}
									data-k="ios-mehr-pfeil"
									aria-hidden="true"
								/>
								<ChevronUp
									size={30}
									strokeWidth={1.7}
									data-k="ios-weniger-pfeil"
									aria-hidden="true"
									style={{ opacity: 0 }}
								/>
							</span>
							<em data-k="ios-mehr-t">
								Mehr <br />
								anzeigen
							</em>
							<em data-k="ios-weniger-t" style={{ opacity: 0 }}>
								Weniger <br />
								anzeigen
							</em>
						</div>
					</div>
					<div className={s.ios_gruppe} style={{ top: 410 }}>
						<Zeile ic={<BookOpen size={22} strokeWidth={1.7} />} t="Lesezeichen hinzufügen zu …" />
						<Zeile ic={<Star size={22} strokeWidth={1.7} />} t="Als Favoriten sichern" />
						<Zeile ic={<FileSearch size={22} strokeWidth={1.7} />} t="Auf der Seite suchen" />
						<Zeile
							ic={<SquarePlus size={22} strokeWidth={1.7} />}
							t="Zum Home-Bildschirm"
							tag="home"
						/>
					</div>
					<div className={s.ios_gruppe} style={{ top: 626 }}>
						<Zeile ic={<PenLine size={22} strokeWidth={1.7} />} t="Markierung" />
						<Zeile ic={<Printer size={22} strokeWidth={1.7} />} t="Drucken" />
						<Zeile ic={<Compass size={22} strokeWidth={1.7} />} t="In Safari öffnen" />
					</div>
				</div>

				<div className={s.ios_scrim} data-k="ios-scrim2" />

				{/* Dialog „Zum Home-Bildschirm“ */}
				<div className={s.ios_dlg} data-k="ios-dlg">
					<div className={s.ios_dlg_kopf}>
						<span className={s.ios_x2}>
							<X size={22} strokeWidth={2.4} aria-hidden="true" />
						</span>
						<b>Zum Home-Bildsc…</b>
						<span className={s.ios_blau} data-k="ios-hinzu">
							Hinzufügen
						</span>
					</div>
					<div data-k="ios-dlg-in" style={abs({ inset: 0 })}>
						<div className={s.ios_karte}>
							<img
								loading="lazy"
								src={ICON}
								alt=""
								width="60"
								height="60"
								className={s.ios_dlg_icon}
							/>
							<div className={s.ios_feld}>
								<span>
									ManaWG
									<i className={s.ios_caret} data-k="ios-caret" />
								</span>
								<u>
									<X size={11} strokeWidth={3} color="#fff" aria-hidden="true" />
								</u>
							</div>
							<div className={s.ios_url}>https://app.manawg.com/</div>
						</div>
						<div className={s.ios_schalter_zeile}>
							<span>Als Web-App öffnen</span>
							<i className={s.ios_switch}>
								<b />
							</i>
						</div>
						<p className={s.ios_fuss}>
							Für schnellen Zugriff auf diese Website wird auf deinem Home-Bildschirm ein Symbol
							hinzugefügt.
						</p>
					</div>
				</div>

				{/* Tastatur (QWERTZ) */}
				<div className={s.ios_kbd} data-k="ios-kbd">
					<div className={s.ios_vorschlag}>
						<span>„ManaWG“</span>
					</div>
					{REIHEN.map((r, ri) => (
						<div
							className={s.ios_krow}
							key={r}
							style={{
								top: 49 + ri * 54,
								paddingLeft: ri === 1 ? 14 : ri === 2 ? 0 : 3,
								paddingRight: ri === 1 ? 14 : 3,
							}}
						>
							{ri === 2 && (
								<span className={s.ios_taste_s} style={{ width: 44 }}>
									<ArrowBigUp size={20} strokeWidth={1.8} aria-hidden="true" />
								</span>
							)}
							{r.split('').map((c) => (
								<span className={s.ios_taste} key={c}>
									{c}
								</span>
							))}
							{ri === 2 && (
								<span className={s.ios_taste_s} style={{ width: 44 }}>
									<X size={18} strokeWidth={1.8} aria-hidden="true" />
								</span>
							)}
						</div>
					))}
					<div className={s.ios_krow} style={{ top: 211, paddingLeft: 3, paddingRight: 3 }}>
						<span className={s.ios_taste_s} style={{ width: 90 }}>
							123
						</span>
						<span className={s.ios_taste_s} style={{ flex: 1, fontSize: 15 }}>
							Leerzeichen
						</span>
						<span
							className={s.ios_taste_s}
							style={{ width: 90, background: '#0a84ff', color: '#fff' }}
						>
							✓
						</span>
					</div>
					<span className={s.ios_emoji} style={{ left: 22 }}>
						☺
					</span>
					<span className={s.ios_emoji} style={{ right: 22 }}>
						<Mic size={22} strokeWidth={1.6} aria-hidden="true" />
					</span>
				</div>
				<div className={s.ios_indikator} />
			</div>

			{/* Start der installierten App */}
			<div className={s.ios_launch} data-k="ios-launch">
				<img
					loading="lazy"
					src={ICON}
					alt=""
					width="120"
					height="120"
					className={s.ios_launch_logo}
					data-k="ios-launch-logo"
				/>
			</div>
			<div className={s.ios_app_ebene} data-k="ios-app">
				<div style={scheibe(0, 699, 54, APPSEITE)} />
				<div style={scheibe(779, 844, 753, APPSEITE)} />
				<div className={s.ios_indikator} />
			</div>

			<div className={s.ios_st} data-k="ios-st-dunkel">
				<Status />
			</div>
			<div className={s.ios_st} data-k="ios-st-hell" style={{ opacity: 0 }}>
				<Status hell />
			</div>
		</div>
	);
}
