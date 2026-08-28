/**
 * ManaWG brand constants.
 *
 * The mark is monochrome cream-on-ink and stays stable across light/dark themes —
 * unlike app surfaces which flip via CSS variables. Re-use these everywhere the
 * brand identity appears so a future re-tune is a single-file change.
 */
export const BRAND = {
	/** Warm near-black used as logo tile + app meta theme color (dark). */
	ink: '#1a1f1c',
	/** Warm cream used as logo mark + app meta theme color (light). */
	paper: '#f7f3ec',
	/** Forest accent for in-app highlights (light mode). */
	forest: '#2f5d4a',
	/** Mint accent for in-app highlights (dark mode). */
	mint: '#84e1bc',
	/** Product wordmark — render in `font-sans font-semibold tracking-[-0.02em]`. */
	wordmark: 'manawg',
	/** Brand narrative tagline. */
	tagline: 'Dein Schlüssel zur WG.',
} as const;
