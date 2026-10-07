import { sheet } from '/Users/abu/Company/manawg-landing/.claude/worktrees/wf_2894ef3f-ac5-13/tools/qa/lib.mjs';
const [out, w, ...files] = process.argv.slice(2);
await sheet(
	files,
	files.map((f) => f.split('/').pop()),
	out,
	files.length,
	Number(w),
);
