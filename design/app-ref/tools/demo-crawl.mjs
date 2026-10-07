// Stufe 2 der Aufnahme: Alle Bedienelemente der echten App im Ausgangszustand der Landing anklicken, und zwar in
// jedem erreichten Overlay weiter (Tiefe MAXD), und festhalten, was passiert (Overlay, Seitenwechsel, Änderung der Daten).
// Zustand = Route + Klickfolge ab dem frischen Laden der Route. Ergebnis: OUT/crawl-${NAME}.json (Knoten mit HTML, Kanten).
// Änderungen der Daten (POST) werden nur gemeldet, nicht verfolgt (dafür gibt es die Abläufe in demo-flows.mjs).
// Aufruf: OUT=<dir> node design/app-ref/tools/demo-crawl.mjs   (App :3241 und Demo-Proxy :4241 laufen, siehe REF.md)
import { mkdirSync, writeFileSync } from 'node:fs';
import { applyFlags } from './demo-flags.mjs';
import { WG, fresh, keyOf, launch, open, readStable } from './demo-lib.mjs';

const OUT = process.env.OUT || './out';
const MAXD = Number(process.env.MAXD || 2);
const FLAGS = (process.env.FLAGS || '').split(',').filter(Boolean); // Welt: schon erledigte Abläufe (E,A,P,C,B,V)
const NOEXP = process.env.NOEXPAND ? new RegExp(process.env.NOEXPAND) : null; // Klicks, deren Ergebnis nicht weiter verfolgt wird (z. B. 35 Tageszellen)
const ONLY = process.env.ONLYKEYS ? new RegExp(process.env.ONLYKEYS) : null; // nur diese Elemente anklicken (Welten nach einem Ablauf)
const NAME = process.env.NAME || (FLAGS.join('') || 'start');
const ROUTES = (process.env.ROUTES || '/,/putzen,/einkauf,/vorraete,/ausgaben,/abos,/pinnwand,/chat,/kalender,/einstellungen').split(',');
mkdirSync(OUT, { recursive: true });

const MUT_IGNORE = /\/chat\/read|posthog|sentry|vercel/;

const b = await launch();
let c = await fresh(b, null);
const reset = async () => {
	await c.pg.goto(`${WG.replace(/\/wg\/.*/, '')}/demo-reset`);
	await applyFlags(c.pg, FLAGS);
};
await applyFlags(c.pg, FLAGS);

const nodes = {}; // id -> Knoten
const edges = []; // { from, key, label, to, kind }
const rootOf = {}; // route -> id
const warn = [];
const seen = new Map(); // state hash -> id

const idOf = (s) => `${s.pageId}/${s.overId || '-'}`;

async function openRoute(route) {
	await open(c.pg, route);
}
async function clickKey(key) {
	const st = await readStable(c.pg);
	const it = st.items.find((x) => keyOf(x, st.items) === key);
	if (!it) throw new Error(`Element nicht gefunden: ${key}`);
	await c.pg.locator(`[data-demo-i="${it.i}"]`).first().click({ timeout: 6000 });
	await c.pg.waitForTimeout(900);
}
async function replay(route, steps) {
	await openRoute(route);
	for (const k of steps) await clickKey(k);
}

const queue = [];
function addNode(route, steps, st) {
	const id = idOf(st);
	if (nodes[id]) return { id, isNew: false };
	nodes[id] = { id, route, steps, depth: steps.length, path: st.snap.path, page: st.snap.page, over: st.snap.over, bodyStyle: st.snap.bodyStyle, htmlStyle: st.snap.htmlStyle, items: st.items, focus: st.snap.focus };
	return { id, isNew: true };
}

for (const r of ROUTES) {
	await openRoute(r);
	const st = await readStable(c.pg);
	const { id } = addNode(r, [], st);
	rootOf[r] = id;
	if (!queue.some((q) => q.id === id)) queue.push({ id, route: r, steps: [] });
	console.log('root', r, id, 'Elemente', st.items.length);
}

while (queue.length) {
	const { id, route, steps } = queue.shift();
	const node = nodes[id];
	const todo = node.items.filter((it) => it.free && !it.disabled && !['input', 'textarea', 'select'].includes(it.tag) && (!ONLY || ONLY.test(`${it.tag}|${it.label}`)));
	console.log(`-- ${id} ${route} [${steps.join(' > ')}] ${todo.length} Elemente`);
	for (const it of todo) {
		const key = keyOf(it, node.items);
		try {
			c.mut.length = 0;
			await replay(route, steps);
			c.mut.length = 0;
			const before = c.pg.url();
			await clickKey(key);
			const muts = c.mut.filter((m) => !MUT_IGNORE.test(m));
			const st = await readStable(c.pg);
			const rid = idOf(st);
			if (muts.length) {
				edges.push({ from: id, key, label: it.label, to: rid, kind: 'mutation', req: muts.slice(0, 4) });
				console.log('   MUT', it.label, '->', rid, muts[0]);
				await reset();
				continue;
			}
			const nav = st.snap.path !== node.path && !st.snap.over;
			if (nav) {
				const target = ROUTES.find((r) => (r === '/' ? '/' : r) === st.snap.path) ?? st.snap.path;
				const root = rootOf[target];
				if (root && root !== rid) warn.push(`Navigation ${it.label}: ${rid} != Wurzel ${target} ${root}`);
				edges.push({ from: id, key, label: it.label, to: root || rid, kind: 'nav', navId: rid });
				console.log('   NAV', it.label, '->', st.snap.path, rid === root ? '(gleich)' : '(Abweichung)');
				if (!root && !nodes[rid]) addNode(target, [], st);
				continue;
			}
			if (rid === id) {
				edges.push({ from: id, key, label: it.label, to: id, kind: 'same' });
				console.log('   same', it.label);
				continue;
			}
			const nsteps = [...steps, key];
			const { id: nid, isNew } = addNode(route, nsteps, st);
			edges.push({ from: id, key, label: it.label, to: nid, kind: st.snap.over ? 'over' : 'page' });
			console.log('   ', st.snap.over ? 'OVER' : 'PAGE', it.label, '->', nid, isNew ? 'neu' : '');
			if (isNew && nsteps.length < MAXD && !(NOEXP && NOEXP.test(key))) queue.push({ id: nid, route, steps: nsteps });
		} catch (e) {
			edges.push({ from: id, key, label: it.label, kind: 'error', msg: e.message.split('\n')[0].slice(0, 120) });
			console.log('   FEHLER', it.label, e.message.split('\n')[0].slice(0, 120));
		}
		writeFileSync(`${OUT}/crawl-${NAME}.json`, JSON.stringify({ nodes, edges, rootOf, warn }));
	}
}
writeFileSync(`${OUT}/crawl-${NAME}.json`, JSON.stringify({ nodes, edges, rootOf, warn }));
console.log('Knoten', Object.keys(nodes).length, 'Kanten', edges.length, 'Warnungen', warn.length);
console.log(warn.join('\n'));
await b.close();
