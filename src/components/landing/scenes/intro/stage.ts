// Die Intro-Bühne: eine Sticky-Fläche in voller Fenstergröße, auf der Berg, Zeichen, Organ, Flut,
// Wohnung und die Ende-Szene nacheinander laufen (PLAN-V2 2.4 und 4.1).
//
// stage.ts liest je Bild die Scroll-Strecke s, macht daraus den Fortschritt P (zeitachse.ts), setzt die
// CSS-Variablen und data-phase an #final und ruft die Teilrenderer auf. Die Variablen werden JEDES
// Bild gesetzt, auch wenn nichts gezeichnet wird, damit nach Sprüngen nichts stehen bleibt.

import { type Fit, dprFor, fitBox, isTouch, observe, sizeBacking } from '../../core/canvas';
import { loop, onFrame } from '../../core/loop';
import { cl, ss } from '../../core/math';
import * as hand from '../ende/hand';
import { kamera } from '../ende/kamera';
import { createHero } from './hero';
import { zeichneSterne } from './sterne';
import type { BuehnenKontext, BuehnenZeiger, HeroMarken, Loch } from './types';
import * as wohnung from './wohnung';
import { wohnungVorladen } from './wohnung-gl';
import { unwarp, warp } from './zeitachse';

/** Phase der Bühne (data-phase an #final): Intro, Ende-Ebene oder vorbeigescrollt. */
type Phase = 'intro' | 'ende' | 'nach';

/** Zustand der Bühne (für QA-Haken und Landing). */
export interface BuehnenZustand {
	/** Geglätteter Fortschritt. */
	sp: number;
	init: boolean;
	/** Beginn des Aufbaus des Zeichens. */
	a0: number | null;
	/** Geglätteter Zeiger (-1..1). */
	sm: [number, number];
	/** Adaptive Auflösung des Szenenpuffers. */
	ad: number;
	/** Letzte 15 Bilddauern. */
	rb: number[];
	bereit: boolean;
	endOn: boolean;
	handsLoaded: boolean;
	/** Zeitgeglättete Deckkraft der Raumkarten. */
	kv: number[];
	P: number;
	s: number;
	phase: Phase;
	/** Zeitpunkt, seit dem die Bühne ganz aus dem Bild ist (null: sichtbar). */
	weg: number | null;
	/** Pufferspeicher der Ebenen freigegeben. */
	frei: boolean;
}

/** Die laufende Bühne. */
export interface Stage {
	state: BuehnenZustand;
	/** y-Position im Dokument für den Fortschritt P (QA). */
	yForP: (P: number) => number;
	destroy: () => void;
}

/** Die laufende Bühne (für QA-Haken und Landing). */
export const live: { stage: Stage | null } = { stage: null };

/** Der Klick aus der App im Handy (Phone.tsx) trägt direkt = true. */
type BuehnenEreignis = PointerEvent & { direkt?: boolean };

function braucht<T>(el: T | null, name: string): T {
	if (!el) throw new Error(`stage: ${name} fehlt`);
	return el;
}

export function createStage({ sec, buehne }: { sec: HTMLElement; buehne: HTMLElement }): Stage {
	const root = braucht(buehne.closest<HTMLElement>('#final'), '#final');
	const q = (k: string) => buehne.querySelector<HTMLCanvasElement>(`[data-intro="${k}"]`);
	const cvHero = braucht(q('hero'), 'hero');
	const cvWo = braucht(q('wohnung'), 'wohnung');
	const safe = braucht(buehne.querySelector<HTMLElement>('[data-safe]'), '[data-safe]');
	const cvStars = buehne.querySelector<HTMLCanvasElement>('canvas[data-sterne]');
	const hb = buehne.querySelector<HTMLCanvasElement>('[data-hand="back"]');
	const hf = buehne.querySelector<HTMLCanvasElement>('[data-hand="front"]');
	const ctas = [...buehne.querySelectorAll<HTMLElement>('[data-cta]')];
	const kopf = root.querySelector<HTMLElement>('[data-kopf]');
	const kopfCta = kopf?.querySelector<HTMLElement>('[data-loch="cta"]');
	const endeTitel = buehne.querySelector<HTMLElement>('[data-ende-titel]');
	const nurIntro = [...root.querySelectorAll<HTMLElement>('[data-nur-intro]')];
	const hinweise = root.querySelector<HTMLElement>('[data-hinweise]');
	const endeEl = buehne.querySelector<HTMLElement>('[data-ende]');
	const raeumeEl = buehne.querySelector<HTMLElement>('[data-loch="text"]');
	const hero = createHero(cvHero);

	let W = buehne.clientWidth;
	let H = buehne.clientHeight;
	// Scroll-Strecke der Bühne: Abschnittshöhe minus Bühne (bei reduzierter Bewegung kürzer, landing.css)
	const strecke = () => Math.max(1, sec.offsetHeight - H);
	let safeH = safe.clientHeight;
	let dpr = dprFor(2, 1.5, W, H);
	let fit: Fit = fitBox(W, safeH, 1280, 800, 1.25);
	let cam: Fit = kamera(W, H, safeH, loop.mode);
	let loecher: Loch[] = [];

	// Zustand der Bühne
	const st: BuehnenZustand = {
		sp: 0, // geglätteter Fortschritt
		init: false,
		a0: null, // Beginn des Aufbaus des Zeichens
		sm: [0.3, 0.1], // geglätteter Zeiger (-1..1)
		ad: 1, // adaptive Auflösung des Szenenpuffers
		rb: [], // letzte 15 Bilddauern
		bereit: false,
		endOn: false,
		handsLoaded: false,
		kv: [0, 0, 0, 0], // zeitgeglättete Deckkraft der Raumkarten
		P: 0,
		s: 0,
		phase: 'intro',
		weg: null,
		frei: false,
	};
	const m: BuehnenZeiger = {
		x: W / 2,
		y: H / 2,
		in: false,
		down: false,
		type: 'mouse',
		clickT: -9,
		moveT: -9,
		x0: 0,
		y0: 0,
		sy0: 0,
		direkt: false,
	};
	const hm: HeroMarken = { look: 0, mx: 0, split: 0, zoom: 0, dive: 0, sm: st.sm, a0: 0, ad: 1 };
	const c: BuehnenKontext = {
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
		zer: 0,
		endOn: false,
		stageTop: 0,
		visible: false,
		sv: 0,
	};
	let syAlt = window.scrollY;

	// Variablen nur an die Elemente, die sie lesen, nicht an #final oder die ganze Bühne: ein neuer Wert lässt die
	// Stile aller Nachfahren des Trägers neu berechnen, im Intro jedes Bild.
	const cache: Record<string, string> = {};
	const setVar = (k: string, v: string, ziele: (HTMLElement | null)[] = [buehne]) => {
		if (cache[k] === v) return;
		cache[k] = v;
		for (const el of ziele) el?.style.setProperty(k, v);
	};

	const measureLoecher = () => {
		const r0 = buehne.getBoundingClientRect();
		loecher = [...root.querySelectorAll<HTMLElement>('[data-loch]')].map((el) => {
			const r = el.getBoundingClientRect();
			return {
				x: r.left - r0.left,
				y: r.top - r0.top,
				w: r.width,
				h: r.height,
				art: el.dataset.loch ?? '',
			};
		});
	};

	const resize = () => {
		W = buehne.clientWidth;
		H = buehne.clientHeight;
		safeH = safe.clientHeight;
		dpr = dprFor(2, 1.5, W, H);
		fit = fitBox(W, safeH, 1280, 800, 1.25);
		cam = kamera(W, H, safeH, loop.mode);
		sizeBacking(cvWo, W, H, dpr);
		measureLoecher();
	};
	const stops = [observe(buehne, resize), observe(safe, resize)];

	// Zeiger: Listener an der ganzen Seite, Koordinaten in Bühnen-CSS-Pixeln
	const place = (e: PointerEvent) => {
		const r = buehne.getBoundingClientRect();
		m.x = e.clientX - r.left;
		m.y = e.clientY - r.top;
		m.in = true;
		m.type = e.pointerType || 'mouse';
		m.moveT = performance.now() / 1000;
	};
	const onLeave = () => {
		m.in = false;
	};
	const onDown = (e: BuehnenEreignis) => {
		place(e);
		m.down = true;
		// direkt: der Klick kam aus der App im Handy (Phone.tsx) und ist dort schon angekommen, die Hand drückt nur mit
		m.direkt = !!e.direkt;
		const tt = performance.now() / 1000;
		// Maus und Stift: der Klick gilt sofort. Touch: erst beim Loslassen und nur ohne Wisch (siehe onUp).
		if (m.type !== 'touch') m.clickT = tt;
		m.x0 = m.x;
		m.y0 = m.y;
		m.sy0 = window.scrollY;
		if (!st.endOn) st.a0 = tt;
	};
	const onUp = (e: PointerEvent) => {
		if (m.down && m.type === 'touch' && e.type === 'pointerup') {
			const bewegt =
				Math.hypot(m.x - m.x0, m.y - m.y0) >= 8 || Math.abs(window.scrollY - m.sy0) >= 8;
			if (!bewegt) m.clickT = performance.now() / 1000;
		}
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

	/** Fortschritt glätten. Sofort übernehmen beim ersten Bild und solange die Bühne nicht zu sehen ist. */
	const glaette = (Pz: number, dt: number, visible: boolean): number => {
		if (!st.init || !visible) {
			st.sp = Pz;
			st.init = true;
		} else {
			st.sp += (Pz - st.sp) * (1 - Math.exp(-Math.min(dt, 0.5) * 10));
			if (Math.abs(Pz - st.sp) < 1e-4) st.sp = Pz;
		}
		return st.sp;
	};

	/**
	 * Seit 2 s ganz aus dem Bild: Pufferspeicher der Ebenen freigeben (5K-Fläche: 59 MB je Canvas), beim
	 * Wiedereintritt neu messen. Die Ebenen passen ihre Größe beim Zeichnen selbst an.
	 */
	const verwalteSpeicher = (visible: boolean, now: number) => {
		if (!visible) {
			st.weg ??= now;
			if (!st.frei && now - st.weg > 2) {
				st.frei = true;
				for (const cv of buehne.querySelectorAll('canvas')) cv.width = cv.height = 1;
				hero.frei();
			}
		} else {
			st.weg = null;
			if (st.frei) {
				st.frei = false;
				resize();
			}
		}
	};

	/** CSS-Variablen, Phase und Bedienbarkeit, jedes Bild. Gibt die Phase zurück. */
	const setzeStil = (
		P: number,
		fpA: number,
		por: number,
		endA: number,
		karten: number[],
		rb: DOMRect,
		visible: boolean,
		kopfUnten: number,
		titelTop: number,
	): Phase => {
		// Titel und Hinweis brauchen --p nur bis 0,09 (danach sind sie ganz weg). Weiter oben würde jeder neue Wert
		// im Intro die Stile aller Nachfahren von #final neu berechnen (ca. 1,5 ms je Bild).
		setVar('--p', Math.min(P, 0.1).toFixed(4), [buehne, hinweise]);
		// Phone.tsx lädt Standbild und App ab hier, weit vor der Ende-Ebene (der Aufbau der App-Seite dauert 20 bis 60 ms):
		// am liebsten in der ersten Scroll-Pause ab P 0,2 (der Aufbau im Scrollen ruckelt), spätestens bei P 0,55
		if (root.dataset.nah !== '1' && (P > 0.55 || (P > 0.2 && loop.now - loop.act > 0.5)))
			root.dataset.nah = '1';
		setVar('--g', (1 - fpA).toFixed(3), [cvHero]);
		// Wohnung ist bei endA 0,5 weg, die Ende-Ebene beginnt erst bei 0,35: kaum Überlapp, kein grauer Schleier
		setVar('--f', (Math.max(fpA, cl(por * 8)) * (1 - cl(endA * 2))).toFixed(3), [cvWo]);
		// Portal: die Wohnung öffnet sich als Kreis im Loch des Organs, kein schwarzes Bild zwischen Tauchgang und Wohnung
		setVar('--por', por.toFixed(3), [cvWo]);
		setVar('--e', endA.toFixed(3), [endeEl, hinweise]);
		// Raumkarten am Scroll geführt wie im Entwurf (Kurve und Überlappfreiheit: wohnung.karten)
		for (const [j, k] of karten.entries()) {
			st.kv[j] = k;
			setVar(`--c${j}`, k.toFixed(3), [raeumeEl]);
		}
		// Hochformat: der Kopf bleibt sichtbar (Titel steht darunter), sonst bliebe nach dem Ausblenden der Knopf allein
		const kopfAus = loop.mode === 'hoch' ? 0 : endA * (rb.bottom > kopfUnten ? 1 : 0);
		setVar('--kopf-aus', kopfAus.toFixed(3), [kopf]);
		// Hochformat: Titel und Knopf der Ende-Ebene blenden aus, sobald sie beim Hinausscrollen das Kopfband
		// erreichen (kein Text über dem Logo); in demselben Maß kommt der Kopf-Knopf zurück
		let titelAus = 0;
		if (loop.mode === 'hoch' && endeTitel && endA > 0) {
			titelAus = 1 - cl((titelTop - kopfUnten) / 16);
		}
		setVar('--ende-titel-aus', titelAus.toFixed(3), [endeTitel]);
		// Hochformat: der Kopf bleibt, aber sein Knopf geht, solange der Knopf der Ende-Ebene im Bild steht (kein Doppel)
		const ktAus =
			loop.mode === 'hoch' ? endA * (rb.bottom > kopfUnten ? 1 : 0) * (1 - titelAus) : 0;
		setVar('--kopf-cta-aus', ktAus.toFixed(3), [kopf]);
		if (kopfCta && kopfCta.inert !== ktAus >= 0.6) kopfCta.inert = ktAus >= 0.6;
		if (kopf && kopf.inert !== kopfAus >= 0.6) kopf.inert = kopfAus >= 0.6;
		const phase: Phase = rb.bottom <= 0 ? 'nach' : P >= 0.9 ? 'ende' : 'intro';
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
		return phase;
	};

	/**
	 * Auflösung des Szenenpuffers (F-07): Ausreißer über 0,25 s (Tab-Wechsel, Pause) zählen nicht.
	 * Abgesenkt wird nur, wenn das gleitende Mittel über 15 Bilder über 0,05 s liegt, erholt bei ruhigem Lauf.
	 */
	const passeAufloesung = (raw: number) => {
		if (raw <= 0.25) {
			st.rb.push(raw);
			if (st.rb.length > 15) st.rb.shift();
			const mean = st.rb.reduce((a, b) => a + b, 0) / st.rb.length;
			if (st.rb.length >= 15 && mean > 0.03) st.ad = Math.max(0.25, st.ad * 0.94);
			else if (raw < 0.022) st.ad = Math.min(1, st.ad * 1.06);
		}
	};

	const frame = (t0: number, dt: number, now: number, raw: number) => {
		const t = loop.reduced ? 0 : t0; // reduce: Hero-Zeit und Autopilot stehen still
		if (dprFor(2, 1.5, W, H) !== dpr) resize(); // Auflösungsstufe (loop.ts) hat sich geändert
		const rb = buehne.getBoundingClientRect();
		const rs = sec.getBoundingClientRect();
		const visible = rb.bottom > 0 && rb.top < loop.vh;
		// alle Lagen lesen, bevor setzeStil schreibt (sonst erzwingt jedes Lesen eine Stilberechnung mitten im Bild)
		const kopfUnten = kopf ? kopf.getBoundingClientRect().bottom : 0;
		const titelTop = endeTitel ? endeTitel.getBoundingClientRect().top : 0;
		const s = cl(-rs.top / strecke());
		const Pz = warp(s);
		const P = glaette(Pz, dt, visible);
		verwalteSpeicher(visible, now);
		// Scrollgeschwindigkeit (px/s), geglättet: Handy und Hände hängen dem Scroll nach (hand/index.ts)
		const sy = window.scrollY;
		const svRoh = dt > 0 ? cl((sy - syAlt) / Math.max(dt, 0.004), -4000, 4000) : 0;
		syAlt = sy;
		c.sv += (svRoh - c.sv) * (1 - Math.exp(-8 * Math.min(dt, 0.1)));
		const look = ss((P - 0.06) / 0.14);
		const mx = ss((P - 0.18) / 0.06);
		const split = ss((P - 0.24) / 0.1) * (1 - ss((P - 0.36) / 0.1));
		const zoom = ss((P - 0.22) / 0.2);
		const dive = ss((P - 0.48) / 0.12);
		const fpA = ss((P - 0.58) / 0.05);
		const por = loop.reduced ? 1 : ss((P - 0.54) / 0.06);
		if (P > 0.3) wohnungVorladen(); // Render und Shader laden, lange bevor die Wohnung ab P 0,54 erscheint
		const endA = ss((P - 0.9) / 0.05);
		const karten = wohnung.karten(P);
		st.P = P;
		st.s = s;

		setzeStil(P, fpA, por, endA, karten, rb, visible, kopfUnten, titelTop);
		st.endOn = endA > 0.6 && rb.bottom > 0.625 * H;
		passeAufloesung(raw);

		if (st.a0 === null) st.a0 = now;
		let heroDrawn = false;
		if (visible) {
			Object.assign(c, {
				P,
				s,
				t,
				dt,
				now,
				W,
				H,
				safeH,
				dpr,
				mode: loop.mode,
				reduced: loop.reduced,
				fit,
			});
			c.fpA = fpA;
			c.endA = endA;
			// Zerfall der Hände: beginnt, sobald die Bühne nach oben weggeschoben wird (rb.top < 0), Rückwärts setzt zusammen
			c.zer = loop.reduced ? 0 : ss(cl(-rb.top / (0.6 * H)));
			c.endOn = st.endOn;
			c.stageTop = rb.top;
			c.visible = true;
			c.loecher = loecher;
			if (loop.n % 30 === 1) measureLoecher();

			// Zeiger (-1..1) für Berg und Organ, ohne Zeiger läuft ein Autopilot
			const tm: [number, number] = m.in
				? [(m.x - W / 2) / (W / 2), (H / 2 - m.y) / (H / 2)]
				: [0.5 * Math.cos(t * 0.12), 0.4 * Math.sin(t * 0.16)];
			// Konstante des Entwurfs 0,06 je Bild bei 120 Hz, auf dt umgerechnet
			const ks = 1 - Math.exp(-7.43 * dt);
			st.sm[0] += (tm[0] - st.sm[0]) * ks;
			st.sm[1] += (tm[1] - st.sm[1]) * ks;

			if (fpA < 0.999) {
				hm.look = look;
				hm.mx = mx;
				hm.split = split;
				hm.zoom = zoom;
				hm.dive = dive;
				hm.a0 = st.a0;
				hm.ad = st.ad;
				c.dprHero = isTouch() ? Math.min(dpr, 1.25) : dpr;
				heroDrawn = hero.frame(c, hm);
			}
			if (cvStars && P < 0.075) zeichneSterne(cvStars, W, safeH, dpr, t);
			if ((fpA > 0.001 || por > 0.001) && endA < 0.999) wohnung.draw(cvWo, c);
			if (P > 0.3 && !st.handsLoaded) {
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

	const api: Stage = {
		state: st,
		yForP(P) {
			const r = sec.getBoundingClientRect();
			return r.top + window.scrollY + unwarp(P) * strecke();
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
