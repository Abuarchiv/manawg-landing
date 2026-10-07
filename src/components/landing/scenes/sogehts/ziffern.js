// Die Ziffern 01 bis 03 von "So geht's": Schrift als Punktraster aus Mono-Zeichen. Der Zeiger stößt die
// Zellen weg, Federn holen sie zurück. Szenenraum: Bezugsbox 340 x 150.

import { hsh } from '../../core/math';
import { loop, register, takt } from '../../core/loop';

const GR = '@%#*+=-:';

function baue(s, txt, fs, cs, mono) {
	const W = 340;
	const H = 150;
	const ff = mono ? '"JetBrains Mono", monospace' : '"Inter Tight", sans-serif';
	const fw = mono ? 500 : 600;
	const cols = Math.ceil(W / cs);
	const rows = Math.ceil(H / cs);
	const oc = document.createElement('canvas');
	oc.width = cols;
	oc.height = rows;
	const o = oc.getContext('2d');
	o.fillStyle = '#000';
	o.font = `${fw} ${fs / cs}px ${ff}`;
	o.textBaseline = 'alphabetic';
	txt.split('|').forEach((ln, i) => o.fillText(ln, 0, (fs * 0.8 + i * fs * 0.9) / cs));
	const d = o.getImageData(0, 0, cols, rows).data;
	const on = new Uint8Array(cols * rows);
	for (let q = 0; q < on.length; q++) on[q] = d[q * 4 + 3] > 110 ? 1 : 0;
	const old = s.cells || [];
	s.cells = [];
	let k = 0;
	for (let q = 0; q < on.length; q++)
		if (on[q]) {
			const p = old[k++];
			s.cells.push({
				x: (q % cols) * cs,
				y: Math.floor(q / cols) * cs,
				ox: p ? p.x + p.ox - (q % cols) * cs : (hsh(q, 1) - 0.5) * 300,
				oy: p ? p.y + p.oy - Math.floor(q / cols) * cs : (hsh(q, 2) - 0.5) * 300,
				vx: 0,
				vy: 0,
			});
		}
	s.nums = [];
	if (cs >= 10)
		for (let b = 0; b < rows; b++)
			for (let a = 0; a < cols; a++) {
				if (on[b * cols + a]) continue;
				let c = 0;
				for (let dj = -1; dj <= 1; dj++)
					for (let di = -1; di <= 1; di++) {
						const x = a + di;
						const y = b + dj;
						if ((di || dj) && x >= 0 && y >= 0 && x < cols && y < rows && on[y * cols + x]) c++;
					}
				if (c && hsh(a, b) < 0.3) s.nums.push([a * cs + cs / 2, b * cs + cs / 2, c]);
			}
}

/** Meldet eine Ziffer an. Gibt die Abmeldung zurück. */
export function registerZiffer(cv, { text, fs = 150, cs = 8, mono = true, glyph = true }) {
	const slot = Math.min(2, Math.max(0, Number.parseInt(text, 10) - 1));
	return register({
		slot,
		name: `ziffer ${text}`,
		el: cv,
		host: cv.parentElement,
		box: () => ({ bw: 340, bh: 150 }),
		dprCap: 2,
		frame(s) {
			if (!takt(slot)) return; // Entwurfstakt: jedes zweite Bild
			const key = `${text}|${loop.fv}`;
			if (s.key !== key) {
				s.key = key;
				baue(s, text, fs, cs, mono);
			}
			const ctx = s.ctx;
			ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
			ctx.clearRect(0, 0, s.W, s.H);
			s.scene();
			ctx.fillStyle = '#FAFAFA';
			const R = 110;
			if (glyph) {
				ctx.font = `500 ${Math.round(cs * 1.25)}px "JetBrains Mono", monospace`;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
			}
			const tq = Math.floor(performance.now() / 90);
			for (const c of s.cells) {
				if (s.m.in) {
					const dx = c.x + c.ox - s.m.x;
					const dy = c.y + c.oy - s.m.y;
					const d2 = dx * dx + dy * dy;
					if (d2 < R * R) {
						const d = Math.sqrt(d2) + 0.1;
						const g = (1 - d / R) * 3.2;
						c.vx += (dx / d) * g;
						c.vy += (dy / d) * g;
					}
				}
				c.vx += -c.ox * 0.07;
				c.vy += -c.oy * 0.07;
				c.vx *= 0.8;
				c.vy *= 0.8;
				c.ox += c.vx;
				c.oy += c.vy;
				if (glyph) {
					const sp = Math.hypot(c.vx, c.vy);
					const off = Math.hypot(c.ox, c.oy);
					const gi =
						off > 3 || sp > 0.5 ? Math.floor(hsh(c.x + tq, c.y) * 8) : Math.floor(hsh(c.x, c.y) * 3);
					ctx.fillText(GR[gi], c.x + c.ox + cs / 2, c.y + c.oy + cs / 2);
				} else ctx.fillRect(c.x + c.ox, c.y + c.oy, cs - 1, cs - 1);
			}
			if (s.nums.length) {
				ctx.globalAlpha = 0.5;
				ctx.font = `500 ${Math.round(cs * 0.8)}px "JetBrains Mono", monospace`;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				for (const n of s.nums) ctx.fillText(String(n[2]), n[0], n[1] + 1);
				ctx.globalAlpha = 1;
			}
		},
	});
}
