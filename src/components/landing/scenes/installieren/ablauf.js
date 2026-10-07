// Ablauf der Installation im Handy-Rahmen: zeitgesteuerte Schleife (Menü, Dialog, Home-Bildschirm, Symbol).
// Erstfassung des Fundaments: der Ablauf des Entwurfs, an die Schleife der Seite gehängt. Das Paket INSTALL
// ersetzt ihn durch die echten Abläufe.

import { register } from '../../core/loop';
import { cl } from '../../core/math';

const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
const bo = (x) => {
	x = cl(x);
	const c = 1.7;
	return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

/**
 * Meldet den Ablauf an. fr: Handy-Rahmen [data-ins="frame"], sec: Abschnitt, getTab(): gewählter Tab
 * (0 iPhone, 1 Android, 2 Rechner). Gibt die Abmeldung zurück.
 */
export function registerAblauf(fr, sec, getTab) {
	return register({
		name: 'installieren',
		el: fr,
		host: fr,
		init(s) {
			s.lastP = -1;
			s.t0 = performance.now();
			s.steps = [...sec.querySelectorAll('[data-istep]')];
			s.nf = 0;
		},
		frame(s) {
			const R = fr.getBoundingClientRect();
			const q = (k) => fr.querySelector(`[data-ins="${k}"]`);
			const P = getTab();
			const dk = P === 2;
			if (P !== s.lastP) {
				s.lastP = P;
				s.t0 = performance.now();
				fr.style.width = dk ? '600px' : '300px';
				fr.style.height = dk ? '400px' : '620px';
				fr.style.borderRadius = dk ? '14px' : '46px';
				fr.style.padding = dk ? '8px' : '10px';
				q('screen').style.borderRadius = dk ? '8px' : '36px';
				q('status').style.display = dk ? 'none' : 'flex';
				q('ibar').style.display = P === 0 ? 'flex' : 'none';
				q('amenu').style.display = P === 1 ? 'flex' : 'none';
				q('dicon').style.display = dk ? 'flex' : 'none';
				const h = q('home');
				h.style.gridTemplateColumns = dk ? 'repeat(8,1fr)' : 'repeat(4,1fr)';
				h.style.alignContent = dk ? 'end' : 'start';
				h.style.padding = dk ? '24px' : '56px 16px';
			}
			const t = ((performance.now() - s.t0) / 1000) % (dk ? 6.5 : 8);
			const sc = R.width / fr.offsetWidth;
			const pos = (el) => {
				if (!el) return [150, 500];
				const r = el.getBoundingClientRect();
				return [(r.left + r.width / 2 - R.left) / sc - 10, (r.top + r.height / 2 - R.top) / sc - 10];
			};
			const T1 = 1.6;
			const T2 = 3.0;
			const T3 = dk ? 99 : 4.2;
			const shIn = dk ? 0 : eo((t - 1.8) / 0.4) * (1 - eo((t - 3.2) / 0.3));
			const dlIn = dk
				? eo((t - 1.8) / 0.3) * (1 - eo((t - 3.3) / 0.3))
				: eo((t - 3.2) / 0.3) * (1 - eo((t - 4.5) / 0.3));
			const hmIn = eo((t - (dk ? 3.3 : 4.5)) / 0.5);
			const pop = bo((t - (dk ? 3.9 : 5.1)) / 0.5);
			q('sheet').style.transform = `translateY(${((1 - shIn) * 105).toFixed(1)}%)`;
			const dl = q('dlg');
			dl.style.opacity = dlIn.toFixed(3);
			dl.style.transform = `scale(${(0.92 + 0.08 * dlIn).toFixed(3)})`;
			q('home').style.opacity = hmIn.toFixed(3);
			q('micon').style.transform = `scale(${Math.max(0, pop).toFixed(3)})`;
			const tg1 = P === 0 ? q('share') : P === 1 ? q('amenu') : q('dicon');
			const tg2 = dk ? q('dbtn') : fr.querySelector('[data-tgt="2"]');
			const tg3 = q('dbtn');
			const A = [150, dk ? 300 : 560];
			const p1 = pos(tg1);
			const p2 = pos(tg2);
			const p3 = pos(tg3);
			let p;
			const last = dk ? T2 : T3;
			if (t < T1)
				p = [
					A[0] + (p1[0] - A[0]) * eo((t - 0.8) / 0.7),
					A[1] + (p1[1] - A[1]) * eo((t - 0.8) / 0.7),
				];
			else if (t < T2) {
				const k = eo((t - (T2 - 0.8)) / 0.7);
				p = [p1[0] + (p2[0] - p1[0]) * k, p1[1] + (p2[1] - p1[1]) * k];
			} else if (!dk && t < T3) {
				const k = eo((t - (T3 - 0.8)) / 0.7);
				p = [p2[0] + (p3[0] - p2[0]) * k, p2[1] + (p3[1] - p2[1]) * k];
			} else p = dk ? p2 : p3;
			const near = Math.min(Math.abs(t - T1), Math.abs(t - T2), Math.abs(t - T3));
			const press = near < 0.15 ? 0.7 : 1;
			const tp = q('tap');
			tp.style.opacity = (cl((t - 0.6) / 0.3) * (1 - cl((t - last - 0.2) / 0.3)) * 0.85).toFixed(3);
			tp.style.transform = `translate(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px) scale(${press})`;
			const stp = t < 1.8 ? 0 : t < (dk ? 3.3 : 3.2) ? 1 : 2;
			if (++s.nf % 30 === 1) s.steps = [...sec.querySelectorAll('[data-istep]')];
			for (const el of s.steps) el.style.opacity = +el.getAttribute('data-istep') === stp ? '1' : '0.35';
		},
	});
}
