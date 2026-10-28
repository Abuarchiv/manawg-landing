'use client';

import { useEffect } from 'react';
import './landing.css';
import { startEntschluesseln } from './core/entschluesseln';
import { loop, modeOf, qa, setMode, start } from './core/loop';
import { initScroll, sectionBox } from './core/scroll';
import { Finale } from './scenes/finale/Finale';
import { FlutBand } from './scenes/flutband/FlutBand';
import { Fragen } from './scenes/fragen/Fragen';
import { Fusszeile } from './scenes/fusszeile/Fusszeile';
import { Installieren } from './scenes/installieren/Installieren';
import { Intro } from './scenes/intro/Intro';
import { live } from './scenes/intro/stage';
import { SoGehts } from './scenes/sogehts/SoGehts';
import { Tiefe } from './scenes/tiefe/Tiefe';
import { Zerfall } from './scenes/zerfall/Zerfall';
import { Hinweise } from './shell/Hinweise';
import { Kopf } from './shell/Kopf';
import { KopfMaske } from './shell/KopfMaske';
import { Lader } from './shell/Lader';

// Wurzel der Landing: Kopf und Hinweise fest am Fenster, danach der Inhalt im normalen Dokumentfluss,
// zuletzt der Lader. Dokument-Scroll, keine skalierte Bühne. Szenen melden sich selbst bei der
// Schleife an (core/loop.js), die Intro-Bühne hängt an der Zeitachse (scenes/intro).

declare global {
	interface Window {
		__landing?: Record<string, unknown> | undefined;
	}
}

// Nur lesender Haken für die Prüfwerkzeuge (?qa=1), ohne Einfluss auf das Verhalten.
function qaHaken(root: HTMLElement) {
	window.__landing = {
		P: () => live.stage?.state.P ?? 0,
		s: () => live.stage?.state.s ?? 0,
		phase: () => root.dataset.phase ?? '',
		yForP: (P: number) => live.stage?.yForP(P) ?? 0,
		section: (id: string) => sectionBox(id),
		dbg: qa,
		get bereit() {
			return live.stage?.state.bereit ?? false;
		},
	};
}

export function Landing() {
	useEffect(() => {
		const root = document.getElementById('final') as HTMLElement;
		const applyMode = () => {
			const { mode, flach } = modeOf(window.innerWidth, window.innerHeight);
			root.dataset.mode = mode;
			if (flach) root.dataset.flach = '';
			else delete root.dataset.flach;
			setMode(mode, flach);
		};
		let stopScroll = () => {};
		let stop = () => {};
		let stopSchrift = () => {};
		// Erst nach dem ersten Bild starten: der Titel steht dann sofort, die Engine blockiert LCP nicht.
		const id = requestAnimationFrame(() => {
			applyMode();
			window.addEventListener('resize', applyMode);
			stopScroll = initScroll(root);
			stop = start();
			stopSchrift = startEntschluesseln(root);
			if (new URLSearchParams(location.search).get('qa') === '1') qaHaken(root);
		});
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener('resize', applyMode);
			stopScroll();
			stop();
			stopSchrift();
			window.__landing = undefined;
		};
	}, []);

	return (
		<div id="final" data-mode={loop.mode} data-phase="intro" suppressHydrationWarning>
			{/* Sprunglink als erster Tab-Stopp, sichtbar nur bei Fokus (landing.css .sprung) */}
			<a className="label sprung" href="#inhalt">
				Zum Inhalt springen
			</a>
			<KopfMaske />
			<Kopf />
			<Hinweise />
			<main id="inhalt" tabIndex={-1}>
				<Intro />
				<FlutBand />
				<SoGehts />
				<Tiefe />
				<Installieren />
				<Fragen />
				<Finale />
				<Fusszeile />
			</main>
			<Zerfall />
			<Lader />
		</div>
	);
}
