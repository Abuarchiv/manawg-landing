// Shared types of the intro stage: per-frame context (c), hero marks (h) and rectangles from the DOM.

import type { Fit } from '../../core/canvas';
import type { Mode } from '../../core/loop';

/** Rectangle of a DOM element with data-hole in stage CSS pixels. kind: 'logo', 'cta', 'hint', 'text'. */
export interface Hole {
	x: number;
	y: number;
	w: number;
	h: number;
	kind: string;
}

/** Pointer of the stage in stage CSS pixels (listener on the whole page). */
export interface StagePointer {
	x: number;
	y: number;
	in: boolean;
	down: boolean;
	type: string;
	/** Time of the last click (seconds, performance.now()). */
	clickT: number;
	moveT: number;
	/** Start point of the gesture (stage and scroll) to tell swipe and tap apart. */
	x0: number;
	y0: number;
	sy0: number;
	/** The click came from the app in the phone (Phone.tsx) and has already arrived there. */
	direct: boolean;
}

/** Stage context per frame: passed to hero, flat, flood and hand. */
export interface StageContext {
	/** Choreography progress (smoothed) and scroll distance (0..1). */
	P: number;
	s: number;
	t: number;
	dt: number;
	now: number;
	W: number;
	H: number;
	safeH: number;
	dpr: number;
	mode: Mode;
	reduced: boolean;
	fit: Fit;
	m: StagePointer;
	fpA: number;
	endA: number;
	/** Decay of the hands while the end layer scrolls away (0..1, 0 with reduced motion). */
	decay: number;
	endOn: boolean;
	stageTop: number;
	visible: boolean;
	/** Smoothed scroll speed of the page (CSS px/s, positive downwards). */
	sv: number;
	/** Pixel ratio of the hero (capped on touch devices). */
	dprHero?: number;
	holes?: Hole[];
}

/** Hero marks per frame, derived from P. */
export interface HeroMarks {
	look: number;
	mx: number;
	split: number;
	zoom: number;
	dive: number;
	/** Smoothed pointer (-1..1). */
	sm: [number, number];
	/** Start of the mark build-up (seconds). */
	a0: number;
	/** Adaptive resolution of the scene buffer. */
	ad: number;
}
