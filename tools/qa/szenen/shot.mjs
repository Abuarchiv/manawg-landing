import {
	args,
	launch,
	open,
	shot,
	toMark,
	vpOf,
} from '/Users/abu/Company/manawg-landing/.claude/worktrees/wf_2894ef3f-ac5-13/tools/qa/lib.mjs';
const a = args();
const b = await launch();
const vp = vpOf(a.vp ?? '1440x900@1');
const h = await open(b, { vp, url: a.url });
for (const m of String(a.marks).split(',')) {
	await toMark(h, m, { mx: vp.w - 3, my: vp.h - 3 });
	await shot(h, `s-${vp.name}-${m.replace(/[:.]/g, '_')}`, { out: a.out });
}
await b.close();
