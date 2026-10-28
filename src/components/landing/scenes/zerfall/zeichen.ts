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
const TIEFE = 2; // Abstand Bildschirm → Ziffern in Bildschirmtiefen

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
	let gross: { cv: HTMLCanvasElement; z: number } | null = null; // vierfach, damit nahe Zeichen scharf bleiben
	let sheetKey = '';
	let war = 0;
	let leer = true;
	let ausWert = '';
	// --app-aus nur am Bildschirm des Handys (Standbild und iframe), nicht an #final: eine geerbte Variable an der
	// Wurzel ließe in jedem Bild den Stil der ganzen Szene neu berechnen. Nur bei Änderung schreiben.
	const setzeAus = (v: string) => {
		if (v === ausWert) return;
		ausWert = v;
		document
			.querySelector('iframe[title="ManaWG-App"]')
			?.parentElement?.style.setProperty('--app-aus', v);
	};

	const aus = (T: number) => {
		uebergang.verdeckt = false;
		setzeAus(T >= 1 ? '1' : '0');
		if (!leer && ctx) {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, cv.width, cv.height);
			leer = true;
		}
	};

	// Elemente einmal suchen, nicht jedes Bild (läuft auch, solange das Intro klebt)
	let buehne: HTMLElement | null = null;
	let zif: HTMLCanvasElement[] = [];
	let lage = { ende: 0, hoehe: 0, zif: 0 };
	let lageKey = '';
	let lageZeit = -9;
	let vorab: ReturnType<typeof quellen> = [];
	let vorMessung = false;
	let quelleZeit = -9;
	const off = onFrame(() => {
		if (!buehne?.isConnected) buehne = document.querySelector<HTMLElement>('[data-buehne="intro"]');
		if (zif.length < ZIFFERN.length || !zif[0]?.isConnected)
			zif = [...document.querySelectorAll<HTMLCanvasElement>('#so-gehts canvas')];
		if (!ctx || !buehne || zif.length < ZIFFERN.length || loop.reduced) return aus(1);
		const H = loop.vh;
		const W = loop.vw;
		// Lagen im Dokument nur bei Größenwechsel und etwa einmal je Sekunde lesen: ein getBoundingClientRect in
		// jedem Bild erzwang nach den Stil-Schreibern der Bühne eine eigene Layout-Runde (am Handy der größte Posten
		// beim Scrollen durch das Demo-Handy). Die Bühne klebt (sticky), ihr Rand folgt aus dem Ende des Abschnitts.
		const sy = window.scrollY;
		const lk = `${W}x${H}`;
		if (lk !== lageKey || loop.now - lageZeit > 1) {
			const sec = buehne.parentElement?.getBoundingClientRect();
			const z = zif[0]?.getBoundingClientRect();
			if (!sec || !z) return aus(1);
			lage = { ende: sec.bottom + sy, hoehe: buehne.offsetHeight, zif: z.top + sy };
			lageKey = lk;
			lageZeit = loop.now;
		}
		const bt = Math.min(0, lage.ende - sy - lage.hoehe);
		const T = bt >= 0 ? 0 : cl(-bt / Math.max(1, lage.zif - sy - bt - ZIEL_Y * H));
		const neu = war <= 0;
		war = T;
		if (T <= 0) {
			// Kurz vor dem Übergang die Quellen in einer Leerlaufpause messen (alle Rechtecke der App kosten am Handy
			// ein ganzes Bild), dann startet der Zerfall ohne Hänger
			if (lage.ende - sy - lage.hoehe < H && !vorMessung && loop.now - quelleZeit > 0.6) {
				vorMessung = true;
				const mess = () => {
					vorMessung = false;
					vorab = quellen(document.querySelector<HTMLIFrameElement>('iframe[title="ManaWG-App"]'));
					quelleZeit = loop.now;
				};
				if ('requestIdleCallback' in window) window.requestIdleCallback(mess, { timeout: 500 });
				else setTimeout(mess, 50);
			}
			return aus(T);
		}
		if (T >= 1) return aus(T);

		const hoch = loop.mode === 'hoch';
		const { cs, gl } = zifferMasse(hoch);
		const fr = document.querySelector<HTMLIFrameElement>('iframe[title="ManaWG-App"]');
		// Ziele (Zellen der drei Ziffern) und Quellen (Inhalt der App) beim Eintritt oder nach Größenwechsel neu
		const k = `${W}x${H}|${loop.fv}|${zif.map((c) => `${c.clientWidth}x${c.clientHeight}`).join()}`;
		if (neu || k !== key) {
			key = k;
			const q = vorab.length ? vorab : quellen(fr);
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

		// Höchstens 1,5-fach: die Fläche ist bildschirmgroß und tausende Zeichen fliegen schnell, bei 2-fach war die
		// Grafikkarte auf Retina-Desktops die Grenze (44 % weniger Pixel, im Flug nicht zu sehen)
		const dpr = Math.min(1.5, devicePixelRatio || 1);
		if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
			cv.width = Math.round(W * dpr);
			cv.height = Math.round(H * dpr);
		}
		const sk = `${gl}|${dpr}|${loop.fv}`;
		if (!sheet || sk !== sheetKey) {
			sheet = blatt(gl, dpr);
			gross = blatt(gl * 4, dpr);
			sheetKey = sk;
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, cv.width, cv.height);
		leer = false;
		const ra = fr?.getBoundingClientRect() ?? buehne.getBoundingClientRect();
		const zr = zif.map((c) => c.getBoundingClientRect());
		// erst lesen, dann schreiben: sonst erzwingt das Lesen der Lagen eine zweite Layout-Runde je Bild
		setzeAus(ss(T / LOS).toFixed(3));
		const auf = ss(T / (LOS * 0.6)); // Zeichen erscheinen, während die App ausblendet
		const tq = Math.floor(loop.now / 0.09);
		// Durchstich: eine Kamera fliegt durch den Bildschirm des Handys (Ebene z = 1) auf die Ziffern zu (Ebene
		// z = 1 + TIEFE). Bildlage p = C + (P - C) / (z - kz): die App-Zeichen platzen nach außen, die Ziffern wachsen
		// aus dem Fluchtpunkt, ihre Zellen liegen erst als Wolke in der Tiefe und ziehen sich zur Ebene zusammen.
		const u = cl((T - LOS * 0.7) / (1 - LOS * 0.7));
		// Kamera so, dass die Ziffern gleichmäßig (logarithmisch) wachsen, kurz über das Ziel hinaus, dann sitzen
		const kzOf = (v: number) => {
			const sd =
				(1 + TIEFE) ** -(1 - ss(v)) * (1 + 0.04 * Math.sin(Math.PI * cl((v - 0.72) / 0.28)));
			return 1 + TIEFE - 1 / sd;
		};
		const kz = kzOf(u);
		const kzAlt = kzOf(cl(u - 0.035));
		const bx = ra.left + ra.width / 2;
		const by = ra.top + ra.height / 2;
		const cx = bx + (W / 2 - bx) * ss(u);
		const cy = by + (H * 0.46 - by) * ss(u);
		const dreh = 0.2 * (1 - ss(u)) ** 2; // die Ziffern drehen sich im Anflug ein
		const dc = Math.cos(dreh);
		const ds = Math.sin(dreh);
		// Grund: der Bildschirm wächst mit der Kamera, bis er das Fenster füllt; ab dem Anflug blendet er aus,
		// damit Überschriften und Texte von "So geht's" schon darunter stehen
		const sb = 1 / Math.max(0.001, 1 - kz);
		const grund = auf * (1 - ss((u - 0.78) / 0.2));
		if (grund > 0.01) {
			ctx.fillStyle = `rgba(10,10,10,${grund.toFixed(3)})`;
			if (kz >= 1) ctx.fillRect(0, 0, cv.width, cv.height);
			else {
				const x0 = (cx + (ra.left - cx) * sb) * dpr;
				const y0 = (cy + (ra.top - cy) * sb) * dpr;
				const rw = ra.width * sb * dpr;
				const rh = ra.height * sb * dpr;
				ctx.fillRect(x0, y0, rw, rh);
				// Rahmen des Bildschirms als dünne Linie, er fliegt mit am Betrachter vorbei
				ctx.strokeStyle = `rgba(250,250,250,${(0.35 * auf * (1 - kz)).toFixed(3)})`;
				ctx.lineWidth = dpr;
				ctx.strokeRect(x0, y0, rw, rh);
			}
		}
		const z2 = sheet.z;
		const kl = sheet;
		const gr = gross ?? sheet;
		// Spur aus echten Zeichen statt Bewegungsunschärfe: bis zu fünf Wiederholungen zwischen alter und neuer Lage
		const zeichne = (
			x: number,
			y: number,
			xa: number,
			ya: number,
			ton: number,
			a: number,
			g: number,
			nMax = 5,
		) => {
			if (a < 0.01 || x < -g || y < -g || x > W + g || y > H + g) return;
			const dl = Math.hypot(x - xa, y - ya);
			const n = Math.min(nMax, Math.floor(dl / (g / dpr)));
			for (let k = n; k >= 0; k--) {
				const f = n ? k / n : 0;
				const b = g > z2 * 1.3 ? gr : kl;
				ctx.globalAlpha = a * (1 - f * 0.8);
				ctx.drawImage(
					b.cv,
					b.z * ton,
					0,
					b.z,
					b.z,
					Math.round((x + (xa - x) * f) * dpr - g / 2),
					Math.round((y + (ya - y) * f) * dpr - g / 2),
					g,
					g,
				);
			}
		};
		for (const [i, p] of teile.entries()) {
			const lauf = Math.floor(hsh(i + tq, p.z) * RAMPE.length) % RAMPE.length;
			// App-Zeichen auf der Ebene des Bildschirms
			if (kz < 0.97) {
				const sx = ra.left + p.u * ra.width;
				const sy = ra.top + p.v * ra.height;
				const s1 = 1 / (1 - kz);
				const s0 = 1 / Math.max(0.03, 1 - Math.min(kzAlt, kz));
				const g = Math.round(z2 * Math.min(6, s1 ** 0.8));
				const ton = kz > 0.02 ? lauf : Math.floor(hsh(i, 3) * RAMPE.length);
				zeichne(
					cx + (sx - cx) * s1,
					cy + (sy - cy) * s1,
					cx + (sx - cx) * s0,
					cy + (sy - cy) * s0,
					ton,
					0.85 * auf * (1 - ss((kz - 0.75) / 0.22)),
					g,
				);
			}
			// Zellen der Ziffern: erst eine Wolke in der Tiefe (Streuung je Zelle), die sich zur Ebene zusammenzieht
			const r = zr[p.z];
			if (!r) continue;
			const tx = r.left + p.x + cs / 2;
			const ty = r.top + p.y + cs / 2;
			const wolke = (1 - ss((u - 0.1) / 0.4)) * 0.25;
			const zt = 1 + TIEFE + p.w * wolke;
			const s1 = 1 / Math.max(0.05, zt - kz);
			const s0 = 1 / Math.max(0.05, zt - kzAlt);
			const dx = tx - W / 2;
			const dy = ty - H * 0.46;
			const qx = W / 2 + dx * dc - dy * ds;
			const qy = H * 0.46 + dx * ds + dy * dc;
			const fertig = u >= 0.995;
			const a = ss((u - 0.16) / 0.2) * auf * (fertig && p.ton === 2 ? 0.42 : 0.95);
			const g = Math.round(z2 * Math.min(2.4, Math.max(0.5, s1)));
			zeichne(
				cx + (qx - cx) * s1,
				cy + (qy - cy) * s1,
				cx + (qx - cx) * s0,
				cy + (qy - cy) * s0,
				// die Zellen rasten nacheinander auf ihr Zeichen ein, die Ziffern werden schon im Flug lesbar
				fertig || hsh(i, 7) < (u - 0.35) / 0.45 ? (p.ton === 0 ? 0 : 2) : lauf,
				a,
				g,
				2,
			);
		}
		ctx.globalAlpha = 1;
	});

	return () => {
		off();
		uebergang.verdeckt = false;
	};
}
