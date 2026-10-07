// Die Flut: weiße Zellen mit Minensucher-Ziffern fluten die Bühne und lassen Logo und Knopf frei.
// Das Raster füllt die ganze Fläche. Logo und Knopf (oben links und rechts) sind am jeweiligen Rand
// verankert, der Zeiger wischt eine Spur frei.

import { ss, vnz } from '../../core/math';

const CELL = 32;
const states = new WeakMap();

/** Anteil der Fläche, den die Flut deckt (0..1), in den zwei Flutphasen der Intro. */
export function deckung(P) {
	return Math.max(
		ss((P - 0.5) / 0.07) * (1 - ss((P - 0.66) / 0.12)),
		ss((P - 0.84) / 0.05) * (1 - ss((P - 0.94) / 0.05)),
	);
}

/**
 * Zeichnet die Flut in das 2D-Canvas.
 * c: Kontext der Bühne (W, H, dpr, t, m, cover). loecher: freizuhaltende Rechtecke aus dem DOM
 * (Bühnen-CSS-Pixel), in dieser Fassung noch nicht ausgewertet.
 */
export function draw(cv, c, _loecher) {
	let st = states.get(cv);
	if (!st) {
		st = { ctx: cv.getContext('2d'), tr: null, clean: false };
		states.set(cv, st);
	}
	const fx = st.ctx;
	const { W, H, dpr, t, m, cover } = c;
	fx.setTransform(dpr, 0, 0, dpr, 0, 0);
	if (!(cover > 0.001)) {
		if (!st.clean) {
			fx.clearRect(0, 0, W, H);
			st.clean = true;
		}
		return;
	}
	st.clean = false;
	fx.clearRect(0, 0, W, H);
	const cs = CELL;
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	if (!st.tr || st.tr.length !== cols * rows) st.tr = new Float32Array(cols * rows);
	const tr = st.tr;
	for (let q = 0; q < tr.length; q++) tr[q] *= 0.985;
	if (m.in) {
		const mi = Math.floor(m.x / cs);
		const mj = Math.floor(m.y / cs);
		for (let dj = -2; dj <= 2; dj++)
			for (let di = -2; di <= 2; di++) {
				const a = mi + di;
				const b = mj + dj;
				if (a >= 0 && b >= 0 && a < cols && b < rows) {
					const g = Math.max(0, 1 - Math.hypot(di, dj) / 2.6);
					tr[b * cols + a] = Math.max(tr[b * cols + a], g);
				}
			}
	}
	const on = new Uint8Array(cols * rows);
	for (let b = 0; b < rows; b++)
		for (let a = 0; a < cols; a++) {
			const n = vnz(a * 0.13 + t * 0.03, b * 0.13 - t * 0.02);
			const pk = (b < 3 && a < 9) || (b < 3 && a > cols - 7) ? 0.5 : 0;
			on[b * cols + a] =
				n + cover * 0.55 - 0.45 + (b / rows) * 0.2 - pk > 0.5 && tr[b * cols + a] < 0.3 ? 1 : 0;
		}
	fx.fillStyle = '#FAFAFA';
	for (let q = 0; q < on.length; q++)
		if (on[q]) fx.fillRect((q % cols) * cs, Math.floor(q / cols) * cs, cs, cs);
	fx.font = '500 10px "JetBrains Mono", monospace';
	fx.textAlign = 'center';
	fx.textBaseline = 'middle';
	fx.fillStyle = 'rgba(250,250,250,0.6)';
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
			if (n) fx.fillText(String(n), a * cs + cs / 2, b * cs + cs / 2);
		}
	if (m.in) {
		fx.strokeStyle = '#FAFAFA';
		fx.strokeRect(Math.floor(m.x / cs) * cs + 0.5, Math.floor(m.y / cs) * cs + 0.5, cs - 1, cs - 1);
	}
}

