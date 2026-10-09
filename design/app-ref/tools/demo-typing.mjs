// Stufe 4 der Aufnahme: Szenarien mit Eingaben (die der Crawl überspringt): Zustände vor und nach jedem Schritt.
// Ein Szenario ist eine Folge von Schritten ab dem frischen Laden einer Route: { click: /Label/ } oder
// { type: /Label/, text: '…' }. Jeder Zwischenzustand wird als Knoten (Format wie demo-crawl.mjs) gespeichert.
// Schritte mit Änderung der Daten (POST) werden als 'mutation' markiert und danach nicht weiter verfolgt.
// Aufruf: OUT=<dir> node design/app-ref/tools/demo-typing.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { applyFlags } from './demo-flags.mjs';
import { fresh, keyOf, launch, open, readStable } from './demo-lib.mjs';

const OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });

const SC = [
	{
		name: 'ausgabe-formular',
		route: '/ausgaben',
		steps: [
			{ click: /^Ausgabe hinzufügen$/ },
			{ type: /^Beschreibung$|z\. B\. Wocheneinkauf/, text: 'Kinoabend' },
			{ type: /^Betrag$|^0,00$/, text: '24,00' },
			{ click: /^Aufteilung: Manuell$/ },
			{ type: /^Anteil Jona in Euro$/, text: '12,00' },
			{ type: /^Anteil Lea in Euro$/, text: '12,00' },
			{ click: /^Ausgabe speichern$/ },
		],
	},
	{
		name: 'ausgabe-ausgleichen',
		route: '/ausgaben',
		steps: [
			{ click: /^Ausgabe hinzufügen$/ },
			{ type: /^Beschreibung$|z\. B\. Wocheneinkauf/, text: 'Kinoabend' },
			{ type: /^Betrag$|^0,00$/, text: '24,00' },
			{ click: /^Aufteilung: Manuell$/ },
			{ type: /^Anteil Jona in Euro$/, text: '12,00' },
			{ type: /^Anteil Lea in Euro$/, text: '12,00' },
			{ click: /^Ausgabe speichern$/, cont: true },
			{ click: /^Ausgleichen$/ },
		],
	},
	{
		name: 'chat-antwort',
		route: '/chat',
		steps: [
			{ click: /Nachricht von Lea: Bin um acht/ },
			{ click: /^Antworten$/ },
			{ type: /Chat-Nachricht/, text: 'Passt, ich bin auch da.' },
			{ click: /^Nachricht senden$/ },
		],
	},
	{
		name: 'putzplan-erledigen',
		route: '/putzen',
		steps: [{ click: /Als erledigt markieren: Bad putzen/ }, { click: /^Erledigt bestätigen/ }],
	},
	{
		name: 'ausgleichen',
		route: '/ausgaben',
		flags: ['A'],
		steps: [{ click: /^Ausgleichen$/ }, { click: /als bezahlt eintragen/ }],
	},
	{
		name: 'einkauf-abhaken',
		route: '/einkauf',
		steps: [{ click: /Hafermilch erledigen/ }, { click: /^Erledigt/ }],
	},
	{
		name: 'einkauf-eingabe',
		route: '/einkauf',
		steps: [{ type: /Artikel-Name/, text: '2 Hafermilch' }],
	},
];

const b = await launch();
const prior = existsSync(`${OUT}/typing.json`) && !process.env.FRESH ? JSON.parse(readFileSync(`${OUT}/typing.json`, 'utf8')) : { nodes: {}, edges: [] };
const nodes = prior.nodes;
const only = (process.env.ONLY || '').split(',').filter(Boolean);
const edges = prior.edges.filter((e) => !only.length || !SC.some((sc) => only.includes(sc.name) && e.from.includes(`~${sc.route}|`) && false));
const MUT = /\/chat\/read|posthog|sentry|vercel/;

for (const sc of SC) {
	if (only.length && !only.includes(sc.name)) continue;
	const c = await fresh(b, null);
	const w = (sc.flags || []).join('+') || '-';
	await applyFlags(c.pg, sc.flags || []);
	await open(c.pg, sc.route);
	let st = await readStable(c.pg);
	const steps = [];
	let prev = `${w}~${sc.route}|`;
	nodes[prev] ??= { id: prev, w, route: sc.route, steps: [], page: st.snap.page, over: st.snap.over, bodyStyle: st.snap.bodyStyle, htmlStyle: st.snap.htmlStyle, items: st.items, focus: st.snap.focus, path: st.snap.path };
	for (const step of sc.steps) {
		const rx = step.click || step.type;
		const it = st.items.find((x) => x.free && rx.test(x.label));
		if (!it) {
			console.log('FEHLT', sc.name, String(rx));
			break;
		}
		const key = keyOf(it, st.items);
		const loc = c.pg.locator(`[data-demo-i="${it.i}"]`).first();
		c.mut.length = 0;
		if (step.type) {
			await loc.click({ timeout: 6000 });
			await loc.fill(step.text);
		} else await loc.click({ timeout: 6000 });
		await c.pg.waitForTimeout(1100);
		const muts = c.mut.filter((m) => !MUT.test(m));
		if (muts.length) {
			await c.pg.waitForLoadState('networkidle').catch(() => {});
			await c.pg.waitForTimeout(1400);
		}
		st = await readStable(c.pg);
		steps.push(step.type ? `type:${key}=${step.text}` : key);
		const id = `${w}~${sc.route}|${steps.join('>')}`;
		nodes[id] = { id, w, route: sc.route, steps: [...steps], page: st.snap.page, over: st.snap.over, bodyStyle: st.snap.bodyStyle, htmlStyle: st.snap.htmlStyle, items: st.items, focus: st.snap.focus, path: st.snap.path };
		edges.push({ from: prev, key: key, label: it.label, to: id, kind: muts.length ? 'mutation' : step.type ? 'type' : st.snap.over ? 'over' : 'page', text: step.text, req: muts.slice(0, 3) });
		console.log(sc.name, step.type ? 'TYPE' : 'CLICK', it.label, '->', id.slice(0, 90), muts.length ? `MUT ${muts[0]}` : '');
		prev = id;
		if (muts.length && !step.cont) break;
	}
	await c.ctx.close();
	writeFileSync(`${OUT}/typing.json`, JSON.stringify({ nodes, edges }));
}
await b.close();
