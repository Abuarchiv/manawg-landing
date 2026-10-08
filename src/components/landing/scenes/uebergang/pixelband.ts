// Übergang zwischen Schwarz und Papier als Pixelblöcke (Referenz 9, „Adulthood is hard“): Ein Raster aus
// Zellen, das beim Scrollen von der Kante aus in die andere Fläche frisst. Scrollgeführt, nicht zeitgeführt.
//
// Jede Zelle hat eine feste Schwelle s (Lage im Band plus Rauschen). Die Fläche „nach“ erreicht eine Zelle,
// sobald die Front c(p) unter s fällt, p ist der Scrollweg des Bandes durch das Fenster. Weil das Rauschen
// ungleich verteilt ist, kippen die Zellen gestaffelt, jede mit einem kurzen weichen Übergang (RAMPE).
// Die erste Zeile bleibt immer „von“, die letzte immer „nach“: das Band schließt nahtlos an beide Abschnitte an.
// In den Zellen stehen winzige Mono-Ziffern: Zahl der Nachbarn in der anderen Fläche (wie Minesweeper),
// sie blenden mit dem Kippen der Nachbarn ineinander über.

import { type SceneState, loop, register } from '../../core/loop';
import { cl, hsh, lerp, ss, vnz } from '../../core/math';

export type Flaeche = 'schwarz' | 'papier';

const FARBE: Record<Flaeche, string> = { schwarz: '10,10,10', papier: '242,242,242' };
const rgb = (f: Flaeche, a = 1) => `rgba(${FARBE[f]},${a})`;

/** Zellen je Fensterbreite, nie schmaler als 28 px (wie das frühere Flutband). */
const SPALTEN = 40;
const ZELLE_MIN = 28;
/** Tiefe der Front: Anteil der Bandhöhe, über den die Schwellen streuen. */
const STREU = 0.7;
/** Weicher Übergang je Zelle in Einheiten der Front (bei 1500 px Scrollweg rund 45 px). */
const RAMPE = 0.05;
const RAND = STREU / 2 + RAMPE;

/** Raster eines Bandes. */
interface Raster {
	cols: number;
	rows: number;
	z: number;
	/** Schwelle je Zelle. */
	sw: Float32Array;
	/** Anteil „nach“ je Zelle, 0 bis 1. */
	a: Float32Array;
	/** Schlüssel des letzten Zeichnens (Scrollstand, Größe, Pixelfaktor, Schriftstand). */
	key: string;
	nach: Flaeche;
	von: Flaeche;
	seed: number;
}

interface UebergangState extends SceneState {
	r: Raster;
}

/** Bänder nach Element, damit KopfMaske die Farbe unter dem Kopf abfragen kann. */
const baender = new WeakMap<HTMLElement, Raster>();

/** Fortschritt des Bandes durch das Fenster: 0 wenn die Oberkante unten ins Bild tritt, 1 wenn die Unterkante oben austritt. */
const fortschritt = (rc: DOMRect): number => cl((innerHeight - rc.top) / (innerHeight + rc.height));

/** Front: von (1 + RAND) bei p = 0 bis -RAND bei p = 1. Reduzierte Bewegung: feste Front in der Mitte. */
const front = (rc: DOMRect): number =>
	loop.reduced ? 0.5 : lerp(1 + RAND, -RAND, fortschritt(rc));

/** Anteil „nach“ einer Zelle bei Front c. */
const anteil = (s: number, c: number): number => ss(cl((s - c) / RAMPE + 0.5));

function schwellen(r: Raster) {
	const { cols, rows, seed } = r;
	r.sw = new Float32Array(cols * rows);
	r.a = new Float32Array(cols * rows);
	for (let j = 0; j < rows; j++) {
		const v = (j + 0.5) / rows;
		// Hüllkurve: an Ober- und Unterkante kein Rauschen, die Anschlüsse bleiben glatt
		const env = Math.min(1, Math.sin(Math.PI * v) * 1.7);
		for (let i = 0; i < cols; i++) {
			const n = vnz(i * 0.34 + seed, j * 0.34 + seed * 0.7) * 0.72 + hsh(i + seed, j) * 0.28;
			r.sw[j * cols + i] = v + (n - 0.5) * STREU * env * 1.25;
		}
	}
}

/**
 * Anteil „nach“ in der Zeile auf Fensterhöhe y (0 = ganz „von“, 1 = ganz „nach“), für die Kopf-Maske.
 * null, wenn y nicht im Band liegt oder das Band noch nicht gemessen ist.
 */
export function nachAnteil(el: HTMLElement, y: number): number | null {
	const r = baender.get(el);
	if (!r || r.rows === 0) return null;
	const rc = el.getBoundingClientRect();
	if (y < rc.top || y > rc.bottom) return null;
	const c = front(rc);
	const j = Math.min(r.rows - 1, Math.floor((y - rc.top) / r.z));
	let m = 0;
	for (let i = 0; i < r.cols; i++) m += anteil(r.sw[j * r.cols + i] ?? 0, c);
	return m / r.cols;
}

/** Fläche oben („von“) und unten („nach“) des Bandes. */
export function flaechen(el: HTMLElement): { von: Flaeche; nach: Flaeche } | null {
	const r = baender.get(el);
	return r ? { von: r.von, nach: r.nach } : null;
}

/** Meldet ein Band an (der Canvas füllt das Band). seed streut das Rauschen je Band. Gibt die Abmeldung zurück. */
export function registerUebergang(
	cv: HTMLCanvasElement,
	band: HTMLElement,
	nach: Flaeche,
	seed: number,
): () => void {
	const von: Flaeche = nach === 'papier' ? 'schwarz' : 'papier';
	const aus = register<UebergangState>({
		name: `übergang ${band.id}`,
		el: cv,
		host: band,
		box: (W, H) => ({ bw: Math.max(1, W), bh: Math.max(1, H), max: 1 }),
		dprCap: 2,
		init(s) {
			s.r = {
				cols: 0,
				rows: 0,
				z: 0,
				sw: new Float32Array(0),
				a: new Float32Array(0),
				key: '',
				nach,
				von,
				seed,
			};
			baender.set(band, s.r);
		},
		frame(s) {
			const r = s.r;
			const z = Math.max(s.W / SPALTEN, ZELLE_MIN);
			const rows = Math.ceil(s.H / z);
			if (r.z !== z || r.rows !== rows) {
				r.z = z;
				r.cols = Math.ceil(s.W / z);
				r.rows = rows;
				schwellen(r);
				r.key = '';
			}
			const rc = band.getBoundingClientRect();
			const c = front(rc);
			// nur neu zeichnen, wenn sich die Front um mehr als einen halben Scrollpixel bewegt hat
			const key = `${Math.round(c * (innerHeight + rc.height) * 2)}|${s.W}x${s.H}|${s.dpr}|${loop.fv}`;
			if (key === r.key && !s.stale) return;
			r.key = key;
			s.stale = false;
			zeichne(s, c);
		},
	});
	return () => {
		baender.delete(band);
		aus();
	};
}

function zeichne(s: UebergangState, c: number) {
	const { r, ctx, cv } = s;
	if (!ctx || !cv) return;
	const { cols, rows, z, sw, a } = r;
	const d = s.dpr;
	const ox = (s.W - cols * z) / 2;
	// Zellkanten in ganzen Gerätepixeln, damit zwischen den Zellen keine Fugen aufgehen
	const px = (v: number) => Math.round(v * d);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalAlpha = 1;
	ctx.fillStyle = rgb(r.von);
	ctx.fillRect(0, 0, cv.width, cv.height);
	ctx.fillStyle = rgb(r.nach);
	for (let j = 0; j < rows; j++) {
		const y0 = px(j * z);
		const y1 = px((j + 1) * z);
		for (let i = 0; i < cols; i++) {
			const k = j * cols + i;
			const v = anteil(sw[k] ?? 0, c);
			a[k] = v;
			if (v < 0.004) continue;
			const x0 = px(ox + i * z);
			ctx.globalAlpha = v;
			ctx.fillRect(x0, y0, px(ox + (i + 1) * z) - x0, y1 - y0);
		}
	}
	// Ziffern: Zahl der Nachbarn in der anderen Fläche, als Überblendung zwischen zwei ganzen Zahlen
	ctx.font = `500 ${Math.max(9, z * 0.31) * d}px "JetBrains Mono", monospace`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	for (let j = 0; j < rows; j++)
		for (let i = 0; i < cols; i++) {
			// nur in einem Teil der Zellen, sonst steht entlang der Front Ziffer an Ziffer
			if (hsh(i * 7 + r.seed, j * 13) > 0.72) continue;
			const ak = a[j * cols + i] ?? 0;
			let n = 0;
			for (let dj = -1; dj <= 1; dj++)
				for (let di = -1; di <= 1; di++) {
					const x = i + di;
					const y = j + dj;
					if ((!di && !dj) || x < 0 || y < 0 || x >= cols || y >= rows) continue;
					n += Math.abs((a[y * cols + x] ?? 0) - ak);
				}
			if (n < 0.04) continue;
			n = Math.min(n, 3); // wie in der Referenz stehen nur 1 bis 3
			const lo = Math.floor(n);
			const f = n - lo;
			// Ziffer in der Gegenfläche der Zelle, halb gedämpft
			const farbe = ak < 0.5 ? r.nach : r.von;
			const cx = px(ox + (i + 0.5) * z);
			const cy = px((j + 0.5) * z) + 0.5 * d;
			for (const [zahl, w] of [
				[lo, 1 - f],
				[lo + 1, f],
			] as const) {
				if (zahl < 1 || w < 0.03) continue;
				ctx.fillStyle = rgb(farbe, 0.5 * w * Math.min(1, n * 2));
				ctx.fillText(String(zahl), cx, cy);
			}
		}
	ctx.globalAlpha = 1;
}
