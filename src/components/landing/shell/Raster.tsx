'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import s from './Raster.module.css';

// Konstruktionsraster (V5, Referenzen 3 und 15): gestrichelte Spaltenlinien über die ganze Seite, an den
// Abschnittskanten kleine Kreuzpunkte. Nur CSS plus eine Zeiger-Variable: die Linien liegen fest am Fenster,
// nahe dem Zeiger leuchtet eine zweite Lage durch eine weiche Maske (Feder, nur solange sie läuft). Die
// Kreuze sitzen im Dokument und werden nur beim Vermessen (Größenänderung) neu gesetzt, nie im Scroll.
// mix-blend-mode: difference macht die Linien auf Schwarz hell und auf Papier dunkel.

// Spalten als Anteil der Satzbreite: Ränder links und rechts, drei Teilungen. Hochformat zeigt nur die Ränder.
const SPALTEN = [0, 0.25, 0.5, 0.75, 1];
const FEDER = 0.16;

const spalte = (f: number): CSSProperties => ({ '--f': f }) as CSSProperties;
const innen = (f: number) => (f > 0 && f < 1 ? '' : undefined);

export function Raster() {
	const gitter = useRef<HTMLDivElement>(null);
	const bahn = useRef<HTMLDivElement>(null);
	const [kanten, setKanten] = useState<number[]>([]);

	// Kreuze: Oberkante jedes Abschnitts, relativ zur Bahn
	useEffect(() => {
		const main = document.getElementById('inhalt');
		const el = bahn.current;
		if (!main || !el) return;
		const mess = () => {
			const o = el.getBoundingClientRect().top;
			const ys = [...main.children].map((c) => Math.round(c.getBoundingClientRect().top - o));
			setKanten((alt) => (alt.length === ys.length && alt.every((y, i) => y === ys[i]) ? alt : ys));
		};
		mess();
		const ro = new ResizeObserver(mess);
		ro.observe(main);
		for (const c of main.children) ro.observe(c);
		document.fonts?.ready.then(mess);
		return () => ro.disconnect();
	}, []);

	// Zeiger: Ziel direkt, Anzeige mit Nachlauf; die Schleife läuft nur, bis der Abstand verschwindet
	useEffect(() => {
		const el = gitter.current;
		if (!el || !matchMedia('(hover: hover)').matches) return;
		const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const z = { x: 0, y: 0, tx: 0, ty: 0, da: false };
		let raf = 0;
		const bild = () => {
			raf = 0;
			const k = ruhig ? 1 : FEDER;
			z.x += (z.tx - z.x) * k;
			z.y += (z.ty - z.y) * k;
			if (Math.abs(z.tx - z.x) + Math.abs(z.ty - z.y) < 0.4) {
				z.x = z.tx;
				z.y = z.ty;
			} else raf = requestAnimationFrame(bild);
			el.style.setProperty('--zx', `${z.x.toFixed(1)}px`);
			el.style.setProperty('--zy', `${z.y.toFixed(1)}px`);
		};
		const an = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
			z.tx = e.clientX;
			z.ty = e.clientY;
			if (!z.da) {
				z.da = true;
				z.x = z.tx;
				z.y = z.ty;
				el.dataset.zeiger = '';
			}
			if (!raf) raf = requestAnimationFrame(bild);
		};
		const weg = () => {
			z.da = false;
			delete el.dataset.zeiger;
		};
		window.addEventListener('pointermove', an, { passive: true });
		document.documentElement.addEventListener('pointerleave', weg);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', an);
			document.documentElement.removeEventListener('pointerleave', weg);
		};
	}, []);

	return (
		<>
			<div ref={gitter} className={s.gitter} aria-hidden="true">
				<div className={s.linien}>
					{SPALTEN.map((f) => (
						<i key={f} data-innen={innen(f)} style={spalte(f)} />
					))}
				</div>
				<div className={`${s.linien} ${s.licht}`}>
					{SPALTEN.map((f) => (
						<i key={f} data-innen={innen(f)} style={spalte(f)} />
					))}
				</div>
			</div>
			<div ref={bahn} className={s.bahn} aria-hidden="true">
				{kanten.map((y, j) =>
					SPALTEN.map((f) => (
						<b key={`${j}-${f}`} data-innen={innen(f)} style={{ ...spalte(f), top: y }} />
					)),
				)}
			</div>
		</>
	);
}
