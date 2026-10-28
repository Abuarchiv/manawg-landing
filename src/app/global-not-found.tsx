import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
	title: 'Seite nicht gefunden bei ManaWG',
	description: 'Diese Seite wurde nicht gefunden. Über die Startseite gelangst du zu ManaWG.',
	robots: { index: false, follow: false },
};

export default function NotFound() {
	return (
		<html lang="de" suppressHydrationWarning>
			<body>
				<main className="min-h-dvh bg-[var(--bg-base)] flex flex-col items-center justify-center px-4 text-center">
					<img
						src="/manawg-mark.svg"
						alt=""
						width={72}
						height={60}
						className="mb-6 h-[60px] w-auto"
						style={{ filter: 'invert(1)' }}
					/>
					<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Seite nicht gefunden</h1>
					<p className="text-[var(--text-2)] mb-6 max-w-sm">
						Unter dieser Adresse ist keine Seite verfügbar. Prüfe den Link oder gehe zur Startseite.
					</p>
					<Link
						href="/"
						className="inline-flex h-11 items-center rounded-[10px] bg-[#fafafa] px-[22px] text-[15px] font-medium text-[#0a0a0a] no-underline transition-colors duration-150 hover:bg-[#e5e5e5]"
					>
						Zur Startseite
					</Link>
				</main>
			</body>
		</html>
	);
}
