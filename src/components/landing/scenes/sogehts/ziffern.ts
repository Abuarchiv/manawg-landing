// Die Ziffern 01 bis 03 von "So geht's": Schrift als Punktraster aus Mono-Zeichen (Zelle 4 px, Glyph 7 px).
// Die Ziffer folgt der Breite der Spalte, die Zellen liegen in festen CSS-Pixeln. Der Zeiger stößt die
// Zellen weg, Federn holen sie zurück. Wie im Entwurf wechseln die Zeichen einer Zelle im Takt von 90 ms
// durch die ganze Rampe @%#*+=-:, solange sie unterwegs ist (Einlauf, Zeiger). In Ruhe stehen feste
// Zeichen nach der Lage der Zelle in der Ziffer (innen @, am Rand #).

import { type SceneState, loop, qa, register } from '../../core/loop';
import { hsh } from '../../core/math';

const RAMPE = '@%#*+=-:';
qa.masse = { ...(qa.masse as Record<string, unknown> | undefined), zifferZelle: 4, zifferGlyph: 7 };

/** Eine Rasterzelle der Ziffer: Ruhelage (x, y), Ton in der Rampe, Auslenkung (ox, oy) und Tempo (vx, vy). */
interface Zelle {
	x: number;
	y: number;
	/** Zeichen in Ruhe: 0 innen (@), 2 am Rand (#). */
	ton: 0 | 2;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
}

/** Vorgerendertes Zeichenblatt: ein Streifen mit den Glyphen der Rampe, z = Kantenlänge einer Glyphe in Gerätepixeln. */
interface Blatt {
	cv: HTMLCanvasElement;
	z: number;
}

interface ZifferState extends SceneState {
	cells: Zelle[];
	/** Schlüssel des letzten Rasteraufbaus (Text, Schriftstand, Größe, Pixelfaktor, Zelle). */
	key: string;
	dirty: boolean;
	/** Im letzten gezeichneten Bild waren Zellen in Bewegung. */
	bewegt: boolean;
	blattKey: string;
	blatt: Blatt | null;
}

interface ZifferOptionen {
	text: string;
	/** Zelle in CSS-Pixeln. */
	cs?: number;
	/** Glyph in CSS-Pixeln. */
	gl?: number;
}

function baue(s: ZifferState, txt: string, cs: number) {
	const W = Math.max(1, Math.round(s.W));
	const H = Math.max(1, Math.round(s.H));
	const fs = H * 1.28; // Ziffernhöhe (0,73 em) füllt rund 94 % der Fläche
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	const oc = document.createElement('canvas');
	oc.width = cols;
	oc.height = rows;
	const o = oc.getContext('2d');
	if (!o) return;
	o.fillStyle = '#000';
	// Die Form kommt aus Inter Tight (ohne den Punkt in der Null der Mono-Schrift), gefüllt wird mit Mono-Zeichen
	o.font = `600 ${fs / cs}px "Inter Tight", sans-serif`;
	o.textBaseline = 'alphabetic';
	txt.split('|').forEach((ln, i) => o.fillText(ln, 0, (H * 0.97 + i * fs * 0.9) / cs));
	const d = o.getImageData(0, 0, cols, rows).data;
	const on = new Uint8Array(cols * rows);
	for (let q = 0; q < on.length; q++) on[q] = (d[q * 4 + 3] ?? 0) > 110 ? 1 : 0;
	const old = s.cells;
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
				ton: n >= 8 ? 0 : 2,
				ox: s.reduced ? 0 : p ? p.x + p.ox - a * cs : (hsh(q, 1) - 0.5) * 300,
				oy: s.reduced ? 0 : p ? p.y + p.oy - b * cs : (hsh(q, 2) - 0.5) * 300,
				vx: 0,
				vy: 0,
			});
		}
}

// Zeichenblatt: die acht Glyphen einmal vorgerendert, je Pixelfaktor und Schriftstand
function blatt(s: ZifferState, gl: number): Blatt {
	const key = `${s.dpr}|${loop.fv}|${gl}`;
	if (s.blatt && s.blattKey === key) return s.blatt;
	const z = Math.ceil((gl + 4) * s.dpr);
	const cv = document.createElement('canvas');
	cv.width = z * RAMPE.length;
	cv.height = z;
	const g = cv.getContext('2d');
	if (!g) return { cv, z };
	g.font = `500 ${gl * s.dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#FAFAFA';
	for (let i = 0; i < RAMPE.length; i++)
		g.fillText(RAMPE[i] ?? '', z * i + z / 2, z / 2 + 0.5 * s.dpr);
	s.blattKey = key;
	s.blatt = { cv, z };
	return s.blatt;
}

/** Meldet eine Ziffer an. Gibt die Abmeldung zurück. */
export function registerZiffer(
	cv: HTMLCanvasElement,
	{ text, cs: cs0 = 4, gl: gl0 = 7 }: ZifferOptionen,
): () => void {
	return register<ZifferState>({
		name: `ziffer ${text}`,
		el: cv,
		host: cv.parentElement ?? undefined,
		box: (W, H) => ({ bw: Math.max(1, W), bh: Math.max(1, H), max: 1 }),
		dprCap: 2,
		init(s) {
			s.cells = [];
			s.key = '';
			s.dirty = false;
			s.bewegt = false;
			s.blattKey = '';
			s.blatt = null;
		},
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
					if (Math.abs(c.vx) + Math.abs(c.vy) + Math.abs(c.ox) + Math.abs(c.oy) > 0.02)
						moving = true;
				}
			});
			// Backing wurde neu gesetzt (Pufferspeicher nach Abwesenheit freigegeben, Größenänderung): neu zeichnen
			if (s.stale) {
				s.stale = false;
				s.dirty = true;
			}
			// Ruhende Ziffer ohne Zeiger: nichts neu zeichnen
			if (!(s.dirty || moving || s.m.in || s.bewegt)) return;
			s.bewegt = moving;
			s.dirty = false;
			const { ctx, cv: flaeche } = s;
			if (!ctx || !flaeche) return;
			const { cv: sheet, z } = blatt(s, gl);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, flaeche.width, flaeche.height);
			const dpr = s.dpr;
			const tq = Math.floor(loop.now / 0.09);
			for (const c of s.cells) {
				const dx = Math.round((c.x + c.ox + cs / 2) * dpr - z / 2);
				const dy = Math.round((c.y + c.oy + cs / 2) * dpr - z / 2);
				// Unterwegs (Entwurf: Abstand über 3 px oder Tempo über 0,5): Zeichen wechselt alle 90 ms, sonst fest
				const unterwegs = Math.abs(c.ox) + Math.abs(c.oy) > 3 || Math.hypot(c.vx, c.vy) > 0.5;
				const ton = unterwegs
					? Math.floor(hsh(c.x + tq, c.y) * RAMPE.length) % RAMPE.length
					: c.ton;
				ctx.drawImage(sheet, z * ton, 0, z, z, dx, dy, z, z);
			}
		},
	});
}
