import { type CSSProperties, type ElementType, type KeyboardEvent, useState } from 'react';

const cache = new Map<string, CSSProperties>();

/** Inline-Style-String der Vorlage 1:1 als React-Style (Werte bleiben Strings, keine px-Umrechnung). */
export function css(s: string): CSSProperties {
	let r = cache.get(s);
	if (!r) {
		const o: Record<string, string> = {};
		for (const d of s.split(';')) {
			const i = d.indexOf(':');
			if (i < 0) continue;
			const n = d.slice(0, i).trim();
			if (!n) continue;
			o[n.startsWith('--') ? n : n.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = d
				.slice(i + 1)
				.trim();
		}
		r = o as CSSProperties;
		cache.set(s, r);
	}
	return r;
}

/** style-hover / style-active der Vorlage: Stil = Basis + Hover + Active (Semantik aus support.js). */
export function Dc({
	as: Tag = 'div',
	style,
	hover,
	active,
	...rest
}: {
	as?: ElementType;
	style: string;
	hover?: string;
	active?: string;
	// biome-ignore lint/suspicious/noExplicitAny: beliebige Element-Props
	[k: string]: any;
}) {
	const [h, setH] = useState(0);
	const [a, setA] = useState(0);
	const ev: Record<string, () => void> = {};
	if (hover) {
		ev.onPointerEnter = () => setH(1);
		ev.onPointerLeave = () => {
			setH(0);
			setA(0);
		};
	}
	if (active) {
		ev.onPointerDown = () => setA(1);
		ev.onPointerUp = () => setA(0);
		ev.onPointerCancel = () => setA(0);
	}
	const s = style + (h && hover ? `;${hover}` : '') + (a && active ? `;${active}` : '');
	return <Tag {...rest} {...ev} style={css(s)} />;
}

/** Klickbare div wie ein Button bedienbar machen (Enter/Leertaste), Box bleibt unverändert. */
export function press(f: () => void) {
	return {
		role: 'button',
		tabIndex: 0,
		onClick: f,
		onKeyDown: (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				if (e.key === ' ') e.preventDefault();
				f();
			}
		},
	};
}
