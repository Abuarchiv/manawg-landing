// Die acht Körper: das Zeichen als Kugeln mit Verlet-Physik. Greifen, Werfen, Anstoßen. Nach einer Weile
// ziehen die Körper zurück in das Zeichen. Szenenraum: Bezugsbox 1280 x 760, die Wände sind die Ränder
// der ganzen Fläche.

import { qa, register } from '../../core/loop';
import { AB } from '../../core/math';
import { PL } from '../bereiche/orte';

const S = 1.15;
const HX = 640 - 208 * S;
const HY = 380 - 173 * S + 20;

/** Meldet die Körper-Szene an. Gibt die Abmeldung zurück. */
export function registerKoerper(cv) {
	return register({
		name: 'koerper',
		el: cv,
		host: cv.parentElement,
		box: () => ({ bw: 1280, bh: 760 }),
		dprCap: 2,
		touchCap: 1.5,
		init(s) {
			s.B = AB.map((c, i) => ({
				x: HX + c[0] * S,
				y: HY + c[1] * S,
				px: HX + c[0] * S,
				py: HY + c[1] * S,
				r: c[2] * S * 0.98,
				hx: HX + c[0] * S,
				hy: HY + c[1] * S,
				n: PL[i][0].toUpperCase(),
			}));
			s.idle = 99;
			s.grab = -1;
			qa.koerper = () => ({ idle: s.idle, ring: !!s.ring });
			s.onDownBody = () => {
				let best = -1;
				let bd = 1e9;
				s.B.forEach((b, i) => {
					const d = Math.hypot(b.x - s.m.x, b.y - s.m.y) - b.r;
					if (d < 10 && d < bd) {
						bd = d;
						best = i;
					}
				});
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
			s.grab = -1;
			s.idle = 0;
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
				s.ring = sicht < 0.7;
				s.idle = s.ring ? 99 : 0;
			}
			if (s.ring && sicht >= 0.7 && !s.m.down) {
				s.ring = false;
				s.idle = 0;
			} else if (!s.ring && sicht < 0.1) {
				s.ring = true;
				s.idle = 99;
				for (const b of s.B) {
					b.x = b.px = b.hx;
					b.y = b.py = b.hy;
				}
			}
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
						if (b.y > y1 - b.r) {
							b.y = y1 - b.r;
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
			const lx = s.m.in ? s.m.x : 1280 * 0.3;
			const ly = s.m.in ? s.m.y : 760 * 0.2;
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
			ctx.font = '500 11px "JetBrains Mono", monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			if (loose)
				for (const b of s.B) {
					ctx.fillStyle = '#0A0A0A';
					const w = ctx.measureText(b.n).width + 10;
					ctx.fillRect(b.x - w / 2, b.y - 9, w, 18);
					ctx.fillStyle = '#FAFAFA';
					ctx.fillText(b.n, b.x, b.y);
				}
			s.cv.style.cursor = s.grab >= 0 ? 'grabbing' : 'grab';
		},
	});
}

