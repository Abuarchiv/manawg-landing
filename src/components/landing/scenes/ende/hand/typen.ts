// Typen der Hände: Atlas-Metadaten (public/hand/hold.json, point.json), Zustand, Bildwerte und die WebGL-Ebene.

import type { Probe } from './gl';
import type { TILES } from './konstanten';

// ----------------------------------------------------------------------------------------------------
// Atlas
// ----------------------------------------------------------------------------------------------------

export type KachelName = (typeof TILES)[number];

/** Eine Kachel im Atlas: Lage und Größe in Atlas-px, div = Auflösungsteiler gegenüber lum. */
export interface Kachel {
	x: number;
	y: number;
	w: number;
	h: number;
	div: number;
}

export interface Rechteck {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface RundRechteck extends Rechteck {
	r: number;
}

/** Metadaten eines Atlas (.json neben dem .webp). Kachel-px = (x - origin.x) * scale / div. */
export interface AtlasMeta {
	scale: number;
	atlas: [number, number];
	tile: [number, number];
	origin: [number, number];
	tiles: Record<KachelName, Kachel>;
}

/** Haltehand: zusätzlich Handy, Bildschirm und die Höhe, ab der der Unterarm ausläuft. */
export interface HaltMeta extends AtlasMeta {
	phone: RundRechteck;
	screen: RundRechteck;
	bottomY: number;
}

/** Für den 2D-Fallback: eine Kachel als Byte-Feld. */
export interface CpuKachel {
	a: Uint8Array;
	w: number;
	h: number;
	div: number;
}

export interface CpuAtlas {
	T: Record<KachelName, CpuKachel>;
	samp: (t: CpuKachel, X: number, Y: number) => number;
}

export interface Atlas<M extends AtlasMeta> {
	meta: M;
	bmp: ImageBitmap;
	cpu: CpuAtlas | null;
}

export interface Atlanten {
	hold: Atlas<HaltMeta>;
	point: Atlas<AtlasMeta>;
}

// ----------------------------------------------------------------------------------------------------
// Bildwerte
// ----------------------------------------------------------------------------------------------------

export interface Punkt {
	x: number;
	y: number;
}

export interface Atmen {
	x: number;
	y: number;
	r: number;
}

/** Alles, was ein Bild der Hände vom Zustand abhängt (Ende-Raum, Bühnen-px). */
export interface Zeichenwerte {
	light: Punkt;
	ringAt: Punkt;
	lightPow: number;
	bottomY: number;
	tip: Punkt;
	u: Punkt;
	sc: number;
	pa: number;
	push: number;
	br: Atmen;
	ring: number;
	ringR: number;
	q: number[];
}

/** Zeigerzustand der Bühne (stage.js), soweit die Hände ihn lesen. */
export interface HandZeiger {
	x: number;
	y: number;
	type: string;
	in: boolean;
	down: boolean;
	clickT: number;
	moveT?: number | undefined;
	direkt?: boolean | undefined;
}

/** Der Teil des Bühnenkontexts (stage.js), den die Hände lesen. */
export interface HandKontext {
	P: number;
	endA: number;
	endOn: boolean;
	W: number;
	H: number;
	t: number;
	now: number;
	dt: number;
	reduced: boolean;
	m: HandZeiger;
}

// ----------------------------------------------------------------------------------------------------
// WebGL-Ebene
// ----------------------------------------------------------------------------------------------------

/** Uniform-Orte eines Programms (Namen wie im Shader). */
export interface Uniforms {
	uTH: WebGLUniformLocation | null;
	uTP: WebGLUniformLocation | null;
	uHT: WebGLUniformLocation | null;
	uPT: WebGLUniformLocation | null;
	uDiv: WebGLUniformLocation | null;
	uHO: WebGLUniformLocation | null;
	uPO: WebGLUniformLocation | null;
	uPhone: WebGLUniformLocation | null;
	uScreen: WebGLUniformLocation | null;
	uPR: WebGLUniformLocation | null;
	uLight: WebGLUniformLocation | null;
	uTipU: WebGLUniformLocation | null;
	uPS: WebGLUniformLocation | null;
	uRing: WebGLUniformLocation | null;
	uBr: WebGLUniformLocation | null;
	uQ: WebGLUniformLocation | null;
	uCam: WebGLUniformLocation | null;
	uBack: WebGLUniformLocation | null;
	uFront: WebGLUniformLocation | null;
	uTone: WebGLUniformLocation | null;
	uCell0: WebGLUniformLocation | null;
	uCellN: WebGLUniformLocation | null;
}

/** Zellraster des ersten Durchgangs: Zielgröße, Textur und Framebuffer. */
export interface ZellPuffer {
	w: number;
	h: number;
	tex: WebGLTexture | null;
	fbo: WebGLFramebuffer | null;
}

/** Sichtbares Raster im Ende-Raum (Zellen) plus Bühnenhöhe. */
export interface Raster {
	i0: number;
	j0: number;
	cw: number;
	ch: number;
	H: number;
}

/** Erweiterung EXT_disjoint_timer_query_webgl2 (nicht in lib.dom), nur die genutzten Konstanten. */
export interface TimerQuery {
	TIME_ELAPSED_EXT: number;
	GPU_DISJOINT_EXT: number;
}

/** Eine WebGL2-Ebene (back oder front): Programme für beide Durchgänge, Texturen, Cache des letzten Bildes. */
export interface Ebene {
	cv: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	front: boolean;
	ready: boolean;
	dead: boolean;
	stage: number;
	/** Nächste Zeile des Atlas, die readyStep hochlädt. */
	zeile: number;
	last: number[] | null;
	lastB: number[] | null;
	prs: [WebGLProgram, WebGLProgram];
	cells: ZellPuffer;
	ext: KHR_parallel_shader_compile | null;
	u: [Uniforms, Uniforms];
	vao: WebGLVertexArrayObject;
	th: WebGLTexture | null;
	tp: WebGLTexture | null;
	tq: TimerQuery | null;
	pend: WebGLQuery[];
	gpuMs: number[];
}

// ----------------------------------------------------------------------------------------------------
// Zustand
// ----------------------------------------------------------------------------------------------------

/** Ein anstehender Tipp: die Zeigehand fährt hin, bei Ankunft folgt Druck, Ring und Klick. */
export interface Tipp {
	x: number;
	y: number;
	t0: number;
	cx: number;
	cy: number;
	demo?: boolean;
	slow?: boolean;
}

/** Vorführung: n = schon getippte Ziele (0 Haushalt, 1 Start), seit = Beginn der Untätigkeit. */
export interface Vorfuehrung {
	n: number;
	seit: number | null;
	next: number;
	off: boolean;
}

export type Zeichenart = 'gl' | 'cpu';

/** Vorgerechneter 2D-Fallback: Haltehand als Bild und die beiden Sprites der Zeigehand. */
export interface CpuGebacken {
	held: HTMLCanvasElement;
	sp: [HTMLCanvasElement, HTMLCanvasElement];
}

/** Messwerte für tools/qa (qa.hand). */
export interface HandDbg {
	m: { x: number; y: number; in: boolean; down: boolean; type: string };
	tg: readonly [number, number];
	endOn: boolean;
	tap: [number, number] | null;
}

export interface HandZustand {
	back: HTMLCanvasElement;
	front: HTMLCanvasElement;
	host: HTMLElement | null;
	ht: Punkt | null;
	lt: Punkt;
	park: [number, number];
	lastClick: number;
	tap: [number, number] | null;
	contactT: number;
	pending: Tipp | null;
	space: HTMLElement | null;
	appDoc: HTMLElement | null;
	clean: boolean;
	mode: Zeichenart | null;
	layers: [Ebene, Ebene] | null;
	/** Ergebnis der Eignungsprüfung (einmal) und die schon angelegten Ebenen, solange chooseMode schrittweise vorwärmt. */
	tauglich?: boolean;
	/** Laufende Eignungsprüfung (glTaugtStart), bis ihr Ergebnis in tauglich steht. */
	probe?: Probe;
	ebenen?: (Ebene | null)[];
	/** Vorwärmen abgeschlossen: Shader gelinkt, Texturen hochgeladen. */
	warm?: boolean;
	cpu: { key: string | null; baked: CpuGebacken | null };
	quiet: number[];
	rects: [number, number, number, number][];
	frames: number;
	demo: Vorfuehrung | null;
	ms?: number;
	dbg?: HandDbg;
}
