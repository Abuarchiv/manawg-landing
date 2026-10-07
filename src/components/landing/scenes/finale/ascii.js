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
			// Bei reduzierter Bewegung nur neu zeichnen, wenn sich etwas geändert hat
			const sig = `${s.W}x${s.H}|${s.dpr}|${loop.fv}|${s.m.in ? `${s.m.x | 0},${s.m.y | 0}` : 0}|${s.mode}`;
			if (reduced && s.sig === sig && Math.hypot(tg[0] - s.sm.x, tg[1] - s.sm.y) < 0.5) return;
			s.sig = sig;
			const { cv: sheet, zw, zh } = blatt(s);
			ctx.globalAlpha = 1;
			ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			const dpr = s.dpr;
			const cx = BW / 2;
			const rise = Math.min(1, t / 6);
			const sr = BH * 0.62;
			const sy = BH + sr * 0.35 - rise * sr * 0.55;
			const f = s.f;
			const inv = 1 / f;
			const ray0 = t * 0.2;
			const fern = sr + 450;
			const mIn = s.m.in;
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
ctx.globalAlpha = 0.35;
			for (let y = CH / 2, j = 0; y < s.H; y += CH, j++) {
				const by = (y - s.oy) * inv;
				const dy = by - sy;
				const funk = 0.012 * (1 - by / BH);
				const py = Math.round(y * dpr - zh / 2);
				for (let x = CW / 2, i = 0; x < s.W; x += CW, i++) {
					const bx = (x - s.ox) * inv;
					const dx = bx - cx;
					const r = Math.hypot(dx, dy);
					let v = 0;
					if (r < sr) v = 0.35 + 0.6 * (1 - r / sr) + (vnz(bx * 0.02, by * 0.03 - t * 0.5) - 0.5) * 0.3;
					else if (r < fern) {
						const ray = 0.5 + 0.5 * Math.cos(Math.atan2(dy, dx) * 22 + ray0);
						v = ray > 0.82 ? 0.5 * Math.exp(-(r - sr) / 160) : 0;
					}
					if (mIn) {
						const md = Math.hypot(bx - s.sm.x, by - s.sm.y);
						if (md < 120) v *= md / 120;
					}
					if (funk > 0 && hsh(i, j + Math.floor(t * 4 + i * 0.37) * 7) < funk) v = Math.max(v, 0.2);
					v *= dichte;
					if (box && v > 0) {
						const ddx = Math.max(box.x0 - x, x - box.x1, 0);
						const ddy = Math.max(box.y0 - y, y - box.y1, 0);
						const q = cl(Math.hypot(ddx, ddy) / 140);
						v *= 0.25 + 0.75 * q * q * (3 - 2 * q);
					}
					if (v > 0.06) {
						let ci = Math.min(9, 1 + Math.floor(cl(v) * 8.99));
						if (mIn) {
							const mdd = Math.hypot(bx - s.m.x, by - s.m.y);
							if (mdd < 70 && hsh(i + t12, j) < 0.6 * (1 - mdd / 70))
								ci = 1 + Math.floor(hsh(i, j + t12) * 9);
						}
						ctx.drawImage(sheet, zw * ci, 0, zw, zh, Math.round(x * dpr - zw / 2), py, zw, zh);
					}
				}
			}
		},
	});
}
