// Die Hände der Ende-Szene: eine Hand hält das Handy, die andere wartet unten außerhalb des Bildschirms und
// fährt nur zum Tippen über das Ziel. Beide kommen aus gerenderten Daten-Pässen (public/hand/, landing-konzept/design/HAND.md):
// Leuchtdichte, Alpha, Normale und Tiefe. Gezeichnet wird als feiner Halbton (Zellraster 1,25 Bühnen-px,
// Bayer 4 x 4), die Silhouette per Pixel-Alpha geglättet, im WebGL2-Fragment-Shader. Ohne WebGL2 wird der Halbton
// einmal je Größenänderung auf 2D vorberechnet (ohne Zeigerlicht, die Zeigehand als Sprite).
//
// back liegt unter dem Handy, front darüber (normaler Blend, über dem Glas dunkle Punkte). Vorn und hinten
// folgt aus der Tiefe z und der Handy-Silhouette: vorne sind Daumen und Fingerkuppen, die über den Rand
// auf den Bildschirm ragen, sowie die Zeigehand.
//
// Aufbau: atlas.ts (Pässe laden), shader.ts (GLSL), gl.ts (WebGL2-Weg), cpu.ts (2D-Fallback), zeige.ts
// (Zeigehand-Steuerung, Vorführung, Kontakt), typen.ts, konstanten.ts. Hier: die öffentliche Schnittstelle.

import { type Fit, dprFor, sizeBacking } from '../../../core/canvas';
import { qa } from '../../../core/loop';
import { atlases, isReady } from './atlas';
import { cpuClear, cpuFrame } from './cpu';
import { glFrame, glProbeEnd, glProbeStart, glUsable, makeLayer, readyStep } from './gl';
import { breath, newState, pointStep, states } from './pointing';
import type { HandContext, HandState } from './types';

export { load } from './atlas';

/**
 * Zeichenart einmal festlegen (WebGL2 mit beiden Ebenen oder 2D-Fallback). Mit schritt höchstens ein teurer
 * Teil je Aufruf (Eignungsprüfung, erste Ebene, zweite Ebene), damit das Vorwärmen kein Bild sprengt.
 */
function chooseMode(
	st: HandState,
	back: HTMLCanvasElement,
	front: HTMLCanvasElement,
	step = false,
): void {
	if (st.mode) return;
	const { hold, point } = atlases();
	if (st.usable === undefined) {
		if (!step) {
			st.usable = st.probe
				? (glProbeEnd(st.probe, true) ?? false)
				: glUsable(hold.meta, point.meta);
		} else if (!st.probe) {
			// Teil 1 in diesem Bild, Teil 2 in einem späteren (der Treiber übersetzt dazwischen)
			const p = glProbeStart(hold.meta, point.meta);
			if (p) st.probe = p;
			else st.usable = false;
			return;
		} else {
			const ok = glProbeEnd(st.probe);
			if (ok !== undefined) st.usable = ok;
			return;
		}
	}
	if (step && st.usable && !st.pendingLayers) {
		st.pendingLayers = [makeLayer(back, false)];
		return;
	}
	if (st.usable && st.pendingLayers && st.pendingLayers.length === 1 && step) {
		st.pendingLayers.push(makeLayer(front, true));
		return;
	}
	const l0 = st.usable ? (st.pendingLayers?.[0] ?? makeLayer(back, false)) : null;
	const l1 = st.usable ? (st.pendingLayers?.[1] ?? makeLayer(front, true)) : null;
	if (l0 && l1) {
		st.layers = [l0, l1];
		st.mode = 'gl';
	} else {
		st.mode = 'cpu';
		st.layers = null;
	}
}

function clearAll(st: HandState): void {
	if (st.layers) {
		for (const L of st.layers) {
			if (L.gl && !L.gl.isContextLost() && L.ready) {
				L.gl.clearColor(0, 0, 0, 0);
				L.gl.clear(L.gl.COLOR_BUFFER_BIT);
				L.last = null;
			}
		}
	} else if (st.mode === 'cpu') cpuClear(st);
	st.cpu.key = null;
}

/**
 * Zeichnet beide Hände. back liegt unter dem Handy, front darüber.
 * c: Kontext der Bühne, cam: { f, ox, oy } aus kamera().
 */
export function draw(
	back: HTMLCanvasElement,
	front: HTMLCanvasElement,
	c: HandContext,
	cam: Fit,
): void {
	const t0 = performance.now();
	drawIn(back, front, c, cam);
	const st0 = states.get(back);
	if (st0) st0.ms = (st0.ms ?? 0) * 0.95 + (performance.now() - t0) * 0.05;
}

function drawIn(back: HTMLCanvasElement, front: HTMLCanvasElement, c: HandContext, cam: Fit): void {
	let st = states.get(back);
	if (!st) {
		const next = newState(back, front);
		st = next;
		states.set(back, next);
		qa.hand = () => ({
			mode: next.mode,
			tip: { ...(next.ht ?? {}) },
			quiet: next.quiet.slice(),
			rects: next.rects,
			ms: next.ms,
			dbg: next.dbg,
			gpu: next.layers?.map((L) => L.gpuMs),
		});
	}
	const host = st.host;
	// Vorwärmen: schon vor dem Eintritt Shader linken und Texturen hochladen (ein Schritt je Bild), damit der
	// erste sichtbare Frame der Hand keinen Ruckler auslöst
	if (isReady() && !(c.endA > 0.01) && c.P > 0.5 && !st.warm) {
		chooseMode(st, back, front, true);
		// Ein Schritt je Bild und nur bis die Ebenen bereit sind
		if (st.layers)
			st.warm = st.layers.map(readyStep).every(Boolean) || st.layers.some((L) => L.dead);
	}
	if (!(c.endA > 0.01) || !isReady()) {
		if (!st.clean && isReady() && st.mode) {
			clearAll(st);
			st.clean = true;
		}
		if (host?.style.cursor) host.style.cursor = '';
		return;
	}
	st.clean = false;
	const { W, H, t } = c;
	const dpr = dprFor(2);

	chooseMode(st, back, front);
	for (const cv of [back, front]) sizeBacking(cv, W, H, dpr);

	// Atmen: Handy und Hände bewegen sich gemeinsam um ±1,5 px und ±0,4° (Periode 4 bis 6 s), nur Transform
	const br = c.reduced || st.mode !== 'gl' ? { x: 0, y: 0, r: 0 } : breath(t);
	// Nachhängen: beim Scrollen bleiben Handy und Hände bis 6 px hinter der Seite zurück (Gewicht in der Hand)
	if (!c.reduced) br.y += Math.max(-6, Math.min(6, c.sv * 0.005));
	if (!st.space)
		st.space = back.parentElement?.querySelector<HTMLElement>('[data-ende-space]') ?? null;
	if (st.space) {
		st.space.style.setProperty('--ax', `${br.x.toFixed(3)}px`);
		st.space.style.setProperty('--ay', `${br.y.toFixed(3)}px`);
		st.space.style.setProperty('--ar', `${((br.r * 180) / Math.PI).toFixed(4)}deg`);
	}
	const S = pointStep(st, c, cam, br);
	if (host?.style.cursor) host.style.cursor = '';

	if (st.mode === 'gl' && st.layers) {
		for (const L of st.layers) glFrame(L, S, cam, W, H);
	} else {
		cpuFrame(st, S, cam, W, H, dpr);
		// 2D-Fallback: kein Staub, die Hände blenden beim Wegscrollen nur aus
		const o = String(1 - c.decay);
		back.style.opacity = o;
		front.style.opacity = o;
	}
}
