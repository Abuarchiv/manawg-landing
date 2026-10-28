// Die Wohnung: isometrischer Grundriss aus Punktraster und Wänden, vier Räume werden nacheinander
// angefahren. Dazu die Kurve der Raumkarten (karten) für die Texte der Bühne.
//
// Szenenraum: Die Komposition liegt in der Bezugsbox 1280 x 800 (c.fit), das Punktraster und die
// Wände laufen über die ganze Fläche.

import { loop, qa } from '../../core/loop';
import { BAYER, cl, lag, lerp, ss } from '../../core/math';
import type { BuehnenKontext } from './types';

const mono = (px: number) => `500 ${px}px "JetBrains Mono", monospace`;

/** Raum im Raster: Name, x, y, Breite, Tiefe, Zeile. */
type Raum = readonly [name: string, x: number, y: number, w: number, d: number, zeile: string];

const ROOMS = [
	['KÜCHE', 0, 0, 8, 6, 'Einkäufe · Vorräte'],
	['BAD', 8, 0, 5, 6, 'Putzplan'],
	['ZIMMER · JONA', 13, 0, 7, 6, ''],
	['FLUR', 0, 6, 20, 3, 'Pinnwand · Chat'],
	['WOHNZIMMER', 0, 9, 9, 7, 'Ausgaben · Fixkosten'],
	['ZIMMER · LEA', 9, 9, 5, 7, ''],
	['ZIMMER · LINA', 14, 9, 6, 7, ''],
] as const satisfies readonly Raum[];

/** Blickpunkt: Mitte im Raster (cx, cy), Maßstab u, Ursprung der Projektion (ox, oy), Raum (-1 = keiner). */
interface Blick {
	cx: number;
	cy: number;
	u: number;
	ox: number;
	oy: number;
	room: number;
}

const STOPS: readonly Blick[] = [
	{ cx: 10, cy: 8, u: 34, ox: 760, oy: 450, room: -1 },
	{ cx: 4, cy: 3, u: 62, ox: 840, oy: 420, room: 0 },
	{ cx: 4.5, cy: 12.5, u: 52, ox: 840, oy: 420, room: 4 },
	{ cx: 10.5, cy: 3, u: 80, ox: 840, oy: 420, room: 1 },
	{ cx: 10, cy: 7.5, u: 48, ox: 840, oy: 420, room: 3 },
	{ cx: 10, cy: 8, u: 24, ox: 640, oy: 300, room: -1 },
];
/** Wand: Anfang (x, y) und Ende (x, y) im Raster. */
type Wand = [number, number, number, number];

const WALLS: Wand[] = [];
for (const r of ROOMS) {
	const x = r[1];
	const y = r[2];
	const w = r[3];
	const hh = r[4];
	WALLS.push(
		[x, y, x + w, y],
		[x + w, y, x + w, y + hh],
		[x, y + hh, x + w, y + hh],
		[x, y, x, y + hh],
	);
}
WALLS.sort((a, b) => a[0] + a[1] + a[2] + a[3] - (b[0] + b[1] + b[2] + b[3]));
/** Bewohner: Name und Größe der Scheibe (in Rastereinheiten). */
const PEOC = [
	['LINA', 0.62],
	['MIKA', 0.5],
	['JONA', 0.42],
	['LEA', 0.34],
] as const;

/**
 * Deckkraft der vier Raumkarten bei Fortschritt P, am Scroll geführt wie im Entwurf (--c0..3): Karte j steht
 * um fs = j + 1 (Plateau 0,5 Stopps breit), blendet davor und danach in 0,25 Stopps ein und aus. Anders als im
 * Entwurf überlappen sich die Blenden nie (an der Grenze der Karten ist die Summe 0): kein Text über Text.
 */
export function karten(P: number): number[] {
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

qa.karten = karten;

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
	art: 'name' | 'raum';
	/** Ganz außerhalb des Blickfelds: wird nicht gezeigt. */
	aus: boolean;
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
interface DomMasse {
	spalte: Rect | null;
	meiden: Rect[];
}

/** Zustand der Wohnung je Canvas. */
interface WohnungsZustand {
	ctx: CanvasRenderingContext2D;
	/** Nachlaufender Zeiger in Szenenkoordinaten. */
	sm: { x: number; y: number };
	pp: Person[] | null;
	labels: Label[];
	dom: DomMasse | null;
	domN: number;
	fade: Record<string, number>;
	W: number;
	H: number;
}

const states = new WeakMap<HTMLCanvasElement, WohnungsZustand>();

// Variante B: Zeichenblatt der Bodenrampe (7 x 11 CSS-px je Zelle), je Pixelfaktor und Schriftstand
const RAMPE_B = ' .:-=+*#%@';
let blattB: {
	cv: HTMLCanvasElement;
	zw: number;
	zh: number;
	key: string;
	muster: (CanvasPattern | null)[];
} | null = null;
function zeichenBlatt(dpr: number) {
	const key = `${dpr}|${loop.fv}`;
	if (blattB?.key === key) return blattB;
	const zw = Math.ceil(7 * dpr);
	const zh = Math.ceil(11 * dpr);
	const cv = document.createElement('canvas');
	cv.width = zw * RAMPE_B.length;
	cv.height = zh;
	const g = cv.getContext('2d');
	if (g) {
		g.font = `500 ${10 * dpr}px "JetBrains Mono", monospace`;
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillStyle = '#FAFAFA';
		for (let i = 0; i < RAMPE_B.length; i++) g.fillText(RAMPE_B[i] ?? '', zw * i + zw / 2, zh / 2);
	}
	blattB = { cv, zw, zh, key, muster: [] };
	return blattB;
}

/** Muster je Glyphe (eine Zelle, wiederholt im CSS-px-Raster ab 0, 0): ganze Böden in einem Füllaufruf. */
function muster(ctx: CanvasRenderingContext2D, bl: NonNullable<typeof blattB>, gi: number) {
	let m = bl.muster[gi];
	if (m === undefined) {
		const t = document.createElement('canvas');
		t.width = bl.zw;
		t.height = bl.zh;
		t.getContext('2d')?.drawImage(bl.cv, gi * bl.zw, 0, bl.zw, bl.zh, 0, 0, bl.zw, bl.zh);
		m = ctx.createPattern(t, 'repeat');
		m?.setTransform(new DOMMatrix().scale(7 / bl.zw, 11 / bl.zh));
		bl.muster[gi] = m;
	}
	return m;
}

// Zeichen-Maße für Beschriftungen
const widths = new Map<string, number>();
function breite(ctx: CanvasRenderingContext2D, font: string, text: string): number {
	const k = `${font}|${text}`;
	let w = widths.get(k);
	if (w === undefined) {
		ctx.font = font;
		w = ctx.measureText(text).width;
		widths.set(k, w);
	}
	return w;
}
const trifft = (a: Rect, b: Rect) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

/**
 * Beschriftungen setzen (CSS-Pixel, Identität): in den sichtbaren Bereich klemmen, Rechtecken aus dem
 * DOM (Kartenspalte, Kopf, Hinweis) und anderen Beschriftungen ausweichen.
 */
function setzeLabels(
	ctx: CanvasRenderingContext2D,
	items: Label[],
	grenzen: Rect,
	meiden: readonly Rect[],
): Label[] {
	const gesetzt: Rect[] = [];
	for (const it of items) {
		const font = mono(it.size);
		const w = breite(ctx, font, it.text);
		const h = it.size;
		// Ganz außerhalb des Blickfelds: nicht zeigen. Teilweise draußen: hineinklemmen.
		if (
			it.x < grenzen.x0 - w / 2 ||
			it.x > grenzen.x1 + w / 2 ||
			it.y < grenzen.y0 ||
			it.y > grenzen.y1 + h
		) {
			it.aus = true;
			continue;
		}
		let x = Math.min(grenzen.x1 - 8 - w / 2, Math.max(grenzen.x0 + 8 + w / 2, it.x));
		let y = Math.min(grenzen.y1 - 8, Math.max(grenzen.y0 + 8 + h, it.y));
		const rect = (): Rect => ({ x0: x - w / 2 - 2, x1: x + w / 2 + 2, y0: y - h - 2, y1: y + 3 });
		for (let n = 0; n < 6; n++) {
			const r = rect();
			const m = meiden.find((q) => trifft(r, q));
			if (m) {
				// zur näheren freien Seite schieben, sonst unter das Hindernis
				const rechts = m.x1 + 4 + w / 2 + 2;
				const links = m.x0 - 4 - w / 2 - 2;
				const okR = rechts <= grenzen.x1 - 8 - w / 2;
				const okL = links >= grenzen.x0 + 8 + w / 2;
				if (okR && (!okL || rechts - x < x - links)) x = rechts;
				else if (okL) x = links;
				else y = m.y1 + 4 + h + 2;
				continue;
			}
			const g = gesetzt.find((q) => trifft(r, q));
			if (g) {
				y = g.y0 - 4;
				if (y < grenzen.y0 + 8 + h) y = it.y + h + 6;
				continue;
			}
			break;
		}
		gesetzt.push(rect());
		it.x = x;
		it.y = y;
		it.w = w;
		it.rect = rect();
	}
	return items;
}

// Hochformat: die Wohnung steht unter der Kartenspalte in einer eigenen Box 900 x 560 (Szenenraum
// 190..1090 x 120..680), jeder Blickpunkt sitzt in der Mitte der Box.
const HOCH_BOX = { bw: 900, bh: 560, x0: 190, y0: 120, ox: 640, oy: 410 };

/** Hochformat: Oberkante und Unterkante der Wohnungsbox unter der Kartenspalte (CSS-px). Auch die Flut spart sie aus. */
export function hochOben(textUnten: number, safeH: number): { top: number; bot: number } {
	return { top: Math.min(textUnten + 10, safeH * 0.62), bot: safeH - 56 };
}

/** Rechtecke der DOM-Elemente mit data-loch relativ zum Canvas (alle 20 Bilder neu gemessen). */
function messeDom(st: WohnungsZustand, cv: HTMLCanvasElement): DomMasse {
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
	const dom: DomMasse = {
		spalte: null,
		meiden: [],
	};
	st.dom = dom;
	for (const el of root.querySelectorAll<HTMLElement>('[data-loch]')) {
		const q = rect(el);
		if (el.dataset.loch === 'text') {
			dom.spalte = q;
			dom.meiden.push(q);
		} else dom.meiden.push({ x0: q.x0 - 6, y0: q.y0 - 6, x1: q.x1 + 6, y1: q.y1 + 6 });
	}
	st.domN = loop.n;
	return dom;
}

/** Zeichnet die Wohnung in das 2D-Canvas. c: Kontext der Bühne. */
export function draw(cv: HTMLCanvasElement, c: BuehnenKontext): void {
	let st = states.get(cv);
	if (!st) {
		const ctx0 = cv.getContext('2d');
		if (!ctx0) return;
		const neu: WohnungsZustand = {
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
		st = neu;
		states.set(cv, neu);
		qa.wohnungLabels = () => ({
			labels: neu.labels.map((l) => ({ text: l.text, size: l.size, ...l.rect, cx: l.x, cy: l.y })),
			spalte: neu.dom?.spalte ?? null,
			W: neu.W,
			H: neu.H,
		});
	}
	const ctx = st.ctx;
	const { W, H, dpr, now, m } = c;
	st.W = W;
	st.H = H;
	const dom = messeDom(st, cv);
	// Avatare und Beschriftungen blenden in ca. 120 ms aus, solange sie die Raumtext-Spalte (samt Rand links) schneiden
	const zone =
		dom.spalte && Math.max(...karten(c.P)) > 0.01
			? { x0: 0, x1: dom.spalte.x1 + 8, y0: dom.spalte.y0 - 8, y1: dom.spalte.y1 + 8 }
			: null;
	const blende = (key: string, r: Rect): number => {
		const hit = zone && r.x1 > zone.x0 && r.x0 < zone.x1 && r.y1 > zone.y0 && r.y0 < zone.y1;
		const z = hit ? 0 : 1;
		const v = st.fade[key] ?? z;
		st.fade[key] =
			Math.abs(z - v) < 0.01
				? z
				: v + (z - v) * (1 - Math.exp(-Math.min(c.dt ?? 0.016, 0.1) / 0.04));
		return st.fade[key];
	};
	const hoch = c.mode === 'hoch';
	// Abbildung Szenenraum -> Canvas-CSS-Pixel: X = tx + x * f, Y = ty + y * f
	let f: number;
	let tx: number;
	let ty: number;
	let boxTop = 0;
	if (hoch) {
		const sp = dom.spalte;
		boxTop = sp ? hochOben(sp.y1, c.safeH).top : c.safeH * 0.45;
		const boxBot = c.safeH - 56;
		const bh = Math.max(120, boxBot - boxTop);
		f = Math.min(W / HOCH_BOX.bw, bh / HOCH_BOX.bh, 1.25);
		tx = (W - HOCH_BOX.bw * f) / 2 - HOCH_BOX.x0 * f;
		ty = boxTop + (bh - HOCH_BOX.bh * f) / 2 - HOCH_BOX.y0 * f;
		// Übersicht mittig im Bild, erst mit der ersten Raumkarte rückt die Wohnung unter die Textspalte
		const mitte = c.reduced ? 0 : 1 - ss((c.P - 0.62) / 0.04);
		ty = lerp(ty, (c.safeH - HOCH_BOX.bh * f) / 2 - HOCH_BOX.y0 * f, mitte);
		boxTop *= 1 - mitte;
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
	const bau = c.reduced ? 1 : cl((c.P - 0.54) / 0.09) * (1 - cl((c.P - 0.885) / 0.05));
	const bauWand = cl(bau / 0.55);
	const bauBoden = cl((bau - 0.3) / 0.55);
	const bauRest = cl((bau - 0.75) / 0.25);
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
	const uOf = (S: Blick) => (hoch && S === STOPS[0] ? 26 : S.u);
	const u = Math.exp(lerp(Math.log(uOf(A)), Math.log(uOf(Bs)), e));
	const ox = hoch ? HOCH_BOX.ox : lerp(A.ox, Bs.ox, e);
	const oy = hoch ? HOCH_BOX.oy : lerp(A.oy, Bs.oy, e);
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
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.fillStyle = '#0A0A0A';
	ctx.fillRect(0, 0, W, H);
	ctx.setTransform(dpr * f, 0, 0, dpr * f, dpr * tx, dpr * ty);
	const mx = st.sm.x;
	const my = st.sm.y;
	const FL = 210;
	const stp = Math.max(0.12, 5.5 / u);
	ctx.fillStyle = '#FAFAFA';
	// Bodenpunkte: tausende je Bild, daher P(x, y, 0) ausgeschrieben (ohne Array je Punkt) und das Bayer-Raster zuerst
	const ku = 0.866 * u;
	const kv = 0.5 * u;
	const lichtAn = (px: number, py: number, I: number) => {
		if (!m.in) return I;
		const ddx = px - mx;
		const ddy = py - my;
		const d2 = ddx * ddx + ddy * ddy;
		return d2 < FL * FL ? I + 0.8 * (1 - Math.sqrt(d2) / FL) ** 2 : I;
	};
	if (loop.v === 'a' || loop.v === 'c') {
		// Variante A/C: Böden als Kupferstich. Jede Gitterzeile wird zu einer Linie entlang der Raumachse, die mit
		// dem Ton anschwillt; helle Stellen bekommen die Kreuzlage. Beim Aufbau zieht der Stichel die Linien von
		// der Wand aus, jede Zeile etwas versetzt.
		ctx.beginPath();
		const sx = ku * stp * 0.5;
		const sy = kv * stp * 0.5;
		for (const [ri, r] of ROOMS.entries()) {
			const x = r[1];
			const y = r[2];
			const w = r[3];
			const hh = r[4];
			const base = 0.06 + 0.8 * (lit[ri] ?? 0);
			for (let gy = 0, yy = y + stp / 2; yy < y + hh; yy += stp, gy++) {
				const dy = yy - cy;
				const zug = bauBoden * 1.35 - ((gy * 5) % 7) * 0.05;
				for (let xx = x + stp / 2; xx < x + w; xx += stp) {
					if ((xx - x) / w > zug) break;
					const dx = xx - cx;
					const px = ox + (dx - dy) * ku;
					const py = oy + (dx + dy) * kv;
					if (px < x0 - 8 || py < y0 - 8 || px > x1 + 8 || py > y1 + 8) continue;
					const I = Math.min(1.3, lichtAn(px, py, base));
					const h = 0.1 + 0.6 * I;
					ctx.moveTo(px - sx, py - sy - h);
					ctx.lineTo(px + sx, py + sy - h);
					ctx.lineTo(px + sx, py + sy + h);
					ctx.lineTo(px - sx, py - sy + h);
					if (I > 0.72) {
						const k = (I - 0.72) * 0.7;
						ctx.moveTo(px + sx - k, py - sy);
						ctx.lineTo(px - sx - k, py + sy);
						ctx.lineTo(px - sx + k, py + sy);
						ctx.lineTo(px + sx + k, py - sy);
					}
				}
			}
		}
		ctx.fill();
	} else if (loop.v === 'b') {
		// Variante B: Böden aus Zeichen in einem festen Bildschirmraster (wie ein Terminal), der Ton wählt die Glyphe
		const bl = zeichenBlatt(dpr);
		const CW = 7;
		const CH = 11;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const gOf = (I: number) => Math.min(RAMPE_B.length - 1, Math.floor(I * 8.5 + 0.6));
		for (const [ri, r] of ROOMS.entries()) {
			const x = r[1];
			const y = r[2];
			const w = r[3];
			const hh = r[4];
			const base = 0.06 + 0.8 * (lit[ri] ?? 0);
			if (bauBoden >= 1) {
				// Fertiger Boden: Fläche mit dem Muster der Grundglyphe füllen, der Lichtkegel legt je hellere Stufe
				// einen kleineren Kreis darüber (Ringe statt Zellen: ein paar Füllaufrufe statt tausender Bilder)
				const ecken = [P(x, y, 0), P(x + w, y, 0), P(x + w, y + hh, 0), P(x, y + hh, 0)];
				const boden = new Path2D();
				for (const [k, e] of ecken.entries())
					k
						? boden.lineTo(tx + e[0] * f, ty + e[1] * f)
						: boden.moveTo(tx + e[0] * f, ty + e[1] * f);
				boden.closePath();
				const g0 = gOf(base);
				const m0 = g0 > 0 ? muster(ctx, bl, g0) : null;
				if (m0) {
					ctx.fillStyle = m0;
					ctx.fill(boden);
				}
				if (m.in) {
					ctx.save();
					ctx.clip(boden);
					for (let g = g0 + 1; g < RAMPE_B.length; g++) {
						const r0 = FL * (1 - Math.sqrt(Math.max(0, (g - 0.6) / 8.5 - base) / 0.8));
						if (r0 <= 0) break;
						const kreis = new Path2D();
						kreis.arc(tx + mx * f, ty + my * f, r0 * f, 0, 6.2832);
						ctx.fillStyle = '#0A0A0A';
						ctx.fill(kreis);
						const mg = muster(ctx, bl, g);
						if (mg) ctx.fillStyle = mg;
						ctx.fill(kreis);
					}
					ctx.restore();
				}
				continue;
			}
			let bx0 = Number.POSITIVE_INFINITY;
			let bx1 = Number.NEGATIVE_INFINITY;
			let by0 = Number.POSITIVE_INFINITY;
			let by1 = Number.NEGATIVE_INFINITY;
			for (const [ex, ey] of [
				[x, y],
				[x + w, y],
				[x, y + hh],
				[x + w, y + hh],
			] as const) {
				const p = P(ex, ey, 0);
				bx0 = Math.min(bx0, tx + p[0] * f);
				bx1 = Math.max(bx1, tx + p[0] * f);
				by0 = Math.min(by0, ty + p[1] * f);
				by1 = Math.max(by1, ty + p[1] * f);
			}
			bx0 = Math.max(bx0, 0);
			by0 = Math.max(by0, 0);
			bx1 = Math.min(bx1, W);
			by1 = Math.min(by1, H);
			for (let Y = Math.floor(by0 / CH) * CH; Y < by1; Y += CH) {
				const row = Math.round(Y / CH);
				for (let X = Math.floor(bx0 / CW) * CW; X < bx1; X += CW) {
					const col = Math.round(X / CW);
					if ((BAYER[(row & 3) * 4 + (col & 3)] ?? 0) / 16 >= bauBoden) continue;
					const px = (X + CW / 2 - tx) / f;
					const py = (Y + CH / 2 - ty) / f;
					const a = (px - ox) / ku;
					const b = (py - oy) / kv;
					const xx = (a + b) / 2 + cx;
					const yy = (b - a) / 2 + cy;
					if (xx < x || xx > x + w || yy < y || yy > y + hh) continue;
					const gi = gOf(lichtAn(px, py, base));
					if (gi <= 0) continue;
					ctx.drawImage(bl.cv, gi * bl.zw, 0, bl.zw, bl.zh, X, Y, CW, CH);
				}
			}
		}
		ctx.setTransform(dpr * f, 0, 0, dpr * f, dpr * tx, dpr * ty);
	} else
		ROOMS.forEach((r, ri) => {
			const x = r[1];
			const y = r[2];
			const w = r[3];
			const hh = r[4];
			const base = 0.06 + 0.8 * (lit[ri] ?? 0);
			for (let gy = 0, yy = y + stp / 2; yy < y + hh; yy += stp, gy++) {
				const dy = yy - cy;
				const zeile = (gy & 3) * 4;
				for (let gx = 0, xx = x + stp / 2; xx < x + w; xx += stp, gx++) {
					const bay = (BAYER[zeile + (gx & 3)] ?? 0) / 16;
					if (bay >= bauBoden) continue;
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
		st.pp = PEOC.map(([name, rel], k) => ({
			name,
			rel,
			x: 2 + k * 4,
			y: 7.5,
			tx: 2 + k * 4,
			ty: 7.5,
			nt: 0,
		}));
	const kp = lag(0.02, c.dt ?? 0.016);
	const fokusRaum = ROOMS[focus];
	st.pp.forEach((pp, k) => {
		if (fokusRaum && (lit[focus] ?? 0) > 0.5) {
			const r = fokusRaum;
			pp.tx = r[1] + r[3] * (0.3 + 0.4 * (k % 2));
			pp.ty = r[2] + r[4] * (0.3 + 0.4 * (k > 1 ? 1 : 0));
		} else if (now > pp.nt) {
			const r = ROOMS[Math.floor(Math.random() * ROOMS.length)];
			if (!r) return;
			pp.tx = r[1] + r[3] * (0.25 + Math.random() * 0.5);
			pp.ty = r[2] + r[4] * (0.25 + Math.random() * 0.5);
			pp.nt = now + 2.5 + Math.random() * 3;
		}
		pp.x += (pp.tx - pp.x) * kp;
		pp.y += (pp.ty - pp.y) * kp;
	});
	const HW = 1.1;
	for (const [k, wl] of WALLS.entries()) {
		// jede Wand zieht sich versetzt von ihrem Anfang aus, die Höhe wächst mit
		const w = ss(cl(bauWand * 1.6 - (k / WALLS.length) * 0.6));
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
	const scheiben = st.pp.map((pp, k) => {
		const pt = P(pp.x, pp.y, 0.45);
		const r = pp.rel * u * 0.5;
		const sx = tx + pt[0] * f;
		const sy = ty + pt[1] * f;
		const ba =
			bauRest * blende(`a${k}`, { x0: sx - r * f, x1: sx + r * f, y0: sy - r * f, y1: sy + r * f });
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
	if (hoch && dom.spalte) {
		const sichtH = Math.max(...karten(c.P));
		if (sichtH > 0.01) {
			const unten = dom.spalte.y1 + 12;
			const g = ctx.createLinearGradient(0, 0, 0, unten + 90);
			const a = 0.9 * sichtH;
			const stop = unten / (unten + 90);
			g.addColorStop(0, `rgba(10,10,10,${a})`);
			g.addColorStop(stop, `rgba(10,10,10,${a})`);
			g.addColorStop(1, 'rgba(10,10,10,0)');
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, W, unten + 90);
		}
	}
	// Quer: links neben der Kartenspalte dunkelt die Wohnung weich ab, damit keine Wand und kein Punkt
	// durch den Kartentext läuft (T-02, T-15)
	const sicht = Math.max(...karten(c.P));
	if (!hoch && dom.spalte && sicht > 0.01) {
		const rechts = dom.spalte.x1 + 28;
		const g = ctx.createLinearGradient(0, 0, rechts + 150, 0);
		const a = 0.9 * sicht;
		const stop = rechts / (rechts + 150);
		g.addColorStop(0, `rgba(10,10,10,${a})`);
		g.addColorStop(stop, `rgba(10,10,10,${a})`);
		g.addColorStop(1, 'rgba(10,10,10,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, rechts + 150, H);
	}
	const size = Math.max(10.5, 11 * f);
	const items: Label[] = [];
	st.pp.forEach((pp, k) => {
		const sch = scheiben[k];
		if (!sch) return;
		items.push({
			text: pp.name,
			x: tx + sch.pt[0] * f,
			y: ty + (sch.pt[1] - sch.r) * f - 8,
			size,
			a: 0.72,
			art: 'name',
			aus: false,
			w: 0,
			rect: null,
		});
	});
	ROOMS.forEach((r, ri) => {
		const pt = P(r[1] + r[3] / 2, r[2] + r[4] / 2, 0);
		items.push({
			text: r[0],
			x: tx + pt[0] * f,
			y: ty + pt[1] * f,
			size,
			a: 0.6 + 0.4 * (lit[ri] ?? 0),
			art: 'raum',
			aus: false,
			w: 0,
			rect: null,
		});
	});
	// Räume zuerst setzen (feste Plätze), Namen weichen aus
	items.sort((a, b) => (a.art === b.art ? 0 : a.art === 'raum' ? -1 : 1));
	const sichtbar: Rect = { x0: 0, x1: W, y0: hoch ? boxTop : 0, y1: c.safeH };
	setzeLabels(ctx, items, sichtbar, dom.meiden);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 3;
	// ctx.font nur bei Wechsel setzen: der Setter parst den Schrift-String jedes Mal neu (teuer je Bild)
	let schrift = '';
	for (const it of items) {
		if (it.aus || !it.rect) continue;
		it.a *= bauRest * blende(`l${it.text}`, it.rect);
		if (it.a < 0.01) continue;
		const fo = mono(it.size);
		if (fo !== schrift) {
			ctx.font = fo;
			schrift = fo;
		}
		ctx.globalAlpha = it.a;
		// Varianten: die Beschriftung stanzt ihr Feld aus dem Boden aus, statt nur eine Kontur zu tragen
		if (loop.v) {
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(
				it.rect.x0 - 3,
				it.rect.y0 - 2,
				it.rect.x1 - it.rect.x0 + 6,
				it.rect.y1 - it.rect.y0 + 4,
			);
		}
		ctx.strokeStyle = 'rgba(10,10,10,0.9)';
		ctx.strokeText(it.text, it.x, it.y);
		ctx.fillStyle = '#FAFAFA';
		ctx.fillText(it.text, it.x, it.y);
	}
	ctx.globalAlpha = 1;
	st.labels = items.filter((it) => !it.aus && it.a > 0.05);
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
