// Die acht Körper: das Zeichen als Kugeln mit Verlet-Physik. Greifen, Werfen, Anstoßen. Nach einer Weile
// ziehen die Körper zurück in das Zeichen. Szenenraum: Bezugsbox 1280 x 760, die Wände sind die Ränder
// der ganzen Fläche.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { AB, hsh, ss } from '../../core/math';

// Maßstab der Kugeln im Szenenraum: quer groß (die Wolke füllt etwa zwei Drittel der Breite), hoch passt sie in die Boxbreite 600
const S_QUER = 1.5;
const S_HOCH = 1.28;
const sOf = (s: SceneState): number => (s.mode === 'hoch' ? S_HOCH : S_QUER);
const st = 3; // feiner Halbton (Zellen 3 statt 6 px)
const NAME = 11; // Namen auf den Kugeln: Mono 11 px (hoch 10 px), Versalien mit Laufweite, ohne Platte
// Die acht Bereiche der App, je Kugel einer
const NAMEN = [
	'Ausgaben',
	'Einkauf',
	'Putzen',
	'Pinnwand',
	'Fixkosten',
	'Vorräte',
	'Kalender',
	'Chat',
];
const REACH = 22; // Trefferrand um jeden Körper in CSS-px (Touch)

/** Ein Körper: Lage (x, y), Lage im Schritt davor (px, py, Verlet), Radius r, Ruhelage im Ring (hx, hy), Name n. */
interface Koerper {
	x: number;
	y: number;
	px: number;
	py: number;
	r: number;
	hx: number;
	hy: number;
	n: string;
	/** Halbton-Sprites je Lichtrichtung und Abstand (siehe sprite). */
	sp: Map<string, HTMLCanvasElement>;
}

/** Berührung, die erst bei waagerechter Bewegung zum Greifen wird: Körper i (oder -1), Startpunkt. */
interface Anfasser {
	i: number;
	x: number;
	y: number;
}

/** Schreibt api.wurf (Tastatur): alle Körper bekommen einen Stoß nach oben. */
export interface KoerperApi {
	wurf?: () => void;
}

interface KoerperState extends SceneState {
	// resize (homes) läuft schon beim Anmelden, vor init: alles, was homes vor dem ersten Bild liest, ist optional
	cx: number;
	cy: number;
	tbU?: number;
	B?: Koerper[];
	idle: number;
	ring: boolean | undefined;
	auto?: boolean;
	grab: number;
	pend?: Anfasser | null;
	sig?: number;
}

/** Wände der Fläche und Titelblock im Szenenraum (siehe frame). */
interface Wand {
	x0: number;
	x1: number;
	y0: number;
	floor: number;
	xm: number;
	hw: number;
	tiefe: number;
	ob: { x0: number; x1: number; y0: number; y1: number } | null;
}

// Ruhelage des Rings. Quer: Mitte der Bezugsbox 1280 x 760. Hoch: eigene Bezugsbox von 600 Einheiten Breite,
// der Ring (481 Einheiten) füllt so etwa 80 % der Breite und liegt unter dem Titel in der Mitte des Rests.
function homes(s: KoerperState) {
	const S = sOf(s);
	let cx = 640;
	let cy = 400;
	const oben0 = Math.min(...AB.map((c) => (c[1] - 173) * S - c[2] * S * 0.98));
	const unten0 = Math.max(...AB.map((c) => (c[1] - 173) * S + c[2] * S * 0.98));
	const t = s.host.querySelector<HTMLElement>('[data-titel]');
	if (s.mode === 'hoch') {
		// eine frühere Quer-Lage (Modus beginnt als quer, auch beim Drehen) zurücknehmen, sonst klafft über dem Titel eine Lücke
		t?.style.removeProperty('--titel-top');
		const tb = t ? t.offsetTop + t.offsetHeight : 0;
		cx = s.bw / 2;
		// Unterkante des Titels samt Abstand in Szenen-Einheiten: Ring und Decke bleiben darunter
		s.tbU = (tb + 14 - s.oy) / s.f;
		cy = Math.max((tb + (s.H - tb) / 2 - s.oy) / s.f, s.tbU - oben0);
	} else if (t) {
		// Quer: Titelblock und Kugelwolke bilden eine Gruppe, die im Bild (unter dem Kopf, über dem Boden) mittig steht.
		// Der Titel sitzt 36 px über der Wolke, nie näher als eine Stufe unter dem Kopf.
		const kopf =
			document.querySelector<HTMLElement>('[data-kopf]')?.getBoundingClientRect().bottom ?? 64;
		const vis = Math.min(s.H, innerHeight);
		const th = t.offsetHeight;
		const ringH = (unten0 - oben0) * s.f;
		const von = Math.max(0, kopf - s.el.getBoundingClientRect().top) + 14;
		const bis = vis - 48;
		const gruppe = th + 36 + ringH;
		const top = von + Math.max(0, (bis - von - gruppe) / 2);
		t.style.setProperty('--titel-top', `${Math.round(top)}px`);
		cy = (top + th + 36 + ringH / 2 - s.oy) / s.f - (oben0 + unten0) / 2;
	}
	s.cx = cx;
	s.cy = cy;
	if (!s.B) return;
	AB.forEach((c, i) => {
		const b = s.B?.[i];
		if (!b) return;
		b.r = c[2] * S * 0.98;
		b.hx = cx + (c[0] - 208) * S;
		b.hy = cy + (c[1] - 173) * S;
		if (s.idle >= 3.5 || s.ring) {
			b.x = b.px = b.hx;
			b.y = b.py = b.hy;
		}
	});
}

// Körper greifen (Maus sofort, Touch nach waagerechter Bewegung)
function greife(s: KoerperState, best: number) {
	s.pend = null;
	s.auto = false;
	s.grab = best;
	s.idle = 0;
	s.ring = false;
}

function onDownBody(s: KoerperState) {
	const B = s.B;
	if (!B) return;
	const touch = s.m.type !== 'mouse';
	const reach = Math.max(10, REACH / s.f);
	let best = -1;
	let bd = 1e9;
	B.forEach((b, i) => {
		const d = Math.hypot(b.x - s.m.x, b.y - s.m.y) - b.r;
		if (d < reach && d < bd) {
			bd = d;
			best = i;
		}
	});
	// Ein Wisch daneben ist Scrollen und stört die Körper nicht.
	if (touch && best < 0) return;
	// Touch (Canvas hat touch-action: pan-y): Die Seite scrollt immer, wenn die Geste senkrecht
	// beginnt (der Browser meldet dann pointercancel). Gegriffen wird erst bei einer überwiegend
	// waagerechten Bewegung (onMove), ein Antippen gibt dem Körper einen Stoß (onUp).
	if (touch) {
		s.pend = { i: best, x: s.m.x, y: s.m.y };
		return;
	}
	greife(s, best);
	if (best < 0)
		for (const b of B) {
			const dx = b.x - s.m.x;
			const dy = b.y - s.m.y;
			const d = Math.hypot(dx, dy) + 1;
			b.px -= (dx / d) * 18;
			b.py -= (dy / d) * 18;
		}
}

// Ein fester 60-Hz-Schritt der Physik (Verlet): Trägheit, Zug in den Ring, Greifen, Kollisionen, Wände.
function schritt(s: KoerperState, B: Koerper[], w: Wand) {
	const { x0, x1, y0, floor, xm, hw, tiefe, ob } = w;
	s.idle += 1 / 60;
	const loose = s.idle < 3.5;
	const G = loose ? 0.45 : 0;
	for (const b of B) {
		const vx = (b.x - b.px) * 0.985;
		const vy = (b.y - b.py) * 0.985;
		b.px = b.x;
		b.py = b.y;
		b.x += vx;
		b.y += vy + G;
		if (!loose) {
			b.x += (b.hx - b.x) * 0.06;
			b.y += (b.hy - b.y) * 0.06;
		}
	}
	const gb = s.grab >= 0 && s.m.in ? B[s.grab] : undefined;
	if (gb) {
		gb.x += (s.m.x - gb.x) * 0.5;
		gb.y += (s.m.y - gb.y) * 0.5;
	}
	for (let it = 0; it < 4; it++) {
		for (let i = 0; i < 8; i++)
			for (let j = i + 1; j < 8; j++) {
				const a = B[i];
				const c = B[j];
				if (!a || !c) continue;
				const dx = c.x - a.x;
				const dy = c.y - a.y;
				const d = Math.hypot(dx, dy) || 1;
				const m = a.r + c.r;
				if (d < m) {
					const o = ((m - d) / 2) * (loose ? 1 : 0.3);
					const ox = (dx / d) * o;
					const oy = (dy / d) * o;
					a.x -= ox;
					a.y -= oy;
					c.x += ox;
					c.y += oy;
				}
			}
		for (const b of B) {
			if (b.x < x0 + b.r) b.x = x0 + b.r;
			if (b.x > x1 - b.r) b.x = x1 - b.r;
			if (b.y < y0 + b.r) b.y = y0 + b.r;
			if (ob) {
				const cx = Math.max(ob.x0, Math.min(b.x, ob.x1));
				const cy = Math.max(ob.y0, Math.min(b.y, ob.y1));
				const dx = b.x - cx;
				const dy = b.y - cy;
				const d = Math.hypot(dx, dy);
				if (d < b.r && d > 1e-6) {
					const k = (b.r - d) / d;
					b.x += dx * k;
					b.y += dy * k;
				} else if (d <= 1e-6) {
					// Mittelpunkt im Block: kürzester Weg hinaus
					const l = b.x - ob.x0;
					const rr = ob.x1 - b.x;
					const t = b.y - ob.y0;
					const bt = ob.y1 - b.y;
					const mn = Math.min(l, rr, t, bt);
					if (mn === l) b.x = ob.x0 - b.r;
					else if (mn === rr) b.x = ob.x1 + b.r;
					else if (mn === t) b.y = ob.y0 - b.r;
					else b.y = ob.y1 + b.r;
				}
			}
			const u = Math.max(-1, Math.min(1, (b.x - xm) / hw));
			const fy = floor - tiefe * u * u;
			if (b.y > fy - b.r) {
				b.y = fy - b.r;
				b.py = b.y + (b.y - b.py) * 0.4;
				b.x -= ((2 * tiefe * u) / hw) * G * 0.8; // Hangabtrieb zur Mitte
			}
		}
	}
}

// Halbton eines Körpers (Zellen 3 px) in ein Sprite gebacken, für Lichtrichtung ai (von 32) und Abstand di (von 4)
function sprite(s: KoerperState, b: Koerper, ai: number, di: number): HTMLCanvasElement | null {
	const pw = Math.ceil((2 * b.r + 4) * s.f * s.dpr);
	const cv = document.createElement('canvas');
	cv.width = pw;
	cv.height = pw;
	const g = cv.getContext('2d');
	if (!g) return null;
	const u = pw / (2 * b.r + 4);
	g.setTransform(u, 0, 0, u, 0, 0);
	g.fillStyle = '#FAFAFA';
	const ang = (ai / 32) * 2 * Math.PI - Math.PI;
	const dist = [90, 240, 550, 1400][di] ?? 1400;
	const qLx = Math.cos(ang) * dist;
	const qLy = Math.sin(ang) * dist;
	const LL = Math.hypot(qLx, qLy, 200);
	const c0 = b.r + 2;
	const n = Math.ceil(b.r / st);
	g.beginPath();
	for (let j = -n; j <= n; j++)
		for (let i = -n; i <= n; i++) {
			const nx = (i * st) / b.r;
			const ny = (j * st) / b.r;
			const q = nx * nx + ny * ny;
			if (q > 1) continue;
			const nz = Math.sqrt(1 - q);
			const lam = Math.max(0, (nx * qLx + ny * qLy + nz * 200) / LL);
			const v = 0.08 + 0.92 * lam * lam;
			const rr = st * 0.5 * Math.sqrt(v);
			g.rect(c0 + i * st - rr, c0 + j * st - rr, rr * 2, rr * 2);
		}
	g.fill();
	return cv;
}

/** Meldet die Körper-Szene an. Gibt die Abmeldung zurück. */
/** api.wurf() (Tastatur): alle Körper bekommen einen Stoß nach oben, wie ein Antippen (Koerper.tsx). */
export function registerKoerper(cv: HTMLCanvasElement, api: KoerperApi = {}) {
	return register<KoerperState>({
		name: 'koerper',
		el: cv,
		host: cv.parentElement ?? cv,
		box: (_W, _H, _safeH, mode) =>
			mode === 'hoch' ? { bw: 600, bh: 1, align: 'top' } : { bw: 1280, bh: 760 },
		dprCap: 1.5,
		touchCap: 1.5,
		minSicht: 0.1,
		resize: homes,
		init(s) {
			const B: Koerper[] = AB.map((c, i) => ({
				x: 0,
				y: 0,
				px: 0,
				py: 0,
				r: c[2] * S_QUER * 0.98,
				hx: 0,
				hy: 0,
				n: NAMEN[i]?.toUpperCase() ?? '',
				sp: new Map(),
			}));
			api.wurf = () => {
				s.auto = false;
				s.ring = false;
				s.idle = 0;
				B.forEach((b, i) => {
					b.px = b.x + (hsh(i, 7) - 0.5) * 12;
					b.py = b.y + 16;
				});
			};
			s.B = B;
			s.idle = 99;
			s.ring = undefined;
			s.grab = -1;
			homes(s);
			for (const b of B) {
				b.x = b.px = b.hx;
				b.y = b.py = b.hy;
			}
			// Messhaken: Körper in Bildschirm-CSS-px (Mitte, Radius)
			qa.koerper = () => {
				const rc = cv.getBoundingClientRect();
				return {
					idle: s.idle,
					ring: !!s.ring,
					grab: s.grab,
					bodies: B.map((b) => ({
						x: rc.left + s.ox + b.x * s.f,
						y: rc.top + s.oy + b.y * s.f,
						r: b.r * s.f,
					})),
				};
			};
		},
		onDown: onDownBody,
		onMove(s) {
			const p = s.pend;
			if (!p || !s.m.down) return;
			const dx = s.m.x - p.x;
			const dy = s.m.y - p.y;
			const min = 8 / s.f;
			if (Math.abs(dx) > min && Math.abs(dx) > Math.abs(dy)) greife(s, p.i);
		},
		onUp(s, e) {
			// Antippen (kein Abbruch durch Scrollen): der Körper bekommt einen Stoß nach oben
			const p = s.pend;
			s.pend = null;
			const b = p ? s.B?.[p.i] : undefined;
			if (p && b && e.type === 'pointerup') {
				s.auto = false;
				s.ring = false;
				s.idle = 0;
				b.px = b.x + (hsh(p.i, 7) - 0.5) * 12;
				b.py = b.y + 16;
			}
			// Loslassen verlängert die lose Phase nur, wenn ein Körper gegriffen war
			if (s.grab >= 0) s.idle = 0;
			s.grab = -1;
		},
		frame(s, _t, dt) {
			const ctx = s.ctx;
			const B = s.B;
			if (!ctx || !s.cv || !B) return;
			// Flächenränder im Szenenraum: Wände links und rechts, Decke und Boden
			const x0 = -s.ox / s.f;
			const x1 = (s.W - s.ox) / s.f;
			// Hochformat: die Decke ist die Unterkante des Titels, nicht der Abschnittsrand
			const y0 = s.mode === 'hoch' && s.tbU !== undefined ? s.tbU : -s.oy / s.f;
			const y1 = (s.H - s.oy) / s.f;
			// T-12: Die Körper ruhen als Ring. Der Einfall des Entwurfs beginnt erst, wenn der Abschnitt
			// zu mindestens 70 % im Bild ist, und setzt zurück, wenn er (fast) ganz verlassen ist.
			const r = s.host.getBoundingClientRect();
			const sicht =
				(Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / Math.min(r.height, innerHeight);
			if (s.ring === undefined) {
				s.ring = s.reduced || sicht < 0.7;
				s.idle = s.ring ? 99 : 0;
			}
			if (s.ring && sicht >= 0.7 && !s.m.down && !s.reduced) {
				// Einfall: leicht versetzt, damit der Ring nicht senkrecht als Block fällt
				s.ring = false;
				s.auto = true;
				s.idle = 0;
				B.forEach((b, i) => {
					b.px -= (hsh(i, 5) - 0.5) * 3;
				});
			} else if (!s.ring && sicht < 0.1) {
				s.ring = true;
				s.idle = 99;
				for (const b of B) {
					b.x = b.px = b.hx;
					b.y = b.py = b.hy;
				}
			}
			// Gegriffen, aber der Zeiger ist längst weg (Maus außerhalb losgelassen): loslassen
			if (s.grab >= 0 && !s.m.down) {
				s.grab = -1;
				s.idle = 0;
			}
			// Überschrift als feste Fläche: die Körper prallen an Titelblock (Zeile, Überschrift, Hinweis) ab und
			// liegen nie darüber. Im Hochformat ist die Unterkante des Titels bereits die Decke.
			const ti = s.mode === 'hoch' ? null : s.host.querySelector('[data-titel]');
			let ob: Wand['ob'] = null;
			if (ti) {
				const q = ti.getBoundingClientRect();
				const pad = 10;
				ob = {
					x0: (q.left - r.left - s.ox - pad) / s.f,
					x1: (q.right - r.left - s.ox + pad) / s.f,
					y0: (q.top - r.top - s.oy - pad) / s.f,
					y1: (q.bottom - r.top - s.oy + pad) / s.f,
				};
			}
			// Boden: unten der Flächenrand, in der losen Phase höchstens die Unterkante des Bildschirms,
			// damit nichts außerhalb des Bildes liegen bleibt
			const loose0 = s.idle < 3.5;
			const visB = (innerHeight - r.top - s.oy) / s.f;
			// Boden bei etwa 80 % der sichtbaren Höhe: Titel und Körper bleiben ein Bild
			const floor = loose0
				? Math.min(y1, Math.max(y0 + (visB - y0) * 0.88, y0 + (y1 - y0) * 0.5))
				: y1;
			// Der Boden ist eine flache Mulde (Ränder 7 % der Breite höher): die Körper rollen zur Mitte und legen sich
			// aufeinander, statt in einer Reihe am unteren Rand zu liegen
			const wand: Wand = {
				x0,
				x1,
				y0,
				floor,
				xm: (x0 + x1) / 2,
				hw: Math.max(1, (x1 - x0) / 2),
				tiefe: 0.07 * (x1 - x0),
				ob,
			};
			// Physik im festen 60-Hz-Schritt (Verlet), unabhängig von der Bildrate
			s.step(dt, 1 / 60, () => schritt(s, B, wand));
			const loose = s.idle < 3.5;
			s.cv.style.cursor = s.grab >= 0 ? 'grabbing' : 'grab';
			// Lose Phase oder gegriffen: volle Bildrate (loop.js drosselt im Stand auf 60 Hz)
			if (loose || s.grab >= 0) loop.act = loop.now;
			const lx = s.m.in ? s.m.x : s.cx - 256;
			const ly = s.m.in ? s.m.y : s.cy - 248;
			// Ruhen die Körper (Ring gezogen, Zeiger still), bleibt das letzte Bild stehen: kein Neuzeichnen
			let sig =
				s.W * 7 + s.H + s.f * 1000 + s.dpr * 100 + loop.fv + (loose ? 0.5 : 0) + (s.grab + 2) * 3e4;
			sig = (sig + Math.round(lx) * 131 + Math.round(ly) * 17) % 1e9;
			for (const b of B) sig = (sig * 31 + Math.round(b.x * 50) * 7 + Math.round(b.y * 50)) % 1e9;
			// Übergang in die Tiefe: Beim Hinausscrollen fallen die Körper vom Betrachter weg zur Bildschirmmitte und
			// werden zu Staubkörnern (aus = 0 mit der Abschnittskante oben, 1 bei 80 % hinaus)
			const aus = s.reduced ? 0 : ss(-r.top / (0.8 * r.height));
			const vx = (x0 + x1) / 2;
			const vy = (Math.min(innerHeight / 2 - r.top, s.H - 60) - s.oy) / s.f;
			sig = (sig + Math.round(aus * 1000) * 13) % 1e9;
			if (sig === s.sig && !s.stale) return;
			s.sig = sig;
			s.stale = false;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			s.scene();
			// Halbton je Körper einmal in ein Sprite gebacken (Zellen 3 px), je Lichtrichtung in 32 Winkeln und
			// 4 Abständen. Je Bild nur noch drawImage statt tausender Rechtecke.
			ctx.imageSmoothingEnabled = true;
			const skey = `${s.f.toFixed(3)}|${s.dpr}|${Math.round(sOf(s) * 100)}`;
			for (const b of B) {
				const Lx = lx - b.x;
				const Ly = ly - b.y;
				const dd = Math.hypot(Lx, Ly);
				const ai = Math.round(((Math.atan2(Ly, Lx) + Math.PI) / (2 * Math.PI)) * 32) % 32;
				const di = dd < 150 ? 0 : dd < 350 ? 1 : dd < 800 ? 2 : 3;
				const k = `${skey}|${ai}|${di}`;
				const cache = b.sp;
				let e = cache.get(k);
				if (!e) {
					const neu = sprite(s, b, ai, di);
					if (!neu) continue;
					e = neu;
					cache.set(k, e);
					const aelteste = cache.keys().next().value;
					if (cache.size > 90 && aelteste !== undefined) cache.delete(aelteste);
				}
				const kt = 1 - 0.93 * aus;
				const sz = (2 * b.r + 4) * kt;
				ctx.globalAlpha = 1 - 0.5 * ss((aus - 0.6) / 0.4);
				ctx.drawImage(e, vx + (b.x - vx) * kt - sz / 2, vy + (b.y - vy) * kt - sz / 2, sz, sz);
			}
			// Namen: Mono 11 px (hoch 10 px) mit Laufweite, ohne Platte, dunkler Saum statt Kasten, nur in der losen Phase
			ctx.font = `500 ${(s.mode === 'hoch' ? NAME - 1 : NAME) / s.f}px "JetBrains Mono", monospace`;
			if ('letterSpacing' in ctx) ctx.letterSpacing = `${(0.08 * NAME) / s.f}px`;
			ctx.lineJoin = 'round';
			ctx.lineWidth = 4 / s.f;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.globalAlpha = 1;
			if (loose && aus < 0.02)
				for (const b of B) {
					ctx.strokeStyle = 'rgba(10,10,10,0.85)';
					ctx.strokeText(b.n, b.x, b.y);
					ctx.fillStyle = '#FAFAFA';
					ctx.fillText(b.n, b.x, b.y);
				}
		},
	});
}
