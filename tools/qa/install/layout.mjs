// Layout der Szene in allen Viewports: Abschnittsbild je Tab, Überlauf- und Sichtbarkeitsprüfung (Abnahme I-8).
// node tools/qa/install/layout.mjs --url http://localhost:3122/ --out <dir> [--vp 390x844@3t,1920x1080@1]
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { args, launch, open, report, sheet, sleep, toMark, vpOf } from '../lib.mjs';

const a = args();
mkdirSync(a.out, { recursive: true });
const VPS = (
	a.vp ?? '390x844@3t,360x740@3t,768x1024@2t,844x390@3t,1920x1080@1,2560x1440@1,1440x900@2'
).split(',');
const browser = await launch();
let fehler = 0;
const files = [];
const labels = [];
for (const v of VPS) {
	const vp = vpOf(v);
	const h = await open(browser, { vp, url: a.url ?? 'http://localhost:3122/' });
	await toMark(h, 'installieren:0.02');
	await sleep(700);
	for (const tab of [0, 1, 2]) {
		await h.page.getByRole('tab').nth(tab).click({ force: true });
		await sleep(900);
		const still = await h.page.evaluate(
			(i) => window.__landing.dbg.install.plan(i).sprung[1] + 0.35,
			tab,
		);
		await h.page.evaluate((t) => {
			window.__landing.dbg.install.halte(true);
			window.__landing.dbg.install.setze(t);
		}, still);
		await sleep(250);
		const m = await h.page.evaluate(() => {
			const fr = document.querySelector('[data-ins="frame"]').getBoundingClientRect();
			const sec = document.querySelector('#installieren').getBoundingClientRect();
			const texte = [
				...document.querySelectorAll(
					'#installieren h2, #installieren [role=tab], #installieren [data-istep], #installieren .cta',
				),
			].map((e) => {
				const r = e.getBoundingClientRect();
				return { l: r.left, r: r.right, w: r.width, h: r.height };
			});
			return {
				sw: document.documentElement.scrollWidth,
				cw: document.documentElement.clientWidth,
				fr: { l: fr.left, r: fr.right, w: fr.width, h: fr.height },
				sec: { w: sec.width, h: sec.height },
				ausserhalb: texte.filter((t) => t.l < -0.5 || t.r > innerWidth + 0.5).length,
				kleinTreffer: [
					...document.querySelectorAll('#installieren [role=tab], #installieren .cta'),
				].map((e) => Math.round(e.getBoundingClientRect().height)),
				schritt: [...document.querySelectorAll('#installieren [data-istep] > span:last-child')].map(
					(e) => Math.round(Number.parseFloat(getComputedStyle(e).fontSize)),
				),
				nr: Math.round(
					Number.parseFloat(
						getComputedStyle(document.querySelector('#installieren [data-istep] span')).fontSize,
					),
				),
				titelUmbruch: (() => {
					const h2 = document.querySelector('#installieren h2');
					return Math.round(
						h2.getBoundingClientRect().height /
							Number.parseFloat(getComputedStyle(h2).fontSize) /
							0.95,
					);
				})(),
			};
		});
		const ok = m.sw <= m.cw && m.ausserhalb === 0 && m.fr.l >= -0.5 && m.fr.r <= m.cw + 0.5;
		if (!ok) fehler++;
		console.log(
			`${ok ? 'OK  ' : 'FAIL'} ${v} tab ${tab}: Gerät ${Math.round(m.fr.w)}x${Math.round(m.fr.h)} bei x ${Math.round(m.fr.l)}–${Math.round(m.fr.r)} von ${m.cw}, scrollWidth ${m.sw}, Schrift Schritt ${m.schritt[0]} px, Nr ${m.nr} px, Titelzeilen ${m.titelUmbruch}, Treffer ${m.kleinTreffer.join('/')}`,
		);
		const f = join(a.out, `${vp.name}-tab${tab}.png`);
		await h.page.locator('#installieren').screenshot({ path: f });
		files.push(f);
		labels.push(`${v} tab ${tab}`);
		await h.page.evaluate(() => window.__landing.dbg.install.halte(false));
	}
	report(h.log, v);
	await h.ctx.close();
}
await sheet(files, labels, join(a.out, 'layout-sheet.jpg'), 3, 520);
await browser.close();
console.log(fehler ? `${fehler} Abweichung(en)` : 'alle Viewports in Ordnung');
