// Rechner: Chrome 154 auf macOS. Reihenfolge und Beschriftungen belegt (INSTALL-FLOWS 4.1), die Zeiten des
// Rechner-Teils sind NICHT gemessen und bewusst zurückhaltend gewählt (geschätzt): Chip klappt in 0,4 s aus,
// Dialog 0,18 s, Fensterwechsel 0,32 s ease-out.

import { put, tf } from './stil';
import type { Ablaufplan } from './types';
import { aus, io, mix, seg } from './zeit';

const T1 = 1.8; // Klick auf das Installieren-Symbol (Chip)
const T2 = 4.1; // Klick auf „Installieren“ im Dialog
export const LOOP = 6.5;

export const plan: Ablaufplan = {
	loop: LOOP,
	ks: 582 / 820,
	sprung: [0, T1 + 0.3, T2 + 0.05] as const,
	still: [T1 - 0.2, T2 - 0.4, T2 + 1.6] as const,
	taps: [
		{ t: T1, x: 597, y: 62, g: 0 },
		{ t: T2, x: 510, y: 218, g: 1 },
	] as const,
	render(t, E) {
		// Chip „Installieren“ klappt neben dem Symbol aus (geschätzt)
		const ce = aus(seg(t, 0.45, 0.4));
		put(E['dk-chip'], { background: `rgba(211,227,253,${(ce * 0.95).toFixed(3)})` });
		put(E['dk-chip-t'], {
			maxWidth: `${(78 * ce).toFixed(1)}px`,
			paddingLeft: `${(6 * ce).toFixed(1)}px`,
			o: ce,
		});
		// Tooltip „ManaWG installieren“ beim Anfahren
		put(E['dk-tip'], { o: seg(t, T1 - 0.55, 0.12) * (1 - seg(t, T1 + 0.02, 0.06)) });
		// Dialog „App installieren“: tab-modal, oben mittig, ohne Pfeil (geschätzt 0,18 s)
		const dIn = aus(seg(t, T1 + 0.05, 0.18));
		const dOut = io(seg(t, T2 + 0.03, 0.12));
		put(E['dk-dlg'], {
			d: t > T1 + 0.04 && t < T2 + 0.16 ? 'block' : '',
			o: dIn * (1 - dOut),
			t: tf(0, (1 - dIn) * -8, mix(0.97, 1, dIn)),
		});
		// Der Tab wandert in ein eigenes App-Fenster ohne Adressleiste (geschätzt 0,32 s ease-out)
		const wa = aus(seg(t, T2 + 0.1, 0.32));
		const af = seg(t, T2 + 0.1, 0.03);
		put(E['dk-app'], { d: t > T2 + 0.09 ? 'block' : '', o: af, t: tf(0, 0, mix(0.94, 1, wa)) });
		put(E['dk-fenster'], { d: t < T2 + 0.26 ? 'block' : '' });
	},
};
