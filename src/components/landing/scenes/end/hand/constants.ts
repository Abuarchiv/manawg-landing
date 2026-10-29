// Fixed numbers of the hands (halftone, dimensions of the pointing hand, ring). The shader sources in shader.ts insert them.

// Increase on every re-render: json and webp belong together and are cached together.
export const HAND_V = 8;
export const STEP = 1.25; // cell size in stage px (fine: the halftone reads as skin, not as a grid)
export const GAM = 0.85;
export const CON = 1.05;
export const RIM = 0.14; // strength of the rim light
export const EDW = 2.0; // offset in px of the four alpha samples for edge detection
export const EDV = 0.9; // brightness of edge dots (times light and alpha)
export const JIT = 0.08; // random per-dot tone jitter
export const EDGE_IN = 7; // holding hand, fingers on the right: at most this many px extend over the screen edge (tab bar stays clear)
export const EDGE_THUMB = 32; // thumb on the left rests slightly on the glass, as in the reference photo
export const PS = 0.54; // scale of the pointing hand (finger ~ 41 stage px, holding finger ~ 55)
export const ARM: readonly [number, number] = [1460, 1020]; // target of the pointing arm in the end space (landscape)
export const INK = 0.98; // #FAFAFA
export const INK_DARK = 0.04; // over the white screen: dark dots
export const TILES = ['lum', 'a', 'nx', 'ny', 'z'] as const;
export const RING_T = 0.8;
export const RING_N = 72;
