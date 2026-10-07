// Android-Bildschirm (Chrome ab 150, Adressleiste oben, Menü nach Chromium 157) als DOM nach INSTALL-FLOWS 3.
// Bühne 411 x 884 dp (Gerät 411 x 914 dp, hier an das Seitenverhältnis des Rahmens angepasst).

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
import s from './Android.module.css';

const ICON = '/icon-512.png';
const SEITE = '/install/seite-android.webp';
const APPSEITE = '/install/app-start.webp';
const F = 411 / 390;

const abs = (o: CSSProperties): CSSProperties => ({ position: 'absolute', ...o });
const scheibe = (y0: number, y1: number, top: number, src = SEITE): CSSProperties =>
	abs({
		left: 0,
		top,
		width: 411,
		height: (y1 - y0) * F,
		backgroundImage: `url(${src})`,
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

type Eintrag = { ic: ReactNode; t: string } | null;
const EINTRAEGE: Eintrag[] = [
	{ ic: <Plus size={22} strokeWidth={1.7} />, t: 'Neuer Tab' },
	{ ic: <VenetianMask size={22} strokeWidth={1.7} />, t: 'Neuer Inkognitotab' },
	{ ic: <LayoutGrid size={22} strokeWidth={1.7} />, t: 'Tab zu neuer Gruppe hinzufügen' },
	null,
	{ ic: <History size={22} strokeWidth={1.7} />, t: 'Verlauf' },
	{ ic: <Trash2 size={22} strokeWidth={1.7} />, t: 'Browserdaten löschen' },
	{ ic: <Settings2 size={22} strokeWidth={1.7} />, t: 'Website-Einstellungen' },
	null,
	{ ic: <Check size={22} strokeWidth={1.9} />, t: 'Downloads' },
	{ ic: <Star size={22} strokeWidth={1.7} fill="currentColor" />, t: 'Lesezeichen' },
	{ ic: <MonitorSmartphone size={22} strokeWidth={1.7} />, t: 'Zuletzt geöffnete Tabs' },
	null,
	{ ic: <Share2 size={22} strokeWidth={1.7} />, t: 'Teilen…' },
	{ ic: <FileSearch size={22} strokeWidth={1.7} />, t: 'Auf Seite suchen' },
	{ ic: <SquarePlus size={22} strokeWidth={1.7} />, t: 'Lesemodus anzeigen' },
	{ ic: <Download size={22} strokeWidth={1.7} />, t: 'Installieren und Verknüpfung erstellen' },
];

const ZEICHEN = (c: string) => (
	<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
		<circle cx="30" cy="30" r="30" fill="#fff" />
		<circle cx="30" cy="30" r="19" fill={c} />
	</svg>
);

export function Android() {
	let zeile = 0;
	return (
		<div
			className={s.and}
			data-k="and"
			style={{ fontFamily: 'Roboto, "Google Sans", Inter, system-ui, sans-serif' }}
		>
			{/* Launcher */}
			<div className={s.and_home} data-k="and-home">
				<div className={s.and_wall} />
				<div className={s.and_hicon} style={{ left: 34, top: 74 }}>
					<img src={ICON} alt="ManaWG" width="60" height="60" />
					<em>ManaWG</em>
				</div>
				<div className={s.and_dock}>
					<span style={{ left: 34 }}>{ZEICHEN('#1a73e8')}</span>
					<span style={{ left: 128 }}>{ZEICHEN('#4285f4')}</span>
					<span style={{ left: 222 }}>
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
					</span>
					<span style={{ left: 316 }}>
						<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
							<circle cx="30" cy="30" r="30" fill="#fff" />
							<path d="M20 17v26l22-13Z" fill="#34a853" />
							<path d="M20 17 33 30 20 43Z" fill="#4285f4" opacity=".9" />
							<path d="M33 30l9 0-9-9Z" fill="#fbbc04" />
						</svg>
					</span>
				</div>
				<div className={s.and_suche}>
					<b>G</b>
				</div>
			</div>

			{/* Chrome mit allem, was darüber liegt */}
			<div className={s.and_stack} data-k="and-stack">
				<div style={abs({ left: 0, top: 108, width: 411, height: 692, background: '#fff' })} />
				<div style={scheibe(0, 481, 108)} />
				<div style={scheibe(676, 844, 623)} />
				<div className={s.and_oben}>
					<div className={s.and_pille}>
						<ArrowLeft size={24} strokeWidth={1.9} aria-hidden="true" />
						<span>app.manawg.com</span>
						<Share2 size={22} strokeWidth={1.8} aria-hidden="true" />
					</div>
				</div>
				<div className={s.and_unten}>
					<House size={25} strokeWidth={1.8} style={{ left: 39 }} aria-hidden="true" />
					<Plus size={27} strokeWidth={1.8} style={{ left: 141 }} aria-hidden="true" />
					<span className={s.and_tabs} style={{ left: 244 }}>
						1
					</span>
					<EllipsisVertical size={25} strokeWidth={2.4} style={{ left: 346 }} aria-hidden="true" />
					<i className={s.and_geste} />
				</div>
				<div className={s.and_scrim} data-k="and-scrim" />

				{/* Menü */}
				<div className={s.and_menu} data-k="and-menu">
					<div className={s.and_kreise}>
						{[ArrowLeft, ArrowRight, Star, Download, RotateCw].map((I, i) => {
							const k = zeile++;
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
					<div className={s.and_liste}>
						{EINTRAEGE.map((e, i) => {
							if (!e) return <i key={i} className={s.and_trenner} />;
							const k = zeile++;
							return (
								<div key={e.t} className={s.and_eintrag} data-k={`and-r${k}`}>
									<span>{e.ic}</span>
									{e.t}
								</div>
							);
						})}
					</div>
				</div>

				{/* Sheet „Installieren und Verknüpfung erstellen“ */}
				<div className={s.and_sheet} data-k="and-sheet">
					<h4>
						Installieren und Verknüpfung <br />
						erstellen
					</h4>
					<div className={s.and_srow} style={{ top: 84, height: 64 }}>
						<span className={s.and_sicon}>
							<img src={ICON} alt="" width="40" height="40" />
							<Download size={14} strokeWidth={2.6} color="#fff" aria-hidden="true" />
						</span>
						<b>Installieren</b>
						<ChevronRight size={22} strokeWidth={1.8} aria-hidden="true" />
					</div>
					<div className={s.and_srow} style={{ top: 156, height: 76 }}>
						<span className={s.and_sicon}>
							<img src={ICON} alt="" width="40" height="40" />
							<i className={s.and_chrome} />
						</span>
						<b>
							Verknüpfung erstellen
							<em>Verknüpfungen werden in Chrome geöffnet</em>
						</b>
						<ChevronRight size={22} strokeWidth={1.8} aria-hidden="true" />
					</div>
				</div>

				{/* Dialog „App installieren“ */}
				<div className={s.and_dlg} data-k="and-dlg">
					<h4>App installieren</h4>
					<div className={s.and_dzeile}>
						<img src={ICON} alt="" width="48" height="48" />
						<div>
							<div className={s.and_feld}>
								ManaWG
								<i data-k="and-caret" />
							</div>
							<span>app.manawg.com</span>
						</div>
					</div>
					<div className={s.and_knoepfe}>
						<span>Abbrechen</span>
						<span data-k="and-ok">Installieren</span>
					</div>
				</div>

				<div className={s.and_toast} data-k="and-toast1">
					„ManaWG“ wird installiert…
				</div>
				<div className={s.and_toast} data-k="and-toast2">
					App wurde installiert
				</div>
			</div>

			{/* Start der installierten App */}
			<div className={s.and_launch} data-k="and-launch">
				<img src={ICON} alt="" width="72" height="72" data-k="and-launch-logo" />
			</div>
			<div className={s.and_app} data-k="and-app">
				<div style={abs({ left: 0, top: 0, width: 411, height: 48, background: '#0a0a0a' })} />
				<div style={scheibe(0, 446, 48, APPSEITE)} />
				<div style={scheibe(779, 844, 788, APPSEITE)} />
				<div style={abs({ left: 0, top: 856, width: 411, height: 28, background: '#000' })} />
			</div>
			<div className={s.and_nav} data-k="and-nav">
				<i />
			</div>
			<div className={s.and_st} data-k="and-st-hell">
				<Status />
			</div>
			<div
				className={`${s.and_st} ${s.and_st_dunkel}`}
				data-k="and-st-dunkel"
				style={{ opacity: 0 }}
			>
				<Status />
			</div>
		</div>
	);
}
