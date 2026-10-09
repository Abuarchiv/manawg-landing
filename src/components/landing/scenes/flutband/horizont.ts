// Flutband: ASCII-Übergang zwischen Ende und "So geht's". Ein Horizont aus Zeichen läuft oben über die ganze Breite
// und zieht sich nach unten zu den drei Spannen der Ziffern zusammen. Die Zeichen stehen fest im Raster (kein
// Flimmern), das Scrollen steuert nur, wie weit die Spannen eingelaufen sind. Reduzierte Bewegung: fertiges Bild.

import { type SceneState, loop, register } from '../../core/loop';
import { cl, hsh, ss } from '../../core/math';

const RAMPE = ':-=+*#%@';
const CW = 7; // Zellbreite in CSS-px
const CHH = 11; // Zellhöhe
const MONO = '"JetBrains Mono", monospace';

interface Spanne {
	x0: number;
	x1: number;
}

interface FlutState extends SceneState {
	spannen: Spanne[];
	key: string;
	letzt: string;
	blatt: HTMLCanvasElement | null;
	blattKey: string;
}

// Ziffernspannen aus dem DOM: die Zeichenflächen der Ziffern in So geht's (Breite der Ziffer ist die halbe Fläche,
// bei schmalen Spalten die ganze)
function spannen(W: number): Spanne[] {
	const cvs = [...document.querySelectorAll<HTMLCanvasElement>('#so-gehts canvas')];
	const r = cvs.map((c): Spanne => {
		const b = c.getBoundingClientRect();
		return { x0: b.left, x1: b.left + Math.min(b.width, b.height * 1.5) };
	});
	if (r.length) return r;
	return [0, 1, 2].map(
		(k): Spanne => ({ x0: 48 + (k * (W - 96)) / 3, x1: 48 + (k * (W - 96)) / 3 + 240 }),
	);
}

// Zeichenblatt: die Glyphen der Rampe einmal vorgerendert, je Pixelfaktor und Schriftstand
function blatt(s: FlutState): HTMLCanvasElement {
	const key = `${s.dpr}|${loop.fv}`;
	if (s.blatt && s.blattKey === key) return s.blatt;
	const cv = document.createElement('canvas');
	const w = Math.ceil(CW * s.dpr);
	const h = Math.ceil(CHH * s.dpr);
	cv.width = w * RAMPE.length;
	cv.height = h;
	const g = cv.getContext('2d');
	if (g) {
		g.font = `500 ${9 * s.dpr}px ${MONO}`;
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillStyle = '#FAFAFA';
		for (let i = 0; i < RAMPE.length; i++)
			g.fillText(RAMPE.charAt(i), w * i + w / 2, h / 2 + 0.5 * s.dpr);
	}
	s.blattKey = key;
	s.blatt = cv;
	return cv;
}

export function registerFlutband(cv: HTMLCanvasElement): () => void {
	return register<FlutState>({
		name: 'flutband',
		el: cv,
		host: cv.parentElement ?? undefined,
		box: (W, H) => ({ bw: Math.max(1, W), bh: Math.max(1, H), max: 1 }),
		dprCap: 2,
		init(s) {
			s.spannen = [];
			s.key = '';
			s.letzt = '';
			s.blatt = null;
			s.blattKey = '';
		},
		frame(s) {
			const ctx = s.ctx;
			if (!ctx) return;
			const W = s.W;
			const H = s.H;
			const sp = spannen(W);
			const key = `${W}x${H}|${s.dpr}|${loop.fv}${sp.map((q) => `|${Math.round(q.x0)}:${Math.round(q.x1)}`).join('')}`;
			if (s.key !== key) {
				s.key = key;
				s.spannen = sp;
				s.stale = true;
			}
			const r = s.el.getBoundingClientRect();
			// Einlauf: beginnt, wenn die Oberkante des Bandes ins Bild kommt, fertig bei 30 % der Fensterhöhe
			const p = s.reduced ? 1 : cl((innerHeight - r.top) / (0.7 * innerHeight));
			const st = p.toFixed(3);
			if (st === s.letzt && !s.stale) return;
			s.letzt = st;
			s.stale = false;
			const sheet = blatt(s);
			const dpr = s.dpr;
			const gw = Math.ceil(CW * dpr);
			const gh = Math.ceil(CHH * dpr);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, s.cv?.width ?? 0, s.cv?.height ?? 0);
			const cols = Math.ceil(W / CW);
			const rows = Math.floor(H / CHH);
			const hoch = s.spannen.every((q) => Math.abs(q.x0 - (s.spannen[0]?.x0 ?? 0)) < 2);
			for (let rr = 0; rr < rows; rr++) {
				const v = (rr + 0.5) / rows;
				// Spannen: oben die ganze Fläche, unten die Ziffern
				const e = ss(cl(p * 1.7 - v * 0.7));
				if (e <= 0.01) continue;
				const z = ss(cl((v - 0.1) / 0.85));
				const hws = s.spannen.map((q) => {
					const half = (q.x1 - q.x0) / 2;
					const wide = hoch ? W : W / (s.spannen.length * 0.5);
					return (half + (wide - half) * (1 - z) ** 1.6) * e;
				});
				// Oben läuft der Horizont aus dem Schwarz ein, unten stehen die Zeichen klar
				ctx.globalAlpha = (0.3 + 0.7 * z) * ss(cl(v / 0.25));
				const dy = Math.round(rr * CHH * dpr);
				for (let c = 0; c < cols; c++) {
					const x = (c + 0.5) * CW;
					let u = 1;
					s.spannen.forEach((q, j) => {
						u = Math.min(u, Math.abs(x - (q.x0 + q.x1) / 2) / Math.max(1, hws[j] ?? 1));
					});
					if (u >= 1) continue;
					// Dichte: Mitte der Spanne dicht, Rand und Horizont locker (Würfel über feste Zellwerte, ruhig)
					const d = (1 - u) ** 0.7 * (0.55 + 0.45 * z);
					if (hsh(c, rr) > 0.35 + d * 0.9) continue;
					const i = Math.min(RAMPE.length - 1, Math.floor(d * RAMPE.length * 0.95));
					ctx.drawImage(sheet, gw * i, 0, gw, gh, Math.round(c * CW * dpr), dy, gw, gh);
				}
			}
			ctx.globalAlpha = 1;
		},
	});
}
