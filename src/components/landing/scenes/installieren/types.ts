// Gemeinsame Typen der Installationsabläufe (iPhone, Android, Rechner).

/** Reiter: 0 iPhone, 1 Android, 2 Rechner. */
export type TabIndex = 0 | 1 | 2;

/** Elemente des Geräts nach ihrem data-k. Fehlende Einträge werden von put übergangen. */
export type Elemente = Record<string, HTMLElement>;

/** Ein Fingertipp (Handy) oder Klick (Rechner): Zeit, Ziel in Geräteeinheiten, g = Gruppe (gleicher Schritt). */
export interface Tipp {
	readonly t: number;
	readonly x: number;
	readonly y: number;
	readonly g: number;
}

/** Ablaufplan eines Geräts. Der Zustand ist eine reine Funktion der Zeit. */
export interface Ablaufplan {
	/** Länge der Schleife in Sekunden. */
	readonly loop: number;
	/** Maßstab Gerät -> Tipp-Anzeige. */
	readonly ks: number;
	/** Beginn der Schritte (Ruhezustände, ein Tipp steht kurz bevor). */
	readonly sprung: readonly number[];
	/** Standbilder für reduzierte Bewegung: Ruhelage je Schritt. */
	readonly still: readonly number[];
	readonly taps: readonly Tipp[];
	render(t: number, E: Elemente): void;
}
