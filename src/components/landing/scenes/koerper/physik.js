// Die acht Körper: das Zeichen als Kugeln mit Verlet-Physik. Greifen, Werfen, Anstoßen. Nach einer Weile
// ziehen die Körper zurück in das Zeichen. Szenenraum: Bezugsbox 1280 x 760, die Wände sind die Ränder
// der ganzen Fläche.

import { qa, register } from '../../core/loop';
import { AB, hsh } from '../../core/math';
import { PL } from '../bereiche/orte';

const S = 1.15;
const NAME = 10; // Namensplatten: 10 CSS-px
const REACH = 22; // Trefferrand um jeden Körper in CSS-px (Touch)

// Ruhelage des Rings. Quer: Mitte der Bezugsbox 1280 x 760. Hoch: eigene Bezugsbox von 600 Einheiten Breite,
// der Ring (481 Einheiten) füllt so etwa 80 % der Breite und liegt unter dem Titel in der Mitte des Rests.
function homes(s) {
	let cx = 640;
	let cy = 400;
	if (s.mode === 'hoch') {
		const t = s.host.querySelector('[data-titel]');
		const tb = t ? t.offsetTop + t.offsetHeight : 0;
		cx = s.bw / 2;
		cy = (tb + (s.H - tb) / 2 - s.oy) / s.f;
	}
	s.cx = cx;
	s.cy = cy;
	if (!s.B) return;
	AB.forEach((c, i) => {
		const b = s.B[i];
		b.hx = cx + (c[0] - 208) * S;
		b.hy = cy + (c[1] - 173) * S;
		if (s.idle >= 3.5 || s.ring) {
			b.x = b.px = b.hx;
			b.y = b.py = b.hy;
		}
	});
}

/** Meldet die Körper-Szene an. Gibt die Abmeldung zurück. */
export function registerKoerper(cv) {
	return register({
		name: 'koerper',
		el: cv,
		host: cv.parentElement,
		box: (_W, _H, _safeH, mode) =>
			mode === 'hoch' ? { bw: 600, bh: 1, align: 'top' } : { bw: 1280, bh: 760 },
		dprCap: 2,
		touchCap: 1.5,
		resize: homes,
		init(s) {
			s.B = AB.map((c, i) => ({
				x: 0,
				y: 0,
				px: 0,
				py: 0,
				r: c[2] * S * 0.98,
				hx: 0,
				hy: 0,
				n: PL[i][0].toUpperCase(),
			}));
			s.idle = 99;
			s.ring = undefined;
			s.grab = -1;
			homes(s);
			for (const b of s.B) {
				b.x = b.px = b.hx;
				b.y = b.py = b.hy;
			}
			// Messhaken: Körper in Bildschirm-CSS-px (Mitte, Radius)
			qa.koerper = () => {
				const rc = s.cv.getBoundingClientRect();
				return {
					idle: s.idle,
					ring: !!s.ring,
					grab: s.grab,
					bodies: s.B.map((b) => ({
						x: rc.left + s.ox + b.x * s.f,
						y: rc.top + s.oy + b.y * s.f,
						r: b.r * s.f,
					})),
				};
			};
			s.onDownBody = () => {
				const touch = s.m.type !== 'mouse';
				const reach = Math.max(10, REACH / s.f);
				let best = -1;
				let bd = 1e9;
				s.B.forEach((b, i) => {
					const d = Math.hypot(b.x - s.m.x, b.y - s.m.y) - b.r;
					if (d < reach && d < bd) {
						bd = d;
						best = i;
					}
				});
				// Ein Wisch daneben ist Scrollen und stört die Körper nicht. Im automatischen Einfall liegt der
				// Haufen am unteren Rand: Touch greift dort nicht, sonst finge er das Scrollen ab.
				if (touch && (best < 0 || (s.auto && s.idle < 3.5))) return;
				s.auto = false;
				s.grab = best;
				s.idle = 0;
				s.ring = false;
				if (best < 0)
					for (const b of s.B) {
						const dx = b.x - s.m.x;
						const dy = b.y - s.m.y;
						const d = Math.hypot(dx, dy) + 1;
						b.px -= (dx / d) * 18;
						b.py -= (dy / d) * 18;
					}
			};
		},
		onDown(s) {
			s.onDownBody?.();
		},
		onUp(s) {
			// Loslassen verlängert die lose Phase nur, wenn ein Körper gegriffen war
			if (s.grab >= 0) s.idle = 0;
			s.grab = -1;
		},
		ownsTouch: (s) => s.grab >= 0,
		frame(s, _t, dt) {
			const ctx = s.ctx;
			// Flächenränder im Szenenraum: Wände links und rechts, Decke und Boden
			const x0 = -s.ox / s.f;
			const x1 = (s.W - s.ox) / s.f;
			const y0 = -s.oy / s.f;
			const y1 = (s.H - s.oy) / s.f;
			// T-12: Die Körper ruhen als Ring. Der Einfall des Entwurfs beginnt erst, wenn der Abschnitt
			// zu mindestens 70 % im Bild ist, und setzt zurück, wenn er (fast) ganz verlassen ist.
			const r = s.host.getBoundingClientRect();
			const sicht = (Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / Math.min(r.height, innerHeight);
			if (s.ring === undefined) {
				s.ring = s.reduced || sicht < 0.7;
				s.idle = s.ring ? 99 : 0;
			}
			if (s.ring && sicht >= 0.7 && !s.m.down && !s.reduced) {
				// Einfall: leicht versetzt, damit der Ring nicht senkrecht als Block fällt
				s.ring = false;
				s.auto = true;
				s.idle = 0;
				s.B.forEach((b, i) => {
					b.px -= (hsh(i, 5) - 0.5) * 3;
				});
			} else if (!s.ring && sicht < 0.1) {
				s.ring = true;
				s.idle = 99;
				for (const b of s.B) {
					b.x = b.px = b.hx;
					b.y = b.py = b.hy;
				}
			}
			// Gegriffen, aber der Zeiger ist längst weg (Maus außerhalb losgelassen): loslassen
			if (s.grab >= 0 && !s.m.down) {
				s.grab = -1;
				s.idle = 0;
			}
			// Boden: unten der Flächenrand, in der losen Phase höchstens die Unterkante des Bildschirms,
			// damit nichts außerhalb des Bildes liegen bleibt
			const loose0 = s.idle < 3.5;
			const visB = (innerHeight - r.top - s.oy) / s.f;
			const floor = loose0 ? Math.min(y1, Math.max(visB, y0 + (y1 - y0) * 0.5)) : y1;
			// Physik im festen 60-Hz-Schritt (Verlet), unabhängig von der Bildrate
			s.step(dt, 1 / 60, () => {
				s.idle += 1 / 60;
				const loose = s.idle < 3.5;
				const G = loose ? 0.45 : 0;
				for (const b of s.B) {
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
				if (s.grab >= 0 && s.m.in) {
					const b = s.B[s.grab];
					b.x += (s.m.x - b.x) * 0.5;
					b.y += (s.m.y - b.y) * 0.5;
				}
				for (let it = 0; it < 4; it++) {
					for (let i = 0; i < 8; i++)
						for (let j = i + 1; j < 8; j++) {
							const a = s.B[i];
							const c = s.B[j];
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
					for (const b of s.B) {
						if (b.x < x0 + b.r) b.x = x0 + b.r;
						if (b.x > x1 - b.r) b.x = x1 - b.r;
						if (b.y < y0 + b.r) b.y = y0 + b.r;
						if (b.y > floor - b.r) {
							b.y = floor - b.r;
							b.py = b.y + (b.y - b.py) * 0.4;
						}
					}
				}
			});
			const loose = s.idle < 3.5;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			s.scene();
			ctx.fillStyle = '#FAFAFA';
			const lx = s.m.in ? s.m.x : s.cx - 256;
			const ly = s.m.in ? s.m.y : s.cy - 248;
			const st = 6;
			for (const b of s.B) {
				const bx0 = Math.floor((b.x - b.r) / st) * st;
				const by0 = Math.floor((b.y - b.r) / st) * st;
				for (let y = by0; y < b.y + b.r; y += st)
					for (let x = bx0; x < b.x + b.r; x += st) {
						const nx = (x - b.x) / b.r;
						const ny = (y - b.y) / b.r;
						const q = nx * nx + ny * ny;
						if (q > 1) continue;
						const nz = Math.sqrt(1 - q);
						const Lx = lx - b.x;
						const Ly = ly - b.y;
						const LL = Math.hypot(Lx, Ly, 200);
						const lam = Math.max(0, (nx * Lx + ny * Ly + nz * 200) / LL);
						const v = 0.08 + 0.92 * lam * lam;
						const r = st * 0.5 * Math.sqrt(v);
						ctx.fillRect(x - r, y - r, r * 2, r * 2);
					}
			}
			// Namensplatten: 10 CSS-px, Platte mit Alpha 0,7, nur in der losen Phase
			ctx.font = `500 ${NAME / s.f}px "JetBrains Mono", monospace`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			if (loose)
				for (const b of s.B) {
					const w = ctx.measureText(b.n).width + 8 / s.f;
					ctx.fillStyle = 'rgba(10,10,10,0.7)';
					ctx.fillRect(b.x - w / 2, b.y - 8 / s.f, w, 16 / s.f);
					ctx.fillStyle = '#FAFAFA';
					ctx.fillText(b.n, b.x, b.y);
				}
			s.cv.style.cursor = s.grab >= 0 ? 'grabbing' : 'grab';
		},
	});
}

