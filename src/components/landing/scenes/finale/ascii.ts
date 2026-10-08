// Die ASCII-Sonne des Finales: Mono-Zeichen in einem festen Raster (9 x 14 CSS-Pixel) über die ganze
// Fläche, die Sonne geht auf, Strahlen und Funken. Der Zeiger löscht und mischt Zeichen.
// Die Zeichen kommen aus einem vorgerenderten Zeichenblatt (drawImage), nicht aus fillText.
// Szenenraum: Bezugsbox für die Sonne (quer 1280 x 760, hoch 760 x 760), das Raster läuft in CSS-Pixeln.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { cl, hsh, lag, vnz } from '../../core/math';

export const CW = 7;
export const CH = 11;
const RAMP = ' .:-=+*#%@';
const ALPHA0 = [0.25, 0.4, 0.55, 0.65] as const; // Strahlen, Fläche, Kern, Kontur und Zeigerspur
// Bei 1x-Schirmen (externe 1080p-Monitore) zeichnen die dünnen Glyphen weniger Pixel: 18 % mehr Deckkraft
const alphaFuer = (dpr: number): readonly number[] =>
	dpr < 1.5 ? ALPHA0.map((a) => a * 1.18) : ALPHA0;
qa.masse = { ...(qa.masse as Record<string, unknown> | undefined), finaleZelle: [CW, CH] };

/** Zeichenblatt: ein Streifen aus zehn Zellen (Zelle 0 leer), zw x zh Gerätepixel je Zeichen. */
interface Blatt {
	cv: HTMLCanvasElement;
	zw: number;
	zh: number;
}

/** Aussparung hinter Schlagzeile und Knöpfen, in Szenenpixeln der Fläche. */
interface Aussparung {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/** Raster-Cache: je Zelle Abstand, Strahlwinkel (cos, sin) und Aussparung, je Spalte und Zeile die Bezugskoordinaten. */
interface Raster {
	key: string;
	cols: number;
	rows: number;
	R: Float32Array;
	CS: Float32Array;
	SN: Float32Array;
	BQ: Float32Array;
	BX: Float32Array;
	BY: Float32Array;
	FK: Float32Array;
	/** Zeichen der aktuellen Zeile: Index in RAMP, 0 = leer. */
	codes: Uint16Array;
	/** Klasse der Zeichen der aktuellen Zeile (Deckkraftstufe 0..3). */
	cls: Uint8Array;
	/** Spur des Zeigers je Zelle. */
	TR: Float32Array;
}

interface AsciiState extends SceneState {
	/** Geglättetes Ziel der Sonne. */
	sm: { x: number; y: number };
	/** Letzte Zeigerlage und Stärke der Bewegung; wird beim ersten Bild angelegt. */
	pv?: { x: number; y: number; a: number };
	takt: number;
	grund: string;
	sig: string;
	blattKey: string;
	blatt: Blatt | null;
	/** Aussparung; undefined = noch nie gemessen, null = keine Schlagzeile und Knöpfe gefunden. */
	box: Aussparung | null | undefined;
	cache: Raster | null;
}

// Zeichenblatt: ein Streifen mit den neun sichtbaren Zeichen, je Pixelfaktor und Schriftstand neu
function blatt(s: AsciiState): Blatt {
	const key = `${s.dpr}|${loop.fv}`;
	if (s.blatt && s.blattKey === key) return s.blatt;
	const zw = Math.round(CW * s.dpr);
	const zh = Math.round(CH * s.dpr);
	const cv = document.createElement('canvas');
	cv.width = zw * 10;
	cv.height = zh;
	const g = cv.getContext('2d');
	if (!g) return { cv, zw, zh };
	g.font = `500 ${9 * s.dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#FAFAFA';
	for (let i = 1; i < 10; i++) g.fillText(RAMP[i] ?? '', zw * i + zw / 2, zh / 2);
	s.blattKey = key;
	s.blatt = { cv, zw, zh };
	return s.blatt;
}

/** Aussparung hinter Schlagzeile und Knöpfen: Hülle aller sichtbaren h2 und a der Fläche, relativ zum Canvas. */
function messeAussparung(cv: HTMLCanvasElement): Aussparung | null {
	const r0 = cv.getBoundingClientRect();
	let x0 = 1e9;
	let y0 = 1e9;
	let x1 = -1e9;
	let y1 = -1e9;
	for (const el of cv.parentElement?.querySelectorAll('h2, a') ?? []) {
		const r = el.getBoundingClientRect();
		if (r.width < 1) continue;
		x0 = Math.min(x0, r.left - r0.left);
		y0 = Math.min(y0, r.top - r0.top);
		x1 = Math.max(x1, r.right - r0.left);
		y1 = Math.max(y1, r.bottom - r0.top);
	}
	return x1 > x0 ? { x0, y0, x1, y1 } : null;
}

/** Raster-Cache für eine Größe und einen Sonnenstand: Abstand und Strahlwinkel je Zelle, Aussparung (BQ). */
function baueRaster(
	s: AsciiState,
	key: string,
	sy: number,
	dichte: number,
	boden: number,
	box: Aussparung | null,
): Raster {
	const cx = s.bw / 2;
	const BH = s.bh;
	const inv = 1 / s.f;
	const cols = Math.ceil((s.W - CW / 2) / CW);
	const rows = Math.ceil((s.H - CH / 2) / CH);
	const C: Raster = {
		key,
		cols,
		rows,
		R: new Float32Array(cols * rows),
		CS: new Float32Array(cols * rows),
		SN: new Float32Array(cols * rows),
		BQ: new Float32Array(cols * rows),
		BX: new Float32Array(cols),
		BY: new Float32Array(rows),
		FK: new Float32Array(rows),
		codes: new Uint16Array(cols),
		cls: new Uint8Array(cols),
		TR: new Float32Array(cols * rows),
	};
	for (let i = 0; i < cols; i++) C.BX[i] = (CW / 2 + i * CW - s.ox) * inv;
	for (let j = 0; j < rows; j++) {
		const by = (CH / 2 + j * CH - s.oy) * inv;
		C.BY[j] = by;
		C.FK[j] = 0.012 * (1 - by / BH);
	}
	for (let j = 0; j < rows; j++) {
		const y = CH / 2 + j * CH;
		const dy = (C.BY[j] ?? 0) - sy;
		for (let i = 0; i < cols; i++) {
			const q = j * cols + i;
			const dx = (C.BX[i] ?? 0) - cx;
			const a = Math.atan2(dy, dx) * 22;
			C.R[q] = Math.hypot(dx, dy);
			C.CS[q] = Math.cos(a);
			C.SN[q] = Math.sin(a);
			let bq = dichte;
			if (box) {
				const x = CW / 2 + i * CW;
				const ddx = Math.max(box.x0 - x, x - box.x1, 0);
				const ddy = Math.max(box.y0 - y, y - box.y1, 0);
				const g = cl(Math.hypot(ddx, ddy) / 140);
				bq *= boden + (1 - boden) * g * g * (3 - 2 * g);
			}
			C.BQ[q] = bq;
		}
	}
	return C;
}

/** Meldet die ASCII-Sonne an. Gibt die Abmeldung zurück. */
export function registerAscii(cv: HTMLCanvasElement): () => void {
	return register<AsciiState>({
		name: 'ascii',
		el: cv,
		host: cv.parentElement ?? undefined,
		// Hoch sitzt der Horizont (Unterkante der Bezugsbox) auf der Unterkante der Fläche: der Sonnenbogen steht
		// hinter dem Titel, die Unterkante des Kreises bleibt wie quer außerhalb des Bildes
		box: (_W, _H, _safeH, mode) =>
			mode === 'hoch' ? { bw: 760, bh: 760, align: 'bottom' } : { bw: 1280, bh: 760 },
		dprCap: 2,
		touchCap: 1.5,
		init(s) {
			s.sm = { x: s.bw * 0.6, y: s.bh * 0.4 };
			s.takt = -1;
			s.grund = '';
			s.sig = '';
			s.blattKey = '';
			s.blatt = null;
			s.box = null;
			s.cache = null;
		},
		frame(s, _t, dt) {
			const { ctx, cv: flaeche } = s;
			if (!ctx || !flaeche) return;
			const reduced = s.reduced;
			// Bei reduzierter Bewegung steht die Sonne: aufgegangen, Rauschen eingefroren
			const t = reduced ? 6 : loop.t;
			const BW = s.bw;
			const BH = s.bh;
			const tg: [number, number] = s.m.in
				? [s.m.x, s.m.y]
				: reduced
					? [BW / 2, BH * 0.3]
					: [BW / 2 + Math.cos(t * 0.3) * BW * 0.2, BH * 0.3 + Math.sin(t * 0.4) * 90];
			const k = lag(0.08, dt);
			s.sm.x += (tg[0] - s.sm.x) * k;
			s.sm.y += (tg[1] - s.sm.y) * k;
			// Zeiger: Löschen und Mischen nur bei Bewegung (Stärke aus der Geschwindigkeit), ruhend in ca. 300 ms weg
			s.pv ||= { x: s.m.x, y: s.m.y, a: 0 };
			const pv = s.pv;
			if (s.m.in) {
				const v = (Math.hypot(s.m.x - pv.x, s.m.y - pv.y) * s.f) / Math.max(dt, 0.001);
				pv.a = Math.max(pv.a * Math.exp(-dt * 10), cl(v / 600));
			} else pv.a = 0;
			pv.x = s.m.x;
			pv.y = s.m.y;
			const wirk = s.m.in && pv.a > 0.01 ? pv.a : 0;
			// Neu gezeichnet wird mit 30 Hz (mit bewegtem Zeiger 60 Hz), sonst bleibt das Bild stehen
			const takt = Math.floor(t * (wirk ? 60 : 30));
			const grund = `${s.W}x${s.H}|${s.dpr}|${loop.fv}|${s.mode}`;
			if (!reduced && s.takt === takt && s.grund === grund) return;
			// Bei reduzierter Bewegung nur neu zeichnen, wenn sich etwas geändert hat
			const sig = `${grund}|${s.m.in ? `${s.m.x | 0},${s.m.y | 0}` : 0}`;
			if (reduced && s.sig === sig && Math.hypot(tg[0] - s.sm.x, tg[1] - s.sm.y) < 0.5) return;
			s.sig = sig;
			s.takt = takt;
			s.grund = grund;
			const { cv: sheet, zw, zh } = blatt(s);
			ctx.globalAlpha = 1;
			ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			const dpr = s.dpr;
			const ALPHA = alphaFuer(dpr);
			const rise = Math.min(1, t / 6);
			const sr = BH * 0.62;
			const sy = BH + sr * 0.35 - rise * sr * 0.55;
			const f = s.f;
			const inv = 1 / f;
			const ray0 = t * 0.2;
			const fern = sr + 450;
			// Hoch liegt die Sonne ganz hinter Titel und Knöpfen: Zeichen kräftiger, Aussparung weniger tief und Strahlen
			// länger, sonst bleibt vom Bild auf dem Handy nur ein blasses Raster
			const hoch = s.mode === 'hoch';
			const dichte = hoch ? 0.9 : 1;
			const boden = hoch ? 0.45 : 0.25;
			const strahl = hoch ? 260 : 160;
			const t12 = Math.floor(t * 12);
			// Aussparung hinter Schlagzeile und Knöpfen: Zeichen dort höchstens „boden“ (quer 25 %), nach außen weicher Abfall
			if (loop.n % 20 === 0 || !s.box) s.box = messeAussparung(flaeche);
			const box = s.box;
			// Raster-Cache: Abstand, Strahlwinkel und Aussparung je Zelle einmal pro Größe und Sonnenstand
			const key = `${s.W}|${s.H}|${f}|${s.ox}|${s.oy}|${sy.toFixed(2)}|${dichte}|${boden}|${box ? `${box.x0 | 0},${box.y0 | 0},${box.x1 | 0},${box.y1 | 0}` : 0}`;
			let C = s.cache;
			if (!C || C.key !== key) s.cache = C = baueRaster(s, key, sy, dichte, boden, box);
			const { cols, rows, R, CS, SN, BQ, BX, BY, FK, codes, cls, TR } = C;
			const band = 1.7 * CW * inv; // Kontur der Sonne: eine dichte Reihe aus @ und #
			const abfall = Math.exp(-dt / 0.2); // Spur des Zeigers: ca. 600 ms
			const cr = Math.cos(ray0);
			const sn0 = Math.sin(ray0);
			const smx = s.sm.x;
			const smy = s.sm.y;
			const mx = s.m.x;
			const my = s.m.y;
			// Eine Textzeile je Rasterzeile (Laufweite füllt die Zelle), sonst Zeichenblatt je Zelle
			const zeile = Reflect.has(ctx, 'letterSpacing'); // kein in: TS hielte den Zweig ohne letterSpacing für unmöglich
			if (zeile) {
				ctx.font = '500 9px "JetBrains Mono", monospace';
				ctx.letterSpacing = `${CW - 5.4}px`;
				ctx.textAlign = 'left';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#FAFAFA';
			} else ctx.setTransform(1, 0, 0, 1, 0, 0);
			for (let j = 0; j < rows; j++) {
				const by = BY[j] ?? 0;
				const funk = FK[j] ?? 0;
				let leer = true;
				for (let i = 0; i < cols; i++) {
					const q = j * cols + i;
					const bx = BX[i] ?? 0;
					const r = R[q] ?? 0;
					let v = 0;
					let k = 1;
					if (r < sr) {
						v = 0.35 + 0.6 * (1 - r / sr) + (vnz(bx * 0.02, by * 0.03 - t * 0.5) - 0.5) * 0.3;
						if (r < sr * 0.72) k = 2; // Kern kräftiger
					} else if (r < fern) {
						const ray = 0.5 + 0.5 * ((CS[q] ?? 0) * cr - (SN[q] ?? 0) * sn0);
						v = ray > 0.82 ? 0.5 * Math.exp(-(r - sr) / strahl) : 0;
						k = 0; // Strahlen leise
					}
					const kontur = Math.abs(r - sr + band * 0.2) < band * 0.5;
					if (kontur) {
						v = Math.max(v, 0.95);
						k = 3;
					}
					const tr = (TR[q] ?? 0) * abfall;
					TR[q] = tr < 0.02 ? 0 : tr;
					if (wirk) {
						const md = Math.hypot(bx - smx, by - smy);
						if (md < 120) v *= 1 - wirk + (wirk * md) / 120;
						const mdd0 = Math.hypot(bx - mx, by - my);
						if (mdd0 < 70) TR[q] = Math.max(TR[q] ?? 0, wirk * (1 - mdd0 / 70));
					}
					if (funk > 0 && hsh(i, j + Math.floor(t * 4 + i * 0.37) * 7) < funk) v = Math.max(v, 0.2);
					const bq = BQ[q] ?? 0;
					v *= bq;
					const spur = TR[q] ?? 0;
					if (v > 0.06 || spur > 0.15) {
						let ci = Math.min(9, 1 + Math.floor(cl(v) * 8.99));
						if (kontur && bq > 0.6) ci = (i + j) & 1 ? 9 : 8;
						if (spur > 0.15 && hsh(i + t12, j) < 0.9 * spur) {
							ci = 1 + Math.floor(hsh(i, j + t12) * 9);
							k = 3;
						}
						codes[i] = ci;
						cls[i] = k;
						leer = false;
					} else codes[i] = 0;
				}
				if (leer) continue;
				if (zeile) {
					for (let k = 0; k < 4; k++) {
						let str = '';
						let n = 0;
						for (let i = 0; i < cols; i++) {
							const c = codes[i] ?? 0;
							const an = c && cls[i] === k;
							str += an ? (RAMP[c] ?? ' ') : ' ';
							if (an) n++;
						}
						if (!n) continue;
						ctx.globalAlpha = ALPHA[k] ?? 1;
						ctx.fillText(str, CW / 2 - 2.7, CH / 2 + j * CH);
					}
				} else {
					const py = Math.round((CH / 2 + j * CH) * dpr - zh / 2);
					for (let i = 0; i < cols; i++) {
						const c = codes[i] ?? 0;
						if (c) {
							ctx.globalAlpha = ALPHA[cls[i] ?? 0] ?? 1;
							ctx.drawImage(
								sheet,
								zw * c,
								0,
								zw,
								zh,
								Math.round((CW / 2 + i * CW) * dpr - zw / 2),
								py,
								zw,
								zh,
							);
						}
					}
				}
			}
			ctx.globalAlpha = 1;
			if (zeile) ctx.letterSpacing = '0px';
		},
	});
}
