// iPhone: iOS 27, Safari im Layout „Kompakt“. Zeiten nach INSTALL-FLOWS 2.2, 2.6 und 8.3 (gemessen am Simulator),
// Schleife ≈ 13,5 s. Alle Werte sind reine Funktionen der Zeit t.

import { aus, cl, feder, io, mix, seg } from './zeit';
import { fl, put, tf } from './stil';

// Tippzeiten: ≡, Teilen, Mehr anzeigen, Zum Home-Bildschirm, Hinzufügen, Icon
const T1 = 1.3;
const T2 = 2.9;
const T3 = 4.5;
const T4 = 6.1;
const T5 = 8.1;
const T6 = 10.35;
export const LOOP = 13.45; // die laufende App bleibt 2,3 s stehen, bevor die Schleife neu beginnt

export const plan = {
	loop: LOOP,
	ks: 278 / 390,
	// Beginn der drei Schritte (Ruhezustände, ein Fingertipp steht kurz bevor)
	sprung: [0, T3 - 0.9, T5 - 1.2],
	// Standbilder für „reduce“: Ruhelage je Schritt
	still: [T2 - 0.6, T4 - 0.5, T5 + 1.2],
	taps: [
		{ t: T1, x: 115, y: 786, g: 0 },
		{ t: T2, x: 176, y: 321, g: 0 },
		{ t: T3, x: 323, y: 733, g: 1 },
		{ t: T4, x: 158, y: 635, g: 1 },
		{ t: T5, x: 312, y: 85, g: 2 },
		{ t: T6, x: 329, y: 196, g: 3 },
	],
	render(t, E) {
		// ---------- Seitenmenü: Feder aus der Taste (ζ 0,59, ωn 16,6 rad/s) ----------
		const h1 = t - (T1 + 0.05);
		const zu = seg(t, T2 + 0.03, 0.2);
		const ms = t < T2 + 0.03 ? feder(h1) : (1 - io(zu)) * feder(T2 - T1);
		const menuAn = ms > 0.002 && t < T2 + 0.25;
		put(E['ios-menu'], { d: menuAn ? 'block' : '', t: tf(0, 0, Math.max(ms, 0.001)) });
		put(E['ios-menu-in'], {
			o: t < T2 + 0.03 ? cl((h1 - 0.02) / 0.16) : 1 - cl((t - (T2 + 0.03)) / 0.1),
			f: fl(t < T2 ? 8 * (1 - cl(h1 / 0.2)) : 0),
		});

		// ---------- Share-Sheet: aufsteigen, dann auf Vollhöhe ----------
		const sIn = aus(seg(t, T2 + 0.2, 0.42));
		const e = aus(seg(t, T3 + 0.065, 0.58));
		const top = 438 - 390 * e;
		const shareAn = t > T2 + 0.19;
		put(E['ios-share'], {
			d: shareAn ? 'block' : '',
			top: `${top}px`,
			height: `${834 + 16 * e - top}px`,
			t: tf(0, (1 - sIn) * 420),
		});
		put(E['ios-share-x'], { o: cl((e - 0.3) / 0.7) });
		// „Mehr anzeigen“: der Pfeil dreht sich über 350 ms, die Beschriftung blendet über
		const mr = seg(t, T3 + 0.065, 0.35);
		put(E['ios-mehr-t'], { o: 1 - mr });
		put(E['ios-weniger-t'], { o: mr });
		put(E['ios-mehr-pfeil'], { o: 1, transform: `rotate(${Math.round(180 * io(mr))}deg)` });
		put(E['ios-weniger-pfeil'], { o: 0 });
		put(E['ios-scrim1'], { o: 0.18 * e });

		// ---------- Dialog „Zum Home-Bildschirm“ ----------
		const dIn = aus(seg(t, T4, 0.58));
		const dh = aus(seg(t, T5, 0.2));
		put(E['ios-scrim2'], { o: 0.26 * dIn });
		put(E['ios-dlg'], {
			d: t > T4 - 0.01 ? 'block' : '',
			t: tf(0, (1 - dIn) * 800),
			height: `${797 - 470 * dh}px`,
			borderRadius: `${mix(40, 30, dh)}px`,
		});
		put(E['ios-dlg-in'], { o: seg(t, T4 + 0.4, 0.4) });
		put(E['ios-caret'], { o: t > T4 + 0.5 && t < T5 && Math.floor((t - T4) * 1.9) % 2 === 0 ? 1 : 0 });
		const kIn = aus(seg(t, T4 + 0.33, 0.3));
		const kOut = io(seg(t, T5, 0.1));
		put(E['ios-kbd'], {
			d: t > T4 + 0.32 && t < T5 + 0.12 ? 'block' : '',
			t: tf(0, (1 - kIn) * 329 + kOut * 329),
		});

		// ---------- Hinzufügen: Safari zieht sich aus der Mitte zusammen und blendet aus, Home entblurrt ----------
		const sp = io(seg(t, T5 + 0.1, 0.25));
		const sc = 1 - 0.4 * sp;
		const stackAn = t < T5 + 0.37;
		put(E['ios-stack'], {
			d: stackAn ? 'block' : '',
			t: tf(195 - sc * 195, 422 - sc * 422, sc),
			o: 1 - sp,
			borderRadius: `${46 * sp}px`,
		});
		const he = aus(seg(t, T5 + 0.12, 0.5));
		const lz = aus(seg(t, T6, 0.4));
		const homeAn = t > T5 - 0.01 && t < T6 + 1.15;
		put(E['ios-home'], {
			d: homeAn ? 'block' : '',
			o: 1,
			f: fl(14 * (1 - he) + 14 * lz, mix(0.7, 1, he) * (1 - 0.35 * lz)),
			t: tf(0, 0, 1.08 - 0.08 * he - 0.05 * lz),
		});
		// das Symbol kommt erst in die Zelle, wenn der Home-Bildschirm scharf ist, mit weicher Feder 0,7 -> 1
		const ip = feder(t - (T5 + 0.55), 0.6, 20);
		put(E['ios-icon'], {
			o: seg(t, T5 + 0.53, 0.12),
			t: tf(0, 0, mix(0.7, 1, Math.min(ip, 1.15))),
		});

		// ---------- Start der App: Karte wächst aus dem Icon, schwarzes Startbild, Überblendung ----------
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
		// das Zeichen steht auf dem schwarzen Startbild und ist weg, bevor die App einblendet
		put(E['ios-launch-logo'], { o: seg(t, T6 + 0.25, 0.25) * (1 - seg(t, T6 + 0.6, 0.2)) });
		put(E['ios-app'], { d: t > T6 + 0.8 ? 'block' : '', o: aF });

		// ---------- Statusleiste ----------
		const hell = t < T5 + 0.18 ? 0 : t < T6 + 0.2 ? 1 : 0;
		put(E['ios-st-dunkel'], { o: 1 - hell });
		put(E['ios-st-hell'], { o: hell });
	},
};
