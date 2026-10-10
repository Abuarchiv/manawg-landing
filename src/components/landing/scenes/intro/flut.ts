// Die Flut: weiße Zellen mit Minensucher-Ziffern fluten die Bühne, wie im Entwurf (final.dc.html, Zeilen 554 bis 562).
//
// Quer: Zelle 32 Entwurfs-Pixel (mit der Bühne skaliert, k = min(W / 1280, H / 800)), Ziffer 10 px, Rauschen in
// Zellkoordinaten (0,13 je Zelle, driftet mit t), Schwelle n + Deckung * 0,55 - 0,45 + Zeile / Zeilen * 0,2 > 0,5.
// Zwei Wellen: P 0,50 bis 0,78 (Organ zur Wohnung) und P 0,84 bis 0,99 (Wohnung zur Ende-Ebene). Der Zeiger wischt
// eine 5 x 5 Zellen große Spur frei (Abklingen 0,985 je Bild bei 60 Hz).
// Seit 2026-10-10: das Rauschen wandert mit dem Scroll (drift = P), jeder Scrollschritt lässt also neue Zellen
// kommen und gehen, und jede Zelle klappt aus ihrer Mitte auf statt zu springen (Alter je Zelle, ~0,2 s).
// Hoch (Handy): Zelle 8 px, Ziffer 7 px, sonst dieselbe Rechnung; dort bleibt die Wohnung unter dem Text frei.
// Freigehalten werden echte DOM-Rechtecke (loecher): Logo, Knopf und Sprunglink immer, die Raumkarte solange
// sie steht (Texte bleiben lesbar, der Entwurf deckt sie weiß zu).

import { type Modus, loop, modeOf, qa } from '../../core/loop';
import { cl, ss, vnz } from '../../core/math';
import type { BuehnenKontext, Loch } from './types';
import { hochOben } from './wohnung';

const RAND_TEXT = 64; // Hochformat: Abstand der Raumtext-Lücke zum Text
const KANTE = 24; // Hochformat: weiche Kante der Lücken
const STAERKE = 0.55; // Beitrag der Deckung zum Schwellwert (Entwurf)
const DRIFT = 40; // Zellen, die das Rauschfeld über P 0..1 nach oben wandert (eine Welle ≈ 12 Zellen)
const AUF = 14; // Tempo des Aufklappens je Zelle (1/s): 63 % nach 70 ms, fertig nach ~0,25 s

/** Zustand der Flut je Canvas. */
interface FlutZustand {
	ctx: CanvasRenderingContext2D;
	/** Zeiger-Spur je Zelle (1 = frisch gewischt). */
	tr: Float32Array | null;
	clean: boolean;
	/** Schrift-Version des Atlas (loop.fv beim letzten Zeichnen). */
	fv: number;
	/** Weiße Zellen (1) des letzten Bildes (Ziel). */
	on: Uint8Array | null;
	/** Alter je Zelle (0..1): zieht dem Ziel nach, die Zelle klappt damit auf und zu. */
	age: Float32Array | null;
	cols: number;
	rows: number;
	cs: number;
	loecher: readonly Loch[];
	atlas: HTMLCanvasElement | null;
	atlasKey: string | null;
	atlasFv: number;
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

/**
 * Anteil der Fläche, den die Flut deckt (0..1): zwei Wellen wie im Entwurf, aber nie als Deckblende.
 * Gemessen 2026-10-09: bei voller Deckung sprang die mittlere Helligkeit 43 → 72 → 24 auf 320 px Scrollweg
 * (ein Blitz). Die Wolken bleiben Inseln (höchstens 0,38 bzw. 0,3) und ziehen länger, der Wechsel der
 * Ebenen darunter läuft als Überblendung (--g, --f, --e in stage.ts) statt hinter einer weißen Wand.
 */
export function deckung(P: number): number {
	// Welle 1 ist der Übergang Organ → Wohnung und ist weg, bevor die erste Raumkarte (P 0,634) steht: die Wohnung
	// ist dann der Inhalt und bleibt frei. Welle 2 ist der Übergang Wohnung → Ende-Ebene.
	return Math.max(
		0.38 * ss((P - 0.47) / 0.09) * (1 - ss((P - 0.57) / 0.04)),
		0.3 * ss((P - 0.88) / 0.04) * (1 - ss((P - 0.94) / 0.04)),
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
		else if (l.art === 'marke') aus.push({ ...l, rand: 0, kante: cs * 2, w0: 1 });
		else if (l.art === 'hinweis') {
			if ((c.endA ?? 0) < 0.72) aus.push({ ...l, rand: 6, kante: hoch ? 14 : cs * 0.5, w0: 1 });
		} else if (l.art === 'text' && tw > 0) {
			if (hoch) {
				aus.push({ ...l, rand: RAND_TEXT, kante: 48, w0: Math.min(1, tw * 2) });
				// die Wohnung unter dem Text bleibt frei
				const b = hochOben(l.y + l.h, c.safeH ?? c.H);
				aus.push({ x: 0, y: b.top, w: c.W, h: b.bot - b.top, rand: 0, kante: 140, w0: tw });
			} else aus.push({ ...l, rand: cs * 2, kante: cs * 2, w0: tw });
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
	drift = 0,
): void {
	// drift = Fortschritt P: das Rauschfeld zieht mit dem Scroll nach oben (DRIFT in Zellen je P), so bringt
	// jeder Scrollschritt neue Blöcke, Stillstand lässt sie nur langsam mit t treiben
	const dy = drift * DRIFT * 0.13;
	const dx = drift * DRIFT * 0.04;
	for (let b = 0; b < rows; b++) {
		const y = b * cs + cs / 2;
		for (let a = 0; a < cols; a++) {
			const x = a * cs + cs / 2;
			const q = b * cols + a;
			const n = vnz(a * 0.13 + t * 0.03 + dx, b * 0.13 - t * 0.02 + dy);
			let pk = 0;
			for (const l of luecken) pk = Math.max(pk, l.w0 * loch(x, y, l, l.rand, l.kante));
			// Hysterese: eine Zelle, die schon weiß ist, bleibt es bis 0,48, eine schwarze wird erst ab 0,52 weiß.
			// Sonst flackern Zellen an der Schwelle mit dem Rauschen und bleiben halb aufgeklappt stehen.
			const wert = n + cover * STAERKE - 0.45 + (b / rows) * 0.2 - 2 * pk;
			const insel = cover > 0.001 && wert > (on[q] ? 0.48 : 0.52);
			on[q] = insel && (!tr || (tr[q] ?? 0) < 0.3) ? 1 : 0;
		}
	}
}

// Restinseln unter MIN_INSEL zusammenhängenden Zellen fallen weg (nur Hochformat): sie sähen am Ende einer Phase
// wie Renderreste aus. Quer bleibt es wie im Entwurf: einzelne Blöcke tauchen auf und verschwinden.
const MIN_INSEL = 8;
let flag = new Uint8Array(0);
let stack = new Int32Array(0);
function entInseln(on: Uint8Array, cols: number, rows: number): void {
	const n = cols * rows;
	if (flag.length !== n) {
		flag = new Uint8Array(n);
		stack = new Int32Array(n);
	} else flag.fill(0);
	for (let q0 = 0; q0 < n; q0++) {
		if (!on[q0] || flag[q0]) continue;
		let sp = 0;
		let cnt = 0;
		stack[sp++] = q0;
		flag[q0] = 1;
		while (sp) {
			const q = stack[--sp] ?? 0;
			cnt++;
			const a = q % cols;
			const b = (q - a) / cols;
			if (a > 0 && on[q - 1] && !flag[q - 1]) {
				flag[q - 1] = 1;
				stack[sp++] = q - 1;
			}
			if (a < cols - 1 && on[q + 1] && !flag[q + 1]) {
				flag[q + 1] = 1;
				stack[sp++] = q + 1;
			}
			if (b > 0 && on[q - cols] && !flag[q - cols]) {
				flag[q - cols] = 1;
				stack[sp++] = q - cols;
			}
			if (b < rows - 1 && on[q + cols] && !flag[q + cols]) {
				flag[q + cols] = 1;
				stack[sp++] = q + cols;
			}
		}
		if (cnt < MIN_INSEL) {
			sp = 0;
			stack[sp++] = q0;
			on[q0] = 0;
			while (sp) {
				const q = stack[--sp] ?? 0;
				const a = q % cols;
				const b = (q - a) / cols;
				if (a > 0 && on[q - 1]) {
					on[q - 1] = 0;
					stack[sp++] = q - 1;
				}
				if (a < cols - 1 && on[q + 1]) {
					on[q + 1] = 0;
					stack[sp++] = q + 1;
				}
				if (b > 0 && on[q - cols]) {
					on[q - cols] = 0;
					stack[sp++] = q - cols;
				}
				if (b < rows - 1 && on[q + cols]) {
					on[q + cols] = 0;
					stack[sp++] = q + cols;
				}
			}
		}
	}
}

let vis = new Uint8Array(0);
/** Zellen mit mindestens halbem Alter zählen als weiß (Nachbarn der Ziffern). */
function sichtbar(age: Float32Array, n: number): Uint8Array {
	if (vis.length !== n) vis = new Uint8Array(n);
	for (let q = 0; q < n; q++) vis[q] = (age[q] ?? 0) >= 0.5 ? 1 : 0;
	return vis;
}

// Atlas der Ziffern 1 bis 8 für drawImage (scharf bei jedem Pixelfaktor)
function atlas(
	st: FlutZustand,
	dpr: number,
	cs: number,
	zf: number,
	alpha: number,
): HTMLCanvasElement {
	const key = `${dpr}|${cs}|${zf}`;
	if (st.atlas && st.atlasKey === key && st.atlasFv === st.fv) return st.atlas;
	const cv = document.createElement('canvas');
	const z = Math.round(cs * dpr);
	cv.width = z * 9;
	cv.height = z;
	const g = cv.getContext('2d');
	if (!g) return cv;
	g.font = `500 ${zf * dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = `rgba(250,250,250,${alpha})`;
	for (let n = 1; n <= 8; n++) g.fillText(String(n), z * n + z / 2, z / 2 + 0.5 * dpr);
	st.atlas = cv;
	st.atlasKey = key;
	st.atlasFv = st.fv;
	return cv;
}

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
			fv: 0,
			on: null,
			age: null,
			cols: 0,
			rows: 0,
			cs: 32,
			loecher: [],
			atlas: null,
			atlasKey: null,
			atlasFv: -1,
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
			const lue = lueckenVon(
				lo ?? neu.loecher,
				{ tw: textGewicht(P), endA, W, H, safeH: H, mode },
				cs,
			);
			gitter(t, cover, lue, null, cols, rows, on, cs, P);
			return { cols, rows, cell: cs, on: Array.from(on) };
		};
		qa.flutZustand = () => ({
			cols: neu.cols,
			rows: neu.rows,
			cell: neu.cs,
			on: neu.on ? Array.from(neu.on) : [],
		});
	}
	const fx = st.ctx;
	const { W, H, dpr, m } = c;
	const hoch = c.mode === 'hoch';
	const { cs, zf } = masse(W, H, c.mode);
	st.cs = cs;
	const alt = qa.masse;
	qa.masse = { ...(typeof alt === 'object' ? alt : null), flutZelle: cs, flutZiffer: zf };
	st.loecher = loecher;
	fx.setTransform(dpr, 0, 0, dpr, 0, 0);
	// Bei reduzierter Bewegung keine Flut: die Räume blenden nur ein und aus (kein Schwarz-Weiß-Blitzen)
	let cover = c.reduced ? 0 : c.cover;
	// Hochformat: die zweite Flutphase (Pinnwand & Chat) deckt höchstens 0,35, die Wohnung bleibt lesbar
	if (hoch && c.P > 0.75) cover = Math.min(cover, 0.35);
	const t = c.reduced ? 0 : c.t;
	if (!(cover > 0.001)) {
		if (!st.clean) {
			fx.clearRect(0, 0, W, H);
			st.clean = true;
			st.on = null;
			st.age = null;
		}
		return;
	}
	st.clean = false;
	fx.clearRect(0, 0, W, H);
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	st.cols = cols;
	st.rows = rows;
	if (!st.tr || st.tr.length !== cols * rows) st.tr = new Float32Array(cols * rows);
	const tr = st.tr;
	// Zeiger-Spur: Abklingen im Tempo des Entwurfs (0,985 je Bild bei 60 Hz)
	const k = 0.985 ** (Math.min(c.dt ?? 0.016, 0.05) * 60);
	for (let q = 0; q < tr.length; q++) tr[q] = (tr[q] ?? 0) * k;
	if (m.in) {
		const mi = Math.floor(m.x / cs);
		const mj = Math.floor(m.y / cs);
		// Quer wie im Entwurf: 5 x 5 Zellen, Radius 2,6 Zellen. Hoch (Zellen 8 px): 11 x 11.
		const R = hoch ? 5 : 2;
		const rr = hoch ? R + 0.2 : 2.6;
		for (let dj = -R; dj <= R; dj++)
			for (let di = -R; di <= R; di++) {
				const a = mi + di;
				const b = mj + dj;
				if (a >= 0 && b >= 0 && a < cols && b < rows) {
					const g = Math.max(0, 1 - Math.hypot(di, dj) / rr);
					tr[b * cols + a] = Math.max(tr[b * cols + a] ?? 0, g);
				}
			}
	}
	if (!st.on || st.on.length !== cols * rows) {
		st.on = new Uint8Array(cols * rows);
		st.age = null;
	}
	const ziel = st.on;
	gitter(
		t,
		cover,
		lueckenVon(loecher, { ...c, tw: textGewicht(c.P) }, cs),
		tr,
		cols,
		rows,
		ziel,
		cs,
		c.P,
	);
	if (hoch && cover < 0.25) entInseln(ziel, cols, rows);
	// Alter je Zelle zieht dem Ziel nach: Zellen klappen aus der Mitte auf und zu statt zu springen.
	// Beim ersten Bild einer Phase (age fehlt) steht alles sofort, sonst blitzt nach Sprüngen eine leere Fläche.
	let age = st.age;
	if (!age) {
		age = st.age = new Float32Array(cols * rows);
		for (let q = 0; q < age.length; q++) age[q] = ziel[q] ?? 0;
	} else {
		const ka = c.reduced ? 1 : 1 - Math.exp(-AUF * Math.min(c.dt ?? 0.016, 0.05));
		for (let q = 0; q < age.length; q++) {
			const v = (age[q] ?? 0) + ((ziel[q] ?? 0) - (age[q] ?? 0)) * ka;
			age[q] = v < 0.01 ? 0 : v > 0.99 ? 1 : v;
		}
	}
	// Sichtbar (für Ziffern und Nachbarn): ab halbem Alter
	const on = sichtbar(age, cols * rows);
	// Zellkanten auf Gerätepixel runden: scharfe Blöcke ohne Fugen bei gebrochener Zellgröße
	const px = (v: number) => Math.round(v * dpr) / dpr;
	fx.fillStyle = '#FAFAFA';
	fx.beginPath();
	for (let b = 0; b < rows; b++) {
		let a = 0;
		while (a < cols) {
			if ((age[b * cols + a] ?? 0) < 1) {
				a++;
				continue;
			}
			const a0 = a;
			while (a < cols && (age[b * cols + a] ?? 0) >= 1) a++;
			const x0 = px(a0 * cs);
			const y0 = px(b * cs);
			fx.rect(x0, y0, px(a * cs) - x0, px((b + 1) * cs) - y0);
		}
	}
	// Zellen im Aufklappen: Quadrat aus der Mitte, Kante = cs * ease(age)
	for (let b = 0; b < rows; b++)
		for (let a = 0; a < cols; a++) {
			const v = age[b * cols + a] ?? 0;
			if (v <= 0 || v >= 1) continue;
			const e = 1 - (1 - v) * (1 - v);
			const k = cs * e;
			fx.rect(a * cs + (cs - k) / 2, b * cs + (cs - k) / 2, k, k);
		}
	fx.fill();
	// Ziffern aus dem Atlas, ohne Skalierung
	fx.setTransform(1, 0, 0, 1, 0, 0);
	st.fv = loop.fv;
	const at = atlas(st, dpr, cs, zf, hoch ? 0.66 : 0.6);
	const z = Math.round(cs * dpr);
	for (let b = 0; b < rows; b++)
		for (let a = 0; a < cols; a++) {
			if (on[b * cols + a]) continue;
			let n = 0;
			for (let dj = -1; dj <= 1; dj++)
				for (let di = -1; di <= 1; di++) {
					const x = a + di;
					const y = b + dj;
					if ((di || dj) && x >= 0 && y >= 0 && x < cols && y < rows && on[y * cols + x]) n++;
				}
			if (n) {
				// Zelle in Gerätepixeln: Mitte der gerundeten Zellkanten
				const gx = Math.round(a * cs * dpr);
				const gy = Math.round(b * cs * dpr);
				fx.drawImage(at, z * n, 0, z, z, gx, gy, z, z);
			}
		}
	fx.setTransform(dpr, 0, 0, dpr, 0, 0);
	if (m.in) {
		fx.strokeStyle = '#FAFAFA';
		fx.lineWidth = 1;
		fx.strokeRect(Math.floor(m.x / cs) * cs + 0.5, Math.floor(m.y / cs) * cs + 0.5, cs - 1, cs - 1);
	}
}
