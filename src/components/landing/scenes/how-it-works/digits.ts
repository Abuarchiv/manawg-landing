// Die Ziffern 01 bis 03 von "So geht's": große Schrift als Raster aus Mono-Zeichen (Zelle 7 px, Glyph 8 px).
// Die Zellen liegen in festen CSS-Pixeln. Der Zeiger stößt die
// Zellen weg, Federn holen sie zurück. Unterwegs (Einlauf, Zeiger) wechseln die Zeichen einer Zelle im Takt von
// 90 ms durch die Rampe, in Ruhe steht die Ziffer ruhig: heller Rand aus @, Körper aus gedämpften #.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { hsh } from '../../core/math';

const RAMP = '@%#*+=-:';
qa.masse = { ...(qa.masse as Record<string, unknown> | undefined), zifferZelle: 7, zifferGlyph: 8 };

/** Eine Rasterzelle der Ziffer: Ruhelage (x, y), Ton in der Rampe, Auslenkung (ox, oy) und Tempo (vx, vy). */
interface Cell {
	x: number;
	y: number;
	/** Zeichen in Ruhe: 0 am Rand (@, hell), 2 innen (#, gedämpft). */
	tone: 0 | 2;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
}

/** Vorgerendertes Zeichenblatt: ein Streifen mit den Glyphen der Rampe, z = Kantenlänge einer Glyphe in Gerätepixeln. */
interface Sheet {
	cv: HTMLCanvasElement;
	z: number;
}

interface DigitState extends SceneState {
	cells: Cell[];
	/** Schlüssel des letzten Rasteraufbaus (Text, Schriftstand, Größe, Pixelfaktor, Zelle). */
	key: string;
	dirty: boolean;
	/** Im letzten gezeichneten Bild waren Zellen in Bewegung. */
	moving: boolean;
	sheetKey: string;
	sheet: Sheet | null;
}

interface DigitOptions {
	text: string;
	/** Zelle in CSS-Pixeln. */
	cs?: number;
	/** Glyph in CSS-Pixeln. */
	gl?: number;
}

/** Eine Zelle des Rasters in Ruhe: Lage in CSS-px und Ton (0 Rand, 2 innen). */
export interface GridCell {
	x: number;
	y: number;
	tone: 0 | 2;
}

/** Zellen einer Ziffer auf der Fläche W x H (CSS-px) mit Zelle cs. Rein, auch für den Übergang (scenes/zerfall). */
export function buildGrid(txt: string, W0: number, H0: number, cs: number): GridCell[] {
	const W = Math.max(1, Math.round(W0));
	const H = Math.max(1, Math.round(H0));
	const fs = H * 1.28; // Ziffernhöhe (0,73 em) füllt rund 94 % der Fläche
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	const oc = document.createElement('canvas');
	oc.width = cols;
	oc.height = rows;
	const o = oc.getContext('2d', { willReadFrequently: true }); // getImageData ohne Rücklesen von der Grafikkarte
	if (!o) return [];
	o.fillStyle = '#000';
	// Die Form kommt aus Inter Tight (ohne den Punkt in der Null der Mono-Schrift), gefüllt wird mit Mono-Zeichen
	o.font = `600 ${fs / cs}px "Inter Tight", sans-serif`;
	o.textBaseline = 'alphabetic';
	txt.split('|').forEach((ln, i) => o.fillText(ln, 0, (H * 0.97 + i * fs * 0.9) / cs));
	const d = o.getImageData(0, 0, cols, rows).data;
	const on = new Uint8Array(cols * rows);
	for (let q = 0; q < on.length; q++) on[q] = (d[q * 4 + 3] ?? 0) > 110 ? 1 : 0;
	const out: GridCell[] = [];
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
			out.push({ x: a * cs, y: b * cs, tone: n >= 8 ? 2 : 0 });
		}
	return out;
}

/** Zellgröße und Glyphe je Modus (hoch etwas feiner). */
export const digitMetrics = (portrait: boolean): { cs: number; gl: number } =>
	portrait ? { cs: 6, gl: 7 } : { cs: 7, gl: 8 };

/** Solange der Übergang aus dem Handy läuft, zeichnet er die Ziffern (scenes/zerfall), die Ziffern selbst ruhen. */
export const handover = { covered: false };

function build(s: DigitState, txt: string, cs: number) {
	const old = s.cells;
	s.cells = buildGrid(txt, s.W, s.H, cs).map((z, k) => {
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
function buildSheet(s: DigitState, gl: number): Sheet {
	const key = `${s.dpr}|${loop.fv}|${gl}`;
	if (s.sheet && s.sheetKey === key) return s.sheet;
	const z = Math.ceil((gl + 4) * s.dpr);
	const cv = document.createElement('canvas');
	cv.width = z * RAMP.length;
	cv.height = z;
	const g = cv.getContext('2d');
	if (!g) return { cv, z };
	g.font = `500 ${gl * s.dpr}px "JetBrains Mono", monospace`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = '#FAFAFA';
	for (let i = 0; i < RAMP.length; i++)
		g.fillText(RAMP[i] ?? '', z * i + z / 2, z / 2 + 0.5 * s.dpr);
	s.sheetKey = key;
	s.sheet = { cv, z };
	return s.sheet;
}

/** Meldet eine Ziffer an. Gibt die Abmeldung zurück. */
export function registerDigit(
	cv: HTMLCanvasElement,
	{ text, cs: cs0 = 7, gl: gl0 = 8 }: DigitOptions,
): () => void {
	return register<DigitState>({
		name: `ziffer ${text}`,
		el: cv,
		host: cv.parentElement ?? undefined,
		box: (W, H) => ({ bw: Math.max(1, W), bh: Math.max(1, H), max: 1 }),
		dprCap: 2,
		init(s) {
			s.cells = [];
			s.key = '';
			s.dirty = false;
			s.moving = false;
			s.sheetKey = '';
			s.sheet = null;
		},
		frame(s, _t, dt) {
			// Hochformat: etwas feineres Raster (Zelle 6, Glyph 7), die Ziffer bleibt eine Form
			const cs = s.mode === 'hoch' ? digitMetrics(true).cs : cs0;
			const gl = s.mode === 'hoch' ? digitMetrics(true).gl : gl0;
			const key = `${text}|${loop.fv}|${s.W}x${s.H}|${s.dpr}|${cs}`;
			if (s.key !== key) {
				s.key = key;
				build(s, text, cs);
				s.dirty = true;
			}
			// Der Übergang zeichnet die Ziffer: hier leer lassen und in Ruhelage halten, damit sie beim Übergeben steht
			if (handover.covered) {
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
			if (!(s.dirty || moving || s.m.in || s.moving)) return;
			s.moving = moving;
			s.dirty = false;
			const { ctx, cv: area } = s;
			if (!ctx || !area) return;
			const { cv: sheet, z } = buildSheet(s, gl);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, area.width, area.height);
			const dpr = s.dpr;
			ctx.globalAlpha = 1;
			const tq = Math.floor(loop.now / 0.09);
			for (const c of s.cells) {
				const dx = Math.round((c.x + c.ox + cs / 2) * dpr - z / 2);
				const dy = Math.round((c.y + c.oy + cs / 2) * dpr - z / 2);
				// Unterwegs (Entwurf: Abstand über 3 px oder Tempo über 0,5): Zeichen wechselt alle 90 ms, sonst fest
				const inMotion = Math.abs(c.ox) + Math.abs(c.oy) > 3 || Math.hypot(c.vx, c.vy) > 0.5;
				const tone = inMotion ? Math.floor(hsh(c.x + tq, c.y) * RAMP.length) % RAMP.length : c.tone;
				// Körper der Ziffer gedämpft, Rand hell: so liest sich die Form sofort
				ctx.globalAlpha = inMotion || c.tone === 0 ? 1 : 0.42;
				ctx.drawImage(sheet, z * tone, 0, z, z, dx, dy, z, z);
			}
			ctx.globalAlpha = 1;
		},
	});
}
