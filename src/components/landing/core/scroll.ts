// Scroll-Kern (PLAN-V2 4.5): Abschnittsmaße, Stelle halten bei Größenwechsel und Drehen,
// Sprunglinks nach Entscheidung 12. Nativer Dokument-Scroll, Mausrad und Trackpad gleiten über Lenis.
// Lenis hat keine eigene rAF-Schleife, es läuft im Bild-Takt der Seite (onFrame zuerst, vor den Szenen).
// Touch bleibt nativ (syncTouch aus), bei reduzierter Bewegung gibt es kein Lenis.
// Eigene Scrollflächen markiert man mit data-lenis-prevent.

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { loop, onFrame, qa } from './loop';

const SEC = '[data-sec]';

/** Gemessener Abschnitt in Dokumentkoordinaten. */
interface SectionMeasure {
	el: HTMLElement;
	id: string;
	top: number;
	h: number;
}

/** Stelle im Dokument: Abschnittsindex i und Anteil p darin. */
interface Anchor {
	i: number;
	p: number;
}

function measureAll(list: HTMLElement[]): SectionMeasure[] {
	const y = window.scrollY;
	return list.map((el) => {
		const r = el.getBoundingClientRect();
		return { el, id: el.id, top: r.top + y, h: r.height };
	});
}

function anchorOf(m: SectionMeasure[], y: number): Anchor | null {
	let i = m.length - 1;
	for (let k = 0; k < m.length; k++) {
		const a = m[k];
		if (a && y < a.top + a.h) {
			i = k;
			break;
		}
	}
	const a = m[i];
	return a ? { i, p: (y - a.top) / Math.max(1, a.h) } : null;
}

/** Abschnitt per Id: { top, height } in Dokumentkoordinaten. */
export function sectionBox(id: string): { top: number; height: number } | null {
	const el = document.getElementById(id);
	if (!el) return null;
	const r = el.getBoundingClientRect();
	return { top: r.top + window.scrollY, height: r.height };
}

/** Fortschritt in einem Sticky-Abschnitt: 0 am Anfang, 1 wenn die Bühne am Ende loslässt. */
export function stickP(sec: Element, stageH: number): number {
	const r = sec.getBoundingClientRect();
	return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - stageH)));
}

function targetY(el: Element): number {
	const smt = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
	return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - smt));
}

const expoOut = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t));

export function initScroll(root: HTMLElement): () => void {
	history.scrollRestoration = 'auto';
	// Lenis: Dauer 1,1 s, ease-out-expo. Aus bei reduzierter Bewegung (auch wenn die Einstellung später wechselt).
	let lenis: Lenis | null = null;
	let stopFrame = () => {};
	const mqRed = matchMedia('(prefers-reduced-motion: reduce)');
	const enableLenis = () => {
		if (lenis || mqRed.matches) return;
		// Rad und Trackpad mit Lerp statt Dauer-Kurve: die Kurve startete bei jedem Rad-Ereignis neu mit einem
		// Geschwindigkeitssprung (Trackpads senden viele kleine Ereignisse, das stotterte). Lerp gleicht je Bild
		// stetig und bildratenunabhängig nach. Klicks auf Abschnitts-Links behalten ihre eigene Kurve (onClick unten).
		lenis = new Lenis({
			autoRaf: false,
			lerp: 0.1,
			smoothWheel: true,
			syncTouch: false,
		});
		qa.lenis = lenis;
		stopFrame = onFrame((_t, _dt, now) => lenis?.raf(now * 1000), true);
	};
	const disableLenis = () => {
		stopFrame();
		lenis?.destroy();
		lenis = null;
		qa.lenis = undefined;
	};
	const onReduced = () => (mqRed.matches ? disableLenis() : enableLenis());
	mqRed.addEventListener('change', onReduced);
	enableLenis();
	/** Sofort an eine Stelle (Stelle halten, Sprung hinter dem Schleier). */
	const setY = (y: number) => {
		if (lenis) {
			lenis.resize();
			lenis.scrollTo(y, { immediate: true, force: true });
		} else window.scrollTo({ top: y, behavior: 'instant' });
	};
	const list = [...root.querySelectorAll<HTMLElement>(SEC)];
	let m = measureAll(list);
	let anchor = anchorOf(m, window.scrollY);
	let w0 = innerWidth;
	let h0 = innerHeight;
	let pending = false;
	let settleRaf = 0;

	const onScroll = () => {
		if (!pending) anchor = anchorOf(m, window.scrollY);
	};

	// Nach dem Layout: haben sich die Abschnittsmaße geändert, dieselbe Stelle wieder setzen.
	const settle = () => {
		const nm = measureAll(list);
		const changed =
			nm.length !== m.length ||
			nm.some(
				(a, i) => Math.abs(a.top - (m[i]?.top ?? 0)) > 1 || Math.abs(a.h - (m[i]?.h ?? 0)) > 1,
			);
		const a = anchor && nm[anchor.i];
		if (changed && anchor && a) setY(Math.round(a.top + anchor.p * a.h));
		m = changed ? measureAll(list) : nm;
		w0 = innerWidth;
		h0 = innerHeight;
		pending = false;
		anchor = anchorOf(m, window.scrollY);
	};

	const onResize = () => {
		// URL-Leiste auf dem Handy (kleine Höhenänderung, gleiche Breite): nichts anfassen, kein Anker-Rücksprung
		if (innerWidth === w0 && Math.abs(innerHeight - h0) < 150) return;
		pending = true;
		cancelAnimationFrame(settleRaf);
		settleRaf = requestAnimationFrame(() => {
			settleRaf = requestAnimationFrame(settle);
		});
	};

	// Inhaltshöhe ändert sich (Fragen aufklappen, Schriften geladen): Maße nachziehen, nichts verschieben.
	const ro = new ResizeObserver(() => {
		if (pending) return;
		m = measureAll(list);
		anchor = anchorOf(m, window.scrollY);
	});
	ro.observe(root);
	document.fonts?.ready.then(() => {
		if (!pending) {
			m = measureAll(list);
			anchor = anchorOf(m, window.scrollY);
		}
	});

	// Sprunglinks: bis 3 Bildschirmhöhen weich, darüber sofort mit kurzer Überblendung über #0A0A0A.
	let veil: HTMLDivElement | null = null;
	const veilEl = (): HTMLDivElement => {
		if (veil) return veil;
		veil = document.createElement('div');
		veil.setAttribute('aria-hidden', 'true');
		veil.style.cssText =
			'position:fixed;inset:0;background:#0A0A0A;opacity:0;pointer-events:none;z-index:90';
		root.appendChild(veil);
		return veil;
	};
	const jump = (y: number) => {
		const v = veilEl();
		const a = v.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 80, fill: 'forwards' });
		a.finished
			.then(() => {
				setY(y);
				return v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 80, fill: 'forwards' })
					.finished;
			})
			.catch(() => {});
	};
	const onClick = (e: MouseEvent) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
			return;
		const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
		if (!a) return;
		const id = decodeURIComponent((a.getAttribute('href') ?? '').slice(1));
		const target = id ? document.getElementById(id) : null;
		if (!target) return;
		e.preventDefault();
		const y = targetY(target);
		const d = Math.abs(y - window.scrollY);
		if (loop.reduced) setY(y);
		else if (d > 3 * innerHeight) jump(y);
		else if (lenis)
			lenis.scrollTo(y, { duration: 1.1 + 0.35 * Math.min(3, d / innerHeight), easing: expoOut });
		else window.scrollTo({ top: y, behavior: 'smooth' });
		history.pushState(null, '', `#${id}`);
		target.focus({ preventScroll: true });
	};

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onResize);
	root.addEventListener('click', onClick);
	return () => {
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onResize);
		root.removeEventListener('click', onClick);
		cancelAnimationFrame(settleRaf);
		ro.disconnect();
		veil?.remove();
		mqRed.removeEventListener('change', onReduced);
		disableLenis();
	};
}
