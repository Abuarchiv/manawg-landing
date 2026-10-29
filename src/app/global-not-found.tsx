import type { Metadata } from 'next';
import Link from 'next/link';
import { TEXT_LINK } from '@/lib/text-link';
import { THEME_SCRIPT } from '@/lib/theme';
import './globals.css';

export const metadata: Metadata = {
	title: 'Seite nicht gefunden bei ManaWG',
	description: 'Diese Seite wurde nicht gefunden. Über die Startseite gelangst du zu ManaWG.',
	robots: { index: false, follow: false },
};

const BUTTON =
	'inline-flex h-11 items-center rounded-[10px] bg-[var(--ink)] px-[22px] text-[15px] font-medium text-[var(--paper)] no-underline transition-colors duration-150 hover:bg-[rgb(var(--ink-rgb)/0.88)]';

// Sets the language before the first paint; the CSS below then shows the matching block. React leaves the
// lang attribute alone on hydration, unlike the hidden attributes of the blocks.
const SWITCH_TO_ENGLISH =
	"if (/^\\/en(\\/|$)/.test(location.pathname)) document.documentElement.lang = 'en-GB';";
const LANGUAGE_CSS =
	'html[lang="en-GB"] [data-not-found="de"], html:not([lang="en-GB"]) [data-not-found="en"] { display: none; }';

export default function NotFound() {
	return (
		<html lang="de" suppressHydrationWarning>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: static constant, sets theme before first paint
					dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
				/>
			</head>
			<body>
				<main className="min-h-dvh bg-[var(--bg-base)] flex flex-col items-center justify-center px-4 text-center">
					<img
						src="/manawg-mark-white-80.webp"
						data-invert=""
						alt=""
						width={72}
						height={60}
						className="mb-6 h-[60px] w-auto"
					/>
					<div data-not-found="de" className="flex flex-col items-center">
						<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Seite nicht gefunden</h1>
						<p className="text-[var(--text-2)] mb-6 max-w-sm">
							Unter dieser Adresse ist keine Seite verfügbar. Prüfe den Link oder gehe zur
							Startseite.
						</p>
						<Link href="/" className={BUTTON}>
							Zur Startseite
						</Link>
						{/* Without JavaScript the English visitor still gets a line of their own. */}
						<p lang="en-GB" className="mt-6 text-sm text-[var(--text-3)]">
							Page not found.{' '}
							<a href="/en" hrefLang="en" className={TEXT_LINK}>
								Go to the English home page
							</a>
							.
						</p>
					</div>
					<div data-not-found="en" lang="en-GB" className="flex flex-col items-center">
						<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Page not found</h1>
						<p className="text-[var(--text-2)] mb-6 max-w-sm">
							There is no page at this address. Check the link or go to the home page.
						</p>
						<a href="/en" className={BUTTON}>
							Go to the home page
						</a>
					</div>
					{/* One static 404 serves both language trees: under /en it switches to English before the first paint. */}
					<style>{LANGUAGE_CSS}</style>
					<script
						// biome-ignore lint/security/noDangerouslySetInnerHtml: fixed inline script, no user input
						dangerouslySetInnerHTML={{ __html: SWITCH_TO_ENGLISH }}
					/>
				</main>
			</body>
		</html>
	);
}
