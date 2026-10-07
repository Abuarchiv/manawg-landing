// Diff-Bild: mine.png gegen Original NN (rot = Abweichung > 24). Aufruf: node tools/qa/app/diff.mjs <mine.png> <NN> <out.png>
import { readdirSync } from 'node:fs';
import { sharp } from '../lib.mjs';

const [mine, nn, out] = process.argv.slice(2);
const SHOTS =
	'/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/app/shots/final';
const f = readdirSync(SHOTS).find((x) => x.startsWith(`${nn}-`) && !x.endsWith('-full.png'));
const a = await sharp(mine).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const b = await sharp(`${SHOTS}/${f}`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const o = Buffer.alloc(a.data.length);
let n = 0;
for (let i = 0; i < a.data.length; i += 3) {
	const d = Math.max(
		Math.abs(a.data[i] - b.data[i]),
		Math.abs(a.data[i + 1] - b.data[i + 1]),
		Math.abs(a.data[i + 2] - b.data[i + 2]),
	);
	if (d > 24) {
		o[i] = 255;
		o[i + 1] = 0;
		o[i + 2] = 0;
		n++;
	} else {
		const g = 255 - (255 - a.data[i]) * 0.35;
		o[i] = o[i + 1] = o[i + 2] = g;
	}
}
await sharp(o, { raw: a.info }).resize({ width: 585 }).png().toFile(out);
console.log(f, (100 * n) / (a.data.length / 3), '%');
