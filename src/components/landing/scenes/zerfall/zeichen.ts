// Übergang Handy → "So geht's": beim Weiterscrollen zerfällt die App im Handy in Mono-Zeichen. Jedes Zeichen
// sitzt erst dort, wo in der App Text oder ein Symbol steht, löst sich dann mit dem Scroll, fliegt in einem
// Bogen nach unten und landet als Zelle der großen Ziffern 01 bis 03. Danach übernehmen die Ziffern selbst
// (sogehts/ziffern.ts, uebergang.verdeckt). Alles hängt am Scroll und läuft rückwärts genauso.
//
// Fortschritt T: 0, solange die Intro-Bühne klebt; 1, wenn die erste Ziffer bei 30 % der Fensterhöhe steht.

import { loop, onFrame } from '../../core/loop';
import { cl, hsh, ss } from '../../core/math';
import { raster, uebergang, zifferMasse } from '../sogehts/ziffern';

const RAMPE = '@%#*+=-:';
const ZIFFERN = ['01', '02', '03'];
const LOS = 0.18; // bis hier zerfällt die App an Ort und Stelle in Zeichen
const ZIEL_Y = 0.3; // Lage der Ziffern-Oberkante (Anteil der Fensterhöhe) bei T = 1

/** Ein Zeichen: Quelle in der App (u, v relativ zum iframe), Ziel als Zelle der Ziffer z, Start d, Schwung w. */
interface Teil {
	u: number;
	v: number;
	z: number;
	x: number;
	y: number;
	ton: 0 | 2;
	d: number;
	w: number;
}

/** Punkte mit Inhalt in der App: Rechtecke von Text und Symbolen, gewichtet nach Fläche (relativ 0..1). */
function quellen(
	fr: HTMLIFrameElement | null,
): { r: [number, number, number, number]; g: number }[] {
	const aus: { r: [number, number, number, number]; g: number }[] = [];
	const doc = fr?.contentDocument;
	const W = fr?.clientWidth ?? 0;
	const H = fr?.clientHeight ?? 0;
	if (!doc?.body || !W || !H) return aus;
	for (const el of doc.body.querySelectorAll('*')) {
		const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());
		if (!text && el.tagName.toLowerCase() !== 'svg') continue;
		const b = el.getBoundingClientRect();
		if (b.width < 2 || b.height < 2 || b.bottom < 0 || b.top > H || b.right < 0 || b.left > W)
			continue;
		const x0 = cl(b.left / W);
		const y0 = cl(b.top / H);
		const x1 = cl(b.right / W);
		const y1 = cl(b.bottom / H);
		aus.push({ r: [x0, y0, x1 - x0, y1 - y0], g: (x1 - x0) * (y1 - y0) });
	}
	return aus;
}

/** Zeichenblatt der Rampe in Gerätepixeln. */
function blatt(gl: number, dpr: number): { cv: HTMLCanvasElement; z: number } {
	const z = Math.ceil((gl + 4) * dpr);
	const cv = document.createElement('canvas');
	cv.width = z * RAMPE.length;
	cv.height = z;
	const g = cv.getContext('2d');
	if (g) {
		g.font = `500 ${gl * dpr}px "JetBrains Mono", monospace`;
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillStyle = '#FAFAFA';
		for (let i = 0; i < RAMPE.length; i++)
			g.fillText(RAMPE[i] ?? '', z * i + z / 2, z / 2 + 0.5 * dpr);
	}
	return { cv, z };
}

export function startZerfall(cv: HTMLCanvasElement): () => void {
	const ctx = cv.getContext('2d');
	let teile: Teil[] = [];
	let key = '';
	let sheet: { cv: HTMLCanvasElement; z: number } | null = null;
	let sheetKey = '';
	let war = 0;
	let leer = true;
	const root = cv.closest<HTMLElement>('#final');

	const aus = (T: number) => {
		uebergang.verdeckt = false;
		root?.style.setProperty('--app-aus', T >= 1 ? '1' : '0');
		if (!leer && ctx) {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, cv.width, cv.height);
			leer = true;
		}
	};

	const off = onFrame(() => {
		const buehne = document.querySelector<HTMLElement>('[data-buehne="intro"]');
		const zif = [...document.querySelectorAll<HTMLCanvasElement>('#so-gehts canvas')];
		if (!ctx || !buehne || zif.length < ZIFFERN.length || loop.reduced) return aus(1);
		const H = innerHeight;
		const W = innerWidth;
		const bt = buehne.getBoundingClientRect().top;
		const z0 = zif[0]?.getBoundingClientRect() ?? null;
		if (!z0) return aus(1);
		const T = bt >= 0 ? 0 : cl(-bt / Math.max(1, z0.top - bt - ZIEL_Y * H));
		const neu = war <= 0;
		war = T;
		if (T <= 0 || T >= 1) return aus(T);

		const hoch = loop.mode === 'hoch';
		const { cs, gl } = zifferMasse(hoch);
		const fr = document.querySelector<HTMLIFrameElement>('iframe[title="ManaWG-App"]');
		// Ziele (Zellen der drei Ziffern) und Quellen (Inhalt der App) beim Eintritt oder nach Größenwechsel neu
		const k = `${W}x${H}|${loop.fv}|${zif.map((c) => `${c.clientWidth}x${c.clientHeight}`).join()}`;
		if (neu || k !== key) {
			key = k;
			const q = quellen(fr);
			const summe = q.reduce((a, b) => a + b.g, 0);
			teile = [];
			zif.forEach((c, zi) => {
				for (const [i, z] of raster(
					ZIFFERN[zi] ?? '',
					c.clientWidth,
					c.clientHeight,
					cs,
				).entries()) {
					const h1 = hsh(i + zi * 997, 11);
					const h2 = hsh(i + zi * 997, 23);
					// Quelle nach Fläche ziehen; ohne geladene App: gleichmäßig über den Bildschirm
					let u = h1;
					let v = h2;
					if (summe > 0) {
						let r = hsh(i + zi * 997, 37) * summe;
						let t = q[q.length - 1];
						for (const e of q) {
							r -= e.g;
							if (r <= 0) {
								t = e;
								break;
							}
						}
						if (t) {
							u = t.r[0] + h1 * t.r[2];
							v = t.r[1] + h2 * t.r[3];
						}
					}
					teile.push({
						u,
						v,
						z: zi,
						x: z.x,
						y: z.y,
						ton: z.ton,
						// oben in der App löst sich zuerst, dazu Streuung
						d: LOS + v * 0.22 + hsh(i, zi + 5) * 0.12,
						w: (hsh(i, zi + 9) - 0.5) * 2,
					});
				}
			});
		}
		uebergang.verdeckt = true;
		root?.style.setProperty('--app-aus', ss(T / LOS).toFixed(3));

		const dpr = Math.min(2, devicePixelRatio || 1);
		if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
			cv.width = Math.round(W * dpr);
			cv.height = Math.round(H * dpr);
		}
		const sk = `${gl}|${dpr}|${loop.fv}`;
		if (!sheet || sk !== sheetKey) {
			sheet = blatt(gl, dpr);
			sheetKey = sk;
		}
		const { cv: bl, z } = sheet;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, cv.width, cv.height);
		leer = false;
		const ra = fr?.getBoundingClientRect() ?? buehne.getBoundingClientRect();
		const zr = zif.map((c) => c.getBoundingClientRect());
		const auf = ss(T / (LOS * 0.6)); // Zeichen erscheinen, während die App ausblendet
		const tq = Math.floor(loop.now / 0.09);
		for (const [i, p] of teile.entries()) {
			const sx = ra.left + p.u * ra.width;
			const sy = ra.top + p.v * ra.height;
			const r = zr[p.z];
			if (!r) continue;
			const tx = r.left + p.x + cs / 2;
			const ty = r.top + p.y + cs / 2;
			const e = ss(cl((T - p.d) / (0.97 - p.d)));
			// Bogen: seitlich ausholen, dabei etwas zurückfallen (Kontrollpunkt unter der Quelle)
			const cx = sx + (tx - sx) * 0.15 + p.w * W * 0.28;
			const cy = sy + (ty - sy) * 0.55;
			const m = 1 - e;
			const x = m * m * sx + 2 * m * e * cx + e * e * tx;
			const y = m * m * sy + 2 * m * e * cy + e * e * ty;
			if (y < -z || y > H + z) continue;
			const fliegt = e > 0.001 && e < 0.999;
			const ton = fliegt
				? Math.floor(hsh(i + tq, p.z) * RAMPE.length) % RAMPE.length
				: e >= 0.999
					? p.ton
					: Math.floor(hsh(i, 3) * RAMPE.length);
			ctx.globalAlpha = (e >= 0.999 && p.ton === 2 ? 0.42 : fliegt ? 0.95 : 0.8) * auf;
			// im Flug größer (bis 1,9-fach), damit man die Zeichen als Zeichen liest
			const g = Math.round(z * (1 + 0.9 * Math.sin(Math.PI * e)));
			ctx.drawImage(
				bl,
				z * ton,
				0,
				z,
				z,
				Math.round(x * dpr - g / 2),
				Math.round(y * dpr - g / 2),
				g,
				g,
			);
		}
		ctx.globalAlpha = 1;
	});

	return () => {
		off();
		uebergang.verdeckt = false;
	};
}
