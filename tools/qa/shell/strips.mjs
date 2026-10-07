// Kontaktbogen aus den Streifen von kopf.mjs: node tools/qa/shell/strips.mjs <dir-mit-pngs> <out.jpg> [cols] [breite]
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { sheet } from '../lib.mjs';

const [dir, out, cols = 2, w = 720] = process.argv.slice(2);
const f = readdirSync(dir)
	.filter((x) => x.endsWith('.png'))
	.sort();
await sheet(
	f.map((x) => join(dir, x)),
	f,
	out,
	Number(cols),
	Number(w),
);
console.log(out, f.length);
