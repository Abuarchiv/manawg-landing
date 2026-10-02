// Kamerafahrt durch das Blender-Wohnzimmer (Cycles-Bildfolge in fahrt/), per Scroll abgespielt.
const N = 161;
const STATIONEN = 5; // Tür, Esstisch, Regal, Fenster, Sofa – alle 40 Bilder eine Station
const src = (i) => new URL(`fahrt/wz_${String(i + 1).padStart(4, '0')}.webp`, import.meta.url).href;

export function fahrt(canvas) {
	const ctx = canvas.getContext('2d');
	const bilder = new Array(N);
	let gezeigt = -1;
	function groesse() {
		const d = Math.min(devicePixelRatio, 2);
		canvas.width = Math.round(innerWidth * d);
		canvas.height = Math.round(innerHeight * d);
		gezeigt = -1;
	}
	addEventListener('resize', groesse);
	groesse();
	const laden = (i) => {
		if (bilder[i]) return bilder[i];
		bilder[i] = fetch(src(i))
			.then((r) => r.blob())
			.then((b) => createImageBitmap(b))
			.then((bm) => {
				bilder[i] = bm;
				return bm;
			})
			.catch(() => {
				bilder[i] = undefined; // später erneut versuchen
				return null;
			});
		return bilder[i];
	};
	// Erst die Stationen, dann jedes 4., dann alle: so ist die Fahrt früh grob und später fein
	async function alle(onProgress) {
		const reihen = [
			[0, 40, 80, 120, 160],
			[...Array(N).keys()].filter((i) => i % 4 === 0),
			[...Array(N).keys()],
		];
		const erste = reihen[0];
		let fertig = 0;
		await Promise.all(
			erste.map((i) => Promise.resolve(laden(i)).then(() => onProgress(++fertig / erste.length))),
		);
		(async () => {
			for (const r of reihen.slice(1)) {
				for (let k = 0; k < r.length; k += 6)
					await Promise.all(r.slice(k, k + 6).map((i) => laden(i)));
			}
		})();
	}
	// nächstes geladenes Bild zur Position
	function naechstes(i) {
		for (let d = 0; d < N; d++) {
			for (const j of [i - d, i + d])
				if (j >= 0 && j < N && bilder[j] instanceof ImageBitmap) return bilder[j];
		}
		return null;
	}
	function zeichne(u) {
		const i = Math.round(Math.min(1, Math.max(0, u)) * (N - 1));
		const bm = bilder[i] instanceof ImageBitmap ? bilder[i] : naechstes(i);
		if (!bm || (i === gezeigt && bm === bilder[i])) return Math.floor(i / 40);
		const s = Math.max(canvas.width / bm.width, canvas.height / bm.height);
		const w = bm.width * s;
		const h = bm.height * s;
		ctx.drawImage(bm, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
		gezeigt = bm === bilder[i] ? i : -1;
		return Math.min(STATIONEN - 1, Math.round(i / 40));
	}
	return { alle, zeichne };
}
