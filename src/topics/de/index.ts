import type { Topic } from '../types.ts';
import { GUIDES_DE_HOME } from './guides-home.ts';
import { GUIDES_DE_MONEY } from './guides-money.ts';
import { GUIDES_DE_MOVING } from './guides-moving.ts';
import { OPEN_SOURCE_DE } from './open-source.ts';
import { TOPICS_DE_CORE } from './topics.ts';

/** All German topic pages, keyed by German slug. Same file split as ../en/. */
export const TOPICS_DE: Record<string, Topic> = {
	...TOPICS_DE_CORE,
	...GUIDES_DE_MONEY,
	...GUIDES_DE_HOME,
	...GUIDES_DE_MOVING,
	...OPEN_SOURCE_DE,
};
