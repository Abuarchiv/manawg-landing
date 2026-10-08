// Pässe der Hände laden: je Hand ein Atlas (.webp) mit Leuchtdichte, Alpha, Normale und Tiefe plus .json mit Lage.

import { HAND_V, TILES } from './konstanten';
import type { Atlanten, Atlas, AtlasMeta, HaltMeta } from './typen';

const A: { ready: boolean; daten: Atlanten | null; p: Promise<void> | null; err: boolean } = {
	ready: false,
	daten: null,
	p: null,
	err: false,
};

async function ladeAtlas<M extends AtlasMeta>(name: string): Promise<Atlas<M>> {
	const [meta, blob] = await Promise.all([
		fetch(`/hand/${name}.json?v=${HAND_V}`).then((r): Promise<M> => r.json()),
		fetch(`/hand/${name}.webp?v=${HAND_V}`).then((r) => r.blob()),
	]);
	const bmp = await createImageBitmap(blob, {
		colorSpaceConversion: 'none',
		premultiplyAlpha: 'none',
	});
	return { meta, bmp, cpu: null };
}

/** Lädt die Pässe der Hände (einmal). stage.js ruft das ab P > 0,75 auf. */
export function laden(): Promise<void> {
	if (!A.p)
		A.p = Promise.all([ladeAtlas<HaltMeta>('hold'), ladeAtlas<AtlasMeta>('point')])
			.then(([hold, point]) => {
				A.daten = { hold, point };
				A.ready = true;
			})
			.catch((e) => {
				A.err = true;
				console.error('hand: Pässe nicht geladen', e);
			});
	return A.p;
}

/** Pässe geladen? Erst dann sind atlanten() und alle Zeichenwege gültig. */
export const bereit = (): boolean => A.ready;

/** Die geladenen Pässe. Nur nach bereit() aufrufen. */
export function atlanten(): Atlanten {
	if (!A.daten) throw new Error('hand: Pässe nicht geladen');
	return A.daten;
}

/** Kacheln eines Atlas als uniform vec4[5]: x, y, w, h je Kachel. */
export const tileArray = (meta: AtlasMeta): Float32Array => {
	const a = new Float32Array(20);
	TILES.forEach((n, i) => {
		const t = meta.tiles[n];
		a.set([t.x, t.y, t.w, t.h], i * 4);
	});
	return a;
};

export const divArray = (meta: AtlasMeta): Float32Array =>
	new Float32Array(TILES.map((n) => meta.tiles[n].div));
