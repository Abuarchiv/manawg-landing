// Die ASCII-Sonne des Finales: Mono-Zeichen in einem festen Raster (9 x 14 CSS-Pixel) über die ganze
// Fläche, die Sonne geht auf, Strahlen und Funken. Der Zeiger löscht und mischt Zeichen.
// Die Zeichen kommen aus einem vorgerenderten Zeichenblatt (drawImage), nicht aus fillText.
// Szenenraum: Bezugsbox für die Sonne (quer 1280 x 760, hoch 760 x 760), das Raster läuft in CSS-Pixeln.

import { loop, qa, register } from '../../core/loop';
import { cl, hsh, lag, vnz } from '../../core/math';

export const CW = 7;
export const CH = 11;
const RAMP = ' .:-=+*#%@';
qa.masse = { ...(qa.masse ?? {}), finaleZelle: [CW, CH] };

// Zeichenblatt: ein Streifen mit den neun sichtbaren Zeichen, je Pixelfaktor und Schriftstand neu
function blatt(s) {
	const key = `${s.dpr}|${loop.fv}`;
	if (s.blattKey === key) return s.blatt;
	const zw = Math.round(CW * s.dpr);
	const zh = Math.round(CH * s.dpr);
	const cv = document.createElement('canvas');
	cv.width = zw * 10;
	cv.height = zh;
	const g = cv.getContext('2d');
	g.font = `500 ${9 * s.dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#FAFAFA';
	for (let i = 1; i < 10; i++) g.fillText(RAMP[i], zw * i + zw / 2, zh / 2);
	s.blattKey = key;
	s.blatt = { cv, zw, zh };
	return s.blatt;
}

/** Meldet die ASCII-Sonne an. Gibt die Abmeldung zurück. */
export function registerAscii(cv) {
	return register({
		name: 'ascii',
		el: cv,
		host: cv.parentElement,
		box: (_W, _H, _safeH, mode) => (mode === 'hoch' ? { bw: 760, bh: 760 } : { bw: 1280, bh: 760 }),
		dprCap: 2,
		touchCap: 1.5,
		init(s) {
			s.sm = { x: s.bw * 0.6, y: s.bh * 0.4 };
		},
		frame(s, _t, dt) {
			const ctx = s.ctx;
			const reduced = s.reduced;
			// Bei reduzierter Bewegung steht die Sonne: aufgegangen, Rauschen eingefroren
			const t = reduced ? 6 : loop.t;
			const BW = s.bw;
			const BH = s.bh;
			const tg = s.m.in
				? [s.m.x, s.m.y]
				: reduced
					? [BW / 2, BH * 0.3]
					: [BW / 2 + Math.cos(t * 0.3) * BW * 0.2, BH * 0.3 + Math.sin(t * 0.4) * 90];
			const k = lag(0.08, dt);
			s.sm.x += (tg[0] - s.sm.x) * k;
			s.sm.y += (tg[1] - s.sm.y) * k;
			// Zeiger: Löschen und Mischen nur bei Bewegung (Stärke aus der Geschwindigkeit), ruhend in ca. 300 ms weg
			const pv = (s.pv ||= { x: s.m.x, y: s.m.y, a: 0 });
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
			const cx = BW / 2;
			const rise = Math.min(1, t / 6);
			const sr = BH * 0.62;
			const sy = BH + sr * 0.35 - rise * sr * 0.55;
			const f = s.f;
			const inv = 1 / f;
			const ray0 = t * 0.2;
			const fern = sr + 450;
			// Hoch ist die Sonne kleiner als der Titel: dünner, damit die Schrift davor frei bleibt
			const dichte = s.mode === 'hoch' ? 0.62 : 1;
			const t12 = Math.floor(t * 12);
			// Aussparung hinter Schlagzeile und Knöpfen: Zeichen dort höchstens 25 %, nach außen weicher Abfall
			if (loop.n % 20 === 0 || !s.box) {
				const r0 = s.cv.getBoundingClientRect();
				let x0 = 1e9;
				let y0 = 1e9;
				let x1 = -1e9;
				let y1 = -1e9;
				for (const el of s.cv.parentElement.querySelectorAll('h2, a')) {
					const r = el.getBoundingClientRect();
					if (r.width < 1) continue;
					x0 = Math.min(x0, r.left - r0.left);
					y0 = Math.min(y0, r.top - r0.top);
					x1 = Math.max(x1, r.right - r0.left);
					y1 = Math.max(y1, r.bottom - r0.top);
				}
				s.box = x1 > x0 ? { x0, y0, x1, y1 } : null;
			}
			const box = s.box;
			// Raster-Cache: Abstand, Strahlwinkel und Aussparung je Zelle einmal pro Größe und Sonnenstand
			const key = `${s.W}|${s.H}|${f}|${s.ox}|${s.oy}|${sy.toFixed(2)}|${dichte}|${box ? `${box.x0 | 0},${box.y0 | 0},${box.x1 | 0},${box.y1 | 0}` : 0}`;
			let C = s.cache;
			if (!C || C.key !== key) {
				const cols = Math.ceil((s.W - CW / 2) / CW);
				const rows = Math.ceil((s.H - CH / 2) / CH);
				C = {
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
				};
				for (let i = 0; i < cols; i++) C.BX[i] = (CW / 2 + i * CW - s.ox) * inv;
				for (let j = 0; j < rows; j++) {
					const by = (CH / 2 + j * CH - s.oy) * inv;
					C.BY[j] = by;
					C.FK[j] = 0.012 * (1 - by / BH);
				}
				for (let j = 0; j < rows; j++) {
					const y = CH / 2 + j * CH;
					const dy = C.BY[j] - sy;
					for (let i = 0; i < cols; i++) {
						const q = j * cols + i;
						const dx = C.BX[i] - cx;
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
							bq *= 0.25 + 0.75 * g * g * (3 - 2 * g);
						}
						C.BQ[q] = bq;
					}
				}
				s.cache = C;
			}
			const { cols, rows, R, CS, SN, BQ, BX, BY, FK, codes } = C;
			const cr = Math.cos(ray0);
			const sn0 = Math.sin(ray0);
			const smx = s.sm.x;
			const smy = s.sm.y;
			const mx = s.m.x;
			const my = s.m.y;
			// Eine Textzeile je Rasterzeile (Laufweite füllt die Zelle), sonst Zeichenblatt je Zelle
			const zeile = 'letterSpacing' in ctx;
			ctx.globalAlpha = 0.35;
			if (zeile) {
				ctx.font = '500 9px "JetBrains Mono", monospace';
				ctx.letterSpacing = `${CW - 5.4}px`;
				ctx.textAlign = 'left';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#FAFAFA';
			} else ctx.setTransform(1, 0, 0, 1, 0, 0);
			for (let j = 0; j < rows; j++) {
				const by = BY[j];
				const funk = FK[j];
				let leer = true;
				for (let i = 0; i < cols; i++) {
					const q = j * cols + i;
					const r = R[q];
					let v = 0;
					if (r < sr) v = 0.35 + 0.6 * (1 - r / sr) + (vnz(BX[i] * 0.02, by * 0.03 - t * 0.5) - 0.5) * 0.3;
					else if (r < fern) {
						const ray = 0.5 + 0.5 * (CS[q] * cr - SN[q] * sn0);
						v = ray > 0.82 ? 0.5 * Math.exp(-(r - sr) / 160) : 0;
					}
					if (wirk) {
						const md = Math.hypot(BX[i] - smx, by - smy);
						if (md < 120) v *= 1 - wirk + (wirk * md) / 120;
					}
					if (funk > 0 && hsh(i, j + Math.floor(t * 4 + i * 0.37) * 7) < funk) v = Math.max(v, 0.2);
					v *= BQ[q];
					if (v > 0.06) {
						let ci = Math.min(9, 1 + Math.floor(cl(v) * 8.99));
						if (wirk) {
							const mdd = Math.hypot(BX[i] - mx, by - my);
							if (mdd < 70 && hsh(i + t12, j) < 0.6 * wirk * (1 - mdd / 70)) ci = 1 + Math.floor(hsh(i, j + t12) * 9);
						}
						codes[i] = ci;
						leer = false;
					} else codes[i] = 0;
				}
				if (leer) continue;
				if (zeile) {
					let str = '';
					for (let i = 0; i < cols; i++) str += RAMP[codes[i]];
					ctx.fillText(str, CW / 2 - 2.7, CH / 2 + j * CH);
				} else {
					const py = Math.round((CH / 2 + j * CH) * dpr - zh / 2);
					for (let i = 0; i < cols; i++)
						if (codes[i]) ctx.drawImage(sheet, zw * codes[i], 0, zw, zh, Math.round((CW / 2 + i * CW) * dpr - zw / 2), py, zw, zh);
				}
			}
			if (zeile) ctx.letterSpacing = '0px';
		},
	});
}
