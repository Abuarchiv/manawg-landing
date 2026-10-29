// Load the hand passes: one atlas (.webp) per hand with luminance, alpha, normal and depth plus a .json with the layout.

import { HAND_V, TILES } from './constants';
import type { Atlas, Atlases, AtlasMeta, HoldMeta } from './types';

const A: { ready: boolean; data: Atlases | null; p: Promise<void> | null; err: boolean } = {
	ready: false,
	data: null,
	p: null,
	err: false,
};

async function loadAtlas<M extends AtlasMeta>(name: string): Promise<Atlas<M>> {
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

/** Loads the hand passes (once). stage.js calls this from P > 0.75. */
export function load(): Promise<void> {
	if (!A.p)
		A.p = Promise.all([loadAtlas<HoldMeta>('hold'), loadAtlas<AtlasMeta>('point')])
			.then(([hold, point]) => {
				A.data = { hold, point };
				A.ready = true;
			})
			.catch((e) => {
				A.err = true;
				console.error('hand: passes not loaded', e);
			});
	return A.p;
}

/** Passes loaded? Only then are atlases() and all draw paths valid. */
export const isReady = (): boolean => A.ready;

/** The loaded passes. Call only after isReady(). */
export function atlases(): Atlases {
	if (!A.data) throw new Error('hand: passes not loaded');
	return A.data;
}

/** Tiles of an atlas as uniform vec4[5]: x, y, w, h per tile. */
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
