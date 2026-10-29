// Typen der Hände: Atlas-Metadaten (public/hand/hold.json, point.json), Zustand, Bildwerte und die WebGL-Ebene.

import type { TILES } from './constants';
import type { Probe } from './gl';

// ----------------------------------------------------------------------------------------------------
// Atlas
// ----------------------------------------------------------------------------------------------------

export type TileName = (typeof TILES)[number];

/** Eine Kachel im Atlas: Lage und Größe in Atlas-px, div = Auflösungsteiler gegenüber lum. */
export interface Tile {
	x: number;
	y: number;
	w: number;
	h: number;
	div: number;
}

export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface RoundRect extends Rect {
	r: number;
}

/** Metadaten eines Atlas (.json neben dem .webp). Kachel-px = (x - origin.x) * scale / div. */
export interface AtlasMeta {
	scale: number;
	atlas: [number, number];
	tile: [number, number];
	origin: [number, number];
	tiles: Record<TileName, Tile>;
}

/** Haltehand: zusätzlich Handy, Bildschirm und die Höhe, ab der der Unterarm ausläuft. */
export interface HoldMeta extends AtlasMeta {
	phone: RoundRect;
	screen: RoundRect;
	bottomY: number;
}

/** Für den 2D-Fallback: eine Kachel als Byte-Feld. */
export interface CpuTile {
	a: Uint8Array;
	w: number;
	h: number;
	div: number;
}

export interface CpuAtlas {
	T: Record<TileName, CpuTile>;
	samp: (t: CpuTile, X: number, Y: number) => number;
}

export interface Atlas<M extends AtlasMeta> {
	meta: M;
	bmp: ImageBitmap;
	cpu: CpuAtlas | null;
}

export interface Atlases {
	hold: Atlas<HoldMeta>;
	point: Atlas<AtlasMeta>;
}

// ----------------------------------------------------------------------------------------------------
// Bildwerte
// ----------------------------------------------------------------------------------------------------

export interface Point {
	x: number;
	y: number;
}

export interface Breath {
	x: number;
	y: number;
	r: number;
}

/** Alles, was ein Bild der Hände vom Zustand abhängt (Ende-Raum, Bühnen-px). */
export interface DrawValues {
	light: Point;
	ringAt: Point;
	lightPow: number;
	bottomY: number;
	tip: Point;
	u: Point;
	sc: number;
	pa: number;
	push: number;
	/** Zerfall 0..1 (Scroll-geführt, Hände lösen sich vom Rand her in Staub). */
	decay: number;
	br: Breath;
	ring: number;
	ringR: number;
	q: number[];
}

/** Zeigerzustand der Bühne (stage.js), soweit die Hände ihn lesen. */
export interface HandPointer {
	x: number;
	y: number;
	type: string;
	in: boolean;
	down: boolean;
	clickT: number;
	moveT?: number | undefined;
	direct?: boolean | undefined;
}

/** Der Teil des Bühnenkontexts (stage.js), den die Hände lesen. */
export interface HandContext {
	P: number;
	endA: number;
	decay: number;
	endOn: boolean;
	W: number;
	H: number;
	t: number;
	now: number;
	dt: number;
	reduced: boolean;
	m: HandPointer;
	/** Scrollgeschwindigkeit der Seite (px/s): Handy und Hände hängen dem Scroll leicht nach. */
	sv: number;
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
	uZer: WebGLUniformLocation | null;
}

/** Zellraster des ersten Durchgangs: Zielgröße, Textur und Framebuffer. */
export interface CellBuffer {
	w: number;
	h: number;
	tex: WebGLTexture | null;
	fbo: WebGLFramebuffer | null;
}

/** Sichtbares Raster im Ende-Raum (Zellen) plus Bühnenhöhe. */
export interface CellGrid {
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
export interface Layer {
	cv: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	front: boolean;
	ready: boolean;
	dead: boolean;
	stage: number;
	/** Nächste Zeile des Atlas, die readyStep hochlädt. */
	row: number;
	last: number[] | null;
	lastB: number[] | null;
	prs: [WebGLProgram, WebGLProgram];
	cells: CellBuffer;
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
export interface Tap {
	x: number;
	y: number;
	t0: number;
	cx: number;
	cy: number;
	demo?: boolean;
	slow?: boolean;
}

/** Vorführung: n = schon getippte Ziele (0 Haushalt, 1 Start), seit = Beginn der Untätigkeit. */
export interface DemoRun {
	n: number;
	idleSince: number | null;
	next: number;
	off: boolean;
}

export type DrawMode = 'gl' | 'cpu';

/** Vorgerechneter 2D-Fallback: Haltehand als Bild und die beiden Sprites der Zeigehand. */
export interface CpuBaked {
	held: HTMLCanvasElement;
	sp: [HTMLCanvasElement, HTMLCanvasElement];
}

/** Messwerte für landing-konzept/werkzeuge/qa (qa.hand). */
export interface HandDbg {
	m: { x: number; y: number; in: boolean; down: boolean; type: string };
	tg: readonly [number, number];
	endOn: boolean;
	tap: [number, number] | null;
}

export interface HandState {
	back: HTMLCanvasElement;
	front: HTMLCanvasElement;
	host: HTMLElement | null;
	ht: Point | null;
	lt: Point;
	park: [number, number];
	lastClick: number;
	tap: [number, number] | null;
	contactT: number;
	pending: Tap | null;
	space: HTMLElement | null;
	appDoc: HTMLElement | null;
	clean: boolean;
	mode: DrawMode | null;
	layers: [Layer, Layer] | null;
	/** Ergebnis der Eignungsprüfung (einmal) und die schon angelegten Ebenen, solange chooseMode schrittweise vorwärmt. */
	usable?: boolean;
	/** Laufende Eignungsprüfung (glTaugtStart), bis ihr Ergebnis in tauglich steht. */
	probe?: Probe;
	pendingLayers?: (Layer | null)[];
	/** Vorwärmen abgeschlossen: Shader gelinkt, Texturen hochgeladen. */
	warm?: boolean;
	cpu: { key: string | null; baked: CpuBaked | null };
	quiet: number[];
	rects: [number, number, number, number][];
	frames: number;
	demo: DemoRun | null;
	ms?: number;
	dbg?: HandDbg;
}
