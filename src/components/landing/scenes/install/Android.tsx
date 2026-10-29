// Android screen (Chrome 150 and later, address bar at the top, menu per Chromium 157) as DOM.
// Stage 411 x 884 dp (device 411 x 914 dp, adapted here to the frame's aspect ratio).

import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronRight,
	Download,
	EllipsisVertical,
	FileSearch,
	History,
	House,
	LayoutGrid,
	MonitorSmartphone,
	Plus,
	RotateCw,
	Settings2,
	Share2,
	SquarePlus,
	Star,
	Trash2,
	VenetianMask,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { BrLines, useDict } from '../../dict';
import s from './Android.module.css';

const ICON = '/icon-512.png';
const BRAND = '/manawg-mark-weiss.png';
const PAGE = 'var(--b-and)';
const APP_PAGE = 'var(--b-app)';
const F = 411 / 390;

const abs = (o: CSSProperties): CSSProperties => ({ position: 'absolute', ...o });
const glass = (y0: number, y1: number, top: number, src = PAGE): CSSProperties =>
	abs({
		left: 0,
		top,
		width: 411,
		height: (y1 - y0) * F,
		backgroundImage: src,
		backgroundSize: `411px ${844 * F}px`,
		backgroundPosition: `0 ${-y0 * F}px`,
		backgroundRepeat: 'no-repeat',
	});

function Status() {
	return (
		<div className={s.and_status}>
			<span>09:41</span>
			<svg width="64" height="14" viewBox="0 0 64 14" fill="currentColor" aria-hidden="true">
				<path d="M7 1.500C4.600 1.500 2.400 2.400.7 3.900L7 11.500l6.300-7.600A10.600 10.600 0 0 0 7 1.500Z" />
				<text
					x="18"
					y="11"
					fontSize="10.500"
					fontWeight="600"
					fontFamily="Roboto, Inter, sans-serif"
				>
					3G
				</text>
				<path d="M40 12.500V2L50 12.500Z" />
				<rect x="54" y="2" width="6.500" height="10.500" rx="1.200" />
			</svg>
		</div>
	);
}

/** Icons of the Chrome menu in the order of the dictionary's menu entries; null is a separator. */
const MENU_ICONS: ((() => ReactNode) | null)[] = [
	() => <Plus size={22} strokeWidth={1.7} />,
	() => <VenetianMask size={22} strokeWidth={1.7} />,
	() => <LayoutGrid size={22} strokeWidth={1.7} />,
	null,
	() => <History size={22} strokeWidth={1.7} />,
	() => <Trash2 size={22} strokeWidth={1.7} />,
	() => <Settings2 size={22} strokeWidth={1.7} />,
	null,
	() => <Check size={22} strokeWidth={1.9} />,
	() => <Star size={22} strokeWidth={1.7} fill="currentColor" />,
	() => <MonitorSmartphone size={22} strokeWidth={1.7} />,
	null,
	() => <Share2 size={22} strokeWidth={1.7} />,
	() => <FileSearch size={22} strokeWidth={1.7} />,
	() => <SquarePlus size={22} strokeWidth={1.7} />,
	() => <Download size={22} strokeWidth={1.7} />,
];

const CHROME = (
	<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
		<circle cx="30" cy="30" r="30" fill="#fff" />
		<path
			d="M30 8a22 22 0 0 1 19 11H30a11 11 0 0 0-9.500 5.500L11 19A22 22 0 0 1 30 8Z"
			fill="#ea4335"
		/>
		<path d="M49 19a22 22 0 0 1-8 30L30.500 31a11 11 0 0 0-1-8Z" fill="#fbbc04" />
		<path d="M41 49a22 22 0 0 1-30-30l9.500 5.500a11 11 0 0 0 10 17Z" fill="#34a853" />
		<circle cx="30" cy="30" r="8.500" fill="#4285f4" stroke="#fff" strokeWidth="3" />
	</svg>
);
const PHONE = (
	<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
		<circle cx="30" cy="30" r="30" fill="#fff" />
		<path
			d="M22.500 17.500c1-1 2.600-.9 3.300.3l2.400 4c.5.900.3 2-.5 2.700l-1.900 1.700c1.500 3.300 4 5.900 7.200 7.600l1.900-1.800c.7-.7 1.800-.8 2.700-.3l4 2.400c1.200.7 1.300 2.300.3 3.300l-1.700 1.800c-1.300 1.300-3.200 1.800-5 1.300C26.800 38.800 20.300 32.300 17.200 24.100c-.5-1.800 0-3.700 1.300-5Z"
			fill="#1a73e8"
		/>
	</svg>
);
const MESSAGES = (
	<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
		<circle cx="30" cy="30" r="30" fill="#fff" />
		<path
			d="M19 17h22a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H30l-8 6.500V39h-3a4 4 0 0 1-4-4V21a4 4 0 0 1 4-4Z"
			fill="#1a73e8"
		/>
		<rect x="22" y="25" width="16" height="2.600" rx="1.300" fill="#fff" />
		<rect x="22" y="30" width="10" height="2.600" rx="1.300" fill="#fff" />
	</svg>
);
const PLAY = (
	<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
		<circle cx="30" cy="30" r="30" fill="#f0d88a" />
		<circle cx="30" cy="30" r="25" fill="#fff" />
		<path d="M23 17.500v25l21.500-12.500Z" fill="#34a853" />
		<path d="M23 17.500 35 30 23 42.500Z" fill="#4285f4" />
		<path d="M35 30l4-4 5.500 4-5.500 4Z" fill="#fbbc04" />
		<path d="M23 17.500 35 30l4-4Z" fill="#ea4335" />
	</svg>
);

export function Android() {
	const t = useDict().install.android;
	let row = 0;
	return (
		<div
			className={s.and}
			data-k="and"
			style={{ fontFamily: 'Roboto, "Google Sans", Inter, system-ui, sans-serif' }}
		>
			{/* Launcher */}
			<div className={s.and_home} data-k="and-home">
				<div className={s.and_wall} />
				<div
					className={s.and_hicon}
					data-k="and-icon"
					style={{ left: 34, top: 74, transformOrigin: '30px 30px' }}
				>
					{/* WebAPK after "Install": own icon without Chrome badge */}
					<i className={s.and_hround}>
						<img loading="lazy" src={ICON} alt="ManaWG" width="36" height="36" />
					</i>
					<em>ManaWG</em>
				</div>
				<div className={s.and_dock}>
					<span style={{ left: 34 }}>{PHONE}</span>
					<span style={{ left: 128 }}>{MESSAGES}</span>
					<span style={{ left: 222 }}>{CHROME}</span>
					<span style={{ left: 316 }}>{PLAY}</span>
				</div>
				<div className={s.and_search}>
					<b>G</b>
				</div>
			</div>

			{/* Chrome with everything above it */}
			<div className={s.and_stack} data-k="and-stack">
				<div
					style={abs({ left: 0, top: 108, width: 411, height: 692, background: 'var(--and-page)' })}
				/>
				<div style={glass(0, 481, 108)} />

				<div style={glass(676, 844, 623)} />
				<div className={s.and_top}>
					<div className={s.and_pill}>
						<ArrowLeft size={24} strokeWidth={1.9} aria-hidden="true" />
						<span>app.manawg.com</span>
						<Share2 size={22} strokeWidth={1.8} aria-hidden="true" />
					</div>
				</div>
				<div className={s.and_bottom}>
					<House size={25} strokeWidth={1.8} style={{ left: 39 }} aria-hidden="true" />
					<Plus size={27} strokeWidth={1.8} style={{ left: 141 }} aria-hidden="true" />
					<span className={s.and_tabs} style={{ left: 244 }}>
						1
					</span>
					<EllipsisVertical size={25} strokeWidth={2.4} style={{ left: 346 }} aria-hidden="true" />
					<i className={s.and_gesture} />
				</div>
				<div className={s.and_scrim} data-k="and-scrim" />

				{/* Menu */}
				<div className={s.and_menu} data-k="and-menu">
					<div className={s.and_circles}>
						{[ArrowLeft, ArrowRight, Star, Download, RotateCw].map((I, i) => {
							const k = row++;
							return (
								<span
									key={i}
									data-k={`and-r${k}`}
									style={{ left: 16 + i * 66, opacity: i < 2 ? 0.45 : 1 }}
								>
									<I size={22} strokeWidth={1.9} aria-hidden="true" />
								</span>
							);
						})}
					</div>
					<div className={s.and_list}>
						{MENU_ICONS.map((ic, i) => {
							const text = t.menu[i] ?? '';
							if (!ic) return <i key={i} className={s.and_divider} />;
							const k = row++;
							return (
								<div key={text} className={s.and_entry} data-k={`and-r${k}`}>
									<span>{ic()}</span>
									{text}
								</div>
							);
						})}
					</div>
				</div>

				{/* "Install and create shortcut" sheet */}
				<div className={s.and_sheet} data-k="and-sheet">
					<div className={s.and_sheet_t}>
						<BrLines lines={t.sheetTitle} />
					</div>
					<div className={s.and_srow} style={{ top: 84, height: 64 }}>
						<span className={s.and_sicon}>
							<img loading="lazy" src={ICON} alt="" width="40" height="40" />
							<Download size={14} strokeWidth={2.6} color="#fff" aria-hidden="true" />
						</span>
						<b>{t.sheetInstall}</b>
						<ChevronRight size={22} strokeWidth={1.8} aria-hidden="true" />
					</div>
					<div className={s.and_srow} style={{ top: 156, height: 76 }}>
						<span className={s.and_sicon}>
							<img loading="lazy" src={ICON} alt="" width="40" height="40" />
							<i className={s.and_chrome} />
						</span>
						<b>
							{t.sheetShortcut}
							<em>{t.sheetShortcutNote}</em>
						</b>
						<ChevronRight size={22} strokeWidth={1.8} aria-hidden="true" />
					</div>
				</div>

				{/* "Install app" dialog */}
				<div className={s.and_dlg} data-k="and-dlg">
					<div className={s.and_dlg_t}>{t.dialogTitle}</div>
					<div className={s.and_drow}>
						<img loading="lazy" src={ICON} alt="" width="48" height="48" />
						<div>
							<div className={s.and_field}>
								ManaWG
								<i data-k="and-caret" />
							</div>
							<span>app.manawg.com</span>
						</div>
					</div>
					<div className={s.and_buttons}>
						<span>{t.dialogCancel}</span>
						<span data-k="and-ok">{t.dialogInstall}</span>
					</div>
				</div>

				<div className={s.and_toast} data-k="and-toast1">
					{t.toastInstalling}
				</div>
				<div className={s.and_toast} data-k="and-toast2">
					{t.toastInstalled}
				</div>
			</div>

			{/* Launch of the installed app */}
			<div className={s.and_launch} data-k="and-launch">
				<img
					loading="lazy"
					src={BRAND}
					alt=""
					width="72"
					height="60"
					data-k="and-launch-logo"
					data-invert=""
				/>
			</div>
			<div className={s.and_app} data-k="and-app">
				<div
					style={abs({ left: 0, top: 0, width: 411, height: 48, background: 'var(--and-page)' })}
				/>
				<div style={glass(0, 702, 48, APP_PAGE)} />
				<div style={glass(779, 844, 788, APP_PAGE)} />
				<div
					style={abs({ left: 0, top: 856, width: 411, height: 28, background: 'var(--and-nav)' })}
				/>
			</div>
			<div className={s.and_nav} data-k="and-nav">
				<i />
			</div>
			<div className={s.and_st}>
				<Status />
			</div>
			<span className={s.and_camera} />
		</div>
	);
}
