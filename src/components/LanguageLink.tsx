'use client';

import type { CSSProperties } from 'react';
import { localeCookie } from '@/lib/language-redirect';
import { HTML_LANG, type Locale } from '@/lib/locale';

/**
 * Link to the same page in the other language. A plain anchor on purpose: German and English are
 * separate root layouts, so a full document load is intended. The click stores the choice, so the
 * proxy keeps the visitor on the chosen language even when the browser sends no Referer.
 */
export function LanguageLink({
	to,
	href,
	label,
	className,
	style,
}: {
	/** Language the link leads to. */
	to: Locale;
	href: string;
	label?: string;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<a
			href={href}
			hrefLang={to}
			lang={HTML_LANG[to]}
			data-lang-link=""
			onClick={() => {
				// biome-ignore lint/suspicious/noDocumentCookie: Firefox has no Cookie Store API.
				document.cookie = localeCookie(to, location.protocol === 'https:');
			}}
			className={className}
			style={style}
		>
			{label ?? (to === 'en' ? 'English' : 'Deutsch')}
		</a>
	);
}
