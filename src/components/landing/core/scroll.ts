// Scroll core (PLAN-V2 4.5): section measures, holding the position on resize and rotation,
// jump links per decision 12. Native document scroll; mouse wheel and trackpad glide through Lenis.
// Lenis has no rAF loop of its own, it runs on the page's frame clock (onFrame first, before the scenes).
// Touch stays native (syncTouch off); with reduced motion there is no Lenis.
// Mark custom scroll areas with data-lenis-prevent.

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { loop, onFrame, qa } from './loop';

const SEC = '[data-sec]';

/** Measured section in document coordinates. */
interface SectionMeasure {
	el: HTMLElement;
	id: string;
	top: number;
	h: number;
}

/** Position in the document: section index i and fraction p within it. */
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

/** Section by id: { top, height } in document coordinates. */
export function sectionBox(id: string): { top: number; height: number } | null {
	const el = document.getElementById(id);
	if (!el) return null;
	const r = el.getBoundingClientRect();
	return { top: r.top + window.scrollY, height: r.height };
}

/** Progress within a sticky section: 0 at the start, 1 when the stage lets go at the end. */
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
	// Lenis: duration 1.1 s, ease-out-expo. Off with reduced motion (also when the setting changes later).
	let lenis: Lenis | null = null;
	let stopFrame = () => {};
	const mqRed = matchMedia('(prefers-reduced-motion: reduce)');
	const enableLenis = () => {
		if (lenis || mqRed.matches) return;
		// Wheel and trackpad use lerp instead of a duration curve: the curve restarted on every wheel event with a
		// jump in speed (trackpads send many small events, which made it stutter). Lerp catches up
		// steadily per frame and independently of the frame rate. Clicks on section links keep their own curve (onClick below).
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
	/** Jump to a position immediately (holding the position, jump behind the veil). */
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

	// After layout: if the section measures changed, restore the same position.
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
		// Phone URL bar (small height change, same width): leave everything alone, no anchor jump-back
		if (innerWidth === w0 && Math.abs(innerHeight - h0) < 150) return;
		pending = true;
		cancelAnimationFrame(settleRaf);
		settleRaf = requestAnimationFrame(() => {
			settleRaf = requestAnimationFrame(settle);
		});
	};

	// Content height changes (questions expand, fonts loaded): update the measures, move nothing.
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

	// Jump links: smooth up to 3 screen heights, beyond that immediate with a short crossfade over #0A0A0A.
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
