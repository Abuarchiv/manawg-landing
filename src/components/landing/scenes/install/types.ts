// Shared types of the install flows (iPhone, Android, desktop).

/** Tab: 0 iPhone, 1 Android, 2 desktop. */
export type TabIndex = 0 | 1 | 2;

/** Device elements by their data-k. put skips missing entries. */
export type Elements = Record<string, HTMLElement>;

/** A finger tap (phone) or click (desktop): time, target in device units, g = group (same step). */
export interface Tap {
	readonly t: number;
	readonly x: number;
	readonly y: number;
	readonly g: number;
}

/** Playback plan of a device. The state is a pure function of time. */
export interface PlaybackPlan {
	/** Loop length in seconds. */
	readonly loop: number;
	/** Scale from device to tap indicator. */
	readonly ks: number;
	/** Start of the steps (resting states, a tap is about to happen). */
	readonly jumps: readonly number[];
	/** Still frames for reduced motion: resting position per step. */
	readonly still: readonly number[];
	readonly taps: readonly Tap[];
	render(t: number, E: Elements): void;
}
