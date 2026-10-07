// Android: Chrome ab 150 (Menü nach Chromium 157), Schleife ≈ 14,3 s. Zeiten nach INSTALL-FLOWS 3.2, 3.3, 3.4:
// Menü 0,45–0,65 s gestaffelt, Dialog 0,2 s, Meldungen „wird installiert…“ ≈ 2 s. Alles reine Funktionen von t.

import { aus, cl, io, mat, mix, seg } from './zeit';
import { fl, put, tf } from './stil';

const T1 = 1.2; // ⋮
const T2 = 3.1; // „Installieren und Verknüpfung erstellen“
const T3 = 4.6; // im Sheet „Installieren“
const T4 = 6.2; // im Dialog „Installieren“
const TH = 9.1; // Wechsel auf den Startbildschirm
const T5 = 11.0; // Icon antippen
export const LOOP = 14.3; // die laufende App bleibt 2,3 s stehen, bevor die Schleife neu beginnt
const ZEILEN = 17;

export const plan = {
	loop: LOOP,
	ks: 278 / 411,
	sprung: [0, T2 - 0.9, T4 - 1.3],
	still: [T2 - 0.5, T4 - 0.5, T5 - 0.4],
	taps: [
		{ t: T1, x: 359, y: 830, g: 0 },
		{ t: T2, x: 237, y: 782, g: 1 },
		{ t: T3, x: 129, y: 736, g: 1 },
		{ t: T4, x: 338, y: 542, g: 2 },
		{ t: T5, x: 64, y: 104, g: 3 },
	],
	render(t, E) {
		// ---------- Menü: Popup rechts, Zeilen gestaffelt ----------
		const h = t - (T1 + 0.05);
		const m = mat(seg(t, T1 + 0.05, 0.3));
		const mo = 1 - seg(t, T2 + 0.03, 0.07);
		put(E['and-menu'], {
			d: t > T1 + 0.04 && t < T2 + 0.11 ? 'block' : '',
			o: m * mo,
			t: tf(0, 0, mix(0.86, 1, m), mix(0.55, 1, m)),
		});
		for (let i = 0; i < ZEILEN; i++) {
			const p = aus(seg(h, 0.05 + i * 0.019, 0.17));
			put(E[`and-r${i}`], { o: p, t: tf(0, (1 - p) * 10) });
		}

		// ---------- Bottom-Sheet ----------
		const sIn = aus(seg(t, T2 + 0.12, 0.3));
		const sOut = io(seg(t, T3 + 0.02, 0.2));
		put(E['and-sheet'], {
			d: t > T2 + 0.11 && t < T3 + 0.23 ? 'block' : '',
			t: tf(0, (1 - sIn + sOut) * 264),
		});

		// ---------- Dialog „App installieren“ (0,2 s) ----------
		const dIn = aus(seg(t, T3 + 0.1, 0.3));
		const dOut = seg(t, T4 + 0.02, 0.19);
		put(E['and-dlg'], {
			d: t > T3 + 0.1 && t < T4 + 0.22 ? 'block' : '',
			o: dIn * (1 - dOut),
			t: tf(0, 0, mix(0.9, 1, dIn)),
		});
		put(E['and-caret'], { o: t > T3 + 0.3 && t < T4 && Math.floor((t - T3) * 1.9) % 2 === 0 ? 1 : 0 });
		// Abdunkelung: Sheet 50 %, Dialog 65 % (Seite auf 35 % Helligkeit)
		const sc1 = 0.5 * aus(seg(t, T2 + 0.1, 0.3));
		const scrim =
			t < T3 + 0.02
				? sc1
				: t < T4 + 0.02
					? mix(0.5, 0.65, seg(t, T3 + 0.05, 0.2))
					: 0.65 * (1 - seg(t, T4 + 0.02, 0.19));
		put(E['and-scrim'], { o: scrim });

		// ---------- Meldungen ----------
		put(E['and-toast1'], { o: seg(t, T4 + 0.2, 0.2) * (1 - seg(t, T4 + 1.9, 0.2)) });
		put(E['and-toast2'], { o: seg(t, T4 + 2.0, 0.2) * (1 - seg(t, T4 + 2.9, 0.2)) });

		// ---------- Home: Chrome schrumpft ins Home (≈ 0,5 s), das Symbol steht schon da ----------
		const hp = io(seg(t, TH, 0.5));
		const sc = 1 - 0.88 * hp;
		const cx = mix(205.5, 252, hp);
		const cy = mix(442, 718, hp);
		put(E['and-stack'], {
			d: t < TH + 0.55 ? 'block' : '',
			t: tf(cx - sc * 205.5, cy - sc * 442, sc),
			o: 1 - seg(t, TH + 0.35, 0.15),
			borderRadius: `${36 * hp}px`,
		});
		const hv = aus(seg(t, TH, 0.4));
		put(E['and-home'], {
			d: t > TH - 0.01 && t < T5 + 1.3 ? 'block' : '',
			o: hv,
			f: fl(0, 1),
			t: tf(0, 0, mix(1.06, 1, hv)),
		});

		// ---------- Start: Karte wächst aus dem Icon, Splash, Überblendung ----------
		const lz = aus(seg(t, T5, 0.4));
		const aF = seg(t, T5 + 1.0, 0.25);
		put(E['and-launch'], {
			d: t > T5 && t < T5 + 1.3 ? 'flex' : '',
			o: 1,
			left: `${34 * (1 - lz)}px`,
			top: `${74 * (1 - lz)}px`,
			width: `${60 + 351 * lz}px`,
			height: `${60 + 824 * lz}px`,
			borderRadius: `${30 * (1 - lz)}px`,
		});
		put(E['and-launch-logo'], { o: seg(t, T5 + 0.25, 0.2) * (1 - seg(t, T5 + 0.75, 0.2)) });
		put(E['and-app'], { d: t > T5 + 1.0 ? 'block' : '', o: aF });
		put(E['and-nav'], { o: cl((t - (T5 + 0.3)) / 0.1) });

		// ---------- Statusleiste: weiß, auf dem Splash dunkel ----------
		const dunkel = t < T5 + 0.3 ? 0 : t < T5 + 1.0 ? 1 : 1 - aF;
		put(E['and-st-hell'], { o: 1 - dunkel });
		put(E['and-st-dunkel'], { o: dunkel });
	},
};
