import type { Locale } from '@/lib/locale';
import { de } from './de';
import { en } from './en';
import type { HomeDict } from './types';

/** Home page dictionary per language; usable from server and client modules. */
export const HOME_DICT: Record<Locale, HomeDict> = { de, en };
