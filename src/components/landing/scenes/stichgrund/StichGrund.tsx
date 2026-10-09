'use client';

import { useEffect, useRef } from 'react';
import { ss } from '../../core/math';

// Leise Stich-Atmosphäre für ruhige Abschnitte (Installieren, Fragen): waagerechte Linien im Abstand von 4 px, deren
// Breite dem Ton eines weichen Lichtscheins folgt und die sich mit ihm biegen, wie im Hero. Nichts steht hinter Text:
// um jede Textzeile des Abschnitts (frei) laufen die Linien aus. Gezeichnet wird nur bei Änderung (Größe, Schrift,
// puls), nicht je Bild. Ein neuer puls schickt eine Welle durch den Schein, der Schein folgt dem Ziel weich.

/** Mitte und Halbachsen des Scheins in CSS-px relativ zur Fläche. */
export interface Ziel {
	x: number;
	y: number;
	rx: number;
	ry: number;
	/** Stärke 0 bis 1 (Standard 1). */
	a?: number;
}

interface Props {
	/** Lage des Scheins; r ist das Rechteck der Fläche (Fenster-Koordinaten). */
	ziel: (r: DOMRect) => Ziel | null;
	/** Selektor der Bereiche mit Text (Treffer im Elternelement), um die der Schein auslaufen muss. */
	frei: string;
	/** Ändert sich der Wert, läuft eine Welle durch den Schein. */
	puls?: number;
}

const ABST = 4; // Linienabstand in CSS-px
const SCHRITT = 3; // Stützpunkte entlang der Linie
const MAXA = 0.62; // Anteil des Linienabstands, den die breiteste Linie füllt
const RAND = 26; // so weit vor dem Text ist der Schein weg (CSS-px)

interface Kasten {
	l: number;
	t: number;
	r: number;
	b: number;
}

const UX = new Float32Array(2048);
const UY = new Float32Array(2048);
const VY = new Float32Array(2048);

export function StichGrund({ ziel, frei, puls = 0 }: Props) {
	const cv = useRef<HTMLCanvasElement>(null);
	const zielRef = useRef(ziel);
	zielRef.current = ziel;
	const start = useRef<() => void>(() => {});
	useEffect(() => {
		const c = cv.current as HTMLCanvasElement;
		const host = c.parentElement as HTMLElement;
		const ctx = c.getContext('2d');
		if (!ctx) return;
		const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const cur = { x: 0, y: 0, rx: 1, ry: 1, a: 1, da: false };
		let welle = 0;
		let raf = 0;
		let last = 0;
		// Neu zeichnen nötig (Größe, Schrift, Auslöser); der Scroll allein zeichnet nur, wenn das Ziel wandert
		let schmutz = true;

		// Textzeilen im Abschnitt als Kästen relativ zur Fläche
		const kaesten = (r: DOMRect): Kasten[] => {
			const k: Kasten[] = [];
			const rg = document.createRange();
			for (const el of host.querySelectorAll(frei)) {
				const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
				for (let n = tw.nextNode(); n; n = tw.nextNode()) {
					if (!n.textContent?.trim()) continue;
					rg.selectNodeContents(n);
					for (const q of rg.getClientRects())
						k.push({
							l: q.left - r.left,
							t: q.top - r.top,
							r: q.right - r.left,
							b: q.bottom - r.top,
						});
				}
			}
			return k;
		};

		// Ein Bild zeichnen; gibt zurück, ob der Schein noch auf dem Weg zum Ziel ist
		const zeichne = (): boolean => {
			const r = c.getBoundingClientRect();
			const z = zielRef.current(r);
			if (!z) {
				schmutz = false;
				return false;
			}
			const bewegt =
				Math.abs(z.x - cur.x) +
				Math.abs(z.y - cur.y) +
				Math.abs(z.rx - cur.rx) +
				Math.abs(z.ry - cur.ry);
			if (!schmutz && bewegt < 0.3 && welle < 0.01 && Math.abs((z.a ?? 1) - cur.a) < 0.01)
				return false;
			schmutz = false;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = Math.max(1, Math.round(r.width * dpr));
			const h = Math.max(1, Math.round(r.height * dpr));
			if (c.width !== w || c.height !== h) {
				c.width = w;
				c.height = h;
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, r.width, r.height);
			cur.a += ((z.a ?? 1) - cur.a) * (cur.da ? 0.14 : 1);
			const k = !cur.da || ruhig ? 1 : 0.14;
			cur.x += (z.x - cur.x) * k;
			cur.y += (z.y - cur.y) * k;
			cur.rx += (z.rx - cur.rx) * k;
			cur.ry += (z.ry - cur.ry) * k;
			cur.da = true;
			const kk = kaesten(r);
			const ya = Math.max(0, Math.floor((cur.y - cur.ry) / ABST)) * ABST;
			const yb = Math.min(r.height, cur.y + cur.ry);
			const xa = Math.max(0, cur.x - cur.rx);
			const xb = Math.min(r.width, cur.x + cur.rx);
			ctx.fillStyle = '#FAFAFA';
			ctx.globalAlpha = 0.6;
			ctx.beginPath();
			let m = 0;
			const flush = () => {
				if (m > 1) {
					ctx.moveTo(UX[0] ?? 0, UY[0] ?? 0);
					for (let j = 1; j < m; j++) ctx.lineTo(UX[j] ?? 0, UY[j] ?? 0);
					for (let j = m - 1; j >= 0; j--) ctx.lineTo(UX[j] ?? 0, VY[j] ?? 0);
					ctx.closePath();
				}
				m = 0;
			};
			for (let y = ya; y <= yb; y += ABST) {
				for (let x = xa; x <= xb && m < 2040; x += SCHRITT) {
					const dx = (x - cur.x) / cur.rx;
					const dy = (y - cur.y) / cur.ry;
					const q = dx * dx + dy * dy;
					let tone = q < 1 ? 0.62 * cur.a * (1 - q) ** 1.6 : 0;
					if (welle > 0.01) tone *= 1 + welle * 0.7 * Math.sin(Math.sqrt(q) * 9 - (1 - welle) * 10);
					for (const b of kk) {
						const ex = Math.max(b.l - x, x - b.r, 0);
						const ey = Math.max(b.t - y, y - b.b, 0);
						tone *= ss((Math.hypot(ex, ey) - 4) / RAND);
						if (tone < 0.02) break;
					}
					const lw = ABST * MAXA * Math.min(1, tone) ** 0.8;
					if (lw < 0.3) {
						flush();
						continue;
					}
					const yy = y + tone * 7 * Math.sin(dx * 2.2);
					UX[m] = x;
					UY[m] = yy - lw / 2;
					VY[m] = yy + lw / 2;
					m++;
				}
				flush();
			}
			ctx.fill();
			ctx.globalAlpha = 1;
			return bewegt > 0.5;
		};

		const tick = (now: number) => {
			raf = 0;
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			welle = ruhig ? 0 : Math.max(0, welle - dt / 1.1);
			const weiter = zeichne();
			if (weiter || welle > 0.01 || schmutz) raf = requestAnimationFrame(tick);
		};
		const an = () => {
			schmutz = true;
			if (raf) return;
			last = performance.now();
			raf = requestAnimationFrame(tick);
		};
		start.current = () => {
			welle = 1;
			an();
		};
		// Folgt das Ziel dem Scroll (Handy sticky), nur sichtbar neu zeichnen
		const rolle = () => {
			const r = c.getBoundingClientRect();
			if (!raf && r.bottom > 0 && r.top < innerHeight) raf = requestAnimationFrame(tick);
		};
		addEventListener('scroll', rolle, { passive: true });
		const ro = new ResizeObserver(an);
		ro.observe(host);
		document.fonts?.ready.then(an);
		an();
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			removeEventListener('scroll', rolle);
			start.current = () => {};
		};
	}, [frei]);
	// Der erste Lauf löst keine Welle aus
	const erst = useRef(true);
	// biome-ignore lint/correctness/useExhaustiveDependencies: puls ist der Auslöser
	useEffect(() => {
		if (erst.current) {
			erst.current = false;
			return;
		}
		start.current();
	}, [puls]);
	return (
		<canvas
			ref={cv}
			aria-hidden="true"
			style={{
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: '100%',
				zIndex: -1,
				pointerEvents: 'none',
			}}
		/>
	);
}
