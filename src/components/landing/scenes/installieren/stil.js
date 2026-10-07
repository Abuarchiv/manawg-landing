// Stile je Bild setzen, nur bei Änderung schreiben (billig, auch bei 30 Elementen je Bild).

const r2 = (v) => Math.round(v * 100) / 100;

/** Transform-Zeichenkette: Verschiebung (px) und Skalierung. */
export const tf = (x = 0, y = 0, sc = 1, sy = sc) =>
	x === 0 && y === 0 && sc === 1 && sy === 1
		? 'none'
		: `translate(${r2(x)}px,${r2(y)}px) scale(${r2(sc)},${r2(sy)})`;

/** Filter aus Unschärfe (px) und Helligkeit. */
export const fl = (blur = 0, hell = 1) =>
	blur < 0.05 && hell === 1 ? 'none' : `${blur >= 0.05 ? `blur(${r2(blur)}px) ` : ''}${hell !== 1 ? `brightness(${r2(hell)})` : ''}`.trim();

/**
 * o: { d: display ('' = aus, sonst Wert), o: Deckkraft, t: transform, f: filter, ... beliebige CSS-Eigenschaften }.
 * Zahlen für Deckkraft werden auf 3 Stellen gerundet. Fehlende Elemente werden übergangen.
 */
export function put(el, o) {
	if (!el) return;
	const c = el.__c || (el.__c = {});
	for (const k in o) {
		let v = o[k];
		let n = k;
		if (k === 'd') {
			n = 'display';
			v = v || 'none';
		} else if (k === 'o') {
			n = 'opacity';
			v = String(Math.round(v * 1000) / 1000);
		} else if (k === 't') n = 'transform';
		else if (k === 'f') n = 'filter';
		if (c[n] === v) continue;
		c[n] = v;
		el.style[n] = v;
	}
}
