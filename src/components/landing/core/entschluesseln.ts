// Überschriften und Etiketten mit data-entschluesseln entschlüsseln sich einmal, sobald sie ins Bild kommen:
// jedes Zeichen läuft erst als Mono-Zeichen und rastet dann ein, grob von vorn nach hinten (dasselbe Motiv
// wie die FAQ-Antworten). Nur die Textknoten ändern sich, am Ende steht wieder der Originaltext. Ohne JS und
// bei reduzierter Bewegung bleibt der Text, wie er ist.

export const ZEICHEN = '#%&*+=/<>|01';
const DAUER = 900; // ms

function lauf(el: HTMLElement): () => void {
	const knoten: Text[] = [];
	const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
	while (w.nextNode()) knoten.push(w.currentNode as Text);
	const text = knoten.map((n) => [...n.data]);
	const summe = text.reduce((a, t) => a + t.length, 0);
	// Einrastzeit je Zeichen: Lage im Text plus Streuung
	const ab = Array.from({ length: summe }, (_, i) => (i / summe) * 0.65 + Math.random() * 0.35);
	let raf = 0;
	const t0 = performance.now();
	const f = (now: number) => {
		const p = (now - t0) / DAUER;
		let i = 0;
		knoten.forEach((n, j) => {
			n.data = (text[j] ?? [])
				.map((c) => {
					const fest = p >= (ab[i++] ?? 0) || /\s/.test(c);
					return fest ? c : ZEICHEN[Math.floor(Math.random() * ZEICHEN.length)];
				})
				.join('');
		});
		if (p < 1) raf = requestAnimationFrame(f);
	};
	raf = requestAnimationFrame(f);
	f(t0);
	return () => {
		cancelAnimationFrame(raf);
		knoten.forEach((n, j) => {
			n.data = (text[j] ?? []).join('');
		});
	};
}

export function startEntschluesseln(root: HTMLElement): () => void {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
	const stopps: (() => void)[] = [];
	const io = new IntersectionObserver((eintraege) => {
		for (const e of eintraege) {
			if (!e.isIntersecting) continue;
			io.unobserve(e.target);
			stopps.push(lauf(e.target as HTMLElement));
		}
	});
	for (const el of root.querySelectorAll('[data-entschluesseln]')) io.observe(el);
	return () => {
		io.disconnect();
		for (const s of stopps) s();
	};
}
