// iPhone: iOS 27, Safari in the "Compact" layout. Timings measured on the simulator, loop ≈ 13.5 s. All values are pure functions of time t.

import { cl, lerp } from '../../core/math';
import { fl, put, tf } from './style';
import { easeOut, io, seg, spring } from './timing';
import type { PlaybackPlan } from './types';

// Tap times: ≡, Share, Show More, Add to Home Screen, Add, icon
const T1 = 1.3;
const T2 = 2.9;
const T3 = 4.5;
const T4 = 6.1;
const T5 = 8.1;
const T6 = 10.35;
const LOOP = 13.45; // the running app stays for 2.3 s before the loop restarts

export const plan: PlaybackPlan = {
	loop: LOOP,
	ks: 278 / 390,
	// Start of the three steps (resting states, a finger tap is about to happen)
	jumps: [0, T3 - 0.9, T5 - 1.2] as const,
	// Still frames for "reduce": resting position per step
	still: [T2 - 0.6, T4 - 0.5, T5 + 1.2] as const,
	taps: [
		{ t: T1, x: 115, y: 786, g: 0 },
		{ t: T2, x: 176, y: 321, g: 0 },
		{ t: T3, x: 323, y: 733, g: 1 },
		{ t: T4, x: 158, y: 635, g: 1 },
		{ t: T5, x: 312, y: 85, g: 2 },
		{ t: T6, x: 329, y: 196, g: 3 },
	] as const,
	render(t, E) {
		// ---------- Side menu: spring out of the button (ζ 0.59, ωn 16.6 rad/s) ----------
		const h1 = t - (T1 + 0.05);
		const closing = seg(t, T2 + 0.03, 0.2);
		const ms = t < T2 + 0.03 ? spring(h1) : (1 - io(closing)) * spring(T2 - T1);
		const menuOn = ms > 0.002 && t < T2 + 0.25;
		put(E['ios-menu'], { d: menuOn ? 'block' : '', t: tf(0, 0, Math.max(ms, 0.001)) });
		put(E['ios-menu-in'], {
			o: t < T2 + 0.03 ? cl((h1 - 0.02) / 0.16) : 1 - cl((t - (T2 + 0.03)) / 0.1),
			f: fl(t < T2 ? 8 * (1 - cl(h1 / 0.2)) : 0),
		});

		// ---------- Share sheet: rises, then expands to full height ----------
		const sIn = easeOut(seg(t, T2 + 0.2, 0.42));
		const e = easeOut(seg(t, T3 + 0.065, 0.58));
		const top = 438 - 390 * e;
		const shareOn = t > T2 + 0.19;
		put(E['ios-share'], {
			d: shareOn ? 'block' : '',
			top: `${top}px`,
			height: `${834 + 16 * e - top}px`,
			t: tf(0, (1 - sIn) * 420),
		});
		put(E['ios-share-x'], { o: cl((e - 0.3) / 0.7) });
		// "Show More": the arrow rotates over 350 ms while the label crossfades
		const mr = seg(t, T3 + 0.065, 0.35);
		put(E['ios-more-t'], { o: 1 - mr });
		put(E['ios-less-t'], { o: mr });
		put(E['ios-more-arrow'], { o: 1, transform: `rotate(${Math.round(180 * io(mr))}deg)` });
		put(E['ios-less-arrow'], { o: 0 });
		put(E['ios-scrim1'], { o: 0.18 * e });

		// ---------- "Add to Home Screen" dialog ----------
		const dIn = easeOut(seg(t, T4, 0.58));
		const dh = easeOut(seg(t, T5, 0.2));
		put(E['ios-scrim2'], { o: 0.26 * dIn });
		put(E['ios-dlg'], {
			d: t > T4 - 0.01 ? 'block' : '',
			t: tf(0, (1 - dIn) * 800),
			height: `${797 - 470 * dh}px`,
			borderRadius: `${lerp(40, 30, dh)}px`,
		});
		put(E['ios-dlg-in'], { o: seg(t, T4 + 0.4, 0.4) });
		put(E['ios-caret'], {
			o: t > T4 + 0.5 && t < T5 && Math.floor((t - T4) * 1.9) % 2 === 0 ? 1 : 0,
		});
		const kIn = easeOut(seg(t, T4 + 0.33, 0.3));
		const kOut = io(seg(t, T5, 0.1));
		put(E['ios-kbd'], {
			d: t > T4 + 0.32 && t < T5 + 0.12 ? 'block' : '',
			t: tf(0, (1 - kIn) * 329 + kOut * 329),
		});

		// ---------- Add: the whole stack (Safari, share sheet, dialog) shrinks toward the icon cell in 200 ms
		// and fades out; the home screen below stays opaque (only blurred), never two
		// semi-transparent layers. Only once the stack is gone does home come into focus and the icon bounce into the cell ----------
		const sp = io(seg(t, T5 + 0.1, 0.2));
		const sc = 1 - 0.9 * sp;
		const stackOn = t < T5 + 0.31;
		put(E['ios-stack'], {
			d: stackOn ? 'block' : '',
			t: tf(331 - sc * 331, 195 - sc * 195, sc),
			o: 1 - sp,
			borderRadius: `${46 * sp}px`,
		});
		const he = easeOut(seg(t, T5 + 0.3, 0.3));
		const lz = easeOut(seg(t, T6, 0.4));
		const homeOn = t > T5 + 0.09 && t < T6 + 1.15;
		put(E['ios-home'], {
			d: homeOn ? 'block' : '',
			o: 1,
			f: fl(14 * (1 - he) + 14 * lz, lerp(0.7, 1, he) * (1 - 0.35 * lz)),
			t: tf(0, 0, 1.08 - 0.08 * he - 0.05 * lz),
		});
		// the icon enters the cell only once the home screen is in focus, with a soft spring 0.7 -> 1
		const ip = spring(t - (T5 + 0.62), 0.6, 20);
		put(E['ios-icon'], {
			o: seg(t, T5 + 0.6, 0.12),
			t: tf(0, 0, lerp(0.7, 1, Math.min(ip, 1.15))),
		});

		// ---------- App launch: card grows out of the icon, black launch screen, crossfade ----------
		const aF = seg(t, T6 + 0.8, 0.3);
		put(E['ios-launch'], {
			d: t > T6 && t < T6 + 1.15 ? 'flex' : '',
			o: 1,
			left: `${299 * (1 - lz)}px`,
			top: `${166 * (1 - lz)}px`,
			width: `${60 + 330 * lz}px`,
			height: `${60 + 784 * lz}px`,
			borderRadius: `${14 + 28 * lz}px`,
		});
		// the mark sits on the black launch screen and is gone before the app fades in
		put(E['ios-launch-logo'], { o: seg(t, T6 + 0.25, 0.25) * (1 - seg(t, T6 + 0.6, 0.2)) });
		put(E['ios-app'], { d: t > T6 + 0.8 ? 'block' : '', o: aF });
	},
};
