import type { Topic } from '../types.ts';
import { GUIDES_DE_MONEY } from './guides-money.ts';
import { GUIDES_DE } from './guides.ts';
import { OPEN_SOURCE_DE } from './open-source.ts';
import { TOPICS_DE_CORE } from './topics.ts';

/** All German topic pages, keyed by German slug. */
export const TOPICS_DE: Record<string, Topic> = {
	...TOPICS_DE_CORE,
	...GUIDES_DE,
	...GUIDES_DE_MONEY,
	...OPEN_SOURCE_DE,
};
