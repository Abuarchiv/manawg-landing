// Rechner: Chrome 154 auf macOS (INSTALL-FLOWS 4.1). Bühne 820 x 538 px. Aufbau und Reihenfolge belegt, Pixelmaße
// und Zeiten des Rechner-Teils sind nicht gemessen (INSTALL-FLOWS 4, 8.4).

import {
	ArrowLeft,
	ArrowRight,
	EllipsisVertical,
	MonitorDown,
	Puzzle,
	RotateCw,
	SlidersHorizontal,
	Star,
	X,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { AppDatum } from './AppDatum';
import s from './Rechner.module.css';

const ICON = '/icon-512.png';
const APPSEITE = 'var(--b-app)';

const scheibe = (y0: number, y1: number, top: number, left: number): CSSProperties => ({
	position: 'absolute',
	left,
	top,
	width: 390,
	height: y1 - y0,
	backgroundImage: APPSEITE,
	backgroundSize: '390px 844px',
	backgroundPosition: `0 ${-y0}px`,
	backgroundRepeat: 'no-repeat',
});

function Ampel() {
	return (
		<span className={s.dk_ampel}>
			<i style={{ background: '#ff5f57' }} />
			<i style={{ background: '#febc2e' }} />
			<i style={{ background: '#28c840' }} />
		</span>
	);
}

export function Rechner() {
	return (
		<div
			className={s.dk}
			data-k="dk"
			style={{ fontFamily: '"Google Sans", Roboto, Inter, system-ui, sans-serif' }}
		>
			{/* Browserfenster */}
			<div className={s.dk_fenster} data-k="dk-fenster">
				<div className={s.dk_leiste}>
					<Ampel />
					<div className={s.dk_tab}>
						<img loading="lazy" src={ICON} alt="" width="16" height="16" />
						<span>ManaWG</span>
						<X size={14} strokeWidth={2} aria-hidden="true" />
					</div>
				</div>
				<div className={s.dk_werkzeug}>
					<ArrowLeft size={18} strokeWidth={1.9} style={{ left: 22 }} aria-hidden="true" />
					<ArrowRight
						size={18}
						strokeWidth={1.9}
						style={{ left: 56, opacity: 0.35 }}
						aria-hidden="true"
					/>
					<RotateCw size={17} strokeWidth={1.9} style={{ left: 90 }} aria-hidden="true" />
					<div className={s.dk_omni}>
						<span className={s.dk_tune}>
							<SlidersHorizontal size={14} strokeWidth={2} aria-hidden="true" />
						</span>
						<span className={s.dk_url}>app.manawg.com</span>
						<div className={s.dk_chip} data-k="dk-chip">
							<MonitorDown size={17} strokeWidth={1.9} aria-hidden="true" />
							<b data-k="dk-chip-t">Installieren</b>
						</div>
						<Star size={17} strokeWidth={1.8} className={s.dk_stern} aria-hidden="true" />
					</div>
					<Puzzle size={18} strokeWidth={1.8} style={{ left: 706 }} aria-hidden="true" />
					<span className={s.dk_profil} />
					<EllipsisVertical size={18} strokeWidth={2.2} style={{ left: 786 }} aria-hidden="true" />
				</div>
				<div className={s.dk_seite}>
					<div style={scheibe(0, 454, 0, 215)} />
					<AppDatum left={215} top={0} />
				</div>
				<div className={s.dk_tip} data-k="dk-tip">
					ManaWG installieren
				</div>
				<div className={s.dk_dlg} data-k="dk-dlg">
					<div className={s.dk_dlg_t}>App installieren</div>
					<div className={s.dk_zeile}>
						<img loading="lazy" src={ICON} alt="" width="40" height="40" />
						<div>
							<b>ManaWG</b>
							<span>app.manawg.com</span>
						</div>
					</div>
					<div className={s.dk_knoepfe}>
						<span className={s.dk_knopf}>Abbrechen</span>
						<span className={`${s.dk_knopf} ${s.dk_voll}`}>Installieren</span>
					</div>
				</div>
			</div>

			{/* eigenes App-Fenster */}
			<div className={s.dk_app} data-k="dk-app">
				<div className={s.dk_titel}>
					<Ampel />
					<span>ManaWG</span>
					<EllipsisVertical size={16} strokeWidth={2.2} aria-hidden="true" />
				</div>
				<div style={scheibe(0, 446, 28, 215)} />
				<AppDatum left={215} top={28} />
				<div style={scheibe(779, 844, 473, 215)} />
			</div>
		</div>
	);
}
