'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from './dc';
import { art } from './engine/art';
import { hero } from './engine/hero';
import { install } from './engine/install';
import { Logic } from './engine/logic';
import { Ende, HeroTitel, Hinweise, Kopf, Lader, Raeume } from './overlays';
import {
	Bereiche,
	Finale,
	Flut,
	Fragen,
	Fusszeile,
	Installieren,
	Intro,
	Koerper,
	SoGehts,
	Tiefe,
} from './sections';

const ROOT =
	'position:fixed;left:0;top:0;width:1280px;height:800px;overflow:hidden;background:#0A0A0A;color:#FAFAFA;font-family:Inter,system-ui,sans-serif;transform-origin:0 0;transform:translate(var(--x,0px),var(--y,0px)) scale(var(--k,1))';
const SCROLLER = 'position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none';

export function Landing() {
	// inst ist `any`: die Engine ist untypisiertes JS, Felder (raf, sc, fa, …) entstehen zur Laufzeit
	// biome-ignore lint/suspicious/noExplicitAny: siehe oben
	const inst = useRef<any>(null);
	if (!inst.current) {
		inst.current = new Logic();
		inst.current.props = { tour: false };
	}
	const [, rerender] = useState(inst.current.state);
	// biome-ignore lint/suspicious/noExplicitAny: Semantik 1:1 aus support.js DCLogic.setState
	inst.current.setState = (p: any) => {
		const i = inst.current;
		const n = typeof p === 'function' ? p(i.state) : p;
		i.state = { ...i.state, ...n };
		rerender(i.state);
	};
	const v = inst.current.renderVals();
	const st = inst.current.state;

	const rootRef = useRef<HTMLDivElement>(null);
	const scRef = useRef<HTMLElement>(null);
	const sizerRef = useRef<HTMLDivElement>(null);
	const fitRef = useRef<() => void>(() => {});
	const kRef = useRef(1);

	// Dokument-Scroll treibt scrollTop des Rahmens (Zeitachse der Vorlage), Zwei-Wege-Abgleich.
	useEffect(() => {
		const root = rootRef.current as HTMLDivElement;
		const sc = scRef.current as HTMLElement;
		const sizer = sizerRef.current as HTMLDivElement;
		const d = document.documentElement;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)');
		const fit = () => {
			const vw = d.clientWidth;
			const vh = window.innerHeight;
			const k = Math.min(vw / 1280, vh / 800);
			kRef.current = k;
			d.style.setProperty('--k', String(k));
			d.style.setProperty('--x', `${(vw - 1280 * k) / 2}px`);
			d.style.setProperty('--y', `${(vh - 800 * k) / 2}px`);
			sizer.style.height = `${(sc.scrollHeight - 800) * k + vh}px`;
			sc.scrollTop = window.scrollY / k;
		};
		fitRef.current = fit;
		const onWin = () => {
			const t = window.scrollY / kRef.current;
			if (Math.abs(sc.scrollTop - t) > 1) sc.scrollTop = t;
		};
		const onSc = () => {
			if (Math.abs(sc.scrollTop - window.scrollY / kRef.current) > 1)
				window.scrollTo(0, sc.scrollTop * kRef.current);
		};
		// Sprunglinks: go() der Vorlage rechnet mit ungeskalierten Rects, hier um k korrigiert.
		const onGo = (e: MouseEvent) => {
			const a = (e.target as Element).closest?.('a[data-go]');
			if (!a) return;
			e.preventDefault();
			e.stopPropagation();
			const tg = sc.querySelector(`[data-sec="${a.getAttribute('data-go')}"]`);
			if (!tg) return;
			const y =
				(tg.getBoundingClientRect().top - sc.getBoundingClientRect().top) / kRef.current +
				sc.scrollTop -
				110;
			sc.scrollTo({ top: y, behavior: reduce.matches ? 'auto' : 'smooth' });
		};
		const st0 = sc.scrollTop;
		history.scrollRestoration = 'manual';
		fit();
		sc.scrollTop = st0;
		window.scrollTo(0, st0 * kRef.current);
		window.addEventListener('resize', fit);
		window.addEventListener('scroll', onWin, { passive: true });
		sc.addEventListener('scroll', onSc, { passive: true });
		root.addEventListener('click', onGo, true);

		const i = inst.current;
		const loop = (hero as unknown as (this: unknown) => () => void).call(i);
		art.call(i);
		install.call(i);
		loop();
		return () => {
			window.removeEventListener('resize', fit);
			window.removeEventListener('scroll', onWin);
			sc.removeEventListener('scroll', onSc);
			root.removeEventListener('click', onGo, true);
			i.componentWillUnmount();
		};
	}, []);

	const open = v.faqs.findIndex((q: { open: boolean }) => q.open);
	// biome-ignore lint/correctness/useExhaustiveDependencies: nach jedem FAQ-Wechsel Höhe neu messen
	useEffect(() => {
		fitRef.current();
	}, [open]);

	return (
		<div id="final">
			<div data-sizer ref={sizerRef} aria-hidden="true" />
			<div data-root ref={rootRef} style={css(ROOT)}>
				<main id="inhalt" data-scroller ref={scRef} style={css(SCROLLER)}>
					<Intro />
					<Flut />
					<SoGehts />
					<Koerper />
					<Tiefe />
					<Bereiche v={v} />
					<Installieren v={v} st={st} />
					<Fragen v={v} />
					<Finale />
					<Fusszeile />
				</main>
				<HeroTitel />
				<Kopf />
				<Raeume />
				<Hinweise />
				<Lader />
				<Ende v={v} st={st} />
			</div>
		</div>
	);
}
