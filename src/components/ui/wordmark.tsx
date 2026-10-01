/**
 * Plain text wordmark for the marketing site's own nav.
 *
 * Deliberately not a re-creation of the app's logo/brand system — the two
 * sites are getting fully independent visual identities. This is a
 * placeholder until the site's own redesign lands.
 */
export function Wordmark({
	className = 'text-xl font-semibold tracking-[-0.02em] text-[var(--text-1)]',
}: { className?: string }) {
	return <span className={className}>manawg</span>;
}
