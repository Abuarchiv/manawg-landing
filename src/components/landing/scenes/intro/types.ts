// Gemeinsame Typen der Intro-Bühne: Kontext je Bild (c), Marken des Heros (h) und Rechtecke aus dem DOM.

import type { Fit } from '../../core/canvas';
import type { Mode } from '../../core/loop';

/** Rechteck eines DOM-Elements mit data-loch in Bühnen-CSS-Pixeln. art: 'logo', 'cta', 'hinweis', 'text'. */
export interface Hole {
	x: number;
	y: number;
	w: number;
	h: number;
	kind: string;
}

/** Zeiger der Bühne in Bühnen-CSS-Pixeln (Listener an der ganzen Seite). */
export interface StagePointer {
	x: number;
	y: number;
	in: boolean;
	down: boolean;
	type: string;
	/** Zeitpunkt des letzten Klicks (Sekunden, performance.now()). */
	clickT: number;
	moveT: number;
	/** Startpunkt der Geste (Bühne und Scroll), um Wisch und Tippen zu trennen. */
	x0: number;
	y0: number;
	sy0: number;
	/** Der Klick kam aus der App im Handy (Phone.tsx) und ist dort schon angekommen. */
	direct: boolean;
}

/** Kontext der Bühne je Bild: wird an Hero, Wohnung, Flut und Hand übergeben. */
export interface StageContext {
	/** Fortschritt der Choreografie (geglättet) und Scroll-Strecke (0..1). */
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
	/** Zerfall der Hände beim Wegscrollen der Ende-Ebene (0..1, bei reduzierter Bewegung 0). */
	decay: number;
	endOn: boolean;
	stageTop: number;
	visible: boolean;
	/** Geglättete Scrollgeschwindigkeit der Seite (CSS-px/s, positiv nach unten). */
	sv: number;
	/** Pixelfaktor des Heros (auf Touch-Geräten gedeckelt). */
	dprHero?: number;
	holes?: Hole[];
}

/** Marken des Heros je Bild, aus P abgeleitet. */
export interface HeroMarks {
	look: number;
	mx: number;
	split: number;
	zoom: number;
	dive: number;
	/** Geglätteter Zeiger (-1..1). */
	sm: [number, number];
	/** Beginn des Aufbaus des Zeichens (Sekunden). */
	a0: number;
	/** Adaptive Auflösung des Szenenpuffers. */
	ad: number;
}
