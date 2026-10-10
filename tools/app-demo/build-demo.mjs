// Baut public/app-demo/index.html aus den Aufnahmen (demo-crawl, demo-typing, demo-pages).
// Aufruf: DATA=<dir mit crawl-*.json, typing.json, pages.json> node tools/app-demo/build-demo.mjs
// Ergebnis: public/app-demo/index.html (Vorlagen + Modell), app.css (env() der Safe-Area als Variable), Schriften schon vorhanden.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { keyOf } from './demo-lib.mjs';
import { REL } from './demo-flags.mjs';
import { tokenize } from './demo-tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const REPO = join(here, '..', '..');
const DATA = process.env.DATA;
const OUT = join(REPO, 'public/app-demo');
const FLAGS = ['E', 'A', 'P', 'C', 'B', 'V'];
const sha = (s) => createHash('sha1').update(s).digest('hex').slice(0, 10);
const rd = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));

// ------------------------------------------------------------------ Quellen
const crawls = readdirSync(DATA)
	.filter((f) => /^crawl-.+\.json$/.test(f))
	.map((f) => [f.slice(6, -5), rd(f)]);
const typing = existsSync(join(DATA, 'typing.json')) ? rd('typing.json') : { nodes: {}, edges: [] };
const pages = existsSync(join(DATA, 'pages.json')) ? rd('pages.json') : {};
const worldOfCrawl = (name) => (name.startsWith('start') ? '-' : name.replace(/(?<=.)(?=[A-Z])/g, '+'));
const canon = (n) => `${n.route}|${n.steps.join('>')}`;

// ------------------------------------------------------------------ Vorlagen
const T = {}; // "p-<key>" | "o-<key>" -> html
const tpl = (kind, html) => {
	const k = sha(html);
	T[`${kind}-${k}`] ??= html;
	return k;
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const SAI = (s) =>
	s
		.replace(/env\(safe-area-inset-(top|bottom|left|right)\s*,\s*0(?:px)?\)/g, 'var(--sai-$1,0px)')
		.replace(/env\(safe-area-inset-(top|bottom|left|right)\)/g, 'var(--sai-$1)')
	.replace(/url\(fonts\//g, 'url(/fonts/'); // Schriften der Landing (public/fonts)
function clean(html, items, route) {
	if (!html) return '';
	const key = new Map(items.map((it) => [it.i, keyOf(it, items)]));
	let h = html
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/ data-demo-i="(\d+)"/g, (_, i) => (key.has(+i) ? ` data-k="${esc(key.get(+i))}"` : ''))
		.replace(/ (autofocus|data-demo-focus)(="[^"]*")?/g, '');
	// Einklapp-Bereiche: die Aufnahme kann mitten in der Einblendung liegen (inline opacity 0), der Endzustand ist sichtbar
	h = h.replace(/(data-slot="collapsible-panel"[^>]*? style=")([^"]*)"/g, (m, a, v) => `${a}${v.replace(/opacity: 0;/, 'opacity: 1;').replace(/mask-image: [^;]*;/, '')}"`);
	h = h.replace(/ style="([^"]*)"/g, (m, v) => ` style="${SAI(v)}"`); // nur Inline-Stile, Klassennamen müssen zum CSS passen
	return tokenize(h, route);
}

// ------------------------------------------------------------------ Knoten sammeln
/** W[w][id] = { p, o, b, f, e:{key:{t,k,x?,add?,msg?}}, v?, x?, a? } */
const W = { '-': {} };
const OWN = {}; // w -> id -> roh
const addRaw = (w, n, source) => {
	const id = canon(n);
	OWN[w] ??= {};
	OWN[w][id] ??= { ...n, id, source };
	return id;
};
const hashToId = {};
for (const [name, c] of crawls) {
	const w = worldOfCrawl(name);
	for (const n of Object.values(c.nodes)) {
		// Wurzeln fremder Routen (nur durch Klick erreicht, Inhalt evtl. noch nicht geladen) gehören nicht zu diesem Crawl
		if (!n.steps.length && !(n.route in c.rootOf)) hashToId[`${name}:${n.id}`] = canon(n);
		else hashToId[`${name}:${n.id}`] = addRaw(w, n, name);
	}
}
for (const n of Object.values(typing.nodes)) {
	hashToId[`typing:${n.id}`] = addRaw(n.w || '-', n, 'typing');
}

const nodeOut = (w, id, n) => {
	const items = n.items;
	const fk = n.focus != null ? items.find((it) => String(it.i) === String(n.focus)) : null;
	return {
		p: tpl('p', clean(n.page, items, n.route)),
		o: n.over ? tpl('o', clean(n.over, items, n.route)) : null,
		b: n.bodyStyle || '',
		t: /--thumb-action-space/.test(n.htmlStyle || '') ? 1 : 0, // die App hält über Tabbar und FAB Platz frei (--thumb-action-space)
		f: fk ? keyOf(fk, items) : null,
		e: {},
		route: n.route,
	};
};
for (const [w, nodes] of Object.entries(OWN)) {
	W[w] ??= {};
	for (const [id, n] of Object.entries(nodes)) W[w][id] = nodeOut(w, id, n);
}

// Seiten je Route und Welt (hartes Laden, ohne Overlay) für Welten ohne eigenen Knoten
const PG = {};
for (const [k, v] of Object.entries(pages)) PG[k] = tpl('p', clean(v.page, v.items, k.split('|')[0]));

// Seitenvarianten (z. B. "Neu in deiner WG" offen): Seite weicht von der Wurzel der Route ab
for (const [id, n] of Object.entries(W['-'])) {
	const root = W['-'][`${n.route}|`];
	if (root && n.p !== root.p) n.v = true;
}

// ------------------------------------------------------------------ Kanten
const addEdge = (w, from, key, e) => {
	const n = W[w]?.[from];
	if (n) n.e[key] = e;
};
for (const [name, c] of crawls) {
	const w = worldOfCrawl(name);
	for (const e of c.edges) {
		const from = hashToId[`${name}:${e.from}`];
		if (!from) continue;
		if (e.kind === 'error' || e.kind === 'same') continue;
		if (e.kind === 'mutation') {
			addEdge(w, from, e.key, { k: 'm', label: e.label });
			continue;
		}
		const to = hashToId[`${name}:${e.to}`];
		if (!to) continue;
		addEdge(w, from, e.key, { t: to, k: e.kind === 'nav' ? 'n' : e.kind === 'over' ? 'o' : 'p' });
	}
}
for (const e of typing.edges) {
	const fromN = typing.nodes[e.from];
	const from = hashToId[`typing:${e.from}`];
	const to = hashToId[`typing:${e.to}`];
	const w = fromN.w || '-';
	if (e.kind === 'mutation') {
		addEdge(w, from, e.key, { k: 'm', label: e.label, t: to, tw: typing.nodes[e.to].w });
		continue;
	}
	addEdge(w, from, e.key, { t: to, k: e.kind === 'type' ? 'y' : e.kind === 'over' ? 'o' : 'p', x: e.text });
}

// Welten erben die Kanten der Ausgangswelt (gleiche Bedienelemente), eigene Kanten gewinnen
for (const [w, nodes] of Object.entries(W)) {
	if (w === '-') continue;
	for (const [id, n] of Object.entries(nodes)) {
		const base = W['-'][id];
		if (base) n.e = { ...base.e, ...n.e };
	}
}

// ------------------------------------------------------------------ Abläufe (Änderungen der Daten)
const find = (w, rx) => Object.keys(W[w] ?? {}).filter((id) => rx.test(id));
const edgeBy = (w, id, rx) => Object.entries(W[w][id].e).find(([k, e]) => rx.test(k) || rx.test(e.label || ''));
const flows = [];
const msgDialog = []; // [Dialog-Knoten, Zustand mit Meldung]
const mut = (w, id, rx, eff) => {
	const hit = edgeBy(w, id, rx);
	if (!hit) {
		flows.push(`FEHLT ${w} ${id.slice(0, 60)} ${rx}`);
		return;
	}
	W[w][id].e[hit[0]] = { k: 'm', ...hit[1], ...eff };
};
// Verschiebt einen Aufnahmeknoten (Zustand direkt nach einer Änderung) in seine Welt
const transient = (fromW, id, toW, extra) => {
	const n = W[fromW]?.[id];
	if (!n) {
		flows.push(`FEHLT Knoten ${fromW} ${id.slice(0, 80)}`);
		return null;
	}
	const nid = `${id}#${toW}`;
	W[toW] ??= {};
	W[toW][nid] = { ...n, ...extra };
	return nid;
};
const flagsAdd = (w, f) => FLAGS.filter((x) => (w === '-' ? [] : w.split('+')).includes(x) || x === f).join('+');
const rootOf = (route) => `${route}|`;
const R = (id) => id.split('|')[0];

// E: Hafermilch abhaken
mut('-', '/einkauf|', /Hafermilch erledigen/, { t: '/einkauf|', add: 'E' });
// V: Toilettenpapier verbrauchen
mut('-', '/vorraete|', /Toilettenpapier um eins verringern/, { t: '/vorraete|', add: 'V' });
// A: Ausgabe speichern (Formular), Zielzustand mit Meldung
{
	const [saveId] = find('-', /^\/ausgaben\|.*Anteil Lea in Euro@#?0?=12,00>button\|Ausgabe speichern@0$/);
	const form = find('-', /^\/ausgaben\|.*Anteil Lea in Euro@0=12,00$/)[0];
	if (form && saveId) {
		const tid = transient('-', saveId, 'A', { x: rootOf('/ausgaben') });
		delete W['-'][saveId];
		// Ausgleichen direkt nach dem Speichern: Dialog über der Seite mit Meldung (Aufnahme ohne Neuladen)
		const dlgMsg = find('-', /Ausgabe speichern@0>button\|Ausgleichen@0$/)[0];
		if (dlgMsg) {
			const did = transient('-', dlgMsg, 'A', {});
			delete W['-'][dlgMsg];
			W.A[tid].e['button|Ausgleichen@0'] = { t: did, k: 'o' };
			msgDialog.push([did, tid]);
		}
		mut('-', form, /Ausgabe speichern/, { t: tid, add: 'A' });
	} else flows.push('FEHLT Formular-Speichern');
}
// P: Ausgleichen bestätigen
{
	const dlg = find('A', /^\/ausgaben\|button\|Ausgleichen@0$/)[0];
	const doneId = dlg && find('A', /bezahlt eintragen@0$/)[0];
	if (dlg && doneId) {
		const tid = transient('A', doneId, 'A+P', { x: rootOf('/ausgaben') });
		delete W.A[doneId];
		mut('A', dlg, /als bezahlt eintragen/, { t: tid, add: 'P' });
		for (const [did, mid] of msgDialog) {
			W.A[did].e = { ...W.A[dlg].e, 'button|Abbrechen@0': { t: mid, k: 'p' } };
		}
	} else flows.push('FEHLT Ausgleichen');
}
// C: Chat-Antwort senden
{
	const typed = find('-', /^\/chat\|.*Chat-Nachricht@#?\d*=Passt, ich bin auch da\.$|^\/chat\|.*Chat-Nachricht@0=Passt/)[0];
	const sent = find('-', /^\/chat\|.*>button\|Nachricht senden@0$/)[0];
	if (typed && sent) {
		const tid = transient('-', sent, 'C', { x: rootOf('/chat') });
		delete W['-'][sent];
		mut('-', typed, /Nachricht senden/, { t: tid, add: 'C', msg: 'C' });
	} else flows.push('FEHLT Chat');
}
// B: Putzplan erledigen, Zielzustand mit Hinweis (4 s), danach die Seite ohne Hinweis
{
	const dlg = find('-', /^\/putzen\|button\|Als erledigt markieren: Bad putzen@0$/)[0];
	const doneId = find('-', /^\/putzen\|.*>button\|Erledigt bestätigen: Bad putzen@0$/)[0];
	if (dlg && doneId) {
		const tid = transient('-', doneId, 'B', { x: rootOf('/putzen'), a: [4000, rootOf('/putzen')] });
		delete W['-'][doneId];
		mut('-', dlg, /Erledigt bestätigen/, { t: tid, add: 'B' });
	} else flows.push('FEHLT Putzplan');
}

// Eltern: nächster Vorfahr ohne Overlay (Schließen, Abbrechen, Esc und Klick daneben führen dorthin)
const parent = {};
for (const id of Object.keys(W['-'])) {
	const route = R(id);
	const steps = id.slice(route.length + 1);
	if (!steps) continue;
	const s = steps.split('>');
	for (let i = s.length - 1; i >= 0; i--) {
		const pid = `${route}|${s.slice(0, i).join('>')}`;
		if (W['-'][pid] && !W['-'][pid].o) {
			parent[id] = pid;
			break;
		}
	}
}
for (const [did, mid] of msgDialog) parent[did] = mid;
// Schließen-Knöpfe: jedes Overlay hat sie, auch in Welten, in denen es nicht einzeln aufgenommen wurde
for (const [w, nodes] of Object.entries(OWN)) {
	for (const [id, raw] of Object.entries(nodes)) {
		const n = W[w]?.[id];
		if (!n || !raw.over) continue;
		const par = parent[id] ?? rootOf(raw.route);
		parent[id] = par;
		for (const it of raw.items) {
			if (!it.free || !/^(Abbrechen|Schließen|Nicht jetzt|Ausgabe abbrechen)$/.test(it.label)) continue;
			const k = keyOf(it, raw.items);
			if (!n.e[k]) n.e[k] = { t: par, k: 'p' };
		}
	}
}

// ------------------------------------------------------------------ Monatsraster
// Das Raster der Aufnahme (Okt 2026) wird zur Laufzeit auf den heutigen Monat umgerechnet: Zahlen, Beschriftungen,
// heute und Termin-Punkte. Die vier Zellenarten (außerhalb, Monat, heute, Termin) stammen aus der Aufnahme.
const cellsOf = (html) => [...html.matchAll(/<td[^>]*>(<button[\s\S]*?<\/button>)<\/td>/g)].map((m) => m[1]);
const clsOf = (x) => /class="([^"]*)"/.exec(x)?.[1]?.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const gridProtos = (() => {
	const root = Object.values(OWN['-'] ?? {}).find((n) => /^\/kalender\|button\|Monat@0$/.test(n.id));
	if (!root) return null;
	const cells = cellsOf(root.page);
	const sp = (x) => /<span class="([^"]*)"/.exec(x)?.[1]?.replace(/&amp;/g, '&');
	return { out: clsOf(cells[0]), in: clsOf(cells[3]), today: clsOf(cells[8]), ev: clsOf(cells[9]), sp: { out: sp(cells[0]), in: sp(cells[3]), today: sp(cells[8]), ev: sp(cells[9]) }, dot: cells[9].match(/<span aria-hidden="true"[^>]*><\/span>/)[0] };
})();
const gridSpec = (html) => {
	const cells = cellsOf(html);
	const t = cells.findIndex((x) => /aria-current="date"/.test(x));
	const title = /Kalender \{\{MO:(-?\d)\}\}/.exec(html);
	const ev = {};
	cells.forEach((x, i) => {
		if (!/absolute bottom-1/.test(x) || t < 0) return;
		const k = i - t;
		const suf = /aria-label="[^"]*?(?:\}\}|\d{4})(,[^"]*)"/.exec(x)?.[1] ?? '';
		ev[k === 3 ? 'F' : k] = suf;
	});
	return { t, m: title ? +title[1] : 0, ev, keys: cells.map((x) => /data-k="([^"]*)"/.exec(x)?.[1] ?? '') };
};
const withGrid = (h) => {
	const html = T[`p-${h}`];
	if (!html || !/<table role="grid"/.test(html)) return h;
	return tpl('p', html.replace(/<table role="grid"/, `<table data-g="${esc(JSON.stringify(gridSpec(html)))}" role="grid"`));
};
for (const nodes of Object.values(W)) for (const n of Object.values(nodes)) n.p = withGrid(n.p);
for (const k of Object.keys(PG)) PG[k] = withGrid(PG[k]);

// ------------------------------------------------------------------ Referenzindex (Nummern der Aufnahmen)
const ref = {};
const pick = (nn, w, rx) => {
	const id = find(w, rx)[0] ?? find('-', rx)[0];
	if (id) ref[nn] = [w, id];
	else flows.push(`REF ${nn} fehlt`);
};
const ROOTS = { '01': '/', '03': '/putzen', '04': '/einkauf', '05': '/vorraete', '06': '/ausgaben', '07': '/abos', '08': '/pinnwand', '09': '/chat', '10': '/kalender', 59: '/einstellungen' };
for (const [nn, r] of Object.entries(ROOTS)) ref[nn] = ['-', rootOf(r)];
pick('02', '-', /^\/\|button\|Neu in deiner WG@0$/);
pick('11', '-', /^\/putzen\|button\|Als erledigt markieren: Bad putzen@0$/);
pick('12', '-', /^\/einkauf\|type:input\|Artikel-Name@0=/);
pick('13', '-', /^\/einkauf\|button\|Artikelaktionen: Hafermilch@0$/);
pick('14', '-', /^\/vorraete\|button\|Schnell nachfüllen@0$/);
pick('15', '-', /^\/ausgaben\|button\|Ausgabe hinzufügen@0$/);
pick('16', '-', /^\/ausgaben\|.*Anteil Lea in Euro@0=12,00$/);
pick('17', '-', /^\/pinnwand\|button\|Beitrag hinzufügen@0$/);
pick('18', '-', /^\/chat\|button\|Aktionen für Nachricht von Lea[^>]*$/);
pick('19', '-', /^\/kalender\|button\|Monat@0$/);
pick('20', '-', /^\/kalender\|button\|Termin hinzufügen@0$/);
pick('21', 'E', /^\/einkauf\|$/);
pick('22', 'E', /^\/einkauf\|summary\|Erledigt \(#\)@0$/);
pick('23', 'E', /^\/\|$/);
pick('24', 'A', /Ausgabe speichern@0#A$/);
pick('26', 'A', /^\/ausgaben\|$/);
pick('27', 'A', /^\/\|$/);
pick('28', '-', /^\/chat\|.*>div\|Antworten@0$/);
pick('29', '-', /^\/chat\|.*Chat-Nachricht@0=Passt/);
pick('30', 'C', /#C$/);
pick('31', 'B', /#B$/);
pick('32', 'B', /^\/\|$/);
pick('33', '-', /^\/pinnwand\|button\|Antworten anzeigen/);
pick('54', 'E', /^\/einkauf\|a\|Ausgabe erfassen@0$/);
pick('55', 'A', /Ausgabe speichern@0>button\|Ausgleichen@0#A$/);
pick('56', '-', /^\/putzen\|button\|So wird verteilt@0$/);
pick('57', 'V', /^\/vorraete\|$/);
pick('58', '-', /^\/ausgaben\|button\|Aktionen für Pizzaabend@0$/);
pick('60', '-', /^\/vorraete\|button\|Vorrat hinzufügen@0$/);
pick('61', '-', /^\/putzen\|button\|Aufgabenaktionen: Bad putzen@0$/);
pick('62', '-', /^\/putzen\|button\|Putzaufgabe hinzufügen@0$/);
pick('63', '-', /^\/abos\|button\|JODetails/);
pick('64', 'A+P', /#A\+P$/);

// ------------------------------------------------------------------ Ausgabe
const model = { flags: FLAGS, rel: REL, start: '/|', nodes: W, pg: PG, parent, ref, grid: gridProtos };
const used = Object.values(W).flatMap((nodes) => Object.values(nodes)).flatMap((n) => [`p-${n.p}`, n.o ? `o-${n.o}` : null]);
for (const k of Object.keys(PG)) used.push(`p-${PG[k]}`);
const usedSet = new Set(used.filter(Boolean));
// Wörterbuch: lange class-Werte und Icons (SVG), die mehrfach vorkommen, stehen einmal im Modell (demo.js setzt sie wieder ein)
const used2 = Object.entries(T).filter(([k]) => usedSet.has(k));
const count = (rx, pick) => {
	const m = new Map();
	for (const [, h] of used2) for (const x of h.matchAll(rx)) m.set(pick(x), (m.get(pick(x)) ?? 0) + 1);
	return [...m.entries()].filter(([v, n]) => n >= 2 && v.length > 24).map(([v]) => v);
};
const CLS = count(/ class="([^"]*)"/g, (x) => x[1]);
const SVG = count(/<svg\b[\s\S]*?<\/svg>/g, (x) => x[0]);
const clsIdx = new Map(CLS.map((v, i) => [v, i]));
const svgIdx = new Map(SVG.map((v, i) => [v, i]));
model.c = CLS;
model.s = SVG;
const pack = (h) =>
	h
		.replace(/<svg\b[\s\S]*?<\/svg>/g, (m) => (svgIdx.has(m) ? `<x-s i="${svgIdx.get(m)}"></x-s>` : m))
		.replace(/ class="([^"]*)"/g, (m, v) => (clsIdx.has(v) ? ` class="~${clsIdx.get(v)}"` : m));
const tmpl = used2.map(([k, h]) => `<script type="text/plain" id="t-${k}">${pack(h)}</script>`).join('\n');
const slim = JSON.stringify(model, (k, v) => (k === 'route' ? undefined : v));
const html = `<!doctype html>
<html lang="de" class="__variable_a918ff __variable_2d7d99 __variable_ae46ea" style="--app-header-height: 40px; --app-nav-height: 57.1875px;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0a0a0a">
<meta name="robots" content="noindex">
<title>ManaWG</title>
<link rel="stylesheet" href="app.css">
<style>
:root{--sai-top:47px;--sai-bottom:34px;--sai-left:0px;--sai-right:0px}
html,body{overflow:hidden}
html.framed,html.framed *{cursor:none!important;-webkit-user-select:none;user-select:none}
html.framed{-webkit-tap-highlight-color:transparent;touch-action:none}
.demo-over{position:fixed;inset:0;z-index:60}
.demo-still *{animation:none!important;transition:none!important}
</style>
</head>
<body>
<div id="app"></div>
<div id="layer"></div>
<script id="model" type="application/json">${slim.replace(/</g, '\\u003c')}</script>
${tmpl}
<script src="demo.js"></script>
</body>
</html>
`;
writeFileSync(join(OUT, 'index.html'), html);

// app.css: env(safe-area-inset-*) in Werten als Variable (im iframe ist env() immer 0), Selektoren bleiben
const css = readFileSync(join(here, 'app.css'), 'utf8')
	.replace(/env\(safe-area-inset-(top|bottom|left|right)\s*,\s*0(?:px)?\)/g, 'var(--sai-$1,0px)')
	.replace(/env\(safe-area-inset-(top|bottom|left|right)\)/g, 'var(--sai-$1)')
	.replace(/url\(fonts\//g, 'url(/fonts/'); // Schriften der Landing (public/fonts)
writeFileSync(join(OUT, 'app.css'), css);
console.log('Vorlagen', usedSet.size, 'Seiten je Welt', Object.keys(PG).length, 'Knoten', Object.values(W).reduce((a, n) => a + Object.keys(n).length, 0), 'index.html', Math.round(html.length / 1024), 'kB');
console.log(flows.join('\n'));
