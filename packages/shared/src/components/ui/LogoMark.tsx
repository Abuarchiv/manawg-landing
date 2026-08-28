import { BRAND } from '../../lib/brand';

interface LogoMarkProps {
	size?: number;
	tile?: boolean;
	className?: string;
	tileFill?: string;
	markFill?: string;
	radius?: number;
}

/**
 * Brand mark — Schlüsselloch/Person hybrid ("Schlüssel zur WG").
 * Tile pulls from --accent (forest light, mint dark); mark is cut out with
 * --bg-base so the negative space matches the page surface exactly — no
 * cream, no off-color. Explicit tile/markFill props win for fixed colorways.
 */
export function LogoMark({
	size = 40,
	tile = true,
	className,
	tileFill = 'var(--accent)',
	markFill = 'var(--bg-base)',
	radius = 44,
}: LogoMarkProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 200 200"
			role="img"
			aria-label={BRAND.wordmark}
			className={className}
		>
			{tile && <rect width="200" height="200" rx={radius} fill={tileFill} />}
			<path
				d="M 36 20 h 128 a 22 22 0 0 1 22 22 v 116 a 22 22 0 0 1 -22 22 h -128 a 22 22 0 0 1 -22 -22 v -116 a 22 22 0 0 1 22 -22 z M 100 70 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 z M 86 96 l -8 44 h 44 l -8 -44 z"
				fill={markFill}
				fillRule="evenodd"
			/>
		</svg>
	);
}

interface BrandLockupProps {
	size?: number;
	className?: string;
	wordmarkClassName?: string;
}

/** Horizontal lockup: mark + wordmark. Drop-in replacement for landing nav. */
export function BrandLockup({
	size = 28,
	className = 'flex items-center gap-2',
	wordmarkClassName = 'text-xl font-semibold tracking-[-0.02em] text-[var(--text-1)]',
}: BrandLockupProps) {
	return (
		<span className={className}>
			<LogoMark size={size} radius={10} />
			<span className={wordmarkClassName}>{BRAND.wordmark}</span>
		</span>
	);
}
