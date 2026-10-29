// Transition phone → "How it works": while scrolling on, the app in the phone dissolves into mono characters. Each character
// first sits where the app shows text or an icon, then detaches with the scroll, flies in an
// arc downward and lands as a cell of the large digits 01 to 03. After that the digits take over
// (how-it-works/digits.ts) once the transition is done. Everything follows the scroll and runs backwards the same way.
//
// Progress T: 0 while the intro stage is sticky; 1 when the first digit sits at 30 % of the window height.

import { loop, onFrame } from '../../core/loop';
import { cl, hsh, ss } from '../../core/math';
import { buildGrid, digitMetrics, handover } from '../how-it-works/digits';

const RAMP = '@%#*+=-:';
const DIGITS = ['01', '02', '03'];
const DISSOLVE_END = 0.18; // up to here the app dissolves into characters in place
const TARGET_Y = 0.3; // position of the digits' top edge (fraction of the window height) at T = 1
const DEPTH = 2; // distance screen → digits in screen depths

/** One character: source in the app (u, v measured from the iframe), target as cell of digit z, start d, swing w. */
interface Particle {
	u: number;
	v: number;
	z: number;
	x: number;
	y: number;
	tone: 0 | 2;
	d: number;
	w: number;
}

/** Points with content in the app: rectangles of text and icons, weighted by area (fraction 0..1). */
function sources(
	fr: HTMLIFrameElement | null,
): { r: [number, number, number, number]; g: number }[] {
	const out: { r: [number, number, number, number]; g: number }[] = [];
	const doc = fr?.contentDocument;
	const W = fr?.clientWidth ?? 0;
	const H = fr?.clientHeight ?? 0;
	if (!doc?.body || !W || !H) return out;
	for (const el of doc.body.querySelectorAll('*')) {
		const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());
		if (!text && el.tagName.toLowerCase() !== 'svg') continue;
		const b = el.getBoundingClientRect();
		if (b.width < 2 || b.height < 2 || b.bottom < 0 || b.top > H || b.right < 0 || b.left > W)
			continue;
		const x0 = cl(b.left / W);
		const y0 = cl(b.top / H);
		const x1 = cl(b.right / W);
		const y1 = cl(b.bottom / H);
		out.push({ r: [x0, y0, x1 - x0, y1 - y0], g: (x1 - x0) * (y1 - y0) });
	}
	return out;
}

/** Glyph sheet of the ramp in device pixels. */
function buildSheet(gl: number, dpr: number): { cv: HTMLCanvasElement; z: number } {
	const z = Math.ceil((gl + 4) * dpr);
	const cv = document.createElement('canvas');
	cv.width = z * RAMP.length;
	cv.height = z;
	const g = cv.getContext('2d');
	if (g) {
		g.font = `500 ${gl * dpr}px "JetBrains Mono", monospace`;
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillStyle = '#FAFAFA';
		for (let i = 0; i < RAMP.length; i++)
			g.fillText(RAMP[i] ?? '', z * i + z / 2, z / 2 + 0.5 * dpr);
	}
	return { cv, z };
}

export function startDecay(cv: HTMLCanvasElement): () => void {
	const ctx = cv.getContext('2d');
	let particles: Particle[] = [];
	let key = '';
	let sheet: { cv: HTMLCanvasElement; z: number } | null = null;
	let large: { cv: HTMLCanvasElement; z: number } | null = null; // four times, so near characters stay sharp
	let sheetKey = '';
	let prevT = 0;
	let blank = true;
	let appOffValue = '';
	// --app-aus only on the phone screen (still image and iframe), not on #final: an inherited variable on the
	// root would recompute the style of the whole scene in every frame. Write only on change.
	const setAppOff = (v: string) => {
		if (v === appOffValue) return;
		appOffValue = v;
		document
			.querySelector('iframe[title="ManaWG-App"]')
			?.parentElement?.style.setProperty('--app-aus', v);
	};

	const idleFrame = (T: number) => {
		handover.covered = false;
		setAppOff(T >= 1 ? '1' : '0');
		if (!blank && ctx) {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, cv.width, cv.height);
			blank = true;
		}
	};

	// Look up elements once, not every frame (also runs while the intro is sticky)
	let stageEl: HTMLElement | null = null;
	let digits: HTMLCanvasElement[] = [];
	let rect = { end: 0, height: 0, digitsTop: 0 };
	let rectKey = '';
	let rectTime = -9;
	let early: ReturnType<typeof sources> = [];
	let preMeasure = false;
	let sourceTime = -9;
	const off = onFrame(() => {
		if (!stageEl?.isConnected)
			stageEl = document.querySelector<HTMLElement>('[data-buehne="intro"]');
		if (digits.length < DIGITS.length || !digits[0]?.isConnected)
			digits = [...document.querySelectorAll<HTMLCanvasElement>('#so-gehts canvas')];
		if (!ctx || !stageEl || digits.length < DIGITS.length || loop.reduced) return idleFrame(1);
		const H = loop.vh;
		const W = loop.vw;
		// Read layout positions only on resize and about once per second: a getBoundingClientRect in
		// every frame forced its own layout pass after the stage's style writers (the biggest item on the phone
		// while scrolling through the demo phone). The stage sticks, its edge follows from the end of the section.
		const sy = window.scrollY;
		const lk = `${W}x${H}`;
		if (lk !== rectKey || loop.now - rectTime > 1) {
			const sec = stageEl.parentElement?.getBoundingClientRect();
			const z = digits[0]?.getBoundingClientRect();
			if (!sec || !z) return idleFrame(1);
			rect = { end: sec.bottom + sy, height: stageEl.offsetHeight, digitsTop: z.top + sy };
			rectKey = lk;
			rectTime = loop.now;
		}
		const bt = Math.min(0, rect.end - sy - rect.height);
		const T = bt >= 0 ? 0 : cl(-bt / Math.max(1, rect.digitsTop - sy - bt - TARGET_Y * H));
		const next = prevT <= 0;
		prevT = T;
		if (T <= 0) {
			// Shortly before the transition, measure the sources in an idle pause (all rectangles of the app cost
			// a whole frame on the phone), so the dissolve starts without a hitch
			if (rect.end - sy - rect.height < H && !preMeasure && loop.now - sourceTime > 0.6) {
				preMeasure = true;
				const measure = () => {
					preMeasure = false;
					early = sources(document.querySelector<HTMLIFrameElement>('iframe[title="ManaWG-App"]'));
					sourceTime = loop.now;
				};
				if ('requestIdleCallback' in window) window.requestIdleCallback(measure, { timeout: 500 });
				else setTimeout(measure, 50);
			}
			return idleFrame(T);
		}
		if (T >= 1) return idleFrame(T);

		const portrait = loop.mode === 'hoch';
		const { cs, gl } = digitMetrics(portrait);
		const fr = document.querySelector<HTMLIFrameElement>('iframe[title="ManaWG-App"]');
		// Rebuild targets (cells of the three digits) and sources (content of the app) on entry or after a resize
		const k = `${W}x${H}|${loop.fv}|${digits.map((c) => `${c.clientWidth}x${c.clientHeight}`).join()}`;
		if (next || k !== key) {
			key = k;
			const q = early.length ? early : sources(fr);
			const total = q.reduce((a, b) => a + b.g, 0);
			particles = [];
			digits.forEach((c, zi) => {
				for (const [i, z] of buildGrid(
					DIGITS[zi] ?? '',
					c.clientWidth,
					c.clientHeight,
					cs,
				).entries()) {
					const h1 = hsh(i + zi * 997, 11);
					const h2 = hsh(i + zi * 997, 23);
					// Draw source by area; without a loaded app: evenly across the screen
					let u = h1;
					let v = h2;
					if (total > 0) {
						let r = hsh(i + zi * 997, 37) * total;
						let t = q[q.length - 1];
						for (const e of q) {
							r -= e.g;
							if (r <= 0) {
								t = e;
								break;
							}
						}
						if (t) {
							u = t.r[0] + h1 * t.r[2];
							v = t.r[1] + h2 * t.r[3];
						}
					}
					particles.push({
						u,
						v,
						z: zi,
						x: z.x,
						y: z.y,
						tone: z.tone,
						// the top of the app dissolves first, plus scatter
						d: DISSOLVE_END + v * 0.22 + hsh(i, zi + 5) * 0.12,
						w: (hsh(i, zi + 9) - 0.5) * 2,
					});
				}
			});
		}
		handover.covered = true;

		// At most 1.5x: the area is screen-sized and thousands of characters fly fast; at 2x the
		// GPU was the limit on Retina desktops (44 % fewer pixels, not visible in flight)
		const dpr = Math.min(1.5, devicePixelRatio || 1);
		if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
			cv.width = Math.round(W * dpr);
			cv.height = Math.round(H * dpr);
		}
		const sk = `${gl}|${dpr}|${loop.fv}`;
		if (!sheet || sk !== sheetKey) {
			sheet = buildSheet(gl, dpr);
			large = buildSheet(gl * 4, dpr);
			sheetKey = sk;
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, cv.width, cv.height);
		blank = false;
		const ra = fr?.getBoundingClientRect() ?? stageEl.getBoundingClientRect();
		const zr = digits.map((c) => c.getBoundingClientRect());
		// read first, then write: otherwise reading the positions forces a second layout pass per frame
		setAppOff(ss(T / DISSOLVE_END).toFixed(3));
		const rise = ss(T / (DISSOLVE_END * 0.6)); // characters appear while the app fades out
		const tq = Math.floor(loop.now / 0.09);
		// Punch-through: a camera flies through the phone screen (plane z = 1) toward the digits (plane
		// z = 1 + DEPTH). Image position p = C + (P - C) / (z - kz): the app characters burst outward, the digits scale up
		// out of the vanishing point, their cells first form a cloud in depth and contract onto the plane.
		const u = cl((T - DISSOLVE_END * 0.7) / (1 - DISSOLVE_END * 0.7));
		// Camera so that the digits scale up evenly (logarithmically), slightly past the target, then they sit
		const camZOf = (v: number) => {
			const sd =
				(1 + DEPTH) ** -(1 - ss(v)) * (1 + 0.04 * Math.sin(Math.PI * cl((v - 0.72) / 0.28)));
			return 1 + DEPTH - 1 / sd;
		};
		const camZ = camZOf(u);
		const camZPrev = camZOf(cl(u - 0.035));
		const bx = ra.left + ra.width / 2;
		const by = ra.top + ra.height / 2;
		const cx = bx + (W / 2 - bx) * ss(u);
		const cy = by + (H * 0.46 - by) * ss(u);
		const spin = 0.2 * (1 - ss(u)) ** 2; // the digits rotate in during the approach
		const dc = Math.cos(spin);
		const ds = Math.sin(spin);
		// Backdrop: the screen grows with the camera until it fills the window; from the approach on it fades out
		// so headings and texts of "How it works" already stand beneath it
		const sb = 1 / Math.max(0.001, 1 - camZ);
		const base = rise * (1 - ss((u - 0.78) / 0.2));
		if (base > 0.01) {
			ctx.fillStyle = `rgba(10,10,10,${base.toFixed(3)})`;
			if (camZ >= 1) ctx.fillRect(0, 0, cv.width, cv.height);
			else {
				const x0 = (cx + (ra.left - cx) * sb) * dpr;
				const y0 = (cy + (ra.top - cy) * sb) * dpr;
				const rw = ra.width * sb * dpr;
				const rh = ra.height * sb * dpr;
				ctx.fillRect(x0, y0, rw, rh);
				// Frame of the screen as a thin line, it flies past the viewer too
				ctx.strokeStyle = `rgba(250,250,250,${(0.35 * rise * (1 - camZ)).toFixed(3)})`;
				ctx.lineWidth = dpr;
				ctx.strokeRect(x0, y0, rw, rh);
			}
		}
		const z2 = sheet.z;
		const kl = sheet;
		const gr = large ?? sheet;
		// Trail of real characters instead of motion blur: up to five repeats between old and new position
		const draw = (
			x: number,
			y: number,
			xa: number,
			ya: number,
			tone: number,
			a: number,
			g: number,
			nMax = 5,
		) => {
			if (a < 0.01 || x < -g || y < -g || x > W + g || y > H + g) return;
			const dl = Math.hypot(x - xa, y - ya);
			const n = Math.min(nMax, Math.floor(dl / (g / dpr)));
			for (let k = n; k >= 0; k--) {
				const f = n ? k / n : 0;
				const b = g > z2 * 1.3 ? gr : kl;
				ctx.globalAlpha = a * (1 - f * 0.8);
				ctx.drawImage(
					b.cv,
					b.z * tone,
					0,
					b.z,
					b.z,
					Math.round((x + (xa - x) * f) * dpr - g / 2),
					Math.round((y + (ya - y) * f) * dpr - g / 2),
					g,
					g,
				);
			}
		};
		for (const [i, p] of particles.entries()) {
			const run = Math.floor(hsh(i + tq, p.z) * RAMP.length) % RAMP.length;
			// App characters on the plane of the screen
			if (camZ < 0.97) {
				const sx = ra.left + p.u * ra.width;
				const sy = ra.top + p.v * ra.height;
				const s1 = 1 / (1 - camZ);
				const s0 = 1 / Math.max(0.03, 1 - Math.min(camZPrev, camZ));
				const g = Math.round(z2 * Math.min(6, s1 ** 0.8));
				const tone = camZ > 0.02 ? run : Math.floor(hsh(i, 3) * RAMP.length);
				draw(
					cx + (sx - cx) * s1,
					cy + (sy - cy) * s1,
					cx + (sx - cx) * s0,
					cy + (sy - cy) * s0,
					tone,
					0.85 * rise * (1 - ss((camZ - 0.75) / 0.22)),
					g,
				);
			}
			// Cells of the digits: first a cloud in depth (scatter per cell) that contracts onto the plane
			const r = zr[p.z];
			if (!r) continue;
			const tx = r.left + p.x + cs / 2;
			const ty = r.top + p.y + cs / 2;
			const cloud = (1 - ss((u - 0.1) / 0.4)) * 0.25;
			const zt = 1 + DEPTH + p.w * cloud;
			const s1 = 1 / Math.max(0.05, zt - camZ);
			const s0 = 1 / Math.max(0.05, zt - camZPrev);
			const dx = tx - W / 2;
			const dy = ty - H * 0.46;
			const qx = W / 2 + dx * dc - dy * ds;
			const qy = H * 0.46 + dx * ds + dy * dc;
			const done = u >= 0.995;
			const a = ss((u - 0.16) / 0.2) * rise * (done && p.tone === 2 ? 0.42 : 0.95);
			const g = Math.round(z2 * Math.min(2.4, Math.max(0.5, s1)));
			draw(
				cx + (qx - cx) * s1,
				cy + (qy - cy) * s1,
				cx + (qx - cx) * s0,
				cy + (qy - cy) * s0,
				// the cells lock onto their character one after another, the digits become readable in flight
				done || hsh(i, 7) < (u - 0.35) / 0.45 ? (p.tone === 0 ? 0 : 2) : run,
				a,
				g,
				2,
			);
		}
		ctx.globalAlpha = 1;
	});

	return () => {
		off();
		handover.covered = false;
	};
}
