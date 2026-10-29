// iPhone screen (iOS 27, Safari in the "Compact" layout) as DOM per INSTALL-FLOWS 2. Stage 390 x 844 pt.
// All moving parts carry data-k, playback.ts sets their styles per frame. No screenshots from Apple.

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
import { BrLines, useDict } from '../../dict';
import s from './Iphone.module.css';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif';
const ICON = '/apple-touch-icon.png';
// Images load only when the section approaches (Install.tsx sets the variables)
const PAGE = 'var(--b-ios)';
const APP_PAGE = 'var(--b-app)';

const abs = (o: CSSProperties): CSSProperties => ({ position: 'absolute', ...o });
const glass = (y0: number, y1: number, top: number, src = PAGE): CSSProperties =>
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

/** Status bar: text in the colour of the device mode (.ios colour) over page, sheets and dialog. */
function Status() {
	const c = 'currentColor';
	return (
		<div className={s.ios_status} style={{ color: c }}>
			<span className={s.ios_time}>09:41</span>
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

function Row({ ic, t, tag }: { ic: ReactNode; t: string; tag?: string }) {
	return (
		<div className={s.ios_row} data-tag={tag}>
			<span className={s.ios_row_t}>{t}</span>
			<span className={s.ios_row_i}>{ic}</span>
		</div>
	);
}

function Tile({ k, children, style }: { k?: string; children?: ReactNode; style?: CSSProperties }) {
	return (
		<span className={s.ios_app} data-k={k} style={style}>
			{children}
		</span>
	);
}

export function Iphone() {
	const t = useDict().install.ios;
	return (
		<div className={s.ios} data-k="ios" style={{ fontFamily: SF }}>
			{/* Home screen behind everything */}
			<div className={s.ios_home} data-k="ios-home">
				<div className={s.ios_wall} />
				<div className={s.ios_grid}>
					<div className={s.ios_cell} style={{ left: 31, top: 69 }}>
						<Tile>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<rect width="60" height="60" fill="#0b0b0b" />
								<circle cx="30" cy="30" r="22" fill="none" stroke="#fa114f" strokeWidth="7" />
								<circle cx="30" cy="30" r="14.500" fill="none" stroke="#a6ff00" strokeWidth="7" />
								<circle cx="30" cy="30" r="7" fill="none" stroke="#00e1d0" strokeWidth="6" />
							</svg>
						</Tile>
						<em>{t.homeFitness}</em>
					</div>
					<div className={s.ios_cell} style={{ left: 122, top: 69 }}>
						<Tile style={{ background: '#0b0b0b' }}>
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
						</Tile>
						<em>{t.homeWatch}</em>
					</div>
					<div className={s.ios_cell} style={{ left: 211, top: 69 }}>
						<Tile style={{ background: '#fff' }}>
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
						</Tile>
						<em>{t.homeReminders}</em>
					</div>
					<div className={s.ios_cell} style={{ left: 301, top: 69 }}>
						<Tile style={{ background: '#fff' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<path
									d="M10 20a4 4 0 0 1 4-4h11l5 5h16a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z"
									fill="#2f8ef7"
								/>
								<path d="M10 25h40v19a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z" fill="#59b1ff" />
							</svg>
						</Tile>
						<em>{t.homeFiles}</em>
					</div>
					<div className={s.ios_cell} style={{ left: 31, top: 165 }}>
						<Tile style={{ background: 'linear-gradient(160deg,#f6f1ff,#cfe3ff)' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<circle cx="33" cy="35" r="12" fill="#3b4a66" />
								<circle cx="33" cy="35" r="7" fill="#7a8cff" />
								<rect x="12" y="14" width="22" height="16" rx="4" fill="#ff5d7a" opacity=".85" />
							</svg>
						</Tile>
						<em>{t.homePreview}</em>
					</div>
					<div className={s.ios_cell} style={{ left: 122, top: 165 }}>
						<Tile style={{ background: 'linear-gradient(160deg,#8b7a6d,#5e4f45)' }}>
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
						</Tile>
						<em>{t.homeUtilities}</em>
					</div>
					<div className={s.ios_cell} style={{ left: 211, top: 165 }}>
						<Tile style={{ background: 'linear-gradient(180deg,#d6d7da,#a9abb0)' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<circle cx="30" cy="23" r="9" fill="#fff" />
								<path d="M12 52a18 14 0 0 1 36 0Z" fill="#fff" />
							</svg>
						</Tile>
						<em>{t.homeContacts}</em>
					</div>
					<div className={s.ios_cell} data-k="ios-icon" style={{ left: 301, top: 165 }}>
						<Tile>
							<img
								loading="lazy"
								src={ICON}
								alt="ManaWG"
								width="60"
								height="60"
								data-k="ios-icon-img"
							/>
						</Tile>
						<em>ManaWG</em>
					</div>
				</div>
				<div className={s.ios_dock}>
					<div className={s.ios_dockapp} style={{ left: 119 }}>
						<Tile style={{ background: '#fff' }}>
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
						</Tile>
					</div>
					<div className={s.ios_dockapp} style={{ left: 210 }}>
						<Tile style={{ background: 'linear-gradient(180deg,#5ee66f,#1fc23b)' }}>
							<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
								<path
									d="M30 15c-9.400 0-17 6.100-17 13.600 0 4.300 2.500 8.100 6.400 10.600L17.500 46l7.600-3.700c1.600.4 3.200.6 4.900.6 9.400 0 17-6.100 17-13.600S39.400 15 30 15Z"
									fill="#fff"
								/>
							</svg>
						</Tile>
					</div>
				</div>
				<div className={s.ios_search}>
					<Search size={12} strokeWidth={2.4} aria-hidden="true" />
					{` ${t.search}`}
				</div>
			</div>

			{/* Page with Safari bars and everything above it */}
			<div className={s.ios_stack} data-k="ios-stack">
				<div style={abs({ inset: 0, background: 'var(--ios-page)' })} />
				<div style={glass(0, 490, 54)} />

				<div style={glass(676, 844, 580)} />
				<div className={s.ios_bar} data-k="ios-bar">
					<span className={s.ios_round} style={{ left: 33, color: 'var(--ios-dim)' }}>
						<ChevronLeft size={24} strokeWidth={1.8} aria-hidden="true" />
					</span>
					<div className={s.ios_pill}>
						<Menu
							size={22}
							strokeWidth={2}
							aria-label={t.pageMenuAria}
							role="img"
							data-k="ios-menubtn"
						/>
						<span>app.manawg.com</span>
						<RotateCw size={19} strokeWidth={2} aria-hidden="true" />
					</div>
					<span className={s.ios_round} style={{ left: 306 }}>
						<span className={s.ios_tabs} />
					</span>
				</div>
				<div className={s.ios_scrim} data-k="ios-scrim1" />

				{/* Side menu */}
				<div className={s.ios_menu} data-k="ios-menu">
					<div className={s.ios_menu_in} data-k="ios-menu-in">
						<Row ic={<Share size={22} strokeWidth={1.7} />} t={t.menuShare} tag="teilen" />
						<Row ic={<Bookmark size={21} strokeWidth={1.7} />} t={t.menuAddBookmark} />
						<Row ic={<BookMarked size={22} strokeWidth={1.7} />} t={t.menuAddBookmarkTo} />
						<i className={s.ios_divider} />
						<Row ic={<FileSearch size={22} strokeWidth={1.7} />} t={t.menuFind} />
						<Row ic={<ZoomIn size={22} strokeWidth={1.7} />} t={t.menuZoom} />
						<Row ic={<BellRing size={21} strokeWidth={1.7} />} t={t.menuNotify} />
						<Row ic={<EyeOff size={22} strokeWidth={1.7} />} t={t.menuHideItems} />
						<i className={s.ios_divider} />
						<Row ic={<SquarePlus size={22} strokeWidth={1.7} />} t={t.menuExtension} />
					</div>
				</div>

				{/* Share sheet (compact, then expanded) */}
				<div className={s.ios_share} data-k="ios-share">
					<div className={s.ios_head}>
						<span className={s.ios_tile}>
							<img loading="lazy" src={ICON} alt="" width="60" height="60" />
						</span>
						<div className={s.ios_head_t}>
							<b className={t.sheetTitle.length > 20 ? s.ios_clip : undefined}>{t.sheetTitle}</b>
							<span>app.manawg.com</span>
							<em>
								{`${t.sheetOptions} `}
								<ChevronRight size={14} strokeWidth={2.6} aria-hidden="true" />
							</em>
						</div>
						<span className={s.ios_x} data-k="ios-share-x">
							<X size={22} strokeWidth={2.4} aria-hidden="true" />
						</span>
					</div>
					<i className={s.ios_hairline} style={{ top: 146 }} />
					<div className={s.ios_actions} style={{ top: 160 }}>
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
							<em>{t.sheetReminders}</em>
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
							<span className={s.ios_gk} style={{ background: 'var(--ios-more)' }}>
								<b className={s.ios_dots}>•••</b>
							</span>
							<em>{t.sheetMore}</em>
						</div>
					</div>
					<i className={s.ios_hairline} style={{ top: 256 }} />
					<div className={s.ios_actions} style={{ top: 270 }}>
						<div>
							<span className={s.ios_gr}>
								<Copy size={28} strokeWidth={1.5} aria-hidden="true" />
							</span>
							<em>{t.actionCopy}</em>
						</div>
						<div>
							<span className={s.ios_gr}>
								<Bookmark size={28} strokeWidth={1.5} aria-hidden="true" />
							</span>
							<em>
								<BrLines lines={t.actionBookmark} />
							</em>
						</div>
						<div>
							<span className={s.ios_gr}>
								<Glasses size={30} strokeWidth={1.5} aria-hidden="true" />
							</span>
							<em>
								<BrLines lines={t.actionReadingList} />
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
								<BrLines lines={t.actionShowMore} />
							</em>
							<em data-k="ios-weniger-t" style={{ opacity: 0 }}>
								<BrLines lines={t.actionShowLess} />
							</em>
						</div>
					</div>
					<div className={s.ios_group} style={{ top: 410 }}>
						<Row ic={<BookOpen size={22} strokeWidth={1.7} />} t={t.listAddBookmarkTo} />
						<Row ic={<Star size={22} strokeWidth={1.7} />} t={t.listFavourites} />
						<Row ic={<FileSearch size={22} strokeWidth={1.7} />} t={t.listFind} />
						<Row ic={<SquarePlus size={22} strokeWidth={1.7} />} t={t.listAddToHome} tag="home" />
					</div>
					<div className={s.ios_group} style={{ top: 626 }}>
						<Row ic={<PenLine size={22} strokeWidth={1.7} />} t={t.listMarkup} />
						<Row ic={<Printer size={22} strokeWidth={1.7} />} t={t.listPrint} />
						<Row ic={<Compass size={22} strokeWidth={1.7} />} t={t.listOpenInSafari} />
					</div>
				</div>

				<div className={s.ios_scrim} data-k="ios-scrim2" />

				{/* "Add to Home Screen" dialog */}
				<div className={s.ios_dlg} data-k="ios-dlg">
					<div className={s.ios_dlg_head}>
						<span className={s.ios_x2}>
							<X size={22} strokeWidth={2.4} aria-hidden="true" />
						</span>
						<b>{t.dialogTitle}</b>
						<span className={s.ios_blue} data-k="ios-hinzu">
							{t.dialogAdd}
						</span>
					</div>
					<div data-k="ios-dlg-in" style={abs({ inset: 0 })}>
						<div className={s.ios_card}>
							<img
								loading="lazy"
								src={ICON}
								alt=""
								width="60"
								height="60"
								className={s.ios_dlg_icon}
							/>
							<div className={s.ios_field}>
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
						<div className={s.ios_switch_row}>
							<span>{t.dialogWebApp}</span>
							<i className={s.ios_switch}>
								<b />
							</i>
						</div>
						<p className={s.ios_foot}>{t.dialogFoot}</p>
					</div>
				</div>

				{/* Keyboard (QWERTZ in German, QWERTY in English) */}
				<div className={s.ios_kbd} data-k="ios-kbd">
					<div className={s.ios_suggestion}>
						<span>{t.keySuggestion}</span>
					</div>
					{t.keyRows.map((r, ri) => (
						<div
							className={s.ios_krow}
							key={r}
							style={{
								top: 49 + ri * 54,
								paddingLeft: t.keyPadding[ri]?.[0],
								paddingRight: t.keyPadding[ri]?.[1],
							}}
						>
							{ri === 2 && (
								<span className={s.ios_key_s} style={{ width: 44 }}>
									<ArrowBigUp size={20} strokeWidth={1.8} aria-hidden="true" />
								</span>
							)}
							{r.split('').map((c) => (
								<span className={s.ios_key} key={c}>
									{c}
								</span>
							))}
							{ri === 2 && (
								<span className={s.ios_key_s} style={{ width: 44 }}>
									<X size={18} strokeWidth={1.8} aria-hidden="true" />
								</span>
							)}
						</div>
					))}
					<div className={s.ios_krow} style={{ top: 211, paddingLeft: 3, paddingRight: 3 }}>
						<span className={s.ios_key_s} style={{ width: 90 }}>
							123
						</span>
						<span className={s.ios_key_s} style={{ flex: 1, fontSize: 15 }}>
							{t.keySpace}
						</span>
						<span
							className={s.ios_key_s}
							style={{ width: 90, background: 'var(--ios-blue)', color: '#fff' }}
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
				<div className={s.ios_indicator} />
			</div>

			{/* Launch of the installed app */}
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
			<div className={s.ios_app_layer} data-k="ios-app">
				<div style={glass(0, 699, 54, APP_PAGE)} />
				<div style={glass(779, 844, 753, APP_PAGE)} />
				<div className={s.ios_indicator} />
			</div>

			<div className={s.ios_st}>
				<Status />
			</div>
			<span className={s.ios_island} />
		</div>
	);
}
