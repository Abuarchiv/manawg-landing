'use client';

import { useEffect, useSyncExternalStore } from 'react';

const noSubscription = () => () => {};

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('[error]', error, { boundary: 'global' });
	}, [error]);

	// The root layouts are gone when this renders, so the language comes from the path. The server
	// snapshot is German, which keeps hydration consistent; the client switches to English right after.
	const en = useSyncExternalStore(
		noSubscription,
		() => /^\/en(\/|$)/.test(location.pathname),
		() => false,
	);
	return (
		<html lang={en ? 'en-GB' : 'de'} suppressHydrationWarning>
			<body
				style={{
					fontFamily: 'system-ui',
					padding: 32,
					textAlign: 'center',
					minHeight: '100dvh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<h2 style={{ fontSize: 24, fontWeight: 600 }}>
					{en ? 'This page could not be shown.' : 'Die Seite konnte nicht angezeigt werden.'}
				</h2>
				<p style={{ marginTop: 8, opacity: 0.7 }}>
					{en ? 'Please try again.' : 'Bitte versuche es erneut.'}
				</p>
				<button
					type="button"
					onClick={() => reset()}
					style={{
						marginTop: 24,
						padding: '8px 16px',
						borderRadius: 8,
						border: '1px solid currentColor',
						cursor: 'pointer',
					}}
				>
					{en ? 'Try again' : 'Erneut versuchen'}
				</button>
			</body>
		</html>
	);
}
