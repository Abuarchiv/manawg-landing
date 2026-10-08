// Scroll-Kern (PLAN-V2 4.5): Abschnittsmaße, Stelle halten bei Größenwechsel und Drehen,
// Sprunglinks nach Entscheidung 12. Nativer Dokument-Scroll, keine Bibliothek.

import { loop } from './loop';

const SEC = '[data-sec]';

function measureAll(list) {
	const y = window.scrollY;
	return list.map((el) => {
		const r = el.getBoundingClientRect();
		return { el, id: el.id, top: r.top + y, h: r.height };
	});
}

function anchorOf(m, y) {
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
export function sectionBox(id) {
	const el = document.getElementById(id);
	if (!el) return null;
	const r = el.getBoundingClientRect();
	return { top: r.top + window.scrollY, height: r.height };
}

/** Fortschritt in einem Sticky-Abschnitt: 0 am Anfang, 1 wenn die Bühne am Ende loslässt. */
export function stickP(sec, stageH) {
	const r = sec.getBoundingClientRect();
	return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - stageH)));
}

function targetY(el) {
	const smt = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
	return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - smt));
}

export function initScroll(root) {
	history.scrollRestoration = 'auto';
	const list = [...root.querySelectorAll(SEC)];
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
			nm.some((a, i) => Math.abs(a.top - (m[i]?.top ?? 0)) > 1 || Math.abs(a.h - (m[i]?.h ?? 0)) > 1);
		const a = anchor && nm[anchor.i];
		if (changed && anchor && a)
			window.scrollTo({ top: Math.round(a.top + anchor.p * a.h), behavior: 'instant' });
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
	let veil = null;
	const veilEl = () => {
		if (veil) return veil;
		veil = document.createElement('div');
		veil.setAttribute('aria-hidden', 'true');
		veil.style.cssText =
			'position:fixed;inset:0;background:#0A0A0A;opacity:0;pointer-events:none;z-index:90';
		root.appendChild(veil);
		return veil;
	};
	const jump = (y) => {
		const v = veilEl();
		const a = v.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 80, fill: 'forwards' });
		a.finished
			.then(() => {
				window.scrollTo({ top: y, behavior: 'instant' });
				return v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 80, fill: 'forwards' })
					.finished;
			})
			.catch(() => {});
	};
	const onClick = (e) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
			return;
		const a = e.target.closest?.('a[href^="#"]');
		if (!a) return;
		const id = decodeURIComponent((a.getAttribute('href') ?? '').slice(1));
		const target = id ? document.getElementById(id) : null;
		if (!target) return;
		e.preventDefault();
		const y = targetY(target);
		const d = Math.abs(y - window.scrollY);
		if (loop.reduced) window.scrollTo({ top: y, behavior: 'instant' });
		else if (d > 3 * innerHeight) jump(y);
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
	};
}
