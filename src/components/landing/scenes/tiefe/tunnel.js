// Die Tiefe: Fahrt durch eine Punktwolke, in der die Wörter GELD, HAUSHALT und ABSPRACHEN als Inseln
// liegen. Die Kamera hängt am Scroll-Fortschritt des Abschnitts. Szenenraum: Bezugsbox 1280 x 800.

import { loop, register } from '../../core/loop';
import { cl, hsh } from '../../core/math';

const lerp = (a, b, t) => a + (b - a) * t;
const ss = (x) => {
	x = cl(x);
	return x * x * (3 - 2 * x);
};
const MONO = '"JetBrains Mono", monospace';
const TT = '"Inter Tight", sans-serif';

// Punkte eines Worts aus der Schrift abtasten
const sampleT = (lines, px, step) => {
	const lh = px * 0.95;
	const w = 1600;
	const h = Math.ceil(lines.length * lh + px * 0.4);
	const oc = document.createElement('canvas');
	oc.width = w;
	oc.height = h;
	const o = oc.getContext('2d');
	o.font = `600 ${px}px ${TT}`;
	o.textAlign = 'center';
	o.fillStyle = '#000';
	lines.forEach((l, i) => o.fillText(l, w / 2, px * 0.82 + i * lh));
	const d = o.getImageData(0, 0, w, h).data;
	const pts = [];
	for (let y = 0; y < h; y += step)
		for (let x = 0; x < w; x += step) if (d[(y * w + x) * 4 + 3] > 128) pts.push([x - w / 2, y - h / 2]);
	return pts;
};

/** Meldet die Tiefe-Szene an. sec: Abschnitt mit Sticky-Bühne. Gibt die Abmeldung zurück. */
export function registerTiefe(cv, sec) {
	return register({
		name: 'tiefe',
		el: cv,
		host: cv.parentElement,
		box: () => ({ bw: 1280, bh: 800 }),
		dprCap: 2,
		touchCap: 1.5,
		init(s) {
			s.sm = { x: 1280 * 0.6, y: 800 * 0.4 };
			s.built = -1;
			s.dp = 0;
			s.caps = [...cv.parentElement.querySelectorAll('[data-dcap]')];
			s.dep = cv.parentElement.querySelector('[data-depth]');
		},
		frame(s, t) {
			if (!(loop.n & 1)) return; // Entwurfstakt: jedes zweite Bild
			const ctx = s.ctx;
			if (!s.P || s.built !== loop.fv) {
				s.built = loop.fv;
				const RAMP = '@#%*+=';
				s.isl = [['GELD'], ['HAUSHALT'], ['ABSPRACHEN']].map((w, i) => ({
					z: 26 * i,
					x: [-4.5, 4.5, -4.5][i],
					y: [0.8, -0.8, 0.8][i],
					pts: sampleT(w, 200, 5).map((p) => [p[0] / 85, p[1] / 85]),
				}));
				s.P = [];
				s.isl.forEach((I, k) =>
					I.pts.forEach((p, q) =>
						s.P.push([
							I.x + p[0],
							I.y + p[1],
							I.z + (hsh(q, k) - 0.5) * 0.6,
							RAMP[Math.floor(hsh(q, k + 9) * 6)],
							k,
						]),
					),
				);
				for (let q = 0; q < 1600; q++)
					s.P.push([
						(hsh(q, 1) - 0.5) * 60,
						(hsh(q, 2) - 0.5) * 36,
						hsh(q, 3) * 90 - 14,
						'.:+'[Math.floor(hsh(q, 4) * 3)],
						-1,
					]);
			}
			const r = sec.getBoundingClientRect();
			const sp = cl(-r.top / Math.max(1, r.height - s.H));
			s.dp += (sp - s.dp) * 0.1;
			const p = s.dp;
			const camZ = -14 + p * 57;
			const seg = cl((camZ + 14) / 26, 0, 1.999);
			const si = Math.floor(seg);
			const sf = ss(seg - si);
			if (s.m.in) {
				s.sm.x += (s.m.x - s.sm.x) * 0.06;
				s.sm.y += (s.m.y - s.sm.y) * 0.06;
			}
			const camX = lerp(s.isl[si].x, s.isl[si + 1].x, sf) * 0.85 + ((s.sm.x - 640) / 640) * 1.2;
			const camY = lerp(s.isl[si].y, s.isl[si + 1].y, sf) * 0.85 + ((s.sm.y - 400) / 400) * 0.8;
			const F = 720;
			const x0 = -s.ox / s.f;
			const x1 = (s.W - s.ox) / s.f;
			const y0 = -s.oy / s.f;
			const y1 = (s.H - s.oy) / s.f;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			s.scene();
			const near = [];
			for (const q of s.P) {
				let x = q[0];
				let y = q[1];
				const dz = q[2] - camZ;
				if (dz < 0.25 || dz > 110) continue;
				if (q[4] >= 0 && dz < 5) {
					const I = s.isl[q[4]];
					const k = (5 - dz) * 0.35;
					x += (x - I.x) * k;
					y += (y - I.y) * k;
				}
				const fz = F / dz;
				let sx = 640 + (x - camX) * fz;
				let sy = 400 + (y - camY) * fz;
				if (sx < x0 - 40 || sy < y0 - 40 || sx > x1 + 40 || sy > y1 + 40) continue;
				if (s.m.in) {
					const dx = sx - s.m.x;
					const dy = sy - s.m.y;
					const d = Math.hypot(dx, dy);
					if (d < 120) {
						const g = (1 - d / 120) * 46;
						sx += (dx / (d + 0.1)) * g;
						sy += (dy / (d + 0.1)) * g;
					}
				}
				const a = cl(dz / 1.2) * (q[4] < 0 ? cl((110 - dz) / 50) * 0.55 : cl((34 - dz) / 12));
				const sz = cl(0.07 * fz, 0.8, 64);
				if (a <= 0.01) continue;
				if (sz < 6) {
					ctx.globalAlpha = a;
					ctx.fillStyle = '#FAFAFA';
					ctx.fillRect(sx, sy, sz * 0.55, sz * 0.55);
				} else near.push([Math.min(5, Math.floor(Math.log2(sz / 6) * 2)), sx, sy, q[3], a]);
			}
			near.sort((a, b) => a[0] - b[0]);
			let fb = -1;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#FAFAFA';
			for (const n of near) {
				if (n[0] !== fb) {
					fb = n[0];
					ctx.font = `500 ${Math.round(8 * Math.pow(2, fb / 2))}px ${MONO}`;
				}
				ctx.globalAlpha = n[4];
				ctx.fillText(n[3], n[1], n[2]);
			}
			ctx.globalAlpha = 1;
			for (const el of s.caps) {
				const i = +el.getAttribute('data-dcap');
				const dz = s.isl[i].z - camZ;
				el.style.opacity = cl(1 - Math.abs(dz - 9) / 5).toFixed(3);
			}
			if (s.dep) s.dep.textContent = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0');
			void t;
		},
	});
}
