import type { Topic } from '../types.ts';
import { GUIDES_EN_HOME } from './guides-home.ts';
import { GUIDES_EN_MONEY } from './guides-money.ts';
import { GUIDES_EN_MOVING } from './guides-moving.ts';
import { TOPICS_EN_CORE } from './topics.ts';

/** All English topic pages, keyed by English slug. */
export const TOPICS_EN: Record<string, Topic> = {
	...TOPICS_EN_CORE,
	...GUIDES_EN_MONEY,
	...GUIDES_EN_HOME,
	...GUIDES_EN_MOVING,
};
