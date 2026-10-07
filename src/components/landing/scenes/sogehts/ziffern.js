// Die Ziffern 01 bis 03 von "So geht's": Schrift als Punktraster aus Mono-Zeichen (Zelle 4 px, Glyph 7 px).
// Die Ziffer folgt der Breite der Spalte, die Zellen liegen in festen CSS-Pixeln. Der Zeiger stößt die
// Zellen weg, Federn holen sie zurück. Die Zeichen sind eine feste 3-Ton-Rampe nach der Lage der Zelle
// in der Ziffer (innen @, dann #, am Rand +), ohne Zufallsflackern.

import { loop, qa, register } from '../../core/loop';
import { hsh } from '../../core/math';

const RAMPE = '@#+';
qa.masse = { ...(qa.masse ?? {}), zifferZelle: 4, zifferGlyph: 7 };

function baue(s, txt, cs) {
	const W = Math.max(1, Math.round(s.W));
	const H = Math.max(1, Math.round(s.H));
	const fs = H * 1.28; // Ziffernhöhe (0,73 em) füllt rund 94 % der Fläche
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	const oc = document.createElement('canvas');
	oc.width = cols;
	oc.height = rows;
	const o = oc.getContext('2d');
	o.fillStyle = '#000';
	// Die Form kommt aus Inter Tight (ohne den Punkt in der Null der Mono-Schrift), gefüllt wird mit Mono-Zeichen
	o.font = `600 ${fs / cs}px "Inter Tight", sans-serif`;
	o.textBaseline = 'alphabetic';
	txt.split('|').forEach((ln, i) => o.fillText(ln, 0, (H * 0.97 + i * fs * 0.9) / cs));
	const d = o.getImageData(0, 0, cols, rows).data;
	const on = new Uint8Array(cols * rows);
	for (let q = 0; q < on.length; q++) on[q] = d[q * 4 + 3] > 110 ? 1 : 0;
	const old = s.cells || [];
	s.cells = [];
	let k = 0;
	for (let q = 0; q < on.length; q++)
		if (on[q]) {
			const a = q % cols;
			const b = Math.floor(q / cols);
			let n = 0;
			for (let dj = -1; dj <= 1; dj++)
				for (let di = -1; di <= 1; di++) {
					const x = a + di;
					const y = b + dj;
					if ((di || dj) && x >= 0 && y >= 0 && x < cols && y < rows && on[y * cols + x]) n++;
				}
			const p = old[k++];
			s.cells.push({
				x: a * cs,
				y: b * cs,
				ton: n >= 8 ? 0 : n >= 6 ? 1 : 2,
				ox: s.reduced ? 0 : p ? p.x + p.ox - a * cs : (hsh(q, 1) - 0.5) * 300,
				oy: s.reduced ? 0 : p ? p.y + p.oy - b * cs : (hsh(q, 2) - 0.5) * 300,
				vx: 0,
				vy: 0,
			});
		}
}

// Zeichenblatt: die drei Glyphen einmal vorgerendert, je Pixelfaktor und Schriftstand
function blatt(s, cs, gl) {
	const key = `${s.dpr}|${loop.fv}|${gl}`;
	if (s.blattKey === key) return s.blatt;
	const z = Math.ceil((gl + 4) * s.dpr);
	const cv = document.createElement('canvas');
	cv.width = z * RAMPE.length;
	cv.height = z;
	const g = cv.getContext('2d');
	g.font = `500 ${gl * s.dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#FAFAFA';
	for (let i = 0; i < RAMPE.length; i++) g.fillText(RAMPE[i], z * i + z / 2, z / 2 + 0.5 * s.dpr);
	s.blattKey = key;
	s.blatt = { cv, z };
	return s.blatt;
}

/** Meldet eine Ziffer an. Gibt die Abmeldung zurück. */
export function registerZiffer(cv, { text, cs: cs0 = 4, gl: gl0 = 7 }) {
	return register({
		name: `ziffer ${text}`,
		el: cv,
		host: cv.parentElement,
		box: (W, H) => ({ bw: Math.max(1, W), bh: Math.max(1, H), max: 1 }),
		dprCap: 2,
		frame(s, _t, dt) {
			// Hochformat: noch feineres Raster (Zelle 3, Glyph 5), die Ziffer bleibt eine Form
			const cs = s.mode === 'hoch' ? 3 : cs0;
			const gl = s.mode === 'hoch' ? 5 : gl0;
			const key = `${text}|${loop.fv}|${s.W}x${s.H}|${s.dpr}|${cs}`;
			if (s.key !== key) {
				s.key = key;
				baue(s, text, cs);
				s.dirty = true;
			}
			const R = 110;
			let moving = false;
			// Federn im festen 60-Hz-Schritt
			s.step(dt, 1 / 60, () => {
				for (const c of s.cells) {
					if (s.m.in) {
						const dx = c.x + c.ox - s.m.x;
						const dy = c.y + c.oy - s.m.y;
						const d2 = dx * dx + dy * dy;
						if (d2 < R * R) {
							const d = Math.sqrt(d2) + 0.1;
							const g = (1 - d / R) * 3.2;
							c.vx += (dx / d) * g;
							c.vy += (dy / d) * g;
						}
					}
					c.vx += -c.ox * 0.07;
					c.vy += -c.oy * 0.07;
					c.vx *= 0.8;
					c.vy *= 0.8;
					c.ox += c.vx;
					c.oy += c.vy;
					if (Math.abs(c.vx) + Math.abs(c.vy) + Math.abs(c.ox) + Math.abs(c.oy) > 0.02) moving = true;
				}
			});
			// Ruhende Ziffer ohne Zeiger: nichts neu zeichnen
			if (!(s.dirty || moving || s.m.in || s.bewegt)) return;
			s.bewegt = moving;
			s.dirty = false;
			const ctx = s.ctx;
			const { cv: sheet, z } = blatt(s, cs, gl);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, s.cv.width, s.cv.height);
			const dpr = s.dpr;
			for (const c of s.cells) {
				const dx = Math.round((c.x + c.ox + cs / 2) * dpr - z / 2);
				const dy = Math.round((c.y + c.oy + cs / 2) * dpr - z / 2);
				// Ruhezustand nur „#“ und „@“, die Randzeichen „+“ gibt es nur, solange die Zelle unterwegs ist
				const ton = c.ton === 2 && Math.abs(c.ox) + Math.abs(c.oy) < 3 ? 1 : c.ton;
				ctx.drawImage(sheet, z * ton, 0, z, z, dx, dy, z, z);
			}
		},
	});
}
