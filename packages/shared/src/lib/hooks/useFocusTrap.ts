'use client';

import { useEffect, useRef } from 'react';

/**
 * Focus trap for modal/dialog containers.
 *
 * On activation: moves focus to the first focusable descendant; cycles Tab/Shift+Tab
 * within the container; on deactivation, restores focus to the previously-focused element.
 *
 * Why a hook (not focus-trap-react): zero deps; works with `<div role="dialog">`
 * pattern (see [[native-dialog-css-transition-kill]]) where native `<dialog>` breaks
 * CSS exit animations on iOS Safari.
 */
const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active: boolean) {
	const containerRef = useRef<T | null>(null);

	useEffect(() => {
		if (!active) return;
		const container = containerRef.current;
		if (!container) return;

		const previouslyFocused =
			typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;

		const getFocusable = (): HTMLElement[] =>
			Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
				(el) => el.offsetParent !== null || el === document.activeElement,
			);

		const focusables = getFocusable();
		const firstFocusable = focusables[0];
		if (firstFocusable) {
			firstFocusable.focus();
		} else {
			container.setAttribute('tabindex', '-1');
			container.focus();
		}

		const handleKey = (event: KeyboardEvent): void => {
			if (event.key !== 'Tab') return;
			const list = getFocusable();
			const first = list[0];
			const last = list[list.length - 1];
			if (!first || !last) {
				event.preventDefault();
				return;
			}

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKey);

		return () => {
			document.removeEventListener('keydown', handleKey);
			if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
				previouslyFocused.focus();
			}
		};
	}, [active]);

	return containerRef;
}
