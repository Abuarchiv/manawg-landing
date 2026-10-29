// Zeigehand-Steuerung: Zustand, Zeiger im Ende-Raum, Tipps (Maus, Touch), Vorführung, Kontakt und die
// Bildwerte, die daraus für beide Zeichenwege entstehen.

import type { Fit } from '../../../core/canvas';
import { isTouch } from '../../../core/canvas';
import { qa } from '../../../core/loop';
import { isPortrait } from '../camera';
import { atlases } from './atlas';
import { ARM, PS, RING_T } from './constants';
import type { Breath, DemoRun, DrawValues, HandContext, HandState, Point, Tap } from './types';

/** Zeigerlage im Ende-Raum (Objektraum der Hände, ohne Atmen) aus Bühnen-CSS-px. */
type ObjFn = (x: number, y: number) => [number, number];

/** Zeiger und Eingabeart eines Bildes, im Ende-Raum. */
interface Input {
	obj: ObjFn;
	mx: number;
	my: number;
	touch: boolean;
}

/** Ziel der Zeigehand in diesem Bild und wie stark sie dorthin zieht. */
interface Target {
	tg: readonly [number, number];
	k: number;
	follows: boolean;
	pend: Tap | null;
}

// ----------------------------------------------------------------------------------------------------
// Zustand
// ----------------------------------------------------------------------------------------------------

export const states = new WeakMap<HTMLCanvasElement, HandState>();

/** Leises Atmen (Sinus plus langsames Rauschen): x, y in Bühnen-px, r in rad. Perioden 4 bis 6 s. */
export function breath(t: number): Breath {
	const w = 1.2; // 5,2 s
	const x = 0.65 * Math.sin(t * w) + 0.35 * Math.sin(t * 1.55 + 1.3);
	const y = 0.65 * Math.sin(t * 1.05 + 2) + 0.35 * Math.sin(t * 1.4 + 0.4);
	const r = 0.65 * Math.sin(t * 1.15 + 0.5) + 0.35 * Math.sin(t * 1.5 + 2.2);
	return { x: 1.5 * x, y: 1.5 * y, r: ((0.4 * Math.PI) / 180) * r };
}

/** Autopilot im Fenster x 780-860, y 330-470: Dreieckswelle senkrecht, nie lange über derselben Textzeile. */
function autopilot(t: number): [number, number] {
	const p = (t / 8) % 1;
	const tri = p < 0.5 ? -1 + 4 * p : 3 - 4 * p;
	return [820 + 40 * Math.sin(t * 0.45), 400 + 70 * tri];
}

export function newState(back: HTMLCanvasElement, front: HTMLCanvasElement): HandState {
	return {
		back,
		front,
		host: back.closest<HTMLElement>('[data-buehne]'),
		ht: null,
		lt: { x: 820, y: 400 },
		park: [940, 1000],
		lastClick: -9,
		tap: null,
		contactT: -9,
		pending: null,
		space: null,
		appDoc: null,
		clean: false,
		mode: null, // 'gl' | 'cpu'
		layers: null,
		cpu: { key: null, baked: null },
		quiet: [0, 0, 0, 0, 0, 0, 0, 0],
		rects: [],
		frames: 0,
		demo: null,
	};
}

/** Ruhige Rechtecke (Titel, Knopf) im Ende-Raum und Knopf-Rechtecke in Bühnen-px neu messen. */
function measure(st: HandState, cam: Fit): void {
	const root = st.back.parentElement;
	if (!root) return;
	const cr = st.back.getBoundingClientRect();
	const q = [0, 0, 0, 0, 0, 0, 0, 0];
	let k = 0;
	for (const el of root.querySelectorAll('[data-quiet]')) {
		if (k > 1) break;
		const r = el.getBoundingClientRect();
		q[k * 4] = (r.left - cr.left - cam.ox) / cam.f;
		q[k * 4 + 1] = (r.top - cr.top - cam.oy) / cam.f;
		q[k * 4 + 2] = r.width / cam.f;
		q[k * 4 + 3] = r.height / cam.f;
		k++;
	}
	st.quiet = q;
	st.rects = [...root.querySelectorAll('[data-cta]')].map(
		(el): [number, number, number, number] => {
			const r = el.getBoundingClientRect();
			return [r.left - cr.left, r.top - cr.top, r.right - cr.left, r.bottom - cr.top];
		},
	);
}

/** Vorführung schon gesehen (einmal je Sitzung)? Mit setzen = merken. */
function demoDone(set?: boolean): boolean {
	try {
		if (set) sessionStorage.setItem('mwg-demo', '1');
		return sessionStorage.getItem('mwg-demo') === '1';
	} catch {
		return false;
	}
}

/** Mitte der Tab-Taste (Name) in der App-Vorschau als Ziel der Zeigehand: Objektraum plus Fensterkoordinaten. */
function demoTarget(
	st: HandState,
	name: string,
	obj: ObjFn,
): { x: number; y: number; cx: number; cy: number } | null {
	const fr = st.back.parentElement?.querySelector('iframe');
	const doc = fr?.contentDocument;
	if (!fr || !doc?.body) return null;
	const r = fr.getBoundingClientRect();
	const k = r.width / fr.clientWidth;
	const el = [...doc.querySelectorAll(`a[data-k^="a|${name}"]`)].find(
		(e) => e.getBoundingClientRect().top > fr.clientHeight * 0.7,
	);
	if (!el || !k) return null;
	const q = el.getBoundingClientRect();
	const cx = r.left + (q.left + q.width / 2) * k;
	const cy = r.top + (q.top + q.height / 2) * k;
	const r0 = st.back.getBoundingClientRect();
	const [x, y] = obj(cx - r0.left, cy - r0.top);
	return { x, y, cx, cy };
}

// ----------------------------------------------------------------------------------------------------
// Ein Bild der Steuerung
// ----------------------------------------------------------------------------------------------------

const onGlass = (x: number, y: number): boolean => {
	const sc = atlases().hold.meta.screen;
	return x > sc.x - 4 && x < sc.x + sc.w + 4 && y > sc.y - 4 && y < sc.y + sc.h + 4;
};

/** Zeiger im Ende-Raum (Objektraum der Hände, ohne das Atmen). */
function objectSpace(cam: Fit, br: Breath): ObjFn {
	return (x, y) => {
		const qx = (x - cam.ox) / cam.f - br.x - 800;
		const qy = (y - cam.oy) / cam.f - br.y - 400;
		const cs = Math.cos(br.r);
		const sn = Math.sin(br.r);
		return [800 + cs * qx + sn * qy, 400 - sn * qx + cs * qy];
	};
}

/**
 * Ein Tipp auf den Bildschirm. Maus und Stift: die Zeigehand steht schon am Zeiger (oder fährt hin), erst bei
 * Berührung läuft der Druck, der Ring und der Klick in die App. Touch: es tippt der echte Finger, nur der Ring
 * markiert die Kontaktstelle (die App reagiert sofort, nichts wird verzögert).
 */
function tap(st: HandState, c: HandContext, e: Input, dm: DemoRun): void {
	const { now } = c;
	if (c.m.clickT === st.lastClick) return;
	st.lastClick = c.m.clickT;
	if (c.endOn && onGlass(e.mx, e.my)) {
		dm.off = true; // eigener Tipp: die Vorführung ist überflüssig
		// Touch: es tippt der echte Finger. direkt: der Klick ist schon in der App angekommen (Phone.tsx), die
		// Zeigehand drückt nur noch mit und der Ring markiert die Stelle.
		if (e.touch || c.m.direct) {
			st.tap = [e.mx, e.my];
			st.contactT = now;
		} else {
			const r0 = st.back.getBoundingClientRect();
			// Läuft noch ein Tipp, geht er sofort in die App: Tipps werden nie verworfen
			if (st.pending && !st.pending.demo) {
				const q = st.pending;
				st.tap = [q.x, q.y];
				st.contactT = now;
				st.host?.dispatchEvent(new CustomEvent('hand:kontakt', { detail: { x: q.cx, y: q.cy } }));
			}
			// Die Spitze steht schon am Zeiger: der Klick geht sofort in die App, die Hand drückt nur mit
			st.tap = [e.mx, e.my];
			st.contactT = now;
			st.host?.dispatchEvent(
				new CustomEvent('hand:kontakt', { detail: { x: r0.left + c.m.x, y: r0.top + c.m.y } }),
			);
		}
	}
}

/**
 * Vorführung: bleibt der Besucher nach dem Eintritt 2,5 s untätig, tippt die Zeigehand einmal pro Sitzung auf „Haushalt“
 * und drei Sekunden später auf „Start“ (über denselben Kontakt-Pfad wie ein echter Tipp). Hover über dem Glas, ein Tipp
 * oder Touch beenden sie. Bei reduzierter Bewegung läuft sie nicht (nur der Hinweis unter dem Handy).
 */
function runDemo(st: HandState, c: HandContext, e: Input, dm: DemoRun): void {
	const { now } = c;
	if (c.endOn && !e.touch && c.m.in && onGlass(e.mx, e.my) && now - (c.m.moveT ?? -9) < 1.4)
		dm.off = true;
	// Fokus im App-iframe (Tastatur, Screenreader): der Besucher bedient die App, die Vorführung bleibt aus
	if (document.activeElement?.tagName === 'IFRAME') dm.off = true;
	if (dm.off || c.reduced || e.touch || isTouch() || !c.endOn || dm.n >= 2) {
		if (!c.endOn) dm.idleSince = null;
		if (dm.off && st.pending?.demo) st.pending = null;
	} else {
		dm.idleSince ??= now;
		if (!st.pending && now - dm.idleSince > 2.5 && now >= dm.next) {
			const z = demoTarget(st, dm.n ? 'Start' : 'Haushalt', e.obj);
			if (z) st.pending = { ...z, t0: now, demo: true, slow: true };
			else dm.next = now + 0.8;
		}
	}
}

/** Wohin die Zeigehand zieht: anstehender Tipp, Zeiger über dem Glas oder Parkplatz. */
function chooseTarget(st: HandState, c: HandContext, e: Input): Target {
	const pend = st.pending;
	// Nach dem Kontakt zieht sich die Hand nach 0,35 s zurück, damit das Ergebnis des Tipps zu sehen ist
	// Über dem Glas klebt die Fingerspitze am Zeiger, solange er dort ist (kein Rückzug, kein Zeitlimit)
	const follows = c.endOn && !e.touch && c.m.in && onGlass(e.mx, e.my);
	let tg: readonly [number, number] = st.park;
	let k = 7;
	if (follows) {
		tg = [e.mx, e.my];
		k = Number.POSITIVE_INFINITY;
	} else if (pend) {
		tg = [pend.x, pend.y];
		k = pend.slow ? 9 : 40;
	}
	return { tg, k, follows, pend };
}

/** Fingerspitze und Zeigerlicht ans Ziel ziehen; bei Ankunft des Tipps Kontakt auslösen. */
function move(st: HandState, c: HandContext, cam: Fit, e: Input, z: Target, dm: DemoRun): Point {
	const { H, t, now, dt } = c;
	// Zeigerlicht: folgt der Maus, sonst ein ruhiger Autopilot
	const lg: [number, number] =
		c.endOn && c.m.in && !e.touch ? [e.mx, e.my] : c.reduced ? [820, 400] : autopilot(t);
	const parkY = Math.max(1000, (H - cam.oy) / cam.f + 340);
	st.park = [940, parkY];
	if (!st.ht) st.ht = { x: st.park[0], y: st.park[1] };
	const ht = st.ht;
	// k = unendlich: ohne Nachziehen genau am Zeiger (die Spitze ersetzt den Mauszeiger)
	const kk = Number.isFinite(z.k) ? 1 - Math.exp(-z.k * Math.min(dt, 0.05)) : 1;
	ht.x += (z.tg[0] - ht.x) * kk;
	ht.y += (z.tg[1] - ht.y) * kk;
	const pend = z.pend;
	// Berührung: die Spitze ist angekommen (oder 0,3 s sind um), jetzt Druck, Ring und Klick
	if (
		pend &&
		(Math.hypot(ht.x - pend.x, ht.y - pend.y) < 8 || now - pend.t0 > (pend.slow ? 0.9 : 0.12))
	) {
		st.pending = null;
		if (pend.demo) {
			dm.n++;
			dm.next = now + 3;
			if (dm.n >= 2) demoDone(true);
		}
		st.tap = [pend.x, pend.y];
		st.contactT = now;
		st.host?.dispatchEvent(
			new CustomEvent('hand:kontakt', { detail: { x: pend.cx, y: pend.cy, demo: !!pend.demo } }),
		);
	}
	const lt = st.lt;
	const kl = 1 - Math.exp(-24 * Math.min(dt, 0.05));
	lt.x += (lg[0] - lt.x) * kl;
	lt.y += (lg[1] - lt.y) * kl;
	return ht;
}

/** Cursor: über dem Glas ersetzt die Fingerspitze den Zeiger (auch im Dokument der App, Phone.tsx). */
function setCursor(st: HandState, follow: boolean): void {
	if (st.host) st.host.toggleAttribute('data-hand-folgt', follow);
	if (!st.appDoc?.isConnected)
		st.appDoc = st.space?.querySelector('iframe')?.contentDocument?.documentElement ?? null;
	if (st.appDoc && st.appDoc.hasAttribute('data-hand') !== follow)
		st.appDoc.toggleAttribute('data-hand', follow);
}

/** Bildwerte aus dem Zustand: Spitze, Armrichtung, Druck, Ring, Licht (auf 4 px gerastert). */
function buildValues(
	st: HandState,
	c: HandContext,
	cam: Fit,
	br: Breath,
	ht: Point,
	touch: boolean,
): DrawValues {
	const { W, H, now } = c;
	const pr = now - st.contactT;
	const push = st.tap && pr >= 0 && pr < 0.4 && !touch ? Math.sin((pr / 0.4) * Math.PI) : 0;
	const portrait = isPortrait(W, H);
	const ax = (portrait ? (W - cam.ox) / cam.f : ARM[0]) - ht.x;
	const ay = (portrait ? (H - cam.oy) / cam.f : ARM[1]) - ht.y;
	const AL = Math.hypot(ax, ay) || 1;
	const ux = ax / AL;
	const uy = ay / AL;
	if (st.frames++ % 15 === 0) measure(st, cam);
	const lt = st.lt;
	// Das Licht wird gerastert (4 px), damit ruhiges Licht keinen neuen Durchgang auslöst
	return {
		light: { x: Math.round(lt.x / 4) * 4, y: Math.round(lt.y / 4) * 4 },
		ringAt: { x: st.tap ? st.tap[0] : 0, y: st.tap ? st.tap[1] : 0 },
		lightPow: st.mode === 'gl' ? 1 : 0,
		// Unterarm löst sich am unteren Bildrand auf (Verlauf statt harter Kante)
		bottomY: Math.min(atlases().hold.meta.bottomY, (H - cam.oy) / cam.f + 10),
		// Die Spitze steht exakt am Ziel, beim Druck geht sie leicht in Armrichtung
		tip: {
			x: Math.round((ht.x + ux * push * 4) * 2) / 2,
			y: Math.round((ht.y + uy * push * 4) * 2) / 2,
		},
		u: { x: ux, y: uy },
		sc: PS * (W <= 768 ? 0.75 : 1) * (1 - push * 0.06),
		// Touch: keine gezeichnete Zeigehand, dort tippt der echte Finger
		pa: qa.noPoint || touch ? 0 : 1,
		push: Math.round(push * 20) / 20,
		decay: Math.round(c.decay * 200) / 200,
		br,
		ring: st.tap && pr >= 0 && pr < RING_T ? 1 - pr / RING_T : 0,
		ringR: 10 + Math.max(0, pr) * 150,
		q: st.quiet,
	};
}

/**
 * Ein Bild der Zeigehand-Steuerung (Reihenfolge wie im Ablauf): Tipp, Vorführung, Ziel, Bewegung, Cursor, Werte.
 * br: Atmen dieses Bildes.
 */
export function pointStep(st: HandState, c: HandContext, cam: Fit, br: Breath): DrawValues {
	const obj = objectSpace(cam, br);
	const [mx, my] = obj(c.m.x, c.m.y);
	const touch = c.m.type === 'touch';
	const e: Input = { obj, mx, my, touch };
	if (!st.demo) st.demo = { n: 0, idleSince: null, next: 0, off: demoDone() };
	const dm = st.demo;
	tap(st, c, e, dm);
	runDemo(st, c, e, dm);
	const z = chooseTarget(st, c, e);
	const ht = move(st, c, cam, e, z, dm);
	setCursor(st, !!(z.follows || z.pend));
	st.dbg = {
		m: { x: c.m.x, y: c.m.y, in: c.m.in, down: c.m.down, type: c.m.type },
		tg: z.tg,
		endOn: c.endOn,
		tap: st.tap,
	};
	return buildValues(st, c, cam, br, ht, touch);
}
