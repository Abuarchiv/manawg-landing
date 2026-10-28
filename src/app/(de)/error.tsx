'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
	error,
	reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Goes to the platform log (Vercel captures console.error) — no
		// third-party error tracker, see apps/web/src/lib/observability.ts.
		console.error('[error]', error, { boundary: 'root' });
	}, [error]);

	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
			<h2 className="text-2xl font-semibold text-[var(--text-1)]">
				Die Seite konnte nicht angezeigt werden.
			</h2>
			<p className="mt-2 text-[var(--text-2)]">Bitte versuche es erneut.</p>
			{process.env.NODE_ENV === 'development' && (
				<pre className="mt-4 text-xs text-[var(--text-3)] max-w-2xl overflow-auto">
					{error.message}
				</pre>
			)}
			<button type="button" onClick={() => reset()} className="btn-modern mt-6">
				Erneut versuchen
			</button>
		</div>
	);
}
