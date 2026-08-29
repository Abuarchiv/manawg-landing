'use client';

import { cn } from '@/lib/cn';
import {
	type KeyboardEvent as ReactKeyboardEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

type DrawerSide = 'left' | 'right' | 'bottom';

interface DrawerProps {
	open: boolean;
	onClose: () => void;
	side?: DrawerSide;
	children: ReactNode;
	/** Extra class names forwarded to the drawer panel */
	className?: string;
	/** Accessible label for the dialog landmark */
	'aria-label'?: string;
}

// NOTE: Native <dialog> with `open={open}` toggling collapses the user-agent
// `display:none` rule when closed — that kills any CSS transition and makes
// the panel pop instead of slide. We render a regular <div role="dialog">
// so the panel stays in the layout and the transform animates cleanly.

// Focusable selector used for focus-trap
const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

const SIDE_CLASSES: Record<DrawerSide, { panel: string; enter: string; leave: string }> = {
	left: {
		panel: 'left-0 top-0 bottom-0 w-[80vw] max-w-xs',
		enter: 'translate-x-0',
		leave: '-translate-x-full',
	},
	right: {
		panel: 'right-0 top-0 bottom-0 w-80 max-w-[88vw]',
		enter: 'translate-x-0',
		leave: 'translate-x-full',
	},
	bottom: {
		panel: 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl',
		enter: 'translate-y-0',
		leave: 'translate-y-full',
	},
};

/**
 * Primitive drawer/sheet with:
 * - Body scroll lock while open
 * - Escape closes
 * - Click-outside (backdrop) closes
 * - Focus trap inside the panel
 * - reduced-motion: instant open/close (no animation classes applied)
 * - Portal into document.body to escape stacking-context issues
 */
export function Drawer({
	open,
	onClose,
	side = 'left',
	children,
	className,
	'aria-label': ariaLabel = 'Navigationsmenü',
}: DrawerProps) {
	const [mounted, setMounted] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	// --- Body scroll lock ---
	useEffect(() => {
		if (!open) return;
		const scrollY = window.scrollY;
		const original = {
			overflow: document.body.style.overflow,
			position: document.body.style.position,
			top: document.body.style.top,
			width: document.body.style.width,
		};
		document.body.style.overflow = 'hidden';
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = '100%';
		return () => {
			document.body.style.overflow = original.overflow;
			document.body.style.position = original.position;
			document.body.style.top = original.top;
			document.body.style.width = original.width;
			window.scrollTo(0, scrollY);
		};
	}, [open]);

	// --- Save & restore focus ---
	useEffect(() => {
		if (open) {
			previousFocusRef.current = document.activeElement as HTMLElement;
			// Defer so animation frame has settled
			requestAnimationFrame(() => {
				const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
				first?.focus();
			});
		} else {
			previousFocusRef.current?.focus();
		}
	}, [open]);

	// --- Escape key ---
	useEffect(() => {
		if (!open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				onClose();
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [open, onClose]);

	// --- Focus trap (Tab / Shift+Tab) ---
	const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
		if (e.key !== 'Tab') return;
		const focusables = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
		if (focusables.length === 0) return;
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		if (!first || !last) return;

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}, []);

	const sides = SIDE_CLASSES[side];

	// Determine animation classes. When prefers-reduced-motion, skip transition.
	// We apply the CSS class directly — no JS animation library needed.
	const panelBase = cn(
		'fixed z-[70] m-0 flex max-h-none max-w-none flex-col border-0 p-0',
		'bg-[var(--bg-base)] shadow-2xl overflow-y-auto',
		// Transition — suppressed by motion:reduce media class
		'transition-transform duration-[250ms] ease-out',
		'motion-reduce:transition-none',
		sides.panel,
		open ? sides.enter : sides.leave,
		className,
	);

	if (!mounted || typeof document === 'undefined') return null;

	const content = (
		<>
			{/* Backdrop — decorative; close via Escape or panel close button (avoids duplicate landmark in screen-reader tree). */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative aria-hidden backdrop; keyboard users close via Escape or the panel close button, so no key handler is needed here. */}
			<div
				aria-hidden="true"
				onClick={onClose}
				className={cn(
					'fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm',
					'transition-opacity duration-[250ms] ease-out',
					'motion-reduce:transition-none',
					open ? 'opacity-100' : 'opacity-0 pointer-events-none',
				)}
			/>

			{/* Panel — inert + aria-hidden when closed so keyboard cannot reach off-screen content */}
			<div
				ref={panelRef}
				// biome-ignore lint/a11y/useSemanticElements: native <dialog> UA display:none kills CSS transitions (see native-dialog-css-transition-kill skill)
				role="dialog"
				aria-modal="true"
				aria-label={ariaLabel}
				aria-hidden={!open}
				// `inert` hides from AT and blocks Tab even when translated off-screen.
				// Cast required: inert is not yet in React's HTMLAttributes typings.
				{...(!open ? ({ inert: true } as Record<string, unknown>) : {})}
				tabIndex={-1}
				onKeyDown={handleKeyDown}
				className={cn(panelBase, !open && 'pointer-events-none')}
			>
				{children}
			</div>
		</>
	);

	return createPortal(content, document.body);
}
