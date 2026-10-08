// Nebeneinander (oben Original, unten Demo) eines Bildausschnitts. Aufruf: node tools/qa/app/cmp.mjs <mine.png> <NN> <out.png> [top height]
import { readdirSync } from 'node:fs';
import { sharp } from '../lib.mjs';

const [mine, nn, out, top = '0', height = '600'] = process.argv.slice(2);
const SHOTS =
	'/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/app/shots/final';
const f = readdirSync(SHOTS).find((x) => x.startsWith(`${nn}-`) && !x.endsWith('-full.png'));
const crop = { left: 0, top: +top, width: 1170, height: +height };
const a = await sharp(`${SHOTS}/${f}`).extract(crop).toBuffer();
const b = await sharp(mine).extract(crop).toBuffer();
await sharp({
	create: { width: 1170, height: crop.height * 2 + 20, channels: 3, background: '#f00' },
})
	.composite([
		{ input: a, top: 0, left: 0 },
		{ input: b, top: crop.height + 20, left: 0 },
	])
	.png()
	.toFile(out);
