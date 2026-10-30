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
}

/** Stage context per frame: passed to hero and flat. */
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
	visible: boolean;
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
