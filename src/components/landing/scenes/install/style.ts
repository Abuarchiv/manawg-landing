// Stile je Bild setzen, nur bei Änderung schreiben (billig, auch bei 30 Elementen je Bild).

const r2 = (v: number): number => Math.round(v * 100) / 100;

/** Transform-Zeichenkette: Verschiebung (px) und Skalierung. */
export const tf = (x = 0, y = 0, sc = 1, sy = sc): string =>
	x === 0 && y === 0 && sc === 1 && sy === 1
		? 'none'
		: `translate(${r2(x)}px,${r2(y)}px) scale(${r2(sc)},${r2(sy)})`;

/** Filter aus Unschärfe (px) und Helligkeit. */
export const fl = (blur = 0, brightness = 1): string =>
	blur < 0.05 && brightness === 1
		? 'none'
		: `${blur >= 0.05 ? `blur(${r2(blur)}px) ` : ''}${brightness !== 1 ? `brightness(${r2(brightness)})` : ''}`.trim();

/** CSS-Eigenschaften, die put direkt unter ihrem Namen setzt (Zeichenketten mit Einheit). */
type CssProp =
	| 'transform'
	| 'top'
	| 'left'
	| 'width'
	| 'height'
	| 'maxWidth'
	| 'paddingLeft'
	| 'borderRadius'
	| 'background';

/**
 * Stilwerte für put: d display ('' = aus, sonst Wert), o Deckkraft, t transform, f filter,
 * dazu CSS-Eigenschaften unter ihrem Namen.
 */
export type Style = {
	d?: '' | 'block' | 'flex';
	o?: number;
	t?: string;
	f?: string;
} & { [K in CssProp]?: string };

type StyleName = 'display' | 'opacity' | 'filter' | CssProp;

/** Zuletzt geschriebene Werte je Element. */
const lastWritten = new WeakMap<HTMLElement, Partial<Record<StyleName, string>>>();

/**
 * Zahlen für Deckkraft werden auf 3 Stellen gerundet. Fehlende Elemente werden übergangen.
 */
export function put(el: HTMLElement | null | undefined, o: Style): void {
	if (!el) return;
	let c = lastWritten.get(el);
	if (!c) {
		c = {};
		lastWritten.set(el, c);
	}
	for (const [k, w] of Object.entries(o) as [keyof Style, string | number][]) {
		let n: StyleName;
		let v: string;
		if (k === 'd') {
			n = 'display';
			v = String(w || 'none');
		} else if (k === 'o') {
			n = 'opacity';
			v = String(Math.round(Number(w) * 1000) / 1000);
		} else {
			n = k === 't' ? 'transform' : k === 'f' ? 'filter' : k;
			v = String(w);
		}
		if (c[n] === v) continue;
		c[n] = v;
		el.style[n] = v;
	}
}
