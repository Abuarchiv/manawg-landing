// Feste Zahlen der Hände (Halbton, Maße der Zeigehand, Ring). Die Shader-Texte in shader.ts setzen sie ein.

// Bei jedem neuen Render erhöhen: json und webp gehören zusammen und werden gemeinsam gecacht.
export const HAND_V = 8;
export const STEP = 1.25; // Zellgröße in Bühnen-px (fein: Halbton liest als Haut, nicht als Raster)
export const GAM = 0.85;
export const CON = 1.05;
export const RIM = 0.14;
export const EDW = 2.0;
export const EDV = 0.9;
export const JIT = 0.08;
export const EDGE_IN = 7; // Haltehand, Finger rechts: höchstens so viele px ragen über den Bildschirmrand (Tab-Leiste bleibt frei)
export const EDGE_THUMB = 32; // Daumen links liegt wie im Referenzfoto leicht aufs Glas
export const PS = 0.54; // Maßstab der Zeigehand (Finger ~ 41 Bühnen-px, Haltefinger ~ 55)
export const ARM: readonly [number, number] = [1460, 1020]; // Ziel des Zeigearms im Ende-Raum (quer)
export const INK = 0.98; // #FAFAFA
export const INK_DARK = 0.04; // über dem weißen Bildschirm: dunkle Punkte
export const TILES = ['lum', 'a', 'nx', 'ny', 'z'] as const;
export const RING_T = 0.8;
export const RING_N = 72;
