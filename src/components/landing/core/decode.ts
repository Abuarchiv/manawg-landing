// Überschriften und Etiketten mit data-entschluesseln entschlüsseln sich einmal, sobald sie ins Bild kommen:
// jedes Zeichen läuft erst als Mono-Zeichen und rastet dann ein, grob von vorn nach hinten (dasselbe Motiv
// wie die FAQ-Antworten). Nur die Textknoten ändern sich, am Ende steht wieder der Originaltext. Ohne JS und
// bei reduzierter Bewegung bleibt der Text, wie er ist.

export const GLYPHS = '#%&*+=/<>|01';
const DURATION = 900; // ms

function run(el: HTMLElement): () => void {
	const nodes: Text[] = [];
	const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
	while (w.nextNode()) nodes.push(w.currentNode as Text);
	const text = nodes.map((n) => [...n.data]);
	const total = text.reduce((a, t) => a + t.length, 0);
	// Einrastzeit je Zeichen: Lage im Text plus Streuung
	const settleAt = Array.from(
		{ length: total },
		(_, i) => (i / total) * 0.65 + Math.random() * 0.35,
	);
	let raf = 0;
	const t0 = performance.now();
	const f = (now: number) => {
		const p = (now - t0) / DURATION;
		let i = 0;
		nodes.forEach((n, j) => {
			n.data = (text[j] ?? [])
				.map((c) => {
					const settled = p >= (settleAt[i++] ?? 0) || /\s/.test(c);
					return settled ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
				})
				.join('');
		});
		if (p < 1) raf = requestAnimationFrame(f);
	};
	raf = requestAnimationFrame(f);
	f(t0);
	return () => {
		cancelAnimationFrame(raf);
		nodes.forEach((n, j) => {
			n.data = (text[j] ?? []).join('');
		});
	};
}

export function startDecode(root: HTMLElement): () => void {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
	const stops: (() => void)[] = [];
	const io = new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (!e.isIntersecting) continue;
			io.unobserve(e.target);
			stops.push(run(e.target as HTMLElement));
		}
	});
	for (const el of root.querySelectorAll('[data-entschluesseln]')) io.observe(el);
	return () => {
		io.disconnect();
		for (const s of stops) s();
	};
}
