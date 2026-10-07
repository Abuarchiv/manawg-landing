// Die acht Körper: das Zeichen als Kugeln mit Verlet-Physik. Greifen, Werfen, Anstoßen. Nach einer Weile
// ziehen die Körper zurück in das Zeichen. Szenenraum: Bezugsbox 1280 x 760, die Wände sind die Ränder
// der ganzen Fläche.

import { loop, qa, register } from '../../core/loop';
import { AB, hsh } from '../../core/math';
import { PL } from '../bereiche/orte';

const S = 1.15;
const st = 3; // feiner Halbton (Zellen 3 statt 6 px)
const NAME = 11; // Namen auf den Kugeln: Mono 11 px (hoch 10 px), Versalien mit Laufweite, ohne Platte
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
		// Unterkante des Titels samt Abstand in Szenen-Einheiten: Ring und Decke bleiben darunter
		s.tbU = (tb + 14 - s.oy) / s.f;
		const oben = Math.min(...AB.map((c) => (c[1] - 173) * S - c[2] * S * 0.98));
		cy = Math.max((tb + (s.H - tb) / 2 - s.oy) / s.f, s.tbU - oben);
	}
	s.cx = cx;
	s.cy = cy;
	// Quer: die Überschrift sitzt knapp über der Kugelwolke (höchstens etwa 40 px Luft), nicht am Abschnittsrand
	if (s.mode !== 'hoch' && s.B) {
		const t = s.host.querySelector('[data-titel]');
		if (t) {
			const oben = Math.min(...AB.map((c) => cy + (c[1] - 173) * S - c[2] * S * 0.98));
			const px = s.oy + oben * s.f - t.offsetHeight - 40;
			// nie näher als eine Stufe unter dem Kopf
			t.style.top = `max(calc(var(--kopf-unten) + var(--sp-14)), ${Math.round(px)}px)`;
		}
	}
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
/** api.wurf() (Tastatur): alle Körper bekommen einen Stoß nach oben, wie ein Antippen (Koerper.tsx). */
export function registerKoerper(cv, api = {}) {
	return register({
		name: 'koerper',
		el: cv,
		host: cv.parentElement,
		box: (_W, _H, _safeH, mode) =>
			mode === 'hoch' ? { bw: 600, bh: 1, align: 'top' } : { bw: 1280, bh: 760 },
		dprCap: 1.5,
		touchCap: 1.5,
		minSicht: 0.1,
		resize: homes,
		init(s) {
			api.wurf = () => {
				s.auto = false;
				s.ring = false;
				s.idle = 0;
				s.B.forEach((b, i) => {
					b.px = b.x + (hsh(i, 7) - 0.5) * 12;
					b.py = b.y + 16;
				});
			};
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
			// Körper greifen (Maus sofort, Touch nach waagerechter Bewegung)
			s.start = (best) => {
				s.pend = null;
				s.auto = false;
				s.grab = best;
				s.idle = 0;
				s.ring = false;
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
				// Ein Wisch daneben ist Scrollen und stört die Körper nicht.
				if (touch && best < 0) return;
				// Touch (Canvas hat touch-action: pan-y): Die Seite scrollt immer, wenn die Geste senkrecht
				// beginnt (der Browser meldet dann pointercancel). Gegriffen wird erst bei einer überwiegend
				// waagerechten Bewegung (onMove), ein Antippen gibt dem Körper einen Stoß (onUp).
				if (touch) {
					s.pend = { i: best, x: s.m.x, y: s.m.y };
					return;
				}
				s.start(best);
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
		onMove(s) {
			const p = s.pend;
			if (!p || !s.m.down) return;
			const dx = s.m.x - p.x;
			const dy = s.m.y - p.y;
			const min = 8 / s.f;
			if (Math.abs(dx) > min && Math.abs(dx) > Math.abs(dy)) s.start(p.i);
		},
		onUp(s, e) {
			// Antippen (kein Abbruch durch Scrollen): der Körper bekommt einen Stoß nach oben
			const p = s.pend;
			s.pend = null;
			if (p && e?.type === 'pointerup') {
				const b = s.B[p.i];
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
			// Flächenränder im Szenenraum: Wände links und rechts, Decke und Boden
			const x0 = -s.ox / s.f;
			const x1 = (s.W - s.ox) / s.f;
			// Hochformat: die Decke ist die Unterkante des Titels, nicht der Abschnittsrand
			const y0 = s.mode === 'hoch' && s.tbU !== undefined ? s.tbU : -s.oy / s.f;
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
			// Boden bei etwa 80 % der sichtbaren Höhe: Titel und Körper bleiben ein Bild
			const floor = loose0 ? Math.min(y1, Math.max(y0 + (visB - y0) * 0.8, y0 + (y1 - y0) * 0.5)) : y1;
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
			s.cv.style.cursor = s.grab >= 0 ? 'grabbing' : 'grab';
			// Lose Phase oder gegriffen: volle Bildrate (loop.js drosselt im Stand auf 60 Hz)
			if (loose || s.grab >= 0) loop.act = loop.now;
			const lx = s.m.in ? s.m.x : s.cx - 256;
			const ly = s.m.in ? s.m.y : s.cy - 248;
			// Ruhen die Körper (Ring gezogen, Zeiger still), bleibt das letzte Bild stehen: kein Neuzeichnen
			let sig = s.W * 7 + s.H + s.f * 1000 + s.dpr * 100 + loop.fv + (loose ? 0.5 : 0) + (s.grab + 2) * 3e4;
			sig = (sig + Math.round(lx) * 131 + Math.round(ly) * 17) % 1e9;
			for (const b of s.B) sig = (sig * 31 + Math.round(b.x * 50) * 7 + Math.round(b.y * 50)) % 1e9;
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
			const skey = `${s.f.toFixed(3)}|${s.dpr}`;
			for (const b of s.B) {
				const Lx = lx - b.x;
				const Ly = ly - b.y;
				const dd = Math.hypot(Lx, Ly);
				const ai = Math.round(((Math.atan2(Ly, Lx) + Math.PI) / (2 * Math.PI)) * 32) % 32;
				const di = dd < 150 ? 0 : dd < 350 ? 1 : dd < 800 ? 2 : 3;
				const k = `${skey}|${ai}|${di}`;
				const cache = (b.sp ||= new Map());
				let e = cache.get(k);
				if (!e) {
					const pw = Math.ceil((2 * b.r + 4) * s.f * s.dpr);
					const cv = document.createElement('canvas');
					cv.width = pw;
					cv.height = pw;
					const g = cv.getContext('2d');
					const u = pw / (2 * b.r + 4);
					g.setTransform(u, 0, 0, u, 0, 0);
					g.fillStyle = '#FAFAFA';
					const ang = (ai / 32) * 2 * Math.PI - Math.PI;
					const dist = [90, 240, 550, 1400][di];
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
					e = cv;
					cache.set(k, e);
					if (cache.size > 90) cache.delete(cache.keys().next().value);
				}
				const sz = 2 * b.r + 4;
				ctx.drawImage(e, b.x - b.r - 2, b.y - b.r - 2, sz, sz);
			}
			// Namen: Mono 11 px (hoch 10 px) mit Laufweite, ohne Platte, dunkler Saum statt Kasten, nur in der losen Phase
			ctx.font = `500 ${(s.mode === 'hoch' ? NAME - 1 : NAME) / s.f}px "JetBrains Mono", monospace`;
			if ('letterSpacing' in ctx) ctx.letterSpacing = `${(0.08 * NAME) / s.f}px`;
			ctx.lineJoin = 'round';
			ctx.lineWidth = 4 / s.f;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			if (loose)
				for (const b of s.B) {
					ctx.strokeStyle = 'rgba(10,10,10,0.85)';
					ctx.strokeText(b.n, b.x, b.y);
					ctx.fillStyle = '#FAFAFA';
					ctx.fillText(b.n, b.x, b.y);
				}
			// Überschrift freihalten: hinter jeder Textzeile bleibt die Fläche dunkel (Rand 6 px, weich auslaufend),
			// die Kugeln laufen dahinter durch, ohne die Schrift zu überstrahlen
			const h2 = s.host.querySelector('h2');
			if (h2) {
				const rc = s.cv.getBoundingClientRect();
				const rg = document.createRange();
				rg.selectNodeContents(h2);
				ctx.fillStyle = '#0A0A0A';
				ctx.shadowColor = '#0A0A0A';
				ctx.shadowBlur = 26 * s.dpr; // weiche Kante: außen läuft die Aussparung über etwa 13 px aus
				for (const l of rg.getClientRects()) {
					if (l.width < 2) continue;
					const p = 4 / s.f;
					ctx.fillRect((l.left - rc.left - s.ox) / s.f - p, (l.top - rc.top - s.oy) / s.f - p, l.width / s.f + 2 * p, l.height / s.f + 2 * p);
				}
				ctx.shadowBlur = 0;
				ctx.shadowColor = 'transparent';
				ctx.globalAlpha = 1;
			}
		},
	});
}

