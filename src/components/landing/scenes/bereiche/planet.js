// Der Planet: eine Kugel aus Punkten mit dem Zeichen als Land, acht Orte als Marken. Ziehen dreht ihn,
// Antippen eines Orts wählt ihn aus. Szenenraum: Bezugsbox 1280 x 800, Planet bei (820, 430), R 300.

import { loop, register } from '../../core/loop';
import { AB, aMark, cl, hsh } from '../../core/math';
import { PL } from './orte';

const MONO = '"JetBrains Mono", monospace';
const lerp = (a, b, t) => a + (b - a) * t;
const ss = (x) => {
	x = cl(x);
	return x * x * (3 - 2 * x);
};

/**
 * Meldet den Planeten an. getSel() liefert den gewählten Ort, onSelect(i) setzt ihn.
 * Gibt die Abmeldung zurück.
 */
export function registerPlanet(cv, { getSel, onSelect }) {
	return register({
		name: 'planet',
		el: cv,
		host: cv.parentElement,
		box: (_W, _H, _safeH, mode) => (mode === 'hoch' ? { bw: 760, bh: 900 } : { bw: 1280, bh: 800 }),
		dprCap: 2,
		touchCap: 1.5,
		resize(s) {
			// Lage des Planeten in der Bezugsbox: quer rechts der Mitte, hoch in der Mitte
			s.cx = s.mode === 'hoch' ? 380 : 820;
			s.cy = s.mode === 'hoch' ? 450 : 430;
			s.R = 300;
		},
		init(s) {
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
				s.PT.push([x, y, z, aMark(208 + (lon / Math.PI) * 200, 173 - (lat / 1.5708) * 160) < 0 ? 1 : 0]);
			}
			s.LM = AB.map((c) => {
				const lon = ((c[0] - 208) / 200) * Math.PI;
				const lat = (-(c[1] - 173) / 160) * 1.5708;
				return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
			});
			s.yaw = 0.3;
			s.pitch = 0.25;
			s.vy = 0;
			s.hov = -1;
			s.mv = 99;
			s.walk = [0, 1, 2, 3].map((k) => ({ a: k * 2, b: (k * 2 + 3) % 8, t: hsh(k, 3), tr: [] }));
			s.stars = [];
			for (let q = 0; q < 260; q++) s.stars.push([hsh(q, 11), hsh(q, 12), hsh(q, 13)]);
		},
		onDown(s) {
			s.px = s.m.x;
			s.py = s.m.y;
			s.mv = 0;
		},
		onMove(s) {
			if (s.m.down) {
				const dx = s.m.x - s.px;
				const dy = s.m.y - s.py;
				s.mv += Math.abs(dx) + Math.abs(dy);
				s.vy = dx * 0.006;
				s.yaw += dx * 0.006;
				s.pitch = cl(s.pitch + dy * 0.004, -0.9, 0.9);
				s.px = s.m.x;
				s.py = s.m.y;
			}
		},
		onUp(s) {
			if (s.mv < 6 && s.hov >= 0) onSelect(s.hov);
			s.mv = 99;
		},
		ownsTouch: (s) => Math.hypot(s.m.x - s.cx, s.m.y - s.cy) < s.R,
		frame(s) {
			if (!(loop.n & 1)) return; // Entwurfstakt: jedes zweite Bild
			const ctx = s.ctx;
			const t = loop.t;
			const CX = s.cx;
			const CY = s.cy;
			const R = s.R;
			const x0 = -s.ox / s.f;
			const x1 = (s.W - s.ox) / s.f;
			const y0 = -s.oy / s.f;
			const y1 = (s.H - s.oy) / s.f;
			const nrm = (v) => {
				const l = Math.hypot(v[0], v[1], v[2]) || 1;
				return [v[0] / l, v[1] / l, v[2] / l];
			};
			if (!s.m.down) {
				s.vy *= 0.95;
				s.yaw += s.vy + 0.0025;
			}
			const ca = Math.cos(s.yaw);
			const sa = Math.sin(s.yaw);
			const cb = Math.cos(s.pitch);
			const sb = Math.sin(s.pitch);
			const rot = (v) => {
				const X = v[0] * ca + v[2] * sa;
				const Z1 = -v[0] * sa + v[2] * ca;
				return [X, v[1] * cb - Z1 * sb, v[1] * sb + Z1 * cb];
			};
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			s.scene();
			ctx.fillStyle = '#FAFAFA';
			for (const st of s.stars) {
				ctx.globalAlpha = 0.15 + 0.35 * st[2] * (0.6 + 0.4 * Math.sin(t * 2 + st[0] * 1280));
				ctx.fillRect(x0 + st[0] * (x1 - x0), y0 + st[1] * (y1 - y0), 1.2, 1.2);
			}
			const gl = ctx.createRadialGradient(CX, CY, R, CX, CY, R * 1.3);
			gl.addColorStop(0, 'rgba(250,250,250,0.12)');
			gl.addColorStop(1, 'rgba(250,250,250,0)');
			ctx.globalAlpha = 1;
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
			ctx.fillStyle = '#FAFAFA';
			for (const q of s.PT) {
				const v = rot(q);
				if (v[2] <= 0) continue;
				const lam = Math.max(0, v[0] * -0.45 + v[1] * 0.55 + v[2] * 0.7);
				const a = q[3] ? 0.35 + 0.65 * lam : 0.15 + 0.3 * lam;
				const sz = q[3] ? 2.6 : 1.6;
				ctx.globalAlpha = a * (0.4 + 0.6 * v[2]);
				ctx.fillRect(CX + v[0] * R - sz / 2, CY - v[1] * R - sz / 2, sz, sz);
			}
			ctx.globalAlpha = 0.25;
			ctx.strokeStyle = '#FAFAFA';
			ctx.beginPath();
			ctx.ellipse(CX, CY, R * 1.25, R * 0.28, -0.25, 0, 6.2832);
			ctx.stroke();
			ctx.globalAlpha = 1;
			for (const w of s.walk) {
				w.t += 0.004;
				if (w.t >= 1) {
					w.a = w.b;
					let nb;
					do nb = Math.floor(Math.random() * 8);
					while (nb === w.a);
					w.b = nb;
					w.t = 0;
				}
				const A = s.LM[w.a];
				const B2 = s.LM[w.b];
				const e = ss(w.t);
				const u = nrm([lerp(A[0], B2[0], e), lerp(A[1], B2[1], e), lerp(A[2], B2[2], e)]);
				w.tr.push(u);
				if (w.tr.length > 60) w.tr.shift();
				w.tr.forEach((pt, i) => {
					const v = rot(pt);
					if (v[2] <= 0) return;
					ctx.globalAlpha = (i / w.tr.length) * 0.8;
					ctx.fillRect(CX + v[0] * R * 1.01 - 1, CY - v[1] * R * 1.01 - 1, 2, 2);
				});
				const v = rot(u);
				if (v[2] > 0) {
					ctx.globalAlpha = 1;
					ctx.beginPath();
					ctx.arc(CX + v[0] * R * 1.015, CY - v[1] * R * 1.015, 4, 0, 6.2832);
					ctx.fill();
				}
			}
			s.hov = -1;
			let bd = 26;
			const sel = getSel();
			ctx.font = `500 11px ${MONO}`;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			s.LM.forEach((pp, i) => {
				const v = rot(pp);
				if (v[2] <= 0.05) return;
				const bx = CX + v[0] * R;
				const by = CY - v[1] * R;
				const k = 1.13 + (i === sel ? 0.05 : 0);
				const tx = CX + v[0] * R * k;
				const ty = CY - v[1] * R * k;
				if (s.m.in) {
					const d = Math.hypot(s.m.x - tx, s.m.y - ty);
					if (d < bd) {
						bd = d;
						s.hov = i;
					}
				}
				const on = i === sel;
				const hv = i === s.hov;
				ctx.globalAlpha = Math.min(1, v[2] * 1.6);
				ctx.strokeStyle = '#FAFAFA';
				ctx.beginPath();
				ctx.moveTo(bx, by);
				ctx.lineTo(tx, ty);
				ctx.stroke();
				ctx.fillStyle = on ? '#FAFAFA' : '#0A0A0A';
				ctx.fillRect(tx - 5, ty - 5, 10, 10);
				ctx.strokeRect(tx - 5.5, ty - 5.5, 11, 11);
				if (on) {
					const pr = (t * 0.8) % 1;
					ctx.globalAlpha = 1 - pr;
					ctx.beginPath();
					ctx.arc(tx, ty, 8 + pr * 26, 0, 6.2832);
					ctx.stroke();
					ctx.globalAlpha = Math.min(1, v[2] * 1.6);
				}
				ctx.fillStyle = '#FAFAFA';
				if (v[2] > 0.3 || on || hv)
					ctx.fillText(`${String(i + 1).padStart(2, '0')} ${PL[i][0].toUpperCase()}`, tx + 12, ty);
			});
			ctx.globalAlpha = 1;
			s.cv.style.cursor = s.m.down ? 'grabbing' : s.hov >= 0 ? 'pointer' : 'grab';
		},
	});
}
