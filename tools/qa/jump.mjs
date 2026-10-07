// Sprungtests (PLAN-V2 Abnahme 6): nach jedem Sprung ist nichts aus der Intro stehen geblieben.
//   node tools/qa/jump.mjs --url http://localhost:3120/ --out <dir>
// Fälle: Taste Ende aus intro:0.5/0.8/0.97, Deep Links, erster Tab, Leertaste 8x (60 ms) ab intro:0.85,
// Rad mit 6000/9375/18000/36000 px/s von intro:0.8 bis funktionen:0.3, Touch-Wisch 1500..12000 px/s (390x844@3t) ab intro:0.9.
// Prüfgrößen: Ende-Ebene, Raumkarten, Hero-Titel, Skip-Link unsichtbar und nicht bedienbar, --e = 1, --c0..3 = 0, data-phase = nach.
import { args, launch, open, report, shot, sleep, state, toMark, vpOf, yOf } from './lib.mjs';

const a = args();
let bad = 0;
let n = 0;

/** Läuft im Browser: Zustand der Intro-Reste. */
function reste() {
	const eff = (el) => {
		let o = 1;
		for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
			const cs = getComputedStyle(e);
			if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
			o *= Number(cs.opacity);
		}
		return o;
	};
	// Die letzten Pixel der Bühne (Ankerziel "Intro überspringen" liegt 14 px darüber, wie im Entwurf) zählen nicht.
	const sichtbar = (el) => {
		const r = el.getBoundingClientRect();
		return r.bottom > 20 && r.top < innerHeight && eff(el) > 0.02;
	};
	const cs = getComputedStyle(document.getElementById('final'));
	const v = (k) => Number(cs.getPropertyValue(k));
	const o = { probs: [] };
	o.e = v('--e');
	o.c = [0, 1, 2, 3].map((j) => v(`--c${j}`));
	o.phase = document.getElementById('final').dataset.phase;
	if (o.phase !== 'nach') o.probs.push(`data-phase ${o.phase}`);
	if (o.e !== 1) o.probs.push(`--e ${o.e}`);
	if (o.c.some((x) => x !== 0)) o.probs.push(`--c ${o.c}`);
	const ende = document.querySelector('[data-ende]');
	if (ende && sichtbar(ende)) o.probs.push('Ende-Ebene sichtbar');
	for (const el of document.querySelectorAll('[data-cta]'))
		if (!el.inert && getComputedStyle(el).pointerEvents !== 'none' && sichtbar(el))
			o.probs.push('CTA der Ende-Ebene bedienbar');
	const h1 = document.querySelector('h1');
	if (h1 && sichtbar(h1)) o.probs.push('Hero-Titel sichtbar');
	const hinweis = document.querySelector('[data-loch="hinweis"]');
	if (hinweis && (eff(hinweis) > 0.02 || !hinweis.inert))
		o.probs.push(`Skip-Link opacity ${eff(hinweis).toFixed(2)} inert ${hinweis.inert}`);
	for (const el of document.querySelectorAll('[data-safe] > :not(:first-child)'))
		if (sichtbar(el) && eff(el) > 0.02) o.probs.push('Raumkarten sichtbar');
	const bd = document.querySelector('[data-buehne="intro"]').getBoundingClientRect();
	if (bd.bottom > 20) o.probs.push(`Bühne noch im Bild (Unterkante ${Math.round(bd.bottom)})`);
	return o;
}

async function pruefe(h, name) {
	await sleep(1200);
	const o = await h.page.evaluate(reste);
	const st = await state(h.page);
	const ok = o.probs.length === 0;
	n++;
	if (!ok) bad++;
	console.log(
		`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(46)} y ${st.y} ${ok ? '' : o.probs.join(' | ')}`,
	);
	if (!ok || a.shots) await shot(h, `jump-${n}-${name.replace(/\W+/g, '_')}`, { out: a.out });
}

const browser = await launch();
const nvp = vpOf('1440x900@1');
const frisch = async (vp = nvp, url = a.url) => open(browser, { vp, url });

// Taste Ende
for (const P of [0.5, 0.8, 0.97]) {
	const h = await frisch();
	await toMark(h, `intro:${P}`);
	await h.page.keyboard.press('End');
	await pruefe(h, `Taste Ende aus intro:${P}`);
	bad += report(h.log, `Ende ${P}`);
	await h.ctx.close();
}
// Deep Links (wie Neuladen mit Anker)
for (const id of ['so-gehts', 'bereiche', 'installieren', 'fragen']) {
	const h = await frisch(nvp, `${a.url.replace(/#.*/, '')}#${id}`);
	const nach = await h.page.evaluate((id) => {
		const el = document.getElementById(id);
		const smt = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
		return {
			soll: Math.round(el.getBoundingClientRect().top + scrollY - smt),
			ist: Math.round(scrollY),
		};
	}, id);
	const ok = Math.abs(nach.soll - nach.ist) <= 4;
	n++;
	if (!ok) bad++;
	console.log(`${ok ? 'OK  ' : 'FAIL'} Deep Link #${id}: scrollY ${nach.ist}, Ziel ${nach.soll}`);
	await pruefe(h, `Deep Link #${id}`);
	await h.ctx.close();
}
// Erster Tab nach dem Laden
{
	const h = await frisch();
	await h.page.keyboard.press('Tab');
	const f = await h.page.evaluate(() => ({
		y: scrollY,
		el: document.activeElement?.textContent?.trim().slice(0, 30),
		phase: document.getElementById('final').dataset.phase,
	}));
	const ok = f.y < 2 && f.phase === 'intro';
	n++;
	if (!ok) bad++;
	console.log(
		`${ok ? 'OK  ' : 'FAIL'} erster Tab: Fokus "${f.el}", scrollY ${f.y}, phase ${f.phase}`,
	);
	await h.ctx.close();
}
// Leertaste 8x
{
	const h = await frisch();
	await toMark(h, 'intro:0.85');
	await h.page.mouse.move(700, 450);
	for (let i = 0; i < 8; i++) {
		await h.page.keyboard.press('Space');
		await sleep(60);
	}
	await sleep(1500);
	const st = await state(h.page);
	console.log(`Leertaste 8x: y ${st.y} phase ${st.phase}`);
	// 8 Seiten laufen über die Intro hinaus, wenn das Ende erreicht wird
	for (let i = 0; i < 10 && (await state(h.page)).phase !== 'nach'; i++) {
		await h.page.keyboard.press('Space');
		await sleep(400);
	}
	await h.page.keyboard.press('End');
	await pruefe(h, 'Leertaste 8x ab intro:0.85, dann Ende');
	await h.ctx.close();
}
// Rad mit Geschwindigkeit
for (const v of [6000, 9375, 18000, 36000]) {
	const h = await frisch();
	await toMark(h, 'intro:0.8');
	const ziel = await yOf(h.page, 'funktionen:0.3');
	await h.page.mouse.move(720, 450);
	const step = 120;
	const pause = Math.max(1, Math.round((step / v) * 1000));
	let y = await h.page.evaluate(() => scrollY);
	for (let g = 0; g < 400 && y < ziel - 2; g++) {
		await h.page.mouse.wheel(0, Math.min(step, ziel - y));
		await sleep(pause);
		y = await h.page.evaluate(() => scrollY);
	}
	await pruefe(h, `Rad ${v} px/s von intro:0.8`);
	await h.ctx.close();
}
// Touch-Wisch
for (const v of [1500, 3000, 6000, 12000]) {
	const h = await frisch(vpOf('390x844@3t'));
	await toMark(h, 'intro:0.9');
	const von = await h.page.evaluate(() => scrollY);
	const ziel = await yOf(h.page, 'funktionen:0.3');
	await h.cdp.send('Input.synthesizeScrollGesture', {
		x: 195,
		y: 760,
		yDistance: -(ziel - von),
		speed: v,
		gestureSourceType: 'touch',
		repeatCount: 0,
	});
	await pruefe(h, `Touch-Wisch ${v} px/s ab intro:0.9`);
	await h.ctx.close();
}
await browser.close();
console.log(bad ? `GESAMT: ${bad} Fehlschläge von ${n}` : `GESAMT: 0 Fehlschläge von ${n}`);
process.exit(bad ? 1 : 0);
