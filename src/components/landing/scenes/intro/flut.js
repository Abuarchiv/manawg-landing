// Die Flut: weiße Zellen mit Minensucher-Ziffern fluten die Bühne.
//
// Zelle 16 CSS-Pixel fest, Ziffer 10,5 px, das Rauschen läuft im Pixelraum (die Form bleibt bei jeder
// Zellgröße gleich). Freigehalten werden echte DOM-Rechtecke (loecher): Logo und Knopf immer, der
// Sprunglink solange er sichtbar ist, die Spalte der Raumkarten solange eine Karte stehen kann.
// Der Zeiger wischt eine Spur frei.

import { loop, qa } from '../../core/loop';
import { ss, vnz } from '../../core/math';

export const CELL = 16;
const RAND_TEXT = 64; // Abstand der Raumtext-Lücke zum Text
const KANTE = 24; // weiche Kante der Lücken (1,5 Zellen)
const SKALA = 0.13 / 32; // Rauschfrequenz je Pixel (Entwurf: 0,13 je Zelle bei Zelle 32), gilt bei 900 px kurzer Seite
const STAERKE = 0.26; // Beitrag der Deckung zum Schwellwert: Spitze deckt etwa 40 % der Fläche
const states = new WeakMap();

/** Anteil der Fläche, den die Flut deckt (0..1), in den zwei Flutphasen der Intro. */
export function deckung(P) {
	// Phase 1 deckt den Wechsel vom Organ zur Wohnung und ist bei P 0,63 weg, bevor die erste Raumkarte
	// (ab P 0,65) steht. Phase 2 ist kurz und schwach und endet bei P 0,895, bevor die Ende-Ebene einblendet (kein grauer
	// Schleier aus Flut und Handy): Pinnwand & Chat und das Handy bleiben lesbar.
	return Math.max(
		ss((P - 0.48) / 0.06) * (1 - ss((P - 0.56) / 0.07)),
		0.65 * ss((P - 0.83) / 0.03) * (1 - ss((P - 0.865) / 0.03)),
	);
}

qa.deckung = deckung;
qa.masse = { ...(qa.masse ?? {}), flutZelle: CELL, flutZiffer: 10.5 };

/** Stärke einer Lücke (0..1) an der Stelle (x, y) für ein Rechteck mit Rand. */
function loch(x, y, r, rand) {
	const dx = Math.max(r.x - rand - x, x - (r.x + r.w + rand), 0);
	const dy = Math.max(r.y - rand - y, y - (r.y + r.h + rand), 0);
	const k = r.kante ?? KANTE;
	const q = Math.min(1, Math.hypot(dx, dy) / k);
	return 1 - q * q * (3 - 2 * q);
}

/** Welche Lücken gelten, in Bühnen-Pixeln: [{ x, y, w, h, rand, w0 }] mit Gewicht w0 (0..1). */
export function lueckenVon(loecher, c) {
	const aus = [];
	const textGewicht = (c.fpA ?? 0) * (1 - (c.endA ?? 0));
	for (const l of loecher) {
		if (l.art === 'logo' || l.art === 'cta') aus.push({ ...l, rand: 14, w0: 1 });
		else if (l.art === 'hinweis') {
			if ((c.endA ?? 0) < 0.72) aus.push({ ...l, rand: 6, kante: 14, w0: 1 });
		} else if (l.art === 'text' && textGewicht > 0)
			aus.push({ ...l, rand: RAND_TEXT, kante: 48, w0: Math.min(1, textGewicht * 2) });
	}
	// Wohnungsmodell (Querformat): die Mitte der Bühne bleibt frei, solange die Wohnung steht
	if (textGewicht > 0 && c.fit && c.W > c.H) {
		const { f, ox, oy } = c.fit;
		aus.push({ x: ox + 460 * f, y: oy + 150 * f, w: 700 * f, h: 500 * f, rand: 0, kante: 120, w0: textGewicht });
	}
	return aus;
}

/**
 * Rechnet das Raster: on[q] = 1 für weiße Zellen. Rein, für draw und QA (qa.flutGitter).
 * W, H in CSS-Pixeln, t in Sekunden (bei reduzierter Bewegung 0), cover 0..1.
 */
export function gitter(W, H, t, cover, luecken, tr, cols, rows, on) {
	// Strukturgröße an die kurze Seite koppeln: auf kleinen Bildschirmen entstehen Blobs statt einer Fläche
	const sk = SKALA * Math.min(3, Math.max(0.6, 900 / Math.min(W, H)));
	for (let b = 0; b < rows; b++) {
		const y = b * CELL + CELL / 2;
		for (let a = 0; a < cols; a++) {
			const x = a * CELL + CELL / 2;
			const q = b * cols + a;
			const n = vnz(x * sk + t * 0.03, y * sk - t * 0.02);
			let pk = 0;
			for (const l of luecken) pk = Math.max(pk, l.w0 * loch(x, y, l, l.rand));
			on[q] = n + cover * STAERKE - 0.45 + (y / H) * 0.2 - 2 * pk > 0.5 && (!tr || tr[q] < 0.3) ? 1 : 0;
		}
	}
}

// Atlas der Ziffern 1 bis 8 für drawImage (scharf bei jedem Pixelfaktor)
function atlas(st, dpr) {
	const key = `${dpr}|${CELL}`;
	if (st.atlasKey === key && st.atlasFv === st.fv) return st.atlas;
	const cv = document.createElement('canvas');
	const z = Math.round(CELL * dpr);
	cv.width = z * 9;
	cv.height = z;
	const g = cv.getContext('2d');
	g.font = `500 ${10.5 * dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = 'rgba(250,250,250,0.66)';
	for (let n = 1; n <= 8; n++) g.fillText(String(n), z * n + z / 2, z / 2 + 0.5 * dpr);
	st.atlas = cv;
	st.atlasKey = key;
	st.atlasFv = st.fv;
	return cv;
}

/**
 * Zeichnet die Flut in das 2D-Canvas.
 * c: Kontext der Bühne (W, H, dpr, t, dt, m, cover, fpA, endA, reduced). loecher: freizuhaltende
 * Rechtecke aus dem DOM (Bühnen-CSS-Pixel).
 */
export function draw(cv, c, loecher = []) {
	let st = states.get(cv);
	if (!st) {
		st = { ctx: cv.getContext('2d'), tr: null, clean: false, fv: 0, on: null, cols: 0, rows: 0 };
		states.set(cv, st);
		qa.flutGitter = (W, H, t, cover, fpA, endA, lo) => {
			const cols = Math.ceil(W / CELL);
			const rows = Math.ceil(H / CELL);
			const on = new Uint8Array(cols * rows);
			gitter(W, H, t, cover, lueckenVon(lo ?? st.loecher ?? [], { fpA, endA }), null, cols, rows, on);
			return { cols, rows, cell: CELL, on: Array.from(on) };
		};
		qa.flutZustand = () => ({ cols: st.cols, rows: st.rows, cell: CELL, on: st.on ? Array.from(st.on) : [] });
	}
	const fx = st.ctx;
	const { W, H, dpr, m } = c;
	st.loecher = loecher;
	fx.setTransform(dpr, 0, 0, dpr, 0, 0);
	// Bei reduzierter Bewegung: Deckung höchstens 0,6, das Rauschen läuft nicht mit der Zeit
	const cover = c.reduced ? Math.min(c.cover, 0.4) : c.cover;
	const t = c.reduced ? 0 : c.t;
	if (!(cover > 0.001)) {
		if (!st.clean) {
			fx.clearRect(0, 0, W, H);
			st.clean = true;
			st.on = null;
		}
		return;
	}
	st.clean = false;
	fx.clearRect(0, 0, W, H);
	const cs = CELL;
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	st.cols = cols;
	st.rows = rows;
	if (!st.tr || st.tr.length !== cols * rows) st.tr = new Float32Array(cols * rows);
	const tr = st.tr;
	// Zeiger-Spur: Abklingen im Tempo des Entwurfs (0,985 je Bild bei 120 Hz)
	const k = 0.985 ** (Math.min(c.dt ?? 0.016, 0.05) * 120);
	for (let q = 0; q < tr.length; q++) tr[q] *= k;
	if (m.in) {
		const mi = Math.floor(m.x / cs);
		const mj = Math.floor(m.y / cs);
		const R = 5; // Radius der Spur in Zellen (83 px wie im Entwurf)
		for (let dj = -R; dj <= R; dj++)
			for (let di = -R; di <= R; di++) {
				const a = mi + di;
				const b = mj + dj;
				if (a >= 0 && b >= 0 && a < cols && b < rows) {
					const g = Math.max(0, 1 - Math.hypot(di, dj) / (R + 0.2));
					tr[b * cols + a] = Math.max(tr[b * cols + a], g);
				}
			}
	}
	if (!st.on || st.on.length !== cols * rows) st.on = new Uint8Array(cols * rows);
	const on = st.on;
	gitter(W, H, t, cover, lueckenVon(loecher, c), tr, cols, rows, on);
	fx.fillStyle = '#FAFAFA';
	fx.beginPath();
	for (let b = 0; b < rows; b++) {
		let a = 0;
		while (a < cols) {
			if (!on[b * cols + a]) {
				a++;
				continue;
			}
			const a0 = a;
			while (a < cols && on[b * cols + a]) a++;
			fx.rect(a0 * cs, b * cs, (a - a0) * cs, cs);
		}
	}
	fx.fill();
	// Ziffern aus dem Atlas, ohne Skalierung
	fx.setTransform(1, 0, 0, 1, 0, 0);
	st.fv = loop.fv;
	const at = atlas(st, dpr);
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
			if (n) fx.drawImage(at, z * n, 0, z, z, Math.round(a * cs * dpr), Math.round(b * cs * dpr), z, z);
		}
	fx.setTransform(dpr, 0, 0, dpr, 0, 0);
	if (m.in) {
		fx.strokeStyle = '#FAFAFA';
		fx.lineWidth = 1;
		fx.strokeRect(Math.floor(m.x / cs) * cs + 0.5, Math.floor(m.y / cs) * cs + 0.5, cs - 1, cs - 1);
	}
}
