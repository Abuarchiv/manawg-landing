// Gemeinsame Typen der Intro-Bühne: Kontext je Bild (c), Marken des Heros (h) und Rechtecke aus dem DOM.

import type { Fit } from '../../core/canvas';
import type { Modus } from '../../core/loop';

/** Rechteck eines DOM-Elements mit data-loch in Bühnen-CSS-Pixeln. art: 'logo', 'cta', 'hinweis', 'text'. */
export interface Loch {
	x: number;
	y: number;
	w: number;
	h: number;
	art: string;
}

/** Zeiger der Bühne in Bühnen-CSS-Pixeln (Listener an der ganzen Seite). */
export interface BuehnenZeiger {
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
	direkt: boolean;
}

/** Kontext der Bühne je Bild: wird an Hero, Wohnung, Flut und Hand übergeben. */
export interface BuehnenKontext {
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
	mode: Modus;
	reduced: boolean;
	fit: Fit;
	m: BuehnenZeiger;
	fpA: number;
	endA: number;
	/** Zerfall der Hände beim Wegscrollen der Ende-Ebene (0..1, bei reduzierter Bewegung 0). */
	zer: number;
	endOn: boolean;
	/** Deckung der Flut (flut.deckung). */
	cover: number;
	stageTop: number;
	visible: boolean;
	/** Pixelfaktor des Heros (auf Touch-Geräten gedeckelt). */
	dprHero?: number;
	loecher?: Loch[];
}

/** Marken des Heros je Bild, aus P abgeleitet. */
export interface HeroMarken {
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
