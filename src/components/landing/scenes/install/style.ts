// Sets styles per frame and writes only on change (cheap, even with 30 elements per frame).

const r2 = (v: number): number => Math.round(v * 100) / 100;

/** Transform string: translation (px) and scale. */
export const tf = (x = 0, y = 0, sc = 1, sy = sc): string =>
	x === 0 && y === 0 && sc === 1 && sy === 1
		? 'none'
		: `translate(${r2(x)}px,${r2(y)}px) scale(${r2(sc)},${r2(sy)})`;

/** Filter from blur (px) and brightness. */
export const fl = (blur = 0, brightness = 1): string =>
	blur < 0.05 && brightness === 1
		? 'none'
		: `${blur >= 0.05 ? `blur(${r2(blur)}px) ` : ''}${brightness !== 1 ? `brightness(${r2(brightness)})` : ''}`.trim();

/** CSS properties that put sets under their own name (strings with unit). */
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
 * Style values for put: d display ('' = off, otherwise value), o opacity, t transform, f filter,
 * plus CSS properties under their own name.
 */
type Style = {
	d?: '' | 'block' | 'flex';
	o?: number;
	t?: string;
	f?: string;
} & { [K in CssProp]?: string };

type StyleName = 'display' | 'opacity' | 'filter' | CssProp;

/** Last written values per element. */
const lastWritten = new WeakMap<HTMLElement, Partial<Record<StyleName, string>>>();

/**
 * Opacity numbers are rounded to 3 decimals. Missing elements are skipped.
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
