// Messkette Text, Teil 1: je Marke drei Bilder und die DOM-Textknoten (PLAN-V2 §8 A2.1).
//   A  normal
//   B  Text transparent (nur Hintergrund)
//   C  Canvas unsichtbar (nur Text auf Schwarz, daraus die Glyphenkerne)
// Zeit und rAF stehen still, damit A, B und C denselben Canvas-Zustand zeigen. Kein Zeiger, kein scrollTo.
//   node tools/qa/text/capture.mjs --url http://localhost:3124/ --vp 1440x900@2 \
//        --marks intro:0,intro:0.04,intro:0.676 --out <dir>
// Schreibt <out>/<vp>/NN-<marke>_{A,B,C}.png und NN-<marke>.json. Danach: python3 tools/qa/text/analyze.py <out>/<vp>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	args,
	launch,
	marksOf,
	open,
	renderer,
	report,
	sleep,
	state,
	toMark,
	vpList,
} from '../lib.mjs';

const a = args();

const INIT = () => {
	const pn = performance.now.bind(performance);
	let frozenAt = null;
	let off = 0;
	performance.now = () => (frozenAt === null ? pn() : frozenAt) - off;
	const raf = window.requestAnimationFrame.bind(window);
	window.__q = [];
	window.__frozen = false;
	window.requestAnimationFrame = (cb) =>
		raf((t) => {
			if (window.__frozen) window.__q.push(cb);
			else cb(t);
		});
	window.__freeze = () => {
		if (frozenAt === null) frozenAt = pn();
		window.__frozen = true;
	};
	window.__thaw = () => {
		if (frozenAt !== null) {
			off += pn() - frozenAt;
			frozenAt = null;
		}
		window.__frozen = false;
		const q = window.__q;
		window.__q = [];
		for (const cb of q) raf(cb);
	};
	const st = document.createElement('style');
	st.textContent =
		'html[data-shot="B"] #final *{color:transparent!important;-webkit-text-fill-color:transparent!important}html[data-shot="C"] #final canvas{visibility:hidden!important}';
	document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st));
	const lum = (c) => {
		const f = (v) => {
			const u = v / 255;
			return u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4;
		};
		return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
	};
	let nid = 1;
	const ids = new WeakMap();
	window.__collect = () => {
		const root = document.querySelector('#final');
		const vw = innerWidth;
		const vh = innerHeight;
		const out = [];
		const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		let n = tw.nextNode();
		while (n) {
			const node = n;
			n = tw.nextNode();
			const txt = node.nodeValue.replace(/\s+/g, ' ').trim();
			const el = node.parentElement;
			if (!txt || !el || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
			const rg = document.createRange();
			rg.selectNodeContents(node);
			const rs = [...rg.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
			if (!rs.length) continue;
			let x0 = 1e9;
			let y0 = 1e9;
			let x1 = -1e9;
			let y1 = -1e9;
			for (const r of rs) {
				x0 = Math.min(x0, r.left);
				y0 = Math.min(y0, r.top);
				x1 = Math.max(x1, r.right);
				y1 = Math.max(y1, r.bottom);
			}
			const cs = getComputedStyle(el);
			let op = 1;
			let blur = 0;
			let hid = false;
			let cx0 = 0;
			let cy0 = 0;
			let cx1 = vw;
			let cy1 = vh;
			for (let p = el; p && p !== document.documentElement; p = p.parentElement) {
				const s = getComputedStyle(p);
				if (s.display === 'none' || s.visibility === 'hidden') hid = true;
				op *= Number.parseFloat(s.opacity);
				const m = /blur\(([\d.]+)px\)/.exec(s.filter || '');
				if (m) blur += Number.parseFloat(m[1]);
				if (p !== root && /(hidden|clip|auto|scroll)/.test(`${s.overflowX} ${s.overflowY}`)) {
					const r = p.getBoundingClientRect();
					cx0 = Math.max(cx0, r.left);
					cy0 = Math.max(cy0, r.top);
					cx1 = Math.min(cx1, r.right);
					cy1 = Math.min(cy1, r.bottom);
				}
			}
			if (hid) continue;
			const area = Math.max(1, (x1 - x0) * (y1 - y0));
			const inter =
				Math.max(0, Math.min(x1, cx1) - Math.max(x0, cx0)) *
				Math.max(0, Math.min(y1, cy1) - Math.max(y0, cy0));
			const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(cs.color) || [
				0, 0, 0, 0, 1,
			];
			const col = [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
			if (!ids.has(el)) ids.set(el, nid++);
			out.push({
				id: ids.get(el),
				txt: txt.slice(0, 70),
				tag: el.tagName.toLowerCase(),
				r: [x0, y0, x1, y1],
				vis: inter / area,
				op,
				blur,
				fs: Number.parseFloat(cs.fontSize),
				fw: cs.fontWeight,
				ff: cs.fontFamily.split(',')[0].replace(/['"]/g, ''),
				col,
				lum: lum(col),
				sec:
					el.closest('[data-sec]')?.dataset.sec ??
					el.closest('[data-buehne]')?.dataset.buehne ??
					'',
			});
		}
		const cs = getComputedStyle(root);
		const v = (k) => Number.parseFloat(cs.getPropertyValue(k));
		const lo = [...document.querySelectorAll('[data-loch]')].map((el) => {
			const r = el.getBoundingClientRect();
			return { art: el.dataset.loch, r: [r.left, r.top, r.right, r.bottom] };
		});
		return {
			y: scrollY,
			vars: {
				p: v('--p'),
				g: v('--g'),
				f: v('--f'),
				e: v('--e'),
				c: [0, 1, 2, 3].map((j) => v(`--c${j}`)),
			},
			loecher: lo,
			vw,
			vh,
			els: out,
		};
	};
};

const browser = await launch();
for (const vp of vpList(a.vp ?? '1440x900@2')) {
	const dir = join(a.out, vp.name);
	mkdirSync(dir, { recursive: true });
	const h = await open(browser, { vp, url: a.url, init: INIT });
	console.log(vp.name, await renderer(h.page));
	let i = 0;
	for (const m of marksOf(a.marks)) {
		await toMark(h, m);
		await sleep(Number(a.settle ?? 900));
		await h.page.evaluate(() => {
			window.__freeze();
			document.documentElement.dataset.shot = 'A';
		});
		const info = await h.page.evaluate(() => window.__collect());
		const tag = `${String(i++).padStart(2, '0')}-${m.replace(/[:.]/g, '_')}`;
		const st = await state(h.page);
		info.mark = m;
		info.dpr = vp.dpr;
		info.P = st.P;
		await h.page.screenshot({ path: join(dir, `${tag}_A.png`) });
		for (const k of ['B', 'C']) {
			await h.page.evaluate((k) => {
				document.documentElement.dataset.shot = k;
			}, k);
			await h.page.screenshot({ path: join(dir, `${tag}_${k}.png`) });
		}
		await h.page.evaluate(() => {
			document.documentElement.dataset.shot = 'A';
			window.__thaw();
		});
		writeFileSync(join(dir, `${tag}.json`), JSON.stringify(info));
	}
	const bad = report(h.log, vp.name);
	await h.ctx.close();
	if (bad) process.exitCode = 1;
}
await browser.close();
console.log(`Ausgabe: ${a.out}`);
