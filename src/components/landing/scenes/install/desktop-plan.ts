// Desktop: Chrome 154 on macOS. Order and labels are documented; the timings of the
// desktop part are NOT measured and deliberately conservative (estimated): the chip expands in 0.4 s,
// the dialog takes 0.18 s, the window switch 0.32 s ease-out.

import { lerp } from '../../core/math';
import { put, tf } from './style';
import { easeOut, io, seg } from './timing';
import type { PlaybackPlan } from './types';

const T1 = 1.8; // click on the install icon (chip)
const T2 = 4.1; // click on "Install" in the dialog
const LOOP = 6.5;

export const plan: PlaybackPlan = {
	loop: LOOP,
	ks: 582 / 820,
	jumps: [0, T1 + 0.3, T2 + 0.05] as const,
	still: [T1 - 0.2, T2 - 0.4, T2 + 1.6] as const,
	taps: [
		{ t: T1, x: 597, y: 62, g: 0 },
		{ t: T2, x: 510, y: 218, g: 1 },
	] as const,
	render(t, E) {
		// The "Install" chip expands next to the icon (estimated)
		const ce = easeOut(seg(t, 0.45, 0.4));
		put(E['dk-chip'], { background: `rgba(168,199,250,${(ce * 0.24).toFixed(3)})` });
		put(E['dk-chip-t'], {
			maxWidth: `${(78 * ce).toFixed(1)}px`,
			paddingLeft: `${(6 * ce).toFixed(1)}px`,
			o: ce,
		});
		// Tooltip "Install ManaWG" while the pointer approaches
		put(E['dk-tip'], { o: seg(t, T1 - 0.55, 0.12) * (1 - seg(t, T1 + 0.02, 0.06)) });
		// "Install app" dialog: tab-modal, top center, no arrow (estimated 0.18 s)
		const dIn = easeOut(seg(t, T1 + 0.05, 0.18));
		const dOut = io(seg(t, T2 + 0.03, 0.12));
		put(E['dk-dlg'], {
			d: t > T1 + 0.04 && t < T2 + 0.16 ? 'block' : '',
			o: dIn * (1 - dOut),
			t: tf(0, (1 - dIn) * -8, lerp(0.97, 1, dIn)),
		});
		// The tab moves into its own app window without an address bar (estimated 0.32 s ease-out)
		const wa = easeOut(seg(t, T2 + 0.1, 0.32));
		const af = seg(t, T2 + 0.1, 0.03);
		put(E['dk-app'], { d: t > T2 + 0.09 ? 'block' : '', o: af, t: tf(0, 0, lerp(0.94, 1, wa)) });
		put(E['dk-window'], { d: t < T2 + 0.26 ? 'block' : '' });
	},
};
