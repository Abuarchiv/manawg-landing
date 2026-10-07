// Die ASCII-Sonne des Finales: Mono-Zeichen in einem festen Raster (9 x 14 CSS-Pixel) über die ganze
// Fläche, die Sonne geht auf, Strahlen und Funken. Der Zeiger löscht und mischt Zeichen.
// Szenenraum: Bezugsbox 1280 x 760 für die Sonne, das Raster selbst läuft in CSS-Pixeln.

import { loop, register, takt } from '../../core/loop';
import { cl, hsh, vnz } from '../../core/math';

const CW = 9;
const CH = 14;
const RAMP = ' .:-=+*#%@';

/** Meldet die ASCII-Sonne an. Gibt die Abmeldung zurück. */
export function registerAscii(cv) {
	return register({
		slot: 6,
		name: 'ascii',
		el: cv,
		host: cv.parentElement,
		box: () => ({ bw: 1280, bh: 760 }),
		dprCap: 2,
		touchCap: 1.5,
		init(s) {
			s.sm = { x: 1280 * 0.6, y: 760 * 0.4 };
		},
		frame(s) {
			if (!takt(6)) return; // Entwurfstakt: jedes zweite Bild
			const ctx = s.ctx;
			const t = loop.t;
			const BW = 1280;
			const BH = 760;
			const tg = s.m.in ? [s.m.x, s.m.y] : [BW / 2 + Math.cos(t * 0.3) * 260, BH * 0.3 + Math.sin(t * 0.4) * 90];
			s.sm.x += (tg[0] - s.sm.x) * 0.08;
			s.sm.y += (tg[1] - s.sm.y) * 0.08;
			s.full();
			ctx.fillStyle = '#0A0A0A';
			ctx.fillRect(0, 0, s.W, s.H);
			ctx.fillStyle = '#FAFAFA';
			ctx.font = '500 12px "JetBrains Mono", monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			const cx = BW / 2;
			const rise = Math.min(1, t / 6);
			const sr = BH * 0.62;
			const sy = BH + sr * 0.35 - rise * sr * 0.55;
			for (let y = CH / 2, j = 0; y < s.H; y += CH, j++)
				for (let x = CW / 2, i = 0; x < s.W; x += CW, i++) {
					// Zelle im Szenenraum
					const bx = (x - s.ox) / s.f;
					const by = (y - s.oy) / s.f;
					let v = 0;
					const dx = bx - cx;
					const dy = by - sy;
					const r = Math.hypot(dx, dy);
					const an = Math.atan2(dy, dx);
					if (r < sr) v = 0.35 + 0.6 * (1 - r / sr) + (vnz(bx * 0.02, by * 0.03 - t * 0.5) - 0.5) * 0.3;
					else {
						const ray = 0.5 + 0.5 * Math.cos(an * 22 + t * 0.2);
						v = ray > 0.82 ? 0.5 * Math.exp(-(r - sr) / 160) : 0;
					}
					const md = Math.hypot(bx - s.sm.x, by - s.sm.y);
					if (s.m.in && md < 120) v *= md / 120;
					if (hsh(i, j + Math.floor(t * 4 + i * 0.37) * 7) < 0.012 * (1 - by / BH)) v = Math.max(v, 0.2);
					if (v > 0.06) {
						let ci = Math.min(9, 1 + Math.floor(cl(v) * 8.99));
						if (s.m.in) {
							const mdd = Math.hypot(bx - s.m.x, by - s.m.y);
							if (mdd < 70 && hsh(i + Math.floor(t * 12), j) < 0.6 * (1 - mdd / 70))
								ci = 1 + Math.floor(hsh(i, j + Math.floor(t * 12)) * 9);
						}
						ctx.fillText(RAMP[ci], x, y);
					}
				}
		},
	});
}
