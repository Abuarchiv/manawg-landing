// Der Planet: eine Kugel aus Punkten mit dem Zeichen als Land, acht Orte als Marken. Waagerechtes Ziehen
// dreht ihn, Antippen oder Anklicken von Marke oder Beschriftung wählt einen Ort.
// Quer: Bezugsbox 1280 x 800, Planet bei (820, 430), R 300. Hoch: Szenenraum = CSS-px, der Planet liegt
// im Streifen zwischen Titel und Karte mit R = min(0,42 W, 0,3 H). Senkrechte Wische scrollen immer die Seite
// (touch-action: pan-y am Canvas).

import { pointerIn } from '../../core/canvas';
import { type SceneState, loop, qa, register } from '../../core/loop';
import { AB, aMark, cl, hsh, lerp, ss } from '../../core/math';
import { PL } from './orte';

const MONO = '"JetBrains Mono", monospace';
const VMAX = 0.03; // Trägheit: höchstens 0,03 rad je festem Schritt
const HIT = 44; // Mindest-Trefferfläche in CSS-px
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

type Vec = [x: number, y: number, z: number];
/** Punkt der Kugel: Lage auf der Einheitskugel und 1 = Land (Zeichen), 0 = Meer. */
type KugelPunkt = [x: number, y: number, z: number, land: number];

/** Läufer zwischen zwei Orten (a nach b, Fortschritt t) mit Spur tr und aktueller Lage u. */
interface Laeufer {
	a: number;
	b: number;
	t: number;
	tr: Vec[];
	u?: Vec;
}

/** Trefferfläche eines Orts (Szenenraum), Mitte der Marke (mx, my), pl = Platte der Beschriftung. */
interface Treffer {
	i: number;
	x0: number;
	x1: number;
	y0: number;
	y1: number;
	mx: number;
	my: number;
	front: boolean;
	pl: [x: number, y: number, w: number, h: number] | null;
}

interface PlanetState extends SceneState {
	// resize (layout) läuft schon beim Anmelden, vor init
	cx: number;
	cy: number;
	R: number;
	PT: KugelPunkt[];
	LM: Vec[];
	yaw: number;
	pitch: number;
	vy: number;
	tgt: number | null;
	hov: number;
	/** Bewegung seit pointerdown (Antippen unter 6 px). */
	mv: number;
	hits: Treffer[];
	lastSel: number;
	walk: Laeufer[];
	stars: Vec[];
	/** Zeiger beim letzten Ziehen. */
	px: number;
	py: number;
}

/** Planeten-Anmeldung: getSel liefert den gewählten Ort, onSelect(i) setzt ihn, api.face(i) dreht ihn nach vorn. */
export interface PlanetApi {
	face?: ((i: number) => void) | undefined;
}
interface PlanetOptionen {
	getSel: () => number;
	onSelect: (i: number) => void;
	api?: PlanetApi | undefined;
}

// Lage des Planeten. Hoch: im Streifen zwischen Titel und Karte, beide aus dem DOM gemessen.
function layout(s: PlanetState) {
	if (s.mode === 'hoch') {
		const t = s.host.querySelector<HTMLElement>('[data-titel]');
		const k = s.host.querySelector<HTMLElement>('[data-karte]');
		const top = t ? t.offsetTop + t.offsetHeight : 0;
		const bot = k ? k.offsetTop : s.H;
		const band = Math.max(160, bot - top - 8);
		s.R = Math.max(70, Math.min(0.42 * s.W, 0.34 * s.H, band / 2.4));
		s.cx = s.W / 2;
		s.cy = top + 4 + band / 2;
	} else {
		s.cx = 820;
		s.cy = 430;
		s.R = 300;
	}
}

// Auswahl aus der Loslass-Position: kommt ohne pointermove aus, funktioniert also auf Touch
function pick(s: PlanetState, x: number, y: number): number {
	let best = -1;
	let bd = 1e9;
	for (const h of s.hits) {
		if (x < h.x0 || x > h.x1 || y < h.y0 || y > h.y1) continue;
		const d = Math.hypot(x - h.mx, y - h.my);
		if (d < bd) {
			bd = d;
			best = h.i;
		}
	}
	return best;
}

const nrm = (v: Vec): Vec => {
	const l = Math.hypot(v[0], v[1], v[2]) || 1;
	return [v[0] / l, v[1] / l, v[2] / l];
};

// Ein fester 60-Hz-Schritt: Trägheit und Eigendrehung (0,0025 rad je Schritt = 0,15 rad/s), Läufer
function drehe(s: PlanetState) {
	if (s.tgt != null && !s.m.down) {
		const d = wrap(s.tgt - s.yaw);
		if (Math.abs(d) < 0.003) {
			s.yaw = s.tgt;
			s.tgt = null;
		} else s.yaw += d * 0.09;
	} else if (!s.m.down) {
		s.vy = cl(s.vy * 0.95, -VMAX, VMAX);
		s.yaw += s.vy + (s.reduced ? 0 : 0.0025);
	}
	for (const w of s.walk) {
		if (!s.reduced) {
			w.t += 0.004;
			if (w.t >= 1) {
				w.a = w.b;
				let nb: number;
				do nb = Math.floor(Math.random() * 8);
				while (nb === w.a);
				w.b = nb;
				w.t = 0;
			}
		}
		const A = s.LM[w.a];
		const B2 = s.LM[w.b];
		if (!A || !B2) continue;
		const e = ss(w.t);
		w.u = nrm([lerp(A[0], B2[0], e), lerp(A[1], B2[1], e), lerp(A[2], B2[2], e)]);
		if (!s.reduced) {
			w.tr.push(w.u);
			if (w.tr.length > 60) w.tr.shift();
		} else w.tr.length = 0;
	}
}

/** Was die Zeichenschritte je Bild brauchen: Drehung, Übergang (ein, kz), Auswahl, Zeit, sichtbare Fläche. */
interface Ansicht {
	rot: (v: Vec | KugelPunkt) => Vec;
	ein: number;
	kz: number;
	sel: number;
	t: number;
	x0: number;
	x1: number;
	y0: number;
	y1: number;
}

// Sterne, Schein, Scheibe, Punkte der Kugel, Ring und Läufer
function zeichneKugel(s: PlanetState, ctx: CanvasRenderingContext2D, a: Ansicht) {
	const { rot, ein, kz, t, x0, x1, y0, y1 } = a;
	const CX = s.cx;
	const CY = s.cy;
	const R = s.R;
	ctx.fillStyle = '#FAFAFA';
	for (const st of s.stars) {
		ctx.globalAlpha =
			0.15 + 0.35 * st[2] * (s.reduced ? 0.8 : 0.6 + 0.4 * Math.sin(t * 2 + st[0] * 1280));
		ctx.fillRect(x0 + st[0] * (x1 - x0), y0 + st[1] * (y1 - y0), 1.2, 1.2);
	}
	const gl = ctx.createRadialGradient(CX, CY, R, CX, CY, R * 1.3);
	gl.addColorStop(0, 'rgba(250,250,250,0.12)');
	gl.addColorStop(1, 'rgba(250,250,250,0)');
	ctx.globalAlpha = kz;
	ctx.fillStyle = gl;
	ctx.beginPath();
	ctx.arc(CX, CY, R * 1.3, 0, 6.2832);
	ctx.arc(CX, CY, R, 0, 6.2832, true);
	ctx.fill('evenodd');
	ctx.fillStyle = '#0A0A0A';
	ctx.beginPath();
	ctx.arc(CX, CY, R, 0, 6.2832);
	ctx.fill();
	ctx.strokeStyle = 'rgba(250,250,250,0.35)';
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#FAFAFA';
	const du = cl(R / 300, 0.8, 1.2); // Punktgröße folgt dem Planetenradius
	s.PT.forEach((q, i) => {
		const v = rot(q);
		if (v[2] <= 0) return;
		const lam = Math.max(0, v[0] * -0.45 + v[1] * 0.55 + v[2] * 0.7);
		const al = q[3] ? 0.35 + 0.65 * lam : 0.15 + 0.3 * lam;
		const sz = (q[3] ? 2.6 : 1.6) * du;
		let x = v[0] * R;
		let y = -v[1] * R;
		if (ein < 1) {
			// Jeder Punkt startet mit eigener Verzögerung weit außen und dreht sich auf seinen Platz ein
			const u = ss((ein - 0.4 * hsh(i, 21)) / 0.6);
			const w = 1 - u;
			const d = 1 + w * (2.2 + 3 * hsh(i, 22));
			const th = w * (1.6 + hsh(i, 23));
			const c = Math.cos(th);
			const sn = Math.sin(th);
			[x, y] = [(x * c - y * sn) * d, (x * sn + y * c) * d];
			ctx.globalAlpha = al * (0.4 + 0.6 * v[2]) * (0.35 + 0.65 * u);
		} else ctx.globalAlpha = al * (0.4 + 0.6 * v[2]);
		ctx.fillRect(CX + x - sz / 2, CY + y - sz / 2, sz, sz);
	});
	ctx.globalAlpha = 0.25 * kz;
	ctx.strokeStyle = '#FAFAFA';
	ctx.beginPath();
	ctx.ellipse(CX, CY, R * 1.25, R * 0.28, -0.25, 0, 6.2832);
	ctx.stroke();
	ctx.globalAlpha = 1;
	for (const w of s.walk) {
		const u = w.u ?? s.LM[w.a];
		if (!u) continue;
		w.tr.forEach((pt, i) => {
			const v = rot(pt);
			if (v[2] <= 0) return;
			ctx.globalAlpha = (i / w.tr.length) * 0.8 * kz;
			ctx.fillRect(CX + v[0] * R * 1.01 - 1, CY - v[1] * R * 1.01 - 1, 2, 2);
		});
		const v = rot(u);
		if (v[2] > 0) {
			ctx.globalAlpha = kz;
			ctx.beginPath();
			ctx.arc(CX + v[0] * R * 1.015, CY - v[1] * R * 1.015, 4, 0, 6.2832);
			ctx.fill();
		}
	}
}

// Marken und Beschriftungen: klein und ohne Kasten. Marke 8 px (Hochformat 7 px), Beschriftung 10 CSS-px auf dem
// Bildschirm, lesbar über einen dunklen Schriftrand statt einer Platte. Die Trefferfläche bleibt unsichtbar groß.
// Gibt die Trefferflächen zurück.
function zeichneMarken(s: PlanetState, ctx: CanvasRenderingContext2D, a: Ansicht): Treffer[] {
	const { rot, kz, sel, t, x0, x1 } = a;
	const CX = s.cx;
	const CY = s.cy;
	const R = s.R;
	const klein = s.mode === 'hoch' || s.W <= 768;
	const ms = (klein ? 7 : 8) / s.f;
	const fs = 10 / s.f;
	const rand = (klein ? 16 : 4) / s.f;
	if ('letterSpacing' in ctx) ctx.letterSpacing = `${0.06 * fs}px`;
	const minHit = HIT / s.f;
	const pad = 4 / s.f;
	ctx.font = `500 ${fs}px ${MONO}`;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	const hits: Treffer[] = [];
	s.LM.forEach((pp, i) => {
		const v = rot(pp);
		if (v[2] <= 0.05) return;
		const bx = CX + v[0] * R;
		const by = CY - v[1] * R;
		const on = i === sel;
		const k = 1.13 + (on ? 0.05 : 0);
		const tx = CX + v[0] * R * k;
		const ty = CY - v[1] * R * k;
		const front = v[2] > 0.3;
		const show = front || on || i === s.hov;
		// Beschriftung auf der Außenseite, am Rand der Fläche nach innen geklappt
		const label = `${String(i + 1).padStart(2, '0')} ${(PL[i]?.[0] ?? '').toUpperCase()}`;
		const tw = ctx.measureText(label).width;
		const gap = ms / 2 + (on ? 12 : 7) / s.f;
		let right = v[0] >= 0;
		if (right && tx + gap + tw + pad > x1 - rand) right = false;
		else if (!right && tx - gap - tw - pad < x0 + rand) right = true;
		let lx = right ? tx + gap : tx - gap - tw;
		lx = cl(lx, x0 + rand + pad, x1 - rand - pad - tw);
		// Trefferfläche: Marker und Beschriftung, mindestens 44 x 44 CSS-px
		let hx0 = tx - ms / 2;
		let hx1 = tx + ms / 2;
		let hy0 = ty - ms / 2;
		let hy1 = ty + ms / 2;
		if (show) {
			hx0 = Math.min(hx0, lx - pad);
			hx1 = Math.max(hx1, lx + tw + pad);
			hy0 = Math.min(hy0, ty - fs * 0.8);
			hy1 = Math.max(hy1, ty + fs * 0.8);
		}
		const mx0 = (hx0 + hx1) / 2;
		const my0 = (hy0 + hy1) / 2;
		if (hx1 - hx0 < minHit) {
			hx0 = mx0 - minHit / 2;
			hx1 = mx0 + minHit / 2;
		}
		if (hy1 - hy0 < minHit) {
			hy0 = my0 - minHit / 2;
			hy1 = my0 + minHit / 2;
		}
		hits.push({
			i,
			x0: hx0,
			x1: hx1,
			y0: hy0,
			y1: hy1,
			mx: tx,
			my: ty,
			front,
			pl: show ? [lx - pad, ty - fs * 0.78, tw + pad * 2, fs * 1.56] : null,
		});
		const hv = i === s.hov;
		ctx.globalAlpha = Math.min(1, v[2] * 1.6) * kz;
		ctx.strokeStyle = '#FAFAFA';
		ctx.beginPath();
		ctx.moveTo(bx, by);
		ctx.lineTo(tx, ty);
		ctx.stroke();
		// Marke: Kontur, gefüllt nur beim aktiven Ort
		if (on || !klein) {
			ctx.fillStyle = on ? '#FAFAFA' : '#0A0A0A';
			ctx.fillRect(tx - ms / 2, ty - ms / 2, ms, ms);
		}
		ctx.strokeRect(tx - ms / 2 - 0.5, ty - ms / 2 - 0.5, ms + 1, ms + 1);
		if (on) {
			const pr = s.reduced ? 0.3 : (t * 0.8) % 1;
			ctx.globalAlpha = (1 - pr) * kz;
			ctx.beginPath();
			ctx.arc(tx, ty, klein ? 8 + pr * 6 : 8 + pr * 26, 0, 6.2832);
			ctx.stroke();
		}
		if (show) {
			// Beschriftung ohne Hintergrund: dunkler Rand hält sie auf den Punkten lesbar, Hover unterstreicht
			ctx.globalAlpha = (on || hv ? 1 : Math.max(0.85, Math.min(1, v[2] * 1.6))) * kz;
			ctx.lineJoin = 'round';
			ctx.lineWidth = 3.5 / s.f;
			ctx.strokeStyle = 'rgba(10,10,10,0.9)';
			ctx.strokeText(label, lx, ty);
			ctx.lineWidth = 1;
			ctx.fillStyle = '#FAFAFA';
			ctx.fillText(label, lx, ty);
			if (hv) {
				ctx.strokeStyle = '#FAFAFA';
				ctx.beginPath();
				ctx.moveTo(lx, ty + fs * 0.7);
				ctx.lineTo(lx + tw, ty + fs * 0.7);
				ctx.stroke();
			}
		}
	});
	ctx.globalAlpha = 1;
	if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
	return hits;
}

/**
 * Meldet den Planeten an. getSel() liefert den gewählten Ort, onSelect(i) setzt ihn.
 * api.face(i) dreht den Ort nach vorn (für die Ortsliste). Gibt die Abmeldung zurück.
 */
export function registerPlanet(cv: HTMLCanvasElement, { getSel, onSelect, api }: PlanetOptionen) {
	let S: PlanetState | null = null;
	const up = (e: PointerEvent) => {
		const s = S;
		if (!s || s.mv >= 6) return;
		const p = pointerIn(e, cv.getBoundingClientRect(), s);
		const i = pick(s, p.x, p.y);
		if (i >= 0) onSelect(i);
	};
	cv.addEventListener('pointerup', up);
	const stop = register<PlanetState>({
		name: 'planet',
		el: cv,
		host: cv.parentElement ?? cv,
		box: (W, _H, safeH, mode) => (mode === 'hoch' ? { bw: W, bh: safeH } : { bw: 1280, bh: 800 }),
		dprCap: 2,
		touchCap: 1.5,
		resize(s) {
			layout(s);
		},
		init(s) {
			S = s;
			s.PT = [];
			const N = 4200;
			for (let i = 0; i < N; i++) {
				const y = 1 - (2 * (i + 0.5)) / N;
				const r = Math.sqrt(1 - y * y);
				const th = i * 2.399963;
				const x = Math.cos(th) * r;
				const z = Math.sin(th) * r;
				const lon = Math.atan2(x, z);
				const lat = Math.asin(y);
				s.PT.push([
					x,
					y,
					z,
					aMark(208 + (lon / Math.PI) * 200, 173 - (lat / 1.5708) * 160) < 0 ? 1 : 0,
				]);
			}
			s.LM = AB.map((c): Vec => {
				const lon = ((c[0] - 208) / 200) * Math.PI;
				const lat = (-(c[1] - 173) / 160) * 1.5708;
				return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
			});
			s.yaw = 0.3;
			s.pitch = 0.25;
			s.vy = 0;
			s.tgt = null;
			s.hov = -1;
			s.mv = 99;
			s.hits = [];
			s.lastSel = -1;
			s.walk = [0, 1, 2, 3].map(
				(k): Laeufer => ({ a: k * 2, b: (k * 2 + 3) % 8, t: hsh(k, 3), tr: [] }),
			);
			qa.planet = () => s.yaw;
			qa.planetHits = () => {
				const rc = cv.getBoundingClientRect();
				return s.hits.map((h) => ({
					i: h.i,
					x: rc.left + s.ox + h.x0 * s.f,
					y: rc.top + s.oy + h.y0 * s.f,
					w: (h.x1 - h.x0) * s.f,
					h: (h.y1 - h.y0) * s.f,
					mx: rc.left + s.ox + h.mx * s.f,
					my: rc.top + s.oy + h.my * s.f,
					front: h.front,
					plate: h.pl && {
						x: rc.left + s.ox + h.pl[0] * s.f,
						y: rc.top + s.oy + h.pl[1] * s.f,
						w: h.pl[2] * s.f,
						h: h.pl[3] * s.f,
					},
				}));
			};
			if (api)
				api.face = (i) => {
					const v = s.LM[i];
					if (!v) return;
					s.tgt = -Math.atan2(v[0], v[2]);
					s.vy = 0;
					if (s.reduced) {
						s.yaw = s.tgt;
						s.tgt = null;
					}
				};
			s.stars = [];
			for (let q = 0; q < 260; q++) s.stars.push([hsh(q, 11), hsh(q, 12), hsh(q, 13)]);
		},
		onDown(s) {
			s.px = s.m.x;
			s.py = s.m.y;
			s.mv = 0;
			s.tgt = null;
		},
		onMove(s) {
			if (s.m.down) {
				const dx = s.m.x - s.px;
				const dy = s.m.y - s.py;
				s.mv += Math.abs(dx) + Math.abs(dy);
				s.vy = cl(dx * 0.006, -VMAX, VMAX);
				s.yaw += dx * 0.006;
				// Mit Touch dreht nur das waagerechte Ziehen, senkrechte Wische scrollen die Seite
				if (s.m.type === 'mouse') s.pitch = cl(s.pitch + dy * 0.004, -0.9, 0.9);
				s.px = s.m.x;
				s.py = s.m.y;
			}
		},
		onUp(s) {
			if (s.reduced) s.vy = 0;
			s.mv = 99;
		},
		frame(s, _t, dt) {
			const ctx = s.ctx;
			if (!ctx || !s.cv) return;
			const sel = getSel();
			if (sel !== s.lastSel) {
				// Karte und Titel haben ihre Höhe geändert: Lage neu messen
				s.lastSel = sel;
				layout(s);
			}
			const x0 = -s.ox / s.f;
			const x1 = (s.W - s.ox) / s.f;
			const y0 = -s.oy / s.f;
			const y1 = (s.H - s.oy) / s.f;
			s.step(dt, 1 / 60, () => drehe(s));
			const ca = Math.cos(s.yaw);
			const sa = Math.sin(s.yaw);
			const cb = Math.cos(s.pitch);
			const sb = Math.sin(s.pitch);
			const rot = (v: Vec | KugelPunkt): Vec => {
				const X = v[0] * ca + v[2] * sa;
				const Z1 = -v[0] * sa + v[2] * ca;
				return [X, v[1] * cb - Z1 * sb, v[1] * sb + Z1 * cb];
			};
			// Übergang aus der Tiefe: Beim Hereinscrollen zieht sich der Staub der Fahrt als Wirbel zur Kugel zusammen
			// (ein = 0 mit der Abschnittskante am unteren Rand, 1 kurz bevor sie oben ankommt). Kugelscheibe, Ring, Läufer
			// und Marken kommen erst im letzten Drittel dazu (kz).
			// Beim Hinausscrollen läuft derselbe Wirbel rückwärts: die Kugel zerstäubt wieder, bevor das Installieren kommt.
			const oben = s.el.getBoundingClientRect().top / s.H;
			const ein = s.reduced ? 1 : Math.min(ss((0.9 - oben) / 0.8), 1 - ss((-oben - 0.15) / 0.7));
			const kz = ss((ein - 0.65) / 0.35);
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			s.scene();
			const ansicht: Ansicht = { rot, ein, kz, sel, t: loop.t, x0, x1, y0, y1 };
			zeichneKugel(s, ctx, ansicht);
			s.hits = zeichneMarken(s, ctx, ansicht);
			// Zeigerposition (Maus): Auswahl-Hervorhebung aus der Trefferfläche, ohne Zeiger keine
			s.hov = s.m.in && s.m.type === 'mouse' ? pick(s, s.m.x, s.m.y) : -1;
			s.cv.style.cursor = s.m.down ? 'grabbing' : s.hov >= 0 ? 'pointer' : 'grab';
		},
		destroy() {
			cv.removeEventListener('pointerup', up);
		},
	});
	return () => {
		stop();
		if (api) api.face = undefined;
	};
}
