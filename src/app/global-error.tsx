'use client';

import { useEffect } from 'react';

export default function GlobalError({
	error,
	reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error('[error]', error, { boundary: 'global' });
	}, [error]);

	return (
		<html lang="de" suppressHydrationWarning>
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
				<h2 style={{ fontSize: 24, fontWeight: 600 }}>Etwas ist schiefgelaufen</h2>
				<p style={{ marginTop: 8, opacity: 0.7 }}>Bitte lade die Seite neu.</p>
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
					Erneut versuchen
				</button>
			</body>
		</html>
	);
}
