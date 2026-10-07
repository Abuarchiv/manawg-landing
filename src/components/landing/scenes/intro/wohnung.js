// Die Wohnung: isometrischer Grundriss aus Punktraster und Wänden, vier Räume werden nacheinander
// angefahren. Dazu die Kurve der Raumkarten (karten) für die Texte der Bühne.
//
// Szenenraum: Die Komposition liegt in der Bezugsbox 1280 x 800 (c.fit), das Punktraster und die
// Wände laufen über die ganze Fläche.

import { BAYER, cl, lerp, ss } from '../../core/math';

const mono = (px) => `500 ${px}px "JetBrains Mono", monospace`;

// [Name, x, y, Breite, Tiefe, Zeile]
const ROOMS = [
	['KÜCHE', 0, 0, 8, 6, 'Einkäufe · Vorräte'],
	['BAD', 8, 0, 5, 6, 'Putzplan'],
	['ZIMMER · JONA', 13, 0, 7, 6, ''],
	['FLUR', 0, 6, 20, 3, 'Pinnwand · Chat'],
	['WOHNZIMMER', 0, 9, 9, 7, 'Ausgaben · Fixkosten'],
	['ZIMMER · LEA', 9, 9, 5, 7, ''],
	['ZIMMER · LINA', 14, 9, 6, 7, ''],
];
// Blickpunkte: Mitte im Raster (cx, cy), Maßstab u, Ursprung der Projektion (ox, oy), Raum
const STOPS = [
	{ cx: 10, cy: 8, u: 26, ox: 780, oy: 470, room: -1 },
	{ cx: 4, cy: 3, u: 62, ox: 840, oy: 420, room: 0 },
	{ cx: 4.5, cy: 12.5, u: 52, ox: 840, oy: 420, room: 4 },
	{ cx: 10.5, cy: 3, u: 80, ox: 840, oy: 420, room: 1 },
	{ cx: 10, cy: 7.5, u: 48, ox: 840, oy: 420, room: 3 },
	{ cx: 10, cy: 8, u: 24, ox: 640, oy: 300, room: -1 },
];
const WALLS = [];
for (const r of ROOMS) {
	const x = r[1];
	const y = r[2];
	const w = r[3];
	const hh = r[4];
	WALLS.push([x, y, x + w, y], [x + w, y, x + w, y + hh], [x, y + hh, x + w, y + hh], [x, y, x, y + hh]);
}
WALLS.sort((a, b) => a[0] + a[1] + a[2] + a[3] - (b[0] + b[1] + b[2] + b[3]));
const PEOC = [
	['LINA', 0.62],
	['MIKA', 0.5],
	['JONA', 0.42],
	['LEA', 0.34],
];

/** Deckkraft der vier Raumkarten bei Fortschritt P (Kurve des Entwurfs). */
export function karten(P) {
	const fpA = ss((P - 0.58) / 0.05);
	const endA = ss((P - 0.9) / 0.05);
	const fs = cl((P - 0.62) / 0.28) * 5;
	const out = [];
	for (let j = 0; j < 4; j++)
		out.push(fpA * (1 - endA) * ss(1.7 - Math.abs(fs - (j + 1)) * 2.4));
	return out;
}

const states = new WeakMap();

/** Zeichnet die Wohnung in das 2D-Canvas. c: Kontext der Bühne. */
export function draw(cv, c) {
	let st = states.get(cv);
	if (!st) {
		st = { ctx: cv.getContext('2d'), sm: { x: 640, y: 400 }, pp: null };
		states.set(cv, st);
	}
	const ctx = st.ctx;
	const { W, H, dpr, now, m } = c;
	const { f, ox: fx, oy: fy } = c.fit;
	const x0 = -fx / f;
	const y0 = -fy / f;
	const x1 = (W - fx) / f;
	const y1 = (H - fy) / f;
	const sp = cl((c.P - 0.62) / 0.28);
	// Zeiger in Szenenkoordinaten, der Lichtkegel läuft nach
	if (m.in) {
		st.sm.x += ((m.x - fx) / f - st.sm.x) * 0.25;
		st.sm.y += ((m.y - fy) / f - st.sm.y) * 0.25;
	}
	const q = sp * 5;
	const i = Math.min(4, Math.floor(q));
	const e = ss((q - i - 0.2) / 0.6);
	const A = STOPS[i];
	const Bs = STOPS[i + 1];
	const cx = lerp(A.cx, Bs.cx, e);
	const cy = lerp(A.cy, Bs.cy, e);
	const u = Math.exp(lerp(Math.log(A.u), Math.log(Bs.u), e));
	const ox = lerp(A.ox, Bs.ox, e);
	const oy = lerp(A.oy, Bs.oy, e);
	const P = (x, y, zz) => [
		ox + (x - cx - (y - cy)) * 0.866 * u,
		oy + (x - cx + (y - cy)) * 0.5 * u - zz * u,
	];
	const lit = ROOMS.map((r, ri) => {
		let v = 0;
		STOPS.forEach((S, j) => {
			if (S.room === ri) v = Math.max(v, 1 - Math.abs(q - j) * 1.4);
		});
		return cl(v);
	});
	const focus = lit.indexOf(Math.max(...lit));
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.fillStyle = '#0A0A0A';
	ctx.fillRect(0, 0, W, H);
	ctx.setTransform(dpr * f, 0, 0, dpr * f, dpr * fx, dpr * fy);
	const mx = st.sm.x;
	const my = st.sm.y;
	const FL = 210;
	const stp = Math.max(0.12, 5.5 / u);
	ctx.fillStyle = '#FAFAFA';
	ROOMS.forEach((r, ri) => {
		const x = r[1];
		const y = r[2];
		const w = r[3];
		const hh = r[4];
		const base = 0.06 + 0.8 * lit[ri];
		for (let gy = 0, yy = y + stp / 2; yy < y + hh; yy += stp, gy++)
			for (let gx = 0, xx = x + stp / 2; xx < x + w; xx += stp, gx++) {
				const pt = P(xx, yy, 0);
				if (pt[0] < x0 - 4 || pt[1] < y0 - 4 || pt[0] > x1 || pt[1] > y1) continue;
				let I = base;
				if (m.in) {
					const dm = Math.hypot(pt[0] - mx, pt[1] - my);
					if (dm < FL) I += 0.8 * (1 - dm / FL) ** 2;
				}
				if (I > BAYER[(gy & 3) * 4 + (gx & 3)] / 16 + 0.02) ctx.fillRect(pt[0], pt[1], 1.6, 1.6);
			}
	});
	// Bewohner laufen zwischen den Räumen, im angefahrenen Raum bleiben sie stehen
	if (!st.pp) st.pp = PEOC.map((_, k) => ({ x: 2 + k * 4, y: 7.5, tx: 2 + k * 4, ty: 7.5, nt: 0 }));
	st.pp.forEach((pp, k) => {
		if (lit[focus] > 0.5) {
			const r = ROOMS[focus];
			pp.tx = r[1] + r[3] * (0.3 + 0.4 * (k % 2));
			pp.ty = r[2] + r[4] * (0.3 + 0.4 * (k > 1 ? 1 : 0));
		} else if (now > pp.nt) {
			const r = ROOMS[Math.floor(Math.random() * ROOMS.length)];
			pp.tx = r[1] + r[3] * (0.25 + Math.random() * 0.5);
			pp.ty = r[2] + r[4] * (0.25 + Math.random() * 0.5);
			pp.nt = now + 2.5 + Math.random() * 3;
		}
		pp.x += (pp.tx - pp.x) * 0.02;
		pp.y += (pp.ty - pp.y) * 0.02;
	});
	const HW = 1.1;
	WALLS.forEach((wl) => {
		const a = P(wl[0], wl[1], 0);
		const b = P(wl[2], wl[3], 0);
		const a2 = P(wl[0], wl[1], HW);
		const b2 = P(wl[2], wl[3], HW);
		ctx.globalAlpha = 0.92;
		ctx.fillStyle = '#0A0A0A';
		ctx.beginPath();
		ctx.moveTo(a[0], a[1]);
		ctx.lineTo(b[0], b[1]);
		ctx.lineTo(b2[0], b2[1]);
		ctx.lineTo(a2[0], a2[1]);
		ctx.closePath();
		ctx.fill();
		ctx.globalAlpha = 0.3;
		ctx.strokeStyle = '#FAFAFA';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(a[0], a[1]);
		ctx.lineTo(b[0], b[1]);
		ctx.moveTo(a[0], a[1]);
		ctx.lineTo(a2[0], a2[1]);
		ctx.moveTo(b[0], b[1]);
		ctx.lineTo(b2[0], b2[1]);
		ctx.stroke();
		ctx.globalAlpha = 0.9;
		ctx.beginPath();
		ctx.moveTo(a2[0], a2[1]);
		ctx.lineTo(b2[0], b2[1]);
		ctx.stroke();
	});
	ctx.globalAlpha = 1;
	st.pp.forEach((pp, k) => {
		const pt = P(pp.x, pp.y, 0.45);
		const r = PEOC[k][1] * u * 0.5;
		ctx.fillStyle = '#FAFAFA';
		ctx.beginPath();
		ctx.arc(pt[0], pt[1], r, 0, 6.2832);
		ctx.fill();
		ctx.fillStyle = '#0A0A0A';
		ctx.beginPath();
		ctx.arc(pt[0] + r * 0.12, pt[1] - r * 0.28, r * 0.22, 0, 6.2832);
		ctx.fill();
		ctx.font = mono(11);
		ctx.fillStyle = 'rgba(250,250,250,0.72)';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'alphabetic';
		ctx.fillText(PEOC[k][0], pt[0], pt[1] - r - 8);
	});
	ROOMS.forEach((r, ri) => {
		const pt = P(r[1] + r[3] / 2, r[2] + r[4] / 2, 0);
		ctx.textAlign = 'center';
		ctx.globalAlpha = 0.6 + 0.4 * lit[ri];
		ctx.font = mono(11);
		ctx.fillStyle = '#FAFAFA';
		ctx.fillText(r[0], pt[0], pt[1]);
	});
	ctx.globalAlpha = 1;
	if (m.in) {
		ctx.strokeStyle = 'rgba(250,250,250,0.6)';
		ctx.beginPath();
		ctx.arc(mx, my, 18, 0, 6.2832);
		ctx.stroke();
		ctx.fillStyle = '#FAFAFA';
		ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
	}
}
