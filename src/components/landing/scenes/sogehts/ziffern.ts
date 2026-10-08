// Die Ziffern 01 bis 03 von "So geht's" als Kupferstich: jede Rasterzelle (4 px) ist ein waagerechtes Strichstück,
// die Stücke einer Zeile schließen zur Stichlinie, innen kräftig, am Rand fein, wie die Wörter der Tiefe.
// Die Ziffer folgt der Breite der Spalte, die Zellen liegen in festen CSS-Pixeln. Der Zeiger stößt die
// Zellen weg, Federn holen sie zurück; unterwegs (Einlauf, Zeiger) werden die Stücke kürzer und kippen leicht.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { cl, hsh } from '../../core/math';

qa.masse = { ...(qa.masse as Record<string, unknown> | undefined), zifferZelle: 4 };

/** Eine Rasterzelle der Ziffer: Ruhelage (x, y), Ton in der Rampe, Auslenkung (ox, oy) und Tempo (vx, vy). */
interface Zelle {
	x: number;
	y: number;
	/** Strichstärke in Ruhe: 1 innen, kleiner am Rand. */
	ton: number;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
}

interface ZifferState extends SceneState {
	cells: Zelle[];
	/** Schlüssel des letzten Rasteraufbaus (Text, Schriftstand, Größe, Pixelfaktor, Zelle). */
	key: string;
	dirty: boolean;
	/** Im letzten gezeichneten Bild waren Zellen in Bewegung. */
	bewegt: boolean;
}

interface ZifferOptionen {
	text: string;
	/** Zelle in CSS-Pixeln. */
	cs?: number;
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
				ton: 0.3 + (n / 8) * 0.7,
				ox: s.reduced ? 0 : p ? p.x + p.ox - a * cs : (hsh(q, 1) - 0.5) * 300,
				oy: s.reduced ? 0 : p ? p.y + p.oy - b * cs : (hsh(q, 2) - 0.5) * 300,
				vx: 0,
				vy: 0,
			});
		}
}

/** Meldet eine Ziffer an. Gibt die Abmeldung zurück. */
export function registerZiffer(
	cv: HTMLCanvasElement,
	{ text, cs: cs0 = 4 }: ZifferOptionen,
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
		},
		frame(s, _t, dt) {
			// Hochformat: noch feineres Raster (Zelle 3), die Ziffer bleibt eine Form
			const cs = s.mode === 'hoch' ? 3 : cs0;
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
			ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
			ctx.clearRect(0, 0, s.W, s.H);
			ctx.fillStyle = '#FAFAFA';
			for (const c of s.cells) {
				const x = c.x + c.ox + cs / 2;
				const y = c.y + c.oy + cs / 2;
				// Unterwegs (Abstand über 3 px oder Tempo über 0,5): kürzeres Stück, kippt mit der Bewegung
				const unterwegs = Math.abs(c.ox) + Math.abs(c.oy) > 3 || Math.hypot(c.vx, c.vy) > 0.5;
				const h = cs * (0.12 + 0.36 * c.ton);
				if (!unterwegs) {
					ctx.fillRect(x - cs * 0.52, y - h / 2, cs * 1.04, h);
					continue;
				}
				const w = cs * (0.7 + hsh(c.x, c.y) * 0.5);
				const a = cl(Math.atan2(c.vy, c.vx + 0.001) * 0.35, -0.6, 0.6);
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(a);
				ctx.fillRect(-w / 2, -h / 2, w, h);
				ctx.restore();
			}
		},
	});
}
