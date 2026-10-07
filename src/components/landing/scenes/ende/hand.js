// Die Hände der Ende-Szene: eine Hand hält das Handy, die andere folgt dem Zeiger (Kapsel-Körper als
// Halbton-Punkte). Erstfassung des Fundaments: die Hände des Entwurfs über die Kamera in den Ende-Raum
// (1280 x 800) gelegt. Das Paket HAND ersetzt sie durch die gerenderten Pässe.

import { BAYER as HB, cap, cl, hsh, smn, uc } from '../../core/math';

const PCX = 800;
const PCY = 400;
const FR = [
	[232, 1.0],
	[318, 1.05],
	[402, 0.98],
	[482, 0.84],
];
const ink = '#FAFAFA';
const step = 2.5;
const CG = 12;

// Haltehand hinter dem Handy
const holdBack = (x, y) => {
	let d = (Math.hypot((x - 790) / 178, (y - 748) / 96) - 1) * 96;
	d = smn(d, uc(x, y, 770, 800, 690, 1160, 122, 142), 60);
	d = smn(d, (Math.hypot((x - 905) / 66, (y - 690) / 92) - 1) * 66, 34);
	d = smn(d, (Math.hypot((x - 640) / 74, (y - 705) / 96) - 1) * 74, 40);
	for (const g of FR) {
		const s = g[1];
		const y0 = g[0];
		let e = uc(x, y, 900, y0 + 30, 980, y0 + 6, 25 * s, 23 * s);
		e = smn(e, Math.hypot(x - 986, y - y0 - 2) - 24 * s, 6);
		e = smn(e, uc(x, y, 986, y0 - 1, 972, y0 - 8, 22 * s, 20 * s), 5);
		d = smn(d, e, 3);
	}
	return d;
};

// Daumen und Fingerkuppen vor dem Handy
const holdFront = (x, y) => {
	let d = uc(x, y, 612, 692, 600, 560, 40, 32);
	d = smn(d, uc(x, y, 600, 560, 616, 466, 31, 27), 5);
	d = smn(d, uc(x, y, 616, 466, 652, 412, 26, 21), 5);
	for (const g of FR) {
		const s = g[1];
		const y0 = g[0];
		let e = uc(x, y, 986, y0 - 1, 972, y0 - 8, 22 * s, 20 * s);
		e = smn(e, uc(x, y, 968, y0 - 8, 938, y0 - 12, 19 * s, 15.5 * s), 4);
		d = Math.min(d, e);
	}
	return d;
};

// Nagel als Ellipse im Längs-/Querkoordinatensystem einer Strecke
const nail = (x, y, ax, ay, bx, by, t0, L, w) => {
	const dx = bx - ax;
	const dy = by - ay;
	const l = Math.hypot(dx, dy);
	const ux = dx / l;
	const uy = dy / l;
	const px = x - ax;
	const py = y - ay;
	const al = px * ux + py * uy;
	const pe = -px * uy + py * ux;
	const c = t0 * l;
	return ((al - c) / L) ** 2 + (pe / w) ** 2;
};

const phoneBox = (x, y) => {
	const qx = Math.abs(x - PCX) - 104;
	const qy = Math.abs(y - PCY) - 264;
	return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - 46;
};

const LX = -0.5;
const LY = -0.62;
const LZ = 0.6;
const shN = (fn, x, y, d, R) => {
	const gx = fn(x + 1.5, y) - d;
	const gy = fn(x, y + 1.5) - d;
	const h = Math.sqrt(cl(-d / R));
	const sl = (1 - h) * 2.2;
	const nx = (gx / 1.5) * sl;
	const ny = (gy / 1.5) * sl;
	const l = Math.hypot(nx, ny, 1);
	const lam = Math.max(0, (nx * LX + ny * LY + LZ) / l);
	const sp = Math.pow(lam, 12) * 0.35;
	return Math.pow(h, 0.3) * (0.1 + 0.85 * lam) + sp;
};
const lightF = (x, y) => 0.45 + 0.55 * cl(1 - (x - 450 + (y - 120)) / 1100);

const states = new WeakMap();

/** Lädt die Pässe der Hände. Die Erstfassung braucht nichts. */
export function laden() {
	return Promise.resolve();
}

/**
 * Zeichnet beide Hände. back liegt unter dem Handy, front darüber.
 * c: Kontext der Bühne, cam: { f, ox, oy } aus kamera().
 */
export function draw(back, front, c, cam) {
	let st = states.get(back);
	if (!st) {
		st = { cb: back.getContext('2d'), cf: front.getContext('2d'), ht: { x: 860, y: 430 }, cm: null, clean: false };
		states.set(back, st);
	}
	const { cb, cf } = st;
	const { W, H, dpr, t, now } = c;
	const host = back.closest('[data-buehne]');
	if (!(c.endA > 0.01)) {
		if (!st.clean) {
			cb.setTransform(1, 0, 0, 1, 0, 0);
			cf.setTransform(1, 0, 0, 1, 0, 0);
			cb.clearRect(0, 0, back.width, back.height);
			cf.clearRect(0, 0, front.width, front.height);
			st.clean = true;
		}
		if (host) host.style.cursor = '';
		return;
	}
	st.clean = false;
	if (host) host.style.cursor = c.endOn ? 'none' : '';
	const ht = st.ht;
	// Zeiger im Ende-Raum
	const mx = (c.m.x - cam.ox) / cam.f;
	const my = (c.m.y - cam.oy) / cam.f;
	const tg = c.m.in && c.endOn ? [mx, my] : [840 + Math.sin(t * 0.7) * 50, 380 + Math.cos(t * 0.5) * 80];
	ht.x += (tg[0] - ht.x) * 0.3;
	ht.y += (tg[1] - ht.y) * 0.3;
	const pr = now - c.m.clickT;
	const push = pr < 0.4 ? Math.sin((pr / 0.4) * Math.PI) : 0;
	const ax = 1460 - ht.x;
	const ay = 1020 - ht.y;
	const AL = Math.hypot(ax, ay) || 1;
	const ux = ax / AL;
	const uy = ay / AL;
	const nx = -uy;
	const ny = ux;
	const sc = 1 - push * 0.06;
	const tx = ht.x + ux * (6 + push * 4);
	const ty = ht.y + uy * (6 + push * 4);
	const P = (a, b) => [tx + (ux * a + nx * b) * sc, ty + (uy * a + ny * b) * sc];
	const S = [
		[P(0, 0), P(34, 0), 15, 16.5],
		[P(34, 0), P(74, 0), 16.5, 17.5],
		[P(74, 0), P(132, 2), 17.5, 19.5],
		[P(140, 8), P(250, 26), 46, 58],
		[P(150, 38), P(118, 46), 20, 19],
		[P(118, 46), P(112, 64), 19, 17],
		[P(160, 66), P(130, 74), 19, 18],
		[P(130, 74), P(126, 90), 18, 16],
		[P(172, 92), P(146, 100), 16, 15],
		[P(146, 100), P(142, 114), 15, 13],
		[P(250, -40), P(190, -40), 30, 26],
		[P(190, -40), P(140, -28), 26, 21],
		[P(140, -28), P(104, -16), 21, 18],
		[P(260, 30), P(820, 40), 72, 92],
	];
	const KS = [0, 4, 4, 16, 8, 4, 8, 4, 8, 4, 14, 5, 4, 34];
	const point = (x, y) => {
		let d = 1e9;
		for (let q = 0; q < S.length; q++) {
			const g = S[q];
			const e = uc(x, y, g[0][0], g[0][1], g[1][0], g[1][1], g[2] * sc, g[3] * sc);
			d = q ? smn(d, e, KS[q]) : e;
		}
		return d;
	};
	// Fläche des Ende-Raums, die die Bühne zeigt (rechts und unten über die 1280 x 800 hinaus)
	const x1 = (W - cam.ox) / cam.f;
	const y1 = (H - cam.oy) / cam.f;
	const w = Math.max(1, Math.round(W * dpr));
	const h = Math.max(1, Math.round(H * dpr));
	for (const cv of [back, front])
		if (cv.width !== w || cv.height !== h) {
			cv.width = w;
			cv.height = h;
		}
	for (const ctx of [cb, cf]) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, w, h);
		ctx.setTransform(dpr * cam.f, 0, 0, dpr * cam.f, dpr * cam.ox, dpr * cam.oy);
		ctx.fillStyle = ink;
	}
	const dot = (cx, x, y, v, i, j) => {
		v *= 0.78 + 0.4 * hsh(i, j);
		if (v > HB[(j & 3) * 4 + (i & 3)] / 16 + 0.035) {
			const z = 0.9 + 1.5 * Math.min(1, v);
			cx.fillRect(x - z / 2, y - z / 2, z, z);
		}
	};
	const cw = Math.ceil(x1 / CG);
	const chh = Math.ceil(y1 / CG);
	if (!st.cm || st.cm.length !== cw * chh) st.cm = new Uint8Array(cw * chh);
	const cm = st.cm;
	const tipFar = P(800, 10);
	for (let cj = 0; cj < chh; cj++)
		for (let ci = 0; ci < cw; ci++) {
			const x = ci * CG + 6;
			const y = cj * CG + 6;
			let m = 0;
			if (holdBack(x, y) < 40 || phoneBox(x, y) < 60) m |= 1;
			if (holdFront(x, y) < 26) m |= 2;
			if (cap(x, y, tx, ty, tipFar[0], tipFar[1], 160) < 0 && point(x, y) < 36) m |= 4;
			cm[cj * cw + ci] = m;
		}
	for (let y = 1.5, j = 0; y < y1; y += step, j++)
		for (let x = 1.5, i = 0; x < x1; x += step, i++) {
			const m = cm[Math.floor(y / CG) * cw + Math.floor(x / CG)];
			if (!m) continue;
			const lf = lightF(x, y);
			if (m & 1) {
				const pb = phoneBox(x, y);
				if (pb > 0) {
					let v = 0;
					const d = holdBack(x, y);
					if (d < 0) {
						v = shN(holdBack, x, y, d, 70) * (0.45 + 0.6 * lf) * cl(1 - (y - 760) / 320);
						if (d > -2.6 && x < 880) v = Math.max(v, 0.95 * lf);
						v *= 0.35 + 0.65 * cl(pb / 26);
					} else if (d < 18) v = 0.18 * Math.exp(-d / 5) * lf * (hsh(j, i) < 0.4 ? 1 : 0);
					if (pb < 3) v = Math.max(v, 0.85);
					if (v > 0.02) dot(cb, x, y, v, i, j);
				}
			}
			let v2 = 0;
			if (m & 2) {
				const d = holdFront(x, y);
				if (d < 0) {
					v2 = shN(holdFront, x, y, d, 30) * (0.55 + 0.55 * lf);
					if (d > -2.2) v2 = Math.max(v2, 0.9 * lf + 0.1);
					const nq = nail(x, y, 616, 466, 652, 412, 0.72, 14, 11);
					if (nq < 1) v2 = nq > 0.72 ? v2 * 0.45 : Math.min(1, v2 * 0.6 + 0.4);
				} else if (d < 8) v2 = 0.16 * Math.exp(-d / 3);
			}
			if (m & 4) {
				const d = point(x, y);
				const fade = cl(1 - (Math.hypot(x - tx, y - ty) - 300) / 420);
				let v = 0;
				if (d < 0) {
					v = shN(point, x, y, d, 44) * (0.6 + 0.45 * lf + push * 0.25) * fade;
					if (d > -2.4) v = Math.max(v, 0.92 * fade);
					const n0 = P(4, 0);
					const n1 = P(30, 0);
					const nq = nail(x, y, n0[0], n0[1], n1[0], n1[1], 0.5, 12, 10);
					if (nq < 1) v = nq > 0.7 ? v * 0.45 : Math.min(1, v * 0.6 + 0.38);
				} else if (d < 14) v = 0.16 * Math.exp(-d / 4) * fade * (hsh(i, j + 3) < 0.45 ? 1 : 0);
				v2 = Math.max(v2, v);
			}
			if (v2 > 0.02) dot(cf, x, y, v2, i, j);
		}
	if (pr < 0.8) {
		const rr = 10 + pr * 150;
		const a = 1 - pr / 0.8;
		cf.globalAlpha = a;
		for (let k = 0; k < 72; k++) {
			const an = (k / 72) * 6.2832;
			cf.fillRect(ht.x + Math.cos(an) * rr - 1, ht.y + Math.sin(an) * rr - 1, 2, 2);
		}
		cf.globalAlpha = 1;
	}
}
