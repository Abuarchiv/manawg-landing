import type { CSSProperties } from 'react';

const cache = new Map<string, CSSProperties>();

/** Inline style string of the template 1:1 as a React style (values stay strings, no px conversion). */
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
