// Die Wohnung: isometrischer Grundriss aus Punktraster und Wänden, vier Räume werden nacheinander
// angefahren. Dazu die Kurve der Raumkarten (karten) für die Texte der Bühne.
//
// Szenenraum: Die Komposition liegt in der Bezugsbox 1280 x 800 (c.fit), das Punktraster und die
// Wände laufen über die ganze Fläche.

import { loop, qa } from '../../core/loop';
import { BAYER, cl, lag, lerp, ss } from '../../core/math';

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

/**
 * Welche Raumkarte steht, bei Fortschritt P: genau eine (Grenzen bei fs 1,5 / 2,5 / 3,5), Höhe der Deckkraft aus
 * Ein- und Ausblendung der Wohnung. Der Wechsel selbst läuft in der Bühne zeitgesteuert (stage.js, 180 ms):
 * so steht beim Scrollen nie ein Moment ohne lesbaren Text und im Stillstand nie ein Doppelbild.
 */
export function karten(P) {
	const fpA = ss((P - 0.58) / 0.05);
	const endA = ss((P - 0.9) / 0.05);
	const fs = cl((P - 0.62) / 0.28) * 5;
	// die letzte Karte (Pinnwand & Chat) bleibt, bis die Wohnung wegzoomt (endA)
	const idx = fs >= 0.5 ? Math.min(3, Math.floor(fs - 0.5)) : -1;
	return [0, 1, 2, 3].map((j) => (j === idx ? fpA * (1 - endA) : 0));
}

qa.karten = karten;

const states = new WeakMap();

// Zeichen-Maße für Beschriftungen
const widths = new Map();
function breite(ctx, font, text) {
	const k = `${font}|${text}`;
	let w = widths.get(k);
	if (w === undefined) {
		ctx.font = font;
		w = ctx.measureText(text).width;
		widths.set(k, w);
	}
	return w;
}
const trifft = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

/**
 * Beschriftungen setzen (CSS-Pixel, Identität): in den sichtbaren Bereich klemmen, Rechtecken aus dem
 * DOM (Kartenspalte, Kopf, Hinweis) und anderen Beschriftungen ausweichen. items: [{ text, x, y, size, a }]
 */
function setzeLabels(ctx, items, grenzen, meiden) {
	const gesetzt = [];
	for (const it of items) {
		const font = mono(it.size);
		const w = breite(ctx, font, it.text);
		const h = it.size;
		// Ganz außerhalb des Blickfelds: nicht zeigen. Teilweise draußen: hineinklemmen.
		if (
			it.x < grenzen.x0 - w / 2 ||
			it.x > grenzen.x1 + w / 2 ||
			it.y < grenzen.y0 ||
			it.y > grenzen.y1 + h
		) {
			it.aus = true;
			continue;
		}
		let x = Math.min(grenzen.x1 - 8 - w / 2, Math.max(grenzen.x0 + 8 + w / 2, it.x));
		let y = Math.min(grenzen.y1 - 8, Math.max(grenzen.y0 + 8 + h, it.y));
		const rect = () => ({ x0: x - w / 2 - 2, x1: x + w / 2 + 2, y0: y - h - 2, y1: y + 3 });
		for (let n = 0; n < 6; n++) {
			const r = rect();
			const m = meiden.find((q) => trifft(r, q));
			if (m) {
				// zur näheren freien Seite schieben, sonst unter das Hindernis
				const rechts = m.x1 + 4 + w / 2 + 2;
				const links = m.x0 - 4 - w / 2 - 2;
				const okR = rechts <= grenzen.x1 - 8 - w / 2;
				const okL = links >= grenzen.x0 + 8 + w / 2;
				if (okR && (!okL || rechts - x < x - links)) x = rechts;
				else if (okL) x = links;
				else y = m.y1 + 4 + h + 2;
				continue;
			}
			const g = gesetzt.find((q) => trifft(r, q));
			if (g) {
				y = g.y0 - 4;
				if (y < grenzen.y0 + 8 + h) y = it.y + h + 6;
				continue;
			}
			break;
		}
		gesetzt.push(rect());
		it.x = x;
		it.y = y;
		it.w = w;
		it.rect = rect();
	}
	return items;
}

// Hochformat: die Wohnung steht unter der Kartenspalte in einer eigenen Box 900 x 560 (Szenenraum
// 190..1090 x 120..680), jeder Blickpunkt sitzt in der Mitte der Box.
const HOCH_BOX = { bw: 900, bh: 560, x0: 190, y0: 120, ox: 640, oy: 410 };

/** Hochformat: Oberkante und Unterkante der Wohnungsbox unter der Kartenspalte (CSS-px). Auch die Flut spart sie aus. */
export function hochOben(textUnten, safeH) {
	return { top: Math.min(textUnten + 10, safeH * 0.62), bot: safeH - 56 };
}

/** Rechtecke der DOM-Elemente mit data-loch relativ zum Canvas (alle 20 Bilder neu gemessen). */
function messeDom(st, cv) {
	if (st.dom && loop.n - st.domN < 20) return st.dom;
	const r0 = cv.getBoundingClientRect();
	const rect = (el) => {
		const r = el.getBoundingClientRect();
		return { x0: r.left - r0.left, y0: r.top - r0.top, x1: r.right - r0.left, y1: r.bottom - r0.top };
	};
	const root = cv.closest('#final') ?? document;
	st.dom = {
		spalte: null,
		meiden: [],
	};
	for (const el of root.querySelectorAll('[data-loch]')) {
		const q = rect(el);
		if (el.dataset.loch === 'text') {
			st.dom.spalte = q;
			st.dom.meiden.push(q);
		} else st.dom.meiden.push({ x0: q.x0 - 6, y0: q.y0 - 6, x1: q.x1 + 6, y1: q.y1 + 6 });
	}
	st.domN = loop.n;
	return st.dom;
}

/** Zeichnet die Wohnung in das 2D-Canvas. c: Kontext der Bühne. */
export function draw(cv, c) {
	let st = states.get(cv);
	if (!st) {
		st = { ctx: cv.getContext('2d'), sm: { x: 640, y: 400 }, pp: null, labels: [], dom: null, domN: -99 };
		states.set(cv, st);
		qa.wohnungLabels = () => ({
			labels: st.labels.map((l) => ({ text: l.text, size: l.size, ...l.rect, cx: l.x, cy: l.y })),
			spalte: st.dom?.spalte ?? null,
			W: st.W,
			H: st.H,
		});
	}
	const ctx = st.ctx;
	const { W, H, dpr, now, m } = c;
	st.W = W;
	st.H = H;
	const dom = messeDom(st, cv);
	const hoch = c.mode === 'hoch';
	// Abbildung Szenenraum -> Canvas-CSS-Pixel: X = tx + x * f, Y = ty + y * f
	let f;
	let tx;
	let ty;
	let boxTop = 0;
	if (hoch) {
		const sp = dom.spalte;
		boxTop = sp ? hochOben(sp.y1, c.safeH).top : c.safeH * 0.45;
		const boxBot = c.safeH - 56;
		const bh = Math.max(120, boxBot - boxTop);
		f = Math.min(W / HOCH_BOX.bw, bh / HOCH_BOX.bh, 1.25);
		tx = (W - HOCH_BOX.bw * f) / 2 - HOCH_BOX.x0 * f;
		ty = boxTop + (bh - HOCH_BOX.bh * f) / 2 - HOCH_BOX.y0 * f;
	} else {
		f = c.fit.f;
		tx = c.fit.ox;
		ty = c.fit.oy;
	}
	const x0 = -tx / f;
	const y0 = (0 - ty) / f; // die Wohnung läuft auch im Hochformat bis zum oberen Rand
	const x1 = (W - tx) / f;
	const y1 = (H - ty) / f;
	const sp = cl((c.P - 0.62) / 0.28);
	// Zeiger in Szenenkoordinaten, der Lichtkegel läuft nach
	if (m.in) {
		const k = lag(0.25, c.dt ?? 0.016);
		st.sm.x += ((m.x - tx) / f - st.sm.x) * k;
		st.sm.y += ((m.y - ty) / f - st.sm.y) * k;
	}
	const q = sp * 5;
	const i = Math.min(4, Math.floor(q));
	const e = ss((q - i - 0.2) / 0.6);
	const A = STOPS[i];
	const Bs = STOPS[i + 1];
	const cx = lerp(A.cx, Bs.cx, e);
	const cy = lerp(A.cy, Bs.cy, e);
	const u = Math.exp(lerp(Math.log(A.u), Math.log(Bs.u), e));
	const ox = hoch ? HOCH_BOX.ox : lerp(A.ox, Bs.ox, e);
	const oy = hoch ? HOCH_BOX.oy : lerp(A.oy, Bs.oy, e);
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
	ctx.setTransform(dpr * f, 0, 0, dpr * f, dpr * tx, dpr * ty);
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
	const kp = lag(0.02, c.dt ?? 0.016);
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
		pp.x += (pp.tx - pp.x) * kp;
		pp.y += (pp.ty - pp.y) * kp;
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
	const scheiben = st.pp.map((pp, k) => {
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
		return { pt, r };
	});
	// Alles Weitere in CSS-Pixeln: Hochformat deckt oberhalb der Box ab, dann die Beschriftungen
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	// Hochformat: nur hinter dem Textblock abdunkeln, weich auslaufend (keine Schnittkante bei boxTop)
	if (hoch && dom.spalte) {
		const sichtH = Math.max(...karten(c.P));
		if (sichtH > 0.01) {
			const unten = dom.spalte.y1 + 12;
			const g = ctx.createLinearGradient(0, 0, 0, unten + 90);
			const a = 0.9 * sichtH;
			const stop = unten / (unten + 90);
			g.addColorStop(0, `rgba(10,10,10,${a})`);
			g.addColorStop(stop, `rgba(10,10,10,${a})`);
			g.addColorStop(1, 'rgba(10,10,10,0)');
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, W, unten + 90);
		}
	}
	// Quer: links neben der Kartenspalte dunkelt die Wohnung weich ab, damit keine Wand und kein Punkt
	// durch den Kartentext läuft (T-02, T-15)
	const sicht = Math.max(...karten(c.P));
	if (!hoch && dom.spalte && sicht > 0.01) {
		const rechts = dom.spalte.x1 + 28;
		const g = ctx.createLinearGradient(0, 0, rechts + 150, 0);
		const a = 0.9 * sicht;
		const stop = rechts / (rechts + 150);
		g.addColorStop(0, `rgba(10,10,10,${a})`);
		g.addColorStop(stop, `rgba(10,10,10,${a})`);
		g.addColorStop(1, 'rgba(10,10,10,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, rechts + 150, H);
	}
	const size = Math.max(10.5, 11 * f);
	const items = [];
	scheiben.forEach(({ pt, r }, k) => {
		items.push({
			text: PEOC[k][0],
			x: tx + pt[0] * f,
			y: ty + (pt[1] - r) * f - 8,
			size,
			a: 0.72,
			art: 'name',
		});
	});
	ROOMS.forEach((r, ri) => {
		const pt = P(r[1] + r[3] / 2, r[2] + r[4] / 2, 0);
		items.push({ text: r[0], x: tx + pt[0] * f, y: ty + pt[1] * f, size, a: 0.6 + 0.4 * lit[ri], art: 'raum' });
	});
	// Räume zuerst setzen (feste Plätze), Namen weichen aus
	items.sort((a, b) => (a.art === b.art ? 0 : a.art === 'raum' ? -1 : 1));
	const sichtbar = { x0: 0, x1: W, y0: hoch ? boxTop : 0, y1: c.safeH };
	setzeLabels(ctx, items, sichtbar, dom.meiden);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 3;
	for (const it of items) {
		if (it.aus) continue;
		ctx.font = mono(it.size);
		ctx.globalAlpha = it.a;
		ctx.strokeStyle = 'rgba(10,10,10,0.9)';
		ctx.strokeText(it.text, it.x, it.y);
		ctx.fillStyle = '#FAFAFA';
		ctx.fillText(it.text, it.x, it.y);
	}
	ctx.globalAlpha = 1;
	st.labels = items.filter((it) => !it.aus && it.a > 0.05);
	if (m.in) {
		const px = tx + mx * f;
		const py = ty + my * f;
		ctx.strokeStyle = 'rgba(250,250,250,0.6)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(px, py, 18, 0, 6.2832);
		ctx.stroke();
		ctx.fillStyle = '#FAFAFA';
		ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
	}
}
