// Types of the hands: atlas metadata (public/hand/hold.json, point.json), state, frame values and the WebGL layer.

import type { TILES } from './constants';
import type { Probe } from './gl';

// ----------------------------------------------------------------------------------------------------
// Atlas
// ----------------------------------------------------------------------------------------------------

export type TileName = (typeof TILES)[number];

/** A tile in the atlas: position and size in atlas px, div = resolution divisor measured from lum. */
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

/** Metadata of an atlas (.json next to the .webp). Tile px = (x - origin.x) * scale / div. */
export interface AtlasMeta {
	scale: number;
	atlas: [number, number];
	tile: [number, number];
	origin: [number, number];
	tiles: Record<TileName, Tile>;
}

/** Holding hand: additionally phone, screen and the height from which the forearm fades out. */
export interface HoldMeta extends AtlasMeta {
	phone: RoundRect;
	screen: RoundRect;
	bottomY: number;
}

/** For the 2D fallback: a tile as a byte array. */
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
// Frame values
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

/** Everything a frame of the hands takes from the state (end space, stage px). */
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
	/** Decay 0..1 (scroll-driven, the hands dissolve into dust from the edge inward). */
	decay: number;
	br: Breath;
	ring: number;
	ringR: number;
	q: number[];
}

/** Pointer state of the stage (stage.js), as far as the hands read it. */
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

/** The part of the stage context (stage.js) that the hands read. */
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
	/** Scroll velocity of the page (px/s): phone and hands trail the scroll slightly. */
	sv: number;
}

// ----------------------------------------------------------------------------------------------------
// WebGL layer
// ----------------------------------------------------------------------------------------------------

/** Uniform locations of a program (names as in the shader). */
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
	uDecay: WebGLUniformLocation | null;
}

/** Cell grid of the first pass: target size, texture and framebuffer. */
export interface CellBuffer {
	w: number;
	h: number;
	tex: WebGLTexture | null;
	fbo: WebGLFramebuffer | null;
}

/** Visible grid in the end space (cells) plus stage height. */
export interface CellGrid {
	i0: number;
	j0: number;
	cw: number;
	ch: number;
	H: number;
}

/** Extension EXT_disjoint_timer_query_webgl2 (not in lib.dom), only the constants in use. */
export interface TimerQuery {
	TIME_ELAPSED_EXT: number;
	GPU_DISJOINT_EXT: number;
}

/** A WebGL2 layer (back or front): programs for both passes, textures, cache of the last frame. */
export interface Layer {
	cv: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	front: boolean;
	ready: boolean;
	dead: boolean;
	stage: number;
	/** Next row of the atlas that readyStep uploads. */
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
// State
// ----------------------------------------------------------------------------------------------------

/** A pending tap: the pointing hand moves there, on arrival press, ring and click follow. */
export interface Tap {
	x: number;
	y: number;
	t0: number;
	cx: number;
	cy: number;
	demo?: boolean;
	slow?: boolean;
}

/** Demo: n = targets already tapped (0 Haushalt, 1 Start), idleSince = start of the inactivity. */
export interface DemoRun {
	n: number;
	idleSince: number | null;
	next: number;
	off: boolean;
}

export type DrawMode = 'gl' | 'cpu';

/** Precomputed 2D fallback: holding hand as an image and the two sprites of the pointing hand. */
export interface CpuBaked {
	held: HTMLCanvasElement;
	sp: [HTMLCanvasElement, HTMLCanvasElement];
}

/** Measurements for landing-konzept/werkzeuge/qa (qa.hand). */
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
	/** Result of the suitability check (once) and the layers already created while chooseMode warms up step by step. */
	usable?: boolean;
	/** Running suitability check (glProbeStart) until its result is stored in usable. */
	probe?: Probe;
	pendingLayers?: (Layer | null)[];
	/** Warm-up finished: shaders linked, textures uploaded. */
	warm?: boolean;
	cpu: { key: string | null; baked: CpuBaked | null };
	quiet: number[];
	rects: [number, number, number, number][];
	frames: number;
	demo: DemoRun | null;
	ms?: number;
	dbg?: HandDbg;
}
