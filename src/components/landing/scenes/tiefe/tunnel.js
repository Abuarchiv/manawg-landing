// Die Tiefe: Fahrt durch eine Punktwolke, in der die Wörter GELD, HAUSHALT und ABSPRACHEN als Inseln
// liegen. Die Kamera hängt am Scroll-Fortschritt des Abschnitts.
// Szenenraum: quer Bezugsbox 1280 x 800, hoch eigene Box von 640 Einheiten Breite (die Wörter stehen bei
// Tiefe 9 auf 40 bis 50 % der Breite und passen so in jedes Format). Gezeichnet wird in CSS-px.

import { loop, qa, register } from '../../core/loop';
import { cl, hsh, lag } from '../../core/math';

const lerp = (a, b, t) => a + (b - a) * t;
const ss = (x) => {
	x = cl(x);
	return x * x * (3 - 2 * x);
};
const MONO = '"JetBrains Mono", monospace';
const TT = '"Inter Tight", sans-serif';
const F = 720; // Brennweite in Szenen-Einheiten
const WORDS = ['GELD', 'HAUSHALT', 'ABSPRACHEN'];
const FONTS = [10, 14, 20, 28]; // Nahzeichen: höchstens 28 px, größere Punkte werden zu Punkten
const SPACING = 0.065; // Punktabstand der Wörter in Welt-Einheiten

// Punkte eines Worts aus der Schrift abtasten (Gitter 2 px, Mitte = Mitte der Punktwolke)
const sampleT = (word, px) => {
	const w = 1600;
	const h = Math.ceil(px * 1.35);
	const oc = document.createElement('canvas');
	oc.width = w;
	oc.height = h;
	const o = oc.getContext('2d');
	o.font = `600 ${px}px ${TT}`;
	o.textAlign = 'center';
	o.fillStyle = '#000';
	o.fillText(word, w / 2, px * 0.95);
	const d = o.getImageData(0, 0, w, h).data;
	const pts = [];
	let x0 = 1e9;
	let x1 = -1e9;
	let y0 = 1e9;
	let y1 = -1e9;
	for (let iy = 0; iy < h / 2; iy++)
		for (let ix = 0; ix < w / 2; ix++)
			if (d[(iy * 2 * w + ix * 2) * 4 + 3] > 128) {
				pts.push([ix, iy]);
				x0 = Math.min(x0, ix * 2);
				x1 = Math.max(x1, ix * 2);
				y0 = Math.min(y0, iy * 2);
				y1 = Math.max(y1, iy * 2);
			}
	return { pts, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, width: x1 - x0 };
};

// Deckkraft des Untertitels aus der Tiefe dz seiner Insel. Plateau voll für |dz - 9| <= 3,5.
// Das kommende Wort ist ab dz 30 mit 0,5 vorgeblendet, damit der Tunnel nie ohne Text bleibt (T-10).
// Die letzte Zeile steht früher und bleibt bis zum Ende der Fahrt, sonst bliebe ihr nur ein Zehntel.
const capOpacity = (dz, last) => {
	const dd = last ? Math.max(dz, 12) - 12 : dz - 9;
	const plateau = cl((5 - Math.abs(dd)) / 1.5);
	const pre = dz > 9 ? 0.5 * cl((30 - dz) / 2) : 0;
	return Math.max(plateau, pre);
};

// Flächenfaktor: Staubmenge und Punktgröße wachsen mit der Bildschirmfläche (Bezug 1440 x 900),
// damit der Anteil heller Pixel auf großen Schirmen nicht sinkt. Gerastert, damit nicht jede Größenänderung neu baut.
const flaeche = (s) => Math.round(cl((s.W * s.H) / 1296000, 0.6, 2) * 4) / 4;
const bauKey = (s) => `${s.mode}${flaeche(s)}`;

function build(s) {
	const hoch = s.mode === 'hoch';
	const k = hoch ? 0.5 : 1; // Streuung der Inseln und des Zeigerversatzes an die Boxbreite anpassen
	const target = ((hoch ? 0.5 : 0.4) * s.bw * 9) / F; // Wortbreite in Welt-Einheiten bei Tiefe 9
	s.isl = s.raw.map((r, i) => {
		const sc = cl(target / (r.width / 85), 0.25, 1.5);
		const n = Math.max(1, Math.round((SPACING * 85) / (sc * 2)));
		const pts = [];
		for (const p of r.pts)
			if (p[0] % n === 0 && p[1] % n === 0)
				pts.push([((p[0] * 2 - r.cx) / 85) * sc, ((p[1] * 2 - r.cy) / 85) * sc]);
		return { z: 26 * i, x: [-4.5, 4.5, -4.5][i] * k, y: [0.8, -0.8, 0.8][i], sc, pts };
	});
	s.k = k;
	const RAMP = '@#%*+=';
	s.P = [];
	s.isl.forEach((I, kk) => {
		I.pts.forEach((p, q) => {
			s.P.push([
				I.x + p[0],
				I.y + p[1],
				I.z + (hsh(q, kk) - 0.5) * 0.6,
				RAMP[Math.floor(hsh(q, kk + 9) * 6)],
				kk,
			]);
		});
	});
	// Staub: dichter als im Entwurf, damit zwischen den Wörtern nie Leere entsteht (F-13)
	// Hochformat: schmaler und höher, die Kanten des Staubkastens blenden weich aus (siehe frame)
	const fl = flaeche(s);
	s.fl = Math.sqrt(fl);
	const nd = Math.round((hoch ? 11000 : 22000) * fl);
	s.dX = hoch ? 24 : 30;
	s.dY = hoch ? 40 : 18;
	for (let q = 0; q < nd; q++)
		s.P.push([
			(hsh(q, 1) - 0.5) * 2 * s.dX,
			(hsh(q, 2) - 0.5) * 2 * s.dY,
			hsh(q, 3) * 90 - 14,
			'.:+'[Math.floor(hsh(q, 4) * 3)],
			-1,
		]);
	s.bm = bauKey(s);
}

/** Meldet die Tiefe-Szene an. sec: Abschnitt mit Sticky-Bühne. Gibt die Abmeldung zurück. */
export function registerTiefe(cv, sec) {
	return register({
		name: 'tiefe',
		el: cv,
		host: cv.parentElement,
		box: (_W, _H, _safeH, mode) =>
			mode === 'hoch' ? { bw: 640, bh: 1, align: 'top' } : { bw: 1280, bh: 800 },
		dprCap: 2,
		touchCap: 1.5,
		resize(s) {
			s.cx = s.bw / 2;
			s.cy = s.mode === 'hoch' ? (0.44 * s.H) / s.f : s.bh / 2;
		},
		init(s) {
			s.sm = { x: s.cx * 1.2, y: s.cy * 0.8 };
			s.built = -1;
			s.dp = 0;
			s.caps = [...cv.parentElement.querySelectorAll('[data-dcap]')];
			s.dep = cv.parentElement.querySelector('[data-depth]');
		},
		frame(s, _t, dt) {
			const ctx = s.ctx;
			if (!s.raw || s.built !== loop.fv) {
				s.built = loop.fv;
				s.raw = WORDS.map((w) => sampleT(w, 200));
				s.bm = null;
			}
			if (s.bm !== bauKey(s)) build(s);
			const { f, ox, oy, cx, cy, dpr } = s;
			const r = sec.getBoundingClientRect();
			const sp = cl(-r.top / Math.max(1, r.height - s.H));
			// Mit reduzierter Bewegung folgt die Kamera dem Scroll ohne Nachlauf
			if (s.reduced) s.dp = sp;
			else s.dp += (sp - s.dp) * lag(0.1, dt);
			const p = s.dp;
			const camZ = -14 + p * 57;
			const seg = cl((camZ + 14) / 26, 0, 1.999);
			const si = Math.floor(seg);
			const sf = ss(seg - si);
			if (s.m.in) {
				const k = s.reduced ? 1 : lag(0.06, dt);
				s.sm.x += (s.m.x - s.sm.x) * k;
				s.sm.y += (s.m.y - s.sm.y) * k;
			}
			const camX =
				lerp(s.isl[si].x, s.isl[si + 1].x, sf) * 0.85 + ((s.sm.x - cx) / cx) * 1.2 * s.k;
			const camY =
				lerp(s.isl[si].y, s.isl[si + 1].y, sf) * 0.85 + ((s.sm.y - cy) / cy) * 0.8 * s.k;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			ctx.fillStyle = '#FAFAFA';
			const snap = (v) => Math.round(v * dpr) / dpr;
			const near = [];
			const m = s.m;
			const mx = m.in ? m.x : 0;
			const my = m.in ? m.y : 0;
			for (const q of s.P) {
				let x = q[0];
				let y = q[1];
				const dz = q[2] - camZ;
				if (dz < 0.25 || dz > 110) continue;
				const word = q[4] >= 0;
				if (word && dz < 5) {
					const I = s.isl[q[4]];
					const k = (5 - dz) * 0.35;
					x += (x - I.x) * k;
					y += (y - I.y) * k;
				}
				const fz = F / dz;
				let sx = cx + (x - camX) * fz;
				let sy = cy + (y - camY) * fz;
				let X = ox + sx * f;
				let Y = oy + sy * f;
				if (X < -40 || Y < -40 || X > s.W + 40 || Y > s.H + 40) continue;
				if (m.in) {
					const dx = sx - mx;
					const dy = sy - my;
					const d = Math.hypot(dx, dy);
					if (d < 120) {
						const g = (1 - d / 120) * 46 * f;
						X += (dx / (d + 0.1)) * g;
						Y += (dy / (d + 0.1)) * g;
					}
				}
				// Wörter stehen ab dz 68 sofort mit 0,6 da (Kontrast über 4,5:1 schon beim ersten Erscheinen)
				// und werden ab dz 34 voll (T-10). Staub blendet in der Ferne aus.
				if (qa.nurWort != null && q[4] !== qa.nurWort) continue; // Messhaken: nur ein Wort zeichnen
				const a = word
					? Math.max(cl((34 - dz) / 12), 0.6 * cl(68 - dz))
					: cl(dz / 1.2) *
						cl((110 - dz) / 30) *
						cl((s.dX - Math.abs(q[0])) / 7) *
						cl((s.dY - Math.abs(q[1])) / 7) *
						0.6;
				if (a <= 0.01) continue;
				const szc = cl(0.07 * fz, 0.8, 64) * f; // Zeichengröße in CSS-px
				// Schriftstufe: 1,33 x Größe, gerundet auf die Stufen 10, 14, 20, 28 px
				const tier = Math.round(Math.log2((1.33 * szc) / FONTS[0]) * 2);
				if (tier < 0) {
					const side = snap(Math.max(word ? 1 : (s.mode === 'hoch' ? 1.5 : 2) * s.fl, szc * 0.8));
					ctx.globalAlpha = a;
					ctx.fillRect(snap(X), snap(Y), side, side);
				} else if (tier > 3) {
					// über 32 px keine Zeichen mehr, nur noch ein Punkt
					ctx.globalAlpha = a;
					ctx.fillRect(snap(X) - 1, snap(Y) - 1, 3, 3);
				} else near.push([tier, X, Y, q[3], a]);
			}
			near.sort((a, b) => a[0] - b[0]);
			let fb = -1;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			for (const n of near) {
				if (n[0] !== fb) {
					fb = n[0];
					ctx.font = `500 ${FONTS[fb]}px ${MONO}`;
				}
				ctx.globalAlpha = n[4];
				ctx.fillText(n[3], n[1], n[2]);
			}
			ctx.globalAlpha = 1;
			for (const el of s.caps) {
				const i = +el.getAttribute('data-dcap');
				const dz = s.isl[i].z - camZ;
				el.style.opacity = capOpacity(dz, i === s.isl.length - 1).toFixed(3);
			}
			if (s.dep) s.dep.textContent = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0');
		},
	});
}
