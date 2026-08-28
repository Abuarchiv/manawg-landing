import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Seite nicht gefunden — ManaWG',
};

// craftsman-ignore: TS002 — Next.js App Router requires default export for pages
export default function NotFound() {
	return (
		<div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-4 text-center">
			<p className="text-6xl mb-4">🏠</p>
			<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Seite nicht gefunden</h1>
			<p className="text-[var(--text-2)] mb-6 max-w-sm">
				Die Seite existiert nicht — vielleicht hat jemand die Wohnungstür verwechselt.
			</p>
			<Link
				href="/"
				className="btn-modern inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
			>
				Zur Startseite
			</Link>
		</div>
	);
}
