'use client';

import { useEffect, useRef } from 'react';
import { dprFor, observe, sizeBacking } from '../../core/canvas';
import { css } from '../../core/dc';
import { vnz } from '../../core/math';

// Flut-Band zwischen Intro und "So geht's": sechs Zeilen aus weißen Zellen und Ziffern über die ganze
// Breite, dekorativ. Zelle 16 px und Ziffer 10,5 px wie die Flut der Intro, das Muster kommt aus
// derselben Rauschfunktion und ist fest (scharf, keine Bewegung).

const CELL = 16;
const ZEILEN = 6;
const SKALA = 0.13 / 32;

function zeichne(cv: HTMLCanvasElement, W: number) {
	const dpr = dprFor(2, 2);
	const H = CELL * ZEILEN;
	sizeBacking(cv, W, H, dpr);
	const g = cv.getContext('2d');
	if (!g) return;
	g.setTransform(dpr, 0, 0, dpr, 0, 0);
	g.fillStyle = '#0A0A0A';
	g.fillRect(0, 0, W, H);
	const cols = Math.ceil(W / CELL);
	const on = new Uint8Array(cols * ZEILEN);
	for (let b = 0; b < ZEILEN; b++)
		for (let a = 0; a < cols; a++) {
			const n = vnz((a + 0.5) * CELL * SKALA + 7.3, (b + 0.5) * CELL * SKALA + 2.1);
			// oben fast geschlossen, nach unten und nach rechts lichtet sich die Flut
			const dichte = 1.05 - (b / (ZEILEN - 1)) * 0.95 - (a / cols) * 0.3;
			on[b * cols + a] = n + dichte * 0.8 - 0.4 > 0.5 ? 1 : 0;
		}
	g.fillStyle = '#FAFAFA';
	g.beginPath();
	for (let b = 0; b < ZEILEN; b++)
		for (let a = 0; a < cols; a++) if (on[b * cols + a]) g.rect(a * CELL, b * CELL, CELL, CELL);
	g.fill();
	g.font = '500 10.5px "JetBrains Mono", monospace';
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillStyle = 'rgba(250,250,250,0.66)';
	for (let b = 0; b < ZEILEN; b++)
		for (let a = 0; a < cols; a++) {
			if (on[b * cols + a]) continue;
			let k = 0;
			for (let dj = -1; dj <= 1; dj++)
				for (let di = -1; di <= 1; di++) {
					const x = a + di;
					const y = b + dj;
					if ((di || dj) && x >= 0 && y >= 0 && x < cols && y < ZEILEN && on[y * cols + x]) k++;
				}
			if (k) g.fillText(String(k), a * CELL + CELL / 2, b * CELL + CELL / 2 + 0.5);
		}
}

export function FlutBand() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current as HTMLCanvasElement;
		const host = cv.parentElement as HTMLElement;
		let w = 0;
		const neu = (W: number) => {
			w = W;
			if (W > 0) zeichne(cv, W);
		};
		const stop = observe(host, neu);
		// Schrift nachladen: neu zeichnen, sobald JetBrains Mono da ist
		let tot = false;
		document.fonts?.ready.then(() => {
			if (!tot && w > 0) zeichne(cv, w);
		});
		return () => {
			tot = true;
			stop();
		};
	}, []);
	return (
		<div
			id="flutband"
			data-sec="flutband"
			aria-hidden="true"
			style={css(`background:#0A0A0A;overflow:hidden;height:${CELL * ZEILEN}px`)}
		>
			<canvas ref={ref} style={css(`display:block;width:100%;height:${CELL * ZEILEN}px`)} />
		</div>
	);
}
