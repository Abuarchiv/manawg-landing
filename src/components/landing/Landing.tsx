'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/locale';
import './landing.css';
import { loop, modeOf, qa, setMode, start } from './core/loop';
import { initScroll, sectionBox } from './core/scroll';
import { DictProvider, useDict } from './dict';
import { Depth } from './scenes/depth/Depth';
import { Faq } from './scenes/faq/Faq';
import { Finale } from './scenes/finale/Finale';
import { Footer } from './scenes/footer/Footer';
import { HowItWorks } from './scenes/how-it-works/HowItWorks';
import { Intro } from './scenes/intro/Intro';
import { live } from './scenes/intro/stage';
import { Header } from './shell/Header';
import { HeaderMask } from './shell/HeaderMask';
import { Hints } from './shell/Hints';
import { Loader } from './shell/Loader';

// Root of the landing: header and hints are fixed to the window, the content follows in the normal
// document flow, the loader comes last. Document scroll, no scaled stage. Scenes register themselves
// with the loop (core/loop.ts); the intro stage hangs off the timeline (scenes/intro).

declare global {
	interface Window {
		__landing?: Record<string, unknown> | undefined;
	}
}

// Read-only hook for the QA tools (?qa=1); does not affect behaviour.
function installQaHook(root: HTMLElement) {
	window.__landing = {
		// biome-ignore lint/correctness/noComponentHookFactories: P is the scroll progress read by the QA tools, not a component
		P: () => live.stage?.state.P ?? 0,
		s: () => live.stage?.state.s ?? 0,
		phase: () => root.dataset.phase ?? '',
		yForP: (P: number) => live.stage?.yForP(P) ?? 0,
		section: (id: string) => sectionBox(id),
		dbg: qa,
		get ready() {
			return live.stage?.state.ready ?? false;
		},
	};
}

function LandingInner() {
	const dict = useDict();
	useEffect(() => {
		const root = document.getElementById('final') as HTMLElement;
		const applyMode = () => {
			const { mode, short } = modeOf(window.innerWidth, window.innerHeight);
			root.dataset.mode = mode;
			if (short) root.dataset.short = '';
			else delete root.dataset.short;
			setMode(mode, short);
		};
		let stopScroll = () => {};
		let stop = () => {};
		// Start only after the first frame: the title shows immediately and the engine does not block LCP.
		const id = requestAnimationFrame(() => {
			applyMode();
			window.addEventListener('resize', applyMode);
			stopScroll = initScroll(root);
			stop = start();
			if (new URLSearchParams(location.search).get('qa') === '1') installQaHook(root);
		});
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener('resize', applyMode);
			stopScroll();
			stop();
			window.__landing = undefined;
		};
	}, []);

	return (
		<div id="final" data-mode={loop.mode} data-phase="intro" suppressHydrationWarning>
			{/* Skip link as the first tab stop, visible only on focus (landing.css .sprung) */}
			<a className="label skip-link" href="#content">
				{dict.skip}
			</a>
			<HeaderMask />
			<Header />
			<Hints />
			<main id="content" tabIndex={-1}>
				<Intro />
				<HowItWorks />
				<Depth />
				<Faq />
				<Finale />
				<Footer />
			</main>
			<Loader />
		</div>
	);
}

export function Landing({ locale }: { locale: Locale }) {
	return (
		<DictProvider locale={locale}>
			<LandingInner />
		</DictProvider>
	);
}
