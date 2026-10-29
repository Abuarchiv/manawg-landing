// Install playback on the device: time-driven loop while the section is in view.
//
// - The state is a pure function of time (plan.render), so jumping to a step is exact.
// - Pauses off screen (the page loop calls frame only while the device is visible), restarts on
//   re-entry and on every tab switch.
// - reduce: no loop, one still frame per step.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { plan as android } from './android-plan';
import { plan as desktop } from './desktop-plan';
import { plan as ios } from './ios-plan';
import { put } from './style';
import { tapAt } from './timing';
import type { Elements, TabIndex } from './types';

const PLANS = [ios, android, desktop] as const;
const LEAD_IN = 0.12; // short hold on the start frame on tab switch, before playback begins

/** State of the playback on the device. */
interface PlaybackState extends SceneState {
	/** Device elements by data-k. */
	E: Elements;
	/** Tap indicator (ring on the phone, pointer on the desktop). */
	tap: HTMLElement | null;
	/** Step list next to the device (changes with the tab). */
	steps: HTMLElement[];
	/** Caption in portrait layout. */
	caption: HTMLElement | null;
	/** Selected tab, -1 before the first frame. */
	tab: TabIndex | -1;
	/** Playback clock in seconds (negative during the lead-in). */
	clk: number;
	/** Loop frame counter at this scene's last frame (detects time spent off screen). */
	n: number;
	/** Still-frame step (reduce). */
	still: number;
	/** Active step, -1 = none marked yet. */
	active: number;
	/** Progress within the active step (0..1), last written. */
	progress: number;
	dirty: boolean;
	fresh: boolean;
	wasReduced: boolean;
	/** Clock halted (measurement hook). */
	halt: boolean;
}

/** Compute time per frame (measurement hook). */
const timing = { n: 0, sum: 0, max: 0 };

/**
 * fr: device frame [data-ins="frame"], sec: section, getTab(): 0 iPhone, 1 Android, 2 desktop.
 * Returns { stop, jumpTo(i), collectSteps() }.
 */
export function registerPlayback(fr: HTMLElement, sec: HTMLElement, getTab: () => TabIndex) {
	// Progress within the active step as a line (step list) and segment (caption in portrait layout)
	const drawProgress = (s: PlaybackState, pl: (typeof PLANS)[number], t: number) => {
		const a0 = pl.jumps[s.active] ?? 0;
		const a1 = pl.jumps[s.active + 1] ?? pl.loop;
		const f = s.reduced ? 1 : Math.min(1, Math.max(0, (t - a0) / Math.max(0.01, a1 - a0)));
		if (Math.abs(f - s.progress) < 0.004 && f !== 1) return;
		s.progress = f;
		const v = f.toFixed(3);
		s.steps[s.active]?.style.setProperty('--progress', v);
		s.caption?.style.setProperty('--progress', v);
	};
	let st: PlaybackState | null = null;
	const off = register<PlaybackState>({
		name: 'install',
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
			const gap = loop.n - s.n > 2; // was not in view
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
				// Still frame of the selected step, drawn only on change
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
			// On tab switch the screen stays dark until the frame is settled, then fades in. The loop restart
			// is a hard cut (no half-blended frame, no empty frame).
			if (t > 0.3) s.fresh = false;
			// No veil: on tab switch the start frame of the new plan (pl.render(0)) shows immediately, never an empty screen
			put(s.E.veil, { o: 0 });
			// Tap indicator: a semi-transparent ring on the phone, the macOS pointer on the desktop (tip on the target)
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
			// active step (the list changes with the tab)
			if (!s.steps[0]?.isConnected) {
				s.steps = [...sec.querySelectorAll<HTMLElement>('[data-istep]')];
				s.active = -1;
			}
			let a = 0;
			for (let i = 0; i < pl.jumps.length; i++) if (t >= (pl.jumps[i] ?? 0)) a = i;
			if (s.reduced) a = s.still;
			const mz = performance.now() - m0;
			timing.n++;
			timing.sum += mz;
			if (mz > timing.max) timing.max = mz;
			if (a !== s.active) {
				s.active = a;
				// Caption in portrait layout: the active step as one line below the device
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
					if (!isActive) el.style.removeProperty('--progress');
				}
				s.progress = -1;
			}
			drawProgress(s, pl, t);
		},
	});
	// Measurement hook for landing-konzept/werkzeuge/qa (read only with ?qa=1): halt and set the clock, check the state per time
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
		/** Jumps to the start of step i (reduce: shows its still frame). */
		jumpTo(i: number) {
			if (!st) return;
			const pl = PLANS[st.tab === -1 ? getTab() : st.tab];
			st.clk = pl.jumps[i] ?? 0;
			st.still = i;
			st.dirty = true;
		},
		/** Re-collects the steps (the list changes after a tab switch). */
		collectSteps() {
			if (!st) return;
			st.steps = [...sec.querySelectorAll<HTMLElement>('[data-istep]')];
			st.active = -1;
		},
	};
}
