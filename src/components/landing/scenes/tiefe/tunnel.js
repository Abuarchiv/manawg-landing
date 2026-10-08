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
const SPACING = 0.065; // Punktabstand der Wörter in Welt-Einheiten (nur Hochformat)
const SP = 26; // Abstand der Wort-Inseln in der Tiefe, wie im Entwurf

// Wort aus der Schrift abtasten (wie im Entwurf: Schrift 200 px auf 1600 x 270, Grundlinie 0,82). Die Maske
// bleibt erhalten, damit je Format mit anderem Raster abgetastet werden kann.
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
	o.fillText(word, w / 2, px * 0.82);
	const d = o.getImageData(0, 0, w, h).data;
	let x0 = 1e9;
	let x1 = -1e9;
	let y0 = 1e9;
	let y1 = -1e9;
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++)
			if (d[(y * w + x) * 4 + 3] > 128) {
				if (x < x0) x0 = x;
				if (x > x1) x1 = x;
				if (y < y0) y0 = y;
				if (y > y1) y1 = y;
			}
	return { d, w, h, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, width: x1 - x0 };
};
// Punkte der Maske im Raster step, bezogen auf (ox, oy)
const rasterPts = (r, step, ox, oy) => {
	const pts = [];
	for (let y = 0; y < r.h; y += step)
		for (let x = 0; x < r.w; x += step)
			if (r.d[(y * r.w + x) * 4 + 3] > 128) pts.push([x - ox, y - oy]);
	return pts;
};

// Deckkraft des Untertitels aus der Tiefe dz seiner Insel. Im Entwurf ein Dreieck um dz 9 (Breite 5 nach
// beiden Seiten); hier dieselben Grenzen, aber mit Plateau (voll für |dz - 9| <= 3,5), damit der Satz lesbar steht.
const plateauOf = (dz) => cl((5 - Math.abs(dz - 9)) / 1.5);
// Dichte des Worts aus seiner Tiefe, wie im Entwurf: ab dz 34 da, ab dz 22 voll, im Durchflug (dz < 1,2) weg
const wortDichte = (dz) => cl((34 - dz) / 12) * cl(dz / 1.2);

// Hochformat: Staubmenge und Punktgröße wachsen mit der Bildschirmfläche (Bezug 1440 x 900), gerastert, damit nicht
// jede Größenänderung neu baut. Querformat: feste Menge wie im Entwurf (die Bühne skaliert als Ganzes).
const flaeche = (s) =>
	s.mode === 'hoch' ? Math.round(cl((s.W * s.H) / 1296000, 0.6, 2) * 4) / 4 : 1;
const bauKey = (s) => `${s.mode}${flaeche(s)}`;

function build(s) {
	const hoch = s.mode === 'hoch';
	const k = hoch ? 0.5 : 1; // Streuung der Inseln und des Zeigerversatzes an die Boxbreite anpassen
	const target = ((hoch ? 0.72 : 0.5) * s.bw * 9) / F; // Wortbreite in Welt-Einheiten bei Tiefe 9 (hoch: 72 % der Breite)
	s.isl = s.raw.map((r, i) => {
		// Querformat wie im Entwurf: Maßstab 1, Raster 5 px, Mitte der Abtast-Fläche. Hochformat: Wort an die Breite angepasst.
		const sc = hoch ? cl(target / (r.width / 85), 0.25, 1.5) : 1;
		const raw = hoch
			? rasterPts(r, 2 * Math.max(1, Math.round((SPACING * 85) / (sc * 2))), r.cx, r.cy)
			: rasterPts(r, 5, r.w / 2, r.h / 2);
		const pts = raw.map((p) => [(p[0] / 85) * sc, (p[1] / 85) * sc]);
		// hw: halbe Wortbreite in Welt-Einheiten (für die Klemmung am Bildschirmrand)
		return { z: SP * i, x: [-4.5, 4.5, -4.5][i] * k, y: [0.8, -0.8, 0.8][i], sc, pts, hw: (r.width / 85) * sc * 0.5 };
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
	// Staub: Querformat 1600 Punkte in 60 x 36 Einheiten wie im Entwurf; Hochformat schmaler, höher und dichter,
	// die Kanten des Staubkastens blenden dort weich aus (siehe frame)
	const fl = flaeche(s);
	s.fl = Math.sqrt(fl);
	const nd = hoch ? Math.round(11000 * fl) : 1600;
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
		minSicht: 0.1,
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
			s.hint = cv.parentElement.querySelector('[data-hint]');
			s.kopf = document.querySelector('[data-kopf]');
		},
		frame(s, _t, dt) {
			const ctx = s.ctx;
			if (!s.raw || s.built !== loop.fv) {
				s.built = loop.fv;
				s.raw = WORDS.map((w) => sampleT(w, 200));
				s.bm = null;
			}
			if (s.bm !== bauKey(s)) {
				build(s);
				s.stale = true;
			}
			const { f, ox, oy, cx, cy } = s;
			const hoch = s.mode === 'hoch';
			// Beim Hinausscrollen läuft die Szene unter den fixen Kopf: Wortbild und Zeile blenden über den obersten
			// 28 px unter dem Kopfband aus (Kopfunterkante in Canvas-Koordinaten)
			const kopfUnten = s.kopf ? s.kopf.getBoundingClientRect().bottom : 0;
			const kopfY = kopfUnten - s.el.getBoundingClientRect().top;
			const r = sec.getBoundingClientRect();
			const sp = cl(-r.top / Math.max(1, r.height - s.H));
			// Mit reduzierter Bewegung folgt die Kamera dem Scroll ohne Nachlauf
			if (s.reduced) s.dp = sp;
			else s.dp = Math.abs(sp - s.dp) < 1e-5 ? sp : s.dp + (sp - s.dp) * lag(0.1, dt);
			const p = s.dp;
			const camZ = -14 + p * (2 * SP + 5);
			const seg = cl((camZ + 14) / SP, 0, 1.999);
			const si = Math.floor(seg);
			const sf = ss(seg - si);
			if (s.m.in) {
				const k = s.reduced ? 1 : lag(0.06, dt);
				s.sm.x += (s.m.x - s.sm.x) * k;
				s.sm.y += (s.m.y - s.sm.y) * k;
				if (Math.hypot(s.m.x - s.sm.x, s.m.y - s.sm.y) < 0.01) {
					s.sm.x = s.m.x;
					s.sm.y = s.m.y;
				}
			}
			// Im Stand (gleicher Scroll, ruhender Zeiger, gleiche Größe und Schrift) bleibt das letzte Bild stehen
			const kk = (s.kk ||= []);
			const gleich =
				!s.stale && !(s.pv && s.pv.a > 0.01) && kk[0] === p && kk[1] === s.sm.x && kk[2] === s.sm.y &&
				kk[3] === kopfY && kk[4] === s.m.x && kk[5] === s.m.y && kk[6] === s.m.in;
			kk[0] = p;
			kk[1] = s.sm.x;
			kk[2] = s.sm.y;
			kk[3] = kopfY;
			kk[4] = s.m.x;
			kk[5] = s.m.y;
			kk[6] = s.m.in;
			if (gleich) return;
			s.stale = false;
			const camX =
				lerp(s.isl[si].x, s.isl[si + 1].x, sf) * 0.85 + ((s.sm.x - cx) / cx) * 1.2 * s.k;
			const camY =
				lerp(s.isl[si].y, s.isl[si + 1].y, sf) * 0.85 + ((s.sm.y - cy) / cy) * 0.8 * s.k;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			ctx.fillStyle = '#FAFAFA';
				// Nahzeichen je Schriftstufe (8, 11, 16, 23, 32, 45 px wie im Entwurf) in wiederverwendeten Eimern
			const nb = (s.nb ||= [[], [], [], [], [], []]);
			for (const e of nb) e.length = 0;
			const m = s.m;
			const mx = m.in ? m.x : 0;
			const my = m.in ? m.y : 0;
			// Abstoßung des Zeigers nur bei Bewegung: Stärke aus der Geschwindigkeit, ruhend in ca. 300 ms weg.
			// Solange ein Satz steht, halber Radius; Wörter in voller Größe (dz < 34) bleiben unberührt.
			const pv = (s.pv ||= { x: m.x, y: m.y, a: 0 });
			if (m.in) {
				const v = (Math.hypot(m.x - pv.x, m.y - pv.y) * f) / Math.max(dt, 0.001);
				pv.a = Math.max(pv.a * Math.exp(-dt * 10), cl(v / 600));
			} else pv.a = 0;
			pv.x = m.x;
			pv.y = m.y;
			const rep = pv.a > 0.01 ? pv.a : 0;
			const plat = Math.max(...s.isl.map((I) => plateauOf(I.z - camZ)));
			const rad = 120 * (1 - 0.5 * plat);
			// Unterzeilen: Deckkraft und Rechteck (Ausschlusszone der Partikel)
			const zonen = (s.zonen ||= s.caps.map(() => ({ x0: 0, y0: 0, x1: 0, y1: 0, w: 0 })));
			s.caps.forEach((el, i) => {
				const dz = s.isl[i].z - camZ;
				const w = plateauOf(dz);
				const z = zonen[i];
				z.w = w;
				if (w >= 0.02) {
					const b = el.offsetParent;
					z.x0 = el.offsetLeft - 28;
					z.x1 = el.offsetLeft + el.offsetWidth + 28;
					z.y0 = el.offsetTop - 28;
					z.y1 = (b ? b.clientHeight : s.H) + 28;
				}
			});
			// Klemmung je Wort: die Kamera driftet seitlich zum nächsten Wort, während das aktuelle noch groß ist. Die
			// Wortbox bleibt immer innerhalb von Viewport minus 16 px Rand (Verschiebung in Szenen-Einheiten) und wird
			// auf höchstens 92 % der Breite skaliert statt angeschnitten (dz < 5: Durchflug, dort blendet der Rand aus).
			// Nur Hochformat: im Querformat fliegen die Wörter wie im Entwurf frei durchs Bild.
			const klemm = (s.klemm ||= s.isl.map(() => ({ dx: 0, k: 1 })));
			s.isl.forEach((I, i) => {
				const z = klemm[i];
				const dz = I.z - camZ;
				z.dx = 0;
				z.k = 1;
				if (!hoch || dz < 0.25 || dz > 60) return;
				const fz = F / dz;
				let hw = I.hw * fz * f;
				if (2 * hw > 0.92 * s.W) {
					z.k = (0.92 * s.W) / (2 * hw);
					hw *= z.k;
				}
				const X = ox + (cx + (I.x - camX) * fz) * f;
				const d = 2 * hw > s.W - 32 ? s.W / 2 - X : X - hw < 16 ? 16 - (X - hw) : X + hw > s.W - 16 ? s.W - 16 - (X + hw) : 0;
				z.dx = d / f;
			});
			for (const q of s.P) {
				let x = q[0];
				let y = q[1];
				const dz = q[2] - camZ;
				if (dz < 0.25 || dz > 110) continue;
				const word = q[4] >= 0;
				let kx = 1;
				let ddx = 0;
				if (word) {
					const I = s.isl[q[4]];
					kx = klemm[q[4]].k;
					ddx = klemm[q[4]].dx;
					if (dz < 5) {
						const k = (5 - dz) * 0.35;
						x += (x - I.x) * k;
						y += (y - I.y) * k;
					}
					x = I.x + (x - I.x) * kx;
				}
				const fz = F / dz;
				let sx = cx + (x - camX) * fz + ddx;
				let sy = cy + (y - camY) * fz;
				let X = ox + sx * f;
				let Y = oy + sy * f;
				if (X < -40 || Y < -40 || X > s.W + 40 || Y > s.H + 40) continue;
				if (rep && !(word && dz < 34)) {
					const dx = sx - mx;
					const dy = sy - my;
					const d = Math.hypot(dx, dy);
					const R = word ? 48 : rad;
					if (d < R) {
						const g = (1 - d / R) * 46 * f * rep * (word ? 0.2 : 1);
						X += (dx / (d + 0.1)) * g;
						Y += (dy / (d + 0.1)) * g;
					}
				}
					if (qa.nurWort != null && q[4] !== qa.nurWort) continue; // Messhaken: nur ein Wort zeichnen
			// Wörter und Staub wie im Entwurf: Wort ab dz 34 da und ab 22 voll, Staub blendet in der Ferne aus
			let a = word
				? wortDichte(dz)
				: cl(dz / 1.2) *
					(hoch
						? cl((110 - dz) / 30) * cl((s.dX - Math.abs(q[0])) / 7) * cl((s.dY - Math.abs(q[1])) / 7) * 0.6
						: cl((110 - dz) / 50) * 0.55);
			a *= cl((Y - kopfY) / 28);
			// Hochformat: nahe Wörter (dz < 5) ziehen beim Durchflug nach außen und blenden am Bildrand weich aus,
			// statt hart angeschnitten zu wirken. Querformat: Zeichen fliegen unverändert aus dem Bild.
			if (hoch && word && dz < 5) a *= cl(Math.min(X, s.W - X) / 48) * cl(Math.min(Y, s.H - Y) / 48);
			if (a <= 0.01) continue;
			// Ausschlusszone um die Unterzeile (DOM-Rechteck plus 28 px): Partikel und Zeichen laufen dort aus
			for (const z of zonen) {
				if (z.w < 0.02) continue;
				const ddx = Math.max(z.x0 - X, X - z.x1, 0);
				const ddy = Math.max(z.y0 - Y, Y - z.y1, 0);
				a *= 1 - z.w * (1 - cl(Math.hypot(ddx, ddy) / 28));
			}
			if (a <= 0.01) continue;
			const sz = cl(0.07 * fz, 0.8, 64); // Zeichengröße in Szenen-Einheiten (Entwurf)
			if (sz < 6) {
				// Punkt: Quadrat der Kantenlänge 0,55 x sz; im Hochformat mit Mindestgröße
				const side = hoch ? Math.max(word ? 1 : 1.5 * s.fl, sz * 0.8 * f) : sz * 0.55 * f;
				ctx.globalAlpha = a;
				ctx.fillRect(X, Y, side, side);
			} else nb[Math.min(5, Math.floor(Math.log2(sz / 6) * 2))].push(X, Y, q[3], a);
		}
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		for (let tr = 0; tr < 6; tr++) {
			const e = nb[tr];
			if (!e.length) continue;
			ctx.font = `500 ${(Math.round(8 * 2 ** (tr / 2)) * f).toFixed(2)}px ${MONO}`;
			for (let i = 0; i < e.length; i += 4) {
				ctx.globalAlpha = e[i + 3];
				ctx.fillText(e[i + 2], e[i], e[i + 1]);
			}
		}
			ctx.globalAlpha = 1;
			s.caps.forEach((el, i) => {
				const ky = el.getBoundingClientRect().top - kopfUnten;
				el.style.opacity = (zonen[i].w * cl(ky / 28)).toFixed(3);
			});
			// Hinweis „weiter scrollen“ nur am Anfang der Fahrt, danach ganz weg
			if (s.hint) s.hint.style.opacity = (1 - ss(p / 0.06)).toFixed(3);
			if (s.dep) s.dep.textContent = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0');
		},
	});
}
