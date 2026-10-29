'use client';

import { type CSSProperties, useEffect, useState } from 'react';
import type { Locale } from '@/lib/locale';
import type { ThemeChoice } from '@/lib/theme';

// Light, dark or system, as in the app. THEME_SCRIPT (lib/theme.ts) applies the choice; this only shows it.

const LABELS: Record<Locale, Record<ThemeChoice | 'aria', string>> = {
	de: { light: 'Hell', dark: 'Dunkel', system: 'System', aria: 'Darstellung' },
	en: { light: 'Light', dark: 'Dark', system: 'System', aria: 'Appearance' },
};
const CHOICES: ThemeChoice[] = ['light', 'dark', 'system'];

declare global {
	interface Window {
		__theme?: (choice: ThemeChoice) => void;
	}
}

export function ThemeSwitch({
	locale,
	className,
	style,
}: {
	locale: Locale;
	className?: string;
	style?: CSSProperties;
}) {
	const [choice, setChoice] = useState<ThemeChoice | null>(null);
	useEffect(() => {
		setChoice((document.documentElement.dataset.themeChoice as ThemeChoice) ?? 'system');
	}, []);
	const t = LABELS[locale];
	return (
		<fieldset aria-label={t.aria} className={className} style={style}>
			{CHOICES.map((c) => (
				<button
					key={c}
					type="button"
					aria-pressed={choice === c}
					onClick={() => {
						window.__theme?.(c);
						setChoice(c);
					}}
				>
					{t[c]}
				</button>
			))}
		</fieldset>
	);
}
