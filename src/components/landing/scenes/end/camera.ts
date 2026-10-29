// Camera of the end scene.
//
// The end space is 1280 x 800 (phone 650/90/300/620, the hand passes lie in this space).
// camera() says how it fits into the stage: { f, ox, oy } with stage CSS px = end space * f + (ox, oy).
// End.tsx derives --end-x/-y/-f from it, hand.draw uses the same function (one contract).

import { type Fit, fitBox } from '../../core/canvas';
import type { Mode } from '../../core/loop';

/** Portrait, as in core/loop.ts modeOf: width/height <= 1 or width < 700. */
export const isPortrait = (W: number, H: number): boolean => W / H <= 1 || W < 700;

// Portrait: section of the end space (thumb on the left at x ~585). The phone fills about 78 % of the width, the
// fingers on the right run out of the frame (natural crop), the forearm is cropped at the bottom.
const PHONE_X = 650;
const PHONE_W = 300;
const SPAN0 = 584; // left edge of the thumb in the end space
const SPAN1 = 998; // right edge of the fingertips
const PHONE_TOP = 90;
const PHONE_H = 620;

let safeTopPx = -1;
/** safe-area-inset-top in CSS px (measured once). */
function safeTop(): number {
	if (safeTopPx >= 0) return safeTopPx;
	if (typeof document === 'undefined') return 0;
	const p = document.createElement('div');
	p.style.cssText = 'position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top,0px)';
	document.body.appendChild(p);
	safeTopPx = Number.parseFloat(getComputedStyle(p).paddingTop) || 0;
	p.remove();
	return safeTopPx;
}

/**
 * Space at the top in portrait for title and button (CSS px). Must match End.module.css:
 * top offset max(72, safe-top + 56), title (font 40 to 60, one line), gap 16, button 40,
 * gap to the phone 20.
 */
function titleSlot(W: number): number {
	const top = Math.max(72, 56 + safeTop());
	const fs = Math.max(40, Math.min(0.08 * W, 60));
	return top + fs + 16 + 40 + 20;
}

export function camera(W: number, H: number, safeH: number, _mode: Mode): Fit {
	if (!isPortrait(W, H)) return fitBox(W, safeH, 1280, 800, 1.25);
	const top = titleSlot(W);
	// Thumb on the left (x 584) and fingertips on the right (x 998) stay in the frame with at least 8 px margin
	const f = Math.max(
		0.2,
		Math.min((0.78 * W) / PHONE_W, (H - top - 12) / PHONE_H, 1.25, (W - 16) / (SPAN1 - SPAN0)),
	);
	const left = Math.max(8, (W - (SPAN1 - SPAN0) * f) / 2) + (PHONE_X - SPAN0) * f;
	return {
		f,
		ox: left - PHONE_X * f,
		oy: top - PHONE_TOP * f,
	};
}
