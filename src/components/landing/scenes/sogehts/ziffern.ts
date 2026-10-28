// Die Ziffern 01 bis 03 von "So geht's": große Schrift als Raster aus Mono-Zeichen (Zelle 7 px, Glyph 8 px).
// Die Zellen liegen in festen CSS-Pixeln. Der Zeiger stößt die
// Zellen weg, Federn holen sie zurück. Unterwegs (Einlauf, Zeiger) wechseln die Zeichen einer Zelle im Takt von
// 90 ms durch die Rampe, in Ruhe steht die Ziffer ruhig: heller Rand aus @, Körper aus gedämpften #.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { hsh } from '../../core/math';

const RAMPE = '@%#*+=-:';
qa.masse = { ...(qa.masse as Record<string, unknown> | undefined), zifferZelle: 7, zifferGlyph: 8 };

/** Eine Rasterzelle der Ziffer: Ruhelage (x, y), Ton in der Rampe, Auslenkung (ox, oy) und Tempo (vx, vy). */
interface Zelle {
	x: number;
	y: number;
	/** Zeichen in Ruhe: 0 am Rand (@, hell), 2 innen (#, gedämpft). */
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

/** Eine Zelle des Rasters in Ruhe: Lage in CSS-px und Ton (0 Rand, 2 innen). */
export interface RasterZelle {
	x: number;
	y: number;
	ton: 0 | 2;
}

/** Zellen einer Ziffer auf der Fläche W x H (CSS-px) mit Zelle cs. Rein, auch für den Übergang (scenes/zerfall). */
export function raster(txt: string, W0: number, H0: number, cs: number): RasterZelle[] {
	const W = Math.max(1, Math.round(W0));
	const H = Math.max(1, Math.round(H0));
	const fs = H * 1.28; // Ziffernhöhe (0,73 em) füllt rund 94 % der Fläche
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	const oc = document.createElement('canvas');
	oc.width = cols;
	oc.height = rows;
	const o = oc.getContext('2d');
	if (!o) return [];
	o.fillStyle = '#000';
	// Die Form kommt aus Inter Tight (ohne den Punkt in der Null der Mono-Schrift), gefüllt wird mit Mono-Zeichen
	o.font = `600 ${fs / cs}px "Inter Tight", sans-serif`;
	o.textBaseline = 'alphabetic';
	txt.split('|').forEach((ln, i) => o.fillText(ln, 0, (H * 0.97 + i * fs * 0.9) / cs));
	const d = o.getImageData(0, 0, cols, rows).data;
	const on = new Uint8Array(cols * rows);
	for (let q = 0; q < on.length; q++) on[q] = (d[q * 4 + 3] ?? 0) > 110 ? 1 : 0;
	const aus: RasterZelle[] = [];
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
			aus.push({ x: a * cs, y: b * cs, ton: n >= 8 ? 2 : 0 });
		}
	return aus;
}

/** Zellgröße und Glyphe je Modus (hoch etwas feiner). */
export const zifferMasse = (hoch: boolean): { cs: number; gl: number } =>
	hoch ? { cs: 6, gl: 7 } : { cs: 7, gl: 8 };

/** Solange der Übergang aus dem Handy läuft, zeichnet er die Ziffern (scenes/zerfall), die Ziffern selbst ruhen. */
export const uebergang = { verdeckt: false };

function baue(s: ZifferState, txt: string, cs: number) {
	const old = s.cells;
	s.cells = raster(txt, s.W, s.H, cs).map((z, k) => {
		const p = old[k];
		return {
			...z,
			ox: s.reduced ? 0 : p ? p.x + p.ox - z.x : (hsh(k, 1) - 0.5) * 160,
			oy: s.reduced ? 0 : p ? p.y + p.oy - z.y : (hsh(k, 2) - 0.5) * 160,
			vx: 0,
			vy: 0,
		};
	});
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
	{ text, cs: cs0 = 7, gl: gl0 = 8 }: ZifferOptionen,
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
			// Hochformat: etwas feineres Raster (Zelle 6, Glyph 7), die Ziffer bleibt eine Form
			const cs = s.mode === 'hoch' ? zifferMasse(true).cs : cs0;
			const gl = s.mode === 'hoch' ? zifferMasse(true).gl : gl0;
			const key = `${text}|${loop.fv}|${s.W}x${s.H}|${s.dpr}|${cs}`;
			if (s.key !== key) {
				s.key = key;
				baue(s, text, cs);
				s.dirty = true;
			}
			// Der Übergang zeichnet die Ziffer: hier leer lassen und in Ruhelage halten, damit sie beim Übergeben steht
			if (uebergang.verdeckt) {
				for (const c of s.cells) c.ox = c.oy = c.vx = c.vy = 0;
				if (!s.dirty) s.ctx?.clearRect(0, 0, s.cv?.width ?? 0, s.cv?.height ?? 0);
				s.dirty = true;
				return;
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
			ctx.globalAlpha = 1;
			const tq = Math.floor(loop.now / 0.09);
			if (loop.v === 'a') {
				// Variante A: jede Zelle ein Stichelzug unter 45°, Nachbarn schließen zu durchgehenden Linien. Der Rand
				// trägt breite Züge, der Körper Haarlinien; ausgelenkte Zellen drehen ihren Zug in die Flugrichtung.
				ctx.strokeStyle = '#FAFAFA';
				ctx.lineCap = 'butt';
				const h = (cs / 2) * dpr;
				for (const breit of [true, false]) {
					ctx.lineWidth = (breit ? 1.7 : 0.7) * dpr;
					ctx.globalAlpha = breit ? 1 : 0.6;
					ctx.beginPath();
					for (const c of s.cells) {
						if ((c.ton === 0) !== breit) continue;
						const mx = (c.x + c.ox + cs / 2) * dpr;
						const my = (c.y + c.oy + cs / 2) * dpr;
						const sp = Math.hypot(c.vx, c.vy);
						const k = Math.min(1, sp / 2);
						const ux = 1 - k + (k * c.vx) / (sp || 1);
						const uy = -(1 - k) + (k * c.vy) / (sp || 1);
						ctx.moveTo(mx - ux * h, my - uy * h);
						ctx.lineTo(mx + ux * h, my + uy * h);
					}
					ctx.stroke();
				}
				ctx.globalAlpha = 1;
				return;
			}
			for (const c of s.cells) {
				const dx = Math.round((c.x + c.ox + cs / 2) * dpr - z / 2);
				const dy = Math.round((c.y + c.oy + cs / 2) * dpr - z / 2);
				// Unterwegs (Entwurf: Abstand über 3 px oder Tempo über 0,5): Zeichen wechselt alle 90 ms, sonst fest
				const unterwegs = Math.abs(c.ox) + Math.abs(c.oy) > 3 || Math.hypot(c.vx, c.vy) > 0.5;
				const ton = unterwegs
					? Math.floor(hsh(c.x + tq, c.y) * RAMPE.length) % RAMPE.length
					: c.ton;
				// Körper der Ziffer gedämpft, Rand hell: so liest sich die Form sofort
				ctx.globalAlpha = unterwegs || c.ton === 0 ? 1 : 0.42;
				ctx.drawImage(sheet, z * ton, 0, z, z, dx, dy, z, z);
			}
			ctx.globalAlpha = 1;
		},
	});
}
