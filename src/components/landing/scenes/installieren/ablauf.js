// Ablauf der Installation im Gerät: zeitgesteuerte Schleife, solange der Abschnitt im Bild ist.
//
// - Der Zustand ist eine reine Funktion der Zeit (plan.render), ein Sprung auf einen Schritt ist daher exakt.
// - Pause außerhalb des Bildes (die Seitenschleife ruft frame nur bei sichtbarem Gerät auf), Neustart beim
//   Wiedereintritt und bei jedem Tabwechsel.
// - reduce: keine Schleife, je Schritt ein Standbild.

import { loop, qa, register } from '../../core/loop';
import { cl } from './zeit';
import { put } from './stil';
import { tipp } from './zeit';
import { plan as android } from './android-plan';
import { plan as ios } from './ios-plan';
import { plan as rechner } from './rechner-plan';

const PLAENE = [ios, android, rechner];
const VORLAUF = 0.5; // Rahmenwechsel beim Tabwechsel, bevor der Ablauf beginnt

/**
 * fr: Gerätrahmen [data-ins="frame"], sec: Abschnitt, getTab(): 0 iPhone, 1 Android, 2 Rechner.
 * Gibt { stop, sprung(i) } zurück.
 */
const zeit = { n: 0, sum: 0, max: 0 };

export function registerAblauf(fr, sec, getTab) {
	let st = null;
	const aus = register({
		name: 'installieren',
		el: fr,
		host: fr,
		init(s) {
			st = s;
			s.E = {};
			for (const el of fr.querySelectorAll('[data-k]')) s.E[el.getAttribute('data-k')] = el;
			s.tap = fr.querySelector('[data-ins="tap"]');
			s.steps = [...sec.querySelectorAll('[data-istep]')];
			s.tab = -1;
			s.clk = 0;
			s.n = 0;
			s.still = 0;
			s.aktiv = -1;
			s.dirty = true;
		},
		frame(s, _t, dt) {
			const m0 = performance.now();
			const tab = getTab();
			const pl = PLAENE[tab];
			const gap = loop.n - s.n > 2; // war nicht im Bild
			s.n = loop.n;
			if (tab !== s.tab) {
				s.tab = tab;
				s.frisch = true;
				s.clk = -VORLAUF;
				s.still = 0;
				s.dirty = true;
			} else if (gap) {
				s.clk = 0;
				s.dirty = true;
			}
			let t;
			if (s.reduced) {
				// Standbild des gewählten Schritts, nur bei Änderung zeichnen
				if (!s.dirty && s.wasReduced) return;
				s.wasReduced = true;
				t = pl.still[s.still];
				s.dirty = false;
			} else {
				s.wasReduced = false;
				if (!s.halt) s.clk += dt;
				if (s.clk >= pl.loop) s.clk -= pl.loop;
				t = s.clk;
			}
			const ks = pl.ks;
			pl.render(Math.max(t, 0), s.E);
			// Beim Tabwechsel bleibt der Schirm dunkel, bis der Rahmen steht, und blendet dann ein. Der Neustart der
			// Schleife ist ein harter Schnitt (kein Bild halb überblendet, kein leeres Bild).
			if (t > 0.3) s.frisch = false;
			put(s.E.veil, { o: s.frisch && !s.reduced ? (t < 0 ? 1 : 1 - cl(t / 0.2)) : 0 });
			// Tipp-Anzeige
			if (s.tap) {
				const k = s.reduced ? { o: 0, x: 0, y: 0, s: 1 } : tipp(pl.taps, t);
				put(s.tap, {
					o: k.o * 0.9,
					t: `translate(${(k.x * ks - 17).toFixed(1)}px,${(k.y * ks - 17).toFixed(1)}px) scale(${k.s.toFixed(3)})`,
				});
			}
			// aktiver Schritt (die Liste wechselt mit dem Tab)
			if (!s.steps[0]?.isConnected) {
				s.steps = [...sec.querySelectorAll('[data-istep]')];
				s.aktiv = -1;
			}
			let a = 0;
			for (let i = 0; i < pl.sprung.length; i++) if (t >= pl.sprung[i]) a = i;
			if (s.reduced) a = s.still;
			// Rechenzeit je Bild (Messhaken, Abnahme I-9)
			const mz = performance.now() - m0;
			zeit.n++;
			zeit.sum += mz;
			if (mz > zeit.max) zeit.max = mz;
			if (a !== s.aktiv) {
				s.aktiv = a;
				for (const el of s.steps) {
					const an = +el.getAttribute('data-istep') === a;
					el.toggleAttribute('data-aktiv', an);
					if (an) el.setAttribute('aria-current', 'step');
					else el.removeAttribute('aria-current');
				}
			}
		},
	});
	// Messhaken für tools/qa (nur mit ?qa=1 gelesen): Uhr anhalten und setzen, Zustand je Zeit prüfen
	qa.install = {
		halte(b) {
			if (st) st.halt = !!b;
		},
		setze(x) {
			if (st) st.clk = x;
		},
		uhr: () => st?.clk ?? 0,
		zeit: () => ({ ...zeit, mittel: zeit.sum / Math.max(1, zeit.n) }),
		zeitNull() {
			zeit.n = 0;
			zeit.sum = 0;
			zeit.max = 0;
		},
		tab: () => st?.tab ?? -1,
		plan: (i) => ({ loop: PLAENE[i].loop, sprung: PLAENE[i].sprung, taps: PLAENE[i].taps }),
	};
	return {
		stop: aus,
		/** Springt an den Anfang von Schritt i (reduce: zeigt dessen Standbild). */
		sprung(i) {
			if (!st) return;
			const pl = PLAENE[st.tab < 0 ? getTab() : st.tab];
			st.clk = pl.sprung[i] ?? 0;
			st.still = i;
			st.dirty = true;
		},
		/** Schritte neu einsammeln (nach Tabwechsel ändert sich die Liste). */
		schritte() {
			if (!st) return;
			st.steps = [...sec.querySelectorAll('[data-istep]')];
			st.aktiv = -1;
		},
	};
}
