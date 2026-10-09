// Die Flut: gestochene Wolken fluten die Bühne als weicher Übergang zwischen Organ, Wohnung und Ende-Ebene.
//
// Je Punkt der Maske entscheidet ein Dichtewert, wie viel Wolke steht: Rauschen in Zellkoordinaten (0,13 je Einheit,
// driftet mit t) plus Feinrauschen für eine organische Kante, Deckung, Zeilenverlauf, Lücken und Zeiger-Spur.
// Gezeichnet wird sie in kleiner Auflösung als Alpha-Maske, die hochgerechnet die Wolken (gedämpft, dunkel) mit weicher
// Kante ausstanzt: keine Blöcke, keine Ziffern.
// Zwei Wellen: P 0,50 bis 0,78 (Organ zur Wohnung) und P 0,84 bis 0,99 (Wohnung zur Ende-Ebene). Der Zeiger wischt
// eine Spur frei (Abklingen 0,985 je Bild bei 60 Hz).
// Freigehalten werden echte DOM-Rechtecke (loecher): Logo, Knopf und Sprunglink immer, die Raumkarte solange
// sie steht (Texte bleiben lesbar).

import { type Modus, modeOf, qa } from '../../core/loop';
import { cl, ss, vnz } from '../../core/math';
import type { BuehnenKontext, Loch } from './types';
import { hochOben } from './wohnung';

const RAND_TEXT = 64; // Hochformat: Abstand der Raumtext-Lücke zum Text
const KANTE = 24; // Hochformat: weiche Kante der Lücken
const STAERKE = 0.3; // Beitrag der Deckung zum Schwellwert (kleiner als im Entwurf: die Flut deckt nie den ganzen Schirm)
const SCHRITT = 6; // Auflösung der Maske in CSS-Pixeln (hochgerechnet ergibt sie die weiche Kante)
const KANTE_W = 0.022; // Breite der Kante im Dichtewert

// Füllung: gestochene Wolken (dieselbe Technik wie Himmel und Finale), gedämpft, damit die Flut nicht grell aufblitzt.
// Bis das Bild geladen ist, füllt ein ruhiges Dunkelgrau.
const WOLKEN_A = 2048 / 592;
let wolken: HTMLImageElement | null = null;
function wolkenBild(): HTMLImageElement | null {
	if (typeof Image === 'undefined') return null;
	if (!wolken) {
		wolken = new Image();
		wolken.decoding = 'async';
		wolken.src = '/himmel/flut-wolken.webp';
	}
	return wolken.complete && wolken.naturalWidth ? wolken : null;
}

/** Zustand der Flut je Canvas. */
interface FlutZustand {
	ctx: CanvasRenderingContext2D;
	/** Zeiger-Spur in Maskenauflösung (1 = frisch gewischt). */
	tr: Float32Array | null;
	clean: boolean;
	/** Maske der Wolken (Alpha) in kleiner Auflösung. */
	mask: HTMLCanvasElement | null;
	mctx: CanvasRenderingContext2D | null;
	img: ImageData | null;
	mw: number;
	mh: number;
}

/** Eine Lücke in der Flut: Rechteck mit Rand, weicher Kante und Gewicht w0 (0..1). */
interface Luecke {
	x: number;
	y: number;
	w: number;
	h: number;
	rand: number;
	kante: number;
	w0: number;
}

/** Was lueckenVon vom Bühnenkontext braucht (die QA reicht nur diese Felder). */
interface LueckenKontext {
	mode: Modus;
	W: number;
	H: number;
	tw?: number;
	endA?: number;
	safeH?: number;
}

const states = new WeakMap<HTMLCanvasElement, FlutZustand>();

/** Zellgröße und Ziffergröße in CSS-Pixeln: quer 32 und 10 des Entwurfs mit der Bühne skaliert, hoch fest 8 und 7. */
export function masse(W: number, H: number, mode: Modus): { cs: number; zf: number } {
	if (mode === 'hoch') return { cs: 8, zf: 7 };
	const cs = cl(32 * Math.min(W / 1280, H / 800), 20, 96);
	return { cs, zf: (10 * cs) / 32 };
}

/** Anteil der Fläche, den die Flut deckt (0..1): zwei Wellen wie im Entwurf. */
export function deckung(P: number): number {
	return Math.max(
		ss((P - 0.5) / 0.07) * (1 - ss((P - 0.66) / 0.12)),
		ss((P - 0.84) / 0.05) * (1 - ss((P - 0.94) / 0.05)),
	);
}

/** Gewicht der Lücke um die Raumkarte: geht kurz vor der ersten Karte (P 0,67) auf und mit der Wohnung (endA 0,5) zu. */
export function textGewicht(P: number): number {
	return ss((P - 0.64) / 0.03) * (1 - cl(2 * ss((P - 0.9) / 0.05)));
}

qa.deckung = deckung;

/** Stärke einer Lücke (0..1) an der Stelle (x, y) für ein Rechteck mit Rand. */
function loch(
	x: number,
	y: number,
	r: Pick<Luecke, 'x' | 'y' | 'w' | 'h'>,
	rand: number,
	kante: number,
): number {
	const dx = Math.max(r.x - rand - x, x - (r.x + r.w + rand), 0);
	const dy = Math.max(r.y - rand - y, y - (r.y + r.h + rand), 0);
	const q = Math.min(1, Math.hypot(dx, dy) / kante);
	return 1 - q * q * (3 - 2 * q);
}

/** Welche Lücken gelten, in Bühnen-Pixeln: [{ x, y, w, h, rand, kante, w0 }] mit Gewicht w0 (0..1). */
export function lueckenVon(loecher: readonly Loch[], c: LueckenKontext, cs: number): Luecke[] {
	const aus: Luecke[] = [];
	const hoch = c.mode === 'hoch';
	const tw = c.tw ?? 0;
	for (const l of loecher) {
		if (l.art === 'logo' || l.art === 'cta')
			aus.push({ ...l, rand: 14, kante: hoch ? KANTE : cs, w0: 1 });
		else if (l.art === 'hinweis') {
			if ((c.endA ?? 0) < 0.72) aus.push({ ...l, rand: 6, kante: hoch ? 14 : cs * 0.5, w0: 1 });
		} else if (l.art === 'text' && tw > 0) {
			if (hoch) {
				aus.push({ ...l, rand: RAND_TEXT, kante: 48, w0: Math.min(1, tw * 2) });
				// die Wohnung unter dem Text bleibt frei
				const b = hochOben(l.y + l.h, c.safeH ?? c.H);
				aus.push({ x: 0, y: b.top, w: c.W, h: b.bot - b.top, rand: 0, kante: 140, w0: tw });
			} else aus.push({ ...l, rand: cs * 1.5, kante: cs * 1.5, w0: tw });
		}
	}
	return aus;
}

/**
 * Rechnet das Raster: on[q] = 1 für weiße Zellen. Rein, für draw und QA (qa.flutGitter).
 * t in Sekunden (bei reduzierter Bewegung 0), cover 0..1, cs Zellgröße in CSS-Pixeln.
 */
export function gitter(
	t: number,
	cover: number,
	luecken: readonly Luecke[],
	tr: Float32Array | null,
	cols: number,
	rows: number,
	on: Uint8Array,
	cs: number,
): void {
	for (let b = 0; b < rows; b++) {
		const y = b * cs + cs / 2;
		for (let a = 0; a < cols; a++) {
			const x = a * cs + cs / 2;
			const q = b * cols + a;
			const n = vnz(a * 0.13 + t * 0.03, b * 0.13 - t * 0.02);
			let pk = 0;
			for (const l of luecken) pk = Math.max(pk, l.w0 * loch(x, y, l, l.rand, l.kante));
			const insel = cover > 0.001 && n + cover * STAERKE - 0.45 + (b / rows) * 0.2 - 2 * pk > 0.5;
			on[q] = insel && (!tr || (tr[q] ?? 0) < 0.3) ? 1 : 0;
		}
	}
}

const sstep = (a: number, b: number, x: number): number => {
	const q = cl((x - a) / (b - a));
	return q * q * (3 - 2 * q);
};

/**
 * Zeichnet die Flut in das 2D-Canvas.
 * c: Kontext der Bühne (W, H, dpr, t, dt, m, cover, P, endA, mode, reduced). loecher: freizuhaltende
 * Rechtecke aus dem DOM (Bühnen-CSS-Pixel).
 */
export function draw(cv: HTMLCanvasElement, c: BuehnenKontext, loecher: Loch[] = []): void {
	let st = states.get(cv);
	if (!st) {
		const ctx = cv.getContext('2d');
		if (!ctx) return;
		const neu: FlutZustand = {
			ctx,
			tr: null,
			clean: false,
			mask: null,
			mctx: null,
			img: null,
			mw: 0,
			mh: 0,
		};
		st = neu;
		states.set(cv, neu);
		qa.flutGitter = (
			W: number,
			H: number,
			t: number,
			cover: number,
			P: number,
			lo?: readonly Loch[],
		) => {
			const mode = modeOf(W, H).mode;
			const { cs } = masse(W, H, mode);
			const cols = Math.ceil(W / cs);
			const rows = Math.ceil(H / cs);
			const on = new Uint8Array(cols * rows);
			const endA = ss((P - 0.9) / 0.05);
			const lue = lueckenVon(lo ?? [], { tw: textGewicht(P), endA, W, H, safeH: H, mode }, cs);
			gitter(t, cover, lue, null, cols, rows, on, cs);
			return { cols, rows, cell: cs, on: Array.from(on) };
		};
	}
	const fx = st.ctx;
	const { W, H, dpr, m } = c;
	const hoch = c.mode === 'hoch';
	const { cs, zf } = masse(W, H, c.mode);
	const alt = qa.masse;
	qa.masse = { ...(typeof alt === 'object' ? alt : null), flutZelle: cs, flutZiffer: zf };
	// Bei reduzierter Bewegung keine Flut: die Räume blenden nur ein und aus (kein Schwarz-Weiß-Blitzen)
	let cover = c.reduced ? 0 : c.cover;
	// Hochformat: die zweite Flutphase (Pinnwand & Chat) deckt höchstens 0,35, die Wohnung bleibt lesbar
	if (hoch && c.P > 0.75) cover = Math.min(cover, 0.35);
	const t = c.reduced ? 0 : c.t;
	if (!(cover > 0.001)) {
		if (!st.clean) {
			fx.setTransform(1, 0, 0, 1, 0, 0);
			fx.clearRect(0, 0, cv.width, cv.height);
			st.clean = true;
			st.tr?.fill(0);
		}
		return;
	}
	st.clean = false;
	const mw = Math.ceil(W / SCHRITT);
	const mh = Math.ceil(H / SCHRITT);
	if (!st.mask || st.mw !== mw || st.mh !== mh) {
		st.mask = document.createElement('canvas');
		st.mask.width = mw;
		st.mask.height = mh;
		st.mctx = st.mask.getContext('2d');
		st.img = st.mctx ? st.mctx.createImageData(mw, mh) : null;
		st.mw = mw;
		st.mh = mh;
		st.tr = new Float32Array(mw * mh);
	}
	const { mctx, img, mask } = st;
	const tr = st.tr;
	if (!mctx || !img || !mask || !tr) return;
	// Zeiger-Spur: Abklingen im Tempo des Entwurfs (0,985 je Bild bei 60 Hz), Stempel mit weichem Rand
	const k = 0.985 ** (Math.min(c.dt ?? 0.016, 0.05) * 60);
	for (let q = 0; q < tr.length; q++) tr[q] = (tr[q] ?? 0) * k;
	if (m.in) {
		const R = (hoch ? 5.2 : 2.6) * (hoch ? 8 : cs) * 0.9;
		const a0 = Math.max(0, Math.floor((m.x - R) / SCHRITT));
		const a1 = Math.min(mw - 1, Math.ceil((m.x + R) / SCHRITT));
		const b0 = Math.max(0, Math.floor((m.y - R) / SCHRITT));
		const b1 = Math.min(mh - 1, Math.ceil((m.y + R) / SCHRITT));
		for (let b = b0; b <= b1; b++)
			for (let a = a0; a <= a1; a++) {
				const g = Math.max(
					0,
					1 - Math.hypot((a + 0.5) * SCHRITT - m.x, (b + 0.5) * SCHRITT - m.y) / R,
				);
				const q = b * mw + a;
				tr[q] = Math.max(tr[q] ?? 0, g);
			}
	}
	const luecken = lueckenVon(loecher, { ...c, tw: textGewicht(c.P) }, cs);
	const d = img.data;
	const fn = 1 / cs;
	const st2 = STAERKE * (c.P > 0.8 ? 1.3 : 1); // zweite Welle (Wohnung zur Ende-Ebene) etwas kräftiger: der Raum dahinter ist heller, die Flut braucht mehr Dichte
	for (let b = 0; b < mh; b++) {
		const y = (b + 0.5) * SCHRITT;
		for (let a = 0; a < mw; a++) {
			const x = (a + 0.5) * SCHRITT;
			const q = b * mw + a;
			// Grundrauschen wie im Entwurf, dazu Feinrauschen für eine organische, ausgefranste Kante
			const n =
				vnz(x * fn * 0.2 + t * 0.03, y * fn * 0.2 - t * 0.02) +
				(vnz(x * fn * 0.55 + 7.3, y * fn * 0.55 + 3.1 + t * 0.05) - 0.5) * 0.22;
			let pk = 0;
			for (const l of luecken) pk = Math.max(pk, l.w0 * loch(x, y, l, l.rand, l.kante));
			const dich =
				n + cover * st2 - 0.45 + (y / H) * 0.2 - 2 * pk - 2 * sstep(0.1, 0.5, tr[q] ?? 0);
			const o = q * 4;
			d[o] = d[o + 1] = d[o + 2] = 255;
			d[o + 3] = Math.round(255 * sstep(0.5 - KANTE_W, 0.5 + KANTE_W, dich));
		}
	}
	mctx.putImageData(img, 0, 0);
	fx.setTransform(dpr, 0, 0, dpr, 0, 0);
	fx.clearRect(0, 0, W, H);
	fx.globalCompositeOperation = 'source-over';
	fx.fillStyle = '#0E0E0E';
	fx.fillRect(0, 0, W, H);
	const bild = wolkenBild();
	if (bild) {
		// Wolken langsam nach links ziehend, gedämpft: sie bleiben Hintergrund, nie heller Block
		const bh = Math.max(H, W / WOLKEN_A) * 1.08;
		const bw = bh * WOLKEN_A;
		const dx = -((((t * 6) % bw) + bw) % bw);
		fx.globalAlpha = 0.34;
		for (let x = dx; x < W; x += bw) fx.drawImage(bild, x, (H - bh) / 2, bw, bh);
		fx.globalAlpha = 1;
	} else {
		fx.fillStyle = '#1C1C1C';
		fx.fillRect(0, 0, W, H);
	}
	// Maske ausstanzen: bilinear hochgerechnet, die Kante bleibt weich
	fx.globalCompositeOperation = 'destination-in';
	fx.imageSmoothingEnabled = true;
	fx.imageSmoothingQuality = 'high';
	fx.drawImage(mask, 0, 0, mw, mh, 0, 0, mw * SCHRITT, mh * SCHRITT);
	fx.globalCompositeOperation = 'source-over';
}
