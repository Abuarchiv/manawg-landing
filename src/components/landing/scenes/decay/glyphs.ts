// Übergang Handy → "So geht's": beim Weiterscrollen zerfällt die App im Handy in Mono-Zeichen. Jedes Zeichen
// sitzt erst dort, wo in der App Text oder ein Symbol steht, löst sich dann mit dem Scroll, fliegt in einem
// Bogen nach unten und landet als Zelle der großen Ziffern 01 bis 03. Danach übernehmen die Ziffern selbst
// (sogehts/ziffern.ts, uebergang.verdeckt). Alles hängt am Scroll und läuft rückwärts genauso.
//
// Fortschritt T: 0, solange die Intro-Bühne klebt; 1, wenn die erste Ziffer bei 30 % der Fensterhöhe steht.

import { loop, onFrame } from '../../core/loop';
import { cl, hsh, ss } from '../../core/math';
import { buildGrid, digitMetrics, handover } from '../how-it-works/digits';

const RAMP = '@%#*+=-:';
const DIGITS = ['01', '02', '03'];
const DISSOLVE_END = 0.18; // bis hier zerfällt die App an Ort und Stelle in Zeichen
const TARGET_Y = 0.3; // Lage der Ziffern-Oberkante (Anteil der Fensterhöhe) bei T = 1
const DEPTH = 2; // Abstand Bildschirm → Ziffern in Bildschirmtiefen

/** Ein Zeichen: Quelle in der App (u, v relativ zum iframe), Ziel als Zelle der Ziffer z, Start d, Schwung w. */
interface Particle {
	u: number;
	v: number;
	z: number;
	x: number;
	y: number;
	tone: 0 | 2;
	d: number;
	w: number;
}

/** Punkte mit Inhalt in der App: Rechtecke von Text und Symbolen, gewichtet nach Fläche (relativ 0..1). */
function sources(
	fr: HTMLIFrameElement | null,
): { r: [number, number, number, number]; g: number }[] {
	const out: { r: [number, number, number, number]; g: number }[] = [];
	const doc = fr?.contentDocument;
	const W = fr?.clientWidth ?? 0;
	const H = fr?.clientHeight ?? 0;
	if (!doc?.body || !W || !H) return out;
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
		out.push({ r: [x0, y0, x1 - x0, y1 - y0], g: (x1 - x0) * (y1 - y0) });
	}
	return out;
}

/** Zeichenblatt der Rampe in Gerätepixeln. */
function buildSheet(gl: number, dpr: number): { cv: HTMLCanvasElement; z: number } {
	const z = Math.ceil((gl + 4) * dpr);
	const cv = document.createElement('canvas');
	cv.width = z * RAMP.length;
	cv.height = z;
	const g = cv.getContext('2d');
	if (g) {
		g.font = `500 ${gl * dpr}px "JetBrains Mono", monospace`;
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillStyle = '#FAFAFA';
		for (let i = 0; i < RAMP.length; i++)
			g.fillText(RAMP[i] ?? '', z * i + z / 2, z / 2 + 0.5 * dpr);
	}
	return { cv, z };
}

export function startDecay(cv: HTMLCanvasElement): () => void {
	const ctx = cv.getContext('2d');
	let particles: Particle[] = [];
	let key = '';
	let sheet: { cv: HTMLCanvasElement; z: number } | null = null;
	let large: { cv: HTMLCanvasElement; z: number } | null = null; // vierfach, damit nahe Zeichen scharf bleiben
	let sheetKey = '';
	let prevT = 0;
	let blank = true;
	let appOffValue = '';
	// --app-aus nur am Bildschirm des Handys (Standbild und iframe), nicht an #final: eine geerbte Variable an der
	// Wurzel ließe in jedem Bild den Stil der ganzen Szene neu berechnen. Nur bei Änderung schreiben.
	const setAppOff = (v: string) => {
		if (v === appOffValue) return;
		appOffValue = v;
		document
			.querySelector('iframe[title="ManaWG-App"]')
			?.parentElement?.style.setProperty('--app-aus', v);
	};

	const idleFrame = (T: number) => {
		handover.covered = false;
		setAppOff(T >= 1 ? '1' : '0');
		if (!blank && ctx) {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, cv.width, cv.height);
			blank = true;
		}
	};

	// Elemente einmal suchen, nicht jedes Bild (läuft auch, solange das Intro klebt)
	let stageEl: HTMLElement | null = null;
	let digits: HTMLCanvasElement[] = [];
	let rect = { end: 0, height: 0, digitsTop: 0 };
	let rectKey = '';
	let rectTime = -9;
	let early: ReturnType<typeof sources> = [];
	let preMeasure = false;
	let sourceTime = -9;
	const off = onFrame(() => {
		if (!stageEl?.isConnected)
			stageEl = document.querySelector<HTMLElement>('[data-buehne="intro"]');
		if (digits.length < DIGITS.length || !digits[0]?.isConnected)
			digits = [...document.querySelectorAll<HTMLCanvasElement>('#so-gehts canvas')];
		if (!ctx || !stageEl || digits.length < DIGITS.length || loop.reduced) return idleFrame(1);
		const H = loop.vh;
		const W = loop.vw;
		// Lagen im Dokument nur bei Größenwechsel und etwa einmal je Sekunde lesen: ein getBoundingClientRect in
		// jedem Bild erzwang nach den Stil-Schreibern der Bühne eine eigene Layout-Runde (am Handy der größte Posten
		// beim Scrollen durch das Demo-Handy). Die Bühne klebt (sticky), ihr Rand folgt aus dem Ende des Abschnitts.
		const sy = window.scrollY;
		const lk = `${W}x${H}`;
		if (lk !== rectKey || loop.now - rectTime > 1) {
			const sec = stageEl.parentElement?.getBoundingClientRect();
			const z = digits[0]?.getBoundingClientRect();
			if (!sec || !z) return idleFrame(1);
			rect = { end: sec.bottom + sy, height: stageEl.offsetHeight, digitsTop: z.top + sy };
			rectKey = lk;
			rectTime = loop.now;
		}
		const bt = Math.min(0, rect.end - sy - rect.height);
		const T = bt >= 0 ? 0 : cl(-bt / Math.max(1, rect.digitsTop - sy - bt - TARGET_Y * H));
		const next = prevT <= 0;
		prevT = T;
		if (T <= 0) {
			// Kurz vor dem Übergang die Quellen in einer Leerlaufpause messen (alle Rechtecke der App kosten am Handy
			// ein ganzes Bild), dann startet der Zerfall ohne Hänger
			if (rect.end - sy - rect.height < H && !preMeasure && loop.now - sourceTime > 0.6) {
				preMeasure = true;
				const measure = () => {
					preMeasure = false;
					early = sources(document.querySelector<HTMLIFrameElement>('iframe[title="ManaWG-App"]'));
					sourceTime = loop.now;
				};
				if ('requestIdleCallback' in window) window.requestIdleCallback(measure, { timeout: 500 });
				else setTimeout(measure, 50);
			}
			return idleFrame(T);
		}
		if (T >= 1) return idleFrame(T);

		const portrait = loop.mode === 'hoch';
		const { cs, gl } = digitMetrics(portrait);
		const fr = document.querySelector<HTMLIFrameElement>('iframe[title="ManaWG-App"]');
		// Ziele (Zellen der drei Ziffern) und Quellen (Inhalt der App) beim Eintritt oder nach Größenwechsel neu
		const k = `${W}x${H}|${loop.fv}|${digits.map((c) => `${c.clientWidth}x${c.clientHeight}`).join()}`;
		if (next || k !== key) {
			key = k;
			const q = early.length ? early : sources(fr);
			const total = q.reduce((a, b) => a + b.g, 0);
			particles = [];
			digits.forEach((c, zi) => {
				for (const [i, z] of buildGrid(
					DIGITS[zi] ?? '',
					c.clientWidth,
					c.clientHeight,
					cs,
				).entries()) {
					const h1 = hsh(i + zi * 997, 11);
					const h2 = hsh(i + zi * 997, 23);
					// Quelle nach Fläche ziehen; ohne geladene App: gleichmäßig über den Bildschirm
					let u = h1;
					let v = h2;
					if (total > 0) {
						let r = hsh(i + zi * 997, 37) * total;
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
					particles.push({
						u,
						v,
						z: zi,
						x: z.x,
						y: z.y,
						tone: z.tone,
						// oben in der App löst sich zuerst, dazu Streuung
						d: DISSOLVE_END + v * 0.22 + hsh(i, zi + 5) * 0.12,
						w: (hsh(i, zi + 9) - 0.5) * 2,
					});
				}
			});
		}
		handover.covered = true;

		// Höchstens 1,5-fach: die Fläche ist bildschirmgroß und tausende Zeichen fliegen schnell, bei 2-fach war die
		// Grafikkarte auf Retina-Desktops die Grenze (44 % weniger Pixel, im Flug nicht zu sehen)
		const dpr = Math.min(1.5, devicePixelRatio || 1);
		if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
			cv.width = Math.round(W * dpr);
			cv.height = Math.round(H * dpr);
		}
		const sk = `${gl}|${dpr}|${loop.fv}`;
		if (!sheet || sk !== sheetKey) {
			sheet = buildSheet(gl, dpr);
			large = buildSheet(gl * 4, dpr);
			sheetKey = sk;
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, cv.width, cv.height);
		blank = false;
		const ra = fr?.getBoundingClientRect() ?? stageEl.getBoundingClientRect();
		const zr = digits.map((c) => c.getBoundingClientRect());
		// erst lesen, dann schreiben: sonst erzwingt das Lesen der Lagen eine zweite Layout-Runde je Bild
		setAppOff(ss(T / DISSOLVE_END).toFixed(3));
		const rise = ss(T / (DISSOLVE_END * 0.6)); // Zeichen erscheinen, während die App ausblendet
		const tq = Math.floor(loop.now / 0.09);
		// Durchstich: eine Kamera fliegt durch den Bildschirm des Handys (Ebene z = 1) auf die Ziffern zu (Ebene
		// z = 1 + TIEFE). Bildlage p = C + (P - C) / (z - kz): die App-Zeichen platzen nach außen, die Ziffern wachsen
		// aus dem Fluchtpunkt, ihre Zellen liegen erst als Wolke in der Tiefe und ziehen sich zur Ebene zusammen.
		const u = cl((T - DISSOLVE_END * 0.7) / (1 - DISSOLVE_END * 0.7));
		// Kamera so, dass die Ziffern gleichmäßig (logarithmisch) wachsen, kurz über das Ziel hinaus, dann sitzen
		const camZOf = (v: number) => {
			const sd =
				(1 + DEPTH) ** -(1 - ss(v)) * (1 + 0.04 * Math.sin(Math.PI * cl((v - 0.72) / 0.28)));
			return 1 + DEPTH - 1 / sd;
		};
		const camZ = camZOf(u);
		const camZPrev = camZOf(cl(u - 0.035));
		const bx = ra.left + ra.width / 2;
		const by = ra.top + ra.height / 2;
		const cx = bx + (W / 2 - bx) * ss(u);
		const cy = by + (H * 0.46 - by) * ss(u);
		const spin = 0.2 * (1 - ss(u)) ** 2; // die Ziffern drehen sich im Anflug ein
		const dc = Math.cos(spin);
		const ds = Math.sin(spin);
		// Grund: der Bildschirm wächst mit der Kamera, bis er das Fenster füllt; ab dem Anflug blendet er aus,
		// damit Überschriften und Texte von "So geht's" schon darunter stehen
		const sb = 1 / Math.max(0.001, 1 - camZ);
		const base = rise * (1 - ss((u - 0.78) / 0.2));
		if (base > 0.01) {
			ctx.fillStyle = `rgba(10,10,10,${base.toFixed(3)})`;
			if (camZ >= 1) ctx.fillRect(0, 0, cv.width, cv.height);
			else {
				const x0 = (cx + (ra.left - cx) * sb) * dpr;
				const y0 = (cy + (ra.top - cy) * sb) * dpr;
				const rw = ra.width * sb * dpr;
				const rh = ra.height * sb * dpr;
				ctx.fillRect(x0, y0, rw, rh);
				// Rahmen des Bildschirms als dünne Linie, er fliegt mit am Betrachter vorbei
				ctx.strokeStyle = `rgba(250,250,250,${(0.35 * rise * (1 - camZ)).toFixed(3)})`;
				ctx.lineWidth = dpr;
				ctx.strokeRect(x0, y0, rw, rh);
			}
		}
		const z2 = sheet.z;
		const kl = sheet;
		const gr = large ?? sheet;
		// Spur aus echten Zeichen statt Bewegungsunschärfe: bis zu fünf Wiederholungen zwischen alter und neuer Lage
		const draw = (
			x: number,
			y: number,
			xa: number,
			ya: number,
			tone: number,
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
					b.z * tone,
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
		for (const [i, p] of particles.entries()) {
			const run = Math.floor(hsh(i + tq, p.z) * RAMP.length) % RAMP.length;
			// App-Zeichen auf der Ebene des Bildschirms
			if (camZ < 0.97) {
				const sx = ra.left + p.u * ra.width;
				const sy = ra.top + p.v * ra.height;
				const s1 = 1 / (1 - camZ);
				const s0 = 1 / Math.max(0.03, 1 - Math.min(camZPrev, camZ));
				const g = Math.round(z2 * Math.min(6, s1 ** 0.8));
				const tone = camZ > 0.02 ? run : Math.floor(hsh(i, 3) * RAMP.length);
				draw(
					cx + (sx - cx) * s1,
					cy + (sy - cy) * s1,
					cx + (sx - cx) * s0,
					cy + (sy - cy) * s0,
					tone,
					0.85 * rise * (1 - ss((camZ - 0.75) / 0.22)),
					g,
				);
			}
			// Zellen der Ziffern: erst eine Wolke in der Tiefe (Streuung je Zelle), die sich zur Ebene zusammenzieht
			const r = zr[p.z];
			if (!r) continue;
			const tx = r.left + p.x + cs / 2;
			const ty = r.top + p.y + cs / 2;
			const cloud = (1 - ss((u - 0.1) / 0.4)) * 0.25;
			const zt = 1 + DEPTH + p.w * cloud;
			const s1 = 1 / Math.max(0.05, zt - camZ);
			const s0 = 1 / Math.max(0.05, zt - camZPrev);
			const dx = tx - W / 2;
			const dy = ty - H * 0.46;
			const qx = W / 2 + dx * dc - dy * ds;
			const qy = H * 0.46 + dx * ds + dy * dc;
			const done = u >= 0.995;
			const a = ss((u - 0.16) / 0.2) * rise * (done && p.tone === 2 ? 0.42 : 0.95);
			const g = Math.round(z2 * Math.min(2.4, Math.max(0.5, s1)));
			draw(
				cx + (qx - cx) * s1,
				cy + (qy - cy) * s1,
				cx + (qx - cx) * s0,
				cy + (qy - cy) * s0,
				// die Zellen rasten nacheinander auf ihr Zeichen ein, die Ziffern werden schon im Flug lesbar
				done || hsh(i, 7) < (u - 0.35) / 0.45 ? (p.tone === 0 ? 0 : 2) : run,
				a,
				g,
				2,
			);
		}
		ctx.globalAlpha = 1;
	});

	return () => {
		off();
		handover.covered = false;
	};
}
