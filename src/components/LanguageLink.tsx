import { HTML_LANG, type Locale } from '@/lib/locale';
import type { CSSProperties } from 'react';

/**
 * Link to the same page in the other language. A plain anchor on purpose: German and English are
 * separate root layouts, so a full document load is intended.
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
			className={className}
			style={style}
		>
			{label ?? (to === 'en' ? 'English' : 'Deutsch')}
		</a>
	);
}
