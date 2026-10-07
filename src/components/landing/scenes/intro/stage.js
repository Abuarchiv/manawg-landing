// Die Intro-Bühne: eine Sticky-Fläche in voller Fenstergröße, auf der Berg, Zeichen, Organ, Flut,
// Wohnung und die Ende-Szene nacheinander laufen (PLAN-V2 2.4 und 4.1).
//
// stage.js liest je Bild die Scroll-Strecke s, macht daraus den Fortschritt P (zeitachse.js), setzt die
// CSS-Variablen und data-phase an #final und ruft die Teilrenderer auf. Die Variablen werden JEDES
// Bild gesetzt, auch wenn nichts gezeichnet wird, damit nach Sprüngen nichts stehen bleibt.

import { dprFor, fitBox, observe, sizeBacking } from '../../core/canvas';
import { loop, onFrame } from '../../core/loop';
import { cl, ss } from '../../core/math';
import * as hand from '../ende/hand';
import { kamera } from '../ende/kamera';
import * as flut from './flut';
import { createHero } from './hero';
import { zeichneSterne } from './sterne';
import * as wohnung from './wohnung';
import { INTRO_SCREENS, unwarp, warp } from './zeitachse';

/**
 * Die laufende Bühne (für QA-Haken und Landing).
 * @type {{ stage: { state: Record<string, any>, yForP: (P: number) => number, destroy: () => void } | null }}
 */
export const live = { stage: null };

export function createStage({ sec, buehne }) {
	const root = buehne.closest('#final');
	const q = (k) => buehne.querySelector(`[data-intro="${k}"]`);
	const cvHero = q('hero');
	const cvWo = q('wohnung');
	const cvFl = q('flut');
	const safe = buehne.querySelector('[data-safe]');
	const cvStars = buehne.querySelector('canvas[data-sterne]');
	const hb = buehne.querySelector('[data-hand="back"]');
	const hf = buehne.querySelector('[data-hand="front"]');
	const ctas = [...buehne.querySelectorAll('[data-cta]')];
	const kopf = root.querySelector('[data-kopf]');
	const nurIntro = [...root.querySelectorAll('[data-nur-intro]')];
	const hero = createHero(cvHero);

	let W = buehne.clientWidth;
	let H = buehne.clientHeight;
	let safeH = safe.clientHeight;
	let dpr = dprFor(2, 1.5);
	let fit = fitBox(W, safeH, 1280, 800, 1.25);
	let cam = kamera(W, H, safeH, loop.mode);
	let loecher = [];

	// Zustand der Bühne
	const st = {
		sp: 0, // geglätteter Fortschritt
		init: false,
		a0: null, // Beginn des Aufbaus des Zeichens
		sm: [0.3, 0.1], // geglätteter Zeiger (-1..1)
		ad: 1, // adaptive Auflösung des Szenenpuffers
		bereit: false,
		endOn: false,
		handsLoaded: false,
		P: 0,
		s: 0,
		phase: 'intro',
	};
	const m = { x: W / 2, y: H / 2, in: false, down: false, type: 'mouse', clickT: -9 };
	const hm = { look: 0, mx: 0, split: 0, zoom: 0, dive: 0, sm: st.sm, a0: 0, ad: 1 };
	const c = {
		P: 0,
		s: 0,
		t: 0,
		dt: 0.016,
		now: 0,
		W,
		H,
		safeH,
		dpr,
		mode: loop.mode,
		reduced: false,
		fit,
		m,
		fpA: 0,
		endA: 0,
		endOn: false,
		cover: 0,
		stageTop: 0,
		visible: false,
	};

	const cache = {};
	const setVar = (k, v) => {
		if (cache[k] === v) return;
		cache[k] = v;
		root.style.setProperty(k, v);
	};

	const measureLoecher = () => {
		const r0 = buehne.getBoundingClientRect();
		loecher = [...root.querySelectorAll('[data-loch]')].map((el) => {
			const r = el.getBoundingClientRect();
			return { x: r.left - r0.left, y: r.top - r0.top, w: r.width, h: r.height, art: el.dataset.loch };
		});
	};

	const resize = () => {
		W = buehne.clientWidth;
		H = buehne.clientHeight;
		safeH = safe.clientHeight;
		dpr = dprFor(2, 1.5);
		fit = fitBox(W, safeH, 1280, 800, 1.25);
		cam = kamera(W, H, safeH, loop.mode);
		sizeBacking(cvWo, W, H, dpr);
		sizeBacking(cvFl, W, H, dpr);
		measureLoecher();
	};
	const stops = [observe(buehne, resize), observe(safe, resize)];

	// Zeiger: Listener an der ganzen Seite, Koordinaten in Bühnen-CSS-Pixeln
	const place = (e) => {
		const r = buehne.getBoundingClientRect();
		m.x = e.clientX - r.left;
		m.y = e.clientY - r.top;
		m.in = true;
		m.type = e.pointerType || 'mouse';
	};
	const onLeave = () => {
		m.in = false;
	};
	const onDown = (e) => {
		place(e);
		m.down = true;
		m.clickT = performance.now() / 1000;
		if (!st.endOn) st.a0 = m.clickT;
	};
	const onUp = () => {
		m.down = false;
	};
	root.addEventListener('pointermove', place);
	root.addEventListener('pointerleave', onLeave);
	root.addEventListener('pointerdown', onDown);
	window.addEventListener('pointerup', onUp);
	window.addEventListener('pointercancel', onUp);

	const fireBereit = () => {
		st.bereit = true;
		document.dispatchEvent(new CustomEvent('landing:bereit'));
	};

	const frame = (t, dt, now, raw) => {
		const rb = buehne.getBoundingClientRect();
		const rs = sec.getBoundingClientRect();
		const visible = rb.bottom > 0 && rb.top < innerHeight;
		const s = cl(-rs.top / (INTRO_SCREENS * H));
		const Pz = warp(s);
		// Glättung. Sofort übernehmen beim ersten Bild und solange die Bühne nicht zu sehen ist.
		if (!st.init || !visible) {
			st.sp = Pz;
			st.init = true;
		} else {
			st.sp += (Pz - st.sp) * (1 - Math.exp(-Math.min(dt, 0.5) * 10));
			if (Math.abs(Pz - st.sp) < 1e-4) st.sp = Pz;
		}
		const P = st.sp;
		const look = ss((P - 0.06) / 0.14);
		const mx = ss((P - 0.18) / 0.06);
		const split = ss((P - 0.24) / 0.1) * (1 - ss((P - 0.36) / 0.1));
		const zoom = ss((P - 0.22) / 0.2);
		const dive = ss((P - 0.48) / 0.12);
		const fpA = ss((P - 0.58) / 0.05);
		const endA = ss((P - 0.9) / 0.05);
		const cover = flut.deckung(P);
		const karten = wohnung.karten(P);
		st.P = P;
		st.s = s;

		// CSS-Variablen und Phase, jedes Bild
		setVar('--p', P.toFixed(4));
		setVar('--g', (1 - fpA).toFixed(3));
		setVar('--f', (fpA * (1 - endA)).toFixed(3));
		setVar('--e', endA.toFixed(3));
		for (let j = 0; j < 4; j++) setVar(`--c${j}`, karten[j].toFixed(3));
		const kopfUnten = kopf ? kopf.getBoundingClientRect().bottom : 0;
		const kopfAus = endA * (rb.bottom > kopfUnten ? 1 : 0);
		setVar('--kopf-aus', kopfAus.toFixed(3));
		if (kopf && kopf.inert !== kopfAus >= 0.6) kopf.inert = kopfAus >= 0.6;
		const phase = rb.bottom <= 0 ? 'nach' : P >= 0.9 ? 'ende' : 'intro';
		if (st.phase !== phase || root.dataset.phase !== phase) {
			st.phase = phase;
			root.dataset.phase = phase;
		}

		// Bedienelemente der Ende-Ebene nur bedienbar, wenn sie zu sehen sind
		const ctaOn = endA > 0.6 && visible;
		for (const el of ctas) {
			const v = ctaOn ? 'auto' : 'none';
			if (el.style.pointerEvents !== v) el.style.pointerEvents = v;
			if (el.inert === ctaOn) el.inert = !ctaOn;
		}
		const hinweisAus = endA >= 0.72 || phase === 'nach';
		for (const el of nurIntro) if (el.inert !== hinweisAus) el.inert = hinweisAus;
		st.endOn = endA > 0.6 && rb.bottom > 0.625 * H;

		// Auflösung des Szenenpuffers: bei Rucklern absenken, bei ruhigem Lauf erholen
		if (raw > 0.2) st.ad = 0.25;
		else if (raw > 0.05) st.ad = Math.max(0.25, st.ad * 0.9);
		else if (raw < 0.022) st.ad = Math.min(1, st.ad * 1.02);

		if (st.a0 === null) st.a0 = now;
		let heroDrawn = false;
		if (visible) {
			Object.assign(c, { P, s, t, dt, now, W, H, safeH, dpr, mode: loop.mode, reduced: loop.reduced, fit });
			c.fpA = fpA;
			c.endA = endA;
			c.endOn = st.endOn;
			c.cover = cover;
			c.stageTop = rb.top;
			c.visible = true;
			if (loop.n % 30 === 1) measureLoecher();

			// Zeiger (-1..1) für Berg und Organ, ohne Zeiger läuft ein Autopilot
			const tm = m.in
				? [(m.x - W / 2) / (W / 2), (H / 2 - m.y) / (H / 2)]
				: [0.5 * Math.cos(t * 0.12), 0.4 * Math.sin(t * 0.16)];
			st.sm[0] += (tm[0] - st.sm[0]) * 0.06;
			st.sm[1] += (tm[1] - st.sm[1]) * 0.06;

			if (fpA < 0.999) {
				hm.look = look;
				hm.mx = mx;
				hm.split = split;
				hm.zoom = zoom;
				hm.dive = dive;
				hm.a0 = st.a0;
				hm.ad = st.ad;
				heroDrawn = hero.frame(c, hm);
			}
			if (cvStars && P < 0.075 && loop.n % 2 === 1) zeichneSterne(cvStars, W, safeH, dpr, t);
			if (fpA > 0.001 && endA < 0.999) wohnung.draw(cvWo, c);
			flut.draw(cvFl, c, loecher);
			if (P > 0.75 && !st.handsLoaded) {
				st.handsLoaded = true;
				hand.laden();
			}
			if (hb && hf) hand.draw(hb, hf, c, cam);
		} else {
			c.visible = false;
		}
		if (!st.bereit && (heroDrawn || fpA >= 0.999 || !visible)) fireBereit();
	};

	const off = onFrame(frame);

	const api = {
		state: st,
		/** y-Position im Dokument für den Fortschritt P (QA). */
		yForP(P) {
			const r = sec.getBoundingClientRect();
			return r.top + window.scrollY + unwarp(P) * INTRO_SCREENS * H;
		},
		destroy() {
			off();
			for (const f of stops) f();
			root.removeEventListener('pointermove', place);
			root.removeEventListener('pointerleave', onLeave);
			root.removeEventListener('pointerdown', onDown);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onUp);
			hero.destroy();
			if (live.stage === api) live.stage = null;
		},
	};
	live.stage = api;
	return api;
}
