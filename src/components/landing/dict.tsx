'use client';

import { HOME_DICT } from '@/content/home';
import type { HomeDict, Lines } from '@/content/home/types';
import type { Locale } from '@/lib/locale';
import { Fragment, type ReactNode, createContext, useContext } from 'react';

// Language of the landing: the provider sits at the root of <Landing>, every component reads its strings
// with useDict(). Canvas modules never read the context; they get their words through registration calls.

const Ctx = createContext<{ locale: Locale; dict: HomeDict } | null>(null);

export function DictProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
	return <Ctx.Provider value={{ locale, dict: HOME_DICT[locale] }}>{children}</Ctx.Provider>;
}

function useCtx() {
	const v = useContext(Ctx);
	if (!v) throw new Error('useDict: missing <DictProvider>');
	return v;
}

export const useDict = (): HomeDict => useCtx().dict;
export const useLocale = (): Locale => useCtx().locale;

/** Lines of one heading, joined with <br />. */
export function BrLines({ lines }: { lines: Lines }) {
	return lines.map((line, i) => (
		<Fragment key={i}>
			{i > 0 && <br />}
			{line}
		</Fragment>
	));
}
