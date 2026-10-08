// Die Tiefe: Fahrt durch eine Wolke aus Stichen, in der die Wörter GELD, HAUSHALT und ABSPRACHEN als gestochene
// Inseln liegen (waagerechte Linien wie bei Kupferstich-Lettern, am Buchstabenrand dünner, leicht gewölbt).
// Die Kamera hängt am Scroll-Fortschritt des Abschnitts.
// Szenenraum: quer Bezugsbox 1280 x 800, hoch eigene Box von 640 Einheiten Breite (die Wörter stehen bei
// Tiefe 9 auf 40 bis 50 % der Breite und passen so in jedes Format). Gezeichnet wird in CSS-px.

import { type SceneState, loop, qa, register } from '../../core/loop';
import { cl, hsh, lag, lerp, ss } from '../../core/math';

const TT = '"Inter Tight", sans-serif';
const F = 720; // Brennweite in Szenen-Einheiten
const WORDS = ['GELD', 'HAUSHALT', 'ABSPRACHEN'] as const;
const SPACING = 0.065; // Punktabstand der Wörter in Welt-Einheiten (nur Hochformat)
const SP = 26; // Abstand der Wort-Inseln in der Tiefe, wie im Entwurf
const INSEL_X = [-4.5, 4.5, -4.5] as const;
const INSEL_Y = [0.8, -0.8, 0.8] as const;

/** Abgetastete Wortmaske: Alphakanal d (w x h), Mitte (cx, cy) und Breite der belegten Fläche. */
interface Maske {
	d: Uint8ClampedArray;
	w: number;
	h: number;
	cx: number;
	cy: number;
	width: number;
}

/** Rasterpunkt der Wortmaske: x, y und Ton (1 innen, kleiner am Buchstabenrand). */
type Pt = [x: number, y: number, ton: number];

/** Wort-Insel: Tiefe z, Mitte (x, y), Maßstab sc, Punkte relativ zur Mitte, halbe Wortbreite hw, Linienabstand sp. */
interface Insel {
	z: number;
	x: number;
	y: number;
	sc: number;
	pts: Pt[];
	hw: number;
	sp: number;
}

/** Punkt der Wolke: x, y, z, Ton (Strichstärke 0 bis 1), Insel (-1 = Staub). */
type Punkt = [x: number, y: number, z: number, ton: number, insel: number];

/** Ausschlusszone um eine Unterzeile (DOM-Rechteck) samt Deckkraft w. */
interface Zone {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	w: number;
}

/** Klemmung eines Worts am Bildschirmrand: Verschiebung dx (Szenen-Einheiten), Stauchung k. */
interface Klemmung {
	dx: number;
	k: number;
}

/** Zustand des letzten gezeichneten Bildes (im Stand bleibt es stehen). */
interface Stand {
	p: number;
	smx: number;
	smy: number;
	kopfY: number;
	mx: number;
	my: number;
	mIn: boolean;
}

interface TiefeState extends SceneState {
	// resize läuft schon beim Anmelden, vor init: cx, cy setzt resize selbst
	cx: number;
	cy: number;
	sm: { x: number; y: number };
	built: number;
	dp: number;
	caps: HTMLElement[];
	dep: HTMLElement | null;
	hint: HTMLElement | null;
	kopf: HTMLElement | null;
	raw: Maske[];
	isl: Insel[];
	P: Punkt[];
	k: number;
	fl: number;
	dX: number;
	dY: number;
	/** Schlüssel des Aufbaus (Modus und Fläche), null = neu abtasten. */
	bm: string | null;
	kk: Stand;
	/** Zeigergeschwindigkeit für die Abstoßung (a = Stärke). */
	pv?: { x: number; y: number; a: number };
	zonen: Zone[];
	/** Klemmung je Insel, build legt sie an. */
	klemm: Klemmung[];
}

// Wort aus der Schrift abtasten (wie im Entwurf: Schrift 200 px auf 1600 x 270, Grundlinie 0,82). Die Maske
// bleibt erhalten, damit je Format mit anderem Raster abgetastet werden kann.
const sampleT = (word: string, px: number): Maske => {
	const w = 1600;
	const h = Math.ceil(px * 1.35);
	const oc = document.createElement('canvas');
	oc.width = w;
	oc.height = h;
	const o = oc.getContext('2d');
	if (!o) throw new Error('Kein 2D-Kontext für die Wortmaske');
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
			if ((d[(y * w + x) * 4 + 3] ?? 0) > 128) {
				if (x < x0) x0 = x;
				if (x > x1) x1 = x;
				if (y < y0) y0 = y;
				if (y > y1) y1 = y;
			}
	return { d, w, h, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, width: x1 - x0 };
};
// Punkte der Maske im Raster step, bezogen auf (ox, oy). Ton aus den Nachbarn im halben Raster: innen 1, am
// Rand dünner, so schwellen die Stichlinien zur Buchstabenmitte an.
const rasterPts = (r: Maske, step: number, ox: number, oy: number): Pt[] => {
	const pts: Pt[] = [];
	const an = (x: number, y: number) =>
		x >= 0 && y >= 0 && x < r.w && y < r.h && (r.d[(y * r.w + x) * 4 + 3] ?? 0) > 128;
	const h = Math.max(1, Math.round(step / 2));
	for (let y = 0; y < r.h; y += step)
		for (let x = 0; x < r.w; x += step)
			if (an(x, y)) {
				const n = +an(x - step, y) + +an(x + step, y) + +an(x, y - h) + +an(x, y + h);
				pts.push([x - ox, y - oy, 0.35 + n * 0.1625]);
			}
	return pts;
};

// Deckkraft des Untertitels aus der Tiefe dz seiner Insel. Im Entwurf ein Dreieck um dz 9 (Breite 5 nach
// beiden Seiten); hier dieselben Grenzen, aber mit Plateau (voll für |dz - 9| <= 3,5), damit der Satz lesbar steht.
const plateauOf = (dz: number): number => cl((5 - Math.abs(dz - 9)) / 1.5);
// Dichte des Worts aus seiner Tiefe, wie im Entwurf: ab dz 34 da, ab dz 22 voll, im Durchflug (dz < 1,2) weg
const wortDichte = (dz: number): number => cl((34 - dz) / 12) * cl(dz / 1.2);

// Hochformat: Staubmenge und Punktgröße wachsen mit der Bildschirmfläche (Bezug 1440 x 900), gerastert, damit nicht
// jede Größenänderung neu baut. Querformat: feste Menge wie im Entwurf (die Bühne skaliert als Ganzes).
const flaeche = (s: TiefeState): number =>
	s.mode === 'hoch' ? Math.round(cl((s.W * s.H) / 1296000, 0.6, 2) * 4) / 4 : 1;
const bauKey = (s: TiefeState): string => `${s.mode}${flaeche(s)}`;

function build(s: TiefeState) {
	const hoch = s.mode === 'hoch';
	const k = hoch ? 0.5 : 1; // Streuung der Inseln und des Zeigerversatzes an die Boxbreite anpassen
	const target = ((hoch ? 0.72 : 0.5) * s.bw * 9) / F; // Wortbreite in Welt-Einheiten bei Tiefe 9 (hoch: 72 % der Breite)
	s.isl = s.raw.map((r, i): Insel => {
		// Querformat wie im Entwurf: Maßstab 1, Raster 5 px, Mitte der Abtast-Fläche. Hochformat: Wort an die Breite angepasst.
		const sc = hoch ? cl(target / (r.width / 85), 0.25, 1.5) : 1;
		const step = hoch ? 2 * Math.max(1, Math.round((SPACING * 85) / (sc * 2))) : 5;
		const raw = hoch ? rasterPts(r, step, r.cx, r.cy) : rasterPts(r, step, r.w / 2, r.h / 2);
		const pts = raw.map((p): Pt => [(p[0] / 85) * sc, (p[1] / 85) * sc, p[2]]);
		// hw: halbe Wortbreite in Welt-Einheiten (für die Klemmung am Bildschirmrand)
		return {
			z: SP * i,
			x: (INSEL_X[i] ?? 0) * k,
			y: INSEL_Y[i] ?? 0,
			sc,
			pts,
			hw: (r.width / 85) * sc * 0.5,
			sp: (step / 85) * sc,
		};
	});
	s.k = k;
	s.klemm = s.isl.map((): Klemmung => ({ dx: 0, k: 1 }));
	s.P = [];
	s.isl.forEach((I, kk) => {
		// eine Ebene je Wort: die Strichstücke einer Zeile schließen zur Linie
		for (const p of I.pts) s.P.push([I.x + p[0], I.y + p[1], I.z, p[2], kk]);
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
			hsh(q, 4),
			-1,
		]);
	s.bm = bauKey(s);
}

// Klemmung je Wort: die Kamera driftet seitlich zum nächsten Wort, während das aktuelle noch groß ist. Die
// Wortbox bleibt immer innerhalb von Viewport minus 16 px Rand (Verschiebung in Szenen-Einheiten) und wird
// auf höchstens 92 % der Breite skaliert statt angeschnitten (dz < 5: Durchflug, dort blendet der Rand aus).
// Nur Hochformat: im Querformat fliegen die Wörter wie im Entwurf frei durchs Bild.
function klemmen(s: TiefeState, klemm: Klemmung[], camZ: number, camX: number) {
	const { f, ox, cx } = s;
	const hoch = s.mode === 'hoch';
	s.isl.forEach((I, i) => {
		const z = klemm[i];
		if (!z) return;
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
		const d =
			2 * hw > s.W - 32
				? s.W / 2 - X
				: X - hw < 16
					? 16 - (X - hw)
					: X + hw > s.W - 16
						? s.W - 16 - (X + hw)
						: 0;
		z.dx = d / f;
	});
}

/** Alles, was die Punktschleife je Bild von der Kamera und dem Zeiger braucht. */
interface Ansicht {
	camX: number;
	camY: number;
	camZ: number;
	kopfY: number;
	mx: number;
	my: number;
	/** Stärke der Zeigerabstoßung (0 = keine) und Radius für Staub. */
	rep: number;
	rad: number;
	zonen: Zone[];
	klemm: Klemmung[];
}

// Alle Punkte projizieren und als Stich zeichnen. Wortpunkte: waagerechtes Strichstück über einen Rasterabstand,
// Nachbarn schließen zur durchgehenden Linie; Dicke aus dem Ton, die Zeile wölbt sich sanft über das Wort.
// Staub: kurze waagerechte Stiche, Länge aus dem Ton, wachsen mit der Nähe wie im Entwurf die Zeichen.
function zeichnePunkte(s: TiefeState, a: Ansicht) {
	const ctx = s.ctx;
	if (!ctx) return;
	const { f, ox, oy, cx, cy } = s;
	const { camX, camY, camZ, kopfY, mx, my, rep, rad, zonen, klemm } = a;
	const hoch = s.mode === 'hoch';
	for (const q of s.P) {
		let x = q[0];
		let y = q[1];
		const dz = q[2] - camZ;
		if (dz < 0.25 || dz > 110) continue;
		const word = q[4] >= 0;
		let kx = 1;
		let ddx = 0;
		let auf = 1; // Aufweitung beim Durchflug: die Striche wachsen mit, die Linien bleiben geschlossen
		if (word) {
			const I = s.isl[q[4]];
			const kl = klemm[q[4]];
			if (!I || !kl) continue;
			kx = kl.k;
			ddx = kl.dx;
			if (dz < 5) {
				const k = (5 - dz) * 0.35;
				auf = 1 + k;
				x += (x - I.x) * k;
				y += (y - I.y) * k;
			}
			x = I.x + (x - I.x) * kx;
		}
		const fz = F / dz;
		const sx = cx + (x - camX) * fz + ddx;
		const sy = cy + (y - camY) * fz;
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
		let al = word
			? wortDichte(dz)
			: cl(dz / 1.2) *
				(hoch
					? cl((110 - dz) / 30) *
						cl((s.dX - Math.abs(q[0])) / 7) *
						cl((s.dY - Math.abs(q[1])) / 7) *
						0.6
					: cl((110 - dz) / 50) * 0.55);
		al *= cl((Y - kopfY) / 28);
		// Hochformat: nahe Wörter (dz < 5) ziehen beim Durchflug nach außen und blenden am Bildrand weich aus,
		// statt hart angeschnitten zu wirken. Querformat: Zeichen fliegen unverändert aus dem Bild.
		if (hoch && word && dz < 5) al *= cl(Math.min(X, s.W - X) / 48) * cl(Math.min(Y, s.H - Y) / 48);
		if (al <= 0.01) continue;
		// Ausschlusszone um die Unterzeile (DOM-Rechteck plus 28 px): Partikel und Zeichen laufen dort aus
		for (const z of zonen) {
			if (z.w < 0.02) continue;
			const zx = Math.max(z.x0 - X, X - z.x1, 0);
			const zy = Math.max(z.y0 - Y, Y - z.y1, 0);
			al *= 1 - z.w * (1 - cl(Math.hypot(zx, zy) / 28));
		}
		if (al <= 0.01) continue;
		const ton = q[3];
		let w: number;
		let h: number;
		if (word) {
			const I = s.isl[q[4]];
			const sp = (I?.sp ?? 0.06) * fz * f; // Linienabstand am Bildschirm
			w = sp * kx * auf * 1.04;
			h = sp * (0.08 + 0.3 * ton);
			Y += Math.sin((q[0] - (I?.x ?? 0)) * 1.3 + q[4]) * sp * 0.45;
		} else {
			const sz = cl(0.07 * fz, 0.8, 64) * f; // Zeichengröße wie im Entwurf
			h = hoch ? Math.max(0.9 * s.fl, sz * 0.22) : Math.max(0.6, sz * 0.16);
			w = h * (2.2 + ton * 3);
		}
		// Unter einem Gerätepixel: Deckkraft statt Dicke, damit feine Linien nicht flimmern
		if (h < 0.75) {
			al *= h / 0.75;
			h = 0.75;
		}
		ctx.globalAlpha = al;
		ctx.fillRect(X - w / 2, Y - h / 2, w, h);
	}
	ctx.globalAlpha = 1;
}

/**
 * Wortmasken abtasten und Wolke bauen, je Aufruf ein Schritt (ein Wort oder der Aufbau), true wenn alles aktuell ist.
 * Das Vorwärmen (warm) ruft das je Bild einmal, frame holt Fehlendes in einem Zug nach (Schrift oder Format neu).
 */
function bereite(s: TiefeState): boolean {
	if (s.built !== loop.fv) {
		s.built = loop.fv;
		s.raw = [];
		s.bm = null;
	}
	const wort = WORDS[s.raw.length];
	if (wort) {
		s.raw.push(sampleT(wort, 200));
		return false;
	}
	if (s.bm !== bauKey(s)) {
		build(s);
		s.stale = true;
		return false;
	}
	return true;
}

/** Meldet die Tiefe-Szene an. sec: Abschnitt mit Sticky-Bühne. Gibt die Abmeldung zurück. */
export function registerTiefe(cv: HTMLCanvasElement, sec: HTMLElement) {
	const wurzel = cv.parentElement ?? cv;
	return register<TiefeState>({
		name: 'tiefe',
		el: cv,
		host: wurzel,
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
			s.raw = [];
			s.isl = [];
			s.P = [];
			s.bm = null;
			s.klemm = [];
			s.kk = {
				p: Number.NaN,
				smx: Number.NaN,
				smy: Number.NaN,
				kopfY: Number.NaN,
				mx: Number.NaN,
				my: Number.NaN,
				mIn: false,
			};
			s.caps = [...wurzel.querySelectorAll<HTMLElement>('[data-dcap]')];
			s.zonen = s.caps.map((): Zone => ({ x0: 0, y0: 0, x1: 0, y1: 0, w: 0 }));
			s.dep = wurzel.querySelector<HTMLElement>('[data-depth]');
			s.hint = wurzel.querySelector<HTMLElement>('[data-hint]');
			s.kopf = document.querySelector<HTMLElement>('[data-kopf]');
		},
		warm: bereite,
		frame(s, _t, dt) {
			const ctx = s.ctx;
			if (!ctx) return;
			while (!bereite(s));
			const { f, cx, cy } = s;
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
			const kk = s.kk;
			const gleich =
				!s.stale &&
				!(s.pv && s.pv.a > 0.01) &&
				kk.p === p &&
				kk.smx === s.sm.x &&
				kk.smy === s.sm.y &&
				kk.kopfY === kopfY &&
				kk.mx === s.m.x &&
				kk.my === s.m.y &&
				kk.mIn === s.m.in;
			kk.p = p;
			kk.smx = s.sm.x;
			kk.smy = s.sm.y;
			kk.kopfY = kopfY;
			kk.mx = s.m.x;
			kk.my = s.m.y;
			kk.mIn = s.m.in;
			if (gleich) return;
			s.stale = false;
			const I0 = s.isl[si];
			const I1 = s.isl[si + 1];
			if (!I0 || !I1) return;
			const camX = lerp(I0.x, I1.x, sf) * 0.85 + ((s.sm.x - cx) / cx) * 1.2 * s.k;
			const camY = lerp(I0.y, I1.y, sf) * 0.85 + ((s.sm.y - cy) / cy) * 0.8 * s.k;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			ctx.fillStyle = '#FAFAFA';
			const m = s.m;
			const mx = m.in ? m.x : 0;
			const my = m.in ? m.y : 0;
			// Abstoßung des Zeigers nur bei Bewegung: Stärke aus der Geschwindigkeit, ruhend in ca. 300 ms weg.
			// Solange ein Satz steht, halber Radius; Wörter in voller Größe (dz < 34) bleiben unberührt.
			const pv = s.pv ?? { x: m.x, y: m.y, a: 0 };
			s.pv = pv;
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
			const zonen = s.zonen;
			s.caps.forEach((el, i) => {
				const I = s.isl[i];
				const z = zonen[i];
				if (!I || !z) return;
				z.w = plateauOf(I.z - camZ);
				if (z.w >= 0.02) {
					const b = el.offsetParent;
					z.x0 = el.offsetLeft - 28;
					z.x1 = el.offsetLeft + el.offsetWidth + 28;
					z.y0 = el.offsetTop - 28;
					z.y1 = (b ? b.clientHeight : s.H) + 28;
				}
			});
			const klemm = s.klemm;
			klemmen(s, klemm, camZ, camX);
			zeichnePunkte(s, { camX, camY, camZ, kopfY, mx, my, rep, rad, zonen, klemm });
			s.caps.forEach((el, i) => {
				const ky = el.getBoundingClientRect().top - kopfUnten;
				const op = ((zonen[i]?.w ?? 0) * cl(ky / 28)).toFixed(3);
				el.style.opacity = op;
				el.style.setProperty('--k', op); // Leitlinie zeichnet mit der Deckkraft (landing.css .leit)
			});
			// Hinweis „weiter scrollen“ nur am Anfang der Fahrt, danach ganz weg
			if (s.hint) s.hint.style.opacity = (1 - ss(p / 0.06)).toFixed(3);
			if (s.dep)
				s.dep.textContent = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0');
		},
	});
}
