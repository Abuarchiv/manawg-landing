// Kamera der Ende-Szene: der Ende-Raum (1280 x 800 mit Handy und Hand) wird in die Bühne eingepasst.

import { fitBox } from '../../core/canvas';

/** Einpassung des Ende-Raums 1280 x 800 in die Bühne (contain, höchstens 1,25, im sicheren Kasten zentriert). */
export function kamera(W, _H, safeH, _mode) {
	return fitBox(W, safeH, 1280, 800, 1.25);
}
