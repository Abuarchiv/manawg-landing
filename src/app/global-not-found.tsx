import { TEXT_LINK } from '@/lib/text-link';
import { THEME_SCRIPT } from '@/lib/theme';
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
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: static constant, sets the theme before the first paint
					dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
				/>
			</head>
			<body>
				<main className="min-h-dvh bg-[var(--bg-base)] flex flex-col items-center justify-center px-4 text-center">
					<img
						src="/manawg-mark-weiss-80.webp"
						data-invert=""
						alt=""
						width={72}
						height={60}
						className="mb-6 h-[60px] w-auto"
					/>
					<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Seite nicht gefunden</h1>
					<p className="text-[var(--text-2)] mb-6 max-w-sm">
						Unter dieser Adresse ist keine Seite verfügbar. Prüfe den Link oder gehe zur Startseite.
					</p>
					<Link
						href="/"
						className="inline-flex h-11 items-center rounded-[10px] bg-[var(--ink)] px-[22px] text-[15px] font-medium text-[var(--paper)] no-underline transition-colors duration-150 hover:bg-[rgb(var(--ink-rgb)/0.88)]"
					>
						Zur Startseite
					</Link>
					{/* One 404 serves both language trees, so the English visitor gets a line of their own. */}
					<p lang="en-GB" className="mt-6 text-sm text-[var(--text-3)]">
						Page not found.{' '}
						<a href="/en" hrefLang="en" className={TEXT_LINK}>
							Go to the English home page
						</a>
						.
					</p>
				</main>
			</body>
		</html>
	);
}
