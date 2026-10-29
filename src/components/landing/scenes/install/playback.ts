// Ablauf der Installation im Gerät: zeitgesteuerte Schleife, solange der Abschnitt im Bild ist.
//
// - Der Zustand ist eine reine Funktion der Zeit (plan.render), ein Sprung auf einen Schritt ist daher exakt.
// - Pause außerhalb des Bildes (die Seitenschleife ruft frame nur bei sichtbarem Gerät auf), Neustart beim
//   Wiedereintritt und bei jedem Tabwechsel.
// - reduce: keine Schleife, je Schritt ein Standbild.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { plan as android } from './android-plan';
import { plan as desktop } from './desktop-plan';
import { plan as ios } from './ios-plan';
import { put } from './style';
import { tapAt } from './timing';
import type { Elements, TabIndex } from './types';

const PLANS = [ios, android, desktop] as const;
const LEAD_IN = 0.12; // kurzer Halt auf dem Startbild beim Tabwechsel, bevor der Ablauf beginnt

/** Zustand des Ablaufs im Gerät. */
interface PlaybackState extends SceneState {
	/** Elemente des Geräts nach data-k. */
	E: Elements;
	/** Tipp-Anzeige (Ring am Handy, Zeiger am Rechner). */
	tap: HTMLElement | null;
	/** Schrittliste neben dem Gerät (wechselt mit dem Tab). */
	steps: HTMLElement[];
	/** Bildunterschrift im Hochformat. */
	caption: HTMLElement | null;
	/** Gewählter Reiter, -1 vor dem ersten Bild. */
	tab: TabIndex | -1;
	/** Uhr des Ablaufs in Sekunden (negativ im Vorlauf). */
	clk: number;
	/** Bildzähler der Schleife beim letzten Bild dieser Szene (erkennt Zeiten außer Sicht). */
	n: number;
	/** Standbild-Schritt (reduce). */
	still: number;
	/** Aktiver Schritt, -1 = noch keiner markiert. */
	active: number;
	/** Fortschritt im aktiven Schritt (0..1), zuletzt geschrieben. */
	progress: number;
	dirty: boolean;
	fresh: boolean;
	wasReduced: boolean;
	/** Uhr angehalten (Messhaken). */
	halt: boolean;
}

/** Rechenzeit je Bild (Messhaken, Abnahme I-9). */
const timing = { n: 0, sum: 0, max: 0 };

/**
 * fr: Gerätrahmen [data-ins="frame"], sec: Abschnitt, getTab(): 0 iPhone, 1 Android, 2 Rechner.
 * Gibt { stop, sprung(i), schritte() } zurück.
 */
export function registerPlayback(fr: HTMLElement, sec: HTMLElement, getTab: () => TabIndex) {
	// Fortschritt im aktiven Schritt als Linie (Schrittliste) und Segment (Bildunterschrift im Hochformat)
	const drawProgress = (s: PlaybackState, pl: (typeof PLANS)[number], t: number) => {
		const a0 = pl.jumps[s.active] ?? 0;
		const a1 = pl.jumps[s.active + 1] ?? pl.loop;
		const f = s.reduced ? 1 : Math.min(1, Math.max(0, (t - a0) / Math.max(0.01, a1 - a0)));
		if (Math.abs(f - s.progress) < 0.004 && f !== 1) return;
		s.progress = f;
		const v = f.toFixed(3);
		s.steps[s.active]?.style.setProperty('--fort', v);
		s.caption?.style.setProperty('--fort', v);
	};
	let st: PlaybackState | null = null;
	const off = register<PlaybackState>({
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
			s.caption = sec.querySelector<HTMLElement>('[data-kurz]');
			s.tab = -1;
			s.clk = 0;
			s.n = 0;
			s.still = 0;
			s.active = -1;
			s.progress = -1;
			s.dirty = true;
			s.fresh = false;
			s.wasReduced = false;
			s.halt = false;
		},
		frame(s, _t, dt) {
			const m0 = performance.now();
			const tab = getTab();
			const pl = PLANS[tab];
			const gap = loop.n - s.n > 2; // war nicht im Bild
			s.n = loop.n;
			if (tab !== s.tab) {
				s.tab = tab;
				s.fresh = true;
				s.clk = -LEAD_IN;
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
			if (t > 0.3) s.fresh = false;
			// Kein Schleier: beim Tabwechsel steht sofort das Startbild des neuen Plans (pl.render(0)), nie ein leerer Schirm
			put(s.E.veil, { o: 0 });
			// Tipp-Anzeige: am Handy ein halbtransparenter Ring, am Rechner der macOS-Zeiger (Spitze auf dem Ziel)
			if (s.tap) {
				const mouse = tab === 2;
				const k = s.reduced ? { o: 0, x: 0, y: 0, s: 1 } : tapAt(pl.taps, t);
				const ringOffset = mouse ? 0 : 18;
				if (s.tap.dataset.z !== (mouse ? 'maus' : 'touch'))
					s.tap.dataset.z = mouse ? 'maus' : 'touch';
				put(s.tap, {
					o: mouse ? k.o : k.o * 0.95,
					t: `translate(${(k.x * ks - ringOffset).toFixed(1)}px,${(k.y * ks - ringOffset).toFixed(1)}px) scale(${(mouse ? 1 - (1 - k.s) * 0.67 : k.s).toFixed(3)})`,
				});
			}
			// aktiver Schritt (die Liste wechselt mit dem Tab)
			if (!s.steps[0]?.isConnected) {
				s.steps = [...sec.querySelectorAll<HTMLElement>('[data-istep]')];
				s.active = -1;
			}
			let a = 0;
			for (let i = 0; i < pl.jumps.length; i++) if (t >= (pl.jumps[i] ?? 0)) a = i;
			if (s.reduced) a = s.still;
			// Rechenzeit je Bild (Messhaken, Abnahme I-9)
			const mz = performance.now() - m0;
			timing.n++;
			timing.sum += mz;
			if (mz > timing.max) timing.max = mz;
			if (a !== s.active) {
				s.active = a;
				// Bildunterschrift im Hochformat: der aktive Schritt als eine Zeile unter dem Gerät
				const z = s.steps[a]?.querySelector('[data-zeile]');
				if (s.caption && z) {
					const nr = document.createElement('span');
					nr.className = 'label';
					nr.dataset.kurzNr = '';
					nr.textContent = `0${a + 1} / 0${pl.jumps.length}`;
					s.caption.replaceChildren(nr, ...z.cloneNode(true).childNodes);
					s.caption.dataset.schritt = String(a);
				}
				for (const el of s.steps) {
					const isActive = Number(el.getAttribute('data-istep')) === a;
					el.toggleAttribute('data-aktiv', isActive);
					if (isActive) el.setAttribute('aria-current', 'step');
					else el.removeAttribute('aria-current');
					if (!isActive) el.style.removeProperty('--fort');
				}
				s.progress = -1;
			}
			drawProgress(s, pl, t);
		},
	});
	// Messhaken für landing-konzept/werkzeuge/qa (nur mit ?qa=1 gelesen): Uhr anhalten und setzen, Zustand je Zeit prüfen
	qa.install = {
		halte(b: unknown) {
			if (st) st.halt = !!b;
		},
		setze(x: number) {
			if (st) st.clk = x;
		},
		uhr: () => st?.clk ?? 0,
		zeit: () => ({ ...timing, mittel: timing.sum / Math.max(1, timing.n) }),
		zeitNull() {
			timing.n = 0;
			timing.sum = 0;
			timing.max = 0;
		},
		tab: () => st?.tab ?? -1,
		plan: (i: TabIndex) => ({
			loop: PLANS[i].loop,
			sprung: PLANS[i].jumps,
			taps: PLANS[i].taps,
		}),
	};
	return {
		stop: off,
		/** Springt an den Anfang von Schritt i (reduce: zeigt dessen Standbild). */
		jumpTo(i: number) {
			if (!st) return;
			const pl = PLANS[st.tab === -1 ? getTab() : st.tab];
			st.clk = pl.jumps[i] ?? 0;
			st.still = i;
			st.dirty = true;
		},
		/** Schritte neu einsammeln (nach Tabwechsel ändert sich die Liste). */
		collectSteps() {
			if (!st) return;
			st.steps = [...sec.querySelectorAll<HTMLElement>('[data-istep]')];
			st.active = -1;
		},
	};
}
