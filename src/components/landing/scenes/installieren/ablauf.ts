// Ablauf der Installation im Gerät: zeitgesteuerte Schleife, solange der Abschnitt im Bild ist.
//
// - Der Zustand ist eine reine Funktion der Zeit (plan.render), ein Sprung auf einen Schritt ist daher exakt.
// - Pause außerhalb des Bildes (die Seitenschleife ruft frame nur bei sichtbarem Gerät auf), Neustart beim
//   Wiedereintritt und bei jedem Tabwechsel.
// - reduce: keine Schleife, je Schritt ein Standbild.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { plan as android } from './android-plan';
import { plan as ios } from './ios-plan';
import { plan as rechner } from './rechner-plan';
import { put } from './stil';
import type { Elemente, TabIndex } from './types';
import { tipp } from './zeit';

const PLAENE = [ios, android, rechner] as const;
const VORLAUF = 0.12; // kurzer Halt auf dem Startbild beim Tabwechsel, bevor der Ablauf beginnt

/** Zustand des Ablaufs im Gerät. */
interface AblaufState extends SceneState {
	/** Elemente des Geräts nach data-k. */
	E: Elemente;
	/** Tipp-Anzeige (Ring am Handy, Zeiger am Rechner). */
	tap: HTMLElement | null;
	/** Schrittliste neben dem Gerät (wechselt mit dem Tab). */
	steps: HTMLElement[];
	/** Bildunterschrift im Hochformat. */
	kurz: HTMLElement | null;
	/** Gewählter Reiter, -1 vor dem ersten Bild. */
	tab: TabIndex | -1;
	/** Uhr des Ablaufs in Sekunden (negativ im Vorlauf). */
	clk: number;
	/** Bildzähler der Schleife beim letzten Bild dieser Szene (erkennt Zeiten außer Sicht). */
	n: number;
	/** Standbild-Schritt (reduce). */
	still: number;
	/** Aktiver Schritt, -1 = noch keiner markiert. */
	aktiv: number;
	dirty: boolean;
	frisch: boolean;
	wasReduced: boolean;
	/** Uhr angehalten (Messhaken). */
	halt: boolean;
}

/** Rechenzeit je Bild (Messhaken, Abnahme I-9). */
const zeit = { n: 0, sum: 0, max: 0 };

/**
 * fr: Gerätrahmen [data-ins="frame"], sec: Abschnitt, getTab(): 0 iPhone, 1 Android, 2 Rechner.
 * Gibt { stop, sprung(i), schritte() } zurück.
 */
export function registerAblauf(fr: HTMLElement, sec: HTMLElement, getTab: () => TabIndex) {
	let st: AblaufState | null = null;
	const aus = register<AblaufState>({
		name: 'installieren',
		el: fr,
		host: fr,
		init(s) {
			st = s;
			s.E = {};
			for (const el of fr.querySelectorAll<HTMLElement>('[data-k]')) {
				const k = el.getAttribute('data-k');
				if (k !== null) s.E[k] = el;
			}
			s.tap = fr.querySelector<HTMLElement>('[data-ins="tap"]');
			s.steps = [...sec.querySelectorAll<HTMLElement>('[data-istep]')];
			s.kurz = sec.querySelector<HTMLElement>('[data-kurz]');
			s.tab = -1;
			s.clk = 0;
			s.n = 0;
			s.still = 0;
			s.aktiv = -1;
			s.dirty = true;
			s.frisch = false;
			s.wasReduced = false;
			s.halt = false;
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
			let t: number;
			if (s.reduced) {
				// Standbild des gewählten Schritts, nur bei Änderung zeichnen
				if (!s.dirty && s.wasReduced) return;
				s.wasReduced = true;
				t = pl.still[s.still] ?? 0;
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
			// Kein Schleier: beim Tabwechsel steht sofort das Startbild des neuen Plans (pl.render(0)), nie ein leerer Schirm
			put(s.E.veil, { o: 0 });
			// Tipp-Anzeige: am Handy ein halbtransparenter Ring, am Rechner der macOS-Zeiger (Spitze auf dem Ziel)
			if (s.tap) {
				const maus = tab === 2;
				const k = s.reduced ? { o: 0, x: 0, y: 0, s: 1 } : tipp(pl.taps, t);
				const off = maus ? 0 : 18;
				if (s.tap.dataset.z !== (maus ? 'maus' : 'touch'))
					s.tap.dataset.z = maus ? 'maus' : 'touch';
				put(s.tap, {
					o: maus ? k.o : k.o * 0.95,
					t: `translate(${(k.x * ks - off).toFixed(1)}px,${(k.y * ks - off).toFixed(1)}px) scale(${(maus ? 1 - (1 - k.s) * 0.67 : k.s).toFixed(3)})`,
				});
			}
			// aktiver Schritt (die Liste wechselt mit dem Tab)
			if (!s.steps[0]?.isConnected) {
				s.steps = [...sec.querySelectorAll<HTMLElement>('[data-istep]')];
				s.aktiv = -1;
			}
			let a = 0;
			for (let i = 0; i < pl.sprung.length; i++) if (t >= (pl.sprung[i] ?? 0)) a = i;
			if (s.reduced) a = s.still;
			// Rechenzeit je Bild (Messhaken, Abnahme I-9)
			const mz = performance.now() - m0;
			zeit.n++;
			zeit.sum += mz;
			if (mz > zeit.max) zeit.max = mz;
			if (a !== s.aktiv) {
				s.aktiv = a;
				// Bildunterschrift im Hochformat: der aktive Schritt als eine Zeile unter dem Gerät
				const z = s.steps[a]?.querySelector('[data-zeile]');
				if (s.kurz && z) s.kurz.replaceChildren(...z.cloneNode(true).childNodes);
				for (const el of s.steps) {
					const an = Number(el.getAttribute('data-istep')) === a;
					el.toggleAttribute('data-aktiv', an);
					if (an) el.setAttribute('aria-current', 'step');
					else el.removeAttribute('aria-current');
				}
			}
		},
	});
	// Messhaken für tools/qa (nur mit ?qa=1 gelesen): Uhr anhalten und setzen, Zustand je Zeit prüfen
	qa.install = {
		halte(b: unknown) {
			if (st) st.halt = !!b;
		},
		setze(x: number) {
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
		plan: (i: TabIndex) => ({
			loop: PLAENE[i].loop,
			sprung: PLAENE[i].sprung,
			taps: PLAENE[i].taps,
		}),
	};
	return {
		stop: aus,
		/** Springt an den Anfang von Schritt i (reduce: zeigt dessen Standbild). */
		sprung(i: number) {
			if (!st) return;
			const pl = PLAENE[st.tab === -1 ? getTab() : st.tab];
			st.clk = pl.sprung[i] ?? 0;
			st.still = i;
			st.dirty = true;
		},
		/** Schritte neu einsammeln (nach Tabwechsel ändert sich die Liste). */
		schritte() {
			if (!st) return;
			st.steps = [...sec.querySelectorAll<HTMLElement>('[data-istep]')];
			st.aktiv = -1;
		},
	};
}
