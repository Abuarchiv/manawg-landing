// Die gestochene Sonne des Finales (Dateiname aus der ASCII-Zeit): konzentrische Stichlinien bilden die Scheibe,
// Strahlen sind feine Linienbündel, die Kontur ein dichtes Bündel aus drei Ringen. Der Zeiger löscht Linien
// unter sich und zieht eine Spur aus Haarlinien. Szenenraum: Bezugsbox für die Sonne (quer 1280 x 760, hoch 760 x 760).
// Linienabstand am Bildschirm ca. 3,8 CSS-px wie im Hero, die Linien hängen an der Sonne (kein Flimmern beim Scrollen).

import { type SceneState, loop, register } from '../../core/loop';
import { cl, hsh, lag, ss, vnz } from '../../core/math';

const ABST = 3.8; // Linienabstand der Scheibe in CSS-px
const SPUR_ZEIT = 0.9; // so lange steht ein Punkt der Zeigerspur (s)
const SPUR_MAX = 28;

/** Aussparung hinter Schlagzeile und Knöpfen, in CSS-px relativ zum Canvas. */
interface Aussparung {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/** Punkt der Zeigerspur in Szenenkoordinaten, mit Alter in Sekunden. */
interface Spur {
	x: number;
	y: number;
	alter: number;
}

interface SonneState extends SceneState {
	/** Geglättetes Ziel des Zeigers (löscht Linien unter sich). */
	sm: { x: number; y: number };
	/** Letzte Zeigerlage und Stärke der Bewegung; wird beim ersten Bild angelegt. */
	pv?: { x: number; y: number; a: number };
	spur: Spur[];
	takt: number;
	grund: string;
	sig: string;
	/** Aussparung; undefined = noch nie gemessen, null = keine Schlagzeile und Knöpfe gefunden. */
	box: Aussparung | null | undefined;
	/** Maske der Aussparung (Gerätepixel) und ihr Schlüssel. */
	maske: HTMLCanvasElement | null;
	maskeKey: string;
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

/** Maske: weicher Kasten um Schlagzeile und Knöpfe, Deckkraft 1 - boden (Gerätepixel, wird von den Linien abgezogen). */
function baueMaske(s: SonneState, box: Aussparung, boden: number, key: string): HTMLCanvasElement {
	const m = s.maske ?? document.createElement('canvas');
	m.width = s.cv?.width ?? 1;
	m.height = s.cv?.height ?? 1;
	const g = m.getContext('2d');
	if (g) {
		const d = s.dpr;
		const off = m.width + 400;
		g.shadowColor = `rgba(0,0,0,${1 - boden})`;
		g.shadowBlur = 90 * d;
		g.shadowOffsetX = off;
		g.fillStyle = '#000';
		const pad = 30;
		g.fillRect(
			(box.x0 - pad) * d - off,
			(box.y0 - pad) * d,
			(box.x1 - box.x0 + 2 * pad) * d,
			(box.y1 - box.y0 + 2 * pad) * d,
		);
	}
	s.maske = m;
	s.maskeKey = key;
	return m;
}

/** Meldet die gestochene Sonne an. Gibt die Abmeldung zurück. */
export function registerAscii(cv: HTMLCanvasElement): () => void {
	return register<SonneState>({
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
			s.spur = [];
			s.takt = -1;
			s.grund = '';
			s.sig = '';
			s.box = null;
			s.maske = null;
			s.maskeKey = '';
		},
		frame(s, _t, dt) {
			const { ctx, cv: flaeche } = s;
			if (!ctx || !flaeche) return;
			const reduced = s.reduced;
			// Bei reduzierter Bewegung steht die Sonne: aufgegangen, Strahlen eingefroren
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
			// Zeiger: Löschen und Spur nur bei Bewegung (Stärke aus der Geschwindigkeit), ruhend in ca. 300 ms weg
			s.pv ||= { x: s.m.x, y: s.m.y, a: 0 };
			const pv = s.pv;
			if (s.m.in && !reduced) {
				const v = (Math.hypot(s.m.x - pv.x, s.m.y - pv.y) * s.f) / Math.max(dt, 0.001);
				pv.a = Math.max(pv.a * Math.exp(-dt * 10), cl(v / 600));
			} else pv.a = 0;
			pv.x = s.m.x;
			pv.y = s.m.y;
			const wirk = s.m.in && pv.a > 0.01 ? pv.a : 0;
			for (const p of s.spur) p.alter += dt;
			while (s.spur.length && (s.spur[0]?.alter ?? 0) > SPUR_ZEIT) s.spur.shift();
			if (wirk) {
				const l = s.spur[s.spur.length - 1];
				if (!l || Math.hypot(l.x - s.m.x, l.y - s.m.y) * s.f > 5) {
					s.spur.push({ x: s.m.x, y: s.m.y, alter: 0 });
					if (s.spur.length > SPUR_MAX) s.spur.shift();
				}
			}
			// Neu gezeichnet wird mit 30 Hz (mit Spur 60 Hz), sonst bleibt das Bild stehen
			const takt = Math.floor(t * (wirk || s.spur.length ? 60 : 30));
			const grund = `${s.W}x${s.H}|${s.dpr}|${s.mode}`;
			if (!reduced && s.takt === takt && s.grund === grund) return;
			// Bei reduzierter Bewegung nur neu zeichnen, wenn sich die Größe ändert
			if (reduced && s.sig === grund) return;
			s.sig = grund;
			s.takt = takt;
			s.grund = grund;
			const dpr = s.dpr;
			const f = s.f;
			ctx.globalCompositeOperation = 'source-over';
			ctx.globalAlpha = 1;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			// Ab hier im Szenenraum
			ctx.setTransform(dpr * f, 0, 0, dpr * f, dpr * s.ox, dpr * s.oy);
			const x0 = -s.ox / f;
			const x1 = (s.W - s.ox) / f;
			const y0 = -s.oy / f;
			const y1 = (s.H - s.oy) / f;
			const d = ABST / f; // Linienabstand im Szenenraum
			const px = 1 / f; // ein CSS-px
			const rise = Math.min(1, t / 6);
			const sr = BH * 0.62;
			const cx = BW / 2;
			const sy = BH + sr * 0.35 - rise * sr * 0.55;
			const hoch = s.mode === 'hoch';
			// Hoch liegt die Sonne ganz hinter Titel und Knöpfen: weniger tiefe Aussparung, Strahlen länger
			const boden = hoch ? 0.32 : 0.2;
			const strahl = hoch ? 260 : 190;
			ctx.lineCap = 'round';
			ctx.strokeStyle = '#FAFAFA';

			// Scheibe: Ringe, deren Breite dem Ton folgt (innen kräftiger, zum Rand schmaler), mit leiser Welle
			const sichtbar = (r: number): [number, number] | null => {
				// Winkelbereich des Rings, der im Bild liegt (grob, mit Rand)
				if (sy - r > y1 + 8 || cx + r < x0 - 8 || cx - r > x1 + 8) return null;
				if (sy + r < y0 - 8) return null;
				return [0, 2 * Math.PI];
			};
			const tz = t * 0.35;
			for (let r = sr - d * 3.2; r > d * 0.6; r -= d) {
				if (!sichtbar(r)) continue;
				const u = r / sr;
				const ton = 0.3 + 0.6 * (1 - u) + (vnz(r * 0.04, tz) - 0.5) * 0.25;
				const breite = d * (0.14 + 0.5 * cl(ton) ** 1.2);
				const n = Math.max(24, Math.ceil((2 * Math.PI * r) / (px * 7)));
				ctx.globalAlpha = u < 0.72 ? 0.95 : 0.8;
				ctx.lineWidth = breite;
				ctx.beginPath();
				let an = false;
				for (let i = 0; i <= n; i++) {
					const a = (i / n) * 2 * Math.PI;
					const rr =
						r + (vnz(Math.cos(a) * 2.2 + r * 0.05, Math.sin(a) * 2.2 + tz) - 0.5) * d * 0.5;
					const x = cx + Math.cos(a) * rr;
					const y = sy + Math.sin(a) * rr;
					if (y < y0 - 10 || y > y1 + 10 || x < x0 - 10 || x > x1 + 10) {
						an = false;
						continue;
					}
					if (an) ctx.lineTo(x, y);
					else ctx.moveTo(x, y);
					an = true;
				}
				ctx.stroke();
			}
			// Kontur: drei dichte Ringe
			ctx.globalAlpha = 0.95;
			for (let q = 0; q < 3; q++) {
				const r = sr - (q - 0.2) * d * 0.9;
				ctx.lineWidth = d * (q === 1 ? 0.62 : 0.34);
				ctx.beginPath();
				ctx.arc(cx, sy, r, 0, 2 * Math.PI);
				ctx.stroke();
			}
			// Strahlen: Bündel aus feinen Radiallinien, die nach außen in drei Stufen verblassen
			const ray0 = t * 0.03;
			const B = 30;
			ctx.lineWidth = Math.max(0.55 * px, d * 0.14);
			for (let b = 0; b < B; b++) {
				const am = (b / B) * 2 * Math.PI + ray0;
				const lang = strahl * (0.35 + 1.1 * hsh(b, 31));
				const breit = 0.012 + 0.03 * hsh(b, 32);
				const m = 3 + Math.floor(hsh(b, 33) * 4);
				for (let i = 0; i < m; i++) {
					const a = am + (i / (m - 1) - 0.5) * breit;
					const len = lang * (0.45 + 0.55 * (1 - Math.abs(i / (m - 1) - 0.5) * 1.2));
					const ca = Math.cos(a);
					const sa = Math.sin(a);
					const r0 = sr + d * (2.4 + 0.5 * i);
					const r1 = r0 + len;
					if (sy + sa * r1 > y1 + 400 && sy + sa * r0 > y1 + 400) continue;
					for (let st = 0; st < 3; st++) {
						const ra = r0 + (len * st) / 3;
						const rb = r0 + (len * (st + 1)) / 3;
						ctx.globalAlpha = [0.6, 0.34, 0.14][st] ?? 0.1;
						ctx.beginPath();
						ctx.moveTo(cx + ca * ra, sy + sa * ra);
						ctx.lineTo(cx + ca * rb, sy + sa * rb);
						ctx.stroke();
					}
				}
			}
			ctx.globalAlpha = 1;

			// Aussparung hinter Schlagzeile und Knöpfen (alle Linien dort bis auf „boden“ gedämpft)
			if (loop.n % 20 === 0 || !s.box) s.box = messeAussparung(flaeche);
			const box = s.box;
			if (box) {
				const key = `${flaeche.width}x${flaeche.height}|${dpr}|${boden}|${box.x0 | 0},${box.y0 | 0},${box.x1 | 0},${box.y1 | 0}`;
				const m = s.maskeKey === key && s.maske ? s.maske : baueMaske(s, box, boden, key);
				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.globalCompositeOperation = 'destination-out';
				ctx.drawImage(m, 0, 0);
				ctx.restore();
			}
			// Zeiger löscht Linien unter sich (weicher Kreis), Hintergrund bleibt Schwarz
			if (wirk) {
				const md = 120;
				const g = ctx.createRadialGradient(s.sm.x, s.sm.y, 0, s.sm.x, s.sm.y, md);
				g.addColorStop(0, `rgba(10,10,10,${0.9 * wirk})`);
				g.addColorStop(1, 'rgba(10,10,10,0)');
				ctx.fillStyle = g;
				ctx.fillRect(s.sm.x - md, s.sm.y - md, 2 * md, 2 * md);
			}
			// Zeigerspur: drei Haarlinien, die mit dem Alter verblassen und sich zur Spitze verjüngen
			if (s.spur.length > 1) {
				ctx.lineWidth = 0.9 * px;
				ctx.strokeStyle = '#FAFAFA';
				for (let i = 1; i < s.spur.length; i++) {
					const a = s.spur[i - 1];
					const b = s.spur[i];
					if (!a || !b) continue;
					const al = (1 - ss(b.alter / SPUR_ZEIT)) * (i / s.spur.length) ** 0.5;
					if (al < 0.03) continue;
					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const l = Math.hypot(dx, dy) || 1;
					const nx = (-dy / l) * 3 * px;
					const ny = (dx / l) * 3 * px;
					ctx.globalAlpha = al * 0.8;
					for (let o = -1; o <= 1; o++) {
						ctx.beginPath();
						ctx.moveTo(a.x + nx * o, a.y + ny * o);
						ctx.lineTo(b.x + nx * o, b.y + ny * o);
						ctx.stroke();
					}
				}
				ctx.globalAlpha = 1;
			}
		},
	});
}
