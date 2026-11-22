// Which hero a device gets. The WebGL hero (hero.ts) raymarches the mountain and the organ every frame; on phones
// and slow devices that blocks the main thread for seconds (#126). They get the photo mountain as a still image
// instead, and hero.ts is never downloaded there (stage.ts imports it on demand).

/** What the decision reads off the device. */
interface Device {
	w: number;
	h: number;
	reduced: boolean;
	saveData?: boolean | undefined;
	/** navigator.hardwareConcurrency */
	cores?: number | undefined;
	/** navigator.deviceMemory (GB, Chromium only) */
	memory?: number | undefined;
}

/**
 * WebGL hero only in landscape windows from 700 px (portrait and phone-in-landscape follow modeOf in loop.ts), without
 * reduced motion or data saver, and with more than two cores and more than 2 GB of memory where the browser says so.
 */
export function wantsGL({ w, h, reduced, saveData, cores, memory }: Device): boolean {
	const small = w < 700 || w <= h || h < 500;
	return !small && !reduced && !saveData && (cores ?? 8) > 2 && (memory ?? 8) > 2;
}

/** What the browser reports about the device and the connection (browser only; size and motion come from the loop). */
export function device(): Pick<Device, 'saveData' | 'cores' | 'memory'> {
	const nav = navigator as Navigator & {
		connection?: { saveData?: boolean };
		deviceMemory?: number;
	};
	return {
		saveData: nav.connection?.saveData,
		cores: nav.hardwareConcurrency,
		memory: nav.deviceMemory,
	};
}

/** Image section of the photo mountain, as photoUV in hero.ts at rest (no pointer, no look-up). */
function section(iw: number, ih: number, W: number, H: number, drop: number) {
	const A = W / H;
	const hN = Math.min(iw / ih / A, 0.5);
	const wN = (hN * A * ih) / iw;
	const cx = Math.min(Math.max(0.4, wN / 2), 1 - wN / 2);
	const top = 0.98 - hN - drop * hN;
	return { sx: (cx - wN / 2) * iw, sy: top * ih, sw: wN * iw, sh: hN * ih };
}

/**
 * Still hero: the photo mountain drawn once (again only on a size change), with the dark foot under the text as in
 * the shader. Same interface as createHero, the stage swaps it for the WebGL hero when the window grows.
 */
export function createStaticHero(cv: HTMLCanvasElement) {
	const ctx = cv.getContext('2d');
	const img = new Image();
	img.decoding = 'async';
	// Image failed: plain paper (the dark tone; light mode inverts the canvas) instead of an empty hero that never gets ready
	let failed = false;
	img.onerror = () => {
		failed = true;
	};
	img.src = '/hero/mountain.webp';
	let key = '';
	return {
		frame(
			c: { W: number; H: number; dpr: number; dprHero?: number },
			h: { drop: number },
		): boolean {
			if (!ctx) return false;
			if (!failed && (!img.complete || !img.naturalWidth)) return false;
			const dpr = c.dprHero ?? c.dpr;
			const w = Math.max(1, Math.round(c.W * dpr));
			const hh = Math.max(1, Math.round(c.H * dpr));
			const k = `${w}x${hh}:${h.drop.toFixed(3)}:${failed}`;
			if (k === key) return true;
			key = k;
			cv.width = w;
			cv.height = hh;
			if (failed) {
				ctx.fillStyle = '#0A0A0A';
				ctx.fillRect(0, 0, w, hh);
				return true;
			}
			const s = section(img.naturalWidth, img.naturalHeight, c.W, c.H, h.drop);
			ctx.drawImage(img, s.sx, s.sy, s.sw, s.sh, 0, 0, w, hh);
			const g = ctx.createLinearGradient(0, hh, 0, hh * 0.58);
			g.addColorStop(0, 'rgb(10 10 10 / 0.5)');
			g.addColorStop(1, 'rgb(10 10 10 / 0)');
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, w, hh);
			return true;
		},
		release() {
			key = '';
			cv.width = cv.height = 1;
		},
		destroy() {},
	};
}
