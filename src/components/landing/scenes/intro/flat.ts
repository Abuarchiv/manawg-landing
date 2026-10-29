// Die Wohnung: isometrischer Grundriss aus Punktraster und Wänden, vier Räume werden nacheinander
// angefahren. Dazu die Kurve der Raumkarten (karten) für die Texte der Bühne.
//
// Szenenraum: Die Komposition liegt in der Bezugsbox 1280 x 800 (c.fit), das Punktraster und die
// Wände laufen über die ganze Fläche.

import { loop, qa } from '../../core/loop';
import { BAYER, cl, lag, lerp, ss } from '../../core/math';
import { drawFlatGlyphs } from './flat-gl';
import type { StageContext } from './types';

const mono = (px: number) => `500 ${px}px "JetBrains Mono", monospace`;

/** Raum im Raster: x, y, Breite, Tiefe. Die Namen kommen aus dem Wörterbuch (createStage: rooms) in derselben Reihenfolge. */
type Room = readonly [x: number, y: number, w: number, d: number];

// Raster = halbe Meter der Blender-Wohnung (landing-konzept/wohnung-iso, Böden Boden_*)
// Reihenfolge: Küche, Bad, Zimmer Jona, Flur, Wohnzimmer, Zimmer Lea, Zimmer Lina, Zimmer Mika (wie canvasRooms)
const ROOMS = [
	[0, 0, 8, 7.2],
	[18, 0, 6, 7.2],
	[12, 10, 6, 6.4],
	[0, 7.2, 24, 2.8],
	[8, 0, 10, 7.2],
	[0, 10, 6, 6.4],
	[18, 10, 6, 6.4],
	[6, 10, 6, 6.4],
] as const satisfies readonly Room[];

/** Blickpunkt: Mitte im Raster (cx, cy), Maßstab u, Ursprung der Projektion (ox, oy), Raum (-1 = keiner). */
interface View {
	cx: number;
	cy: number;
	u: number;
	ox: number;
	oy: number;
	room: number;
}

const STOPS: readonly View[] = [
	{ cx: 12, cy: 8.2, u: 30, ox: 760, oy: 450, room: -1 },
	{ cx: 4, cy: 3.6, u: 58, ox: 840, oy: 420, room: 0 },
	{ cx: 13, cy: 3.6, u: 46, ox: 840, oy: 420, room: 4 },
	{ cx: 21, cy: 3.6, u: 64, ox: 840, oy: 420, room: 1 },
	{ cx: 12, cy: 8.6, u: 42, ox: 840, oy: 420, room: 3 },
	{ cx: 12, cy: 8.2, u: 21, ox: 640, oy: 300, room: -1 },
];
/** Wand: Anfang (x, y) und Ende (x, y) im Raster. */
type Wall = [number, number, number, number];

const WALLS: Wall[] = [];
for (const r of ROOMS) {
	const x = r[0];
	const y = r[1];
	const w = r[2];
	const hh = r[3];
	WALLS.push(
		[x, y, x + w, y],
		[x + w, y, x + w, y + hh],
		[x, y + hh, x + w, y + hh],
		[x, y, x, y + hh],
	);
}
WALLS.sort((a, b) => a[0] + a[1] + a[2] + a[3] - (b[0] + b[1] + b[2] + b[3]));
/** Bewohner: Größe der Scheibe (in Rastereinheiten); die Namen kommen aus dem Wörterbuch (createStage: people). */
const PEOC = [0.62, 0.5, 0.42, 0.34] as const;

/**
 * Deckkraft der vier Raumkarten bei Fortschritt P, am Scroll geführt wie im Entwurf (--c0..3): Karte j steht
 * um fs = j + 1 (Plateau 0,5 Stopps breit), blendet davor und danach in 0,25 Stopps ein und aus. Anders als im
 * Entwurf überlappen sich die Blenden nie (an der Grenze der Karten ist die Summe 0): kein Text über Text.
 */
export function cardOpacity(P: number): number[] {
	const fpA = ss((P - 0.58) / 0.05);
	const fs = cl((P - 0.62) / 0.28) * 5;
	return [0, 1, 2, 3].map((j) => {
		const d = Math.abs(fs - (j + 1));
		// die letzte Karte (Pinnwand & Chat) bleibt während der Fahrt zur Übersicht und geht mit deren Ende (P 0,9),
		// sonst stünde sie grau über der sich auflösenden Wohnung; Titel und Handy der Ende-Ebene kommen danach
		if (j === 3 && fs > 4) return fpA * (1 - ss((P - 0.87) / 0.03));
		return fpA * ss((0.5 - d) / 0.25);
	});
}

qa.karten = cardOpacity;

/** Rechteck in CSS-Pixeln des Canvas. */
interface Rect {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/** Beschriftung (Raumname oder Bewohner) vor und nach dem Setzen. */
interface Label {
	text: string;
	x: number;
	y: number;
	size: number;
	a: number;
	kind: 'name' | 'room';
	/** Ganz außerhalb des Blickfelds: wird nicht gezeigt. */
	off: boolean;
	w: number;
	/** Belegte Fläche nach setzeLabels (null, solange nicht gesetzt). */
	rect: Rect | null;
}

/** Bewohner, der zwischen den Räumen läuft (Ziel tx, ty; nt = Zeitpunkt des nächsten Ziels). */
interface Person {
	name: string;
	rel: number;
	x: number;
	y: number;
	tx: number;
	ty: number;
	nt: number;
}

/** Rechtecke der DOM-Elemente mit data-loch: die Kartenspalte und alles, dem Beschriftungen ausweichen. */
interface DomRects {
	column: Rect | null;
	avoid: Rect[];
}

/** Zustand der Wohnung je Canvas. */
interface FlatState {
	ctx: CanvasRenderingContext2D;
	/** Nachlaufender Zeiger in Szenenkoordinaten. */
	sm: { x: number; y: number };
	pp: Person[] | null;
	labels: Label[];
	dom: DomRects | null;
	domN: number;
	fade: Record<string, number>;
	W: number;
	H: number;
}

const states = new WeakMap<HTMLCanvasElement, FlatState>();

// Zeichen-Maße für Beschriftungen
const widths = new Map<string, number>();
function textWidth(ctx: CanvasRenderingContext2D, font: string, text: string): number {
	const k = `${font}|${text}`;
	let w = widths.get(k);
	if (w === undefined) {
		ctx.font = font;
		w = ctx.measureText(text).width;
		widths.set(k, w);
	}
	return w;
}
const intersects = (a: Rect, b: Rect) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

/**
 * Beschriftungen setzen (CSS-Pixel, Identität): in den sichtbaren Bereich klemmen, Rechtecken aus dem
 * DOM (Kartenspalte, Kopf, Hinweis) und anderen Beschriftungen ausweichen.
 */
function placeLabels(
	ctx: CanvasRenderingContext2D,
	items: Label[],
	bounds: Rect,
	avoid: readonly Rect[],
): Label[] {
	const placed: Rect[] = [];
	for (const it of items) {
		const font = mono(it.size);
		const w = textWidth(ctx, font, it.text);
		const h = it.size;
		// Ganz außerhalb des Blickfelds: nicht zeigen. Teilweise draußen: hineinklemmen.
		if (
			it.x < bounds.x0 - w / 2 ||
			it.x > bounds.x1 + w / 2 ||
			it.y < bounds.y0 ||
			it.y > bounds.y1 + h
		) {
			it.off = true;
			continue;
		}
		let x = Math.min(bounds.x1 - 8 - w / 2, Math.max(bounds.x0 + 8 + w / 2, it.x));
		let y = Math.min(bounds.y1 - 8, Math.max(bounds.y0 + 8 + h, it.y));
		const rect = (): Rect => ({ x0: x - w / 2 - 2, x1: x + w / 2 + 2, y0: y - h - 2, y1: y + 3 });
		for (let n = 0; n < 6; n++) {
			const r = rect();
			const m = avoid.find((q) => intersects(r, q));
			if (m) {
				// zur näheren freien Seite schieben, sonst unter das Hindernis
				const right = m.x1 + 4 + w / 2 + 2;
				const left = m.x0 - 4 - w / 2 - 2;
				const okR = right <= bounds.x1 - 8 - w / 2;
				const okL = left >= bounds.x0 + 8 + w / 2;
				if (okR && (!okL || right - x < x - left)) x = right;
				else if (okL) x = left;
				else y = m.y1 + 4 + h + 2;
				continue;
			}
			const g = placed.find((q) => intersects(r, q));
			if (g) {
				y = g.y0 - 4;
				if (y < bounds.y0 + 8 + h) y = it.y + h + 6;
				continue;
			}
			break;
		}
		placed.push(rect());
		it.x = x;
		it.y = y;
		it.w = w;
		it.rect = rect();
	}
	return items;
}

// Hochformat: die Wohnung steht unter der Kartenspalte in einer eigenen Box 900 x 560 (Szenenraum
// 190..1090 x 120..680), jeder Blickpunkt sitzt in der Mitte der Box.
const PORTRAIT_BOX = { bw: 900, bh: 560, x0: 190, y0: 120, ox: 640, oy: 410 };

/** Hochformat: Oberkante und Unterkante der Wohnungsbox unter der Kartenspalte (CSS-px). Auch die Flut spart sie aus. */
export function portraitTop(textBottom: number, safeH: number): { top: number; bot: number } {
	return { top: Math.min(textBottom + 10, safeH * 0.62), bot: safeH - 56 };
}

/** Rechtecke der DOM-Elemente mit data-loch relativ zum Canvas (alle 20 Bilder neu gemessen). */
function measureDom(st: FlatState, cv: HTMLCanvasElement): DomRects {
	if (st.dom && loop.n - st.domN < 20) return st.dom;
	const r0 = cv.getBoundingClientRect();
	const rect = (el: Element): Rect => {
		const r = el.getBoundingClientRect();
		return {
			x0: r.left - r0.left,
			y0: r.top - r0.top,
			x1: r.right - r0.left,
			y1: r.bottom - r0.top,
		};
	};
	const root = cv.closest('#final') ?? document;
	const dom: DomRects = {
		column: null,
		avoid: [],
	};
	st.dom = dom;
	for (const el of root.querySelectorAll<HTMLElement>('[data-loch]')) {
		const q = rect(el);
		if (el.dataset.loch === 'text') {
			dom.column = q;
			dom.avoid.push(q);
		} else dom.avoid.push({ x0: q.x0 - 6, y0: q.y0 - 6, x1: q.x1 + 6, y1: q.y1 + 6 });
	}
	st.domN = loop.n;
	return dom;
}

/** Zeichnet die Wohnung in das 2D-Canvas. c: Kontext der Bühne. */
export function draw(
	cv: HTMLCanvasElement,
	c: StageContext,
	rooms: readonly string[],
	people: readonly string[],
): void {
	let st = states.get(cv);
	if (!st) {
		const ctx0 = cv.getContext('2d');
		if (!ctx0) return;
		const next: FlatState = {
			ctx: ctx0,
			sm: { x: 640, y: 400 },
			pp: null,
			labels: [],
			dom: null,
			domN: -99,
			fade: {},
			W: 0,
			H: 0,
		};
		st = next;
		states.set(cv, next);
		qa.wohnungLabels = () => ({
			labels: next.labels.map((l) => ({ text: l.text, size: l.size, ...l.rect, cx: l.x, cy: l.y })),
			spalte: next.dom?.column ?? null,
			W: next.W,
			H: next.H,
		});
	}
	const ctx = st.ctx;
	const { W, H, dpr, now, m } = c;
	st.W = W;
	st.H = H;
	const dom = measureDom(st, cv);
	// Avatare und Beschriftungen blenden in ca. 120 ms aus, solange sie die Raumtext-Spalte (samt Rand links) schneiden
	const zone =
		dom.column && Math.max(...cardOpacity(c.P)) > 0.01
			? { x0: 0, x1: dom.column.x1 + 8, y0: dom.column.y0 - 8, y1: dom.column.y1 + 8 }
			: null;
	const fadeOf = (key: string, r: Rect): number => {
		const hit = zone && r.x1 > zone.x0 && r.x0 < zone.x1 && r.y1 > zone.y0 && r.y0 < zone.y1;
		const z = hit ? 0 : 1;
		const v = st.fade[key] ?? z;
		st.fade[key] =
			Math.abs(z - v) < 0.01
				? z
				: v + (z - v) * (1 - Math.exp(-Math.min(c.dt ?? 0.016, 0.1) / 0.04));
		return st.fade[key];
	};
	const portrait = c.mode === 'hoch';
	// Abbildung Szenenraum -> Canvas-CSS-Pixel: X = tx + x * f, Y = ty + y * f
	let f: number;
	let tx: number;
	let ty: number;
	let boxTop = 0;
	if (portrait) {
		const sp = dom.column;
		boxTop = sp ? portraitTop(sp.y1, c.safeH).top : c.safeH * 0.45;
		const boxBot = c.safeH - 56;
		const bh = Math.max(120, boxBot - boxTop);
		f = Math.min(W / PORTRAIT_BOX.bw, bh / PORTRAIT_BOX.bh, 1.25);
		tx = (W - PORTRAIT_BOX.bw * f) / 2 - PORTRAIT_BOX.x0 * f;
		ty = boxTop + (bh - PORTRAIT_BOX.bh * f) / 2 - PORTRAIT_BOX.y0 * f;
		// Übersicht mittig im Bild, erst mit der ersten Raumkarte rückt die Wohnung unter die Textspalte
		const mid = c.reduced ? 0 : 1 - ss((c.P - 0.62) / 0.04);
		ty = lerp(ty, (c.safeH - PORTRAIT_BOX.bh * f) / 2 - PORTRAIT_BOX.y0 * f, mid);
		boxTop *= 1 - mid;
	} else {
		f = c.fit.f;
		tx = c.fit.ox;
		ty = c.fit.oy;
	}
	const x0 = -tx / f;
	const y0 = (0 - ty) / f; // die Wohnung läuft auch im Hochformat bis zum oberen Rand
	const x1 = (W - tx) / f;
	const y1 = (H - ty) / f;
	const sp = cl((c.P - 0.62) / 0.28);
	// Aufbau am Scroll: erst ziehen sich die Wände, dann füllen sich die Böden im Bayer-Raster, zuletzt kommen
	// Bewohner und Beschriftungen. Zur Ende-Ebene baut sich die Wohnung in umgekehrter Reihenfolge ab.
	const build = c.reduced ? 1 : cl((c.P - 0.54) / 0.09) * (1 - cl((c.P - 0.885) / 0.05));
	const buildWalls = cl(build / 0.55);
	const buildFloor = cl((build - 0.3) / 0.55);
	const buildRest = cl((build - 0.75) / 0.25);
	// Zeiger in Szenenkoordinaten, der Lichtkegel läuft nach
	if (m.in) {
		const k = lag(0.25, c.dt ?? 0.016);
		st.sm.x += ((m.x - tx) / f - st.sm.x) * k;
		st.sm.y += ((m.y - ty) / f - st.sm.y) * k;
	}
	const q = sp * 5;
	const i = Math.min(4, Math.floor(q));
	const e = ss((q - i - 0.2) / 0.6);
	const A = STOPS[i];
	const Bs = STOPS[i + 1];
	if (!A || !Bs) return;
	const cx = lerp(A.cx, Bs.cx, e);
	const cy = lerp(A.cy, Bs.cy, e);
	// Übersicht: quer bildfüllend, hoch kleiner, sonst schneidet die schmale Box die Wohnung ab
	const uOf = (S: View) => (portrait && S === STOPS[0] ? 26 : S.u);
	const u = Math.exp(lerp(Math.log(uOf(A)), Math.log(uOf(Bs)), e));
	const ox = portrait ? PORTRAIT_BOX.ox : lerp(A.ox, Bs.ox, e);
	const oy = portrait ? PORTRAIT_BOX.oy : lerp(A.oy, Bs.oy, e);
	const P = (x: number, y: number, zz: number): [number, number] => [
		ox + (x - cx - (y - cy)) * 0.866 * u,
		oy + (x - cx + (y - cy)) * 0.5 * u - zz * u,
	];
	const lit = ROOMS.map((_, ri) => {
		let v = 0;
		STOPS.forEach((S, j) => {
			if (S.room === ri) v = Math.max(v, 1 - Math.abs(q - j) * 1.4);
		});
		return cl(v);
	});
	const focus = lit.indexOf(Math.max(...lit));
	const mx = st.sm.x;
	const my = st.sm.y;
	const FL = 210;
	// Blender-Schnitt als Zeichen (wohnung-gl.ts); bis er geladen ist, Punktböden und Linienwände wie bisher
	const frame = drawFlatGlyphs({
		W,
		H,
		dpr,
		ku: f * u,
		x0: tx + f * (ox - (cx - cy) * 0.866 * u),
		y0: ty + f * (oy - (cx + cy) * 0.5 * u),
		build,
		rooms: ROOMS.map((r) => [r[0], r[1], r[2], r[3]] as const),
		light: lit,
		pointer: m.in ? [tx + mx * f, ty + my * f, FL * f] : [0, 0, 0],
	});
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	if (frame) ctx.drawImage(frame, 0, 0);
	else {
		ctx.fillStyle = '#0A0A0A';
		ctx.fillRect(0, 0, cv.width, cv.height);
	}
	ctx.setTransform(dpr * f, 0, 0, dpr * f, dpr * tx, dpr * ty);
	const stp = Math.max(0.12, 5.5 / u);
	ctx.fillStyle = '#FAFAFA';
	// Bodenpunkte: tausende je Bild, daher P(x, y, 0) ausgeschrieben (ohne Array je Punkt) und das Bayer-Raster zuerst
	const ku = 0.866 * u;
	const kv = 0.5 * u;
	if (!frame)
		ROOMS.forEach((r, ri) => {
			const x = r[0];
			const y = r[1];
			const w = r[2];
			const hh = r[3];
			const base = 0.06 + 0.8 * (lit[ri] ?? 0);
			for (let gy = 0, yy = y + stp / 2; yy < y + hh; yy += stp, gy++) {
				const dy = yy - cy;
				const row = (gy & 3) * 4;
				for (let gx = 0, xx = x + stp / 2; xx < x + w; xx += stp, gx++) {
					const bay = (BAYER[row + (gx & 3)] ?? 0) / 16;
					if (bay >= buildFloor) continue;
					const dx = xx - cx;
					const px = ox + (dx - dy) * ku;
					const py = oy + (dx + dy) * kv;
					if (px < x0 - 4 || py < y0 - 4 || px > x1 || py > y1) continue;
					let I = base;
					if (m.in) {
						const ddx = px - mx;
						const ddy = py - my;
						const d2 = ddx * ddx + ddy * ddy;
						if (d2 < FL * FL) I += 0.8 * (1 - Math.sqrt(d2) / FL) ** 2;
					}
					if (I > bay + 0.02) ctx.fillRect(px, py, 1.6, 1.6);
				}
			}
		});
	// Bewohner laufen zwischen den Räumen, im angefahrenen Raum bleiben sie stehen
	if (!st.pp)
		st.pp = PEOC.map((rel, k) => ({
			name: people[k] ?? '',
			rel,
			x: 2 + k * 4,
			y: 7.5,
			tx: 2 + k * 4,
			ty: 7.5,
			nt: 0,
		}));
	const kp = lag(0.02, c.dt ?? 0.016);
	const focusRoom = ROOMS[focus];
	st.pp.forEach((pp, k) => {
		if (focusRoom && (lit[focus] ?? 0) > 0.5) {
			const r = focusRoom;
			pp.tx = r[0] + r[2] * (0.3 + 0.4 * (k % 2));
			pp.ty = r[1] + r[3] * (0.3 + 0.4 * (k > 1 ? 1 : 0));
		} else if (now > pp.nt) {
			const r = ROOMS[Math.floor(Math.random() * ROOMS.length)];
			if (!r) return;
			pp.tx = r[0] + r[2] * (0.25 + Math.random() * 0.5);
			pp.ty = r[1] + r[3] * (0.25 + Math.random() * 0.5);
			pp.nt = now + 2.5 + Math.random() * 3;
		}
		pp.x += (pp.tx - pp.x) * kp;
		pp.y += (pp.ty - pp.y) * kp;
	});
	const HW = 1.1;
	if (!frame)
		for (const [k, wl] of WALLS.entries()) {
			// jede Wand zieht sich versetzt von ihrem Anfang aus, die Höhe wächst mit
			const w = ss(cl(buildWalls * 1.6 - (k / WALLS.length) * 0.6));
			if (w <= 0) continue;
			const ex = wl[0] + (wl[2] - wl[0]) * w;
			const ey = wl[1] + (wl[3] - wl[1]) * w;
			const a = P(wl[0], wl[1], 0);
			const b = P(ex, ey, 0);
			const a2 = P(wl[0], wl[1], HW * w);
			const b2 = P(ex, ey, HW * w);
			ctx.globalAlpha = 0.92;
			ctx.fillStyle = '#0A0A0A';
			ctx.beginPath();
			ctx.moveTo(a[0], a[1]);
			ctx.lineTo(b[0], b[1]);
			ctx.lineTo(b2[0], b2[1]);
			ctx.lineTo(a2[0], a2[1]);
			ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 0.3;
			ctx.strokeStyle = '#FAFAFA';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(a[0], a[1]);
			ctx.lineTo(b[0], b[1]);
			ctx.moveTo(a[0], a[1]);
			ctx.lineTo(a2[0], a2[1]);
			ctx.moveTo(b[0], b[1]);
			ctx.lineTo(b2[0], b2[1]);
			ctx.stroke();
			ctx.globalAlpha = 0.9;
			ctx.beginPath();
			ctx.moveTo(a2[0], a2[1]);
			ctx.lineTo(b2[0], b2[1]);
			ctx.stroke();
		}
	ctx.globalAlpha = 1;
	const panes = st.pp.map((pp, k) => {
		const pt = P(pp.x, pp.y, 0.45);
		const r = pp.rel * u * 0.5;
		const sx = tx + pt[0] * f;
		const sy = ty + pt[1] * f;
		const ba =
			buildRest *
			fadeOf(`a${k}`, { x0: sx - r * f, x1: sx + r * f, y0: sy - r * f, y1: sy + r * f });
		ctx.globalAlpha = ba;
		ctx.fillStyle = '#FAFAFA';
		ctx.beginPath();
		ctx.arc(pt[0], pt[1], r, 0, 6.2832);
		ctx.fill();
		ctx.fillStyle = '#0A0A0A';
		ctx.beginPath();
		ctx.arc(pt[0] + r * 0.12, pt[1] - r * 0.28, r * 0.22, 0, 6.2832);
		ctx.fill();
		ctx.globalAlpha = 1;
		return { pt, r };
	});
	// Alles Weitere in CSS-Pixeln: Hochformat deckt oberhalb der Box ab, dann die Beschriftungen
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	// Hochformat: nur hinter dem Textblock abdunkeln, weich auslaufend (keine Schnittkante bei boxTop)
	if (portrait && dom.column) {
		const viewH = Math.max(...cardOpacity(c.P));
		if (viewH > 0.01) {
			const bottom = dom.column.y1 + 12;
			const g = ctx.createLinearGradient(0, 0, 0, bottom + 90);
			const a = 0.9 * viewH;
			const stop = bottom / (bottom + 90);
			g.addColorStop(0, `rgba(10,10,10,${a})`);
			g.addColorStop(stop, `rgba(10,10,10,${a})`);
			g.addColorStop(1, 'rgba(10,10,10,0)');
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, W, bottom + 90);
		}
	}
	// Quer: links neben der Kartenspalte dunkelt die Wohnung weich ab, damit keine Wand und kein Punkt
	// durch den Kartentext läuft (T-02, T-15)
	const view = Math.max(...cardOpacity(c.P));
	if (!portrait && dom.column && view > 0.01) {
		const right = dom.column.x1 + 28;
		const g = ctx.createLinearGradient(0, 0, right + 150, 0);
		const a = 0.9 * view;
		const stop = right / (right + 150);
		g.addColorStop(0, `rgba(10,10,10,${a})`);
		g.addColorStop(stop, `rgba(10,10,10,${a})`);
		g.addColorStop(1, 'rgba(10,10,10,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, right + 150, H);
	}
	const size = Math.max(10.5, 11 * f);
	const items: Label[] = [];
	st.pp.forEach((pp, k) => {
		const sch = panes[k];
		if (!sch) return;
		items.push({
			text: pp.name,
			x: tx + sch.pt[0] * f,
			y: ty + (sch.pt[1] - sch.r) * f - 8,
			size,
			a: 0.72,
			kind: 'name',
			off: false,
			w: 0,
			rect: null,
		});
	});
	ROOMS.forEach((r, ri) => {
		const pt = P(r[0] + r[2] / 2, r[1] + r[3] / 2, 0);
		items.push({
			text: rooms[ri] ?? '',
			x: tx + pt[0] * f,
			y: ty + pt[1] * f,
			size,
			a: 0.6 + 0.4 * (lit[ri] ?? 0),
			kind: 'room',
			off: false,
			w: 0,
			rect: null,
		});
	});
	// Räume zuerst setzen (feste Plätze), Namen weichen aus
	items.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'room' ? -1 : 1));
	const shown: Rect = { x0: 0, x1: W, y0: portrait ? boxTop : 0, y1: c.safeH };
	placeLabels(ctx, items, shown, dom.avoid);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 3;
	// ctx.font nur bei Wechsel setzen: der Setter parst den Schrift-String jedes Mal neu (teuer je Bild)
	let font = '';
	for (const it of items) {
		if (it.off || !it.rect) continue;
		it.a *= buildRest * fadeOf(`l${it.text}`, it.rect);
		if (it.a < 0.01) continue;
		const fo = mono(it.size);
		if (fo !== font) {
			ctx.font = fo;
			font = fo;
		}
		ctx.globalAlpha = it.a;
		ctx.strokeStyle = 'rgba(10,10,10,0.9)';
		ctx.strokeText(it.text, it.x, it.y);
		ctx.fillStyle = '#FAFAFA';
		ctx.fillText(it.text, it.x, it.y);
	}
	ctx.globalAlpha = 1;
	st.labels = items.filter((it) => !it.off && it.a > 0.05);
	if (m.in) {
		const px = tx + mx * f;
		const py = ty + my * f;
		ctx.strokeStyle = 'rgba(250,250,250,0.6)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(px, py, 18, 0, 6.2832);
		ctx.stroke();
		ctx.fillStyle = '#FAFAFA';
		ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
	}
}
