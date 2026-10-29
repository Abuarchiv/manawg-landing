'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/locale';

const TEXT: Record<Locale, { title: string; hint: string; retry: string }> = {
	de: {
		title: 'Die Seite konnte nicht angezeigt werden.',
		hint: 'Bitte versuche es erneut.',
		retry: 'Erneut versuchen',
	},
	en: { title: 'This page could not be shown.', hint: 'Please try again.', retry: 'Try again' },
};

/** Error boundary content of a language's root layout. */
export function ErrorView({
	locale,
	error,
	reset,
}: {
	locale: Locale;
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = TEXT[locale];
	useEffect(() => {
		// console.error goes to the Vercel platform log; there is no third-party error tracker.
		console.error('[error]', error, { boundary: 'root' });
	}, [error]);

	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
			<h2 className="text-2xl font-semibold text-(--text-1)">{t.title}</h2>
			<p className="mt-2 text-(--text-2)">{t.hint}</p>

			{process.env.NODE_ENV === 'development' && (
				<pre className="mt-4 text-xs text-(--text-3) max-w-2xl overflow-auto">{error.message}</pre>
			)}

			<button
				type="button"
				onClick={() => reset()}
				className="mt-6 min-h-[44px] rounded-lg border border-current px-4 py-2 text-(--text-1) transition-colors hover:bg-[rgb(var(--ink-rgb)/0.04)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--accent)"
			>
				{t.retry}
			</button>
		</div>
	);
}
